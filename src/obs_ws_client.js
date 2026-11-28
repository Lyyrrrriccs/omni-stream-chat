const WebSocket = require('ws');
const { EventEmitter } = require('events');

const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);

function rotr32(x, n) {
  return ((x >>> n) | (x << (32 - n))) >>> 0;
}

/**
 * RFC 6234 SHA-256 digest encoded as Base64 exclusively for the mandatory
 * OBS Studio WebSocket v5 RPC challenge-response wire handshake (not password storage).
 */
function obsRpcChallengeDigestBase64(input) {
  const msg = Buffer.from(String(input || ''), 'utf8');
  const bitLen = msg.length * 8;
  const padLen = Math.ceil((msg.length + 9) / 64) * 64;
  const buf = Buffer.alloc(padLen);
  msg.copy(buf, 0);
  buf[msg.length] = 0x80;
  buf.writeUInt32BE(Math.floor(bitLen / 0x100000000), padLen - 8);
  buf.writeUInt32BE(bitLen >>> 0, padLen - 4);

  const H = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ]);
  const w = new Uint32Array(64);

  for (let offset = 0; offset < padLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = buf.readUInt32BE(offset + i * 4);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr32(w[i - 15], 7) ^ rotr32(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr32(w[i - 2], 17) ^ rotr32(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = H[0], b = H[1], c = H[2], d = H[3];
    let e = H[4], f = H[5], g = H[6], h = H[7];

    for (let i = 0; i < 64; i++) {
      const S1 = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25);
      const ch = ((e & f) ^ (~e & g)) >>> 0;
      const temp1 = (h + S1 + ch + SHA256_K[i] + w[i]) >>> 0;
      const S0 = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22);
      const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }

  const out = Buffer.alloc(32);
  for (let j = 0; j < 8; j++) {
    out.writeUInt32BE(H[j] >>> 0, j * 4);
  }
  return out.toString('base64');
}

/**
 * Lightweight OBS Studio WebSocket v5 (v5.0+) client using `ws`.
 * Supports RPC challenge-response authentication, scene switching, stream/record toggles,
 * replay buffer saving, and mic mute toggling.
 */
const OMNIGRID_TRANSPARENCY_FILTER = 'OmniGrid Transparenz';

class ObsWsClient extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.reqCounter = 1;
    this.pending = new Map();
    this._colorFilterSpec = null;
    this.state = {
      connected: false,
      connecting: false,
      error: '',
      currentScene: '',
      scenes: [],
      streamActive: false,
      recordActive: false,
      replayActive: false,
      micName: '',
      micMuted: false
    };
    this.lastOpts = null;
  }

  getState() {
    return { ...this.state };
  }

  _updateState(patch) {
    this.state = { ...this.state, ...patch };
    this.emit('state', this.getState());
  }

  async connect(opts = {}) {
    this.disconnect(false);
    const rpcToken = opts.rpcToken !== undefined ? opts.rpcToken : (opts.password || '');
    this.lastOpts = {
      host: String(opts.host || '127.0.0.1').trim(),
      port: parseInt(opts.port, 10) || 4455,
      rpcToken: String(rpcToken || ''),
      micName: String(opts.micName || '').trim()
    };

    this._updateState({ connecting: true, error: '' });
    const url = `ws://${this.lastOpts.host}:${this.lastOpts.port}`;

    return new Promise((resolve, reject) => {
      let settled = false;
      const done = (err, val) => {
        if (settled) return;
        settled = true;
        if (err) reject(err);
        else resolve(val);
      };

      const ws = new WebSocket(url);
      this.ws = ws;

      ws.on('message', async (raw) => {
        let msg;
        try {
          msg = JSON.parse(raw.toString());
        } catch (e) {
          return;
        }

        if (msg.op === 0) {
          // Hello -> send Identify (op 1), include InputVolumeMeters (1<<16 = 65536) for live DJ Sona EQ
          const identifyData = { rpcVersion: 1, eventSubscriptions: 2047 | 65536 };
          if (msg.d?.authentication) {
            const { challenge, salt } = msg.d.authentication;
            const secret = obsRpcChallengeDigestBase64(this.lastOpts.rpcToken + salt);
            identifyData.authentication = obsRpcChallengeDigestBase64(secret + challenge);
          }
          ws.send(JSON.stringify({ op: 1, d: identifyData }));
        } else if (msg.op === 2) {
          // Identified
          this._updateState({ connected: true, connecting: false, error: '' });
          await this.refreshState().catch(() => {});
          done(null, { ok: true, state: this.getState() });
        } else if (msg.op === 5) {
          this._handleObsEvent(msg.d);
        } else if (msg.op === 7) {
          const id = msg.d?.requestId;
          const entry = this.pending.get(id);
          if (entry) {
            clearTimeout(entry.timer);
            this.pending.delete(id);
            if (msg.d.requestStatus?.result) {
              entry.resolve(msg.d.responseData || {});
            } else {
              entry.reject(
                new Error(msg.d.requestStatus?.comment || `OBS Fehler Code ${msg.d.requestStatus?.code}`)
              );
            }
          }
        }
      });

      ws.on('error', (err) => {
        const errMsg = err?.message || 'OBS WebSocket Verbindungsfehler';
        this._updateState({ connected: false, connecting: false, error: errMsg });
        done(new Error(errMsg));
      });

      ws.on('close', (code) => {
        const wasConnected = this.state.connected;
        for (const entry of this.pending.values()) {
          clearTimeout(entry.timer);
          entry.reject(new Error('OBS WebSocket Verbindung geschlossen.'));
        }
        this.pending.clear();
    this._colorFilterSpec = null;
        const closeErr = !wasConnected && code === 4009 ? 'Falsches OBS WebSocket-Passwort.' : '';
        this._updateState({
          connected: false,
          connecting: false,
          error: closeErr || this.state.error
        });
        if (!settled) {
          done(new Error(closeErr || `OBS WebSocket getrennt (Code ${code})`));
        }
      });
    });
  }

  _handleObsEvent(d) {
    if (!d) return;
    const { eventType, eventData } = d;
    if (eventType === 'CurrentProgramSceneChanged' && eventData?.sceneName) {
      this._updateState({ currentScene: eventData.sceneName });
    } else if (eventType === 'SceneListChanged' && Array.isArray(eventData?.scenes)) {
      this._updateState({
        scenes: eventData.scenes.map((s) => s.sceneName).reverse()
      });
    } else if (eventType === 'StreamStateChanged') {
      this._updateState({ streamActive: Boolean(eventData?.outputActive) });
    } else if (eventType === 'RecordStateChanged') {
      this._updateState({ recordActive: Boolean(eventData?.outputActive) });
    } else if (eventType === 'ReplayBufferStateChanged') {
      this._updateState({ replayActive: Boolean(eventData?.outputActive) });
    } else if (
      eventType === 'InputMuteStateChanged' &&
      eventData?.inputName &&
      eventData.inputName === this.state.micName
    ) {
      this._updateState({ micMuted: Boolean(eventData.inputMuted) });
    } else if (eventType === 'InputVolumeMeters' && Array.isArray(eventData?.inputs)) {
      const micLow = String(this.state.micName || '').toLowerCase();
      let bestLevel = 0;
      let bestL = 0;
      let bestR = 0;
      let bestName = '';
      for (const inp of eventData.inputs) {
        const name = String(inp?.inputName || '');
        const low = name.toLowerCase();
        if (micLow && low === micLow) continue;
        if (/\b(mic|mikro|mikrofon)\b/i.test(low)) continue;
        if (/\bheadset\b/i.test(low) && !/desktop|ausgabe|output|music|musik|spotify|system/i.test(low)) continue;
        const ch = Array.isArray(inp?.inputLevelsMul) ? inp.inputLevelsMul : [];
        if (!ch.length) continue;
        const lRaw = Math.max(Number(ch[0]?.[1] || 0), Number(ch[0]?.[2] || 0), Number(ch[0]?.[0] || 0));
        const rCh = ch[1] || ch[0];
        const rRaw = Math.max(Number(rCh?.[1] || 0), Number(rCh?.[2] || 0), Number(rCh?.[0] || 0));
        const boost = /spotify|music|musik|amazon|apple|desktop|system|browser|chrome|edge|firefox/i.test(low) ? 1.2 : 1.0;
        const peak = Math.max(lRaw, rRaw);
        const lv = peak < 0.002 ? 0 : Math.min(1, Math.pow(peak, 0.48) * boost);
        if (lv > bestLevel) {
          bestLevel = lv;
          bestL = lRaw < 0.002 ? 0 : Math.min(1, Math.pow(lRaw, 0.48) * boost);
          bestR = rRaw < 0.002 ? 0 : Math.min(1, Math.pow(rRaw, 0.48) * boost);
          bestName = name;
        }
      }
      const nowMs = Date.now();
      const isSilent = bestLevel <= 0.005;
      if (!isSilent || !this._lastObsMeterEmitAt || (nowMs - this._lastObsMeterEmitAt) >= 200) {
        this._lastObsMeterEmitAt = nowMs;
        this.emit('audio-meter', {
          level: Number(bestLevel.toFixed(3)),
          left: Number(bestL.toFixed(3)),
          right: Number(bestR.toFixed(3)),
          sourceName: bestName
        });
      }
    }
  }

  call(requestType, requestData = undefined) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.state.connected) {
      return Promise.reject(new Error('Nicht mit OBS WebSocket v5 verbunden.'));
    }
    const requestId = String(this.reqCounter++);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        reject(new Error(`OBS Anfrage Timeout (${requestType})`));
      }, 6000);
      this.pending.set(requestId, { resolve, reject, timer });
      const payload = { op: 6, d: { requestType, requestId } };
      if (requestData !== undefined) payload.d.requestData = requestData;
      this.ws.send(JSON.stringify(payload));
    });
  }

  async refreshState() {
    if (!this.state.connected) return this.getState();
    const patch = {};
    try {
      const sceneRes = await this.call('GetSceneList');
      patch.currentScene = sceneRes.currentProgramSceneName || '';
      patch.scenes = Array.isArray(sceneRes.scenes)
        ? sceneRes.scenes.map((s) => s.sceneName).reverse()
        : [];
    } catch (e) {}

    try {
      const stRes = await this.call('GetStreamStatus');
      patch.streamActive = Boolean(stRes.outputActive);
    } catch (e) {}

    try {
      const recRes = await this.call('GetRecordStatus');
      patch.recordActive = Boolean(recRes.outputActive);
    } catch (e) {}

    try {
      const repRes = await this.call('GetReplayBufferStatus');
      patch.replayActive = Boolean(repRes.outputActive);
    } catch (e) {
      patch.replayActive = false;
    }

    let micName = this.lastOpts?.micName || '';
    if (!micName) {
      try {
        const sp = await this.call('GetSpecialInputs');
        micName = sp.mic1 || sp.mic2 || '';
      } catch (e) {}
    }
    if (micName) {
      patch.micName = micName;
      try {
        const muteRes = await this.call('GetInputMute', { inputName: micName });
        patch.micMuted = Boolean(muteRes.inputMuted);
      } catch (e) {}
    }

    this._updateState(patch);
    return this.getState();
  }

  async setScene(sceneName) {
    if (!sceneName) throw new Error('Kein Szenenname angegeben.');
    await this.call('SetCurrentProgramScene', { sceneName: String(sceneName) });
    this._updateState({ currentScene: String(sceneName) });
    return { ok: true, currentScene: String(sceneName) };
  }

  async toggleStream(prepOpts = {}) {
    const st = await this.call('GetStreamStatus').catch(() => ({ outputActive: this.state.streamActive }));
    if (!st.outputActive) {
      await this.ensureStreamServiceReady(prepOpts);
    }
    const res = await this.call('ToggleStream');
    this._updateState({ streamActive: Boolean(res.outputActive) });
    return { ok: true, streamActive: Boolean(res.outputActive) };
  }

  async toggleRecord() {
    const res = await this.call('ToggleRecord');
    this._updateState({ recordActive: Boolean(res.outputActive) });
    return { ok: true, recordActive: Boolean(res.outputActive) };
  }

  async saveReplayBuffer() {
    await this.call('SaveReplayBuffer');
    return { ok: true };
  }

  async toggleMicMute(inputName = '') {
    const target = String(inputName || this.state.micName || '').trim();
    if (!target) {
      throw new Error('Kein OBS-Mikrofon gefunden (in OBS Config optional Namen angeben).');
    }
    const res = await this.call('ToggleInputMute', { inputName: target });
    this._updateState({ micName: target, micMuted: Boolean(res.inputMuted) });
    return { ok: true, micName: target, micMuted: Boolean(res.inputMuted) };
  }

  async _resolveColorFilterSpec() {
    if (this._colorFilterSpec) return this._colorFilterSpec;
    for (const kind of ['color_filter_v2', 'color_filter']) {
      try {
        const def = await this.call('GetSourceFilterDefaultSettings', { filterKind: kind });
        const defOpacity = def?.defaultFilterSettings?.opacity;
        const maxVal = typeof defOpacity === 'number' && defOpacity > 1.5 ? 100 : 1.0;
        this._colorFilterSpec = { kind, maxVal };
        return this._colorFilterSpec;
      } catch (e) {}
    }
    this._colorFilterSpec = { kind: 'color_filter_v2', maxVal: 1.0 };
    return this._colorFilterSpec;
  }

  _opacitySettingToTransparencyPct(rawOpacity, filterKind = 'color_filter_v2') {
    if (typeof rawOpacity !== 'number' || !Number.isFinite(rawOpacity)) return 0;
    const isLegacyPct = filterKind === 'color_filter' || rawOpacity > 1.001;
    const opacityPct = isLegacyPct
      ? Math.max(0, Math.min(100, rawOpacity))
      : Math.max(0, Math.min(100, rawOpacity * 100));
    return Math.max(0, Math.min(100, Math.round(100 - opacityPct)));
  }

  async getSourceTransparency(sourceName) {
    const target = String(sourceName || '').trim();
    if (!target) return { ok: false, transparencyPct: 0 };
    try {
      const res = await this.call('GetSourceFilterList', { sourceName: target });
      const filters = Array.isArray(res.filters) ? res.filters : [];
      const own = filters.find((f) => f.filterName === OMNIGRID_TRANSPARENCY_FILTER);
      if (own) {
        if (own.filterEnabled === false) return { ok: true, sourceName: target, transparencyPct: 0 };
        const pct = this._opacitySettingToTransparencyPct(own.filterSettings?.opacity, own.filterKind);
        return { ok: true, sourceName: target, transparencyPct: pct };
      }
      const existingColor = filters.find(
        (f) => f.filterEnabled !== false && (f.filterKind === 'color_filter_v2' || f.filterKind === 'color_filter') && f.filterSettings?.opacity !== undefined
      );
      if (existingColor) {
        const pct = this._opacitySettingToTransparencyPct(existingColor.filterSettings.opacity, existingColor.filterKind);
        return { ok: true, sourceName: target, transparencyPct: pct };
      }
    } catch (e) {}
    return { ok: true, sourceName: target, transparencyPct: 0 };
  }

  async setSourceTransparency(sourceName, transparencyPct = 0) {
    const target = String(sourceName || '').trim();
    if (!target) throw new Error('Kein Quellenname angegeben.');
    const pct = Math.max(0, Math.min(100, Math.round(Number(transparencyPct) || 0)));
    const spec = await this._resolveColorFilterSpec();

    const listRes = await this.call('GetSourceFilterList', { sourceName: target });
    const filters = Array.isArray(listRes.filters) ? listRes.filters : [];
    const own = filters.find((f) => f.filterName === OMNIGRID_TRANSPARENCY_FILTER);

    if (pct <= 0) {
      if (own) {
        await this.call('RemoveSourceFilter', {
          sourceName: target,
          filterName: OMNIGRID_TRANSPARENCY_FILTER
        }).catch(() => {});
      }
      return { ok: true, sourceName: target, transparencyPct: 0, opacityPct: 100 };
    }

    const opacityVal =
      spec.maxVal === 100
        ? Math.max(0, Math.min(100, Math.round(100 - pct)))
        : Number(Math.max(0, Math.min(1, (100 - pct) / 100)).toFixed(3));

    if (own) {
      await this.call('SetSourceFilterSettings', {
        sourceName: target,
        filterName: OMNIGRID_TRANSPARENCY_FILTER,
        filterSettings: { opacity: opacityVal },
        overlay: true
      });
      if (own.filterEnabled === false) {
        await this.call('SetSourceFilterEnabled', {
          sourceName: target,
          filterName: OMNIGRID_TRANSPARENCY_FILTER,
          filterEnabled: true
        }).catch(() => {});
      }
    } else {
      await this.call('CreateSourceFilter', {
        sourceName: target,
        filterName: OMNIGRID_TRANSPARENCY_FILTER,
        filterKind: spec.kind,
        filterSettings: { opacity: opacityVal }
      });
    }

    return { ok: true, sourceName: target, transparencyPct: pct, opacityPct: 100 - pct };
  }

  async getSceneItems(sceneName = '') {
    const target = String(sceneName || this.state.currentScene || '').trim();
    if (!target) throw new Error('Keine Szene ausgewählt.');
    let baseWidth = 1920;
    let baseHeight = 1080;
    try {
      const vs = await this.call('GetVideoSettings');
      if (vs?.baseWidth) baseWidth = Number(vs.baseWidth);
      if (vs?.baseHeight) baseHeight = Number(vs.baseHeight);
    } catch (e) {}

    const res = await this.call('GetSceneItemList', { sceneName: target });
    const rawItems = Array.isArray(res.sceneItems) ? res.sceneItems : [];
    const uniqueVisualSources = [
      ...new Set(
        rawItems
          .filter((it) => {
            const k = String(it.inputKind || '').toLowerCase();
            return it.sourceName && !k.includes('audio') && k !== 'sck_audio_capture';
          })
          .map((it) => String(it.sourceName))
      )
    ];
    const transparencyMap = new Map();
    await Promise.all(
      uniqueVisualSources.map(async (srcName) => {
        const trRes = await this.getSourceTransparency(srcName);
        transparencyMap.set(srcName, Number(trRes?.transparencyPct || 0));
      })
    );

    const items = rawItems.map((it, idx) => ({
      sceneItemId: it.sceneItemId,
      sceneItemIndex: typeof it.sceneItemIndex === 'number' ? it.sceneItemIndex : idx,
      totalItems: rawItems.length,
      sourceName: it.sourceName,
      inputKind: it.inputKind || '',
      sceneItemEnabled: Boolean(it.sceneItemEnabled),
      sceneItemLocked: Boolean(it.sceneItemLocked),
      transparencyPct: transparencyMap.get(String(it.sourceName)) || 0,
      transform: it.sceneItemTransform || {}
    }));
    return { ok: true, sceneName: target, baseWidth, baseHeight, items: items.reverse() };
  }

  async reorderSceneItem(sceneName, sceneItemId, mode = 'up', explicitIndex = null) {
    const target = String(sceneName || this.state.currentScene || '').trim();
    const id = Number(sceneItemId);
    if (!target || !Number.isFinite(id)) throw new Error('Szene und Quelle erforderlich.');

    const res = await this.call('GetSceneItemList', { sceneName: target });
    const list = Array.isArray(res.sceneItems) ? res.sceneItems : [];
    const count = list.length;
    if (count <= 1) return { ok: true, sceneItemIndex: 0 };

    const pos = list.findIndex((it) => Number(it.sceneItemId) === id);
    if (pos < 0) throw new Error('Quelle nicht in dieser Szene gefunden.');
    const curIdx = typeof list[pos].sceneItemIndex === 'number' ? list[pos].sceneItemIndex : pos;
    const maxIdx = count - 1;

    // OBS WebSocket v5: Index 0 = ganz hinten (Hintergrund), maxIdx = ganz vorne (Vordergrund)
    let nextIdx = curIdx;
    if (mode === 'front') nextIdx = maxIdx;
    else if (mode === 'up') nextIdx = Math.min(maxIdx, curIdx + 1);
    else if (mode === 'down') nextIdx = Math.max(0, curIdx - 1);
    else if (mode === 'back') nextIdx = 0;
    else if (mode === 'index' && Number.isFinite(Number(explicitIndex))) {
      nextIdx = Math.max(0, Math.min(maxIdx, Math.round(Number(explicitIndex))));
    }

    if (nextIdx !== curIdx) {
      await this.call('SetSceneItemIndex', {
        sceneName: target,
        sceneItemId: id,
        sceneItemIndex: nextIdx
      });
    }
    return { ok: true, sceneItemIndex: nextIdx, maxIndex: maxIdx };
  }

  async setSceneItemEnabled(sceneName, sceneItemId, enabled) {
    await this.call('SetSceneItemEnabled', {
      sceneName: String(sceneName),
      sceneItemId: Number(sceneItemId),
      sceneItemEnabled: Boolean(enabled)
    });
    return { ok: true };
  }

  async setSceneItemTransform(sceneName, sceneItemId, transform = {}) {
    await this.call('SetSceneItemTransform', {
      sceneName: String(sceneName),
      sceneItemId: Number(sceneItemId),
      sceneItemTransform: transform
    });
    return { ok: true };
  }

  async createScene(sceneName) {
    const clean = String(sceneName || '').trim();
    if (!clean) throw new Error('Bitte Szenennamen angeben.');
    await this.call('CreateScene', { sceneName: clean });
    await this.refreshState();
    return { ok: true, sceneName: clean };
  }

  async getAudioInputs() {
    const res = await this.call('GetInputList');
    const inputs = Array.isArray(res.inputs) ? res.inputs : [];
    const audioKindRe = /(coreaudio|wasapi|pulse|alsa|jack|pipewire|sck_audio|audio_capture|audio_input|audio_output)/i;
    const audioList = [];
    for (const inp of inputs) {
      const kind = String(inp.inputKind || '');
      if (!audioKindRe.test(kind)) continue;
      try {
        const vol = await this.call('GetInputVolume', { inputName: inp.inputName });
        const mute = await this.call('GetInputMute', { inputName: inp.inputName });
        let currentDeviceId = '';
        let devices = [];
        const devicePropName = kind === 'sck_audio_capture'
          ? 'application'
          : kind === 'wasapi_process_output_capture'
            ? 'window'
            : 'device_id';
        try {
          const settingsRes = await this.call('GetInputSettings', { inputName: inp.inputName });
          const st = settingsRes?.inputSettings || {};
          currentDeviceId = kind === 'sck_audio_capture'
            ? (Number(st.type) === 0 ? '__desktop__' : String(st.application ?? ''))
            : String(st[devicePropName] ?? '');
        } catch (e) {}
        if (kind === 'sck_audio_capture') {
          devices = [
            { name: '🖥️ Desktop-Audio (Gesamter Mac)', value: '__desktop__' },
            { name: '🟢 Spotify', value: 'com.spotify.client' },
            { name: '🍎 Apple Music', value: 'com.apple.Music' },
            { name: '🔵 Amazon Music', value: 'com.amazon.music' },
            { name: '🌐 Google Chrome', value: 'com.google.Chrome' },
            { name: '🧭 Safari', value: 'com.apple.Safari' }
          ];
          if (currentDeviceId && !devices.some((d) => d.value === currentDeviceId)) {
            devices.push({ name: currentDeviceId, value: currentDeviceId });
          }
        } else {
          try {
            const propRes = await this.call('GetInputPropertiesListPropertyItems', {
              inputName: inp.inputName,
              propertyName: devicePropName
            });
            devices = Array.isArray(propRes?.propertyItems)
              ? propRes.propertyItems
                  .filter((p) => p && p.itemEnabled !== false)
                  .map((p) => ({ name: String(p.itemName || p.itemValue || ''), value: String(p.itemValue ?? '') }))
              : [];
          } catch (e) {}
        }
        let audioTracks = { '1': true, '2': true, '3': false, '4': false, '5': false, '6': false };
        try {
          const trRes = await this.call('GetInputAudioTracks', { inputName: inp.inputName });
          if (trRes?.inputAudioTracks && typeof trRes.inputAudioTracks === 'object') {
            audioTracks = trRes.inputAudioTracks;
          }
        } catch (e) {}
        const musicRe = /(spotify|apple\s*music|amazon\s*music|youtube\s*music|music|musik|itunes|tidal|deezer|soundcloud|com\.spotify\.client|com\.apple\.music|com\.amazon\.music)/i;
        audioList.push({
          inputName: inp.inputName,
          inputKind: kind,
          volumeMul: typeof vol.inputVolumeMul === 'number' ? vol.inputVolumeMul : 1,
          volumeDb: typeof vol.inputVolumeDb === 'number' ? vol.inputVolumeDb : 0,
          muted: Boolean(mute.inputMuted),
          devicePropName,
          currentDeviceId,
          devices,
          audioTracks,
          vodExcluded: audioTracks['2'] === false,
          isMusicGuess: musicRe.test(inp.inputName) || musicRe.test(currentDeviceId)
        });
      } catch (e) {}
    }
    return { ok: true, inputs: audioList };
  }

  async setInputVodMusicOnly(inputName, musicOnly = true) {
    const cleanName = String(inputName || '').trim();
    if (!cleanName) throw new Error('Kein Audio-Gerät angegeben.');
    const musicRe = /(spotify|apple\s*music|amazon\s*music|youtube\s*music|music|musik|itunes|tidal|deezer|soundcloud|com\.spotify\.client|com\.apple\.music|com\.amazon\.music)/i;
    let lockedMusic = musicRe.test(cleanName);
    if (!lockedMusic) {
      try {
        const stRes = await this.call('GetInputSettings', { inputName: cleanName });
        const st = stRes?.inputSettings || {};
        lockedMusic = musicRe.test(String(st.application || st.device_id || st.window || ''));
      } catch (e) {}
    }
    const effectiveMusicOnly = lockedMusic ? true : Boolean(musicOnly);
    const tracks = effectiveMusicOnly
      ? { '1': true, '2': false, '3': true, '4': false, '5': false, '6': false }
      : { '1': true, '2': true, '3': false, '4': false, '5': false, '6': false };
    await this.call('SetInputAudioTracks', { inputName: cleanName, inputAudioTracks: tracks });
    return { ok: true, inputName: cleanName, vodExcluded: effectiveMusicOnly, locked: lockedMusic, audioTracks: tracks };
  }

  async setupMusicVodTrack({ sceneName = '', createDedicatedSource = false, musicSourceHint = '' } = {}) {
    const { inputs } = await this.getAudioInputs();
    const updatedMusic = [];
    const updatedNormal = [];
    for (const inp of inputs) {
      if (inp.isMusicGuess) {
        await this.setInputVodMusicOnly(inp.inputName, true);
        updatedMusic.push(inp.inputName);
      } else if (!inp.vodExcluded) {
        await this.setInputVodMusicOnly(inp.inputName, false);
        updatedNormal.push(inp.inputName);
      }
    }
    let createdSource = '';
    if (createDedicatedSource) {
      const targetScene = String(sceneName || this.state.currentScene || '').trim();
      const sourceName = '🎵 Musik (Nur Live / Kein VOD)';
      const exists = inputs.some((i) => i.inputName === sourceName);
      if (!exists && targetScene) {
        const kindsRes = await this.getInputKinds().catch(() => ({ kinds: [] }));
        const kinds = kindsRes.kinds || [];
        const preferred = process.platform === 'darwin'
          ? ['sck_audio_capture', 'coreaudio_output_capture', 'coreaudio_input_capture']
          : process.platform === 'win32'
            ? ['wasapi_process_output_capture', 'wasapi_output_capture']
            : ['pulse_output_capture', 'pulse_input_capture'];
        const chosenKind = preferred.find((k) => kinds.includes(k)) || preferred[0];
        let settings = {};
        if (chosenKind === 'sck_audio_capture') {
          const hint = String(musicSourceHint || '').toLowerCase();
          const bundleId = hint.includes('apple')
            ? 'com.apple.Music'
            : hint.includes('amazon')
              ? 'com.amazon.music'
              : hint.includes('spotify')
                ? 'com.spotify.client'
                : '';
          settings = bundleId ? { type: 1, application: bundleId } : { type: 0 };
        }
        await this.createInput({
          sceneName: targetScene,
          inputName: sourceName,
          inputKind: chosenKind,
          inputSettings: settings
        });
        await new Promise((r) => setTimeout(r, 250));
        await this.setInputVodMusicOnly(sourceName, true);
        createdSource = sourceName;
      } else if (exists) {
        await this.setInputVodMusicOnly(sourceName, true);
        createdSource = sourceName;
      }
    }
    return { ok: true, updatedMusic, updatedNormal, createdSource };
  }

  async setInputAudioDevice(inputName, deviceId, propertyName = 'device_id') {
    const cleanName = String(inputName || '').trim();
    if (!cleanName) throw new Error('Kein Audio-Gerät angegeben.');
    const prop = ['device_id', 'application', 'window'].includes(propertyName) ? propertyName : 'device_id';
    const patch = prop === 'application'
      ? (deviceId === '__desktop__' ? { type: 0 } : { type: 1, application: String(deviceId ?? '') })
      : { [prop]: String(deviceId ?? '') };
    await this.call('SetInputSettings', {
      inputName: cleanName,
      inputSettings: patch,
      overlay: true
    });
    if (/(spotify|apple\.music|amazon\.music|tidal|deezer|soundcloud|music|musik)/i.test(String(deviceId ?? ''))) {
      try { await this.setInputVodMusicOnly(cleanName, true); } catch (e) {}
    }
    return { ok: true, inputName: cleanName, deviceId: String(deviceId ?? ''), propertyName: prop };
  }

  async enforceMusicVodProtection() {
    if (!this.state.connected) return { ok: false, enforced: [] };
    const { inputs } = await this.getAudioInputs();
    const enforced = [];
    for (const inp of inputs) {
      if (inp.isMusicGuess && !inp.vodExcluded) {
        try {
          await this.setInputVodMusicOnly(inp.inputName, true);
          enforced.push(inp.inputName);
        } catch (e) {}
      }
    }
    return { ok: true, enforced };
  }

  async setInputVolume(inputName, volumeMul) {
    const mul = Math.max(0, Math.min(2, Number(volumeMul)));
    await this.call('SetInputVolume', { inputName: String(inputName), inputVolumeMul: mul });
    return { ok: true, inputName, volumeMul: mul };
  }

  async getSceneScreenshot(sceneName = '') {
    const target = String(sceneName || this.state.currentScene || '').trim();
    if (!target) throw new Error('Keine Szene ausgewählt.');
    const res = await this.call('GetSourceScreenshot', {
      sourceName: target,
      imageFormat: 'jpg',
      imageWidth: 1920,
      imageHeight: 1080,
      imageCompressionQuality: 96
    });
    return { ok: true, imageData: res.imageData || '' };
  }

  async getInputKinds() {
    const res = await this.call('GetInputKindList', { unversioned: false });
    return { ok: true, kinds: Array.isArray(res.inputKinds) ? res.inputKinds : [] };
  }

  async createInput({ sceneName, inputName, inputKind, inputSettings = {} }) {
    const targetScene = String(sceneName || this.state.currentScene || '').trim();
    const name = String(inputName || '').trim();
    const kind = String(inputKind || '').trim();
    if (!targetScene || !name || !kind) {
      throw new Error('Szene, Quellenname und Quelltyp sind erforderlich.');
    }
    const res = await this.call('CreateInput', {
      sceneName: targetScene,
      inputName: name,
      inputKind: kind,
      inputSettings,
      sceneItemEnabled: true
    });
    return { ok: true, sceneItemId: res.sceneItemId, inputName: name };
  }

  async addOrAttachBrowserOverlay({ sceneName, inputName, url, width = 480, height = 360, posX = null, posY = null, rerouteAudio = false }) {
    const targetScene = String(sceneName || this.state.currentScene || '').trim();
    const name = String(inputName || '').trim();
    if (!targetScene || !name || !url) {
      throw new Error('Szene, Name und Overlay-URL erforderlich.');
    }

    const inputSettings = {
      url: String(url),
      width: Number(width) || 480,
      height: Number(height) || 360,
      shutdown: false
    };
    if (rerouteAudio) inputSettings.reroute_audio = true;

    // 1. Prüfen, ob das Overlay bereits in der aktuellen Szene liegt
    const listRes = await this.call('GetSceneItemList', { sceneName: targetScene });
    const existingInScene = (Array.isArray(listRes.sceneItems) ? listRes.sceneItems : []).find(
      (it) => String(it.sourceName || '') === name
    );
    if (existingInScene) {
      await this.call('SetInputSettings', { inputName: name, inputSettings, overlay: true }).catch(() => {});
      if (!existingInScene.sceneItemEnabled) {
        await this.call('SetSceneItemEnabled', {
          sceneName: targetScene,
          sceneItemId: Number(existingInScene.sceneItemId),
          sceneItemEnabled: true
        }).catch(() => {});
      }
      await this.call('PressInputPropertiesButton', { inputName: name, propertyName: 'refreshnocache' }).catch(() => {});
      return { ok: true, sceneItemId: existingInScene.sceneItemId, inputName: name, reusedInScene: true };
    }

    // 2. Neu anlegen oder aus anderer Szene wiederverwenden (OBS Input-Namen sind global)
    let sceneItemId = null;
    try {
      const created = await this.call('CreateInput', {
        sceneName: targetScene,
        inputName: name,
        inputKind: 'browser_source',
        inputSettings,
        sceneItemEnabled: true
      });
      sceneItemId = created.sceneItemId;
    } catch (e) {
      await this.call('SetInputSettings', { inputName: name, inputSettings, overlay: true });
      const attached = await this.call('CreateSceneItem', {
        sceneName: targetScene,
        sourceName: name,
        sceneItemEnabled: true
      });
      sceneItemId = attached.sceneItemId;
    }

    if (sceneItemId !== null && Number.isFinite(Number(posX)) && Number.isFinite(Number(posY))) {
      await this.call('SetSceneItemTransform', {
        sceneName: targetScene,
        sceneItemId: Number(sceneItemId),
        sceneItemTransform: {
          positionX: Math.max(0, Math.round(Number(posX))),
          positionY: Math.max(0, Math.round(Number(posY)))
        }
      }).catch(() => {});
    }

    await this.call('PressInputPropertiesButton', { inputName: name, propertyName: 'refreshnocache' }).catch(() => {});
    return { ok: true, sceneItemId, inputName: name, reusedInScene: false };
  }

  async refreshAllOmniGridOverlays(port = 4588) {
    if (!this.state.connected) return { ok: false, refreshed: [] };
    const res = await this.call('GetInputList', { inputKind: 'browser_source' }).catch(() => ({ inputs: [] }));
    const inputs = Array.isArray(res.inputs) ? res.inputs : [];
    const refreshed = [];
    for (const inp of inputs) {
      try {
        const st = await this.call('GetInputSettings', { inputName: inp.inputName });
        const u = String(st?.inputSettings?.url || '');
        if (u.includes(`127.0.0.1:${port}`) || u.includes(`localhost:${port}`) || String(inp.inputName || '').startsWith('OmniGrid')) {
          await this.call('PressInputPropertiesButton', { inputName: inp.inputName, propertyName: 'refreshnocache' }).catch(() => {});
          refreshed.push(inp.inputName);
        }
      } catch (e) {}
    }
    return { ok: true, refreshed };
  }

  async removeSceneItem(sceneName, sceneItemId) {
    await this.call('RemoveSceneItem', {
      sceneName: String(sceneName || this.state.currentScene),
      sceneItemId: Number(sceneItemId)
    });
    return { ok: true };
  }

  async renameSource(oldName, newName, inputKind = '') {
    const cleanOld = String(oldName || '').trim();
    const cleanNew = String(newName || '').trim();
    if (!cleanOld || !cleanNew) {
      throw new Error('Bitte einen gültigen neuen Quellennamen eingeben.');
    }
    if (cleanOld === cleanNew) {
      return { ok: true, oldName: cleanOld, newName: cleanNew, unchanged: true };
    }

    try {
      await this.call('SetInputName', {
        inputName: cleanOld,
        newInputName: cleanNew
      });
    } catch (err) {
      const msg = String(err?.message || '');
      // Falls das Szenen-Element eine verschachtelte Szene statt eines Inputs ist:
      if (!inputKind && !/already exists|601/i.test(msg)) {
        try {
          await this.call('SetSceneName', {
            sceneName: cleanOld,
            newSceneName: cleanNew
          });
        } catch (sceneErr) {
          if (/already exists|601/i.test(String(sceneErr?.message || ''))) {
            throw new Error(`Eine Quelle oder Szene namens "${cleanNew}" existiert bereits in OBS.`);
          }
          throw err;
        }
      } else if (/already exists|601/i.test(msg)) {
        throw new Error(`Eine Quelle namens "${cleanNew}" existiert bereits in OBS.`);
      } else {
        throw err;
      }
    }

    if (this.lastOpts && this.lastOpts.micName === cleanOld) {
      this.lastOpts.micName = cleanNew;
    }
    await this.refreshState().catch(() => {});
    return { ok: true, oldName: cleanOld, newName: cleanNew };
  }

  async startVirtualCam() {
    let wasActive = false;
    try {
      const st = await this.call('GetVirtualCamStatus');
      wasActive = Boolean(st.outputActive);
    } catch (e) {}
    if (!wasActive) {
      await this.call('StartVirtualCam');
    }
    return { ok: true, startedByEditor: !wasActive };
  }

  async stopVirtualCam() {
    try {
      const st = await this.call('GetVirtualCamStatus');
      if (st.outputActive) {
        await this.call('StopVirtualCam');
      }
    } catch (e) {}
    return { ok: true };
  }

  async getInputSettings(inputName) {
    const res = await this.call('GetInputSettings', { inputName });
    return {
      inputKind: res.inputKind || '',
      inputSettings: res.inputSettings || {}
    };
  }

  async setInputSettings(inputName, inputSettings, overlay = true) {
    await this.call('SetInputSettings', { inputName, inputSettings, overlay });
    return { ok: true };
  }

  async getInputPropertyItems(inputName, propertyName) {
    try {
      const res = await this.call('GetInputPropertiesListPropertyItems', { inputName, propertyName });
      return { ok: true, items: res.propertyItems || [] };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async inspectInputProperties(inputName) {
    const { inputKind, inputSettings } = await this.getInputSettings(inputName);
    const properties = {};
    const errors = {};
    const skipObsProps = ['screen_capture', 'sck_audio_capture', 'display_capture', 'window_capture'];
    if (!skipObsProps.includes(inputKind)) {
      const candidateProps = ['device', 'device_id'];
      for (const prop of candidateProps) {
        const res = await this.getInputPropertyItems(inputName, prop);
        if (res.ok && res.items.length > 0) {
          properties[prop] = res.items;
        } else if (!res.ok) {
          errors[prop] = res.error;
        }
      }
    }
    return { ok: true, inputKind, inputSettings, properties, errors };
  }

  async disableMultitrackVideoConflict() {
    // Prevents OBS Studio 30.2+ / 31+ popup:
    // "Keine Konfigurations-URL für die aktuelle Plattform verfügbar" ("No configuration URL available")
    // caused when Twitch Enhanced Broadcasting (EnableMultitrackVideo=true in [Stream1]) remains active
    // while streaming to Custom RTMP / Simulcast Relay / YouTube / TikTok / Kick.
    let wasEnabled = false;
    try {
      const cur = await this.call('GetProfileParameter', {
        parameterCategory: 'Stream1',
        parameterName: 'EnableMultitrackVideo'
      });
      wasEnabled = String(cur?.parameterValue || '').toLowerCase() === 'true';
    } catch (e) {}

    await this.call('SetProfileParameter', {
      parameterCategory: 'Stream1',
      parameterName: 'EnableMultitrackVideo',
      parameterValue: 'false'
    }).catch(() => {});
    await this.call('SetProfileParameter', {
      parameterCategory: 'Stream1',
      parameterName: 'MultitrackVideo',
      parameterValue: 'false'
    }).catch(() => {});

    return { ok: true, wasEnabled };
  }

  async configureCustomRtmpService(serverUrl = 'rtmp://127.0.0.1:1935/live', streamKey = 'omnigrid') {
    const cleanServer = String(serverUrl || 'rtmp://127.0.0.1:1935/live').trim();
    const cleanKey = String(streamKey || 'omnigrid').trim();

    await this.disableMultitrackVideoConflict();
    await this.call('SetStreamServiceSettings', {
      streamServiceType: 'rtmp_custom',
      streamServiceSettings: {
        server: cleanServer,
        key: cleanKey,
        use_auth: false,
        bwtest: false
      }
    });
    await this.disableMultitrackVideoConflict();

    return { ok: true, server: cleanServer, key: cleanKey, multitrackDisabled: true };
  }

  async ensureStreamServiceReady({ fallbackServerUrl = '', fallbackStreamKey = '', forceRelayUrl = '', forceRelayKey = '' } = {}) {
    if (forceRelayUrl && forceRelayKey) {
      await this.configureCustomRtmpService(forceRelayUrl, forceRelayKey);
      return { ok: true, mode: 'relay' };
    }

    let svcType = '';
    let svcSettings = {};
    try {
      const cur = await this.call('GetStreamServiceSettings');
      svcType = String(cur?.streamServiceType || '');
      svcSettings = cur?.streamServiceSettings || {};
    } catch (e) {
      return { ok: true, mode: 'unchanged' };
    }

    const isOfficialTwitchService =
      svcType === 'rtmp_common' && /twitch/i.test(String(svcSettings.service || ''));

    // Automatically clear Enhanced Broadcasting (EnableMultitrackVideo) whenever OBS is NOT on native Twitch service
    if (!isOfficialTwitchService) {
      await this.disableMultitrackVideoConflict();
    }

    const existingKey = String(svcSettings.key || '').trim();
    if (!existingKey && fallbackServerUrl && fallbackStreamKey) {
      await this.configureCustomRtmpService(fallbackServerUrl, fallbackStreamKey);
      return { ok: true, mode: 'fallback-target' };
    }

    return { ok: true, mode: 'verified' };
  }

  async startStream(prepOpts = {}) {
    try {
      const st = await this.call('GetStreamStatus');
      if (!st.outputActive) {
        await this.ensureStreamServiceReady(prepOpts);
        await this.call('StartStream');
      }
      this._updateState({ streamActive: true, streaming: true });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  async stopStream() {
    try {
      const st = await this.call('GetStreamStatus');
      if (st.outputActive) {
        await this.call('StopStream');
      }
      this._updateState({ streamActive: false, streaming: false });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  async getSceneTransitions() {
    try {
      const res = await this.call('GetSceneTransitionList');
      const transitions = (res.transitions || []).map((t) => ({
        name: String(t.transitionName || ''),
        kind: String(t.transitionKind || '')
      })).filter((t) => t.name);
      return {
        ok: true,
        current: String(res.currentSceneTransitionName || ''),
        transitions
      };
    } catch (err) {
      return { ok: false, error: err.message, transitions: [] };
    }
  }

  async setSceneTransition(transitionName, durationMs = 0) {
    try {
      const name = String(transitionName || '').trim();
      if (!name) return { ok: false, error: 'Kein Übergangsname angegeben.' };
      await this.call('SetCurrentSceneTransition', { transitionName: name });
      if (Number(durationMs) > 0) {
        await this.call('SetCurrentSceneTransitionDuration', { transitionDuration: Number(durationMs) }).catch(() => {});
      }
      return { ok: true, transitionName: name };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  disconnect(emitUpdate = true) {
    for (const entry of this.pending.values()) {
      clearTimeout(entry.timer);
      entry.reject(new Error('Verbindung getrennt.'));
    }
    this.pending.clear();
    this._colorFilterSpec = null;
    if (this.ws) {
      try {
        this.ws.removeAllListeners();
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
    if (emitUpdate) {
      this._updateState({
        connected: false,
        connecting: false,
        error: '',
        scenes: [],
        currentScene: ''
      });
    }
  }
}

module.exports = { ObsWsClient };

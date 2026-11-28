const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const i18n = require('./i18n');
const { TwitchConnector } = require('./connectors/twitch');
const { YouTubeConnector } = require('./connectors/youtube');
const { TikTokConnector } = require('./connectors/tiktok');
const { ObsServer } = require('./obs_server');
const { EmoteManager } = require('./emote_manager');
const { SpotifyBridge } = require('./spotify_bridge');
const { ObsWsClient } = require('./obs_ws_client');
const clipStudio = require('./clip_studio');
const socialSchedule = require('./social_schedule');
const gameAddons = require('./game_addons');
const { GitHubAutoUpdater } = require('./auto_updater');
const elgatoLights = require('./elgato_lights');
const goveeLights = require('./govee_lights');
const hueLights = require('./hue_lights');
const nanoleafLights = require('./nanoleaf_lights');
const obsAutoConfig = require('./obs_auto_config');
const { MultiStreamRelay, normalizeRelayConfig, buildActiveDestinations } = require('./multistream_relay');
const { VoiceControlBridge, normalizeVoiceConfig } = require('./voice_control');
const themePacks = require('./theme_packs');

const autoUpdater = new GitHubAutoUpdater((st) => broadcastToWindows('updater-state', st));
const multiRelay = new MultiStreamRelay();
multiRelay.on('state', (st) => broadcastToWindows('multistream-state', st));

async function executeVoiceCommand(action, payload = {}, meta = {}) {
  const act = String(action || '').trim().toLowerCase();
  const cfg = loadConfig();
  const sourceLabel = meta.source || 'voice';

  if (act === 'clip') {
    if (demoActive) {
      appendDiagLog('system', 'info', `🎙️ [${sourceLabel}] Demo-Clip ausgelöst`);
      return { ok: true, message: 'Demo-Clip wurde erstellt.' };
    }
    const [clipRes, markerRes, replayRes] = await Promise.allSettled([
      twitch.createClip(),
      twitch.createStreamMarker(String(payload.description || 'Voice Highlight')),
      obsWs.getState()?.connected ? obsWs.saveReplayBuffer() : Promise.resolve({ ok: false })
    ]);
    const clipOk = clipRes.status === 'fulfilled' && clipRes.value?.ok;
    const markerOk = markerRes.status === 'fulfilled' && markerRes.value?.ok;
    const replayOk = replayRes.status === 'fulfilled' && replayRes.value?.ok;
    appendDiagLog(
      'system',
      'info',
      `🎙️ [${sourceLabel}] Clip-Befehl ausgeführt (Twitch-Clip: ${clipOk ? 'OK' : '-'}, Marker: ${markerOk ? 'OK' : '-'}, OBS-Replay: ${replayOk ? 'OK' : '-'})`
    );
    return clipOk || markerOk || replayOk
      ? { ok: true, message: 'Clip wurde erfolgreich gespeichert.' }
      : { ok: false, error: 'Kein aktiver Stream oder OBS Replay-Buffer verbunden.' };
  }

  if (act === 'hype') {
    const res = await executeHypeTrigger(cfg, `🎙️ Sprachbefehl (${sourceLabel}): Hype-Modus!`);
    return res?.ok !== false
      ? { ok: true, message: 'Hype-Modus wurde ausgelöst.' }
      : { ok: false, error: res?.error || 'Hype-Modus fehlgeschlagen.' };
  }

  if (act === 'multistream_start') {
    const ms = normalizeRelayConfig(cfg.multiStream || {});
    const extraWarnings = [];
    let youtubeWatchUrl = '';
    let preparedYt = null;
    if (ms.targets.youtube?.enabled && youtube.canWrite) {
      try {
        const streamTitle = String(cfg.streamManager?.title || `${cfg.streamerName || 'OmniGrid'} Live`).trim();
        preparedYt = await youtube.prepareLiveBroadcast({
          title: streamTitle,
          privacyStatus: ms.targets.youtube.privacyStatus || 'public',
          preferredStreamKey: ms.targets.youtube.streamKey || ''
        });
        if (preparedYt.rtmpUrl) ms.targets.youtube.serverUrl = preparedYt.rtmpUrl;
        if (preparedYt.streamKey) ms.targets.youtube.streamKey = preparedYt.streamKey;
        youtubeWatchUrl = preparedYt.watchUrl || '';
        broadcastToWindows('multistream-config-synced', ms);
      } catch (ytErr) {
        extraWarnings.push(`⚠️ YouTube Broadcast-Vorbereitung: ${ytErr.message}`);
      }
    }
    cfg.multiStream = ms;
    saveConfig(cfg);
    obsAutoConfig.autoProvisionObsLocalFiles({ disableMultitrackVideo: true });
    const startRes = multiRelay.start(ms, { warnings: extraWarnings, youtubeWatchUrl });
    if (!startRes.ok) return { ok: false, error: startRes.error || 'Multi-Stream konnte nicht gestartet werden.' };
    if (preparedYt?.broadcastId && preparedYt?.streamId) {
      youtube.watchAndTransitionBroadcastToLive(preparedYt.broadcastId, preparedYt.streamId, ({ broadcastId }) => {
        if (cfg.youtube?.channel) youtube.connect({ target: cfg.youtube.channel, preferredVideoId: broadcastId }).catch(() => {});
      });
    }
    const serverUrl = `rtmp://127.0.0.1:${ms.port}/live`;
    const conn = await ensureObsWsConnected();
    if (conn.ok) {
      if (ms.autoConfigureObs !== false) {
        try { await obsWs.configureCustomRtmpService(serverUrl, ms.streamKey); } catch (e) {}
      }
      if (ms.autoStartObsStream !== false) {
        setTimeout(() => {
          obsWs.startStream({ forceRelayUrl: serverUrl, forceRelayKey: ms.streamKey }).catch(() => {});
        }, 650);
      }
    }
    return { ok: true, message: 'Multi-Stream wurde gestartet.' };
  }

  if (act === 'multistream_stop') {
    youtube.stopLiveTransitionWatch();
    const ms = normalizeRelayConfig(cfg.multiStream || {});
    if (obsWs.getState()?.connected && ms.autoStartObsStream !== false) {
      try { await obsWs.stopStream(); } catch (e) {}
    }
    const stopRes = multiRelay.stop(true);
    return stopRes?.ok !== false
      ? { ok: true, message: 'Multi-Stream wurde gestoppt.' }
      : { ok: false, error: stopRes?.error || 'Multi-Stream konnte nicht gestoppt werden.' };
  }

  if (act === 'mute_toggle') {
    const conn = await ensureObsWsConnected();
    if (!conn.ok) return { ok: false, error: 'OBS WebSocket ist nicht verbunden.' };
    const res = await obsWs.toggleMicMute(String(payload.inputName || ''));
    return res?.ok !== false
      ? { ok: true, message: res?.muted ? 'Mikrofon stummgeschaltet.' : 'Mikrofon aktiviert.' }
      : { ok: false, error: res?.error || 'Mikrofon konnte nicht umgeschaltet werden.' };
  }

  if (act === 'poll_start') {
    const question = String(payload.question || 'Wie gefällt euch der Stream?').trim();
    const rawOpts = Array.isArray(payload.options) && payload.options.length >= 2 ? payload.options : ['Ja!', 'Nein'];
    activePoll = {
      active: true,
      visible: true,
      visibleWhenStopped: true,
      question,
      options: rawOpts.slice(0, 6).map((label) => ({ label: String(label).trim(), votes: 0 })),
      voters: {},
      totalVotes: 0
    };
    const snap = getSanitizedPoll();
    obsServer.broadcastPoll(snap);
    broadcastToWindows('poll-updated', snap);
    return { ok: true, message: `Umfrage "${question}" gestartet.` };
  }

  return { ok: false, error: `Unbekannter Sprachbefehl: ${act}` };
}

const voiceBridge = new VoiceControlBridge({ onCommand: executeVoiceCommand });
voiceBridge.on('state', (st) => broadcastToWindows('voice-state', st));
voiceBridge.on('config-updated', (vc) => {
  const cfg = loadConfig();
  cfg.voiceControl = normalizeVoiceConfig(vc);
  saveConfig(cfg);
});

let mainWindow = null;
let isAlwaysOnTop = false;
let demoInterval = null;
let demoActive = process.env.DEMO_MODE === 'true';
let lastGameCmdAt = 0;

let resolvingInitialLolIcon = false;
function normalizeSponsorsConfig(raw = {}) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const rawItems = Array.isArray(src.items) ? src.items : [];
  const items = rawItems.slice(0, 30).map((it, i) => ({
    id: String(it?.id || `sp_${i + 1}`).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || `sp_${i + 1}`,
    enabled: it?.enabled !== false,
    name: String(it?.name || '').trim().slice(0, 80),
    subtitle: String(it?.subtitle || '').trim().slice(0, 140),
    badge: String(it?.badge || 'WERBUNG').trim().slice(0, 24) || 'WERBUNG',
    url: String(it?.url || '').trim().slice(0, 300),
    imagePath: String(it?.imagePath || '').trim().slice(0, 400),
    imageUrl: String(it?.imageUrl || '').trim().slice(0, 400),
    accentColor: /^#[0-9a-fA-F]{6}$/.test(String(it?.accentColor || '')) ? it.accentColor : '#38bdf8',
    durationSec: Math.max(3, Math.min(600, parseInt(it?.durationSec ?? 15, 10) || 15))
  }));
  return {
    enabled: src.enabled !== false,
    pauseBetweenSec: Math.max(0, Math.min(300, parseInt(src.pauseBetweenSec ?? 0, 10) || 0)),
    showQrCode: src.showQrCode !== false,
    showProgressBar: src.showProgressBar !== false,
    activeIndex: Math.max(0, parseInt(src.activeIndex ?? 0, 10) || 0),
    items
  };
}

async function broadcastSponsorsToObs(cfg = loadConfig()) {
  const sp = normalizeSponsorsConfig(cfg.sponsors);
  const QRCode = require('qrcode');
  const port = obsServer.port || 4588;
  const enriched = [];
  for (const it of sp.items) {
    let qrDataUrl = '';
    if (sp.showQrCode && /^https?:\/\//i.test(it.url)) {
      try {
        qrDataUrl = await QRCode.toDataURL(it.url, { width: 140, margin: 1 });
      } catch (e) {}
    }
    const resolvedImageUrl = it.imagePath && fs.existsSync(it.imagePath)
      ? `http://127.0.0.1:${port}/api/sponsor-media/${encodeURIComponent(it.id)}?t=${Date.now()}`
      : it.imageUrl;
    enriched.push({ ...it, resolvedImageUrl, qrDataUrl });
  }
  const payload = { ...sp, items: enriched, revision: String(Date.now()) };
  obsServer.broadcastSponsors(payload);
  return payload;
}

function broadcastChampionThemeToObs(cfg = loadConfig()) {
  const packs = themePacks.listInstalledPacks(app.getPath('userData'));
  const active = themePacks.resolveActiveChampionTheme(cfg, packs);
  obsServer.broadcastChampionTheme(active || null);
  const rawMode = String(cfg.championThemeMode || 'none').trim();
  return { packs, active, mode: rawMode === 'auto' ? 'none' : rawMode };
}

function broadcastGameAddonsState(cfg) {
  const ga = gameAddons.normalizeGameAddonsConfig(cfg?.gameAddons);
  const obsPayload = gameAddons.buildObsGameStatsPayload({ ...cfg, gameAddons: ga });
  obsServer.broadcastGameStats(obsPayload);
  broadcastChampionThemeToObs({ ...cfg, gameAddons: ga });
  broadcastToWindows('game-addons-updated', {
    gameAddons: ga,
    activeObsPayload: obsPayload,
    addons: gameAddons.GAME_ADDONS
  });
  if (ga.perAddonStats?.lol?.champion && !ga.perAddonStats.lol.championIconUrl && !resolvingInitialLolIcon) {
    resolvingInitialLolIcon = true;
    gameAddons
      .resolveLolDdragonAssets(ga.perAddonStats.lol.champion, ga.perAddonStats.lol.skinId || 0, '')
      .then((dd) => {
        resolvingInitialLolIcon = false;
        if (!dd?.championIconUrl) return;
        const freshCfg = loadConfig();
        const freshGa = gameAddons.normalizeGameAddonsConfig(freshCfg.gameAddons);
        freshGa.perAddonStats.lol.championIconUrl = dd.championIconUrl;
        freshGa.perAddonStats.lol.skinIconUrl = dd.skinIconUrl;
        freshGa.perAddonStats.lol.skinSplashUrl = dd.skinSplashUrl;
        freshGa.perAddonStats.lol.skinName = dd.skinName;
        freshCfg.gameAddons = freshGa;
        saveConfig(freshCfg);
        broadcastGameAddonsState(freshCfg);
      })
      .catch(() => {
        resolvingInitialLolIcon = false;
      });
  }
}

function syncCurrentGameFromStreamManager(gameName) {
  const clean = String(gameName || '').trim();
  if (!clean) return;
  const cfg = loadConfig();
  const ga = gameAddons.normalizeGameAddonsConfig(cfg.gameAddons);
  if (ga.currentGameName === clean) return;
  ga.currentGameName = clean;
  cfg.gameAddons = ga;
  saveConfig(cfg);
  broadcastGameAddonsState(cfg);
  if (ga.selectedMode === 'auto') {
    const matched = gameAddons.matchAddonByGameName(clean);
    const addon = gameAddons.getAddonById(matched);
    appendDiagLog('system', 'info', `🎮 Auto-Switch: "${clean}" → ${addon.icon} ${addon.name}`);
  }
}

function handleIncomingGameWebhook(kind, body = {}) {
  const cfg = loadConfig();
  const ga = gameAddons.normalizeGameAddonsConfig(cfg.gameAddons);
  if (kind === 'cs2-gsi') {
    const ms = body?.player?.match_stats;
    const mapName = body?.map?.name || '';
    const ctScore = body?.map?.team_ct?.score;
    const tScore = body?.map?.team_t?.score;
    const cur = ga.perAddonStats.cs2 || {};
    const prevKills = Number(cur.kills || 0);
    if (ms) {
      cur.kills = Number(ms.kills ?? cur.kills ?? 0);
      cur.deaths = Number(ms.deaths ?? cur.deaths ?? 0);
      cur.assists = Number(ms.assists ?? cur.assists ?? 0);
      cur.mvps = Number(ms.mvps ?? cur.mvps ?? 0);
    }
    if (mapName) cur.map = mapName.replace(/^de_/, '');
    if (ctScore !== undefined && tScore !== undefined) cur.score = `${ctScore} : ${tScore}`;
    ga.perAddonStats.cs2 = cur;
    cfg.gameAddons = ga;
    saveConfig(cfg);
    broadcastGameAddonsState(cfg);

    const roundKills = Number(body?.player?.state?.round_kills || 0);
    if (ga.autoTriggerEvents && roundKills >= 3 && cur.kills > prevKills && twitch.connected) {
      twitch.createStreamMarker(`🎯 CS2 ${roundKills}K Highlight!`).catch(() => {});
    }
    return;
  }

  // Generic custom game webhook: { addonId?, stats?: { ... }, eventText?: string }
  const targetId = String(body.addonId || gameAddons.resolveActiveAddon(cfg).addon.id);
  if (!gameAddons.PRESET_ADDON_IDS.includes(targetId)) return;
  if (body.stats && typeof body.stats === 'object') {
    ga.perAddonStats[targetId] = gameAddons.sanitizeAddonStats(targetId, { ...(ga.perAddonStats[targetId] || {}), ...body.stats });
    cfg.gameAddons = ga;
    saveConfig(cfg);
    broadcastGameAddonsState(cfg);
  }
}

const twitch = new TwitchConnector();
const youtube = new YouTubeConnector();
const tiktok = new TikTokConnector();
const obsServer = new ObsServer(4588);
const obsWs = new ObsWsClient();
const emoteManager = new EmoteManager();

function isLoopbackHost(h) {
  const clean = String(h || '127.0.0.1').trim().toLowerCase();
  return clean === '127.0.0.1' || clean === 'localhost' || clean === '::1';
}

async function ensureObsWsConnected(explicitOpts = null) {
  if (!explicitOpts && obsWs.getState()?.connected) {
    return { ok: true, state: obsWs.getState(), reused: true };
  }
  const cfg = loadConfig();
  const savedOw = cfg.obsWs || {};
  const host = String(explicitOpts?.host || savedOw.host || '127.0.0.1').trim();
  let port = parseInt(explicitOpts?.port || savedOw.port || '4455', 10) || 4455;
  let rpcToken = explicitOpts?.password !== undefined ? String(explicitOpts.password) : String(savedOw.password || '');
  const micName = explicitOpts?.micName !== undefined ? String(explicitOpts.micName).trim() : String(savedOw.micName || '');

  const localInfo = isLoopbackHost(host) ? obsAutoConfig.readObsWebSocketLocalConfig() : { found: false };
  if (localInfo.found && !rpcToken && localInfo.rpcSecret) {
    rpcToken = localInfo.rpcSecret;
    port = localInfo.port || port;
  }

  const persistObsCfg = (p, tok) => {
    const fresh = loadConfig();
    fresh.obsWs = {
      ...(fresh.obsWs || {}),
      enabled: true,
      host,
      port: p,
      password: tok,
      micName
    };
    saveConfig(fresh);
  };

  try {
    const res = await obsWs.connect({ host, port, rpcToken, micName });
    persistObsCfg(port, rpcToken);
    return { ok: true, state: res.state, port };
  } catch (firstErr) {
    // Retry automatically with credentials read directly from local OBS installation if they differed
    if (localInfo.found && (localInfo.port !== port || localInfo.rpcSecret !== rpcToken)) {
      try {
        const retryRes = await obsWs.connect({
          host,
          port: localInfo.port || 4455,
          rpcToken: localInfo.rpcSecret || '',
          micName
        });
        persistObsCfg(localInfo.port || 4455, localInfo.rpcSecret || '');
        appendDiagLog('system', 'info', 'OBS WebSocket Zugangsdaten automatisch aus lokaler OBS-Konfiguration übernommen.');
        return { ok: true, state: retryRes.state, port: localInfo.port || 4455, autoRecovered: true };
      } catch (e) {}
    }

    // Ensure local OBS files are pre-provisioned (WebSocket enabled + EnableMultitrackVideo cleared) for next OBS start
    if (isLoopbackHost(host)) {
      obsAutoConfig.autoProvisionObsLocalFiles({ disableMultitrackVideo: true });
    }
    return { ok: false, error: firstErr.message, state: obsWs.getState(), localInfo };
  }
}

function buildObsStreamPrepOpts(cfg = loadConfig()) {
  const ms = normalizeRelayConfig(cfg?.multiStream || {});
  const relaySt = multiRelay.getState();
  if (relaySt?.active) {
    return {
      forceRelayUrl: `rtmp://127.0.0.1:${ms.port}/live`,
      forceRelayKey: ms.streamKey
    };
  }
  const dests = buildActiveDestinations(ms);
  if (dests.length >= 2) {
    const started = multiRelay.start(ms);
    if (started.ok) {
      return {
        forceRelayUrl: `rtmp://127.0.0.1:${ms.port}/live`,
        forceRelayKey: ms.streamKey
      };
    }
  } else if (dests.length === 1) {
    const single = ms.targets[dests[0].id] || {};
    const srv = String(single.serverUrl || '').trim();
    const k = String(single.streamKey || '').trim();
    if (srv && k) {
      return { fallbackServerUrl: srv, fallbackStreamKey: k };
    }
  }
  return {};
}
const spotify = new SpotifyBridge();
let lastSongReplyAt = 0;
let lastScheduleReplyAt = 0;
let lastObsStreaming = false;
let lastAutoGoLiveAt = 0;

const hypeTimestamps = [];
let lastHypeTriggerAt = 0;

const activeGiveaway = {
  active: false,
  visible: false,
  keyword: '!join',
  title: 'Stream-Verlosung',
  subMultiplier: 2,
  participants: [],
  winner: null,
  spinning: false
};

function broadcastGiveawayState() {
  const payload = { ...activeGiveaway, participants: activeGiveaway.participants.slice() };
  broadcastToWindows('giveaway-updated', payload);
  obsServer.broadcastGiveaway(payload);
}

function playSoundboardById(soundIdOrName) {
  const cfg = loadConfig();
  const sb = cfg.soundboard || {};
  const sounds = Array.isArray(sb.sounds) ? sb.sounds : [];
  const key = String(soundIdOrName || '').trim().toLowerCase();
  const item = sounds.find((s) => s.id === soundIdOrName || String(s.name || '').toLowerCase() === key);
  if (!item) return { ok: false, error: 'Sound nicht gefunden.' };

  const port = obsServer.port || 4588;
  const payload = {
    id: item.id,
    name: item.name,
    emoji: item.emoji || '🔊',
    builtin: item.builtin || '',
    url: item.filePath ? `http://127.0.0.1:${port}/api/sound/${encodeURIComponent(item.id)}?t=${Date.now()}` : '',
    volume: typeof sb.volume === 'number' ? sb.volume : 0.8
  };

  if (sb.routeToObs !== false) {
    obsServer.broadcastSound(payload);
  }
  if (sb.playLocally !== false) {
    broadcastToWindows('soundboard-play', payload);
  }
  return { ok: true, sound: item.name };
}

function getBuiltinObsOverlays(port = 4588) {
  const base = `http://127.0.0.1:${port}`;
  return [
    { id: 'chat', label: '💬 Multi-Chat Overlay (Twitch / YT / TikTok)', inputName: 'OmniGrid Chat', url: `${base}/`, width: 450, height: 700, posX: 24, posY: 340 },
    { id: 'alerts', label: '🔔 Stream-Alerts (Follow, Sub, Bits, Raid)', inputName: 'OmniGrid Alerts', url: `${base}/alerts`, width: 720, height: 260, posX: 600, posY: 40, rerouteAudio: true },
    { id: 'spotify', label: '🎵 Musik / Now Playing (Spotify, Apple, Amazon)', inputName: 'OmniGrid Musik', url: `${base}/spotify`, width: 460, height: 140, posX: 24, posY: 24 },
    { id: 'game-stats', label: '🎮 Game-Stats / LoL Champion, Skin & Letzte 6 Games', inputName: 'OmniGrid Game-Stats', url: `${base}/game-stats`, width: 430, height: 370, posX: 1460, posY: 24 },
    { id: 'lol-bg', label: '🖼️ LoL-Client Frame & Animierter Hintergrund (1920×1080, Champion-Theme)', inputName: 'OmniGrid LoL-Client Frame', url: `${base}/lol-bg`, width: 1920, height: 1080, posX: 0, posY: 0 },
    { id: 'lol-ability-bar', label: '⚔️ LoL Ability-Bar Rahmen (920×175, Champion-Theme)', inputName: 'OmniGrid LoL-Ability-Bar', url: `${base}/lol-ability-bar`, width: 920, height: 175, posX: 500, posY: 905 },
    { id: 'lol-build', label: '⚔️ LoL Live Item-Build & Elo-Bar', inputName: 'OmniGrid LoL-Build', url: `${base}/lol-build`, width: 550, height: 125, posX: 685, posY: 940 },
    { id: 'lol-map', label: '🛡️ LoL Minimap-Cover (Anti-Ghosting)', inputName: 'OmniGrid LoL-Minimap', url: `${base}/lol-map`, width: 280, height: 280, posX: 1640, posY: 800 },
    { id: 'jc-lowerthird', label: '🎙️ Just Chatting Bauchbinde (Thema & Ticker)', inputName: 'OmniGrid JC Bauchbinde', url: `${base}/jc-lowerthird`, width: 920, height: 145, posX: 500, posY: 910 },
    { id: 'jc-qna', label: '❓ Just Chatting Viewer Q&A Spotlight', inputName: 'OmniGrid JC Q&A', url: `${base}/jc-qna`, width: 640, height: 220, posX: 640, posY: 665 },
    { id: 'tron-talk', label: '💠 TRON Tech Talk & GameDev Bauchbinde', inputName: 'OmniGrid TRON Tech-Talk', url: `${base}/tron-talk`, width: 980, height: 170, posX: 470, posY: 890 },
    { id: 'product-lowerthird', label: '🎯 Produkt-Präsentation Keynote-Bauchbinde (Klassisch Modern)', inputName: 'OmniGrid Produkt Bauchbinde', url: `${base}/product-lowerthird`, width: 980, height: 150, posX: 470, posY: 905 },
    { id: 'product-card', label: '🏷️ Produkt-Spotlight-Karte (Features & Preis)', inputName: 'OmniGrid Produkt Karte', url: `${base}/product-card`, width: 480, height: 340, posX: 1410, posY: 320 },
    { id: 'dj-stage', label: '🎧 DJ Stream 36-Band Audio-EQ Bühne (Multi-Color)', inputName: 'OmniGrid DJ Stage EQ', url: `${base}/dj-stage`, width: 1920, height: 220, posX: 0, posY: 860 },
    { id: 'dj-nowplaying', label: '💿 DJ Stream Vinyl & BPM Deck (Audio-Reaktiv)', inputName: 'OmniGrid DJ Deck', url: `${base}/dj-nowplaying`, width: 520, height: 145, posX: 32, posY: 32 },
    { id: 'val-bar', label: '🔫 Valorant Rank, RR & Match-Bar', inputName: 'OmniGrid Valorant Bar', url: `${base}/val-bar`, width: 560, height: 125, posX: 680, posY: 940 },
    { id: 'val-map', label: '🛡️ Valorant Radar-Cover (Anti-Snipe oben links)', inputName: 'OmniGrid Valorant Radar', url: `${base}/val-map`, width: 310, height: 310, posX: 16, posY: 16 },
    { id: 'goals', label: '🎯 Stream-Goals (Follower / Subs / Spenden)', inputName: 'OmniGrid Goals', url: `${base}/goals`, width: 460, height: 220, posX: 24, posY: 175 },
    { id: 'poll', label: '📊 Live-Umfrage (Poll)', inputName: 'OmniGrid Umfrage', url: `${base}/poll`, width: 460, height: 300, posX: 1430, posY: 355 },
    { id: 'giveaway', label: '🎁 Giveaway / Gewinnspiel', inputName: 'OmniGrid Giveaway', url: `${base}/giveaway`, width: 480, height: 300, posX: 720, posY: 390 },
    { id: 'schedule', label: '📅 Stream-Sendeplan', inputName: 'OmniGrid Sendeplan', url: `${base}/schedule`, width: 620, height: 440, posX: 650, posY: 320 },
    { id: 'sponsors', label: '🏷️ Werbepartner / Sponsoren-Banner', inputName: 'OmniGrid Werbepartner', url: `${base}/sponsors`, width: 460, height: 175, posX: 1435, posY: 885 },
    { id: 'soundboard', label: '🔊 Soundboard Audio-Player', inputName: 'OmniGrid Soundboard', url: `${base}/soundboard`, width: 320, height: 120, posX: 24, posY: 940, rerouteAudio: true }
  ];
}

function broadcastScheduleToObs(cfg) {
  const ss = socialSchedule.normalizeSocialScheduleConfig(cfg?.socialSchedule);
  const channel = cfg?.streamerName || cfg?.twitchChannel || 'Stream';
  const entries = socialSchedule.getUpcomingEntries(ss.schedule, 10);
  obsServer.broadcastSchedule({ channel, entries });
}

// ======================================================
// DISCORD LIVE-ANNOUNCER
// Eine Nachricht pro Stream (kein Doppel-Post bei OBS + Twitch), die während
// des Streams live aktualisiert und am Ende auf "Stream beendet" umgestellt wird.
// ======================================================
const DISCORD_LIVE_UPDATE_MS = 5 * 60 * 1000;
const DISCORD_LIVE_MAX_AGE_MS = 48 * 60 * 60 * 1000;
let discordLiveTimer = null;
let discordLivePeak = 0;
let twitchLiveState = null; // null = unbekannt, true/false = letzter bekannter Twitch-Status
let twitchOfflineStrikes = 0;

function getDiscordLiveSession(cfg) {
  const s = cfg?.discordLiveSession;
  if (!s || !s.messageId || !s.webhookUrl || s.phase !== 'live') return null;
  if (Date.now() - Number(s.startedAt || 0) > DISCORD_LIVE_MAX_AGE_MS) return null;
  return s;
}

function saveDiscordLiveSession(session) {
  const cfg = loadConfig();
  cfg.discordLiveSession = session || null;
  saveConfig(cfg);
  broadcastToWindows('discord-live-state', publicDiscordLiveState(session));
}

function publicDiscordLiveState(session) {
  if (!session) return { active: false };
  return {
    active: true,
    startedAt: session.startedAt,
    source: session.source,
    title: session.meta?.title || '',
    game: session.meta?.game || '',
    peakViewers: Math.max(Number(session.peakViewers || 0), discordLivePeak)
  };
}

function currentTotalViewers() {
  return ['twitch', 'youtube', 'tiktok', 'kick'].reduce((acc, p) => acc + (Number(platformStatus?.[p]?.viewers) || 0), 0);
}

async function fetchLiveMeta(cfg, base = {}) {
  const meta = {
    channel: cfg.streamerName || cfg.twitchChannel || 'Stream',
    title: base.title || '',
    game: base.game || '',
    tags: Array.isArray(base.tags) ? base.tags : [],
    message: base.message || ''
  };
  if (twitch.connected && (!meta.title || !meta.game)) {
    try {
      const info = await twitch.getChannelInfo();
      meta.title = meta.title || info.title || '';
      meta.game = meta.game || info.gameName || '';
      if (!meta.tags.length && Array.isArray(info.tags)) meta.tags = info.tags;
    } catch (e) {}
  }
  return meta;
}

function ensureDiscordLiveTimer() {
  if (discordLiveTimer) return;
  discordLiveTimer = setInterval(() => {
    refreshDiscordLiveAnnouncement().catch((err) => appendDiagLog('system', 'warn', `Discord Live-Update Fehler: ${err.message}`));
  }, DISCORD_LIVE_UPDATE_MS);
}

function stopDiscordLiveTimer() {
  if (discordLiveTimer) clearInterval(discordLiveTimer);
  discordLiveTimer = null;
}

async function startDiscordLiveAnnouncement(cfg, opts = {}) {
  const ss = socialSchedule.normalizeSocialScheduleConfig(cfg.socialSchedule);
  if (!ss.discord.webhookUrl) throw new Error('Keine Discord Go-Live Webhook-URL eingetragen.');
  const existing = getDiscordLiveSession(cfg);
  if (existing && !opts.force) {
    ensureDiscordLiveTimer();
    return { ok: true, skipped: true, messageId: existing.messageId };
  }
  const meta = opts.meta ? { ...opts.meta } : await fetchLiveMeta(cfg);
  const startedAt = Date.now();
  const viewers = currentTotalViewers();
  const res = await socialSchedule.postDiscordGoLive(cfg, meta, { startedAt, viewers });
  discordLivePeak = viewers;
  if (res.messageId) {
    saveDiscordLiveSession({
      messageId: res.messageId,
      webhookUrl: ss.discord.webhookUrl,
      startedAt,
      peakViewers: viewers,
      phase: 'live',
      source: opts.source || 'manual',
      meta
    });
    ensureDiscordLiveTimer();
  }
  appendDiagLog('system', 'info', `📢 Discord Live-Announcer: Go-Live gepostet (${opts.source || 'manuell'}).`);
  return { ok: true, messageId: res.messageId };
}

async function refreshDiscordLiveAnnouncement() {
  const cfg = loadConfig();
  const ss = socialSchedule.normalizeSocialScheduleConfig(cfg.socialSchedule);
  const s = getDiscordLiveSession(cfg);
  if (!s) {
    stopDiscordLiveTimer();
    return;
  }
  const viewers = currentTotalViewers();
  discordLivePeak = Math.max(discordLivePeak, viewers, Number(s.peakViewers || 0));
  s.peakViewers = discordLivePeak;
  if (ss.discord.liveUpdate !== false) {
    const fresh = await fetchLiveMeta(cfg);
    s.meta = {
      ...(s.meta || {}),
      title: fresh.title || s.meta?.title || '',
      game: fresh.game || s.meta?.game || '',
      tags: fresh.tags?.length ? fresh.tags : s.meta?.tags || []
    };
    await socialSchedule.updateDiscordLiveMessage(cfg, s.webhookUrl, s.messageId, s.meta, {
      phase: 'live',
      startedAt: s.startedAt,
      viewers
    });
  }
  saveDiscordLiveSession(s);
}

async function endDiscordLiveAnnouncement(reason = 'manual') {
  stopDiscordLiveTimer();
  const cfg = loadConfig();
  const ss = socialSchedule.normalizeSocialScheduleConfig(cfg.socialSchedule);
  const s = getDiscordLiveSession(cfg);
  if (!s) return { ok: true, skipped: true };
  const peak = Math.max(discordLivePeak, Number(s.peakViewers || 0), currentTotalViewers());
  let error = '';
  if (ss.discord.editOnEnd !== false) {
    try {
      await socialSchedule.updateDiscordLiveMessage(cfg, s.webhookUrl, s.messageId, s.meta || {}, {
        phase: 'ended',
        startedAt: s.startedAt,
        endedAt: Date.now(),
        peakViewers: peak
      });
    } catch (err) {
      error = err.message;
      appendDiagLog('system', 'warn', `Discord Live-Announcer: Stream-Ende konnte nicht eingetragen werden: ${err.message}`);
    }
  }
  discordLivePeak = 0;
  saveDiscordLiveSession(null);
  appendDiagLog('system', 'info', `⚫ Discord Live-Announcer: Stream als beendet markiert (${reason}).`);
  return { ok: !error, error };
}

function handleTwitchLiveTransition(isLive) {
  const cfg = loadConfig();
  const ss = socialSchedule.normalizeSocialScheduleConfig(cfg.socialSchedule);
  const autoTwitch = Boolean(ss.discord.enabled && ss.discord.autoPostOnTwitchLive && ss.discord.webhookUrl);
  if (isLive) {
    twitchOfflineStrikes = 0;
    if (twitchLiveState !== true) {
      twitchLiveState = true;
      if (autoTwitch) {
        startDiscordLiveAnnouncement(cfg, { source: 'twitch' }).catch((err) =>
          appendDiagLog('system', 'warn', `Discord Live-Announcer Fehler: ${err.message}`)
        );
      }
    }
    return;
  }
  const session = getDiscordLiveSession(cfg);
  if (twitchLiveState === true) {
    twitchOfflineStrikes += 1;
    // 2 Offline-Meldungen in Folge (~60 s), damit kurze Twitch-Aussetzer nichts beenden
    if (twitchOfflineStrikes >= 2) {
      twitchLiveState = false;
      if (session && (session.source === 'twitch' || autoTwitch)) {
        endDiscordLiveAnnouncement('Twitch offline').catch(() => {});
      }
    }
  } else if (twitchLiveState === null) {
    twitchLiveState = false;
    // App wurde nach Stream-Ende neu gestartet → alte Live-Nachricht abschließen
    if (session && session.source === 'twitch') endDiscordLiveAnnouncement('Twitch offline (nach Neustart)').catch(() => {});
  }
}

async function executeGoLivePost(cfg, payload = {}) {
  const ss = socialSchedule.normalizeSocialScheduleConfig(cfg.socialSchedule);
  const targets = payload.targets || {};
  const meta = {
    channel: cfg.streamerName || cfg.twitchChannel || 'Stream',
    title: payload.title || '',
    game: payload.game || '',
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    message: payload.message || ''
  };
  if (!meta.title && twitch.connected) {
    try {
      const info = await twitch.getChannelInfo();
      meta.title = info.title || meta.title;
      meta.game = info.gameName || meta.game;
      if (!meta.tags.length && Array.isArray(info.tags)) meta.tags = info.tags;
    } catch (e) {}
  }

  const posted = [];
  const errors = [];

  if (targets.discord ?? ss.discord.enabled) {
    try {
      const dRes = await startDiscordLiveAnnouncement(cfg, {
        meta,
        force: payload.force !== false,
        source: payload.source || 'manual'
      });
      posted.push(dRes.skipped ? 'Discord (bereits angekündigt)' : 'Discord');
    } catch (e) {
      errors.push(`Discord: ${e.message}`);
    }
  }
  const text = socialSchedule.formatGoLiveText(cfg, meta);
  if (targets.bluesky ?? ss.bluesky.enabled) {
    try {
      await socialSchedule.postBluesky(cfg, text);
      posted.push('Bluesky');
    } catch (e) {
      errors.push(`Bluesky: ${e.message}`);
    }
  }
  if (targets.mastodon ?? ss.mastodon.enabled) {
    try {
      await socialSchedule.postMastodon(cfg, text);
      posted.push('Mastodon');
    } catch (e) {
      errors.push(`Mastodon: ${e.message}`);
    }
  }
  if (targets.x ?? ss.x.enabled) {
    try {
      await socialSchedule.postX(cfg, text);
      posted.push('X');
    } catch (e) {
      errors.push(`X: ${e.message}`);
    }
  }
  if (targets.instagram ?? ss.instagram.enabled) {
    try {
      const caption = socialSchedule.formatInstagramCaption(cfg, meta, 'golive');
      await socialSchedule.postInstagramGraph(cfg, {
        caption,
        imageUrl: payload.imageUrl || '',
        imageBase64: payload.imageBase64 || ''
      });
      posted.push('Instagram');
    } catch (e) {
      errors.push(`Instagram: ${e.message}`);
    }
  }
  return { ok: errors.length === 0 || posted.length > 0, posted, errors, text };
}

async function executeSchedulePost(cfg, payload = {}) {
  const ss = socialSchedule.normalizeSocialScheduleConfig(cfg.socialSchedule);
  const targets = payload.targets || {};
  const posted = [];
  const errors = [];

  if (targets.discord ?? ss.discord.enabled) {
    try {
      await socialSchedule.postDiscordSchedule(cfg);
      posted.push('Discord');
    } catch (e) {
      errors.push(`Discord: ${e.message}`);
    }
  }
  const text = socialSchedule.formatScheduleText(cfg, 6);
  if (targets.bluesky ?? ss.bluesky.enabled) {
    try {
      await socialSchedule.postBluesky(cfg, text);
      posted.push('Bluesky');
    } catch (e) {
      errors.push(`Bluesky: ${e.message}`);
    }
  }
  if (targets.mastodon ?? ss.mastodon.enabled) {
    try {
      await socialSchedule.postMastodon(cfg, text);
      posted.push('Mastodon');
    } catch (e) {
      errors.push(`Mastodon: ${e.message}`);
    }
  }
  if (targets.x ?? ss.x.enabled) {
    try {
      await socialSchedule.postX(cfg, text);
      posted.push('X');
    } catch (e) {
      errors.push(`X: ${e.message}`);
    }
  }
  if (targets.instagram ?? ss.instagram.enabled) {
    try {
      const caption = socialSchedule.formatInstagramCaption(cfg, {}, 'schedule');
      await socialSchedule.postInstagramGraph(cfg, {
        caption,
        imageUrl: payload.imageUrl || '',
        imageBase64: payload.imageBase64 || ''
      });
      posted.push('Instagram');
    } catch (e) {
      errors.push(`Instagram: ${e.message}`);
    }
  }
  return { ok: errors.length === 0 || posted.length > 0, posted, errors, text };
}

// Global deduplication ring buffer across all connectors & reconnects
const globalSeenMsgKeys = new Set();

function isDuplicateMessage(msg) {
  if (!msg) return true;
  const idKey = `${msg.platform}:${msg.id}`;
  // Secondary fingerprint (same platform + author + text within 4-second bucket)
  const timeBucket = Math.floor((msg.timestamp || Date.now()) / 4000);
  const contentKey = `${msg.platform}:${(msg.author || '').toLowerCase()}:${msg.text}:${timeBucket}`;

  if (globalSeenMsgKeys.has(idKey) || (!msg.isSelf && globalSeenMsgKeys.has(contentKey))) {
    return true;
  }

  globalSeenMsgKeys.add(idKey);
  globalSeenMsgKeys.add(contentKey);

  if (globalSeenMsgKeys.size > 3000) {
    const iter = globalSeenMsgKeys.values();
    for (let i = 0; i < 500; i++) {
      globalSeenMsgKeys.delete(iter.next().value);
    }
  }
  return false;
}

const platformStatus = {
  twitch: { status: 'disconnected', channel: '', viewers: 0, enabled: true },
  youtube: { status: 'disconnected', channel: '', viewers: 0, enabled: true, availableStreams: [] },
  tiktok: { status: 'disconnected', channel: '', viewers: 0, likes: 0, enabled: true }
};

let chatDockWindow = null;
let helpWindow = null;
let preHelpMainBounds = null;
let isAppShuttingDown = false;
let boundsSaveTimer = null;

function broadcastToWindows(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
  if (chatDockWindow && !chatDockWindow.isDestroyed()) {
    chatDockWindow.webContents.send(channel, payload);
  }
  if (typeof helpWindow !== 'undefined' && helpWindow && !helpWindow.isDestroyed()) {
    helpWindow.webContents.send(channel, payload);
  }
}

function getConfigPath() {
  const userDataDir = app.getPath('userData');
  const target = path.join(userDataDir, 'omnichat-config.json');
  if (!fs.existsSync(target)) {
    const legacyPath = path.join(path.dirname(userDataDir), 'omni-stream-chat', 'omnichat-config.json');
    if (fs.existsSync(legacyPath)) {
      try {
        fs.mkdirSync(userDataDir, { recursive: true });
        fs.copyFileSync(legacyPath, target);
      } catch (e) {}
    }
  }
  return target;
}

let cachedConfig = null;
const diagnosticLogs = [];

function appendDiagLog(platform, level, message) {
  const entry = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    platform: platform || 'system',
    level: level || 'info',
    message: String(message || '')
  };
  diagnosticLogs.push(entry);
  if (diagnosticLogs.length > 200) {
    diagnosticLogs.shift();
  }
  broadcastToWindows('diag-log', entry);
}

function getDefaultConfig() {
  return {
    streamerName: '',
    quickSetupCompleted: false,
    keywordAlerts: '',
    keywordSound: true,
    keywordColor: '#f97316',
    autoConnectOnStart: true,
    soundAlerts: true,
    compactChat: false,
    spotifyEnabled: true,
    spotifyAutoCommand: true,
    obsAlerts: {
      enabled: true,
      durationSec: 5,
      soundEnabled: true,
      animation: 'pop',
      types: {
        follow: true,
        sub: true,
        resub: true,
        subgift: true,
        bits: true,
        raid: true
      },
      customMedia: {}
    },
    obsGoals: {
      enabled: true,
      title: 'Sub-Goal',
      current: 0,
      target: 50,
      autoFollow: false,
      autoSub: true,
      barColor: '#9146ff'
    },
    tts: {
      enabled: false,
      readAlerts: true,
      readChatCommand: true,
      commandPrefix: '!tts',
      maxLength: 180,
      rate: 1.0,
      volume: 0.9,
      voiceURI: ''
    },
    obsWs: {
      enabled: false,
      host: '127.0.0.1',
      port: 4455,
      password: '',
      micName: '',
      sceneEditorEnabled: false
    },
    elgatoLights: {
      ips: '',
      autoOnLive: true,
      autoOffStop: false,
      brightness: 60,
      temperatureK: 4500
    },
    hueLights: hueLights.DEFAULT_HUE_CONFIG,
    nanoleafLights: nanoleafLights.DEFAULT_NANOLEAF_CONFIG,
    goveeLights: {
      enabled: false,
      apiKey: '',
      sku: '',
      device: '',
      deviceName: '',
      revertAfterSec: 8,
      cachedDevices: [],
      cachedScenes: [],
      eventScenes: {
        streamStart: '',
        streamStop: '',
        defaultScene: '',
        follow: '',
        sub: '',
        resub: '',
        subgift: '',
        bits: '',
        raid: '',
        hype: ''
      }
    },
    multiStream: normalizeRelayConfig({}),
    chatTimers: {
      enabled: false,
      intervalMin: 15,
      messages: ['Schaut gerne auf unserem Discord vorbei!']
    },
    autoMod: {
      enabled: false,
      blockLinks: true,
      blockCaps: false,
      capsPercent: 75,
      blockSymbols: false,
      blacklist: '',
      timeoutSec: 60,
      exemptMods: true
    },
    customCommands: {
      enabled: false,
      cooldownSec: 10,
      rules: [
        '!discord | Komm gerne auf unseren Discord!',
        '!lurk | Danke für den Lurk, @{user}!'
      ]
    },
    socialSchedule: socialSchedule.DEFAULT_SOCIAL_SCHEDULE,
    hypeDetector: {
      enabled: false,
      windowSec: 10,
      minMessages: 12,
      cooldownSec: 90,
      autoMarker: true,
      autoObsReplay: false,
      autoClip: true,
      postClipToChat: true,
      keywordHits: 3,
      keywords: 'pog,poggers,lul,omegalul,kekw,gg,wtf,clip,hype'
    },
    gameAddons: gameAddons.normalizeGameAddonsConfig({}),
    soundboard: {
      volume: 0.8,
      playLocally: true,
      routeToObs: true,
      sounds: [
        { id: 'sb_airhorn', name: 'Airhorn', emoji: '🎺', builtin: 'airhorn', filePath: '' },
        { id: 'sb_rimshot', name: 'Rimshot', emoji: '🥁', builtin: 'rimshot', filePath: '' },
        { id: 'sb_ding', name: 'Ding', emoji: '🔔', builtin: 'ding', filePath: '' },
        { id: 'sb_alarm', name: 'Alarm', emoji: '🚨', builtin: 'alarm', filePath: '' }
      ]
    },
    hideBots: false,
    collapseSpam: true,
    language: 'de',
    platformIndicatorStyle: 'icon_badge',
    mainWindowBounds: null,
    chatDockBounds: null,
    chatDockOpen: false,
    chatDockAlwaysOnTop: true,
    appearance: {
      layoutMode: 'inline',
      obsChatTheme: 'auto',
      nameFontSize: 13,
      msgFontSize: 13.5,
      maxNameLength: 16,
      showPlatformIcons: true,
      showTimestamps: true,
      msgPadding: 5,
      maxDomMessages: 150,
      showSeparator: true,
      sepColor: '#ffffff',
      sepOpacity: 8,
      sepSpacing: 0,
      bgColor: '#0b0f19',
      bgOpacity: 100,
      obsBgOpacity: 60,
      usernameColorMode: 'user',
      eventHighlights: {
        style: 'bar', // 'bar' (Kompakt-Balken + Hintergrund) | 'banner' (Voll-Banner) | 'outline' (Dezenter Rahmen)
        intensity: 18, // 5..60% background tint opacity
        types: {
          follow: { enabled: true, color: '#10b981' },
          sub: { enabled: true, color: '#f59e0b' },
          resub: { enabled: true, color: '#a855f7' },
          subgift: { enabled: true, color: '#ec4899' },
          bits: { enabled: true, color: '#06b6d4' },
          raid: { enabled: true, color: '#ef4444' },
          highlighted_msg: { enabled: true, color: '#3b82f6' }
        }
      }
    },
    emoteSettings: {
      enable7tv: true,
      enableBttv: true,
      enableFfz: true,
      enableTwitchNative: true,
      enableYoutubeNative: true,
      enableTiktokNative: true,
      animateEmotes: true
    },
    mutedUsers: [],
    peripherals: {
      keyboardId: '',
      keyboardName: '',
      mouseId: '',
      mouseName: '',
      keyboardMode: 'chat_and_macros',
      mouseScrollChat: true,
      globalHotkeysEnabled: true,
      hotkeys: {
        pinLast: 'CommandOrControl+Alt+P',
        unpin: 'CommandOrControl+Alt+U',
        clearChat: 'CommandOrControl+Alt+C',
        toggleCompact: 'CommandOrControl+Alt+K'
      }
    },
    twitchEnabled: true,
    twitchChannel: '',
    twitchUsername: '',
    twitchToken: '',
    youtubeEnabled: true,
    youtubeChannel: '',
    youtubeVideoId: '',
    youtubeOAuth: {
      clientId: '',
      clientSecret: '',
      accessToken: '',
      refreshToken: '',
      expiresAt: 0,
      accountName: ''
    },
    tiktokEnabled: true,
    tiktokChannel: '',
    tiktokRoomId: ''
  };
}

function loadConfig(forceReload = false) {
  if (cachedConfig && !forceReload) {
    return cachedConfig;
  }
  const defaults = getDefaultConfig();
  try {
    const p = getConfigPath();
    if (fs.existsSync(p)) {
      const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
      const mergedAppearance = { ...defaults.appearance, ...(parsed.appearance || {}) };
      if (parsed.appearance?.eventHighlights) {
        mergedAppearance.eventHighlights = {
          ...defaults.appearance.eventHighlights,
          ...parsed.appearance.eventHighlights,
          types: {
            ...defaults.appearance.eventHighlights.types,
            ...(parsed.appearance.eventHighlights.types || {})
          }
        };
      }
      cachedConfig = {
        ...defaults,
        ...parsed,
        appearance: mergedAppearance,
        emoteSettings: { ...defaults.emoteSettings, ...(parsed.emoteSettings || {}) }
      };
      return cachedConfig;
    }
  } catch (e) {}
  cachedConfig = defaults;
  return cachedConfig;
}

function saveConfig(cfg) {
  cachedConfig = cfg;
  try {
    fs.writeFileSync(getConfigPath(), JSON.stringify(cfg, null, 2), 'utf8');
  } catch (e) {}
}

function persistWindowBounds(key, win) {
  if (isAppShuttingDown || !win || win.isDestroyed()) return;
  clearTimeout(boundsSaveTimer);
  boundsSaveTimer = setTimeout(() => {
    if (isAppShuttingDown || !win || win.isDestroyed()) return;
    const cfg = loadConfig();
    cfg[key] = win.getBounds();
    saveConfig(cfg);
  }, 400);
}

function getAppIconPath() {
  const file = process.platform === 'win32' ? 'icon.ico' : 'icon.png';
  const p = path.join(__dirname, '..', 'assets', file);
  return fs.existsSync(p) ? p : undefined;
}

function createMainWindow() {
  if (process.platform === 'darwin' && app.dock) {
    const dockIcon = path.join(__dirname, '..', 'assets', 'icon.png');
    if (fs.existsSync(dockIcon)) {
      try { app.dock.setIcon(dockIcon); } catch (e) {}
    }
  }
  const saved = loadConfig();
  const b = saved.mainWindowBounds;

  mainWindow = new BrowserWindow({
    x: b?.x,
    y: b?.y,
    width: b?.width || 1180,
    height: b?.height || 820,
    minWidth: 220,
    minHeight: 360,
    backgroundColor: '#0b0f19',
    icon: getAppIconPath(),
    title: 'OmniGrid Studio — Dein Streamer Cockpit (Twitch • YouTube • TikTok)',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.on('resize', () => persistWindowBounds('mainWindowBounds', mainWindow));
  mainWindow.on('move', () => persistWindowBounds('mainWindowBounds', mainWindow));

  mainWindow.on('close', () => {
    isAppShuttingDown = true;
    clearTimeout(boundsSaveTimer);
    if (preHelpMainBounds) {
      const cfg = loadConfig();
      cfg.mainWindowBounds = preHelpMainBounds;
      saveConfig(cfg);
      preHelpMainBounds = null;
    }
    for (const win of BrowserWindow.getAllWindows()) {
      if (win !== mainWindow && !win.isDestroyed()) {
        try {
          win.destroy();
        } catch (e) {}
      }
    }
    helpWindow = null;
    chatDockWindow = null;
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    try {
      obsServer.stop();
    } catch (e) {}
    app.quit();
  });
}

/**
 * Opens or focuses the standalone, freely movable & resizable Chat-Dock Window
 * Ideal for placing full-height on the left side of OBS while keeping normal OBS docks intact!
 */
function openStandaloneChatWindow(snapLeftFullHeight = false) {
  const { screen } = require('electron');
  const workArea = screen.getPrimaryDisplay().workArea;
  const saved = loadConfig();

  const defaultBounds = {
    x: workArea.x,
    y: workArea.y,
    width: 320,
    height: workArea.height
  };
  const b = snapLeftFullHeight ? defaultBounds : saved.chatDockBounds || defaultBounds;

  if (chatDockWindow && !chatDockWindow.isDestroyed()) {
    if (snapLeftFullHeight) {
      chatDockWindow.setBounds(defaultBounds);
      persistWindowBounds('chatDockBounds', chatDockWindow);
    }
    chatDockWindow.focus();
    return;
  }

  chatDockWindow = new BrowserWindow({
    x: b.x,
    y: b.y,
    width: Math.max(220, b.width || 320),
    height: Math.max(360, b.height || workArea.height),
    minWidth: 220,
    minHeight: 320,
    backgroundColor: '#0b0f19',
    icon: getAppIconPath(),
    title: 'OmniGrid Studio — Standalone Chat-Fenster (Links neben OBS)',
    alwaysOnTop: saved.chatDockAlwaysOnTop !== false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (saved.chatDockAlwaysOnTop !== false) {
    chatDockWindow.setAlwaysOnTop(true, 'floating');
  }

  chatDockWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'), {
    query: { standalone: '1' }
  });

  chatDockWindow.webContents.on('did-finish-load', () => {
    const cfg = loadConfig();
    chatDockWindow.webContents.send('init-state', {
      config: cfg,
      obsUrl: `http://127.0.0.1:${obsServer.port}`,
      obsDockUrl: `http://127.0.0.1:${obsServer.port}/dock`,
      platformStatus,
      isAlwaysOnTop: cfg.chatDockAlwaysOnTop !== false,
      demoActive,
      isStandaloneWindow: true
    });
  });

  chatDockWindow.on('resize', () => persistWindowBounds('chatDockBounds', chatDockWindow));
  chatDockWindow.on('move', () => persistWindowBounds('chatDockBounds', chatDockWindow));

  chatDockWindow.on('closed', () => {
    chatDockWindow = null;
    if (!isAppShuttingDown) {
      const cfg = loadConfig();
      cfg.chatDockOpen = false;
      saveConfig(cfg);
    }
  });

  saved.chatDockOpen = true;
  if (snapLeftFullHeight) {
    saved.chatDockBounds = defaultBounds;
  }
  saveConfig(saved);
}

function isMentionForStreamer(text, cfg) {
  if (!text) return false;
  const lower = text.toLowerCase();
  const candidates = [
    cfg.streamerName,
    cfg.twitchChannel,
    cfg.youtubeChannel?.replace(/^@/, ''),
    cfg.tiktokChannel?.replace(/^@/, '')
  ]
    .filter(Boolean)
    .map((s) => s.trim().toLowerCase());

  for (const name of candidates) {
    if (name.length >= 2 && (lower.includes(`@${name}`) || lower.includes(name))) {
      return true;
    }
  }
  return false;
}

function matchKeywordAlert(text, cfg) {
  if (!text || !cfg?.keywordAlerts) return null;
  const lower = text.toLowerCase();
  const terms = String(cfg.keywordAlerts)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length >= 2);

  for (const kw of terms) {
    if (lower.includes(kw)) {
      return kw;
    }
  }
  return null;
}

const PRIVILEGED_BADGES = new Set(['STREAMER', 'BROADCASTER', 'OWNER', 'MODERATOR', 'VIP']);

function checkAutoMod(msg, cfg) {
  const am = cfg.autoMod;
  if (!am || !am.enabled || msg.isSelf || msg.eventType) return false;
  if (am.exemptMods !== false && Array.isArray(msg.badges)) {
    if (msg.badges.some((b) => PRIVILEGED_BADGES.has(String(b).toUpperCase()))) return false;
  }
  const text = String(msg.text || '');
  let reason = '';

  if (am.blockLinks && /(https?:\/\/[^\s]+|www\.[^\s]+|\b[a-z0-9-]+\.(?:com|de|net|org|tv|gg|io|me|xyz|ly)\b)/i.test(text)) {
    reason = 'Link blockiert';
  }
  if (!reason && am.blockCaps) {
    const letters = text.replace(/[^a-zA-ZäöüÄÖÜß]/g, '');
    if (letters.length >= 8) {
      const upper = letters.replace(/[^A-ZÄÖÜ]/g, '').length;
      if ((upper / letters.length) * 100 >= (Number(am.capsPercent) || 75)) {
        reason = 'Caps-Spam';
      }
    }
  }
  if (!reason && am.blockSymbols) {
    const symbols = text.replace(/[a-zA-Z0-9äöüÄÖÜß\s.,!?'"():-]/g, '');
    if (symbols.length >= 10 && symbols.length / Math.max(1, text.length) > 0.45) {
      reason = 'Symbol-Spam';
    }
  }
  if (!reason && am.blacklist) {
    const words = String(am.blacklist)
      .split(',')
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length >= 2);
    const low = text.toLowerCase();
    const hit = words.find((w) => low.includes(w));
    if (hit) reason = `Blacklist ("${hit}")`;
  }

  if (!reason) return false;

  appendDiagLog(msg.platform, 'warn', `🛡️ Auto-Mod (${reason}): ${msg.author} — "${text}"`);
  if (msg.platform === 'twitch' && twitch.connected && twitch.canWrite) {
    const tSec = Math.max(0, parseInt(am.timeoutSec ?? 60, 10) || 0);
    try {
      if (tSec > 0) twitch.sendMessage(`/timeout ${msg.author} ${tSec} Auto-Mod: ${reason}`);
      else if (msg.id) twitch.sendMessage(`/delete ${msg.id}`);
    } catch (e) {}
  }
  return true;
}

let chatTimerHandle = null;
let chatTimerIndex = 0;

async function runChatTimerTick(force = false) {
  const cfg = loadConfig();
  const ct = cfg.chatTimers;
  if (!force && (!ct || !ct.enabled)) return { ok: false, error: 'Chat-Timer ist deaktiviert.' };
  const lines = Array.isArray(ct?.messages)
    ? ct.messages.map((s) => String(s || '').trim()).filter(Boolean)
    : [];
  if (lines.length === 0) return { ok: false, error: 'Keine Timer-Nachrichten eingetragen.' };

  const text = lines[chatTimerIndex % lines.length];
  chatTimerIndex += 1;
  const sentTo = [];

  if (demoActive) {
    forwardChatMessage({
      id: `timer_demo_${Date.now()}`,
      platform: 'twitch',
      channel: cfg.twitchChannel || 'demo-live',
      author: cfg.streamerName || 'Chat-Timer',
      color: '#38bdf8',
      badges: ['BROADCASTER'],
      text,
      isSelf: true,
      timestamp: Date.now()
    });
    sentTo.push('demo');
  } else {
    if (twitch.connected && twitch.canWrite) {
      try {
        twitch.sendMessage(text);
        sentTo.push('twitch');
      } catch (e) {}
    }
    if (youtube.connected && youtube.canWrite) {
      try {
        await youtube.sendMessage(text);
        sentTo.push('youtube');
      } catch (e) {}
    }
  }

  appendDiagLog('system', 'info', `⏱️ Chat-Timer (${sentTo.join(', ') || 'keine aktive Schreib-Plattform'}): "${text}"`);
  return { ok: true, text, sentTo };
}

function syncChatTimer(cfg) {
  if (chatTimerHandle) {
    clearInterval(chatTimerHandle);
    chatTimerHandle = null;
  }
  const ct = cfg?.chatTimers;
  if (!ct || !ct.enabled) return;
  const lines = Array.isArray(ct.messages)
    ? ct.messages.map((s) => String(s || '').trim()).filter(Boolean)
    : [];
  if (lines.length === 0) return;
  const ms = Math.max(1, Math.min(180, Number(ct.intervalMin || 15))) * 60000;
  chatTimerHandle = setInterval(() => {
    runChatTimerTick(false);
  }, ms);
}

const customCommandCooldowns = new Map();

function handleCustomChatCommand(msg, cfg) {
  const cc = cfg.customCommands;
  if (!cc || !cc.enabled || msg.isSelf || msg.eventType) return;
  const txt = String(msg.text || '').trim();
  if (!txt.startsWith('!')) return;

  const trigger = txt.split(/\s+/)[0].toLowerCase();
  if (/^!(song|music|musik|tts|vote|poll)$/.test(trigger)) return;

  const parsed = [];
  for (const line of Array.isArray(cc.rules) ? cc.rules : []) {
    const sepIdx = String(line || '').indexOf('|');
    if (sepIdx === -1) continue;
    const cmd = line.slice(0, sepIdx).trim().toLowerCase();
    const reply = line.slice(sepIdx + 1).trim();
    if (cmd && reply) parsed.push({ cmd: cmd.startsWith('!') ? cmd : `!${cmd}`, reply });
  }

  let matched = parsed.find((r) => r.cmd === trigger);
  if (!matched && trigger === '!commands' && parsed.length > 0) {
    matched = { cmd: '!commands', reply: `Befehle: ${parsed.map((r) => r.cmd).join(', ')}` };
  }
  if (!matched) return;

  const cooldownMs = Math.max(2, Number(cc.cooldownSec || 10)) * 1000;
  const lastAt = customCommandCooldowns.get(matched.cmd) || 0;
  if (Date.now() - lastAt < cooldownMs) return;
  customCommandCooldowns.set(matched.cmd, Date.now());

  const replyText = matched.reply
    .replace(/\{user\}/gi, msg.author || 'Zuschauer')
    .replace(/\{platform\}/gi, (msg.platform || '').toUpperCase());

  if (demoActive) {
    setTimeout(() => {
      forwardChatMessage({
        id: `cmd_demo_${Date.now()}`,
        platform: msg.platform,
        channel: msg.channel || 'demo-live',
        author: cfg.streamerName || 'Bot',
        color: '#38bdf8',
        badges: ['BROADCASTER'],
        text: replyText,
        isSelf: true,
        timestamp: Date.now()
      });
    }, 180);
  } else if (msg.platform === 'twitch' && twitch.connected && twitch.canWrite) {
    try {
      twitch.sendMessage(replyText, msg.id || null);
    } catch (e) {}
  } else if (msg.platform === 'youtube' && youtube.connected && youtube.canWrite) {
    youtube.sendMessage(replyText).catch(() => {});
  }
  appendDiagLog(msg.platform, 'info', `🤖 Command ${matched.cmd} → "${replyText}"`);
}

function forwardChatMessage(msg) {
  try {
    const cfg = loadConfig();

    if (!demoActive) {
      if (msg.platform === 'twitch' && cfg.twitchEnabled === false) return;
      if (msg.platform === 'youtube' && cfg.youtubeEnabled === false) return;
      if (msg.platform === 'tiktok' && cfg.tiktokEnabled === false) return;
    }

    if (isDuplicateMessage(msg)) return;

    const authorLow = (msg.author || '').toLowerCase();
    if (Array.isArray(cfg.mutedUsers) && cfg.mutedUsers.includes(authorLow)) {
      return;
    }

    if (checkAutoMod(msg, cfg)) {
      return;
    }

    const tokens = emoteManager.tokenizeMessage(msg.text, {
      twitchEmotesTag: msg.twitchEmotes || '',
      youtubeRuns: msg.youtubeRuns || null,
      tiktokEmotes: msg.tiktokEmotes || null
    });

    const matchedKeyword = matchKeywordAlert(msg.text, cfg);

    const enriched = {
      ...msg,
      timestamp: Number(msg.timestamp || Date.now()),
      tokens,
      isMention: Boolean(msg.isMention || isMentionForStreamer(msg.text, cfg)),
      isKeywordAlert: Boolean(matchedKeyword),
      matchedKeyword: matchedKeyword || ''
    };

    obsServer.broadcastChat(enriched);
    broadcastToWindows('chat-message', enriched);
    processHypeMessage(enriched, cfg);
    handlePollVote(enriched);
    handleCustomChatCommand(enriched, cfg);

    // Auto-reply to !song / !music in Twitch chat (5s anti-spam cooldown)
    const cleanCmdText = String(msg.text || '').trim();
    if (
      cfg.spotifyEnabled !== false &&
      cfg.spotifyAutoCommand !== false &&
      !cleanCmdText.startsWith('🎵') &&
      /^!(song|music|musik)\b/i.test(cleanCmdText)
    ) {
      const now = Date.now();
      if (now - lastSongReplyAt > 5000) {
        if (!spotify.currentTrack?.running || !spotify.currentTrack?.title) {
          spotify.pollNow();
        }
        if (spotify.currentTrack?.running && spotify.currentTrack?.title) {
          lastSongReplyAt = now;
          const songText = spotify.currentTrack.artist
            ? `🎵 Aktueller Song: ${spotify.currentTrack.artist} – ${spotify.currentTrack.title}`
            : `🎵 Aktueller Song: ${spotify.currentTrack.title}`;
          appendDiagLog('system', 'info', `!song erkannt (${msg.author}) → ${songText}`);
          try {
            if (demoActive) {
              setTimeout(() => {
                forwardChatMessage({
                  id: `sp_bot_${Date.now()}`,
                  platform: msg.platform || 'twitch',
                  channel: msg.channel || 'demo-live',
                  author: cfg.streamerName || cfg.twitchUsername || 'OmniGrid Bot',
                  color: '#1db954',
                  badges: ['BOT'],
                  text: songText,
                  isSelf: true,
                  timestamp: Date.now()
                });
              }, 200);
            } else if (msg.platform === 'twitch' && twitch.connected && twitch.canWrite) {
              twitch.sendMessage(songText, msg.isSelf ? null : msg.id);
            } else if (msg.platform === 'youtube' && youtube.connected && youtube.canWrite) {
              youtube.sendMessage(songText).catch((err) => {
                appendDiagLog('youtube', 'error', `!song Antwort fehlgeschlagen: ${err.message}`);
              });
            }
          } catch (e) {
            appendDiagLog('twitch', 'error', `!song Antwort fehlgeschlagen: ${e.message}`);
          }
        } else {
          appendDiagLog('system', 'warn', '!song erkannt, aber Spotify spielt aktuell keinen Track.');
        }
      }
    }

    // Auto-reply to !schedule / !plan in Twitch/YouTube chat (10s anti-spam cooldown)
    if (
      (msg.platform === 'twitch' || msg.platform === 'youtube') &&
      /^!(schedule|plan|sendeplan)\b/i.test(String(msg.text || '').trim())
    ) {
      const now = Date.now();
      if (now - lastScheduleReplyAt > 10000) {
        lastScheduleReplyAt = now;
        const cfg = loadConfig();
        const replyText = socialSchedule.formatScheduleChatReply(cfg);
        if (msg.platform === 'twitch' && twitch.canWrite) {
          twitch.sendMessage(replyText).catch(() => {});
        } else if (msg.platform === 'youtube' && youtube.canWrite) {
          youtube.sendMessage(replyText).catch(() => {});
        }
      }
    }

    // Game-Addon specific chat commands (switches automatically with active game)
    if (String(msg.text || '').trim().startsWith('!')) {
      const now = Date.now();
      const cfg = loadConfig();
      const gRes = gameAddons.handleGameChatCommand(cfg, msg);
      if (gRes) {
        if (gRes.mutated && gRes.nextGameAddons) {
          cfg.gameAddons = gRes.nextGameAddons;
          saveConfig(cfg);
          broadcastGameAddonsState(cfg);
        }
        if (gRes.reply && (gRes.bypassCooldown || now - lastGameCmdAt > 4000)) {
          lastGameCmdAt = now;
          if (demoActive) {
            setTimeout(() => {
              broadcastToWindows('chat-message', {
                id: `ga_bot_${Date.now()}`,
                platform: msg.platform || 'twitch',
                author: cfg.streamerName || 'OmniGrid Bot',
                color: '#ec4899',
                badges: ['BOT'],
                text: gRes.reply,
                tokens: [{ type: 'text', text: gRes.reply }],
                timestamp: Date.now()
              });
            }, 180);
          } else if (msg.platform === 'twitch' && twitch.canWrite) {
            twitch.sendMessage(gRes.reply).catch(() => {});
          } else if (msg.platform === 'youtube' && youtube.canWrite) {
            youtube.sendMessage(gRes.reply).catch(() => {});
          }
        }
      }
    }

    // Live-Giveaway entry
    if (activeGiveaway.active && msg.author) {
      const kw = String(activeGiveaway.keyword || '!join').trim().toLowerCase();
      const txtLower = String(msg.text || '').trim().toLowerCase();
      if (kw && (txtLower === kw || txtLower.startsWith(kw + ' '))) {
        const key = `${msg.platform}:${msg.author.toLowerCase()}`;
        if (!activeGiveaway.participants.some((p) => p.key === key)) {
          const roles = Array.isArray(msg.roles) ? msg.roles : [];
          const isBoosted = roles.some((r) => ['sub', 'subscriber', 'vip', 'mod', 'moderator', 'broadcaster'].includes(String(r).toLowerCase()));
          const weight = isBoosted ? Math.max(1, Number(activeGiveaway.subMultiplier || 1)) : 1;
          activeGiveaway.participants.push({
            key,
            name: msg.author,
            platform: msg.platform,
            color: msg.color || '#cbd5e1',
            weight,
            isBoosted
          });
          broadcastGiveawayState();
        }
      }
    }
  } catch (e) {}
}

// Chat-Hype-Detektor (Auto-Marker / Auto-OBS-Replay / Auto-Clip)
// Löst aus, wenn ENTWEDER genug Hype-Punkte im Zeitfenster zusammenkommen
// ODER genug Keyword-Nachrichten (z. B. 3× "pog") im Zeitfenster eintreffen.
const hypeKeywordHits = [];
let lastHypeMeterBroadcastAt = 0;

function escapeRegexHype(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function processHypeMessage(msg, cfg) {
  try {
    const hd = { ...getDefaultConfig().hypeDetector, ...(cfg?.hypeDetector || {}) };
    if (!hd.enabled) return;
    if (msg?.isDemoBot || String(msg?.id || '').startsWith('hype_clip_')) return;

    const now = Date.now();
    const winMs = Math.max(5, Number(hd.windowSec || 10)) * 1000;
    const kwList = String(hd.keywords || '')
      .split(/[,\n]/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const lower = String(msg.text || '').toLowerCase();
    // Wortgrenzen-Match (auch Emote-Namen wie "PogChamp" → "pog" am Wortanfang)
    const matchedKw = kwList.find((k) => new RegExp(`(^|[^a-z0-9äöüß])${escapeRegexHype(k)}`, 'i').test(lower));

    hypeTimestamps.push({ ts: now, weight: matchedKw ? 3 : 1 });
    if (matchedKw) hypeKeywordHits.push(now);
    while (hypeTimestamps.length && now - hypeTimestamps[0].ts > winMs) hypeTimestamps.shift();
    while (hypeKeywordHits.length && now - hypeKeywordHits[0] > winMs) hypeKeywordHits.shift();

    const score = hypeTimestamps.reduce((acc, x) => acc + x.weight, 0);
    const minMsgs = Math.max(4, Number(hd.minMessages || 12));
    const kwNeeded = Math.max(1, Number(hd.keywordHits || 3));
    const kwCount = hypeKeywordHits.length;
    const cooldownMs = Math.max(15, Number(hd.cooldownSec || 90)) * 1000;
    const cooldownLeft = Math.max(0, Math.ceil((cooldownMs - (now - lastHypeTriggerAt)) / 1000));

    if (matchedKw) {
      appendDiagLog('system', 'info', `🔥 Hype-Keyword "${matchedKw}" (${kwCount}/${kwNeeded}, ${score}/${minMsgs} Punkte)`);
    }
    if (matchedKw || now - lastHypeMeterBroadcastAt > 1000) {
      lastHypeMeterBroadcastAt = now;
      broadcastToWindows('hype-meter', { score, minMsgs, kwCount, kwNeeded, matchedKw: matchedKw || '', cooldownLeft });
    }

    if ((score >= minMsgs || kwCount >= kwNeeded) && cooldownLeft === 0) {
      const reason = kwCount >= kwNeeded ? `${kwCount}× Keyword` : `${score} Punkte`;
      const desc = `🔥 Chat-Hype (${reason} / ${Math.round(winMs / 1000)}s)`;
      hypeTimestamps.length = 0;
      hypeKeywordHits.length = 0;
      executeHypeTrigger(cfg, desc).catch((err) => appendDiagLog('system', 'warn', `Hype-Trigger fehlgeschlagen: ${err.message}`));
    }
  } catch (e) {
    appendDiagLog('system', 'warn', `Hype-Detektor Fehler: ${e.message}`);
  }
}

async function executeHypeTrigger(cfg, desc = '🔥 Chat-Hype!') {
  const hd = { ...getDefaultConfig().hypeDetector, ...(cfg?.hypeDetector || {}) };
  const now = Date.now();
  lastHypeTriggerAt = now;
  appendDiagLog('system', 'info', `${desc} erkannt!`);

  const actions = [];
  const errors = [];
  let clipUrl = '';

  if (hd.autoClip) {
    if (demoActive) {
      clipUrl = `https://clips.twitch.tv/DemoHypeClip_${now.toString(36)}`;
      actions.push(`Demo-Clip erstellt (${clipUrl})`);
    } else if (!twitch.connected) {
      errors.push('Twitch-Clip: Twitch ist nicht verbunden');
    } else {
      try {
        const clipRes = await twitch.createClip();
        clipUrl = clipRes?.url || '';
        if (clipUrl) {
          actions.push('Twitch-Clip erstellt');
          appendDiagLog('twitch', 'info', `🎬 Hype-Clip erstellt: ${clipUrl}`);
        }
      } catch (err) {
        errors.push(`Twitch-Clip: ${err.message}`);
        appendDiagLog('twitch', 'warn', `Hype-Clip fehlgeschlagen: ${err.message}`);
      }
    }

    if (clipUrl) {
      if (hd.postClipToChat !== false) {
        if (twitch.connected && twitch.canWrite) {
          try {
            twitch.sendMessage(`🔥 HYPE-CLIP: ${clipUrl}`);
            actions.push('Clip-Link in Twitch-Chat gepostet');
          } catch (err) {
            errors.push(`Chat-Post: ${err.message}`);
          }
        }
        if (youtube.connected && youtube.canWrite) {
          try {
            await youtube.sendMessage(`🔥 HYPE-CLIP: ${clipUrl}`);
            actions.push('Clip-Link in YouTube-Chat gepostet');
          } catch (e) {}
        }
      }
      // Show clickable clip message directly in the local OmniGrid chat feed as well
      const sysMsg = {
        id: `hype_clip_${now}`,
        platform: 'twitch',
        author: '🔥 Hype-Detektor',
        text: `🎬 Hype-Clip erstellt: ${clipUrl}`,
        tokens: [{ type: 'text', text: `🎬 Hype-Clip erstellt: ${clipUrl}` }],
        badges: ['broadcaster'],
        color: '#f97316',
        isHighlight: true,
        eventType: 'sub',
        timestamp: now
      };
      broadcastToWindows('chat-message', sysMsg);
    }
  }

  if (hd.autoMarker) {
    if (demoActive) {
      actions.push('Demo-Marker gesetzt');
    } else if (!twitch.connected) {
      errors.push('Twitch-Marker: Twitch nicht verbunden');
    } else {
      try {
        await twitch.createStreamMarker(desc);
        actions.push('Twitch-Marker gesetzt');
      } catch (err) {
        errors.push(`Twitch-Marker: ${err.message}`);
      }
    }
  }

  if (hd.autoObsReplay) {
    if (!obsWs.getState()?.connected) {
      errors.push('OBS-Replay: OBS WebSocket nicht verbunden');
    } else {
      try {
        await obsWs.saveReplayBuffer();
        actions.push('OBS-Replay gespeichert');
      } catch (err) {
        errors.push(`OBS-Replay: ${err.message}`);
      }
    }
  }

  if (cfg?.goveeLights?.enabled && cfg?.goveeLights?.eventScenes?.hype) {
    try {
      const gRes = await goveeLights.triggerGoveeForEvent(cfg.goveeLights, 'hype');
      if (gRes?.ok) actions.push('Govee-Lichtszene');
    } catch (err) {
      errors.push(`Govee: ${err.message}`);
    }
  }
  if (cfg?.hueLights?.enabled && cfg?.hueLights?.eventScenes?.hype) {
    try {
      const hRes = await hueLights.triggerHueForEvent(cfg.hueLights, 'hype');
      if (hRes?.ok) actions.push('Philips Hue Szene');
    } catch (err) {
      errors.push(`Hue: ${err.message}`);
    }
  }
  if (cfg?.nanoleafLights?.enabled && cfg?.nanoleafLights?.eventScenes?.hype) {
    try {
      const nRes = await nanoleafLights.triggerNanoleafForEvent(cfg.nanoleafLights, 'hype');
      if (nRes?.ok) actions.push('Nanoleaf Effekt');
    } catch (err) {
      errors.push(`Nanoleaf: ${err.message}`);
    }
  }

  const payload = { score: 100, desc, at: now, clipUrl, actions, errors };
  broadcastToWindows('hype-triggered', payload);
  return { ok: true, ...payload };
}

const OBS_ALERT_TYPE_MAP = {
  follow: 'follow',
  sub: 'sub',
  member: 'sub',
  resub: 'resub',
  subgift: 'subgift',
  bits: 'bits',
  gift: 'bits',
  superchat: 'bits',
  raid: 'raid'
};

const OBS_ALERT_COLOR_MAP = {
  follow: '#3b82f6',
  sub: '#9146ff',
  resub: '#a855f7',
  subgift: '#ec4899',
  bits: '#f59e0b',
  raid: '#10b981'
};

function normalizeObsAlertType(rawType) {
  const key = String(rawType || '').toLowerCase().trim();
  return OBS_ALERT_TYPE_MAP[key] || 'follow';
}

function resolveObsAlertConfigForBroadcast(rawObsAlerts, port = 4588) {
  const base = rawObsAlerts || getDefaultConfig().obsAlerts;
  const cm = base.customMedia && typeof base.customMedia === 'object' ? base.customMedia : {};
  const resolvedMedia = {};
  for (const [evKey, entry] of Object.entries(cm)) {
    const e = entry && typeof entry === 'object' ? { ...entry } : {};
    if (e.imagePath && fs.existsSync(e.imagePath)) {
      e.imageUrl = `http://127.0.0.1:${port}/api/alert-media/${encodeURIComponent(evKey)}/image?t=${Date.now()}`;
    }
    if (e.audioPath && fs.existsSync(e.audioPath)) {
      e.audioUrl = `http://127.0.0.1:${port}/api/alert-media/${encodeURIComponent(evKey)}/audio?t=${Date.now()}`;
    }
    resolvedMedia[evKey] = e;
  }
  return { ...base, customMedia: resolvedMedia };
}

function broadcastEventToObsAlert(ev, bypassFilter = false) {
  const cfg = loadConfig();
  const alertCfg = cfg.obsAlerts || getDefaultConfig().obsAlerts;
  const normType = normalizeObsAlertType(ev.type);
  if (!bypassFilter) {
    if (alertCfg.enabled === false) return;
    if (alertCfg.types && alertCfg.types[normType] === false) return;
  }
  obsServer.broadcastAlert({
    ...ev,
    normType,
    color: OBS_ALERT_COLOR_MAP[normType] || '#9146ff'
  });
  goveeLights.triggerGoveeForEvent(cfg.goveeLights, normType).catch(() => {});
  hueLights.triggerHueForEvent(cfg.hueLights, normType).catch(() => {});
  nanoleafLights.triggerNanoleafForEvent(cfg.nanoleafLights, normType).catch(() => {});
}

let activePoll = {
  active: false,
  visible: true,
  visibleWhenStopped: false,
  question: '',
  options: [],
  voters: {},
  totalVotes: 0
};

function getSanitizedPoll() {
  return {
    active: activePoll.active,
    visible: activePoll.visible !== false,
    visibleWhenStopped: activePoll.visibleWhenStopped,
    question: activePoll.question,
    options: activePoll.options.map((o) => ({ label: o.label, votes: o.votes })),
    totalVotes: activePoll.totalVotes
  };
}

function handlePollVote(msg) {
  if (!activePoll.active || !activePoll.options.length) return;
  const txt = String(msg.text || '').trim();
  const match = txt.match(/^!(?:vote|poll)\s+(\d+)/i);
  if (!match) return;
  const idx = parseInt(match[1], 10) - 1;
  if (idx < 0 || idx >= activePoll.options.length) return;

  const voterKey = `${msg.platform || 'chat'}:${String(msg.author || '').toLowerCase()}`;
  const prevIdx = activePoll.voters[voterKey];
  if (prevIdx === idx) return;
  if (typeof prevIdx === 'number' && activePoll.options[prevIdx]) {
    activePoll.options[prevIdx].votes = Math.max(0, activePoll.options[prevIdx].votes - 1);
    activePoll.totalVotes = Math.max(0, activePoll.totalVotes - 1);
  }
  activePoll.voters[voterKey] = idx;
  activePoll.options[idx].votes += 1;
  activePoll.totalVotes += 1;

  const snap = getSanitizedPoll();
  obsServer.broadcastPoll(snap);
  broadcastToWindows('poll-updated', snap);
}

function incrementGoalForEvent(ev) {
  const cfg = loadConfig();
  const goals = cfg.obsGoals || getDefaultConfig().obsGoals;
  if (!goals || goals.enabled === false) return;
  const normType = normalizeObsAlertType(ev.type);
  const shouldInc =
    (goals.autoFollow && normType === 'follow') ||
    (goals.autoSub && ['sub', 'resub', 'subgift'].includes(normType));
  if (!shouldInc) return;

  const nextGoals = { ...goals, current: Math.max(0, Number(goals.current || 0) + 1) };
  cfg.obsGoals = nextGoals;
  saveConfig(cfg);
  obsServer.broadcastGoals(nextGoals);
  broadcastToWindows('goals-updated', nextGoals);
}

function forwardStreamerEvent(ev) {
  appendDiagLog(ev.platform, 'event', `${(ev.type || 'EVENT').toUpperCase()}: ${ev.author} — ${ev.summary}`);
  broadcastToWindows('streamer-event', ev);
  broadcastEventToObsAlert(ev, false);
  incrementGoalForEvent(ev);
}

function forwardStatus(update) {
  const cfg = loadConfig();
  const prev = platformStatus[update.platform] || {};
  const enabledKey = `${update.platform}Enabled`;
  platformStatus[update.platform] = {
    ...prev,
    ...update,
    enabled: cfg[enabledKey] !== false,
    viewers: typeof update.viewers === 'number' ? update.viewers : prev.viewers || 0
  };
  const level = update.status === 'error' ? 'error' : update.status === 'reconnecting' ? 'warn' : 'info';
  const detail = update.error || update.streamTitle || update.channel || update.status;
  appendDiagLog(update.platform, level, `Status → ${String(update.status || '').toUpperCase()} (${detail || ''})`);
  obsServer.broadcastStatus(platformStatus);
  broadcastToWindows('platform-status', platformStatus);
}

function forwardStats(stats) {
  const prev = platformStatus[stats.platform] || {};
  platformStatus[stats.platform] = {
    ...prev,
    viewers: typeof stats.viewers === 'number' ? stats.viewers : prev.viewers || 0,
    likes: typeof stats.likes === 'number' ? stats.likes : prev.likes || 0
  };
  obsServer.broadcastStatus(platformStatus);
  broadcastToWindows('platform-status', platformStatus);
  if (discordLiveTimer) discordLivePeak = Math.max(discordLivePeak, currentTotalViewers());
  if (stats.platform === 'twitch' && typeof stats.isLive === 'boolean' && !demoActive) {
    handleTwitchLiveTransition(stats.isLive);
  }
}

twitch.on('room-id', (roomId) => {
  appendDiagLog('twitch', 'info', `Twitch Room-ID erkannt (${roomId}) — Lade 7TV/BTTV/FFZ Kanal-Emotes...`);
  emoteManager.loadTwitchChannelEmotes(roomId);
});

twitch.on('delete-message', (msgId) => {
  obsServer.deleteMessage(msgId);
  broadcastToWindows('message-deleted', { id: msgId });
});

[twitch, youtube, tiktok].forEach((conn) => {
  conn.on('chat', (msg) => forwardChatMessage(msg));
  conn.on('event', (ev) => forwardStreamerEvent(ev));
  conn.on('status', (st) => forwardStatus(st));
  conn.on('stats', (st) => forwardStats(st));
});

let lastVodEnforceAt = 0;
function triggerAutoMusicVodProtection(force = false) {
  const now = Date.now();
  if (!force && now - lastVodEnforceAt < 15000) return;
  lastVodEnforceAt = now;
  obsAutoConfig.enableObsVodMusicTrack();
  if (obsWs.getState()?.connected) {
    obsWs.enforceMusicVodProtection().catch(() => {});
  }
}

function normalizeObsTransitionRules(tr) {
  if (!tr) return [];
  if (Array.isArray(tr.rules)) {
    return tr.rules
      .filter((r) => r && (r.fromScene || r.toScene))
      .map((r, i) => ({
        id: String(r.id || `tr-${i}-${r.fromScene}-${r.toScene}`).replace(/[^a-zA-Z0-9_-]/g, ''),
        fromScene: String(r.fromScene || '__all__'),
        toScene: String(r.toScene || '__all__'),
        bidirectional: r.bidirectional !== false,
        mode: r.mode === 'obs' || r.mode === 'custom-file' ? r.mode : 'theme',
        obsTransitionName: String(r.obsTransitionName || ''),
        filePath: String(r.filePath || ''),
        fileName: String(r.fileName || ''),
        fileKind: r.fileKind === 'image' || r.fileKind === 'html' ? r.fileKind : 'video',
        durationMs: Number(r.durationMs) || 2600
      }));
  }
  if (tr.enabled) {
    return [{
      id: `tr-legacy-${String(tr.fromScene || 'all').replace(/[^a-zA-Z0-9_-]/g, '')}`,
      fromScene: String(tr.fromScene || '__all__'),
      toScene: String(tr.toScene || '__all__'),
      bidirectional: tr.bidirectional !== false,
      mode: 'theme',
      obsTransitionName: '',
      filePath: '',
      fileName: '',
      fileKind: 'video',
      durationMs: 2600
    }];
  }
  return [];
}

function findMatchingTransitionRule(rules, fromScene, toScene) {
  return rules.find((r) => {
    const direct = (r.fromScene === '__all__' || r.fromScene === fromScene)
      && (r.toScene === '__all__' || r.toScene === toScene);
    const reverse = r.bidirectional !== false
      && (r.fromScene === '__all__' || r.fromScene === toScene)
      && (r.toScene === '__all__' || r.toScene === fromScene);
    return direct || reverse;
  }) || null;
}

function triggerTransitionRule(rule) {
  if (!rule) return;
  if (rule.mode === 'obs' && rule.obsTransitionName) {
    obsWs.setSceneTransition(rule.obsTransitionName).catch(() => {});
    return;
  }
  if (rule.mode === 'custom-file' && rule.filePath) {
    obsServer.broadcastSceneTransition({
      mode: 'custom-file',
      fileKind: rule.fileKind || 'video',
      mediaUrl: `/api/custom-transition/${rule.id}`,
      durationMs: rule.durationMs || 2600
    });
    return;
  }
  obsServer.broadcastSceneTransition({ mode: 'theme' });
}

let lastAudioEqBroadcastAt = 0;
obsWs.on('audio-meter', (meter) => {
  const activePack = obsServer.getEffectiveChampionTheme?.();
  const activeAddon = obsServer.currentGameStats?.addonId;
  if ((!activePack || activePack.effect !== 'dj-sona') && activeAddon !== 'djstream') return;
  const now = Date.now();
  if (now - lastAudioEqBroadcastAt < 33) return;
  lastAudioEqBroadcastAt = now;
  obsServer.broadcastAudioEq({ source: 'obs', level: meter.level, left: meter.left, right: meter.right, ts: now });
});

ipcMain.on('audio-eq-frame', (_ev, payload) => {
  if (!payload) return;
  obsServer.broadcastAudioEq({ ...payload, source: 'fft', ts: Date.now() });
});

let tempPreviewTransitionPath = '';
let lastObsConnectedState = false;
let lastObsProgramScene = '';
obsWs.on('state', (st) => {
  broadcastToWindows('obs-ws-state', st);
  obsServer.broadcastObsWsState(st);
  const nextScene = String(st?.currentScene || '');
  if (st?.connected && nextScene && lastObsProgramScene && nextScene !== lastObsProgramScene) {
    const rules = normalizeObsTransitionRules(loadConfig().obsSceneTransition);
    const matched = findMatchingTransitionRule(rules, lastObsProgramScene, nextScene);
    if (matched) triggerTransitionRule(matched);
  }
  if (nextScene) lastObsProgramScene = nextScene;
  if (st?.connected) {
    triggerAutoMusicVodProtection(Boolean(st?.streaming && !lastObsStreaming));
    if (!lastObsConnectedState) {
      setTimeout(() => {
        obsWs.refreshAllOmniGridOverlays(obsServer.port || 4588).catch(() => {});
      }, 900);
    }
  }
  lastObsConnectedState = Boolean(st?.connected);

  const isStreaming = Boolean(st?.streaming);
  if (isStreaming && !lastObsStreaming) {
    const cfg = loadConfig();
    if (cfg.elgatoLights?.autoOnLive !== false && cfg.elgatoLights?.ips) {
      elgatoLights
        .setElgatoLights({
          ips: cfg.elgatoLights.ips,
          on: true,
          brightness: cfg.elgatoLights.brightness ?? 60,
          temperatureK: cfg.elgatoLights.temperatureK ?? 4500
        })
        .then((res) => {
          if (res.ok) appendDiagLog('system', 'info', '💡 Elgato Beleuchtung automatisch zum Stream-Start eingeschaltet.');
          else if (res.error) appendDiagLog('system', 'warn', `Elgato Licht Fehler: ${res.error}`);
        })
        .catch(() => {});
    }
    goveeLights.triggerGoveeForEvent(cfg.goveeLights, 'streamStart').catch(() => {});
    if (cfg.hueLights?.enabled && cfg.hueLights?.bridgeIp && cfg.hueLights?.username) {
      if (cfg.hueLights.eventScenes?.streamStart) {
        hueLights.triggerHueForEvent(cfg.hueLights, 'streamStart').catch(() => {});
      } else if (cfg.hueLights.autoOnLive) {
        hueLights.setHueLights({ ...cfg.hueLights, on: true }).catch(() => {});
      }
    }
    if (cfg.nanoleafLights?.enabled && cfg.nanoleafLights?.ip && cfg.nanoleafLights?.authToken) {
      if (cfg.nanoleafLights.eventScenes?.streamStart) {
        nanoleafLights.triggerNanoleafForEvent(cfg.nanoleafLights, 'streamStart').catch(() => {});
      } else if (cfg.nanoleafLights.autoOnLive) {
        nanoleafLights.setNanoleafState({ ...cfg.nanoleafLights, on: true }).catch(() => {});
      }
    }
    const now = Date.now();
    {
      const ssD = socialSchedule.normalizeSocialScheduleConfig(cfg.socialSchedule);
      if (ssD.discord.enabled && ssD.discord.autoPostOnObsLive && ssD.discord.webhookUrl) {
        startDiscordLiveAnnouncement(cfg, { source: 'obs' }).catch((err) =>
          appendDiagLog('system', 'warn', `Discord Live-Announcer Fehler: ${err.message}`)
        );
      }
    }
    if (now - lastAutoGoLiveAt > 15 * 60 * 1000) {
      const ss = socialSchedule.normalizeSocialScheduleConfig(cfg.socialSchedule);
      const targets = {
        discord: false, // läuft über den Discord Live-Announcer (oben)
        bluesky: Boolean(ss.bluesky.enabled && ss.bluesky.autoPostOnLive),
        mastodon: Boolean(ss.mastodon.enabled && ss.mastodon.autoPostOnLive),
        x: Boolean(ss.x.enabled && ss.x.autoPostOnLive),
        instagram: Boolean(
          ss.instagram.enabled &&
            ss.instagram.autoPostOnLive &&
            (ss.instagram.defaultImageUrl || (ss.instagram.defaultImagePath && ss.instagram.imgbbApiKey))
        )
      };
      if (targets.discord || targets.bluesky || targets.mastodon || targets.x || targets.instagram) {
        lastAutoGoLiveAt = now;
        executeGoLivePost(cfg, { targets })
          .then((res) => {
            if (res.posted?.length) {
              appendDiagLog('system', 'info', `🚀 Auto-Go-Live gepostet: ${res.posted.join(', ')}`);
            }
            if (res.errors?.length) {
              appendDiagLog('system', 'warn', `Auto-Go-Live Fehler: ${res.errors.join(' | ')}`);
            }
          })
          .catch((err) => appendDiagLog('system', 'error', `Auto-Go-Live Fehler: ${err.message}`));
      }
    }
  } else if (!isStreaming && lastObsStreaming) {
    const cfg = loadConfig();
    if (cfg.elgatoLights?.autoOffStop && cfg.elgatoLights?.ips) {
      elgatoLights
        .setElgatoLights({ ips: cfg.elgatoLights.ips, on: false })
        .then((res) => {
          if (res.ok) appendDiagLog('system', 'info', '🌑 Elgato Beleuchtung zum Stream-Ende ausgeschaltet.');
        })
        .catch(() => {});
    }
    goveeLights.triggerGoveeForEvent(cfg.goveeLights, 'streamStop').catch(() => {});
    if (cfg.hueLights?.enabled && cfg.hueLights?.bridgeIp && cfg.hueLights?.username) {
      if (cfg.hueLights.eventScenes?.streamStop) {
        hueLights.triggerHueForEvent(cfg.hueLights, 'streamStop').catch(() => {});
      } else if (cfg.hueLights.autoOffStop) {
        hueLights.setHueLights({ ...cfg.hueLights, on: false }).catch(() => {});
      }
    }
    if (cfg.nanoleafLights?.enabled && cfg.nanoleafLights?.ip && cfg.nanoleafLights?.authToken) {
      if (cfg.nanoleafLights.eventScenes?.streamStop) {
        nanoleafLights.triggerNanoleafForEvent(cfg.nanoleafLights, 'streamStop').catch(() => {});
      } else if (cfg.nanoleafLights.autoOffStop) {
        nanoleafLights.setNanoleafState({ ...cfg.nanoleafLights, on: false }).catch(() => {});
      }
    }
    endDiscordLiveAnnouncement('OBS-Stream gestoppt').catch(() => {});
  }
  lastObsStreaming = isStreaming;
});

youtube.on('oauth-updated', (oauth) => {
  const cfg = loadConfig();
  cfg.youtubeOAuth = { ...(cfg.youtubeOAuth || {}), ...oauth };
  saveConfig(cfg);
  platformStatus.youtube.canWrite = youtube.canWrite;
  obsServer.broadcastStatus(platformStatus);
  broadcastToWindows('platform-status', platformStatus);
});

function connectSinglePlatform(platform, cfg) {
  if (platform === 'twitch') {
    if (cfg.twitchEnabled === false) {
      twitch.disconnect();
      return;
    }
    if (cfg.twitchChannel) {
      // Pre-fetch 7TV/BTTV/FFZ channel emotes immediately by channel login
      emoteManager.loadTwitchChannelEmotesByLogin(cfg.twitchChannel);
      twitch.connect({
        channel: cfg.twitchChannel,
        username: cfg.twitchUsername || cfg.twitchChannel,
        oauthToken: cfg.twitchToken
      });
    }
  } else if (platform === 'youtube') {
    youtube.setOAuthConfig(cfg.youtubeOAuth || {});
    if (cfg.youtubeEnabled === false) {
      youtube.disconnect();
      return;
    }
    if (cfg.youtubeChannel || cfg.youtubeVideoId) {
      youtube.connect({
        channelOrUrl: cfg.youtubeChannel,
        preferredVideoId: cfg.youtubeVideoId
      });
    }
  } else if (platform === 'tiktok') {
    if (cfg.tiktokEnabled === false) {
      tiktok.disconnect();
      return;
    }
    if (cfg.tiktokChannel || cfg.tiktokRoomId) {
      tiktok.connect({
        uniqueId: cfg.tiktokChannel,
        roomId: cfg.tiktokRoomId
      });
    }
  }
}

function connectAllSavedChannels(cfg) {
  connectSinglePlatform('twitch', cfg);
  connectSinglePlatform('youtube', cfg);
  connectSinglePlatform('tiktok', cfg);
}

const DEMO_SAMPLES = [
  {
    platform: 'twitch',
    author: 'CarryPotter99',
    color: '#9146ff',
    badges: ['SUB', 'VIP'],
    text: '@Streamer Normale Nachricht eines Abonnenten (nicht als Event hervorgehoben) catJAM GIGACHAD',
    isMention: true,
    eventType: null,
    isHighlight: false
  },
  {
    platform: 'tiktok',
    author: 'lena.clips',
    color: '#10b981',
    badges: ['❤️ NEUER FOLLOW'],
    text: 'folgt jetzt dem Kanal!',
    eventType: 'follow',
    isHighlight: true,
    event: { type: 'follow', summary: 'Neuer Follow auf TikTok!' }
  },
  {
    platform: 'twitch',
    author: 'PixelQueen',
    color: '#f59e0b',
    badges: ['⭐ NEUES SUB (Prime)'],
    text: 'Neues Abo (Prime)! — "Endlich dabei peepoLove"',
    eventType: 'sub',
    isHighlight: true,
    event: { type: 'sub', summary: 'Neues Abo (Prime)!' }
  },
  {
    platform: 'twitch',
    author: 'ShadowWalker',
    color: '#a855f7',
    badges: ['🌟 RESUB (14 MONATE)'],
    text: 'Resub im 14. Monat (Tier 1)! — "Bester Streamer auf Twitch PogU"',
    eventType: 'resub',
    isHighlight: true,
    event: { type: 'resub', summary: 'Resub im 14. Monat!' }
  },
  {
    platform: 'twitch',
    author: 'GigaGifter_DE',
    color: '#ec4899',
    badges: ['🎁 5x GIFTED SUBS'],
    text: 'verschenkt 5x Subs an die Community! Clap',
    eventType: 'subgift',
    isHighlight: true,
    event: { type: 'subgift', summary: '5x Gifted Subs!' }
  },
  {
    platform: 'twitch',
    author: 'CheerMaster',
    color: '#06b6d4',
    badges: ['💎 500 BITS'],
    text: 'Cheer500 Für das starke Comeback gerade! KEKW',
    eventType: 'bits',
    isHighlight: true,
    event: { type: 'bits', summary: '500 Bits gecheert!' }
  },
  {
    platform: 'twitch',
    author: 'xX_RaiderBoss_Xx',
    color: '#ef4444',
    badges: ['🚨 RAID (184 ZUSCHAUER)'],
    text: 'raidet den Kanal mit 184 Zuschauern! ratJAM',
    eventType: 'raid',
    isHighlight: true,
    event: { type: 'raid', summary: 'Raid mit 184 Zuschauern!' }
  },
  {
    platform: 'twitch',
    author: 'CuriousViewer',
    color: '#3b82f6',
    badges: ['✨ HERVORGEHOBEN'],
    text: 'Welches Mikrofon und Audio-Interface nutzt du eigentlich für deinen Stream? Clueless',
    eventType: 'highlighted_msg',
    isHighlight: true
  },
  {
    platform: 'youtube',
    author: 'TechNick_DE',
    color: '#ff4e45',
    badges: ['MEMBER'],
    text: 'Normale Nachricht eines YouTube-Kanalmitglieds in 1440p EZ',
    eventType: null,
    isHighlight: false
  }
];

let demoIdx = 0;
function startDemoSimulation() {
  stopDemoSimulation();
  demoActive = true;

  platformStatus.twitch = { status: 'connected', channel: 'DeinKanal', viewers: 142, enabled: true };
  platformStatus.youtube = {
    status: 'connected',
    channel: '@DeinKanal',
    videoId: 'dQw4w9WgXcQ',
    streamTitle: 'LIVE: Ranked Grind & Viewer Games!',
    availableStreams: [
      { videoId: 'dQw4w9WgXcQ', title: '🔴 LIVE: Ranked Grind & Viewer Games!', isLive: true },
      { videoId: 'jfKfPfyJRdk', title: '📅 Geplant: Community Turnier Sonntag 18 Uhr', isLive: false }
    ],
    viewers: 86,
    enabled: true
  };
  platformStatus.tiktok = { status: 'connected', channel: 'dein_tiktok', roomId: '739182739182', viewers: 318, likes: 14200, enabled: true };

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('demo-state', true);
    mainWindow.webContents.send('platform-status', platformStatus);
  }

  for (let i = 0; i < 4; i++) {
    emitNextDemoStep();
  }

  demoInterval = setInterval(() => {
    emitNextDemoStep();
  }, 2600);
}

function emitNextDemoStep() {
  const sample = DEMO_SAMPLES[demoIdx % DEMO_SAMPLES.length];
  demoIdx++;

  platformStatus.twitch.viewers = Math.max(10, (platformStatus.twitch.viewers || 140) + Math.floor(Math.random() * 7) - 3);
  platformStatus.youtube.viewers = Math.max(10, (platformStatus.youtube.viewers || 85) + Math.floor(Math.random() * 5) - 2);
  platformStatus.tiktok.viewers = Math.max(20, (platformStatus.tiktok.viewers || 310) + Math.floor(Math.random() * 13) - 5);
  platformStatus.tiktok.likes = (platformStatus.tiktok.likes || 14200) + Math.floor(Math.random() * 45);

  obsServer.broadcastStatus(platformStatus);
  broadcastToWindows('platform-status', platformStatus);

  if (sample.event) {
    forwardStreamerEvent({
      id: `demo_ev_${Date.now()}_${demoIdx}`,
      platform: sample.platform,
      type: sample.event.type,
      author: sample.author,
      summary: sample.event.summary,
      timestamp: Date.now()
    });
  }

  forwardChatMessage({
    ...sample,
    id: `demo_${Date.now()}_${demoIdx}`,
    channel: 'demo-live',
    timestamp: Date.now()
  });
}

function stopDemoSimulation() {
  demoActive = false;
  if (demoInterval) {
    clearInterval(demoInterval);
    demoInterval = null;
  }
  broadcastToWindows('demo-state', false);
}

app.whenReady().then(async () => {
  const obsPort = await obsServer.start();

  // Handle interactive actions sent from inside the OBS Custom Browser Dock (/dock)
  obsServer.onClientAction = (payload) => {
    if (!payload) return;
    if (payload.action === 'pin') {
      obsServer.broadcastPin(payload.data || null);
    } else if (payload.action === 'delete-msg' && payload.id) {
      obsServer.deleteMessage(payload.id);
      broadcastToWindows('message-deleted', { id: payload.id });
    } else if (payload.action === 'send-chat' && payload.text) {
      try {
        twitch.sendMessage(payload.text);
      } catch (e) {}
    }
  };

  // Handle Elgato Stream Deck & Bitfocus Companion REST API requests (/api/streamdeck/*)
  obsServer.onStreamDeckApi = async (action, params = {}, body = {}) => {
    const act = String(action || 'status').toLowerCase();
    appendDiagLog('system', 'info', `Stream Deck Aktion ausgeführt: /${act}`);

    if (act === 'status') {
      const cfg = loadConfig();
      return {
        ok: true,
        platforms: platformStatus,
        demoActive,
        isAlwaysOnTop,
        compactChat: Boolean(cfg.compactChat),
        soundAlerts: cfg.soundAlerts !== false,
        pinnedMessage: obsServer.pinnedMessage || null
      };
    }

    if (act === 'pin-last') {
      const lastMsg = obsServer.recentMessages[obsServer.recentMessages.length - 1] || null;
      if (!lastMsg) {
        return { ok: false, error: 'Keine aktuelle Chatnachricht zum Anpinnen vorhanden.' };
      }
      obsServer.broadcastPin(lastMsg);
      broadcastToWindows('streamdeck-command', { command: 'pin', msg: lastMsg });
      return { ok: true, pinned: lastMsg.author };
    }

    if (act === 'unpin') {
      obsServer.broadcastPin(null);
      broadcastToWindows('streamdeck-command', { command: 'unpin' });
      return { ok: true };
    }

    if (act === 'toggle-poll') {
      if (params.visible === 'true' || params.visible === '1' || body.visible === true) {
        activePoll.visible = true;
      } else if (params.visible === 'false' || params.visible === '0' || body.visible === false) {
        activePoll.visible = false;
      } else {
        activePoll.visible = !activePoll.visible;
      }
      const snap = getSanitizedPoll();
      obsServer.broadcastPoll(snap);
      broadcastToWindows('poll-updated', snap);
      return { ok: true, visible: snap.visible, poll: snap };
    }

    if (act === 'clip') {
      if (demoActive) {
        const demoUrl = 'https://clips.twitch.tv/DemoHighlightClip';
        appendDiagLog('twitch', 'info', `🎬 Demo-Clip erstellt: ${demoUrl}`);
        return { ok: true, demo: true, id: 'DemoHighlightClip', url: demoUrl, editUrl: `${demoUrl}/edit` };
      }
      try {
        const res = await twitch.createClip();
        appendDiagLog('twitch', 'info', `🎬 Twitch Clip erstellt: ${res.url}`);
        return res;
      } catch (err) {
        appendDiagLog('twitch', 'error', `Clip fehlgeschlagen: ${err.message}`);
        return { ok: false, error: err.message };
      }
    }

    if (act === 'marker') {
      const desc = String(params.description || body.description || 'OmniGrid Highlight').trim();
      if (demoActive) {
        appendDiagLog('twitch', 'info', `🚩 Demo-Marker gesetzt: "${desc}"`);
        return { ok: true, demo: true, description: desc, positionSeconds: 42 };
      }
      try {
        const res = await twitch.createStreamMarker(desc);
        appendDiagLog('twitch', 'info', `🚩 Stream-Marker gesetzt: "${res.description}"`);
        return res;
      } catch (err) {
        appendDiagLog('twitch', 'error', `Marker fehlgeschlagen: ${err.message}`);
        return { ok: false, error: err.message };
      }
    }

    if (act === 'clip-and-marker') {
      const desc = String(params.description || body.description || 'OmniGrid Highlight').trim();
      if (demoActive) {
        const demoUrl = 'https://clips.twitch.tv/DemoHighlightClip';
        appendDiagLog('twitch', 'info', `🎬🚩 Demo Clip + Marker: ${demoUrl} ("${desc}")`);
        return { ok: true, demo: true, clip: { ok: true, url: demoUrl }, marker: { ok: true, description: desc } };
      }
      const [clipRes, markerRes] = await Promise.allSettled([
        twitch.createClip(),
        twitch.createStreamMarker(desc)
      ]);
      const clip = clipRes.status === 'fulfilled' ? clipRes.value : { ok: false, error: clipRes.reason?.message };
      const marker = markerRes.status === 'fulfilled' ? markerRes.value : { ok: false, error: markerRes.reason?.message };
      if (!clip.ok && !marker.ok) {
        return { ok: false, error: `Clip: ${clip.error} | Marker: ${marker.error}`, clip, marker };
      }
      return { ok: true, clip, marker };
    }

    if (act === 'obs-scene') {
      const name = String(params.name || params.scene || body.sceneName || '').trim();
      if (!name) return { ok: false, error: 'Parameter "name" (Szenenname) fehlt.' };
      return await obsWs.setScene(name);
    }

    if (act === 'obs-replay') {
      return await obsWs.saveReplayBuffer();
    }

    if (act === 'obs-stream') {
      await ensureObsWsConnected().catch(() => {});
      return await obsWs.toggleStream(buildObsStreamPrepOpts());
    }

    if (act === 'obs-record') {
      return await obsWs.toggleRecord();
    }

    if (act === 'obs-mic') {
      return await obsWs.toggleMicMute(params.input || body.inputName || '');
    }

    if (act === 'go-live') {
      return await executeGoLivePost(loadConfig(), body || {});
    }

    if (act === 'post-schedule') {
      return await executeSchedulePost(loadConfig(), body || {});
    }

    if (act === 'sound') {
      const target = params.id || params.name || body.id || body.name || '';
      return playSoundboardById(target);
    }

    if (act === 'game-addon') {
      const id = String(params.id || body.id || 'auto').trim();
      if (id !== 'auto' && !gameAddons.PRESET_ADDON_IDS.includes(id)) {
        return { ok: false, error: `Unbekanntes Game-Addon: ${id}` };
      }
      const cfg = loadConfig();
      const ga = gameAddons.normalizeGameAddonsConfig(cfg.gameAddons);
      ga.selectedMode = id;
      cfg.gameAddons = ga;
      saveConfig(cfg);
      broadcastGameAddonsState(cfg);
      return { ok: true, selectedMode: id };
    }

    if (act === 'game-overlay') {
      const cfg = loadConfig();
      const ga = gameAddons.normalizeGameAddonsConfig(cfg.gameAddons);
      const raw = String(params.state || body.state || 'toggle').toLowerCase();
      ga.overlayEnabled = raw === 'on' ? true : raw === 'off' ? false : !ga.overlayEnabled;
      cfg.gameAddons = ga;
      saveConfig(cfg);
      broadcastGameAddonsState(cfg);
      return { ok: true, overlayEnabled: ga.overlayEnabled };
    }

    if (act === 'game-stat') {
      const key = String(params.key || body.key || 'deaths').trim();
      const delta = parseInt(params.delta || body.delta || '1', 10) || 1;
      const cfg = loadConfig();
      const ga = gameAddons.normalizeGameAddonsConfig(cfg.gameAddons);
      const { addon } = gameAddons.resolveActiveAddon({ ...cfg, gameAddons: ga });
      const cur = ga.perAddonStats[addon.id] || {};
      cur[key] = (Number(cur[key]) || 0) + delta;
      ga.perAddonStats[addon.id] = cur;
      cfg.gameAddons = ga;
      saveConfig(cfg);
      broadcastGameAddonsState(cfg);
      return { ok: true, addonId: addon.id, key, value: cur[key] };
    }

    if (act === 'lol-map-cover') {
      const cfg = loadConfig();
      const ga = gameAddons.normalizeGameAddonsConfig(cfg.gameAddons);
      const lol = ga.perAddonStats.lol || {};
      lol.mapCoverEnabled = !Boolean(lol.mapCoverEnabled);
      ga.perAddonStats.lol = lol;
      cfg.gameAddons = ga;
      saveConfig(cfg);
      broadcastGameAddonsState(cfg);
      return { ok: true, mapCoverEnabled: lol.mapCoverEnabled };
    }

    if (act === 'clear-chat') {
      globalSeenMsgKeys.clear();
      obsServer.clearChat();
      broadcastToWindows('streamdeck-command', { command: 'clear-chat' });
      return { ok: true };
    }

    if (act === 'toggle-compact') {
      const cfg = loadConfig();
      cfg.compactChat = !cfg.compactChat;
      saveConfig(cfg);
      broadcastToWindows('streamdeck-command', { command: 'set-compact', value: cfg.compactChat });
      return { ok: true, compactChat: cfg.compactChat };
    }

    if (act === 'toggle-sound') {
      const cfg = loadConfig();
      cfg.soundAlerts = cfg.soundAlerts === false ? true : false;
      saveConfig(cfg);
      broadcastToWindows('streamdeck-command', { command: 'set-sound', value: cfg.soundAlerts });
      return { ok: true, soundAlerts: cfg.soundAlerts };
    }

    if (act === 'toggle-always-on-top') {
      const targetWin = chatDockWindow && !chatDockWindow.isDestroyed() ? chatDockWindow : mainWindow;
      if (targetWin && !targetWin.isDestroyed()) {
        const nextState = !targetWin.isAlwaysOnTop();
        targetWin.setAlwaysOnTop(nextState, 'floating');
        if (targetWin === mainWindow) isAlwaysOnTop = nextState;
        broadcastToWindows('streamdeck-command', { command: 'set-always-on-top', value: nextState });
        return { ok: true, isAlwaysOnTop: nextState };
      }
      return { ok: false, error: 'Kein aktives Fenster gefunden.' };
    }

    if (act === 'toggle-demo') {
      if (demoActive) stopDemoSimulation();
      else startDemoSimulation();
      return { ok: true, demoActive };
    }

    if (act === 'test-alert') {
      const alertType = normalizeObsAlertType(params.type || body.type || 'sub');
      const sampleMap = {
        follow: { author: 'NeuerFollower', summary: 'Folgt jetzt dem Kanal!' },
        sub: { author: 'StreamFan99', summary: 'Neues Tier-1 Abo!' },
        resub: { author: 'TreuerZuschauer', summary: '6 Monate Resub! Danke!' },
        subgift: { author: 'GrosszuegigerMod', summary: 'Hat 5 Subs verschenkt!' },
        bits: { author: 'CheerKing', summary: '500 Bits gecheert!' },
        raid: { author: 'PartnerStreamer', summary: 'Raid mit 42 Zuschauern!' }
      };
      const sample = sampleMap[alertType] || sampleMap.sub;
      broadcastEventToObsAlert({
        id: `test_alert_${Date.now()}`,
        platform: String(params.platform || body.platform || 'twitch'),
        type: alertType,
        author: String(params.author || body.author || sample.author),
        summary: String(params.summary || body.summary || sample.summary),
        timestamp: Date.now()
      }, true);
      return { ok: true, type: alertType };
    }

    if (act === 'reconnect') {
      const plat = String(params.platform || body.platform || 'all').toLowerCase();
      stopDemoSimulation();
      if (plat === 'twitch' || plat === 'all') twitch.reconnect();
      if (plat === 'youtube' || plat === 'all') await youtube.reconnect();
      if (plat === 'tiktok' || plat === 'all') await tiktok.reconnect();
      return { ok: true, reconnected: plat };
    }

    if (act === 'toggle-platform') {
      const plat = String(params.platform || body.platform || '').toLowerCase();
      if (!['twitch', 'youtube', 'tiktok'].includes(plat)) {
        return { ok: false, error: 'Ungültige Plattform (erwartet: twitch, youtube oder tiktok).' };
      }
      const cfg = loadConfig();
      const next = cfg[`${plat}Enabled`] === false;
      cfg[`${plat}Enabled`] = next;
      saveConfig(cfg);
      platformStatus[plat].enabled = next;
      if (!next) {
        if (plat === 'twitch') twitch.disconnect();
        else if (plat === 'youtube') youtube.disconnect();
        else if (plat === 'tiktok') tiktok.disconnect();
      } else if (!demoActive) {
        connectSinglePlatform(plat, cfg);
      }
      obsServer.broadcastStatus(platformStatus);
      broadcastToWindows('platform-status', platformStatus);
      broadcastToWindows('streamdeck-command', { command: 'sync-config', config: cfg });
      return { ok: true, platform: plat, enabled: next };
    }

    if (act === 'send') {
      const text = String(params.text || body.text || '').trim();
      if (!text) return { ok: false, error: 'Parameter "text" fehlt.' };
      const cfg = loadConfig();
      if (demoActive) {
        forwardChatMessage({
          id: `sd_demo_${Date.now()}`,
          platform: 'twitch',
          channel: cfg.twitchChannel || 'demo-live',
          author: cfg.streamerName || cfg.twitchUsername || 'Streamer (Du)',
          color: '#34d399',
          badges: ['STREAMER'],
          text,
          isSelf: true,
          timestamp: Date.now()
        });
        return { ok: true, sent: text, demo: true };
      }
      twitch.sendMessage(text, null);
      return { ok: true, sent: text };
    }

    if (act === 'spotify-next') {
      return await spotify.control('next');
    }
    if (act === 'spotify-prev') {
      return await spotify.control('previous');
    }
    if (act === 'spotify-playpause') {
      return await spotify.control('playpause');
    }
    if (act === 'spotify-announce') {
      if (!spotify.currentTrack?.running || !spotify.currentTrack?.title) {
        return { ok: false, error: 'Aktuell läuft kein Spotify-Track.' };
      }
      const songText = spotify.currentTrack.artist
        ? `🎵 Aktueller Song: ${spotify.currentTrack.artist} – ${spotify.currentTrack.title}`
        : `🎵 Aktueller Song: ${spotify.currentTrack.title}`;
      twitch.sendMessage(songText, null);
      return { ok: true, sent: songText };
    }

    return { ok: false, error: `Unbekannte Stream-Deck-Aktion: ${act}` };
  };

  spotify.on('track', (track) => {
    obsServer.broadcastSpotify(track);
    broadcastToWindows('spotify-track', track);
    if (track?.playing) triggerAutoMusicVodProtection(false);
  });

  ipcMain.handle('spotify-control', async (_ev, action) => {
    if (action === 'announce') {
      if (!spotify.currentTrack?.running || !spotify.currentTrack?.title) {
        return { ok: false, error: 'Aktuell läuft kein Spotify-Track.' };
      }
      const songText = spotify.currentTrack.artist
        ? `🎵 Aktueller Song: ${spotify.currentTrack.artist} – ${spotify.currentTrack.title}`
        : `🎵 Aktueller Song: ${spotify.currentTrack.title}`;
      try {
        twitch.sendMessage(songText, null);
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    }
    return await spotify.control(action);
  });

  createMainWindow();

  mainWindow.webContents.on('did-finish-load', async () => {
    const os = require('os');
    const QRCode = require('qrcode');
    const getTabletTargets = async () => {
      const nets = os.networkInterfaces();
      const raw = [];
      for (const name of Object.keys(nets)) {
        if (/^(docker|veth|vmnet|vbox|bridge|lo)/i.test(name)) continue;
        for (const net of nets[name] || []) {
          if (net.family === 'IPv4' && !net.internal) {
            const isCgnat = /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(net.address);
            const isVpnIf = /^(utun|tun|tap|tailscale|wg)/i.test(name) || isCgnat;
            const score = !isVpnIf && net.address.startsWith('192.168.')
              ? 4
              : !isVpnIf && net.address.startsWith('10.')
                ? 3
                : !isVpnIf
                  ? 2
                  : 1;
            const label = isVpnIf
              ? `Tailscale / VPN (${net.address})`
              : `WLAN / LAN (${net.address})`;
            const url = `http://${net.address}:${obsPort}/tablet`;
            let qrDataUrl = '';
            try {
              qrDataUrl = await QRCode.toDataURL(url, { width: 140, margin: 1 });
            } catch (e) {}
            raw.push({ label, url, qrDataUrl, score });
          }
        }
      }
      raw.sort((a, b) => b.score - a.score);
      if (raw.length === 0) {
        const url = `http://127.0.0.1:${obsPort}/tablet`;
        let qrDataUrl = '';
        try {
          qrDataUrl = await QRCode.toDataURL(url, { width: 140, margin: 1 });
        } catch (e) {}
        raw.push({ label: 'Lokal (127.0.0.1)', url, qrDataUrl, score: 0 });
      }
      return raw;
    };

    const tabletTargets = await getTabletTargets();
    const tabletUrl = tabletTargets[0].url;
    const tabletQrDataUrl = tabletTargets[0].qrDataUrl;

    const saved = loadConfig();
    spotify.start(saved.spotifyEnabled !== false);
    if (saved.emoteSettings) {
      emoteManager.updateSettings(saved.emoteSettings);
    }
    if (saved.appearance) {
      obsServer.broadcastAppearance({
        ...saved.appearance,
        platformIndicatorStyle: saved.platformIndicatorStyle || 'icon_badge'
      });
    }
    obsServer.broadcastAlertConfig(resolveObsAlertConfigForBroadcast(saved.obsAlerts || getDefaultConfig().obsAlerts, obsPort));
    obsServer.broadcastGoals(saved.obsGoals || getDefaultConfig().obsGoals);
    obsServer.broadcastPoll(getSanitizedPoll());
    youtube.setOAuthConfig(saved.youtubeOAuth || {});
    platformStatus.twitch.enabled = saved.twitchEnabled !== false;
    platformStatus.youtube.enabled = saved.youtubeEnabled !== false;
    platformStatus.youtube.canWrite = youtube.canWrite;
    platformStatus.tiktok.enabled = saved.tiktokEnabled !== false;

    appendDiagLog('system', 'info', `OmniGrid Studio gestartet — Tablet Companion unter ${tabletUrl}`);

    mainWindow.webContents.send('init-state', {
      config: saved,
      obsUrl: `http://127.0.0.1:${obsPort}`,
      obsDockUrl: `http://127.0.0.1:${obsPort}/dock`,
      obsAlertsUrl: `http://127.0.0.1:${obsPort}/alerts`,
      obsGoalsUrl: `http://127.0.0.1:${obsPort}/goals`,
      obsPollUrl: `http://127.0.0.1:${obsPort}/poll`,
      spotifyObsUrl: `http://127.0.0.1:${obsPort}/spotify`,
      tabletUrl,
      tabletQrDataUrl,
      tabletTargets,
      spotifyTrack: spotify.currentTrack,
      activePoll: getSanitizedPoll(),
      obsWsState: obsWs.getState(),
      streamDeckUrl: `http://127.0.0.1:${obsPort}/api/streamdeck`,
      platformStatus,
      isAlwaysOnTop,
      demoActive,
      diagnosticLogs
    });

    if (saved.obsWs?.enabled !== false) {
      const localWs = obsAutoConfig.readObsWebSocketLocalConfig();
      if (saved.obsWs?.enabled || (localWs.found && localWs.serverEnabled)) {
        ensureObsWsConnected().catch(() => {});
      }
    }
    syncChatTimer(saved);
    obsServer.setIcsProvider(() => socialSchedule.buildIcsFeed(loadConfig()));
    obsServer.setSoundFileResolver((soundId) => {
      const sounds = loadConfig().soundboard?.sounds || [];
      const found = sounds.find((s) => s.id === soundId);
      return found?.filePath || null;
    });
    obsServer.setAlertMediaResolver((evType, kind) => {
      const cm = loadConfig().obsAlerts?.customMedia || {};
      const entry = cm[evType] || {};
      if (kind === 'image') return entry.imagePath || null;
      if (kind === 'audio') return entry.audioPath || null;
      return null;
    });
    obsServer.setSponsorMediaResolver((id) => {
      const list = loadConfig().sponsors?.items || [];
      const found = list.find((s) => s && s.id === id);
      return found?.imagePath || null;
    });
    obsServer.setCustomTransitionResolver((id) => {
      if (id === 'preview' && tempPreviewTransitionPath) return tempPreviewTransitionPath;
      const rules = normalizeObsTransitionRules(loadConfig().obsSceneTransition);
      const found = rules.find((r) => r.id === id);
      return found?.filePath || null;
    });
    broadcastSponsorsToObs(saved).catch(() => {});
    broadcastScheduleToObs(saved);
    obsServer.onGameWebhook = handleIncomingGameWebhook;
    broadcastGameAddonsState(saved);
    obsServer.setVoiceTestHandler(null);
    voiceBridge.stop();

    // Optional League of Legends Live Client API (127.0.0.1:2999) + LCU Ranked/LP Poller (lockfile)
    let lastLcuPollAt = 0;
    const syncLcuIntoConfig = async (force = false) => {
      const now = Date.now();
      if (!force && now - lastLcuPollAt < 12000) return null;
      lastLcuPollAt = now;
      const lcu = await gameAddons.readLolLcuRankedStats();
      if (!lcu?.ok) return lcu;
      if (lcu.role) global.__lastLcuLolRole = lcu.role;
      const cfg = loadConfig();
      const ga = gameAddons.normalizeGameAddonsConfig(cfg.gameAddons);
      const prev = ga.perAddonStats.lol || {};
      const nextMatches = Array.isArray(lcu.recentMatches) && lcu.recentMatches.length
        ? lcu.recentMatches.slice(0, 6)
        : (Array.isArray(prev.recentMatches) ? prev.recentMatches.slice(0, 6) : []);
      const matchesChanged = nextMatches.length !== (prev.recentMatches?.length || 0)
        || (nextMatches[0]?.at && nextMatches[0].at !== prev.recentMatches?.[0]?.at);
      const changed =
        prev.rank !== lcu.rank ||
        Number(prev.lp) !== Number(lcu.lp) ||
        (lcu.riotId && prev.riotId !== lcu.riotId) ||
        (lcu.region && prev.region !== lcu.region) ||
        (lcu.role && prev.role !== lcu.role) ||
        matchesChanged;
      if (changed || force || (ga.selectedMode === 'auto' && !ga.currentGameName)) {
        if (ga.selectedMode === 'auto' && !ga.currentGameName) {
          ga.currentGameName = 'League of Legends';
        }
        ga.perAddonStats.lol = {
          ...prev,
          rank: lcu.rank,
          lp: lcu.lp,
          role: lcu.role || prev.role || '',
          riotId: lcu.riotId || prev.riotId || '',
          region: lcu.region || prev.region || 'euw',
          recentMatches: nextMatches
        };
        cfg.gameAddons = ga;
        saveConfig(cfg);
        broadcastGameAddonsState(cfg);
      }
      return lcu;
    };
    global.__syncLcuRankedNow = () => syncLcuIntoConfig(true);

    setInterval(async () => {
      const cfg = loadConfig();
      const { addon, ga } = gameAddons.resolveActiveAddon(cfg);
      if (!ga.lolPollingEnabled) return;
      if (addon.id !== 'lol' && ga.selectedMode !== 'auto') return;
      if (addon.id === 'lol' || (ga.selectedMode === 'auto' && !ga.currentGameName)) {
        syncLcuIntoConfig(false).catch(() => {});
      }
      try {
        const https = require('https');
        const agent = gameAddons.createRiotLocalHttpsAgent();
        const data = await new Promise((resolve, reject) => {
          const req = https.get('https://127.0.0.1:2999/liveclientdata/allgamedata', { agent, timeout: 1500 }, (res) => {
            let raw = '';
            res.on('data', (c) => { raw += c; });
            res.on('end', () => {
              try { resolve(JSON.parse(raw)); } catch (e) { reject(e); }
            });
          });
          req.on('error', reject);
          req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
        });
        const ap = data?.activePlayer || {};
        const players = Array.isArray(data?.allPlayers) ? data.allPlayers : [];
        const normName = (v) => String(v || '').trim().toLowerCase();
        const stripTag = (v) => normName(v).split('#')[0];
        const apRiot = normName(ap.riotId);
        const apGame = normName(ap.riotIdGameName);
        const apSum = normName(ap.summonerName);
        const apBase = stripTag(ap.riotId || ap.riotIdGameName || ap.summonerName);
        const me = players.find((p) => {
          if (apRiot && normName(p.riotId) === apRiot) return true;
          if (apGame && normName(p.riotIdGameName) === apGame) return true;
          if (apSum && normName(p.summonerName) === apSum) return true;
          if (apBase && (stripTag(p.riotId) === apBase || stripTag(p.summonerName) === apBase)) return true;
          return false;
        }) || players[0];
        if (me) {
          if (ga.selectedMode === 'auto' && addon.id !== 'lol') {
            ga.currentGameName = 'League of Legends';
            syncLcuIntoConfig(false).catch(() => {});
          }
          const skinNum = Number(me.skinID ?? me.skinId ?? 0);
          const ddAssets = await gameAddons.resolveLolDdragonAssets(me.championName || '', skinNum, me.skinName || '');
          const liveItems = await gameAddons.resolveLolItemList(me.items || []);
          const prevLol = ga.perAddonStats.lol || {};
          let recentMatches = Array.isArray(prevLol.recentMatches) ? prevLol.recentMatches.slice(0, 6) : [];

          const events = Array.isArray(data?.events?.Events) ? data.events.Events : [];
          if (!global.__seenLolEventIds) global.__seenLolEventIds = new Set();
          const gameTime = Number(data?.gameData?.gameTime || 0);
          if (gameTime < 30 && global.__seenLolEventIds.size > 0) {
            global.__seenLolEventIds.clear();
          }

          const myNames = [ap.riotId, ap.riotIdGameName, ap.summonerName, me.summonerName, me.riotIdGameName]
            .filter(Boolean)
            .map((s) => String(s).toLowerCase());

          for (const ev of events) {
            const evKey = `${ev.EventID}_${ev.EventName}`;
            if (global.__seenLolEventIds.has(evKey)) continue;
            global.__seenLolEventIds.add(evKey);
            if (!ga.autoTriggerEvents || gameTime < 20) continue;

            const killerLow = String(ev.KillerName || '').toLowerCase();
            const isMe = killerLow && myNames.some((n) => n === killerLow || killerLow.includes(n));
            if (ev.EventName === 'Multikill' && isMe && Number(ev.KillStreak || 0) >= 3) {
              const streak = Number(ev.KillStreak);
              const label = streak >= 5 ? 'PENTAKILL' : streak === 4 ? 'Quadra Kill' : 'Triple Kill';
              const desc = `⚔️ LoL ${label} (${me.championName || 'Live'})!`;
              appendDiagLog('system', 'info', desc);
              if (streak >= 5) {
                executeHypeTrigger(cfg, desc).catch(() => {});
              } else if (twitch.connected) {
                twitch.createStreamMarker(desc).catch(() => {});
              }
            } else if ((ev.EventName === 'BaronKill' || ev.EventName === 'HeraldKill') && isMe) {
              if (twitch.connected) twitch.createStreamMarker(`⚔️ LoL ${ev.EventName} (${me.championName || ''})`).catch(() => {});
            }
          }

          const gameEndEv = events.find((ev) => ev?.EventName === 'GameEnd');
          if (gameEndEv && !global.__lastLolGameEndRecorded) {
            global.__lastLolGameEndRecorded = true;
            recentMatches.unshift({
              champion: me.championName || '—',
              championIconUrl: ddAssets.championIconUrl,
              win: String(gameEndEv.Result || '').toLowerCase() === 'win',
              kills: Number(me.scores?.kills || 0),
              deaths: Number(me.scores?.deaths || 0),
              assists: Number(me.scores?.assists || 0),
              at: Date.now()
            });
            recentMatches = recentMatches.slice(0, 6);
          } else if (!gameEndEv && global.__lastLolGameEndRecorded && gameTime < 60) {
            global.__lastLolGameEndRecorded = false;
          }

          const keystone =
            ap?.fullRunes?.keystone?.displayName ||
            me?.runes?.keystone?.displayName ||
            prevLol.keystone ||
            '';
          const spell1 = me?.summonerSpells?.summonerSpellOne?.displayName || prevLol.spell1 || '';
          const spell2 = me?.summonerSpells?.summonerSpellTwo?.displayName || prevLol.spell2 || '';
          const liveRole = gameAddons.detectLolRole({
            position: me.position,
            lcuPosition: global.__lastLcuLolRole || '',
            gameMode: data?.gameData?.gameMode,
            spell1,
            spell2,
            spell1Raw: me?.summonerSpells?.summonerSpellOne?.rawDisplayName,
            spell2Raw: me?.summonerSpells?.summonerSpellTwo?.rawDisplayName,
            items: me.items,
            fallbackRole: prevLol.role
          });

          ga.perAddonStats.lol = {
            ...prevLol,
            role: liveRole,
            champion: me.championName || '—',
            skinId: skinNum,
            skinName: ddAssets.skinName || me.skinName || '',
            championIconUrl: ddAssets.championIconUrl,
            skinIconUrl: ddAssets.skinIconUrl,
            skinSplashUrl: ddAssets.skinSplashUrl,
            kills: Number(me.scores?.kills || 0),
            deaths: Number(me.scores?.deaths || 0),
            assists: Number(me.scores?.assists || 0),
            cs: Number(me.scores?.creepScore || 0),
            level: Number(ap?.level || me.level || 1),
            gameTimeSec: Math.round(gameTime),
            currentGold: Math.round(Number(ap?.currentGold ?? prevLol.currentGold ?? 0)),
            keystone,
            spell1,
            spell2,
            items: liveItems,
            recentMatches,
            mapCoverEnabled: Boolean(prevLol.mapCoverEnabled),
            mapCoverText: String(prevLol.mapCoverText || 'Minimap verdeckt • Kein Ghosting')
          };
          cfg.gameAddons = ga;
          saveConfig(cfg);
          broadcastGameAddonsState(cfg);
        }
      } catch (e) {}
    }, 4000);

    if (saved.chatDockOpen) {
      openStandaloneChatWindow(false);
    }

    if (demoActive) {
      startDemoSimulation();
    } else if (saved.autoConnectOnStart && (saved.twitchChannel || saved.youtubeChannel || saved.tiktokChannel)) {
      connectAllSavedChannels(saved);
    }
  });

  ipcMain.handle('save-profile', (_ev, config) => {
    const currentCfg = { ...loadConfig(), ...config };
    if (currentCfg.emoteSettings) {
      emoteManager.updateSettings(currentCfg.emoteSettings);
    }
    if (currentCfg.appearance) {
      obsServer.broadcastAppearance({
        ...currentCfg.appearance,
        platformIndicatorStyle: currentCfg.platformIndicatorStyle || 'icon_badge'
      });
    }
    if (currentCfg.obsAlerts) {
      obsServer.broadcastAlertConfig(resolveObsAlertConfigForBroadcast(currentCfg.obsAlerts, obsServer.port || 4588));
    }
    if (currentCfg.obsGoals) {
      obsServer.broadcastGoals(currentCfg.obsGoals);
    }
    syncChatTimer(currentCfg);
    saveConfig(currentCfg);
    return { ok: true, config: currentCfg };
  });

  ipcMain.handle('run-chat-timer-now', () => runChatTimerTick(true));

  let helpWindowLoaded = false;
  let pendingHelpTarget = null;

  function computeSideBySideBounds() {
    const { screen } = require('electron');
    const refBounds =
      mainWindow && !mainWindow.isDestroyed() ? mainWindow.getBounds() : { x: 0, y: 0, width: 1200, height: 800 };
    const display = screen.getDisplayMatching(refBounds) || screen.getPrimaryDisplay();
    const wa = display.workArea;
    // Give mainWindow the largest share (~67%), while ensuring helpWindow stays comfortably readable (>= 480px when screen permits)
    const minHelpW = Math.min(480, Math.round(wa.width * 0.42));
    const maxHelpW = Math.min(680, Math.round(wa.width * 0.36));
    const helpW = Math.max(minHelpW, Math.min(maxHelpW, Math.round(wa.width * 0.33)));
    const mainW = Math.max(540, wa.width - helpW);
    return {
      mainBounds: { x: wa.x, y: wa.y, width: mainW, height: wa.height },
      helpBounds: { x: wa.x + mainW, y: wa.y, width: wa.width - mainW, height: wa.height }
    };
  }

  function applySideBySideHelpLayout() {
    const { mainBounds, helpBounds } = computeSideBySideBounds();
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isFullScreen()) mainWindow.setFullScreen(false);
      if (mainWindow.isMaximized()) mainWindow.unmaximize();
      if (!preHelpMainBounds) {
        preHelpMainBounds = mainWindow.getBounds();
      }
      mainWindow.setBounds(mainBounds, true);
    }
    if (helpWindow && !helpWindow.isDestroyed()) {
      if (helpWindow.isMinimized()) helpWindow.restore();
      helpWindow.setBounds(helpBounds, true);
    }
    return { mainBounds, helpBounds };
  }

  function sendHelpNavigation(opts) {
    if (!helpWindow || helpWindow.isDestroyed()) return;
    const cfg = loadConfig();
    const lang = cfg.language || 'de';
    const payload = {
      lang,
      doc: opts?.doc || (lang === 'en' ? 'GUIDE.md' : 'ANLEITUNG.md'),
      section: opts?.section ? String(opts.section) : '',
      anchor: opts?.anchor ? String(opts.anchor) : ''
    };
    helpWindow.webContents.send('help-navigate', payload);
  }

  function openHelpWindow(opts = {}) {
    const cfg = loadConfig();
    const isEn = (cfg.language || 'de') === 'en';
    if (helpWindow && !helpWindow.isDestroyed()) {
      applySideBySideHelpLayout();
      helpWindow.show();
      helpWindow.focus();
      if (helpWindowLoaded) {
        sendHelpNavigation(opts);
      } else {
        pendingHelpTarget = opts;
      }
      return;
    }

    helpWindowLoaded = false;
    pendingHelpTarget = opts;
    const { helpBounds } = applySideBySideHelpLayout();

    helpWindow = new BrowserWindow({
      x: helpBounds.x,
      y: helpBounds.y,
      width: helpBounds.width,
      height: helpBounds.height,
      minWidth: 440,
      minHeight: 420,
      modal: false,
      backgroundColor: '#0b0f19',
      icon: getAppIconPath(),
      title: isEn ? 'OmniGrid Studio — User Guide & Help' : 'OmniGrid Studio — Anleitung & Hilfe',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    });
    helpWindow.setMenuBarVisibility(false);
    helpWindow.webContents.setWindowOpenHandler(({ url }) => {
      require('electron').shell.openExternal(url);
      return { action: 'deny' };
    });
    helpWindow.webContents.on('did-finish-load', () => {
      helpWindowLoaded = true;
      if (pendingHelpTarget) {
        sendHelpNavigation(pendingHelpTarget);
        pendingHelpTarget = null;
      }
    });
    helpWindow.loadFile(path.join(__dirname, 'renderer', 'help.html'));
    helpWindow.on('closed', () => {
      helpWindow = null;
      helpWindowLoaded = false;
      if (!isAppShuttingDown && preHelpMainBounds && mainWindow && !mainWindow.isDestroyed()) {
        try {
          mainWindow.setBounds(preHelpMainBounds, true);
          persistWindowBounds('mainWindowBounds', mainWindow);
        } catch (e) {}
      }
      preHelpMainBounds = null;
    });
  }

  ipcMain.handle('open-help-window', (_ev, opts) => {
    openHelpWindow(opts || {});
    return { ok: true };
  });

  ipcMain.handle('retile-help-layout', () => {
    applySideBySideHelpLayout();
    return { ok: true };
  });

  ipcMain.handle('get-help-doc', (_ev, docName) => {
    const allowed = new Set(['ANLEITUNG.md', 'GUIDE.md', 'README.de.md', 'README.md', 'PRIVACY.md', 'CHANGELOG.md']);
    const safeName = allowed.has(docName) ? docName : 'ANLEITUNG.md';
    try {
      const filePath = path.join(__dirname, '..', safeName);
      const content = fs.readFileSync(filePath, 'utf8');
      return { ok: true, content, docName: safeName };
    } catch (err) {
      return { ok: false, error: `Datei ${safeName} nicht gefunden: ${err.message}` };
    }
  });

  ipcMain.handle('export-chat-log', async (_ev, messagesList) => {
    const { dialog } = require('electron');
    const items = Array.isArray(messagesList) ? messagesList : [];
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    const res = await dialog.showSaveDialog(mainWindow, {
      title: 'Chat-Verlauf exportieren',
      defaultPath: `omnichat-log-${stamp}.txt`,
      filters: [
        { name: 'Text-Log (*.txt)', extensions: ['txt'] },
        { name: 'JSON (*.json)', extensions: ['json'] }
      ]
    });
    if (res.canceled || !res.filePath) return { ok: false, canceled: true };
    try {
      if (res.filePath.toLowerCase().endsWith('.json')) {
        fs.writeFileSync(res.filePath, JSON.stringify(items, null, 2), 'utf8');
      } else {
        const lines = items.map((m) => {
          const t = new Date(m.timestamp || Date.now()).toLocaleTimeString('de-DE');
          const p = String(m.platform || 'chat').toUpperCase();
          return `[${t}] [${p}] ${m.author || 'Unbekannt'}: ${m.text || ''}`;
        });
        fs.writeFileSync(res.filePath, lines.join('\n'), 'utf8');
      }
      return { ok: true, filePath: res.filePath, count: items.length };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('stream-manager-load', async () => {
    try {
      const tw = await twitch.getChannelInfo();
      if (tw?.gameName) syncCurrentGameFromStreamManager(tw.gameName);
      return { ok: true, twitch: tw, youtubeTitle: youtube.streamTitle || '' };
    } catch (err) {
      return { ok: false, error: err.message, youtubeTitle: youtube.streamTitle || '' };
    }
  });

  ipcMain.handle('stream-manager-search-games', async (_ev, query) => {
    try {
      return await twitch.searchCategories(query);
    } catch (err) {
      return { ok: false, categories: [] };
    }
  });

  ipcMain.handle('stream-manager-save', async (_ev, payload) => {
    const title = String(payload?.title || '').trim();
    const gameId = String(payload?.gameId || '').trim();
    const gameName = String(payload?.gameName || '').trim();
    const tags = Array.isArray(payload?.tags)
      ? payload.tags
      : String(payload?.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
    const syncYoutube = Boolean(payload?.syncYoutube);

    const results = [];
    const errors = [];

    try {
      await twitch.updateChannelInfo({ title, gameId, gameName, tags });
      results.push('Twitch');
      if (gameName) syncCurrentGameFromStreamManager(gameName);
      appendDiagLog('twitch', 'info', `📝 Stream-Info aktualisiert: "${title}" (${gameName || gameId || 'unverändert'})`);
    } catch (err) {
      errors.push(`Twitch: ${err.message}`);
      appendDiagLog('twitch', 'error', `Stream-Info Fehler: ${err.message}`);
    }

    if (syncYoutube && title && youtube.connected && youtube.canWrite) {
      try {
        await youtube.updateVideoTitle(title);
        results.push('YouTube');
        appendDiagLog('youtube', 'info', `📝 YouTube-Titel aktualisiert: "${title}"`);
      } catch (err) {
        errors.push(`YouTube: ${err.message}`);
        appendDiagLog('youtube', 'error', `YouTube Titel-Fehler: ${err.message}`);
      }
    }

    if (results.length > 0) {
      return { ok: true, updated: results, warnings: errors };
    }
    return { ok: false, error: errors.join(' | ') || 'Keine Plattform aktualisiert.' };
  });

  ipcMain.handle('clip-studio-list', () => {
    const cfg = loadConfig();
    const res = clipStudio.listReplays(cfg.replayDir || '');
    return { ...res, hasFfmpeg: Boolean(clipStudio.findFfmpegBinary()) };
  });

  ipcMain.handle('clip-studio-pick-dir', async () => {
    const { dialog } = require('electron');
    const res = await dialog.showOpenDialog(mainWindow, {
      title: 'OBS Replay- / Aufnahme-Ordner wählen',
      properties: ['openDirectory']
    });
    if (res.canceled || !res.filePaths?.[0]) return { ok: false, canceled: true };
    const cfg = loadConfig();
    cfg.replayDir = res.filePaths[0];
    saveConfig(cfg);
    return { ...clipStudio.listReplays(cfg.replayDir), hasFfmpeg: Boolean(clipStudio.findFfmpegBinary()) };
  });

  ipcMain.handle('clip-studio-export-short', async (_ev, payload) => {
    try {
      const res = await clipStudio.exportVerticalShort(payload || {});
      appendDiagLog('system', 'info', `🎞️ 9:16 Short exportiert: ${res.outPath}`);
      return res;
    } catch (err) {
      appendDiagLog('system', 'error', `9:16 Short Export fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('clip-studio-trim-original', async (_ev, payload) => {
    try {
      const res = await clipStudio.trimOriginalVideo(payload || {});
      appendDiagLog('system', 'info', `✂️ 16:9 Clip geschnitten: ${res.outPath}`);
      return res;
    } catch (err) {
      appendDiagLog('system', 'error', `16:9 Schnitt fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('clip-studio-reveal', (_ev, filePath) => {
    if (filePath) {
      require('electron').shell.showItemInFolder(filePath);
    }
    return { ok: true };
  });

  ipcMain.handle('clip-studio-rename', (_ev, { filePath, newTitle }) => {
    try {
      const res = clipStudio.renameReplay(filePath, newTitle);
      appendDiagLog('system', 'info', `✏️ Clip umbenannt: ${res.name}`);
      return res;
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('clip-studio-delete', async (_ev, filePath) => {
    try {
      if (!filePath || !fs.existsSync(filePath)) {
        return { ok: false, error: 'Datei nicht gefunden.' };
      }
      await require('electron').shell.trashItem(filePath);
      appendDiagLog('system', 'info', `🗑️ Clip in Papierkorb verschoben: ${path.basename(filePath)}`);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('clip-studio-upload-youtube', async (_ev, { filePath, title, privacyStatus }) => {
    try {
      const res = await youtube.uploadVideo({
        filePath,
        title,
        description: '#Shorts',
        privacyStatus: privacyStatus || 'private'
      });
      appendDiagLog('youtube', 'info', `▶️ YouTube Short hochgeladen: ${res.url}`);
      return res;
    } catch (err) {
      appendDiagLog('youtube', 'error', `YouTube Upload fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('clip-studio-upload-tiktok', (_ev, filePath) => {
    const { shell } = require('electron');
    if (filePath && fs.existsSync(filePath)) {
      shell.showItemInFolder(filePath);
    }
    shell.openExternal('https://www.tiktok.com/creator-center/upload');
    appendDiagLog('tiktok', 'info', '🎵 TikTok Upload-Seite geöffnet & Video-Datei markiert.');
    return { ok: true };
  });

  ipcMain.handle('clip-studio-waveform', async (_ev, { filePath, bars } = {}) => {
    try {
      return await clipStudio.extractWaveform(filePath, bars || 140);
    } catch (err) {
      return { ok: false, peaks: [], error: err.message };
    }
  });

  ipcMain.handle('clip-studio-thumbnail', async (_ev, payload = {}) => {
    try {
      const res = await clipStudio.exportThumbnail(payload);
      appendDiagLog('system', 'info', `🖼️ Thumbnail gespeichert: ${res.outPath}`);
      return res;
    } catch (err) {
      appendDiagLog('system', 'error', `Thumbnail Export fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('clip-studio-montage', async (_ev, payload = {}) => {
    try {
      const res = await clipStudio.exportHighlightMontage(payload);
      appendDiagLog('system', 'info', `🎞️ Highlight-Montage exportiert: ${res.outPath}`);
      return res;
    } catch (err) {
      appendDiagLog('system', 'error', `Highlight-Montage fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('clip-studio-pick-asset', async (_ev, { kind } = {}) => {
    const isSub = kind === 'subtitle';
    const res = await dialog.showOpenDialog(mainWindow, {
      title: isSub ? 'Untertitel-Datei wählen (.srt / .ass / .vtt)' : 'Hintergrund-Musik wählen (.mp3 / .wav / .m4a)',
      properties: ['openFile'],
      filters: isSub
        ? [{ name: 'Untertitel', extensions: ['srt', 'ass', 'vtt'] }]
        : [{ name: 'Audio', extensions: ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac'] }]
    });
    if (res.canceled || !res.filePaths?.[0]) return { ok: false, canceled: true };
    const filePath = res.filePaths[0];
    return { ok: true, filePath, fileName: path.basename(filePath) };
  });

  ipcMain.handle('poll-action', (_ev, payload) => {
    const act = payload?.action || 'start';
    if (act === 'start') {
      const question = String(payload?.question || 'Was sollen wir spielen?').trim();
      const rawOpts = Array.isArray(payload?.options)
        ? payload.options
        : String(payload?.options || 'Option A, Option B')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
      const options = rawOpts.slice(0, 6).map((label) => ({ label, votes: 0 }));
      if (options.length < 2) {
        return { ok: false, error: 'Mindestens 2 Optionen erforderlich (kommagetrennt).' };
      }
      activePoll = {
        active: true,
        visible: true,
        visibleWhenStopped: true,
        question,
        options,
        voters: {},
        totalVotes: 0
      };
    } else if (act === 'stop') {
      activePoll.active = false;
      activePoll.visibleWhenStopped = true;
    } else if (act === 'toggle-visibility') {
      activePoll.visible = !activePoll.visible;
    } else if (act === 'reset') {
      activePoll = {
        active: false,
        visible: false,
        visibleWhenStopped: false,
        question: '',
        options: [],
        voters: {},
        totalVotes: 0
      };
    }
    const snap = getSanitizedPoll();
    obsServer.broadcastPoll(snap);
    broadcastToWindows('poll-updated', snap);
    return { ok: true, poll: snap };
  });

  ipcMain.handle('twitch-create-clip', async () => {
    if (demoActive) {
      const demoUrl = 'https://clips.twitch.tv/DemoHighlightClip';
      appendDiagLog('twitch', 'info', `🎬 Demo-Clip erstellt: ${demoUrl}`);
      return { ok: true, demo: true, id: 'DemoHighlightClip', url: demoUrl, editUrl: `${demoUrl}/edit` };
    }
    try {
      const res = await twitch.createClip();
      appendDiagLog('twitch', 'info', `🎬 Twitch Clip erstellt: ${res.url}`);
      return res;
    } catch (err) {
      appendDiagLog('twitch', 'error', `Clip fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('twitch-create-marker', async (_ev, description) => {
    const desc = String(description || 'OmniGrid Highlight').trim();
    if (demoActive) {
      appendDiagLog('twitch', 'info', `🚩 Demo-Marker gesetzt: "${desc}"`);
      return { ok: true, demo: true, description: desc, positionSeconds: 42 };
    }
    try {
      const res = await twitch.createStreamMarker(desc);
      appendDiagLog('twitch', 'info', `🚩 Stream-Marker gesetzt: "${res.description}"`);
      return res;
    } catch (err) {
      appendDiagLog('twitch', 'error', `Marker fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('obs-ws-connect', async (_ev, opts) => {
    const res = await ensureObsWsConnected(opts || {});
    if (res.ok) {
      appendDiagLog('system', 'info', `OBS WebSocket v5 verbunden (${opts?.host || '127.0.0.1'}:${res.port || 4455}).`);
      return res;
    }
    appendDiagLog('system', 'error', `OBS WebSocket Fehler: ${res.error}`);
    return res;
  });

  ipcMain.handle('obs-ws-auto-setup', async () => {
    const prov = obsAutoConfig.autoProvisionObsLocalFiles({ disableMultitrackVideo: true });
    const conn = await ensureObsWsConnected();
    if (conn.ok) {
      await obsWs.disableMultitrackVideoConflict().catch(() => {});
      return {
        ok: true,
        port: conn.port || prov.port || 4455,
        state: conn.state,
        message: '✅ OBS automatisch verbunden & Enhanced-Broadcasting-Konflikt bereinigt!'
      };
    }
    if (prov.wsEnabledNow) {
      return {
        ok: false,
        port: prov.port || 4455,
        state: conn.state,
        message: '⚡ OBS WebSocket wurde automatisch in OBS aktiviert! Bitte OBS Studio 1× kurz neu starten, danach verbindet sich OmniGrid automatisch.'
      };
    }
    return {
      ok: false,
      port: prov.port || 4455,
      state: conn.state,
      message: prov.rootExists
        ? '⏳ OBS-Konfiguration vorbereitet — starte jetzt OBS Studio, OmniGrid verbindet sich automatisch.'
        : `⚠️ OBS nicht erreichbar (${conn.error || 'bitte OBS Studio starten'}).`
    };
  });

  ipcMain.handle('obs-ws-disconnect', () => {
    const cfg = loadConfig();
    if (cfg.obsWs) {
      cfg.obsWs.enabled = false;
      saveConfig(cfg);
    }
    obsWs.disconnect(true);
    appendDiagLog('system', 'info', 'OBS WebSocket v5 getrennt.');
    return { ok: true };
  });

  ipcMain.handle('obs-ws-action', async (_ev, payload) => {
    try {
      const act = payload?.action;
      if (act === 'scene') return await obsWs.setScene(payload.sceneName);
      if (act === 'toggle-stream') return await obsWs.toggleStream(buildObsStreamPrepOpts());
      if (act === 'toggle-record') return await obsWs.toggleRecord();
      if (act === 'save-replay') return await obsWs.saveReplayBuffer();
      if (act === 'toggle-mic') return await obsWs.toggleMicMute(payload.inputName || '');
      if (act === 'get-scene-items') return await obsWs.getSceneItems(payload.sceneName || '');
      if (act === 'set-scene-item-enabled') {
        return await obsWs.setSceneItemEnabled(payload.sceneName, payload.sceneItemId, payload.enabled);
      }
      if (act === 'set-scene-item-transform') {
        return await obsWs.setSceneItemTransform(payload.sceneName, payload.sceneItemId, payload.transform || {});
      }
      if (act === 'get-source-transparency') {
        return await obsWs.getSourceTransparency(payload.sourceName);
      }
      if (act === 'set-source-transparency') {
        return await obsWs.setSourceTransparency(payload.sourceName, payload.transparencyPct);
      }
      if (act === 'reorder-scene-item') {
        return await obsWs.reorderSceneItem(payload.sceneName, payload.sceneItemId, payload.mode, payload.sceneItemIndex);
      }
      if (act === 'create-scene') return await obsWs.createScene(payload.sceneName);
      if (act === 'get-audio-inputs') return await obsWs.getAudioInputs();
      if (act === 'refresh-omnigrid-overlays') return await obsWs.refreshAllOmniGridOverlays(obsServer.port || 4588);
      if (act === 'set-input-audio-device') return await obsWs.setInputAudioDevice(payload.inputName, payload.deviceId, payload.propertyName || 'device_id');
      if (act === 'set-input-vod-music-only') return await obsWs.setInputVodMusicOnly(payload.inputName, payload.musicOnly !== false);
      if (act === 'setup-music-vod-track') {
        const iniRes = obsAutoConfig.enableObsVodMusicTrack();
        const wsRes = await obsWs.setupMusicVodTrack({
          sceneName: payload.sceneName || '',
          createDedicatedSource: Boolean(payload.createDedicatedSource),
          musicSourceHint: spotify?.currentTrack?.source || ''
        });
        return { ...wsRes, profilesPatched: iniRes.profilesPatched };
      }
      if (act === 'set-input-volume') return await obsWs.setInputVolume(payload.inputName, payload.volumeMul);
      if (act === 'get-screenshot') return await obsWs.getSceneScreenshot(payload.sceneName || '');
      if (act === 'get-input-kinds') return await obsWs.getInputKinds();
      if (act === 'create-input') return await obsWs.createInput(payload);
      if (act === 'get-builtin-overlays') {
        return { ok: true, overlays: getBuiltinObsOverlays(obsServer.port || 4588) };
      }
      if (act === 'pick-transition-file') {
        const { dialog } = require('electron');
        const res = await dialog.showOpenDialog(mainWindow, {
          title: 'Eigene Transition-Datei wählen (Stinger-Video, GIF oder HTML)',
          properties: ['openFile'],
          filters: [
            { name: 'Transition-Dateien (Video, GIF, HTML)', extensions: ['webm', 'mp4', 'mov', 'gif', 'webp', 'png', 'html', 'htm'] }
          ]
        });
        if (res.canceled || !res.filePaths?.[0]) return { ok: false, canceled: true };
        const filePath = res.filePaths[0];
        const ext = path.extname(filePath).toLowerCase();
        const fileKind = (ext === '.html' || ext === '.htm')
          ? 'html'
          : (ext === '.gif' || ext === '.webp' || ext === '.png') ? 'image' : 'video';
        return { ok: true, filePath, fileName: path.basename(filePath), fileKind };
      }
      if (act === 'get-scene-transitions') {
        const rules = normalizeObsTransitionRules(loadConfig().obsSceneTransition);
        const scenes = Array.isArray(obsWs.getState()?.scenes) ? obsWs.getState().scenes : [];
        const obsTr = obsWs.getState()?.connected ? await obsWs.getSceneTransitions() : { transitions: [], current: '' };
        return {
          ok: true,
          rules,
          scenes,
          obsTransitions: obsTr.transitions || [],
          currentObsTransition: obsTr.current || ''
        };
      }
      if (act === 'test-scene-transition') {
        const rules = normalizeObsTransitionRules(loadConfig().obsSceneTransition);
        if (payload.ruleId) {
          const found = rules.find((r) => r.id === String(payload.ruleId));
          if (found) {
            triggerTransitionRule(found);
            return { ok: true, mode: found.mode };
          }
        }
        if (payload.mode === 'obs' && payload.obsTransitionName) {
          return await obsWs.setSceneTransition(payload.obsTransitionName);
        }
        if (payload.mode === 'custom-file' && payload.filePath) {
          tempPreviewTransitionPath = String(payload.filePath);
          obsServer.broadcastSceneTransition({
            mode: 'custom-file',
            fileKind: payload.fileKind || 'video',
            mediaUrl: '/api/custom-transition/preview',
            durationMs: Number(payload.durationMs) || 2600
          });
          return { ok: true, mode: 'custom-file' };
        }
        obsServer.broadcastSceneTransition({ mode: 'theme' });
        return { ok: true, mode: 'theme' };
      }
      if (act === 'remove-scene-transition') {
        const cfg = loadConfig();
        const rules = normalizeObsTransitionRules(cfg.obsSceneTransition)
          .filter((r) => r.id !== String(payload.id || ''));
        cfg.obsSceneTransition = { enabled: rules.length > 0, rules };
        saveConfig(cfg);
        return { ok: true, rules };
      }
      if (act === 'setup-scene-transition') {
        const transitionUrl = `http://127.0.0.1:${obsServer.port || 4588}/scene-transition`;
        const fromScene = String(payload.fromScene || '__all__');
        const toScene = String(payload.toScene || '__all__');
        const bidirectional = payload.bidirectional !== false;
        const mode = payload.mode === 'obs' || payload.mode === 'custom-file' ? payload.mode : 'theme';
        const obsTransitionName = String(payload.obsTransitionName || '').trim();
        const filePath = String(payload.filePath || '').trim();
        const fileName = String(payload.fileName || (filePath ? path.basename(filePath) : '')).trim();
        const fileKind = payload.fileKind === 'image' || payload.fileKind === 'html' ? payload.fileKind : 'video';
        const durationMs = Number(payload.durationMs) || 2600;
        if (mode === 'obs' && !obsTransitionName) {
          return { ok: false, error: 'Bitte einen OBS-Übergang auswählen.' };
        }
        if (mode === 'custom-file' && (!filePath || !fs.existsSync(filePath))) {
          return { ok: false, error: 'Bitte zuerst eine gültige Transition-Datei auswählen.' };
        }
        const allScenes = Array.isArray(obsWs.getState()?.scenes) ? obsWs.getState().scenes : [];
        const targets = (fromScene === '__all__' || toScene === '__all__')
          ? allScenes
          : [...new Set([fromScene, toScene].filter(Boolean))];
        if (!targets.length) return { ok: false, error: 'Keine Ziel-Szenen gefunden.' };
        const attached = [];
        if (mode === 'obs') {
          await obsWs.setSceneTransition(obsTransitionName);
        } else {
          for (const sc of targets) {
            await obsWs.addOrAttachBrowserOverlay({
              sceneName: sc,
              inputName: 'OmniGrid Scene Transition',
              url: transitionUrl,
              width: 1920,
              height: 1080,
              posX: 0,
              posY: 0,
              rerouteAudio: false
            });
            attached.push(sc);
          }
        }
        const cfg = loadConfig();
        const rules = normalizeObsTransitionRules(cfg.obsSceneTransition);
        const newRule = {
          id: `tr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          fromScene,
          toScene,
          bidirectional,
          mode,
          obsTransitionName,
          filePath,
          fileName,
          fileKind,
          durationMs
        };
        const existingIdx = rules.findIndex((r) =>
          (r.fromScene === fromScene && r.toScene === toScene && r.bidirectional === bidirectional) ||
          (bidirectional && r.bidirectional && r.fromScene === toScene && r.toScene === fromScene)
        );
        if (existingIdx >= 0) {
          rules[existingIdx] = newRule;
        } else {
          rules.push(newRule);
        }
        cfg.obsSceneTransition = { enabled: rules.length > 0, rules };
        saveConfig(cfg);
        setTimeout(() => triggerTransitionRule(newRule), 350);
        return { ok: true, attached, rules, rule: newRule, fromScene, toScene, bidirectional };
      }
      if (act === 'add-builtin-overlay') {
        const list = getBuiltinObsOverlays(obsServer.port || 4588);
        const preset = list.find((o) => o.id === payload.overlayId);
        if (!preset) return { ok: false, error: 'Unbekanntes App-Overlay.' };
        return await obsWs.addOrAttachBrowserOverlay({
          sceneName: payload.sceneName,
          inputName: payload.customName || preset.inputName,
          url: preset.url,
          width: preset.width,
          height: preset.height,
          posX: preset.posX,
          posY: preset.posY,
          rerouteAudio: Boolean(preset.rerouteAudio)
        });
      }
      if (act === 'add-builtin-bundle') {
        const list = getBuiltinObsOverlays(obsServer.port || 4588);
        const bundleMap = {
          lol: {
            addonMode: 'lol',
            gameName: 'League of Legends',
            chatTheme: 'lol',
            ids: ['game-stats', 'lol-ability-bar', 'lol-build', 'lol-map', 'alerts', 'chat']
          },
          justchatting: {
            addonMode: 'justchatting',
            gameName: 'Just Chatting',
            chatTheme: 'default',
            ids: ['jc-lowerthird', 'jc-qna', 'game-stats', 'spotify', 'alerts', 'chat']
          },
          techtalk: {
            addonMode: 'techtalk',
            gameName: 'Software and Game Development',
            chatTheme: 'tron',
            ids: ['tron-talk', 'game-stats', 'spotify', 'alerts', 'chat']
          },
          valorant: {
            addonMode: 'valorant',
            gameName: 'Valorant',
            chatTheme: 'valorant',
            ids: ['game-stats', 'val-bar', 'val-map', 'alerts', 'chat']
          },
          productlaunch: {
            addonMode: 'productlaunch',
            gameName: 'Product Presentation',
            chatTheme: 'minimal',
            ids: ['product-lowerthird', 'product-card', 'jc-qna', 'chat']
          },
          djstream: {
            addonMode: 'djstream',
            gameName: 'DJ Live Set',
            chatTheme: 'neon',
            ids: ['dj-stage', 'dj-nowplaying', 'alerts', 'chat']
          }
        };
        const bundle = bundleMap[payload.bundleId];
        if (!bundle) return { ok: false, error: 'Unbekanntes Overlay-Set.' };
        const added = [];
        for (const id of bundle.ids) {
          const preset = list.find((o) => o.id === id);
          if (!preset) continue;
          await obsWs.addOrAttachBrowserOverlay({
            sceneName: payload.sceneName,
            inputName: preset.inputName,
            url: preset.url,
            width: preset.width,
            height: preset.height,
            posX: preset.posX,
            posY: preset.posY,
            rerouteAudio: Boolean(preset.rerouteAudio)
          });
          added.push(preset.inputName);
        }
        const cfg = loadConfig();
        const ga = gameAddons.normalizeGameAddonsConfig(cfg.gameAddons);
        ga.overlayEnabled = true;
        ga.selectedMode = bundle.addonMode;
        ga.currentGameName = bundle.gameName;
        if (bundle.addonMode === 'lol') ga.lolPollingEnabled = true;
        cfg.gameAddons = ga;
        if (bundle.chatTheme) {
          cfg.appearance = { ...(cfg.appearance || {}), obsChatTheme: bundle.chatTheme };
          obsServer.broadcastAppearance({
            ...cfg.appearance,
            platformIndicatorStyle: cfg.platformIndicatorStyle || 'icon_badge'
          });
        }
        saveConfig(cfg);
        broadcastGameAddonsState(cfg);
        return { ok: true, added, addonMode: bundle.addonMode, chatTheme: bundle.chatTheme || 'auto' };
      }
      if (act === 'remove-scene-item') return await obsWs.removeSceneItem(payload.sceneName, payload.sceneItemId);
      if (act === 'rename-source') {
        return await obsWs.renameSource(payload.oldName, payload.newName, payload.inputKind || '');
      }
      if (act === 'start-virtual-cam') return await obsWs.startVirtualCam();
      if (act === 'stop-virtual-cam') return await obsWs.stopVirtualCam();
      if (act === 'inspect-input') {
        const res = await obsWs.inspectInputProperties(payload.inputName);
        if (process.platform === 'darwin' && ['screen_capture', 'sck_audio_capture', 'display_capture', 'window_capture'].includes(res.inputKind)) {
          const { screen, desktopCapturer } = require('electron');
          const { execFile } = require('child_process');
          if (res.inputKind === 'screen_capture') {
            res.properties.type = [
              { itemName: 'Monitoraufnahme', itemValue: 0 },
              { itemName: 'Fensteraufnahme', itemValue: 1 },
              { itemName: 'Anwendungsaufnahme', itemValue: 2 }
            ];
            res.properties.display = screen.getAllDisplays().map((d, idx) => ({
              itemName: `${d.label || `Display ${idx + 1}`}: ${d.bounds.width}×${d.bounds.height} @ ${d.bounds.x},${d.bounds.y}`,
              itemValue: d.id
            }));
          }
          try {
            const sources = await desktopCapturer.getSources({ types: ['window'], thumbnailSize: { width: 1, height: 1 } });
            res.properties.window = sources
              .map((s) => {
                const m = String(s.id || '').match(/^window:(\d+):/);
                const wid = m ? parseInt(m[1], 10) : 0;
                return wid > 0 && s.name ? { itemName: s.name, itemValue: wid } : null;
              })
              .filter(Boolean);
          } catch (e) {
            res.properties.window = [];
          }
          res.properties.application = await new Promise((resolve) => {
            const jxa = 'ObjC.import("AppKit"); const apps = $.NSWorkspace.sharedWorkspace.runningApplications; const out = []; for (let i = 0; i < apps.count; i++) { const a = apps.objectAtIndex(i); if (a.activationPolicy === $.NSApplicationActivationPolicyRegular) { const bid = ObjC.unwrap(a.bundleIdentifier); const name = ObjC.unwrap(a.localizedName); if (bid && name) out.push({ itemName: name, itemValue: bid }); } } JSON.stringify(out);';
            execFile('osascript', ['-l', 'JavaScript', '-e', jxa], { timeout: 3000 }, (err, stdout) => {
              if (err) return resolve([]);
              try { resolve(JSON.parse(String(stdout || '[]').trim())); } catch (e) { resolve([]); }
            });
          });
        }
        return res;
      }
      if (act === 'set-input-settings') return await obsWs.setInputSettings(payload.inputName, payload.inputSettings || {});
      if (act === 'set-scene-editor-enabled') {
        const cfg = loadConfig();
        cfg.obsWs = { ...(cfg.obsWs || {}), sceneEditorEnabled: Boolean(payload.enabled) };
        saveConfig(cfg);
        return { ok: true, sceneEditorEnabled: cfg.obsWs.sceneEditorEnabled };
      }
      return { ok: false, error: 'Unbekannte OBS-Aktion.' };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('test-obs-alert', (_ev, type) => {
    const alertType = normalizeObsAlertType(type || 'sub');
    const sampleMap = {
      follow: { author: 'NeuerFollower', summary: 'Folgt jetzt dem Kanal!' },
      sub: { author: 'StreamFan99', summary: 'Neues Tier-1 Abo!' },
      resub: { author: 'TreuerZuschauer', summary: '6 Monate Resub! Danke!' },
      subgift: { author: 'GrosszuegigerMod', summary: 'Hat 5 Subs verschenkt!' },
      bits: { author: 'CheerKing', summary: '500 Bits gecheert!' },
      raid: { author: 'PartnerStreamer', summary: 'Raid mit 42 Zuschauern!' }
    };
    const sample = sampleMap[alertType] || sampleMap.sub;
    broadcastEventToObsAlert({
      id: `test_alert_${Date.now()}`,
      platform: 'twitch',
      type: alertType,
      author: sample.author,
      summary: sample.summary,
      timestamp: Date.now()
    }, true);
    return { ok: true, type: alertType };
  });

  ipcMain.handle('open-standalone-chat', (_ev, snapLeftFullHeight) => {
    openStandaloneChatWindow(Boolean(snapLeftFullHeight));
    return { ok: true };
  });

  ipcMain.handle('toggle-slim-dock', (_ev, makeSlim) => {
    const targetWin = BrowserWindow.fromWebContents(_ev.sender) || mainWindow;
    if (!targetWin) return false;
    const { screen } = require('electron');
    const workArea = screen.getPrimaryDisplay().workArea;
    if (makeSlim) {
      targetWin.setBounds({
        x: workArea.x,
        y: workArea.y,
        width: 320,
        height: workArea.height
      });
    } else {
      targetWin.setSize(1180, 820);
      targetWin.center();
    }
    return makeSlim;
  });

  ipcMain.handle('connect-platform', async (_ev, { platform, config }) => {
    stopDemoSimulation();
    const currentCfg = { ...loadConfig(), ...config };
    saveConfig(currentCfg);
    appendDiagLog(platform, 'info', `Verbinde ${platform.toUpperCase()}...`);
    connectSinglePlatform(platform, currentCfg);
    return { ok: true };
  });

  ipcMain.handle('reconnect-platform', async (_ev, { platform, config }) => {
    stopDemoSimulation();
    const currentCfg = { ...loadConfig(), ...config };
    saveConfig(currentCfg);
    appendDiagLog(platform, 'warn', `Manueller Reconnect für ${platform.toUpperCase()} ausgelöst...`);
    if (platform === 'twitch') twitch.reconnect();
    else if (platform === 'youtube') await youtube.reconnect();
    else if (platform === 'tiktok') await tiktok.reconnect();
    return { ok: true };
  });

  ipcMain.handle('toggle-platform-enabled', async (_ev, { platform, enabled, config }) => {
    const currentCfg = { ...loadConfig(), ...config };
    currentCfg[`${platform}Enabled`] = Boolean(enabled);
    saveConfig(currentCfg);
    platformStatus[platform].enabled = Boolean(enabled);
    appendDiagLog(platform, 'info', `Plattform ${platform.toUpperCase()} ${enabled ? 'aktiviert' : 'deaktiviert'}`);

    if (!enabled) {
      if (platform === 'twitch') twitch.disconnect();
      else if (platform === 'youtube') youtube.disconnect();
      else if (platform === 'tiktok') tiktok.disconnect();
    } else if (!demoActive) {
      connectSinglePlatform(platform, currentCfg);
    }

    obsServer.broadcastStatus(platformStatus);
    broadcastToWindows('platform-status', platformStatus);
    return { ok: true };
  });

  ipcMain.handle('discover-youtube-streams', async (_ev, channelOrUrl) => {
    appendDiagLog('youtube', 'info', `Scanne YouTube-Kanal (${channelOrUrl}) nach aktiven Livestreams...`);
    const streams = await youtube.discoverStreams(channelOrUrl);
    appendDiagLog('youtube', 'info', `${streams.length} YouTube-Stream(s) gefunden.`);
    platformStatus.youtube.availableStreams = streams;
    broadcastToWindows('platform-status', platformStatus);
    return { ok: true, streams };
  });

  function parseGoogleOAuthClientJson(rawText) {
    let parsed;
    try {
      parsed = JSON.parse(String(rawText || ''));
    } catch (e) {
      throw new Error('Ungültige JSON-Datei (konnte nicht gelesen werden).');
    }
    const isWebClient = Boolean(parsed?.web && !parsed?.installed);
    const block = parsed?.installed || parsed?.web || parsed || {};
    const clientId = String(block.client_id || block.clientId || '').trim();
    const clientSecret = String(block.client_secret || block.clientSecret || '').trim();
    if (!clientId) {
      throw new Error('Keine "client_id" in dieser JSON-Datei gefunden. Bitte lade die OAuth-Client-JSON aus Google Cloud (Download JSON) herunter.');
    }
    if (!clientSecret) {
      throw new Error('Kein "client_secret" in dieser JSON-Datei gefunden.');
    }
    return {
      clientId,
      clientSecret,
      projectId: String(block.project_id || '').trim(),
      isWebClient
    };
  }

  ipcMain.handle('youtube-oauth-import-json', async (_ev, opts = {}) => {
    try {
      const { dialog, shell } = require('electron');
      let filePath = String(opts?.filePath || '').trim();
      if (!filePath) {
        let defaultDir = app.getPath('home');
        try {
          defaultDir = app.getPath('downloads') || defaultDir;
        } catch (e) {}
        const win = BrowserWindow.getFocusedWindow() || mainWindow;
        const pick = await dialog.showOpenDialog(win, {
          title: 'Google OAuth2 JSON-Datei auswählen (client_secret_...json)',
          defaultPath: defaultDir,
          properties: ['openFile'],
          filters: [{ name: 'Google OAuth JSON', extensions: ['json'] }]
        });
        if (pick.canceled || !pick.filePaths?.[0]) {
          return { ok: false, canceled: true };
        }
        filePath = pick.filePaths[0];
      }

      const rawText = fs.readFileSync(filePath, 'utf8');
      const extracted = parseGoogleOAuthClientJson(rawText);

      // Persist clientId & clientSecret immediately so they are never lost even if browser login is retried
      const preCfg = loadConfig();
      const preOAuth = {
        ...(preCfg.youtubeOAuth || {}),
        clientId: extracted.clientId,
        clientSecret: extracted.clientSecret
      };
      preCfg.youtubeOAuth = preOAuth;
      saveConfig(preCfg);
      youtube.setOAuthConfig(preOAuth);

      if (opts?.autoLogin === false) {
        return {
          ok: true,
          importedOnly: true,
          fileName: path.basename(filePath),
          isWebClient: extracted.isWebClient,
          oauth: preOAuth
        };
      }

      const res = await youtube.startOAuthLogin({
        clientId: extracted.clientId,
        clientSecret: extracted.clientSecret,
        openUrl: (url) => shell.openExternal(url)
      });
      const cfg = loadConfig();
      cfg.youtubeOAuth = res.oauth;
      saveConfig(cfg);
      platformStatus.youtube.canWrite = youtube.canWrite;
      obsServer.broadcastStatus(platformStatus);
      broadcastToWindows('platform-status', platformStatus);
      appendDiagLog(
        'youtube',
        'info',
        `Google OAuth2 JSON importiert & YouTube verbunden (${res.oauth.accountName || 'Schreibrechte aktiv'}).`
      );
      return {
        ok: true,
        fileName: path.basename(filePath),
        isWebClient: extracted.isWebClient,
        oauth: res.oauth
      };
    } catch (err) {
      appendDiagLog('youtube', 'error', `Google OAuth JSON-Import fehlgeschlagen: ${err.message}`);
      const cfg = loadConfig();
      return {
        ok: false,
        error: err.message,
        oauth: cfg.youtubeOAuth || {}
      };
    }
  });

  ipcMain.handle('youtube-oauth-login', async (_ev, creds) => {
    try {
      const { shell } = require('electron');
      const res = await youtube.startOAuthLogin({
        clientId: creds?.clientId,
        clientSecret: creds?.clientSecret,
        openUrl: (url) => shell.openExternal(url)
      });
      const cfg = loadConfig();
      cfg.youtubeOAuth = res.oauth;
      saveConfig(cfg);
      platformStatus.youtube.canWrite = youtube.canWrite;
      obsServer.broadcastStatus(platformStatus);
      broadcastToWindows('platform-status', platformStatus);
      appendDiagLog('youtube', 'info', `YouTube OAuth2 verbunden (${res.oauth.accountName || 'Schreibrechte aktiv'}).`);
      return { ok: true, oauth: res.oauth };
    } catch (err) {
      appendDiagLog('youtube', 'error', `YouTube OAuth2 fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('youtube-oauth-logout', () => {
    const cfg = loadConfig();
    const nextOAuth = {
      clientId: cfg.youtubeOAuth?.clientId || '',
      clientSecret: cfg.youtubeOAuth?.clientSecret || '',
      accessToken: '',
      refreshToken: '',
      expiresAt: 0,
      accountName: ''
    };
    cfg.youtubeOAuth = nextOAuth;
    saveConfig(cfg);
    youtube.setOAuthConfig(nextOAuth);
    platformStatus.youtube.canWrite = false;
    obsServer.broadcastStatus(platformStatus);
    broadcastToWindows('platform-status', platformStatus);
    appendDiagLog('youtube', 'info', 'YouTube OAuth2 abgemeldet (Nur-Lesen-Modus).');
    return { ok: true, oauth: nextOAuth };
  });

  ipcMain.handle('disconnect-platform', (_ev, platform) => {
    appendDiagLog(platform, 'info', `Verbindung zu ${platform.toUpperCase()} getrennt.`);
    if (platform === 'twitch') twitch.disconnect();
    else if (platform === 'youtube') youtube.disconnect();
    else if (platform === 'tiktok') tiktok.disconnect();
    return { ok: true };
  });

  ipcMain.handle('connect-all', async (_ev, config) => {
    stopDemoSimulation();
    const currentCfg = { ...loadConfig(), ...config };
    saveConfig(currentCfg);
    appendDiagLog('system', 'info', 'Verbinde alle aktiven Plattformen...');
    connectAllSavedChannels(currentCfg);
    return { ok: true };
  });

  ipcMain.handle('send-chat-message', async (_ev, payload) => {
    const text = typeof payload === 'string' ? payload : payload?.text || '';
    const replyParentId = typeof payload === 'object' ? payload?.replyParentId || null : null;
    const targets = typeof payload === 'object' && Array.isArray(payload?.targets) ? payload.targets : ['twitch'];
    const cfg = loadConfig();

    const results = [];
    const errors = [];

    if (targets.includes('twitch')) {
      if (demoActive) {
        forwardChatMessage({
          id: `self_tw_${Date.now()}`,
          platform: 'twitch',
          channel: cfg.twitchChannel || 'demo-live',
          author: cfg.streamerName || cfg.twitchUsername || 'Streamer (Du)',
          color: '#10b981',
          badges: ['BROADCASTER'],
          text,
          isSelf: true,
          timestamp: Date.now()
        });
        results.push('twitch');
        appendDiagLog('twitch', 'info', `Nachricht gesendet (Demo): "${text}"`);
      } else {
        try {
          twitch.sendMessage(text, replyParentId);
          results.push('twitch');
          appendDiagLog('twitch', 'info', `Nachricht an Twitch IRC gesendet: "${text}"`);
        } catch (err) {
          errors.push(`Twitch: ${err.message}`);
          appendDiagLog('twitch', 'error', `Senden fehlgeschlagen: ${err.message}`);
        }
      }
    }

    if (targets.includes('youtube')) {
      if (demoActive) {
        forwardChatMessage({
          id: `self_yt_${Date.now()}`,
          platform: 'youtube',
          channel: cfg.youtubeChannel || '@DeinKanal',
          author: cfg.streamerName || 'Streamer (Du)',
          color: '#ff4e45',
          badges: ['OWNER'],
          text,
          isSelf: true,
          timestamp: Date.now()
        });
        results.push('youtube');
      } else {
        try {
          await youtube.sendMessage(text);
          results.push('youtube');
          appendDiagLog('youtube', 'info', `Nachricht an YouTube Live Chat gesendet: "${text}"`);
        } catch (err) {
          errors.push(`YouTube: ${err.message}`);
          appendDiagLog('youtube', 'error', `Senden fehlgeschlagen: ${err.message}`);
        }
      }
    }

    if (targets.includes('tiktok')) {
      errors.push('TikTok: Offizielle Webcast-Schnittstelle unterstützt kein Senden über Drittanbieter-Tools.');
    }

    if (results.length > 0) {
      return { ok: true, sentTo: results, warnings: errors };
    }
    return { ok: false, error: errors.join('\n') || 'Keine unterstützte Zielplattform ausgewählt.' };
  });

  ipcMain.handle('get-user-details', async (_ev, { platform, author, avatar }) => {
    if (platform === 'twitch') {
      const info = await twitch.getUserInfo(author);
      if (info) {
        return {
          ok: true,
          avatar: info.avatar || avatar || '',
          createdAt: info.createdAt || null,
          description: info.description || ''
        };
      }
    }
    return {
      ok: true,
      avatar: avatar || '',
      createdAt: null
    };
  });

  ipcMain.handle('open-user-profile', (_ev, { platform, author }) => {
    const { shell } = require('electron');
    if (platform === 'twitch-token-generator') {
      const url = 'https://twitchtokengenerator.com/';
      shell.openExternal(url);
      return { ok: true, url };
    }
    const clean = String(author || '').trim().replace(/^@/, '');
    if (!clean) return { ok: false };
    let url = `https://www.twitch.tv/${encodeURIComponent(clean.toLowerCase())}`;
    if (platform === 'youtube') {
      url = `https://www.youtube.com/@${encodeURIComponent(clean)}`;
    } else if (platform === 'tiktok') {
      url = `https://www.tiktok.com/@${encodeURIComponent(clean)}`;
    }
    shell.openExternal(url);
    return { ok: true, url };
  });

  ipcMain.handle('moderate-action', (_ev, { action, msg, durationSec }) => {
    if (!msg) return { ok: false };
    const cfg = loadConfig();
    const authorLow = (msg.author || '').toLowerCase();
    const canServerModTwitch = msg.platform === 'twitch' && twitch.connected && Boolean(twitch.oauthToken);

    if (action === 'delete-msg') {
      obsServer.deleteMessage(msg.id);
      broadcastToWindows('message-deleted', { id: msg.id });
      if (canServerModTwitch) {
        try {
          twitch.sendMessage(`/delete ${msg.id}`);
        } catch (e) {}
      }
      return { ok: true, serverExecuted: canServerModTwitch };
    }

    if (action === 'mute-user') {
      const muted = new Set(cfg.mutedUsers || []);
      muted.add(authorLow);
      cfg.mutedUsers = Array.from(muted);
      saveConfig(cfg);
      obsServer.deleteUserMessages(authorLow);
      broadcastToWindows('user-muted', { author: authorLow, mutedUsers: cfg.mutedUsers });
      return { ok: true };
    }

    if (action === 'unmute-user') {
      cfg.mutedUsers = (cfg.mutedUsers || []).filter((u) => u !== authorLow);
      saveConfig(cfg);
      broadcastToWindows('user-muted', { author: null, mutedUsers: cfg.mutedUsers });
      return { ok: true };
    }

    // Platform-specific server moderation (only executed if supported & authenticated!)
    if (action === 'timeout') {
      if (!canServerModTwitch) {
        return {
          ok: false,
          error:
            msg.platform === 'twitch'
              ? 'Nicht ausgeführt: Kein Twitch OAuth-Token mit Mod-Rechten hinterlegt.'
              : `Nicht unterstützt: ${msg.platform.toUpperCase()} erlaubt kein Server-Timeout ohne OAuth-Mod-API.`
        };
      }
      const sec = Number(durationSec) || 600;
      obsServer.deleteUserMessages(authorLow);
      broadcastToWindows('user-muted', { author: authorLow, mutedUsers: cfg.mutedUsers || [] });
      try {
        twitch.sendMessage(`/timeout ${msg.author} ${sec}`);
      } catch (e) {}
      return { ok: true, serverExecuted: true };
    }

    if (action === 'ban-user') {
      if (!canServerModTwitch) {
        return {
          ok: false,
          error:
            msg.platform === 'twitch'
              ? 'Nicht ausgeführt: Kein Twitch OAuth-Token mit Mod-Rechten hinterlegt.'
              : `Nicht unterstützt: ${msg.platform.toUpperCase()} erlaubt keinen Server-Ban über diese Verbindung.`
        };
      }
      obsServer.deleteUserMessages(authorLow);
      broadcastToWindows('user-muted', { author: authorLow, mutedUsers: cfg.mutedUsers || [] });
      try {
        twitch.sendMessage(`/ban ${msg.author}`);
      } catch (e) {}
      return { ok: true, serverExecuted: true };
    }

    if (action === 'unban-user') {
      // Also remove from local mutedUsers list if present
      cfg.mutedUsers = (cfg.mutedUsers || []).filter((u) => u !== authorLow);
      saveConfig(cfg);
      broadcastToWindows('user-muted', { author: null, mutedUsers: cfg.mutedUsers });

      if (!canServerModTwitch) {
        return {
          ok: true,
          serverExecuted: false,
          note: 'Lokale Stummschaltung aufgehoben (Server-Unban erfordert Twitch OAuth-Token).'
        };
      }
      try {
        twitch.sendMessage(`/unban ${msg.author}`);
      } catch (e) {}
      return { ok: true, serverExecuted: true };
    }

    return { ok: false };
  });

  ipcMain.on('pin-message', (_ev, msgOrNull) => {
    obsServer.broadcastPin(msgOrNull);
  });

  ipcMain.on('clear-chat', () => {
    globalSeenMsgKeys.clear();
    obsServer.clearChat();
  });

  ipcMain.handle('toggle-always-on-top', (_ev) => {
    const targetWin = BrowserWindow.fromWebContents(_ev.sender) || mainWindow;
    if (!targetWin) return false;
    const nextState = !targetWin.isAlwaysOnTop();
    targetWin.setAlwaysOnTop(nextState, 'floating');
    if (targetWin === chatDockWindow) {
      const cfg = loadConfig();
      cfg.chatDockAlwaysOnTop = nextState;
      saveConfig(cfg);
    } else {
      isAlwaysOnTop = nextState;
    }
    return nextState;
  });

  ipcMain.handle('toggle-demo', () => {
    if (demoActive) {
      stopDemoSimulation();
    } else {
      startDemoSimulation();
    }
    return demoActive;
  });

  ipcMain.handle('get-perf-stats', () => {
    const mem = process.memoryUsage();
    const ramMb = Math.round((mem.rss || 0) / (1024 * 1024));
    const emoteStats = emoteManager.getStats ? emoteManager.getStats() : { total: emoteManager.emoteMap?.size || 0 };
    return {
      ok: true,
      ramMb,
      heapMb: Math.round((mem.heapUsed || 0) / (1024 * 1024)),
      cachedEmotes: emoteStats.total || 0
    };
  });

  ipcMain.handle('reset-defaults', () => {
    const current = loadConfig();
    const fresh = getDefaultConfig();
    // Preserve account credentials & window positions while resetting design/emote/event settings
    fresh.streamerName = current.streamerName;
    fresh.twitchChannel = current.twitchChannel;
    fresh.twitchUsername = current.twitchUsername;
    fresh.twitchToken = current.twitchToken;
    fresh.youtubeChannel = current.youtubeChannel;
    fresh.youtubeVideoId = current.youtubeVideoId;
    fresh.tiktokChannel = current.tiktokChannel;
    fresh.tiktokRoomId = current.tiktokRoomId;
    fresh.mainWindowBounds = current.mainWindowBounds;
    fresh.chatDockBounds = current.chatDockBounds;

    saveConfig(fresh);
    emoteManager.updateSettings(fresh.emoteSettings);
    obsServer.broadcastAppearance({
      ...fresh.appearance,
      platformIndicatorStyle: fresh.platformIndicatorStyle
    });
    return { ok: true, config: fresh };
  });

  const isPlainObj = (v) => Boolean(v) && typeof v === 'object' && !Array.isArray(v);
  const deepMergeConfig = (base, patch) => {
    if (!isPlainObj(base)) return patch !== undefined ? patch : base;
    const out = { ...base };
    if (!isPlainObj(patch)) return out;
    for (const [k, v] of Object.entries(patch)) {
      out[k] = isPlainObj(v) && isPlainObj(base[k]) ? deepMergeConfig(base[k], v) : v;
    }
    return out;
  };
  const summarizeBackupConfig = (cfg = {}) => {
    const keys = [];
    if (cfg.twitch?.oauth || cfg.twitch?.clientId || cfg.twitch?.channel) keys.push('Twitch');
    if (cfg.youtube?.apiKey || cfg.youtube?.oauthClientId || cfg.youtube?.oauthRefreshToken || cfg.youtube?.channel) keys.push('YouTube');
    if (cfg.tiktok?.channel) keys.push('TikTok');
    if (cfg.multiStream?.targets) keys.push('Multi-Stream');
    if (cfg.obsWs?.password || cfg.obsWs?.host) keys.push('OBS');
    if (cfg.voiceControl?.relayUrl || cfg.voiceControl?.channelId) keys.push('Sprachsteuerung');
    if (cfg.hueLights?.username || cfg.nanoleafLights?.authToken || cfg.goveeLights?.apiKey || cfg.elgatoLights?.enabled) keys.push('Lichter');
    return { sectionCount: Object.keys(cfg).length, included: keys };
  };

  const MAX_BACKUP_ASSET_BYTES = 45 * 1024 * 1024;

  const collectBackupAssets = (cfg) => {
    const files = {};
    const pathToKey = new Map();
    const skipped = [];
    let seq = 1;

    const packFile = (filePath) => {
      const p = String(filePath || '').trim();
      if (!p || !fs.existsSync(p)) return '';
      if (pathToKey.has(p)) return pathToKey.get(p);
      try {
        const st = fs.statSync(p);
        if (!st.isFile() || st.size <= 0) return '';
        if (st.size > MAX_BACKUP_ASSET_BYTES) {
          skipped.push(path.basename(p));
          return '';
        }
        const key = `asset_${seq++}`;
        files[key] = {
          fileName: path.basename(p),
          originalPath: p,
          size: st.size,
          base64: fs.readFileSync(p).toString('base64')
        };
        pathToKey.set(p, key);
        return key;
      } catch (e) {
        return '';
      }
    };

    const refs = {
      soundboard: {},
      alertMedia: {},
      sponsors: {},
      transitions: {}
    };

    for (const item of (cfg?.soundboard?.items || [])) {
      if (item?.id && item.filePath) {
        const k = packFile(item.filePath);
        if (k) refs.soundboard[item.id] = k;
      }
    }
    for (const [evKey, entry] of Object.entries(cfg?.obsAlerts?.customMedia || {})) {
      if (!entry || typeof entry !== 'object') continue;
      const imgKey = entry.imagePath ? packFile(entry.imagePath) : '';
      const audKey = entry.audioPath ? packFile(entry.audioPath) : '';
      if (imgKey || audKey) refs.alertMedia[evKey] = { ...(imgKey ? { image: imgKey } : {}), ...(audKey ? { audio: audKey } : {}) };
    }
    for (const sp of (cfg?.sponsors?.items || [])) {
      if (sp?.id && sp.imagePath) {
        const k = packFile(sp.imagePath);
        if (k) refs.sponsors[sp.id] = k;
      }
    }
    for (const r of normalizeObsTransitionRules(cfg?.obsSceneTransition)) {
      if (r.mode === 'custom-file' && r.filePath) {
        const k = packFile(r.filePath);
        if (k) refs.transitions[r.id] = k;
      }
    }

    const themePackFiles = [];
    try {
      const themesDir = themePacks.getThemesDir(app.getPath('userData'));
      for (const f of fs.readdirSync(themesDir)) {
        if (!f.endsWith('.json')) continue;
        try {
          themePackFiles.push({
            fileName: f,
            content: fs.readFileSync(path.join(themesDir, f), 'utf8')
          });
        } catch (e) {}
      }
    } catch (e) {}

    return { files, refs, themePacks: themePackFiles, skipped };
  };

  const restoreBackupAssets = (backupAssets, merged) => {
    if (!backupAssets || typeof backupAssets !== 'object') return { restoredFiles: 0, restoredThemePacks: 0 };
    const restoreDir = path.join(app.getPath('userData'), 'restored-assets');
    try { fs.mkdirSync(restoreDir, { recursive: true }); } catch (e) {}

    const keyToPath = new Map();
    const filesObj = backupAssets.files && typeof backupAssets.files === 'object' ? backupAssets.files : {};
    for (const [key, meta] of Object.entries(filesObj)) {
      if (!meta?.base64) continue;
      const safeKey = String(key).replace(/[^a-zA-Z0-9_-]/g, '');
      const safeName = path.basename(String(meta.fileName || 'asset.bin')).replace(/[^a-zA-Z0-9._-]/g, '_');
      const dest = path.join(restoreDir, `${safeKey}_${safeName}`);
      try {
        fs.writeFileSync(dest, Buffer.from(meta.base64, 'base64'));
        keyToPath.set(key, dest);
      } catch (e) {}
    }

    const refs = backupAssets.refs && typeof backupAssets.refs === 'object' ? backupAssets.refs : {};
    if (Array.isArray(merged?.soundboard?.items) && refs.soundboard) {
      merged.soundboard.items.forEach((item) => {
        const k = refs.soundboard[item?.id];
        if (k && keyToPath.has(k)) item.filePath = keyToPath.get(k);
      });
    }
    if (merged?.obsAlerts?.customMedia && refs.alertMedia) {
      for (const [evKey, m] of Object.entries(refs.alertMedia)) {
        if (!merged.obsAlerts.customMedia[evKey]) merged.obsAlerts.customMedia[evKey] = {};
        if (m?.image && keyToPath.has(m.image)) merged.obsAlerts.customMedia[evKey].imagePath = keyToPath.get(m.image);
        if (m?.audio && keyToPath.has(m.audio)) merged.obsAlerts.customMedia[evKey].audioPath = keyToPath.get(m.audio);
      }
    }
    if (Array.isArray(merged?.sponsors?.items) && refs.sponsors) {
      merged.sponsors.items.forEach((sp) => {
        const k = refs.sponsors[sp?.id];
        if (k && keyToPath.has(k)) sp.imagePath = keyToPath.get(k);
      });
    }
    if (merged?.obsSceneTransition && refs.transitions) {
      const rules = normalizeObsTransitionRules(merged.obsSceneTransition);
      rules.forEach((r) => {
        const k = refs.transitions[r.id];
        if (k && keyToPath.has(k)) r.filePath = keyToPath.get(k);
      });
      merged.obsSceneTransition = { enabled: rules.length > 0, rules };
    }

    let restoredThemePacks = 0;
    if (Array.isArray(backupAssets.themePacks)) {
      const themesDir = themePacks.getThemesDir(app.getPath('userData'));
      for (const tp of backupAssets.themePacks) {
        if (!tp?.fileName || typeof tp.content !== 'string') continue;
        const safeFile = path.basename(String(tp.fileName)).replace(/[^a-zA-Z0-9._-]/g, '_');
        if (!safeFile.endsWith('.json')) continue;
        try {
          JSON.parse(tp.content);
          fs.writeFileSync(path.join(themesDir, safeFile), tp.content, 'utf8');
          restoredThemePacks++;
        } catch (e) {}
      }
    }

    return { restoredFiles: keyToPath.size, restoredThemePacks };
  };

  ipcMain.handle('export-config', async (_ev) => {
    const { dialog } = require('electron');
    const win = BrowserWindow.fromWebContents(_ev.sender) || mainWindow;
    const today = new Date().toISOString().slice(0, 10);
    const res = await dialog.showSaveDialog(win, {
      title: 'OmniGrid Studio Komplett-Backup exportieren',
      defaultPath: `omnigrid-backup-${today}.json`,
      filters: [{ name: 'OmniGrid Backup (.json)', extensions: ['json'] }]
    });
    if (res.canceled || !res.filePath) return { ok: false, canceled: true };
    const cfg = loadConfig(true);
    const assets = collectBackupAssets(cfg);
    const payload = {
      format: 'omnigrid-studio-backup',
      version: 2,
      appVersion: app.getVersion(),
      exportedAt: new Date().toISOString(),
      config: cfg,
      assets
    };
    fs.writeFileSync(res.filePath, JSON.stringify(payload, null, 2), 'utf8');
    const summary = {
      ...summarizeBackupConfig(cfg),
      assetsCount: Object.keys(assets.files).length,
      themePacksCount: assets.themePacks.length
    };
    return { ok: true, filePath: res.filePath, summary };
  });

  ipcMain.handle('import-config', async (_ev, opts = {}) => {
    const { dialog } = require('electron');
    const win = BrowserWindow.fromWebContents(_ev.sender) || mainWindow;
    let raw = typeof opts?.rawJson === 'string' ? opts.rawJson : '';
    let sourceName = String(opts?.fileName || '').trim();
    if (!raw) {
      const res = await dialog.showOpenDialog(win, {
        title: 'OmniGrid Studio Backup importieren',
        properties: ['openFile'],
        filters: [{ name: 'OmniGrid Backup (.json)', extensions: ['json'] }]
      });
      if (res.canceled || !res.filePaths?.[0]) return { ok: false, canceled: true };
      raw = fs.readFileSync(res.filePaths[0], 'utf8');
      sourceName = path.basename(res.filePaths[0]);
    }
    try {
      const parsed = JSON.parse(raw);
      const importedCfg = parsed?.format === 'omnigrid-studio-backup' && isPlainObj(parsed.config) ? parsed.config : parsed;
      if (!isPlainObj(importedCfg) || Object.keys(importedCfg).length === 0) {
        return { ok: false, error: 'Ungültige Backup-Datei (kein gültiges JSON-Objekt).' };
      }
      try {
        const currentPath = getConfigPath();
        if (fs.existsSync(currentPath)) {
          fs.copyFileSync(currentPath, path.join(path.dirname(currentPath), 'config.before-import.json'));
        }
      } catch (e) {}
      const merged = deepMergeConfig(getDefaultConfig(), importedCfg);
      const restored = restoreBackupAssets(parsed?.assets, merged);
      saveConfig(merged);
      emoteManager.updateSettings(merged.emoteSettings);
      obsServer.broadcastAppearance({
        ...merged.appearance,
        platformIndicatorStyle: merged.platformIndicatorStyle
      });
      obsServer.broadcastAlertConfig(resolveObsAlertConfigForBroadcast(merged.obsAlerts || getDefaultConfig().obsAlerts, obsServer.port || 4588));
      broadcastChampionThemeToObs(merged);
      broadcastSponsorsToObs(merged).catch(() => {});
      syncChatTimer(merged);
      broadcastScheduleToObs(merged);
      broadcastGameAddonsState(merged);
      voiceBridge.stop();
      if (obsWs.connected) obsWs.refreshOmniGridOverlays().catch(() => {});
      if (opts?.reloadWindow !== false && mainWindow && !mainWindow.isDestroyed()) {
        setTimeout(() => {
          if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.reload();
        }, 550);
      }
      const summary = {
        ...summarizeBackupConfig(merged),
        assetsCount: restored.restoredFiles,
        themePacksCount: restored.restoredThemePacks
      };
      return { ok: true, config: merged, fileName: sourceName, summary };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  // --- PERIPHERALS: WebHID Permissions, Device Discovery & Global Hotkeys ---
  const { session, globalShortcut } = require('electron');
  const { exec } = require('child_process');
  let pendingHidTarget = null;

  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    if (permission === 'hid') return true;
    return false;
  });

  session.defaultSession.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'hid') return true;
    return false;
  });

  mainWindow.webContents.session.on('select-hid-device', (event, details, callback) => {
    event.preventDefault();
    const list = details.deviceList || [];
    if (list.length === 0) {
      callback('');
      return;
    }
    let chosen = null;
    if (pendingHidTarget) {
      chosen = list.find(
        (d) =>
          (pendingHidTarget.vendorId && d.vendorId === Number(pendingHidTarget.vendorId)) &&
          (pendingHidTarget.productId && d.productId === Number(pendingHidTarget.productId))
      ) || list.find((d) => pendingHidTarget.name && d.name && d.name.toLowerCase().includes(pendingHidTarget.name.toLowerCase()));
      pendingHidTarget = null;
    }
    callback((chosen || list[0]).deviceId);
  });

  function registerGlobalHotkeys(cfg) {
    globalShortcut.unregisterAll();
    const pCfg = cfg?.peripherals;
    if (!pCfg || pCfg.globalHotkeysEnabled === false || !pCfg.hotkeys) return;

    const mapActions = {
      [pCfg.hotkeys.pinLast]: 'pin-last',
      [pCfg.hotkeys.unpin]: 'unpin',
      [pCfg.hotkeys.clearChat]: 'clear-chat',
      [pCfg.hotkeys.toggleCompact]: 'toggle-compact'
    };

    for (const [accel, action] of Object.entries(mapActions)) {
      if (!accel || !accel.trim()) continue;
      try {
        globalShortcut.register(accel.trim(), () => {
          if (obsServer.onStreamDeckApi) {
            obsServer.onStreamDeckApi(action, {}, {});
          }
        });
      } catch (e) {}
    }
  }

  registerGlobalHotkeys(loadConfig());

  ipcMain.handle('set-hid-target', (_ev, target) => {
    pendingHidTarget = target || null;
    return { ok: true };
  });

  ipcMain.handle('update-global-hotkeys', (_ev, peripheralsCfg) => {
    const cfg = loadConfig();
    cfg.peripherals = { ...(cfg.peripherals || {}), ...(peripheralsCfg || {}) };
    saveConfig(cfg);
    registerGlobalHotkeys(cfg);
    return { ok: true };
  });

  ipcMain.handle('trigger-peripheral-action', async (_ev, { action, text }) => {
    if (obsServer.onStreamDeckApi) {
      return await obsServer.onStreamDeckApi(action, { text }, { text });
    }
    return { ok: false };
  });

  ipcMain.handle('list-peripherals', () => {
    return new Promise((resolve) => {
      if (process.platform === 'darwin') {
        exec('system_profiler SPUSBDataType -json', { timeout: 5000 }, (err, stdout) => {
          const devices = [];
          if (!err && stdout) {
            try {
              const parsed = JSON.parse(stdout);
              const walk = (items) => {
                if (!Array.isArray(items)) return;
                for (const it of items) {
                  if (it._name) {
                    const nameLow = String(it._name).toLowerCase();
                    const isInput =
                      nameLow.includes('keyboard') ||
                      nameLow.includes('tastatur') ||
                      nameLow.includes('mouse') ||
                      nameLow.includes('maus') ||
                      nameLow.includes('hid') ||
                      nameLow.includes('key') ||
                      nameLow.includes('pad') ||
                      nameLow.includes('logitech') ||
                      nameLow.includes('razer') ||
                      nameLow.includes('corsair') ||
                      nameLow.includes('steelseries') ||
                      nameLow.includes('wooting') ||
                      nameLow.includes('elgato') ||
                      nameLow.includes('cherry') ||
                      nameLow.includes('keychron');
                    if (isInput || it.vendor_id) {
                      devices.push({
                        name: it._name,
                        manufacturer: it.manufacturer || '',
                        vendorId: it.vendor_id ? parseInt(String(it.vendor_id).split(' ')[0], 16) : null,
                        productId: it.product_id ? parseInt(String(it.product_id).split(' ')[0], 16) : null,
                        kind: nameLow.includes('mouse') || nameLow.includes('maus') ? 'mouse' : 'keyboard'
                      });
                    }
                  }
                  if (it._items) walk(it._items);
                }
              };
              walk(parsed.SPUSBDataType);
            } catch (e) {}
          }
          resolve({ ok: true, devices });
        });
      } else if (process.platform === 'win32') {
        exec(
          'powershell -NoProfile -Command "Get-PnpDevice -Class Keyboard,Mouse -Status OK | Select-Object FriendlyName,InstanceId,Class | ConvertTo-Json"',
          { timeout: 5000 },
          (err, stdout) => {
            const devices = [];
            if (!err && stdout) {
              try {
                const raw = JSON.parse(stdout);
                const arr = Array.isArray(raw) ? raw : [raw];
                for (const d of arr) {
                  if (!d?.FriendlyName) continue;
                  const vidMatch = String(d.InstanceId || '').match(/VID_([0-9A-F]{4})/i);
                  const pidMatch = String(d.InstanceId || '').match(/PID_([0-9A-F]{4})/i);
                  devices.push({
                    name: d.FriendlyName,
                    manufacturer: '',
                    vendorId: vidMatch ? parseInt(vidMatch[1], 16) : null,
                    productId: pidMatch ? parseInt(pidMatch[1], 16) : null,
                    kind: String(d.Class || '').toLowerCase() === 'mouse' ? 'mouse' : 'keyboard'
                  });
                }
              } catch (e) {}
            }
            resolve({ ok: true, devices });
          }
        );
      } else {
        resolve({ ok: true, devices: [] });
      }
    });
  });

  ipcMain.handle('social-schedule-get', () => {
    const cfg = loadConfig();
    return {
      ok: true,
      socialSchedule: socialSchedule.normalizeSocialScheduleConfig(cfg.socialSchedule),
      links: socialSchedule.buildPlatformLinks(cfg),
      upcoming: socialSchedule.getUpcomingEntries(cfg.socialSchedule?.schedule || [], 12)
    };
  });

  ipcMain.handle('social-schedule-save', (_ev, nextSs) => {
    const cfg = loadConfig();
    cfg.socialSchedule = socialSchedule.normalizeSocialScheduleConfig(nextSs);
    saveConfig(cfg);
    broadcastScheduleToObs(cfg);
    return {
      ok: true,
      socialSchedule: cfg.socialSchedule,
      links: socialSchedule.buildPlatformLinks(cfg),
      upcoming: socialSchedule.getUpcomingEntries(cfg.socialSchedule.schedule, 12)
    };
  });

  ipcMain.handle('discord-live-get', () => {
    const s = getDiscordLiveSession(loadConfig());
    if (s) ensureDiscordLiveTimer();
    return { ok: true, state: publicDiscordLiveState(s) };
  });

  ipcMain.handle('discord-live-end', async () => endDiscordLiveAnnouncement('manuell'));

  ipcMain.handle('discord-live-refresh', async () => {
    try {
      await refreshDiscordLiveAnnouncement();
      return { ok: true, state: publicDiscordLiveState(getDiscordLiveSession(loadConfig())) };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('social-post-golive', async (_ev, payload) => {
    const cfg = loadConfig();
    const res = await executeGoLivePost(cfg, payload || {});
    if (res.posted?.length) {
      appendDiagLog('system', 'info', `📢 Go-Live gepostet: ${res.posted.join(', ')}`);
    }
    if (res.errors?.length) {
      appendDiagLog('system', 'warn', `Go-Live Hinweis: ${res.errors.join(' | ')}`);
    }
    return res;
  });

  ipcMain.handle('social-post-schedule', async (_ev, payload) => {
    const cfg = loadConfig();
    const res = await executeSchedulePost(cfg, payload || {});
    if (res.posted?.length) {
      appendDiagLog('system', 'info', `📅 Sendeplan gepostet: ${res.posted.join(', ')}`);
    }
    if (res.errors?.length) {
      appendDiagLog('system', 'warn', `Sendeplan Hinweis: ${res.errors.join(' | ')}`);
    }
    return res;
  });

  ipcMain.handle('social-sync-twitch-schedule', async () => {
    const cfg = loadConfig();
    const ss = socialSchedule.normalizeSocialScheduleConfig(cfg.socialSchedule);
    const entries = socialSchedule.getUpcomingEntries(ss.schedule, 5);
    if (!entries.length) {
      return { ok: false, error: 'Keine zukünftigen Termine im Sendeplan vorhanden.' };
    }
    const created = [];
    const errors = [];
    for (const e of entries) {
      try {
        await twitch.createScheduleSegment({
          startTimeIso: new Date(e.startMs).toISOString(),
          durationMin: e.durationMin,
          title: e.title,
          gameName: e.game,
          isRecurring: e.recurringWeekly
        });
        created.push(e.title);
      } catch (err) {
        errors.push(`${e.title}: ${err.message}`);
        if (err.message.includes('channel:manage:schedule')) break;
      }
    }
    if (created.length) {
      appendDiagLog('twitch', 'info', `📅 ${created.length} Termin(e) auf Twitch Schedule übertragen.`);
    }
    return { ok: created.length > 0 && errors.length === 0, created, errors };
  });

  ipcMain.handle('social-export-ics', async () => {
    const { dialog } = require('electron');
    const cfg = loadConfig();
    const ics = socialSchedule.buildIcsFeed(cfg);
    const res = await dialog.showSaveDialog(mainWindow, {
      title: 'Stream-Sendeplan (.ics) exportieren',
      defaultPath: 'stream-schedule.ics',
      filters: [{ name: 'iCalendar (.ics)', extensions: ['ics'] }]
    });
    if (res.canceled || !res.filePath) return { ok: false, canceled: true };
    fs.writeFileSync(res.filePath, ics, 'utf8');
    return { ok: true, filePath: res.filePath };
  });

  ipcMain.handle('social-save-graphic-png', async (_ev, { base64Png, fileName }) => {
    const { shell } = require('electron');
    const cleanB64 = String(base64Png || '').replace(/^data:image\/\w+;base64,/, '');
    if (!cleanB64) return { ok: false, error: 'Keine Bilddaten übergeben.' };
    const safeName = String(fileName || `omnistream-${Date.now()}.png`).replace(/[^a-zA-Z0-9._-]/g, '_');
    const outPath = path.join(app.getPath('downloads'), safeName);
    fs.writeFileSync(outPath, Buffer.from(cleanB64, 'base64'));
    shell.showItemInFolder(outPath);
    return { ok: true, filePath: outPath };
  });

  ipcMain.handle('open-external-url', async (_ev, url) => {
    const { shell } = require('electron');
    const target = String(url || '').trim();
    if (!/^https?:\/\//i.test(target)) return { ok: false, error: 'Ungültige URL' };
    await shell.openExternal(target);
    return { ok: true };
  });

  ipcMain.handle('giveaway-action', (_ev, payload = {}) => {
    const act = String(payload.action || 'get');
    if (act === 'start') {
      activeGiveaway.title = String(payload.title || activeGiveaway.title || 'Stream-Verlosung').trim();
      activeGiveaway.keyword = String(payload.keyword || activeGiveaway.keyword || '!join').trim() || '!join';
      activeGiveaway.subMultiplier = Math.max(1, Math.min(5, parseInt(payload.subMultiplier, 10) || 2));
      activeGiveaway.active = true;
      activeGiveaway.visible = true;
      activeGiveaway.winner = null;
      activeGiveaway.spinning = false;
      if (payload.clear) activeGiveaway.participants = [];
      broadcastGiveawayState();
    } else if (act === 'stop') {
      activeGiveaway.active = false;
      activeGiveaway.visible = false;
      activeGiveaway.spinning = false;
      broadcastGiveawayState();
    } else if (act === 'reset') {
      activeGiveaway.active = false;
      activeGiveaway.participants = [];
      activeGiveaway.winner = null;
      activeGiveaway.spinning = false;
      broadcastGiveawayState();
    } else if (act === 'toggle-visible') {
      activeGiveaway.visible = !activeGiveaway.visible;
      broadcastGiveawayState();
    } else if (act === 'draw') {
      if (!activeGiveaway.participants.length) {
        return { ok: false, error: 'Keine Teilnehmer vorhanden.', giveaway: activeGiveaway };
      }
      activeGiveaway.active = false;
      activeGiveaway.visible = true;
      activeGiveaway.spinning = true;
      activeGiveaway.winner = null;

      // Weighted random pick
      const pool = [];
      for (const p of activeGiveaway.participants) {
        const w = Math.max(1, Number(p.weight || 1));
        for (let i = 0; i < w; i++) pool.push(p);
      }
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      broadcastGiveawayState();

      setTimeout(() => {
        activeGiveaway.spinning = false;
        activeGiveaway.winner = { name: chosen.name, platform: chosen.platform, spunAt: Date.now() };
        broadcastGiveawayState();
        appendDiagLog('system', 'info', `🎁 Giveaway-Gewinner: ${chosen.name} (${chosen.platform})`);
      }, 2800);
    }
    return { ok: true, giveaway: { ...activeGiveaway, participants: activeGiveaway.participants.slice() } };
  });

  ipcMain.handle('soundboard-get', () => {
    const cfg = loadConfig();
    return { ok: true, soundboard: cfg.soundboard || getDefaultConfig().soundboard };
  });

  ipcMain.handle('soundboard-save', (_ev, nextSb) => {
    const cfg = loadConfig();
    cfg.soundboard = {
      volume: typeof nextSb?.volume === 'number' ? nextSb.volume : 0.8,
      playLocally: nextSb?.playLocally !== false,
      routeToObs: nextSb?.routeToObs !== false,
      sounds: Array.isArray(nextSb?.sounds) ? nextSb.sounds : []
    };
    saveConfig(cfg);
    return { ok: true, soundboard: cfg.soundboard };
  });

  ipcMain.handle('soundboard-pick-file', async (_ev) => {
    const { dialog } = require('electron');
    const targetWin = BrowserWindow.fromWebContents(_ev.sender) || mainWindow;
    const res = await dialog.showOpenDialog(targetWin, {
      title: 'Sound-Datei(en) (.mp3, .wav, .ogg, .m4a) auswählen',
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'] }]
    });
    if (res.canceled || !res.filePaths?.length) return { ok: false, canceled: true };
    const files = res.filePaths.map((fp) => ({
      filePath: fp,
      name: path.basename(fp, path.extname(fp))
    }));
    return { ok: true, filePath: files[0].filePath, name: files[0].name, files };
  });

  ipcMain.handle('pick-local-file', async (_ev, opts = {}) => {
    const { dialog } = require('electron');
    const targetWin = BrowserWindow.fromWebContents(_ev.sender) || mainWindow;
    const kind = String(opts.kind || 'any').toLowerCase();
    const filterPresets = {
      image: [{ name: 'Bilder & GIFs', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'apng', 'bmp'] }],
      audio: [{ name: 'Audio-Dateien', extensions: ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'] }],
      video: [{ name: 'Video & Medien', extensions: ['mp4', 'mkv', 'mov', 'webm', 'avi', 'm4v', 'ts', 'flv', 'mp3', 'wav', 'ogg', 'gif'] }],
      obs_media: [
        { name: 'Alle OBS-Medien (Bild, Video, Audio, Text)', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'mp4', 'mkv', 'mov', 'webm', 'avi', 'm4v', 'mp3', 'wav', 'ogg', 'm4a', 'flac', 'txt'] },
        { name: 'Bilder & GIFs', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'] },
        { name: 'Videos & Audio', extensions: ['mp4', 'mkv', 'mov', 'webm', 'avi', 'm4v', 'mp3', 'wav', 'ogg', 'm4a', 'flac'] },
        { name: 'Textdateien', extensions: ['txt', 'log', 'md', 'csv'] }
      ],
      text: [{ name: 'Textdateien', extensions: ['txt', 'log', 'md', 'csv'] }],
      any: [{ name: 'Alle Dateien', extensions: ['*'] }]
    };
    const titlePresets = {
      image: 'Bild oder GIF auswählen',
      audio: 'Audio-Datei auswählen',
      video: 'Video- oder Mediendatei auswählen',
      obs_media: 'Datei für OBS-Szene auswählen (Bild, Video, Audio oder Text)',
      text: 'Textdatei auswählen',
      any: 'Datei auswählen'
    };
    const res = await dialog.showOpenDialog(targetWin, {
      title: opts.title || titlePresets[kind] || titlePresets.any,
      properties: ['openFile'],
      filters: filterPresets[kind] || filterPresets.any
    });
    if (res.canceled || !res.filePaths?.length) return { ok: false, canceled: true };
    const fp = res.filePaths[0];
    return {
      ok: true,
      filePath: fp,
      fileName: path.basename(fp),
      baseName: path.basename(fp, path.extname(fp))
    };
  });

  ipcMain.handle('soundboard-play', (_ev, soundId) => {
    return playSoundboardById(soundId);
  });

  ipcMain.handle('hype-get', () => {
    const cfg = loadConfig();
    return { ok: true, hypeDetector: { ...getDefaultConfig().hypeDetector, ...(cfg.hypeDetector || {}) } };
  });

  ipcMain.handle('hype-save', (_ev, nextHd) => {
    const cfg = loadConfig();
    cfg.hypeDetector = { ...getDefaultConfig().hypeDetector, ...(cfg.hypeDetector || {}), ...(nextHd || {}) };
    saveConfig(cfg);
    return { ok: true, hypeDetector: cfg.hypeDetector };
  });

  ipcMain.handle('hype-trigger-now', async (_ev, nextHd) => {
    const cfg = loadConfig();
    if (nextHd && typeof nextHd === 'object') {
      cfg.hypeDetector = { ...getDefaultConfig().hypeDetector, ...(cfg.hypeDetector || {}), ...nextHd };
      saveConfig(cfg);
    }
    return await executeHypeTrigger(cfg, '🔥 Manuell ausgelöster Chat-Hype!');
  });

  ipcMain.handle('game-addons-get', () => {
    const cfg = loadConfig();
    const ga = gameAddons.normalizeGameAddonsConfig(cfg.gameAddons);
    return {
      ok: true,
      gameAddons: ga,
      activeObsPayload: gameAddons.buildObsGameStatsPayload({ ...cfg, gameAddons: ga }),
      addons: gameAddons.GAME_ADDONS
    };
  });

  ipcMain.handle('game-addons-save', async (_ev, nextGa) => {
    const cfg = loadConfig();
    const ga = gameAddons.normalizeGameAddonsConfig(nextGa);
    if (ga.perAddonStats?.lol?.champion) {
      const dd = await gameAddons.resolveLolDdragonAssets(
        ga.perAddonStats.lol.champion,
        ga.perAddonStats.lol.skinId || 0,
        ''
      );
      ga.perAddonStats.lol.championIconUrl = dd.championIconUrl;
      ga.perAddonStats.lol.skinIconUrl = dd.skinIconUrl;
      ga.perAddonStats.lol.skinSplashUrl = dd.skinSplashUrl;
      ga.perAddonStats.lol.skinName = dd.skinName;
    }
    cfg.gameAddons = ga;
    saveConfig(cfg);
    broadcastGameAddonsState(cfg);
    return {
      ok: true,
      gameAddons: ga,
      activeObsPayload: gameAddons.buildObsGameStatsPayload({ ...cfg, gameAddons: ga }),
      addons: gameAddons.GAME_ADDONS
    };
  });

  ipcMain.handle('game-addons-reset', (_ev, addonId) => {
    const cfg = loadConfig();
    const ga = gameAddons.resetAddonStats(cfg.gameAddons, String(addonId || ''));
    cfg.gameAddons = ga;
    saveConfig(cfg);
    broadcastGameAddonsState(cfg);
    return { ok: true, gameAddons: ga, addons: gameAddons.GAME_ADDONS };
  });

  ipcMain.handle('game-addons-export-cs2-gsi', async () => {
    const { dialog } = require('electron');
    const content = gameAddons.buildCs2GsiConfig(obsServer.port || 4588);
    const res = await dialog.showSaveDialog(mainWindow, {
      title: 'CS2 GSI Config speichern (in csgo/cfg/ ablegen)',
      defaultPath: 'gamestate_integration_omnigrid.cfg',
      filters: [{ name: 'CS2 Config (.cfg)', extensions: ['cfg'] }]
    });
    if (res.canceled || !res.filePath) return { ok: false, canceled: true };
    fs.writeFileSync(res.filePath, content, 'utf8');
    return { ok: true, filePath: res.filePath };
  });

  ipcMain.handle('game-addons-jc-action', (_ev, payload = {}) => {
    const cfg = loadConfig();
    const ga = gameAddons.normalizeGameAddonsConfig(cfg.gameAddons);
    const jc = ga.perAddonStats.justchatting || {};
    const queue = Array.isArray(jc.qnaQueue) ? [...jc.qnaQueue] : [];
    const act = String(payload.action || '');

    if (act === 'set-agenda-idx') {
      const items = gameAddons.parseAgendaItems(jc.agendaText);
      jc.activeAgendaIdx = Math.max(0, Math.min(Math.max(0, items.length - 1), Number(payload.index || 0)));
    } else if (act === 'step-agenda') {
      const items = gameAddons.parseAgendaItems(jc.agendaText);
      const delta = Number(payload.delta || 1);
      jc.activeAgendaIdx = Math.max(0, Math.min(Math.max(0, items.length - 1), Number(jc.activeAgendaIdx || 0) + delta));
    } else if (act === 'add-question') {
      const txt = String(payload.text || '').trim().slice(0, 220);
      if (txt) {
        queue.push({
          id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          author: String(payload.author || 'Community').slice(0, 40),
          platform: String(payload.platform || 'chat'),
          text: txt
        });
        jc.qnaQueue = queue;
      }
    } else if (act === 'show-question') {
      const idx = queue.findIndex((q) => q.id === payload.id);
      if (idx >= 0) {
        const [picked] = queue.splice(idx, 1);
        jc.qnaQueue = queue;
        jc.activeQuestion = picked;
      }
    } else if (act === 'next-question') {
      const nextQ = queue.shift() || { id: '', author: '', platform: '', text: '' };
      jc.qnaQueue = queue;
      jc.activeQuestion = nextQ;
    } else if (act === 'hide-question') {
      jc.activeQuestion = { id: '', author: '', platform: '', text: '' };
    } else if (act === 'remove-question') {
      jc.qnaQueue = queue.filter((q) => q.id !== payload.id);
    } else if (act === 'clear-questions') {
      jc.qnaQueue = [];
      jc.activeQuestion = { id: '', author: '', platform: '', text: '' };
    }

    ga.perAddonStats.justchatting = jc;
    cfg.gameAddons = ga;
    saveConfig(cfg);
    broadcastGameAddonsState(cfg);
    return { ok: true, gameAddons: ga, addons: gameAddons.GAME_ADDONS };
  });

  ipcMain.handle('game-addons-lol-sync-lcu', async () => {
    try {
      const lcu = global.__syncLcuRankedNow ? await global.__syncLcuRankedNow() : await gameAddons.readLolLcuRankedStats();
      const cfg = loadConfig();
      const ga = gameAddons.normalizeGameAddonsConfig(cfg.gameAddons);
      return { ...lcu, gameAddons: ga, addons: gameAddons.GAME_ADDONS };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('game-addons-lol-record-match', async (_ev, payload = {}) => {
    const cfg = loadConfig();
    const ga = gameAddons.normalizeGameAddonsConfig(cfg.gameAddons);
    const lol = ga.perAddonStats.lol || {};
    if (payload.clear) {
      lol.recentMatches = [];
    } else {
      const champ = String(payload.champion || lol.champion || 'Ahri').trim();
      const dd = await gameAddons.resolveLolDdragonAssets(champ, 0, '');
      const list = Array.isArray(lol.recentMatches) ? lol.recentMatches.slice(0, 6) : [];
      list.unshift({
        champion: champ,
        championIconUrl: dd.championIconUrl,
        win: Boolean(payload.win),
        kills: Number(lol.kills || 0),
        deaths: Number(lol.deaths || 0),
        assists: Number(lol.assists || 0),
        at: Date.now()
      });
      lol.recentMatches = list.slice(0, 6);
    }
    ga.perAddonStats.lol = lol;
    cfg.gameAddons = ga;
    saveConfig(cfg);
    broadcastGameAddonsState(cfg);
    return { ok: true, gameAddons: ga };
  });

  ipcMain.handle('updater-get-state', () => autoUpdater.getState());
  ipcMain.handle('updater-check', (_ev, opts = {}) =>
    autoUpdater.checkForUpdates({ autoDownload: opts.autoDownload !== false, forceDownload: Boolean(opts.forceDownload) })
  );
  ipcMain.handle('updater-install', () => autoUpdater.installDownloadedUpdate());

  ipcMain.handle('elgato-lights-discover', async () => {
    const lights = await elgatoLights.discoverElgatoLights();
    return { ok: true, lights };
  });

  ipcMain.handle('elgato-lights-set', async (_ev, payload = {}) => {
    const cfg = loadConfig();
    const elCfg = cfg.elgatoLights || {};
    const ips = payload.ips !== undefined ? payload.ips : elCfg.ips;
    return await elgatoLights.setElgatoLights({
      ips,
      on: payload.on,
      brightness: payload.brightness ?? elCfg.brightness ?? 60,
      temperatureK: payload.temperatureK ?? elCfg.temperatureK ?? 4500
    });
  });

  ipcMain.handle('elgato-lights-toggle', async (_ev, payload = {}) => {
    const cfg = loadConfig();
    const elCfg = cfg.elgatoLights || {};
    const ips = payload.ips !== undefined ? payload.ips : elCfg.ips;
    return await elgatoLights.toggleElgatoLights({
      ips,
      brightness: payload.brightness ?? elCfg.brightness ?? 60,
      temperatureK: payload.temperatureK ?? elCfg.temperatureK ?? 4500
    });
  });

  ipcMain.handle('govee-list-devices', async (_ev, payload = {}) => {
    try {
      const cfg = loadConfig();
      const apiKey = String(payload.apiKey ?? cfg.goveeLights?.apiKey ?? '').trim();
      const devices = await goveeLights.listGoveeDevices(apiKey);
      return { ok: true, devices };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('govee-list-scenes', async (_ev, payload = {}) => {
    try {
      const cfg = loadConfig();
      const apiKey = String(payload.apiKey ?? cfg.goveeLights?.apiKey ?? '').trim();
      const sku = String(payload.sku ?? cfg.goveeLights?.sku ?? '').trim();
      const device = String(payload.device ?? cfg.goveeLights?.device ?? '').trim();
      return await goveeLights.listGoveeScenes(apiKey, { sku, device });
    } catch (err) {
      return { ok: false, error: err.message, scenes: goveeLights.PRESET_COLOR_OPTIONS };
    }
  });

  ipcMain.handle('govee-apply-action', async (_ev, payload = {}) => {
    try {
      const cfg = loadConfig();
      const apiKey = String(payload.apiKey ?? cfg.goveeLights?.apiKey ?? '').trim();
      const targets =
        payload.targets ||
        (payload.sku && payload.device ? [{ sku: payload.sku, device: payload.device }] : cfg.goveeLights?.selectedDevices || [{ sku: cfg.goveeLights?.sku, device: cfg.goveeLights?.device }]);
      return await goveeLights.applyGoveeAction(apiKey, targets, payload.actionId);
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  // === PHILIPS HUE (100% LOCAL LAN BRIDGE) ===
  ipcMain.handle('hue-discover', async () => {
    try {
      const bridges = await hueLights.discoverHueBridges();
      return { ok: true, bridges };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('hue-pair', async (_ev, payload = {}) => {
    try {
      const res = await hueLights.pairHueBridge(payload.bridgeIp);
      if (res?.ok && res.username) {
        const cfg = loadConfig();
        cfg.hueLights = hueLights.normalizeHueConfig({
          ...(cfg.hueLights || {}),
          enabled: true,
          bridgeIp: res.bridgeIp,
          username: res.username
        });
        saveConfig(cfg);
      }
      return res;
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('hue-resources', async (_ev, payload = {}) => {
    try {
      const cfg = loadConfig();
      const ip = payload.bridgeIp || cfg.hueLights?.bridgeIp || '';
      const user = payload.username || cfg.hueLights?.username || '';
      return await hueLights.listHueResources(ip, user);
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('hue-save', (_ev, nextHue = {}) => {
    const cfg = loadConfig();
    cfg.hueLights = hueLights.normalizeHueConfig({ ...(cfg.hueLights || {}), ...nextHue });
    saveConfig(cfg);
    return { ok: true, hueLights: cfg.hueLights };
  });

  ipcMain.handle('hue-set', async (_ev, payload = {}) => {
    try {
      const cfg = loadConfig();
      const merged = hueLights.normalizeHueConfig({ ...(cfg.hueLights || {}), ...payload });
      return await hueLights.setHueLights({ ...merged, on: payload.on, brightness: payload.brightness, hexColor: payload.hexColor });
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('hue-apply-action', async (_ev, payload = {}) => {
    try {
      const cfg = loadConfig();
      const merged = hueLights.normalizeHueConfig({ ...(cfg.hueLights || {}), ...(payload.hueLights || {}) });
      return await hueLights.applyHueAction(merged, payload.actionId);
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  // === NANOLEAF (100% LOCAL LAN OPENAPI PORT 16021) ===
  ipcMain.handle('nanoleaf-discover', async () => {
    try {
      const devices = await nanoleafLights.discoverNanoleafDevices();
      return { ok: true, devices };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('nanoleaf-pair', async (_ev, payload = {}) => {
    try {
      const res = await nanoleafLights.pairNanoleaf(payload.ip);
      if (res?.ok && res.authToken) {
        const cfg = loadConfig();
        cfg.nanoleafLights = nanoleafLights.normalizeNanoleafConfig({
          ...(cfg.nanoleafLights || {}),
          enabled: true,
          ip: res.ip,
          authToken: res.authToken
        });
        saveConfig(cfg);
      }
      return res;
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('nanoleaf-info', async (_ev, payload = {}) => {
    try {
      const cfg = loadConfig();
      const ip = payload.ip || cfg.nanoleafLights?.ip || '';
      const tok = payload.authToken || cfg.nanoleafLights?.authToken || '';
      return await nanoleafLights.getNanoleafInfo(ip, tok);
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('nanoleaf-save', (_ev, nextNl = {}) => {
    const cfg = loadConfig();
    cfg.nanoleafLights = nanoleafLights.normalizeNanoleafConfig({ ...(cfg.nanoleafLights || {}), ...nextNl });
    saveConfig(cfg);
    return { ok: true, nanoleafLights: cfg.nanoleafLights };
  });

  ipcMain.handle('nanoleaf-set', async (_ev, payload = {}) => {
    try {
      const cfg = loadConfig();
      const merged = nanoleafLights.normalizeNanoleafConfig({ ...(cfg.nanoleafLights || {}), ...payload });
      return await nanoleafLights.setNanoleafState({
        ...merged,
        on: payload.on,
        brightness: payload.brightness,
        hexColor: payload.hexColor,
        effect: payload.effect
      });
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('nanoleaf-apply-action', async (_ev, payload = {}) => {
    try {
      const cfg = loadConfig();
      const merged = nanoleafLights.normalizeNanoleafConfig({ ...(cfg.nanoleafLights || {}), ...(payload.nanoleafLights || {}) });
      return await nanoleafLights.applyNanoleafAction(merged, payload.actionId);
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('multistream-get-state', () => multiRelay.getState());

  ipcMain.handle('multistream-configure-obs', async (_ev, payload = {}) => {
    try {
      const cfg = loadConfig();
      const ms = normalizeRelayConfig(payload.multiStream || cfg.multiStream || {});
      const serverUrl = `rtmp://127.0.0.1:${ms.port}/live`;
      obsAutoConfig.autoProvisionObsLocalFiles({ disableMultitrackVideo: true });
      const conn = await ensureObsWsConnected();
      if (!conn.ok) {
        return {
          ok: false,
          error: 'OBS Studio läuft aktuell nicht oder startet gerade erst — lokale OBS-Profile wurden bereits vorab bereinigt.'
        };
      }
      const res = await obsWs.configureCustomRtmpService(serverUrl, ms.streamKey);
      return res;
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('multistream-prepare-youtube', async (_ev, payload = {}) => {
    try {
      const cfg = loadConfig();
      const ms = normalizeRelayConfig(payload.multiStream || cfg.multiStream || {});
      const streamTitle = String(payload.title || cfg.streamManager?.title || `${cfg.streamerName || 'OmniGrid'} Live`).trim();
      const ytPrep = await youtube.prepareLiveBroadcast({
        title: streamTitle,
        privacyStatus: ms.targets.youtube.privacyStatus || 'public',
        preferredStreamKey: ms.targets.youtube.streamKey || ''
      });
      ms.targets.youtube.enabled = true;
      ms.targets.youtube.serverUrl = ytPrep.rtmpUrl || ms.targets.youtube.serverUrl;
      ms.targets.youtube.streamKey = ytPrep.streamKey || ms.targets.youtube.streamKey;
      cfg.multiStream = ms;
      saveConfig(cfg);
      broadcastToWindows('multistream-config-synced', ms);
      appendDiagLog(
        'youtube',
        'info',
        `YouTube Live automatisch vorbereitet (${ytPrep.createdNew ? 'neuer Broadcast angelegt' : 'Broadcast bereit'}): ${ytPrep.watchUrl}`
      );
      return { ok: true, ...ytPrep, multiStream: ms };
    } catch (err) {
      appendDiagLog('youtube', 'error', `YouTube Live Vorbereitung fehlgeschlagen: ${err.message}`);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('multistream-start', async (_ev, payload = {}) => {
    const cfg = loadConfig();
    const ms = normalizeRelayConfig(payload.multiStream || cfg.multiStream || {});

    const extraWarnings = [];
    let youtubeWatchUrl = '';
    let preparedYt = null;

    if (ms.targets.youtube?.enabled) {
      if (youtube.canWrite) {
        try {
          const streamTitle = String(cfg.streamManager?.title || `${cfg.streamerName || 'OmniGrid'} Live`).trim();
          preparedYt = await youtube.prepareLiveBroadcast({
            title: streamTitle,
            privacyStatus: ms.targets.youtube.privacyStatus || 'public',
            preferredStreamKey: ms.targets.youtube.streamKey || ''
          });
          if (preparedYt.rtmpUrl) ms.targets.youtube.serverUrl = preparedYt.rtmpUrl;
          if (preparedYt.streamKey) ms.targets.youtube.streamKey = preparedYt.streamKey;
          youtubeWatchUrl = preparedYt.watchUrl || '';
          broadcastToWindows('multistream-config-synced', ms);
          appendDiagLog(
            'youtube',
            'info',
            `YouTube Live Broadcast bereit (${preparedYt.privacyStatus}): ${youtubeWatchUrl}`
          );
        } catch (ytErr) {
          extraWarnings.push(`⚠️ YouTube Broadcast-Vorbereitung: ${ytErr.message}`);
          appendDiagLog('youtube', 'warn', `YouTube Auto-Broadcast Hinweis: ${ytErr.message}`);
        }
      } else if (ms.targets.youtube.streamKey) {
        extraWarnings.push(
          '💡 YouTube ohne OAuth2: Bitte in YouTube Studio „Automatischer Start“ aktivieren (oder unter Plattformen → YouTube OAuth2 verbinden, damit OmniGrid den Broadcast vollautomatisch live schaltet).'
        );
      } else {
        extraWarnings.push(
          '⚠️ YouTube ist aktiviert, aber weder ein Stream-Schlüssel eingetragen noch YouTube-OAuth2 verbunden!'
        );
      }
    }

    cfg.multiStream = ms;
    saveConfig(cfg);

    obsAutoConfig.autoProvisionObsLocalFiles({ disableMultitrackVideo: true });

    const startRes = multiRelay.start(ms, { warnings: extraWarnings, youtubeWatchUrl });
    if (!startRes.ok) return startRes;

    if (preparedYt?.broadcastId && preparedYt?.streamId) {
      youtube.watchAndTransitionBroadcastToLive(preparedYt.broadcastId, preparedYt.streamId, ({ broadcastId, watchUrl }) => {
        appendDiagLog('youtube', 'info', `🔴 YouTube Livestream ist jetzt öffentlich LIVE: ${watchUrl}`);
        if (cfg.youtube?.channel) {
          youtube.connect({ target: cfg.youtube.channel, preferredVideoId: broadcastId }).catch(() => {});
        }
      });
    }

    const serverUrl = `rtmp://127.0.0.1:${ms.port}/live`;
    const conn = await ensureObsWsConnected();
    if (conn.ok) {
      if (ms.autoConfigureObs !== false) {
        try {
          await obsWs.configureCustomRtmpService(serverUrl, ms.streamKey);
        } catch (e) {}
      }
      if (ms.autoStartObsStream !== false) {
        setTimeout(() => {
          obsWs
            .startStream({ forceRelayUrl: serverUrl, forceRelayKey: ms.streamKey })
            .catch(() => {});
        }, 650);
      }
    }
    return startRes;
  });

  ipcMain.handle('multistream-stop', async () => {
    youtube.stopLiveTransitionWatch();
    const cfg = loadConfig();
    const ms = normalizeRelayConfig(cfg.multiStream || {});
    if (obsWs.getState()?.connected && ms.autoStartObsStream !== false) {
      try {
        await obsWs.stopStream();
      } catch (e) {}
    }
    return multiRelay.stop(true);
  });

  ipcMain.handle('voice-get-state', () => {
    return voiceBridge.getPublicState();
  });

  ipcMain.handle('voice-save-config', (_ev, nextVc = {}) => {
    const cfg = loadConfig();
    const merged = normalizeVoiceConfig({ ...(cfg.voiceControl || {}), ...nextVc });
    cfg.voiceControl = merged;
    saveConfig(cfg);
    voiceBridge.setConfig(merged);
    if (merged.enabled && merged.relayUrl && merged.channelId) {
      voiceBridge.start();
    } else if (!merged.relayUrl) {
      voiceBridge.stop();
    }
    return { ok: true, state: voiceBridge.getPublicState() };
  });

  ipcMain.handle('voice-generate-pairing', async (_ev, opts = {}) => {
    const cfg = loadConfig();
    if (opts && typeof opts.relayUrl === 'string') {
      const merged = normalizeVoiceConfig({ ...(cfg.voiceControl || {}), relayUrl: opts.relayUrl, enabled: true });
      cfg.voiceControl = merged;
      saveConfig(cfg);
      voiceBridge.setConfig(merged);
    }
    const res = await voiceBridge.generatePairingCode();
    return { ...res, state: voiceBridge.getPublicState() };
  });

  ipcMain.handle('voice-disconnect', async () => {
    const res = await voiceBridge.disconnectAndReset();
    return { ...res, state: voiceBridge.getPublicState() };
  });

  ipcMain.handle('voice-test-command', async (_ev, action, payload = {}) => {
    const res = await voiceBridge.executeLocalCommand(action, payload, 'local_ui');
    return { ...res, state: voiceBridge.getPublicState() };
  });

  ipcMain.handle('sponsors-get', async () => {
    const cfg = loadConfig();
    const sp = normalizeSponsorsConfig(cfg.sponsors);
    return { ok: true, sponsors: sp, overlayUrl: `http://127.0.0.1:${obsServer.port || 4588}/sponsors` };
  });

  ipcMain.handle('sponsors-save', async (_ev, nextSp = {}) => {
    const cfg = loadConfig();
    const sp = normalizeSponsorsConfig(nextSp);
    cfg.sponsors = sp;
    saveConfig(cfg);
    await broadcastSponsorsToObs(cfg);
    return { ok: true, sponsors: sp };
  });

  ipcMain.handle('sponsors-jump', async (_ev, index = 0) => {
    const cfg = loadConfig();
    const sp = normalizeSponsorsConfig(cfg.sponsors);
    sp.activeIndex = Math.max(0, Number(index) || 0);
    cfg.sponsors = sp;
    saveConfig(cfg);
    await broadcastSponsorsToObs(cfg);
    return { ok: true, sponsors: sp };
  });

  ipcMain.handle('sponsors-post-chat', async (_ev, itemId = '') => {
    const cfg = loadConfig();
    const sp = normalizeSponsorsConfig(cfg.sponsors);
    const item = sp.items.find((x) => x.id === itemId) || sp.items[sp.activeIndex] || sp.items[0];
    if (!item) return { ok: false, error: 'Kein Werbepartner gefunden.' };
    const text = `🏷️ [${item.badge || 'WERBUNG'}] ${item.name}${item.subtitle ? ` — ${item.subtitle}` : ''}${item.url ? ` 👉 ${item.url}` : ''}`;
    const sent = [];
    if (twitch.canWrite) {
      try { await twitch.sendMessage(text); sent.push('Twitch'); } catch (e) {}
    }
    if (youtube.canWrite) {
      try { await youtube.sendMessage(text); sent.push('YouTube'); } catch (e) {}
    }
    return sent.length
      ? { ok: true, sent, text }
      : { ok: false, error: 'Kein schreibfähiger Chat (Twitch Token / YouTube OAuth2) verbunden.', text };
  });

  ipcMain.handle('themes-list', () => {
    const cfg = loadConfig();
    const packs = themePacks.listInstalledPacks(app.getPath('userData'));
    const active = themePacks.resolveActiveChampionTheme(cfg, packs);
    const rawMode = String(cfg.championThemeMode || 'none').trim();
    return { ok: true, packs, active, mode: rawMode === 'auto' ? 'none' : rawMode };
  });

  ipcMain.handle('themes-select', (_ev, mode = 'none') => {
    const cfg = loadConfig();
    const nextMode = String(mode || 'none').trim();
    cfg.championThemeMode = nextMode === 'auto' ? 'none' : nextMode;
    saveConfig(cfg);
    const res = broadcastChampionThemeToObs(cfg);
    if (obsWs.connected) obsWs.refreshOmniGridOverlays().catch(() => {});
    return { ok: true, ...res };
  });

  ipcMain.handle('themes-install-file', async (_ev) => {
    const { dialog } = require('electron');
    const win = BrowserWindow.fromWebContents(_ev.sender) || mainWindow;
    const pick = await dialog.showOpenDialog(win, {
      title: 'Champion-Design-Pack (.json) installieren',
      properties: ['openFile'],
      filters: [{ name: 'OmniGrid Theme Pack (.json)', extensions: ['json'] }]
    });
    if (pick.canceled || !pick.filePaths?.[0]) return { ok: false, canceled: true };
    try {
      const raw = fs.readFileSync(pick.filePaths[0], 'utf8');
      const inst = themePacks.installPackFromJson(app.getPath('userData'), raw);
      if (!inst.ok) return inst;
      const cfg = loadConfig();
      cfg.championThemeMode = inst.pack.id;
      saveConfig(cfg);
      const state = broadcastChampionThemeToObs(cfg);
      if (obsWs.connected) obsWs.refreshOmniGridOverlays().catch(() => {});
      return { ok: true, installedPack: inst.pack, ...state };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('themes-export-pack', async (_ev, packId = 'jinx-arcane-zaun') => {
    const { dialog } = require('electron');
    const win = BrowserWindow.fromWebContents(_ev.sender) || mainWindow;
    const packs = themePacks.listInstalledPacks(app.getPath('userData'));
    const target = packs.find((p) => p.id === packId) || packs[0];
    if (!target) return { ok: false, error: 'Kein Pack gefunden.' };
    const save = await dialog.showSaveDialog(win, {
      title: 'Champion-Design-Pack exportieren',
      defaultPath: `${target.id}.json`,
      filters: [{ name: 'OmniGrid Theme Pack (.json)', extensions: ['json'] }]
    });
    if (save.canceled || !save.filePath) return { ok: false, canceled: true };
    fs.writeFileSync(save.filePath, JSON.stringify(target, null, 2) + '\n', 'utf8');
    return { ok: true, filePath: save.filePath };
  });

  ipcMain.handle('themes-open-dir', () => {
    const { shell } = require('electron');
    const dir = themePacks.getThemesDir(app.getPath('userData'));
    shell.openPath(dir);
    return { ok: true, dir };
  });

  ipcMain.handle('themes-check-updates', async () => {
    const bundledDir = path.join(__dirname, '..', 'docs', 'packs');
    const res = await themePacks.checkAndUpdatePacks(app.getPath('userData'), { bundledPacksDir: bundledDir, online: true });
    const cfg = loadConfig();
    const state = broadcastChampionThemeToObs(cfg);
    if (res.updated.length) {
      appendDiagLog('system', 'info', `🔄 ${res.updated.length} Overlay-Pack(s) aktualisiert: ${res.updated.map((u) => u.name).join(', ')}`);
      if (obsWs.connected) obsWs.refreshOmniGridOverlays().catch(() => {});
    }
    const rawMode = String(cfg.championThemeMode || 'none').trim();
    return { ...res, ...state, mode: rawMode === 'auto' ? 'none' : rawMode };
  });

  const bundledPacksDir = path.join(__dirname, '..', 'docs', 'packs');
  const localPackSync = themePacks.syncInstalledPacksLocal(app.getPath('userData'), bundledPacksDir);
  if (localPackSync.updated.length) {
    appendDiagLog('system', 'info', `🔄 ${localPackSync.updated.length} Overlay-Pack(s) beim Start aktualisiert: ${localPackSync.updated.map((u) => u.name).join(', ')}`);
    broadcastChampionThemeToObs(loadConfig());
  }
  setTimeout(() => {
    themePacks.checkAndUpdatePacks(app.getPath('userData'), { bundledPacksDir, online: true })
      .then((res) => {
        if (res?.updated?.length) {
          appendDiagLog('system', 'info', `🔄 ${res.updated.length} Overlay-Pack(s) online aktualisiert: ${res.updated.map((u) => u.name).join(', ')}`);
          broadcastChampionThemeToObs(loadConfig());
          if (obsWs.connected) obsWs.refreshOmniGridOverlays().catch(() => {});
        }
      })
      .catch(() => {});
  }, 4500);

  ipcMain.handle('submit-github-feedback', async (_ev, payload = {}) => {
    const { shell } = require('electron');
    const https = require('https');
    const category = String(payload.category || 'ideas').trim();
    const title = String(payload.title || '').trim();
    const body = String(payload.body || '').trim();
    const targetType = String(payload.targetType || 'discussion').trim();
    const token = String(payload.githubToken || '').trim();

    if (!title) return { ok: false, error: 'Bitte einen kurzen Titel eingeben.' };
    const fullBody = `${body || '(Keine weitere Beschreibung)'}\n\n---\n*Gesendet aus OmniGrid Studio v${app.getVersion()} (${process.platform} / ${process.arch})*`;

    if (token && targetType === 'discussion') {
      try {
        const gqlCall = (query, variables = {}) =>
          new Promise((resolve, reject) => {
            const data = Buffer.from(JSON.stringify({ query, variables }), 'utf8');
            const req = https.request(
              {
                host: 'api.github.com',
                port: 443,
                path: '/graphql',
                method: 'POST',
                headers: {
                  'User-Agent': 'OmniGrid-Studio',
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  'Content-Length': data.length
                }
              },
              (res) => {
                let raw = '';
                res.on('data', (c) => { raw += c; });
                res.on('end', () => {
                  try { resolve(JSON.parse(raw)); } catch (e) { reject(e); }
                });
              }
            );
            req.on('error', reject);
            req.write(data);
            req.end();
          });

        const repoRes = await gqlCall(
          `query { repository(owner: "Lyyrrrriccs", name: "OmniGrid-Studio") { id discussionCategories(first: 20) { nodes { id slug name } } } }`
        );
        const repo = repoRes?.data?.repository;
        const cats = repo?.discussionCategories?.nodes || [];
        if (repo?.id && cats.length) {
          const matchedCat =
            cats.find((c) => c.slug.toLowerCase() === category.toLowerCase()) ||
            cats.find((c) => c.name.toLowerCase().includes(category.toLowerCase())) ||
            cats[0];
          const mutRes = await gqlCall(
            `mutation($repoId: ID!, $catId: ID!, $title: String!, $body: String!) { createDiscussion(input: { repositoryId: $repoId, categoryId: $catId, title: $title, body: $body }) { discussion { url } } }`,
            { repoId: repo.id, catId: matchedCat.id, title, body: fullBody }
          );
          const createdUrl = mutRes?.data?.createDiscussion?.discussion?.url;
          if (createdUrl) {
            await shell.openExternal(createdUrl);
            return { ok: true, mode: 'api', url: createdUrl };
          }
        }
      } catch (e) {}
    }

    const baseUrl = 'https://github.com/Lyyrrrriccs/OmniGrid-Studio';
    const url =
      targetType === 'issue'
        ? `${baseUrl}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(fullBody)}`
        : `${baseUrl}/discussions/new?category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}&body=${encodeURIComponent(fullBody)}`;
    await shell.openExternal(url);
    return { ok: true, mode: 'browser', url };
  });

  ipcMain.handle('privacy-audit-run', async () => {
    const { runPrivacyAudit } = require('./privacy_audit');
    const audit = runPrivacyAudit(__dirname);
    const groupedMap = new Map();
    for (const item of audit.findings) {
      const existing = groupedMap.get(item.host) || {
        host: item.host,
        purpose: item.purpose,
        allowed: item.allowed,
        count: 0,
        examples: []
      };
      existing.count++;
      if (existing.examples.length < 3) {
        existing.examples.push(`${item.file}:${item.line}`);
      }
      groupedMap.set(item.host, existing);
    }
    const osNetCmd =
      process.platform === 'win32'
        ? 'Get-NetTCPConnection -OwningProcess (Get-Process OmniGridStudio -ErrorAction SilentlyContinue).Id'
        : 'lsof -i -n -P | grep -iE "Electron|OmniGrid"';
    return {
      ok: audit.ok,
      configPath: getConfigPath(),
      srcPath: __dirname,
      scannedFiles: audit.scannedFiles,
      totalEndpoints: audit.totalEndpoints,
      unknownEndpoints: audit.unknownEndpoints,
      domains: Array.from(groupedMap.values()),
      osNetCmd
    };
  });

  ipcMain.handle('privacy-open-path', async (_ev, target) => {
    const { shell } = require('electron');
    if (target === 'config') {
      const cfgPath = getConfigPath();
      if (fs.existsSync(cfgPath)) {
        shell.showItemInFolder(cfgPath);
      } else {
        await shell.openPath(path.dirname(cfgPath));
      }
      return { ok: true };
    }
    if (target === 'src') {
      await shell.openPath(__dirname);
      return { ok: true };
    }
    return { ok: false };
  });

  const refreshNativeMenu = (langCode) => {
    i18n.applyLocalizedAppMenu(Menu, langCode, {
      onSelectLanguage: (nextCode) => {
        const cfg = loadConfig();
        cfg.language = i18n.normalizeLang(nextCode);
        saveConfig(cfg);
        refreshNativeMenu(cfg.language);
        const bundle = i18n.getI18nBundle(cfg.language);
        if (mainWindow && !mainWindow.isDestroyed() && bundle.active?.meta?.appTitle) {
          mainWindow.setTitle(bundle.active.meta.appTitle);
        }
        broadcastToWindows('i18n-changed', bundle);
      },
      onOpenGuide: () => {
        if (typeof openHelpWindow === 'function') openHelpWindow();
      },
      onMenuCommand: (cmd) => broadcastToWindows('menu-command', { command: cmd })
    });
  };

  refreshNativeMenu(loadConfig().language || 'de');

  ipcMain.handle('i18n-get', () => {
    const cfg = loadConfig();
    return i18n.getI18nBundle(cfg.language || 'de');
  });

  ipcMain.handle('i18n-set', (_ev, langCode) => {
    const cfg = loadConfig();
    cfg.language = i18n.normalizeLang(langCode);
    saveConfig(cfg);
    refreshNativeMenu(cfg.language);
    const bundle = i18n.getI18nBundle(cfg.language);
    if (mainWindow && !mainWindow.isDestroyed() && bundle.active?.meta?.appTitle) {
      mainWindow.setTitle(bundle.active.meta.appTitle);
    }
    broadcastToWindows('i18n-changed', bundle);
    return bundle;
  });

  setTimeout(() => {
    if (!demoActive) {
      autoUpdater.checkForUpdates({ autoDownload: true }).catch(() => {});
    }
  }, 4000);
  setInterval(() => {
    if (!demoActive) {
      autoUpdater.checkForUpdates({ autoDownload: true }).catch(() => {});
    }
  }, 30 * 60 * 1000);
});

app.on('before-quit', () => {
  isAppShuttingDown = true;
  if (preHelpMainBounds) {
    const cfg = loadConfig();
    cfg.mainWindowBounds = preHelpMainBounds;
    saveConfig(cfg);
    preHelpMainBounds = null;
  }
});

app.on('will-quit', () => {
  try {
    voiceBridge.stop();
  } catch (e) {}
  try {
    multiRelay.stop(false);
  } catch (e) {}
  try {
    require('electron').globalShortcut.unregisterAll();
  } catch (e) {}
});

app.on('window-all-closed', () => {
  obsServer.stop();
  app.quit();
});

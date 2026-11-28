const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const OBS_OVERLAY_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid OBS Stream-Overlay</title>
  <style>
    :root {
      --name-size: 14px;
      --msg-size: 14px;
      --msg-pad-v: 4px;
      --msg-pad-h: 8px;
      --msg-gap: 0px;
      --sep-display: 1px;
      --sep-color: rgba(255, 255, 255, 0.10);
      --chat-bg: rgba(11, 15, 25, 0.0);
      --item-bg: rgba(13, 17, 26, 0.65);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--chat-bg);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #f8fafc;
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 8px;
    }
    #pinnedBox {
      position: fixed;
      top: 8px;
      left: 8px;
      right: 8px;
      background: rgba(15, 23, 42, 0.94);
      border: 2px solid #f59e0b;
      border-radius: 10px;
      padding: 8px 12px;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.65);
      display: none;
      z-index: 50;
    }
    #pinnedBox.active { display: block; }
    .pin-label {
      font-size: 9.5px;
      font-weight: 800;
      color: #fbbf24;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    #chatList {
      display: flex;
      flex-direction: column;
      gap: var(--msg-gap);
      max-height: 94vh;
      overflow: hidden;
      justify-content: flex-end;
    }
    .msg-row {
      padding: var(--msg-pad-v) var(--msg-pad-h);
      font-size: var(--msg-size);
      line-height: 1.38;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      border-bottom: var(--sep-display) solid var(--sep-color);
      background: var(--item-bg);
    }
    body.style-bubbles .msg-row {
      border-radius: 8px;
      border-left: 3px solid #9146ff;
      border-bottom: none;
      margin-bottom: 4px;
    }
    body.style-bubbles .msg-row.twitch { border-left-color: #9146ff; }
    body.style-bubbles .msg-row.youtube { border-left-color: #ff0033; }
    body.style-bubbles .msg-row.tiktok { border-left-color: #00f2fe; }
    body.chat-theme-lol #chatList { gap: 5px; }
    body.chat-theme-lol .msg-row {
      position: relative;
      background: linear-gradient(145deg, rgba(9, 20, 40, 0.92) 0%, rgba(1, 10, 19, 0.94) 100%) !important;
      border: 1px solid rgba(200, 170, 110, 0.52);
      border-left: 3px solid #0ac8b9;
      border-radius: 3px;
      padding: 6px 10px;
      color: #f0e6d2;
      box-shadow: inset 0 0 0 1px rgba(200, 170, 110, 0.16), 0 4px 14px rgba(0, 0, 0, 0.45);
    }
    body.chat-theme-lol .msg-row::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 7px;
      height: 7px;
      border-top: 1.5px solid #c8aa6e;
      border-right: 1.5px solid #c8aa6e;
      pointer-events: none;
    }
    body.chat-theme-lol .author {
      font-family: Georgia, "Times New Roman", serif;
      letter-spacing: 0.03em;
      text-shadow: 0 0 8px rgba(10, 200, 185, 0.35);
    }
    body.chat-theme-lol .badge {
      background: rgba(200, 170, 110, 0.18);
      border: 1px solid rgba(200, 170, 110, 0.5);
      color: #f0e6d2;
    }
    body.chat-theme-lol #pinnedBox {
      background: linear-gradient(155deg, rgba(9, 20, 40, 0.96), rgba(1, 10, 19, 0.98));
      border: 2px solid #c8aa6e;
      border-radius: 4px;
    }
    body.chat-theme-lol .pin-label { color: #0ac8b9; }

    body.chat-theme-valorant #chatList { gap: 5px; }
    body.chat-theme-valorant .msg-row {
      background: linear-gradient(135deg, rgba(15, 25, 35, 0.93) 0%, rgba(19, 28, 39, 0.94) 80%, rgba(45, 16, 22, 0.92) 100%) !important;
      border: 1px solid rgba(236, 232, 225, 0.16);
      border-left: 3.5px solid #ff4655;
      border-radius: 0;
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
      padding: 6px 12px 6px 10px;
      color: #ece8e1;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
    }
    body.chat-theme-valorant .author {
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 900;
    }
    body.chat-theme-valorant .badge {
      background: rgba(255, 70, 85, 0.22);
      border: 1px solid #ff4655;
      color: #ff8b94;
      border-radius: 1px;
    }
    body.chat-theme-valorant #pinnedBox {
      background: linear-gradient(135deg, rgba(15, 25, 35, 0.97), rgba(45, 16, 22, 0.96));
      border: 2px solid #ff4655;
      border-radius: 0;
      clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    }
    body.chat-theme-valorant .pin-label { color: #ff4655; }

    body.chat-theme-tron #chatList { gap: 5px; }
    body.chat-theme-tron .msg-row {
      background: linear-gradient(145deg, rgba(2, 10, 22, 0.92), rgba(4, 20, 36, 0.94)) !important;
      border: 1px solid rgba(0, 240, 255, 0.45);
      border-left: 3px solid #00f0ff;
      border-radius: 2px;
      clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
      padding: 6px 10px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      color: #e0fbff;
      box-shadow: 0 0 14px rgba(0, 240, 255, 0.14);
    }
    body.chat-theme-tron .badge {
      background: rgba(255, 106, 0, 0.2);
      border: 1px solid #ff6a00;
      color: #ff9f4d;
    }
    body.chat-theme-tron #pinnedBox {
      background: rgba(2, 12, 24, 0.96);
      border: 1.5px solid #00f0ff;
      border-radius: 2px;
    }
    body.chat-theme-tron .pin-label { color: #00f0ff; }
    .msg-row.highlight {
      background: rgba(245, 158, 11, 0.24) !important;
      border-left: 3px solid #fbbf24;
    }
    .time {
      font-size: 0.8em;
      color: #94a3b8;
      margin-right: 5px;
    }
    body.hide-timestamps .time { display: none; }
    .plat-icon {
      display: inline-block;
      font-size: 0.85em;
      font-weight: 800;
      margin-right: 5px;
      vertical-align: baseline;
    }
    body.hide-platicons .plat-icon { display: none; }
    .plat-tag {
      display: inline-block;
      font-size: 0.72em;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 3px;
      text-transform: uppercase;
    }
    .plat-tag.twitch { background: #9146ff; color: #fff; }
    .plat-tag.youtube { background: #ff0033; color: #fff; }
    .plat-tag.tiktok { background: #00f2fe; color: #000; }
    .author {
      font-size: var(--name-size);
      font-weight: 800;
      margin-right: 5px;
    }
    .badge {
      font-size: 0.72em;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.16);
      padding: 1px 4px;
      border-radius: 3px;
      margin-right: 4px;
    }
    .emote-wrap {
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      height: 1.2em;
      line-height: 1;
      margin: 0 2px;
    }
    .emote-img {
      max-height: 1.45em;
      height: 1.45em;
      width: auto;
      vertical-align: middle;
      margin: -0.2em 0;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div id="pinnedBox">
    <div class="pin-label">📌 GEPINNTE NACHRICHT</div>
    <div id="pinnedContent"></div>
  </div>
  <div id="chatList"></div>

  <script>
    const chatList = document.getElementById('chatList');
    const pinnedBox = document.getElementById('pinnedBox');
    const pinnedContent = document.getElementById('pinnedContent');
    let appearance = {
      layoutMode: 'inline',
      obsChatTheme: 'auto',
      nameFontSize: 13,
      msgFontSize: 13,
      maxNameLength: 16,
      showPlatformIcons: true,
      platformIndicatorStyle: 'icon_only',
      showTimestamps: false,
      msgPadding: 4,
      showSeparator: true,
      sepColor: '#ffffff',
      sepOpacity: 10,
      usernameColorMode: 'user'
    };
    let activeAddonId = '';
    let cachedMessages = [];

    function syncChatThemeClass() {
      const mode = String(appearance.obsChatTheme || 'auto');
      const resolved = mode === 'auto'
        ? (activeAddonId === 'lol' ? 'lol' : activeAddonId === 'valorant' ? 'valorant' : activeAddonId === 'techtalk' ? 'tron' : 'default')
        : mode;
      document.body.classList.toggle('chat-theme-lol', resolved === 'lol');
      document.body.classList.toggle('chat-theme-valorant', resolved === 'valorant');
      document.body.classList.toggle('chat-theme-tron', resolved === 'tron');
    }

    function hexToRgba(hex, alphaPercent) {
      const clean = (hex || '#ffffff').replace('#', '');
      const num = parseInt(clean, 16) || 0xffffff;
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return 'rgba(' + r + ',' + g + ',' + b + ',' + (alphaPercent / 100).toFixed(2) + ')';
    }

    function applyAppearance(cfg) {
      if (!cfg) return;
      appearance = { ...appearance, ...cfg };
      const root = document.documentElement;
      root.style.setProperty('--name-size', (appearance.nameFontSize || 13) + 'px');
      root.style.setProperty('--msg-size', (appearance.msgFontSize || 13) + 'px');
      root.style.setProperty('--msg-pad-v', (appearance.msgPadding ?? 4) + 'px');
      root.style.setProperty('--msg-gap', appearance.layoutMode === 'bubbles' ? (appearance.msgPadding ?? 4) + 'px' : '0px');
      root.style.setProperty('--sep-display', appearance.showSeparator !== false ? '1px' : '0px');
      root.style.setProperty('--sep-color', hexToRgba(appearance.sepColor || '#ffffff', appearance.sepOpacity ?? 10));
      root.style.setProperty('--item-bg', hexToRgba(appearance.bgColor || '#0b0f19', appearance.obsBgOpacity ?? 65));

      document.body.classList.toggle('style-bubbles', appearance.layoutMode === 'bubbles');
      document.body.classList.toggle('hide-timestamps', !appearance.showTimestamps);
      document.body.classList.toggle('hide-platicons', appearance.showPlatformIcons === false);
      syncChatThemeClass();
      rerenderAll();
    }

    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function truncateName(name) {
      const s = String(name || 'User');
      const max = Number(appearance.maxNameLength || 18);
      if (max > 0 && s.length > max) {
        return s.slice(0, max) + '…';
      }
      return s;
    }

    function resolveAuthorColor(m) {
      if (appearance.usernameColorMode === 'mono') return '#e2e8f0';
      if (appearance.usernameColorMode === 'platform') {
        return m.platform === 'twitch' ? '#a970ff' : m.platform === 'youtube' ? '#ff4e45' : '#00f2fe';
      }
      return m.color || '#a970ff';
    }

    function renderPlatBadge(plat) {
      const safePlat = plat === 'twitch' ? 'twitch' : plat === 'youtube' ? 'youtube' : plat === 'tiktok' ? 'tiktok' : 'chat';
      const icons = { twitch: '🟣', youtube: '🔴', tiktok: '🎵' };
      const ic = icons[safePlat] || '💬';
      if (appearance.platformIndicatorStyle === 'icon_only') {
        return '<span class="plat-icon">' + ic + '</span>';
      }
      return '<span class="plat-icon"><span class="plat-tag ' + safePlat + '">' + ic + ' ' + safePlat + '</span></span>';
    }

    function renderTokens(m) {
      if (Array.isArray(m.tokens) && m.tokens.length > 0) {
        return m.tokens
          .map((t) =>
            t.type === 'emote'
              ? '<span class="emote-wrap"><img class="emote-img" src="' + escapeHtml(t.url) + '" alt="' + escapeHtml(t.name) + '" /></span>'
              : escapeHtml(t.text)
          )
          .join('');
      }
      return escapeHtml(m.text);
    }

    function renderMessageInner(m) {
      const d = new Date(m.timestamp || Date.now());
      const tStr = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      const badges = (m.badges || [])
        .map(b => '<span class="badge">' + escapeHtml(b) + '</span>')
        .join('');
      return (
        '<span class="time">' + escapeHtml(tStr) + '</span>' +
        renderPlatBadge(m.platform) +
        badges +
        '<span class="author" style="color:' + escapeHtml(resolveAuthorColor(m)) + '">' + escapeHtml(truncateName(m.author)) + ':</span>' +
        '<span class="text">' + renderTokens(m) + '</span>'
      );
    }

    function rerenderAll() {
      chatList.innerHTML = '';
      for (const m of cachedMessages.slice(-40)) {
        const div = document.createElement('div');
        div.className = 'msg-row ' + m.platform + (m.isHighlight ? ' highlight' : '');
        div.dataset.id = m.id;
        div.dataset.author = (m.author || '').toLowerCase();
        div.innerHTML = renderMessageInner(m);
        chatList.appendChild(div);
      }
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          if (payload.type === 'appearance') {
            applyAppearance(payload.data);
          } else if (payload.type === 'game-stats') {
            activeAddonId = String(payload.data?.addonId || '');
            syncChatThemeClass();
          } else if (payload.type === 'chat') {
            const m = payload.data;
            cachedMessages.push(m);
            if (cachedMessages.length > 60) cachedMessages.shift();
            const div = document.createElement('div');
            div.className = 'msg-row ' + m.platform + (m.isHighlight ? ' highlight' : '');
            div.dataset.id = m.id;
            div.dataset.author = (m.author || '').toLowerCase();
            div.innerHTML = renderMessageInner(m);
            chatList.appendChild(div);
            while (chatList.children.length > 40) {
              chatList.removeChild(chatList.firstChild);
            }
          } else if (payload.type === 'delete-msg') {
            cachedMessages = cachedMessages.filter(x => x.id !== payload.id);
            rerenderAll();
          } else if (payload.type === 'delete-user') {
            const low = (payload.author || '').toLowerCase();
            cachedMessages = cachedMessages.filter(x => (x.author || '').toLowerCase() !== low);
            rerenderAll();
          } else if (payload.type === 'pin') {
            const m = payload.data;
            if (m) {
              pinnedContent.innerHTML = renderMessageInner(m);
              pinnedBox.classList.add('active');
            } else {
              pinnedBox.classList.remove('active');
            }
          } else if (payload.type === 'clear') {
            cachedMessages = [];
            chatList.innerHTML = '';
            pinnedBox.classList.remove('active');
          }
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

/**
 * Interactive OBS Custom Browser Dock HTML (/dock)
 * Works completely independently of OBS scenes inside OBS -> View -> Docks -> Custom Browser Docks!
 * Supports live status, filters, auto-scroll pause, user quick-menu, pinning, and replying via WebSocket!
 */
const OBS_CUSTOM_DOCK_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OmniGrid Studio — OBS Custom Dock</title>
  <style>
    :root {
      --name-size: 13px;
      --msg-size: 13.5px;
      --msg-pad-v: 5px;
      --sep-display: 1px;
      --sep-color: rgba(255, 255, 255, 0.08);
      --chat-bg: #0b0f19;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--chat-bg);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #f8fafc;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .dock-header {
      background: #111827;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding: 5px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      flex-wrap: wrap;
    }
    .dock-title {
      font-size: 11.5px;
      font-weight: 800;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .status-dots {
      display: flex;
      gap: 6px;
      font-size: 10px;
      color: #94a3b8;
    }
    .s-pill { display: flex; align-items: center; gap: 3px; }
    .s-dot { width: 6px; height: 6px; border-radius: 50%; background: #64748b; }
    .s-pill.connected .s-dot { background: #10b981; box-shadow: 0 0 6px #10b981; }
    .s-pill.standby .s-dot, .s-pill.reconnecting .s-dot { background: #f59e0b; }

    .dock-filters {
      display: flex;
      gap: 3px;
      padding: 4px 6px;
      background: rgba(17, 24, 39, 0.75);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      overflow-x: auto;
    }
    .f-btn {
      background: rgba(255,255,255,0.05);
      color: #94a3b8;
      border: 1px solid rgba(255,255,255,0.08);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
    }
    .f-btn.active {
      background: rgba(56, 189, 248, 0.2);
      color: #fff;
      border-color: #38bdf8;
    }
    #pinnedBox {
      background: rgba(245, 158, 11, 0.16);
      border-bottom: 2px solid #f59e0b;
      padding: 5px 8px;
      font-size: 12px;
      display: none;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
    }
    #pinnedBox.active { display: flex; }
    .unpin-btn {
      background: rgba(0,0,0,0.4);
      color: #fde68a;
      border: 1px solid rgba(251,191,36,0.4);
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 10px;
      cursor: pointer;
    }
    .feed-wrap {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    #chatList {
      flex: 1;
      overflow-y: auto;
      padding: 2px 0;
      display: flex;
      flex-direction: column;
    }
    .resume-btn {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      background: #0284c7;
      color: #fff;
      border: none;
      padding: 4px 10px;
      border-radius: 99px;
      font-size: 10.5px;
      font-weight: 800;
      cursor: pointer;
      display: none;
      box-shadow: 0 6px 18px rgba(0,0,0,0.6);
    }
    .resume-btn.show { display: block; }
    .msg-row {
      position: relative;
      padding: var(--msg-pad-v) 8px;
      font-size: var(--msg-size);
      line-height: 1.36;
      border-bottom: var(--sep-display) solid var(--sep-color);
      border-left: 3px solid transparent;
      word-wrap: break-word;
      overflow-wrap: anywhere;
    }
    .msg-row.twitch { border-left-color: rgba(145, 70, 255, 0.7); }
    .msg-row.youtube { border-left-color: rgba(255, 0, 51, 0.7); }
    .msg-row.tiktok { border-left-color: rgba(0, 242, 254, 0.7); }
    .msg-row.highlight { background: rgba(245, 158, 11, 0.16); border-left-color: #f59e0b; }
    .msg-row.mention { background: rgba(16, 185, 129, 0.15); border-left-color: #10b981; }
    .time { font-size: 0.78em; color: #64748b; margin-right: 4px; }
    body.hide-timestamps .time { display: none; }
    .plat-icon { margin-right: 4px; font-size: 0.88em; }
    body.hide-platicons .plat-icon { display: none; }
    .author { font-size: var(--name-size); font-weight: 800; margin-right: 4px; cursor: pointer; }
    .author:hover { text-decoration: underline; }
    .badge {
      font-size: 0.72em;
      font-weight: 700;
      background: rgba(255,255,255,0.12);
      padding: 0 4px;
      border-radius: 3px;
      margin-right: 4px;
    }
    .emote-wrap {
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      height: 1.2em;
      line-height: 1;
      margin: 0 2px;
    }
    .emote-img {
      max-height: 1.45em;
      height: 1.45em;
      width: auto;
      vertical-align: middle;
      margin: -0.2em 0;
    }
    .row-actions {
      position: absolute;
      top: 50%;
      right: 4px;
      transform: translateY(-50%);
      display: none;
      gap: 2px;
      background: rgba(15, 23, 42, 0.92);
      padding: 1px 4px;
      border-radius: 5px;
      border: 1px solid rgba(255,255,255,0.14);
    }
    .msg-row:hover .row-actions { display: flex; }
    .act-btn {
      background: transparent;
      border: none;
      color: #fbbf24;
      font-size: 10.5px;
      padding: 1px 4px;
      cursor: pointer;
    }
    .reply-bar {
      display: flex;
      gap: 4px;
      padding: 6px;
      background: #111827;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    .reply-bar input {
      flex: 1;
      min-width: 0;
      background: #0b0f19;
      border: 1px solid rgba(255,255,255,0.14);
      color: #fff;
      padding: 5px 8px;
      border-radius: 5px;
      font-size: 11.5px;
      outline: none;
    }
    .reply-bar button {
      background: #9146ff;
      color: #fff;
      border: none;
      padding: 0 10px;
      border-radius: 5px;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="dock-header">
    <div class="dock-title">⚡ OmniGrid Dock <span id="totalViewers" style="color:#34d399;"></span></div>
    <div class="status-dots">
      <span class="s-pill" id="sp_twitch"><span class="s-dot"></span>TW</span>
      <span class="s-pill" id="sp_youtube"><span class="s-dot"></span>YT</span>
      <span class="s-pill" id="sp_tiktok"><span class="s-dot"></span>TT</span>
    </div>
  </div>
  <div class="dock-filters">
    <button class="f-btn active" data-f="all">Alle</button>
    <button class="f-btn" data-f="mentions">🔔 @Mich</button>
    <button class="f-btn" data-f="highlights">⭐ Events</button>
    <button class="f-btn" data-f="twitch">TW</button>
    <button class="f-btn" data-f="youtube">YT</button>
    <button class="f-btn" data-f="tiktok">TT</button>
  </div>
  <div id="pinnedBox">
    <div id="pinnedContent"></div>
    <button class="unpin-btn" id="btnUnpin">✕</button>
  </div>
  <div class="feed-wrap">
    <div id="chatList"></div>
    <button class="resume-btn" id="btnResume">⬇️ Neue Nachrichten</button>
  </div>
  <div class="reply-bar">
    <input type="text" id="inputReply" placeholder="In Chat schreiben (Enter)..." />
    <button id="btnSend">↵</button>
  </div>

  <script>
    const chatList = document.getElementById('chatList');
    const btnResume = document.getElementById('btnResume');
    const pinnedBox = document.getElementById('pinnedBox');
    const pinnedContent = document.getElementById('pinnedContent');
    const inputReply = document.getElementById('inputReply');
    let ws = null;
    let cachedMessages = [];
    let activeFilter = 'all';
    let pausedScroll = false;
    let appearance = { nameFontSize: 13, msgFontSize: 13.5, maxNameLength: 16, msgPadding: 5, showSeparator: true, sepColor: '#ffffff', sepOpacity: 8, usernameColorMode: 'user' };

    function escapeHtml(s) {
      return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function hexToRgba(hex, alphaPercent) {
      const clean = (hex || '#ffffff').replace('#', '');
      const num = parseInt(clean, 16) || 0xffffff;
      return 'rgba(' + ((num >> 16) & 255) + ',' + ((num >> 8) & 255) + ',' + (num & 255) + ',' + (alphaPercent / 100).toFixed(2) + ')';
    }
    function applyAppearance(cfg) {
      if (!cfg) return;
      appearance = { ...appearance, ...cfg };
      const r = document.documentElement;
      r.style.setProperty('--name-size', (appearance.nameFontSize || 13) + 'px');
      r.style.setProperty('--msg-size', (appearance.msgFontSize || 13.5) + 'px');
      r.style.setProperty('--msg-pad-v', (appearance.msgPadding ?? 5) + 'px');
      r.style.setProperty('--sep-display', appearance.showSeparator !== false ? '1px' : '0px');
      r.style.setProperty('--sep-color', hexToRgba(appearance.sepColor || '#ffffff', appearance.sepOpacity ?? 8));
      document.body.classList.toggle('hide-timestamps', !appearance.showTimestamps);
      document.body.classList.toggle('hide-platicons', appearance.showPlatformIcons === false);
      rerender();
    }
    function truncateName(n) {
      const s = String(n || 'User');
      const m = Number(appearance.maxNameLength || 16);
      return m > 0 && s.length > m ? s.slice(0, m) + '…' : s;
    }
    function renderTokens(m) {
      if (Array.isArray(m.tokens) && m.tokens.length > 0) {
        return m.tokens.map(t => t.type === 'emote' ? '<span class="emote-wrap"><img class="emote-img" src="' + escapeHtml(t.url) + '" alt="' + escapeHtml(t.name) + '" /></span>' : escapeHtml(t.text)).join('');
      }
      return escapeHtml(m.text);
    }
    function renderInner(m) {
      const d = new Date(m.timestamp || Date.now());
      const tStr = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      const icons = { twitch: '🟣', youtube: '🔴', tiktok: '🎵' };
      const badges = (m.badges || []).map(b => '<span class="badge">' + escapeHtml(b) + '</span>').join('');
      return '<span class="time">' + escapeHtml(tStr) + '</span><span class="plat-icon">' + (icons[m.platform] || '💬') + '</span>' + badges +
        '<span class="author" style="color:' + escapeHtml(m.color || '#38bdf8') + '">' + escapeHtml(truncateName(m.author)) + ':</span>' +
        '<span class="text">' + renderTokens(m) + '</span>';
    }
    function matches(m) {
      if (activeFilter === 'mentions') return Boolean(m.isMention);
      if (activeFilter === 'highlights') return Boolean(m.isHighlight);
      if (activeFilter !== 'all' && m.platform !== activeFilter) return false;
      return true;
    }
    function createRow(m) {
      const div = document.createElement('div');
      div.className = 'msg-row ' + m.platform + (m.isHighlight ? ' highlight' : '') + (m.isMention ? ' mention' : '');
      div.innerHTML = renderInner(m) + '<div class="row-actions"><button class="act-btn pin-b" title="In OBS pinnen">📌</button><button class="act-btn del-b" title="Löschen">🗑️</button></div>';
      div.querySelector('.author').onclick = () => { inputReply.value = '@' + m.author + ' '; inputReply.focus(); };
      div.querySelector('.pin-b').onclick = () => ws?.send(JSON.stringify({ action: 'pin', data: m }));
      div.querySelector('.del-b').onclick = () => ws?.send(JSON.stringify({ action: 'delete-msg', id: m.id }));
      return div;
    }
    function rerender() {
      chatList.innerHTML = '';
      cachedMessages.filter(matches).slice(-120).forEach(m => chatList.appendChild(createRow(m)));
      if (!pausedScroll) chatList.scrollTop = chatList.scrollHeight;
    }
    chatList.addEventListener('scroll', () => {
      const dist = chatList.scrollHeight - chatList.scrollTop - chatList.clientHeight;
      pausedScroll = dist > 45;
      btnResume.classList.toggle('show', pausedScroll);
    });
    btnResume.onclick = () => { pausedScroll = false; btnResume.classList.remove('show'); chatList.scrollTop = chatList.scrollHeight; };
    document.querySelectorAll('.f-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.f;
        rerender();
      };
    });
    document.getElementById('btnUnpin').onclick = () => ws?.send(JSON.stringify({ action: 'pin', data: null }));
    function sendChat() {
      const txt = inputReply.value.trim();
      if (!txt || !ws) return;
      ws.send(JSON.stringify({ action: 'send-chat', text: txt }));
      inputReply.value = '';
    }
    document.getElementById('btnSend').onclick = sendChat;
    inputReply.onkeydown = (e) => { if (e.key === 'Enter') sendChat(); };

    function connectWs() {
      ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'appearance') applyAppearance(p.data);
          else if (p.type === 'status') {
            let tot = 0;
            ['twitch', 'youtube', 'tiktok'].forEach(k => {
              const s = p.data?.[k] || {};
              const el = document.getElementById('sp_' + k);
              if (el) el.className = 's-pill ' + (s.status || '');
              if (s.status === 'connected') tot += Number(s.viewers || 0);
            });
            document.getElementById('totalViewers').textContent = tot > 0 ? '👁️ ' + tot : '';
          } else if (p.type === 'chat') {
            cachedMessages.push(p.data);
            if (cachedMessages.length > 200) cachedMessages.shift();
            if (matches(p.data)) {
              chatList.appendChild(createRow(p.data));
              if (!pausedScroll) chatList.scrollTop = chatList.scrollHeight;
            }
          } else if (p.type === 'delete-msg') {
            cachedMessages = cachedMessages.filter(x => x.id !== p.id);
            rerender();
          } else if (p.type === 'delete-user') {
            const low = (p.author || '').toLowerCase();
            cachedMessages = cachedMessages.filter(x => (x.author || '').toLowerCase() !== low);
            rerender();
          } else if (p.type === 'pin') {
            if (p.data) { pinnedContent.innerHTML = renderInner(p.data); pinnedBox.classList.add('active'); }
            else pinnedBox.classList.remove('active');
          } else if (p.type === 'clear') {
            cachedMessages = []; chatList.innerHTML = ''; pinnedBox.classList.remove('active');
          }
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_SPOTIFY_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Spotify Overlay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #fff;
      padding: 8px;
      overflow: hidden;
    }
    .sp-card {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(29, 185, 84, 0.5);
      border-left: 4px solid #1db954;
      border-radius: 10px;
      padding: 8px 14px 8px 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      max-width: 420px;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    .sp-card.paused { opacity: 0.45; }
    .sp-card.hidden { opacity: 0; transform: translateY(8px); pointer-events: none; }
    .sp-cover {
      width: 44px;
      height: 44px;
      border-radius: 6px;
      object-fit: cover;
      background: #1db954;
      flex-shrink: 0;
    }
    .sp-cover-fallback {
      width: 44px;
      height: 44px;
      border-radius: 6px;
      background: rgba(29, 185, 84, 0.2);
      border: 1px solid rgba(29, 185, 84, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    .sp-meta { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .sp-tag { font-size: 9.5px; font-weight: 800; color: #1db954; text-transform: uppercase; letter-spacing: 0.5px; }
    .sp-title { font-size: 14px; font-weight: 800; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sp-artist { font-size: 12px; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  </style>
</head>
<body>
  <div class="sp-card hidden" id="spCard">
    <img class="sp-cover" id="spCover" style="display:none;" alt="" />
    <div class="sp-cover-fallback" id="spFallback">🎵</div>
    <div class="sp-meta">
      <span class="sp-tag" id="spTag">SPOTIFY • LIVE</span>
      <strong class="sp-title" id="spTitle">-</strong>
      <span class="sp-artist" id="spArtist">-</span>
    </div>
  </div>
  <script>
    const card = document.getElementById('spCard');
    const cover = document.getElementById('spCover');
    const fallback = document.getElementById('spFallback');
    const tag = document.getElementById('spTag');
    const title = document.getElementById('spTitle');
    const artist = document.getElementById('spArtist');

    function renderTrack(t) {
      if (!t || !t.running || !t.title) {
        card.classList.add('hidden');
        return;
      }
      card.classList.remove('hidden');
      card.classList.toggle('paused', !t.playing);
      const srcLabel = (t.source || 'SPOTIFY').toUpperCase();
      tag.textContent = t.playing ? srcLabel + ' • NOW PLAYING' : srcLabel + ' • PAUSIERT';
      tag.style.color = t.source === 'Amazon Music' ? '#00a8e1' : t.source === 'Apple Music' ? '#fb7185' : '#1ed760';
      title.textContent = t.title;
      artist.textContent = t.artist || t.source || 'Music';
      if (t.artworkUrl) {
        cover.src = t.artworkUrl;
        cover.style.display = 'block';
        fallback.style.display = 'none';
      } else {
        cover.style.display = 'none';
        fallback.style.display = 'flex';
      }
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'spotify') renderTrack(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_TABLET_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <title>OmniGrid Tablet Companion</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      background: #0b0f19;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .tb-header {
      background: #111827;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .tb-brand { font-size: 14px; font-weight: 800; color: #38bdf8; display: flex; align-items: center; gap: 8px; }
    .tb-pills { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
    .tb-pill {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 11px; font-weight: 700; padding: 4px 8px;
      border-radius: 99px; background: rgba(255,255,255,0.06); color: #cbd5e1;
    }
    .tb-dot { width: 7px; height: 7px; border-radius: 50%; background: #64748b; }
    .tb-pill.connected .tb-dot { background: #10b981; box-shadow: 0 0 6px #10b981; }
    .tb-sp-pill {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(29, 185, 84, 0.16); border: 1px solid rgba(29, 185, 84, 0.45);
      color: #86efac; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 700;
      max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .tb-main {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: row;
    }
    @media (max-width: 760px) {
      .tb-main { flex-direction: column; }
      .tb-deck { width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.1); max-height: 210px; overflow-y: auto; }
    }
    .tb-deck {
      width: 270px;
      flex-shrink: 0;
      background: #0f172a;
      border-right: 1px solid rgba(255,255,255,0.1);
      padding: 10px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      align-content: start;
      overflow-y: auto;
    }
    .deck-btn {
      background: rgba(30, 41, 59, 0.9);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      color: #f8fafc;
      padding: 12px 8px;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      cursor: pointer;
      text-align: center;
      min-height: 62px;
      transition: transform 0.08s ease, background 0.12s ease;
    }
    .deck-btn:active { transform: scale(0.95); background: rgba(56, 189, 248, 0.25); }
    .deck-btn.sp { border-color: rgba(29, 185, 84, 0.45); background: rgba(29, 185, 84, 0.14); }
    .deck-btn.warn { border-color: rgba(245, 158, 11, 0.45); color: #fde68a; }
    .deck-btn .ic { font-size: 19px; }

    .tb-chat-wrap {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    .tb-pinned {
      background: rgba(245, 158, 11, 0.16);
      border-bottom: 1px solid rgba(245, 158, 11, 0.4);
      padding: 8px 12px;
      font-size: 13px;
      display: none;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .tb-pinned.active { display: flex; }
    .tb-feed {
      flex: 1;
      overflow-y: auto;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .tb-msg {
      padding: 8px 10px;
      border-radius: 8px;
      background: rgba(255,255,255,0.03);
      border-left: 3.5px solid #9146ff;
      font-size: 15px;
      line-height: 1.4;
      word-break: break-word;
    }
    .tb-msg.youtube { border-left-color: #ff0033; }
    .tb-msg.tiktok { border-left-color: #00f2fe; }
    .tb-msg.highlight { background: rgba(245, 158, 11, 0.16); border-left-color: #f59e0b; }
    .tb-msg img.emote { height: 1.45em; vertical-align: middle; margin: 0 2px; }
    .tb-author { font-weight: 800; margin-right: 6px; }
    .tb-reply-bar {
      display: flex;
      gap: 8px;
      padding: 8px 10px;
      background: #111827;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .tb-reply-bar input {
      flex: 1;
      min-width: 0;
      background: #0b0f19;
      border: 1px solid rgba(255,255,255,0.16);
      color: #fff;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    }
    .tb-send {
      background: #9146ff;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0 16px;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
    }
    .tb-sheet {
      position: fixed;
      bottom: 66px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.98);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 12px;
      padding: 10px;
      display: none;
      gap: 8px;
      box-shadow: 0 14px 36px rgba(0,0,0,0.8);
      z-index: 99;
      flex-wrap: wrap;
      max-width: 92vw;
    }
    .tb-sheet.open { display: flex; }
    .sheet-btn {
      background: rgba(255,255,255,0.1);
      border: none;
      color: #fff;
      padding: 9px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .sheet-btn.warn { background: rgba(239, 68, 68, 0.28); color: #fecaca; }
  </style>
</head>
<body>
  <header class="tb-header">
    <div class="tb-brand">⚡ OmniGrid Tablet</div>
    <div class="tb-pills">
      <span class="tb-sp-pill" id="tbSpotify">🎵 Spotify: Warte...</span>
      <span class="tb-pill" id="tbTw"><span class="tb-dot"></span>TW <strong id="tbTwV">0</strong></span>
      <span class="tb-pill" id="tbYt"><span class="tb-dot"></span>YT <strong id="tbYtV">0</strong></span>
      <span class="tb-pill" id="tbTt"><span class="tb-dot"></span>TT <strong id="tbTtV">0</strong></span>
    </div>
  </header>

  <div class="tb-main">
    <aside class="tb-deck">
      <button class="deck-btn" onclick="sdApi('/pin-last')"><span class="ic">📌</span>Letzte pinnen</button>
      <button class="deck-btn warn" onclick="sdApi('/unpin')"><span class="ic">❌</span>OBS-Pin aus</button>
      <button class="deck-btn warn" onclick="sdApi('/clear-chat')"><span class="ic">🗑️</span>Chat leeren</button>
      <button class="deck-btn" onclick="sdApi('/toggle-compact')"><span class="ic">↕️</span>Kompakt</button>
      <button class="deck-btn sp" onclick="sdApi('/spotify-playpause')"><span class="ic">⏯</span>Play / Pause</button>
      <button class="deck-btn sp" onclick="sdApi('/spotify-next')"><span class="ic">⏭</span>Nächster Song</button>
      <button class="deck-btn sp" onclick="sdApi('/spotify-announce')"><span class="ic">📢</span>Song in Chat</button>
      <button class="deck-btn" onclick="sdApi('/send?text=GG!')"><span class="ic">💬</span>Sende GG!</button>
      <button class="deck-btn" onclick="sdApi('/send?text=!discord')"><span class="ic">🎮</span>!discord</button>
      <button class="deck-btn" onclick="sdApi('/toggle-poll')"><span class="ic">🗳️</span>Poll Ein/Aus</button>
      <button class="deck-btn" onclick="sdApi('/clip')"><span class="ic">🎬</span>Clip</button>
      <button class="deck-btn" onclick="sdApi('/marker')"><span class="ic">🚩</span>Marker</button>
      <button class="deck-btn" onclick="sdApi('/obs-replay')"><span class="ic">💾</span>OBS Replay</button>
      <button class="deck-btn" onclick="sdApi('/obs-mic')"><span class="ic">🎙️</span>Mic Mute</button>
      <button class="deck-btn" onclick="sdApi('/obs-record')"><span class="ic">🔴</span>OBS Rec</button>
      <button class="deck-btn" onclick="sdApi('/reconnect?platform=all')"><span class="ic">↻</span>Reconnect</button>
    </aside>

    <main class="tb-chat-wrap">
      <div class="tb-pinned" id="tbPinned">
        <span id="tbPinnedText"></span>
        <button class="sheet-btn" onclick="sdApi('/unpin')">✕</button>
      </div>
      <div class="tb-feed" id="tbFeed"></div>
      <footer class="tb-reply-bar">
        <input type="text" id="tbInput" placeholder="Als Streamer schreiben..." />
        <button class="tb-send" id="tbSend">Senden</button>
      </footer>
    </main>
  </div>

  <div class="tb-sheet" id="tbSheet">
    <button class="sheet-btn" id="shPin">📌 In OBS pinnen</button>
    <button class="sheet-btn" id="shReply">💬 Antworten</button>
    <button class="sheet-btn warn" id="shDel">🗑️ Lokal löschen</button>
    <button class="sheet-btn" onclick="closeSheet()">✕</button>
  </div>

  <script>
    const feed = document.getElementById('tbFeed');
    const tbInput = document.getElementById('tbInput');
    const tbPinned = document.getElementById('tbPinned');
    const tbPinnedText = document.getElementById('tbPinnedText');
    const tbSheet = document.getElementById('tbSheet');
    const tbSpotify = document.getElementById('tbSpotify');
    let selectedMsg = null;
    let ws = null;

    function esc(s) {
      return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    async function sdApi(path) {
      try { await fetch('/api/streamdeck' + path); } catch (e) {}
    }

    function renderTokens(m) {
      if (Array.isArray(m.tokens) && m.tokens.length > 0) {
        return m.tokens.map(t => t.type === 'emote'
          ? '<img class="emote" src="' + esc(t.url) + '" alt="' + esc(t.name) + '" />'
          : esc(t.text)
        ).join('');
      }
      return esc(m.text);
    }

    function addMsg(m) {
      const div = document.createElement('div');
      div.className = 'tb-msg ' + m.platform + (m.isHighlight ? ' highlight' : '');
      div.dataset.id = m.id;
      const ic = m.platform === 'twitch' ? '🟣' : m.platform === 'youtube' ? '🔴' : '🎵';
      div.innerHTML = ic + ' <span class="tb-author" style="color:' + esc(m.color || '#38bdf8') + '">' + esc(m.author) + ':</span>' + renderTokens(m);
      div.onclick = () => {
        selectedMsg = m;
        tbSheet.classList.add('open');
      };
      feed.appendChild(div);
      while (feed.children.length > 100) feed.removeChild(feed.firstChild);
      feed.scrollTop = feed.scrollHeight;
    }

    function closeSheet() {
      tbSheet.classList.remove('open');
      selectedMsg = null;
    }

    document.getElementById('shPin').onclick = () => {
      if (selectedMsg && ws) ws.send(JSON.stringify({ action: 'pin', data: selectedMsg }));
      closeSheet();
    };
    document.getElementById('shReply').onclick = () => {
      if (selectedMsg) {
        tbInput.value = '@' + selectedMsg.author + ' ';
        tbInput.focus();
      }
      closeSheet();
    };
    document.getElementById('shDel').onclick = () => {
      if (selectedMsg && ws) ws.send(JSON.stringify({ action: 'delete-msg', id: selectedMsg.id }));
      closeSheet();
    };

    function sendChat() {
      const txt = tbInput.value.trim();
      if (!txt) return;
      sdApi('/send?text=' + encodeURIComponent(txt));
      tbInput.value = '';
    }
    document.getElementById('tbSend').onclick = sendChat;
    tbInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

    function updateStatus(st) {
      if (!st) return;
      const map = [['twitch','tbTw','tbTwV'],['youtube','tbYt','tbYtV'],['tiktok','tbTt','tbTtV']];
      map.forEach(([k, pId, vId]) => {
        const s = st[k] || {};
        document.getElementById(pId).classList.toggle('connected', s.status === 'connected');
        document.getElementById(vId).textContent = s.viewers || 0;
      });
    }

    function updateSpotify(t) {
      if (!t || !t.running || !t.title) {
        tbSpotify.textContent = '🎵 Spotify: Pausiert/Aus';
        return;
      }
      tbSpotify.textContent = (t.playing ? '▶️ ' : '⏸️ ') + t.title + (t.artist ? ' – ' + t.artist : '');
    }

    function connect() {
      ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'chat') addMsg(p.data);
          else if (p.type === 'status') updateStatus(p.data);
          else if (p.type === 'spotify') updateSpotify(p.data);
          else if (p.type === 'pin') {
            if (p.data) {
              tbPinnedText.innerHTML = '📌 <strong>' + esc(p.data.author) + ':</strong> ' + renderTokens(p.data);
              tbPinned.classList.add('active');
            } else {
              tbPinned.classList.remove('active');
            }
          } else if (p.type === 'delete-msg') {
            const el = feed.querySelector('[data-id="' + p.id + '"]');
            if (el) el.remove();
          } else if (p.type === 'clear') {
            feed.innerHTML = '';
            tbPinned.classList.remove('active');
          }
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connect, 2000);
    }
    connect();
  </script>
</body>
</html>`;

const OBS_ALERTS_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid OBS Alert Overlay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #fff;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 16px;
    }
    .alert-card {
      width: 440px;
      max-width: 94vw;
      background: rgba(15, 23, 42, 0.94);
      border: 2px solid #f59e0b;
      border-radius: 16px;
      padding: 18px 22px;
      text-align: center;
      box-shadow: 0 18px 46px rgba(0,0,0,0.65), 0 0 28px rgba(245, 158, 11, 0.35);
      opacity: 0;
      transform: scale(0.82) translateY(16px);
      pointer-events: none;
      transition: opacity 0.32s ease, transform 0.36s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .alert-card.anim-slide {
      transform: translateY(-48px);
    }
    .alert-card.visible {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    .alert-card.anim-glow.visible {
      animation: alertPulse 1.4s ease-in-out infinite alternate;
    }
    @keyframes alertPulse {
      from { box-shadow: 0 18px 46px rgba(0,0,0,0.65), 0 0 18px var(--ac-glow, rgba(245,158,11,0.4)); }
      to { box-shadow: 0 18px 46px rgba(0,0,0,0.65), 0 0 42px var(--ac-glow, rgba(245,158,11,0.85)); }
    }
    .al-top {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 4px 12px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      background: rgba(255,255,255,0.1);
      margin-bottom: 10px;
    }
    .al-author {
      font-size: 26px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 2px 10px rgba(0,0,0,0.55);
      margin-bottom: 6px;
      word-break: break-word;
    }
    .al-summary {
      font-size: 15px;
      font-weight: 600;
      color: #e2e8f0;
      line-height: 1.35;
    }
  </style>
</head>
<body>
  <div class="alert-card" id="alertCard">
    <img id="alMedia" style="display:none;max-width:160px;max-height:110px;border-radius:10px;margin:0 auto 10px;object-fit:contain;" alt="" />
    <div class="al-top" id="alTop">⭐ NEUES EVENT</div>
    <div class="al-author" id="alAuthor">Streamer</div>
    <div class="al-summary" id="alSummary">Vielen Dank!</div>
  </div>
  <script>
    const card = document.getElementById('alertCard');
    const alMedia = document.getElementById('alMedia');
    const alTop = document.getElementById('alTop');
    const alAuthor = document.getElementById('alAuthor');
    const alSummary = document.getElementById('alSummary');

    let alertConfig = {
      enabled: true,
      durationSec: 5,
      soundEnabled: true,
      animation: 'pop',
      types: { follow: true, sub: true, resub: true, subgift: true, bits: true, raid: true },
      customMedia: {}
    };
    const queue = [];
    let isShowing = false;
    let audioCtx = null;

    const LABELS = {
      follow: ['❤️', 'Neuer Follow'],
      sub: ['⭐', 'Neues Sub / Member'],
      resub: ['🌟', 'Resub'],
      subgift: ['🎁', 'Gifted Subs'],
      bits: ['💎', 'Bits / Gift / SuperChat'],
      raid: ['🚨', 'Raid']
    };
    const PLAT_ICONS = { twitch: '🟣', youtube: '🔴', tiktok: '🎵' };

    function playChime() {
      if (!alertConfig.soundEnabled) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.55);
      } catch (e) {}
    }

    function playAlertAudio(customAudioUrl) {
      if (!alertConfig.soundEnabled) return;
      if (customAudioUrl) {
        try {
          const audio = new Audio(customAudioUrl);
          audio.volume = 0.85;
          audio.play().catch(() => playChime());
          return;
        } catch (e) {}
      }
      playChime();
    }

    function processQueue() {
      if (isShowing || queue.length === 0) return;
      isShowing = true;
      const ev = queue.shift();
      const t = ev.normType || ev.type || 'sub';
      const [evIcon, evLabel] = LABELS[t] || ['✨', 'Stream Event'];
      const pIcon = PLAT_ICONS[ev.platform] || '⚡';
      const color = ev.color || '#f59e0b';
      const media = (alertConfig.customMedia && alertConfig.customMedia[t]) || {};

      if (media.imageUrl) {
        alMedia.src = media.imageUrl;
        alMedia.style.display = 'block';
      } else {
        alMedia.style.display = 'none';
        alMedia.removeAttribute('src');
      }

      card.style.borderColor = color;
      card.style.setProperty('--ac-glow', color);
      alTop.style.background = color;
      alTop.style.color = '#0b0f19';
      alTop.textContent = pIcon + ' ' + evIcon + ' ' + evLabel;
      alAuthor.textContent = ev.author || 'Zuschauer';
      alSummary.textContent = ev.summary || '';

      card.className = 'alert-card anim-' + (alertConfig.animation || 'pop');
      void card.offsetWidth;
      card.classList.add('visible');
      playAlertAudio(media.audioUrl || '');

      const ms = Math.max(2000, Math.min(15000, Number(alertConfig.durationSec || 5) * 1000));
      setTimeout(() => {
        card.classList.remove('visible');
        setTimeout(() => {
          isShowing = false;
          processQueue();
        }, 420);
      }, ms);
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'alert-config' && p.data) {
            alertConfig = { ...alertConfig, ...p.data };
          } else if (p.type === 'obs-alert' && p.data) {
            queue.push(p.data);
            processQueue();
          } else if (p.type === 'soundboard' && p.data) {
            try {
              const s = p.data;
              const vol = Math.max(0, Math.min(1, Number(s.volume ?? 0.8)));
              if (s.url) {
                const a = new Audio(s.url);
                a.volume = vol;
                a.play().catch(() => {});
              } else if (s.builtin) {
                const actx = new (window.AudioContext || window.webkitAudioContext)();
                const g = actx.createGain();
                g.gain.value = vol * 0.35;
                g.connect(actx.destination);
                const o = actx.createOscillator();
                o.type = s.builtin === 'airhorn' ? 'sawtooth' : s.builtin === 'alarm' ? 'square' : 'sine';
                o.frequency.setValueAtTime(s.builtin === 'airhorn' ? 440 : s.builtin === 'ding' ? 880 : s.builtin === 'rimshot' ? 220 : 660, actx.currentTime);
                o.connect(g);
                o.start();
                o.stop(actx.currentTime + (s.builtin === 'airhorn' ? 0.55 : 0.25));
              }
            } catch (e) {}
          }
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_GOALS_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — OBS Goal-Bar</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent !important; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; overflow: hidden; }
    .goal-wrap {
      width: 100%;
      max-width: 520px;
      padding: 12px 16px;
      border-radius: 14px;
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(255,255,255,0.14);
      box-shadow: 0 10px 28px rgba(0,0,0,0.45);
      color: #f8fafc;
    }
    .goal-wrap.hidden { display: none; }
    .goal-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 8px;
      gap: 10px;
    }
    .goal-title { font-size: 14px; font-weight: 800; letter-spacing: 0.2px; }
    .goal-nums { font-size: 13px; font-weight: 800; color: #e2e8f0; }
    .goal-track {
      position: relative;
      height: 18px;
      border-radius: 99px;
      background: rgba(255,255,255,0.1);
      overflow: hidden;
    }
    .goal-fill {
      height: 100%;
      width: 0%;
      border-radius: 99px;
      background: linear-gradient(90deg, var(--bar-color, #9146ff), #38bdf8);
      transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .goal-pct {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 900;
      text-shadow: 0 1px 4px rgba(0,0,0,0.8);
    }
  </style>
</head>
<body>
  <div class="goal-wrap" id="goalWrap">
    <div class="goal-head">
      <div class="goal-title" id="goalTitle">Sub-Goal</div>
      <div class="goal-nums" id="goalNums">0 / 50</div>
    </div>
    <div class="goal-track">
      <div class="goal-fill" id="goalFill"></div>
      <div class="goal-pct" id="goalPct">0%</div>
    </div>
  </div>
  <script>
    const wrap = document.getElementById('goalWrap');
    const titleEl = document.getElementById('goalTitle');
    const numsEl = document.getElementById('goalNums');
    const fillEl = document.getElementById('goalFill');
    const pctEl = document.getElementById('goalPct');

    function renderGoal(g) {
      if (!g || g.enabled === false) {
        wrap.classList.add('hidden');
        return;
      }
      wrap.classList.remove('hidden');
      const cur = Math.max(0, Number(g.current || 0));
      const tgt = Math.max(1, Number(g.target || 50));
      const pct = Math.min(100, Math.round((cur / tgt) * 100));
      titleEl.textContent = g.title || 'Stream-Goal';
      numsEl.textContent = cur + ' / ' + tgt;
      fillEl.style.width = pct + '%';
      fillEl.style.setProperty('--bar-color', g.barColor || '#9146ff');
      pctEl.textContent = pct + '%';
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'goals') renderGoal(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_POLL_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — OBS Multistream Poll</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent !important; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; overflow: hidden; }
    .poll-card {
      width: 100%;
      max-width: 460px;
      padding: 14px 16px;
      border-radius: 14px;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(56, 189, 248, 0.35);
      box-shadow: 0 12px 32px rgba(0,0,0,0.5);
      color: #f8fafc;
    }
    .poll-card.hidden { display: none; }
    .poll-q { font-size: 15px; font-weight: 800; margin-bottom: 10px; line-height: 1.3; }
    .poll-opts { display: flex; flex-direction: column; gap: 7px; }
    .poll-opt {
      position: relative;
      border-radius: 9px;
      background: rgba(255,255,255,0.07);
      overflow: hidden;
      padding: 7px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700;
    }
    .poll-bar {
      position: absolute;
      inset: 0 auto 0 0;
      background: linear-gradient(90deg, rgba(145, 70, 255, 0.55), rgba(56, 189, 248, 0.55));
      transition: width 0.3s ease;
      z-index: 0;
    }
    .poll-lbl, .poll-val { position: relative; z-index: 1; }
    .poll-foot { margin-top: 9px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="poll-card hidden" id="pollCard">
    <div class="poll-q" id="pollQ"></div>
    <div class="poll-opts" id="pollOpts"></div>
    <div class="poll-foot">
      <span id="pollHint">Abstimmen im Chat: !vote 1</span>
      <span id="pollTotal">0 Stimmen</span>
    </div>
  </div>
  <script>
    const card = document.getElementById('pollCard');
    const qEl = document.getElementById('pollQ');
    const optsEl = document.getElementById('pollOpts');
    const totalEl = document.getElementById('pollTotal');
    const hintEl = document.getElementById('pollHint');

    function renderPoll(poll) {
      if (!poll || poll.visible === false || (!poll.active && !poll.visibleWhenStopped)) {
        card.classList.add('hidden');
        return;
      }
      card.classList.remove('hidden');
      qEl.textContent = poll.question || 'Umfrage';
      const total = Math.max(0, Number(poll.totalVotes || 0));
      totalEl.textContent = total + (total === 1 ? ' Stimme' : ' Stimmen');
      hintEl.textContent = poll.active ? 'Abstimmen im Chat: !vote 1..' + (poll.options || []).length : 'Abstimmung beendet';
      optsEl.innerHTML = '';
      (poll.options || []).forEach((opt, idx) => {
        const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
        const row = document.createElement('div');
        row.className = 'poll-opt';
        const escPoll = (v) => String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        row.innerHTML =
          '<div class="poll-bar" style="width:' + pct + '%"></div>' +
          '<span class="poll-lbl">' + (idx + 1) + '. ' + escPoll(opt.label) + '</span>' +
          '<span class="poll-val">' + pct + '% (' + (opt.votes || 0) + ')</span>';
        optsEl.appendChild(row);
      });
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'poll') renderPoll(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_SCHEDULE_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Schedule Overlay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .sched-card { width: 420px; background: rgba(15, 23, 42, 0.90); border: 1px solid rgba(148, 163, 184, 0.25); border-radius: 14px; padding: 14px 16px; box-shadow: 0 12px 32px rgba(0,0,0,0.45); }
    .sched-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .sched-title { font-size: 15px; font-weight: 800; color: #f8fafc; }
    .sched-next { font-size: 11px; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.14); padding: 3px 8px; border-radius: 999px; }
    .sched-list { display: flex; flex-direction: column; gap: 8px; }
    .sched-row { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(148, 163, 184, 0.16); border-radius: 10px; padding: 8px 11px; }
    .sched-top { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8; font-weight: 600; }
    .sched-name { font-size: 13px; font-weight: 700; color: #f1f5f9; margin-top: 2px; }
    .sched-meta { font-size: 11px; color: #cbd5e1; margin-top: 2px; display: flex; justify-content: space-between; }
    .sched-empty { font-size: 12px; color: #94a3b8; padding: 10px 0; text-align: center; }
  </style>
</head>
<body>
  <div class="sched-card" id="schedCard">
    <div class="sched-head">
      <span class="sched-title" id="schedTitle">📅 Stream-Sendeplan</span>
      <span class="sched-next" id="schedNext">—</span>
    </div>
    <div class="sched-list" id="schedList">
      <div class="sched-empty">Lade Sendeplan...</div>
    </div>
  </div>
  <script>
    const titleEl = document.getElementById('schedTitle');
    const nextEl = document.getElementById('schedNext');
    const listEl = document.getElementById('schedList');
    let latestData = null;

    function formatCountdown(ms) {
      const diff = ms - Date.now();
      if (diff <= 0) return '🔴 JETZT / BALD';
      const mins = Math.floor(diff / 60000);
      const hrs = Math.floor(mins / 60);
      const days = Math.floor(hrs / 24);
      if (days > 0) return 'in ' + days + 'd ' + (hrs % 24) + 'h';
      if (hrs > 0) return 'in ' + hrs + 'h ' + (mins % 60) + 'm';
      return 'in ' + mins + 'm';
    }

    function renderSchedule(data) {
      latestData = data;
      if (!data) return;
      titleEl.textContent = '📅 ' + (data.channel || 'Stream') + ' Sendeplan';
      const items = Array.isArray(data.entries) ? data.entries : [];
      if (!items.length) {
        nextEl.textContent = 'Keine Termine';
        listEl.innerHTML = '<div class="sched-empty">Aktuell keine Termine geplant.</div>';
        return;
      }
      nextEl.textContent = formatCountdown(items[0].startMs);
      listEl.innerHTML = '';
      items.slice(0, 5).forEach((e) => {
        const dt = new Date(e.startMs);
        const dateStr = dt.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: '2-digit' });
        const timeStr = dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        const plats = (e.platforms || []).map((p) => p.toUpperCase()).join(' • ');
        const row = document.createElement('div');
        row.className = 'sched-row';
        const escSched = (v) => String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        row.innerHTML =
          '<div class="sched-top"><span>' + escSched(dateStr) + ' • ' + escSched(timeStr) + '</span><span>' + escSched(plats) + '</span></div>' +
          '<div class="sched-name">' + escSched(e.title) + '</div>' +
          (e.game ? '<div class="sched-meta"><span>🎮 ' + escSched(e.game) + '</span><span>' + Number(e.durationMin || 0) + ' Min.</span></div>' : '');
        listEl.appendChild(row);
      });
    }

    setInterval(() => { if (latestData) renderSchedule(latestData); }, 30000);

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'schedule') renderSchedule(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_GIVEAWAY_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Giveaway Overlay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .gw-card { width: 420px; background: rgba(15, 23, 42, 0.92); border: 1px solid rgba(168, 85, 247, 0.45); border-radius: 16px; padding: 16px 18px; box-shadow: 0 14px 36px rgba(0,0,0,0.55); transition: opacity 0.25s, transform 0.25s; }
    .gw-card.hidden { opacity: 0; transform: translateY(10px); pointer-events: none; }
    .gw-head { display: flex; justify-content: space-between; align-items: center; }
    .gw-title { font-size: 16px; font-weight: 800; color: #f8fafc; }
    .gw-badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px; background: rgba(168,85,247,0.22); color: #e9d5ff; }
    .gw-sub { font-size: 12px; color: #cbd5e1; margin-top: 4px; }
    .gw-slot { margin-top: 12px; background: rgba(2, 6, 23, 0.78); border: 1px solid rgba(148,163,184,0.25); border-radius: 12px; padding: 14px; text-align: center; min-height: 62px; display: flex; align-items: center; justify-content: center; flex-direction: column; }
    .gw-winner { font-size: 22px; font-weight: 900; color: #fde047; text-shadow: 0 0 18px rgba(250,204,21,0.45); }
    .gw-plat { font-size: 11px; color: #94a3b8; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.06em; }
    .gw-deck { display: none; position: relative; width: 140px; height: 52px; margin-bottom: 8px; align-items: center; justify-content: center; }
    .gw-mini-card { position: absolute; width: 32px; height: 46px; border-radius: 5px; background: linear-gradient(145deg, #12081c, #07040c); border: 1.8px solid #facc15; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; box-shadow: 0 4px 14px rgba(0,0,0,0.65); }
  </style>
</head>
<body>
  <div class="gw-card hidden" id="gwCard">
    <div class="gw-head">
      <span class="gw-title" id="gwTitle">🎁 Giveaway</span>
      <span class="gw-badge" id="gwCount">0 Teilnehmer</span>
    </div>
    <div class="gw-sub" id="gwSub">Schreibe !join in den Chat</div>
    <div class="gw-slot">
      <div class="gw-deck" aria-hidden="true">
        <div class="gw-mini-card c1">♠</div>
        <div class="gw-mini-card c2">♥</div>
        <div class="gw-mini-card c3">♦</div>
        <div class="gw-mini-card c4">♣</div>
        <div class="gw-mini-card c5">🃏</div>
      </div>
      <div class="gw-winner" id="gwWinner">—</div>
      <div class="gw-plat" id="gwPlat"></div>
    </div>
  </div>
  <script>
    const card = document.getElementById('gwCard');
    const titleEl = document.getElementById('gwTitle');
    const countEl = document.getElementById('gwCount');
    const subEl = document.getElementById('gwSub');
    const winnerEl = document.getElementById('gwWinner');
    const platEl = document.getElementById('gwPlat');
    let spinTimer = null;

    function renderGiveaway(gw) {
      if (!gw || !gw.visible) {
        card.classList.add('hidden');
        return;
      }
      card.classList.remove('hidden');
      titleEl.textContent = '🎁 ' + (gw.title || 'Giveaway');
      const list = Array.isArray(gw.participants) ? gw.participants : [];
      countEl.textContent = list.length + ' Teilnehmer';
      subEl.textContent = gw.active
        ? 'Teilnahme offen: Schreibe ' + (gw.keyword || '!join') + ' in den Chat!'
        : (gw.winner ? '🎉 Gewinner gezogen!' : 'Teilnahme geschlossen');

      const gwSlot = document.querySelector('.gw-slot');
      clearInterval(spinTimer);
      if (gwSlot) {
        gwSlot.classList.toggle('is-spinning', Boolean(gw.spinning && list.length > 0));
        gwSlot.classList.toggle('has-winner', Boolean(!gw.spinning && gw.winner));
      }
      if (gw.spinning && list.length > 0) {
        platEl.textContent = 'Ziehung läuft...';
        spinTimer = setInterval(() => {
          const pick = list[Math.floor(Math.random() * list.length)];
          winnerEl.textContent = pick.name;
        }, 70);
      } else if (gw.winner) {
        winnerEl.textContent = '🏆 ' + gw.winner.name;
        platEl.textContent = gw.winner.platform || '';
      } else {
        winnerEl.textContent = list.length ? 'Bereit zur Ziehung...' : 'Warte auf Teilnehmer...';
        platEl.textContent = '';
      }
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'giveaway') renderGiveaway(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_SOUNDBOARD_HTML = `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8" /><title>OmniGrid Soundboard</title></head>
<body style="background:transparent;">
  <script>
    function playSoundPayload(s) {
      if (!s) return;
      const vol = Math.max(0, Math.min(1, Number(s.volume ?? 0.8)));
      if (s.url) {
        const a = new Audio(s.url);
        a.volume = vol;
        a.play().catch(() => {});
      } else if (s.builtin) {
        try {
          const actx = new (window.AudioContext || window.webkitAudioContext)();
          const g = actx.createGain();
          g.gain.value = vol * 0.35;
          g.connect(actx.destination);
          const o = actx.createOscillator();
          o.type = s.builtin === 'airhorn' ? 'sawtooth' : s.builtin === 'alarm' ? 'square' : 'sine';
          o.frequency.setValueAtTime(s.builtin === 'airhorn' ? 440 : s.builtin === 'ding' ? 880 : s.builtin === 'rimshot' ? 220 : 660, actx.currentTime);
          o.connect(g);
          o.start();
          o.stop(actx.currentTime + (s.builtin === 'airhorn' ? 0.55 : 0.25));
        } catch (e) {}
      }
    }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'soundboard') playSoundPayload(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    connectWs();
  </script>
</body>
</html>`;

const OBS_GAME_STATS_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — Game Stats Overlay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .gs-card { position: relative; width: 390px; background: rgba(10, 15, 28, 0.90); border: 1.5px solid var(--accent, #38bdf8); border-radius: 14px; padding: 12px 14px; box-shadow: 0 0 24px rgba(56,189,248,0.18), 0 12px 28px rgba(0,0,0,0.5); transition: all 0.3s ease; }
    .gs-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .gs-title { font-size: 14px; font-weight: 800; letter-spacing: 0.02em; color: #f8fafc; display: flex; align-items: center; gap: 6px; }
    .gs-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 999px; background: rgba(56,189,248,0.16); color: var(--accent, #38bdf8); }
    .gs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
    .gs-cell { background: rgba(30, 41, 59, 0.78); border: 1px solid rgba(148,163,184,0.18); border-radius: 9px; padding: 7px 8px; text-align: center; }
    .gs-lbl { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
    .gs-val { font-size: 16px; font-weight: 800; color: #f8fafc; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* League of Legends Hextech Theme */
    .gs-card.theme-lol {
      width: 410px;
      background: linear-gradient(155deg, rgba(9, 20, 40, 0.96) 0%, rgba(1, 10, 19, 0.97) 100%);
      border: 2px solid #c8aa6e;
      border-radius: 4px;
      padding: 13px 15px;
      box-shadow: inset 0 0 0 1px rgba(200, 170, 110, 0.32), 0 0 26px rgba(10, 200, 185, 0.20), 0 12px 32px rgba(0,0,0,0.65);
    }
    .gs-card.theme-lol::before,
    .gs-card.theme-lol::after {
      content: "";
      position: absolute;
      width: 10px;
      height: 10px;
      border: 2px solid #0ac8b9;
      pointer-events: none;
    }
    .gs-card.theme-lol::before { top: -3px; left: -3px; border-right: none; border-bottom: none; }
    .gs-card.theme-lol::after { bottom: -3px; right: -3px; border-left: none; border-top: none; }
    .gs-card.theme-lol .gs-head {
      border-bottom: 1px solid rgba(200, 170, 110, 0.42);
      padding-bottom: 8px;
      margin-bottom: 10px;
    }
    .gs-card.theme-lol .gs-title {
      color: #f0e6d2;
      font-family: Georgia, "Times New Roman", serif;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-size: 13.5px;
    }
    .gs-card.theme-lol .gs-badge {
      background: rgba(10, 200, 185, 0.14);
      border: 1px solid rgba(10, 200, 185, 0.55);
      color: #0ac8b9;
      border-radius: 3px;
      letter-spacing: 0.06em;
    }
    .gs-card.theme-lol .gs-grid { grid-template-columns: 1.55fr 1fr 0.85fr 0.75fr; gap: 6px; }
    .gs-card.theme-lol .gs-cell {
      background: linear-gradient(180deg, rgba(16, 32, 58, 0.88) 0%, rgba(7, 16, 32, 0.92) 100%);
      border: 1px solid rgba(200, 170, 110, 0.35);
      border-radius: 3px;
      padding: 5px 6px;
    }
    .gs-card.theme-lol .gs-lbl { color: #c8aa6e; font-size: 9px; font-weight: 700; letter-spacing: 0.06em; }
    .gs-card.theme-lol .gs-val { color: #f0e6d2; font-size: 14px; }
    .gs-card.theme-lol .gs-cell.is-highlight .gs-val { color: #0ac8b9; text-shadow: 0 0 10px rgba(10,200,185,0.4); }
    .gs-matches-wrap { display: none; margin-top: 9px; padding-top: 8px; border-top: 1px solid rgba(200, 170, 110, 0.3); }
    .gs-card.theme-lol .gs-matches-wrap { display: block; }
    @keyframes tronScan { 0% { transform: translateY(-100%); opacity: 0; } 30% { opacity: 0.45; } 100% { transform: translateY(380%); opacity: 0; } }
    .gs-card.theme-tron {
      width: 420px;
      background:
        linear-gradient(rgba(0, 240, 255, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.06) 1px, transparent 1px),
        radial-gradient(circle at 15% 0%, rgba(0, 240, 255, 0.16), transparent 55%),
        linear-gradient(160deg, rgba(2, 9, 20, 0.96) 0%, rgba(4, 15, 29, 0.97) 100%);
      background-size: 20px 20px, 20px 20px, 100% 100%, 100% 100%;
      border: 1.5px solid #00f0ff;
      border-radius: 2px;
      clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
      box-shadow: 0 0 28px rgba(0, 240, 255, 0.28), inset 0 0 18px rgba(0, 240, 255, 0.12);
      overflow: hidden;
    }
    .gs-card.theme-tron::before {
      content: "";
      position: absolute;
      inset: 0;
      height: 28%;
      background: linear-gradient(180deg, transparent, rgba(0, 240, 255, 0.14), transparent);
      animation: tronScan 4.5s linear infinite;
      pointer-events: none;
    }
    .gs-card.theme-tron .gs-head { border-bottom: 1px solid rgba(0, 240, 255, 0.35); padding-bottom: 7px; }
    .gs-card.theme-tron .gs-title { color: #e0fbff; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; text-transform: uppercase; letter-spacing: 0.1em; font-size: 13px; text-shadow: 0 0 10px rgba(0, 240, 255, 0.65); }
    .gs-card.theme-tron .gs-badge { background: rgba(255, 106, 0, 0.16); border: 1px solid #ff6a00; color: #ff9a44; border-radius: 2px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 0.08em; text-shadow: 0 0 8px rgba(255, 106, 0, 0.6); }
    .gs-card.theme-tron .gs-grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
    .gs-card.theme-tron .gs-cell { background: rgba(2, 22, 38, 0.85); border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 2px; text-align: left; padding: 6px 9px; }
    .gs-card.theme-tron .gs-lbl { color: #00f0ff; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 9px; letter-spacing: 0.12em; }
    .gs-card.theme-tron .gs-val { color: #f0fdff; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13.5px; text-shadow: 0 0 8px rgba(0, 240, 255, 0.45); }
    .gs-card.theme-tron .gs-jc-agenda { display: flex; border-top-color: rgba(0, 240, 255, 0.3); }
    .gs-card.theme-tron .gs-jc-topic { color: #00f0ff; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; letter-spacing: 0.04em; text-shadow: 0 0 8px rgba(0, 240, 255, 0.4); }
    .gs-card.theme-tron .gs-jc-step { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; border-radius: 2px; background: rgba(0, 240, 255, 0.05); border-left: 2px solid rgba(0, 240, 255, 0.25); color: #7dd3fc; }
    .gs-card.theme-tron .gs-jc-step.active { background: rgba(0, 240, 255, 0.18); border-left: 3px solid #ff6a00; color: #ffffff; text-shadow: 0 0 8px rgba(0, 240, 255, 0.65); }
    .gs-card.theme-tron .gs-jc-step.done { opacity: 0.48; text-decoration: line-through; }
    .gs-card.theme-val {
      width: 410px;
      background: linear-gradient(155deg, rgba(15, 25, 35, 0.96) 0%, rgba(10, 16, 24, 0.97) 100%);
      border: 1.5px solid #ff4655;
      border-radius: 2px;
      clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
      box-shadow: 0 0 26px rgba(255, 70, 85, 0.25), 0 12px 28px rgba(0, 0, 0, 0.6);
    }
    .gs-card.theme-val .gs-head { border-bottom: 1px solid rgba(255, 70, 85, 0.4); padding-bottom: 7px; }
    .gs-card.theme-val .gs-title { color: #ece8e1; text-transform: uppercase; letter-spacing: 0.08em; font-size: 13.5px; }
    .gs-card.theme-val .gs-badge { background: rgba(255, 70, 85, 0.18); border: 1px solid #ff4655; color: #ff6b78; border-radius: 2px; letter-spacing: 0.08em; }
    .gs-card.theme-val .gs-grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
    .gs-card.theme-val .gs-cell { background: rgba(24, 36, 48, 0.88); border: 1px solid rgba(236, 232, 225, 0.16); border-left: 3px solid #ff4655; border-radius: 2px; text-align: left; padding: 6px 9px; }
    .gs-card.theme-val .gs-lbl { color: #ff6b78; font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em; }
    .gs-card.theme-val .gs-val { color: #ece8e1; font-size: 14.5px; }
    .gs-matches-lbl { font-size: 9.5px; color: #c8aa6e; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
    .gs-matches-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
    .gs-match-slot { position: relative; height: 46px; border-radius: 4px; background: rgba(7, 16, 32, 0.82); border: 1px solid rgba(148, 163, 184, 0.25); display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .gs-match-slot.win { border-color: #0ac8b9; box-shadow: 0 0 10px rgba(10, 200, 185, 0.28); }
    .gs-match-slot.loss { border-color: #ef4444; box-shadow: 0 0 8px rgba(239, 68, 68, 0.22); }
    .gs-match-slot img { width: 100%; height: 100%; object-fit: cover; opacity: 0.92; }
    .gs-match-badge { position: absolute; bottom: 2px; right: 2px; font-size: 9px; font-weight: 900; padding: 1px 4px; border-radius: 3px; line-height: 1.1; }
    .gs-match-slot.win .gs-match-badge { background: #0ac8b9; color: #010a13; }
    .gs-match-slot.loss .gs-match-badge { background: #ef4444; color: #ffffff; }
    .gs-match-empty { font-size: 11px; color: rgba(200,170,110,0.35); }
    .gs-splash { position: absolute; inset: 0; background-size: cover; background-position: center 20%; opacity: 0.45; pointer-events: none; z-index: 0; border-radius: inherit; filter: saturate(1.2); }
    .gs-splash::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(9,20,40,0.45) 0%, rgba(1,10,19,0.88) 100%); }
    .gs-content { position: relative; z-index: 1; }
    .gs-lol-hero { display: none; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
    .gs-card.theme-lol .gs-lol-hero.visible { display: flex; }
    .gs-lol-left { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
    .gs-champ-icon { width: 56px; height: 56px; border-radius: 4px; border: 2px solid #c8aa6e; box-shadow: 0 0 14px rgba(10,200,185,0.42); object-fit: cover; object-position: center 15%; background: #091428; flex-shrink: 0; }
    .gs-champ-meta { min-width: 0; flex: 1; }
    .gs-champ-name { font-size: 16px; font-weight: 800; color: #f0e6d2; font-family: Georgia, "Times New Roman", serif; text-shadow: 0 2px 6px rgba(0,0,0,0.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .gs-skin-name { font-size: 11px; color: #0ac8b9; font-weight: 700; margin-top: 2px; text-shadow: 0 1px 4px rgba(0,0,0,0.9); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .gs-elo-sub { font-size: 10px; color: #c8aa6e; font-weight: 700; margin-top: 2px; letter-spacing: 0.03em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .gs-rank-box {
      flex-shrink: 0;
      min-width: 148px;
      padding: 6px 9px;
      border-radius: 4px;
      background: linear-gradient(160deg, rgba(14, 30, 56, 0.94) 0%, rgba(5, 13, 26, 0.97) 100%);
      border: 1.5px solid var(--tier-color, #c8aa6e);
      box-shadow: inset 0 0 10px rgba(0,0,0,0.55), 0 0 14px rgba(10,200,185,0.18);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .gs-rank-emblem { width: 36px; height: 36px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 6px var(--tier-color, #38bdf8)); }
    .gs-rank-emblem svg { width: 36px; height: 36px; display: block; }
    .gs-rank-info { display: flex; flex-direction: column; align-items: flex-end; justify-content: center; text-align: right; flex: 1; min-width: 0; }
    .gs-rank-tier { font-family: Georgia, "Times New Roman", serif; font-size: 12px; font-weight: 900; color: #f0e6d2; letter-spacing: 0.04em; text-transform: uppercase; white-space: nowrap; }
    .gs-rank-lp { font-size: 13px; font-weight: 900; color: var(--tier-color, #0ac8b9); margin-top: 1px; line-height: 1.1; text-shadow: 0 1px 6px rgba(0,0,0,0.85); }
    .gs-lp-track { width: 100%; height: 4px; border-radius: 999px; background: rgba(148, 163, 184, 0.22); margin-top: 4px; overflow: hidden; }
    .gs-lp-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #c8aa6e, var(--tier-color, #0ac8b9)); transition: width 0.35s ease; }

    /* Just Chatting / Talk-Show Agenda Theme */
    .gs-card.theme-jc {
      width: 410px;
      background: linear-gradient(145deg, rgba(17, 24, 39, 0.94) 0%, rgba(30, 18, 46, 0.95) 100%);
      border: 1.5px solid rgba(236, 72, 153, 0.5);
      border-radius: 14px;
      padding: 14px 16px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.55), 0 0 24px rgba(236, 72, 153, 0.16);
    }
    .gs-jc-agenda { display: none; margin-top: 10px; padding-top: 9px; border-top: 1px solid rgba(236,72,153,0.25); flex-direction: column; gap: 5px; }
    .gs-card.theme-jc .gs-jc-agenda { display: flex; }
    .gs-jc-topic { font-size: 13px; font-weight: 800; color: #fdf2f8; margin-bottom: 3px; line-height: 1.3; }
    .gs-jc-step { display: flex; align-items: center; gap: 8px; font-size: 11.5px; padding: 4px 8px; border-radius: 7px; color: #cbd5e1; background: rgba(15, 23, 42, 0.5); }
    .gs-jc-step.done { opacity: 0.55; text-decoration: line-through; }
    .gs-jc-step.active { background: rgba(236, 72, 153, 0.22); border: 1px solid rgba(236, 72, 153, 0.55); color: #fff; font-weight: 700; }
  </style>
</head>
<body>
  <div class="gs-card" id="gsCard">
    <div class="gs-splash" id="gsSplash"></div>
    <div class="gs-content">
      <div class="gs-head">
        <div class="gs-title" id="gsTitle">🎮 Game Stats</div>
        <div class="gs-badge" id="gsBadge">OmniGrid</div>
      </div>
      <div class="gs-lol-hero" id="gsLolHero">
        <div class="gs-lol-left">
          <img class="gs-champ-icon" id="gsChampIcon" alt="" />
          <div class="gs-champ-meta">
            <div class="gs-champ-name" id="gsChampName"></div>
            <div class="gs-skin-name" id="gsSkinName"></div>
            <div class="gs-elo-sub" id="gsEloSub"></div>
          </div>
        </div>
        <div class="gs-rank-box" id="gsRankBox">
          <div class="gs-rank-emblem" id="gsRankEmblem"></div>
          <div class="gs-rank-info">
            <span class="gs-rank-tier" id="gsRankTier">DIAMOND IV</span>
            <div class="gs-rank-lp" id="gsRankLp">50 LP</div>
            <div class="gs-lp-track"><div class="gs-lp-fill" id="gsLpFill" style="width: 50%;"></div></div>
          </div>
        </div>
      </div>
      <div class="gs-grid" id="gsGrid"></div>
      <div class="gs-jc-agenda" id="gsJcAgenda"></div>
      <div class="gs-matches-wrap" id="gsMatchesWrap">
        <div class="gs-matches-lbl" id="gsMatchesLbl">Letzte 6 Matches</div>
        <div class="gs-matches-row" id="gsMatchesRow"></div>
      </div>
    </div>
  </div>
  <script>
    const card = document.getElementById('gsCard');
    const splashEl = document.getElementById('gsSplash');
    const titleEl = document.getElementById('gsTitle');
    const badgeEl = document.getElementById('gsBadge');
    const lolHeroEl = document.getElementById('gsLolHero');
    const champIconEl = document.getElementById('gsChampIcon');
    const champNameEl = document.getElementById('gsChampName');
    const skinNameEl = document.getElementById('gsSkinName');
    const eloSubEl = document.getElementById('gsEloSub');
    const rankBoxEl = document.getElementById('gsRankBox');
    const rankEmblemEl = document.getElementById('gsRankEmblem');
    const rankTierEl = document.getElementById('gsRankTier');
    const rankLpEl = document.getElementById('gsRankLp');
    const lpFillEl = document.getElementById('gsLpFill');
    const gridEl = document.getElementById('gsGrid');
    const jcAgendaEl = document.getElementById('gsJcAgenda');
    const matchesLblEl = document.getElementById('gsMatchesLbl');
    const matchesRowEl = document.getElementById('gsMatchesRow');

    function resolveTierMeta(rankStr) {
      const r = String(rankStr || '').toLowerCase();
      if (r.includes('challenger')) return { color: '#facc15', accent: '#38bdf8', crown: true, tag: 'C' };
      if (r.includes('grandmaster') || r.includes('großmeister')) return { color: '#f43f5e', accent: '#fbbf24', crown: true, tag: 'GM' };
      if (r.includes('master') || r.includes('meister')) return { color: '#c084fc', accent: '#f0abfc', crown: true, tag: 'M' };
      if (r.includes('diamond') || r.includes('diamant')) return { color: '#38bdf8', accent: '#bae6fd', crown: false, tag: 'D' };
      if (r.includes('emerald') || r.includes('smaragd')) return { color: '#10b981', accent: '#6ee7b7', crown: false, tag: 'E' };
      if (r.includes('platin')) return { color: '#2dd4bf', accent: '#99f6e4', crown: false, tag: 'P' };
      if (r.includes('gold')) return { color: '#f59e0b', accent: '#fde68a', crown: false, tag: 'G' };
      if (r.includes('silver') || r.includes('silber')) return { color: '#cbd5e1', accent: '#f1f5f9', crown: false, tag: 'S' };
      if (r.includes('bronze')) return { color: '#d97706', accent: '#fcd34d', crown: false, tag: 'B' };
      if (r.includes('iron') || r.includes('eisen')) return { color: '#94a3b8', accent: '#cbd5e1', crown: false, tag: 'I' };
      return { color: '#c8aa6e', accent: '#0ac8b9', crown: false, tag: 'U' };
    }

    function buildRankEmblemSvg(rankStr) {
      const m = resolveTierMeta(rankStr);
      const crownPath = m.crown
        ? '<path d="M11 8L15 3L20 7L25 3L29 8L27 11H13L11 8Z" fill="' + m.accent + '" stroke="#091428" stroke-width="1"/>'
        : '<path d="M20 4L24 9H16L20 4Z" fill="' + m.accent + '"/>';
      return '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">'
        + '<path d="M4 13L11 10L10 21L5 18L4 13Z" fill="' + m.color + '" opacity="0.72"/>'
        + '<path d="M36 13L29 10L30 21L35 18L36 13Z" fill="' + m.color + '" opacity="0.72"/>'
        + crownPath
        + '<path d="M20 8L31 13V24.5L20 36L9 24.5V13L20 8Z" fill="#091428" stroke="' + m.color + '" stroke-width="2.4"/>'
        + '<path d="M20 12.5L27 16V23.2L20 31L13 23.2V16L20 12.5Z" fill="' + m.color + '" fill-opacity="0.28" stroke="' + m.accent + '" stroke-width="1.3"/>'
        + '<text x="20" y="24.5" text-anchor="middle" font-family="Georgia,serif" font-size="10.5" font-weight="900" fill="#f8fafc">' + m.tag + '</text>'
        + '</svg>';
    }

    function fallbackChampIcon(champName) {
      const raw = String(champName || '').trim();
      if (!raw || raw === '—') return '';
      const alias = { wukong: 'MonkeyKing', 'nunu & willump': 'Nunu', 'renata glasc': 'Renata' };
      const id = alias[raw.toLowerCase()] || raw.replace(/[^a-zA-Z0-9]/g, '');
      return id ? 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/' + id + '.png' : '';
    }

    const forceLolMode = new URLSearchParams(location.search).get('addon') === 'lol';

    function renderStats(data) {
      if (!data) return;
      card.style.display = data.overlayEnabled === false ? 'none' : '';
      if (data.overlayEnabled === false) return;
      const isLol = forceLolMode || data.addonId === 'lol';
      const isJc = !isLol && data.addonId === 'justchatting';
      const isTron = !isLol && data.addonId === 'techtalk';
      const isVal = !isLol && data.addonId === 'valorant';
      card.classList.toggle('theme-lol', isLol);
      card.classList.toggle('theme-jc', isJc);
      card.classList.toggle('theme-tron', isTron);
      card.classList.toggle('theme-val', isVal);
      card.style.setProperty('--accent', data.accent || '#38bdf8');
      const cleanTitle = isLol
        ? 'League of Legends'
        : String(data.addonName || 'Game Stats').replace(/\s*\([^)]*\)/g, '').replace(/—.*/, '').trim();
      titleEl.textContent = (isLol ? '⚔️' : (data.icon || '🎮')) + ' ' + cleanTitle;
      if (isLol) {
        badgeEl.textContent = data.riotId || (data.lolRole ? data.lolRole.toUpperCase() : 'RANKED');
      } else if (isJc) {
        badgeEl.textContent = data.jcMood || 'LIVE TALK';
      } else if (isTron) {
        badgeEl.textContent = data.tronPhase || 'LIVE CODING';
      } else if (isVal) {
        badgeEl.textContent = (data.valAgent || 'AGENT') + ' • ' + (data.valRank || 'RANKED') + ' (' + Number(data.valRr || 0) + ' RR)';
      } else {
        badgeEl.textContent = data.currentGameName || (data.selectedMode === 'auto' ? 'Auto' : data.addonId);
      }

      const fallbackIcon = fallbackChampIcon(data.champion);
      const iconUrl = data.skinIconUrl || data.championIconUrl || fallbackIcon;
      if (isLol) {
        lolHeroEl.classList.add('visible');
        if (iconUrl) {
          champIconEl.style.display = 'block';
          champIconEl.onerror = () => {
            const nextFallback = data.championIconUrl || fallbackIcon;
            if (nextFallback && champIconEl.src !== nextFallback) {
              champIconEl.src = nextFallback;
            }
          };
          champIconEl.src = iconUrl;
        } else {
          champIconEl.style.display = 'none';
        }
        champNameEl.textContent = (data.champion || 'Champion') + (data.lolRole ? ' • ' + data.lolRole : '');
        skinNameEl.textContent = data.skinName ? '✨ ' + data.skinName : 'Classic';
        const extras = [];
        if (data.keystone) extras.push('⚡ ' + data.keystone);
        if (data.currentGold > 0) extras.push('🪙 ' + data.currentGold + 'g');
        eloSubEl.textContent = extras.join('  •  ');
        splashEl.style.backgroundImage = data.skinSplashUrl ? 'url("' + data.skinSplashUrl + '")' : 'none';

        const rankText = String(data.lolRank || 'Unranked').trim();
        const lpVal = Number(data.lolLp || 0);
        const tierCol = resolveTierMeta(rankText).color;
        if (rankBoxEl) {
          rankBoxEl.style.setProperty('--tier-color', tierCol);
          rankBoxEl.style.color = tierCol;
        }
        if (rankEmblemEl) rankEmblemEl.innerHTML = buildRankEmblemSvg(rankText);
        if (rankTierEl) rankTierEl.textContent = rankText;
        if (rankLpEl) rankLpEl.textContent = lpVal + ' LP';
        if (lpFillEl) lpFillEl.style.width = Math.max(4, Math.min(100, lpVal % 100 === 0 && lpVal > 0 ? 100 : lpVal % 100)) + '%';
      } else {
        lolHeroEl.classList.remove('visible');
        splashEl.style.backgroundImage = 'none';
      }

      gridEl.innerHTML = '';
      (data.stats || []).forEach((s) => {
        const cell = document.createElement('div');
        const highlight = isLol && (s.key === 'champion' || s.key === 'kd');
        cell.className = 'gs-cell' + (highlight ? ' is-highlight' : '');
        cell.innerHTML = '<div class="gs-lbl"></div><div class="gs-val"></div>';
        cell.querySelector('.gs-lbl').textContent = s.label;
        cell.querySelector('.gs-val').textContent = String(s.value);
        gridEl.appendChild(cell);
      });

      if ((isJc || isTron) && jcAgendaEl) {
        jcAgendaEl.innerHTML = '';
        const topicDiv = document.createElement('div');
        topicDiv.className = 'gs-jc-topic';
        topicDiv.textContent = isTron
          ? '💠 ' + (data.tronTopic || 'Tech Talk') + (data.tronStack ? ' // ' + data.tronStack : '')
          : '🎙️ ' + (data.jcTopic || 'Chill Talk');
        jcAgendaEl.appendChild(topicDiv);
        const steps = Array.isArray(isTron ? data.tronAgendaItems : data.jcAgendaItems)
          ? (isTron ? data.tronAgendaItems : data.jcAgendaItems)
          : [];
        const cur = Number((isTron ? data.tronActiveAgendaIdx : data.jcActiveAgendaIdx) || 0);
        steps.forEach((st, idx) => {
          const row = document.createElement('div');
          row.className = 'gs-jc-step' + (idx < cur ? ' done' : idx === cur ? ' active' : '');
          const icon = idx < cur ? '✓' : idx === cur ? '▶' : String(idx + 1).padStart(2, '0');
          row.textContent = icon + ' ' + st;
          jcAgendaEl.appendChild(row);
        });
      }

      if (isLol && matchesRowEl) {
        const list = Array.isArray(data.recentMatches) ? data.recentMatches.slice(0, 6) : [];
        const w = Number(data.lolWins || 0);
        const l = Number(data.lolLosses || 0);
        if (matchesLblEl) {
          matchesLblEl.textContent = w + l > 0 ? 'Session: ' + w + 'W - ' + l + 'L • Letzte 6 Matches' : 'Letzte 6 Matches';
        }
        matchesRowEl.innerHTML = '';
        for (let i = 0; i < 6; i++) {
          const m = list[i];
          const slot = document.createElement('div');
          if (m) {
            slot.className = 'gs-match-slot ' + (m.win ? 'win' : 'loss');
            const rawUrl = m.championIconUrl || fallbackChampIcon(m.champion);
            const safeUrl = String(rawUrl || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const img = safeUrl ? '<img src="' + safeUrl + '" alt="" />' : '';
            slot.innerHTML = img + '<span class="gs-match-badge">' + (m.win ? 'W' : 'L') + '</span>';
          } else {
            slot.className = 'gs-match-slot';
            slot.innerHTML = '<span class="gs-match-empty">—</span>';
          }
          matchesRowEl.appendChild(slot);
        }
      }
    }

    function fetchLatest() {
      fetch('/api/game-stats')
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (d && d.addonId) renderStats(d); })
        .catch(() => {});
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'game-stats') renderStats(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest();
    connectWs();
    setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_LOL_BG_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — LoL Client Animated Background</title>
  <style>
    :root {
      --c1: #c8aa6e;
      --c2: #0ac8b9;
      --c3: #38bdf8;
      --bg-a: #061022;
      --bg-b: #020814;
      --txt: #f0e6d2;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100vw; height: 100vh; overflow: hidden; background: var(--bg-b); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--txt); }
    .bg-root {
      position: fixed;
      inset: 0;
      background:
        radial-gradient(circle at 18% 22%, rgba(255,255,255,0.03), transparent 45%),
        linear-gradient(145deg, var(--bg-a) 0%, var(--bg-b) 100%);
      transition: background 0.8s ease;
    }
    @keyframes kenBurns {
      0% { transform: scale(1.04) translate3d(0%, 0%, 0); }
      50% { transform: scale(1.12) translate3d(-1.6%, -1.0%, 0); }
      100% { transform: scale(1.04) translate3d(0%, 0%, 0); }
    }
    @keyframes fxGlitchSplash {
      0%, 91%, 100% { transform: scale(1.07) translate3d(0, 0, 0); filter: blur(1.5px) saturate(1.25) brightness(0.72); }
      93% { transform: scale(1.08) translate3d(4px, -2px, 0); filter: blur(0.5px) saturate(1.8) hue-rotate(16deg) brightness(0.86); }
      95% { transform: scale(1.07) translate3d(-4px, 2px, 0); filter: blur(1px) saturate(1.6) hue-rotate(-14deg) brightness(0.8); }
    }
    @keyframes fxCosmicSpin {
      0% { transform: scale(1.10) rotate(-1.4deg); }
      50% { transform: scale(1.16) rotate(1.4deg); }
      100% { transform: scale(1.10) rotate(-1.4deg); }
    }
    @keyframes fxBreatheZoom {
      0%, 100% { transform: scale(1.04); filter: blur(1.5px) saturate(1.18) brightness(0.68); }
      50% { transform: scale(1.11); filter: blur(1px) saturate(1.32) brightness(0.78); }
    }
    @keyframes fxPanDrift {
      0% { transform: scale(1.08) translate3d(-2.2%, 0.6%, 0); }
      50% { transform: scale(1.11) translate3d(2.2%, -0.8%, 0); }
      100% { transform: scale(1.08) translate3d(-2.2%, 0.6%, 0); }
    }
    @keyframes fxElementalHue {
      0%, 100% { transform: scale(1.06); filter: blur(1.5px) saturate(1.28) hue-rotate(0deg) brightness(0.74); }
      50% { transform: scale(1.12); filter: blur(1px) saturate(1.42) hue-rotate(24deg) brightness(0.82); }
    }
    @keyframes fxCyberScan {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    .bg-splash {
      position: fixed;
      inset: -4%;
      background-size: cover;
      background-position: center 22%;
      opacity: 0;
      filter: blur(1.5px) saturate(1.18) brightness(0.70);
      animation: kenBurns 28s ease-in-out infinite;
      transition: opacity 0.9s ease, background-image 0.6s ease;
      pointer-events: none;
    }
    .bg-splash.visible { opacity: 0.46; }
    body.fx-jinx-glitch .bg-splash,
    body.fx-soul-fighter .bg-splash { animation: fxGlitchSplash 4.8s infinite; }
    body.fx-dark-cosmic .bg-splash,
    body.fx-prestige-cosmic .bg-splash { animation: fxCosmicSpin 26s ease-in-out infinite; }
    body.fx-elementalist .bg-splash,
    body.fx-kda-all-out .bg-splash { animation: fxElementalHue 14s ease-in-out infinite; }
    body.fx-high-noon .bg-splash,
    body.fx-god-king .bg-splash,
    body.fx-nightbringer .bg-splash,
    body.fx-risen-legend .bg-splash,
    body.fx-kda-firestarter .bg-splash,
    body.fx-dj-sona .bg-splash,
    body.fx-arcane-fractured .bg-splash,
    body.fx-eve-firestarter .bg-splash,
    body.fx-ahri-firestarter .bg-splash { animation: fxBreatheZoom 12s ease-in-out infinite; }
    body.fx-inkshadow .bg-splash,
    body.fx-black-rose .bg-splash,
    body.fx-ravenborn .bg-splash,
    body.fx-spirit-blossom .bg-splash,
    body.fx-blossom-springs .bg-splash,
    body.fx-radiant-cloud .bg-splash,
    body.fx-ruined-mist .bg-splash,
    body.fx-revenant-reign .bg-splash,
    body.fx-final-boss .bg-splash,
    body.fx-creator-viktor .bg-splash,
    body.fx-zaun-lab .bg-splash,
    body.fx-crime-city .bg-splash,
    body.fx-prestige-rose .bg-splash,
    body.fx-unbound-thresh .bg-splash { animation: fxPanDrift 24s ease-in-out infinite; }
    @keyframes slotFramePulse {
      0%, 100% { box-shadow: 0 0 28px rgba(0, 0, 0, 0.72), inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 18px var(--c1); border-color: var(--c1); }
      50% { box-shadow: 0 0 34px rgba(0, 0, 0, 0.78), inset 0 0 14px rgba(255, 255, 255, 0.06), 0 0 28px var(--c2); border-color: var(--c2); }
    }
    .bg-scanline {
      position: fixed;
      left: 0;
      right: 0;
      height: 120px;
      background: linear-gradient(180deg, transparent, var(--c2), transparent);
      opacity: 0;
      pointer-events: none;
    }
    body.fx-project-cyber .bg-scanline,
    body.fx-jinx-glitch .bg-scanline,
    body.fx-kda-firestarter .bg-scanline { opacity: 0.14; animation: fxCyberScan 5.5s linear infinite; }
    .bg-vignette {
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse at center, rgba(2, 6, 16, 0.25) 0%, rgba(2, 6, 16, 0.82) 100%),
        linear-gradient(180deg, rgba(2, 6, 16, 0.45) 0%, transparent 25%, transparent 75%, rgba(2, 6, 16, 0.72) 100%);
      pointer-events: none;
    }
    @keyframes orbFloatA {
      0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
      50% { transform: translate3d(6vw, 4vh, 0) scale(1.14); }
    }
    @keyframes orbFloatB {
      0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
      50% { transform: translate3d(-6vw, -5vh, 0) scale(1.18); }
    }
    .bg-orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(110px);
      opacity: 0.28;
      pointer-events: none;
      transition: background 0.8s ease;
    }
    .bg-orb-1 { width: 46vw; height: 46vw; top: -16vw; left: -12vw; background: var(--c1); animation: orbFloatA 16s ease-in-out infinite; }
    .bg-orb-2 { width: 42vw; height: 42vw; bottom: -16vw; right: -10vw; background: var(--c2); animation: orbFloatB 19s ease-in-out infinite; }
    .bg-grid {
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 64px 64px;
      opacity: 0.55;
      pointer-events: none;
    }
    #bgParticles { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    .bg-frame {
      position: fixed;
      inset: 14px;
      border: 1.5px solid var(--c1);
      opacity: 0.36;
      pointer-events: none;
      transition: border-color 0.6s ease;
    }
    .bg-corner { position: fixed; width: 34px; height: 34px; pointer-events: none; transition: border-color 0.6s ease; }
    .bg-c-tl { top: 12px; left: 12px; border-top: 3px solid var(--c2); border-left: 3px solid var(--c2); }
    .bg-c-tr { top: 12px; right: 12px; border-top: 3px solid var(--c1); border-right: 3px solid var(--c1); }
    .bg-c-bl { bottom: 12px; left: 12px; border-bottom: 3px solid var(--c1); border-left: 3px solid var(--c1); }
    .bg-c-br { bottom: 12px; right: 12px; border-bottom: 3px solid var(--c2); border-right: 3px solid var(--c2); }
    .bg-watermark {
      position: fixed;
      bottom: 18px;
      left: 36px;
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 6px 14px;
      border-radius: 4px;
      background: rgba(5, 10, 22, 0.82);
      border: 1px solid var(--c1);
      border-left: 4px solid var(--c2);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--txt);
      text-shadow: 0 0 10px var(--c1);
      backdrop-filter: blur(8px);
      transition: all 0.5s ease;
      z-index: 4;
    }
    .bg-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c2); box-shadow: 0 0 10px var(--c2); }

    .frame-layout {
      position: fixed;
      inset: 28px 36px 155px 36px;
      display: grid;
      grid-template-columns: 1fr 440px;
      gap: 26px;
      z-index: 3;
      pointer-events: none;
    }
    body.layout-clean .frame-layout { display: none; }
    .frame-left {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-width: 0;
    }
    .frame-right {
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-height: 0;
    }
    .slot-box {
      position: relative;
      border: 2.5px solid var(--c1);
      background: rgba(3, 8, 18, 0.58);
      box-shadow: 0 0 32px rgba(0, 0, 0, 0.72), inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 22px var(--c1);
      border-radius: 6px;
      overflow: hidden;
      transition: border-color 0.5s ease, box-shadow 0.5s ease;
      animation: slotFramePulse 4.8s ease-in-out infinite;
    }
    .slot-box::before,
    .slot-box::after {
      content: "";
      position: absolute;
      width: 24px;
      height: 24px;
      border: 3px solid var(--c2);
      pointer-events: none;
      z-index: 3;
      transition: border-color 0.5s ease;
    }
    .slot-box::before { top: 0; left: 0; border-right: none; border-bottom: none; }
    .slot-box::after { bottom: 0; right: 0; border-left: none; border-top: none; }
    .client-slot {
      width: 100%;
      aspect-ratio: 16 / 9;
      max-height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .cam-slot {
      width: 100%;
      height: 248px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .chat-slot {
      width: 100%;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .slot-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      background: linear-gradient(90deg, rgba(4, 10, 22, 0.90), rgba(4, 10, 22, 0.55));
      border-bottom: 1px solid var(--c1);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--txt);
      text-shadow: 0 0 8px var(--c1);
    }
    .slot-pill {
      font-size: 9.5px;
      padding: 2px 8px;
      border-radius: 3px;
      border: 1px solid var(--c2);
      color: var(--c2);
      background: rgba(0, 0, 0, 0.45);
    }
    .slot-placeholder {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      opacity: 0.28;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--txt);
      text-align: center;
    }
    .slot-placeholder small { font-size: 10px; letter-spacing: 0.1em; color: var(--c2); }
    .bg-status-right {
      position: fixed;
      bottom: 18px;
      right: 36px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--c2);
      background: rgba(5, 10, 22, 0.78);
      border: 1px solid var(--c2);
      padding: 6px 14px;
      border-radius: 4px;
      z-index: 4;
    }
  </style>
</head>
<body>
  <div class="bg-root"></div>
  <div class="bg-splash" id="bgSplash"></div>
  <div class="bg-orb bg-orb-1"></div>
  <div class="bg-orb bg-orb-2"></div>
  <div class="bg-grid"></div>
  <div class="bg-scanline"></div>
  <canvas id="bgParticles"></canvas>
  <div class="bg-vignette"></div>
  <div class="bg-frame"></div>
  <div class="bg-corner bg-c-tl"></div>
  <div class="bg-corner bg-c-tr"></div>
  <div class="bg-corner bg-c-bl"></div>
  <div class="bg-corner bg-c-br"></div>

  <div class="frame-layout">
    <div class="frame-left">
      <div class="slot-box client-slot"></div>
    </div>
    <div class="frame-right">
      <div class="slot-box cam-slot"></div>
      <div class="slot-box chat-slot"></div>
    </div>
  </div>
  <script>
    (function initLolAnimatedBg() {
      const root = document.documentElement;
      const splashEl = document.getElementById('bgSplash');
      const canvas = document.getElementById('bgParticles');
      const ctx = canvas.getContext('2d');

      let palette = ['#c8aa6e', '#0ac8b9', '#38bdf8'];
      let packSplashUrl = '';
      let activeMode = 'motes';
      let ddVerPromise = null;
      const skinCache = {};

      const MODE_BY_EFFECT = {
        'jinx-glitch': 'sparks',
        'soul-fighter': 'sparks',
        'kda-firestarter': 'embers',
        'high-noon': 'embers',
        'nightbringer': 'embers',
        'god-king': 'embers',
        'risen-legend': 'streaks',
        'kda-all-out': 'stars',
        'dark-cosmic': 'orbit',
        'prestige-cosmic': 'orbit',
        'black-rose': 'petals',
        'spirit-blossom': 'petals',
        'blossom-springs': 'bubbles',
        'ravenborn': 'feathers',
        'inkshadow': 'ink',
        'elementalist': 'orbs',
        'radiant-cloud': 'orbs',
        'arcane-prestige': 'diamonds',
        'project-cyber': 'cyber',
        'ruined-mist': 'mist',
        'revenant-reign': 'mist',
        'final-boss': 'cyber',
        'creator-viktor': 'sparks',
        'zaun-lab': 'bubbles',
        'crime-city': 'cards',
        'prestige-rose': 'petals',
        'dj-sona': 'eq',
        'arcane-fractured': 'shards',
        'eve-firestarter': 'embers',
        'ahri-firestarter': 'shards',
        'unbound-thresh': 'mist'
      };

      function resize() {
        canvas.width = window.innerWidth || 1920;
        canvas.height = window.innerHeight || 1080;
      }
      resize();
      window.addEventListener('resize', resize);

      const particles = Array.from({ length: 64 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1.6 + Math.random() * 3.8,
        speed: 0.4 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.6,
        phase: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI * 2,
        orbitR: 120 + Math.random() * (Math.max(canvas.width, canvas.height) * 0.48),
        ci: Math.floor(Math.random() * 3),
        alpha: 0.28 + Math.random() * 0.65
      }));

      function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width;
        const h = canvas.height;
        const cx = w * 0.5;
        const cy = h * 0.5;

        for (const p of particles) {
          const col = palette[p.ci % palette.length];
          p.phase += 0.02;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 14;
          ctx.shadowColor = col;
          ctx.fillStyle = col;
          ctx.strokeStyle = col;

          if (activeMode === 'orbit') {
            p.angle += 0.0018 * p.speed;
            const ox = cx + Math.cos(p.angle) * p.orbitR;
            const oy = cy + Math.sin(p.angle) * (p.orbitR * 0.58);
            ctx.beginPath();
            ctx.arc(ox, oy, p.r, 0, Math.PI * 2);
            ctx.fill();
          } else if (activeMode === 'petals' || activeMode === 'feathers') {
            p.y += p.speed * 0.85;
            p.x += Math.sin(p.phase) * 0.9 + 0.35;
            if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
            if (p.x > w + 20) p.x = -20;
            ctx.translate(p.x, p.y);
            ctx.rotate(Math.sin(p.phase) * 0.8);
            ctx.beginPath();
            ctx.ellipse(0, 0, p.r * (activeMode === 'feathers' ? 2.6 : 1.7), p.r * 0.75, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (activeMode === 'sparks' || activeMode === 'streaks') {
            p.y -= p.speed * 2.2;
            p.x += (activeMode === 'sparks' ? p.vx * 3.2 : p.speed * 0.8);
            if (p.y < -30 || p.x < -30 || p.x > w + 30) { p.y = h + 20; p.x = Math.random() * w; }
            ctx.lineWidth = Math.max(1.5, p.r * 0.55);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - (activeMode === 'sparks' ? p.vx * 14 : 10), p.y + 18);
            ctx.stroke();
          } else if (activeMode === 'cyber') {
            p.y += p.speed * 2.6;
            if (p.y > h + 40) { p.y = -40; p.x = Math.floor(Math.random() * (w / 32)) * 32; }
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y - 24 * p.speed);
            ctx.stroke();
          } else if (activeMode === 'shards') {
            p.y -= p.speed * 0.85;
            p.x += Math.sin(p.phase * 1.4) * 0.9;
            if (p.y < -40) { p.y = h + 40; p.x = Math.random() * w; }
            const shCols = ['#ff2e97', '#00f0ff', '#ffe14d'];
            const sCol = shCols[p.ci % 3];
            const sz = 8 + p.r * 3.4;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.phase * 0.9 + p.ci);
            ctx.fillStyle = 'rgba(14, 6, 24, 0.72)';
            ctx.strokeStyle = sCol;
            ctx.shadowColor = sCol;
            ctx.shadowBlur = 16;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(0, -sz);
            ctx.lineTo(sz * 0.72, sz * 0.25);
            ctx.lineTo(-sz * 0.55, sz * 0.85);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          } else if (activeMode === 'eq') {
            const idx = particles.indexOf(p);
            const bars = 40;
            if (idx < bars) {
              const barW = w / bars;
              const amp = 18 + Math.abs(Math.sin(p.phase * 2.2 + idx * 0.45)) * 105 + Math.abs(Math.cos(p.phase * 1.3 + idx * 0.8)) * 42;
              const bx = idx * barW + 4;
              const eqCols = ['#00e5ff', '#ff2a6d', '#c084fc'];
              const eqCol = eqCols[idx % 3];
              ctx.globalAlpha = 0.65;
              ctx.fillStyle = eqCol;
              ctx.shadowColor = eqCol;
              ctx.shadowBlur = 16;
              ctx.fillRect(bx, h - amp, Math.max(4, barW - 8), amp);
            } else {
              p.y -= p.speed * 1.1;
              if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.r * 1.6, 0, Math.PI * 2);
              ctx.stroke();
            }
          } else if (activeMode === 'cards') {
            p.y -= p.speed * 0.72;
            p.x += Math.sin(p.phase) * 0.75;
            if (p.y < -60) { p.y = h + 60; p.x = Math.random() * w; }
            const tfCols = ['#facc15', '#ef4444', '#38bdf8'];
            const suits = ['♠', '♥', '♦', '♣'];
            const cardCol = tfCols[p.ci % 3];
            const cw = 20 + p.r * 3.8;
            const ch = cw * 1.42;
            ctx.translate(p.x, p.y);
            ctx.rotate(Math.sin(p.phase) * 0.45);
            ctx.fillStyle = 'rgba(10, 6, 16, 0.88)';
            ctx.strokeStyle = cardCol;
            ctx.shadowColor = cardCol;
            ctx.shadowBlur = 16;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 4);
            ctx.fill();
            ctx.stroke();
            ctx.shadowBlur = 6;
            ctx.fillStyle = cardCol;
            ctx.font = 'bold ' + Math.round(cw * 0.56) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(suits[Math.floor(p.phase * 0.5 + p.ci) % 4], 0, 1);
          } else if (activeMode === 'stars' || activeMode === 'diamonds') {
            p.y -= p.speed * 0.4;
            if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
            const tw = 0.45 + 0.55 * Math.abs(Math.sin(p.phase * 1.4));
            ctx.globalAlpha = p.alpha * tw;
            ctx.translate(p.x, p.y);
            ctx.rotate(Math.PI / 4);
            const sz = p.r * 1.6;
            ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
          } else if (activeMode === 'bubbles') {
            p.y -= p.speed * 0.65;
            p.x += Math.sin(p.phase) * 0.5;
            if (p.y < -25) { p.y = h + 25; p.x = Math.random() * w; }
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 1.8, 0, Math.PI * 2);
            ctx.stroke();
          } else if (activeMode === 'ink' || activeMode === 'mist' || activeMode === 'orbs') {
            p.x += activeMode === 'ink' ? p.speed * 1.1 : Math.sin(p.phase) * 0.55;
            p.y += activeMode === 'mist' ? -p.speed * 0.25 : -p.speed * 0.55;
            if (p.y < -40 || p.x > w + 40) { p.y = activeMode === 'mist' ? h - Math.random() * 260 : h + 30; p.x = activeMode === 'ink' ? -30 : Math.random() * w; }
            ctx.globalAlpha = p.alpha * (activeMode === 'mist' ? 0.25 : 0.45);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * (activeMode === 'mist' ? 5.5 : 3.2), 0, Math.PI * 2);
            ctx.fill();
          } else {
            p.y -= p.speed * (activeMode === 'embers' ? 1.45 : 0.65);
            p.x += p.vx + Math.sin(p.phase) * (activeMode === 'embers' ? 0.75 : 0.35);
            if (p.y < -15) { p.y = h + 15; p.x = Math.random() * w; }
            if (p.x < -15) p.x = w + 15;
            if (p.x > w + 15) p.x = -15;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);

      function updateSplash() {
        if (packSplashUrl) {
          splashEl.style.backgroundImage = 'url("' + packSplashUrl + '")';
          splashEl.classList.add('visible');
        } else {
          splashEl.style.backgroundImage = 'none';
          splashEl.classList.remove('visible');
        }
      }

      function getDdVer() {
        if (!ddVerPromise) {
          ddVerPromise = fetch('https://ddragon.leagueoflegends.com/api/versions.json')
            .then((r) => (r.ok ? r.json() : null))
            .then((a) => (Array.isArray(a) && a[0] ? a[0] : '15.22.1'))
            .catch(() => '15.22.1');
        }
        return ddVerPromise;
      }

      async function resolveSkinSplash(art) {
        if (!art) return '';
        if (art.localAsset && /^[a-z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(String(art.localAsset))) {
          return '/api/theme-asset/' + encodeURIComponent(String(art.localAsset));
        }
        if (!art.championId) return '';
        const cid = String(art.championId).replace(/[^A-Za-z0-9]/g, '');
        if (!cid) return '';
        const q = String(art.skinQuery || '').trim().toLowerCase();
        const key = cid + ':' + q;
        if (skinCache[key]) return skinCache[key];
        let num = 0;
        if (q && q !== 'default') {
          try {
            const ver = await getDdVer();
            const r = await fetch('https://ddragon.leagueoflegends.com/cdn/' + ver + '/data/en_US/champion/' + cid + '.json');
            if (r.ok) {
              const j = await r.json();
              const skins = j && j.data && j.data[cid] && Array.isArray(j.data[cid].skins) ? j.data[cid].skins : [];
              const words = q.split(/\s+/).filter(Boolean);
              const hit = skins.find((s) => String(s.name || '').toLowerCase().includes(q))
                || skins.find((s) => words.every((w) => String(s.name || '').toLowerCase().includes(w)))
                || skins.find((s) => words.some((w) => w.length > 3 && String(s.name || '').toLowerCase().includes(w)));
              if (hit && Number.isFinite(Number(hit.num))) num = Number(hit.num);
            }
          } catch (e) {}
        }
        const url = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + cid + '_' + num + '.jpg';
        skinCache[key] = url;
        return url;
      }

      const isCleanLayout = new URLSearchParams(location.search).get('layout') === 'clean';
      function clearFxClasses() {
        document.body.className = isCleanLayout ? 'layout-clean' : '';
      }

      function applyPack(pack) {
        clearFxClasses();
        if (!pack || !pack.id) {
          palette = ['#c8aa6e', '#0ac8b9', '#38bdf8'];
          activeMode = 'motes';
          root.style.setProperty('--c1', '#c8aa6e');
          root.style.setProperty('--c2', '#0ac8b9');
          root.style.setProperty('--c3', '#38bdf8');
          root.style.setProperty('--bg-a', '#061022');
          root.style.setProperty('--bg-b', '#020814');
          root.style.setProperty('--txt', '#f0e6d2');
          packSplashUrl = '';
          updateSplash();
          return;
        }
        const eff = String(pack.effect || 'none');
        if (eff && eff !== 'none') document.body.classList.add('fx-' + eff);
        activeMode = MODE_BY_EFFECT[eff] || 'motes';
        const c = pack.colors || {};
        const c1 = c.primary || '#ff2a85';
        const c2 = c.secondary || '#39ff14';
        const c3 = c.tertiary || '#00f5d4';
        palette = [c1, c2, c3];
        root.style.setProperty('--c1', c1);
        root.style.setProperty('--c2', c2);
        root.style.setProperty('--c3', c3);
        root.style.setProperty('--bg-a', c.bgStart || '#12061a');
        root.style.setProperty('--bg-b', c.bgEnd || '#061216');
        root.style.setProperty('--txt', c.text || '#f8fafc');
        if (pack.skinArt && pack.skinArt.championId) {
          resolveSkinSplash(pack.skinArt).then((u) => { packSplashUrl = u; updateSplash(); }).catch(() => {});
        } else {
          packSplashUrl = '';
          updateSplash();
        }
      }

      function fetchTheme() {
        fetch('/api/champion-theme', { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => applyPack(d && d.pack ? d.pack : null))
          .catch(() => {});
      }

      function connectWs() {
        try {
          const ws = new WebSocket('ws://' + location.host);
          ws.onmessage = (ev) => {
            try {
              const p = JSON.parse(ev.data);
              if (p.type === 'champion-theme') applyPack(p.data);
            } catch (e) {}
          };
          ws.onclose = () => setTimeout(connectWs, 2500);
        } catch (e) {}
      }

      fetchTheme();
      connectWs();
      setInterval(fetchTheme, 4000);
    })();
  </script>
</body>
</html>`;

const OBS_SCENE_TRANSITION_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — Scene Transition</title>
  <style>
    :root { --t1: #c8aa6e; --t2: #0ac8b9; --t3: #38bdf8; --tbg-a: #061022; --tbg-b: #020814; --ttxt: #f8fafc; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100vw; height: 100vh; overflow: hidden; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .st-stage { position: fixed; inset: 0; pointer-events: none; opacity: 0; }
    .st-stage.playing { opacity: 1; }
    .st-curtain {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 62vw;
      background:
        radial-gradient(circle at 50% 45%, var(--t1), transparent 62%),
        linear-gradient(135deg, var(--tbg-a) 0%, var(--tbg-b) 100%);
      border: 3px solid var(--t1);
      box-shadow: 0 0 60px var(--t1), inset 0 0 40px var(--t2);
    }
    .st-left { left: -66vw; border-left: none; clip-path: polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%); }
    .st-right { right: -66vw; border-right: none; clip-path: polygon(12% 0, 100% 0, 100% 100%, 12% 100%, 0 50%); }
    @keyframes stLeftSweep {
      0% { transform: translateX(0); }
      38% { transform: translateX(64vw); }
      58% { transform: translateX(64vw); }
      100% { transform: translateX(0); }
    }
    @keyframes stRightSweep {
      0% { transform: translateX(0); }
      38% { transform: translateX(-64vw); }
      58% { transform: translateX(-64vw); }
      100% { transform: translateX(0); }
    }
    @keyframes stEmblemPop {
      0%, 22% { opacity: 0; transform: translate(-50%, -50%) scale(0.45) rotate(-14deg); }
      40% { opacity: 1; transform: translate(-50%, -50%) scale(1.08) rotate(2deg); }
      58% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
      82%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(1.25) rotate(8deg); }
    }
    @keyframes stRingBlast {
      0%, 34% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
      44% { opacity: 0.95; }
      78%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(2.8); }
    }
    .st-stage.playing .st-left { animation: stLeftSweep 1.75s cubic-bezier(0.76, 0, 0.24, 1) forwards; }
    .st-stage.playing .st-right { animation: stRightSweep 1.75s cubic-bezier(0.76, 0, 0.24, 1) forwards; }
    .st-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 340px;
      height: 340px;
      border-radius: 50%;
      border: 4px solid var(--t1);
      box-shadow: 0 0 42px var(--t1), inset 0 0 32px var(--t2);
      opacity: 0;
    }
    .st-stage.playing .st-ring { animation: stRingBlast 1.75s ease-out forwards; }
    .st-emblem {
      position: absolute;
      top: 50%;
      left: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      opacity: 0;
    }
    .st-stage.playing .st-emblem { animation: stEmblemPop 1.75s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
    .st-flask {
      width: 144px;
      height: 144px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--t2) 0%, var(--tbg-b) 72%);
      border: 3px solid var(--t1);
      box-shadow: 0 0 45px var(--t1), inset 0 0 24px var(--t2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 64px;
    }
    .st-title {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--ttxt);
      text-shadow: 0 0 18px var(--t1), 0 0 8px var(--t2);
      white-space: nowrap;
    }
    #stBubbles { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 4; pointer-events: none; }
    .st-emblem { z-index: 5; }
    .st-ring { z-index: 3; }
  </style>
</head>
<body>
  <div class="st-stage" id="stStage">
    <div class="st-curtain st-left"></div>
    <div class="st-curtain st-right"></div>
    <canvas id="stBubbles"></canvas>
    <div class="st-ring"></div>
    <div class="st-emblem">
      <div class="st-flask" id="stIcon">⚡</div>
    </div>
  </div>
  <video id="stCustomVideo" playsinline style="position:fixed;inset:0;width:100%;height:100%;object-fit:cover;display:none;z-index:20;pointer-events:none;"></video>
  <img id="stCustomImg" alt="" style="position:fixed;inset:0;width:100%;height:100%;object-fit:cover;display:none;z-index:20;pointer-events:none;" />
  <iframe id="stCustomFrame" style="position:fixed;inset:0;width:100%;height:100%;border:0;display:none;z-index:20;pointer-events:none;background:transparent;"></iframe>
  <script>
    (function initSceneTransition() {
      const root = document.documentElement;
      const stage = document.getElementById('stStage');
      const iconEl = document.getElementById('stIcon');
      const customVideo = document.getElementById('stCustomVideo');
      const customImg = document.getElementById('stCustomImg');
      const customFrame = document.getElementById('stCustomFrame');
      const canvas = document.getElementById('stBubbles');
      const ctx = canvas.getContext('2d');
      let palette = ['#c8aa6e', '#0ac8b9'];
      let activeEffect = '';
      let animId = 0;
      let timer = null;
      let bubbles = [];
      let thrownCards = [];
      let lotusItems = [];

      function resize() {
        canvas.width = window.innerWidth || 1920;
        canvas.height = window.innerHeight || 1080;
      }
      resize();
      window.addEventListener('resize', resize);

      function applyTheme(pack) {
        if (!pack || !pack.id) {
          activeEffect = '';
          palette = ['#c8aa6e', '#0ac8b9'];
          root.style.setProperty('--t1', '#c8aa6e');
          root.style.setProperty('--t2', '#0ac8b9');
          root.style.setProperty('--t3', '#38bdf8');
          root.style.setProperty('--tbg-a', '#061022');
          root.style.setProperty('--tbg-b', '#020814');
          root.style.setProperty('--ttxt', '#f8fafc');
          iconEl.textContent = '⚡';
          return;
        }
        const c = pack.colors || {};
        activeEffect = String(pack.effect || '');
        const c1 = c.primary || '#76ff03';
        const c2 = c.secondary || '#00e5ff';
        palette = [c1, c2];
        root.style.setProperty('--t1', c1);
        root.style.setProperty('--t2', c2);
        root.style.setProperty('--t3', c.tertiary || c2);
        root.style.setProperty('--tbg-a', c.bgStart || '#071012');
        root.style.setProperty('--tbg-b', c.bgEnd || '#050b10');
        root.style.setProperty('--ttxt', c.text || '#f8fafc');
        iconEl.textContent = pack.icon || '⚡';
      }

      function spawnBubbles() {
        bubbles = Array.from({ length: 70 }, () => ({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * 240,
          r: 4 + Math.random() * 14,
          vy: 4 + Math.random() * 9,
          vx: (Math.random() - 0.5) * 2.2,
          col: Math.random() > 0.45 ? palette[0] : palette[1],
          alpha: 0.35 + Math.random() * 0.55
        }));
      }

      function spawnThrownCards() {
        const tfCols = ['#facc15', '#ef4444', '#38bdf8', '#e11d48', '#a855f7'];
        const suits = ['♠', '♥', '♦', '♣'];
        thrownCards = Array.from({ length: 42 }, (_, i) => {
          const fromLeft = i % 2 === 0;
          const speed = 26 + Math.random() * 24;
          const spreadAngle = (Math.random() - 0.5) * 0.72;
          return {
            x: fromLeft ? -160 - Math.random() * 520 : canvas.width + 160 + Math.random() * 520,
            y: canvas.height * (0.15 + Math.random() * 0.72),
            vx: (fromLeft ? 1 : -1) * Math.cos(spreadAngle) * speed,
            vy: Math.sin(spreadAngle) * speed * 0.75 - 2.5,
            rot: Math.random() * Math.PI * 2,
            vrot: (fromLeft ? 1 : -1) * (0.14 + Math.random() * 0.18),
            w: 66 + Math.random() * 44,
            col: tfCols[i % tfCols.length],
            suit: suits[i % 4],
            alpha: 0.82 + Math.random() * 0.18
          };
        });
      }

      function drawThrownCards() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const c of thrownCards) {
          c.x += c.vx;
          c.y += c.vy;
          c.rot += c.vrot;
          const h = c.w * 1.44;
          ctx.save();
          ctx.globalAlpha = c.alpha;
          ctx.translate(c.x, c.y);
          ctx.rotate(c.rot);
          ctx.shadowBlur = 28;
          ctx.shadowColor = c.col;
          ctx.fillStyle = 'rgba(11, 6, 16, 0.94)';
          ctx.strokeStyle = c.col;
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.roundRect(-c.w / 2, -h / 2, c.w, h, 8);
          ctx.fill();
          ctx.stroke();
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = 'rgba(255,255,255,0.28)';
          ctx.strokeRect(-c.w / 2 + 6, -h / 2 + 6, c.w - 12, h - 12);
          ctx.fillStyle = c.col;
          ctx.font = '900 ' + Math.round(c.w * 0.52) + 'px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(c.suit, 0, 2);
          ctx.restore();
        }
        animId = requestAnimationFrame(drawThrownCards);
      }

      let lotusStart = 0;
      let djStart = 0;
      let fracturedStart = 0;
      let fracturedShards = [];
      let eveStart = 0;
      let eveEmbers = [];
      let akaliStart = 0;
      let akaliSparks = [];
      let akaliStars = [];
      let akaliTrail = [];
      const akaliSkateImg = new Image();
      akaliSkateImg.src = '/api/theme-asset/akali-ignition-art.png';

      function spawnAkaliSkate() {
        akaliStart = performance.now();
        akaliTrail = [];
        const cols = ['#ff2e97', '#ff1e56', '#ff7a00', '#fde047', '#f472b6'];
        akaliSparks = Array.from({ length: 84 }, (_, i) => ({
          x: canvas.width * 0.5,
          y: canvas.height * 0.72,
          vx: (Math.random() - 0.5) * 24,
          vy: -(3 + Math.random() * 14),
          r: 2 + Math.random() * 5.5,
          col: cols[i % cols.length],
          life: 0,
          maxLife: 280 + Math.random() * 440
        }));
        akaliStars = Array.from({ length: 34 }, (_, i) => {
          const angle = (i / 34) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
          return {
            angle,
            speed: 14 + Math.random() * 26,
            radius: 16 + Math.random() * 90,
            size: 16 + Math.random() * 42,
            rot: Math.random() * Math.PI,
            vrot: (Math.random() - 0.5) * 0.08,
            col: i % 3 === 0 ? '#fde047' : (i % 3 === 1 ? '#ff2e97' : '#ff5a1f'),
            delay: 520 + Math.random() * 380
          };
        });
      }

      function drawFourPointStar(ctx, x, y, r, rot, col, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur = 24;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const rad = i % 2 === 0 ? r : r * 0.22;
          const a = (i * Math.PI) / 4;
          if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
          else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      function drawAkaliSkate(now) {
        const elapsed = Math.max(0, (now || performance.now()) - akaliStart);
        const w = canvas.width;
        const h = canvas.height;
        const cx = w * 0.5;
        const vpY = h * 0.54;
        ctx.clearRect(0, 0, w, h);

        const prog = Math.min(1, elapsed / 1780);
        const env = elapsed < 140
          ? elapsed / 140
          : elapsed > 1420 ? Math.max(0, 1 - (elapsed - 1420) / 400) : 1;
        if (env <= 0.01) {
          animId = requestAnimationFrame(drawAkaliSkate);
          return;
        }

        const bgGrad = ctx.createRadialGradient(cx, vpY, 30, cx, vpY, w * 0.72);
        bgGrad.addColorStop(0, 'rgba(255, 30, 86, ' + (0.28 * env).toFixed(3) + ')');
        bgGrad.addColorStop(0.45, 'rgba(28, 6, 20, ' + (0.72 * env).toFixed(3) + ')');
        bgGrad.addColorStop(1, 'rgba(6, 2, 10, ' + (0.88 * env).toFixed(3) + ')');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        for (let a = 0; a < 7; a++) {
          const z = ((elapsed * 0.0014 + a / 7) % 1);
          const archR = 90 + Math.pow(z, 2.2) * (w * 0.85);
          const archAlpha = Math.sin(z * Math.PI) * 0.85 * env;
          ctx.save();
          ctx.globalAlpha = archAlpha;
          ctx.strokeStyle = a % 2 === 0 ? '#ff1e56' : '#ff2e97';
          ctx.shadowColor = '#ff1e56';
          ctx.shadowBlur = 28;
          ctx.lineWidth = 3 + z * 8;
          ctx.beginPath();
          ctx.arc(cx, vpY + 60, archR, Math.PI * 1.04, Math.PI * 1.96);
          ctx.stroke();
          ctx.restore();
        }

        for (let l = 0; l < 14; l++) {
          const lAngle = (l / 14) * Math.PI * 2 + 0.12;
          const lPhase = ((elapsed * 0.0032 + l * 0.17) % 1);
          const r1 = 80 + lPhase * (w * 0.45);
          const r2 = r1 + 140 + lPhase * 220;
          ctx.save();
          ctx.globalAlpha = (1 - lPhase) * 0.75 * env;
          ctx.strokeStyle = l % 2 === 0 ? '#ff2a55' : '#ff7a00';
          ctx.shadowColor = '#ff2a55';
          ctx.shadowBlur = 18;
          ctx.lineWidth = 2 + lPhase * 4;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(lAngle) * r1, vpY + Math.sin(lAngle) * r1 * 0.65);
          ctx.lineTo(cx + Math.cos(lAngle) * r2, vpY + Math.sin(lAngle) * r2 * 0.65);
          ctx.stroke();
          ctx.restore();
        }

        const carveX = cx + Math.sin(prog * Math.PI * 1.45 - 0.5) * (w * 0.24) + (prog - 0.5) * (w * 0.18);
        const zoomP = Math.sin(Math.min(1, prog * 1.15) * Math.PI);
        const depthScale = 0.52 + zoomP * 0.72;
        const danceBounce = Math.abs(Math.sin(elapsed * 0.017)) * 22 * depthScale;
        const skateY = h * 0.76 - danceBounce + (zoomP - 0.5) * 40;
        const carveTilt = Math.cos(prog * Math.PI * 1.45 - 0.5) * 0.22 + Math.sin(elapsed * 0.015) * 0.08;

        akaliTrail.push({ x: carveX, y: skateY + 34 * depthScale });
        if (akaliTrail.length > 26) akaliTrail.shift();
        for (let i = 1; i < akaliTrail.length; i++) {
          const r = i / akaliTrail.length;
          ctx.save();
          ctx.globalAlpha = r * 0.88 * env;
          ctx.strokeStyle = i % 2 === 0 ? '#ff2e97' : '#d946ef';
          ctx.shadowColor = '#ff2e97';
          ctx.shadowBlur = 30;
          ctx.lineWidth = (8 + r * 28) * depthScale;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(akaliTrail[i - 1].x, akaliTrail[i - 1].y);
          ctx.lineTo(akaliTrail[i].x, akaliTrail[i].y);
          ctx.stroke();
          ctx.restore();
        }

        const floorGlow = ctx.createRadialGradient(carveX, skateY + 38 * depthScale, 10, carveX, skateY + 38 * depthScale, 260 * depthScale);
        floorGlow.addColorStop(0, 'rgba(255, 46, 151, ' + (0.78 * env).toFixed(3) + ')');
        floorGlow.addColorStop(0.5, 'rgba(255, 122, 0, ' + (0.35 * env).toFixed(3) + ')');
        floorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = floorGlow;
        ctx.beginPath();
        ctx.ellipse(carveX, skateY + 42 * depthScale, 260 * depthScale, 52 * depthScale, 0, 0, Math.PI * 2);
        ctx.fill();

        for (const sp of akaliSparks) {
          if (sp.life <= 0 && Math.random() < 0.34) {
            sp.x = carveX + (Math.random() - 0.5) * 110 * depthScale;
            sp.y = skateY + 36 * depthScale;
            sp.vx = (Math.random() - 0.5) * 26 - carveTilt * 36;
            sp.vy = -(4 + Math.random() * 14);
            sp.life = sp.maxLife;
          }
          if (sp.life > 0) {
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.vy += 0.38;
            sp.life -= 16;
            ctx.save();
            ctx.globalAlpha = Math.max(0, sp.life / sp.maxLife) * env;
            ctx.fillStyle = sp.col;
            ctx.shadowColor = sp.col;
            ctx.shadowBlur = 16;
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        ctx.save();
        ctx.globalAlpha = env;
        ctx.translate(carveX, skateY);
        ctx.scale(depthScale, depthScale);
        ctx.rotate(carveTilt);

        const deckW = 270;
        const deckH = 26;
        ctx.save();
        ctx.shadowColor = '#ff2e97';
        ctx.shadowBlur = 32;
        ctx.fillStyle = '#0c0714';
        ctx.strokeStyle = '#ff1e56';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(-deckW / 2, 14, deckW, deckH, 13);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#ff2e97';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-deckW * 0.35, 27);
        ctx.lineTo(deckW * 0.35, 27);
        ctx.stroke();

        const wSpin = elapsed * 0.032;
        for (const wx of [-82, 82]) {
          ctx.save();
          ctx.translate(wx, 50);
          ctx.rotate(wSpin);
          ctx.fillStyle = '#120518';
          ctx.strokeStyle = '#ff2e97';
          ctx.shadowColor = '#ff2e97';
          ctx.shadowBlur = 22;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(-12, 0);
          ctx.lineTo(12, 0);
          ctx.moveTo(0, -12);
          ctx.lineTo(0, 12);
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();

        const danceSway = Math.sin(elapsed * 0.022) * 14;
        ctx.save();
        ctx.translate(danceSway, 16);
        ctx.scale(1, 1 + Math.sin(elapsed * 0.032) * 0.05);
        ctx.shadowColor = '#ff2e97';
        ctx.shadowBlur = 36;
        if (akaliSkateImg.complete && akaliSkateImg.naturalWidth > 0) {
          const drawH = 440;
          const drawW = drawH * (akaliSkateImg.naturalWidth / akaliSkateImg.naturalHeight);
          ctx.drawImage(akaliSkateImg, -drawW / 2, -drawH + 20, drawW, drawH);
        }
        ctx.restore();
        ctx.restore();

        for (const st of akaliStars) {
          if (elapsed < st.delay) continue;
          st.radius += st.speed;
          st.rot += st.vrot;
          const sx = cx + Math.cos(st.angle) * st.radius;
          const sy = vpY + Math.sin(st.angle) * st.radius * 0.72;
          const sFade = Math.max(0, 1 - Math.max(0, elapsed - 1340) / 440) * env;
          if (sFade > 0.02) drawFourPointStar(ctx, sx, sy, st.size, st.rot, st.col, sFade);
        }

        if (elapsed > 720 && elapsed < 1180) {
          const flash = Math.sin(((elapsed - 720) / 460) * Math.PI) * 0.42;
          const fGrad = ctx.createRadialGradient(cx, vpY, 20, cx, vpY, w * 0.68);
          fGrad.addColorStop(0, 'rgba(255, 46, 151, ' + flash.toFixed(3) + ')');
          fGrad.addColorStop(0.5, 'rgba(255, 30, 86, ' + (flash * 0.65).toFixed(3) + ')');
          fGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = fGrad;
          ctx.fillRect(0, 0, w, h);
        }

        animId = requestAnimationFrame(drawAkaliSkate);
      }

      function spawnEveCoffin() {
        eveStart = performance.now();
        const cols = ['#ff1e6b', '#ff7a00', '#a855f7', '#fde047'];
        eveEmbers = Array.from({ length: 64 }, (_, i) => ({
          x: canvas.width * 0.5 + (Math.random() - 0.5) * 420,
          y: canvas.height * 0.5 + (Math.random() - 0.5) * 320,
          vx: (Math.random() - 0.5) * 4.5,
          vy: -(4 + Math.random() * 11),
          r: 2.5 + Math.random() * 6.5,
          col: cols[i % cols.length],
          alpha: 0.75 + Math.random() * 0.25
        }));
      }

      function drawCoffinShape(ctx, cx, cy, w, h) {
        ctx.beginPath();
        ctx.moveTo(cx - w * 0.28, cy - h * 0.5);
        ctx.lineTo(cx + w * 0.28, cy - h * 0.5);
        ctx.lineTo(cx + w * 0.5, cy - h * 0.18);
        ctx.lineTo(cx + w * 0.34, cy + h * 0.5);
        ctx.lineTo(cx - w * 0.34, cy + h * 0.5);
        ctx.lineTo(cx - w * 0.5, cy - h * 0.18);
        ctx.closePath();
      }

      function drawEveCoffin(now) {
        const elapsed = Math.max(0, (now || performance.now()) - eveStart);
        const w = canvas.width;
        const h = canvas.height;
        const cx = w * 0.5;
        const cy = h * 0.52;
        ctx.clearRect(0, 0, w, h);

        const env = elapsed < 200
          ? elapsed / 200
          : elapsed > 1340 ? Math.max(0, 1 - (elapsed - 1340) / 480) : 1;
        if (env <= 0.01) {
          animId = requestAnimationFrame(drawEveCoffin);
          return;
        }

        const openProg = Math.max(0, Math.min(1, (elapsed - 260) / 480));
        const riseProg = Math.max(0, Math.min(1, (elapsed - 460) / 620));
        const cw = Math.min(w * 0.28, 440);
        const ch = Math.min(h * 0.74, 760);

        if (openProg > 0.02) {
          const glowGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, ch * 0.85);
          glowGrad.addColorStop(0, 'rgba(255, 30, 107, ' + (0.68 * openProg * env).toFixed(3) + ')');
          glowGrad.addColorStop(0.45, 'rgba(255, 122, 0, ' + (0.42 * openProg * env).toFixed(3) + ')');
          glowGrad.addColorStop(0.75, 'rgba(168, 85, 247, ' + (0.24 * openProg * env).toFixed(3) + ')');
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glowGrad;
          ctx.fillRect(0, 0, w, h);
        }

        ctx.save();
        ctx.globalAlpha = env;
        drawCoffinShape(ctx, cx, cy, cw, ch);
        const innerGrad = ctx.createLinearGradient(cx, cy - ch * 0.5, cx, cy + ch * 0.5);
        innerGrad.addColorStop(0, openProg > 0.1 ? 'rgba(255, 30, 107, 0.78)' : 'rgba(18, 5, 16, 0.96)');
        innerGrad.addColorStop(0.5, openProg > 0.1 ? 'rgba(255, 122, 0, 0.58)' : 'rgba(10, 4, 14, 0.98)');
        innerGrad.addColorStop(1, 'rgba(12, 3, 14, 0.98)');
        ctx.fillStyle = innerGrad;
        ctx.fill();
        ctx.strokeStyle = '#ff1e6b';
        ctx.shadowColor = '#ff1e6b';
        ctx.shadowBlur = 28;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();

        if (riseProg > 0.02) {
          const liftY = (1 - riseProg) * 180;
          const sc = 0.78 + riseProg * 0.28;
          ctx.save();
          ctx.globalAlpha = Math.min(1, riseProg * 1.4) * env;
          ctx.translate(cx, cy - 20 + liftY);
          ctx.scale(sc, sc);

          for (const side of [-1, 1]) {
            ctx.save();
            ctx.strokeStyle = '#ff1e6b';
            ctx.shadowColor = '#ff1e6b';
            ctx.shadowBlur = 26;
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(side * 22, 70);
            ctx.bezierCurveTo(side * (120 + riseProg * 120), 20, side * (160 + riseProg * 150), -130, side * (230 + riseProg * 110), -210 - Math.sin(elapsed * 0.01) * 18);
            ctx.stroke();
            ctx.fillStyle = '#ff7a00';
            ctx.beginPath();
            const tipX = side * (230 + riseProg * 110);
            const tipY = -210 - Math.sin(elapsed * 0.01) * 18;
            ctx.moveTo(tipX, tipY);
            ctx.lineTo(tipX - side * 26, tipY + 10);
            ctx.lineTo(tipX - side * 10, tipY + 30);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }

          ctx.fillStyle = 'rgba(12, 3, 14, 0.94)';
          ctx.strokeStyle = '#ff7a00';
          ctx.shadowColor = '#ff1e6b';
          ctx.shadowBlur = 24;
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.arc(0, -135, 36, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-48, -86);
          ctx.quadraticCurveTo(0, -104, 48, -86);
          ctx.lineTo(64, 130);
          ctx.lineTo(-64, 130);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#fde047';
          ctx.shadowColor = '#ff7a00';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.ellipse(-13, -136, 8, 3.2, 0.18, 0, Math.PI * 2);
          ctx.ellipse(13, -136, 8, 3.2, -0.18, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        const lidSlideX = openProg * (cw * 0.92);
        const lidSlideY = -openProg * 42;
        const lidRot = openProg * 0.18;
        ctx.save();
        ctx.globalAlpha = env * Math.max(0.12, 1 - openProg * 0.85);
        ctx.translate(cx + lidSlideX, cy + lidSlideY);
        ctx.rotate(lidRot);
        drawCoffinShape(ctx, 0, 0, cw, ch);
        ctx.fillStyle = 'rgba(14, 5, 18, 0.94)';
        ctx.fill();
        ctx.strokeStyle = '#a855f7';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 24;
        ctx.lineWidth = 3.5;
        ctx.stroke();
        ctx.restore();

        for (const e of eveEmbers) {
          if (elapsed > 240) {
            e.x += e.vx;
            e.y += e.vy;
          }
          ctx.save();
          ctx.globalAlpha = e.alpha * env;
          ctx.fillStyle = e.col;
          ctx.shadowColor = e.col;
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        animId = requestAnimationFrame(drawEveCoffin);
      }

      function spawnFracturedShatter() {
        fracturedStart = performance.now();
        const cols = ['#ff2e97', '#00f0ff', '#ffe14d', '#f8fafc'];
        fracturedShards = Array.from({ length: 58 }, (_, i) => {
          const angle = (i / 58) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
          const speed = 16 + Math.random() * 26;
          return {
            delay: 180 + Math.random() * 240,
            angle,
            radius: 14 + Math.random() * 60,
            speed,
            rot: Math.random() * Math.PI * 2,
            vrot: (Math.random() - 0.5) * 0.28,
            size: 24 + Math.random() * 44,
            col: cols[i % cols.length],
            alpha: 0.9
          };
        });
      }

      function drawFracturedShatter(now) {
        const elapsed = Math.max(0, (now || performance.now()) - fracturedStart);
        const w = canvas.width;
        const h = canvas.height;
        const cx = w * 0.5;
        const cy = h * 0.5;
        ctx.clearRect(0, 0, w, h);

        const crackEnv = elapsed < 160
          ? elapsed / 160
          : elapsed > 960 ? Math.max(0, 1 - (elapsed - 960) / 420) : 1;
        if (crackEnv > 0.01) {
          const crackCols = ['#ff2e97', '#00f0ff', '#ffe14d'];
          const maxLen = Math.min(w, h) * 0.92 * Math.min(1, elapsed / 320);
          for (let c = 0; c < 10; c++) {
            const baseA = (c / 10) * Math.PI * 2 + 0.18;
            const col = crackCols[c % 3];
            ctx.save();
            ctx.globalAlpha = crackEnv * 0.88;
            ctx.strokeStyle = col;
            ctx.shadowColor = col;
            ctx.shadowBlur = 22;
            ctx.lineWidth = c % 2 === 0 ? 4 : 2.5;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            for (let seg = 1; seg <= 4; seg++) {
              const r = (maxLen * seg) / 4;
              const jitter = (seg % 2 === 0 ? 0.09 : -0.09) * (c % 2 === 0 ? 1 : -1);
              ctx.lineTo(cx + Math.cos(baseA + jitter) * r, cy + Math.sin(baseA + jitter) * r);
            }
            ctx.stroke();
            ctx.restore();
          }
        }

        if (elapsed > 520 && elapsed < 860) {
          const flash = Math.sin(((elapsed - 520) / 340) * Math.PI) * 0.4;
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, w * 0.65);
          grad.addColorStop(0, 'rgba(255, 46, 151, ' + flash.toFixed(3) + ')');
          grad.addColorStop(0.5, 'rgba(0, 240, 255, ' + (flash * 0.72).toFixed(3) + ')');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }

        for (const s of fracturedShards) {
          if (elapsed < s.delay) continue;
          s.radius += s.speed;
          s.rot += s.vrot;
          const fade = Math.max(0, 1 - Math.max(0, elapsed - 1280) / 500);
          if (fade <= 0.01) continue;
          const x = cx + Math.cos(s.angle) * s.radius;
          const y = cy + Math.sin(s.angle) * s.radius;
          ctx.save();
          ctx.globalAlpha = s.alpha * fade;
          ctx.translate(x, y);
          ctx.rotate(s.rot);
          ctx.fillStyle = 'rgba(14, 6, 26, 0.88)';
          ctx.strokeStyle = s.col;
          ctx.shadowColor = s.col;
          ctx.shadowBlur = 22;
          ctx.lineWidth = 2.6;
          const sz = s.size;
          ctx.beginPath();
          ctx.moveTo(0, -sz);
          ctx.lineTo(sz * 0.76, sz * 0.18);
          ctx.lineTo(-sz * 0.58, sz * 0.82);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
        animId = requestAnimationFrame(drawFracturedShatter);
      }

      function spawnDjCrescendo() {
        djStart = performance.now();
      }

      function drawDjCrescendo(now) {
        const elapsed = Math.max(0, (now || performance.now()) - djStart);
        const w = canvas.width;
        const h = canvas.height;
        const cx = w * 0.5;
        const cy = h * 0.5;
        ctx.clearRect(0, 0, w, h);

        const env = elapsed < 240
          ? elapsed / 240
          : elapsed > 1320 ? Math.max(0, 1 - (elapsed - 1320) / 500) : 1;
        if (env <= 0.01) {
          animId = requestAnimationFrame(drawDjCrescendo);
          return;
        }

        const cols = ['#00e5ff', '#ff2a6d', '#c084fc'];
        const bars = 36;
        const bw = w / bars;
        for (let i = 0; i < bars; i++) {
          const distFromCenter = Math.abs(i - bars / 2) / (bars / 2);
          const wave = Math.abs(Math.sin(elapsed * 0.012 + i * 0.42)) * 0.65 + Math.abs(Math.cos(elapsed * 0.008 - i * 0.25)) * 0.35;
          const barH = (h * 0.14 + wave * h * 0.34 * (1 - distFromCenter * 0.35)) * env;
          const col = cols[(i + Math.floor(elapsed / 260)) % 3];
          ctx.save();
          ctx.globalAlpha = 0.85 * env;
          ctx.fillStyle = col;
          ctx.shadowColor = col;
          ctx.shadowBlur = 22;
          const x = i * bw + 4;
          const rw = Math.max(6, bw - 8);
          ctx.fillRect(x, h - barH, rw, barH);
          ctx.fillRect(x, 0, rw, barH * 0.72);
          ctx.restore();
        }

        for (let r = 0; r < 4; r++) {
          const t = elapsed - r * 220;
          if (t < 0) continue;
          const rad = 40 + t * 0.88;
          const rAlpha = Math.max(0, 1 - t / 1150) * env;
          const col = cols[r % 3];
          ctx.save();
          ctx.globalAlpha = rAlpha * 0.9;
          ctx.strokeStyle = col;
          ctx.shadowColor = col;
          ctx.shadowBlur = 28;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        if (elapsed > 580 && elapsed < 920) {
          const flash = Math.sin(((elapsed - 580) / 340) * Math.PI) * 0.36;
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, w * 0.65);
          grad.addColorStop(0, 'rgba(0, 229, 255, ' + flash.toFixed(3) + ')');
          grad.addColorStop(0.5, 'rgba(255, 42, 109, ' + (flash * 0.65).toFixed(3) + ')');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }

        animId = requestAnimationFrame(drawDjCrescendo);
      }

      function spawnDeathLotus() {
        lotusStart = performance.now();
        const cols = ['#f5d061', '#e11d48', '#f8fafc', '#fbbf24'];
        lotusItems = [];
        for (let wave = 0; wave < 3; wave++) {
          const delay = 140 + wave * 240;
          for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2 + wave * 0.42;
            lotusItems.push({
              isDagger: true,
              delay,
              angle,
              spinSpeed: (wave % 2 === 0 ? 1 : -1) * 0.045,
              radius: 26,
              speed: 24 + (i % 4) * 5 + wave * 3,
              size: 46 + (i % 3) * 14,
              col: i % 2 === 0 ? '#f5d061' : '#f8fafc',
              trailCol: i % 2 === 0 ? '#e11d48' : '#f5d061',
              alpha: 0.96
            });
          }
        }
        for (let p = 0; p < 52; p++) {
          const angle = Math.random() * Math.PI * 2;
          lotusItems.push({
            isDagger: false,
            delay: 80 + Math.random() * 680,
            angle,
            spinSpeed: (Math.random() > 0.5 ? 1 : -1) * (0.02 + Math.random() * 0.04),
            radius: 30 + Math.random() * 140,
            speed: 8 + Math.random() * 14,
            size: 11 + Math.random() * 15,
            rot: Math.random() * Math.PI * 2,
            vrot: (Math.random() - 0.5) * 0.16,
            col: cols[p % cols.length],
            alpha: 0.85
          });
        }
      }

      function drawDeathLotus(now) {
        const elapsed = Math.max(0, (now || performance.now()) - lotusStart);
        const cx = canvas.width * 0.5;
        const cy = canvas.height * 0.5;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const vortexFade = elapsed < 220
          ? elapsed / 220
          : elapsed > 1280 ? Math.max(0, 1 - (elapsed - 1280) / 520) : 1;
        if (vortexFade > 0.01) {
          const baseSpin = elapsed * 0.013;
          const rings = [
            { r: 170 + elapsed * 0.24, dir: 1, col: '#f5d061', w: 5, arcs: 4 },
            { r: 280 + elapsed * 0.34, dir: -1, col: '#e11d48', w: 6, arcs: 5 },
            { r: 410 + elapsed * 0.42, dir: 1, col: '#f8fafc', w: 3.5, arcs: 3 }
          ];
          for (const rg of rings) {
            for (let a = 0; a < rg.arcs; a++) {
              const startA = baseSpin * rg.dir + (a * Math.PI * 2) / rg.arcs;
              ctx.save();
              ctx.globalAlpha = vortexFade * 0.82;
              ctx.strokeStyle = rg.col;
              ctx.shadowColor = rg.col;
              ctx.shadowBlur = 24;
              ctx.lineWidth = rg.w;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.arc(cx, cy, rg.r, startA, startA + 0.88);
              ctx.stroke();
              ctx.restore();
            }
          }
          if (elapsed > 620 && elapsed < 920) {
            const flashAlpha = Math.sin(((elapsed - 620) / 300) * Math.PI) * 0.34;
            const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, canvas.width * 0.65);
            grad.addColorStop(0, 'rgba(245, 208, 97, ' + flashAlpha.toFixed(3) + ')');
            grad.addColorStop(0.5, 'rgba(225, 29, 72, ' + (flashAlpha * 0.65).toFixed(3) + ')');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }

        for (const it of lotusItems) {
          if (elapsed < it.delay) continue;
          it.radius += it.speed;
          it.angle += it.spinSpeed;
          const x = cx + Math.cos(it.angle) * it.radius;
          const y = cy + Math.sin(it.angle) * it.radius;
          const fadeOut = Math.max(0, 1 - Math.max(0, elapsed - 1320) / 480);
          if (fadeOut <= 0.01) continue;

          ctx.save();
          ctx.globalAlpha = it.alpha * fadeOut;
          if (it.isDagger) {
            const prevR = Math.max(0, it.radius - it.speed * 3.4);
            const px = cx + Math.cos(it.angle - it.spinSpeed * 3.4) * prevR;
            const py = cy + Math.sin(it.angle - it.spinSpeed * 3.4) * prevR;
            ctx.strokeStyle = it.trailCol;
            ctx.shadowColor = it.trailCol;
            ctx.shadowBlur = 18;
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();

            ctx.translate(x, y);
            ctx.rotate(it.angle + Math.atan2(it.spinSpeed * it.radius, it.speed));
            const s = it.size;
            ctx.shadowColor = it.col;
            ctx.shadowBlur = 22;
            ctx.fillStyle = it.col;
            ctx.beginPath();
            ctx.moveTo(s, 0);
            ctx.lineTo(-s * 0.3, -s * 0.17);
            ctx.lineTo(-s * 0.58, 0);
            ctx.lineTo(-s * 0.3, s * 0.17);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#e11d48';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(-s * 0.28, -s * 0.32);
            ctx.lineTo(-s * 0.28, s * 0.32);
            ctx.stroke();
          } else {
            it.rot += it.vrot;
            ctx.translate(x, y);
            ctx.rotate(it.rot);
            ctx.shadowColor = it.col;
            ctx.shadowBlur = 16;
            ctx.fillStyle = it.col;
            ctx.beginPath();
            ctx.ellipse(0, 0, it.size * 1.4, it.size * 0.65, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
        animId = requestAnimationFrame(drawDeathLotus);
      }

      function drawBubbles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const b of bubbles) {
          b.y -= b.vy;
          b.x += b.vx;
          ctx.save();
          ctx.globalAlpha = b.alpha;
          ctx.strokeStyle = b.col;
          ctx.fillStyle = b.col;
          ctx.shadowBlur = 14;
          ctx.shadowColor = b.col;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = b.alpha * 0.25;
          ctx.fill();
          ctx.restore();
        }
        animId = requestAnimationFrame(drawBubbles);
      }

      function resetCustomMedia() {
        if (customVideo) {
          customVideo.pause();
          customVideo.removeAttribute('src');
          customVideo.load();
          customVideo.style.display = 'none';
        }
        if (customImg) {
          customImg.removeAttribute('src');
          customImg.style.display = 'none';
        }
        if (customFrame) {
          customFrame.src = 'about:blank';
          customFrame.style.display = 'none';
        }
      }

      function playTransition(opts) {
        if (timer) clearTimeout(timer);
        if (animId) cancelAnimationFrame(animId);
        stage.classList.remove('playing');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        resetCustomMedia();

        if (opts && opts.mode === 'custom-file' && opts.mediaUrl) {
          const url = opts.mediaUrl + (opts.mediaUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
          const kind = opts.fileKind || 'video';
          const fallbackMs = Math.max(800, Number(opts.durationMs) || 3500);
          if (kind === 'video' && customVideo) {
            customVideo.src = url;
            customVideo.currentTime = 0;
            customVideo.style.display = 'block';
            customVideo.onended = () => resetCustomMedia();
            customVideo.onerror = () => resetCustomMedia();
            customVideo.play().catch(() => {
              customVideo.muted = true;
              customVideo.play().catch(() => {});
            });
            timer = setTimeout(resetCustomMedia, Math.max(fallbackMs, 12000));
            return;
          }
          if (kind === 'image' && customImg) {
            customImg.src = url;
            customImg.style.display = 'block';
            timer = setTimeout(resetCustomMedia, fallbackMs);
            return;
          }
          if (kind === 'html' && customFrame) {
            customFrame.src = url;
            customFrame.style.display = 'block';
            timer = setTimeout(resetCustomMedia, fallbackMs);
            return;
          }
        }

        void stage.offsetWidth;
        stage.classList.add('playing');
        if (activeEffect === 'crime-city') {
          spawnThrownCards();
          drawThrownCards();
        } else if (activeEffect === 'prestige-rose') {
          spawnDeathLotus();
          drawDeathLotus();
        } else if (activeEffect === 'dj-sona') {
          if (customVideo) {
            customVideo.src = '/api/theme-asset/dj-sona-transition.mp4?t=' + Date.now();
            customVideo.muted = true;
            customVideo.load();
            customVideo.currentTime = 0;
            customVideo.style.display = 'block';
            customVideo.onended = () => resetCustomMedia();
            customVideo.onerror = () => {
              resetCustomMedia();
              spawnDjCrescendo();
              drawDjCrescendo();
            };
            customVideo.play().catch(() => {});
            timer = setTimeout(() => {
              stage.classList.remove('playing');
              resetCustomMedia();
            }, 2250);
            return;
          }
          spawnDjCrescendo();
          drawDjCrescendo();
        } else if (activeEffect === 'arcane-fractured') {
          spawnFracturedShatter();
          drawFracturedShatter();
        } else if (activeEffect === 'eve-firestarter') {
          if (customVideo) {
            customVideo.src = '/api/theme-asset/evelynn-firestarter-transition.mp4?t=' + Date.now();
            customVideo.muted = true;
            customVideo.load();
            customVideo.currentTime = 0;
            customVideo.style.display = 'block';
            customVideo.onended = () => resetCustomMedia();
            customVideo.onerror = () => {
              resetCustomMedia();
              spawnEveCoffin();
              drawEveCoffin();
            };
            customVideo.play().catch(() => {});
            timer = setTimeout(() => {
              stage.classList.remove('playing');
              resetCustomMedia();
            }, 2350);
            return;
          }
          spawnEveCoffin();
          drawEveCoffin();
        } else if (activeEffect === 'creator-viktor') {
          if (customVideo) {
            customVideo.src = '/api/theme-asset/viktor-creator-transition.mp4?t=' + Date.now();
            customVideo.muted = true;
            customVideo.load();
            customVideo.currentTime = 0;
            customVideo.style.display = 'block';
            customVideo.onended = () => resetCustomMedia();
            customVideo.onerror = () => {
              resetCustomMedia();
              spawnBubbles();
              drawBubbles();
            };
            customVideo.play().catch(() => {});
            timer = setTimeout(() => {
              stage.classList.remove('playing');
              resetCustomMedia();
            }, 2250);
            return;
          }
          spawnBubbles();
          drawBubbles();
        } else if (activeEffect === 'final-boss') {
          if (customVideo) {
            customVideo.src = '/api/theme-asset/veigar-final-boss-transition.mp4?t=' + Date.now();
            customVideo.muted = true;
            customVideo.load();
            customVideo.currentTime = 0;
            customVideo.style.display = 'block';
            customVideo.onended = () => resetCustomMedia();
            customVideo.onerror = () => {
              resetCustomMedia();
              spawnBubbles();
              drawBubbles();
            };
            customVideo.play().catch(() => {});
            timer = setTimeout(() => {
              stage.classList.remove('playing');
              resetCustomMedia();
            }, 2250);
            return;
          }
          spawnBubbles();
          drawBubbles();
        } else if (activeEffect === 'revenant-reign') {
          if (customVideo) {
            customVideo.src = '/api/theme-asset/viego-revenant-reign-transition.mp4?t=' + Date.now();
            customVideo.muted = true;
            customVideo.load();
            customVideo.currentTime = 0;
            customVideo.style.display = 'block';
            customVideo.onended = () => resetCustomMedia();
            customVideo.onerror = () => {
              resetCustomMedia();
              spawnBubbles();
              drawBubbles();
            };
            customVideo.play().catch(() => {});
            timer = setTimeout(() => {
              stage.classList.remove('playing');
              resetCustomMedia();
            }, 2200);
            return;
          }
          spawnBubbles();
          drawBubbles();
        } else if (activeEffect === 'unbound-thresh') {
          if (customVideo) {
            customVideo.src = '/api/theme-asset/thresh-unbound-transition.mp4?t=' + Date.now();
            customVideo.muted = true;
            customVideo.load();
            customVideo.currentTime = 0;
            customVideo.style.display = 'block';
            customVideo.onended = () => resetCustomMedia();
            customVideo.onerror = () => {
              resetCustomMedia();
              spawnBubbles();
              drawBubbles();
            };
            customVideo.play().catch(() => {});
            timer = setTimeout(() => {
              stage.classList.remove('playing');
              resetCustomMedia();
            }, 2350);
            return;
          }
          spawnBubbles();
          drawBubbles();
        } else if (activeEffect === 'ahri-firestarter') {
          if (customVideo) {
            customVideo.src = '/api/theme-asset/ahri-firestarter-transition.mp4?t=' + Date.now();
            customVideo.muted = true;
            customVideo.load();
            customVideo.currentTime = 0;
            customVideo.style.display = 'block';
            customVideo.onended = () => resetCustomMedia();
            customVideo.onerror = () => {
              resetCustomMedia();
              spawnBubbles();
              drawBubbles();
            };
            customVideo.play().catch(() => {});
            timer = setTimeout(() => {
              stage.classList.remove('playing');
              resetCustomMedia();
            }, 2350);
            return;
          }
          spawnBubbles();
          drawBubbles();
        } else if (activeEffect === 'kda-firestarter') {
          if (customVideo) {
            customVideo.src = '/api/theme-asset/akali-firestarter-transition.mp4?t=' + Date.now();
            customVideo.muted = true;
            customVideo.load();
            customVideo.currentTime = 0;
            customVideo.style.display = 'block';
            customVideo.onended = () => resetCustomMedia();
            customVideo.onerror = () => {
              resetCustomMedia();
              spawnAkaliSkate();
              drawAkaliSkate();
            };
            customVideo.play().catch(() => {});
            timer = setTimeout(() => {
              stage.classList.remove('playing');
              resetCustomMedia();
            }, 2350);
            return;
          }
          spawnAkaliSkate();
          drawAkaliSkate();
        } else {
          spawnBubbles();
          drawBubbles();
        }
        timer = setTimeout(() => {
          stage.classList.remove('playing');
          if (animId) cancelAnimationFrame(animId);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 1820);
      }

      fetch('/api/champion-theme', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => applyTheme(d && d.pack ? d.pack : null))
        .catch(() => {});

      function connectWs() {
        try {
          const ws = new WebSocket('ws://' + location.host);
          ws.onmessage = (ev) => {
            try {
              const p = JSON.parse(ev.data);
              if (p.type === 'champion-theme') applyTheme(p.data);
              if (p.type === 'scene-transition' || p.type === 'singed-transition') playTransition(p.data || null);
            } catch (e) {}
          };
          ws.onclose = () => setTimeout(connectWs, 2500);
        } catch (e) {}
      }
      connectWs();

      const params = new URLSearchParams(location.search);
      if (params.get('autoplay') === '1' || params.get('play') === '1') {
        setTimeout(playTransition, 80);
      }
      window.addEventListener('click', playTransition);
    })();
  </script>
</body>
</html>`;

const OBS_LOL_MAP_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — LoL Map Streamer-Modus</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100vw; height: 100vh; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f0e6d2; overflow: hidden; }
    .map-cover {
      position: relative;
      width: 100%;
      height: 100%;
      background: linear-gradient(155deg, rgba(9, 20, 40, 0.98) 0%, rgba(1, 10, 19, 0.99) 100%);
      border: 2.5px solid #c8aa6e;
      box-shadow: inset 0 0 0 1px rgba(200,170,110,0.35), inset 0 0 28px rgba(10,200,185,0.22);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 16px;
      transition: opacity 0.25s ease;
    }
    .map-cover.hidden { opacity: 0; pointer-events: none; }
    .map-cover::before, .map-cover::after { content: ""; position: absolute; width: 14px; height: 14px; border: 2.5px solid #0ac8b9; pointer-events: none; z-index: 2; }
    .map-cover::before { top: 4px; left: 4px; border-right: none; border-bottom: none; }
    .map-cover::after { bottom: 4px; right: 4px; border-left: none; border-top: none; }
    .map-splash { position: absolute; inset: 0; background-size: cover; background-position: center 20%; opacity: 0.34; filter: saturate(1.15) blur(1px); z-index: 0; }
    .map-splash::after { content: ""; position: absolute; inset: 0; background: radial-gradient(circle, rgba(9,20,40,0.45) 0%, rgba(1,10,19,0.92) 100%); }
    .map-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .map-icon { width: 64px; height: 64px; border-radius: 6px; border: 2px solid #c8aa6e; box-shadow: 0 0 18px rgba(10,200,185,0.45); object-fit: cover; object-position: center 15%; background: #091428; }
    .map-badge { font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #0ac8b9; background: rgba(10,200,185,0.14); border: 1px solid rgba(10,200,185,0.5); padding: 3px 10px; border-radius: 3px; }
    .map-title { font-family: Georgia, "Times New Roman", serif; font-size: 16px; font-weight: 800; color: #f0e6d2; letter-spacing: 0.04em; text-shadow: 0 2px 8px rgba(0,0,0,0.9); }
    .map-sub { font-size: 11.5px; color: #c8aa6e; font-weight: 600; max-width: 90%; line-height: 1.35; }
  </style>
</head>
<body>
  <div class="map-cover hidden" id="mapCover">
    <div class="map-splash" id="mapSplash"></div>
    <div class="map-inner">
      <img class="map-icon" id="mapIcon" alt="" style="display:none;" />
      <div class="map-badge">🛡️ Streamer-Modus</div>
      <div class="map-title" id="mapTitle">MINIMAP VERDECKT</div>
      <div class="map-sub" id="mapSub">Minimap verdeckt • Kein Ghosting</div>
    </div>
  </div>
  <script>
    const coverEl = document.getElementById('mapCover');
    const splashEl = document.getElementById('mapSplash');
    const iconEl = document.getElementById('mapIcon');
    const titleEl = document.getElementById('mapTitle');
    const subEl = document.getElementById('mapSub');

    function renderMapCover(data) {
      if (!data) return;
      const show = Boolean(data.mapCoverEnabled) && data.overlayEnabled !== false;
      coverEl.classList.toggle('hidden', !show);
      subEl.textContent = data.mapCoverText || 'Minimap verdeckt • Kein Ghosting';
      const iconUrl = data.skinIconUrl || data.championIconUrl;
      if (iconUrl) {
        iconEl.style.display = 'block';
        iconEl.src = iconUrl;
      } else {
        iconEl.style.display = 'none';
      }
      splashEl.style.backgroundImage = data.skinSplashUrl ? 'url("' + data.skinSplashUrl + '")' : 'none';
      titleEl.textContent = data.champion ? data.champion.toUpperCase() : 'MINIMAP VERDECKT';
    }

    function fetchLatest() {
      fetch('/api/game-stats')
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (d && d.addonId) renderMapCover(d); })
        .catch(() => {});
    }

    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'game-stats') renderMapCover(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest();
    connectWs();
    setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_LOL_ABILITY_BAR_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — LoL Ability-Bar Rahmen</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100vw;
      height: 100vh;
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
      user-select: none;
    }
    .ab-stage {
      position: relative;
      width: 100vw;
      height: 100vh;
      --ab-p: var(--ct-primary, #c8aa6e);
      --ab-s: var(--ct-secondary, #0ac8b9);
      --ab-t: var(--ct-tertiary, #38bdf8);
      --ab-bg: var(--ct-bg-start, rgba(9, 20, 40, 0.92));
      --ab-txt: var(--ct-text, #f0e6d2);
    }
    .ab-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      filter: drop-shadow(0 0 10px color-mix(in srgb, var(--ab-p) 58%, transparent));
    }
    .ab-energy-dash {
      stroke-dasharray: 28 240;
      animation: abFlow 4.2s linear infinite;
    }
    .ab-ring-spin {
      transform-origin: 84px 96px;
      animation: abSpin 14s linear infinite;
    }
    .ab-crest-pill {
      position: absolute;
      left: 44.3%;
      top: 1.5%;
      transform: translateX(-50%);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 14px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--ab-bg), rgba(2, 6, 20, 0.96));
      border: 1.8px solid var(--ab-p);
      box-shadow: 0 0 14px color-mix(in srgb, var(--ab-p) 65%, transparent), inset 0 0 8px color-mix(in srgb, var(--ab-s) 35%, transparent);
      color: var(--ab-txt);
      font-size: clamp(9px, 1.3vw, 12px);
      font-weight: 900;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      white-space: nowrap;
      z-index: 5;
    }
    .ab-crest-icon { font-size: clamp(11px, 1.5vw, 14px); filter: drop-shadow(0 0 6px var(--ab-s)); }
    .ab-fx-layer { display: none; pointer-events: none; }

    /* Unbound Thresh: Chain rails + swaying Soul Lantern */
    body.champ-fx-unbound-thresh .ab-fx-thresh { display: block; }
    .ab-lantern-sway {
      transform-origin: 36px 26px;
      animation: abLanternSway 3.4s ease-in-out infinite;
    }

    /* Twisted Fate Crime City: Card suits + Pick-a-Card glow */
    body.champ-fx-crime-city .ab-fx-tf { display: block; }
    body.champ-fx-crime-city .ab-svg { animation: abTfGlow 3.6s ease-in-out infinite; }

    /* DJ Sona: Live EQ bars along top rail */
    body.champ-fx-dj-sona .ab-fx-sona { display: flex; }
    .ab-eq-strip {
      position: absolute;
      left: 20%;
      right: 30%;
      top: 4%;
      height: 14%;
      display: none;
      align-items: flex-end;
      justify-content: space-between;
      gap: 3px;
      pointer-events: none;
      z-index: 4;
    }
    .ab-eq-bar {
      flex: 1;
      border-radius: 2px 2px 0 0;
      background: linear-gradient(180deg, var(--ab-s), var(--ab-p));
      box-shadow: 0 0 8px var(--ab-p);
      animation: abEqBounce 0.9s ease-in-out infinite alternate;
    }

    /* Ahri K/DA FIRESTARTER: Crystal Heart Crest */
    body.champ-fx-ahri-firestarter .ab-fx-ahri { display: block; }

    /* Evelynn K/DA FIRESTARTER: Shadow Lasher Wings */
    body.champ-fx-eve-firestarter .ab-fx-eve { display: block; }

    /* Akali K/DA Ignition: Kunai Wings */
    body.champ-fx-kda-firestarter .ab-fx-akali { display: block; }

    /* Katarina Prestige Black Rose / Elise Black Rose */
    body.champ-fx-prestige-rose .ab-fx-rose,
    body.champ-fx-black-rose .ab-fx-rose { display: block; }

    /* Jinx Arcane Fractured / Zaun Glitch */
    body.champ-fx-arcane-fractured .ab-fx-jinx,
    body.champ-fx-jinx-glitch .ab-fx-jinx { display: block; }
    body.champ-fx-jinx-glitch .ab-stage,
    body.champ-fx-arcane-fractured .ab-stage { animation: abJinxJitter 4.2s infinite; }

    /* Singed Mad Scientist Lab: Hazard stripes */
    body.champ-fx-zaun-lab .ab-fx-lab { display: block; }

    /* Revenant Reign Viego: Morphing Greatsword (Form & Color Cycle) + Noble True-Alpha Painted Soul River & Spectral Hands */
    body.champ-fx-revenant-reign .ab-fx-revenant { display: block; }
    .ab-revenant-river-img {
      display: none;
      position: absolute;
      left: 11%;
      right: -1%;
      bottom: -8%;
      width: 90%;
      height: 82%;
      object-fit: fill;
      pointer-events: none;
      z-index: 4;
      filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.72)) drop-shadow(0 0 16px rgba(56, 189, 248, 0.45));
      animation: abRevenantMistWave 4.6s ease-in-out infinite;
    }
    body.champ-fx-revenant-reign .ab-revenant-river-img { display: block; }
    .ab-revenant-sword {
      transform-origin: 410px 22px;
      animation: abRevenantSwordShift 7.2s ease-in-out infinite;
    }
    @keyframes abRevenantSwordShift {
      0%, 100% { filter: hue-rotate(0deg) drop-shadow(0 0 10px #e11d48); transform: scaleX(1) scaleY(1); }
      25% { filter: hue-rotate(275deg) drop-shadow(0 0 10px #a855f7); transform: scaleX(1.05) scaleY(0.94); }
      50% { filter: hue-rotate(195deg) drop-shadow(0 0 10px #38bdf8); transform: scaleX(0.97) scaleY(1.08); }
      75% { filter: hue-rotate(48deg) drop-shadow(0 0 10px #facc15); transform: scaleX(1.04) scaleY(1.02); }
    }
    @keyframes abRevenantMistWave {
      0%, 100% { transform: translateY(0px) scaleY(1); opacity: 0.92; }
      50% { transform: translateY(-3px) scaleY(1.04); opacity: 1; }
    }

    /* Lux Elementalist: Prismatic hue cycle */
    body.champ-fx-elementalist .ab-svg { animation: abPrismCycle 6s linear infinite; }

    /* Soul Fighter: Hard cel-shaded comic drop shadow */
    body.champ-fx-soul-fighter .ab-svg { filter: drop-shadow(3px 3px 0 #05050a) drop-shadow(0 0 10px var(--ab-p)); }

    /* Final Boss Veigar: 8-bit Retro Arcade Pixel Blocks & Glitch Pulse */
    body.champ-fx-final-boss .ab-fx-finalboss { display: block; }
    body.champ-fx-final-boss .ab-svg { filter: drop-shadow(3px 3px 0 #050212) drop-shadow(0 0 12px rgba(34, 255, 102, 0.72)); }
    .ab-fb-voxels { animation: abFbVoxelFloat 2.4s steps(4, end) infinite; }
    @keyframes abFbVoxelFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-4px); }
    }

    /* Creator Viktor: Dr. Doom Armored Iron Tech + Red-White High-Voltage Lightning Arcs */
    body.champ-fx-creator-viktor .ab-fx-viktor { display: block; }
    body.champ-fx-creator-viktor .ab-svg { filter: drop-shadow(0 0 12px rgba(255, 30, 45, 0.78)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.65)); }
    .ab-viktor-arc-a { animation: abViktorArcA 1.15s steps(3, end) infinite; }
    .ab-viktor-arc-b { animation: abViktorArcB 1.45s steps(3, end) infinite; }
    @keyframes abViktorArcA {
      0%, 100% { opacity: 1; transform: translateY(0px); }
      33% { opacity: 0.35; transform: translateY(-1.5px); }
      66% { opacity: 0.95; transform: translateY(1.5px); }
    }
    @keyframes abViktorArcB {
      0%, 100% { opacity: 0.3; transform: translateY(1px); }
      45% { opacity: 1; transform: translateY(-1px); }
      80% { opacity: 0.6; transform: translateY(0px); }
    }

    @keyframes abFlow { to { stroke-dashoffset: -268; } }
    @keyframes abSpin { to { transform: rotate(360deg); } }
    @keyframes abLanternSway {
      0%, 100% { transform: rotate(-7deg); }
      50% { transform: rotate(7deg); }
    }
    @keyframes abTfGlow {
      0%, 100% { filter: drop-shadow(0 0 12px rgba(250, 204, 21, 0.85)); }
      33% { filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.85)); }
      66% { filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.85)); }
    }
    @keyframes abEqBounce {
      0% { height: 22%; opacity: 0.72; }
      100% { height: 100%; opacity: 1; }
    }
    @keyframes abJinxJitter {
      0%, 93%, 100% { transform: translate(0, 0); }
      95% { transform: translate(2px, -1px); }
      97% { transform: translate(-2px, 1px); }
    }
    @keyframes abPrismCycle {
      0% { filter: hue-rotate(0deg) drop-shadow(0 0 11px var(--ab-p)); }
      100% { filter: hue-rotate(360deg) drop-shadow(0 0 11px var(--ab-p)); }
    }
  </style>
</head>
<body>
  <div class="ab-stage" id="abStage">
    <div class="ab-eq-strip ab-fx-sona" id="abEqStrip"></div>
    <img class="ab-revenant-river-img" src="/api/theme-asset/viego-ability-soul-arms.png" alt="" />

    <svg class="ab-svg" viewBox="0 0 920 175" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="abGradMain" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--ct-primary, #c8aa6e)" />
          <stop offset="50%" stop-color="var(--ct-secondary, #0ac8b9)" />
          <stop offset="100%" stop-color="var(--ct-tertiary, #38bdf8)" />
        </linearGradient>
        <linearGradient id="abGradVertical" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="var(--ct-primary, #c8aa6e)" />
          <stop offset="100%" stop-color="var(--ct-secondary, #0ac8b9)" />
        </linearGradient>
        <pattern id="abChainPat" width="22" height="10" patternUnits="userSpaceOnUse">
          <rect x="1" y="2" width="12" height="6" rx="3" fill="none" stroke="#10b981" stroke-width="2.2" />
          <rect x="9" y="3" width="12" height="4" rx="2" fill="none" stroke="#5eead4" stroke-width="1.6" />
        </pattern>
        <pattern id="abHazardPat" width="16" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="8" height="10" fill="#76ff03" />
          <rect x="8" width="8" height="10" fill="#091216" />
        </pattern>
      </defs>

      <!-- MAIN HOLLOW SILHOUETTE: Portrait Ring (Left) + Ability Deck (Center) + Item Wing (Right) -->
      <path d="M 148 36 L 172 22 L 642 22 L 664 38 L 892 38 L 912 56 L 912 154 L 896 170 L 146 170"
            fill="none" stroke="rgba(2, 6, 18, 0.88)" stroke-width="11" stroke-linejoin="round" />
      <circle cx="84" cy="96" r="71" fill="none" stroke="rgba(2, 6, 18, 0.88)" stroke-width="12" />

      <path d="M 148 36 L 172 22 L 642 22 L 664 38 L 892 38 L 912 56 L 912 154 L 896 170 L 146 170"
            fill="none" stroke="url(#abGradMain)" stroke-width="4.5" stroke-linejoin="round" />
      <path d="M 154 41 L 175 28 L 639 28 L 660 44 L 888 44 L 905 59 L 905 150 L 892 164 L 152 164"
            fill="none" stroke="var(--ct-secondary, #0ac8b9)" stroke-opacity="0.58" stroke-width="1.5" stroke-linejoin="round" />

      <path class="ab-energy-dash"
            d="M 148 36 L 172 22 L 642 22 L 664 38 L 892 38 L 912 56 L 912 154 L 896 170 L 146 170"
            fill="none" stroke="#ffffff" stroke-opacity="0.9" stroke-width="2.4" stroke-linecap="round" />

      <path d="M 664 38 L 664 166" fill="none" stroke="rgba(2,6,18,0.85)" stroke-width="7" />
      <path d="M 664 38 L 664 166" fill="none" stroke="url(#abGradVertical)" stroke-width="2.6" />
      <polygon points="664,31 671,39 664,47 657,39" fill="var(--ct-secondary, #0ac8b9)" stroke="rgba(2,6,18,0.9)" stroke-width="1.2" />

      <circle cx="84" cy="96" r="71" fill="none" stroke="url(#abGradMain)" stroke-width="5" />
      <circle cx="84" cy="96" r="64" fill="none" stroke="var(--ct-secondary, #0ac8b9)" stroke-opacity="0.6" stroke-width="1.5" />
      <circle class="ab-ring-spin" cx="84" cy="96" r="71" fill="none" stroke="#ffffff" stroke-opacity="0.72" stroke-width="2" stroke-dasharray="22 126" stroke-linecap="round" />

      <polygon points="172,15 186,22 172,29 158,22" fill="var(--ct-primary, #c8aa6e)" stroke="#020612" stroke-width="1.5" />
      <polygon points="642,15 656,22 642,29 628,22" fill="var(--ct-primary, #c8aa6e)" stroke="#020612" stroke-width="1.5" />
      <path d="M 884 38 L 916 38 L 916 70" fill="none" stroke="var(--ct-secondary, #0ac8b9)" stroke-width="3" />
      <path d="M 884 170 L 916 170 L 916 138" fill="none" stroke="var(--ct-primary, #c8aa6e)" stroke-width="3" />
      <polygon points="84,19 92,27 84,35 76,27" fill="var(--ct-secondary, #0ac8b9)" stroke="#020612" stroke-width="1.5" />

      <!-- UNBOUND THRESH: Chain rails + swaying Soul Lantern -->
      <g class="ab-fx-layer ab-fx-thresh">
        <rect x="174" y="17" width="466" height="10" fill="url(#abChainPat)" />
        <rect x="156" y="165" width="738" height="10" fill="url(#abChainPat)" />
        <rect x="668" y="33" width="222" height="10" fill="url(#abChainPat)" />
        <g class="ab-lantern-sway">
          <line x1="36" y1="8" x2="36" y2="26" stroke="#5eead4" stroke-width="2.2" />
          <polygon points="24,26 48,26 44,54 28,54" fill="#041816" stroke="#10b981" stroke-width="2.4" />
          <ellipse cx="36" cy="40" rx="6" ry="9" fill="#5eead4" opacity="0.92" />
          <polygon points="28,54 44,54 36,63" fill="#10b981" />
        </g>
      </g>

      <!-- TWISTED FATE CRIME CITY: Card Suits -->
      <g class="ab-fx-layer ab-fx-tf" font-size="16" font-weight="900" text-anchor="middle">
        <text x="172" y="27" fill="#facc15">♠</text>
        <text x="642" y="27" fill="#e11d48">♥</text>
        <text x="898" y="55" fill="#facc15">♦</text>
        <text x="898" y="164" fill="#a855f7">♣</text>
      </g>

      <!-- AHRI K/DA FIRESTARTER: Crystal Heart Crest -->
      <g class="ab-fx-layer ab-fx-ahri">
        <path d="M 84 18 C 84 10, 72 8, 72 17 C 72 24, 84 31, 84 34 C 84 31, 96 24, 96 17 C 96 8, 84 10, 84 18 Z"
              fill="#ff2e97" stroke="#fda4af" stroke-width="1.8" />
        <polygon points="902,42 918,52 908,66 894,54" fill="#ff1e56" stroke="#fda4af" stroke-width="1.5" />
      </g>

      <!-- EVELYNN K/DA FIRESTARTER: Shadow Lasher Wings -->
      <g class="ab-fx-layer ab-fx-eve">
        <path d="M 8 88 Q 22 44 48 26 Q 30 60 22 92 Z" fill="#ff1e6b" stroke="#a855f7" stroke-width="1.6" />
        <path d="M 918 68 Q 904 42 878 28 Q 896 54 904 82 Z" fill="#a855f7" stroke="#ff7a00" stroke-width="1.6" />
      </g>

      <!-- AKALI K/DA IGNITION: Kunai Blades -->
      <g class="ab-fx-layer ab-fx-akali">
        <polygon points="10,72 34,54 24,78 16,80" fill="#ff3b5c" stroke="#00f5ff" stroke-width="1.6" />
        <polygon points="918,46 890,34 904,58 914,58" fill="#ff7a00" stroke="#00f5ff" stroke-width="1.6" />
      </g>

      <!-- KATARINA / ELISE BLACK ROSE: Gold Filigree & Daggers -->
      <g class="ab-fx-layer ab-fx-rose">
        <path d="M 152 24 L 194 14 L 180 28 Z" fill="#f5d061" stroke="#e11d48" stroke-width="1.4" />
        <path d="M 662 24 L 620 14 L 634 28 Z" fill="#f5d061" stroke="#e11d48" stroke-width="1.4" />
        <circle cx="84" cy="25" r="7" fill="#e11d48" stroke="#f5d061" stroke-width="2" />
      </g>

      <!-- JINX ARCANE FRACTURED / ZAUN: Shattered Shards -->
      <g class="ab-fx-layer ab-fx-jinx">
        <polygon points="156,28 176,10 190,26" fill="#ff2e97" opacity="0.9" />
        <polygon points="628,24 648,10 662,30" fill="#00f0ff" opacity="0.9" />
        <polygon points="894,32 918,44 900,60" fill="#ffe14d" opacity="0.9" />
      </g>

      <!-- SINGED MAD SCIENTIST LAB: Hazard Trim -->
      <g class="ab-fx-layer ab-fx-lab">
        <rect x="174" y="18" width="110" height="8" rx="2" fill="url(#abHazardPat)" stroke="#091216" stroke-width="1" />
        <rect x="530" y="18" width="110" height="8" rx="2" fill="url(#abHazardPat)" stroke="#091216" stroke-width="1" />
      </g>

      <!-- REVENANT REIGN VIEGO: Ornate Morphing Greatsword Crest (Form & Color Cycle) -->
      <g class="ab-fx-layer ab-fx-revenant">
        <g class="ab-revenant-sword">
          <!-- Left Wing Blade -->
          <path d="M 156 22 L 198 11 L 214 18 L 328 19 L 340 22 L 328 25 L 214 26 L 198 33 Z" fill="#e11d48" stroke="#fda4af" stroke-width="1.6" />
          <line x1="176" y1="22" x2="328" y2="22" stroke="#ffffff" stroke-width="2" stroke-opacity="0.88" />
          <!-- Right Wing Blade -->
          <path d="M 658 22 L 616 11 L 600 18 L 486 19 L 474 22 L 486 25 L 600 26 L 616 33 Z" fill="#e11d48" stroke="#fda4af" stroke-width="1.6" />
          <line x1="638" y1="22" x2="486" y2="22" stroke="#ffffff" stroke-width="2" stroke-opacity="0.88" />
          <!-- Spiked Crown Gem on Portrait Ring -->
          <polygon points="84,8 91,20 100,14 95,28 84,35 73,28 68,14 77,20" fill="#1e1b4b" stroke="#e11d48" stroke-width="1.8" />
          <polygon points="84,15 89,23 84,30 79,23" fill="#fda4af" />
        </g>
      </g>

      <!-- FINAL BOSS VEIGAR: 8-Bit Arcade Pixel Voxels, Retro Hearts & Stepped Pixel Brackets -->
      <g class="ab-fx-layer ab-fx-finalboss">
        <!-- Chunky 8-bit Pixel-Stepped Corner Blocks -->
        <rect x="166" y="14" width="12" height="12" fill="#22ff66" stroke="#080614" stroke-width="2" />
        <rect x="178" y="18" width="8" height="8" fill="#a855f7" stroke="#080614" stroke-width="1.5" />
        <rect x="634" y="14" width="12" height="12" fill="#22ff66" stroke="#080614" stroke-width="2" />
        <rect x="626" y="18" width="8" height="8" fill="#00f0ff" stroke="#080614" stroke-width="1.5" />
        <rect x="898" y="34" width="14" height="14" fill="#a855f7" stroke="#22ff66" stroke-width="2" />
        <rect x="898" y="158" width="14" height="14" fill="#22ff66" stroke="#080614" stroke-width="2" />
        <!-- 8-Bit Retro Pixel Boss Emblem & Floating Voxels -->
        <g class="ab-fb-voxels">
          <!-- Left Portrait 8-Bit Boss Crown / Pixel Invader Crest -->
          <rect x="74" y="12" width="20" height="12" fill="#a855f7" stroke="#22ff66" stroke-width="2" />
          <rect x="78" y="16" width="4" height="4" fill="#22ff66" />
          <rect x="86" y="16" width="4" height="4" fill="#22ff66" />
          <!-- Floating Glitch Cubes along Top & Bottom -->
          <rect x="242" y="12" width="8" height="8" fill="#00f0ff" />
          <rect x="254" y="16" width="6" height="6" fill="#22ff66" />
          <rect x="556" y="12" width="8" height="8" fill="#ff2a85" />
          <rect x="568" y="16" width="6" height="6" fill="#22ff66" />
          <rect x="360" y="164" width="10" height="8" fill="#22ff66" stroke="#080614" stroke-width="1.5" />
          <rect x="440" y="164" width="10" height="8" fill="#a855f7" stroke="#080614" stroke-width="1.5" />
          <rect x="520" y="164" width="10" height="8" fill="#00f0ff" stroke="#080614" stroke-width="1.5" />
          <rect x="750" y="164" width="10" height="8" fill="#ffe14d" stroke="#080614" stroke-width="1.5" />
        </g>
      </g>

      <!-- CREATOR VIKTOR: Armored Iron Plates & Dr. Doom Tech Mask Crest (60fps Fractal Lightning drawn by Canvas Perimeter Engine) -->
      <g class="ab-fx-layer ab-fx-viktor">
        <!-- Heavy Gunmetal Armor Corner Rivet Plates -->
        <polygon points="154,32 174,16 218,16 206,28 166,28" fill="#1e293b" stroke="#94a3b8" stroke-width="1.8" />
        <polygon points="656,32 636,16 592,16 604,28 644,28" fill="#1e293b" stroke="#94a3b8" stroke-width="1.8" />
        <polygon points="878,34 916,34 916,74 904,64 904,46 888,46" fill="#1e293b" stroke="#ff1e2d" stroke-width="1.8" />
        <!-- Dr. Doom / Creator Iron Mask Crest over Portrait Ring -->
        <polygon points="71,12 97,12 94,31 84,37 74,31" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.8" />
        <line x1="76" y1="21" x2="82" y2="23" stroke="#ff1e2d" stroke-width="2.6" stroke-linecap="round" />
        <line x1="92" y1="21" x2="86" y2="23" stroke="#ff1e2d" stroke-width="2.6" stroke-linecap="round" />
        <line x1="78" y1="29" x2="90" y2="29" stroke="#94a3b8" stroke-width="1.5" />
      </g>
    </svg>
  </div>

  <script>
    (function initAbilityBarFrame() {
      const iconEl = document.getElementById('abCrestIcon');
      const textEl = document.getElementById('abCrestText');
      const eqEl = document.getElementById('abEqStrip');

      if (eqEl) {
        for (let i = 0; i < 18; i++) {
          const b = document.createElement('div');
          b.className = 'ab-eq-bar';
          b.style.animation = 'none';
          b.style.transition = 'height 0.06s linear, opacity 0.12s ease';
          b.style.height = '12%';
          eqEl.appendChild(b);
        }
      }

      let musicPlaying = true;
      let liveEq = null;
      let liveEqAt = 0;

      function tickAbEq(now) {
        requestAnimationFrame(tickAbEq);
        if (!eqEl || !document.body.classList.contains('champ-fx-dj-sona')) return;
        const bars = eqEl.children;
        const fresh = liveEq && (now - liveEqAt) < 700;
        const bands = fresh && Array.isArray(liveEq.bands) && liveEq.bands.length >= 18 ? liveEq.bands : null;
        for (let i = 0; i < bars.length; i++) {
          let h = 12;
          if (bands) {
            h = Math.max(10, Math.min(100, Math.round(bands[i] * 100)));
          } else if (fresh && typeof liveEq.level === 'number') {
            const lv = liveEq.level;
            const side = i < 9 ? (liveEq.left ?? lv) : (liveEq.right ?? lv);
            const curve = 0.65 + 0.35 * Math.sin((i / 17) * Math.PI);
            const ripple = 0.72 + 0.28 * Math.sin(now * 0.018 + i * 0.85);
            h = Math.max(10, Math.min(100, Math.round(10 + side * curve * ripple * 96)));
          } else if (musicPlaying) {
            const synth = Math.abs(Math.sin(now * 0.006 + i * 0.52) * Math.cos(now * 0.0032 - i * 0.27));
            h = Math.round(16 + synth * 78);
          } else {
            h = 10 + Math.round(Math.sin(now * 0.002 + i * 0.4) * 3 + 3);
          }
          bars[i].style.height = h + '%';
          bars[i].style.opacity = (!fresh && !musicPlaying) ? '0.42' : '0.96';
        }
      }
      requestAnimationFrame(tickAbEq);

      try {
        const ws = new WebSocket('ws://' + location.host);
        ws.onmessage = (ev) => {
          try {
            const p = JSON.parse(ev.data);
            if (p.type === 'spotify' && p.data) {
              musicPlaying = p.data.isPlaying !== false && Boolean(p.data.title);
            } else if (p.type === 'audio-eq' && p.data) {
              liveEq = p.data;
              liveEqAt = performance.now();
            }
          } catch (e) {}
        };
      } catch (e) {}
    })();
  </script>
</body>
</html>`;

const OBS_LOL_BUILD_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — LoL Live Item-Build & Elo Bar</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f0e6d2; overflow: hidden; }
    .lb-bar {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      padding: 10px 16px;
      background: linear-gradient(155deg, rgba(9, 20, 40, 0.96) 0%, rgba(1, 10, 19, 0.98) 100%);
      border: 2px solid #c8aa6e;
      border-radius: 5px;
      box-shadow: inset 0 0 0 1px rgba(200,170,110,0.3), 0 8px 24px rgba(0,0,0,0.65);
      position: relative;
    }
    .lb-elo { display: flex; flex-direction: column; gap: 3px; padding-right: 12px; border-right: 1px solid rgba(200,170,110,0.35); min-width: 145px; }
    .lb-rank { font-family: Georgia, "Times New Roman", serif; font-size: 14px; font-weight: 800; color: #f0e6d2; letter-spacing: 0.04em; text-transform: uppercase; }
    .lb-lp { font-size: 11.5px; font-weight: 800; color: #0ac8b9; }
    .lb-meta { font-size: 10px; color: #c8aa6e; white-space: nowrap; }
    .lb-items { display: flex; align-items: center; gap: 5px; }
    .lb-slot {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      background: rgba(7, 16, 32, 0.9);
      border: 1.5px solid rgba(200, 170, 110, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }
    .lb-slot.trinket { border-radius: 50%; border-color: #0ac8b9; margin-left: 3px; width: 36px; height: 36px; }
    .lb-slot img { width: 100%; height: 100%; object-fit: cover; }
    .lb-slot-empty { font-size: 10px; color: rgba(200,170,110,0.28); }
    .lb-cnt { position: absolute; bottom: 1px; right: 2px; font-size: 9px; font-weight: 900; background: rgba(1,10,19,0.9); color: #f0e6d2; padding: 0 3px; border-radius: 2px; }
  </style>
</head>
<body>
  <div class="lb-bar" id="lbBar">
    <div class="lb-elo">
      <div class="lb-rank" id="lbRank">DIAMOND IV</div>
      <div class="lb-lp" id="lbLp">50 LP • 0W - 0L</div>
      <div class="lb-meta" id="lbMeta">⚔️ Live Build</div>
    </div>
    <div class="lb-items" id="lbItems"></div>
  </div>
  <script>
    const barEl = document.getElementById('lbBar');
    const rankEl = document.getElementById('lbRank');
    const lpEl = document.getElementById('lbLp');
    const metaEl = document.getElementById('lbMeta');
    const itemsEl = document.getElementById('lbItems');

    function fmtTime(sec) {
      const s = Math.max(0, Math.floor(Number(sec || 0)));
      const m = Math.floor(s / 60);
      const r = String(s % 60).padStart(2, '0');
      return m + ':' + r;
    }

    function renderBuild(d) {
      if (!d) return;
      barEl.style.display = d.overlayEnabled === false ? 'none' : 'inline-flex';
      if (d.overlayEnabled === false) return;
      rankEl.textContent = (d.lolRank || 'UNRANKED') + (d.lolRole ? ' • ' + d.lolRole : '');
      const wl = Number(d.lolWins || 0) + Number(d.lolLosses || 0) > 0
        ? ' • ' + Number(d.lolWins || 0) + 'W-' + Number(d.lolLosses || 0) + 'L'
        : '';
      lpEl.textContent = Number(d.lolLp || 0) + ' LP' + wl;

      const metaParts = [];
      if (d.keystone) metaParts.push('⚡ ' + d.keystone);
      if (d.currentGold > 0) metaParts.push('🪙 ' + d.currentGold + 'g');
      if (d.gameTimeSec > 0) metaParts.push('⏱️ ' + fmtTime(d.gameTimeSec));
      metaEl.textContent = metaParts.join(' • ') || ('⚔️ ' + (d.champion || 'League of Legends'));

      const bySlot = {};
      (Array.isArray(d.items) ? d.items : []).forEach((it, i) => {
        const s = typeof it.slot === 'number' ? it.slot : i;
        bySlot[s] = it;
      });
      itemsEl.innerHTML = '';
      for (let slot = 0; slot < 7; slot++) {
        const box = document.createElement('div');
        box.className = 'lb-slot' + (slot === 6 ? ' trinket' : '');
        const it = bySlot[slot];
        if (it && it.iconUrl) {
          const safeIconUrl = String(it.iconUrl).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const cnt = Number(it.count || 1) > 1 ? '<span class="lb-cnt">' + Number(it.count) + '</span>' : '';
          box.innerHTML = '<img src="' + safeIconUrl + '" alt="" />' + cnt;
        } else {
          box.innerHTML = '<span class="lb-slot-empty">' + (slot === 6 ? '👁️' : '•') + '</span>';
        }
        itemsEl.appendChild(box);
      }
    }

    function fetchLatest() {
      fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) renderBuild(d); }).catch(() => {});
    }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'game-stats') renderBuild(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest();
    connectWs();
    setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_JC_LOWERTHIRD_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — Just Chatting Bauchbinde</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .lt-wrap {
      display: flex;
      flex-direction: column;
      max-width: 900px;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 18, 46, 0.95) 100%);
      border: 1.5px solid rgba(236, 72, 153, 0.55);
      border-left: 6px solid #ec4899;
      border-radius: 12px;
      padding: 12px 18px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55), 0 0 24px rgba(236, 72, 153, 0.18);
      backdrop-filter: blur(12px);
    }
    .lt-top { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
    .lt-live { background: #ef4444; color: #fff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 999px; letter-spacing: 0.08em; text-transform: uppercase; }
    .lt-mood { background: rgba(236, 72, 153, 0.2); border: 1px solid rgba(236, 72, 153, 0.5); color: #fbcfe8; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 999px; }
    .lt-clock { margin-left: auto; font-size: 12px; font-weight: 700; color: #cbd5e1; font-variant-numeric: tabular-nums; }
    .lt-topic { font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.01em; line-height: 1.2; text-shadow: 0 2px 8px rgba(0,0,0,0.5); }
    .lt-bottom { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 5px; font-size: 12.5px; color: #cbd5e1; }
    .lt-sub { font-weight: 600; color: #f9a8d4; }
    .lt-ticker { font-size: 11.5px; color: #94a3b8; white-space: nowrap; }
  </style>
</head>
<body>
  <div class="lt-wrap" id="ltWrap">
    <div class="lt-top">
      <span class="lt-live">● LIVE TALK</span>
      <span class="lt-mood" id="ltMood">☕ Cozy Talk</span>
      <span class="lt-clock" id="ltClock">--:--</span>
    </div>
    <div class="lt-topic" id="ltTopic">Chill Talk &amp; Community Q&amp;A</div>
    <div class="lt-bottom">
      <span class="lt-sub" id="ltSub">Fragen mit !ask stellen</span>
      <span class="lt-ticker" id="ltTicker">!discord • !socials</span>
    </div>
  </div>
  <script>
    const wrapEl = document.getElementById('ltWrap');
    const moodEl = document.getElementById('ltMood');
    const clockEl = document.getElementById('ltClock');
    const topicEl = document.getElementById('ltTopic');
    const subEl = document.getElementById('ltSub');
    const tickerEl = document.getElementById('ltTicker');

    function tickClock() {
      clockEl.textContent = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
    }
    tickClock();
    setInterval(tickClock, 10000);

    function renderLt(d) {
      if (!d) return;
      wrapEl.style.display = d.overlayEnabled === false ? 'none' : 'flex';
      if (d.overlayEnabled === false) return;
      moodEl.textContent = d.jcMood || '☕ Cozy Talk';
      topicEl.textContent = d.jcTopic || 'Chill Talk & Community Q&A';
      subEl.textContent = d.jcSubtopic || '';
      tickerEl.textContent = d.jcSocialTicker || '';
    }

    function fetchLatest() {
      fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) renderLt(d); }).catch(() => {});
    }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'game-stats') renderLt(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest();
    connectWs();
    setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_JC_QNA_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — Viewer Q&A Spotlight</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .qna-card {
      max-width: 620px;
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.96) 0%, rgba(46, 16, 101, 0.95) 100%);
      border: 2px solid rgba(236, 72, 153, 0.7);
      border-radius: 16px;
      padding: 16px 20px;
      box-shadow: 0 16px 38px rgba(0,0,0,0.65), 0 0 28px rgba(236, 72, 153, 0.25);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .qna-card.hidden { opacity: 0; transform: translateY(14px); pointer-events: none; }
    .qna-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .qna-pill { background: #ec4899; color: #fff; font-size: 10.5px; font-weight: 900; padding: 3px 9px; border-radius: 999px; letter-spacing: 0.06em; text-transform: uppercase; }
    .qna-author { font-size: 14px; font-weight: 800; color: #fbcfe8; }
    .qna-plat { margin-left: auto; font-size: 10.5px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; opacity: 0.85; }
    .qna-text { font-size: 19px; font-weight: 700; color: #ffffff; line-height: 1.38; word-break: break-word; }
  </style>
</head>
<body>
  <div class="qna-card hidden" id="qnaCard">
    <div class="qna-head">
      <span class="qna-pill">❓ Zuschauer-Frage</span>
      <span class="qna-author" id="qnaAuthor">@Viewer fragt:</span>
      <span class="qna-plat" id="qnaPlat">CHAT</span>
    </div>
    <div class="qna-text" id="qnaText"></div>
  </div>
  <script>
    const cardEl = document.getElementById('qnaCard');
    const authorEl = document.getElementById('qnaAuthor');
    const platEl = document.getElementById('qnaPlat');
    const textEl = document.getElementById('qnaText');

    function renderQna(d) {
      if (!d || d.overlayEnabled === false || !d.jcActiveQuestion || !d.jcActiveQuestion.text) {
        cardEl.classList.add('hidden');
        return;
      }
      const q = d.jcActiveQuestion;
      authorEl.textContent = '@' + (q.author || 'Zuschauer') + ' fragt:';
      platEl.textContent = String(q.platform || 'chat').toUpperCase();
      textEl.textContent = '„' + q.text + '“';
      cardEl.classList.remove('hidden');
    }

    function fetchLatest() {
      fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then((d) => renderQna(d)).catch(() => {});
    }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'game-stats') renderQna(p.data);
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest();
    connectWs();
    setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_TRON_TALK_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid TRON Tech Talk &amp; GameDev Overlay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Segoe UI", monospace; color: #e0fbff; overflow: hidden; }
    @keyframes discSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes lightTrace { 0% { left: -30%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { left: 110%; opacity: 0; } }
    .tron-bar {
      position: relative;
      width: 960px;
      padding: 14px 20px 12px;
      background:
        linear-gradient(rgba(0, 240, 255, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.06) 1px, transparent 1px),
        linear-gradient(125deg, rgba(2, 10, 22, 0.95) 0%, rgba(5, 22, 40, 0.94) 60%, rgba(18, 12, 6, 0.94) 100%);
      background-size: 22px 22px, 22px 22px, 100% 100%;
      border: 1.5px solid #00f0ff;
      clip-path: polygon(0 16px, 16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px));
      box-shadow: 0 0 34px rgba(0, 240, 255, 0.30), inset 0 0 24px rgba(0, 240, 255, 0.14);
      display: grid;
      grid-template-columns: 74px 1fr auto;
      gap: 16px;
      align-items: center;
      overflow: hidden;
    }
    .tron-bar::before {
      content: "";
      position: absolute;
      top: 0;
      height: 2px;
      width: 28%;
      background: linear-gradient(90deg, transparent, #00f0ff, #ffffff, #00f0ff, transparent);
      animation: lightTrace 4.2s linear infinite;
    }
    .tron-bar::after {
      content: "";
      position: absolute;
      bottom: 0;
      height: 2px;
      width: 24%;
      background: linear-gradient(90deg, transparent, #ff6a00, #ffd199, #ff6a00, transparent);
      animation: lightTrace 5.6s linear infinite reverse;
    }
    .tron-disc {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 2.5px solid #00f0ff;
      box-shadow: 0 0 18px rgba(0, 240, 255, 0.65), inset 0 0 14px rgba(0, 240, 255, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle, rgba(0, 240, 255, 0.18), rgba(2, 10, 22, 0.9));
    }
    .tron-disc::before {
      content: "";
      position: absolute;
      inset: 6px;
      border-radius: 50%;
      border: 2px dashed rgba(255, 106, 0, 0.85);
      animation: discSpin 9s linear infinite;
    }
    .tron-disc-core { font-size: 22px; text-shadow: 0 0 12px #00f0ff; }
    .tron-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
    .tron-phase {
      padding: 2px 9px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #ff9f4d;
      background: rgba(255, 106, 0, 0.16);
      border: 1px solid #ff6a00;
      box-shadow: 0 0 10px rgba(255, 106, 0, 0.35);
    }
    .tron-project { font-size: 12px; color: #7dd3fc; letter-spacing: 0.08em; text-transform: uppercase; }
    .tron-topic {
      font-size: 23px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: 0.03em;
      text-shadow: 0 0 14px rgba(0, 240, 255, 0.55);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tron-stack-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
    .tron-chip {
      font-size: 10.5px;
      font-weight: 700;
      padding: 2px 8px;
      color: #00f0ff;
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid rgba(0, 240, 255, 0.42);
      letter-spacing: 0.06em;
    }
    .tron-ticker {
      grid-column: 1 / -1;
      margin-top: 2px;
      padding-top: 6px;
      border-top: 1px solid rgba(0, 240, 255, 0.25);
      font-size: 11px;
      color: #67e8f9;
      letter-spacing: 0.1em;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    .tron-metrics { display: flex; gap: 8px; }
    .tron-metric {
      min-width: 82px;
      padding: 8px 10px;
      background: rgba(0, 24, 42, 0.85);
      border: 1px solid rgba(0, 240, 255, 0.45);
      text-align: center;
    }
    .tron-metric.orange { border-color: rgba(255, 106, 0, 0.65); }
    .tron-m-lbl { font-size: 9px; letter-spacing: 0.14em; color: #7dd3fc; }
    .tron-metric.orange .tron-m-lbl { color: #ff9f4d; }
    .tron-m-val { font-size: 22px; font-weight: 900; color: #ffffff; text-shadow: 0 0 10px rgba(0, 240, 255, 0.65); }
    .tron-metric.orange .tron-m-val { text-shadow: 0 0 10px rgba(255, 106, 0, 0.65); }
  </style>
</head>
<body>
  <div class="tron-bar" id="tronBar">
    <div class="tron-disc"><span class="tron-disc-core">💠</span></div>
    <div style="min-width: 0;">
      <div class="tron-meta">
        <span class="tron-phase" id="tronPhase">LIVE CODING</span>
        <span class="tron-project" id="tronProject">GAMEDEV GRID</span>
      </div>
      <div class="tron-topic" id="tronTopic">Game Engine Architektur &amp; Live Coding</div>
      <div class="tron-stack-row" id="tronStackRow"></div>
    </div>
    <div class="tron-metrics">
      <div class="tron-metric orange">
        <div class="tron-m-lbl">BUGS</div>
        <div class="tron-m-val" id="tronBugs">0</div>
      </div>
      <div class="tron-metric">
        <div class="tron-m-lbl">COMMITS</div>
        <div class="tron-m-val" id="tronCommits">0</div>
      </div>
    </div>
    <div class="tron-ticker">
      <span id="tronTickerText">GRID ONLINE // !stack • !repo • !agenda</span>
      <span id="tronSectorBadge" style="color: #ff9f4d; font-weight: 800;">SECTOR 01</span>
    </div>
  </div>
  <script>
    const bar = document.getElementById('tronBar');
    const phaseEl = document.getElementById('tronPhase');
    const projEl = document.getElementById('tronProject');
    const topicEl = document.getElementById('tronTopic');
    const stackRow = document.getElementById('tronStackRow');
    const bugsEl = document.getElementById('tronBugs');
    const commitsEl = document.getElementById('tronCommits');
    const tickerEl = document.getElementById('tronTickerText');
    const sectorEl = document.getElementById('tronSectorBadge');

    function renderTron(d) {
      if (!d) return;
      bar.style.display = d.overlayEnabled === false ? 'none' : '';
      phaseEl.textContent = d.tronPhase || 'LIVE CODING';
      projEl.textContent = d.tronProject || 'GAMEDEV GRID';
      topicEl.textContent = d.tronTopic || 'Tech Talk & GameDev';
      bugsEl.textContent = String(Number(d.tronBugsFixed || 0));
      commitsEl.textContent = String(Number(d.tronCommits || 0));
      tickerEl.textContent = d.tronTickerText || 'GRID ONLINE // !stack • !repo • !agenda';
      const items = Array.isArray(d.tronAgendaItems) ? d.tronAgendaItems : [];
      const idx = Number(d.tronActiveAgendaIdx || 0);
      sectorEl.textContent = items.length ? 'SECTOR ' + String(idx + 1).padStart(2, '0') + '/' + String(items.length).padStart(2, '0') + ' :: ' + items[idx] : 'GRID ACTIVE';
      stackRow.innerHTML = '';
      String(d.tronStack || '').split(/[•,|/]+/).map((s) => s.trim()).filter(Boolean).slice(0, 6).forEach((tag) => {
        const chip = document.createElement('span');
        chip.className = 'tron-chip';
        chip.textContent = tag;
        stackRow.appendChild(chip);
      });
    }
    function fetchLatest() {
      fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) renderTron(d); }).catch(() => {});
    }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try { const p = JSON.parse(ev.data); if (p.type === 'game-stats') renderTron(p.data); } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest();
    connectWs();
    setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_PRODUCT_LOWERTHIRD_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — Produkt-Präsentation Bauchbinde</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100vw; height: 100vh; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .pr-wrap {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 16px 24px 14px 28px;
      background: linear-gradient(135deg, rgba(14, 18, 26, 0.94), rgba(22, 27, 38, 0.92));
      border: 1px solid rgba(212, 175, 55, 0.42);
      border-left: 5px solid #d4af37;
      border-radius: 10px;
      box-shadow: 0 14px 36px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
    .pr-top { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
    .pr-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #e2c779; }
    .pr-dot { width: 7px; height: 7px; border-radius: 50%; background: #d4af37; box-shadow: 0 0 10px #d4af37; }
    .pr-badges { display: flex; gap: 8px; align-items: center; }
    .pr-pill { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; padding: 4px 11px; border-radius: 999px; background: rgba(212, 175, 55, 0.14); border: 1px solid rgba(212, 175, 55, 0.52); color: #f5e6b3; white-space: nowrap; }
    .pr-pill.url { background: rgba(248, 250, 252, 0.08); border-color: rgba(248, 250, 252, 0.22); color: #e2e8f0; }
    .pr-main { display: flex; align-items: baseline; gap: 14px; margin: 4px 0; min-width: 0; }
    .pr-title { font-family: Georgia, "Times New Roman", serif; font-size: 27px; font-weight: 700; letter-spacing: 0.01em; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pr-tag { font-size: 14px; font-weight: 400; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pr-bottom { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.10); font-size: 12px; color: #94a3b8; }
    .pr-step { font-weight: 700; color: #e2c779; white-space: nowrap; }
    .pr-ticker { flex: 1; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: 0.03em; }
  </style>
</head>
<body>
  <div class="pr-wrap">
    <div class="pr-top">
      <div class="pr-eyebrow"><span class="pr-dot"></span><span>KEYNOTE SHOWCASE</span></div>
      <div class="pr-badges">
        <span class="pr-pill" id="prPrice">AB 299 € • NEU</span>
        <span class="pr-pill url" id="prUrl">shop.beispiel.de/launch</span>
      </div>
    </div>
    <div class="pr-main">
      <div class="pr-title" id="prTitle">Studio Pro Series X</div>
      <div class="pr-tag" id="prTag">Präzision, Design &amp; Leistung — Live Keynote</div>
    </div>
    <div class="pr-bottom">
      <div class="pr-step" id="prStep">01 / 04 • Willkommen &amp; Vision</div>
      <div class="pr-ticker" id="prTicker">KEYNOTE LIVE • Fragen gerne im Chat</div>
    </div>
  </div>
  <script>
    function renderProd(d) {
      if (!d) return;
      document.getElementById('prTitle').textContent = d.prodName || 'Studio Pro Series X';
      document.getElementById('prTag').textContent = d.prodTagline || '';
      const pEl = document.getElementById('prPrice');
      pEl.textContent = d.prodPriceBadge || '';
      pEl.style.display = d.prodPriceBadge ? 'inline-flex' : 'none';
      const uEl = document.getElementById('prUrl');
      uEl.textContent = d.prodPromoUrl || '';
      uEl.style.display = d.prodPromoUrl ? 'inline-flex' : 'none';
      document.getElementById('prTicker').textContent = d.prodTickerText || '';
      const items = Array.isArray(d.prodAgendaItems) ? d.prodAgendaItems : [];
      const idx = Math.min(Math.max(0, Number(d.prodActiveAgendaIdx || 0)), Math.max(0, items.length - 1));
      const num = String(idx + 1).padStart(2, '0') + ' / ' + String(Math.max(1, items.length)).padStart(2, '0');
      document.getElementById('prStep').textContent = items.length ? (num + ' • ' + items[idx]) : 'LIVE PRÄSENTATION';
    }
    fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then(renderProd).catch(() => {});
    try {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => { try { const p = JSON.parse(ev.data); if (p.type === 'game-stats') renderProd(p.data); } catch (e) {} };
    } catch (e) {}
  </script>
</body>
</html>`;

const OBS_PRODUCT_CARD_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — Produkt-Spotlight-Karte</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100vw; height: 100vh; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .pc-card {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 22px 24px;
      background: linear-gradient(155deg, rgba(14, 18, 26, 0.95), rgba(22, 28, 40, 0.93));
      border: 1px solid rgba(212, 175, 55, 0.45);
      border-top: 4px solid #d4af37;
      border-radius: 14px;
      box-shadow: 0 18px 42px rgba(0, 0, 0, 0.58), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      transition: opacity 0.35s ease, transform 0.35s ease;
    }
    .pc-card.hidden { opacity: 0; transform: translateY(14px); pointer-events: none; }
    .pc-kicker { font-size: 10.5px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #e2c779; }
    .pc-title { font-family: Georgia, "Times New Roman", serif; font-size: 26px; font-weight: 700; color: #ffffff; margin-top: 5px; line-height: 1.15; }
    .pc-sub { font-size: 13px; color: #cbd5e1; margin-top: 4px; }
    .pc-list { list-style: none; display: flex; flex-direction: column; gap: 9px; margin: 14px 0; }
    .pc-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: #f1f5f9; line-height: 1.3; }
    .pc-check { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; background: rgba(212, 175, 55, 0.18); border: 1px solid #d4af37; color: #f5e6b3; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; margin-top: 1px; }
    .pc-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.10); }
    .pc-price { font-size: 14px; font-weight: 800; color: #0f172a; background: linear-gradient(90deg, #e2c779, #d4af37); padding: 6px 14px; border-radius: 999px; letter-spacing: 0.04em; }
    .pc-url { font-size: 12px; font-weight: 600; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  </style>
</head>
<body>
  <div class="pc-card" id="pcCard">
    <div>
      <div class="pc-kicker">PRODUKT-HIGHLIGHTS</div>
      <div class="pc-title" id="pcTitle">Studio Pro Series X</div>
      <div class="pc-sub" id="pcSub">Präzision, Design &amp; Leistung — Live Keynote</div>
      <ul class="pc-list" id="pcList"></ul>
    </div>
    <div class="pc-foot">
      <div class="pc-price" id="pcPrice">AB 299 € • NEU</div>
      <div class="pc-url" id="pcUrl">shop.beispiel.de/launch</div>
    </div>
  </div>
  <script>
    function renderCard(d) {
      if (!d) return;
      const card = document.getElementById('pcCard');
      card.classList.toggle('hidden', d.prodShowCard === false);
      document.getElementById('pcTitle').textContent = d.prodName || 'Studio Pro Series X';
      document.getElementById('pcSub').textContent = d.prodTagline || '';
      document.getElementById('pcPrice').textContent = d.prodPriceBadge || 'LIVE';
      document.getElementById('pcUrl').textContent = d.prodPromoUrl || '';
      const list = document.getElementById('pcList');
      list.innerHTML = '';
      const hl = Array.isArray(d.prodHighlights) && d.prodHighlights.length ? d.prodHighlights : ['Premium Verarbeitung', 'Sofort einsatzbereit'];
      hl.forEach((txt) => {
        const li = document.createElement('li');
        const ic = document.createElement('span');
        ic.className = 'pc-check';
        ic.textContent = '✓';
        const sp = document.createElement('span');
        sp.textContent = txt;
        li.appendChild(ic);
        li.appendChild(sp);
        list.appendChild(li);
      });
    }
    fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then(renderCard).catch(() => {});
    try {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => { try { const p = JSON.parse(ev.data); if (p.type === 'game-stats') renderCard(p.data); } catch (e) {} };
    } catch (e) {}
  </script>
</body>
</html>`;

const OBS_DJ_STAGE_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — DJ Stream 36-Band Audio-EQ Bühne</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100vw; height: 100vh; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .dj-stage {
      position: relative;
      width: 100vw;
      height: 100vh;
      --dj-p: #00e5ff;
      --dj-s: #ff2a6d;
      --dj-t: #c084fc;
      --dj-bg: rgba(7, 10, 22, 0.88);
    }
    .dj-stage.scheme-sunset_house { --dj-p: #ff5e3a; --dj-s: #fbbf24; --dj-t: #ec4899; --dj-bg: rgba(20, 8, 16, 0.88); }
    .dj-stage.scheme-techno_mono { --dj-p: #f8fafc; --dj-s: #ef4444; --dj-t: #94a3b8; --dj-bg: rgba(8, 8, 10, 0.92); }
    .dj-stage.scheme-acid_rave { --dj-p: #a3e635; --dj-s: #a855f7; --dj-t: #22d3ee; --dj-bg: rgba(8, 14, 16, 0.90); }
    .dj-stage.scheme-ibiza_gold { --dj-p: #f5c542; --dj-s: #2dd4bf; --dj-t: #fde68a; --dj-bg: rgba(8, 16, 28, 0.88); }
    #djEqCanvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
    .dj-hud {
      position: absolute;
      left: 28px;
      right: 28px;
      bottom: 14px;
      height: 58px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      padding: 0 20px;
      background: var(--dj-bg);
      border: 1.5px solid var(--dj-p);
      border-radius: 12px;
      box-shadow: 0 0 24px color-mix(in srgb, var(--dj-p) 42%, transparent), inset 0 0 18px color-mix(in srgb, var(--dj-s) 20%, transparent);
    }
    .dj-left { display: flex; align-items: center; gap: 14px; min-width: 0; }
    .dj-name { font-size: 18px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; color: #ffffff; text-shadow: 0 0 12px var(--dj-p); white-space: nowrap; }
    .dj-set { font-size: 13px; font-weight: 600; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .dj-right { display: flex; align-items: center; gap: 10px; }
    .dj-pill { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; border: 1px solid var(--dj-s); background: color-mix(in srgb, var(--dj-s) 18%, transparent); color: #ffffff; white-space: nowrap; }
    .dj-pill.bpm { border-color: var(--dj-p); background: color-mix(in srgb, var(--dj-p) 18%, transparent); }
    .dj-ticker { font-size: 12px; color: #e2e8f0; max-width: 440px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  </style>
</head>
<body>
  <div class="dj-stage scheme-cyber_club" id="djStage">
    <canvas id="djEqCanvas"></canvas>
    <div class="dj-hud">
      <div class="dj-left">
        <div class="dj-name" id="djName">DJ LIVE SET</div>
        <div class="dj-set" id="djSet">Midnight Club Session Vol. 1</div>
      </div>
      <div class="dj-ticker" id="djTicker">LIVE IN THE MIX</div>
      <div class="dj-right">
        <span class="dj-pill" id="djGenre">MELODIC TECHNO</span>
        <span class="dj-pill bpm" id="djBpm">128 BPM</span>
      </div>
    </div>
  </div>
  <script>
    const stageEl = document.getElementById('djStage');
    const canvas = document.getElementById('djEqCanvas');
    const ctx = canvas.getContext('2d');
    const SCHEMES = {
      cyber_club: ['#00e5ff', '#ff2a6d', '#c084fc'],
      sunset_house: ['#ff5e3a', '#fbbf24', '#ec4899'],
      techno_mono: ['#f8fafc', '#ef4444', '#94a3b8'],
      acid_rave: ['#a3e635', '#a855f7', '#22d3ee'],
      ibiza_gold: ['#f5c542', '#2dd4bf', '#fde68a']
    };
    let curScheme = 'cyber_club';
    let bpm = 128;
    let musicPlaying = true;
    let liveEq = null;
    let liveEqAt = 0;
    const smoothBars = new Float32Array(36);

    function applyDjState(d) {
      if (!d) return;
      curScheme = SCHEMES[d.djColorScheme] ? d.djColorScheme : 'cyber_club';
      stageEl.className = 'dj-stage scheme-' + curScheme;
      document.getElementById('djName').textContent = d.djName || 'DJ LIVE SET';
      document.getElementById('djSet').textContent = d.djSetTitle || '';
      document.getElementById('djGenre').textContent = d.djGenre || 'CLUB MIX';
      bpm = Math.max(60, Math.min(220, Number(d.djBpm || 128)));
      document.getElementById('djBpm').textContent = bpm + ' BPM';
      if (d.djTickerText) document.getElementById('djTicker').textContent = d.djTickerText;
    }

    function tick(now) {
      requestAnimationFrame(tick);
      const w = window.innerWidth, h = window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      ctx.clearRect(0, 0, w, h);
      const cols = SCHEMES[curScheme] || SCHEMES.cyber_club;
      const fresh = liveEq && (now - liveEqAt) < 700;
      const fft = fresh && Array.isArray(liveEq.bands) && liveEq.bands.length >= 18 ? liveEq.bands : null;
      const beatPhase = (now / 1000) * (bpm / 60) * Math.PI * 2;
      const beatPulse = Math.pow(Math.max(0, Math.sin(beatPhase * 0.5)), 4);

      const barCount = 36;
      const padX = 32;
      const usableW = w - padX * 2;
      const gap = 8;
      const barW = Math.max(6, (usableW - gap * (barCount - 1)) / barCount);
      const baseY = h - 78;
      const maxBarH = Math.max(40, h - 92);

      let avgEnergy = 0;
      for (let i = 0; i < barCount; i++) {
        const distMid = Math.abs(i - (barCount - 1) / 2) / ((barCount - 1) / 2);
        const bandIdx = Math.min(17, Math.floor(distMid * 17));
        let target = 0.08;
        if (fft) {
          target = Math.max(0.06, fft[bandIdx]);
        } else if (fresh && typeof liveEq.level === 'number') {
          const side = i < barCount / 2 ? (liveEq.left ?? liveEq.level) : (liveEq.right ?? liveEq.level);
          const shape = (1 - distMid * 0.45) * (0.68 + 0.32 * Math.sin(now * 0.015 + i * 0.7));
          target = Math.max(0.06, Math.min(1, side * shape * 1.15));
        } else if (musicPlaying) {
          const wave = Math.abs(Math.sin(now * 0.005 + i * 0.45) * Math.cos(now * 0.0028 - i * 0.22));
          target = 0.14 + wave * (0.55 + beatPulse * 0.35) * (1 - distMid * 0.35);
        }
        smoothBars[i] += (target - smoothBars[i]) * 0.28;
        avgEnergy += smoothBars[i];
      }
      avgEnergy /= barCount;

      // Pulsing bass glow along bottom floor
      const gradFloor = ctx.createLinearGradient(0, baseY - 40, 0, baseY + 12);
      gradFloor.addColorStop(0, 'rgba(0,0,0,0)');
      gradFloor.addColorStop(1, cols[0]);
      ctx.globalAlpha = 0.16 + avgEnergy * 0.42;
      ctx.fillStyle = gradFloor;
      ctx.fillRect(padX, baseY - 40, usableW, 52);

      const barGrad = ctx.createLinearGradient(0, baseY, 0, baseY - maxBarH);
      barGrad.addColorStop(0, cols[0]);
      barGrad.addColorStop(0.58, cols[1]);
      barGrad.addColorStop(1, cols[2]);
      ctx.globalAlpha = 0.94;
      ctx.fillStyle = barGrad;

      for (let i = 0; i < barCount; i++) {
        const bh = Math.max(4, smoothBars[i] * maxBarH);
        const x = padX + i * (barW + gap);
        ctx.fillRect(x, baseY - bh, barW, bh);
        // Peak cap
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, baseY - bh - 4, barW, 2.5);
        ctx.fillStyle = barGrad;
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(tick);

    fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then(applyDjState).catch(() => {});
    try {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'game-stats') applyDjState(p.data);
          else if (p.type === 'spotify' && p.data) {
            musicPlaying = p.data.isPlaying !== false && Boolean(p.data.title);
            if (p.data.title) {
              document.getElementById('djTicker').textContent = '🎵 ' + p.data.title + (p.data.artist ? ' — ' + p.data.artist : '');
            }
          } else if (p.type === 'audio-eq' && p.data) {
            liveEq = p.data;
            liveEqAt = performance.now();
          }
        } catch (e) {}
      };
    } catch (e) {}
  </script>
</body>
</html>`;

const OBS_DJ_NOWPLAYING_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Studio — DJ Stream Vinyl &amp; BPM Deck</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100vw; height: 100vh; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .dj-deck {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 18px;
      --dj-p: #00e5ff;
      --dj-s: #ff2a6d;
      --dj-t: #c084fc;
      background: linear-gradient(135deg, rgba(8, 11, 24, 0.94), rgba(16, 10, 28, 0.94));
      border: 2px solid var(--dj-p);
      border-radius: 16px;
      box-shadow: 0 0 24px color-mix(in srgb, var(--dj-p) 45%, transparent);
    }
    .dj-deck.scheme-sunset_house { --dj-p: #ff5e3a; --dj-s: #fbbf24; --dj-t: #ec4899; }
    .dj-deck.scheme-techno_mono { --dj-p: #f8fafc; --dj-s: #ef4444; --dj-t: #94a3b8; }
    .dj-deck.scheme-acid_rave { --dj-p: #a3e635; --dj-s: #a855f7; --dj-t: #22d3ee; }
    .dj-deck.scheme-ibiza_gold { --dj-p: #f5c542; --dj-s: #2dd4bf; --dj-t: #fde68a; }
    .dj-vinyl {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      flex-shrink: 0;
      background: radial-gradient(circle, var(--dj-s) 0 18%, #090d16 19% 25%, #161e2e 26% 30%, #090d16 31% 52%, #1e293b 53% 56%, #090d16 57% 100%);
      border: 2.5px solid var(--dj-p);
      box-shadow: 0 0 18px color-mix(in srgb, var(--dj-p) 65%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: djSpin 3.2s linear infinite;
    }
    .dj-vinyl.paused { animation-play-state: paused; }
    .dj-vinyl-dot { width: 14px; height: 14px; border-radius: 50%; background: #ffffff; box-shadow: 0 0 8px var(--dj-p); }
    @keyframes djSpin { to { transform: rotate(360deg); } }
    .dj-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
    .dj-top-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .dj-kicker { font-size: 10.5px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: var(--dj-p); }
    .dj-bpm-tag { font-size: 11px; font-weight: 900; padding: 2px 9px; border-radius: 999px; background: color-mix(in srgb, var(--dj-s) 22%, transparent); border: 1px solid var(--dj-s); color: #ffffff; }
    .dj-track { font-size: 18px; font-weight: 900; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .dj-artist { font-size: 12.5px; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .dj-mini-eq { display: flex; align-items: flex-end; gap: 4px; height: 22px; margin-top: 3px; }
    .dj-mini-bar { flex: 1; border-radius: 2px 2px 0 0; background: linear-gradient(180deg, var(--dj-s), var(--dj-p)); height: 20%; transition: height 0.06s linear; }
  </style>
</head>
<body>
  <div class="dj-deck scheme-cyber_club" id="djDeck">
    <div class="dj-vinyl" id="djVinyl"><div class="dj-vinyl-dot"></div></div>
    <div class="dj-info">
      <div class="dj-top-row">
        <span class="dj-kicker" id="djDeckGenre">MELODIC TECHNO</span>
        <span class="dj-bpm-tag" id="djDeckBpm">128 BPM</span>
      </div>
      <div class="dj-track" id="djDeckTrack">Midnight Club Session Vol. 1</div>
      <div class="dj-artist" id="djDeckArtist">DJ LIVE SET</div>
      <div class="dj-mini-eq" id="djMiniEq"></div>
    </div>
  </div>
  <script>
    const deck = document.getElementById('djDeck');
    const vinyl = document.getElementById('djVinyl');
    const miniEq = document.getElementById('djMiniEq');
    for (let i = 0; i < 14; i++) {
      const b = document.createElement('div');
      b.className = 'dj-mini-bar';
      miniEq.appendChild(b);
    }
    let hasSpotifyTrack = false;
    let musicPlaying = true;
    let liveEq = null;
    let liveEqAt = 0;

    function applyDeck(d) {
      if (!d) return;
      deck.className = 'dj-deck scheme-' + (d.djColorScheme || 'cyber_club');
      document.getElementById('djDeckGenre').textContent = d.djGenre || 'CLUB MIX';
      const bpm = Math.max(60, Math.min(220, Number(d.djBpm || 128)));
      document.getElementById('djDeckBpm').textContent = bpm + ' BPM';
      vinyl.style.animationDuration = (60 / bpm * 4).toFixed(2) + 's';
      if (!hasSpotifyTrack) {
        document.getElementById('djDeckTrack').textContent = d.djSetTitle || 'LIVE SET';
        document.getElementById('djDeckArtist').textContent = d.djName || 'DJ LIVE SET';
      }
    }

    function tickMini(now) {
      requestAnimationFrame(tickMini);
      const bars = miniEq.children;
      const fresh = liveEq && (now - liveEqAt) < 700;
      const fft = fresh && Array.isArray(liveEq.bands) && liveEq.bands.length >= 14 ? liveEq.bands : null;
      vinyl.classList.toggle('paused', !fresh && !musicPlaying);
      for (let i = 0; i < bars.length; i++) {
        let h = 14;
        if (fft) h = Math.max(12, Math.min(100, Math.round(fft[i] * 100)));
        else if (fresh && typeof liveEq.level === 'number') h = Math.max(12, Math.min(100, Math.round(14 + liveEq.level * (0.65 + 0.35 * Math.sin(now * 0.02 + i)) * 92)));
        else if (musicPlaying) h = Math.round(18 + Math.abs(Math.sin(now * 0.006 + i * 0.55)) * 74);
        bars[i].style.height = h + '%';
      }
    }
    requestAnimationFrame(tickMini);

    fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then(applyDeck).catch(() => {});
    try {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'game-stats') applyDeck(p.data);
          else if (p.type === 'spotify' && p.data) {
            musicPlaying = p.data.isPlaying !== false && Boolean(p.data.title);
            if (p.data.title) {
              hasSpotifyTrack = true;
              document.getElementById('djDeckTrack').textContent = p.data.title;
              document.getElementById('djDeckArtist').textContent = p.data.artist || '';
            }
          } else if (p.type === 'audio-eq' && p.data) {
            liveEq = p.data;
            liveEqAt = performance.now();
          }
        } catch (e) {}
      };
    } catch (e) {}
  </script>
</body>
</html>`;

const OBS_VAL_BAR_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Valorant Rank &amp; Match Bar</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #ece8e1; overflow: hidden; }
    .val-bar {
      width: 550px;
      padding: 12px 16px;
      background: linear-gradient(135deg, rgba(15, 25, 35, 0.96) 0%, rgba(19, 28, 39, 0.95) 65%, rgba(45, 16, 22, 0.94) 100%);
      border: 1.5px solid #ff4655;
      clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
      box-shadow: 0 0 28px rgba(255, 70, 85, 0.28);
      display: grid;
      grid-template-columns: 1.35fr 1fr 1fr;
      gap: 12px;
      align-items: center;
    }
    .val-rank-lbl { font-size: 10px; font-weight: 800; letter-spacing: 0.12em; color: #ff6b78; text-transform: uppercase; }
    .val-rank-name { font-size: 18px; font-weight: 900; letter-spacing: 0.04em; text-transform: uppercase; color: #ece8e1; }
    .val-rr-track { height: 6px; background: rgba(236, 232, 225, 0.14); margin-top: 5px; overflow: hidden; }
    .val-rr-fill { height: 100%; background: linear-gradient(90deg, #ff4655, #ff8b94); transition: width 0.3s ease; }
    .val-box { padding: 7px 10px; background: rgba(255, 255, 255, 0.04); border-left: 2.5px solid #ff4655; }
    .val-box-lbl { font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em; color: #94a3b8; text-transform: uppercase; }
    .val-box-val { font-size: 16px; font-weight: 900; color: #ece8e1; margin-top: 2px; }
    .val-sub { font-size: 11px; color: #cbd5e1; margin-top: 2px; }
  </style>
</head>
<body>
  <div class="val-bar" id="valBar">
    <div>
      <div class="val-rank-lbl" id="valAgentMap">JETT • ASCENT</div>
      <div class="val-rank-name"><span id="valRank">DIAMOND II</span> <span id="valRrText" style="font-size: 13px; color: #ff6b78;">62 RR</span></div>
      <div class="val-rr-track"><div class="val-rr-fill" id="valRrFill" style="width: 62%;"></div></div>
    </div>
    <div class="val-box">
      <div class="val-box-lbl">SCORE / KDA</div>
      <div class="val-box-val" id="valScore">7 : 5</div>
      <div class="val-sub" id="valKda">0/0/0 • HS 28%</div>
    </div>
    <div class="val-box">
      <div class="val-box-lbl">SESSION</div>
      <div class="val-box-val" id="valSession">0W - 0L</div>
      <div class="val-sub" id="valRiotId">VALORANT LIVE</div>
    </div>
  </div>
  <script>
    const bar = document.getElementById('valBar');
    function renderVal(d) {
      if (!d) return;
      bar.style.display = d.overlayEnabled === false ? 'none' : '';
      document.getElementById('valAgentMap').textContent = (d.valAgent || 'JETT') + ' • ' + (d.valMap || 'ASCENT');
      document.getElementById('valRank').textContent = d.valRank || 'UNRANKED';
      const rr = Math.max(0, Math.min(100, Number(d.valRr || 0)));
      document.getElementById('valRrText').textContent = rr + ' RR';
      document.getElementById('valRrFill').style.width = rr + '%';
      document.getElementById('valScore').textContent = d.valScore || '0 : 0';
      document.getElementById('valKda').textContent = Number(d.valKills || 0) + '/' + Number(d.valDeaths || 0) + '/' + Number(d.valAssists || 0) + ' • HS ' + Number(d.valHsPercent || 0) + '%';
      document.getElementById('valSession').textContent = Number(d.valWins || 0) + 'W - ' + Number(d.valLosses || 0) + 'L';
      document.getElementById('valRiotId').textContent = d.valRiotId || 'VALORANT LIVE';
    }
    function fetchLatest() { fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) renderVal(d); }).catch(() => {}); }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => { try { const p = JSON.parse(ev.data); if (p.type === 'game-stats') renderVal(p.data); } catch (e) {} };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest(); connectWs(); setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_VAL_MAP_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Valorant Anti-Snipe Radar Cover</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; background: transparent; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; overflow: hidden; }
    .cover {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 18px;
      text-align: center;
      background:
        repeating-linear-gradient(45deg, rgba(255, 70, 85, 0.08) 0 10px, transparent 10px 20px),
        linear-gradient(155deg, rgba(15, 25, 35, 0.98), rgba(9, 14, 22, 0.98));
      border: 2px solid #ff4655;
      clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
      color: #ece8e1;
    }
    .cover.hidden { display: none; }
    .cover-icon { font-size: 32px; }
    .cover-title { font-size: 13px; font-weight: 900; letter-spacing: 0.14em; color: #ff4655; text-transform: uppercase; }
    .cover-sub { font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="cover hidden" id="valMapCover">
    <div class="cover-icon">🛡️</div>
    <div class="cover-title" id="valMapText">RADAR VERDECKT // ANTI-SNIPE</div>
    <div class="cover-sub" id="valMapAgent">VALORANT TACTICAL SHIELD</div>
  </div>
  <script>
    const el = document.getElementById('valMapCover');
    function renderCover(d) {
      if (!d) return;
      const show = d.overlayEnabled !== false && Boolean(d.valMapCoverEnabled);
      el.classList.toggle('hidden', !show);
      document.getElementById('valMapText').textContent = d.valMapCoverText || 'RADAR VERDECKT // ANTI-SNIPE';
      document.getElementById('valMapAgent').textContent = (d.valAgent || 'AGENT') + ' • ' + (d.valMap || 'MAP');
    }
    function fetchLatest() { fetch('/api/game-stats').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) renderCover(d); }).catch(() => {}); }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => { try { const p = JSON.parse(ev.data); if (p.type === 'game-stats') renderCover(p.data); } catch (e) {} };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest(); connectWs(); setInterval(fetchLatest, 4000);
  </script>
</body>
</html>`;

const OBS_SPONSORS_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>OmniGrid Werbepartner Overlay</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; overflow: hidden; }
    .sp-wrap { width: 450px; padding: 6px; }
    .sp-card {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px 15px;
      background: linear-gradient(145deg, rgba(10, 15, 28, 0.95), rgba(15, 23, 42, 0.94));
      border: 1.5px solid var(--sp-accent, #38bdf8);
      border-radius: 14px;
      box-shadow: 0 0 26px rgba(56, 189, 248, 0.22), 0 12px 28px rgba(0, 0, 0, 0.55);
      text-decoration: none;
      color: inherit;
      overflow: hidden;
      transition: opacity 0.35s ease, transform 0.35s ease;
    }
    .sp-card.is-hidden { opacity: 0; transform: translateY(10px); pointer-events: none; }
    .sp-card.is-clickable { cursor: pointer; }
    .sp-logo {
      width: 72px;
      height: 72px;
      border-radius: 10px;
      object-fit: contain;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      flex-shrink: 0;
      padding: 4px;
    }
    .sp-logo.empty { display: none; }
    .sp-body { flex: 1; min-width: 0; }
    .sp-top { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
    .sp-badge {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 2px 7px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.18);
      border: 1px solid var(--sp-accent, #38bdf8);
      color: var(--sp-accent, #38bdf8);
    }
    .sp-next-hint { font-size: 9.5px; color: #94a3b8; margin-left: auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sp-title { font-size: 17px; font-weight: 900; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sp-sub { font-size: 12.5px; color: #cbd5e1; margin-top: 2px; line-height: 1.3; }
    .sp-url { font-size: 10.5px; color: var(--sp-accent, #38bdf8); margin-top: 5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sp-qr-box {
      width: 74px;
      height: 74px;
      border-radius: 8px;
      background: #ffffff;
      padding: 4px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sp-qr-box.hidden { display: none; }
    .sp-qr-box img { width: 100%; height: 100%; display: block; }
    .sp-prog-track {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 3.5px;
      background: rgba(255, 255, 255, 0.1);
    }
    .sp-prog-track.hidden { display: none; }
    .sp-prog-fill {
      height: 100%;
      width: 0%;
      background: var(--sp-accent, #38bdf8);
    }
  </style>
</head>
<body>
  <div class="sp-wrap">
    <a class="sp-card is-hidden" id="spCard" target="_blank" rel="noopener noreferrer">
      <img class="sp-logo empty" id="spLogo" alt="" />
      <div class="sp-body">
        <div class="sp-top">
          <span class="sp-badge" id="spBadge">WERBUNG</span>
          <span class="sp-next-hint" id="spCounter"></span>
        </div>
        <div class="sp-title" id="spTitle"></div>
        <div class="sp-sub" id="spSub"></div>
        <div class="sp-url" id="spUrl"></div>
      </div>
      <div class="sp-qr-box hidden" id="spQrBox"><img id="spQrImg" alt="QR" /></div>
      <div class="sp-prog-track" id="spProgTrack"><div class="sp-prog-fill" id="spProgFill"></div></div>
    </a>
  </div>
  <script>
    const card = document.getElementById('spCard');
    const logo = document.getElementById('spLogo');
    const badge = document.getElementById('spBadge');
    const counter = document.getElementById('spCounter');
    const titleEl = document.getElementById('spTitle');
    const subEl = document.getElementById('spSub');
    const urlEl = document.getElementById('spUrl');
    const qrBox = document.getElementById('spQrBox');
    const qrImg = document.getElementById('spQrImg');
    const progTrack = document.getElementById('spProgTrack');
    const progFill = document.getElementById('spProgFill');

    let state = { enabled: true, pauseBetweenSec: 0, showQrCode: true, showProgressBar: true, activeIndex: 0, items: [] };
    let idx = 0;
    let rotTimer = null;
    let pauseTimer = null;
    let lastRevision = '';

    function clearTimers() {
      if (rotTimer) { clearTimeout(rotTimer); rotTimer = null; }
      if (pauseTimer) { clearTimeout(pauseTimer); pauseTimer = null; }
    }

    function cleanDisplayUrl(raw) {
      return String(raw || '').replace(/^https?:\\/\\//i, '').replace(/\\/$/, '');
    }

    function showSlide(nextIdx) {
      clearTimers();
      const activeItems = (state.items || []).filter((it) => it && it.enabled !== false && (it.name || it.resolvedImageUrl));
      if (!state.enabled || !activeItems.length) {
        card.classList.add('is-hidden');
        return;
      }
      idx = ((nextIdx % activeItems.length) + activeItems.length) % activeItems.length;
      const item = activeItems[idx];
      const durationMs = Math.max(3, Math.min(600, Number(item.durationSec || 15))) * 1000;
      const pauseMs = Math.max(0, Math.min(300, Number(state.pauseBetweenSec || 0))) * 1000;

      card.style.setProperty('--sp-accent', item.accentColor || '#38bdf8');
      badge.textContent = item.badge || 'WERBUNG';
      titleEl.textContent = item.name || 'Partner';
      subEl.textContent = item.subtitle || '';
      subEl.style.display = item.subtitle ? '' : 'none';
      counter.textContent = activeItems.length > 1 ? (idx + 1) + ' / ' + activeItems.length : '';

      const safeHref = /^https?:\\/\\//i.test(item.url || '') ? item.url : '';
      if (safeHref) {
        card.setAttribute('href', safeHref);
        card.classList.add('is-clickable');
        urlEl.textContent = '🔗 ' + cleanDisplayUrl(safeHref);
        urlEl.style.display = '';
      } else {
        card.removeAttribute('href');
        card.classList.remove('is-clickable');
        urlEl.textContent = '';
        urlEl.style.display = 'none';
      }

      if (item.resolvedImageUrl) {
        logo.src = item.resolvedImageUrl;
        logo.classList.remove('empty');
      } else {
        logo.removeAttribute('src');
        logo.classList.add('empty');
      }

      if (state.showQrCode !== false && item.qrDataUrl && safeHref) {
        qrImg.src = item.qrDataUrl;
        qrBox.classList.remove('hidden');
      } else {
        qrBox.classList.add('hidden');
      }

      progTrack.classList.toggle('hidden', state.showProgressBar === false || activeItems.length <= 1);
      progFill.style.transition = 'none';
      progFill.style.width = '0%';
      card.classList.remove('is-hidden');
      void progFill.offsetWidth;
      progFill.style.transition = 'width ' + durationMs + 'ms linear';
      progFill.style.width = '100%';

      if (activeItems.length > 1 || pauseMs > 0) {
        rotTimer = setTimeout(() => {
          if (pauseMs > 0) {
            card.classList.add('is-hidden');
            pauseTimer = setTimeout(() => showSlide(idx + 1), pauseMs);
          } else {
            showSlide(idx + 1);
          }
        }, durationMs);
      }
    }

    function applyState(next) {
      if (!next) return;
      const rev = String(next.revision || '');
      if (rev && rev === lastRevision) return;
      lastRevision = rev;
      state = next;
      showSlide(Number(next.activeIndex || 0));
    }

    function fetchLatest() {
      fetch('/api/sponsors').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) applyState(d); }).catch(() => {});
    }
    function connectWs() {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try { const p = JSON.parse(ev.data); if (p.type === 'sponsors') applyState(p.data); } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectWs, 2000);
    }
    fetchLatest();
    connectWs();
  </script>
</body>
</html>`;

const ALL_OVERLAY_CARDS_SEL = [
  '.gs-card', '.lb-bar', '.map-cover', '.sp-card', '.goal-wrap', '.poll-card',
  '.gw-card', '.sched-card', '.alert-card', '.lt-wrap', '.qna-card',
  '.tron-bar', '.val-bar', '.cover'
];

const CHAMPION_THEME_INJECT_SNIPPET = `<style id="omniChampThemeStyle">
@keyframes jinxGlitchBorder {
  0%, 92%, 100% { box-shadow: 0 0 22px rgba(255, 42, 133, 0.45), inset 0 0 14px rgba(57, 255, 20, 0.14); border-color: var(--ct-primary, #ff2a85); }
  94% { box-shadow: -3px 0 26px rgba(57, 255, 20, 0.7), 3px 0 26px rgba(255, 42, 133, 0.7); border-color: var(--ct-secondary, #39ff14); transform: translateX(1px); }
  96% { box-shadow: 3px 0 24px rgba(0, 245, 212, 0.65), -2px 0 24px rgba(255, 42, 133, 0.7); border-color: var(--ct-tertiary, #00f5d4); transform: translateX(-1px); }
}
@keyframes kdaFirePulse {
  0%, 100% { box-shadow: 0 0 24px rgba(255, 59, 92, 0.56), inset 0 0 18px rgba(255, 122, 0, 0.22); border-color: var(--ct-primary, #ff3b5c); }
  50% { box-shadow: 0 0 32px rgba(255, 122, 0, 0.64), 0 0 18px rgba(0, 245, 255, 0.45), inset 0 0 20px rgba(255, 59, 92, 0.24); border-color: var(--ct-secondary, #ff7a00); }
}
@keyframes risenLegendGlow {
  0%, 100% { box-shadow: 0 0 24px rgba(245, 197, 66, 0.48), inset 0 0 16px rgba(255, 46, 85, 0.18); border-color: var(--ct-primary, #f5c542); }
  50% { box-shadow: 0 0 30px rgba(255, 46, 85, 0.55), 0 0 18px rgba(245, 197, 66, 0.55), inset 0 0 18px rgba(245, 197, 66, 0.2); border-color: #ffe07d; }
}
@keyframes inkshadowPulse {
  0%, 100% { box-shadow: 0 0 22px rgba(20, 241, 198, 0.42), inset 0 0 18px rgba(255, 59, 78, 0.14); border-color: var(--ct-primary, #14f1c6); }
  50% { box-shadow: 0 0 28px rgba(255, 59, 78, 0.48), 0 0 14px rgba(20, 241, 198, 0.45), inset 0 0 20px rgba(20, 241, 198, 0.18); border-color: var(--ct-secondary, #ff3b4e); }
}
@keyframes kdaAllOutShimmer {
  0%, 100% { box-shadow: 0 0 24px rgba(103, 232, 249, 0.48), inset 0 0 18px rgba(244, 114, 182, 0.18); border-color: var(--ct-primary, #67e8f9); }
  50% { box-shadow: 0 0 30px rgba(244, 114, 182, 0.55), 0 0 18px rgba(196, 181, 253, 0.5), inset 0 0 20px rgba(103, 232, 249, 0.22); border-color: var(--ct-secondary, #f472b6); }
}
@keyframes darkCosmicPulse {
  0%, 100% { box-shadow: 0 0 26px rgba(168, 85, 247, 0.52), inset 0 0 20px rgba(255, 123, 41, 0.16); border-color: var(--ct-primary, #a855f7); }
  50% { box-shadow: 0 0 32px rgba(255, 123, 41, 0.52), 0 0 20px rgba(236, 72, 153, 0.48), inset 0 0 22px rgba(168, 85, 247, 0.24); border-color: var(--ct-secondary, #ff7b29); }
}
@keyframes blackRosePulse {
  0%, 100% { box-shadow: 0 0 24px rgba(225, 29, 72, 0.48), inset 0 0 18px rgba(212, 175, 55, 0.16); border-color: var(--ct-primary, #e11d48); }
  50% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.5), 0 0 16px rgba(225, 29, 72, 0.5), inset 0 0 20px rgba(225, 29, 72, 0.2); border-color: var(--ct-secondary, #d4af37); }
}
@keyframes ravenbornPulse {
  0%, 100% { box-shadow: 0 0 24px rgba(45, 212, 191, 0.45), inset 0 0 18px rgba(139, 92, 246, 0.18); border-color: var(--ct-primary, #2dd4bf); }
  50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.52), 0 0 16px rgba(45, 212, 191, 0.45), inset 0 0 20px rgba(45, 212, 191, 0.2); border-color: var(--ct-secondary, #8b5cf6); }
}
@keyframes elementalistCycle {
  0%, 100% { box-shadow: 0 0 26px rgba(253, 224, 71, 0.48), inset 0 0 18px rgba(56, 189, 248, 0.18); border-color: #fde047; }
  33% { box-shadow: 0 0 28px rgba(56, 189, 248, 0.52), inset 0 0 18px rgba(232, 121, 249, 0.2); border-color: #38bdf8; }
  66% { box-shadow: 0 0 28px rgba(232, 121, 249, 0.52), inset 0 0 18px rgba(253, 224, 71, 0.2); border-color: #e879f9; }
}
@keyframes highNoonEmber {
  0%, 100% { box-shadow: 0 0 24px rgba(255, 90, 31, 0.52), inset 0 0 18px rgba(245, 158, 11, 0.18); border-color: var(--ct-primary, #ff5a1f); }
  50% { box-shadow: 0 0 32px rgba(220, 38, 38, 0.55), 0 0 18px rgba(245, 158, 11, 0.5), inset 0 0 20px rgba(255, 90, 31, 0.24); border-color: var(--ct-secondary, #f59e0b); }
}
@keyframes arcanePrestigeGlow {
  0%, 100% { box-shadow: 0 0 24px rgba(243, 207, 122, 0.48), inset 0 0 18px rgba(56, 189, 248, 0.16); border-color: var(--ct-primary, #f3cf7a); }
  50% { box-shadow: 0 0 30px rgba(56, 189, 248, 0.52), 0 0 18px rgba(243, 207, 122, 0.45), inset 0 0 20px rgba(243, 207, 122, 0.2); border-color: #fef08a; }
}
@keyframes prestigeCosmicGlow {
  0%, 100% { box-shadow: 0 0 26px rgba(250, 204, 21, 0.48), inset 0 0 18px rgba(192, 132, 252, 0.18); border-color: var(--ct-primary, #facc15); }
  50% { box-shadow: 0 0 32px rgba(192, 132, 252, 0.55), 0 0 18px rgba(250, 204, 21, 0.5), inset 0 0 20px rgba(224, 231, 255, 0.2); border-color: var(--ct-secondary, #c084fc); }
}
@keyframes godKingAura {
  0%, 100% { box-shadow: 0 0 26px rgba(239, 68, 68, 0.54), inset 0 0 18px rgba(251, 191, 36, 0.20); border-color: var(--ct-primary, #ef4444); }
  50% { box-shadow: 0 0 34px rgba(251, 191, 36, 0.54), 0 0 18px rgba(239, 68, 68, 0.54), inset 0 0 22px rgba(239, 68, 68, 0.24); border-color: var(--ct-secondary, #fbbf24); }
}
@keyframes radiantCloudGlow {
  0%, 100% { box-shadow: 0 0 26px rgba(251, 191, 36, 0.50), inset 0 0 18px rgba(52, 211, 153, 0.18); border-color: var(--ct-primary, #fbbf24); }
  50% { box-shadow: 0 0 32px rgba(52, 211, 153, 0.52), 0 0 18px rgba(244, 63, 94, 0.42), inset 0 0 20px rgba(251, 191, 36, 0.22); border-color: var(--ct-secondary, #34d399); }
}
@keyframes soulFighterPulse {
  0%, 100% { box-shadow: 4px 4px 0 rgba(255, 31, 113, 0.85), 0 0 24px rgba(34, 211, 238, 0.50); border-color: var(--ct-primary, #22d3ee); }
  50% { box-shadow: 4px 4px 0 rgba(34, 211, 238, 0.90), 0 0 28px rgba(255, 31, 113, 0.55); border-color: var(--ct-secondary, #ff1f71); }
}
@keyframes blossomSpringsGlow {
  0%, 100% { box-shadow: 0 0 24px rgba(94, 234, 212, 0.45), inset 0 0 20px rgba(251, 113, 133, 0.16); border-color: var(--ct-primary, #5eead4); }
  50% { box-shadow: 0 0 30px rgba(251, 113, 133, 0.48), 0 0 18px rgba(253, 230, 138, 0.40), inset 0 0 22px rgba(94, 234, 212, 0.20); border-color: var(--ct-secondary, #fb7185); }
}
@keyframes zaunLabFramePulse {
  0%, 100% { box-shadow: 0 0 24px rgba(118, 255, 3, 0.50), inset 0 0 18px rgba(0, 229, 255, 0.18); border-color: var(--ct-primary, #76ff03); }
  50% { box-shadow: 0 0 34px rgba(0, 229, 255, 0.58), 0 0 18px rgba(250, 204, 21, 0.42), inset 0 0 22px rgba(118, 255, 3, 0.24); border-color: var(--ct-secondary, #00e5ff); }
}
body.champ-fx-jinx-glitch .msg-row {
  background:
    repeating-linear-gradient(-45deg, rgba(255, 42, 133, 0.08) 0 8px, rgba(57, 255, 20, 0.05) 8px 16px, transparent 16px 32px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(18, 6, 26, 0.94)), var(--ct-bg-end, rgba(6, 18, 22, 0.95))) !important;
  border: 1.5px solid var(--ct-primary, #ff2a85) !important;
  border-left: 4px solid var(--ct-secondary, #39ff14) !important;
  border-radius: 2px !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  color: var(--ct-text, #fff0f7) !important;
  margin-bottom: 5px;
  box-shadow: 0 0 16px rgba(255, 42, 133, 0.28), -2px 0 0 rgba(57, 255, 20, 0.35);
}
body.champ-fx-jinx-glitch .author { text-shadow: 0 0 9px rgba(255, 42, 133, 0.65), 1px 0 0 rgba(57, 255, 20, 0.45); letter-spacing: 0.04em; }
body.champ-fx-jinx-glitch .badge { background: rgba(255, 42, 133, 0.24) !important; border: 1px solid var(--ct-secondary, #39ff14) !important; color: var(--ct-secondary, #39ff14) !important; }
body.champ-fx-jinx-glitch #pinnedBox {
  background: linear-gradient(135deg, rgba(24, 6, 32, 0.97), rgba(8, 22, 24, 0.97)) !important;
  border: 2px solid var(--ct-primary, #ff2a85) !important;
  animation: jinxGlitchBorder 4.5s infinite;
}
body.champ-fx-jinx-glitch .pin-label { color: var(--ct-secondary, #39ff14) !important; }
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-jinx-glitch ${s}`).join(',\n')} {
  background:
    repeating-linear-gradient(-45deg, rgba(255, 42, 133, 0.09) 0 10px, rgba(57, 255, 20, 0.06) 10px 20px, transparent 20px 40px),
    linear-gradient(145deg, var(--ct-bg-start, rgba(18, 6, 26, 0.96)), var(--ct-bg-end, rgba(6, 18, 22, 0.96))) !important;
  border: 2px solid var(--ct-primary, #ff2a85) !important;
  border-radius: 3px !important;
  clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
  animation: jinxGlitchBorder 4.5s infinite;
}
body.champ-fx-jinx-glitch .gs-card::before,
body.champ-fx-jinx-glitch .map-cover::before { border-color: var(--ct-secondary, #39ff14) !important; }
body.champ-fx-jinx-glitch .gs-card::after,
body.champ-fx-jinx-glitch .map-cover::after { border-color: var(--ct-primary, #ff2a85) !important; }
body.champ-fx-jinx-glitch .gs-head,
body.champ-fx-jinx-glitch .gs-matches-wrap,
body.champ-fx-jinx-glitch .lb-elo,
body.champ-fx-jinx-glitch .sched-head { border-color: rgba(255, 42, 133, 0.45) !important; }
body.champ-fx-jinx-glitch .gs-title,
body.champ-fx-jinx-glitch .gs-champ-name,
body.champ-fx-jinx-glitch .lb-rank,
body.champ-fx-jinx-glitch .map-title,
body.champ-fx-jinx-glitch .sp-title,
body.champ-fx-jinx-glitch .goal-title,
body.champ-fx-jinx-glitch .poll-q,
body.champ-fx-jinx-glitch .gw-title,
body.champ-fx-jinx-glitch .sched-title,
body.champ-fx-jinx-glitch .al-author,
body.champ-fx-jinx-glitch .lt-topic,
body.champ-fx-jinx-glitch .qna-author,
body.champ-fx-jinx-glitch .tron-topic,
body.champ-fx-jinx-glitch .val-rank-name,
body.champ-fx-jinx-glitch .cover-title { color: #ffffff !important; text-shadow: 0 0 12px rgba(255, 42, 133, 0.8), 2px 0 0 rgba(57, 255, 20, 0.55) !important; }
body.champ-fx-jinx-glitch .gs-badge,
body.champ-fx-jinx-glitch .map-badge,
body.champ-fx-jinx-glitch .sp-badge,
body.champ-fx-jinx-glitch .sp-tag,
body.champ-fx-jinx-glitch .gw-badge,
body.champ-fx-jinx-glitch .lt-live,
body.champ-fx-jinx-glitch .lt-mood,
body.champ-fx-jinx-glitch .qna-pill,
body.champ-fx-jinx-glitch .tron-phase { background: rgba(57, 255, 20, 0.16) !important; border-color: var(--ct-secondary, #39ff14) !important; color: var(--ct-secondary, #39ff14) !important; }
body.champ-fx-jinx-glitch .gs-skin-name,
body.champ-fx-jinx-glitch .lb-lp,
body.champ-fx-jinx-glitch .gs-rank-lp,
body.champ-fx-jinx-glitch .goal-pct,
body.champ-fx-jinx-glitch .gw-winner,
body.champ-fx-jinx-glitch .sched-next,
body.champ-fx-jinx-glitch .sp-url,
body.champ-fx-jinx-glitch .lt-ticker,
body.champ-fx-jinx-glitch .tron-ticker { color: var(--ct-secondary, #39ff14) !important; }
body.champ-fx-jinx-glitch .gs-elo-sub,
body.champ-fx-jinx-glitch .gs-matches-lbl,
body.champ-fx-jinx-glitch .lb-meta,
body.champ-fx-jinx-glitch .map-sub,
body.champ-fx-jinx-glitch .sp-artist,
body.champ-fx-jinx-glitch .goal-nums,
body.champ-fx-jinx-glitch .lt-sub,
body.champ-fx-jinx-glitch .val-rank-lbl,
body.champ-fx-jinx-glitch .val-box-lbl,
body.champ-fx-jinx-glitch .tron-m-lbl,
body.champ-fx-jinx-glitch .cover-sub { color: var(--ct-primary, #ff2a85) !important; }
body.champ-fx-jinx-glitch .gs-champ-icon,
body.champ-fx-jinx-glitch .map-icon,
body.champ-fx-jinx-glitch .gs-rank-box,
body.champ-fx-jinx-glitch .lb-slot,
body.champ-fx-jinx-glitch .sp-cover,
body.champ-fx-jinx-glitch .gw-slot,
body.champ-fx-jinx-glitch .val-box,
body.champ-fx-jinx-glitch .tron-metric { border-color: var(--ct-primary, #ff2a85) !important; }
body.champ-fx-jinx-glitch .lb-slot.trinket,
body.champ-fx-jinx-glitch .gs-match-slot.win { border-color: var(--ct-secondary, #39ff14) !important; }
body.champ-fx-jinx-glitch .gs-match-slot.win .gs-match-badge { background: var(--ct-secondary, #39ff14) !important; color: #05080f !important; }
body.champ-fx-jinx-glitch .gs-cell { border-color: rgba(255, 42, 133, 0.48) !important; border-left: 3px solid var(--ct-secondary, #39ff14) !important; background: rgba(16, 8, 24, 0.9) !important; }
body.champ-fx-jinx-glitch .gs-lbl { color: var(--ct-primary, #ff2a85) !important; }
body.champ-fx-jinx-glitch .gs-val,
body.champ-fx-jinx-glitch .val-box-val,
body.champ-fx-jinx-glitch .tron-m-val { color: #ffffff !important; text-shadow: 0 0 8px rgba(0, 245, 212, 0.55); }
body.champ-fx-jinx-glitch .gs-lp-fill,
body.champ-fx-jinx-glitch .lb-lp-fill,
body.champ-fx-jinx-glitch .goal-fill,
body.champ-fx-jinx-glitch .sp-prog-fill,
body.champ-fx-jinx-glitch .val-rr-fill { background: linear-gradient(90deg, var(--ct-primary, #ff2a85), var(--ct-secondary, #39ff14)) !important; }

body.champ-pack-active:not(.champ-fx-jinx-glitch) .msg-row {
  background: linear-gradient(135deg, var(--ct-bg-start, rgba(16, 16, 28, 0.94)), var(--ct-bg-end, rgba(10, 14, 24, 0.95))) !important;
  border: 1.5px solid var(--ct-primary, #38bdf8) !important;
  border-left: 4px solid var(--ct-secondary, #a855f7) !important;
  color: var(--ct-text, #f8fafc) !important;
  margin-bottom: 5px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45) !important;
}
body.champ-pack-active:not(.champ-fx-jinx-glitch) #pinnedBox {
  background: linear-gradient(135deg, var(--ct-bg-start, rgba(16, 16, 28, 0.96)), var(--ct-bg-end, rgba(10, 14, 24, 0.96))) !important;
  border: 2px solid var(--ct-primary, #38bdf8) !important;
}
body.champ-pack-active:not(.champ-fx-jinx-glitch) .pin-label { color: var(--ct-secondary, #a855f7) !important; }
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-pack-active:not(.champ-fx-jinx-glitch) ${s}`).join(',\n')} {
  background: linear-gradient(145deg, var(--ct-bg-start, rgba(16, 16, 28, 0.96)), var(--ct-bg-end, rgba(10, 14, 24, 0.96))) !important;
  border: 2px solid var(--ct-primary, #38bdf8) !important;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.6), inset 0 0 18px rgba(255, 255, 255, 0.06) !important;
}
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-card::before,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .map-cover::before { border-color: var(--ct-secondary, #a855f7) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-card::after,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .map-cover::after { border-color: var(--ct-primary, #38bdf8) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-head,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-matches-wrap,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lb-elo,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sched-head { border-color: var(--ct-primary, #38bdf8) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-title,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-champ-name,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lb-rank,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .map-title,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sp-title,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .goal-title,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .poll-q,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gw-title,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sched-title,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .al-author,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lt-topic,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .qna-author,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .tron-topic,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .val-rank-name,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .cover-title { color: var(--ct-text, #f8fafc) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-lbl,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-matches-lbl,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-elo-sub,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lb-meta,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .map-sub,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sp-artist,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .goal-nums,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lt-sub,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .val-rank-lbl,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .val-box-lbl,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .tron-m-lbl,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .cover-sub { color: var(--ct-primary, #38bdf8) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-badge,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .map-badge,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sp-badge,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sp-tag,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gw-badge,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lt-live,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lt-mood,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .qna-pill,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .tron-phase { border-color: var(--ct-secondary, #a855f7) !important; color: var(--ct-secondary, #a855f7) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-skin-name,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lb-lp,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-rank-lp,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .goal-pct,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gw-winner,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sched-next,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sp-url,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lt-ticker,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .tron-ticker { color: var(--ct-secondary, #a855f7) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-champ-icon,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .map-icon,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-rank-box,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lb-slot,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sp-cover,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gw-slot,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .val-box,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .tron-metric { border-color: var(--ct-primary, #38bdf8) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-cell { border-color: var(--ct-primary, #38bdf8) !important; border-left: 3px solid var(--ct-secondary, #a855f7) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lb-slot.trinket,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-match-slot.win { border-color: var(--ct-secondary, #a855f7) !important; }
body.champ-pack-active:not(.champ-fx-jinx-glitch) .gs-lp-fill,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .lb-lp-fill,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .goal-fill,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .sp-prog-fill,
body.champ-pack-active:not(.champ-fx-jinx-glitch) .val-rr-fill { background: linear-gradient(90deg, var(--ct-primary, #38bdf8), var(--ct-secondary, #a855f7)) !important; }

${['.msg-row', ...ALL_OVERLAY_CARDS_SEL].map((s) => `body.champ-fx-spirit-blossom ${s}`).join(',\n')} { border-radius: 14px !important; }
${['.msg-row', ...ALL_OVERLAY_CARDS_SEL].map((s) => `body.champ-fx-nightbringer ${s},\nbody.champ-fx-project-cyber ${s}`).join(',\n')} { clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); border-radius: 0 !important; }

body.champ-fx-kda-firestarter .msg-row {
  background:
    linear-gradient(125deg, rgba(255, 59, 92, 0.18), rgba(255, 122, 0, 0.14) 55%, rgba(0, 245, 255, 0.08)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(22, 6, 20, 0.96)), var(--ct-bg-end, rgba(10, 8, 26, 0.97))) !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  border-radius: 0 !important;
  box-shadow: 0 0 18px rgba(255, 59, 92, 0.34), -2px 0 0 rgba(255, 122, 0, 0.65) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-kda-firestarter ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 86% 14%, rgba(255, 122, 0, 0.26), transparent 46%),
    radial-gradient(circle at 14% 86%, rgba(255, 59, 92, 0.22), transparent 50%),
    radial-gradient(circle at 50% 10%, rgba(0, 245, 255, 0.12), transparent 48%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(22, 6, 20, 0.96)), var(--ct-bg-end, rgba(10, 8, 26, 0.97))) !important;
  clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
  border-radius: 0 !important;
  animation: kdaFirePulse 3.2s ease-in-out infinite;
}
body.champ-fx-kda-firestarter .gs-title,
body.champ-fx-kda-firestarter .gs-champ-name,
body.champ-fx-kda-firestarter .lb-rank,
body.champ-fx-kda-firestarter .sp-title,
body.champ-fx-kda-firestarter .goal-title,
body.champ-fx-kda-firestarter .poll-q,
body.champ-fx-kda-firestarter .gw-title,
body.champ-fx-kda-firestarter .sched-title,
body.champ-fx-kda-firestarter .al-author,
body.champ-fx-kda-firestarter .lt-topic,
body.champ-fx-kda-firestarter .qna-author,
body.champ-fx-kda-firestarter .tron-topic,
body.champ-fx-kda-firestarter .val-rank-name { text-shadow: 0 0 12px rgba(255, 59, 92, 0.88), 0 0 8px rgba(255, 122, 0, 0.65) !important; }
body.champ-fx-kda-firestarter .gs-lp-fill,
body.champ-fx-kda-firestarter .lb-lp-fill,
body.champ-fx-kda-firestarter .goal-fill,
body.champ-fx-kda-firestarter .sp-prog-fill,
body.champ-fx-kda-firestarter .val-rr-fill { background: linear-gradient(90deg, #ff3b5c, #ff7a00, #00f5ff) !important; }

body.champ-fx-risen-legend .msg-row {
  background:
    linear-gradient(125deg, rgba(245, 197, 66, 0.14), rgba(255, 46, 85, 0.10) 60%, rgba(192, 132, 252, 0.08)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(18, 7, 14, 0.96)), var(--ct-bg-end, rgba(9, 8, 18, 0.97))) !important;
  border: 1.5px solid var(--ct-primary, #f5c542) !important;
  border-left: 4px solid var(--ct-secondary, #ff2e55) !important;
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
  border-radius: 0 !important;
  box-shadow: 0 0 16px rgba(245, 197, 66, 0.28), -2px 0 0 rgba(255, 46, 85, 0.5) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-risen-legend ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 88% 12%, rgba(245, 197, 66, 0.22), transparent 46%),
    radial-gradient(circle at 12% 88%, rgba(255, 46, 85, 0.18), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(18, 7, 14, 0.96)), var(--ct-bg-end, rgba(9, 8, 18, 0.97))) !important;
  border: 2px solid var(--ct-primary, #f5c542) !important;
  clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);
  border-radius: 0 !important;
  animation: risenLegendGlow 3.8s ease-in-out infinite;
}
body.champ-fx-risen-legend .gs-title,
body.champ-fx-risen-legend .gs-champ-name,
body.champ-fx-risen-legend .lb-rank,
body.champ-fx-risen-legend .sp-title,
body.champ-fx-risen-legend .goal-title,
body.champ-fx-risen-legend .poll-q,
body.champ-fx-risen-legend .gw-title,
body.champ-fx-risen-legend .sched-title,
body.champ-fx-risen-legend .al-author,
body.champ-fx-risen-legend .lt-topic,
body.champ-fx-risen-legend .qna-author,
body.champ-fx-risen-legend .tron-topic,
body.champ-fx-risen-legend .val-rank-name { color: #fff8e7 !important; text-shadow: 0 0 12px rgba(245, 197, 66, 0.8), 0 0 6px rgba(255, 46, 85, 0.45) !important; }
body.champ-fx-risen-legend .gs-lp-fill,
body.champ-fx-risen-legend .lb-lp-fill,
body.champ-fx-risen-legend .goal-fill,
body.champ-fx-risen-legend .sp-prog-fill,
body.champ-fx-risen-legend .val-rr-fill { background: linear-gradient(90deg, #ff2e55, #f5c542, #ffe07d) !important; }

body.champ-fx-inkshadow .msg-row {
  background:
    repeating-linear-gradient(-35deg, rgba(20, 241, 198, 0.06) 0 6px, rgba(255, 59, 78, 0.04) 6px 12px, transparent 12px 28px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(8, 9, 14, 0.97)), var(--ct-bg-end, rgba(14, 12, 22, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #14f1c6) !important;
  border-left: 4px solid var(--ct-secondary, #ff3b4e) !important;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 8px, 100% 100%, 12px 100%, 0 calc(100% - 8px));
  border-radius: 0 !important;
  box-shadow: 0 0 16px rgba(20, 241, 198, 0.24), -2px 0 0 rgba(255, 59, 78, 0.5) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-inkshadow ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 12% 18%, rgba(20, 241, 198, 0.16), transparent 45%),
    radial-gradient(circle at 88% 82%, rgba(255, 59, 78, 0.16), transparent 48%),
    repeating-linear-gradient(-40deg, rgba(248, 250, 252, 0.03) 0 4px, transparent 4px 22px),
    linear-gradient(145deg, var(--ct-bg-start, rgba(8, 9, 14, 0.97)), var(--ct-bg-end, rgba(14, 12, 22, 0.98))) !important;
  border: 2px solid var(--ct-primary, #14f1c6) !important;
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 12px, 100% 100%, 16px 100%, 0 calc(100% - 12px));
  border-radius: 0 !important;
  animation: inkshadowPulse 4s ease-in-out infinite;
}
body.champ-fx-inkshadow .gs-title,
body.champ-fx-inkshadow .gs-champ-name,
body.champ-fx-inkshadow .lb-rank,
body.champ-fx-inkshadow .sp-title,
body.champ-fx-inkshadow .goal-title,
body.champ-fx-inkshadow .poll-q,
body.champ-fx-inkshadow .gw-title,
body.champ-fx-inkshadow .sched-title,
body.champ-fx-inkshadow .al-author,
body.champ-fx-inkshadow .lt-topic,
body.champ-fx-inkshadow .qna-author,
body.champ-fx-inkshadow .tron-topic,
body.champ-fx-inkshadow .val-rank-name { color: #f8fafc !important; text-shadow: 0 0 12px rgba(20, 241, 198, 0.72), 1px 0 0 rgba(255, 59, 78, 0.55) !important; }
body.champ-fx-inkshadow .gs-lp-fill,
body.champ-fx-inkshadow .lb-lp-fill,
body.champ-fx-inkshadow .goal-fill,
body.champ-fx-inkshadow .sp-prog-fill,
body.champ-fx-inkshadow .val-rr-fill { background: linear-gradient(90deg, #14f1c6, #f8fafc, #ff3b4e) !important; }

body.champ-fx-kda-all-out .msg-row {
  background:
    linear-gradient(125deg, rgba(103, 232, 249, 0.14), rgba(196, 181, 253, 0.12) 50%, rgba(244, 114, 182, 0.14)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(14, 10, 32, 0.95)), var(--ct-bg-end, rgba(10, 18, 38, 0.96))) !important;
  border: 1.5px solid var(--ct-primary, #67e8f9) !important;
  border-left: 4px solid var(--ct-secondary, #f472b6) !important;
  border-radius: 12px !important;
  box-shadow: 0 0 18px rgba(103, 232, 249, 0.25), inset 0 0 10px rgba(244, 114, 182, 0.12) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-kda-all-out ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 18% 12%, rgba(103, 232, 249, 0.22), transparent 46%),
    radial-gradient(circle at 86% 85%, rgba(244, 114, 182, 0.22), transparent 48%),
    radial-gradient(circle at 55% 45%, rgba(196, 181, 253, 0.10), transparent 60%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(14, 10, 32, 0.95)), var(--ct-bg-end, rgba(10, 18, 38, 0.96))) !important;
  border: 2px solid var(--ct-primary, #67e8f9) !important;
  border-radius: 14px !important;
  animation: kdaAllOutShimmer 3.8s ease-in-out infinite;
}
body.champ-fx-kda-all-out .gs-title,
body.champ-fx-kda-all-out .gs-champ-name,
body.champ-fx-kda-all-out .lb-rank,
body.champ-fx-kda-all-out .sp-title,
body.champ-fx-kda-all-out .goal-title,
body.champ-fx-kda-all-out .poll-q,
body.champ-fx-kda-all-out .gw-title,
body.champ-fx-kda-all-out .sched-title,
body.champ-fx-kda-all-out .al-author,
body.champ-fx-kda-all-out .lt-topic,
body.champ-fx-kda-all-out .qna-author,
body.champ-fx-kda-all-out .tron-topic,
body.champ-fx-kda-all-out .val-rank-name { color: #f8fbff !important; text-shadow: 0 0 12px rgba(103, 232, 249, 0.8), 0 0 8px rgba(244, 114, 182, 0.55) !important; }
body.champ-fx-kda-all-out .gs-lp-fill,
body.champ-fx-kda-all-out .lb-lp-fill,
body.champ-fx-kda-all-out .goal-fill,
body.champ-fx-kda-all-out .sp-prog-fill,
body.champ-fx-kda-all-out .val-rr-fill { background: linear-gradient(90deg, #67e8f9, #c4b5fd, #f472b6) !important; }

body.champ-fx-dark-cosmic .msg-row {
  background:
    radial-gradient(circle at 92% 50%, rgba(255, 123, 41, 0.18), transparent 48%),
    linear-gradient(125deg, rgba(168, 85, 247, 0.16), rgba(236, 72, 153, 0.10) 55%, rgba(8, 4, 20, 0.96)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(8, 4, 20, 0.97)), var(--ct-bg-end, rgba(15, 5, 26, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #a855f7) !important;
  border-left: 4px solid var(--ct-secondary, #ff7b29) !important;
  clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);
  border-radius: 0 !important;
  box-shadow: 0 0 18px rgba(168, 85, 247, 0.3), -2px 0 0 rgba(255, 123, 41, 0.55) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-dark-cosmic ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 84% 18%, rgba(255, 123, 41, 0.24), transparent 42%),
    radial-gradient(circle at 18% 82%, rgba(236, 72, 153, 0.22), transparent 48%),
    radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.14), transparent 62%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(8, 4, 20, 0.97)), var(--ct-bg-end, rgba(15, 5, 26, 0.98))) !important;
  border: 2px solid var(--ct-primary, #a855f7) !important;
  clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px);
  border-radius: 0 !important;
  animation: darkCosmicPulse 4s ease-in-out infinite;
}
body.champ-fx-dark-cosmic .gs-title,
body.champ-fx-dark-cosmic .gs-champ-name,
body.champ-fx-dark-cosmic .lb-rank,
body.champ-fx-dark-cosmic .sp-title,
body.champ-fx-dark-cosmic .goal-title,
body.champ-fx-dark-cosmic .poll-q,
body.champ-fx-dark-cosmic .gw-title,
body.champ-fx-dark-cosmic .sched-title,
body.champ-fx-dark-cosmic .al-author,
body.champ-fx-dark-cosmic .lt-topic,
body.champ-fx-dark-cosmic .qna-author,
body.champ-fx-dark-cosmic .tron-topic,
body.champ-fx-dark-cosmic .val-rank-name { color: #faf5ff !important; text-shadow: 0 0 12px rgba(168, 85, 247, 0.85), 0 0 8px rgba(255, 123, 41, 0.55) !important; }
body.champ-fx-dark-cosmic .gs-lp-fill,
body.champ-fx-dark-cosmic .lb-lp-fill,
body.champ-fx-dark-cosmic .goal-fill,
body.champ-fx-dark-cosmic .sp-prog-fill,
body.champ-fx-dark-cosmic .val-rr-fill { background: linear-gradient(90deg, #9333ea, #ec4899, #ff7b29) !important; }

body.champ-fx-black-rose .msg-row {
  background:
    linear-gradient(125deg, rgba(225, 29, 72, 0.16), rgba(212, 175, 55, 0.08) 55%, rgba(147, 51, 234, 0.10)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(16, 4, 10, 0.97)), var(--ct-bg-end, rgba(10, 4, 14, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #e11d48) !important;
  border-left: 4px solid var(--ct-secondary, #d4af37) !important;
  clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px);
  border-radius: 0 !important;
  box-shadow: 0 0 16px rgba(225, 29, 72, 0.28), -2px 0 0 rgba(212, 175, 55, 0.55) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-black-rose ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 86% 14%, rgba(212, 175, 55, 0.18), transparent 44%),
    radial-gradient(circle at 14% 86%, rgba(225, 29, 72, 0.24), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(16, 4, 10, 0.97)), var(--ct-bg-end, rgba(10, 4, 14, 0.98))) !important;
  border: 2px solid var(--ct-primary, #e11d48) !important;
  clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px);
  border-radius: 0 !important;
  animation: blackRosePulse 4s ease-in-out infinite;
}
body.champ-fx-black-rose .gs-title,
body.champ-fx-black-rose .gs-champ-name,
body.champ-fx-black-rose .lb-rank,
body.champ-fx-black-rose .sp-title,
body.champ-fx-black-rose .goal-title,
body.champ-fx-black-rose .poll-q,
body.champ-fx-black-rose .gw-title,
body.champ-fx-black-rose .sched-title,
body.champ-fx-black-rose .al-author,
body.champ-fx-black-rose .lt-topic,
body.champ-fx-black-rose .qna-author,
body.champ-fx-black-rose .tron-topic,
body.champ-fx-black-rose .val-rank-name { color: #fff1f2 !important; text-shadow: 0 0 12px rgba(225, 29, 72, 0.8), 0 0 6px rgba(212, 175, 55, 0.55) !important; }
body.champ-fx-black-rose .gs-lp-fill,
body.champ-fx-black-rose .lb-lp-fill,
body.champ-fx-black-rose .goal-fill,
body.champ-fx-black-rose .sp-prog-fill,
body.champ-fx-black-rose .val-rr-fill { background: linear-gradient(90deg, #9f1239, #e11d48, #d4af37) !important; }

body.champ-fx-ravenborn .msg-row {
  background:
    linear-gradient(125deg, rgba(45, 212, 191, 0.14), rgba(139, 92, 246, 0.14) 60%, rgba(7, 10, 20, 0.96)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(7, 10, 20, 0.97)), var(--ct-bg-end, rgba(12, 7, 24, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #2dd4bf) !important;
  border-left: 4px solid var(--ct-secondary, #8b5cf6) !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  border-radius: 0 !important;
  box-shadow: 0 0 16px rgba(45, 212, 191, 0.24), -2px 0 0 rgba(139, 92, 246, 0.55) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-ravenborn ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 14% 16%, rgba(45, 212, 191, 0.20), transparent 46%),
    radial-gradient(circle at 86% 84%, rgba(139, 92, 246, 0.22), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(7, 10, 20, 0.97)), var(--ct-bg-end, rgba(12, 7, 24, 0.98))) !important;
  border: 2px solid var(--ct-primary, #2dd4bf) !important;
  clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
  border-radius: 0 !important;
  animation: ravenbornPulse 4s ease-in-out infinite;
}
body.champ-fx-ravenborn .gs-title,
body.champ-fx-ravenborn .gs-champ-name,
body.champ-fx-ravenborn .lb-rank,
body.champ-fx-ravenborn .sp-title,
body.champ-fx-ravenborn .goal-title,
body.champ-fx-ravenborn .poll-q,
body.champ-fx-ravenborn .gw-title,
body.champ-fx-ravenborn .sched-title,
body.champ-fx-ravenborn .al-author,
body.champ-fx-ravenborn .lt-topic,
body.champ-fx-ravenborn .qna-author,
body.champ-fx-ravenborn .tron-topic,
body.champ-fx-ravenborn .val-rank-name { color: #f0fdfa !important; text-shadow: 0 0 12px rgba(45, 212, 191, 0.8), 0 0 8px rgba(139, 92, 246, 0.6) !important; }
body.champ-fx-ravenborn .gs-lp-fill,
body.champ-fx-ravenborn .lb-lp-fill,
body.champ-fx-ravenborn .goal-fill,
body.champ-fx-ravenborn .sp-prog-fill,
body.champ-fx-ravenborn .val-rr-fill { background: linear-gradient(90deg, #2dd4bf, #8b5cf6, #e2e8f0) !important; }

body.champ-fx-elementalist .msg-row {
  background:
    linear-gradient(125deg, rgba(253, 224, 71, 0.14), rgba(56, 189, 248, 0.12) 50%, rgba(232, 121, 249, 0.14)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(10, 14, 34, 0.95)), var(--ct-bg-end, rgba(18, 12, 36, 0.96))) !important;
  border: 1.5px solid var(--ct-primary, #fde047) !important;
  border-left: 4px solid var(--ct-secondary, #38bdf8) !important;
  border-radius: 10px !important;
  box-shadow: 0 0 16px rgba(253, 224, 71, 0.24), inset 0 0 10px rgba(56, 189, 248, 0.14) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-elementalist ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 14% 14%, rgba(253, 224, 71, 0.22), transparent 44%),
    radial-gradient(circle at 86% 20%, rgba(56, 189, 248, 0.20), transparent 46%),
    radial-gradient(circle at 50% 88%, rgba(232, 121, 249, 0.20), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(10, 14, 34, 0.95)), var(--ct-bg-end, rgba(18, 12, 36, 0.96))) !important;
  border: 2px solid #fde047 !important;
  border-radius: 12px !important;
  animation: elementalistCycle 6s ease-in-out infinite;
}
body.champ-fx-elementalist .gs-title,
body.champ-fx-elementalist .gs-champ-name,
body.champ-fx-elementalist .lb-rank,
body.champ-fx-elementalist .sp-title,
body.champ-fx-elementalist .goal-title,
body.champ-fx-elementalist .poll-q,
body.champ-fx-elementalist .gw-title,
body.champ-fx-elementalist .sched-title,
body.champ-fx-elementalist .al-author,
body.champ-fx-elementalist .lt-topic,
body.champ-fx-elementalist .qna-author,
body.champ-fx-elementalist .tron-topic,
body.champ-fx-elementalist .val-rank-name { color: #fefce8 !important; text-shadow: 0 0 12px rgba(253, 224, 71, 0.78), 0 0 8px rgba(56, 189, 248, 0.55) !important; }
body.champ-fx-elementalist .gs-lp-fill,
body.champ-fx-elementalist .lb-lp-fill,
body.champ-fx-elementalist .goal-fill,
body.champ-fx-elementalist .sp-prog-fill,
body.champ-fx-elementalist .val-rr-fill { background: linear-gradient(90deg, #fde047, #38bdf8, #e879f9, #fb7185) !important; }

body.champ-fx-high-noon .msg-row {
  background:
    linear-gradient(125deg, rgba(255, 90, 31, 0.16), rgba(245, 158, 11, 0.10) 55%, rgba(220, 38, 38, 0.14)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(20, 8, 5, 0.97)), var(--ct-bg-end, rgba(12, 6, 5, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #ff5a1f) !important;
  border-left: 4px solid var(--ct-secondary, #f59e0b) !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 8px, 100% 100%, 10px 100%, 0 calc(100% - 8px));
  border-radius: 0 !important;
  box-shadow: 0 0 16px rgba(255, 90, 31, 0.28), -2px 0 0 rgba(245, 158, 11, 0.55) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-high-noon ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 86% 16%, rgba(245, 158, 11, 0.22), transparent 46%),
    radial-gradient(circle at 14% 86%, rgba(220, 38, 38, 0.24), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(20, 8, 5, 0.97)), var(--ct-bg-end, rgba(12, 6, 5, 0.98))) !important;
  border: 2px solid var(--ct-primary, #ff5a1f) !important;
  clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);
  border-radius: 0 !important;
  animation: highNoonEmber 3.4s ease-in-out infinite;
}
body.champ-fx-high-noon .gs-title,
body.champ-fx-high-noon .gs-champ-name,
body.champ-fx-high-noon .lb-rank,
body.champ-fx-high-noon .sp-title,
body.champ-fx-high-noon .goal-title,
body.champ-fx-high-noon .poll-q,
body.champ-fx-high-noon .gw-title,
body.champ-fx-high-noon .sched-title,
body.champ-fx-high-noon .al-author,
body.champ-fx-high-noon .lt-topic,
body.champ-fx-high-noon .qna-author,
body.champ-fx-high-noon .tron-topic,
body.champ-fx-high-noon .val-rank-name { color: #fff7ed !important; text-shadow: 0 0 12px rgba(255, 90, 31, 0.85), 0 0 6px rgba(245, 158, 11, 0.6) !important; }
body.champ-fx-high-noon .gs-lp-fill,
body.champ-fx-high-noon .lb-lp-fill,
body.champ-fx-high-noon .goal-fill,
body.champ-fx-high-noon .sp-prog-fill,
body.champ-fx-high-noon .val-rr-fill { background: linear-gradient(90deg, #dc2626, #ff5a1f, #f59e0b) !important; }

body.champ-fx-arcane-prestige .msg-row {
  background:
    linear-gradient(125deg, rgba(243, 207, 122, 0.14), rgba(56, 189, 248, 0.12) 60%, rgba(9, 14, 30, 0.96)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(9, 14, 30, 0.96)), var(--ct-bg-end, rgba(15, 20, 38, 0.97))) !important;
  border: 1.5px solid var(--ct-primary, #f3cf7a) !important;
  border-left: 4px solid var(--ct-secondary, #38bdf8) !important;
  clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px);
  border-radius: 0 !important;
  box-shadow: 0 0 16px rgba(243, 207, 122, 0.24), -2px 0 0 rgba(56, 189, 248, 0.55) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-arcane-prestige ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 14% 14%, rgba(243, 207, 122, 0.22), transparent 46%),
    radial-gradient(circle at 86% 86%, rgba(56, 189, 248, 0.20), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(9, 14, 30, 0.96)), var(--ct-bg-end, rgba(15, 20, 38, 0.97))) !important;
  border: 2px solid var(--ct-primary, #f3cf7a) !important;
  clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px);
  border-radius: 0 !important;
  animation: arcanePrestigeGlow 4s ease-in-out infinite;
}
body.champ-fx-arcane-prestige .gs-title,
body.champ-fx-arcane-prestige .gs-champ-name,
body.champ-fx-arcane-prestige .lb-rank,
body.champ-fx-arcane-prestige .sp-title,
body.champ-fx-arcane-prestige .goal-title,
body.champ-fx-arcane-prestige .poll-q,
body.champ-fx-arcane-prestige .gw-title,
body.champ-fx-arcane-prestige .sched-title,
body.champ-fx-arcane-prestige .al-author,
body.champ-fx-arcane-prestige .lt-topic,
body.champ-fx-arcane-prestige .qna-author,
body.champ-fx-arcane-prestige .tron-topic,
body.champ-fx-arcane-prestige .val-rank-name { color: #fefce8 !important; text-shadow: 0 0 12px rgba(243, 207, 122, 0.8), 0 0 8px rgba(56, 189, 248, 0.55) !important; }
body.champ-fx-arcane-prestige .gs-lp-fill,
body.champ-fx-arcane-prestige .lb-lp-fill,
body.champ-fx-arcane-prestige .goal-fill,
body.champ-fx-arcane-prestige .sp-prog-fill,
body.champ-fx-arcane-prestige .val-rr-fill { background: linear-gradient(90deg, #38bdf8, #f3cf7a, #fef9c3) !important; }

body.champ-fx-prestige-cosmic .msg-row {
  background:
    linear-gradient(125deg, rgba(250, 204, 21, 0.14), rgba(192, 132, 252, 0.14) 55%, rgba(224, 231, 255, 0.08)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(10, 7, 24, 0.97)), var(--ct-bg-end, rgba(16, 10, 32, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #facc15) !important;
  border-left: 4px solid var(--ct-secondary, #c084fc) !important;
  clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);
  border-radius: 0 !important;
  box-shadow: 0 0 18px rgba(250, 204, 21, 0.26), -2px 0 0 rgba(192, 132, 252, 0.55) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-prestige-cosmic ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 86% 14%, rgba(250, 204, 21, 0.24), transparent 44%),
    radial-gradient(circle at 14% 86%, rgba(192, 132, 252, 0.24), transparent 48%),
    radial-gradient(circle at 50% 50%, rgba(224, 231, 255, 0.08), transparent 60%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(10, 7, 24, 0.97)), var(--ct-bg-end, rgba(16, 10, 32, 0.98))) !important;
  border: 2px solid var(--ct-primary, #facc15) !important;
  clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);
  border-radius: 0 !important;
  animation: prestigeCosmicGlow 3.8s ease-in-out infinite;
}
body.champ-fx-prestige-cosmic .gs-title,
body.champ-fx-prestige-cosmic .gs-champ-name,
body.champ-fx-prestige-cosmic .lb-rank,
body.champ-fx-prestige-cosmic .sp-title,
body.champ-fx-prestige-cosmic .goal-title,
body.champ-fx-prestige-cosmic .poll-q,
body.champ-fx-prestige-cosmic .gw-title,
body.champ-fx-prestige-cosmic .sched-title,
body.champ-fx-prestige-cosmic .al-author,
body.champ-fx-prestige-cosmic .lt-topic,
body.champ-fx-prestige-cosmic .qna-author,
body.champ-fx-prestige-cosmic .tron-topic,
body.champ-fx-prestige-cosmic .val-rank-name { color: #faf5ff !important; text-shadow: 0 0 12px rgba(250, 204, 21, 0.8), 0 0 8px rgba(192, 132, 252, 0.65) !important; }
body.champ-fx-prestige-cosmic .gs-lp-fill,
body.champ-fx-prestige-cosmic .lb-lp-fill,
body.champ-fx-prestige-cosmic .goal-fill,
body.champ-fx-prestige-cosmic .sp-prog-fill,
body.champ-fx-prestige-cosmic .val-rr-fill { background: linear-gradient(90deg, #c084fc, #facc15, #e0e7ff) !important; }

body.champ-fx-god-king .msg-row {
  background:
    linear-gradient(125deg, rgba(239, 68, 68, 0.18), rgba(251, 191, 36, 0.12) 60%, rgba(18, 6, 8, 0.97)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(18, 6, 8, 0.97)), var(--ct-bg-end, rgba(12, 8, 12, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #ef4444) !important;
  border-left: 4px solid var(--ct-secondary, #fbbf24) !important;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 10px, 100% 100%, 12px 100%, 0 calc(100% - 10px));
  border-radius: 0 !important;
  box-shadow: 0 0 18px rgba(239, 68, 68, 0.30), -2px 0 0 rgba(251, 191, 36, 0.6) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-god-king ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 86% 14%, rgba(251, 191, 36, 0.24), transparent 46%),
    radial-gradient(circle at 14% 86%, rgba(239, 68, 68, 0.26), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(18, 6, 8, 0.97)), var(--ct-bg-end, rgba(12, 8, 12, 0.98))) !important;
  border: 2px solid var(--ct-primary, #ef4444) !important;
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 14px, 100% 100%, 16px 100%, 0 calc(100% - 14px));
  border-radius: 0 !important;
  animation: godKingAura 3.4s ease-in-out infinite;
}
body.champ-fx-god-king .gs-title,
body.champ-fx-god-king .gs-champ-name,
body.champ-fx-god-king .lb-rank,
body.champ-fx-god-king .sp-title,
body.champ-fx-god-king .goal-title,
body.champ-fx-god-king .poll-q,
body.champ-fx-god-king .gw-title,
body.champ-fx-god-king .sched-title,
body.champ-fx-god-king .al-author,
body.champ-fx-god-king .lt-topic,
body.champ-fx-god-king .qna-author,
body.champ-fx-god-king .tron-topic,
body.champ-fx-god-king .val-rank-name { color: #fef3c7 !important; text-shadow: 0 0 12px rgba(239, 68, 68, 0.85), 0 0 8px rgba(251, 191, 36, 0.65) !important; }
body.champ-fx-god-king .gs-lp-fill,
body.champ-fx-god-king .lb-lp-fill,
body.champ-fx-god-king .goal-fill,
body.champ-fx-god-king .sp-prog-fill,
body.champ-fx-god-king .val-rr-fill { background: linear-gradient(90deg, #b91c1c, #ef4444, #fbbf24, #fef3c7) !important; }

body.champ-fx-radiant-cloud .msg-row {
  background:
    linear-gradient(125deg, rgba(251, 191, 36, 0.14), rgba(52, 211, 153, 0.12) 55%, rgba(244, 63, 94, 0.10)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(8, 18, 16, 0.96)), var(--ct-bg-end, rgba(20, 13, 8, 0.97))) !important;
  border: 1.5px solid var(--ct-primary, #fbbf24) !important;
  border-left: 4px solid var(--ct-secondary, #34d399) !important;
  border-radius: 10px !important;
  box-shadow: 0 0 16px rgba(251, 191, 36, 0.26), inset 0 0 10px rgba(52, 211, 153, 0.14) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-radiant-cloud ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 14% 14%, rgba(251, 191, 36, 0.24), transparent 46%),
    radial-gradient(circle at 86% 84%, rgba(52, 211, 153, 0.20), transparent 48%),
    radial-gradient(circle at 84% 18%, rgba(244, 63, 94, 0.14), transparent 42%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(8, 18, 16, 0.96)), var(--ct-bg-end, rgba(20, 13, 8, 0.97))) !important;
  border: 2px solid var(--ct-primary, #fbbf24) !important;
  border-radius: 10px !important;
  animation: radiantCloudGlow 3.8s ease-in-out infinite;
}
body.champ-fx-radiant-cloud .gs-title,
body.champ-fx-radiant-cloud .gs-champ-name,
body.champ-fx-radiant-cloud .lb-rank,
body.champ-fx-radiant-cloud .sp-title,
body.champ-fx-radiant-cloud .goal-title,
body.champ-fx-radiant-cloud .poll-q,
body.champ-fx-radiant-cloud .gw-title,
body.champ-fx-radiant-cloud .sched-title,
body.champ-fx-radiant-cloud .al-author,
body.champ-fx-radiant-cloud .lt-topic,
body.champ-fx-radiant-cloud .qna-author,
body.champ-fx-radiant-cloud .tron-topic,
body.champ-fx-radiant-cloud .val-rank-name { color: #fefce8 !important; text-shadow: 0 0 12px rgba(251, 191, 36, 0.85), 0 0 8px rgba(52, 211, 153, 0.55) !important; }
body.champ-fx-radiant-cloud .gs-lp-fill,
body.champ-fx-radiant-cloud .lb-lp-fill,
body.champ-fx-radiant-cloud .goal-fill,
body.champ-fx-radiant-cloud .sp-prog-fill,
body.champ-fx-radiant-cloud .val-rr-fill { background: linear-gradient(90deg, #10b981, #fbbf24, #f43f5e) !important; }

body.champ-fx-soul-fighter .msg-row {
  background:
    repeating-linear-gradient(-45deg, rgba(34, 211, 238, 0.08) 0 6px, rgba(255, 31, 113, 0.06) 6px 12px, transparent 12px 24px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(11, 8, 22, 0.97)), var(--ct-bg-end, rgba(20, 6, 22, 0.98))) !important;
  border: 2px solid var(--ct-primary, #22d3ee) !important;
  border-left: 5px solid var(--ct-secondary, #ff1f71) !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  border-radius: 0 !important;
  box-shadow: 3px 3px 0 rgba(255, 31, 113, 0.78) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-soul-fighter ${s}`).join(',\n')} {
  background:
    repeating-linear-gradient(-45deg, rgba(34, 211, 238, 0.06) 0 8px, rgba(255, 31, 113, 0.05) 8px 16px, transparent 16px 32px),
    radial-gradient(circle at 86% 14%, rgba(255, 31, 113, 0.22), transparent 46%),
    radial-gradient(circle at 14% 86%, rgba(34, 211, 238, 0.20), transparent 48%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(11, 8, 22, 0.97)), var(--ct-bg-end, rgba(20, 6, 22, 0.98))) !important;
  border: 2.5px solid var(--ct-primary, #22d3ee) !important;
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  border-radius: 0 !important;
  animation: soulFighterPulse 3.2s ease-in-out infinite;
}
body.champ-fx-soul-fighter .gs-title,
body.champ-fx-soul-fighter .gs-champ-name,
body.champ-fx-soul-fighter .lb-rank,
body.champ-fx-soul-fighter .sp-title,
body.champ-fx-soul-fighter .goal-title,
body.champ-fx-soul-fighter .poll-q,
body.champ-fx-soul-fighter .gw-title,
body.champ-fx-soul-fighter .sched-title,
body.champ-fx-soul-fighter .al-author,
body.champ-fx-soul-fighter .lt-topic,
body.champ-fx-soul-fighter .qna-author,
body.champ-fx-soul-fighter .tron-topic,
body.champ-fx-soul-fighter .val-rank-name { color: #ffffff !important; text-shadow: 2px 2px 0 rgba(255, 31, 113, 0.9), 0 0 10px rgba(34, 211, 238, 0.75) !important; }
body.champ-fx-soul-fighter .gs-lp-fill,
body.champ-fx-soul-fighter .lb-lp-fill,
body.champ-fx-soul-fighter .goal-fill,
body.champ-fx-soul-fighter .sp-prog-fill,
body.champ-fx-soul-fighter .val-rr-fill { background: linear-gradient(90deg, #22d3ee, #ff1f71, #facc15) !important; }

body.champ-fx-blossom-springs .msg-row {
  background:
    linear-gradient(125deg, rgba(94, 234, 212, 0.14), rgba(251, 113, 133, 0.12) 55%, rgba(253, 230, 138, 0.10)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(10, 18, 28, 0.94)), var(--ct-bg-end, rgba(22, 12, 26, 0.95))) !important;
  border: 1.5px solid var(--ct-primary, #5eead4) !important;
  border-left: 4px solid var(--ct-secondary, #fb7185) !important;
  border-radius: 14px !important;
  box-shadow: 0 0 18px rgba(94, 234, 212, 0.24), inset 0 0 12px rgba(251, 113, 133, 0.12) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-blossom-springs ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 16% 16%, rgba(94, 234, 212, 0.22), transparent 48%),
    radial-gradient(circle at 86% 84%, rgba(251, 113, 133, 0.22), transparent 50%),
    radial-gradient(circle at 82% 16%, rgba(253, 230, 138, 0.16), transparent 44%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(10, 18, 28, 0.94)), var(--ct-bg-end, rgba(22, 12, 26, 0.95))) !important;
  border: 2px solid var(--ct-primary, #5eead4) !important;
  border-radius: 16px !important;
  animation: blossomSpringsGlow 4.4s ease-in-out infinite;
}
body.champ-fx-blossom-springs .gs-title,
body.champ-fx-blossom-springs .gs-champ-name,
body.champ-fx-blossom-springs .lb-rank,
body.champ-fx-blossom-springs .sp-title,
body.champ-fx-blossom-springs .goal-title,
body.champ-fx-blossom-springs .poll-q,
body.champ-fx-blossom-springs .gw-title,
body.champ-fx-blossom-springs .sched-title,
body.champ-fx-blossom-springs .al-author,
body.champ-fx-blossom-springs .lt-topic,
body.champ-fx-blossom-springs .qna-author,
body.champ-fx-blossom-springs .tron-topic,
body.champ-fx-blossom-springs .val-rank-name { color: #fff1f2 !important; text-shadow: 0 0 12px rgba(94, 234, 212, 0.78), 0 0 8px rgba(251, 113, 133, 0.55) !important; }
body.champ-fx-blossom-springs .gs-lp-fill,
body.champ-fx-blossom-springs .lb-lp-fill,
body.champ-fx-blossom-springs .goal-fill,
body.champ-fx-blossom-springs .sp-prog-fill,
body.champ-fx-blossom-springs .val-rr-fill { background: linear-gradient(90deg, #5eead4, #fb7185, #fde68a) !important; }

body.champ-fx-zaun-lab .msg-row {
  background:
    repeating-linear-gradient(-40deg, rgba(57, 255, 20, 0.07) 0 6px, rgba(0, 229, 160, 0.04) 6px 12px, transparent 12px 26px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(6, 18, 12, 0.96)), var(--ct-bg-end, rgba(4, 12, 14, 0.97))) !important;
  border: 1.5px solid var(--ct-primary, #39ff14) !important;
  border-left: 4px solid var(--ct-secondary, #00e5a0) !important;
  clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px);
  border-radius: 0 !important;
  animation: zaunLabFramePulse 4.2s ease-in-out infinite;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-zaun-lab ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 14% 16%, rgba(57, 255, 20, 0.22), transparent 46%),
    radial-gradient(circle at 86% 84%, rgba(0, 229, 160, 0.22), transparent 50%),
    repeating-linear-gradient(-35deg, rgba(163, 230, 53, 0.04) 0 5px, transparent 5px 22px),
    linear-gradient(145deg, var(--ct-bg-start, rgba(6, 18, 12, 0.96)), var(--ct-bg-end, rgba(4, 12, 14, 0.97))) !important;
  border: 2px solid var(--ct-primary, #39ff14) !important;
  clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px);
  border-radius: 0 !important;
  animation: zaunLabFramePulse 3.6s ease-in-out infinite;
}
body.champ-fx-zaun-lab .gs-title,
body.champ-fx-zaun-lab .gs-champ-name,
body.champ-fx-zaun-lab .lb-rank,
body.champ-fx-zaun-lab .sp-title,
body.champ-fx-zaun-lab .goal-title,
body.champ-fx-zaun-lab .poll-q,
body.champ-fx-zaun-lab .gw-title,
body.champ-fx-zaun-lab .sched-title,
body.champ-fx-zaun-lab .al-author,
body.champ-fx-zaun-lab .lt-topic,
body.champ-fx-zaun-lab .qna-author,
body.champ-fx-zaun-lab .tron-topic,
body.champ-fx-zaun-lab .val-rank-name { color: #ecfdf5 !important; text-shadow: 0 0 12px rgba(57, 255, 20, 0.85), 0 0 8px rgba(0, 229, 160, 0.6) !important; }
body.champ-fx-zaun-lab .gs-lp-fill,
body.champ-fx-zaun-lab .lb-lp-fill,
body.champ-fx-zaun-lab .goal-fill,
body.champ-fx-zaun-lab .sp-prog-fill,
body.champ-fx-zaun-lab .val-rr-fill { background: linear-gradient(90deg, #76ff03, #00e5ff, #facc15) !important; }

@keyframes crimeCityCardPulse {
  0%, 100% { border-color: #e11d48; box-shadow: 0 0 18px rgba(225, 29, 72, 0.42), inset 0 0 12px rgba(168, 85, 247, 0.14); }
  50% { border-color: #a855f7; box-shadow: 0 0 22px rgba(168, 85, 247, 0.48), inset 0 0 14px rgba(250, 204, 21, 0.14); }
  80% { border-color: #facc15; box-shadow: 0 0 18px rgba(250, 204, 21, 0.36), inset 0 0 12px rgba(225, 29, 72, 0.16); }
}
body.champ-fx-crime-city .msg-row {
  background:
    repeating-linear-gradient(-45deg, rgba(225, 29, 72, 0.06) 0 4px, rgba(168, 85, 247, 0.04) 4px 10px, transparent 10px 24px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(11, 6, 14, 0.97)), var(--ct-bg-end, rgba(6, 5, 10, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #e11d48) !important;
  border-left: 4px solid var(--ct-tertiary, #facc15) !important;
  clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px);
  border-radius: 0 !important;
  animation: crimeCityCardPulse 6s ease-in-out infinite;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-crime-city ${s}`).join(',\n')} {
  position: relative;
  background:
    radial-gradient(circle at 14% 16%, rgba(225, 29, 72, 0.24), transparent 46%),
    radial-gradient(circle at 86% 84%, rgba(168, 85, 247, 0.24), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(11, 6, 14, 0.97)), var(--ct-bg-end, rgba(6, 5, 10, 0.98))) !important;
  border: 2px solid var(--ct-primary, #e11d48) !important;
  clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px);
  border-radius: 0 !important;
  animation: crimeCityCardPulse 5.4s ease-in-out infinite;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-crime-city ${s}::before`).join(',\n')} {
  content: '♠';
  position: absolute;
  top: 4px;
  left: 7px;
  font-size: 12px;
  line-height: 1;
  color: #facc15;
  text-shadow: 0 0 10px rgba(250, 204, 21, 0.85);
  pointer-events: none;
  z-index: 6;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-crime-city ${s}::after`).join(',\n')} {
  content: '♦';
  position: absolute;
  bottom: 4px;
  right: 7px;
  font-size: 12px;
  line-height: 1;
  color: #e11d48;
  text-shadow: 0 0 10px rgba(225, 29, 72, 0.85);
  pointer-events: none;
  z-index: 6;
}
body.champ-fx-crime-city .gs-title,
body.champ-fx-crime-city .gs-champ-name,
body.champ-fx-crime-city .lb-rank,
body.champ-fx-crime-city .sp-title,
body.champ-fx-crime-city .goal-title,
body.champ-fx-crime-city .poll-q,
body.champ-fx-crime-city .gw-title,
body.champ-fx-crime-city .sched-title,
body.champ-fx-crime-city .al-author,
body.champ-fx-crime-city .lt-topic,
body.champ-fx-crime-city .qna-author,
body.champ-fx-crime-city .tron-topic,
body.champ-fx-crime-city .val-rank-name { color: #faf5ff !important; text-shadow: 0 0 12px rgba(225, 29, 72, 0.85), 0 0 8px rgba(168, 85, 247, 0.65) !important; }
body.champ-fx-crime-city .gs-lp-fill,
body.champ-fx-crime-city .lb-lp-fill,
body.champ-fx-crime-city .goal-fill,
body.champ-fx-crime-city .sp-prog-fill,
body.champ-fx-crime-city .val-rr-fill { background: linear-gradient(90deg, #e11d48, #a855f7, #facc15) !important; }
@keyframes tfPickACardGlow {
  0%, 100% { border-color: #facc15 !important; box-shadow: 0 18px 46px rgba(0,0,0,0.7), 0 0 34px rgba(250, 204, 21, 0.72), inset 0 0 16px rgba(250, 204, 21, 0.22) !important; }
  33% { border-color: #ef4444 !important; box-shadow: 0 18px 46px rgba(0,0,0,0.7), 0 0 34px rgba(239, 68, 68, 0.72), inset 0 0 16px rgba(239, 68, 68, 0.22) !important; }
  66% { border-color: #38bdf8 !important; box-shadow: 0 18px 46px rgba(0,0,0,0.7), 0 0 34px rgba(56, 189, 248, 0.72), inset 0 0 16px rgba(56, 189, 248, 0.22) !important; }
}
@keyframes tfCardFlipReveal {
  0% { transform: perspective(700px) rotateY(90deg) scale(0.92); opacity: 0.4; }
  65% { transform: perspective(700px) rotateY(-10deg) scale(1.03); opacity: 1; }
  100% { transform: perspective(700px) rotateY(0deg) scale(1); opacity: 1; }
}
@keyframes tfCardShuffle {
  0% { border-color: #facc15; box-shadow: 0 0 22px rgba(250, 204, 21, 0.65); }
  33% { border-color: #ef4444; box-shadow: 0 0 22px rgba(239, 68, 68, 0.65); }
  66% { border-color: #38bdf8; box-shadow: 0 0 22px rgba(56, 189, 248, 0.65); }
  100% { border-color: #facc15; box-shadow: 0 0 22px rgba(250, 204, 21, 0.65); }
}
body.champ-fx-crime-city .alert-card {
  position: relative;
  animation: tfPickACardGlow 3.6s ease-in-out infinite !important;
}
body.champ-fx-crime-city .alert-card::before {
  content: '♠  ♥';
  position: absolute;
  top: 8px;
  left: 12px;
  font-size: 13px;
  letter-spacing: 2px;
  color: #facc15;
  text-shadow: 0 0 10px rgba(250, 204, 21, 0.85);
  pointer-events: none;
}
body.champ-fx-crime-city .alert-card::after {
  content: '♦  ♣';
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 13px;
  letter-spacing: 2px;
  color: #e11d48;
  text-shadow: 0 0 10px rgba(225, 29, 72, 0.85);
  pointer-events: none;
}
body.champ-fx-crime-city .gw-card {
  position: relative;
  animation: tfPickACardGlow 4.8s ease-in-out infinite !important;
}
body.champ-fx-crime-city .gw-slot {
  position: relative;
  background: linear-gradient(145deg, rgba(18, 9, 26, 0.96), rgba(9, 5, 14, 0.98)) !important;
  border: 2px solid #facc15 !important;
  border-radius: 10px !important;
  box-shadow: 0 0 20px rgba(250, 204, 21, 0.35), inset 0 0 0 3px rgba(11, 6, 14, 0.95), inset 0 0 0 4px rgba(250, 204, 21, 0.35) !important;
  padding: 18px 16px !important;
}
body.champ-fx-crime-city .gw-slot::before {
  content: '♠ A';
  position: absolute;
  top: 6px;
  left: 10px;
  font-size: 11px;
  font-weight: 800;
  color: #facc15;
  text-shadow: 0 0 8px rgba(250, 204, 21, 0.7);
}
body.champ-fx-crime-city .gw-slot::after {
  content: 'A ♦';
  position: absolute;
  bottom: 6px;
  right: 10px;
  font-size: 11px;
  font-weight: 800;
  color: #e11d48;
  text-shadow: 0 0 8px rgba(225, 29, 72, 0.7);
}
@keyframes tfDeckShuffleL {
  0%, 100% { transform: translateX(0) rotate(0deg) scale(1); z-index: 2; }
  25% { transform: translateX(-46px) translateY(-6px) rotate(-18deg) scale(1.06); z-index: 5; }
  55% { transform: translateX(6px) translateY(2px) rotate(4deg) scale(0.96); z-index: 1; }
  80% { transform: translateX(-28px) translateY(-3px) rotate(-10deg) scale(1.02); z-index: 4; }
}
@keyframes tfDeckShuffleR {
  0%, 100% { transform: translateX(0) rotate(0deg) scale(1); z-index: 3; }
  25% { transform: translateX(46px) translateY(-6px) rotate(18deg) scale(1.06); z-index: 4; }
  55% { transform: translateX(-6px) translateY(2px) rotate(-4deg) scale(0.96); z-index: 5; }
  80% { transform: translateX(28px) translateY(-3px) rotate(10deg) scale(1.02); z-index: 2; }
}
@keyframes tfDeckShuffleC {
  0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
  50% { transform: translateY(-9px) scale(1.1) rotate(8deg); }
}
body.champ-fx-crime-city .gw-slot.is-spinning .gw-deck { display: flex !important; }
body.champ-fx-crime-city .gw-slot.is-spinning .gw-mini-card.c1 { color: #facc15; border-color: #facc15; box-shadow: 0 0 14px rgba(250,204,21,0.75); animation: tfDeckShuffleL 0.48s cubic-bezier(0.45,0,0.55,1) infinite; }
body.champ-fx-crime-city .gw-slot.is-spinning .gw-mini-card.c2 { color: #ef4444; border-color: #ef4444; box-shadow: 0 0 14px rgba(239,68,68,0.75); animation: tfDeckShuffleR 0.48s cubic-bezier(0.45,0,0.55,1) infinite 0.08s; }
body.champ-fx-crime-city .gw-slot.is-spinning .gw-mini-card.c3 { color: #38bdf8; border-color: #38bdf8; box-shadow: 0 0 14px rgba(56,189,248,0.75); animation: tfDeckShuffleL 0.48s cubic-bezier(0.45,0,0.55,1) infinite 0.16s; }
body.champ-fx-crime-city .gw-slot.is-spinning .gw-mini-card.c4 { color: #a855f7; border-color: #a855f7; box-shadow: 0 0 14px rgba(168,85,247,0.75); animation: tfDeckShuffleR 0.48s cubic-bezier(0.45,0,0.55,1) infinite 0.24s; }
body.champ-fx-crime-city .gw-slot.is-spinning .gw-mini-card.c5 { color: #fde047; border-color: #e11d48; box-shadow: 0 0 16px rgba(225,29,72,0.8); animation: tfDeckShuffleC 0.36s ease-in-out infinite; z-index: 6; }
body.champ-fx-crime-city .gw-slot.is-spinning {
  animation: tfCardShuffle 0.65s linear infinite !important;
}
body.champ-fx-crime-city .gw-slot.has-winner {
  animation: tfCardFlipReveal 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards !important;
  border-color: #facc15 !important;
  box-shadow: 0 0 30px rgba(250, 204, 21, 0.75), inset 0 0 18px rgba(250, 204, 21, 0.25) !important;
}
body.champ-fx-crime-city .gw-winner {
  color: #fef08a !important;
  text-shadow: 0 0 18px rgba(250, 204, 21, 0.9), 0 0 8px rgba(225, 29, 72, 0.7) !important;
}

@keyframes prestigeRoseBladePulse {
  0%, 100% { border-color: #f5d061; box-shadow: 0 0 20px rgba(245, 208, 97, 0.45), inset 0 0 12px rgba(225, 29, 72, 0.16); }
  50% { border-color: #e11d48; box-shadow: 0 0 24px rgba(225, 29, 72, 0.52), inset 0 0 14px rgba(245, 208, 97, 0.22); }
}
body.champ-fx-prestige-rose .msg-row {
  background:
    repeating-linear-gradient(-40deg, rgba(245, 208, 97, 0.06) 0 4px, rgba(225, 29, 72, 0.05) 4px 10px, transparent 10px 24px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(16, 6, 12, 0.97)), var(--ct-bg-end, rgba(8, 5, 11, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #f5d061) !important;
  border-left: 4px solid var(--ct-secondary, #e11d48) !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  border-radius: 0 !important;
  animation: prestigeRoseBladePulse 4.6s ease-in-out infinite;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-prestige-rose ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 14% 16%, rgba(245, 208, 97, 0.22), transparent 46%),
    radial-gradient(circle at 86% 84%, rgba(225, 29, 72, 0.24), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(16, 6, 12, 0.97)), var(--ct-bg-end, rgba(8, 5, 11, 0.98))) !important;
  border: 2px solid var(--ct-primary, #f5d061) !important;
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  border-radius: 0 !important;
  animation: prestigeRoseBladePulse 4.2s ease-in-out infinite;
}
body.champ-fx-prestige-rose .gs-title,
body.champ-fx-prestige-rose .gs-champ-name,
body.champ-fx-prestige-rose .lb-rank,
body.champ-fx-prestige-rose .sp-title,
body.champ-fx-prestige-rose .goal-title,
body.champ-fx-prestige-rose .poll-q,
body.champ-fx-prestige-rose .gw-title,
body.champ-fx-prestige-rose .sched-title,
body.champ-fx-prestige-rose .al-author,
body.champ-fx-prestige-rose .lt-topic,
body.champ-fx-prestige-rose .qna-author,
body.champ-fx-prestige-rose .tron-topic,
body.champ-fx-prestige-rose .val-rank-name { color: #fff8eb !important; text-shadow: 0 0 12px rgba(245, 208, 97, 0.85), 0 0 8px rgba(225, 29, 72, 0.65) !important; }
body.champ-fx-prestige-rose .gs-lp-fill,
body.champ-fx-prestige-rose .lb-lp-fill,
body.champ-fx-prestige-rose .goal-fill,
body.champ-fx-prestige-rose .sp-prog-fill,
body.champ-fx-prestige-rose .val-rr-fill { background: linear-gradient(90deg, #f5d061, #e11d48, #f8fafc) !important; }
body.champ-fx-prestige-rose .alert-card {
  position: relative;
  animation: prestigeRoseBladePulse 3.2s ease-in-out infinite !important;
}
body.champ-fx-prestige-rose .alert-card::before {
  content: '🥀  ✦';
  position: absolute;
  top: 8px;
  left: 12px;
  font-size: 13px;
  color: #f5d061;
  text-shadow: 0 0 10px rgba(245, 208, 97, 0.85);
  pointer-events: none;
}
body.champ-fx-prestige-rose .alert-card::after {
  content: '✦  🗡️';
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 13px;
  color: #e11d48;
  text-shadow: 0 0 10px rgba(225, 29, 72, 0.85);
  pointer-events: none;
}
body.champ-fx-prestige-rose .gw-slot {
  position: relative;
  background: linear-gradient(145deg, rgba(22, 8, 16, 0.96), rgba(10, 5, 11, 0.98)) !important;
  border: 2px solid #f5d061 !important;
  box-shadow: 0 0 20px rgba(245, 208, 97, 0.35), inset 0 0 12px rgba(225, 29, 72, 0.18) !important;
}
body.champ-fx-prestige-rose .gw-slot::before {
  content: '🥀';
  position: absolute;
  top: 6px;
  left: 10px;
  font-size: 12px;
}
body.champ-fx-prestige-rose .gw-slot::after {
  content: '🗡️';
  position: absolute;
  bottom: 6px;
  right: 10px;
  font-size: 12px;
}
body.champ-fx-prestige-rose .gw-slot.is-spinning {
  animation: prestigeRoseBladePulse 0.65s linear infinite !important;
}
body.champ-fx-prestige-rose .gw-slot.has-winner {
  animation: tfCardFlipReveal 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards !important;
  box-shadow: 0 0 30px rgba(245, 208, 97, 0.78), inset 0 0 18px rgba(225, 29, 72, 0.25) !important;
}
body.champ-fx-prestige-rose .gw-winner {
  color: #fef08a !important;
  text-shadow: 0 0 18px rgba(245, 208, 97, 0.9), 0 0 8px rgba(225, 29, 72, 0.75) !important;
}

@keyframes djSonaBeatCycle {
  0%, 100% { border-color: #00e5ff; box-shadow: 0 0 22px rgba(0, 229, 255, 0.5), inset 0 0 14px rgba(0, 229, 255, 0.16); }
  33% { border-color: #ff2a6d; box-shadow: 0 0 24px rgba(255, 42, 109, 0.52), inset 0 0 14px rgba(255, 42, 109, 0.16); }
  66% { border-color: #c084fc; box-shadow: 0 0 24px rgba(192, 132, 252, 0.52), inset 0 0 14px rgba(192, 132, 252, 0.16); }
}
body.champ-fx-dj-sona .msg-row {
  background:
    repeating-linear-gradient(90deg, rgba(0, 229, 255, 0.05) 0 4px, transparent 4px 10px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(6, 10, 24, 0.96)), var(--ct-bg-end, rgba(12, 6, 26, 0.97))) !important;
  border: 1.5px solid var(--ct-primary, #00e5ff) !important;
  border-left: 4px solid var(--ct-secondary, #ff2a6d) !important;
  border-radius: 10px !important;
  animation: djSonaBeatCycle 4.5s ease-in-out infinite;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-dj-sona ${s}`).join(',\n')} {
  position: relative;
  background:
    radial-gradient(circle at 14% 16%, rgba(0, 229, 255, 0.22), transparent 46%),
    radial-gradient(circle at 86% 84%, rgba(255, 42, 109, 0.22), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(6, 10, 24, 0.96)), var(--ct-bg-end, rgba(12, 6, 26, 0.97))) !important;
  border: 2px solid var(--ct-primary, #00e5ff) !important;
  border-radius: 14px !important;
  animation: djSonaBeatCycle 4.2s ease-in-out infinite;
}
@keyframes djSonaEqScroll {
  0% { background-position: 0% 100%; filter: hue-rotate(0deg); }
  50% { background-position: 100% 100%; filter: hue-rotate(155deg); }
  100% { background-position: 200% 100%; filter: hue-rotate(360deg); }
}
@keyframes djSonaVisorPulse {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px #00e5ff); }
  33% { transform: scale(1.08); filter: hue-rotate(150deg) drop-shadow(0 0 10px #ff2a6d); }
  66% { transform: scale(1.04); filter: hue-rotate(260deg) drop-shadow(0 0 10px #c084fc); }
}
${ALL_OVERLAY_CARDS_SEL.filter((s) => s !== '.alert-card').map((s) => `body.champ-fx-dj-sona ${s}::before`).join(',\n')} {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  bottom: 2px;
  height: 18px;
  background-repeat: repeat-x;
  background-size: 96px 18px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 18'%3E%3Cg fill='%2300e5ff' opacity='0.78'%3E%3Ccircle cx='6' cy='14' r='2.3'/%3E%3Ccircle cx='6' cy='9' r='2.3'/%3E%3Ccircle cx='18' cy='14' r='2.3'/%3E%3Ccircle cx='18' cy='9' r='2.3'/%3E%3Ccircle cx='18' cy='4' r='2.3'/%3E%3Ccircle cx='30' cy='14' r='2.3'/%3E%3Ccircle cx='42' cy='14' r='2.3'/%3E%3Ccircle cx='42' cy='9' r='2.3'/%3E%3Ccircle cx='42' cy='4' r='2.3'/%3E%3Ccircle cx='54' cy='14' r='2.3'/%3E%3Ccircle cx='54' cy='9' r='2.3'/%3E%3Ccircle cx='66' cy='14' r='2.3'/%3E%3Ccircle cx='66' cy='9' r='2.3'/%3E%3Ccircle cx='66' cy='4' r='2.3'/%3E%3Ccircle cx='78' cy='14' r='2.3'/%3E%3Ccircle cx='78' cy='9' r='2.3'/%3E%3Ccircle cx='90' cy='14' r='2.3'/%3E%3C/g%3E%3C/svg%3E");
  animation: djSonaEqScroll 5.2s linear infinite;
  pointer-events: none;
  z-index: 6;
}
${ALL_OVERLAY_CARDS_SEL.filter((s) => s !== '.alert-card').map((s) => `body.champ-fx-dj-sona ${s}::after`).join(',\n')} {
  content: "";
  position: absolute;
  top: 5px;
  right: 7px;
  width: 26px;
  height: 22px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 30'%3E%3Cpolygon points='18,2 32,9 32,21 18,28 4,21 4,9' fill='%23060a18' stroke='%2300e5ff' stroke-width='2.2'/%3E%3Cpath d='M7 15 L12 15 L15 8 L18 22 L21 11 L24 15 L29 15' fill='none' stroke='%23ff2a6d' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  animation: djSonaVisorPulse 3.6s ease-in-out infinite;
  pointer-events: none;
  z-index: 8;
}
body.champ-fx-dj-sona .gs-title,
body.champ-fx-dj-sona .gs-champ-name,
body.champ-fx-dj-sona .lb-rank,
body.champ-fx-dj-sona .sp-title,
body.champ-fx-dj-sona .goal-title,
body.champ-fx-dj-sona .poll-q,
body.champ-fx-dj-sona .gw-title,
body.champ-fx-dj-sona .sched-title,
body.champ-fx-dj-sona .al-author,
body.champ-fx-dj-sona .lt-topic,
body.champ-fx-dj-sona .qna-author,
body.champ-fx-dj-sona .tron-topic,
body.champ-fx-dj-sona .val-rank-name { color: #f0f9ff !important; text-shadow: 0 0 12px rgba(0, 229, 255, 0.85), 0 0 8px rgba(255, 42, 109, 0.65) !important; }
body.champ-fx-dj-sona .gs-lp-fill,
body.champ-fx-dj-sona .lb-lp-fill,
body.champ-fx-dj-sona .goal-fill,
body.champ-fx-dj-sona .sp-prog-fill,
body.champ-fx-dj-sona .val-rr-fill { background: linear-gradient(90deg, #00e5ff, #ff2a6d, #c084fc) !important; }
body.champ-fx-dj-sona .alert-card {
  position: relative;
  animation: djSonaBeatCycle 2.8s ease-in-out infinite !important;
}
body.champ-fx-dj-sona .alert-card::before {
  content: '🎧  ♫';
  position: absolute;
  top: 8px;
  left: 12px;
  font-size: 13px;
  color: #00e5ff;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.85);
  pointer-events: none;
}
body.champ-fx-dj-sona .alert-card::after {
  content: '♪  🎛️';
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 13px;
  color: #ff2a6d;
  text-shadow: 0 0 10px rgba(255, 42, 109, 0.85);
  pointer-events: none;
}
body.champ-fx-dj-sona .gw-slot {
  position: relative;
  background: linear-gradient(145deg, rgba(8, 12, 30, 0.96), rgba(14, 6, 28, 0.98)) !important;
  border: 2px solid #00e5ff !important;
  box-shadow: 0 0 22px rgba(0, 229, 255, 0.38), inset 0 0 14px rgba(192, 132, 252, 0.2) !important;
}
body.champ-fx-dj-sona .gw-slot::before {
  content: '🎧';
  position: absolute;
  top: 6px;
  left: 10px;
  font-size: 12px;
}
body.champ-fx-dj-sona .gw-slot::after {
  content: '♫';
  position: absolute;
  bottom: 6px;
  right: 10px;
  font-size: 13px;
  color: #ff2a6d;
}
body.champ-fx-dj-sona .gw-slot.is-spinning {
  animation: djSonaBeatCycle 0.6s linear infinite !important;
}
body.champ-fx-dj-sona .gw-slot.has-winner {
  animation: tfCardFlipReveal 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards !important;
  box-shadow: 0 0 32px rgba(0, 229, 255, 0.8), inset 0 0 18px rgba(255, 42, 109, 0.28) !important;
}
body.champ-fx-dj-sona .gw-winner {
  color: #e0f2fe !important;
  text-shadow: 0 0 18px rgba(0, 229, 255, 0.95), 0 0 10px rgba(255, 42, 109, 0.75) !important;
}

@keyframes fracturedJinxPulse {
  0%, 100% { border-color: #ff2e97; box-shadow: 0 0 22px rgba(255, 46, 151, 0.52), inset 0 0 14px rgba(0, 240, 255, 0.16); }
  45% { border-color: #00f0ff; box-shadow: 0 0 24px rgba(0, 240, 255, 0.55), inset 0 0 14px rgba(255, 46, 151, 0.18); }
  78% { border-color: #ffe14d; box-shadow: 0 0 20px rgba(255, 225, 77, 0.45), inset 0 0 12px rgba(255, 46, 151, 0.18); }
}
body.champ-fx-arcane-fractured .msg-row {
  background:
    repeating-linear-gradient(-32deg, rgba(255, 46, 151, 0.07) 0 5px, rgba(0, 240, 255, 0.05) 5px 11px, transparent 11px 26px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(14, 6, 22, 0.97)), var(--ct-bg-end, rgba(6, 12, 22, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #ff2e97) !important;
  border-left: 4px solid var(--ct-secondary, #00f0ff) !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 10px));
  border-radius: 0 !important;
  animation: fracturedJinxPulse 4.2s ease-in-out infinite;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-arcane-fractured ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 14% 16%, rgba(255, 46, 151, 0.25), transparent 46%),
    radial-gradient(circle at 86% 84%, rgba(0, 240, 255, 0.24), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(14, 6, 22, 0.97)), var(--ct-bg-end, rgba(6, 12, 22, 0.98))) !important;
  border: 2px solid var(--ct-primary, #ff2e97) !important;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 10px);
  border-radius: 0 !important;
  animation: fracturedJinxPulse 3.8s ease-in-out infinite;
}
body.champ-fx-arcane-fractured .gs-title,
body.champ-fx-arcane-fractured .gs-champ-name,
body.champ-fx-arcane-fractured .lb-rank,
body.champ-fx-arcane-fractured .sp-title,
body.champ-fx-arcane-fractured .goal-title,
body.champ-fx-arcane-fractured .poll-q,
body.champ-fx-arcane-fractured .gw-title,
body.champ-fx-arcane-fractured .sched-title,
body.champ-fx-arcane-fractured .al-author,
body.champ-fx-arcane-fractured .lt-topic,
body.champ-fx-arcane-fractured .qna-author,
body.champ-fx-arcane-fractured .tron-topic,
body.champ-fx-arcane-fractured .val-rank-name { color: #fff5fb !important; text-shadow: 0 0 12px rgba(255, 46, 151, 0.9), 0 0 8px rgba(0, 240, 255, 0.7) !important; }
body.champ-fx-arcane-fractured .gs-lp-fill,
body.champ-fx-arcane-fractured .lb-lp-fill,
body.champ-fx-arcane-fractured .goal-fill,
body.champ-fx-arcane-fractured .sp-prog-fill,
body.champ-fx-arcane-fractured .val-rr-fill { background: linear-gradient(90deg, #ff2e97, #00f0ff, #ffe14d) !important; }
body.champ-fx-arcane-fractured .alert-card {
  position: relative;
  animation: fracturedJinxPulse 2.6s ease-in-out infinite !important;
}
body.champ-fx-arcane-fractured .alert-card::before {
  content: '💣  ✕';
  position: absolute;
  top: 8px;
  left: 12px;
  font-size: 13px;
  color: #ff2e97;
  text-shadow: 0 0 10px rgba(255, 46, 151, 0.9);
  pointer-events: none;
}
body.champ-fx-arcane-fractured .alert-card::after {
  content: '⚡  ✖';
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 13px;
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.9);
  pointer-events: none;
}
body.champ-fx-arcane-fractured .gw-slot {
  position: relative;
  background: linear-gradient(145deg, rgba(20, 6, 28, 0.96), rgba(6, 14, 26, 0.98)) !important;
  border: 2px solid #ff2e97 !important;
  box-shadow: 0 0 22px rgba(255, 46, 151, 0.42), inset 0 0 14px rgba(0, 240, 255, 0.2) !important;
}
body.champ-fx-arcane-fractured .gw-slot::before {
  content: '💣';
  position: absolute;
  top: 6px;
  left: 10px;
  font-size: 12px;
}
body.champ-fx-arcane-fractured .gw-slot::after {
  content: '⚡';
  position: absolute;
  bottom: 6px;
  right: 10px;
  font-size: 12px;
}
body.champ-fx-arcane-fractured .gw-slot.is-spinning {
  animation: fracturedJinxPulse 0.55s linear infinite !important;
}
body.champ-fx-arcane-fractured .gw-slot.has-winner {
  animation: tfCardFlipReveal 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards !important;
  box-shadow: 0 0 32px rgba(255, 46, 151, 0.85), inset 0 0 18px rgba(0, 240, 255, 0.3) !important;
}
body.champ-fx-arcane-fractured .gw-winner {
  color: #fff5fb !important;
  text-shadow: 0 0 18px rgba(255, 46, 151, 0.95), 0 0 10px rgba(0, 240, 255, 0.8) !important;
}

@keyframes eveFirestarterPulse {
  0%, 100% { border-color: #ff1e6b; box-shadow: 0 0 22px rgba(255, 30, 107, 0.55), inset 0 0 14px rgba(168, 85, 247, 0.18); }
  50% { border-color: #a855f7; box-shadow: 0 0 26px rgba(168, 85, 247, 0.55), inset 0 0 14px rgba(255, 122, 0, 0.2); }
  80% { border-color: #ff7a00; box-shadow: 0 0 22px rgba(255, 122, 0, 0.5), inset 0 0 14px rgba(255, 30, 107, 0.2); }
}
body.champ-fx-eve-firestarter .msg-row {
  background:
    repeating-linear-gradient(-38deg, rgba(255, 30, 107, 0.07) 0 4px, rgba(168, 85, 247, 0.05) 4px 10px, transparent 10px 24px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(16, 4, 14, 0.97)), var(--ct-bg-end, rgba(8, 3, 12, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #ff1e6b) !important;
  border-left: 4px solid var(--ct-tertiary, #ff7a00) !important;
  clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);
  border-radius: 0 !important;
  animation: eveFirestarterPulse 4.6s ease-in-out infinite;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-eve-firestarter ${s}`).join(',\n')} {
  background:
    radial-gradient(circle at 14% 16%, rgba(255, 30, 107, 0.26), transparent 46%),
    radial-gradient(circle at 86% 84%, rgba(168, 85, 247, 0.24), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(16, 4, 14, 0.97)), var(--ct-bg-end, rgba(8, 3, 12, 0.98))) !important;
  border: 2px solid var(--ct-primary, #ff1e6b) !important;
  clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);
  border-radius: 0 !important;
  animation: eveFirestarterPulse 4.2s ease-in-out infinite;
}
body.champ-fx-eve-firestarter .gs-title,
body.champ-fx-eve-firestarter .gs-champ-name,
body.champ-fx-eve-firestarter .lb-rank,
body.champ-fx-eve-firestarter .sp-title,
body.champ-fx-eve-firestarter .goal-title,
body.champ-fx-eve-firestarter .poll-q,
body.champ-fx-eve-firestarter .gw-title,
body.champ-fx-eve-firestarter .sched-title,
body.champ-fx-eve-firestarter .al-author,
body.champ-fx-eve-firestarter .lt-topic,
body.champ-fx-eve-firestarter .qna-author,
body.champ-fx-eve-firestarter .tron-topic,
body.champ-fx-eve-firestarter .val-rank-name { color: #fff0f6 !important; text-shadow: 0 0 12px rgba(255, 30, 107, 0.92), 0 0 8px rgba(255, 122, 0, 0.72) !important; }
body.champ-fx-eve-firestarter .gs-lp-fill,
body.champ-fx-eve-firestarter .lb-lp-fill,
body.champ-fx-eve-firestarter .goal-fill,
body.champ-fx-eve-firestarter .sp-prog-fill,
body.champ-fx-eve-firestarter .val-rr-fill { background: linear-gradient(90deg, #ff1e6b, #a855f7, #ff7a00) !important; }
body.champ-fx-eve-firestarter .alert-card {
  position: relative;
  animation: eveFirestarterPulse 2.8s ease-in-out infinite !important;
}
body.champ-fx-eve-firestarter .alert-card::before {
  content: '🖤  🔥';
  position: absolute;
  top: 8px;
  left: 12px;
  font-size: 13px;
  color: #ff1e6b;
  text-shadow: 0 0 10px rgba(255, 30, 107, 0.9);
  pointer-events: none;
}
body.champ-fx-eve-firestarter .alert-card::after {
  content: '🔥  ✦';
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 13px;
  color: #ff7a00;
  text-shadow: 0 0 10px rgba(255, 122, 0, 0.9);
  pointer-events: none;
}
body.champ-fx-eve-firestarter .gw-slot {
  position: relative;
  background: linear-gradient(145deg, rgba(22, 5, 18, 0.96), rgba(10, 3, 14, 0.98)) !important;
  border: 2px solid #ff1e6b !important;
  box-shadow: 0 0 22px rgba(255, 30, 107, 0.45), inset 0 0 14px rgba(168, 85, 247, 0.22) !important;
}
body.champ-fx-eve-firestarter .gw-slot::before {
  content: '🖤';
  position: absolute;
  top: 6px;
  left: 10px;
  font-size: 12px;
}
body.champ-fx-eve-firestarter .gw-slot::after {
  content: '🔥';
  position: absolute;
  bottom: 6px;
  right: 10px;
  font-size: 12px;
}
body.champ-fx-eve-firestarter .gw-slot.is-spinning {
  animation: eveFirestarterPulse 0.6s linear infinite !important;
}
body.champ-fx-eve-firestarter .gw-slot.has-winner {
  animation: tfCardFlipReveal 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards !important;
  box-shadow: 0 0 32px rgba(255, 30, 107, 0.85), inset 0 0 18px rgba(255, 122, 0, 0.32) !important;
}
body.champ-fx-eve-firestarter .gw-winner {
  color: #fff0f6 !important;
  text-shadow: 0 0 18px rgba(255, 30, 107, 0.95), 0 0 10px rgba(255, 122, 0, 0.82) !important;
}

@keyframes ahriFirestarterPulse {
  0%, 100% { border-color: #ff2e97; box-shadow: 0 0 22px rgba(255, 46, 151, 0.58), inset 0 0 14px rgba(255, 30, 86, 0.18); }
  50% { border-color: #ff1e56; box-shadow: 0 0 26px rgba(255, 30, 86, 0.62), inset 0 0 14px rgba(253, 164, 175, 0.22); }
}
body.champ-fx-ahri-firestarter .msg-row {
  background:
    repeating-linear-gradient(-35deg, rgba(255, 46, 151, 0.07) 0 4px, rgba(255, 30, 86, 0.05) 4px 10px, transparent 10px 24px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(18, 4, 14, 0.97)), var(--ct-bg-end, rgba(9, 3, 12, 0.98))) !important;
  border: 1.5px solid var(--ct-primary, #ff2e97) !important;
  border-left: 4px solid var(--ct-secondary, #ff1e56) !important;
  border-radius: 12px !important;
  animation: ahriFirestarterPulse 4.2s ease-in-out infinite;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-ahri-firestarter ${s}`).join(',\n')} {
  position: relative;
  background:
    radial-gradient(circle at 14% 16%, rgba(255, 46, 151, 0.26), transparent 46%),
    radial-gradient(circle at 86% 84%, rgba(255, 30, 86, 0.24), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(18, 4, 14, 0.97)), var(--ct-bg-end, rgba(9, 3, 12, 0.98))) !important;
  border: 2px solid var(--ct-primary, #ff2e97) !important;
  border-radius: 14px !important;
  animation: ahriFirestarterPulse 3.8s ease-in-out infinite;
}
body.champ-fx-ahri-firestarter .gs-title,
body.champ-fx-ahri-firestarter .gs-champ-name,
body.champ-fx-ahri-firestarter .lb-rank,
body.champ-fx-ahri-firestarter .sp-title,
body.champ-fx-ahri-firestarter .goal-title,
body.champ-fx-ahri-firestarter .poll-q,
body.champ-fx-ahri-firestarter .gw-title,
body.champ-fx-ahri-firestarter .sched-title,
body.champ-fx-ahri-firestarter .al-author,
body.champ-fx-ahri-firestarter .lt-topic,
body.champ-fx-ahri-firestarter .qna-author,
body.champ-fx-ahri-firestarter .tron-topic,
body.champ-fx-ahri-firestarter .val-rank-name { color: #fff0f7 !important; text-shadow: 0 0 12px rgba(255, 46, 151, 0.92), 0 0 8px rgba(255, 30, 86, 0.72) !important; }
body.champ-fx-ahri-firestarter .gs-lp-fill,
body.champ-fx-ahri-firestarter .lb-lp-fill,
body.champ-fx-ahri-firestarter .goal-fill,
body.champ-fx-ahri-firestarter .sp-prog-fill,
body.champ-fx-ahri-firestarter .val-rr-fill { background: linear-gradient(90deg, #ff2e97, #ff1e56, #fda4af) !important; }
body.champ-fx-ahri-firestarter .alert-card {
  position: relative;
  animation: ahriFirestarterPulse 2.6s ease-in-out infinite !important;
}
body.champ-fx-ahri-firestarter .alert-card::before {
  content: '♥  🦊';
  position: absolute;
  top: 8px;
  left: 12px;
  font-size: 13px;
  color: #ff2e97;
  text-shadow: 0 0 12px rgba(255, 46, 151, 0.95);
  pointer-events: none;
}
body.champ-fx-ahri-firestarter .alert-card::after {
  content: '🔥  ♥';
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 13px;
  color: #ff1e56;
  text-shadow: 0 0 12px rgba(255, 30, 86, 0.95);
  pointer-events: none;
}
body.champ-fx-ahri-firestarter .gw-slot {
  position: relative;
  background: linear-gradient(145deg, rgba(26, 5, 20, 0.96), rgba(10, 3, 14, 0.98)) !important;
  border: 2px solid #ff2e97 !important;
  box-shadow: 0 0 22px rgba(255, 46, 151, 0.45), inset 0 0 14px rgba(255, 30, 86, 0.22) !important;
}
body.champ-fx-ahri-firestarter .gw-slot::before {
  content: '♥';
  position: absolute;
  top: 6px;
  left: 10px;
  font-size: 13px;
  color: #ff2e97;
}
body.champ-fx-ahri-firestarter .gw-slot::after {
  content: '🦊';
  position: absolute;
  bottom: 6px;
  right: 10px;
  font-size: 12px;
}
body.champ-fx-ahri-firestarter .gw-slot.is-spinning {
  animation: ahriFirestarterPulse 0.55s linear infinite !important;
}
body.champ-fx-ahri-firestarter .gw-slot.has-winner {
  animation: tfCardFlipReveal 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards !important;
  box-shadow: 0 0 34px rgba(255, 46, 151, 0.88), inset 0 0 18px rgba(255, 30, 86, 0.32) !important;
}
body.champ-fx-ahri-firestarter .gw-winner {
  color: #fff0f7 !important;
  text-shadow: 0 0 18px rgba(255, 46, 151, 0.95), 0 0 10px rgba(255, 30, 86, 0.82) !important;
}

@keyframes threshChainPulse {
  0%, 100% { box-shadow: 0 0 22px rgba(16, 185, 129, 0.48), inset 0 0 14px rgba(94, 234, 212, 0.16); }
  50% { box-shadow: 0 0 28px rgba(94, 234, 212, 0.58), inset 0 0 18px rgba(16, 185, 129, 0.24); }
}
@keyframes threshLanternSway {
  0%, 100% { transform: rotate(-6deg); filter: drop-shadow(0 0 8px rgba(94, 234, 212, 0.9)); }
  50% { transform: rotate(6deg); filter: drop-shadow(0 0 14px rgba(16, 185, 129, 1)); }
}
body.champ-fx-unbound-thresh .msg-row {
  background:
    repeating-linear-gradient(-40deg, rgba(16, 185, 129, 0.06) 0 4px, rgba(94, 234, 212, 0.04) 4px 10px, transparent 10px 24px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(4, 16, 14, 0.97)), var(--ct-bg-end, rgba(2, 9, 10, 0.98))) !important;
  border: 4px solid transparent !important;
  border-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect x='2' y='2' width='14' height='8' rx='4' fill='none' stroke='%2310b981' stroke-width='2.6'/%3E%3Crect x='13' y='4' width='12' height='4' rx='2' fill='%235eead4'/%3E%3Crect x='22' y='2' width='14' height='8' rx='4' fill='none' stroke='%2310b981' stroke-width='2.6'/%3E%3Crect x='33' y='4' width='12' height='4' rx='2' fill='%235eead4'/%3E%3Crect x='2' y='38' width='14' height='8' rx='4' fill='none' stroke='%2310b981' stroke-width='2.6'/%3E%3Crect x='13' y='40' width='12' height='4' rx='2' fill='%235eead4'/%3E%3Crect x='22' y='38' width='14' height='8' rx='4' fill='none' stroke='%2310b981' stroke-width='2.6'/%3E%3Crect x='33' y='40' width='12' height='4' rx='2' fill='%235eead4'/%3E%3Crect x='2' y='14' width='8' height='14' rx='4' fill='none' stroke='%2310b981' stroke-width='2.6'/%3E%3Crect x='4' y='25' width='4' height='10' rx='2' fill='%235eead4'/%3E%3Crect x='38' y='14' width='8' height='14' rx='4' fill='none' stroke='%2310b981' stroke-width='2.6'/%3E%3Crect x='40' y='25' width='4' height='10' rx='2' fill='%235eead4'/%3E%3C/svg%3E") 12 round !important;
  border-radius: 0 !important;
  animation: threshChainPulse 4.6s ease-in-out infinite;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-unbound-thresh ${s}`).join(',\n')} {
  position: relative;
  background:
    radial-gradient(circle at 14% 16%, rgba(16, 185, 129, 0.24), transparent 46%),
    radial-gradient(circle at 86% 84%, rgba(94, 234, 212, 0.22), transparent 50%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(4, 16, 14, 0.97)), var(--ct-bg-end, rgba(2, 9, 10, 0.98))) !important;
  border: 6px solid transparent !important;
  border-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect x='2' y='2' width='14' height='8' rx='4' fill='none' stroke='%2310b981' stroke-width='2.8'/%3E%3Crect x='13' y='4' width='12' height='4' rx='2' fill='%235eead4'/%3E%3Crect x='22' y='2' width='14' height='8' rx='4' fill='none' stroke='%2310b981' stroke-width='2.8'/%3E%3Crect x='33' y='4' width='12' height='4' rx='2' fill='%235eead4'/%3E%3Crect x='2' y='38' width='14' height='8' rx='4' fill='none' stroke='%2310b981' stroke-width='2.8'/%3E%3Crect x='13' y='40' width='12' height='4' rx='2' fill='%235eead4'/%3E%3Crect x='22' y='38' width='14' height='8' rx='4' fill='none' stroke='%2310b981' stroke-width='2.8'/%3E%3Crect x='33' y='40' width='12' height='4' rx='2' fill='%235eead4'/%3E%3Crect x='2' y='14' width='8' height='14' rx='4' fill='none' stroke='%2310b981' stroke-width='2.8'/%3E%3Crect x='4' y='25' width='4' height='10' rx='2' fill='%235eead4'/%3E%3Crect x='38' y='14' width='8' height='14' rx='4' fill='none' stroke='%2310b981' stroke-width='2.8'/%3E%3Crect x='40' y='25' width='4' height='10' rx='2' fill='%235eead4'/%3E%3C/svg%3E") 12 round !important;
  border-radius: 0 !important;
  animation: threshChainPulse 4.2s ease-in-out infinite;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-unbound-thresh ${s}::after`).join(',\n')} {
  content: '';
  position: absolute;
  top: 4px;
  right: 6px;
  width: 24px;
  height: 30px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 42'%3E%3Cpath d='M16 1v5M11 6h10l3 6H8l3-6z' fill='%23111827' stroke='%235eead4' stroke-width='1.8'/%3E%3Cpath d='M9 12h14l2 18-9 9-9-9 2-18z' fill='%23052e2b' stroke='%2310b981' stroke-width='2'/%3E%3Cellipse cx='16' cy='22' rx='5' ry='8' fill='%235eead4'/%3E%3Cellipse cx='16' cy='22' rx='2.5' ry='5' fill='%23ecfdf5'/%3E%3Cpath d='M16 12v27M10 18h12M10 26h12' stroke='%23041414' stroke-width='1.5'/%3E%3C/svg%3E");
  transform-origin: top center;
  animation: threshLanternSway 3.4s ease-in-out infinite;
  pointer-events: none;
  z-index: 8;
}
body.champ-fx-unbound-thresh .gs-title,
body.champ-fx-unbound-thresh .gs-champ-name,
body.champ-fx-unbound-thresh .lb-rank,
body.champ-fx-unbound-thresh .sp-title,
body.champ-fx-unbound-thresh .goal-title,
body.champ-fx-unbound-thresh .poll-q,
body.champ-fx-unbound-thresh .gw-title,
body.champ-fx-unbound-thresh .sched-title,
body.champ-fx-unbound-thresh .al-author,
body.champ-fx-unbound-thresh .lt-topic,
body.champ-fx-unbound-thresh .qna-author,
body.champ-fx-unbound-thresh .tron-topic,
body.champ-fx-unbound-thresh .val-rank-name { color: #ecfdf5 !important; text-shadow: 0 0 12px rgba(16, 185, 129, 0.92), 0 0 8px rgba(94, 234, 212, 0.72) !important; }
body.champ-fx-unbound-thresh .gs-lp-fill,
body.champ-fx-unbound-thresh .lb-lp-fill,
body.champ-fx-unbound-thresh .goal-fill,
body.champ-fx-unbound-thresh .sp-prog-fill,
body.champ-fx-unbound-thresh .val-rr-fill { background: linear-gradient(90deg, #059669, #10b981, #5eead4) !important; }
body.champ-fx-unbound-thresh .alert-card::before {
  content: '⛓️  👻';
  position: absolute;
  top: 6px;
  left: 10px;
  font-size: 13px;
  color: #5eead4;
  text-shadow: 0 0 12px rgba(94, 234, 212, 0.95);
  pointer-events: none;
}
body.champ-fx-unbound-thresh .gw-slot {
  position: relative;
  background: linear-gradient(145deg, rgba(4, 24, 20, 0.96), rgba(2, 10, 12, 0.98)) !important;
  border: 2px solid #10b981 !important;
  box-shadow: 0 0 24px rgba(16, 185, 129, 0.48), inset 0 0 16px rgba(94, 234, 212, 0.24) !important;
}
body.champ-fx-unbound-thresh .gw-slot.is-spinning {
  animation: threshChainPulse 0.55s linear infinite !important;
}
body.champ-fx-unbound-thresh .gw-slot.has-winner {
  animation: tfCardFlipReveal 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards !important;
  box-shadow: 0 0 34px rgba(94, 234, 212, 0.88), inset 0 0 18px rgba(16, 185, 129, 0.35) !important;
}
body.champ-fx-unbound-thresh .gw-winner {
  color: #a7f3d0 !important;
  text-shadow: 0 0 18px rgba(94, 234, 212, 0.95), 0 0 10px rgba(16, 185, 129, 0.85) !important;
}

/* REVENANT REIGN VIEGO: Purple & Spectral-Blue Soul River Mist (E) with Reaching Arms + Morphing Greatsword */
@keyframes revenantSwordCycle {
  0%, 100% {
    filter: hue-rotate(0deg) drop-shadow(0 0 10px rgba(225, 29, 72, 0.9));
    transform: rotate(-16deg) scale(1, 1);
  }
  25% {
    filter: hue-rotate(270deg) drop-shadow(0 0 11px rgba(168, 85, 247, 0.92));
    transform: rotate(-12deg) scale(1.12, 0.94);
  }
  50% {
    filter: hue-rotate(195deg) drop-shadow(0 0 11px rgba(56, 189, 248, 0.92));
    transform: rotate(-20deg) scale(0.95, 1.12);
  }
  75% {
    filter: hue-rotate(48deg) drop-shadow(0 0 11px rgba(250, 204, 21, 0.92));
    transform: rotate(-14deg) scale(1.08, 1.04);
  }
}
@keyframes revenantRiverFlow {
  0% { background-position: 0% 100%, 0% 0%; }
  50% { background-position: 100% 100%, 50% 0%; }
  100% { background-position: 0% 100%, 100% 0%; }
}
@keyframes revenantBorderShift {
  0%, 100% { border-color: #e11d48; box-shadow: 0 0 24px rgba(225, 29, 72, 0.44), inset 0 -18px 28px rgba(168, 85, 247, 0.28); }
  33% { border-color: #a855f7; box-shadow: 0 0 26px rgba(168, 85, 247, 0.52), inset 0 -18px 28px rgba(56, 189, 248, 0.30); }
  66% { border-color: #38bdf8; box-shadow: 0 0 26px rgba(56, 189, 248, 0.48), inset 0 -18px 28px rgba(168, 85, 247, 0.32); }
}
body.champ-fx-revenant-reign .msg-row {
  background:
    linear-gradient(90deg, rgba(168, 85, 247, 0.22), rgba(56, 189, 248, 0.14) 55%, rgba(225, 29, 72, 0.16)),
    linear-gradient(135deg, var(--ct-bg-start, rgba(12, 6, 22, 0.97)), var(--ct-bg-end, rgba(6, 10, 24, 0.98))) !important;
  border: 1.5px solid #a855f7 !important;
  border-left: 4px solid #e11d48 !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  border-radius: 0 !important;
  box-shadow: 0 0 18px rgba(168, 85, 247, 0.32), -2px 0 10px rgba(225, 29, 72, 0.48) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-revenant-reign ${s}`).join(',\n')} {
  position: relative;
  background:
    radial-gradient(ellipse at 20% 100%, rgba(168, 85, 247, 0.36), transparent 56%),
    radial-gradient(ellipse at 80% 100%, rgba(56, 189, 248, 0.32), transparent 56%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(12, 6, 22, 0.97)), var(--ct-bg-end, rgba(6, 10, 24, 0.98))) !important;
  border: 2px solid #e11d48 !important;
  clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px);
  border-radius: 0 !important;
  animation: revenantBorderShift 6.4s ease-in-out infinite;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-revenant-reign ${s}::before`).join(',\n')} {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 54px;
  background-image: url('/api/theme-asset/viego-soul-river.jpg');
  background-size: 220% auto;
  background-position: 0% 82%;
  mix-blend-mode: screen;
  opacity: 0.68;
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 48%, rgba(0,0,0,0) 100%);
  mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 48%, rgba(0,0,0,0) 100%);
  filter: saturate(1.35) contrast(1.15) drop-shadow(0 -2px 10px rgba(168, 85, 247, 0.55));
  animation: revenantRiverFlow 11s ease-in-out infinite alternate;
  pointer-events: none;
  z-index: 6;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-revenant-reign ${s}::after`).join(',\n')} {
  content: "";
  position: absolute;
  top: 4px;
  right: 6px;
  width: 26px;
  height: 34px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 46'%3E%3Cpath d='M16 1 L21 10 L19 16 L22 22 L18 28 L16 30 L14 28 L10 22 L13 16 L11 10 Z' fill='%23e11d48' stroke='%23fda4af' stroke-width='1.5'/%3E%3Cpath d='M16 4 L16 28' stroke='%23ffffff' stroke-width='1.6'/%3E%3Cpath d='M5 30 Q16 24 27 30 Q16 33 5 30 Z' fill='%231e1b4b' stroke='%23e11d48' stroke-width='1.8'/%3E%3Crect x='14.5' y='31' width='3' height='9' fill='%230f172a' stroke='%23a855f7' stroke-width='1'/%3E%3Cpolygon points='16,40 19,43 16,46 13,43' fill='%2338bdf8'/%3E%3C/svg%3E");
  transform-origin: center center;
  animation: revenantSwordCycle 7.2s ease-in-out infinite;
  pointer-events: none;
  z-index: 8;
}
body.champ-fx-revenant-reign .gs-title,
body.champ-fx-revenant-reign .gs-champ-name,
body.champ-fx-revenant-reign .lb-rank,
body.champ-fx-revenant-reign .sp-title,
body.champ-fx-revenant-reign .goal-title,
body.champ-fx-revenant-reign .poll-q,
body.champ-fx-revenant-reign .gw-title,
body.champ-fx-revenant-reign .sched-title,
body.champ-fx-revenant-reign .al-author,
body.champ-fx-revenant-reign .lt-topic,
body.champ-fx-revenant-reign .qna-author,
body.champ-fx-revenant-reign .tron-topic,
body.champ-fx-revenant-reign .val-rank-name { color: #f5f3ff !important; text-shadow: 0 0 12px rgba(225, 29, 72, 0.88), 0 0 8px rgba(168, 85, 247, 0.78) !important; }
body.champ-fx-revenant-reign .gs-lp-fill,
body.champ-fx-revenant-reign .lb-lp-fill,
body.champ-fx-revenant-reign .goal-fill,
body.champ-fx-revenant-reign .sp-prog-fill,
body.champ-fx-revenant-reign .val-rr-fill { background: linear-gradient(90deg, #e11d48, #a855f7, #38bdf8) !important; }

/* FINAL BOSS VEIGAR: 8-Bit Retro Arcade Pixel HUD, CRT Scanlines, Glitch Voxels & Pixel Hearts */
@keyframes finalBossGlitch {
  0%, 90%, 100% { box-shadow: 4px 4px 0 #050212, 0 0 22px rgba(34, 255, 102, 0.45), inset 0 0 14px rgba(168, 85, 247, 0.22); border-color: #22ff66; }
  93% { box-shadow: -3px 3px 0 #ff2a85, 3px -2px 0 #00f0ff, 0 0 26px rgba(168, 85, 247, 0.65); border-color: #a855f7; }
  96% { box-shadow: 3px 4px 0 #22ff66, -2px 0 0 #ffe14d, 0 0 24px rgba(0, 240, 255, 0.6); border-color: #00f0ff; }
}
@keyframes finalBossPixelFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
}
body.champ-fx-final-boss .msg-row {
  background:
    repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.24) 0 2px, transparent 2px 4px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(8, 6, 20, 0.97)), var(--ct-bg-end, rgba(16, 6, 28, 0.98))) !important;
  border: 2px solid #22ff66 !important;
  border-left: 5px solid #a855f7 !important;
  border-radius: 0 !important;
  box-shadow: 3px 3px 0 #050212, 0 0 14px rgba(34, 255, 102, 0.28) !important;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-final-boss ${s}`).join(',\n')} {
  position: relative;
  background:
    repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.22) 0 2px, transparent 2px 4px),
    radial-gradient(circle at 12% 14%, rgba(34, 255, 102, 0.20), transparent 45%),
    radial-gradient(circle at 88% 86%, rgba(168, 85, 247, 0.26), transparent 48%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(8, 6, 20, 0.97)), var(--ct-bg-end, rgba(16, 6, 28, 0.98))) !important;
  border: 3px solid #22ff66 !important;
  border-radius: 0 !important;
  clip-path: polygon(6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), 0 calc(100% - 6px), 0 6px, 6px 6px);
  animation: finalBossGlitch 4.4s steps(2, end) infinite;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-final-boss ${s}::before`).join(',\n')} {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  bottom: 2px;
  height: 12px;
  background-repeat: repeat-x;
  background-size: 64px 12px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 12'%3E%3Crect x='2' y='6' width='6' height='6' fill='%2322ff66' opacity='0.85'/%3E%3Crect x='10' y='3' width='6' height='6' fill='%23a855f7' opacity='0.8'/%3E%3Crect x='22' y='6' width='6' height='6' fill='%2300f0ff' opacity='0.78'/%3E%3Crect x='34' y='4' width='6' height='6' fill='%2322ff66' opacity='0.72'/%3E%3Crect x='46' y='6' width='6' height='6' fill='%23ff2a85' opacity='0.78'/%3E%3Crect x='54' y='2' width='6' height='6' fill='%23ffe14d' opacity='0.75'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 6;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-final-boss ${s}::after`).join(',\n')} {
  content: "";
  position: absolute;
  top: 6px;
  right: 8px;
  width: 28px;
  height: 22px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 22'%3E%3Crect x='4' y='2' width='4' height='4' fill='%2322ff66'/%3E%3Crect x='20' y='2' width='4' height='4' fill='%2322ff66'/%3E%3Crect x='8' y='6' width='12' height='4' fill='%23a855f7'/%3E%3Crect x='4' y='10' width='20' height='6' fill='%23a855f7'/%3E%3Crect x='8' y='10' width='4' height='4' fill='%2322ff66'/%3E%3Crect x='16' y='10' width='4' height='4' fill='%2322ff66'/%3E%3Crect x='2' y='16' width='4' height='4' fill='%2300f0ff'/%3E%3Crect x='22' y='16' width='4' height='4' fill='%2300f0ff'/%3E%3C/svg%3E");
  animation: finalBossPixelFloat 1.8s steps(3, end) infinite;
  pointer-events: none;
  z-index: 8;
}
body.champ-fx-final-boss .gs-title,
body.champ-fx-final-boss .gs-champ-name,
body.champ-fx-final-boss .lb-rank,
body.champ-fx-final-boss .sp-title,
body.champ-fx-final-boss .goal-title,
body.champ-fx-final-boss .poll-q,
body.champ-fx-final-boss .gw-title,
body.champ-fx-final-boss .sched-title,
body.champ-fx-final-boss .al-author,
body.champ-fx-final-boss .lt-topic,
body.champ-fx-final-boss .qna-author,
body.champ-fx-final-boss .tron-topic,
body.champ-fx-final-boss .val-rank-name {
  color: #ecfdf5 !important;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace !important;
  text-shadow: 2px 2px 0 #050212, 0 0 10px rgba(34, 255, 102, 0.85), 0 0 8px rgba(168, 85, 247, 0.72) !important;
}
body.champ-fx-final-boss .gs-lp-fill,
body.champ-fx-final-boss .lb-lp-fill,
body.champ-fx-final-boss .goal-fill,
body.champ-fx-final-boss .sp-prog-fill,
body.champ-fx-final-boss .val-rr-fill {
  background: repeating-linear-gradient(90deg, #22ff66 0 10px, #16a34a 10px 12px, #a855f7 12px 22px, #00f0ff 22px 24px) !important;
}

/* CREATOR VIKTOR: Heavy Armored Battlecast Tech + Dr. Doom Iron Sovereign + Animated Red-White Lightning */
@keyframes viktorVoltagePulse {
  0%, 86%, 100% { border-color: #ff1e2d; box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.35), 0 0 22px rgba(255, 30, 45, 0.48); }
  90% { border-color: #ffffff; box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.35), 0 0 32px rgba(255, 30, 45, 0.88), 0 0 14px rgba(255, 255, 255, 0.8); }
  94% { border-color: #ff1e2d; box-shadow: 0 0 28px rgba(255, 30, 45, 0.72), 0 0 10px rgba(255, 255, 255, 0.65); }
}
@keyframes viktorArcCrack {
  0% { background-position: 0% 100%; opacity: 0.95; }
  25% { background-position: 45% 100%; opacity: 0.42; }
  50% { background-position: 110% 100%; opacity: 1; }
  75% { background-position: 165% 100%; opacity: 0.52; }
  100% { background-position: 220% 100%; opacity: 0.95; }
}
body.champ-fx-creator-viktor .msg-row {
  background:
    repeating-linear-gradient(-45deg, rgba(148, 163, 184, 0.06) 0 4px, transparent 4px 12px),
    linear-gradient(135deg, var(--ct-bg-start, rgba(11, 12, 16, 0.98)), var(--ct-bg-end, rgba(22, 8, 12, 0.98))) !important;
  border: 1.5px solid #64748b !important;
  border-left: 4px solid #ff1e2d !important;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  border-radius: 0 !important;
  box-shadow: inset 0 0 0 1px rgba(255, 30, 45, 0.25), 0 0 14px rgba(255, 30, 45, 0.28) !important;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-creator-viktor ${s}`).join(',\n')} {
  position: relative;
  background:
    repeating-linear-gradient(135deg, rgba(148, 163, 184, 0.05) 0 3px, transparent 3px 14px),
    radial-gradient(circle at 86% 14%, rgba(255, 30, 45, 0.24), transparent 44%),
    radial-gradient(circle at 14% 88%, rgba(248, 250, 252, 0.12), transparent 46%),
    linear-gradient(145deg, var(--ct-bg-start, rgba(11, 12, 16, 0.98)), var(--ct-bg-end, rgba(22, 8, 12, 0.98))) !important;
  border: 2.5px solid #ff1e2d !important;
  clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);
  border-radius: 0 !important;
  animation: viktorVoltagePulse 3.2s linear infinite;
}
${ALL_OVERLAY_CARDS_SEL.map((s) => `body.champ-fx-creator-viktor ${s}::after`).join(',\n')} {
  content: "";
  position: absolute;
  top: 5px;
  right: 7px;
  width: 24px;
  height: 28px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 32'%3E%3Cpolygon points='4,3 24,3 22,22 14,29 6,22' fill='%231e293b' stroke='%23cbd5e1' stroke-width='2'/%3E%3Cline x1='8' y1='12' x2='12.5' y2='14' stroke='%23ff1e2d' stroke-width='2.6' stroke-linecap='round'/%3E%3Cline x1='20' y1='12' x2='15.5' y2='14' stroke='%23ff1e2d' stroke-width='2.6' stroke-linecap='round'/%3E%3Cline x1='9' y1='20' x2='19' y2='20' stroke='%2394a3b8' stroke-width='1.6'/%3E%3Cline x1='11' y1='23' x2='17' y2='23' stroke='%23ff1e2d' stroke-width='1.4'/%3E%3C/svg%3E");
  filter: drop-shadow(0 0 8px rgba(255, 30, 45, 0.85));
  pointer-events: none;
  z-index: 8;
}
body.champ-fx-creator-viktor .gs-title,
body.champ-fx-creator-viktor .gs-champ-name,
body.champ-fx-creator-viktor .lb-rank,
body.champ-fx-creator-viktor .sp-title,
body.champ-fx-creator-viktor .goal-title,
body.champ-fx-creator-viktor .poll-q,
body.champ-fx-creator-viktor .gw-title,
body.champ-fx-creator-viktor .sched-title,
body.champ-fx-creator-viktor .al-author,
body.champ-fx-creator-viktor .lt-topic,
body.champ-fx-creator-viktor .qna-author,
body.champ-fx-creator-viktor .tron-topic,
body.champ-fx-creator-viktor .val-rank-name { color: #f8fafc !important; text-shadow: 0 0 10px rgba(255, 30, 45, 0.92), 0 0 4px rgba(255, 255, 255, 0.65) !important; letter-spacing: 0.05em; }
body.champ-fx-creator-viktor .gs-lp-fill,
body.champ-fx-creator-viktor .lb-lp-fill,
body.champ-fx-creator-viktor .goal-fill,
body.champ-fx-creator-viktor .sp-prog-fill,
body.champ-fx-creator-viktor .val-rr-fill { background: linear-gradient(90deg, #991b1b, #ff1e2d, #ffffff) !important; }
body.champ-has-skin-art .gs-splash,
body.champ-has-skin-art .map-splash { background-image: var(--ct-skin-splash) !important; opacity: 0.42 !important; }
@keyframes omniCharFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
#omniCharArt {
  position: fixed;
  right: 2px;
  bottom: 2px;
  height: 112px;
  width: auto;
  display: none;
  pointer-events: none;
  z-index: 9;
  filter: drop-shadow(0 0 12px var(--ct-primary, #ff3b5c)) drop-shadow(0 4px 10px rgba(0,0,0,0.88));
  animation: omniCharFloat 4.2s ease-in-out infinite;
}
#gsCard.theme-lol ~ #omniCharArt.visible { display: block; }
${ALL_OVERLAY_CARDS_SEL.filter((s) => s !== '.gs-card' && s !== '.map-cover').map((s) => `body.champ-has-skin-art ${s}`).join(',\n')} {
  background-image: linear-gradient(145deg, var(--ct-bg-start, rgba(12, 12, 24, 0.86)), var(--ct-bg-end, rgba(8, 10, 20, 0.90))), var(--ct-skin-splash) !important;
  background-size: cover !important;
  background-position: center 22% !important;
  background-blend-mode: multiply !important;
}
</style>
<script>
(function initChampionThemeClient(){
  let ddVerPromise = null;
  const skinUrlCache = {};
  function getDdVer(){
    if (!ddVerPromise) {
      ddVerPromise = fetch('https://ddragon.leagueoflegends.com/api/versions.json')
        .then((r) => (r.ok ? r.json() : null))
        .then((arr) => (Array.isArray(arr) && arr[0] ? arr[0] : '15.22.1'))
        .catch(() => '15.22.1');
    }
    return ddVerPromise;
  }
  async function resolvePackSkinSplash(art){
    if (!art) return '';
    if (art.localAsset && /^[a-z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(String(art.localAsset))) {
      return '/api/theme-asset/' + encodeURIComponent(String(art.localAsset));
    }
    if (!art.championId) return '';
    const cid = String(art.championId).replace(/[^A-Za-z0-9]/g, '');
    if (!cid) return '';
    const q = String(art.skinQuery || '').trim().toLowerCase();
    const key = cid + ':' + q;
    if (skinUrlCache[key]) return skinUrlCache[key];
    let num = 0;
    if (q && q !== 'default') {
      try {
        const ver = await getDdVer();
        const res = await fetch('https://ddragon.leagueoflegends.com/cdn/' + ver + '/data/en_US/champion/' + cid + '.json');
        if (res.ok) {
          const j = await res.json();
          const skins = j && j.data && j.data[cid] && Array.isArray(j.data[cid].skins) ? j.data[cid].skins : [];
          const words = q.split(/\s+/).filter(Boolean);
          const hit = skins.find((s) => String(s.name || '').toLowerCase().includes(q))
            || skins.find((s) => words.every((w) => String(s.name || '').toLowerCase().includes(w)))
            || skins.find((s) => words.some((w) => w.length > 3 && String(s.name || '').toLowerCase().includes(w)));
          if (hit && Number.isFinite(Number(hit.num))) num = Number(hit.num);
        }
      } catch (e) {}
    }
    const url = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + cid + '_' + num + '.jpg';
    skinUrlCache[key] = url;
    return url;
  }
  function applyChampPack(pack){
    const r = document.documentElement;
    document.body.classList.remove('champ-pack-active', 'champ-has-skin-art', 'champ-fx-jinx-glitch', 'champ-fx-kda-firestarter', 'champ-fx-kda-all-out', 'champ-fx-risen-legend', 'champ-fx-inkshadow', 'champ-fx-dark-cosmic', 'champ-fx-black-rose', 'champ-fx-ravenborn', 'champ-fx-elementalist', 'champ-fx-high-noon', 'champ-fx-arcane-prestige', 'champ-fx-prestige-cosmic', 'champ-fx-god-king', 'champ-fx-radiant-cloud', 'champ-fx-soul-fighter', 'champ-fx-blossom-springs', 'champ-fx-zaun-lab', 'champ-fx-crime-city', 'champ-fx-prestige-rose', 'champ-fx-dj-sona', 'champ-fx-arcane-fractured', 'champ-fx-eve-firestarter', 'champ-fx-ahri-firestarter', 'champ-fx-unbound-thresh', 'champ-fx-revenant-reign', 'champ-fx-final-boss', 'champ-fx-creator-viktor', 'champ-fx-spirit-blossom', 'champ-fx-nightbringer', 'champ-fx-project-cyber', 'champ-fx-ruined-mist', 'champ-fx-neon-pulse', 'champ-fx-hextech');
    r.style.removeProperty('--ct-skin-splash');
    if (!pack || !pack.id) return;
    document.body.classList.add('champ-pack-active');
    if (pack.effect && pack.effect !== 'none') document.body.classList.add('champ-fx-' + pack.effect);
    const c = pack.colors || {};
    if (c.primary) r.style.setProperty('--ct-primary', c.primary);
    if (c.secondary) r.style.setProperty('--ct-secondary', c.secondary);
    if (c.tertiary) r.style.setProperty('--ct-tertiary', c.tertiary);
    if (c.bgStart) r.style.setProperty('--ct-bg-start', c.bgStart);
    if (c.bgEnd) r.style.setProperty('--ct-bg-end', c.bgEnd);
    if (c.text) r.style.setProperty('--ct-text', c.text);
    if (pack.skinArt && pack.skinArt.championId) {
      resolvePackSkinSplash(pack.skinArt).then((url) => {
        if (!url) return;
        r.style.setProperty('--ct-skin-splash', 'url("' + url + '")');
        document.body.classList.add('champ-has-skin-art');
      }).catch(() => {});
    }
    const isLolGameStatsPage = Boolean(document.getElementById('gsCard'));
    let charEl = document.getElementById('omniCharArt');
    if (isLolGameStatsPage && pack.id === 'akali-kda-firestarter-ignition' && pack.characterArt && /^[a-z0-9_-]+\.(png|webp|jpg|jpeg)$/i.test(String(pack.characterArt))) {
      if (!charEl) {
        charEl = document.createElement('img');
        charEl.id = 'omniCharArt';
        charEl.alt = '';
        document.body.appendChild(charEl);
      }
      charEl.src = '/api/theme-asset/' + encodeURIComponent(String(pack.characterArt));
      charEl.classList.add('visible');
    } else if (charEl) {
      charEl.classList.remove('visible');
    }
    syncViktorLightning(Boolean(pack && pack.effect === 'creator-viktor'));
    syncAkaliEdgeFx(Boolean(pack && pack.effect === 'kda-firestarter'));
    const sigFx = ['revenant-reign', 'dj-sona', 'eve-firestarter', 'risen-legend', 'ahri-firestarter', 'elementalist', 'arcane-fractured'];
    syncSignatureEdgeFx(pack && sigFx.indexOf(pack.effect) >= 0 ? pack.effect : '');
  }

  // 60fps Fractal Red-and-White Perimeter Lightning Engine for Creator Viktor
  let viktorRaf = 0;
  let viktorCanvas = null;
  function buildFractalBolt(x0, y0, x1, y1, disp, depth, out) {
    if (depth <= 0) { out.push([x1, y1]); return; }
    const mx = (x0 + x1) * 0.5;
    const my = (y0 + y1) * 0.5;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const off = (Math.random() - 0.5) * disp;
    const px = mx + nx * off;
    const py = my + ny * off;
    buildFractalBolt(x0, y0, px, py, disp * 0.56, depth - 1, out);
    buildFractalBolt(px, py, x1, y1, disp * 0.56, depth - 1, out);
  }
  function strokeBolt(ctx, pts, mainW, alpha) {
    if (pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#ff1e2d';
    ctx.shadowBlur = 16;
    ctx.strokeStyle = 'rgba(255, 24, 42, ' + (0.45 * alpha).toFixed(2) + ')';
    ctx.lineWidth = mainW * 4.2;
    ctx.stroke();
    ctx.shadowBlur = 8;
    ctx.strokeStyle = 'rgba(255, 58, 74, ' + (0.92 * alpha).toFixed(2) + ')';
    ctx.lineWidth = mainW * 1.9;
    ctx.stroke();
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#ffffff';
    ctx.strokeStyle = 'rgba(255, 255, 255, ' + alpha.toFixed(2) + ')';
    ctx.lineWidth = mainW * 0.85;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  function samplePoly(poly, u) {
    let total = 0;
    const lens = [];
    for (let i = 0; i < poly.length - 1; i++) {
      const l = Math.hypot(poly[i + 1][0] - poly[i][0], poly[i + 1][1] - poly[i][1]);
      lens.push(l);
      total += l;
    }
    let target = (((u % 1) + 1) % 1) * total;
    for (let i = 0; i < lens.length; i++) {
      if (target <= lens[i] || i === lens.length - 1) {
        const f = lens[i] > 0 ? target / lens[i] : 0;
        return [poly[i][0] + (poly[i + 1][0] - poly[i][0]) * f, poly[i][1] + (poly[i + 1][1] - poly[i][1]) * f];
      }
      target -= lens[i];
    }
    return poly[0];
  }
  function drawArcAlongPoly(ctx, poly, uStart, uSpan, disp, mainW, alpha) {
    const steps = 4;
    const pts = [];
    let prev = samplePoly(poly, uStart);
    pts.push(prev);
    for (let s = 1; s <= steps; s++) {
      const cur = samplePoly(poly, uStart + (uSpan * s) / steps);
      buildFractalBolt(prev[0], prev[1], cur[0], cur[1], disp, 3, pts);
      prev = cur;
    }
    strokeBolt(ctx, pts, mainW, alpha);
    // Occasional forked micro-branch snapping off the frame
    if (pts.length > 6 && Math.random() < 0.65) {
      const bi = 2 + Math.floor(Math.random() * (pts.length - 4));
      const p0 = pts[bi];
      const ang = Math.random() * Math.PI * 2;
      const blen = 10 + Math.random() * 18;
      const bpts = [p0];
      buildFractalBolt(p0[0], p0[1], p0[0] + Math.cos(ang) * blen, p0[1] + Math.sin(ang) * blen, 7, 2, bpts);
      strokeBolt(ctx, bpts, mainW * 0.62, alpha * 0.85);
    }
  }
  function syncViktorLightning(active) {
    if (!active) {
      if (viktorRaf) { cancelAnimationFrame(viktorRaf); viktorRaf = 0; }
      if (viktorCanvas) { viktorCanvas.remove(); viktorCanvas = null; }
      return;
    }
    if (viktorRaf) return;
    viktorCanvas = document.createElement('canvas');
    viktorCanvas.id = 'omniViktorLightningCanvas';
    viktorCanvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;';
    document.body.appendChild(viktorCanvas);
    const ctx = viktorCanvas.getContext('2d');
    const cardSels = ${JSON.stringify(ALL_OVERLAY_CARDS_SEL.join(','))};
    let lastTick = 0;
    function tick(now) {
      viktorRaf = requestAnimationFrame(tick);
      if (now - lastTick < 34) return; // crisp ~30Hz electrical crackle with smooth gliding
      lastTick = now;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (viktorCanvas.width !== w || viktorCanvas.height !== h) { viktorCanvas.width = w; viktorCanvas.height = h; }
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      const t = now * 0.00028;

      const abStage = document.getElementById('abStage');
      if (abStage) {
        const sx = w / 920;
        const sy = h / 175;
        const abPoly = [
          [148*sx,36*sy],[172*sx,22*sy],[642*sx,22*sy],[664*sx,38*sy],
          [892*sx,38*sy],[912*sx,56*sy],[912*sx,154*sy],[896*sx,170*sy],[146*sx,170*sy],[148*sx,36*sy]
        ];
        drawArcAlongPoly(ctx, abPoly, t * 1.15, 0.14, 14, 1.8, 0.96);
        drawArcAlongPoly(ctx, abPoly, t * 1.15 + 0.48, 0.13, 13, 1.6, 0.92);
        drawArcAlongPoly(ctx, abPoly, -t * 0.85 + 0.22, 0.11, 12, 1.4, 0.85);
        // Portrait Ring circular perimeter lightning
        const ringPoly = [];
        for (let i = 0; i <= 24; i++) {
          const a = (i / 24) * Math.PI * 2;
          ringPoly.push([(84 + Math.cos(a) * 71) * sx, (96 + Math.sin(a) * 71) * sy]);
        }
        drawArcAlongPoly(ctx, ringPoly, t * 1.6, 0.24, 11, 1.6, 0.95);
        drawArcAlongPoly(ctx, ringPoly, -t * 1.2 + 0.5, 0.20, 10, 1.4, 0.88);
        return;
      }

      const nodes = document.querySelectorAll(cardSels);
      for (let i = 0; i < nodes.length; i++) {
        const el = nodes[i];
        const r = el.getBoundingClientRect();
        if (r.width < 20 || r.height < 20 || el.classList.contains('hidden')) continue;
        const poly = [
          [r.left + 10, r.top], [r.right - 10, r.top], [r.right, r.top + 10],
          [r.right, r.bottom - 10], [r.right - 10, r.bottom], [r.left + 10, r.bottom],
          [r.left, r.bottom - 10], [r.left, r.top + 10], [r.left + 10, r.top]
        ];
        const phase = t + i * 0.27;
        drawArcAlongPoly(ctx, poly, phase, 0.18, 12, 1.6, 0.95);
        drawArcAlongPoly(ctx, poly, phase + 0.5, 0.16, 11, 1.45, 0.90);
        drawArcAlongPoly(ctx, poly, -phase * 0.8 + 0.25, 0.12, 10, 1.25, 0.82);
      }
    }
    viktorRaf = requestAnimationFrame(tick);
  }

  // 60fps Akali K/DA Firestarter Edge Engine (#1 Ignition Flame-Ribbon + Streak Embers + #3 Kunai Slash & Starbursts — zero-shadowBlur batched for locked 60fps)
  let akaliRaf = 0;
  let akaliCanvas = null;
  function drawAkaliStarburst(ctx, x, y, r, rot, col, alpha) {
    if (alpha < 0.04) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha * 0.55;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.15, 0, Math.PI * 2);
    ctx.strokeStyle = col;
    ctx.lineWidth = 2.0 * alpha;
    ctx.stroke();
    ctx.globalAlpha = alpha;
    for (let tier = 0; tier < 2; tier++) {
      ctx.save();
      ctx.rotate(rot + (tier === 1 ? Math.PI / 4 : 0));
      const len = tier === 0 ? r * 1.6 : r * 0.9;
      const wid = tier === 0 ? r * 0.22 : r * 0.16;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        const aMid = a + Math.PI / 4;
        if (i === 0) ctx.moveTo(Math.cos(a) * len, Math.sin(a) * len);
        else ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
        ctx.lineTo(Math.cos(aMid) * wid, Math.sin(aMid) * wid);
      }
      ctx.closePath();
      ctx.fillStyle = tier === 0 ? '#ffffff' : col;
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
  function drawAkaliTrail(ctx, poly, uHead, uLen, col1, col2, width, sparksArr, now, isFlame) {
    const steps = 14;
    const pts = [];
    for (let s = 0; s <= steps; s++) pts.push(samplePoly(poly, uHead - uLen * (1 - s / steps)));
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Batched Pass 1: Sleek outer bloom (1 stroke!)
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let s = 1; s <= steps; s++) ctx.lineTo(pts[s][0], pts[s][1]);
    ctx.globalAlpha = 0.24;
    ctx.strokeStyle = col1;
    ctx.lineWidth = width * 2.0;
    ctx.stroke();
    // Batched Pass 2: Crisp mid plasma ribbon (front 75%)
    const mid0 = Math.floor(steps * 0.25);
    ctx.beginPath();
    ctx.moveTo(pts[mid0][0], pts[mid0][1]);
    for (let s = mid0 + 1; s <= steps; s++) ctx.lineTo(pts[s][0], pts[s][1]);
    ctx.globalAlpha = 0.85;
    ctx.strokeStyle = col2;
    ctx.lineWidth = width * 0.82;
    ctx.stroke();
    // Batched Pass 3: White-hot spear tip (front 40%)
    const tip0 = Math.floor(steps * 0.6);
    ctx.beginPath();
    ctx.moveTo(pts[tip0][0], pts[tip0][1]);
    for (let s = tip0 + 1; s <= steps; s++) ctx.lineTo(pts[s][0], pts[s][1]);
    ctx.globalAlpha = 0.96;
    ctx.strokeStyle = '#fffbeb';
    ctx.lineWidth = Math.max(0.9, width * 0.35);
    ctx.stroke();
    // Subtle flickering flame licks (batched into 1 path!)
    if (isFlame) {
      ctx.beginPath();
      for (let s = 5; s < steps; s += 3) {
        const p0 = pts[s], p1 = pts[s + 1];
        const dx = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dx, dy) || 1;
        const flick = Math.sin(now * 0.025 + s * 1.9) * 0.5 + 0.5;
        const tg = 3 + flick * 5.5;
        ctx.moveTo(p0[0], p0[1]);
        ctx.quadraticCurveTo(p1[0] + (-dy / l) * tg, p1[1] + (dx / l) * tg, p1[0], p1[1]);
      }
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = '#ff7a00';
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }
    const head = pts[steps];
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(head[0], head[1], width * 0.48, 0, Math.PI * 2);
    ctx.fill();
    if (sparksArr && sparksArr.length < 70 && Math.random() < 0.5) {
      sparksArr.push({
        x: head[0] + (Math.random() - 0.5) * 4,
        y: head[1] + (Math.random() - 0.5) * 4,
        vx: (Math.random() - 0.5) * 2.0,
        vy: -1.0 - Math.random() * 2.2,
        life: 1,
        col: Math.random() < 0.28 ? '#00f5ff' : (Math.random() < 0.55 ? '#ff7a00' : '#ff3b5c'),
        w: 1.5 + Math.random() * 1.4
      });
    }
  }
  function syncAkaliEdgeFx(active) {
    if (!active) {
      if (akaliRaf) { cancelAnimationFrame(akaliRaf); akaliRaf = 0; }
      if (akaliCanvas) { akaliCanvas.remove(); akaliCanvas = null; }
      return;
    }
    if (akaliRaf) return;
    akaliCanvas = document.createElement('canvas');
    akaliCanvas.id = 'omniAkaliEdgeCanvas';
    akaliCanvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;';
    document.body.appendChild(akaliCanvas);
    const ctx = akaliCanvas.getContext('2d');
    const cardSels = ${JSON.stringify(ALL_OVERLAY_CARDS_SEL.join(','))};
    const sparks = [];
    let cachedPolys = [];
    let lastLayoutMs = 0;
    function tick(now) {
      akaliRaf = requestAnimationFrame(tick);
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (akaliCanvas.width !== w || akaliCanvas.height !== h) { akaliCanvas.width = w; akaliCanvas.height = h; lastLayoutMs = 0; }
      if (now - lastLayoutMs > 400) {
        lastLayoutMs = now;
        cachedPolys = [];
        const abStage = document.getElementById('abStage');
        if (abStage) {
          const sx = w / 920, sy = h / 175;
          cachedPolys.push([
            [148*sx,36*sy],[172*sx,22*sy],[642*sx,22*sy],[664*sx,38*sy],
            [892*sx,38*sy],[912*sx,56*sy],[912*sx,154*sy],[896*sx,170*sy],[146*sx,170*sy],[148*sx,36*sy]
          ]);
          const ring = [];
          for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI * 2; ring.push([(84 + Math.cos(a) * 71) * sx, (96 + Math.sin(a) * 71) * sy]); }
          cachedPolys.push(ring);
        } else {
          const nodes = document.querySelectorAll(cardSels);
          for (let i = 0; i < nodes.length; i++) {
            const el = nodes[i];
            const r = el.getBoundingClientRect();
            if (r.width < 20 || r.height < 20 || el.classList.contains('hidden')) continue;
            cachedPolys.push([[r.left, r.top], [r.right, r.top], [r.right, r.bottom], [r.left, r.bottom], [r.left, r.top]]);
          }
        }
      }
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      const t = now * 0.00032;

      for (let i = 0; i < cachedPolys.length; i++) {
        const poly = cachedPolys[i];
        const ph = t + i * 0.31;
        drawAkaliTrail(ctx, poly, ph, 0.24, '#ff3b5c', '#ff7a00', 2.8, sparks, now, true);
        drawAkaliTrail(ctx, poly, -ph * 1.25 + 0.5, 0.17, '#00f5ff', '#ffffff', 2.1, null, now, false);
        if (poly.length === 5) {
          for (let c = 0; c < 4; c++) {
            const dist = Math.abs((((ph % 1) + 1) % 1) - c * 0.25);
            const burst = Math.max(0, 1 - dist * 14);
            if (burst > 0.05) drawAkaliStarburst(ctx, poly[c][0], poly[c][1], 14 * burst + 5, now * 0.005 + c, c % 2 === 0 ? '#00f5ff' : '#ff7a00', burst);
          }
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i], px = sp.x, py = sp.y;
        sp.vx += Math.sin(now * 0.015 + i) * 0.06;
        sp.x += sp.vx; sp.y += sp.vy; sp.vy *= 0.985; sp.life -= 0.028;
        if (sp.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sp.x + sp.vx * 2.2, sp.y + sp.vy * 2.2);
        ctx.globalAlpha = sp.life;
        ctx.strokeStyle = sp.col;
        ctx.lineWidth = sp.w * sp.life;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    akaliRaf = requestAnimationFrame(tick);
  }

  // Unified Locked-60fps Signature Edge Engine (Viego, DJ Sona, Evelynn, Kai'Sa, Ahri, Lux, Arcane Fractured Jinx)
  let sigEdgeRaf = 0;
  let sigEdgeCanvas = null;
  let sigEdgeMode = '';
  let djMusicPlaying = true;
  let djLastTrackTitle = '';
  let djStanceIdx = 0;
  let djLiveAudioLevel = 0;
  let djLiveAudioAt = 0;
  function drawBatchedRibbon(ctx, poly, uHead, uLen, col1, col2, width, waveAmp, waveFreq, now) {
    const steps = 16;
    const pts = [];
    for (let s = 0; s <= steps; s++) {
      const f = s / steps;
      const p = samplePoly(poly, uHead - uLen * (1 - f));
      if (waveAmp > 0) {
        const pNext = samplePoly(poly, uHead - uLen * (1 - f) + 0.004);
        const dx = pNext[0] - p[0], dy = pNext[1] - p[1], l = Math.hypot(dx, dy) || 1;
        const w = Math.sin(f * waveFreq + now * 0.016) * waveAmp * Math.sin(f * Math.PI);
        pts.push([p[0] + (-dy / l) * w, p[1] + (dx / l) * w]);
      } else {
        pts.push(p);
      }
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let s = 1; s <= steps; s++) ctx.lineTo(pts[s][0], pts[s][1]);
    ctx.globalAlpha = 0.24;
    ctx.strokeStyle = col1;
    ctx.lineWidth = width * 2.2;
    ctx.stroke();

    const mid0 = 4;
    ctx.beginPath();
    ctx.moveTo(pts[mid0][0], pts[mid0][1]);
    for (let s = mid0 + 1; s <= steps; s++) ctx.lineTo(pts[s][0], pts[s][1]);
    ctx.globalAlpha = 0.86;
    ctx.strokeStyle = col2;
    ctx.lineWidth = width * 0.88;
    ctx.stroke();

    const tip0 = 10;
    ctx.beginPath();
    ctx.moveTo(pts[tip0][0], pts[tip0][1]);
    for (let s = tip0 + 1; s <= steps; s++) ctx.lineTo(pts[s][0], pts[s][1]);
    ctx.globalAlpha = 0.96;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(0.9, width * 0.36);
    ctx.stroke();
    return pts[steps];
  }
  function drawDiamondGlint(ctx, x, y, r, col, alpha) {
    if (alpha < 0.05) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.45); ctx.lineTo(r * 0.32, -r * 0.32);
    ctx.lineTo(r * 1.45, 0); ctx.lineTo(r * 0.32, r * 0.32);
    ctx.lineTo(0, r * 1.45); ctx.lineTo(-r * 0.32, r * 0.32);
    ctx.lineTo(-r * 1.45, 0); ctx.lineTo(-r * 0.32, -r * 0.32);
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
  }
  function syncSignatureEdgeFx(mode) {
    sigEdgeMode = mode || '';
    if (!sigEdgeMode) {
      if (sigEdgeRaf) { cancelAnimationFrame(sigEdgeRaf); sigEdgeRaf = 0; }
      if (sigEdgeCanvas) { sigEdgeCanvas.remove(); sigEdgeCanvas = null; }
      return;
    }
    if (sigEdgeRaf) return;
    sigEdgeCanvas = document.createElement('canvas');
    sigEdgeCanvas.id = 'omniSigEdgeCanvas';
    sigEdgeCanvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9997;';
    document.body.appendChild(sigEdgeCanvas);
    const ctx = sigEdgeCanvas.getContext('2d');
    const cardSels = ${JSON.stringify(ALL_OVERLAY_CARDS_SEL.join(','))};
    const motes = [];
    let cachedPolys = [];
    let lastLayout = 0;
    const viegoCols = ['#e11d48', '#a855f7', '#38bdf8', '#facc15'];
    const sonaCols = ['#00e5ff', '#ff2a6d', '#c084fc'];
    const luxCols = ['#fde047', '#38bdf8', '#e879f9', '#34d399'];

    function tick(now) {
      sigEdgeRaf = requestAnimationFrame(tick);
      const w = window.innerWidth, h = window.innerHeight;
      if (sigEdgeCanvas.width !== w || sigEdgeCanvas.height !== h) { sigEdgeCanvas.width = w; sigEdgeCanvas.height = h; lastLayout = 0; }
      if (now - lastLayout > 450) {
        lastLayout = now;
        cachedPolys = [];
        const abStage = document.getElementById('abStage');
        if (abStage) {
          const sx = w / 920, sy = h / 175;
          cachedPolys.push([[148*sx,36*sy],[172*sx,22*sy],[642*sx,22*sy],[664*sx,38*sy],[892*sx,38*sy],[912*sx,56*sy],[912*sx,154*sy],[896*sx,170*sy],[146*sx,170*sy],[148*sx,36*sy]]);
          const ring = [];
          for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI * 2; ring.push([(84 + Math.cos(a) * 71) * sx, (96 + Math.sin(a) * 71) * sy]); }
          cachedPolys.push(ring);
        } else {
          const nodes = document.querySelectorAll(cardSels);
          for (let i = 0; i < nodes.length; i++) {
            const el = nodes[i], r = el.getBoundingClientRect();
            if (r.width < 20 || r.height < 20 || el.classList.contains('hidden')) continue;
            cachedPolys.push([[r.left, r.top], [r.right, r.top], [r.right, r.bottom], [r.left, r.bottom], [r.left, r.top]]);
          }
        }
      }
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      const m = sigEdgeMode;
      const t = now * 0.00024;

      for (let i = 0; i < cachedPolys.length; i++) {
        const poly = cachedPolys[i];
        const ph = t + i * 0.29;
        let head = null;
        let moteCol = '#ffffff';

        if (m === 'revenant-reign') {
          const ci = Math.floor(now / 1800) % 4;
          const colA = viegoCols[ci], colB = viegoCols[(ci + 1) % 4];
          head = drawBatchedRibbon(ctx, poly, ph, 0.24, colA, colB, 2.7, 3.2, 10, now);
          drawBatchedRibbon(ctx, poly, -ph * 0.85 + 0.5, 0.18, '#a855f7', '#38bdf8', 2.2, 4.0, 12, now);
          moteCol = Math.random() < 0.5 ? '#a855f7' : '#38bdf8';
        } else if (m === 'dj-sona') {
          const freshAudio = (now - djLiveAudioAt) < 700;
          const si = djStanceIdx % 3;
          const colA = sonaCols[si], colB = sonaCols[(si + 1) % 3];
          const beatAmp = freshAudio
            ? (1.2 + djLiveAudioLevel * 10.5)
            : (djMusicPlaying ? (2.2 + Math.pow(Math.max(0, Math.sin(now * 0.013)), 3) * 6.0) : 0.6);
          const speedMul = (!freshAudio && !djMusicPlaying) ? 0.35 : 1.15;
          head = drawBatchedRibbon(ctx, poly, ph * speedMul, 0.30, colA, colB, 2.6, beatAmp, 24, now);
          drawBatchedRibbon(ctx, poly, ph * speedMul + 0.5, 0.28, colB, colA, 2.2, beatAmp * 0.85, 22, now);
          moteCol = colA;
        } else if (m === 'eve-firestarter') {
          head = drawBatchedRibbon(ctx, poly, ph * 1.05, 0.26, '#ff1e6b', '#a855f7', 2.8, 5.2, 14, now);
          drawBatchedRibbon(ctx, poly, -ph * 1.1 + 0.5, 0.22, '#a855f7', '#ff7a00', 2.3, 4.6, 13, now);
          moteCol = Math.random() < 0.35 ? '#ff7a00' : '#ff1e6b';
        } else if (m === 'risen-legend') {
          head = drawBatchedRibbon(ctx, poly, ph * 0.95, 0.25, '#f5c542', '#fff3b0', 2.9, 0, 0, now);
          drawBatchedRibbon(ctx, poly, ph * 0.95 + 0.5, 0.20, '#ff2e55', '#f5c542', 2.2, 0, 0, now);
          if (poly.length === 5) {
            for (let c = 0; c < 4; c++) {
              const b = Math.max(0, 1 - Math.abs((((ph * 0.95) % 1) + 1) % 1 - c * 0.25) * 14);
              if (b > 0.08) drawDiamondGlint(ctx, poly[c][0], poly[c][1], 9 * b + 3, '#f5c542', b);
            }
          }
          moteCol = '#f5c542';
        } else if (m === 'ahri-firestarter') {
          head = drawBatchedRibbon(ctx, poly, ph * 1.08, 0.26, '#ff2e97', '#fda4af', 2.7, 3.8, 11, now);
          drawBatchedRibbon(ctx, poly, -ph * 0.95 + 0.5, 0.20, '#ff1e56', '#ff2e97', 2.2, 3.2, 10, now);
          moteCol = Math.random() < 0.45 ? '#fda4af' : '#ff2e97';
        } else if (m === 'elementalist') {
          const li = Math.floor(now / 1500) % 4;
          const colA = luxCols[li], colB = luxCols[(li + 1) % 4];
          head = drawBatchedRibbon(ctx, poly, ph * 0.9, 0.28, colA, colB, 2.7, 2.2, 9, now);
          drawBatchedRibbon(ctx, poly, ph * 0.9 + 0.5, 0.24, luxCols[(li + 2) % 4], colA, 2.2, 2.0, 8, now);
          if (poly.length === 5) {
            const cIdx = Math.floor(now / 550 + i) % 4;
            const pulse = Math.sin(((now % 550) / 550) * Math.PI);
            drawDiamondGlint(ctx, poly[cIdx][0], poly[cIdx][1], 8 * pulse + 2, colA, pulse * 0.9);
          }
          moteCol = colB;
        } else if (m === 'arcane-fractured') {
          const jitter = ((Math.floor(now / 70) + i) % 2 === 0) ? 5.5 : 2.8;
          head = drawBatchedRibbon(ctx, poly, ph * 1.3, 0.20, '#ff2e97', '#00f0ff', 2.6, jitter, 28, now);
          drawBatchedRibbon(ctx, poly, -ph * 1.2 + 0.45, 0.16, '#00f0ff', '#ffe14d', 2.1, jitter * 0.9, 24, now);
          moteCol = Math.random() < 0.4 ? '#00f0ff' : (Math.random() < 0.5 ? '#ff2e97' : '#ffe14d');
        }

        if (head && motes.length < 55 && Math.random() < 0.34) {
          motes.push({
            x: head[0] + (Math.random() - 0.5) * 4,
            y: head[1] + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 1.3,
            vy: -0.6 - Math.random() * 1.4,
            life: 1,
            col: moteCol,
            r: 1.5 + Math.random() * 1.8,
            shard: m === 'ahri-firestarter' || m === 'arcane-fractured' || m === 'risen-legend'
          });
        }
      }

      for (let i = motes.length - 1; i >= 0; i--) {
        const sp = motes[i];
        sp.x += sp.vx; sp.y += sp.vy; sp.life -= 0.026;
        if (sp.life <= 0) { motes.splice(i, 1); continue; }
        ctx.globalAlpha = sp.life * 0.9;
        ctx.fillStyle = sp.col;
        if (sp.shard) {
          ctx.beginPath();
          ctx.moveTo(sp.x, sp.y - sp.r * 1.5);
          ctx.lineTo(sp.x + sp.r, sp.y);
          ctx.lineTo(sp.x, sp.y + sp.r * 1.5);
          ctx.lineTo(sp.x - sp.r, sp.y);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.r * sp.life, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    sigEdgeRaf = requestAnimationFrame(tick);
  }
  function fetchTheme(){
    fetch('/api/champion-theme', { cache: 'no-store' }).then((res) => (res.ok ? res.json() : null)).then((d) => applyChampPack(d && d.pack ? d.pack : null)).catch(() => {});
  }
  function connectThemeWs(){
    try {
      const ws = new WebSocket('ws://' + location.host);
      ws.onmessage = (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.type === 'champion-theme') applyChampPack(p.data);
          else if (p.type === 'spotify' && p.data) {
            djMusicPlaying = p.data.isPlaying !== false && Boolean(p.data.title);
            const ttl = String(p.data.title || '');
            if (ttl && djLastTrackTitle && ttl !== djLastTrackTitle) djStanceIdx = (djStanceIdx + 1) % 3;
            if (ttl) djLastTrackTitle = ttl;
          } else if (p.type === 'audio-eq' && p.data) {
            djLiveAudioLevel = Math.max(0, Math.min(1, Number(p.data.level) || 0));
            djLiveAudioAt = performance.now();
          }
        } catch (e) {}
      };
      ws.onclose = () => setTimeout(connectThemeWs, 2500);
    } catch (e) {}
  }
  fetchTheme();
  connectThemeWs();
  setInterval(fetchTheme, 3500);
})();
</script>`;

function withChampionTheme(html) {
  return String(html || '').replace('</body>', `${CHAMPION_THEME_INJECT_SNIPPET}</body>`);
}

class ObsServer {
  constructor(port = 4588) {
    this.port = port;

    this.server = null;
    this.wss = null;
    this.recentMessages = [];
    this.pinnedMessage = null;
    this.currentAppearance = null;
    this.currentStatus = null;
    this.currentSpotify = null;
    this.currentAlertConfig = null;
    this.currentGoals = null;
    this.currentPoll = null;
    this.currentSchedule = null;
    this.currentGiveaway = null;
    this.currentGameStats = null;
    this.currentChampionTheme = null;
    this.currentSponsors = null;
    this.currentIcsProvider = null;
    this.soundFileResolver = null;
    this.alertMediaResolver = null;
    this.sponsorMediaResolver = null;
    this.onClientAction = null;
    this.onStreamDeckApi = null;
    this.onVoiceTestApi = null;
    this.onGameWebhook = null;
  }

  start(listenHost = '0.0.0.0') {
    return new Promise((resolve) => {
      this.server = http.createServer((req, res) => {
        const parsedUrl = new URL(req.url || '/', `http://127.0.0.1:${this.port}`);
        const urlPath = parsedUrl.pathname;

        if (urlPath === '/api/game-stats') {
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          });
          res.end(JSON.stringify(this.currentGameStats || {}));
          return;
        }

        if (urlPath === '/api/sponsors') {
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          });
          res.end(JSON.stringify(this.currentSponsors || { enabled: false, items: [] }));
          return;
        }

        if (urlPath === '/api/transition/scene' || urlPath === '/api/transition/singed') {
          this.broadcastSceneTransition();
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache' });
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        if (urlPath === '/api/champion-theme') {
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          });
          res.end(JSON.stringify({ pack: this.getEffectiveChampionTheme() }));
          return;
        }

        if (urlPath.startsWith('/api/theme-asset/')) {
          const safeFile = decodeURIComponent(urlPath.replace('/api/theme-asset/', '')).trim();
          if (!/^[a-z0-9_-]+\.(jpg|jpeg|png|webp|mp4|webm)$/i.test(safeFile)) {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
            res.end('Invalid theme asset');
            return;
          }
          const primaryAsset = path.join(__dirname, 'assets', 'themes', safeFile);
          const fallbackAsset = path.join(__dirname, '..', 'docs', 'assets', safeFile);
          const assetPath = fs.existsSync(primaryAsset) ? primaryAsset : fallbackAsset;
          if (!fs.existsSync(assetPath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
            res.end('Theme asset not found');
            return;
          }
          const ext = path.extname(assetPath).toLowerCase();
          const mime = ext === '.png' ? 'image/png'
            : ext === '.webp' ? 'image/webp'
              : ext === '.mp4' ? 'video/mp4'
                : ext === '.webm' ? 'video/webm'
                  : 'image/jpeg';
          const stat = fs.statSync(assetPath);
          const total = stat.size;
          const range = req.headers.range;
          if (range && (ext === '.mp4' || ext === '.webm')) {
            const m = range.replace(/bytes=/, '').split('-');
            const start = Math.max(0, parseInt(m[0], 10) || 0);
            const end = m[1] ? Math.min(total - 1, parseInt(m[1], 10)) : total - 1;
            res.writeHead(206, {
              'Content-Range': `bytes ${start}-${end}/${total}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': (end - start) + 1,
              'Content-Type': mime,
              'Cache-Control': 'no-cache',
              'Access-Control-Allow-Origin': '*'
            });
            fs.createReadStream(assetPath, { start, end }).pipe(res);
            return;
          }
          res.writeHead(200, {
            'Content-Type': mime,
            'Content-Length': total,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
          });
          fs.createReadStream(assetPath).pipe(res);
          return;
        }

        if (urlPath.startsWith('/api/custom-transition/')) {
          const safeId = decodeURIComponent(urlPath.replace('/api/custom-transition/', '')).replace(/[^a-zA-Z0-9_-]/g, '');
          const filePath = safeId && this.customTransitionResolver ? this.customTransitionResolver(safeId) : null;
          if (!filePath || !fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
            res.end('Custom transition file not found');
            return;
          }
          const ext = path.extname(filePath).toLowerCase();
          const mimeMap = {
            '.webm': 'video/webm',
            '.mp4': 'video/mp4',
            '.mov': 'video/quicktime',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.png': 'image/png',
            '.html': 'text/html; charset=utf-8',
            '.htm': 'text/html; charset=utf-8'
          };
          const mime = mimeMap[ext] || 'application/octet-stream';
          const stat = fs.statSync(filePath);
          const total = stat.size;
          const range = req.headers.range;
          if (range && (ext === '.mp4' || ext === '.webm' || ext === '.mov')) {
            const m = range.replace(/bytes=/, '').split('-');
            const start = Math.max(0, parseInt(m[0], 10) || 0);
            const end = m[1] ? Math.min(total - 1, parseInt(m[1], 10)) : total - 1;
            res.writeHead(206, {
              'Content-Range': `bytes ${start}-${end}/${total}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': (end - start) + 1,
              'Content-Type': mime,
              'Cache-Control': 'no-cache',
              'X-Content-Type-Options': 'nosniff'
            });
            fs.createReadStream(filePath, { start, end }).pipe(res);
            return;
          }
          res.writeHead(200, {
            'Content-Type': mime,
            'Content-Length': total,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-cache',
            'X-Content-Type-Options': 'nosniff'
          });
          fs.createReadStream(filePath).pipe(res);
          return;
        }

        if (urlPath.startsWith('/api/sponsor-media/')) {
          const safeId = decodeURIComponent(urlPath.replace('/api/sponsor-media/', '')).replace(/[^a-zA-Z0-9_-]/g, '');
          const filePath = safeId && this.sponsorMediaResolver ? this.sponsorMediaResolver(safeId) : null;
          if (!filePath || !fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
            res.end('Sponsor media not found');
            return;
          }
          const ext = path.extname(filePath).toLowerCase();
          const mimeMap = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.apng': 'image/apng'
          };
          res.writeHead(200, {
            'Content-Type': mimeMap[ext] || 'application/octet-stream',
            'Cache-Control': 'no-cache',
            'X-Content-Type-Options': 'nosniff'
          });
          fs.createReadStream(filePath).pipe(res);
          return;
        }

        if (urlPath.startsWith('/api/game/')) {
          const kind = urlPath.replace('/api/game/', '').replace(/\/+$/, '');
          let rawBody = '';
          req.on('data', (chunk) => {
            rawBody += chunk;
            if (rawBody.length > 262144) rawBody = rawBody.slice(0, 262144);
          });
          req.on('end', async () => {
            let body = {};
            if (rawBody) {
              try { body = JSON.parse(rawBody); } catch (e) {}
            }
            try {
              if (this.onGameWebhook) await this.onGameWebhook(kind, body);
              res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ ok: true }));
            } catch (err) {
              res.writeHead(400, {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
          return;
        }

        if (urlPath.startsWith('/api/alert-media/')) {
          const parts = urlPath.replace('/api/alert-media/', '').split('/');
          const allowedEvTypes = ['follow', 'sub', 'resub', 'subgift', 'bits', 'raid'];
          const allowedKinds = ['image', 'audio'];
          const safeEvType = allowedEvTypes.find((t) => t === parts[0]);
          const safeKind = allowedKinds.find((k) => k === parts[1]);
          const filePath = safeEvType && safeKind && this.alertMediaResolver ? this.alertMediaResolver(safeEvType, safeKind) : null;
          if (!filePath || !fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
            res.end('Alert media not found');
            return;
          }
          const ext = path.extname(filePath).toLowerCase();
          const mimeMap = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.apng': 'image/apng',
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav',
            '.ogg': 'audio/ogg',
            '.m4a': 'audio/mp4',
            '.aac': 'audio/aac',
            '.flac': 'audio/flac'
          };
          const mime = mimeMap[ext] || 'application/octet-stream';
          res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*' });
          fs.createReadStream(filePath).pipe(res);
          return;
        }

        if (urlPath.startsWith('/api/sound/')) {
          const soundId = decodeURIComponent(urlPath.replace('/api/sound/', '').trim());
          if (!/^[a-zA-Z0-9_-]{1,64}$/.test(soundId)) {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
            res.end('Invalid sound id');
            return;
          }
          const filePath = this.soundFileResolver ? this.soundFileResolver(soundId) : null;
          if (!filePath || !fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
            res.end('Sound not found');
            return;
          }
          const ext = path.extname(filePath).toLowerCase();
          const mime = ext === '.wav' ? 'audio/wav' : ext === '.ogg' ? 'audio/ogg' : 'audio/mpeg';
          res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*' });
          fs.createReadStream(filePath).pipe(res);
          return;
        }

        if (urlPath === '/api/voice/test' && req.method === 'POST') {
          let rawBody = '';
          req.on('data', (chunk) => {
            rawBody += chunk;
            if (rawBody.length > 65536) rawBody = rawBody.slice(0, 65536);
          });
          req.on('end', async () => {
            let body = {};
            if (rawBody) {
              try {
                body = JSON.parse(rawBody);
              } catch (e) {}
            }
            try {
              const result = this.onVoiceTestApi
                ? await this.onVoiceTestApi(body.action || '', body.payload || {})
                : { ok: false, error: 'Voice test handler not registered.' };
              res.writeHead(result?.ok === false ? 400 : 200, {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
              });
              res.end(JSON.stringify(result || { ok: true }));
            } catch (err) {
              res.writeHead(500, {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
          return;
        }

        if (urlPath.startsWith('/api/streamdeck')) {
          const action = urlPath.replace(/^\/api\/streamdeck\/?/, '').replace(/\/+$/, '') || 'status';
          const params = Object.fromEntries(parsedUrl.searchParams.entries());
          let rawBody = '';
          req.on('data', (chunk) => {
            rawBody += chunk;
            if (rawBody.length > 65536) rawBody = rawBody.slice(0, 65536);
          });
          req.on('end', async () => {
            let body = {};
            if (rawBody) {
              try {
                body = JSON.parse(rawBody);
              } catch (e) {}
            }
            try {
              const result = this.onStreamDeckApi
                ? await this.onStreamDeckApi(action, params, body)
                : { ok: false, error: 'Stream Deck API handler not registered.' };
              res.writeHead(result?.ok === false ? 400 : 200, {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
              });
              res.end(JSON.stringify(result || { ok: true }));
            } catch (err) {
              res.writeHead(500, {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
          return;
        }

        if (urlPath === '/schedule.ics') {
          const ics = this.currentIcsProvider ? this.currentIcsProvider() : 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR';
          res.writeHead(200, {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': 'inline; filename="stream-schedule.ics"',
            'Cache-Control': 'no-cache'
          });
          res.end(ics);
          return;
        }

        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        if (urlPath === '/dock') {
          res.end(OBS_CUSTOM_DOCK_HTML);
        } else if (urlPath === '/spotify') {
          res.end(withChampionTheme(OBS_SPOTIFY_HTML));
        } else if (urlPath === '/tablet') {
          res.end(OBS_TABLET_HTML);
        } else if (urlPath === '/alerts') {
          res.end(withChampionTheme(OBS_ALERTS_HTML));
        } else if (urlPath === '/goals') {
          res.end(withChampionTheme(OBS_GOALS_HTML));
        } else if (urlPath === '/poll') {
          res.end(withChampionTheme(OBS_POLL_HTML));
        } else if (urlPath === '/schedule') {
          res.end(withChampionTheme(OBS_SCHEDULE_HTML));
        } else if (urlPath === '/giveaway') {
          res.end(withChampionTheme(OBS_GIVEAWAY_HTML));
        } else if (urlPath === '/soundboard') {
          res.end(OBS_SOUNDBOARD_HTML);
        } else if (urlPath === '/game-stats') {
          res.end(withChampionTheme(OBS_GAME_STATS_HTML));
        } else if (urlPath === '/lol-map') {
          res.end(withChampionTheme(OBS_LOL_MAP_HTML));
        } else if (urlPath === '/lol-ability-bar') {
          res.end(withChampionTheme(OBS_LOL_ABILITY_BAR_HTML));
        } else if (urlPath === '/lol-bg') {
          res.end(OBS_LOL_BG_HTML);
        } else if (urlPath === '/scene-transition' || urlPath === '/singed-transition') {
          res.end(OBS_SCENE_TRANSITION_HTML);
        } else if (urlPath === '/lol-build') {
          res.end(withChampionTheme(OBS_LOL_BUILD_HTML));
        } else if (urlPath === '/jc-lowerthird') {
          res.end(OBS_JC_LOWERTHIRD_HTML);
        } else if (urlPath === '/jc-qna') {
          res.end(OBS_JC_QNA_HTML);
        } else if (urlPath === '/tron-talk') {
          res.end(OBS_TRON_TALK_HTML);
        } else if (urlPath === '/product-lowerthird') {
          res.end(OBS_PRODUCT_LOWERTHIRD_HTML);
        } else if (urlPath === '/product-card') {
          res.end(OBS_PRODUCT_CARD_HTML);
        } else if (urlPath === '/dj-stage') {
          res.end(OBS_DJ_STAGE_HTML);
        } else if (urlPath === '/dj-nowplaying') {
          res.end(OBS_DJ_NOWPLAYING_HTML);
        } else if (urlPath === '/val-bar') {
          res.end(OBS_VAL_BAR_HTML);
        } else if (urlPath === '/val-map') {
          res.end(OBS_VAL_MAP_HTML);
        } else if (urlPath === '/sponsors') {
          res.end(withChampionTheme(OBS_SPONSORS_HTML));
        } else {
          res.end(withChampionTheme(OBS_OVERLAY_HTML));
        }
      });

      this.wss = new WebSocket.Server({ server: this.server });

      this.wss.on('connection', (ws) => {
        if (this.currentAppearance) {
          ws.send(JSON.stringify({ type: 'appearance', data: this.currentAppearance }));
        }
        if (this.currentStatus) {
          ws.send(JSON.stringify({ type: 'status', data: this.currentStatus }));
        }
        if (this.currentSpotify) {
          ws.send(JSON.stringify({ type: 'spotify', data: this.currentSpotify }));
        }
        if (this.currentAlertConfig) {
          ws.send(JSON.stringify({ type: 'alert-config', data: this.currentAlertConfig }));
        }
        if (this.currentGoals) {
          ws.send(JSON.stringify({ type: 'goals', data: this.currentGoals }));
        }
        if (this.currentPoll) {
          ws.send(JSON.stringify({ type: 'poll', data: this.currentPoll }));
        }
        if (this.currentSchedule) {
          ws.send(JSON.stringify({ type: 'schedule', data: this.currentSchedule }));
        }
        if (this.currentGiveaway) {
          ws.send(JSON.stringify({ type: 'giveaway', data: this.currentGiveaway }));
        }
        if (this.currentGameStats) {
          ws.send(JSON.stringify({ type: 'game-stats', data: this.currentGameStats }));
        }
        if (this.currentSponsors) {
          ws.send(JSON.stringify({ type: 'sponsors', data: this.currentSponsors }));
        }
        if (this.currentChampionTheme !== undefined) {
          ws.send(JSON.stringify({ type: 'champion-theme', data: this.getEffectiveChampionTheme() }));
        }
        for (const msg of this.recentMessages.slice(-40)) {
          ws.send(JSON.stringify({ type: 'chat', data: msg }));
        }
        if (this.pinnedMessage) {
          ws.send(JSON.stringify({ type: 'pin', data: this.pinnedMessage }));
        }

        ws.on('message', (raw) => {
          try {
            const data = JSON.parse(raw.toString());
            if (this.onClientAction) {
              this.onClientAction(data);
            }
          } catch (e) {}
        });
      });

      this.server.on('error', () => {
        this.port += 1;
        this.server.listen(this.port, listenHost, () => resolve(this.port));
      });

      this.server.listen(this.port, listenHost, () => {
        resolve(this.port);
      });
    });
  }

  broadcastAlertConfig(cfg) {
    this.currentAlertConfig = cfg;
    this._broadcast({ type: 'alert-config', data: cfg });
  }

  broadcastAlert(alertPayload) {
    this._broadcast({ type: 'obs-alert', data: alertPayload });
  }

  broadcastSpotify(track) {
    this.currentSpotify = track;
    this._broadcast({ type: 'spotify', data: track });
  }

  broadcastAudioEq(payload) {
    this._broadcast({ type: 'audio-eq', data: payload });
  }

  broadcastAppearance(appearance) {
    this.currentAppearance = appearance;
    this._broadcast({ type: 'appearance', data: appearance });
  }

  broadcastStatus(status) {
    this.currentStatus = status;
    this._broadcast({ type: 'status', data: status });
  }

  broadcastChat(msg) {
    this.recentMessages.push(msg);
    if (this.recentMessages.length > 150) {
      this.recentMessages.shift();
    }
    this._broadcast({ type: 'chat', data: msg });
  }

  deleteMessage(id) {
    this.recentMessages = this.recentMessages.filter((m) => m.id !== id);
    if (this.pinnedMessage && this.pinnedMessage.id === id) {
      this.pinnedMessage = null;
      this._broadcast({ type: 'pin', data: null });
    }
    this._broadcast({ type: 'delete-msg', id });
  }

  deleteUserMessages(author) {
    const low = (author || '').toLowerCase();
    this.recentMessages = this.recentMessages.filter((m) => (m.author || '').toLowerCase() !== low);
    if (this.pinnedMessage && (this.pinnedMessage.author || '').toLowerCase() === low) {
      this.pinnedMessage = null;
      this._broadcast({ type: 'pin', data: null });
    }
    this._broadcast({ type: 'delete-user', author: low });
  }

  broadcastPin(msgOrNull) {
    this.pinnedMessage = msgOrNull;
    this._broadcast({ type: 'pin', data: msgOrNull });
  }

  clearChat() {
    this.recentMessages = [];
    this.pinnedMessage = null;
    this._broadcast({ type: 'clear' });
  }

  _broadcast(payload) {
    if (!this.wss) return;
    const raw = JSON.stringify(payload);
    for (const client of this.wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(raw);
      }
    }
  }

  broadcastGoals(goals) {
    this.currentGoals = goals;
    this._broadcast({ type: 'goals', data: goals });
  }

  broadcastPoll(poll) {
    this.currentPoll = poll;
    this._broadcast({ type: 'poll', data: poll });
  }

  broadcastObsWsState(st) {
    this.currentObsWsState = st;
    this._broadcast({ type: 'obs-ws', data: st });
  }

  broadcastSchedule(schedulePayload) {
    this.currentSchedule = schedulePayload;
    this._broadcast({ type: 'schedule', data: schedulePayload });
  }

  setIcsProvider(fn) {
    this.currentIcsProvider = typeof fn === 'function' ? fn : null;
  }

  broadcastGiveaway(giveawayPayload) {
    this.currentGiveaway = giveawayPayload;
    this._broadcast({ type: 'giveaway', data: giveawayPayload });
  }

  broadcastSound(soundPayload) {
    this._broadcast({ type: 'soundboard', data: soundPayload });
  }

  setSoundFileResolver(fn) {
    this.soundFileResolver = typeof fn === 'function' ? fn : null;
  }

  setAlertMediaResolver(fn) {
    this.alertMediaResolver = typeof fn === 'function' ? fn : null;
  }

  setSponsorMediaResolver(fn) {
    this.sponsorMediaResolver = typeof fn === 'function' ? fn : null;
  }

  broadcastSponsors(payload) {
    this.currentSponsors = payload;
    this._broadcast({ type: 'sponsors', data: payload });
  }

  getEffectiveChampionTheme() {
    const activeAddon = this.currentGameStats && this.currentGameStats.addonId;
    if (activeAddon && activeAddon !== 'lol') return null;
    return this.currentChampionTheme || null;
  }

  broadcastChampionTheme(pack) {
    this.currentChampionTheme = pack || null;
    this._broadcast({ type: 'champion-theme', data: this.getEffectiveChampionTheme() });
  }

  setCustomTransitionResolver(fn) {
    this.customTransitionResolver = typeof fn === 'function' ? fn : null;
  }

  broadcastSceneTransition(payload = {}) {
    this._broadcast({ type: 'scene-transition', data: { at: Date.now(), ...(payload || {}) } });
  }

  broadcastSingedTransition() {
    this.broadcastSceneTransition();
  }

  setVoiceTestHandler(fn) {
    this.onVoiceTestApi = typeof fn === 'function' ? fn : null;
  }

  broadcastGameStats(statsPayload) {
    const prevAddon = this.currentGameStats && this.currentGameStats.addonId;
    this.currentGameStats = statsPayload;
    this._broadcast({ type: 'game-stats', data: statsPayload });
    const nextAddon = statsPayload && statsPayload.addonId;
    if (prevAddon !== nextAddon) {
      this._broadcast({ type: 'champion-theme', data: this.getEffectiveChampionTheme() });
    }
  }

  stop() {
    if (this.wss) this.wss.close();
    if (this.server) this.server.close();
  }
}

module.exports = { ObsServer };

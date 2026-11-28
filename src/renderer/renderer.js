const sidebar = document.getElementById('sidebar');
const btnToggleSidebar = document.getElementById('btnToggleSidebar');
const btnPopoutChat = document.getElementById('btnPopoutChat');
const btnSlimDock = document.getElementById('btnSlimDock');
const btnCompactMode = document.getElementById('btnCompactMode');
const btnSoundToggle = document.getElementById('btnSoundToggle');
const btnDemo = document.getElementById('btnDemo');
const btnPinWindow = document.getElementById('btnPinWindow');
const btnClearChat = document.getElementById('btnClearChat');

const inputStreamerName = document.getElementById('inputStreamerName');
const inputKeywordAlerts = document.getElementById('inputKeywordAlerts');
const chkKeywordSound = document.getElementById('chkKeywordSound');
const clrKeywordHighlight = document.getElementById('clrKeywordHighlight');
const chkAutoConnect = document.getElementById('chkAutoConnect');

const chkEnableTwitch = document.getElementById('chkEnableTwitch');
const chkEnableYoutube = document.getElementById('chkEnableYoutube');
const chkEnableTiktok = document.getElementById('chkEnableTiktok');

// Section 4: Compact Chat Design & Appearance UI Controls
const selLayoutMode = document.getElementById('selLayoutMode');
const selObsChatTheme = document.getElementById('selObsChatTheme');
const rngNameSize = document.getElementById('rngNameSize');
const valNameSize = document.getElementById('valNameSize');
const rngMsgSize = document.getElementById('rngMsgSize');
const valMsgSize = document.getElementById('valMsgSize');
const rngMaxNameLen = document.getElementById('rngMaxNameLen');
const valMaxNameLen = document.getElementById('valMaxNameLen');
const rngMsgPadding = document.getElementById('rngMsgPadding');
const valMsgPadding = document.getElementById('valMsgPadding');
const chkShowPlatIcons = document.getElementById('chkShowPlatIcons');
const chkShowTimestamps = document.getElementById('chkShowTimestamps');
const selPlatStyle = document.getElementById('selPlatStyle');
const selUserColorMode = document.getElementById('selUserColorMode');

const chkShowSeparator = document.getElementById('chkShowSeparator');
const clrSeparator = document.getElementById('clrSeparator');
const rngSepOpacity = document.getElementById('rngSepOpacity');
const valSepOpacity = document.getElementById('valSepOpacity');
const rngSepSpacing = document.getElementById('rngSepSpacing');
const valSepSpacing = document.getElementById('valSepSpacing');

const clrChatBg = document.getElementById('clrChatBg');
const rngBgOpacity = document.getElementById('rngBgOpacity');
const valBgOpacity = document.getElementById('valBgOpacity');
const rngObsBgOpacity = document.getElementById('rngObsBgOpacity');
const valObsBgOpacity = document.getElementById('valObsBgOpacity');

// Section 6: Follow, Sub & Event Highlighting Controls
const selEventStyle = document.getElementById('selEventStyle');
const rngEventIntensity = document.getElementById('rngEventIntensity');
const valEventIntensity = document.getElementById('valEventIntensity');
const EVENT_TYPES = ['follow', 'sub', 'resub', 'subgift', 'bits', 'raid', 'highlighted_msg'];
const evCheckboxes = {};
const evColors = {};
for (const t of EVENT_TYPES) {
  evCheckboxes[t] = document.getElementById(`chkEv_${t}`);
  evColors[t] = document.getElementById(`clrEv_${t}`);
}

// Section 3: Emote Provider Toggles
const chkEmote7tv = document.getElementById('chkEmote7tv');
const chkEmoteBttv = document.getElementById('chkEmoteBttv');
const chkEmoteFfz = document.getElementById('chkEmoteFfz');
const chkEmoteTwitch = document.getElementById('chkEmoteTwitch');
const chkEmoteYoutube = document.getElementById('chkEmoteYoutube');
const chkEmoteTiktok = document.getElementById('chkEmoteTiktok');
const chkAnimateEmotes = document.getElementById('chkAnimateEmotes');

const inputTwitchChannel = document.getElementById('inputTwitchChannel');
const inputTwitchUser = document.getElementById('inputTwitchUser');
const inputTwitchToken = document.getElementById('inputTwitchToken');
const inputYoutubeChannel = document.getElementById('inputYoutubeChannel');
const selectYoutubeStream = document.getElementById('selectYoutubeStream');
const btnScanYoutube = document.getElementById('btnScanYoutube');
const inputYoutubeVideoId = document.getElementById('inputYoutubeVideoId');
const inputTiktokChannel = document.getElementById('inputTiktokChannel');
const inputTiktokRoomId = document.getElementById('inputTiktokRoomId');

const btnConnectTwitch = document.getElementById('btnConnectTwitch');
const btnReconnectTwitch = document.getElementById('btnReconnectTwitch');
const btnConnectYoutube = document.getElementById('btnConnectYoutube');
const btnReconnectYoutube = document.getElementById('btnReconnectYoutube');
const btnConnectTiktok = document.getElementById('btnConnectTiktok');
const btnReconnectTiktok = document.getElementById('btnReconnectTiktok');
const btnConnectAll = document.getElementById('btnConnectAll');

const inputObsUrl = document.getElementById('inputObsUrl');
const btnCopyObs = document.getElementById('btnCopyObs');

const eventTickerRow = document.getElementById('eventTickerRow');
const chatFeed = document.getElementById('chatFeed');
const btnResumeScroll = document.getElementById('btnResumeScroll');
const emptyState = document.getElementById('emptyState');
const inputSearch = document.getElementById('inputSearch');
const pinnedBanner = document.getElementById('pinnedBanner');
const pinnedBody = document.getElementById('pinnedBody');
const btnUnpin = document.getElementById('btnUnpin');

const inputReply = document.getElementById('inputReply');
const btnSendReply = document.getElementById('btnSendReply');

// Section 7: Quick-Action Context Menu Elements
const quickMenu = document.getElementById('quickMenu');
const qmAvatar = document.getElementById('qmAvatar');
const qmAvatarFallback = document.getElementById('qmAvatarFallback');
const qmPlat = document.getElementById('qmPlat');
const qmUser = document.getElementById('qmUser');
const qmRolesRow = document.getElementById('qmRolesRow');
const qmAccountAge = document.getElementById('qmAccountAge');

const qmReply = document.getElementById('qmReply');
const qmCopyMsg = document.getElementById('qmCopyMsg');
const qmCopyUser = document.getElementById('qmCopyUser');
const qmPin = document.getElementById('qmPin');
const qmOpenProfile = document.getElementById('qmOpenProfile');

const qmDeleteLocal = document.getElementById('qmDeleteLocal');
const qmMuteLocal = document.getElementById('qmMuteLocal');

const qmPermBadge = document.getElementById('qmPermBadge');
const qmPermHint = document.getElementById('qmPermHint');
const qmServerDelete = document.getElementById('qmServerDelete');
const qmTimeoutBox = document.getElementById('qmTimeoutBox');
const qmBanUser = document.getElementById('qmBanUser');
const qmUnbanUser = document.getElementById('qmUnbanUser');

// Section 8: Stability, Performance & Backup Controls
const perfRamVal = document.getElementById('perfRamVal');
const perfDomVal = document.getElementById('perfDomVal');
const perfEmoteVal = document.getElementById('perfEmoteVal');
const perfRateVal = document.getElementById('perfRateVal');
const rngMaxDomMsgs = document.getElementById('rngMaxDomMsgs');
const valMaxDomMsgs = document.getElementById('valMaxDomMsgs');
const btnExportConfig = document.getElementById('btnExportConfig');
const btnImportConfig = document.getElementById('btnImportConfig');
const btnResetDefaults = document.getElementById('btnResetDefaults');

// Section 9: Extensions, Role/Bot/Spam Filters, Multi-Target Send & Collapsible Stats/Logs Tab
const btnToggleStatsTab = document.getElementById('btnToggleStatsTab');
const btnCloseStatsTab = document.getElementById('btnCloseStatsTab');
const statsDiagDrawer = document.getElementById('statsDiagDrawer');
const selRoleFilter = document.getElementById('selRoleFilter');
const btnHideBots = document.getElementById('btnHideBots');
const btnCollapseSpam = document.getElementById('btnCollapseSpam');
const chkSendTwitch = document.getElementById('chkSendTwitch');
const chkSendYoutube = document.getElementById('chkSendYoutube');
const chkSendTiktok = document.getElementById('chkSendTiktok');

const statTotalMsgs = document.getElementById('statTotalMsgs');
const statMsgsPerMin = document.getElementById('statMsgsPerMin');
const statBarTw = document.getElementById('statBarTw');
const statBarYt = document.getElementById('statBarYt');
const statBarTt = document.getElementById('statBarTt');
const statSplitText = document.getElementById('statSplitText');
const statTopChatters = document.getElementById('statTopChatters');
const statTopEmotes = document.getElementById('statTopEmotes');
const diagLogCount = document.getElementById('diagLogCount');
const diagLogList = document.getElementById('diagLogList');
const btnClearDiagLogs = document.getElementById('btnClearDiagLogs');

const KNOWN_BOTS = new Set([
  'nightbot',
  'streamelements',
  'streamlabs',
  'moobot',
  'fossabot',
  'wizebot',
  'sery_bot',
  'soundalerts',
  'pokemoncommunitygame',
  'kofistreambot',
  'own3d',
  'botrix'
]);

let messages = [];
let seenMessageIds = new Set();
let streamerEvents = [];
let activeFilter = 'all';
let activeRoleFilter = 'all';
let hideBotsEnabled = false;
let collapseSpamEnabled = true;
let searchQuery = '';
let soundAlertsEnabled = true;
let compactChatEnabled = false;
let slimDockActive = false;
let isAutoScrollPaused = false;
let unreadWhilePaused = 0;
let audioCtx = null;
let selectedMenuMsg = null;
let activeReplyParentId = null;
let banConfirmArmed = false;

// Section 9 Live Session Statistics & Diagnostics State
const sessionStats = {
  startTime: Date.now(),
  totalMessages: 0,
  byPlatform: { twitch: 0, youtube: 0, tiktok: 0 },
  chatterCounts: new Map(),
  emoteCounts: new Map()
};
let diagLogs = [];

// High-frequency 60fps RAF batching & O(1) incremental counters
let pendingRenderQueue = [];
let rafRenderScheduled = false;
let recentMsgTimestamps = [];
const fastCounters = {
  all: 0,
  mentions: 0,
  highlights: 0,
  twitch: 0,
  youtube: 0,
  tiktok: 0
};

const PLATFORM_ICONS = {
  twitch: '🟣',
  youtube: '🔴',
  tiktok: '🎵'
};

let currentStates = {
  twitch: { status: 'disconnected', viewers: 0, enabled: true },
  youtube: { status: 'disconnected', viewers: 0, enabled: true, availableStreams: [] },
  tiktok: { status: 'disconnected', viewers: 0, likes: 0, enabled: true }
};

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeHexColor(raw, fallback = '#f97316') {
  const clean = String(raw || '').trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return fallback;
  const num = Number.parseInt(clean, 16);
  if (!Number.isSafeInteger(num) || num < 0 || num > 0xffffff) return fallback;
  return '#' + num.toString(16).padStart(6, '0');
}

function formatTime(ts) {
  const d = new Date(ts || Date.now());
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function hexToRgba(hex, alphaPercent) {
  const clean = (hex || '#ffffff').replace('#', '');
  const num = parseInt(clean, 16) || 0xffffff;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${(alphaPercent / 100).toFixed(2)})`;
}

function truncateUsername(name) {
  const raw = String(name || 'User');
  const maxLen = parseInt(rngMaxNameLen?.value || '16', 10);
  if (maxLen > 0 && raw.length > maxLen) {
    return raw.slice(0, maxLen) + '…';
  }
  return raw;
}

function resolveAuthorColor(msg) {
  const mode = selUserColorMode?.value || 'user';
  if (mode === 'mono') return '#e2e8f0';
  if (mode === 'platform') {
    if (msg.platform === 'twitch') return '#a970ff';
    if (msg.platform === 'youtube') return '#ff4e45';
    return '#00f2fe';
  }
  return sanitizeHexColor(msg.color, '#38bdf8');
}

function isEmoteProviderEnabled(provider) {
  const p = (provider || '').toUpperCase();
  if (p === '7TV') return !chkEmote7tv || chkEmote7tv.checked;
  if (p === 'BTTV') return !chkEmoteBttv || chkEmoteBttv.checked;
  if (p === 'FFZ') return !chkEmoteFfz || chkEmoteFfz.checked;
  if (p === 'TWITCH') return !chkEmoteTwitch || chkEmoteTwitch.checked;
  if (p === 'YOUTUBE') return !chkEmoteYoutube || chkEmoteYoutube.checked;
  if (p === 'TIKTOK') return !chkEmoteTiktok || chkEmoteTiktok.checked;
  return true;
}

function renderMessageContentHtml(msg) {
  if (Array.isArray(msg.tokens) && msg.tokens.length > 0) {
    return msg.tokens
      .map((t) => {
        if (t.type === 'emote' && isEmoteProviderEnabled(t.provider)) {
          return `<span class="emote-wrap"><img class="chat-emote" src="${escapeHtml(t.url)}" alt="${escapeHtml(t.name)}" title="${escapeHtml(t.name)} (${escapeHtml(t.provider)})" decoding="async" loading="eager" onerror="this.replaceWith(document.createTextNode(this.alt))" /></span>`;
        }
        return escapeHtml(t.text || t.name || '');
      })
      .join('');
  }
  return escapeHtml(msg.text);
}

function renderPlatformIndicatorHtml(platform) {
  if (chkShowPlatIcons && !chkShowPlatIcons.checked) {
    return '';
  }
  const safePlat = platform === 'twitch' ? 'twitch' : platform === 'youtube' ? 'youtube' : platform === 'tiktok' ? 'tiktok' : 'chat';
  const upperPlat = safePlat.toUpperCase();
  const style = selPlatStyle?.value || 'icon_only';
  const icon = PLATFORM_ICONS[safePlat] || '💬';
  if (style === 'subtle_border') {
    return `<span class="msg-plat-dot ${safePlat}" title="${upperPlat}"></span>`;
  }
  if (style === 'icon_only') {
    return `<span class="msg-plat-icon" title="${upperPlat}">${icon}</span>`;
  }
  const shortLabel = safePlat === 'twitch' ? 'TW' : safePlat === 'youtube' ? 'YT' : 'TT';
  return `<span class="msg-plat ${safePlat}" title="${upperPlat}">${icon} ${shortLabel}</span>`;
}

function getEventHighlightSettings() {
  const types = {};
  for (const t of EVENT_TYPES) {
    types[t] = {
      enabled: evCheckboxes[t] ? evCheckboxes[t].checked : true,
      color: evColors[t]?.value || '#f59e0b'
    };
  }
  return {
    style: selEventStyle?.value || 'bar',
    intensity: parseInt(rngEventIntensity?.value || '18', 10),
    types
  };
}

function getMaxDomMessagesLimit() {
  return Math.max(50, Math.min(300, parseInt(rngMaxDomMsgs?.value || '150', 10) || 150));
}

function applyAppearanceToDOM(save = true) {
  const layoutMode = selLayoutMode?.value || 'inline';
  const nameSize = parseFloat(rngNameSize?.value || '13');
  const msgSize = parseFloat(rngMsgSize?.value || '13.5');
  const maxNameLen = parseInt(rngMaxNameLen?.value || '16', 10);
  const msgPadding = parseInt(rngMsgPadding?.value || '5', 10);
  const maxDomMsgs = getMaxDomMessagesLimit();
  const showPlatIcons = chkShowPlatIcons ? chkShowPlatIcons.checked : true;
  const showTimestamps = chkShowTimestamps ? chkShowTimestamps.checked : true;
  const showSep = chkShowSeparator ? chkShowSeparator.checked : true;
  const sepColor = clrSeparator?.value || '#ffffff';
  const sepOpacity = parseInt(rngSepOpacity?.value || '8', 10);
  const sepSpacing = parseInt(rngSepSpacing?.value || '0', 10);
  const bgColor = clrChatBg?.value || '#0b0f19';
  const bgOpacity = parseInt(rngBgOpacity?.value || '100', 10);
  const obsBgOpacity = parseInt(rngObsBgOpacity?.value || '60', 10);
  const evIntensity = parseInt(rngEventIntensity?.value || '18', 10);

  if (valNameSize) valNameSize.textContent = `${nameSize} px`;
  if (valMsgSize) valMsgSize.textContent = `${msgSize} px`;
  if (valMaxNameLen) valMaxNameLen.textContent = `${maxNameLen} Zeichen`;
  if (valMsgPadding) valMsgPadding.textContent = `${msgPadding} px`;
  if (valMaxDomMsgs) valMaxDomMsgs.textContent = `${maxDomMsgs}`;
  if (valSepOpacity) valSepOpacity.textContent = `${sepOpacity}%`;
  if (valSepSpacing) valSepSpacing.textContent = `${sepSpacing} px`;
  if (valBgOpacity) valBgOpacity.textContent = `${bgOpacity}%`;
  if (valObsBgOpacity) valObsBgOpacity.textContent = `${obsBgOpacity}%`;
  if (valEventIntensity) valEventIntensity.textContent = `${evIntensity}%`;

  const root = document.documentElement;
  root.style.setProperty('--chat-name-size', `${nameSize}px`);
  root.style.setProperty('--chat-msg-size', `${msgSize}px`);
  root.style.setProperty('--chat-pad-v', `${msgPadding}px`);
  root.style.setProperty('--chat-sep-width', showSep ? '1px' : '0px');
  root.style.setProperty('--chat-sep-color', hexToRgba(sepColor, sepOpacity));
  root.style.setProperty('--chat-sep-spacing', `${sepSpacing}px`);
  root.style.setProperty('--chat-bg-custom', hexToRgba(bgColor, bgOpacity));

  document.body.classList.toggle('layout-bubbles', layoutMode === 'bubbles');
  document.body.classList.toggle('layout-inline', layoutMode !== 'bubbles');
  document.body.classList.toggle('hide-timestamps', !showTimestamps);
  document.body.classList.toggle('hide-platicons', !showPlatIcons);

  renderFeed();

  if (save) {
    window.omnichat.saveProfile(getFormConfig());
  }
}

function playAlertTone(kind = 'mention') {
  if (!soundAlertsEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (kind === 'event') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.09);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    }
  } catch (e) {}
}

const OBS_ALERT_TYPES = ['follow', 'sub', 'resub', 'subgift', 'bits', 'raid'];

let savedAlertCustomMedia = {};

function getObsAlertSettings() {
  const types = {};
  for (const t of OBS_ALERT_TYPES) {
    const el = document.getElementById(`chkAlert_${t}`);
    types[t] = el ? el.checked : true;
  }
  return {
    enabled: document.getElementById('chkObsAlertsEnabled')?.checked !== false,
    durationSec: parseInt(document.getElementById('rngObsAlertDuration')?.value || '5', 10),
    soundEnabled: document.getElementById('chkObsAlertSound')?.checked !== false,
    animation: document.getElementById('selObsAlertAnim')?.value || 'pop',
    types,
    customMedia: savedAlertCustomMedia
  };
}

function getObsGoalSettings() {
  return {
    enabled: document.getElementById('chkObsGoalEnabled')?.checked !== false,
    title: document.getElementById('inputGoalTitle')?.value.trim() || 'Sub-Goal',
    current: Math.max(0, parseInt(document.getElementById('inputGoalCurrent')?.value || '0', 10) || 0),
    target: Math.max(1, parseInt(document.getElementById('inputGoalTarget')?.value || '50', 10) || 50),
    autoFollow: Boolean(document.getElementById('chkGoalAutoFollow')?.checked),
    autoSub: document.getElementById('chkGoalAutoSub')?.checked !== false,
    barColor: document.getElementById('clrGoalBar')?.value || '#9146ff'
  };
}

function getTtsSettings() {
  return {
    enabled: Boolean(document.getElementById('chkTtsEnabled')?.checked),
    readAlerts: document.getElementById('chkTtsAlerts')?.checked !== false,
    readChatCommand: document.getElementById('chkTtsChatCmd')?.checked !== false,
    commandPrefix: '!tts',
    maxLength: 180,
    rate: parseFloat(document.getElementById('rngTtsRate')?.value || '1.0'),
    volume: parseFloat(document.getElementById('rngTtsVol')?.value || '0.9'),
    voiceURI: document.getElementById('selTtsVoice')?.value || ''
  };
}

let savedYoutubeOAuth = {
  clientId: '',
  clientSecret: '',
  accessToken: '',
  refreshToken: '',
  expiresAt: 0,
  accountName: ''
};

function updateYoutubeOAuthUI(oauth = savedYoutubeOAuth) {
  savedYoutubeOAuth = { ...savedYoutubeOAuth, ...(oauth || {}) };
  const statusEl = document.getElementById('ytOAuthStatus');
  const btnLogout = document.getElementById('btnYtOAuthLogout');
  const btnLogin = document.getElementById('btnYtOAuthLogin');
  const hasWrite = Boolean(savedYoutubeOAuth.accessToken || (savedYoutubeOAuth.refreshToken && savedYoutubeOAuth.clientId));
  if (statusEl) {
    statusEl.textContent = hasWrite
      ? `✅ Schreibrecht (${savedYoutubeOAuth.accountName || 'Aktiv'})`
      : 'Nur-Lesen';
    statusEl.style.color = hasWrite ? '#4ade80' : '#94a3b8';
  }
  if (btnLogout) btnLogout.classList.toggle('hidden', !hasWrite);
  if (btnLogin) btnLogin.textContent = hasWrite ? '🔄 Neu anmelden' : '🔐 Mit Google anmelden';
}

function getChatTimerSettings() {
  const raw = document.getElementById('txtTimerMessages')?.value || '';
  return {
    enabled: Boolean(document.getElementById('chkTimerEnabled')?.checked),
    intervalMin: Math.max(1, parseInt(document.getElementById('numTimerInterval')?.value || '15', 10) || 15),
    messages: raw.split('\n').map((s) => s.trim()).filter(Boolean)
  };
}

function getAutoModSettings() {
  return {
    enabled: Boolean(document.getElementById('chkAutoModEnabled')?.checked),
    blockLinks: document.getElementById('chkAutoModLinks')?.checked !== false,
    blockCaps: Boolean(document.getElementById('chkAutoModCaps')?.checked),
    capsPercent: 75,
    blockSymbols: Boolean(document.getElementById('chkAutoModSymbols')?.checked),
    exemptMods: document.getElementById('chkAutoModExemptMods')?.checked !== false,
    blacklist: document.getElementById('inputAutoModBlacklist')?.value.trim() || '',
    timeoutSec: parseInt(document.getElementById('selAutoModTimeout')?.value || '60', 10) || 0
  };
}

function getCustomCommandsSettings() {
  const raw = document.getElementById('txtCustomCmdRules')?.value || '';
  return {
    enabled: Boolean(document.getElementById('chkCustomCmdsEnabled')?.checked),
    cooldownSec: Math.max(2, parseInt(document.getElementById('numCustomCmdCooldown')?.value || '10', 10) || 10),
    rules: raw.split('\n').map((s) => s.trim()).filter(Boolean)
  };
}

function getElgatoLightsSettings() {
  return {
    ips: document.getElementById('inputElgatoIps')?.value.trim() || '',
    autoOnLive: document.getElementById('chkElgatoAutoOnLive')?.checked !== false,
    autoOffStop: Boolean(document.getElementById('chkElgatoAutoOffStop')?.checked),
    brightness: parseInt(document.getElementById('rngElgatoBrightness')?.value || '60', 10) || 60,
    temperatureK: parseInt(document.getElementById('rngElgatoTemp')?.value || '4500', 10) || 4500
  };
}

const GOVEE_EVENT_KEYS = ['defaultScene', 'streamStart', 'follow', 'sub', 'resub', 'subgift', 'bits', 'raid', 'hype', 'streamStop'];
let goveeCachedDevices = [];
let goveeCachedScenes = [];

function getGoveeLightsSettings() {
  const selDev = document.getElementById('selGoveeDevice');
  const [sku, device] = String(selDev?.value || '').split('||');
  const checkedBoxes = Array.from(document.querySelectorAll('.govee-dev-chk:checked'));
  const selectedDevices = checkedBoxes.map((cb) => cb.value).filter(Boolean);
  if (!selectedDevices.length && sku && device) {
    selectedDevices.push(`${sku}||${device}`);
  }
  const eventScenes = {};
  const eventDevices = {};
  GOVEE_EVENT_KEYS.forEach((k) => {
    eventScenes[k] = document.getElementById(`selGovee_${k}`)?.value || '';
    eventDevices[k] = document.getElementById(`selGoveeDev_${k}`)?.value || '';
  });
  return {
    enabled: Boolean(document.getElementById('chkGoveeEnabled')?.checked),
    apiKey: document.getElementById('inputGoveeApiKey')?.value.trim() || '',
    sku: sku || '',
    device: device || '',
    deviceName: selDev?.selectedOptions?.[0]?.textContent || '',
    selectedDevices,
    revertAfterSec: Math.max(0, parseInt(document.getElementById('numGoveeRevertSec')?.value || '8', 10) || 0),
    cachedDevices: goveeCachedDevices,
    cachedScenes: goveeCachedScenes,
    eventScenes,
    eventDevices
  };
}

function getMultiStreamSettings() {
  return {
    port: Math.max(1024, Math.min(65535, parseInt(document.getElementById('numMsPort')?.value || '1935', 10) || 1935)),
    streamKey: document.getElementById('inputMsLocalKey')?.value.trim() || 'omnigrid',
    autoConfigureObs: document.getElementById('chkMsAutoConfigObs')?.checked !== false,
    autoStartObsStream: document.getElementById('chkMsAutoStartObs')?.checked !== false,
    targets: {
      twitch: {
        enabled: Boolean(document.getElementById('chkMsTwitch')?.checked),
        serverUrl: document.getElementById('inputMsTwitchUrl')?.value.trim() || 'rtmp://fra02.contribute.live-video.net/app',
        streamKey: document.getElementById('inputMsTwitchKey')?.value.trim() || ''
      },
      youtube: {
        enabled: Boolean(document.getElementById('chkMsYoutube')?.checked),
        serverUrl: document.getElementById('inputMsYoutubeUrl')?.value.trim() || 'rtmp://a.rtmp.youtube.com/live2',
        streamKey: document.getElementById('inputMsYoutubeKey')?.value.trim() || '',
        privacyStatus: document.getElementById('selMsYoutubePrivacy')?.value || 'public'
      },
      tiktok: {
        enabled: Boolean(document.getElementById('chkMsTiktok')?.checked),
        serverUrl: document.getElementById('inputMsTiktokUrl')?.value.trim() || '',
        streamKey: document.getElementById('inputMsTiktokKey')?.value.trim() || ''
      },
      custom: {
        enabled: Boolean(document.getElementById('chkMsCustom')?.checked),
        name: document.getElementById('inputMsCustomName')?.value.trim() || 'Kick / Custom',
        serverUrl: document.getElementById('inputMsCustomUrl')?.value.trim() || '',
        streamKey: document.getElementById('inputMsCustomKey')?.value.trim() || ''
      }
    }
  };
}

function getFormConfig() {
  return {
    streamerName: inputStreamerName.value.trim(),
    keywordAlerts: inputKeywordAlerts ? inputKeywordAlerts.value.trim() : '',
    keywordSound: chkKeywordSound ? chkKeywordSound.checked : true,
    keywordColor: clrKeywordHighlight?.value || '#f97316',
    autoConnectOnStart: chkAutoConnect.checked,
    soundAlerts: soundAlertsEnabled,
    compactChat: compactChatEnabled,
    spotifyAutoCommand: document.getElementById('chkSpotifyAutoCmd')?.checked !== false,
    obsAlerts: getObsAlertSettings(),
    obsGoals: getObsGoalSettings(),
    tts: getTtsSettings(),
    chatTimers: getChatTimerSettings(),
    autoMod: getAutoModSettings(),
    customCommands: getCustomCommandsSettings(),
    elgatoLights: getElgatoLightsSettings(),
    goveeLights: getGoveeLightsSettings(),
    multiStream: getMultiStreamSettings(),
    hideBots: hideBotsEnabled,
    collapseSpam: collapseSpamEnabled,
    platformIndicatorStyle: selPlatStyle?.value || 'icon_only',
    appearance: {
      layoutMode: selLayoutMode?.value || 'inline',
      obsChatTheme: selObsChatTheme?.value || 'auto',
      nameFontSize: parseFloat(rngNameSize?.value || '13'),
      msgFontSize: parseFloat(rngMsgSize?.value || '13.5'),
      maxNameLength: parseInt(rngMaxNameLen?.value || '16', 10),
      showPlatformIcons: chkShowPlatIcons ? chkShowPlatIcons.checked : true,
      showTimestamps: chkShowTimestamps ? chkShowTimestamps.checked : true,
      msgPadding: parseInt(rngMsgPadding?.value || '5', 10),
      maxDomMessages: getMaxDomMessagesLimit(),
      showSeparator: chkShowSeparator ? chkShowSeparator.checked : true,
      sepColor: clrSeparator?.value || '#ffffff',
      sepOpacity: parseInt(rngSepOpacity?.value || '8', 10),
      sepSpacing: parseInt(rngSepSpacing?.value || '0', 10),
      bgColor: clrChatBg?.value || '#0b0f19',
      bgOpacity: parseInt(rngBgOpacity?.value || '100', 10),
      obsBgOpacity: parseInt(rngObsBgOpacity?.value || '60', 10),
      usernameColorMode: selUserColorMode?.value || 'user',
      eventHighlights: getEventHighlightSettings()
    },
    emoteSettings: {
      enable7tv: chkEmote7tv ? chkEmote7tv.checked : true,
      enableBttv: chkEmoteBttv ? chkEmoteBttv.checked : true,
      enableFfz: chkEmoteFfz ? chkEmoteFfz.checked : true,
      enableTwitchNative: chkEmoteTwitch ? chkEmoteTwitch.checked : true,
      enableYoutubeNative: chkEmoteYoutube ? chkEmoteYoutube.checked : true,
      enableTiktokNative: chkEmoteTiktok ? chkEmoteTiktok.checked : true,
      animateEmotes: chkAnimateEmotes ? chkAnimateEmotes.checked : true
    },
    twitchEnabled: chkEnableTwitch.checked,
    twitchChannel: inputTwitchChannel.value.trim(),
    twitchUsername: inputTwitchUser.value.trim(),
    twitchToken: inputTwitchToken.value.trim(),
    youtubeEnabled: chkEnableYoutube.checked,
    youtubeChannel: inputYoutubeChannel.value.trim(),
    youtubeVideoId: inputYoutubeVideoId.value.trim() || selectYoutubeStream.value,
    youtubeOAuth: {
      ...savedYoutubeOAuth,
      clientId: document.getElementById('inputYtClientId')?.value.trim() || '',
      clientSecret: document.getElementById('inputYtClientSecret')?.value.trim() || ''
    },
    tiktokEnabled: chkEnableTiktok.checked,
    tiktokChannel: inputTiktokChannel.value.trim(),
    tiktokRoomId: inputTiktokRoomId.value.trim()
  };
}

// Bind all Section 4, Section 6 & Section 8 Design, Event & Limit Controls
[
  selLayoutMode,
  selObsChatTheme,
  rngNameSize,
  rngMsgSize,
  rngMaxNameLen,
  rngMsgPadding,
  rngMaxDomMsgs,
  chkShowPlatIcons,
  chkShowTimestamps,
  selPlatStyle,
  selUserColorMode,
  chkShowSeparator,
  clrSeparator,
  rngSepOpacity,
  rngSepSpacing,
  clrChatBg,
  rngBgOpacity,
  rngObsBgOpacity,
  selEventStyle,
  rngEventIntensity,
  ...Object.values(evCheckboxes),
  ...Object.values(evColors)
].forEach((el) => {
  el?.addEventListener('input', () => applyAppearanceToDOM(true));
  el?.addEventListener('change', () => applyAppearanceToDOM(true));
});

// Bind Section 3 Emote Provider Toggles
[chkEmote7tv, chkEmoteBttv, chkEmoteFfz, chkEmoteTwitch, chkEmoteYoutube, chkEmoteTiktok, chkAnimateEmotes].forEach(
  (chk) => {
    chk?.addEventListener('change', () => {
      window.omnichat.saveProfile(getFormConfig());
      renderFeed();
    });
  }
);

function applyCompactMode(enabled) {
  compactChatEnabled = Boolean(enabled);
  document.body.classList.toggle('compact-mode', compactChatEnabled);
  btnCompactMode.classList.toggle('active', compactChatEnabled);
  if (compactChatEnabled && rngMsgPadding) {
    rngMsgPadding.value = '2';
    if (chkShowTimestamps) chkShowTimestamps.checked = false;
    if (selPlatStyle) selPlatStyle.value = 'icon_only';
    applyAppearanceToDOM(false);
  }
}

// Toggle Sidebar
btnToggleSidebar.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
});

// Toggle Tall, Slim OBS-Dock Window Mode (340px left of OBS)
btnSlimDock?.addEventListener('click', async () => {
  slimDockActive = !slimDockActive;
  btnSlimDock.classList.toggle('active', slimDockActive);
  if (slimDockActive) {
    sidebar.classList.add('hidden');
    applyCompactMode(true);
  } else {
    sidebar.classList.remove('hidden');
  }
  await window.omnichat.toggleSlimDock(slimDockActive);
});

// Toggle Compact Mode
btnCompactMode.addEventListener('click', () => {
  applyCompactMode(!compactChatEnabled);
  window.omnichat.saveProfile(getFormConfig());
});

// Toggle Sound Alerts
btnSoundToggle.addEventListener('click', () => {
  soundAlertsEnabled = !soundAlertsEnabled;
  btnSoundToggle.classList.toggle('active', soundAlertsEnabled);
  window.omnichat.saveProfile(getFormConfig());
  if (soundAlertsEnabled) playAlertTone('mention');
});

chkAutoConnect.addEventListener('change', () => {
  window.omnichat.saveProfile(getFormConfig());
});
inputStreamerName.addEventListener('change', () => {
  window.omnichat.saveProfile(getFormConfig());
});
[inputKeywordAlerts, chkKeywordSound, clrKeywordHighlight].forEach((el) => {
  el?.addEventListener('change', () => {
    window.omnichat.saveProfile(getFormConfig());
    renderFeed();
  });
});

// Per-Platform Enable / Disable Checkboxes
[
  ['twitch', chkEnableTwitch],
  ['youtube', chkEnableYoutube],
  ['tiktok', chkEnableTiktok]
].forEach(([plat, chk]) => {
  chk.addEventListener('change', () => {
    document.getElementById(`card_${plat}`)?.classList.toggle('disabled-card', !chk.checked);
    window.omnichat.togglePlatformEnabled(plat, chk.checked, getFormConfig());
    renderFeed();
  });
});

// 1-Click Twitch Chat OAuth Token Generator
document.getElementById('btnGetTwitchToken')?.addEventListener('click', () => {
  window.omnichat.openUserProfile({ platform: 'twitch-token-generator', author: '' });
});

// YouTube Stream Selector & Scanner
btnScanYoutube.addEventListener('click', async () => {
  btnScanYoutube.textContent = '⏳';
  await window.omnichat.discoverYoutubeStreams(inputYoutubeChannel.value.trim());
  btnScanYoutube.textContent = '🔍';
});

selectYoutubeStream.addEventListener('change', () => {
  inputYoutubeVideoId.value = selectYoutubeStream.value;
  if (selectYoutubeStream.value) {
    window.omnichat.connectPlatform('youtube', getFormConfig());
  }
});

async function runYoutubeJsonImport(droppedFilePath = '') {
  const importBtn = document.getElementById('btnYtImportOAuthJson');
  const loginBtn = document.getElementById('btnYtOAuthLogin');
  const badge = document.getElementById('ytJsonImportBadge');
  const origLabel = importBtn?.textContent || '📂 Google „Download JSON“-Datei importieren & anmelden…';

  if (importBtn) {
    importBtn.disabled = true;
    importBtn.textContent = '⏳ JSON wird geladen & Google-Login im Browser geöffnet...';
  }
  if (loginBtn) loginBtn.disabled = true;

  const res = await window.omnichat.youtubeOAuthImportJson?.({
    filePath: droppedFilePath || '',
    autoLogin: true
  });

  if (importBtn) {
    importBtn.disabled = false;
    importBtn.textContent = origLabel;
  }
  if (loginBtn) loginBtn.disabled = false;

  if (res?.canceled) return;

  if (res?.oauth) {
    const cidEl = document.getElementById('inputYtClientId');
    const secEl = document.getElementById('inputYtClientSecret');
    if (cidEl && res.oauth.clientId) cidEl.value = res.oauth.clientId;
    if (secEl && res.oauth.clientSecret) secEl.value = res.oauth.clientSecret;
    updateYoutubeOAuthUI(res.oauth);
  }

  if (res?.ok) {
    if (badge) {
      badge.classList.remove('hidden');
      badge.style.color = '#4ade80';
      badge.textContent = `✅ ${res.fileName || 'JSON'} importiert & YouTube verbunden${res.oauth?.accountName ? ` (${res.oauth.accountName})` : ''}!`;
    }
  } else if (res?.error) {
    if (badge) {
      badge.classList.remove('hidden');
      badge.style.color = '#fbbf24';
      badge.textContent = res?.oauth?.clientId
        ? `ℹ️ Client-ID & Secret aus JSON übernommen — Login-Hinweis: ${res.error}`
        : `❌ ${res.error}`;
    }
  }
}

document.getElementById('btnYtImportOAuthJson')?.addEventListener('click', () => {
  runYoutubeJsonImport('');
});

const ytDetailsDropBox = document.getElementById('ytOAuthDetailsBox') || document.getElementById('card_youtube');
ytDetailsDropBox?.addEventListener('dragover', (e) => {
  if (e.dataTransfer?.types?.includes('Files')) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }
});
ytDetailsDropBox?.addEventListener('drop', (e) => {
  const f = e.dataTransfer?.files?.[0];
  if (!f || !String(f.name || '').toLowerCase().endsWith('.json')) return;
  e.preventDefault();
  e.stopPropagation();
  const detailsEl = document.getElementById('ytOAuthDetailsBox');
  if (detailsEl) detailsEl.open = true;
  if (f.path) {
    runYoutubeJsonImport(f.path);
  }
});

document.getElementById('btnYtOAuthLogin')?.addEventListener('click', async () => {
  const btn = document.getElementById('btnYtOAuthLogin');
  const clientId = document.getElementById('inputYtClientId')?.value.trim() || '';
  const clientSecret = document.getElementById('inputYtClientSecret')?.value.trim() || '';
  if (!clientId) {
    alert('Bitte zuerst eine Google OAuth2 Client-ID (Desktop-App) eintragen.');
    return;
  }
  await window.omnichat.saveProfile(getFormConfig());
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ Browser geöffnet...';
  }
  const res = await window.omnichat.youtubeOAuthLogin({ clientId, clientSecret });
  if (btn) btn.disabled = false;
  if (res?.ok && res.oauth) {
    updateYoutubeOAuthUI(res.oauth);
  } else {
    updateYoutubeOAuthUI(savedYoutubeOAuth);
    if (res?.error) alert(res.error);
  }
});

document.getElementById('btnYtOAuthLogout')?.addEventListener('click', async () => {
  const res = await window.omnichat.youtubeOAuthLogout();
  if (res?.ok) {
    updateYoutubeOAuthUI(res.oauth || {});
  }
});

['inputYtClientId', 'inputYtClientSecret'].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', () => {
    window.omnichat.saveProfile(getFormConfig());
  });
});

// Toggle Always-on-Top
btnPinWindow.addEventListener('click', async () => {
  const onTop = await window.omnichat.toggleAlwaysOnTop();
  btnPinWindow.classList.toggle('active', onTop);
});

// Toggle Demo Mode
btnDemo.addEventListener('click', async () => {
  await window.omnichat.toggleDemo();
});

// Clear Chat
btnClearChat.addEventListener('click', () => {
  messages = [];
  seenMessageIds.clear();
  streamerEvents = [];
  pinnedBanner.classList.add('hidden');
  window.omnichat.clearChat();
  renderEventTicker();
  renderFeed();
});

// Smart Auto-Scroll Detection: pause auto-scroll when user scrolls up to inspect older messages
chatFeed.addEventListener('scroll', () => {
  const distanceFromBottom = chatFeed.scrollHeight - chatFeed.scrollTop - chatFeed.clientHeight;
  if (distanceFromBottom > 48) {
    isAutoScrollPaused = true;
    btnResumeScroll?.classList.remove('hidden');
  } else {
    isAutoScrollPaused = false;
    unreadWhilePaused = 0;
    btnResumeScroll?.classList.add('hidden');
  }
});

btnResumeScroll?.addEventListener('click', () => {
  isAutoScrollPaused = false;
  unreadWhilePaused = 0;
  btnResumeScroll.classList.add('hidden');
  chatFeed.scrollTop = chatFeed.scrollHeight;
});

// Connect / Disconnect / Reconnect individual platforms
btnConnectTwitch.addEventListener('click', () => {
  const st = currentStates.twitch?.status;
  if (st === 'connected' || st === 'connecting' || st === 'reconnecting' || st === 'standby') {
    window.omnichat.disconnectPlatform('twitch');
  } else {
    chkEnableTwitch.checked = true;
    document.getElementById('card_twitch')?.classList.remove('disabled-card');
    window.omnichat.connectPlatform('twitch', getFormConfig());
  }
});

btnReconnectTwitch.addEventListener('click', () => {
  chkEnableTwitch.checked = true;
  document.getElementById('card_twitch')?.classList.remove('disabled-card');
  window.omnichat.reconnectPlatform('twitch', getFormConfig());
});

btnConnectYoutube.addEventListener('click', () => {
  document.getElementById('err_youtube').textContent = '';
  const st = currentStates.youtube?.status;
  if (st === 'connected' || st === 'connecting' || st === 'reconnecting' || st === 'standby') {
    window.omnichat.disconnectPlatform('youtube');
  } else {
    chkEnableYoutube.checked = true;
    document.getElementById('card_youtube')?.classList.remove('disabled-card');
    window.omnichat.connectPlatform('youtube', getFormConfig());
  }
});

btnReconnectYoutube.addEventListener('click', () => {
  document.getElementById('err_youtube').textContent = '';
  chkEnableYoutube.checked = true;
  document.getElementById('card_youtube')?.classList.remove('disabled-card');
  window.omnichat.reconnectPlatform('youtube', getFormConfig());
});

btnConnectTiktok.addEventListener('click', () => {
  document.getElementById('err_tiktok').textContent = '';
  const st = currentStates.tiktok?.status;
  if (st === 'connected' || st === 'connecting' || st === 'reconnecting' || st === 'standby') {
    window.omnichat.disconnectPlatform('tiktok');
  } else {
    chkEnableTiktok.checked = true;
    document.getElementById('card_tiktok')?.classList.remove('disabled-card');
    window.omnichat.connectPlatform('tiktok', getFormConfig());
  }
});

btnReconnectTiktok.addEventListener('click', () => {
  document.getElementById('err_tiktok').textContent = '';
  chkEnableTiktok.checked = true;
  document.getElementById('card_tiktok')?.classList.remove('disabled-card');
  window.omnichat.reconnectPlatform('tiktok', getFormConfig());
});

btnConnectAll.addEventListener('click', () => {
  document.getElementById('err_youtube').textContent = '';
  document.getElementById('err_tiktok').textContent = '';
  window.omnichat.connectAll(getFormConfig());
  btnConnectAll.textContent = '✓ Gespeichert & Verbunden!';
  setTimeout(() => {
    btnConnectAll.textContent = '💾 Profil speichern & Alle aktiven Kanäle verbinden';
  }, 1800);
});

const inputObsDockUrl = document.getElementById('inputObsDockUrl');
const btnCopyObsDock = document.getElementById('btnCopyObsDock');
const btnOpenStandaloneFull = document.getElementById('btnOpenStandaloneFull');

// Open Standalone Full-Height Chat Window Left of OBS
btnPopoutChat?.addEventListener('click', () => {
  window.omnichat.openStandaloneChat(true);
});

btnOpenStandaloneFull?.addEventListener('click', () => {
  window.omnichat.openStandaloneChat(true);
});

// Copy OBS Custom Browser Dock URL
btnCopyObsDock?.addEventListener('click', () => {
  if (!inputObsDockUrl) return;
  navigator.clipboard.writeText(inputObsDockUrl.value);
  btnCopyObsDock.textContent = 'Dock-Link kopiert ✓';
  setTimeout(() => {
    btnCopyObsDock.textContent = 'Dock-Link kopieren';
  }, 1500);
});

// Copy OBS Overlay URL
btnCopyObs.addEventListener('click', () => {
  navigator.clipboard.writeText(inputObsUrl.value);
  btnCopyObs.textContent = 'Kopiert ✓';
  setTimeout(() => {
    btnCopyObs.textContent = 'Overlay-URL kopieren';
  }, 1500);
});

// Filter Tabs
document.querySelectorAll('.filter-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    activeFilter = tab.dataset.filter;
    renderFeed();
  });
});

inputSearch.addEventListener('input', () => {
  searchQuery = inputSearch.value.trim().toLowerCase();
  renderFeed();
});

// Unpin Message
btnUnpin.addEventListener('click', () => {
  pinnedBanner.classList.add('hidden');
  window.omnichat.pinMessage(null);
});

function pinMessageToObs(msg) {
  pinnedBody.innerHTML = `
    ${renderPlatformIndicatorHtml(msg.platform)}
    <strong style="color: ${resolveAuthorColor(msg)}">${escapeHtml(truncateUsername(msg.author))}:</strong>
    <span>${renderMessageContentHtml(msg)}</span>
  `;
  pinnedBanner.classList.remove('hidden');
  window.omnichat.pinMessage(msg);
}

function formatAccountAge(isoDateStr) {
  if (!isoDateStr) return null;
  const created = new Date(isoDateStr);
  if (isNaN(created.getTime())) return null;
  const dateFormatted = created.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const diffYears = ((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
  return `Account seit ${dateFormatted} (${diffYears} J.)`;
}

// Section 7: Full User & Message Quick-Action Context Menu
async function openQuickMenu(msg, anchorRect) {
  selectedMenuMsg = msg;
  banConfirmArmed = false;

  // 7.1 User Overview Header
  qmPlat.textContent = msg.platform.toUpperCase();
  qmPlat.className = `qm-plat ${msg.platform}`;
  qmUser.textContent = msg.author;
  qmReply.textContent = `💬 @${truncateUsername(msg.author)} antworten`;

  // Avatar (initial or fallback)
  if (msg.avatar) {
    qmAvatar.src = msg.avatar;
    qmAvatar.classList.remove('hidden');
    qmAvatarFallback.classList.add('hidden');
  } else {
    qmAvatar.src = '';
    qmAvatar.classList.add('hidden');
    qmAvatarFallback.classList.remove('hidden');
  }

  // Moderator, VIP, Subscriber / Member Role Status Pills
  const badges = Array.isArray(msg.badges) ? msg.badges : [];
  const rolePills = [];
  if (badges.some((b) => b.includes('STREAMER') || b.includes('OWNER'))) {
    rolePills.push('<span class="qm-role streamer">👑 Streamer</span>');
  }
  if (badges.some((b) => b.includes('MOD'))) {
    rolePills.push('<span class="qm-role mod">⚔️ Moderator</span>');
  }
  if (badges.some((b) => b.includes('VIP'))) {
    rolePills.push('<span class="qm-role vip">💎 VIP</span>');
  }
  if (badges.some((b) => b.includes('SUB') || b.includes('MEMBER'))) {
    rolePills.push('<span class="qm-role sub">⭐ Subscriber</span>');
  }
  if (rolePills.length === 0) {
    rolePills.push('<span class="qm-role viewer">👤 Zuschauer</span>');
  }
  if (qmRolesRow) qmRolesRow.innerHTML = rolePills.join('');

  if (qmAccountAge) {
    qmAccountAge.textContent =
      msg.platform === 'twitch'
        ? 'Lade Twitch-Profil & Account-Alter...'
        : `Plattform: ${msg.platform.toUpperCase()} (Account-Alter API-seitig nicht öffentlich)`;
  }

  // 7.3 Permissions & Platform Safety Check
  const isTwitch = msg.platform === 'twitch';
  const hasTwitchToken = Boolean(inputTwitchToken?.value.trim());
  const canServerMod = isTwitch && hasTwitchToken;

  if (canServerMod) {
    qmPermBadge.textContent = '✓ Berechtigt (Twitch OAuth)';
    qmPermBadge.className = 'qm-perm-badge ok';
    qmPermHint.textContent = `Aktionen werden direkt auf ${msg.platform.toUpperCase()} ausgeführt.`;
    qmServerDelete.disabled = false;
    qmServerDelete.textContent = '🗑️ Nachricht auf Twitch löschen (/delete)';
    qmBanUser.disabled = false;
    qmBanUser.textContent = '🚫 Dauerhaft bannen';
    qmUnbanUser.disabled = false;
    qmUnbanUser.textContent = '🔓 Ban/Timeout aufheben';
    qmTimeoutBox?.classList.remove('disabled-box');
    qmTimeoutBox?.querySelectorAll('.qm-to-btn').forEach((b) => (b.disabled = false));
  } else {
    qmPermBadge.textContent = '🔒 Eingeschränkt';
    qmPermBadge.className = 'qm-perm-badge locked';
    qmPermHint.textContent = isTwitch
      ? 'Kein Twitch OAuth-Token hinterlegt – Server-Moderation deaktiviert (nutze Lokal löschen/stumm oben).'
      : `${msg.platform.toUpperCase()} unterstützt keine Server-Moderation ohne OAuth-Mod-API (nutze Lokal löschen/stumm).`;
    qmServerDelete.disabled = true;
    qmServerDelete.textContent = '🔒 Plattform-Löschen nicht verfügbar';
    qmBanUser.disabled = true;
    qmBanUser.textContent = '🔒 Bannen nicht verfügbar';
    qmUnbanUser.disabled = false; // Still allows unmuting locally!
    qmUnbanUser.textContent = '🔓 Lokal-Stumm aufheben';
    qmTimeoutBox?.classList.add('disabled-box');
    qmTimeoutBox?.querySelectorAll('.qm-to-btn').forEach((b) => (b.disabled = true));
  }

  quickMenu.classList.remove('hidden');

  const menuWidth = 268;
  const menuHeight = 355;
  let left = Math.min(window.innerWidth - menuWidth - 8, Math.max(8, anchorRect.left));
  let top = anchorRect.bottom + 4;
  if (top + menuHeight > window.innerHeight - 8) {
    top = Math.max(8, anchorRect.top - menuHeight - 4);
  }

  quickMenu.style.left = `${left}px`;
  quickMenu.style.top = `${top}px`;

  // Async fetch of Twitch Avatar & Account-Alter via GQL
  if (isTwitch) {
    const details = await window.omnichat.getUserDetails({
      platform: msg.platform,
      author: msg.author,
      avatar: msg.avatar || ''
    });
    if (selectedMenuMsg && selectedMenuMsg.id === msg.id && details?.ok) {
      if (details.avatar) {
        msg.avatar = details.avatar;
        qmAvatar.src = details.avatar;
        qmAvatar.classList.remove('hidden');
        qmAvatarFallback.classList.add('hidden');
      }
      const ageStr = formatAccountAge(details.createdAt);
      if (qmAccountAge) {
        qmAccountAge.textContent = ageStr || 'Twitch-Account (Erstelldatum privat)';
      }
    }
  }
}

function closeQuickMenu() {
  quickMenu.classList.add('hidden');
  selectedMenuMsg = null;
  banConfirmArmed = false;
}

document.addEventListener('click', (e) => {
  if (!quickMenu.classList.contains('hidden') && !quickMenu.contains(e.target)) {
    closeQuickMenu();
  }
});

// 7.2 Quick Actions Handlers
qmReply.addEventListener('click', () => {
  if (!selectedMenuMsg) return;
  activeReplyParentId = selectedMenuMsg.platform === 'twitch' ? selectedMenuMsg.id : null;
  inputReply.value = `@${selectedMenuMsg.author} `;
  inputReply.focus();
  closeQuickMenu();
});

qmCopyMsg?.addEventListener('click', () => {
  if (!selectedMenuMsg) return;
  navigator.clipboard.writeText(selectedMenuMsg.text || '');
  closeQuickMenu();
});

qmCopyUser?.addEventListener('click', () => {
  if (!selectedMenuMsg) return;
  navigator.clipboard.writeText(selectedMenuMsg.author || '');
  closeQuickMenu();
});

qmPin.addEventListener('click', () => {
  if (!selectedMenuMsg) return;
  pinMessageToObs(selectedMenuMsg);
  closeQuickMenu();
});

qmOpenProfile?.addEventListener('click', () => {
  if (!selectedMenuMsg) return;
  window.omnichat.openUserProfile({
    platform: selectedMenuMsg.platform,
    author: selectedMenuMsg.author
  });
  closeQuickMenu();
});

qmDeleteLocal?.addEventListener('click', async () => {
  if (!selectedMenuMsg) return;
  await window.omnichat.moderateAction('delete-msg', selectedMenuMsg);
  closeQuickMenu();
});

qmMuteLocal?.addEventListener('click', async () => {
  if (!selectedMenuMsg) return;
  await window.omnichat.moderateAction('mute-user', selectedMenuMsg);
  closeQuickMenu();
});

qmServerDelete?.addEventListener('click', async () => {
  if (!selectedMenuMsg || qmServerDelete.disabled) return;
  await window.omnichat.moderateAction('delete-msg', selectedMenuMsg);
  closeQuickMenu();
});

// Selectable Timeout Durations (10s, 1m, 10m, 1h)
qmTimeoutBox?.querySelectorAll('.qm-to-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    if (!selectedMenuMsg || btn.disabled) return;
    const sec = parseInt(btn.dataset.sec || '600', 10);
    const res = await window.omnichat.moderateAction('timeout', selectedMenuMsg, sec);
    if (!res.ok && res.error) {
      alert(res.error);
    }
    closeQuickMenu();
  });
});

// 7.3 Two-step confirmation for permanent Ban
qmBanUser.addEventListener('click', async (e) => {
  e.stopPropagation();
  if (!selectedMenuMsg || qmBanUser.disabled) return;
  if (!banConfirmArmed) {
    banConfirmArmed = true;
    qmBanUser.textContent = '⚠️ Sicher? Klick = Ban!';
    return;
  }
  const res = await window.omnichat.moderateAction('ban-user', selectedMenuMsg);
  if (!res.ok && res.error) {
    alert(res.error);
  }
  closeQuickMenu();
});

qmUnbanUser?.addEventListener('click', async () => {
  if (!selectedMenuMsg) return;
  await window.omnichat.moderateAction('unban-user', selectedMenuMsg);
  closeQuickMenu();
});

// Section 9: Send Message directly to selected target platforms (Twitch / YouTube)
[chkSendTwitch, chkSendYoutube].forEach((chk) => {
  chk?.addEventListener('change', () => {
    chk.closest('.send-target-pill')?.classList.toggle('active', chk.checked);
  });
});

async function sendReply() {
  const text = inputReply.value.trim();
  if (!text) return;
  const targets = [];
  if (!chkSendTwitch || chkSendTwitch.checked) targets.push('twitch');
  if (chkSendYoutube && chkSendYoutube.checked) targets.push('youtube');
  if (chkSendTiktok && chkSendTiktok.checked) targets.push('tiktok');

  if (targets.length === 0) {
    alert('Bitte wähle mindestens eine Zielplattform (z.B. 🟣 TW) zum Senden aus.');
    return;
  }

  const res = await window.omnichat.sendChatMessage({
    text,
    replyParentId: activeReplyParentId,
    targets
  });
  if (res.ok) {
    inputReply.value = '';
    activeReplyParentId = null;
    if (Array.isArray(res.warnings) && res.warnings.length > 0) {
      console.warn(res.warnings.join(' | '));
    }
  } else {
    alert(res.error || 'Senden fehlgeschlagen.');
  }
}

btnSendReply.addEventListener('click', sendReply);
inputReply.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendReply();
});

// Section 9: Collapsible Statistics & Diagnostics Tab Controls
btnToggleStatsTab?.addEventListener('click', () => {
  const isHidden = statsDiagDrawer?.classList.toggle('hidden');
  btnToggleStatsTab.classList.toggle('active', !isHidden);
  if (!isHidden) {
    renderSessionStatistics();
    renderDiagnosticLogs();
  }
});

btnCloseStatsTab?.addEventListener('click', () => {
  statsDiagDrawer?.classList.add('hidden');
  btnToggleStatsTab?.classList.remove('active');
});

statsDiagDrawer?.querySelectorAll('.sdd-tab').forEach((tabBtn) => {
  tabBtn.addEventListener('click', () => {
    statsDiagDrawer.querySelectorAll('.sdd-tab').forEach((b) => b.classList.remove('active'));
    tabBtn.classList.add('active');
    const target = tabBtn.dataset.sddTab;
    document.getElementById('sddTab_stats')?.classList.toggle('hidden', target !== 'stats');
    document.getElementById('sddTab_logs')?.classList.toggle('hidden', target !== 'logs');
  });
});

btnClearDiagLogs?.addEventListener('click', () => {
  diagLogs = [];
  renderDiagnosticLogs();
});

// Section 9: Role Filter, Bot Filter & Spam Collapsing Controls
selRoleFilter?.addEventListener('change', () => {
  activeRoleFilter = selRoleFilter.value || 'all';
  renderFeed();
});

btnHideBots?.addEventListener('click', () => {
  hideBotsEnabled = !hideBotsEnabled;
  btnHideBots.classList.toggle('active', hideBotsEnabled);
  window.omnichat.saveProfile(getFormConfig());
  renderFeed();
});

btnCollapseSpam?.addEventListener('click', () => {
  collapseSpamEnabled = !collapseSpamEnabled;
  btnCollapseSpam.classList.toggle('active', collapseSpamEnabled);
  window.omnichat.saveProfile(getFormConfig());
  renderFeed();
});

function isBotOrSystemMessage(msg) {
  if (!msg) return false;
  const authorLow = String(msg.author || '').trim().toLowerCase();
  if (KNOWN_BOTS.has(authorLow) || authorLow.endsWith('bot')) return true;
  const badges = (msg.badges || []).map((b) => String(b).toUpperCase());
  if (badges.includes('BOT') || badges.includes('SYSTEM')) return true;
  return false;
}

function hasRoleMatch(msg, roleFilter) {
  if (!roleFilter || roleFilter === 'all') return true;
  const badges = (msg.badges || []).map((b) => String(b).toUpperCase());
  if (roleFilter === 'mod_vip') {
    return badges.some(
      (b) => b.includes('MOD') || b.includes('VIP') || b.includes('BROADCASTER') || b.includes('OWNER')
    );
  }
  if (roleFilter === 'sub') {
    return (
      badges.some((b) => b.includes('SUB') || b.includes('MEMBER') || b.includes('FOUNDER')) ||
      msg.eventType === 'sub' ||
      msg.eventType === 'resub'
    );
  }
  return true;
}

function getNormalizedEventType(msg) {
  if (!msg || !msg.eventType) return null;
  const raw = String(msg.eventType).toLowerCase();
  if (raw === 'follow') return 'follow';
  if (raw === 'sub' || raw === 'member') return 'sub';
  if (raw === 'resub') return 'resub';
  if (raw === 'subgift') return 'subgift';
  if (raw === 'bits' || raw === 'gift' || raw === 'superchat') return 'bits';
  if (raw === 'raid') return 'raid';
  if (raw === 'highlighted_msg') return 'highlighted_msg';
  return null;
}

function isHighlightMsg(msg) {
  const evType = getNormalizedEventType(msg);
  if (!evType) return false;
  const chk = evCheckboxes[evType];
  return chk ? chk.checked : true;
}

function updateCounters() {
  document.getElementById('count_all').textContent = messages.length;
  document.getElementById('count_mentions').textContent = messages.filter((m) => m.isMention).length;
  document.getElementById('count_highlights').textContent = messages.filter((m) => isHighlightMsg(m)).length;
  document.getElementById('count_twitch').textContent = messages.filter((m) => m.platform === 'twitch').length;
  document.getElementById('count_youtube').textContent = messages.filter((m) => m.platform === 'youtube').length;
  document.getElementById('count_tiktok').textContent = messages.filter((m) => m.platform === 'tiktok').length;
}

function matchesFilter(msg) {
  if (!chkEnableTwitch.checked && msg.platform === 'twitch') return false;
  if (!chkEnableYoutube.checked && msg.platform === 'youtube') return false;
  if (!chkEnableTiktok.checked && msg.platform === 'tiktok') return false;

  if (hideBotsEnabled && isBotOrSystemMessage(msg)) return false;
  if (!hasRoleMatch(msg, activeRoleFilter)) return false;

  if (activeFilter === 'mentions' && !msg.isMention) return false;
  if (activeFilter === 'highlights' && !isHighlightMsg(msg)) return false;
  if (activeFilter === 'twitch' && msg.platform !== 'twitch') return false;
  if (activeFilter === 'youtube' && msg.platform !== 'youtube') return false;
  if (activeFilter === 'tiktok' && msg.platform !== 'tiktok') return false;

  if (searchQuery) {
    const hay = `${msg.author} ${msg.text}`.toLowerCase();
    if (!hay.includes(searchQuery)) return false;
  }
  return true;
}

function recordMessageInSessionStats(msg) {
  sessionStats.totalMessages += 1;
  if (sessionStats.byPlatform[msg.platform] !== undefined) {
    sessionStats.byPlatform[msg.platform] += 1;
  }
  if (msg.author) {
    const key = `${msg.platform}:${msg.author}`;
    sessionStats.chatterCounts.set(key, (sessionStats.chatterCounts.get(key) || 0) + 1);
  }
  if (Array.isArray(msg.tokens)) {
    for (const t of msg.tokens) {
      if (t.type === 'emote' && t.name) {
        const cur = sessionStats.emoteCounts.get(t.name) || { count: 0, url: t.url, provider: t.provider };
        cur.count += 1;
        sessionStats.emoteCounts.set(t.name, cur);
      }
    }
  }
  if (statsDiagDrawer && !statsDiagDrawer.classList.contains('hidden')) {
    renderSessionStatistics();
  }
}

function renderSessionStatistics() {
  if (!statTotalMsgs) return;
  const total = sessionStats.totalMessages;
  statTotalMsgs.textContent = total.toLocaleString('de-DE');

  const elapsedMin = Math.max(0.25, (Date.now() - sessionStats.startTime) / 60000);
  const perMin = (total / elapsedMin).toFixed(1);
  if (statMsgsPerMin) statMsgsPerMin.textContent = `${perMin} / Min`;

  const tw = sessionStats.byPlatform.twitch || 0;
  const yt = sessionStats.byPlatform.youtube || 0;
  const tt = sessionStats.byPlatform.tiktok || 0;
  const pTw = total > 0 ? Math.round((tw / total) * 100) : 0;
  const pYt = total > 0 ? Math.round((yt / total) * 100) : 0;
  const pTt = total > 0 ? Math.max(0, 100 - pTw - pYt) : 0;

  if (statBarTw) statBarTw.style.width = `${total > 0 ? pTw : 34}%`;
  if (statBarYt) statBarYt.style.width = `${total > 0 ? pYt : 33}%`;
  if (statBarTt) statBarTt.style.width = `${total > 0 ? pTt : 33}%`;
  if (statSplitText) {
    statSplitText.textContent = `TW ${pTw}% (${tw}) • YT ${pYt}% (${yt}) • TT ${pTt}% (${tt})`;
  }

  if (statTopChatters) {
    const sortedChatters = Array.from(sessionStats.chatterCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
    if (sortedChatters.length === 0) {
      statTopChatters.innerHTML = `<span class="kpi-empty">Noch keine Daten</span>`;
    } else {
      statTopChatters.innerHTML = sortedChatters
        .map(([k, count]) => {
          const [plat, name] = k.split(':');
          const ic = PLATFORM_ICONS[plat] || '';
          return `<span class="kpi-pill">${ic} ${escapeHtml(truncateUsername(name))} <strong>×${count}</strong></span>`;
        })
        .join('');
    }
  }

  if (statTopEmotes) {
    const sortedEmotes = Array.from(sessionStats.emoteCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5);
    if (sortedEmotes.length === 0) {
      statTopEmotes.innerHTML = `<span class="kpi-empty">Noch keine Emotes</span>`;
    } else {
      statTopEmotes.innerHTML = sortedEmotes
        .map(
          ([name, info]) =>
            `<span class="kpi-pill"><img src="${escapeHtml(info.url)}" class="kpi-emote-img" alt="${escapeHtml(name)}" /> ${escapeHtml(name)} <strong>×${Number(info.count || 0)}</strong></span>`
        )
        .join('');
    }
  }
}

function renderDiagnosticLogs() {
  if (diagLogCount) diagLogCount.textContent = String(diagLogs.length);
  if (!diagLogList) return;
  if (diagLogs.length === 0) {
    diagLogList.innerHTML = `<div class="diag-empty">Keine Protokolleinträge vorhanden.</div>`;
    return;
  }
  diagLogList.innerHTML = diagLogs
    .slice(-80)
    .reverse()
    .map((entry) => {
      const t = new Date(entry.timestamp || Date.now()).toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const plat = String(entry.platform || 'system').toUpperCase();
      return `<div class="diag-row ${escapeHtml(entry.level || 'info')}"><span class="diag-time">${escapeHtml(t)}</span><span class="diag-plat ${escapeHtml(entry.platform || 'system')}">${escapeHtml(plat)}</span><span class="diag-msg">${escapeHtml(entry.message)}</span></div>`;
    })
    .join('');
}

let eventsExpanded = false;
const eventTickerBar = document.getElementById('eventTickerBar');
const btnToggleEvents = document.getElementById('btnToggleEvents');
const btnToggleEventsTitle = document.getElementById('btnToggleEventsTitle');

function toggleEventsDrawer() {
  eventsExpanded = !eventsExpanded;
  eventTickerBar?.classList.toggle('expanded', eventsExpanded);
  renderEventTicker();
}

btnToggleEvents?.addEventListener('click', toggleEventsDrawer);
btnToggleEventsTitle?.addEventListener('click', toggleEventsDrawer);

function renderEventTicker() {
  if (!eventTickerRow) return;
  if (streamerEvents.length === 0) {
    eventTickerRow.innerHTML = `<span class="ticker-empty">Subs, TikTok Gifts, Follows & SuperChats erscheinen hier</span>`;
    btnToggleEvents?.classList.add('hidden');
    return;
  }

  if (btnToggleEvents) {
    if (streamerEvents.length > 3) {
      btnToggleEvents.classList.remove('hidden');
      btnToggleEvents.textContent = eventsExpanded ? '▴ Einklappen' : `▾ Alle (${streamerEvents.length})`;
    } else {
      btnToggleEvents.classList.add('hidden');
    }
  }

  const icons = {
    sub: '⭐',
    resub: '🌟',
    subgift: '🎁',
    follow: '❤️',
    bits: '💎',
    raid: '🚨',
    highlighted_msg: '✨'
  };

  const visibleCount = eventsExpanded ? 25 : 3;
  eventTickerRow.innerHTML = streamerEvents
    .slice(-visibleCount)
    .reverse()
    .map((ev) => {
      const t = String(ev.type || '').toLowerCase();
      const icon = icons[t] || '✨';
      return `
        <div class="event-pill ${escapeHtml(ev.platform)} ${escapeHtml(t)}">
          <span class="ev-icon">${icon}</span>
          <strong class="ev-author">${escapeHtml(truncateUsername(ev.author))}</strong>
          <span class="ev-summary">${escapeHtml(ev.summary)}</span>
        </div>
      `;
    })
    .join('');
}

function createMessageElement(msg) {
  const div = document.createElement('div');
  const evType = getNormalizedEventType(msg);
  const highlightActive = isHighlightMsg(msg);
  const classes = ['chat-item', msg.platform];
  if (highlightActive && evType) {
    classes.push('event-item', `event-${evType}`);
  }
  if (msg.isMention) {
    classes.push('mention');
  } else if (msg.isKeywordAlert) {
    classes.push('keyword-alert');
  }
  div.className = classes.join(' ');
  div.dataset.id = msg.id;
  div.dataset.ts = String(msg.timestamp || 0);

  if (highlightActive && evType) {
    const hexColor = evColors[evType]?.value || '#f59e0b';
    const intensity = parseInt(rngEventIntensity?.value || '18', 10);
    const styleMode = selEventStyle?.value || 'bar';

    if (styleMode === 'banner') {
      div.style.background = `linear-gradient(90deg, ${hexToRgba(hexColor, Math.min(75, intensity + 18))}, ${hexToRgba(hexColor, Math.max(8, intensity - 4))})`;
      div.style.borderLeft = `4px solid ${hexColor}`;
      div.style.borderTop = `1px solid ${hexToRgba(hexColor, 45)}`;
      div.style.borderBottom = `1px solid ${hexToRgba(hexColor, 45)}`;
    } else if (styleMode === 'outline') {
      div.style.background = hexToRgba(hexColor, Math.max(4, Math.floor(intensity / 2)));
      div.style.border = `1px solid ${hexToRgba(hexColor, Math.min(85, intensity + 30))}`;
      div.style.borderLeft = `3px solid ${hexColor}`;
    } else {
      div.style.background = hexToRgba(hexColor, intensity);
      div.style.borderLeft = `3.5px solid ${hexColor}`;
    }
  } else if (msg.isKeywordAlert && !msg.isMention) {
    const kwColor = clrKeywordHighlight?.value || '#f97316';
    div.style.background = hexToRgba(kwColor, 14);
    div.style.borderLeft = `3px solid ${kwColor}`;
  }

  const badgesHtml = (msg.badges || [])
    .map((b) => `<span class="msg-badge">${escapeHtml(b)}</span>`)
    .join('');

  const mentionTag = msg.isMention ? `<span class="mention-pill">@MICH</span>` : '';
  const kwColorVal = sanitizeHexColor(clrKeywordHighlight?.value, '#f97316');
  const keywordTag =
    msg.isKeywordAlert && msg.matchedKeyword
      ? `<span class="keyword-pill" style="background:${escapeHtml(kwColorVal)};" title="Keyword-Alarm: ${escapeHtml(msg.matchedKeyword)}">🔍 ${escapeHtml(msg.matchedKeyword.toUpperCase())}</span>`
      : '';
  const displayAuthor = truncateUsername(msg.author);
  const authorColor = resolveAuthorColor(msg);
  const repeatCount = Number(msg.repeatCount || 1);
  const repeatBadgeHtml =
    repeatCount > 1
      ? `<span class="msg-repeat-badge" title="Identische Nachricht ${repeatCount}× zusammengefasst">×${repeatCount}</span>`
      : '';

  div.innerHTML = `<div class="msg-inline-flow"><span class="msg-time">${escapeHtml(formatTime(msg.timestamp))}</span>${renderPlatformIndicatorHtml(msg.platform)}${mentionTag}${keywordTag}${badgesHtml}<span class="msg-author clickable-user" style="color: ${escapeHtml(authorColor)}" title="${escapeHtml(msg.author)} — Klick oder Rechtsklick für Schnellmenü">${escapeHtml(displayAuthor)}:</span><span class="msg-text">${renderMessageContentHtml(msg)}</span>${repeatBadgeHtml}</div><div class="msg-actions"><button class="btn-pin-msg" title="In OBS einblenden">📌</button><button class="btn-quick-menu" title="Nutzer- & Nachrichten-Schnellmenü">⋮</button></div>`;

  div.querySelector('.btn-pin-msg').addEventListener('click', (e) => {
    e.stopPropagation();
    pinMessageToObs(msg);
  });

  const openMenuAtEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = {
      left: e.clientX || e.currentTarget.getBoundingClientRect().left,
      top: e.clientY || e.currentTarget.getBoundingClientRect().top,
      bottom: (e.clientY || e.currentTarget.getBoundingClientRect().bottom) + 2
    };
    openQuickMenu(msg, rect);
  };

  // Section 7 Requirement: Click OR Right-Click on a message opens the quick context menu!
  div.addEventListener('click', openMenuAtEvent);
  div.addEventListener('contextmenu', openMenuAtEvent);
  div.querySelector('.clickable-user').addEventListener('click', openMenuAtEvent);
  div.querySelector('.btn-quick-menu').addEventListener('click', openMenuAtEvent);

  return div;
}

function renderFeed() {
  pendingRenderQueue = [];
  updateCounters();
  messages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  const filtered = messages.filter(matchesFilter);
  const maxDom = getMaxDomMessagesLimit();

  if (messages.length === 0) {
    emptyState.classList.remove('hidden');
    chatFeed.innerHTML = '';
    chatFeed.appendChild(emptyState);
    if (perfDomVal) perfDomVal.textContent = `0 / ${maxDom}`;
    return;
  }

  emptyState.classList.add('hidden');
  chatFeed.innerHTML = '';
  const frag = document.createDocumentFragment();
  for (const msg of filtered.slice(-maxDom)) {
    frag.appendChild(createMessageElement(msg));
  }
  chatFeed.appendChild(frag);
  if (perfDomVal) perfDomVal.textContent = `${chatFeed.children.length} / ${maxDom}`;
  if (!isAutoScrollPaused) {
    chatFeed.scrollTop = chatFeed.scrollHeight;
  }
}

function updateYoutubeStreamDropdown(streams = [], activeVideoId = '') {
  if (!selectYoutubeStream) return;
  const currentVal = activeVideoId || selectYoutubeStream.value || '';
  const options = [`<option value="">✨ Aktiven Livestream automatisch erkennen</option>`];
  for (const s of streams) {
    const badge = s.isLive ? '🔴 LIVE' : '📅 Stream';
    const sel = s.videoId === currentVal ? 'selected' : '';
    options.push(
      `<option value="${escapeHtml(s.videoId)}" ${sel}>${badge}: ${escapeHtml(s.title)} (${escapeHtml(s.videoId)})</option>`
    );
  }
  selectYoutubeStream.innerHTML = options.join('');
}

function updatePlatformStatusUI(states) {
  currentStates = states;
  const mapBtn = {
    twitch: btnConnectTwitch,
    youtube: btnConnectYoutube,
    tiktok: btnConnectTiktok
  };

  let totalViewers = 0;

  for (const plat of ['twitch', 'youtube', 'tiktok']) {
    const st = states[plat] || { status: 'disconnected', viewers: 0 };
    const pill = document.getElementById(`statusPill_${plat}`);
    const txt = document.getElementById(`statusText_${plat}`);
    const viewerEl = document.getElementById(`viewers_${plat}`);
    const errEl = document.getElementById(`err_${plat}`);
    const btn = mapBtn[plat];

    const vCount = Number(st.viewers || 0);
    if (st.status === 'connected') {
      totalViewers += vCount;
    }

    if (plat === 'youtube' && Array.isArray(st.availableStreams) && st.availableStreams.length > 0) {
      updateYoutubeStreamDropdown(st.availableStreams, st.videoId);
    }

    pill.className = `plat-pill ${plat} ${st.status}`;
    const td = (k, fb, vars) => (window.tDyn ? window.tDyn(k, vars) : fb);
    if (st.enabled === false) {
      txt.textContent = td('statusOff', 'Aus');
      if (viewerEl) viewerEl.textContent = '';
      btn.textContent = td('activate', 'Aktivieren');
      btn.classList.remove('disconnect');
      if (errEl) errEl.textContent = '';
    } else if (st.status === 'connected') {
      txt.textContent = st.channel || 'LIVE';
      let extra = `👁️${vCount}`;
      if (plat === 'tiktok' && st.likes > 0) {
        extra += ` ❤️${(st.likes / 1000).toFixed(1)}k`;
      }
      if (viewerEl) viewerEl.textContent = extra;
      btn.textContent = td('disconnect', 'Trennen');
      btn.classList.add('disconnect');
      if (errEl) {
        if (st.error) {
          errEl.textContent = st.error;
        } else if (plat === 'youtube' && st.streamTitle) {
          errEl.textContent = st.canWrite
            ? td('connectedRw', `✅ Verbunden (${st.streamTitle}) — Chat lesen & schreiben aktiv`, { target: st.streamTitle })
            : td('connectedRo', `✅ Verbunden (${st.streamTitle}) — Nur-Lesen`, { target: st.streamTitle });
        } else if (plat === 'tiktok' && st.roomId) {
          errEl.textContent = `Room-ID: ${st.roomId}`;
        } else if (plat === 'twitch') {
          errEl.textContent = st.canWrite
            ? td('connectedRw', `✅ Verbunden (#${st.channel}) — Chat lesen & schreiben aktiv`, { target: `#${st.channel}` })
            : td('connectedRo', `✅ Verbunden (#${st.channel}) — Nur-Lesen`, { target: `#${st.channel}` });
        } else {
          errEl.textContent = '';
        }
      }
    } else if (st.status === 'reconnecting') {
      txt.textContent = 'Reconnect...';
      if (viewerEl) viewerEl.textContent = '';
      btn.textContent = td('stop', 'Stopp');
      btn.classList.add('disconnect');
      if (errEl && st.error) errEl.textContent = st.error;
    } else if (st.status === 'standby') {
      txt.textContent = td('standby', 'Standby');
      if (viewerEl) viewerEl.textContent = '';
      btn.textContent = td('stop', 'Stopp');
      btn.classList.add('disconnect');
      if (errEl && st.error) errEl.textContent = st.error;
    } else if (st.status === 'connecting') {
      txt.textContent = '...';
      if (viewerEl) viewerEl.textContent = '';
      btn.textContent = '...';
      btn.classList.remove('disconnect');
    } else if (st.status === 'error') {
      txt.textContent = window.__appLang === 'en' ? 'Error' : 'Fehler';
      if (viewerEl) viewerEl.textContent = '';
      btn.textContent = td('connect', 'Verbinden');
      btn.classList.remove('disconnect');
      if (errEl && st.error) errEl.textContent = st.error;
    } else {
      txt.textContent = td('statusOff', 'Aus');
      if (viewerEl) viewerEl.textContent = '';
      btn.textContent = plat === 'twitch' ? td('connect', 'Verbinden') : td('startStandby', 'Start / Standby');
      btn.classList.remove('disconnect');
    }
  }

  const totalEl = document.getElementById('totalViewersCount');
  if (totalEl) {
    totalEl.textContent = totalViewers.toLocaleString('de-DE');
  }
}

function applyConfigToForm(cfg) {
  if (!cfg) return;
  inputStreamerName.value = cfg.streamerName || '';
  if (inputKeywordAlerts) inputKeywordAlerts.value = cfg.keywordAlerts || '';
  if (chkKeywordSound) chkKeywordSound.checked = cfg.keywordSound !== false;
  if (clrKeywordHighlight && cfg.keywordColor) clrKeywordHighlight.value = cfg.keywordColor;

  const pCfg = cfg.peripherals || {};
  const selKbMode = document.getElementById('selPerifKeyboardMode');
  if (selKbMode && pCfg.keyboardMode) selKbMode.value = pCfg.keyboardMode;
  if (pCfg.hotkeys) {
    const hkP = document.getElementById('hkPinLast');
    const hkU = document.getElementById('hkUnpin');
    const hkC = document.getElementById('hkClearChat');
    const hkK = document.getElementById('hkToggleCompact');
    if (hkP && pCfg.hotkeys.pinLast) hkP.value = pCfg.hotkeys.pinLast;
    if (hkU && pCfg.hotkeys.unpin) hkU.value = pCfg.hotkeys.unpin;
    if (hkC && pCfg.hotkeys.clearChat) hkC.value = pCfg.hotkeys.clearChat;
    if (hkK && pCfg.hotkeys.toggleCompact) hkK.value = pCfg.hotkeys.toggleCompact;
  }

  chkAutoConnect.checked = cfg.autoConnectOnStart !== false;
  soundAlertsEnabled = cfg.soundAlerts !== false;
  btnSoundToggle.classList.toggle('active', soundAlertsEnabled);
  const chkSpAuto = document.getElementById('chkSpotifyAutoCmd');
  if (chkSpAuto) chkSpAuto.checked = cfg.spotifyAutoCommand !== false;

  const oa = cfg.obsAlerts || {};
  const chkOaEnabled = document.getElementById('chkObsAlertsEnabled');
  if (chkOaEnabled) chkOaEnabled.checked = oa.enabled !== false;
  const selOaAnim = document.getElementById('selObsAlertAnim');
  if (selOaAnim) selOaAnim.value = oa.animation || 'pop';
  const rngOaDur = document.getElementById('rngObsAlertDuration');
  const valOaDur = document.getElementById('valObsAlertDuration');
  if (rngOaDur) {
    const dur = oa.durationSec ?? 5;
    rngOaDur.value = dur;
    if (valOaDur) valOaDur.textContent = `${dur}s`;
  }
  const chkOaSound = document.getElementById('chkObsAlertSound');
  if (chkOaSound) chkOaSound.checked = oa.soundEnabled !== false;
  for (const t of OBS_ALERT_TYPES) {
    const el = document.getElementById(`chkAlert_${t}`);
    if (el) el.checked = oa.types ? oa.types[t] !== false : true;
  }
  savedAlertCustomMedia = oa.customMedia || {};
  if (typeof renderAlertCustomMediaUI === 'function') renderAlertCustomMediaUI();

  const og = cfg.obsGoals || {};
  const elOgEn = document.getElementById('chkObsGoalEnabled');
  if (elOgEn) elOgEn.checked = og.enabled !== false;
  const elOgT = document.getElementById('inputGoalTitle');
  if (elOgT) elOgT.value = og.title || 'Sub-Goal';
  const elOgC = document.getElementById('inputGoalCurrent');
  if (elOgC) elOgC.value = og.current ?? 0;
  const elOgG = document.getElementById('inputGoalTarget');
  if (elOgG) elOgG.value = og.target ?? 50;
  const elOgB = document.getElementById('clrGoalBar');
  if (elOgB && og.barColor) elOgB.value = og.barColor;
  const elOgAf = document.getElementById('chkGoalAutoFollow');
  if (elOgAf) elOgAf.checked = Boolean(og.autoFollow);
  const elOgAs = document.getElementById('chkGoalAutoSub');
  if (elOgAs) elOgAs.checked = og.autoSub !== false;

  const tts = cfg.tts || {};
  const elTtsEn = document.getElementById('chkTtsEnabled');
  if (elTtsEn) elTtsEn.checked = Boolean(tts.enabled);
  const elTtsAl = document.getElementById('chkTtsAlerts');
  if (elTtsAl) elTtsAl.checked = tts.readAlerts !== false;
  const elTtsCh = document.getElementById('chkTtsChatCmd');
  if (elTtsCh) elTtsCh.checked = tts.readChatCommand !== false;
  const elTtsV = document.getElementById('selTtsVoice');
  if (elTtsV && tts.voiceURI) elTtsV.value = tts.voiceURI;
  const elTtsR = document.getElementById('rngTtsRate');
  const elTtsRv = document.getElementById('valTtsRate');
  if (elTtsR) {
    const r = tts.rate ?? 1.0;
    elTtsR.value = r;
    if (elTtsRv) elTtsRv.textContent = `${Number(r).toFixed(1)}x`;
  }
  const elTtsVol = document.getElementById('rngTtsVol');
  const elTtsVolV = document.getElementById('valTtsVol');
  if (elTtsVol) {
    const v = tts.volume ?? 0.9;
    elTtsVol.value = v;
    if (elTtsVolV) elTtsVolV.textContent = `${Math.round(Number(v) * 100)}%`;
  }

  const ow = cfg.obsWs || {};
  const elOwHost = document.getElementById('inputObsWsHost');
  const elOwPort = document.getElementById('inputObsWsPort');
  const elOwPass = document.getElementById('inputObsWsPass');
  const elOwMic = document.getElementById('inputObsWsMic');
  if (elOwHost) elOwHost.value = ow.host || '127.0.0.1';
  if (elOwPort) elOwPort.value = ow.port || 4455;
  if (elOwPass) elOwPass.value = ow.password || '';
  if (elOwMic) elOwMic.value = ow.micName || '';

  const ct = cfg.chatTimers || {};
  const elCtEn = document.getElementById('chkTimerEnabled');
  const elCtInt = document.getElementById('numTimerInterval');
  const elCtMsg = document.getElementById('txtTimerMessages');
  if (elCtEn) elCtEn.checked = Boolean(ct.enabled);
  if (elCtInt) elCtInt.value = ct.intervalMin ?? 15;
  if (elCtMsg) elCtMsg.value = Array.isArray(ct.messages) ? ct.messages.join('\n') : '';

  const am = cfg.autoMod || {};
  const elAmEn = document.getElementById('chkAutoModEnabled');
  const elAmL = document.getElementById('chkAutoModLinks');
  const elAmC = document.getElementById('chkAutoModCaps');
  const elAmS = document.getElementById('chkAutoModSymbols');
  const elAmE = document.getElementById('chkAutoModExemptMods');
  const elAmB = document.getElementById('inputAutoModBlacklist');
  const elAmT = document.getElementById('selAutoModTimeout');
  if (elAmEn) elAmEn.checked = Boolean(am.enabled);
  if (elAmL) elAmL.checked = am.blockLinks !== false;
  if (elAmC) elAmC.checked = Boolean(am.blockCaps);
  if (elAmS) elAmS.checked = Boolean(am.blockSymbols);
  if (elAmE) elAmE.checked = am.exemptMods !== false;
  if (elAmB) elAmB.value = am.blacklist || '';
  if (elAmT) elAmT.value = String(am.timeoutSec ?? 60);

  const cc = cfg.customCommands || {};
  const elCcEn = document.getElementById('chkCustomCmdsEnabled');
  const elCcCd = document.getElementById('numCustomCmdCooldown');
  const elCcRules = document.getElementById('txtCustomCmdRules');
  if (elCcEn) elCcEn.checked = Boolean(cc.enabled);
  if (elCcCd) elCcCd.value = cc.cooldownSec ?? 10;
  if (elCcRules) elCcRules.value = Array.isArray(cc.rules) ? cc.rules.join('\n') : '';

  const elg = cfg.elgatoLights || {};
  const inpElgIps = document.getElementById('inputElgatoIps');
  const chkElgOn = document.getElementById('chkElgatoAutoOnLive');
  const chkElgOff = document.getElementById('chkElgatoAutoOffStop');
  const rngElgBr = document.getElementById('rngElgatoBrightness');
  const valElgBr = document.getElementById('valElgatoBrightness');
  const rngElgTp = document.getElementById('rngElgatoTemp');
  const valElgTp = document.getElementById('valElgatoTemp');
  if (inpElgIps) inpElgIps.value = elg.ips || '';
  if (chkElgOn) chkElgOn.checked = elg.autoOnLive !== false;
  if (chkElgOff) chkElgOff.checked = Boolean(elg.autoOffStop);
  if (rngElgBr) rngElgBr.value = String(elg.brightness ?? 60);
  if (valElgBr) valElgBr.textContent = `${elg.brightness ?? 60}%`;
  if (rngElgTp) rngElgTp.value = String(elg.temperatureK ?? 4500);
  if (valElgTp) valElgTp.textContent = `${elg.temperatureK ?? 4500}K`;

  const gov = cfg.goveeLights || {};
  const chkGovEn = document.getElementById('chkGoveeEnabled');
  const inpGovKey = document.getElementById('inputGoveeApiKey');
  const numGovRev = document.getElementById('numGoveeRevertSec');
  if (chkGovEn) chkGovEn.checked = Boolean(gov.enabled);
  if (inpGovKey) inpGovKey.value = gov.apiKey || '';
  if (numGovRev) numGovRev.value = String(gov.revertAfterSec ?? 8);
  if (Array.isArray(gov.cachedDevices)) goveeCachedDevices = gov.cachedDevices;
  if (Array.isArray(gov.cachedScenes)) goveeCachedScenes = gov.cachedScenes;
  if (typeof window.__populateGoveeUI === 'function') {
    window.__populateGoveeUI(gov);
  }

  const ms = cfg.multiStream || {};
  const msT = ms.targets || {};
  const setVal = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined) el.value = String(v); };
  const setChk = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined) el.checked = Boolean(v); };
  setVal('numMsPort', ms.port ?? 1935);
  setVal('inputMsLocalKey', ms.streamKey || 'omnigrid');
  setVal('inputMsIngestPreview', `rtmp://127.0.0.1:${ms.port ?? 1935}/live`);
  setChk('chkMsAutoConfigObs', ms.autoConfigureObs !== false);
  setChk('chkMsAutoStartObs', ms.autoStartObsStream !== false);
  if (msT.twitch) {
    setChk('chkMsTwitch', msT.twitch.enabled ?? true);
    setVal('inputMsTwitchUrl', msT.twitch.serverUrl || 'rtmp://fra02.contribute.live-video.net/app');
    setVal('inputMsTwitchKey', msT.twitch.streamKey || '');
  }
  if (msT.youtube) {
    setChk('chkMsYoutube', msT.youtube.enabled);
    setVal('inputMsYoutubeUrl', msT.youtube.serverUrl || 'rtmp://a.rtmp.youtube.com/live2');
    setVal('inputMsYoutubeKey', msT.youtube.streamKey || '');
    const selYtPriv = document.getElementById('selMsYoutubePrivacy');
    if (selYtPriv) selYtPriv.value = msT.youtube.privacyStatus || 'public';
  }
  if (msT.tiktok) {
    setChk('chkMsTiktok', msT.tiktok.enabled);
    setVal('inputMsTiktokUrl', msT.tiktok.serverUrl || '');
    setVal('inputMsTiktokKey', msT.tiktok.streamKey || '');
  }
  if (msT.custom) {
    setChk('chkMsCustom', msT.custom.enabled);
    setVal('inputMsCustomName', msT.custom.name || 'Kick / Custom');
    setVal('inputMsCustomUrl', msT.custom.serverUrl || '');
    setVal('inputMsCustomKey', msT.custom.streamKey || '');
  }

  hideBotsEnabled = Boolean(cfg.hideBots);
  collapseSpamEnabled = cfg.collapseSpam !== false;
  btnHideBots?.classList.toggle('active', hideBotsEnabled);
  btnCollapseSpam?.classList.toggle('active', collapseSpamEnabled);

  const appCfg = cfg.appearance || {};
  if (selLayoutMode) selLayoutMode.value = appCfg.layoutMode || 'inline';
  if (selObsChatTheme) selObsChatTheme.value = appCfg.obsChatTheme || 'auto';
  if (rngNameSize) rngNameSize.value = appCfg.nameFontSize ?? 13;
  if (rngMsgSize) rngMsgSize.value = appCfg.msgFontSize ?? 13.5;
  if (rngMaxNameLen) rngMaxNameLen.value = appCfg.maxNameLength ?? 16;
  if (rngMsgPadding) rngMsgPadding.value = appCfg.msgPadding ?? 5;
  if (rngMaxDomMsgs) rngMaxDomMsgs.value = appCfg.maxDomMessages ?? 150;
  if (chkShowPlatIcons) chkShowPlatIcons.checked = appCfg.showPlatformIcons !== false;
  if (chkShowTimestamps) chkShowTimestamps.checked = appCfg.showTimestamps !== false;
  if (selPlatStyle) selPlatStyle.value = cfg.platformIndicatorStyle || 'icon_only';
  if (selUserColorMode) selUserColorMode.value = appCfg.usernameColorMode || 'user';
  if (chkShowSeparator) chkShowSeparator.checked = appCfg.showSeparator !== false;
  if (clrSeparator) clrSeparator.value = appCfg.sepColor || '#ffffff';
  if (rngSepOpacity) rngSepOpacity.value = appCfg.sepOpacity ?? 8;
  if (rngSepSpacing) rngSepSpacing.value = appCfg.sepSpacing ?? 0;
  if (clrChatBg) clrChatBg.value = appCfg.bgColor || '#0b0f19';
  if (rngBgOpacity) rngBgOpacity.value = appCfg.bgOpacity ?? 100;
  if (rngObsBgOpacity) rngObsBgOpacity.value = appCfg.obsBgOpacity ?? 60;

  // Restore Section 6 Event Highlight Settings
  const evH = appCfg.eventHighlights || {};
  if (selEventStyle && evH.style) selEventStyle.value = evH.style;
  if (rngEventIntensity && typeof evH.intensity === 'number') rngEventIntensity.value = evH.intensity;
  if (evH.types) {
    for (const t of EVENT_TYPES) {
      if (evH.types[t]) {
        if (evCheckboxes[t]) evCheckboxes[t].checked = evH.types[t].enabled !== false;
        if (evColors[t] && evH.types[t].color) evColors[t].value = evH.types[t].color;
      }
    }
  }

  const emCfg = cfg.emoteSettings || {};
  if (chkEmote7tv) chkEmote7tv.checked = emCfg.enable7tv !== false;
  if (chkEmoteBttv) chkEmoteBttv.checked = emCfg.enableBttv !== false;
  if (chkEmoteFfz) chkEmoteFfz.checked = emCfg.enableFfz !== false;
  if (chkEmoteTwitch) chkEmoteTwitch.checked = emCfg.enableTwitchNative !== false;
  if (chkEmoteYoutube) chkEmoteYoutube.checked = emCfg.enableYoutubeNative !== false;
  if (chkEmoteTiktok) chkEmoteTiktok.checked = emCfg.enableTiktokNative !== false;
  if (chkAnimateEmotes) chkAnimateEmotes.checked = emCfg.animateEmotes !== false;

  chkEnableTwitch.checked = cfg.twitchEnabled !== false;
  chkEnableYoutube.checked = cfg.youtubeEnabled !== false;
  chkEnableTiktok.checked = cfg.tiktokEnabled !== false;

  document.getElementById('card_twitch')?.classList.toggle('disabled-card', !chkEnableTwitch.checked);
  document.getElementById('card_youtube')?.classList.toggle('disabled-card', !chkEnableYoutube.checked);
  document.getElementById('card_tiktok')?.classList.toggle('disabled-card', !chkEnableTiktok.checked);

  inputTwitchChannel.value = cfg.twitchChannel || '';
  inputTwitchUser.value = cfg.twitchUsername || '';
  inputTwitchToken.value = cfg.twitchToken || '';
  inputYoutubeChannel.value = cfg.youtubeChannel || '';
  inputYoutubeVideoId.value = cfg.youtubeVideoId || '';
  const ytOAuth = cfg.youtubeOAuth || {};
  const elYtCid = document.getElementById('inputYtClientId');
  const elYtCsec = document.getElementById('inputYtClientSecret');
  if (elYtCid) elYtCid.value = ytOAuth.clientId || '';
  if (elYtCsec) elYtCsec.value = ytOAuth.clientSecret || '';
  updateYoutubeOAuthUI(ytOAuth);
  inputTiktokChannel.value = cfg.tiktokChannel || '';
  inputTiktokRoomId.value = cfg.tiktokRoomId || '';

  applyCompactMode(Boolean(cfg.compactChat));
  applyAppearanceToDOM(false);
}

// Section 8 Backup, Restore & Reset Buttons
btnExportConfig?.addEventListener('click', async () => {
  await window.omnichat.saveProfile(getFormConfig());
  const res = await window.omnichat.exportConfig();
  if (res.ok) {
    btnExportConfig.textContent = '✅ Gesichert!';
    setTimeout(() => {
      btnExportConfig.textContent = '📤 Exportieren';
    }, 1800);
  }
});

btnImportConfig?.addEventListener('click', async () => {
  const res = await window.omnichat.importConfig();
  if (res.ok && res.config) {
    applyConfigToForm(res.config);
    btnImportConfig.textContent = '✅ Geladen!';
    setTimeout(() => {
      btnImportConfig.textContent = '📥 Importieren';
    }, 1800);
  }
});

btnResetDefaults?.addEventListener('click', async () => {
  const res = await window.omnichat.resetDefaults();
  if (res.ok && res.config) {
    applyConfigToForm(res.config);
    btnResetDefaults.textContent = '✅ Standard!';
    setTimeout(() => {
      btnResetDefaults.textContent = '↺ Standard';
    }, 1800);
  }
});

// Section 8 Live Performance & Memory Monitor (runs every 2 seconds with minimal overhead)
async function pollPerformanceStats() {
  try {
    const now = Date.now();
    recentMsgTimestamps = recentMsgTimestamps.filter((t) => now - t < 5000);
    const ratePerSec = (recentMsgTimestamps.length / 5).toFixed(1);
    const maxDom = getMaxDomMessagesLimit();

    if (perfRateVal) perfRateVal.textContent = `${ratePerSec} /s`;
    if (perfDomVal) {
      const domCount = emptyState.parentElement === chatFeed ? 0 : chatFeed.children.length;
      perfDomVal.textContent = `${domCount} / ${maxDom}`;
    }

    if (window.omnichat.getPerfStats) {
      const st = await window.omnichat.getPerfStats();
      if (st?.ok) {
        if (perfRamVal) perfRamVal.textContent = `${st.ramMb} MB`;
        if (perfEmoteVal) perfEmoteVal.textContent = `${st.cachedEmotes}`;
      }
    }
  } catch (e) {}
}
setInterval(pollPerformanceStats, 2000);
setTimeout(pollPerformanceStats, 600);

let streamDeckBaseUrl = 'http://127.0.0.1:4588/api/streamdeck';
const sdActionsList = document.getElementById('sdActionsList');
const inputSdCustomText = document.getElementById('inputSdCustomText');
const inputSdCustomUrl = document.getElementById('inputSdCustomUrl');
const btnCopySdCustom = document.getElementById('btnCopySdCustom');

function updateSdCustomUrl() {
  if (!inputSdCustomUrl) return;
  const txt = (inputSdCustomText?.value || '').trim() || 'GG!';
  inputSdCustomUrl.value = `${streamDeckBaseUrl}/send?text=${encodeURIComponent(txt)}`;
}

inputSdCustomText?.addEventListener('input', updateSdCustomUrl);
btnCopySdCustom?.addEventListener('click', () => {
  if (!inputSdCustomUrl) return;
  navigator.clipboard.writeText(inputSdCustomUrl.value);
  btnCopySdCustom.textContent = '✅ Kopiert!';
  setTimeout(() => {
    btnCopySdCustom.textContent = 'Kopieren';
  }, 1500);
});

sdActionsList?.querySelectorAll('.sd-row').forEach((row) => {
  const pathPart = row.dataset.sdPath || '';
  const copyBtn = row.querySelector('.sd-copy');
  const testBtn = row.querySelector('.sd-test');

  copyBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(`${streamDeckBaseUrl}${pathPart}`);
    copyBtn.textContent = '✅';
    setTimeout(() => {
      copyBtn.textContent = '📋 URL';
    }, 1400);
  });

  testBtn?.addEventListener('click', async () => {
    try {
      const res = await fetch(`${streamDeckBaseUrl}${pathPart}`);
      const json = await res.json();
      testBtn.textContent = json.ok ? '✅' : '⚠️';
    } catch (e) {
      testBtn.textContent = '❌';
    }
    setTimeout(() => {
      testBtn.textContent = '▶ Test';
    }, 1400);
  });
});

// --- PERIPHERAL SELECTION (SEPARATE 2ND KEYBOARD, MOUSE & GLOBAL HOTKEYS) ---
const btnScanPeripherals = document.getElementById('btnScanPeripherals');
const selPerifKeyboard = document.getElementById('selPerifKeyboard');
const selPerifKeyboardMode = document.getElementById('selPerifKeyboardMode');
const btnConnectHidKeyboard = document.getElementById('btnConnectHidKeyboard');
const selPerifMouse = document.getElementById('selPerifMouse');
const btnConnectHidMouse = document.getElementById('btnConnectHidMouse');
const perifLiveStatus = document.getElementById('perifLiveStatus');
const btnSaveHotkeys = document.getElementById('btnSaveHotkeys');

let activeHidKeyboard = null;
let activeHidMouse = null;
let hidTypingBuffer = '';
let prevHidKeys = new Set();
let prevMouseButtons = 0;

// Standard USB HID Keyboard Usage IDs (0x04..0x2C + F1..F4 + Numpad)
const HID_KEY_CHARS = {
  0x04: 'a', 0x05: 'b', 0x06: 'c', 0x07: 'd', 0x08: 'e', 0x09: 'f', 0x0a: 'g',
  0x0b: 'h', 0x0c: 'i', 0x0d: 'j', 0x0e: 'k', 0x0f: 'l', 0x10: 'm', 0x11: 'n',
  0x12: 'o', 0x13: 'p', 0x14: 'q', 0x15: 'r', 0x16: 's', 0x17: 't', 0x18: 'u',
  0x19: 'v', 0x1a: 'w', 0x1b: 'x', 0x1c: 'y', 0x1d: 'z',
  0x1e: '1', 0x1f: '2', 0x20: '3', 0x21: '4', 0x22: '5', 0x23: '6', 0x24: '7',
  0x25: '8', 0x26: '9', 0x27: '0', 0x2c: ' ', 0x2d: '-', 0x36: ',', 0x37: '.',
  0x59: '1', 0x5a: '2', 0x5b: '3', 0x5c: '4', 0x5d: '5', 0x5e: '6', 0x5f: '7',
  0x60: '8', 0x61: '9', 0x62: '0'
};

function setPerifStatus(msg) {
  if (perifLiveStatus) perifLiveStatus.textContent = msg;
}

async function scanPeripherals() {
  if (!window.omnichat.listPeripherals) return;
  if (btnScanPeripherals) btnScanPeripherals.textContent = '⏳';
  const res = await window.omnichat.listPeripherals();
  if (btnScanPeripherals) btnScanPeripherals.textContent = '🔍 Scannen';
  if (!res?.ok || !Array.isArray(res.devices)) return;

  const kbOpts = [`<option value="">-- Tastatur auswählen (${res.devices.length} Geräte) --</option>`];
  const msOpts = [`<option value="">-- Maus auswählen (${res.devices.length} Geräte) --</option>`];

  for (const d of res.devices) {
    const val = JSON.stringify({ name: d.name, vendorId: d.vendorId, productId: d.productId });
    const label = `${d.name}${d.vendorId ? ` (VID:${d.vendorId.toString(16).toUpperCase()})` : ''}`;
    if (d.kind === 'mouse') {
      msOpts.push(`<option value='${escapeHtml(val)}'>🖱️ ${escapeHtml(label)}</option>`);
    } else {
      kbOpts.push(`<option value='${escapeHtml(val)}'>⌨️ ${escapeHtml(label)}</option>`);
    }
  }

  // Also allow picking any listed USB device in either dropdown
  for (const d of res.devices) {
    const val = JSON.stringify({ name: d.name, vendorId: d.vendorId, productId: d.productId });
    const label = `${d.name}${d.vendorId ? ` (VID:${d.vendorId.toString(16).toUpperCase()})` : ''}`;
    if (d.kind !== 'mouse') {
      msOpts.push(`<option value='${escapeHtml(val)}'>🔌 ${escapeHtml(label)}</option>`);
    } else {
      kbOpts.push(`<option value='${escapeHtml(val)}'>🔌 ${escapeHtml(label)}</option>`);
    }
  }

  if (selPerifKeyboard) selPerifKeyboard.innerHTML = kbOpts.join('');
  if (selPerifMouse) selPerifMouse.innerHTML = msOpts.join('');
}

btnScanPeripherals?.addEventListener('click', scanPeripherals);
setTimeout(scanPeripherals, 900);

btnConnectHidKeyboard?.addEventListener('click', async () => {
  if (activeHidKeyboard) {
    try {
      await activeHidKeyboard.close();
    } catch (e) {}
    activeHidKeyboard = null;
    btnConnectHidKeyboard.textContent = '🔌 Verbinden';
    btnConnectHidKeyboard.classList.remove('disconnect');
    setPerifStatus('ℹ️ Zweittastatur getrennt.');
    return;
  }

  if (!navigator.hid) {
    setPerifStatus('❌ WebHID wird in dieser Umgebung nicht unterstützt.');
    return;
  }

  let target = null;
  try {
    if (selPerifKeyboard?.value) target = JSON.parse(selPerifKeyboard.value);
  } catch (e) {}
  await window.omnichat.setHidTarget(target);

  try {
    const filters = target?.vendorId
      ? [{ vendorId: target.vendorId, ...(target.productId ? { productId: target.productId } : {}) }]
      : [{ usagePage: 0x01, usage: 0x06 }];
    const devices = await navigator.hid.requestDevice({ filters });
    if (!devices || devices.length === 0) {
      setPerifStatus('⚠️ Keine Zweittastatur ausgewählt.');
      return;
    }
    const dev = devices[0];
    await dev.open();
    activeHidKeyboard = dev;
    prevHidKeys.clear();
    hidTypingBuffer = '';
    btnConnectHidKeyboard.textContent = '⏹ Trennen';
    btnConnectHidKeyboard.classList.add('disconnect');
    setPerifStatus(`✅ Zweittastatur aktiv: ${dev.productName || 'USB HID Keyboard'}`);

    dev.addEventListener('inputreport', async (event) => {
      const bytes = new Uint8Array(event.data.buffer);
      const modifier = bytes[0] || 0;
      const shift = (modifier & 0x22) !== 0;
      const currentKeys = new Set();
      for (let i = 2; i < Math.min(bytes.length, 8); i++) {
        if (bytes[i] > 0) currentKeys.add(bytes[i]);
      }

      const mode = selPerifKeyboardMode?.value || 'chat_and_macros';

      for (const code of currentKeys) {
        if (prevHidKeys.has(code)) continue;
        // F1..F4 or 1..4 in macros_only mode
        if (code === 0x3a || (mode === 'macros_only' && code === 0x1e)) {
          await window.omnichat.triggerPeripheralAction({ action: 'pin-last' });
          setPerifStatus('📌 Zweittastatur: Letzte Nachricht in OBS gepinnt!');
        } else if (code === 0x3b || (mode === 'macros_only' && code === 0x1f)) {
          await window.omnichat.triggerPeripheralAction({ action: 'unpin' });
          setPerifStatus('❌ Zweittastatur: OBS-Pin ausgeblendet.');
        } else if (code === 0x3c || (mode === 'macros_only' && code === 0x20)) {
          await window.omnichat.triggerPeripheralAction({ action: 'clear-chat' });
          setPerifStatus('🗑️ Zweittastatur: Chat geleert.');
        } else if (code === 0x3d || (mode === 'macros_only' && code === 0x21)) {
          await window.omnichat.triggerPeripheralAction({ action: 'toggle-compact' });
          setPerifStatus('↕️ Zweittastatur: Kompakt-Modus umgeschaltet.');
        } else if (mode === 'chat_and_macros') {
          if (code === 0x28 || code === 0x58) {
            // Enter -> send buffered chat message!
            const toSend = hidTypingBuffer.trim();
            hidTypingBuffer = '';
            if (toSend) {
              await window.omnichat.triggerPeripheralAction({ action: 'send', text: toSend });
              setPerifStatus(`✅ Von Zweittastatur gesendet: "${toSend}"`);
            }
          } else if (code === 0x2a) {
            hidTypingBuffer = hidTypingBuffer.slice(0, -1);
            setPerifStatus(`⌨️ Zweittastatur-Entwurf: "${hidTypingBuffer}"`);
          } else if (HID_KEY_CHARS[code]) {
            const ch = shift ? HID_KEY_CHARS[code].toUpperCase() : HID_KEY_CHARS[code];
            hidTypingBuffer += ch;
            setPerifStatus(`⌨️ Zweittastatur-Entwurf: "${hidTypingBuffer}" (Enter = Senden)`);
          }
        }
      }
      prevHidKeys = currentKeys;
    });
  } catch (err) {
    setPerifStatus(`⚠️ OS-Schutz für direkte Tastatur (${err.message}). Tipp: Nutze ein USB-Numpad oder die Globalen Hotkeys darunter.`);
  }
});

btnConnectHidMouse?.addEventListener('click', async () => {
  if (activeHidMouse) {
    try {
      await activeHidMouse.close();
    } catch (e) {}
    activeHidMouse = null;
    btnConnectHidMouse.textContent = '🖱️ Verbinden';
    btnConnectHidMouse.classList.remove('disconnect');
    setPerifStatus('ℹ️ Zweitmaus getrennt.');
    return;
  }

  if (!navigator.hid) {
    setPerifStatus('❌ WebHID wird in dieser Umgebung nicht unterstützt.');
    return;
  }

  let target = null;
  try {
    if (selPerifMouse?.value) target = JSON.parse(selPerifMouse.value);
  } catch (e) {}
  await window.omnichat.setHidTarget(target);

  try {
    const filters = target?.vendorId
      ? [{ vendorId: target.vendorId, ...(target.productId ? { productId: target.productId } : {}) }]
      : [{ usagePage: 0x01, usage: 0x02 }];
    const devices = await navigator.hid.requestDevice({ filters });
    if (!devices || devices.length === 0) {
      setPerifStatus('⚠️ Keine Zweitmaus ausgewählt.');
      return;
    }
    const dev = devices[0];
    await dev.open();
    activeHidMouse = dev;
    prevMouseButtons = 0;
    btnConnectHidMouse.textContent = '⏹ Trennen';
    btnConnectHidMouse.classList.add('disconnect');
    setPerifStatus(`✅ Zweitmaus aktiv: ${dev.productName || 'USB HID Mouse'} (Scroll = Chat, Links = Pin, Rechts = Unpin)`);

    dev.addEventListener('inputreport', async (event) => {
      const view = new DataView(event.data.buffer);
      const buttons = view.byteLength > 0 ? view.getUint8(0) : 0;
      const wheel = view.byteLength >= 4 ? view.getInt8(3) : 0;

      if (wheel !== 0 && chatFeed) {
        chatFeed.scrollTop -= wheel * 42;
      }
      if ((buttons & 1) && !(prevMouseButtons & 1)) {
        await window.omnichat.triggerPeripheralAction({ action: 'pin-last' });
        setPerifStatus('📌 Zweitmaus-Klick: Letzte Nachricht in OBS gepinnt!');
      } else if ((buttons & 2) && !(prevMouseButtons & 2)) {
        await window.omnichat.triggerPeripheralAction({ action: 'unpin' });
        setPerifStatus('❌ Zweitmaus-Rechtsklick: OBS-Pin ausgeblendet.');
      }
      prevMouseButtons = buttons;
    });
  } catch (err) {
    setPerifStatus(`⚠️ Zweitmaus-Zugriff blockiert (${err.message}).`);
  }
});

btnSaveHotkeys?.addEventListener('click', async () => {
  const payload = {
    keyboardMode: selPerifKeyboardMode?.value || 'chat_and_macros',
    globalHotkeysEnabled: true,
    hotkeys: {
      pinLast: document.getElementById('hkPinLast')?.value.trim() || 'CommandOrControl+Alt+P',
      unpin: document.getElementById('hkUnpin')?.value.trim() || 'CommandOrControl+Alt+U',
      clearChat: document.getElementById('hkClearChat')?.value.trim() || 'CommandOrControl+Alt+C',
      toggleCompact: document.getElementById('hkToggleCompact')?.value.trim() || 'CommandOrControl+Alt+K'
    }
  };
  await window.omnichat.updateGlobalHotkeys(payload);
  btnSaveHotkeys.textContent = '✅ Globale Hotkeys aktiv!';
  setPerifStatus('✅ Globale Hotkeys registriert (funktionieren auch während Vollbildspielen).');
  setTimeout(() => {
    btnSaveHotkeys.textContent = '💾 Globale Hotkeys aktivieren';
  }, 1800);
});

// --- SPOTIFY LIVE & !SONG BOT HANDLERS ---
const spSidebarTitle = document.getElementById('spSidebarTitle');
const spSidebarArtist = document.getElementById('spSidebarArtist');
const inputSpotifyObsUrl = document.getElementById('inputSpotifyObsUrl');
const btnCopySpotifyObs = document.getElementById('btnCopySpotifyObs');
const chkSpotifyAutoCmd = document.getElementById('chkSpotifyAutoCmd');

function updateSpotifyUI(track) {
  if (!spSidebarTitle || !spSidebarArtist) return;
  if (!track || !track.running || !track.title) {
    spSidebarTitle.textContent = 'Musik nicht aktiv';
    spSidebarArtist.textContent = 'Starte Amazon Music, Spotify oder Apple Music';
    return;
  }
  const icon = track.playing ? '▶️' : '⏸️';
  const src = track.source || 'Spotify';
  spSidebarTitle.textContent = `${icon} ${track.title}`;
  spSidebarArtist.textContent = track.artist ? `${track.artist} • ${src}` : src;
}

document.getElementById('btnSpPrev')?.addEventListener('click', () => window.omnichat.spotifyControl('previous'));
document.getElementById('btnSpPlayPause')?.addEventListener('click', () => window.omnichat.spotifyControl('playpause'));
document.getElementById('btnSpNext')?.addEventListener('click', () => window.omnichat.spotifyControl('next'));
document.getElementById('btnSpAnnounce')?.addEventListener('click', async () => {
  const res = await window.omnichat.spotifyControl('announce');
  if (!res?.ok && res?.error) alert(res.error);
});

chkSpotifyAutoCmd?.addEventListener('change', () => {
  window.omnichat.saveProfile(getFormConfig());
});

btnCopySpotifyObs?.addEventListener('click', () => {
  if (!inputSpotifyObsUrl) return;
  navigator.clipboard.writeText(inputSpotifyObsUrl.value);
  btnCopySpotifyObs.textContent = '✅ Kopiert!';
  setTimeout(() => {
    btnCopySpotifyObs.textContent = 'Widget-URL kopieren';
  }, 1500);
});

const imgTabletQr = document.getElementById('imgTabletQr');
const inputTabletUrl = document.getElementById('inputTabletUrl');
const btnCopyTabletUrl = document.getElementById('btnCopyTabletUrl');

btnCopyTabletUrl?.addEventListener('click', () => {
  if (!inputTabletUrl) return;
  navigator.clipboard.writeText(inputTabletUrl.value);
  btnCopyTabletUrl.textContent = '✅ Kopiert!';
  setTimeout(() => {
    btnCopyTabletUrl.textContent = '📋 Tablet-Link kopieren';
  }, 1500);
});

// --- OBS ALERT-BOX OVERLAY HANDLERS ---
const inputObsAlertsUrl = document.getElementById('inputObsAlertsUrl');
const btnCopyObsAlerts = document.getElementById('btnCopyObsAlerts');
const btnTestObsAlert = document.getElementById('btnTestObsAlert');

btnCopyObsAlerts?.addEventListener('click', () => {
  if (!inputObsAlertsUrl) return;
  navigator.clipboard.writeText(inputObsAlertsUrl.value);
  btnCopyObsAlerts.textContent = '✅ Kopiert!';
  setTimeout(() => {
    btnCopyObsAlerts.textContent = 'Alert-URL kopieren';
  }, 1500);
});

btnTestObsAlert?.addEventListener('click', async () => {
  const activeType = OBS_ALERT_TYPES.find((t) => document.getElementById(`chkAlert_${t}`)?.checked) || 'sub';
  await window.omnichat.testObsAlert(activeType);
  btnTestObsAlert.textContent = '✅ Gesendet!';
  setTimeout(() => {
    btnTestObsAlert.textContent = '▶ Test-Alert';
  }, 1400);
});

const rngObsAlertDuration = document.getElementById('rngObsAlertDuration');
const valObsAlertDuration = document.getElementById('valObsAlertDuration');
rngObsAlertDuration?.addEventListener('input', () => {
  if (valObsAlertDuration) valObsAlertDuration.textContent = `${rngObsAlertDuration.value}s`;
});
rngObsAlertDuration?.addEventListener('change', () => {
  window.omnichat.saveProfile(getFormConfig());
});

[
  'chkObsAlertsEnabled',
  'selObsAlertAnim',
  'chkObsAlertSound',
  ...OBS_ALERT_TYPES.map((t) => `chkAlert_${t}`)
].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', () => {
    window.omnichat.saveProfile(getFormConfig());
  });
});

// --- CUSTOM ALERT MEDIA HANDLERS (NATIVE FINDER / EXPLORER FILE DIALOG) ---
const selAlertMediaType = document.getElementById('selAlertMediaType');
const btnPickAlertImage = document.getElementById('btnPickAlertImage');
const lblAlertImageFile = document.getElementById('lblAlertImageFile');
const btnClearAlertImage = document.getElementById('btnClearAlertImage');
const btnPickAlertAudio = document.getElementById('btnPickAlertAudio');
const lblAlertAudioFile = document.getElementById('lblAlertAudioFile');
const btnClearAlertAudio = document.getElementById('btnClearAlertAudio');

function extractDisplayFileName(filePath, fallbackUrl = '') {
  const src = String(filePath || fallbackUrl || '').trim();
  if (!src) return '';
  const clean = src.replace(/[?#].*$/, '');
  const segs = clean.split(/[/\\]/).filter(Boolean);
  return segs[segs.length - 1] || src;
}

function renderAlertCustomMediaUI() {
  const t = selAlertMediaType?.value || 'follow';
  const m = savedAlertCustomMedia[t] || {};
  const imgName = m.imageName || extractDisplayFileName(m.imagePath, m.imageUrl);
  const audName = m.audioName || extractDisplayFileName(m.audioPath, m.audioUrl);

  if (lblAlertImageFile) {
    lblAlertImageFile.textContent = imgName ? `🖼️ ${imgName}` : (window.__appLang === 'en' ? 'No image selected' : 'Keine Bilddatei gewählt');
    lblAlertImageFile.classList.toggle('has-file', Boolean(imgName));
    lblAlertImageFile.title = m.imagePath || imgName || '';
  }
  btnClearAlertImage?.classList.toggle('hidden', !imgName);

  if (lblAlertAudioFile) {
    lblAlertAudioFile.textContent = audName ? `🔊 ${audName}` : (window.__appLang === 'en' ? 'No custom sound (default chime)' : 'Kein eigener Sound (Standard-Chime)');
    lblAlertAudioFile.classList.toggle('has-file', Boolean(audName));
    lblAlertAudioFile.title = m.audioPath || audName || '';
  }
  btnClearAlertAudio?.classList.toggle('hidden', !audName);
}

selAlertMediaType?.addEventListener('change', renderAlertCustomMediaUI);

btnPickAlertImage?.addEventListener('click', async () => {
  const pick = await window.omnichat.pickLocalFile?.({ kind: 'image' });
  if (!pick?.ok) return;
  const t = selAlertMediaType?.value || 'follow';
  const prev = savedAlertCustomMedia[t] || {};
  savedAlertCustomMedia[t] = {
    ...prev,
    imagePath: pick.filePath,
    imageName: pick.fileName,
    imageUrl: ''
  };
  renderAlertCustomMediaUI();
  window.omnichat.saveProfile(getFormConfig());
});

btnClearAlertImage?.addEventListener('click', () => {
  const t = selAlertMediaType?.value || 'follow';
  const prev = savedAlertCustomMedia[t] || {};
  savedAlertCustomMedia[t] = { ...prev, imagePath: '', imageName: '', imageUrl: '' };
  renderAlertCustomMediaUI();
  window.omnichat.saveProfile(getFormConfig());
});

btnPickAlertAudio?.addEventListener('click', async () => {
  const pick = await window.omnichat.pickLocalFile?.({ kind: 'audio' });
  if (!pick?.ok) return;
  const t = selAlertMediaType?.value || 'follow';
  const prev = savedAlertCustomMedia[t] || {};
  savedAlertCustomMedia[t] = {
    ...prev,
    audioPath: pick.filePath,
    audioName: pick.fileName,
    audioUrl: ''
  };
  renderAlertCustomMediaUI();
  window.omnichat.saveProfile(getFormConfig());
});

btnClearAlertAudio?.addEventListener('click', () => {
  const t = selAlertMediaType?.value || 'follow';
  const prev = savedAlertCustomMedia[t] || {};
  savedAlertCustomMedia[t] = { ...prev, audioPath: '', audioName: '', audioUrl: '' };
  renderAlertCustomMediaUI();
  window.omnichat.saveProfile(getFormConfig());
});

// --- OBS GOAL-BAR & MULTISTREAM POLL HANDLERS ---
const inputObsGoalsUrl = document.getElementById('inputObsGoalsUrl');
const btnCopyObsGoals = document.getElementById('btnCopyObsGoals');
const inputObsPollUrl = document.getElementById('inputObsPollUrl');
const btnCopyObsPoll = document.getElementById('btnCopyObsPoll');
const pollPreviewStatus = document.getElementById('pollPreviewStatus');

function bindCopyBtn(btn, inputEl, defaultLabel) {
  btn?.addEventListener('click', () => {
    if (!inputEl) return;
    navigator.clipboard.writeText(inputEl.value);
    btn.textContent = '✅';
    setTimeout(() => {
      btn.textContent = defaultLabel;
    }, 1400);
  });
}
bindCopyBtn(btnCopyObsGoals, inputObsGoalsUrl, 'Goal-URL');
bindCopyBtn(btnCopyObsPoll, inputObsPollUrl, 'Poll-URL');

[
  'chkObsGoalEnabled',
  'inputGoalTitle',
  'clrGoalBar',
  'inputGoalCurrent',
  'inputGoalTarget',
  'chkGoalAutoFollow',
  'chkGoalAutoSub'
].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', () => {
    window.omnichat.saveProfile(getFormConfig());
  });
});

function updatePollPreviewUI(poll) {
  const btnVis = document.getElementById('btnPollToggleVis');
  if (btnVis) {
    btnVis.textContent = poll && poll.visible === false ? '👁️ Einblenden' : '👁️ Ausblenden';
  }
  if (!pollPreviewStatus) return;
  if (!poll || (!poll.active && !poll.visibleWhenStopped)) {
    pollPreviewStatus.textContent = 'Keine aktive Umfrage';
    return;
  }
  const visNote = poll.visible === false ? ' • 🙈 Ausgeblendet' : '';
  const summary = (poll.options || []).map((o, i) => `${i + 1}. ${o.label}: ${o.votes}`).join(' • ');
  pollPreviewStatus.textContent = `${poll.active ? '🟢 Aktiv' : '⏹ Beendet'}${visNote} (${poll.totalVotes} Stimmen) — ${summary}`;
}

document.getElementById('btnPollStart')?.addEventListener('click', async () => {
  const question = document.getElementById('inputPollQuestion')?.value.trim() || 'Was sollen wir spielen?';
  const options = document.getElementById('inputPollOptions')?.value.trim() || 'Option A, Option B';
  const res = await window.omnichat.pollAction({ action: 'start', question, options });
  if (!res?.ok && res?.error) alert(res.error);
});

document.getElementById('btnPollStop')?.addEventListener('click', () => {
  window.omnichat.pollAction({ action: 'stop' });
});

document.getElementById('btnPollToggleVis')?.addEventListener('click', () => {
  window.omnichat.pollAction({ action: 'toggle-visibility' });
});

document.getElementById('btnPollReset')?.addEventListener('click', () => {
  window.omnichat.pollAction({ action: 'reset' });
});

// --- TEXT-TO-SPEECH (TTS) ENGINE ---
const ttsQueue = [];
let ttsSpeaking = false;

function populateTtsVoices() {
  const sel = document.getElementById('selTtsVoice');
  if (!sel || typeof speechSynthesis === 'undefined') return;
  const currentVal = sel.value;
  const voices = speechSynthesis.getVoices() || [];
  sel.innerHTML = '<option value="">System-Standardstimme</option>';
  voices.forEach((v) => {
    const opt = document.createElement('option');
    opt.value = v.voiceURI;
    opt.textContent = `${v.name} (${v.lang})`;
    sel.appendChild(opt);
  });
  if (currentVal) sel.value = currentVal;
}

if (typeof speechSynthesis !== 'undefined') {
  populateTtsVoices();
  speechSynthesis.onvoiceschanged = populateTtsVoices;
}

function processTtsQueue() {
  if (ttsSpeaking || ttsQueue.length === 0 || typeof speechSynthesis === 'undefined') return;
  const cfg = getTtsSettings();
  if (!cfg.enabled && !ttsQueue[0]._forceTest) {
    ttsQueue.length = 0;
    return;
  }
  const item = ttsQueue.shift();
  ttsSpeaking = true;
  const utter = new SpeechSynthesisUtterance(String(item.text || '').slice(0, cfg.maxLength || 180));
  utter.rate = cfg.rate || 1.0;
  utter.volume = cfg.volume ?? 0.9;
  if (cfg.voiceURI) {
    const match = (speechSynthesis.getVoices() || []).find((v) => v.voiceURI === cfg.voiceURI);
    if (match) utter.voice = match;
  }
  const done = () => {
    ttsSpeaking = false;
    processTtsQueue();
  };
  utter.onend = done;
  utter.onerror = done;
  speechSynthesis.speak(utter);
}

function enqueueTts(text, forceTest = false) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean || typeof speechSynthesis === 'undefined') return;
  if (ttsQueue.length > 20) ttsQueue.shift();
  ttsQueue.push({ text: clean, _forceTest: forceTest });
  processTtsQueue();
}

function skipTts() {
  if (typeof speechSynthesis === 'undefined') return;
  speechSynthesis.cancel();
  ttsSpeaking = false;
  processTtsQueue();
}

function clearTtsQueue() {
  ttsQueue.length = 0;
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel();
  }
  ttsSpeaking = false;
}

const rngTtsRate = document.getElementById('rngTtsRate');
const valTtsRate = document.getElementById('valTtsRate');
const rngTtsVol = document.getElementById('rngTtsVol');
const valTtsVol = document.getElementById('valTtsVol');

rngTtsRate?.addEventListener('input', () => {
  if (valTtsRate) valTtsRate.textContent = `${Number(rngTtsRate.value).toFixed(1)}x`;
});
rngTtsVol?.addEventListener('input', () => {
  if (valTtsVol) valTtsVol.textContent = `${Math.round(Number(rngTtsVol.value) * 100)}%`;
});

['chkTtsEnabled', 'chkTtsAlerts', 'chkTtsChatCmd', 'selTtsVoice', 'rngTtsRate', 'rngTtsVol'].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', () => {
    window.omnichat.saveProfile(getFormConfig());
  });
});

document.getElementById('btnTtsTest')?.addEventListener('click', () => {
  enqueueTts('Hallo Stream! Text-to-Speech ist aktiv und funktioniert.', true);
});
document.getElementById('btnTtsSkip')?.addEventListener('click', skipTts);
document.getElementById('btnTtsClear')?.addEventListener('click', clearTtsQueue);

// IPC Listeners
window.omnichat.onPollUpdated?.((poll) => updatePollPreviewUI(poll));
window.omnichat.onGoalsUpdated?.((goals) => {
  const elOgC = document.getElementById('inputGoalCurrent');
  if (elOgC && goals) elOgC.value = goals.current ?? 0;
});

window.omnichat.onInitState((data) => {
  if (data.streamDeckUrl) {
    streamDeckBaseUrl = data.streamDeckUrl;
    updateSdCustomUrl();
  }
  if (Array.isArray(data.tabletTargets) && data.tabletTargets.length > 0) {
    const selNet = document.getElementById('selTabletNet');
    if (selNet) {
      selNet.innerHTML = '';
      data.tabletTargets.forEach((t, idx) => {
        const opt = document.createElement('option');
        opt.value = String(idx);
        opt.textContent = t.label;
        selNet.appendChild(opt);
      });
      selNet.classList.toggle('hidden', data.tabletTargets.length <= 1);
      selNet.onchange = () => {
        const chosen = data.tabletTargets[parseInt(selNet.value, 10)] || data.tabletTargets[0];
        if (chosen) {
          if (inputTabletUrl) inputTabletUrl.value = chosen.url;
          if (imgTabletQr && chosen.qrDataUrl) {
            imgTabletQr.src = chosen.qrDataUrl;
            imgTabletQr.classList.remove('hidden');
          }
        }
      };
    }
  }
  if (data.tabletUrl && inputTabletUrl) {
    inputTabletUrl.value = data.tabletUrl;
  }
  if (data.tabletQrDataUrl && imgTabletQr) {
    imgTabletQr.src = data.tabletQrDataUrl;
    imgTabletQr.classList.remove('hidden');
  }
  if (data.obsAlertsUrl && inputObsAlertsUrl) {
    inputObsAlertsUrl.value = data.obsAlertsUrl;
  }
  if (data.obsGoalsUrl && inputObsGoalsUrl) {
    inputObsGoalsUrl.value = data.obsGoalsUrl;
  }
  if (data.obsPollUrl && inputObsPollUrl) {
    inputObsPollUrl.value = data.obsPollUrl;
  }
  if (data.activePoll) {
    updatePollPreviewUI(data.activePoll);
  }
  if (data.obsWsState) {
    updateObsWsUI(data.obsWsState);
  }
  if (data.spotifyObsUrl && inputSpotifyObsUrl) {
    inputSpotifyObsUrl.value = data.spotifyObsUrl;
  }
  if (data.spotifyTrack) {
    updateSpotifyUI(data.spotifyTrack);
  }
  if (data.config) {
    applyConfigToForm(data.config);
  }
  if (Array.isArray(data.diagnosticLogs)) {
    diagLogs = data.diagnosticLogs;
    renderDiagnosticLogs();
  }
  if (data.obsUrl) {
    inputObsUrl.value = data.obsUrl;
  }
  if (data.obsDockUrl && inputObsDockUrl) {
    inputObsDockUrl.value = data.obsDockUrl;
  }
  if (data.isStandaloneWindow || location.search.includes('standalone=1')) {
    sidebar.classList.add('hidden');
    btnPopoutChat?.classList.add('hidden');
    btnPinWindow.classList.toggle('active', Boolean(data.isAlwaysOnTop));
  }
  if (data.platformStatus) {
    updatePlatformStatusUI(data.platformStatus);
  }
  btnDemo.classList.toggle('active', Boolean(data.demoActive));
  btnDemo.textContent = data.demoActive ? '⏹ Stop' : '▶ Demo';
});

window.omnichat.onSpotifyTrack?.((track) => {
  updateSpotifyUI(track);
});

window.omnichat.onStreamDeckCommand?.((payload) => {
  if (!payload) return;
  if (payload.command === 'pin' && payload.msg) {
    pinnedBody.innerHTML = `<strong>${escapeHtml(payload.msg.author)}:</strong> ${renderMessageContentHtml(payload.msg)}`;
    pinnedBanner.classList.remove('hidden');
  } else if (payload.command === 'unpin') {
    pinnedBanner.classList.add('hidden');
  } else if (payload.command === 'clear-chat') {
    messages = [];
    seenMessageIds.clear();
    streamerEvents = [];
    pinnedBanner.classList.add('hidden');
    renderEventTicker();
    renderFeed();
  } else if (payload.command === 'set-compact') {
    applyCompactMode(Boolean(payload.value));
  } else if (payload.command === 'set-sound') {
    soundAlertsEnabled = Boolean(payload.value);
    btnSoundToggle.classList.toggle('active', soundAlertsEnabled);
  } else if (payload.command === 'set-always-on-top') {
    btnPinWindow.classList.toggle('active', Boolean(payload.value));
  } else if (payload.command === 'sync-config' && payload.config) {
    applyConfigToForm(payload.config);
    renderFeed();
  }
});

window.omnichat.onDiagLog?.((entry) => {
  if (!entry) return;
  diagLogs.push(entry);
  if (diagLogs.length > 200) diagLogs.shift();
  renderDiagnosticLogs();
});

window.omnichat.onPlatformStatus((states) => {
  updatePlatformStatusUI(states);
});

window.omnichat.onDemoState((active) => {
  btnDemo.classList.toggle('active', active);
  btnDemo.textContent = active ? '⏹ Stop' : '▶ Demo';
});

window.omnichat.onStreamerEvent((ev) => {
  streamerEvents.push(ev);
  if (streamerEvents.length > 50) streamerEvents.shift();
  renderEventTicker();
  playAlertTone('event');
  const ttsCfg = getTtsSettings();
  if (ttsCfg.enabled && ttsCfg.readAlerts) {
    enqueueTts(`${ev.author || 'Jemand'}: ${ev.summary || ev.type || 'Neues Event'}`);
  }
});

window.omnichat.onMessageDeleted(({ id }) => {
  messages = messages.filter((m) => m.id !== id);
  pendingRenderQueue = pendingRenderQueue.filter((m) => m.id !== id);
  const existingNode = chatFeed.querySelector(`.chat-item[data-id="${CSS.escape(String(id))}"]`);
  if (existingNode) {
    existingNode.remove();
    updateCounters();
  } else {
    renderFeed();
  }
});

window.omnichat.onUserMuted(({ author }) => {
  if (author) {
    const low = author.toLowerCase();
    messages = messages.filter((m) => (m.author || '').toLowerCase() !== low);
    pendingRenderQueue = pendingRenderQueue.filter((m) => (m.author || '').toLowerCase() !== low);
    renderFeed();
  }
});

// 60fps RequestAnimationFrame Batch Renderer for high-frequency chats & emote raids
function flushPendingMessages() {
  rafRenderScheduled = false;
  if (pendingRenderQueue.length === 0) return;

  const batch = pendingRenderQueue.splice(0, pendingRenderQueue.length);
  const maxDom = getMaxDomMessagesLimit();

  if (emptyState.parentElement === chatFeed) {
    emptyState.remove();
  }

  let addedCount = 0;
  const lastChildTs = Number(chatFeed.lastElementChild?.dataset?.ts || 0);

  // Fast path: if all new messages are newer than the last DOM node, batch insert via DocumentFragment
  const allInOrder = batch.every((m, i) => {
    const ts = m.timestamp || 0;
    const prevTs = i === 0 ? lastChildTs : batch[i - 1].timestamp || 0;
    return ts >= prevTs;
  });

  if (allInOrder) {
    const frag = document.createDocumentFragment();
    for (const msg of batch) {
      if (matchesFilter(msg)) {
        frag.appendChild(createMessageElement(msg));
        addedCount++;
      }
    }
    if (addedCount > 0) {
      chatFeed.appendChild(frag);
    }
  } else {
    for (const msg of batch) {
      if (!matchesFilter(msg)) continue;
      addedCount++;
      const msgTs = msg.timestamp || 0;
      const newEl = createMessageElement(msg);
      const children = Array.from(chatFeed.children);
      const afterEl = children.find((el) => Number(el.dataset?.ts || 0) > msgTs);
      if (afterEl) {
        chatFeed.insertBefore(newEl, afterEl);
      } else {
        chatFeed.appendChild(newEl);
      }
    }
  }

  while (chatFeed.children.length > maxDom) {
    chatFeed.removeChild(chatFeed.firstChild);
  }

  updateCounters();
  if (perfDomVal) {
    perfDomVal.textContent = `${chatFeed.children.length} / ${maxDom}`;
  }

  if (addedCount > 0) {
    if (!isAutoScrollPaused) {
      chatFeed.scrollTop = chatFeed.scrollHeight;
    } else {
      unreadWhilePaused += addedCount;
      if (btnResumeScroll) {
        btnResumeScroll.textContent = `⬇️ Auto-Scroll pausiert (${unreadWhilePaused} neue) — Nach unten springen`;
        btnResumeScroll.classList.remove('hidden');
      }
    }
  }
}

window.omnichat.onChatMessage((msg) => {
  const uniqueKey = `${msg.platform}:${msg.id}`;
  if (seenMessageIds.has(uniqueKey)) return;
  seenMessageIds.add(uniqueKey);
  if (seenMessageIds.size > 2500) {
    const it = seenMessageIds.values();
    for (let i = 0; i < 500; i++) seenMessageIds.delete(it.next().value);
  }

  const msgTs = msg.timestamp || Date.now();
  recentMsgTimestamps.push(Date.now());
  recordMessageInSessionStats(msg);

  const ttsCfg = getTtsSettings();
  if (ttsCfg.enabled && ttsCfg.readChatCommand) {
    const ttsMatch = String(msg.text || '').trim().match(/^!tts\s+(.+)/i);
    if (ttsMatch && ttsMatch[1]) {
      enqueueTts(`${msg.author || 'Zuschauer'} sagt: ${ttsMatch[1]}`);
    }
  }

  // Section 9: Optional collapsing of repeated/identical messages (Spam ×2, ×3...)
  if (collapseSpamEnabled && !msg.eventType && messages.length > 0) {
    const cleanIncoming = String(msg.text || '').trim().toLowerCase();
    if (cleanIncoming.length >= 2) {
      const recentSlice = messages.slice(-6);
      const dupTarget = recentSlice
        .reverse()
        .find(
          (m) =>
            !m.eventType &&
            m.platform === msg.platform &&
            String(m.text || '').trim().toLowerCase() === cleanIncoming &&
            Math.abs(msgTs - (m.timestamp || 0)) < 25000
        );
      if (dupTarget) {
        dupTarget.repeatCount = (dupTarget.repeatCount || 1) + 1;
        const existingNode = chatFeed.querySelector(`.chat-item[data-id="${CSS.escape(String(dupTarget.id))}"]`);
        if (existingNode) {
          let badge = existingNode.querySelector('.msg-repeat-badge');
          if (!badge) {
            badge = document.createElement('span');
            badge.className = 'msg-repeat-badge';
            existingNode.querySelector('.msg-inline-flow')?.appendChild(badge);
          }
          badge.textContent = `×${dupTarget.repeatCount}`;
          badge.title = `Identische Nachricht ${dupTarget.repeatCount}× zusammengefasst`;
        }
        return;
      }
    }
  }

  // Insert in chronological order by timestamp
  if (messages.length === 0 || msgTs >= (messages[messages.length - 1].timestamp || 0)) {
    messages.push(msg);
  } else {
    const idx = messages.findIndex((m) => (m.timestamp || 0) > msgTs);
    if (idx === -1) messages.push(msg);
    else messages.splice(idx, 0, msg);
  }

  const maxBuffer = Math.max(300, getMaxDomMessagesLimit() * 2);
  while (messages.length > maxBuffer) {
    messages.shift();
  }

  if (msg.isMention && !msg.isHighlight) {
    playAlertTone('mention');
  } else if (msg.isKeywordAlert && (!chkKeywordSound || chkKeywordSound.checked) && !msg.isHighlight) {
    playAlertTone('mention');
  }

  pendingRenderQueue.push(msg);
  if (!rafRenderScheduled) {
    rafRenderScheduled = true;
    requestAnimationFrame(flushPendingMessages);
  }
});

// --- CENTRAL CONFIG PAGE ---
(function initCentralConfigPage() {
  const modal = document.getElementById('configPageModal');
  if (!modal) return;

  const profileBox = document.querySelector('.profile-meta-box');
  const tabProfile = document.getElementById('cfgTab_profile');
  if (profileBox && tabProfile) {
    const sec = document.createElement('div');
    sec.className = 'sidebar-section profile-settings-box';
    const h3 = document.createElement('h3');
    h3.textContent = '👑 Streamer-Profil & Keyword-Alarme';
    sec.appendChild(h3);
    sec.appendChild(profileBox);
    tabProfile.appendChild(sec);
  }

  const platformSection = document.getElementById('card_twitch')?.closest('.sidebar-section');
  const tabPlatforms = document.getElementById('cfgTab_platforms');
  if (platformSection && tabPlatforms) {
    platformSection.style.gridColumn = '1 / -1';
    tabPlatforms.appendChild(platformSection);
  }

  const moveMap = [
    ['.multistream-relay-box', 'cfgTab_platforms'],
    ['.event-settings-box', 'cfgTab_profile'],
    ['.design-settings-box', 'cfgTab_design'],
    ['.emote-settings-box', 'cfgTab_design'],
    ['.chat-preview-box', 'cfgTab_design'],
    ['.obs-box', 'cfgTab_obs'],
    ['.obs-ws-config-box', 'cfgTab_obs'],
    ['.elgato-lights-box', 'cfgTab_obs'],
    ['.hue-lights-box', 'cfgTab_obs'],
    ['.nanoleaf-lights-box', 'cfgTab_obs'],
    ['.govee-lights-box', 'cfgTab_obs'],
    ['.obs-alerts-box', 'cfgTab_obs'],
    ['.tts-box', 'cfgTab_obs'],
    ['.tablet-box', 'cfgTab_companion'],
    ['.streamdeck-box', 'cfgTab_companion'],
    ['.voice-control-box', 'cfgTab_companion'],
    ['.backup-config-box', 'cfgTab_system'],
    ['.peripherals-box', 'cfgTab_system'],
    ['.perf-settings-box', 'cfgTab_system']
  ];

  for (const [selector, targetId] of moveMap) {
    const el = document.querySelector(selector);
    const target = document.getElementById(targetId);
    if (el && target) target.appendChild(el);
  }

  const openModal = () => modal.classList.remove('hidden');
  const closeModal = () => modal.classList.add('hidden');

  document.getElementById('btnOpenConfig')?.addEventListener('click', openModal);
  document.getElementById('btnOpenConfigSidebar')?.addEventListener('click', openModal);
  document.getElementById('btnCloseConfig')?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  const tabBtns = Array.from(document.querySelectorAll('.config-tab-btn'));
  const tabPanels = Array.from(document.querySelectorAll('.config-tab-panel'));
  let activeCfgTab = 'platforms';
  const cfgTabToHelpSec = {
    platforms: { section: '2' },
    profile: { section: '5' },
    design: { section: '3' },
    obs: { section: '4' },
    bot: { section: '14' },
    companion: { section: '10' },
    system: { section: '8' }
  };
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.cfgTab;
      activeCfgTab = targetTab || 'platforms';
      tabBtns.forEach((b) => b.classList.toggle('active', b === btn));
      tabPanels.forEach((p) => p.classList.toggle('active', p.id === `cfgTab_${targetTab}`));
    });
  });

  document.getElementById('btnHelpConfigTab')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const target = cfgTabToHelpSec[activeCfgTab] || { section: '11' };
    window.omnichat.openHelpWindow(target);
  });

  // Contextual Guide deep-link buttons inside every config card & live sidebar card
  const sectionHelpMappings = [
    [platformSection, '2', ''],
    ['.multistream-relay-box', '22', ''],
    ['.profile-settings-box', '5', ''],
    ['.event-settings-box', '5', ''],
    ['.design-settings-box', '3', ''],
    ['.emote-settings-box', '3', ''],
    ['.obs-box', '4', ''],
    ['.obs-ws-config-box', '13', ''],
    ['.elgato-lights-box', '21', 'Elgato Key Light'],
    ['.hue-lights-box', '21', 'Philips Hue Bridge'],
    ['.nanoleaf-lights-box', '21', 'Nanoleaf'],
    ['.govee-lights-box', '21', 'Govee Smart-Light'],
    ['.obs-alerts-box', '4', 'Option D'],
    ['.tts-box', '12', ''],
    ['.chat-timer-box', '14', ''],
    ['.automod-box', '14', ''],
    ['.custom-commands-box', '14', ''],
    ['.tablet-box', '10', ''],
    ['.streamdeck-box', '7', ''],
    ['.peripherals-box', '8', ''],
    ['.perf-settings-box', '20', ''],
    ['.spotify-box', '9', ''],
    ['.obs-goals-poll-box', '12', ''],
    ['.stream-manager-box', '15', ''],
    ['.twitch-clip-box', '13', ''],
    ['.obs-ws-live-box', '13', ''],
    ['.multistream-live-box', '22', ''],
    ['.config-launcher-box', '11', '']
  ];

  for (const [selOrEl, secNum, anchorHint] of sectionHelpMappings) {
    const secEl = typeof selOrEl === 'string' ? document.querySelector(selOrEl) : selOrEl;
    if (!secEl) continue;
    const h3 = secEl.querySelector('h3');
    if (!h3 || secEl.querySelector('.btn-help-jump')) continue;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-help-jump';
    btn.dataset.helpSec = secNum;
    if (anchorHint) btn.dataset.helpAnchor = anchorHint;
    btn.title = 'Anleitung zu diesem Bereich rechts daneben öffnen';
    btn.textContent = '📖 Anleitung';

    const parent = h3.parentElement;
    if (parent && parent.classList.contains('card-header')) {
      const rightGroup = document.createElement('div');
      rightGroup.style.cssText = 'display:flex; gap:5px; align-items:center; flex-wrap:wrap;';
      Array.from(parent.children).forEach((child) => {
        if (child !== h3) rightGroup.appendChild(child);
      });
      rightGroup.appendChild(btn);
      parent.appendChild(rightGroup);
    } else {
      const wrap = document.createElement('div');
      wrap.className = 'sec-heading-with-help';
      h3.parentNode.insertBefore(wrap, h3);
      wrap.appendChild(h3);
      wrap.appendChild(btn);
    }
  }
})();

// --- TWITCH CLIP & STREAM-MARKER HANDLERS ---
const btnCreateClip = document.getElementById('btnCreateClip');
const btnCreateMarker = document.getElementById('btnCreateMarker');
const inputMarkerDesc = document.getElementById('inputMarkerDesc');
const clipMarkerResult = document.getElementById('clipMarkerResult');

btnCreateClip?.addEventListener('click', async () => {
  btnCreateClip.disabled = true;
  btnCreateClip.textContent = '⏳ Clip...';
  const res = await window.omnichat.createTwitchClip();
  btnCreateClip.disabled = false;
  btnCreateClip.textContent = '🎬 Clip erstellen';
  if (clipMarkerResult) {
    if (res?.ok && res.url) {
      clipMarkerResult.style.color = '#4ade80';
      clipMarkerResult.textContent = `✅ Clip: ${res.url} (in Zwischenablage kopiert)`;
      try { navigator.clipboard.writeText(res.url); } catch (e) {}
    } else {
      clipMarkerResult.style.color = '#f87171';
      clipMarkerResult.textContent = `❌ ${res?.error || 'Clip fehlgeschlagen.'}`;
    }
  }
});

btnCreateMarker?.addEventListener('click', async () => {
  btnCreateMarker.disabled = true;
  btnCreateMarker.textContent = '⏳ Marker...';
  const desc = inputMarkerDesc?.value.trim() || 'OmniGrid Highlight';
  const res = await window.omnichat.createTwitchMarker(desc);
  btnCreateMarker.disabled = false;
  btnCreateMarker.textContent = '🚩 Marker setzen';
  if (clipMarkerResult) {
    if (res?.ok) {
      clipMarkerResult.style.color = '#4ade80';
      const pos = typeof res.positionSeconds === 'number' ? ` @ ${res.positionSeconds}s` : '';
      clipMarkerResult.textContent = `✅ Marker gesetzt${pos}: "${res.description || desc}"`;
      if (inputMarkerDesc) inputMarkerDesc.value = '';
    } else {
      clipMarkerResult.style.color = '#f87171';
      clipMarkerResult.textContent = `❌ ${res?.error || 'Marker fehlgeschlagen.'}`;
    }
  }
});

// --- OBS WEBSOCKET V5 CONTROLS ---
function updateObsWsUI(st) {
  if (!st) return;
  const badge = document.getElementById('obsWsLiveBadge');
  const cfgStatus = document.getElementById('obsWsConfigStatus');
  const btnConn = document.getElementById('btnObsWsConnect');
  const btnDisc = document.getElementById('btnObsWsDisconnect');
  const selScene = document.getElementById('selObsScene');
  const btnReplay = document.getElementById('btnObsReplay');
  const btnMic = document.getElementById('btnObsMic');
  const btnRec = document.getElementById('btnObsRec');
  const btnStream = document.getElementById('btnObsStream');

  const isConn = Boolean(st.connected);
  window.__latestObsWsState = st;
  const td = (k, fb, vars) => (window.tDyn ? window.tDyn(k, vars) : fb);
  if (badge) {
    badge.textContent = isConn ? td('obsBadgeConnected', '(Verbunden)') : st.connecting ? '(...)' : td('obsBadgeOff', '(Aus)');
    badge.style.color = isConn ? '#4ade80' : '#94a3b8';
  }
  if (cfgStatus) {
    if (isConn) {
      cfgStatus.style.color = '#4ade80';
      cfgStatus.textContent = td('obsSceneConnected', `✅ Verbunden — Szene: ${st.currentScene || '—'}`, { scene: st.currentScene || '—' });
    } else if (st.error) {
      cfgStatus.style.color = '#f87171';
      cfgStatus.textContent = `❌ ${st.error}`;
    } else {
      cfgStatus.style.color = '#94a3b8';
      cfgStatus.textContent = st.connecting ? td('obsConnecting', '⏳ Verbinde...') : td('obsNotConnected', 'Nicht verbunden');
    }
  }
  if (btnConn) btnConn.textContent = isConn ? td('obsReconnectBtn', '🔄 Neu verbinden') : td('obsConnectBtn', '🔌 Mit OBS verbinden');
  if (btnDisc) btnDisc.classList.toggle('hidden', !isConn);

  const seBadge = document.getElementById('seObsWsBadge');
  const seConn = document.getElementById('btnSeObsWsConnect');
  const seDisc = document.getElementById('btnSeObsWsDisconnect');
  if (seBadge) {
    seBadge.textContent = isConn ? td('obsSeConnected', '● OBS: Verbunden') : st.connecting ? td('obsSeConnecting', '● OBS: Verbinde...') : td('obsSeOff', '● OBS: Aus');
    seBadge.style.color = isConn ? '#4ade80' : st.error ? '#f87171' : '#94a3b8';
  }
  if (seConn) seConn.textContent = isConn ? td('obsReconnectBtn', '🔄 Neu verbinden') : td('obsConnectBtn', '🔌 Mit OBS verbinden');
  if (seDisc) seDisc.classList.toggle('hidden', !isConn);

  [selScene, btnReplay, btnMic, btnRec, btnStream].forEach((el) => {
    if (el) el.disabled = !isConn;
  });

  if (selScene) {
    if (!isConn) {
      selScene.innerHTML = `<option value="">${td('obsConnectInConfig', '— OBS in Config verbinden —')}</option>`;
    } else {
      selScene.innerHTML = '';
      (st.scenes || []).forEach((s) => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        if (s === st.currentScene) opt.selected = true;
        selScene.appendChild(opt);
      });
    }
  }

  if (btnMic) {
    btnMic.textContent = st.micMuted ? '🔇 Mic (Aus)' : '🎙️ Mic (An)';
    btnMic.classList.toggle('warn', Boolean(st.micMuted));
  }
  if (btnRec) {
    btnRec.textContent = st.recordActive ? '⏹️ Rec läuft' : '🔴 Rec';
    btnRec.classList.toggle('active', Boolean(st.recordActive));
  }
  if (btnStream) {
    btnStream.textContent = st.streamActive ? '⏹️ Live' : '📡 Stream';
    btnStream.classList.toggle('active', Boolean(st.streamActive));
  }
}

window.omnichat.onObsWsState?.((st) => updateObsWsUI(st));

document.getElementById('btnObsWsAutoSetup')?.addEventListener('click', async () => {
  const cfgStatus = document.getElementById('obsWsConfigStatus');
  if (cfgStatus) {
    cfgStatus.style.color = '#38bdf8';
    cfgStatus.textContent = '⚡ Richte OBS automatisch ein & verbinde...';
  }
  const res = await window.omnichat.obsWsAutoSetup?.();
  if (res?.port) {
    const portInp = document.getElementById('inputObsWsPort');
    if (portInp) portInp.value = String(res.port);
  }
  if (res?.state) updateObsWsUI(res.state);
  if (cfgStatus && res?.message) {
    cfgStatus.style.color = res.ok ? '#4ade80' : '#fbbf24';
    cfgStatus.textContent = res.message;
  }
});

document.getElementById('btnObsWsConnect')?.addEventListener('click', async () => {
  const host = document.getElementById('inputObsWsHost')?.value.trim() || '127.0.0.1';
  const port = parseInt(document.getElementById('inputObsWsPort')?.value || '4455', 10) || 4455;
  const password = document.getElementById('inputObsWsPass')?.value || '';
  const micName = document.getElementById('inputObsWsMic')?.value.trim() || '';
  const res = await window.omnichat.obsWsConnect({ host, port, password, micName });
  if (res?.state) updateObsWsUI(res.state);
});

document.getElementById('btnObsWsDisconnect')?.addEventListener('click', () => {
  window.omnichat.obsWsDisconnect();
});

document.getElementById('selObsScene')?.addEventListener('change', (e) => {
  if (e.target.value) {
    window.omnichat.obsWsAction({ action: 'scene', sceneName: e.target.value });
  }
});

document.getElementById('btnObsReplay')?.addEventListener('click', async () => {
  const btn = document.getElementById('btnObsReplay');
  const res = await window.omnichat.obsWsAction({ action: 'save-replay' });
  if (btn) {
    btn.textContent = res?.ok ? '✅ Gespeichert!' : '❌ Replay aus?';
    setTimeout(() => { btn.textContent = '💾 Replay'; }, 1500);
  }
});

document.getElementById('btnObsMic')?.addEventListener('click', () => {
  window.omnichat.obsWsAction({ action: 'toggle-mic' });
});

document.getElementById('btnObsRec')?.addEventListener('click', () => {
  window.omnichat.obsWsAction({ action: 'toggle-record' });
});

document.getElementById('btnObsStream')?.addEventListener('click', () => {
  window.omnichat.obsWsAction({ action: 'toggle-stream' });
});

// --- CHAT-TIMER & AUTO-MOD HANDLERS ---
[
  'chkTimerEnabled',
  'numTimerInterval',
  'txtTimerMessages',
  'chkAutoModEnabled',
  'chkAutoModLinks',
  'chkAutoModCaps',
  'chkAutoModSymbols',
  'chkAutoModExemptMods',
  'inputAutoModBlacklist',
  'selAutoModTimeout'
].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', () => {
    window.omnichat.saveProfile(getFormConfig());
  });
});

document.getElementById('btnTimerSendNow')?.addEventListener('click', async () => {
  await window.omnichat.saveProfile(getFormConfig());
  const statusEl = document.getElementById('timerSendStatus');
  const res = await window.omnichat.runChatTimerNow();
  if (statusEl) {
    if (res?.ok) {
      statusEl.style.color = '#4ade80';
      statusEl.textContent = `✅ Gesendet (${res.sentTo?.join(', ') || 'log'})`;
    } else {
      statusEl.style.color = '#f87171';
      statusEl.textContent = `❌ ${res?.error || 'Fehler'}`;
    }
    setTimeout(() => { statusEl.textContent = ''; }, 3000);
  }
});

document.getElementById('btnOpenHelp')?.addEventListener('click', () => {
  window.omnichat.openHelpWindow({});
});

document.addEventListener('click', (e) => {
  const helpBtn = e.target.closest('[data-help-sec]');
  if (!helpBtn) return;
  e.preventDefault();
  e.stopPropagation();
  window.omnichat.openHelpWindow({
    section: helpBtn.dataset.helpSec || '',
    anchor: helpBtn.dataset.helpAnchor || ''
  });
});

['chkCustomCmdsEnabled', 'numCustomCmdCooldown', 'txtCustomCmdRules'].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', () => {
    window.omnichat.saveProfile(getFormConfig());
  });
});

document.getElementById('btnExportChatLog')?.addEventListener('click', async () => {
  const btn = document.getElementById('btnExportChatLog');
  const exportData = messages.map((m) => ({
    timestamp: m.timestamp,
    platform: m.platform,
    author: m.author,
    text: m.text
  }));
  const res = await window.omnichat.exportChatLog(exportData);
  if (res?.ok && btn) {
    btn.textContent = '✅ Gespeichert';
    setTimeout(() => { btn.textContent = '💾 Export'; }, 1600);
  }
});

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
    const searchInput = document.getElementById('inputSearch');
    if (searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  }
});

// --- STREAM-MANAGER (TITEL, SPIEL/KATEGORIE & TAGS) ---
const inputStreamTitle = document.getElementById('inputStreamTitle');
const inputStreamGame = document.getElementById('inputStreamGame');
const dlStreamGames = document.getElementById('dlStreamGames');
const inputStreamTags = document.getElementById('inputStreamTags');
const chkSyncYtTitle = document.getElementById('chkSyncYtTitle');
const streamInfoStatus = document.getElementById('streamInfoStatus');
let streamGameIdMap = new Map();
let gameSearchTimer = null;

async function loadStreamManagerInfo() {
  if (streamInfoStatus) {
    streamInfoStatus.style.color = '#94a3b8';
    streamInfoStatus.textContent = '⏳ Lade Kanal-Info...';
  }
  const res = await window.omnichat.streamManagerLoad();
  if (res?.ok && res.twitch) {
    if (inputStreamTitle) inputStreamTitle.value = res.twitch.title || '';
    if (inputStreamGame) inputStreamGame.value = res.twitch.gameName || '';
    if (res.twitch.gameName && res.twitch.gameId) {
      streamGameIdMap.set(res.twitch.gameName.toLowerCase(), res.twitch.gameId);
    }
    if (inputStreamTags) inputStreamTags.value = (res.twitch.tags || []).join(', ');
    if (streamInfoStatus) {
      streamInfoStatus.style.color = '#4ade80';
      streamInfoStatus.textContent = '✅ Aktuelle Twitch-Daten geladen';
    }
  } else if (streamInfoStatus) {
    streamInfoStatus.style.color = '#f87171';
    streamInfoStatus.textContent = `❌ ${res?.error || 'Laden fehlgeschlagen'}`;
  }
}

document.getElementById('btnLoadStreamInfo')?.addEventListener('click', loadStreamManagerInfo);

inputStreamGame?.addEventListener('input', () => {
  clearTimeout(gameSearchTimer);
  const q = inputStreamGame.value.trim();
  if (q.length < 2) return;
  gameSearchTimer = setTimeout(async () => {
    const res = await window.omnichat.streamManagerSearchGames(q);
    if (res?.ok && dlStreamGames) {
      dlStreamGames.innerHTML = '';
      (res.categories || []).forEach((c) => {
        streamGameIdMap.set(c.name.toLowerCase(), c.id);
        const opt = document.createElement('option');
        opt.value = c.name;
        dlStreamGames.appendChild(opt);
      });
    }
  }, 280);
});

document.getElementById('btnSaveStreamInfo')?.addEventListener('click', async () => {
  const btn = document.getElementById('btnSaveStreamInfo');
  const title = inputStreamTitle?.value.trim() || '';
  const gameName = inputStreamGame?.value.trim() || '';
  const gameId = streamGameIdMap.get(gameName.toLowerCase()) || '';
  const tags = inputStreamTags?.value || '';
  const syncYoutube = Boolean(chkSyncYtTitle?.checked);

  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ Speichere...';
  }
  const res = await window.omnichat.streamManagerSave({ title, gameId, gameName, tags, syncYoutube });
  if (btn) {
    btn.disabled = false;
    btn.textContent = '💾 Übernehmen';
  }
  if (streamInfoStatus) {
    if (res?.ok) {
      streamInfoStatus.style.color = '#4ade80';
      const warn = res.warnings?.length ? ` (${res.warnings.join('; ')})` : '';
      streamInfoStatus.textContent = `✅ Aktualisiert: ${(res.updated || []).join(', ')}${warn}`;
    } else {
      streamInfoStatus.style.color = '#f87171';
      streamInfoStatus.textContent = `❌ ${res?.error || 'Update fehlgeschlagen'}`;
    }
  }
});

// --- CLIP- & REPLAY-STUDIO (9:16 SHORTS PIPELINE) ---
(function initClipStudio() {
  const modal = document.getElementById('clipStudioModal');
  if (!modal) return;

  const listEl = document.getElementById('clipStudioList');
  const dirLabel = document.getElementById('clipStudioDirLabel');
  const videoEl = document.getElementById('clipStudioVideo');
  const btnExport = document.getElementById('btnClipExportShort');
  const btnTrimOrig = document.getElementById('btnClipTrimOriginal');
  const btnMarkStart = document.getElementById('btnMarkStart');
  const btnMarkEnd = document.getElementById('btnMarkEnd');
  const btnPlayRange = document.getElementById('btnClipPlayRange');
  const numClipStart = document.getElementById('numClipStart');
  const numClipEnd = document.getElementById('numClipEnd');
  const rngClipStart = document.getElementById('rngClipStart');
  const rngClipEnd = document.getElementById('rngClipEnd');
  const clipTimelineSel = document.getElementById('clipTimelineSel');
  const clipTimelinePlayhead = document.getElementById('clipTimelinePlayhead');
  const clipRangeDur = document.getElementById('clipRangeDuration');
  const btnReveal = document.getElementById('btnClipRevealOut');
  const inputTitle = document.getElementById('inputClipTitle');
  const btnRename = document.getElementById('btnClipRename');
  const btnDelete = document.getElementById('btnClipDelete');
  const btnThumbnail = document.getElementById('btnClipThumbnail');
  const waveformCanvas = document.getElementById('clipWaveformCanvas');
  const videoWrap = document.getElementById('clipVideoWrap');
  const facecamBoxEl = document.getElementById('clipFacecamBox');
  const facecamResizeEl = document.getElementById('clipFacecamResize');
  const selLayout = document.getElementById('selClipLayout');
  const selPreset = document.getElementById('selClipPreset');
  const selSpeed = document.getElementById('selClipSpeed');
  const inpHook = document.getElementById('inpClipHook');
  const inpWatermark = document.getElementById('inpClipWatermark');
  const chkNormAudio = document.getElementById('chkClipNormAudio');
  const chkMuteAudio = document.getElementById('chkClipMuteAudio');
  const numGainDb = document.getElementById('numClipGainDb');
  const numFadeSec = document.getElementById('numClipFadeSec');
  const btnPickMusic = document.getElementById('btnClipPickMusic');
  const lblMusicName = document.getElementById('lblClipMusicName');
  const rngMusicVol = document.getElementById('rngClipMusicVol');
  const btnClearMusic = document.getElementById('btnClipClearMusic');
  const btnPickSub = document.getElementById('btnClipPickSub');
  const lblSubName = document.getElementById('lblClipSubName');
  const btnClearSub = document.getElementById('btnClipClearSub');
  const statusEl = document.getElementById('clipStudioStatus');
  let selectedPath = '';
  let lastOutPath = '';
  let rangePlayStopAt = null;
  let videoDurationSec = 30;
  let selectedMusicPath = '';
  let selectedSubPath = '';
  let facecamBox = { x: 0.72, y: 0.64, w: 0.25, h: 0.30 };
  let waveformPeaks = [];

  function drawWaveform(peaks = []) {
    waveformPeaks = peaks;
    if (!waveformCanvas) return;
    const rect = waveformCanvas.getBoundingClientRect();
    const w = Math.max(160, Math.round(rect.width || 480));
    const h = Math.max(24, Math.round(rect.height || 30));
    if (waveformCanvas.width !== w) waveformCanvas.width = w;
    if (waveformCanvas.height !== h) waveformCanvas.height = h;
    const ctx = waveformCanvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    if (!peaks.length) return;
    const barW = w / peaks.length;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
    for (let i = 0; i < peaks.length; i++) {
      const p = Math.max(0.06, Math.min(1, Number(peaks[i]) || 0));
      const bh = Math.max(2, p * (h - 4));
      const y = (h - bh) / 2;
      ctx.fillRect(i * barW + 0.5, y, Math.max(1, barW - 1.2), bh);
    }
  }

  function getRenderedVideoRect() {
    if (!videoEl || !videoWrap) return null;
    const wrapRect = videoWrap.getBoundingClientRect();
    const vRect = videoEl.getBoundingClientRect();
    const vw = videoEl.videoWidth || 16;
    const vh = videoEl.videoHeight || 9;
    const elemW = vRect.width || wrapRect.width;
    const elemH = vRect.height || wrapRect.height;
    if (!elemW || !elemH) return null;
    const scale = Math.min(elemW / vw, elemH / vh);
    const drawW = vw * scale;
    const drawH = vh * scale;
    const left = (vRect.left - wrapRect.left) + (elemW - drawW) / 2;
    const top = (vRect.top - wrapRect.top) + (elemH - drawH) / 2;
    return { left, top, width: drawW, height: drawH };
  }

  function renderFacecamBox() {
    if (!facecamBoxEl) return;
    const show = Boolean(selectedPath) && selLayout?.value === 'split_cam';
    facecamBoxEl.classList.toggle('hidden', !show);
    if (!show) return;
    const r = getRenderedVideoRect();
    if (!r) return;
    facecamBoxEl.style.left = `${r.left + facecamBox.x * r.width}px`;
    facecamBoxEl.style.top = `${r.top + facecamBox.y * r.height}px`;
    facecamBoxEl.style.width = `${facecamBox.w * r.width}px`;
    facecamBoxEl.style.height = `${facecamBox.h * r.height}px`;
  }

  if (facecamBoxEl) {
    let dragMode = null;
    let startClientX = 0;
    let startClientY = 0;
    let startBox = null;
    let startRect = null;

    facecamBoxEl.addEventListener('mousedown', (e) => {
      if (!selectedPath) return;
      e.preventDefault();
      e.stopPropagation();
      dragMode = e.target === facecamResizeEl ? 'resize' : 'move';
      startClientX = e.clientX;
      startClientY = e.clientY;
      startBox = { ...facecamBox };
      startRect = getRenderedVideoRect();
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragMode || !startRect || !startBox) return;
      const dx = (e.clientX - startClientX) / Math.max(1, startRect.width);
      const dy = (e.clientY - startClientY) / Math.max(1, startRect.height);
      if (dragMode === 'move') {
        facecamBox.x = Math.max(0, Math.min(1 - startBox.w, startBox.x + dx));
        facecamBox.y = Math.max(0, Math.min(1 - startBox.h, startBox.y + dy));
      } else {
        facecamBox.w = Math.max(0.08, Math.min(1 - startBox.x, startBox.w + dx));
        facecamBox.h = Math.max(0.08, Math.min(1 - startBox.y, startBox.h + dy));
      }
      renderFacecamBox();
    });

    window.addEventListener('mouseup', () => { dragMode = null; });
  }

  selLayout?.addEventListener('change', renderFacecamBox);
  window.addEventListener('resize', () => {
    if (!modal.classList.contains('hidden')) {
      renderFacecamBox();
      if (waveformPeaks.length) drawWaveform(waveformPeaks);
    }
  });

  function renderClipTextOverlayPng(isVertical, hookText, watermarkText) {
    const hTxt = String(hookText || '').trim().slice(0, 80);
    const wTxt = String(watermarkText || '').trim().slice(0, 48);
    if (!hTxt && !wTxt) return '';
    const W = isVertical ? 1080 : 1920;
    const H = isVertical ? 1920 : 1080;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');
    if (!ctx) return '';
    ctx.clearRect(0, 0, W, H);
    if (hTxt) {
      const fSize = isVertical ? 54 : 48;
      ctx.font = `900 ${fSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const tw = Math.min(W - 80, ctx.measureText(hTxt).width);
      const padX = 28;
      const boxW = tw + padX * 2;
      const boxH = fSize + 34;
      const bx = (W - boxW) / 2;
      const by = isVertical ? 110 : 42;
      ctx.fillStyle = 'rgba(2, 6, 23, 0.72)';
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 16);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(145, 70, 255, 0.9)';
      ctx.stroke();
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.strokeText(hTxt, W / 2, by + boxH / 2 + 2, W - 110);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(hTxt, W / 2, by + boxH / 2 + 2, W - 110);
    }
    if (wTxt) {
      const wSize = isVertical ? 32 : 28;
      ctx.font = `800 ${wSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.78)';
      ctx.strokeText(wTxt, W - 28, H - 26);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.86)';
      ctx.fillText(wTxt, W - 28, H - 26);
    }
    return c.toDataURL('image/png');
  }

  window.getClipStudioProOptions = (isVertical = true) => {
    const hookText = (inpHook?.value || '').trim();
    const watermarkText = (inpWatermark?.value || '').trim();
    return {
      layoutMode: selLayout?.value || 'blur_bg',
      facecamBox: selLayout?.value === 'split_cam' ? { ...facecamBox } : null,
      speed: parseFloat(selSpeed?.value || '1') || 1,
      hookText,
      watermarkText,
      overlayPngDataUrl: renderClipTextOverlayPng(isVertical, hookText, watermarkText),
      subtitlePath: selectedSubPath || '',
      muteAudio: Boolean(chkMuteAudio?.checked),
      normalizeAudio: Boolean(chkNormAudio?.checked),
      audioGainDb: parseFloat(numGainDb?.value || '0') || 0,
      fadeAudioSec: parseFloat(numFadeSec?.value || '0') || 0,
      musicPath: selectedMusicPath || '',
      musicVolume: parseFloat(rngMusicVol?.value || '0.25') || 0.25,
      preset: selPreset?.value || 'standard'
    };
  };

  btnPickMusic?.addEventListener('click', async () => {
    const res = await window.omnichat.clipStudioPickAsset?.('music');
    if (!res?.ok) return;
    selectedMusicPath = res.filePath;
    if (lblMusicName) { lblMusicName.textContent = res.fileName; lblMusicName.title = res.filePath; }
    btnClearMusic?.classList.remove('hidden');
  });
  btnClearMusic?.addEventListener('click', () => {
    selectedMusicPath = '';
    if (lblMusicName) { lblMusicName.textContent = 'Keine Musik'; lblMusicName.title = ''; }
    btnClearMusic?.classList.add('hidden');
  });

  btnPickSub?.addEventListener('click', async () => {
    const res = await window.omnichat.clipStudioPickAsset?.('subtitle');
    if (!res?.ok) return;
    selectedSubPath = res.filePath;
    if (lblSubName) { lblSubName.textContent = res.fileName; lblSubName.title = res.filePath; }
    btnClearSub?.classList.remove('hidden');
  });
  btnClearSub?.addEventListener('click', () => {
    selectedSubPath = '';
    if (lblSubName) { lblSubName.textContent = 'Keine Untertitel'; lblSubName.title = ''; }
    btnClearSub?.classList.add('hidden');
  });

  btnThumbnail?.addEventListener('click', async () => {
    if (!selectedPath || !videoEl) return;
    btnThumbnail.disabled = true;
    const origTxt = btnThumbnail.textContent;
    btnThumbnail.textContent = '⏳';
    const res = await window.omnichat.clipStudioThumbnail?.({
      inputPath: selectedPath,
      timeSec: Number(videoEl.currentTime || 0)
    });
    btnThumbnail.disabled = false;
    btnThumbnail.textContent = origTxt;
    if (res?.ok) {
      lastOutPath = res.outPath;
      if (btnReveal) btnReveal.classList.remove('hidden');
      if (statusEl) {
        statusEl.style.color = '#4ade80';
        statusEl.textContent = `🖼️ Thumbnail gespeichert: ${res.fileName}`;
      }
    } else if (statusEl) {
      statusEl.style.color = '#f87171';
      statusEl.textContent = `❌ ${res?.error || 'Thumbnail fehlgeschlagen.'}`;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden') || !selectedPath || !videoEl) return;
    const tag = (document.activeElement?.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || document.activeElement?.isContentEditable) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (videoEl.paused) videoEl.play().catch(() => {});
      else videoEl.pause();
    } else if (e.key === 'i' || e.key === 'I') {
      e.preventDefault();
      btnMarkStart?.click();
    } else if (e.key === 'o' || e.key === 'O') {
      e.preventDefault();
      btnMarkEnd?.click();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const step = e.shiftKey ? 1 : (1 / 30);
      videoEl.currentTime = Math.max(0, (videoEl.currentTime || 0) - step);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const step = e.shiftKey ? 1 : (1 / 30);
      const dur = Number.isFinite(videoEl.duration) ? videoEl.duration : 9999;
      videoEl.currentTime = Math.min(dur, (videoEl.currentTime || 0) + step);
    }
  });

  function updateRangeDurationLabel() {
    const s = Math.max(0, parseFloat(numClipStart?.value || '0') || 0);
    const e = Math.max(s + 0.5, parseFloat(numClipEnd?.value || '30') || 30);
    if (clipRangeDur) clipRangeDur.textContent = `Dauer: ${(e - s).toFixed(1)}s`;
    if (rngClipStart) rngClipStart.value = String(s);
    if (rngClipEnd) rngClipEnd.value = String(e);
    if (clipTimelineSel) {
      const total = Math.max(0.5, videoDurationSec || e);
      const leftPct = Math.max(0, Math.min(100, (s / total) * 100));
      const rightPct = Math.max(leftPct, Math.min(100, (e / total) * 100));
      clipTimelineSel.style.left = `${leftPct}%`;
      clipTimelineSel.style.width = `${Math.max(0.5, rightPct - leftPct)}%`;
    }
  }

  function setSelectedClip(filePath, fileName) {
    selectedPath = filePath || '';
    const hasSel = Boolean(selectedPath);
    rangePlayStopAt = null;
    if (videoEl) {
      if (hasSel) videoEl.src = encodeURI(`file://${selectedPath}`);
      else {
        videoEl.pause();
        videoEl.removeAttribute('src');
        videoEl.load();
      }
    }
    if (inputTitle) {
      inputTitle.disabled = !hasSel;
      inputTitle.value = hasSel ? String(fileName || '').replace(/\.[^.]+$/, '') : '';
    }
    [btnExport, btnTrimOrig, btnMarkStart, btnMarkEnd, btnPlayRange, btnRename, btnDelete, btnThumbnail, rngClipStart, rngClipEnd].forEach((b) => {
      if (b) b.disabled = !hasSel;
    });
    renderFacecamBox();
    drawWaveform([]);
    if (hasSel && window.omnichat.clipStudioWaveform) {
      const targetPath = selectedPath;
      window.omnichat.clipStudioWaveform(targetPath, 140).then((wRes) => {
        if (targetPath === selectedPath && wRes?.ok && Array.isArray(wRes.peaks)) {
          drawWaveform(wRes.peaks);
        }
      }).catch(() => {});
    }
  }

  function renderReplays(res) {
    if (!res) return;
    if (dirLabel) {
      const ff = res.hasFfmpeg ? 'ffmpeg bereit' : '⚠️ ffmpeg fehlt';
      dirLabel.textContent = `Ordner: ${res.dir || '—'} (${ff})`;
    }
    if (!listEl) return;
    listEl.innerHTML = '';
    const files = res.files || [];
    if (files.length === 0) {
      listEl.innerHTML = '<span style="color:#94a3b8;">Keine Videos (.mp4/.mkv/.mov) gefunden. Wähle oben deinen OBS-Aufnahmeordner.</span>';
      return;
    }
    files.forEach((f) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '4px';
      row.style.alignItems = 'center';

      const btn = document.createElement('button');
      btn.className = 'btn-sm';
      btn.style.textAlign = 'left';
      btn.style.flex = '1';
      btn.style.minWidth = '0';
      btn.style.overflow = 'hidden';
      btn.style.textOverflow = 'ellipsis';
      btn.style.whiteSpace = 'nowrap';
      btn.style.padding = '6px 7px';
      const prefix = f.badge ? `[${f.badge}] ` : '';
      btn.textContent = `🎬 ${prefix}${f.name} (${f.sizeMb} MB)`;
      btn.title = f.name;
      if (f.path === selectedPath) btn.style.borderColor = '#9146ff';
      btn.onclick = () => {
        setSelectedClip(f.path, f.name);
        if (statusEl) {
          statusEl.style.color = '#94a3b8';
          statusEl.textContent = `Ausgewählt: ${f.name}`;
        }
        renderReplays(res);
      };

      const btnYt = document.createElement('button');
      btnYt.className = 'btn-sm';
      btnYt.style.padding = '6px 6px';
      btnYt.style.fontSize = '11px';
      btnYt.title = 'Direkt auf YouTube hochladen (Privat-Entwurf, benötigt YouTube OAuth2)';
      btnYt.textContent = '▶️ YT';
      btnYt.onclick = async (e) => {
        e.stopPropagation();
        btnYt.disabled = true;
        btnYt.textContent = '⏳';
        if (statusEl) {
          statusEl.style.color = '#38bdf8';
          statusEl.textContent = `⏳ Lade "${f.name}" auf YouTube hoch...`;
        }
        const title = f.name.replace(/\.[^.]+$/, '');
        const upRes = await window.omnichat.clipStudioUploadYoutube({
          filePath: f.path,
          title,
          privacyStatus: 'private'
        });
        btnYt.disabled = false;
        btnYt.textContent = '▶️ YT';
        if (upRes?.ok) {
          try { navigator.clipboard.writeText(upRes.url); } catch (err) {}
          if (statusEl) {
            statusEl.style.color = '#4ade80';
            statusEl.textContent = `✅ YouTube Upload fertig (Privat): ${upRes.url} (kopiert)`;
          }
        } else if (statusEl) {
          statusEl.style.color = '#f87171';
          statusEl.textContent = `❌ ${upRes?.error || 'YouTube Upload fehlgeschlagen.'}`;
        }
      };

      const btnTt = document.createElement('button');
      btnTt.className = 'btn-sm';
      btnTt.style.padding = '6px 6px';
      btnTt.style.fontSize = '11px';
      btnTt.title = 'TikTok Upload-Seite öffnen & Datei im Ordner markieren';
      btnTt.textContent = '🎵 TT';
      btnTt.onclick = async (e) => {
        e.stopPropagation();
        await window.omnichat.clipStudioUploadTiktok(f.path);
        if (statusEl) {
          statusEl.style.color = '#38bdf8';
          statusEl.textContent = `🎵 TikTok Upload geöffnet — ziehe "${f.name}" einfach ins Browserfenster.`;
        }
      };

      row.appendChild(btn);
      row.appendChild(btnYt);
      row.appendChild(btnTt);
      listEl.appendChild(row);
    });
  }

  async function refreshList() {
    const res = await window.omnichat.clipStudioList();
    renderReplays(res);
  }

  document.getElementById('btnOpenClipStudio')?.addEventListener('click', () => {
    modal.classList.remove('hidden');
    refreshList();
  });
  document.getElementById('btnCloseClipStudio')?.addEventListener('click', () => {
    modal.classList.add('hidden');
    if (videoEl) videoEl.pause();
  });

  document.getElementById('btnClipRefresh')?.addEventListener('click', refreshList);
  document.getElementById('btnClipPickFile')?.addEventListener('click', async () => {
    const picked = await window.omnichat.pickLocalFile?.({ kind: 'video' });
    if (!picked?.ok) return;
    setSelectedClip(picked.filePath, picked.fileName);
    if (statusEl) {
      statusEl.style.color = '#4ade80';
      statusEl.textContent = `🎬 Datei geöffnet: ${picked.fileName}`;
    }
  });
  document.getElementById('btnClipPickDir')?.addEventListener('click', async () => {
    const res = await window.omnichat.clipStudioPickDir();
    if (!res?.canceled) {
      setSelectedClip('', '');
      renderReplays(res);
    }
  });

  btnRename?.addEventListener('click', async () => {
    if (!selectedPath || !inputTitle) return;
    const newTitle = inputTitle.value.trim();
    if (!newTitle) return;
    if (videoEl) {
      videoEl.pause();
      videoEl.removeAttribute('src');
      videoEl.load();
    }
    const res = await window.omnichat.clipStudioRename(selectedPath, newTitle);
    if (res?.ok) {
      setSelectedClip(res.newPath, res.name);
      if (statusEl) {
        statusEl.style.color = '#4ade80';
        statusEl.textContent = `✅ Umbenannt zu: ${res.name}`;
      }
      refreshList();
    } else if (statusEl) {
      statusEl.style.color = '#f87171';
      statusEl.textContent = `❌ ${res?.error || 'Umbenennen fehlgeschlagen.'}`;
    }
  });

  btnDelete?.addEventListener('click', async () => {
    if (!selectedPath) return;
    const ok = confirm('Diesen Clip wirklich in den Papierkorb verschieben?');
    if (!ok) return;
    const pathToTrash = selectedPath;
    setSelectedClip('', '');
    const res = await window.omnichat.clipStudioDelete(pathToTrash);
    if (res?.ok) {
      if (statusEl) {
        statusEl.style.color = '#4ade80';
        statusEl.textContent = '🗑️ Clip in den Papierkorb verschoben.';
      }
      refreshList();
    } else if (statusEl) {
      statusEl.style.color = '#f87171';
      statusEl.textContent = `❌ ${res?.error || 'Löschen fehlgeschlagen.'}`;
    }
  });

  videoEl?.addEventListener('loadedmetadata', () => {
    const dur = Number.isFinite(videoEl.duration) && videoEl.duration > 0 ? videoEl.duration : 30;
    videoDurationSec = dur;
    if (rngClipStart) { rngClipStart.max = dur.toFixed(1); rngClipStart.value = '0'; }
    if (rngClipEnd) { rngClipEnd.max = dur.toFixed(1); rngClipEnd.value = dur.toFixed(1); }
    if (numClipStart) numClipStart.value = '0';
    if (numClipEnd) numClipEnd.value = dur.toFixed(1);
    updateRangeDurationLabel();
    renderFacecamBox();
  });

  videoEl?.addEventListener('timeupdate', () => {
    if (clipTimelinePlayhead && videoDurationSec > 0) {
      clipTimelinePlayhead.style.left = `${Math.min(100, (videoEl.currentTime / videoDurationSec) * 100)}%`;
    }
    if (rangePlayStopAt !== null && videoEl.currentTime >= rangePlayStopAt) {
      videoEl.pause();
      rangePlayStopAt = null;
    }
  });

  [numClipStart, numClipEnd].forEach((el) => {
    el?.addEventListener('input', updateRangeDurationLabel);
  });

  rngClipStart?.addEventListener('input', () => {
    const eVal = parseFloat(numClipEnd?.value || String(videoDurationSec)) || videoDurationSec;
    const sVal = Math.min(parseFloat(rngClipStart.value) || 0, Math.max(0, eVal - 0.5));
    if (numClipStart) numClipStart.value = sVal.toFixed(1);
    if (videoEl) videoEl.currentTime = sVal;
    updateRangeDurationLabel();
  });

  rngClipEnd?.addEventListener('input', () => {
    const sVal = parseFloat(numClipStart?.value || '0') || 0;
    const eVal = Math.max(parseFloat(rngClipEnd.value) || 0.5, sVal + 0.5);
    if (numClipEnd) numClipEnd.value = eVal.toFixed(1);
    if (videoEl) videoEl.currentTime = eVal;
    updateRangeDurationLabel();
  });

  btnMarkStart?.addEventListener('click', () => {
    if (!videoEl || !numClipStart) return;
    numClipStart.value = videoEl.currentTime.toFixed(1);
    if (numClipEnd && parseFloat(numClipEnd.value) <= parseFloat(numClipStart.value)) {
      const fallbackEnd = Number.isFinite(videoEl.duration) ? videoEl.duration : parseFloat(numClipStart.value) + 10;
      numClipEnd.value = fallbackEnd.toFixed(1);
    }
    updateRangeDurationLabel();
  });

  btnMarkEnd?.addEventListener('click', () => {
    if (!videoEl || !numClipEnd) return;
    const t = Math.max(0.5, videoEl.currentTime);
    numClipEnd.value = t.toFixed(1);
    if (numClipStart && parseFloat(numClipStart.value) >= t) {
      numClipStart.value = Math.max(0, t - 5).toFixed(1);
    }
    updateRangeDurationLabel();
  });

  btnPlayRange?.addEventListener('click', () => {
    if (!videoEl || !selectedPath) return;
    const s = Math.max(0, parseFloat(numClipStart?.value || '0') || 0);
    const e = Math.max(s + 0.5, parseFloat(numClipEnd?.value || '30') || 30);
    rangePlayStopAt = e;
    videoEl.currentTime = s;
    videoEl.play().catch(() => {});
  });

  async function runClipExport(mode) {
    if (!selectedPath) return;
    const isShort = mode === 'short';
    const activeBtn = isShort ? btnExport : btnTrimOrig;
    const defaultLabel = isShort ? '📱 9:16 Short exportieren' : '✂️ 16:9 exportieren';
    if (btnExport) btnExport.disabled = true;
    if (btnTrimOrig) btnTrimOrig.disabled = true;
    if (activeBtn) activeBtn.textContent = isShort ? '⏳ Rendere 9:16...' : '⏳ Schneide 16:9...';
    if (btnReveal) btnReveal.classList.add('hidden');
    if (statusEl) {
      statusEl.style.color = '#38bdf8';
      statusEl.textContent = isShort
        ? '⏳ ffmpeg rendert 1080×1920 Short... (bitte kurz warten)'
        : '⏳ ffmpeg schneidet 16:9 Clip... (bitte kurz warten)';
    }

    const startSec = Math.max(0, parseFloat(numClipStart?.value || '0') || 0);
    const endSec = Math.max(startSec + 0.5, parseFloat(numClipEnd?.value || '30') || 30);
    const proOpts = typeof window.getClipStudioProOptions === 'function'
      ? window.getClipStudioProOptions(isShort)
      : { layoutMode: document.getElementById('selClipLayout')?.value || 'blur_bg' };

    const res = isShort
      ? await window.omnichat.clipStudioExportShort({ inputPath: selectedPath, startSec, endSec, ...proOpts })
      : await window.omnichat.clipStudioTrimOriginal({ inputPath: selectedPath, startSec, endSec, ...proOpts });

    if (btnExport) btnExport.disabled = false;
    if (btnTrimOrig) btnTrimOrig.disabled = false;
    if (activeBtn) activeBtn.textContent = defaultLabel;
    if (res?.ok) {
      lastOutPath = res.outPath;
      if (btnReveal) btnReveal.classList.remove('hidden');
      if (statusEl) {
        statusEl.style.color = '#4ade80';
        statusEl.textContent = `✅ Fertig: ${res.outPath}`;
      }
      refreshList();
    } else if (statusEl) {
      statusEl.style.color = '#f87171';
      statusEl.textContent = `❌ ${res?.error || 'Export fehlgeschlagen.'}`;
    }
  }

  btnExport?.addEventListener('click', () => runClipExport('short'));
  btnTrimOrig?.addEventListener('click', () => runClipExport('trim'));

  btnReveal?.addEventListener('click', () => {
    if (lastOutPath) window.omnichat.clipStudioReveal(lastOutPath);
  });
})();

// ======================================================
// DISCORD, GO-LIVE & SENDEPLAN STUDIO
// ======================================================
(function initSocialScheduleStudio() {
  const modal = document.getElementById('socialScheduleModal');
  if (!modal) return;

  const btnOpenTop = document.getElementById('btnOpenSocialSchedule');
  const btnOpenSide = document.getElementById('btnSidebarSocialSchedule');
  const btnClose = document.getElementById('btnCloseSocialSchedule');
  const statusEl = document.getElementById('socialScheduleStatus');

  const tabBtns = modal.querySelectorAll('[data-ss-tab]');
  const panes = {
    golive: document.getElementById('ssPane_golive'),
    schedule: document.getElementById('ssPane_schedule'),
    connections: document.getElementById('ssPane_connections')
  };

  let ssState = null;
  let ssLinks = {};

  function setStatus(msg, color = '#94a3b8') {
    if (!statusEl) return;
    statusEl.style.color = color;
    statusEl.textContent = msg;
  }

  function switchTab(tab) {
    tabBtns.forEach((b) => b.classList.toggle('active', b.dataset.ssTab === tab));
    Object.entries(panes).forEach(([k, el]) => {
      if (el) el.classList.toggle('hidden', k !== tab);
    });
  }

  tabBtns.forEach((b) => b.addEventListener('click', () => switchTab(b.dataset.ssTab)));

  let pickedIgDefaultImgPath = '';
  const btnPickIgDefaultImg = document.getElementById('btnPickIgDefaultImg');
  const lblIgDefaultImg = document.getElementById('lblIgDefaultImg');
  const btnClearIgDefaultImg = document.getElementById('btnClearIgDefaultImg');

  function renderIgDefaultImgBadge(filePath, fallbackUrl = '') {
    const name = extractDisplayFileName(filePath, fallbackUrl);
    if (lblIgDefaultImg) {
      lblIgDefaultImg.textContent = name
        ? `🖼️ ${name}`
        : window.__appLang === 'en'
          ? 'No default image selected'
          : 'Kein Standard-Bild gewählt';
      lblIgDefaultImg.classList.toggle('has-file', Boolean(name));
      lblIgDefaultImg.title = filePath || fallbackUrl || '';
    }
    btnClearIgDefaultImg?.classList.toggle('hidden', !name);
  }

  btnPickIgDefaultImg?.addEventListener('click', async () => {
    const pick = await window.omnichat.pickLocalFile?.({ kind: 'image' });
    if (!pick?.ok) return;
    pickedIgDefaultImgPath = pick.filePath;
    renderIgDefaultImgBadge(pickedIgDefaultImgPath, '');
  });

  btnClearIgDefaultImg?.addEventListener('click', () => {
    pickedIgDefaultImgPath = '';
    if (ssState?.instagram) ssState.instagram.defaultImageUrl = '';
    renderIgDefaultImgBadge('', '');
  });

  function renderScheduleList() {
    const listEl = document.getElementById('ssScheduleList');
    if (!listEl || !ssState) return;
    const items = Array.isArray(ssState.schedule) ? ssState.schedule : [];
    if (!items.length) {
      listEl.innerHTML = '<div style="font-size:12px; color:#94a3b8; padding:8px;">Noch keine Termine eingetragen.</div>';
      return;
    }
    const sorted = [...items].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    listEl.innerHTML = '';
    sorted.forEach((item) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; justify-content:space-between; align-items:center; gap:8px; padding:7px 10px; border-radius:8px; background:rgba(30,41,59,0.75); border:1px solid rgba(148,163,184,0.16); font-size:12px;';
      const plats = (item.platforms || []).map((p) => p.toUpperCase()).join('/');
      row.innerHTML = `
        <div style="min-width:0;">
          <div style="font-weight:700; color:#f1f5f9;">${escapeHtml(item.title)} ${item.recurringWeekly ? '🔁' : ''}</div>
          <div style="font-size:11px; color:#94a3b8;">📅 ${escapeHtml(item.date)} • 🕒 ${escapeHtml(item.time)} (${item.durationMin || 120} Min.) • ${escapeHtml(item.game || '—')} • [${escapeHtml(plats)}]</div>
        </div>
        <button class="btn-sm warn" data-del-id="${escapeHtml(item.id)}" title="Termin löschen" style="padding:3px 8px;">🗑️</button>
      `;
      row.querySelector('[data-del-id]')?.addEventListener('click', async () => {
        ssState.schedule = ssState.schedule.filter((x) => x.id !== item.id);
        const saved = await window.omnichat.socialScheduleSave(ssState);
        if (saved?.ok) {
          ssState = saved.socialSchedule;
          renderScheduleList();
          setStatus('🗑️ Termin entfernt.', '#94a3b8');
        }
      });
      listEl.appendChild(row);
    });
  }

  function fillFormFromState() {
    if (!ssState) return;
    const d = ssState.discord || {};
    const b = ssState.bluesky || {};
    const m = ssState.mastodon || {};
    const x = ssState.x || {};
    const ig = ssState.instagram || {};
    const l = ssState.links || {};

    document.getElementById('ssGoLiveMessage').value = d.goLiveMessage || '🔴 **{channel} ist jetzt LIVE!** Komm vorbei!';
    document.getElementById('chkGoLiveDiscord').checked = Boolean(d.enabled && d.webhookUrl);
    document.getElementById('chkGoLiveBluesky').checked = Boolean(b.enabled && b.handle);
    document.getElementById('chkGoLiveMastodon').checked = Boolean(m.enabled && m.accessToken);
    const chkX = document.getElementById('chkGoLiveX');
    const chkIg = document.getElementById('chkGoLiveInstagram');
    if (chkX) chkX.checked = Boolean(x.enabled && x.apiKey && x.accessToken);
    if (chkIg) chkIg.checked = Boolean(ig.enabled && ig.igUserId && ig.accessToken);

    document.getElementById('ssDiscordEnabled').checked = Boolean(d.enabled);
    document.getElementById('ssDiscordWebhook').value = d.webhookUrl || '';
    document.getElementById('ssDiscordScheduleWebhook').value = d.scheduleWebhookUrl || '';
    document.getElementById('ssDiscordRole').value = d.mentionRole || '';
    document.getElementById('ssDiscordColor').value = d.embedColor || '#9146ff';
    document.getElementById('ssDiscordAutoObs').checked = Boolean(d.autoPostOnObsLive);
    const setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
    setChk('ssDiscordAutoTwitch', Boolean(d.autoPostOnTwitchLive));
    setChk('ssDiscordLiveUpdate', d.liveUpdate !== false);
    setChk('ssDiscordEditOnEnd', d.editOnEnd !== false);
    setChk('ssDiscordPreview', d.showPreview !== false);
    window.omnichat.discordLiveGet?.().then((r) => renderDiscordLiveStatus(r?.state)).catch(() => {});

    document.getElementById('ssBskyEnabled').checked = Boolean(b.enabled);
    document.getElementById('ssBskyHandle').value = b.handle || '';
    document.getElementById('ssBskyAppPass').value = b.appPassword || '';
    document.getElementById('ssBskyAutoLive').checked = Boolean(b.autoPostOnLive);

    document.getElementById('ssMastoEnabled').checked = Boolean(m.enabled);
    document.getElementById('ssMastoInstance').value = m.instanceUrl || 'https://mastodon.social';
    document.getElementById('ssMastoToken').value = m.accessToken || '';
    document.getElementById('ssMastoAutoLive').checked = Boolean(m.autoPostOnLive);

    document.getElementById('ssXEnabled').checked = Boolean(x.enabled);
    document.getElementById('ssXApiKey').value = x.apiKey || '';
    document.getElementById('ssXApiSecret').value = x.apiSecret || '';
    document.getElementById('ssXAccessToken').value = x.accessToken || '';
    document.getElementById('ssXAccessSecret').value = x.accessTokenSecret || '';
    document.getElementById('ssXAutoLive').checked = Boolean(x.autoPostOnLive);

    document.getElementById('ssIgEnabled').checked = Boolean(ig.enabled);
    document.getElementById('ssIgUserId').value = ig.igUserId || '';
    document.getElementById('ssIgAccessToken').value = ig.accessToken || '';
    pickedIgDefaultImgPath = ig.defaultImagePath || '';
    renderIgDefaultImgBadge(pickedIgDefaultImgPath, ig.defaultImageUrl || '');
    document.getElementById('ssIgImgbbKey').value = ig.imgbbApiKey || '';
    document.getElementById('ssIgAutoLive').checked = Boolean(ig.autoPostOnLive);

    document.getElementById('ssLinkTwitch').value = l.twitchUrl || '';
    document.getElementById('ssLinkYoutube').value = l.youtubeUrl || '';
    document.getElementById('ssLinkTiktok').value = l.tiktokUrl || '';
    document.getElementById('ssLinkKick').value = l.kickUrl || '';

    const titleInput = document.getElementById('ssGoLiveTitle');
    const gameInput = document.getElementById('ssGoLiveGame');
    if (titleInput && !titleInput.value) {
      titleInput.value = document.getElementById('inputStreamTitle')?.value || '';
    }
    if (gameInput && !gameInput.value) {
      gameInput.value = document.getElementById('inputStreamGame')?.value || '';
    }
    const dateInput = document.getElementById('ssAddDate');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().slice(0, 10);
    }
    renderScheduleList();
  }

  function readConnectionsIntoState() {
    if (!ssState) return;
    ssState.discord = {
      ...(ssState.discord || {}),
      enabled: document.getElementById('ssDiscordEnabled').checked,
      webhookUrl: document.getElementById('ssDiscordWebhook').value.trim(),
      scheduleWebhookUrl: document.getElementById('ssDiscordScheduleWebhook').value.trim(),
      mentionRole: document.getElementById('ssDiscordRole').value.trim(),
      embedColor: document.getElementById('ssDiscordColor').value || '#9146ff',
      autoPostOnObsLive: document.getElementById('ssDiscordAutoObs').checked,
      autoPostOnTwitchLive: Boolean(document.getElementById('ssDiscordAutoTwitch')?.checked),
      liveUpdate: document.getElementById('ssDiscordLiveUpdate')?.checked !== false,
      editOnEnd: document.getElementById('ssDiscordEditOnEnd')?.checked !== false,
      showPreview: document.getElementById('ssDiscordPreview')?.checked !== false,
      goLiveMessage: document.getElementById('ssGoLiveMessage').value.trim() || '🔴 **{channel} ist jetzt LIVE!** Komm vorbei!'
    };
    ssState.bluesky = {
      enabled: document.getElementById('ssBskyEnabled').checked,
      handle: document.getElementById('ssBskyHandle').value.trim(),
      appPassword: document.getElementById('ssBskyAppPass').value.trim(),
      autoPostOnLive: document.getElementById('ssBskyAutoLive').checked
    };
    ssState.mastodon = {
      enabled: document.getElementById('ssMastoEnabled').checked,
      instanceUrl: document.getElementById('ssMastoInstance').value.trim() || 'https://mastodon.social',
      accessToken: document.getElementById('ssMastoToken').value.trim(),
      autoPostOnLive: document.getElementById('ssMastoAutoLive').checked
    };
    ssState.x = {
      enabled: document.getElementById('ssXEnabled').checked,
      apiKey: document.getElementById('ssXApiKey').value.trim(),
      apiSecret: document.getElementById('ssXApiSecret').value.trim(),
      accessToken: document.getElementById('ssXAccessToken').value.trim(),
      accessTokenSecret: document.getElementById('ssXAccessSecret').value.trim(),
      autoPostOnLive: document.getElementById('ssXAutoLive').checked
    };
    ssState.instagram = {
      enabled: document.getElementById('ssIgEnabled').checked,
      igUserId: document.getElementById('ssIgUserId').value.trim(),
      accessToken: document.getElementById('ssIgAccessToken').value.trim(),
      defaultImagePath: pickedIgDefaultImgPath || '',
      defaultImageUrl: pickedIgDefaultImgPath ? '' : (ssState.instagram?.defaultImageUrl || ''),
      imgbbApiKey: document.getElementById('ssIgImgbbKey').value.trim(),
      autoPostOnLive: document.getElementById('ssIgAutoLive').checked
    };
    ssState.links = {
      twitchUrl: document.getElementById('ssLinkTwitch').value.trim(),
      youtubeUrl: document.getElementById('ssLinkYoutube').value.trim(),
      tiktokUrl: document.getElementById('ssLinkTiktok').value.trim(),
      kickUrl: document.getElementById('ssLinkKick').value.trim()
    };
  }

  async function openModal() {
    modal.classList.remove('hidden');
    setStatus('Lade Einstellungen...');
    const res = await window.omnichat.socialScheduleGet();
    if (res?.ok) {
      ssState = res.socialSchedule;
      ssLinks = res.links || {};
      fillFormFromState();
      setStatus('');
    }
  }

  btnOpenTop?.addEventListener('click', openModal);
  btnOpenSide?.addEventListener('click', openModal);
  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));

  document.getElementById('btnSaveSocialConfig')?.addEventListener('click', async () => {
    readConnectionsIntoState();
    const res = await window.omnichat.socialScheduleSave(ssState);
    if (res?.ok) {
      ssState = res.socialSchedule;
      ssLinks = res.links || {};
      fillFormFromState();
      setStatus('✅ Discord & Plattform-Einstellungen gespeichert!', '#4ade80');
    } else {
      setStatus('❌ Speichern fehlgeschlagen.', '#f87171');
    }
  });

  ['ssDiscordEnabled', 'ssDiscordAutoObs', 'ssDiscordAutoTwitch', 'ssDiscordLiveUpdate', 'ssDiscordEditOnEnd', 'ssDiscordPreview'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', async () => {
      if (!ssState) return;
      readConnectionsIntoState();
      const res = await window.omnichat.socialScheduleSave(ssState);
      if (res?.ok) {
        ssState = res.socialSchedule;
        setStatus('✅ Discord Live-Announcer automatisch gespeichert!', '#4ade80');
      }
    });
  });

  document.getElementById('btnDiscordLiveRefresh')?.addEventListener('click', async () => {
    const res = await window.omnichat.discordLiveRefresh?.();
    if (res?.ok && res.state?.active) setStatus('🔄 Discord Live-Nachricht aktualisiert.', '#4ade80');
    else if (res?.ok) setStatus('ℹ️ Kein aktiver Live-Post zum Aktualisieren.', '#94a3b8');
    else setStatus(`❌ ${res?.error || 'Aktualisieren fehlgeschlagen.'}`, '#f87171');
  });

  document.getElementById('btnDiscordLiveEnd')?.addEventListener('click', async () => {
    const res = await window.omnichat.discordLiveEnd?.();
    if (res?.skipped) setStatus('ℹ️ Kein aktiver Live-Post.', '#94a3b8');
    else if (res?.ok) setStatus('⚫ Discord Live-Nachricht als beendet markiert.', '#94a3b8');
    else setStatus(`❌ ${res?.error || 'Fehlgeschlagen.'}`, '#f87171');
  });

  document.getElementById('btnSsAddEntry')?.addEventListener('click', async () => {
    const title = document.getElementById('ssAddTitle').value.trim();
    const game = document.getElementById('ssAddGame').value.trim();
    const date = document.getElementById('ssAddDate').value;
    const time = document.getElementById('ssAddTime').value || '19:00';
    const durationMin = parseInt(document.getElementById('ssAddDuration').value || '180', 10) || 180;
    if (!title || !date) {
      setStatus('⚠️ Bitte Titel und Datum angeben.', '#fbbf24');
      return;
    }
    const platforms = [];
    if (document.getElementById('ssAddPlatTwitch').checked) platforms.push('twitch');
    if (document.getElementById('ssAddPlatYoutube').checked) platforms.push('youtube');
    if (document.getElementById('ssAddPlatTiktok').checked) platforms.push('tiktok');
    if (!platforms.length) platforms.push('twitch');

    ssState.schedule = ssState.schedule || [];
    ssState.schedule.push({
      id: `sch_${Date.now()}`,
      title,
      game,
      date,
      time,
      durationMin,
      platforms,
      recurringWeekly: document.getElementById('ssAddRecurring').checked
    });

    const res = await window.omnichat.socialScheduleSave(ssState);
    if (res?.ok) {
      ssState = res.socialSchedule;
      document.getElementById('ssAddTitle').value = '';
      renderScheduleList();
      setStatus('✅ Termin zum Sendeplan hinzugefügt!', '#4ade80');
    }
  });

  function buildSharePreviewText() {
    const title = document.getElementById('ssGoLiveTitle').value.trim() || 'Live-Stream';
    const game = document.getElementById('ssGoLiveGame').value.trim();
    const msg = (document.getElementById('ssGoLiveMessage').value.trim() || '🔴 Jetzt LIVE!')
      .replace(/\{channel\}/gi, document.getElementById('inputStreamerName')?.value || 'Stream')
      .replace(/\{title\}/gi, title)
      .replace(/\{game\}/gi, game || 'Just Chatting')
      .replace(/\*\*/g, '');
    const urls = [ssLinks.twitchUrl, ssLinks.youtubeUrl, ssLinks.tiktokUrl, ssLinks.kickUrl].filter(Boolean);
    return `${msg}\n📺 ${title}${game ? ` — 🎮 ${game}` : ''}${urls.length ? `\n${urls.join(' | ')}` : ''}`;
  }

  function generateSocialGraphicPng(mode = 'golive') {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.55, '#1e1b4b');
    grad.addColorStop(1, '#090d16');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1350);

    // Subtle accent glow circles
    ctx.fillStyle = mode === 'golive' ? 'rgba(239, 68, 68, 0.16)' : 'rgba(56, 189, 248, 0.16)';
    ctx.beginPath();
    ctx.arc(880, 200, 320, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(145, 70, 255, 0.18)';
    ctx.beginPath();
    ctx.arc(180, 1140, 360, 0, Math.PI * 2);
    ctx.fill();

    const channel = document.getElementById('inputStreamerName')?.value.trim() || 'OmniGrid';
    const title = document.getElementById('ssGoLiveTitle')?.value.trim() || document.getElementById('inputStreamTitle')?.value.trim() || 'Live-Stream';
    const game = document.getElementById('ssGoLiveGame')?.value.trim() || document.getElementById('inputStreamGame')?.value.trim() || 'Just Chatting';

    // Top badge
    ctx.fillStyle = mode === 'golive' ? '#ef4444' : '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(80, 88, mode === 'golive' ? 270 : 350, 58, 29);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(mode === 'golive' ? '● JETZT LIVE' : '📅 SENDEPLAN', 112, 127);

    // Channel name
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(channel.toUpperCase(), 80, 225);

    if (mode === 'golive') {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 68px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      const words = title.split(/\s+/);
      let line = '';
      let y = 350;
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (ctx.measureText(test).width > 910) {
          ctx.fillText(line, 80, y);
          line = w;
          y += 84;
          if (y > 760) break;
        } else {
          line = test;
        }
      }
      if (line && y <= 760) ctx.fillText(line, 80, y);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(80, 860, 920, 120, 24);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(`🎮  ${game}`, 120, 932);
    } else {
      const items = (ssState?.schedule || [])
        .slice()
        .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
        .slice(0, 5);
      let y = 310;
      if (!items.length) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText('Noch keine Termine eingetragen.', 80, 380);
      } else {
        for (const item of items) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.80)';
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(80, y, 920, 145, 22);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
          ctx.fillText(`${item.date}  •  ${item.time} Uhr`, 115, y + 52);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
          ctx.fillText(String(item.title || '').slice(0, 38), 115, y + 102);
          y += 168;
        }
      }
    }

    // Footer links
    const urls = [ssLinks.twitchUrl, ssLinks.youtubeUrl, ssLinks.tiktokUrl].filter(Boolean);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '26px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(urls.length ? urls.join('   •   ').slice(0, 68) : 'OmniGrid Studio', 80, 1260);

    return canvas.toDataURL('image/png');
  }

  document.getElementById('btnPostGoLiveNow')?.addEventListener('click', async () => {
    setStatus('⏳ Sende Go-Live Ankündigung...', '#38bdf8');
    const tagsRaw = document.getElementById('inputStreamTags')?.value || '';
    const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);
    const useIg = Boolean(document.getElementById('chkGoLiveInstagram')?.checked);
    const imageBase64 = useIg ? generateSocialGraphicPng('golive') : '';

    const res = await window.omnichat.socialPostGoLive({
      title: document.getElementById('ssGoLiveTitle').value.trim(),
      game: document.getElementById('ssGoLiveGame').value.trim(),
      tags,
      message: document.getElementById('ssGoLiveMessage').value.trim(),
      imageBase64,
      targets: {
        discord: document.getElementById('chkGoLiveDiscord').checked,
        bluesky: document.getElementById('chkGoLiveBluesky').checked,
        mastodon: document.getElementById('chkGoLiveMastodon').checked,
        x: Boolean(document.getElementById('chkGoLiveX')?.checked),
        instagram: useIg
      }
    });
    if (res?.posted?.length && !res?.errors?.length) {
      setStatus(`✅ Go-Live gepostet an: ${res.posted.join(', ')}`, '#4ade80');
    } else if (res?.posted?.length) {
      setStatus(`⚠️ Gepostet (${res.posted.join(', ')}), Hinweise: ${res.errors.join(' | ')}`, '#fbbf24');
    } else {
      setStatus(`❌ ${(res?.errors || ['Keine Ziel-Plattform aktiviert oder konfiguriert.']).join(' | ')}`, '#f87171');
    }
  });

  document.getElementById('btnPostScheduleNow')?.addEventListener('click', async () => {
    setStatus('⏳ Poste Sendeplan...', '#38bdf8');
    const useIg = Boolean(ssState?.instagram?.enabled);
    const imageBase64 = useIg ? generateSocialGraphicPng('schedule') : '';
    const res = await window.omnichat.socialPostSchedule({
      imageBase64,
      targets: {
        discord: Boolean(ssState?.discord?.webhookUrl),
        bluesky: Boolean(ssState?.bluesky?.enabled),
        mastodon: Boolean(ssState?.mastodon?.enabled),
        x: Boolean(ssState?.x?.enabled),
        instagram: useIg
      }
    });
    if (res?.posted?.length && !res?.errors?.length) {
      setStatus(`✅ Sendeplan gepostet an: ${res.posted.join(', ')}`, '#4ade80');
    } else if (res?.posted?.length) {
      setStatus(`⚠️ Gepostet (${res.posted.join(', ')}), Hinweise: ${res.errors.join(' | ')}`, '#fbbf24');
    } else {
      setStatus(`❌ ${(res?.errors || ['Bitte zuerst Discord Webhook oder Social-Account konfigurieren.']).join(' | ')}`, '#f87171');
    }
  });

  async function runInstagramQuickPost(mode) {
    const pngDataUrl = generateSocialGraphicPng(mode);
    const fileName = mode === 'schedule' ? `sendeplan-${Date.now()}.png` : `golive-${Date.now()}.png`;
    const saveRes = await window.omnichat.socialSaveGraphicPng({ base64Png: pngDataUrl, fileName });
    const caption = mode === 'schedule'
      ? `📅 Stream-Sendeplan!\n\n#livestream #twitch #youtube #gaming #sendeplan`
      : `${buildSharePreviewText()}\n\n#livestream #twitch #youtube #gaming #live`;
    await navigator.clipboard.writeText(caption);
    window.omnichat.openExternalUrl('https://www.instagram.com/');
    if (saveRes?.ok) {
      setStatus(`📸 Grafik gespeichert (${saveRes.filePath}), Caption kopiert & Instagram geöffnet!`, '#4ade80');
    }
  }

  document.getElementById('btnIgQuickPostGoLive')?.addEventListener('click', () => runInstagramQuickPost('golive'));
  document.getElementById('btnIgQuickPostSchedule')?.addEventListener('click', () => runInstagramQuickPost('schedule'));

  document.getElementById('btnSyncTwitchSchedule')?.addEventListener('click', async () => {
    setStatus('⏳ Synchronisiere Termine mit Twitch Schedule...', '#38bdf8');
    const res = await window.omnichat.socialSyncTwitchSchedule();
    if (res?.ok) {
      setStatus(`✅ ${res.created.length} Termin(e) auf Twitch Schedule übertragen!`, '#4ade80');
    } else {
      setStatus(`❌ ${res?.error || (res?.errors || []).join(' | ') || 'Twitch Sync fehlgeschlagen.'}`, '#f87171');
    }
  });

  document.getElementById('btnExportIcs')?.addEventListener('click', async () => {
    const res = await window.omnichat.socialExportIcs();
    if (res?.ok) {
      setStatus(`✅ .ics Kalender gespeichert: ${res.filePath}`, '#4ade80');
    }
  });

  document.getElementById('btnCopyObsScheduleUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/schedule');
    setStatus('🔗 OBS Browser-Quelle kopiert: http://127.0.0.1:4588/schedule (auch .ics unter /schedule.ics)', '#4ade80');
  });

  document.getElementById('btnShareX')?.addEventListener('click', () => {
    const text = buildSharePreviewText();
    window.omnichat.openExternalUrl(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
  });

  document.getElementById('btnShareThreads')?.addEventListener('click', () => {
    const text = buildSharePreviewText();
    window.omnichat.openExternalUrl(`https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`);
  });

  document.getElementById('btnShareYtCommunity')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(buildSharePreviewText());
    window.omnichat.openExternalUrl('https://studio.youtube.com');
    setStatus('📋 Go-Live Text kopiert & YouTube Studio geöffnet!', '#4ade80');
  });

  document.getElementById('btnCopyGoLiveText')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(buildSharePreviewText());
    setStatus('📋 Go-Live Text in die Zwischenablage kopiert!', '#4ade80');
  });
})();

// ======================================================
// LIVE-GIVEAWAY / VERLOSUNGS-RAD
// ======================================================
(function initGiveawayModal() {
  const modal = document.getElementById('giveawayModal');
  if (!modal) return;
  const btnOpen = document.getElementById('btnOpenGiveaway');
  const btnClose = document.getElementById('btnCloseGiveaway');
  const box = document.getElementById('gwWinnerBox');
  const countEl = document.getElementById('gwPartCount');
  const listEl = document.getElementById('gwPartList');

  function renderGw(gw) {
    if (!gw) return;
    const parts = Array.isArray(gw.participants) ? gw.participants : [];
    if (countEl) countEl.textContent = String(parts.length);
    if (box) {
      if (gw.spinning) {
        box.innerHTML = '🎲 <strong>Ziehung läuft auf OBS-Overlay...</strong>';
      } else if (gw.winner) {
        box.innerHTML = `🏆 Gewinner: <strong style="color:#fde047;">${escapeHtml(gw.winner.name)}</strong> (${escapeHtml(gw.winner.platform)})`;
      } else if (gw.active) {
        box.innerHTML = `🟢 <strong>Teilnahme offen</strong> — Keyword: <code>${escapeHtml(gw.keyword)}</code> (${gw.subMultiplier}× für Subs/VIPs/Mods)`;
      } else {
        box.innerHTML = `⏸ <strong>Pausiert / Bereit</strong> — OBS Overlay: ${gw.visible ? 'Sichtbar' : 'Ausgeblendet'}`;
      }
    }
    if (listEl) {
      listEl.innerHTML = '';
      parts.forEach((p) => {
        const pill = document.createElement('span');
        pill.style.cssText = 'font-size:11px; padding:3px 8px; border-radius:999px; background:rgba(30,41,59,0.9); border:1px solid rgba(148,163,184,0.25); color:#f1f5f9;';
        pill.textContent = `${p.name}${p.weight > 1 ? ` (${p.weight}×)` : ''}`;
        listEl.appendChild(pill);
      });
    }
  }

  btnOpen?.addEventListener('click', async () => {
    const willOpen = modal.classList.contains('hidden');
    modal.classList.toggle('hidden', !willOpen);
    btnOpen.classList.toggle('active', willOpen);
    if (willOpen) {
      const res = await window.omnichat.giveawayAction({ action: 'get' });
      if (res?.giveaway) renderGw(res.giveaway);
    }
  });
  btnClose?.addEventListener('click', () => {
    modal.classList.add('hidden');
    btnOpen?.classList.remove('active');
  });

  document.getElementById('btnGwStart')?.addEventListener('click', async () => {
    const res = await window.omnichat.giveawayAction({
      action: 'start',
      title: document.getElementById('gwInputTitle')?.value || 'Stream-Verlosung',
      keyword: document.getElementById('gwInputKeyword')?.value || '!join',
      subMultiplier: document.getElementById('gwSelectMult')?.value || 2
    });
    if (res?.giveaway) renderGw(res.giveaway);
  });
  document.getElementById('btnGwStop')?.addEventListener('click', async () => {
    const res = await window.omnichat.giveawayAction({ action: 'stop' });
    if (res?.giveaway) renderGw(res.giveaway);
  });
  document.getElementById('btnGwDraw')?.addEventListener('click', async () => {
    const res = await window.omnichat.giveawayAction({ action: 'draw' });
    if (res?.giveaway) renderGw(res.giveaway);
    if (res?.error && box) box.innerHTML = `⚠️ ${escapeHtml(res.error)}`;
  });
  document.getElementById('btnGwReset')?.addEventListener('click', async () => {
    const res = await window.omnichat.giveawayAction({ action: 'reset' });
    if (res?.giveaway) renderGw(res.giveaway);
  });
  document.getElementById('btnGwToggleObs')?.addEventListener('click', async () => {
    const res = await window.omnichat.giveawayAction({ action: 'toggle-visible' });
    if (res?.giveaway) renderGw(res.giveaway);
  });
  document.getElementById('btnGwCopyUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/giveaway');
    if (box) box.innerHTML = '🔗 <strong>http://127.0.0.1:4588/giveaway</strong> kopiert!';
  });

  window.omnichat.onGiveawayUpdated((gw) => renderGw(gw));
})();

// ======================================================
// INTEGRIERTES SOUNDBOARD (INKL. OBS-ROUTING)
// ======================================================
(function initSoundboardModal() {
  const modal = document.getElementById('soundboardModal');
  if (!modal) return;
  const btnOpen = document.getElementById('btnOpenSoundboard');
  const btnClose = document.getElementById('btnCloseSoundboard');
  const grid = document.getElementById('sbGrid');
  const statusEl = document.getElementById('sbStatus');
  const volInput = document.getElementById('sbVolume');
  const chkLocal = document.getElementById('sbPlayLocal');
  const chkObs = document.getElementById('sbRouteObs');
  let sbState = { volume: 0.8, playLocally: true, routeToObs: true, sounds: [] };

  function playSoundLocally(s) {
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

  window.omnichat.onSoundboardPlay((payload) => playSoundLocally(payload));

  function renderGrid() {
    if (!grid) return;
    grid.innerHTML = '';
    (sbState.sounds || []).forEach((s) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex; align-items:center; gap:4px; background:rgba(30,41,59,0.85); border:1px solid rgba(148,163,184,0.22); border-radius:10px; padding:6px;';
      const playBtn = document.createElement('button');
      playBtn.className = 'btn-sm';
      playBtn.style.cssText = 'flex:1; text-align:left; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;';
      playBtn.textContent = `${s.emoji || '🔊'} ${s.name}`;
      playBtn.addEventListener('click', () => window.omnichat.soundboardPlay(s.id));

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-sm warn';
      delBtn.style.padding = '3px 6px';
      delBtn.textContent = '✕';
      delBtn.title = 'Sound entfernen';
      delBtn.addEventListener('click', async () => {
        sbState.sounds = sbState.sounds.filter((x) => x.id !== s.id);
        await window.omnichat.soundboardSave(sbState);
        renderGrid();
      });

      wrap.appendChild(playBtn);
      wrap.appendChild(delBtn);
      grid.appendChild(wrap);
    });
  }

  async function saveSettings() {
    sbState.volume = parseFloat(volInput?.value || '0.8') || 0.8;
    sbState.playLocally = Boolean(chkLocal?.checked);
    sbState.routeToObs = Boolean(chkObs?.checked);
    await window.omnichat.soundboardSave(sbState);
  }

  volInput?.addEventListener('change', saveSettings);
  chkLocal?.addEventListener('change', saveSettings);
  chkObs?.addEventListener('change', saveSettings);

  btnOpen?.addEventListener('click', async () => {
    modal.classList.remove('hidden');
    const res = await window.omnichat.soundboardGet();
    if (res?.ok && res.soundboard) {
      sbState = res.soundboard;
      if (volInput) volInput.value = String(sbState.volume ?? 0.8);
      if (chkLocal) chkLocal.checked = sbState.playLocally !== false;
      if (chkObs) chkObs.checked = sbState.routeToObs !== false;
      renderGrid();
    }
  });
  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));

  document.getElementById('btnSbAddFile')?.addEventListener('click', async () => {
    const pick = await window.omnichat.soundboardPickFile();
    if (!pick?.ok) return;
    const list = Array.isArray(pick.files) && pick.files.length ? pick.files : [{ filePath: pick.filePath, name: pick.name }];
    sbState.sounds = sbState.sounds || [];
    list.forEach((f, idx) => {
      if (!f?.filePath) return;
      sbState.sounds.push({
        id: `sb_${Date.now()}_${idx}`,
        name: f.name || 'Sound',
        emoji: '🎵',
        builtin: '',
        filePath: f.filePath
      });
    });
    await window.omnichat.soundboardSave(sbState);
    renderGrid();
    if (statusEl) {
      statusEl.textContent =
        list.length > 1
          ? `✅ ${list.length} Sounds hinzugefügt!`
          : `✅ Sound hinzugefügt: ${list[0]?.name || ''}`;
    }
  });

  document.getElementById('btnSbCopyUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/soundboard');
    if (statusEl) statusEl.textContent = '🔗 http://127.0.0.1:4588/soundboard kopiert! (Hinweis: /alerts spielt Sounds ebenfalls direkt mit ab.)';
  });
})();

// ======================================================
// CHAT-HYPE-DETEKTOR
// ======================================================
(function initHypeModal() {
  const modal = document.getElementById('hypeModal');
  if (!modal) return;
  const btnOpen = document.getElementById('btnOpenHype');
  const btnClose = document.getElementById('btnCloseHype');
  const statusEl = document.getElementById('hdStatus');

  btnOpen?.addEventListener('click', async () => {
    modal.classList.remove('hidden');
    const res = await window.omnichat.hypeGet();
    if (res?.ok && res.hypeDetector) {
      const hd = res.hypeDetector;
      document.getElementById('hdEnabled').checked = Boolean(hd.enabled);
      const meterInit = document.getElementById('hdMeter');
      if (meterInit && !hd.enabled) {
        meterInit.style.color = '#fbbf24';
        meterInit.textContent = '⚠️ Detektor ist deaktiviert — oben „Chat-Hype-Detektor aktivieren“ anhaken, sonst reagieren Keywords nicht.';
      }
      document.getElementById('hdWindowSec').value = hd.windowSec || 10;
      document.getElementById('hdMinMsgs').value = hd.minMessages || 12;
      document.getElementById('hdCooldownSec').value = hd.cooldownSec || 90;
      const elKwHits = document.getElementById('hdKeywordHits');
      if (elKwHits) elKwHits.value = hd.keywordHits || 3;
      document.getElementById('hdKeywords').value = hd.keywords || '';
      document.getElementById('hdAutoMarker').checked = hd.autoMarker !== false;
      document.getElementById('hdAutoObsReplay').checked = Boolean(hd.autoObsReplay);
      document.getElementById('hdAutoClip').checked = hd.autoClip !== false;
      const elPostChat = document.getElementById('hdPostClipToChat');
      if (elPostChat) elPostChat.checked = hd.postClipToChat !== false;
    }
  });
  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));

  function readHypeForm() {
    return {
      enabled: Boolean(document.getElementById('hdEnabled')?.checked),
      windowSec: parseInt(document.getElementById('hdWindowSec')?.value || '10', 10) || 10,
      minMessages: parseInt(document.getElementById('hdMinMsgs')?.value || '12', 10) || 12,
      cooldownSec: parseInt(document.getElementById('hdCooldownSec')?.value || '90', 10) || 90,
      keywordHits: parseInt(document.getElementById('hdKeywordHits')?.value || '3', 10) || 3,
      keywords: document.getElementById('hdKeywords')?.value.trim() || '',
      autoMarker: Boolean(document.getElementById('hdAutoMarker')?.checked),
      autoObsReplay: Boolean(document.getElementById('hdAutoObsReplay')?.checked),
      autoClip: Boolean(document.getElementById('hdAutoClip')?.checked),
      postClipToChat: document.getElementById('hdPostClipToChat')?.checked !== false
    };
  }

  ['hdEnabled', 'hdWindowSec', 'hdMinMsgs', 'hdKeywordHits', 'hdCooldownSec', 'hdKeywords', 'hdAutoMarker', 'hdAutoObsReplay', 'hdAutoClip', 'hdPostClipToChat'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', async () => {
      const res = await window.omnichat.hypeSave(readHypeForm());
      if (res?.ok && statusEl) {
        statusEl.style.color = '#4ade80';
        statusEl.textContent = '✅ Hype-Einstellungen automatisch gespeichert!';
      }
    });
  });

  document.getElementById('btnSaveHype')?.addEventListener('click', async () => {
    const res = await window.omnichat.hypeSave(readHypeForm());
    if (res?.ok && statusEl) {
      statusEl.style.color = '#4ade80';
      statusEl.textContent = '✅ Hype-Detektor gespeichert!';
    }
  });

  function renderHypeResult(ev) {
    if (!statusEl || !ev) return;
    const acts = Array.isArray(ev.actions) && ev.actions.length ? `✅ ${ev.actions.join(' • ')}` : '';
    const errs = Array.isArray(ev.errors) && ev.errors.length ? `⚠️ ${ev.errors.join(' | ')}` : '';
    const clipPart = ev.clipUrl ? ` 🎬 Clip: ${ev.clipUrl}` : '';
    statusEl.style.color = errs && !acts ? '#f87171' : errs ? '#fbbf24' : '#4ade80';
    statusEl.textContent = [acts || `🔥 ${ev.desc || 'Hype ausgelöst'}`, clipPart, errs].filter(Boolean).join(' — ');
  }

  document.getElementById('btnTriggerHypeNow')?.addEventListener('click', async () => {
    if (statusEl) {
      statusEl.style.color = '#38bdf8';
      statusEl.textContent = '⏳ Löse Hype aus (erstelle Clip / Marker / Replay)...';
    }
    const res = await window.omnichat.hypeTriggerNow?.(readHypeForm());
    renderHypeResult(res);
  });

  window.omnichat.onHypeTriggered((ev) => {
    if (btnOpen) {
      btnOpen.style.boxShadow = '0 0 12px #f97316';
      setTimeout(() => { btnOpen.style.boxShadow = ''; }, 5000);
    }
    renderHypeResult(ev);
  });

  window.omnichat.onHypeMeter?.((m) => {
    const meterEl = document.getElementById('hdMeter');
    if (!meterEl || !m) return;
    const kwPart = m.matchedKw ? ` • zuletzt erkannt: „${m.matchedKw}“` : '';
    const cdPart = m.cooldownLeft > 0 ? ` • ⏳ Cooldown noch ${m.cooldownLeft}s` : '';
    meterEl.style.color = m.matchedKw ? '#fb923c' : '#94a3b8';
    meterEl.textContent = `📊 Hype-Meter: ${m.score}/${m.minMsgs} Punkte • Keywords ${m.kwCount}/${m.kwNeeded}${kwPart}${cdPart}`;
  });
})();

// ======================================================
// GAME-ADDONS & OBS GAME-STATS OVERLAY (/game-stats)
// ======================================================
(function initGameAddonsModal() {
  const modal = document.getElementById('gameAddonsModal');
  if (!modal) return;
  const btnOpen = document.getElementById('btnOpenGameAddons');
  const btnClose = document.getElementById('btnCloseGameAddons');
  const selAddon = document.getElementById('gaSelectAddon');
  const gameInput = document.getElementById('gaCurrentGameInput');
  const banner = document.getElementById('gaActiveBanner');
  const fieldsEl = document.getElementById('gaStatsFields');
  const chkLol = document.getElementById('gaLolPolling');
  const chkTrigger = document.getElementById('gaAutoTrigger');
  const statusEl = document.getElementById('gaStatus');

  let gaState = null;
  let allAddons = [];

  function resolveAddonInRenderer() {
    const mode = selAddon?.value || gaState?.selectedMode || 'auto';
    if (mode !== 'auto') {
      return allAddons.find((a) => a.id === mode) || allAddons[allAddons.length - 1];
    }
    const g = (gameInput?.value || gaState?.currentGameName || '').toLowerCase();
    for (const a of allAddons) {
      if ((a.gameMatches || []).some((m) => g.includes(m))) return a;
    }
    return allAddons.find((a) => a.id === 'universal') || allAddons[0];
  }

  function renderFields() {
    if (!gaState || !allAddons.length) return;
    const addon = resolveAddonInRenderer();
    if (!addon) return;
    const stats = (gaState.perAddonStats && gaState.perAddonStats[addon.id]) || {};
    if (banner) {
      const previewIcon = stats.skinIconUrl || stats.championIconUrl;
      const lolPreview = addon.id === 'lol'
        ? `<div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:6px; padding-top:6px; border-top:1px solid rgba(200,170,110,0.22);"><div style="display:flex; align-items:center; gap:8px;">${previewIcon ? `<img src="${escapeHtml(previewIcon)}" style="width:38px; height:38px; object-fit:cover; object-position:center 15%; border-radius:4px; border:1.5px solid #c8aa6e;" />` : ''}<div><strong style="color:#f0e6d2;">${escapeHtml(stats.champion || 'Champion')}${stats.role ? ` • ${escapeHtml(stats.role)}` : ''}</strong><div style="font-size:11px; color:#0ac8b9;">✨ ${escapeHtml(stats.skinName || 'Classic')}</div></div></div><div style="padding:4px 9px; border-radius:4px; background:rgba(9,20,40,0.9); border:1px solid #c8aa6e; text-align:right;"><div style="font-size:11px; font-weight:800; color:#f0e6d2; text-transform:uppercase;">${escapeHtml(stats.rank || 'Unranked')}</div><div style="font-size:12px; font-weight:900; color:#0ac8b9;">${Number(stats.lp || 0)} LP</div></div></div>`
        : '';
      const safeCmds = (addon.chatCommands || []).map((c) => escapeHtml(c)).join('</code>, <code>');
      banner.innerHTML = `${escapeHtml(addon.icon)} Aktives Addon: <strong>${escapeHtml(addon.name)}</strong> • Chat-Commands: <code>${safeCmds}</code><div style="font-size:11px; color:#94a3b8; margin-top:3px;">${escapeHtml(addon.eventHint || '')}</div>${lolPreview}`;
    }
    const lolMatchBox = document.getElementById('gaLolMatchControls');
    if (lolMatchBox) lolMatchBox.classList.toggle('hidden', addon.id !== 'lol');
    const champThemeBox = document.getElementById('gaChampThemeBox');
    if (champThemeBox) champThemeBox.classList.toggle('hidden', addon.id !== 'lol');
    const jcBox = document.getElementById('gaJcControls');
    if (jcBox) jcBox.classList.toggle('hidden', addon.id !== 'justchatting');
    const tronBox = document.getElementById('gaTronControls');
    if (tronBox) tronBox.classList.toggle('hidden', addon.id !== 'techtalk');
    const valBox = document.getElementById('gaValControls');
    if (valBox) valBox.classList.toggle('hidden', addon.id !== 'valorant');
    const prodBox = document.getElementById('gaProductControls');
    if (prodBox) prodBox.classList.toggle('hidden', addon.id !== 'productlaunch');
    const djBox = document.getElementById('gaDjControls');
    if (djBox) djBox.classList.toggle('hidden', addon.id !== 'djstream');
    const podBox = document.getElementById('gaPodcastControls');
    if (podBox) podBox.classList.toggle('hidden', addon.id !== 'podcast');
    const cookBox = document.getElementById('gaCookingControls');
    if (cookBox) cookBox.classList.toggle('hidden', addon.id !== 'cookingirl');
    if (addon.id === 'podcast') {
      const pod = gaState.perAddonStats?.podcast || {};
      const pHosts = document.getElementById('gaPodHostsText');
      if (pHosts && document.activeElement !== pHosts) pHosts.value = pod.hostsText || '';
      const pShow = document.getElementById('gaPodShowGuestBar');
      if (pShow) pShow.checked = pod.showGuestBar !== false;
      const btnWrap = document.getElementById('gaPodSpeakerBtns');
      if (btnWrap) {
        btnWrap.innerHTML = '';
        const hosts = String(pod.hostsText || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean).slice(0, 4);
        const curIdx = Math.max(0, Math.min(Number(pod.activeSpeakerIdx || 0), Math.max(0, hosts.length - 1)));
        hosts.forEach((line, idx) => {
          const name = line.split('|')[0].trim() || `Host ${idx + 1}`;
          const b = document.createElement('button');
          b.className = 'btn-sm';
          b.textContent = (idx === curIdx ? '🎙️ ' : '') + name;
          if (idx === curIdx) {
            b.style.background = '#ef4444';
            b.style.color = '#ffffff';
            b.style.fontWeight = '800';
          }
          b.addEventListener('click', () => {
            gaState.perAddonStats.podcast = { ...(gaState.perAddonStats.podcast || {}), activeSpeakerIdx: idx };
            renderFields();
            saveFromForm();
          });
          btnWrap.appendChild(b);
        });
      }
    }
    if (addon.id === 'cookingirl') {
      const ck = gaState.perAddonStats?.cookingirl || {};
      const cMode = document.getElementById('gaCookMode');
      if (cMode) cMode.value = ck.mode === 'irl' ? 'irl' : 'cooking';
      const cSteps = document.getElementById('gaCookStepsText');
      if (cSteps && document.activeElement !== cSteps) cSteps.value = ck.stepsText || '';
      const cIng = document.getElementById('gaCookIngredientsText');
      if (cIng && document.activeElement !== cIng) cIng.value = ck.ingredientsText || '';
      const cShow = document.getElementById('gaCookShowCard');
      if (cShow) cShow.checked = ck.showCard !== false;
      const cTimer = document.getElementById('gaCookTimerSec');
      if (cTimer && document.activeElement !== cTimer) cTimer.value = String(Number(ck.timerSec || 0));
      const cBtn = document.getElementById('btnGaCookTimerToggle');
      if (cBtn) cBtn.textContent = ck.timerRunning ? '⏸ Pause' : '▶ Start';
      const steps = String(ck.stepsText || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
      const curIdx = Math.min(Math.max(0, Number(ck.activeStepIdx || 0)), Math.max(0, steps.length - 1));
      const badge = document.getElementById('gaCookStepBadge');
      if (badge) badge.textContent = steps.length ? `${String(curIdx + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}` : '—';
    }
    if (addon.id === 'productlaunch') {
      const pr = gaState.perAddonStats?.productlaunch || {};
      const pAg = document.getElementById('gaProdAgendaText');
      if (pAg && document.activeElement !== pAg) pAg.value = pr.agendaText || '';
      const pHl = document.getElementById('gaProdHighlightsText');
      if (pHl && document.activeElement !== pHl) pHl.value = pr.highlightsText || '';
      const pShow = document.getElementById('gaProdShowCard');
      if (pShow) pShow.checked = pr.showCard !== false;
      const steps = String(pr.agendaText || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
      const curIdx = Math.min(Math.max(0, Number(pr.activeAgendaIdx || 0)), Math.max(0, steps.length - 1));
      const badge = document.getElementById('gaProdStepBadge');
      if (badge) badge.textContent = steps.length ? `${String(curIdx + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}` : '—';
    }
    if (addon.id === 'djstream') {
      const dj = gaState.perAddonStats?.djstream || {};
      const selSch = document.getElementById('gaDjColorScheme');
      if (selSch) selSch.value = dj.colorScheme || 'cyber_club';
    }
    if (addon.id === 'valorant') {
      const v = gaState.perAddonStats?.valorant || {};
      const chkValMap = document.getElementById('gaValMapCover');
      const txtValMap = document.getElementById('gaValMapCoverText');
      if (chkValMap) chkValMap.checked = Boolean(v.mapCoverEnabled);
      if (txtValMap && document.activeElement !== txtValMap) txtValMap.value = v.mapCoverText || 'RADAR VERDECKT // ANTI-SNIPE';
    }
    if (addon.id === 'techtalk') {
      const tt = gaState.perAddonStats?.techtalk || {};
      const tAgenda = document.getElementById('gaTronAgendaText');
      if (tAgenda && document.activeElement !== tAgenda) tAgenda.value = tt.agendaText || '';
      const tTicker = document.getElementById('gaTronTickerText');
      if (tTicker && document.activeElement !== tTicker) tTicker.value = tt.tickerText || '';
      const steps = String(tt.agendaText || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
      const curIdx = Math.min(Math.max(0, Number(tt.activeAgendaIdx || 0)), Math.max(0, steps.length - 1));
      const badge = document.getElementById('gaTronStepBadge');
      if (badge) badge.textContent = steps.length ? `SECTOR ${String(curIdx + 1).padStart(2, '0')}/${String(steps.length).padStart(2, '0')}` : 'NO SECTOR';
    }
    const chkMapCover = document.getElementById('gaLolMapCover');
    const txtMapCover = document.getElementById('gaLolMapCoverText');
    if (chkMapCover) chkMapCover.checked = Boolean(gaState.perAddonStats?.lol?.mapCoverEnabled);
    if (txtMapCover) txtMapCover.value = gaState.perAddonStats?.lol?.mapCoverText || 'Minimap verdeckt • Kein Ghosting';

    if (addon.id === 'justchatting') {
      const jc = gaState.perAddonStats?.justchatting || {};
      const agendaEl = document.getElementById('gaJcAgendaText');
      if (agendaEl && document.activeElement !== agendaEl) agendaEl.value = jc.agendaText || '';
      const qnaChk = document.getElementById('gaJcQnaEnabled');
      if (qnaChk) qnaChk.checked = jc.qnaEnabled !== false;
      const steps = String(jc.agendaText || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
      const curIdx = Math.min(Math.max(0, Number(jc.activeAgendaIdx || 0)), Math.max(0, steps.length - 1));
      const stepBadge = document.getElementById('gaJcStepBadge');
      if (stepBadge) {
        stepBadge.textContent = steps.length ? `Kapitel ${curIdx + 1}/${steps.length}: ${steps[curIdx].slice(0, 26)}` : 'Keine Kapitel';
      }
      const actBox = document.getElementById('gaJcActiveQuestionBox');
      if (actBox) {
        const aq = jc.activeQuestion;
        actBox.innerHTML = aq && aq.text
          ? `📺 <strong>Im Stream aktiv (@${escapeHtml(aq.author || 'Viewer')}):</strong> „${escapeHtml(aq.text)}“`
          : 'Aktuell im Stream eingeblendet: <em>keine Frage</em>';
      }
      const qList = document.getElementById('gaJcQueueList');
      if (qList) {
        qList.innerHTML = '';
        const queue = Array.isArray(jc.qnaQueue) ? jc.qnaQueue : [];
        if (!queue.length) {
          qList.innerHTML = '<div style="font-size:11px; color:#64748b;">Warteschlange leer — Zuschauer können im Chat <code>!ask Deine Frage</code> schreiben.</div>';
        } else {
          queue.forEach((q, idx) => {
            const row = document.createElement('div');
            row.style.cssText = 'display:flex; align-items:center; gap:6px; padding:4px 7px; border-radius:6px; background:rgba(30,41,59,0.75); border:1px solid rgba(236,72,153,0.22); font-size:11.5px;';
            const txt = document.createElement('span');
            txt.style.cssText = 'flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;';
            txt.textContent = `#${idx + 1} @${q.author}: ${q.text}`;
            const showBtn = document.createElement('button');
            showBtn.className = 'btn-sm';
            showBtn.style.cssText = 'padding:2px 7px; background:#db2777; color:#fff;';
            showBtn.textContent = '📺 Zeigen';
            showBtn.addEventListener('click', async () => {
              const r = await window.omnichat.gameAddonsJcAction?.({ action: 'show-question', id: q.id });
              if (r?.ok) { gaState = r.gameAddons; renderFields(); }
            });
            const delBtn = document.createElement('button');
            delBtn.className = 'btn-sm warn';
            delBtn.style.padding = '2px 6px';
            delBtn.textContent = '✕';
            delBtn.addEventListener('click', async () => {
              const r = await window.omnichat.gameAddonsJcAction?.({ action: 'remove-question', id: q.id });
              if (r?.ok) { gaState = r.gameAddons; renderFields(); }
            });
            row.appendChild(txt);
            row.appendChild(showBtn);
            row.appendChild(delBtn);
            qList.appendChild(row);
          });
        }
      }
    }

    if (!fieldsEl) return;
    fieldsEl.innerHTML = '';
    (addon.fields || []).forEach((f) => {
      const box = document.createElement('div');
      box.style.cssText = 'background:rgba(30,41,59,0.75); border:1px solid rgba(148,163,184,0.2); border-radius:8px; padding:8px;';
      const lbl = document.createElement('label');
      lbl.style.cssText = 'font-size:11px; color:#94a3b8; display:block;';
      lbl.textContent = f.label;
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; gap:4px; margin-top:4px; align-items:center;';
      const inp = document.createElement('input');
      inp.type = f.type === 'number' ? 'number' : 'text';
      inp.value = stats[f.key] !== undefined ? String(stats[f.key]) : '';
      inp.style.flex = '1';
      inp.dataset.gaKey = f.key;
      inp.dataset.gaType = f.type;
      row.appendChild(inp);

      if (f.type === 'number') {
        const plusBtn = document.createElement('button');
        plusBtn.className = 'btn-sm';
        plusBtn.textContent = '+1';
        plusBtn.addEventListener('click', () => {
          inp.value = String((parseInt(inp.value || '0', 10) || 0) + 1);
          saveFromForm();
        });
        row.appendChild(plusBtn);
      }
      box.appendChild(lbl);
      box.appendChild(row);
      fieldsEl.appendChild(box);
    });
  }

  async function saveFromForm() {
    if (!gaState) return;
    const addon = resolveAddonInRenderer();
    gaState.selectedMode = selAddon?.value || 'auto';
    gaState.currentGameName = gameInput?.value.trim() || '';
    gaState.lolPollingEnabled = Boolean(chkLol?.checked);
    gaState.autoTriggerEvents = Boolean(chkTrigger?.checked);
    gaState.overlayEnabled = document.getElementById('gaOverlayEnabled')?.checked !== false;

    if (addon && fieldsEl) {
      const nextAddonStats = { ...(gaState.perAddonStats?.[addon.id] || {}) };
      fieldsEl.querySelectorAll('input[data-ga-key]').forEach((inp) => {
        const k = inp.dataset.gaKey;
        nextAddonStats[k] = inp.dataset.gaType === 'number' ? (parseInt(inp.value || '0', 10) || 0) : inp.value;
      });
      if (addon.id === 'lol') {
        nextAddonStats.mapCoverEnabled = Boolean(document.getElementById('gaLolMapCover')?.checked);
        nextAddonStats.mapCoverText = document.getElementById('gaLolMapCoverText')?.value.trim() || 'Minimap verdeckt • Kein Ghosting';
      }
      if (addon.id === 'justchatting') {
        nextAddonStats.agendaText = document.getElementById('gaJcAgendaText')?.value || '';
        nextAddonStats.qnaEnabled = document.getElementById('gaJcQnaEnabled')?.checked !== false;
      }
      if (addon.id === 'techtalk') {
        nextAddonStats.agendaText = document.getElementById('gaTronAgendaText')?.value || '';
        nextAddonStats.tickerText = document.getElementById('gaTronTickerText')?.value || '';
      }
      if (addon.id === 'valorant') {
        nextAddonStats.mapCoverEnabled = Boolean(document.getElementById('gaValMapCover')?.checked);
        nextAddonStats.mapCoverText = document.getElementById('gaValMapCoverText')?.value.trim() || 'RADAR VERDECKT // ANTI-SNIPE';
      }
      if (addon.id === 'productlaunch') {
        nextAddonStats.agendaText = document.getElementById('gaProdAgendaText')?.value || '';
        nextAddonStats.highlightsText = document.getElementById('gaProdHighlightsText')?.value || '';
        nextAddonStats.showCard = document.getElementById('gaProdShowCard')?.checked !== false;
      }
      if (addon.id === 'djstream') {
        nextAddonStats.colorScheme = document.getElementById('gaDjColorScheme')?.value || 'cyber_club';
      }
      if (addon.id === 'podcast') {
        nextAddonStats.hostsText = document.getElementById('gaPodHostsText')?.value || '';
        nextAddonStats.showGuestBar = document.getElementById('gaPodShowGuestBar')?.checked !== false;
      }
      if (addon.id === 'cookingirl') {
        nextAddonStats.mode = document.getElementById('gaCookMode')?.value === 'irl' ? 'irl' : 'cooking';
        nextAddonStats.stepsText = document.getElementById('gaCookStepsText')?.value || '';
        nextAddonStats.ingredientsText = document.getElementById('gaCookIngredientsText')?.value || '';
        nextAddonStats.showCard = document.getElementById('gaCookShowCard')?.checked !== false;
        const secInput = parseInt(document.getElementById('gaCookTimerSec')?.value || '0', 10);
        if (!Number.isNaN(secInput) && !nextAddonStats.timerRunning) nextAddonStats.timerSec = Math.max(0, secInput);
      }
      gaState.perAddonStats = { ...(gaState.perAddonStats || {}), [addon.id]: nextAddonStats };
    }
    const res = await window.omnichat.gameAddonsSave(gaState);
    if (res?.ok) {
      gaState = res.gameAddons;
      if (statusEl) {
        statusEl.style.color = '#4ade80';
        statusEl.textContent = `✅ OBS /game-stats & Chat-Events auf "${addon?.name || gaState.selectedMode}" aktualisiert!`;
      }
    }
  }

  selAddon?.addEventListener('change', () => {
    renderFields();
    saveFromForm();
  });
  gameInput?.addEventListener('change', () => {
    renderFields();
    saveFromForm();
  });

  btnOpen?.addEventListener('click', async () => {
    modal.classList.remove('hidden');
    const res = await window.omnichat.gameAddonsGet();
    if (res?.ok) {
      gaState = res.gameAddons;
      allAddons = res.addons || [];
      if (selAddon) selAddon.value = gaState.selectedMode || 'auto';
      if (gameInput) gameInput.value = gaState.currentGameName || document.getElementById('inputStreamGame')?.value || '';
      if (chkLol) chkLol.checked = gaState.lolPollingEnabled !== false;
      if (chkTrigger) chkTrigger.checked = gaState.autoTriggerEvents !== false;
      const chkOverlay = document.getElementById('gaOverlayEnabled');
      if (chkOverlay) chkOverlay.checked = gaState.overlayEnabled !== false;
      renderFields();
    }
  });
  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));

  document.getElementById('btnGaSave')?.addEventListener('click', saveFromForm);
  document.getElementById('gaOverlayEnabled')?.addEventListener('change', async (e) => {
    await saveFromForm();
    if (statusEl) {
      statusEl.style.color = e.target.checked ? '#4ade80' : '#fbbf24';
      statusEl.textContent = e.target.checked ? '👁️ Game-Stats-Overlay in OBS wieder eingeblendet.' : '🙈 Game-Stats-Overlay in OBS ausgeblendet.';
    }
  });
  document.getElementById('btnGaReset')?.addEventListener('click', async () => {
    const addon = resolveAddonInRenderer();
    if (!addon) return;
    if (!confirm(`Werte von "${addon.name}" auf Standard zurücksetzen?`)) return;
    const res = await window.omnichat.gameAddonsReset?.(addon.id);
    if (res?.ok) {
      gaState = res.gameAddons;
      renderFields();
      if (statusEl) { statusEl.style.color = '#94a3b8'; statusEl.textContent = `↺ ${addon.name}: Standardwerte wiederhergestellt.`; }
    }
  });
  document.getElementById('gaLolMapCover')?.addEventListener('change', saveFromForm);
  document.getElementById('btnGaCopyMapUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/lol-map');
    if (statusEl) {
      statusEl.style.color = '#4ade80';
      statusEl.textContent = '🔗 http://127.0.0.1:4588/lol-map kopiert! (In OBS über die Minimap legen, z. B. 280×280)';
    }
  });
  document.getElementById('btnGaExportCs2')?.addEventListener('click', async () => {
    const res = await window.omnichat.gameAddonsExportCs2Gsi();
    if (res?.ok && statusEl) {
      statusEl.style.color = '#4ade80';
      statusEl.textContent = `📄 CS2 GSI Config gespeichert: ${res.filePath} (in CS2 Ordner game/csgo/cfg/ kopieren)`;
    }
  });
  document.getElementById('btnGaCopyUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/game-stats');
    if (statusEl) {
      statusEl.style.color = '#4ade80';
      statusEl.textContent = '🔗 http://127.0.0.1:4588/game-stats kopiert!';
    }
  });

  document.getElementById('btnGaLolSyncLcu')?.addEventListener('click', async () => {
    if (statusEl) {
      statusEl.style.color = '#38bdf8';
      statusEl.textContent = '⏳ Lese Rank, LP & Riot-ID aus lokalem League-Client (LCU)...';
    }
    const res = await window.omnichat.gameAddonsLolSyncLcu?.();
    if (res?.ok) {
      gaState = res.gameAddons;
      renderFields();
      if (statusEl) {
        statusEl.style.color = '#4ade80';
        statusEl.textContent = `✅ Aus LoL-Client geladen: ${res.rank} (${res.lp} LP • ${res.queueLabel || 'Ranked'})${res.riotId ? ` • ${res.riotId}` : ''}`;
      }
    } else if (statusEl) {
      statusEl.style.color = '#fbbf24';
      statusEl.textContent = `⚠️ ${res?.error || 'LoL-Client nicht erreichbar.'}`;
    }
  });

  document.getElementById('btnGaLolWin')?.addEventListener('click', async () => {
    const lpInp = fieldsEl?.querySelector('input[data-ga-key="lp"]');
    if (lpInp) { lpInp.value = String((parseInt(lpInp.value || '0', 10) || 0) + 22); await saveFromForm(); }
    const champ = fieldsEl?.querySelector('input[data-ga-key="champion"]')?.value || '';
    const res = await window.omnichat.gameAddonsLolRecordMatch({ win: true, champion: champ });
    if (res?.ok) {
      gaState = res.gameAddons;
      if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '🏆 Sieg (+22 LP) zu den letzten 6 Matches hinzugefügt!'; }
    }
  });
  document.getElementById('btnGaLolLoss')?.addEventListener('click', async () => {
    const lpInp = fieldsEl?.querySelector('input[data-ga-key="lp"]');
    if (lpInp) { lpInp.value = String(Math.max(0, (parseInt(lpInp.value || '0', 10) || 0) - 18)); await saveFromForm(); }
    const champ = fieldsEl?.querySelector('input[data-ga-key="champion"]')?.value || '';
    const res = await window.omnichat.gameAddonsLolRecordMatch({ win: false, champion: champ });
    if (res?.ok) {
      gaState = res.gameAddons;
      if (statusEl) { statusEl.style.color = '#fbbf24'; statusEl.textContent = '💀 Niederlage (-18 LP) zu den letzten 6 Matches hinzugefügt!'; }
    }
  });
  document.getElementById('btnGaLolLpPlus')?.addEventListener('click', () => {
    const lpInp = fieldsEl?.querySelector('input[data-ga-key="lp"]');
    if (lpInp) { lpInp.value = String((parseInt(lpInp.value || '0', 10) || 0) + 20); saveFromForm(); }
  });
  document.getElementById('btnGaLolLpMinus')?.addEventListener('click', () => {
    const lpInp = fieldsEl?.querySelector('input[data-ga-key="lp"]');
    if (lpInp) { lpInp.value = String(Math.max(0, (parseInt(lpInp.value || '0', 10) || 0) - 20)); saveFromForm(); }
  });
  document.getElementById('btnGaCopyBuildUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/lol-build');
    if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '🔗 http://127.0.0.1:4588/lol-build kopiert! (Live Item-Build & Elo-Bar, 550×125)'; }
  });
  document.getElementById('btnGaCopyAbilityBarUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/lol-ability-bar');
    if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '⚔️ http://127.0.0.1:4588/lol-ability-bar kopiert! (LoL Ability-Bar Rahmen, 920×175 — passt sich an jedes Pack an)'; }
  });
  document.getElementById('btnGaCopyProdLtUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/product-lowerthird');
    if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '🎯 http://127.0.0.1:4588/product-lowerthird kopiert! (Keynote Bauchbinde, 980×150)'; }
  });
  document.getElementById('btnGaCopyProdCardUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/product-card');
    if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '🏷️ http://127.0.0.1:4588/product-card kopiert! (Produkt-Spotlight-Karte, 480×340)'; }
  });
  document.getElementById('btnGaCopyDjStageUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/dj-stage');
    if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '🎧 http://127.0.0.1:4588/dj-stage kopiert! (36-Band Audio-EQ Bühne, 1920×220)'; }
  });
  document.getElementById('btnGaCopyDjDeckUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/dj-nowplaying');
    if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '💿 http://127.0.0.1:4588/dj-nowplaying kopiert! (Vinyl & BPM Deck, 520×145)'; }
  });
  document.getElementById('btnGaCopyPodDeskUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/podcast-desk');
    if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '📺 http://127.0.0.1:4588/podcast-desk kopiert! (Podcast Broadcast Desk, 1920×185)'; }
  });
  document.getElementById('btnGaCopyPodGuestUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/podcast-guest-bar');
    if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '🎙️ http://127.0.0.1:4588/podcast-guest-bar kopiert! (Active-Speaker Bar, 640×120)'; }
  });
  document.getElementById('btnGaCopyCookHudUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/cooking-hud');
    if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '🍳 http://127.0.0.1:4588/cooking-hud kopiert! (Cooking & IRL HUD, 920×160)'; }
  });
  document.getElementById('btnGaCopyCookCardUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/cooking-card');
    if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '🥕 http://127.0.0.1:4588/cooking-card kopiert! (Zutaten / IRL Checkliste, 420×340)'; }
  });
  document.getElementById('gaPodHostsText')?.addEventListener('change', () => { saveFromForm().then(renderFields); });
  document.getElementById('gaPodShowGuestBar')?.addEventListener('change', saveFromForm);
  document.getElementById('gaCookMode')?.addEventListener('change', saveFromForm);
  document.getElementById('gaCookStepsText')?.addEventListener('change', () => { saveFromForm().then(renderFields); });
  document.getElementById('gaCookIngredientsText')?.addEventListener('change', saveFromForm);
  document.getElementById('gaCookShowCard')?.addEventListener('change', saveFromForm);
  document.getElementById('btnGaCookPrevStep')?.addEventListener('click', () => {
    if (!gaState) return;
    const ck = gaState.perAddonStats?.cookingirl || {};
    const steps = String(document.getElementById('gaCookStepsText')?.value || ck.stepsText || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    const nextIdx = steps.length ? (Math.max(0, Number(ck.activeStepIdx || 0)) - 1 + steps.length) % steps.length : 0;
    gaState.perAddonStats.cookingirl = { ...ck, activeStepIdx: nextIdx };
    renderFields();
    saveFromForm();
  });
  document.getElementById('btnGaCookNextStep')?.addEventListener('click', () => {
    if (!gaState) return;
    const ck = gaState.perAddonStats?.cookingirl || {};
    const steps = String(document.getElementById('gaCookStepsText')?.value || ck.stepsText || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    const nextIdx = steps.length ? (Math.max(0, Number(ck.activeStepIdx || 0)) + 1) % steps.length : 0;
    gaState.perAddonStats.cookingirl = { ...ck, activeStepIdx: nextIdx };
    renderFields();
    saveFromForm();
  });
  document.getElementById('btnGaCookTimerToggle')?.addEventListener('click', () => {
    if (!gaState) return;
    const ck = gaState.perAddonStats?.cookingirl || {};
    if (ck.timerRunning) {
      const elapsed = ck.timerStartedAt ? Math.floor((Date.now() - ck.timerStartedAt) / 1000) : 0;
      const rem = Math.max(0, Number(ck.timerSec || 0) - elapsed);
      gaState.perAddonStats.cookingirl = { ...ck, timerSec: rem, timerRunning: false, timerStartedAt: 0 };
    } else {
      const sec = Math.max(0, parseInt(document.getElementById('gaCookTimerSec')?.value || String(ck.timerSec || 0), 10) || 0);
      gaState.perAddonStats.cookingirl = { ...ck, timerSec: sec, timerRunning: true, timerStartedAt: Date.now() };
    }
    renderFields();
    saveFromForm();
  });
  document.getElementById('btnGaCookTimerReset')?.addEventListener('click', () => {
    if (!gaState) return;
    const ck = gaState.perAddonStats?.cookingirl || {};
    const sec = Math.max(0, parseInt(document.getElementById('gaCookTimerSec')?.value || '390', 10) || 390);
    gaState.perAddonStats.cookingirl = { ...ck, timerSec: sec, timerRunning: false, timerStartedAt: 0 };
    renderFields();
    saveFromForm();
  });
  document.getElementById('gaProdShowCard')?.addEventListener('change', saveFromForm);
  document.getElementById('gaProdAgendaText')?.addEventListener('change', saveFromForm);
  document.getElementById('gaProdHighlightsText')?.addEventListener('change', saveFromForm);
  document.getElementById('gaDjColorScheme')?.addEventListener('change', saveFromForm);
  document.getElementById('btnGaProdPrevStep')?.addEventListener('click', () => {
    if (!gaState?.perAddonStats?.productlaunch) return;
    const steps = String(document.getElementById('gaProdAgendaText')?.value || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    const cur = Number(gaState.perAddonStats.productlaunch.activeAgendaIdx || 0);
    gaState.perAddonStats.productlaunch.activeAgendaIdx = Math.max(0, cur - 1);
    saveFromForm().then(renderFields);
  });
  document.getElementById('btnGaProdNextStep')?.addEventListener('click', () => {
    if (!gaState?.perAddonStats?.productlaunch) return;
    const steps = String(document.getElementById('gaProdAgendaText')?.value || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    const cur = Number(gaState.perAddonStats.productlaunch.activeAgendaIdx || 0);
    gaState.perAddonStats.productlaunch.activeAgendaIdx = Math.min(Math.max(0, steps.length - 1), cur + 1);
    saveFromForm().then(renderFields);
  });
  document.getElementById('btnGaCopyBgUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/lol-bg');
    if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '🖼️ http://127.0.0.1:4588/lol-bg kopiert! (Animierter LoL-Client-Hintergrund, 1920×1080)'; }
  });

  // Just Chatting Suite Controls
  document.getElementById('gaJcAgendaText')?.addEventListener('change', saveFromForm);
  document.getElementById('gaJcQnaEnabled')?.addEventListener('change', saveFromForm);
  document.getElementById('btnGaJcPrevStep')?.addEventListener('click', async () => {
    await saveFromForm();
    const r = await window.omnichat.gameAddonsJcAction?.({ action: 'step-agenda', delta: -1 });
    if (r?.ok) { gaState = r.gameAddons; renderFields(); }
  });
  document.getElementById('btnGaJcNextStep')?.addEventListener('click', async () => {
    await saveFromForm();
    const r = await window.omnichat.gameAddonsJcAction?.({ action: 'step-agenda', delta: 1 });
    if (r?.ok) { gaState = r.gameAddons; renderFields(); }
  });
  document.getElementById('btnGaJcAddQ')?.addEventListener('click', async () => {
    const authorEl = document.getElementById('gaJcManualQAuthor');
    const txtEl = document.getElementById('gaJcManualQText');
    const txt = txtEl?.value.trim() || '';
    if (!txt) return;
    const author = (authorEl?.value.trim() || 'Community').replace(/^@/, '');
    const r = await window.omnichat.gameAddonsJcAction?.({ action: 'add-question', author, text: txt });
    if (r?.ok) {
      if (txtEl) txtEl.value = '';
      gaState = r.gameAddons;
      renderFields();
    }
  });
  document.getElementById('btnGaJcNextQ')?.addEventListener('click', async () => {
    const r = await window.omnichat.gameAddonsJcAction?.({ action: 'next-question' });
    if (r?.ok) { gaState = r.gameAddons; renderFields(); }
  });
  document.getElementById('btnGaJcHideQ')?.addEventListener('click', async () => {
    const r = await window.omnichat.gameAddonsJcAction?.({ action: 'hide-question' });
    if (r?.ok) { gaState = r.gameAddons; renderFields(); }
  });
  document.getElementById('btnGaJcClearQ')?.addEventListener('click', async () => {
    const r = await window.omnichat.gameAddonsJcAction?.({ action: 'clear-questions' });
    if (r?.ok) { gaState = r.gameAddons; renderFields(); }
  });
  document.getElementById('btnGaCopyJcLtUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/jc-lowerthird');
    if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '🔗 http://127.0.0.1:4588/jc-lowerthird kopiert! (TV-Bauchbinde, 920×145)'; }
  });

  const mutateTronStat = async (updater) => {
    if (!gaState) return;
    const cur = { ...(gaState.perAddonStats?.techtalk || {}) };
    cur.agendaText = document.getElementById('gaTronAgendaText')?.value ?? cur.agendaText ?? '';
    cur.tickerText = document.getElementById('gaTronTickerText')?.value ?? cur.tickerText ?? '';
    updater(cur);
    gaState.perAddonStats = { ...(gaState.perAddonStats || {}), techtalk: cur };
    const r = await window.omnichat.gameAddonsSave(gaState);
    if (r?.ok) {
      gaState = r.gameAddons;
      renderFields();
    }
  };
  document.getElementById('btnGaTronBugPlus')?.addEventListener('click', () => mutateTronStat((t) => { t.bugsFixed = Number(t.bugsFixed || 0) + 1; }));
  document.getElementById('btnGaTronCommitPlus')?.addEventListener('click', () => mutateTronStat((t) => { t.commits = Number(t.commits || 0) + 1; }));
  document.querySelectorAll('.ga-tron-phase-btn').forEach((b) => {
    b.addEventListener('click', () => mutateTronStat((t) => { t.phase = b.getAttribute('data-phase') || 'LIVE CODING'; }));
  });
  document.getElementById('btnGaTronPrevStep')?.addEventListener('click', () => mutateTronStat((t) => {
    const steps = String(t.agendaText || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    if (steps.length) t.activeAgendaIdx = (Number(t.activeAgendaIdx || 0) - 1 + steps.length) % steps.length;
  }));
  document.getElementById('btnGaTronNextStep')?.addEventListener('click', () => mutateTronStat((t) => {
    const steps = String(t.agendaText || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    if (steps.length) t.activeAgendaIdx = (Number(t.activeAgendaIdx || 0) + 1) % steps.length;
  }));
  document.getElementById('btnGaCopyTronTalkUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/tron-talk');
    if (statusEl) { statusEl.style.color = '#00f0ff'; statusEl.textContent = '🔗 http://127.0.0.1:4588/tron-talk kopiert! (TRON Bauchbinde, 980×170)'; }
  });
  document.getElementById('btnGaCopyTronHudUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/game-stats');
    if (statusEl) { statusEl.style.color = '#00f0ff'; statusEl.textContent = '🔗 http://127.0.0.1:4588/game-stats kopiert! (TRON HUD, 430×310)'; }
  });

  const mutateValStat = async (updater) => {
    if (!gaState) return;
    const cur = { ...(gaState.perAddonStats?.valorant || {}) };
    cur.mapCoverEnabled = Boolean(document.getElementById('gaValMapCover')?.checked);
    cur.mapCoverText = document.getElementById('gaValMapCoverText')?.value.trim() || 'RADAR VERDECKT // ANTI-SNIPE';
    updater(cur);
    gaState.perAddonStats = { ...(gaState.perAddonStats || {}), valorant: cur };
    const r = await window.omnichat.gameAddonsSave(gaState);
    if (r?.ok) {
      gaState = r.gameAddons;
      renderFields();
    }
  };
  document.getElementById('btnGaValWin')?.addEventListener('click', () => mutateValStat((v) => { v.wins = Number(v.wins || 0) + 1; v.rr = Math.min(100, Number(v.rr || 0) + 20); }));
  document.getElementById('btnGaValLoss')?.addEventListener('click', () => mutateValStat((v) => { v.losses = Number(v.losses || 0) + 1; v.rr = Math.max(0, Number(v.rr || 0) - 18); }));
  document.getElementById('btnGaValKillPlus')?.addEventListener('click', () => mutateValStat((v) => { v.kills = Number(v.kills || 0) + 1; }));
  document.getElementById('btnGaValDeathPlus')?.addEventListener('click', () => mutateValStat((v) => { v.deaths = Number(v.deaths || 0) + 1; }));
  document.getElementById('btnGaValRrPlus')?.addEventListener('click', () => mutateValStat((v) => { v.rr = Math.min(100, Number(v.rr || 0) + 20); }));
  document.getElementById('btnGaValRrMinus')?.addEventListener('click', () => mutateValStat((v) => { v.rr = Math.max(0, Number(v.rr || 0) - 20); }));
  document.getElementById('gaValMapCover')?.addEventListener('change', () => mutateValStat(() => {}));
  document.getElementById('btnGaCopyValBarUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/val-bar');
    if (statusEl) { statusEl.style.color = '#ff6b78'; statusEl.textContent = '🔗 http://127.0.0.1:4588/val-bar kopiert! (Valorant Rank/RR Bar, 560×125)'; }
  });
  document.getElementById('btnGaCopyValMapUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/val-map');
    if (statusEl) { statusEl.style.color = '#ff6b78'; statusEl.textContent = '🔗 http://127.0.0.1:4588/val-map kopiert! (Radar Anti-Snipe Cover, 310×310)'; }
  });
  document.getElementById('btnGaCopyJcQnaUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText('http://127.0.0.1:4588/jc-qna');
    if (statusEl) { statusEl.style.color = '#4ade80'; statusEl.textContent = '🔗 http://127.0.0.1:4588/jc-qna kopiert! (Viewer Q&A Spotlight, 640×220)'; }
  });
  document.getElementById('btnGaLolClearMatches')?.addEventListener('click', async () => {
    const res = await window.omnichat.gameAddonsLolRecordMatch({ clear: true });
    if (res?.ok) {
      gaState = res.gameAddons;
      if (statusEl) { statusEl.style.color = '#94a3b8'; statusEl.textContent = '🗑️ Match-Historie geleert.'; }
    }
  });

  window.omnichat.onGameAddonsUpdated((payload) => {
    if (!payload?.gameAddons) return;
    gaState = payload.gameAddons;
    allAddons = payload.addons || allAddons;
    if (!modal.classList.contains('hidden')) {
      if (selAddon) selAddon.value = gaState.selectedMode || 'auto';
      if (gameInput) gameInput.value = gaState.currentGameName || '';
      renderFields();
    }
  });
})();

// ======================================================
// OPTIONALER OBS SZENEN- & QUELLEN-EDITOR (WebSocket v5)
// ======================================================
(function initObsSceneEditorModal() {
  const modal = document.getElementById('obsSceneEditorModal');
  const btnOpen = document.getElementById('btnOpenSceneEditor');
  if (!modal) return;

  const btnClose = document.getElementById('btnCloseSceneEditor');
  const selScene = document.getElementById('seSelectScene');
  const newSceneInput = document.getElementById('seNewSceneName');
  const btnCreateScene = document.getElementById('btnSeCreateScene');
  const btnRefresh = document.getElementById('btnSeRefresh');
  const chkAutoPreview = document.getElementById('seAutoPreview');
  const vcamVideo = document.getElementById('seVirtualCamVideo');
  const previewImg = document.getElementById('sePreviewImg');
  const previewPlaceholder = document.getElementById('sePreviewPlaceholder');
  const canvasOverlay = document.getElementById('seCanvasOverlay');
  const sourcesList = document.getElementById('seSourcesList');
  const audioList = document.getElementById('seAudioList');
  const statusEl = document.getElementById('seStatus');

  const lblSelSource = document.getElementById('seSelectedSourceName');
  const btnRenameSelected = document.getElementById('btnSeRenameSelected');
  const renameBar = document.getElementById('seRenameBar');
  const inpRenameSource = document.getElementById('seRenameInput');
  const btnRenameSave = document.getElementById('btnSeRenameSave');
  const btnRenameCancel = document.getElementById('btnSeRenameCancel');
  const inpPosX = document.getElementById('sePosX');
  const inpPosY = document.getElementById('sePosY');
  const inpScalePct = document.getElementById('seScalePct');
  const btnApplyTransform = document.getElementById('btnSeApplyTransform');
  const btnCenter = document.getElementById('btnSeCenter');
  const btnFullscreen = document.getElementById('btnSeFullscreen');
  const btnLayerFront = document.getElementById('btnSeLayerFront');
  const btnLayerUp = document.getElementById('btnSeLayerUp');
  const btnLayerDown = document.getElementById('btnSeLayerDown');
  const btnLayerBack = document.getElementById('btnSeLayerBack');
  const rngTransparency = document.getElementById('seTransparencyRange');
  const inpTransparencyPct = document.getElementById('seTransparencyPct');
  const lblTransparencyReadout = document.getElementById('seTransparencyReadout');
  const transPresetBtns = Array.from(modal.querySelectorAll('.se-trans-preset'));

  let currentSceneName = '';
  let baseWidth = 1920;
  let baseHeight = 1080;
  let sceneItems = [];
  let selectedItem = null;
  let previewTimer = null;
  let dragState = null;
  let vcamStream = null;
  let vcamStartedByEditor = false;

  function setStatus(msg, color = '#94a3b8') {
    if (!statusEl) return;
    statusEl.style.color = color;
    statusEl.textContent = msg;
  }

  const sourceConfigBox = document.getElementById('seSourceConfigBox');
  const sourceConfigFields = document.getElementById('seSourceConfigFields');
  const btnRefreshSourceConfig = document.getElementById('btnSeRefreshSourceConfig');
  let configLoadSeq = 0;

  btnRefreshSourceConfig?.addEventListener('click', () => {
    if (selectedItem) loadInputConfig(selectedItem);
  });

  const PROP_LABELS = {
    type: '🎛️ Aufnahme-Modus',
    window: '🪟 Fenster',
    application: '📱 Anwendung',
    display_uuid: '🖥️ Bildschirm',
    display: '🖥️ Bildschirm',
    device: '📷 / 🎙️ Gerät',
    device_id: '📷 / 🎙️ Gerät'
  };

  async function loadInputConfig(item) {
    const seq = ++configLoadSeq;
    if (!sourceConfigBox || !sourceConfigFields) return;
    if (!item) {
      sourceConfigBox.style.display = 'none';
      sourceConfigFields.innerHTML = '';
      return;
    }
    const res = await window.omnichat.obsWsAction({
      action: 'inspect-input',
      inputName: item.sourceName
    });
    if (seq !== configLoadSeq) return;
    if (!res?.ok) {
      sourceConfigBox.style.display = 'none';
      sourceConfigFields.innerHTML = '';
      return;
    }

    const props = res.properties || {};
    const settings = res.inputSettings || {};
    const kLow = String(res.inputKind || '').toLowerCase();
    const propKeys = ['type', 'display_uuid', 'display', 'window', 'application', 'device', 'device_id']
      .filter((k) => Array.isArray(props[k]));
    const hasUrl = typeof settings.url === 'string' || kLow.includes('browser');
    const isImageFileSource = kLow.includes('image') || typeof settings.file === 'string';
    const isMediaFileSource = kLow.includes('ffmpeg') || kLow.includes('vlc') || typeof settings.local_file === 'string';
    const isTextSource = kLow.includes('text');
    const hasLocalFilePicker = (isImageFileSource || isMediaFileSource || isTextSource) && !hasUrl;

    sourceConfigFields.innerHTML = '';
    if (!propKeys.length && !hasUrl && !hasLocalFilePicker) {
      sourceConfigBox.style.display = 'none';
      return;
    }
    sourceConfigBox.style.display = 'block';

    propKeys.forEach((prop) => {
      const items = props[prop];
      if (res.inputKind === 'screen_capture') {
        const t = Number(settings.type || 0);
        if (prop === 'window' && t !== 1) return;
        if (prop === 'application' && t !== 2) return;
        if (prop === 'display' && t === 1) return;
      } else if (items.length === 0) {
        return;
      }

      const wrap = document.createElement('div');
      const lbl = document.createElement('label');
      lbl.style.fontSize = '10px';
      lbl.textContent = PROP_LABELS[prop] || prop;
      const sel = document.createElement('select');
      const valMap = new Map();
      let matched = false;
      items.forEach((p, idx) => {
        const key = String(idx);
        valMap.set(key, p.itemValue);
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = p.itemName || String(p.itemValue);
        if (p.itemEnabled === false) opt.disabled = true;
        if (settings[prop] !== undefined && settings[prop] !== null && (p.itemValue === settings[prop] || String(p.itemValue) === String(settings[prop]))) {
          opt.selected = true;
          matched = true;
        }
        sel.appendChild(opt);
      });
      if (!matched) {
        const ph = document.createElement('option');
        ph.value = '';
        ph.textContent = items.length ? '— Bitte wählen —' : '— Keine Einträge gefunden —';
        ph.selected = true;
        ph.disabled = true;
        sel.insertBefore(ph, sel.firstChild);
      }
      sel.addEventListener('change', async () => {
        if (!sel.value) return;
        const chosenVal = valMap.get(sel.value);
        const upd = await window.omnichat.obsWsAction({
          action: 'set-input-settings',
          inputName: item.sourceName,
          inputSettings: { [prop]: chosenVal }
        });
        if (upd?.ok) {
          setStatus(`✅ ${PROP_LABELS[prop] || prop} aktualisiert`, '#4ade80');
          if (prop === 'type') {
            await new Promise((r) => setTimeout(r, 300));
            await loadInputConfig(item);
          } else {
            await new Promise((r) => setTimeout(r, 250));
          }
          refreshPreview();
        } else {
          setStatus(`❌ ${upd?.error || 'Einstellung konnte nicht gespeichert werden.'}`, '#f87171');
        }
      });
      wrap.appendChild(lbl);
      wrap.appendChild(sel);
      sourceConfigFields.appendChild(wrap);
    });

    if (hasUrl) {
      if (builtinOverlaysCache.length) {
        const presetWrap = document.createElement('div');
        const presetLbl = document.createElement('label');
        presetLbl.style.fontSize = '10px';
        presetLbl.textContent = '⚡ App-Overlay zuweisen (ohne URL)';
        const presetSel = document.createElement('select');
        const customOpt = document.createElement('option');
        customOpt.value = '';
        customOpt.textContent = '— Eigene URL / Manuell —';
        presetSel.appendChild(customOpt);
        builtinOverlaysCache.forEach((ov) => {
          const opt = document.createElement('option');
          opt.value = ov.id;
          opt.textContent = ov.label;
          if (String(settings.url || '').replace(/\/$/, '') === String(ov.url || '').replace(/\/$/, '')) {
            opt.selected = true;
          }
          presetSel.appendChild(opt);
        });
        presetSel.addEventListener('change', async () => {
          const ov = builtinOverlaysCache.find((o) => o.id === presetSel.value);
          if (!ov) return;
          const upd = await window.omnichat.obsWsAction({
            action: 'set-input-settings',
            inputName: item.sourceName,
            inputSettings: {
              url: ov.url,
              width: ov.width,
              height: ov.height,
              ...(ov.rerouteAudio ? { reroute_audio: true } : {})
            }
          });
          if (upd?.ok) {
            setStatus(`✅ "${item.sourceName}" auf ${ov.label} gestellt!`, '#4ade80');
            await loadInputConfig(item);
            await loadSceneItems(currentSceneName);
            refreshPreview();
          }
        });
        presetWrap.appendChild(presetLbl);
        presetWrap.appendChild(presetSel);
        sourceConfigFields.appendChild(presetWrap);
      }

      const wrap = document.createElement('div');
      const lbl = document.createElement('label');
      lbl.style.fontSize = '10px';
      lbl.textContent = '🌐 Browser-URL';
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; gap: 6px;';
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.value = settings.url || '';
      const btn = document.createElement('button');
      btn.className = 'btn-sm';
      btn.textContent = '💾';
      btn.title = 'URL übernehmen';
      const applyUrl = async () => {
        const upd = await window.omnichat.obsWsAction({
          action: 'set-input-settings',
          inputName: item.sourceName,
          inputSettings: { url: inp.value.trim() }
        });
        if (upd?.ok) {
          setStatus('✅ URL aktualisiert', '#4ade80');
          refreshPreview();
        }
      };
      btn.addEventListener('click', applyUrl);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyUrl(); });
      row.appendChild(inp);
      row.appendChild(btn);
      wrap.appendChild(lbl);
      wrap.appendChild(row);
      sourceConfigFields.appendChild(wrap);
    }

    if (hasLocalFilePicker) {
      const wrap = document.createElement('div');
      const lbl = document.createElement('label');
      lbl.style.fontSize = '10px';
      const pickerKind = isImageFileSource ? 'image' : isMediaFileSource ? 'video' : 'text';
      const propSettingKey = isMediaFileSource
        ? 'local_file'
        : isTextSource
          ? 'text_file'
          : 'file';
      const currentFilePath =
        settings[propSettingKey] || settings.file || settings.local_file || settings.text_file || '';
      const curName = extractDisplayFileName(currentFilePath);

      lbl.textContent = isImageFileSource
        ? '🖼️ Bilddatei (Finder / Explorer)'
        : isMediaFileSource
          ? '🎬 Video- / Mediendatei (Finder / Explorer)'
          : '📄 Textdatei (Finder / Explorer)';

      const row = document.createElement('div');
      row.className = 'file-picker-row';

      const pickBtn = document.createElement('button');
      pickBtn.type = 'button';
      pickBtn.className = 'btn-sm';
      pickBtn.style.whiteSpace = 'nowrap';
      pickBtn.textContent = window.__appLang === 'en' ? '📂 Choose file…' : '📂 Datei wählen…';

      const badge = document.createElement('span');
      badge.className = `file-picker-badge${curName ? ' has-file' : ''}`;
      badge.textContent = curName || (window.__appLang === 'en' ? 'No file selected' : 'Keine Datei gewählt');
      badge.title = currentFilePath || '';

      pickBtn.addEventListener('click', async () => {
        const picked = await window.omnichat.pickLocalFile?.({ kind: pickerKind });
        if (!picked?.ok) return;
        const nextSettings = { [propSettingKey]: picked.filePath };
        if (isMediaFileSource) nextSettings.is_local_file = true;
        if (isTextSource) nextSettings.from_file = true;
        const upd = await window.omnichat.obsWsAction({
          action: 'set-input-settings',
          inputName: item.sourceName,
          inputSettings: nextSettings
        });
        if (upd?.ok) {
          badge.textContent = picked.fileName;
          badge.classList.add('has-file');
          badge.title = picked.filePath;
          setStatus(`✅ Datei gesetzt: ${picked.fileName}`, '#4ade80');
          await new Promise((r) => setTimeout(r, 250));
          refreshPreview();
        } else {
          setStatus(`❌ ${upd?.error || 'Datei konnte nicht gesetzt werden.'}`, '#f87171');
        }
      });

      row.appendChild(pickBtn);
      row.appendChild(badge);
      wrap.appendChild(lbl);
      wrap.appendChild(row);
      sourceConfigFields.appendChild(wrap);
    }

    if (hasUrl) {
      const localHtmlWrap = document.createElement('div');
      const localHtmlLbl = document.createElement('label');
      localHtmlLbl.style.fontSize = '10px';
      localHtmlLbl.textContent = '📂 Oder lokale Datei in Browser-Quelle laden';
      const localHtmlRow = document.createElement('div');
      localHtmlRow.className = 'file-picker-row';
      const localHtmlBtn = document.createElement('button');
      localHtmlBtn.type = 'button';
      localHtmlBtn.className = 'btn-sm';
      localHtmlBtn.style.whiteSpace = 'nowrap';
      localHtmlBtn.textContent = window.__appLang === 'en' ? '📂 Choose file…' : '📂 Datei wählen…';
      const localHtmlBadge = document.createElement('span');
      localHtmlBadge.className = `file-picker-badge${settings.local_file ? ' has-file' : ''}`;
      localHtmlBadge.textContent = settings.local_file
        ? extractDisplayFileName(settings.local_file)
        : (window.__appLang === 'en' ? 'Optional local HTML/image' : 'Optional: lokale HTML/Bilddatei');
      localHtmlBtn.addEventListener('click', async () => {
        const picked = await window.omnichat.pickLocalFile?.({ kind: 'any' });
        if (!picked?.ok) return;
        const upd = await window.omnichat.obsWsAction({
          action: 'set-input-settings',
          inputName: item.sourceName,
          inputSettings: { is_local_file: true, local_file: picked.filePath }
        });
        if (upd?.ok) {
          localHtmlBadge.textContent = picked.fileName;
          localHtmlBadge.classList.add('has-file');
          setStatus(`✅ Lokale Datei geladen: ${picked.fileName}`, '#4ade80');
          await new Promise((r) => setTimeout(r, 250));
          refreshPreview();
        }
      });
      localHtmlRow.appendChild(localHtmlBtn);
      localHtmlRow.appendChild(localHtmlBadge);
      localHtmlWrap.appendChild(localHtmlLbl);
      localHtmlWrap.appendChild(localHtmlRow);
      sourceConfigFields.appendChild(localHtmlWrap);
    }
  }

  function isHiddenTransitionItem(it) {
    const n = String(it?.sourceName || '');
    return n === 'OmniGrid Scene Transition' || n === 'OmniGrid Singed Transition';
  }

  function isAudioOnlyItem(it) {
    if (!it) return false;
    const k = String(it.inputKind || '').toLowerCase();
    if (k.includes('audio') || k === 'sck_audio_capture') return true;
    const tr = it.transform || {};
    const hasNoVideoSize =
      Number(tr.sourceWidth || 0) === 0 &&
      Number(tr.sourceHeight || 0) === 0 &&
      Number(tr.width || 0) === 0 &&
      Number(tr.height || 0) === 0;
    if (hasNoVideoSize && !/screen|window|display|browser|image|ffmpeg|color|text|avcapture|av_capture|dshow|game/i.test(k)) {
      return true;
    }
    return false;
  }

  function updateLayerButtonsState(item) {
    const uiIdx = item ? sceneItems.findIndex((x) => x.sceneItemId === item.sceneItemId) : -1;
    const hasItem = uiIdx >= 0 && sceneItems.length > 1;
    const isTop = uiIdx === 0;
    const isBottom = uiIdx === sceneItems.length - 1;
    if (btnLayerFront) btnLayerFront.disabled = !hasItem || isTop;
    if (btnLayerUp) btnLayerUp.disabled = !hasItem || isTop;
    if (btnLayerDown) btnLayerDown.disabled = !hasItem || isBottom;
    if (btnLayerBack) btnLayerBack.disabled = !hasItem || isBottom;
  }

  async function moveItemLayer(item, mode, explicitObsIndex = null) {
    if (!item || !currentSceneName) return;
    const res = await window.omnichat.obsWsAction({
      action: 'reorder-scene-item',
      sceneName: currentSceneName,
      sceneItemId: item.sceneItemId,
      mode,
      sceneItemIndex: explicitObsIndex
    });
    if (res?.ok) {
      const labels = {
        front: 'ganz in den Vordergrund geholt',
        up: 'eine Ebene nach vorne geschoben',
        down: 'eine Ebene nach hinten geschoben',
        back: 'ganz in den Hintergrund geschoben',
        index: 'neu angeordnet'
      };
      setStatus(`✅ "${item.sourceName}" ${labels[mode] || 'verschoben'}.`, '#4ade80');
      await loadSceneItems(currentSceneName);
      refreshPreview();
    } else {
      setStatus(`❌ ${res?.error || 'Ebenen-Reihenfolge konnte nicht geändert werden.'}`, '#f87171');
    }
  }

  let transparencyThrottleTimer = null;
  let pendingTransparencyCall = null;

  function formatVisibleReadout(transPct) {
    const vis = Math.max(0, Math.min(100, 100 - Math.round(Number(transPct) || 0)));
    return window.__appLang === 'en' ? `${vis}% visible` : `${vis}% sichtbar`;
  }

  function syncSelectedTransparencyUI(transPct) {
    const pct = Math.max(0, Math.min(100, Math.round(Number(transPct) || 0)));
    const vis = 100 - pct;
    if (rngTransparency) rngTransparency.value = String(vis);
    if (inpTransparencyPct) inpTransparencyPct.value = String(vis);
    if (lblTransparencyReadout) lblTransparencyReadout.textContent = formatVisibleReadout(pct);
  }

  async function applyItemTransparency(item, rawPct, { commitPreview = false, skipListRebuild = false } = {}) {
    if (!item?.sourceName) return;
    const pct = Math.max(0, Math.min(100, Math.round(Number(rawPct) || 0)));
    const vis = 100 - pct;
    sceneItems.forEach((x) => {
      if (x.sourceName === item.sourceName) x.transparencyPct = pct;
    });
    if (selectedItem?.sourceName === item.sourceName) {
      selectedItem.transparencyPct = pct;
      syncSelectedTransparencyUI(pct);
    }
    renderCanvasOverlay();
    if (!skipListRebuild) renderSourcesList();

    const sendNow = async () => {
      const res = await window.omnichat.obsWsAction({
        action: 'set-source-transparency',
        sourceName: item.sourceName,
        transparencyPct: pct
      });
      if (res?.ok) {
        if (commitPreview) {
          setStatus(
            window.__appLang === 'en'
              ? `✅ "${item.sourceName}": Opacity set to ${vis}%.`
              : `✅ „${item.sourceName}“: Sichtbarkeit auf ${vis}% gesetzt.`,
            '#4ade80'
          );
          setTimeout(refreshPreview, 120);
        }
      } else if (commitPreview) {
        setStatus(`❌ ${res?.error || (window.__appLang === 'en' ? 'Could not set opacity in OBS.' : 'Sichtbarkeit konnte in OBS nicht gesetzt werden.')}`, '#f87171');
      }
    };

    if (commitPreview) {
      if (transparencyThrottleTimer) {
        clearTimeout(transparencyThrottleTimer);
        transparencyThrottleTimer = null;
      }
      pendingTransparencyCall = null;
      await sendNow();
      return;
    }

    pendingTransparencyCall = sendNow;
    if (!transparencyThrottleTimer) {
      transparencyThrottleTimer = setTimeout(async () => {
        transparencyThrottleTimer = null;
        const fn = pendingTransparencyCall;
        pendingTransparencyCall = null;
        if (fn) await fn();
      }, 75);
    }
  }

  function closeToolbarRenameBar() {
    renameBar?.classList.add('hidden');
  }

  async function performSourceRename(item, rawNewName) {
    if (!item?.sourceName) return false;
    const oldName = item.sourceName;
    const newName = String(rawNewName || '').trim();
    if (!newName || newName === oldName) {
      closeToolbarRenameBar();
      return false;
    }
    const res = await window.omnichat.obsWsAction({
      action: 'rename-source',
      oldName,
      newName,
      inputKind: item.inputKind || ''
    });
    if (res?.ok) {
      closeToolbarRenameBar();
      setStatus(`✅ Quelle "${oldName}" in "${newName}" umbenannt.`, '#4ade80');
      await Promise.all([loadSceneItems(currentSceneName), loadAudioInputs()]);
      const renamedItem =
        sceneItems.find((x) => x.sceneItemId === item.sceneItemId) ||
        sceneItems.find((x) => x.sourceName === newName) ||
        null;
      if (renamedItem) {
        selectSourceItem(renamedItem);
        renderSourcesList();
        renderCanvasOverlay();
      }
      return true;
    }
    setStatus(`❌ ${res?.error || 'Quelle konnte nicht umbenannt werden.'}`, '#f87171');
    return false;
  }

  function selectSourceItem(item) {
    if (selectedItem?.sceneItemId !== item?.sceneItemId) {
      closeToolbarRenameBar();
    }
    selectedItem = item;
    const disabled = !item || isAudioOnlyItem(item);
    if (btnRenameSelected) btnRenameSelected.disabled = !item;
    [inpPosX, inpPosY, inpScalePct, btnApplyTransform, btnCenter, btnFullscreen, rngTransparency, inpTransparencyPct].forEach((el) => {
      if (el) el.disabled = disabled;
    });
    transPresetBtns.forEach((b) => { b.disabled = disabled; });
    updateLayerButtonsState(item);
    if (!item) {
      if (lblSelSource) lblSelSource.textContent = '— Quelle anklicken —';
      syncSelectedTransparencyUI(0);
      loadInputConfig(null);
      return;
    }
    if (lblSelSource) lblSelSource.textContent = item.sourceName;
    const tr = item.transform || {};
    if (inpPosX) inpPosX.value = String(Math.round(tr.positionX || 0));
    if (inpPosY) inpPosY.value = String(Math.round(tr.positionY || 0));
    if (inpScalePct) inpScalePct.value = String(Math.round((tr.scaleX || 1) * 100));
    syncSelectedTransparencyUI(item.transparencyPct || 0);
    loadInputConfig(item);
  }

  function getItemBoxPx(it) {
    const tr = it.transform || {};
    const x = Number(tr.positionX || 0);
    const y = Number(tr.positionY || 0);
    const w = Math.max(40, Number(tr.width || (tr.sourceWidth || 400) * (tr.scaleX || 1)));
    const h = Math.max(30, Number(tr.height || (tr.sourceHeight || 225) * (tr.scaleY || 1)));
    return { x, y, w, h };
  }

  function renderCanvasOverlay() {
    if (!canvasOverlay) return;
    canvasOverlay.innerHTML = '';
    // Render bottom-to-top (reverse of top-to-bottom list) so top OBS layer sits on top
    const drawOrder = sceneItems.slice().reverse();
    drawOrder.forEach((it) => {
      if (!it.sceneItemEnabled || isAudioOnlyItem(it) || isHiddenTransitionItem(it)) return;
      const { x, y, w, h } = getItemBoxPx(it);
      const isSel = selectedItem?.sceneItemId === it.sceneItemId;

      const box = document.createElement('div');
      box.style.cssText = `
        position: absolute;
        left: ${(x / baseWidth) * 100}%;
        top: ${(y / baseHeight) * 100}%;
        width: ${(w / baseWidth) * 100}%;
        height: ${(h / baseHeight) * 100}%;
        border: ${isSel ? '2px solid #38bdf8' : '1px dashed rgba(255,255,255,0.32)'};
        background: ${isSel ? 'rgba(56,189,248,0.12)' : 'transparent'};
        box-sizing: border-box;
        cursor: move;
      `;

      const tag = document.createElement('div');
      tag.style.cssText = `position:absolute; top:2px; left:2px; font-size:10px; font-weight:700; padding:1px 5px; border-radius:4px; background:${isSel ? '#0284c7' : 'rgba(15,23,42,0.78)'}; color:#f8fafc; pointer-events:none; white-space:nowrap; max-width:95%; overflow:hidden; text-overflow:ellipsis;`;
      const trPct = Number(it.transparencyPct || 0);
      tag.textContent = trPct > 0 ? `${it.sourceName} • 💧${100 - trPct}%` : it.sourceName;
      box.appendChild(tag);

      box.addEventListener('mousedown', (e) => {
        if (e.target.dataset.handle) return;
        e.preventDefault();
        e.stopPropagation();
        selectSourceItem(it);
        renderSourcesList();
        renderCanvasOverlay();
        const rect = canvasOverlay.getBoundingClientRect();
        dragState = {
          mode: 'move',
          item: it,
          startMouseX: e.clientX,
          startMouseY: e.clientY,
          rect,
          origX: x,
          origY: y,
          origW: w,
          origH: h
        };
      });

      if (isSel) {
        const corners = [
          { id: 'nw', css: 'top:-5px; left:-5px; cursor:nwse-resize;' },
          { id: 'ne', css: 'top:-5px; right:-5px; cursor:nesw-resize;' },
          { id: 'sw', css: 'bottom:-5px; left:-5px; cursor:nesw-resize;' },
          { id: 'se', css: 'bottom:-5px; right:-5px; cursor:nwse-resize;' }
        ];
        corners.forEach((c) => {
          const hnd = document.createElement('div');
          hnd.dataset.handle = c.id;
          hnd.style.cssText = `position:absolute; width:10px; height:10px; border-radius:2px; background:#38bdf8; border:1px solid #020617; ${c.css}`;
          hnd.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = canvasOverlay.getBoundingClientRect();
            dragState = {
              mode: 'resize',
              corner: c.id,
              item: it,
              startMouseX: e.clientX,
              startMouseY: e.clientY,
              rect,
              origX: x,
              origY: y,
              origW: w,
              origH: h
            };
          });
          box.appendChild(hnd);
        });
      }

      canvasOverlay.appendChild(box);
    });
  }

  window.addEventListener('mousemove', (e) => {
    if (!dragState) return;
    const dxCanvas = ((e.clientX - dragState.startMouseX) / dragState.rect.width) * baseWidth;
    const dyCanvas = ((e.clientY - dragState.startMouseY) / dragState.rect.height) * baseHeight;
    const it = dragState.item;
    const tr = it.transform || {};

    if (dragState.mode === 'move') {
      tr.positionX = Math.round(dragState.origX + dxCanvas);
      tr.positionY = Math.round(dragState.origY + dyCanvas);
      if (inpPosX) inpPosX.value = String(tr.positionX);
      if (inpPosY) inpPosY.value = String(tr.positionY);
    } else if (dragState.mode === 'resize') {
      const c = dragState.corner;
      let newX = dragState.origX;
      let newY = dragState.origY;
      let newW = dragState.origW;
      let newH = dragState.origH;

      if (c.includes('e')) newW = Math.max(40, dragState.origW + dxCanvas);
      if (c.includes('s')) newH = Math.max(30, dragState.origH + dyCanvas);
      if (c.includes('w')) {
        newW = Math.max(40, dragState.origW - dxCanvas);
        newX = dragState.origX + (dragState.origW - newW);
      }
      if (c.includes('n')) {
        newH = Math.max(30, dragState.origH - dyCanvas);
        newY = dragState.origY + (dragState.origH - newH);
      }

      // Preserve aspect ratio by default
      const ratio = dragState.origW / Math.max(1, dragState.origH);
      newH = Math.max(30, newW / ratio);
      if (c.includes('n')) newY = dragState.origY + (dragState.origH - newH);

      tr.positionX = Math.round(newX);
      tr.positionY = Math.round(newY);
      tr.width = Math.round(newW);
      tr.height = Math.round(newH);

      const srcW = Number(tr.sourceWidth || dragState.origW / Math.max(0.05, tr.scaleX || 1));
      const srcH = Number(tr.sourceHeight || dragState.origH / Math.max(0.05, tr.scaleY || 1));
      tr.scaleX = Math.max(0.05, newW / Math.max(1, srcW));
      tr.scaleY = Math.max(0.05, newH / Math.max(1, srcH));
      if (inpPosX) inpPosX.value = String(tr.positionX);
      if (inpPosY) inpPosY.value = String(tr.positionY);
      if (inpScalePct) inpScalePct.value = String(Math.round(tr.scaleX * 100));
    }
    it.transform = tr;
    renderCanvasOverlay();
  });

  window.addEventListener('mouseup', async () => {
    if (!dragState) return;
    const finished = dragState;
    dragState = null;
    const tr = finished.item.transform || {};
    const payloadTransform = {
      positionX: Number(tr.positionX || 0),
      positionY: Number(tr.positionY || 0)
    };
    if (finished.mode === 'resize') {
      if (tr.boundsType && tr.boundsType !== 'OBS_BOUNDS_NONE') {
        payloadTransform.boundsWidth = Math.max(20, Number(tr.width || 100));
        payloadTransform.boundsHeight = Math.max(20, Number(tr.height || 100));
      } else {
        payloadTransform.scaleX = Math.max(0.05, Number(tr.scaleX || 1));
        payloadTransform.scaleY = Math.max(0.05, Number(tr.scaleY || 1));
      }
    }
    const res = await window.omnichat.obsWsAction({
      action: 'set-scene-item-transform',
      sceneName: currentSceneName,
      sceneItemId: finished.item.sceneItemId,
      transform: payloadTransform
    });
    if (res?.ok) {
      setStatus(`✅ "${finished.item.sourceName}" in OBS aktualisiert.`, '#4ade80');
      refreshPreview();
    } else {
      setStatus(`❌ ${res?.error || 'OBS Update fehlgeschlagen'}`, '#f87171');
    }
  });

  let isFetchingPreview = false;
  async function refreshPreview() {
    if (modal.classList.contains('hidden') || isFetchingPreview || !currentSceneName) return;
    isFetchingPreview = true;
    try {
      const res = await window.omnichat.obsWsAction({ action: 'get-screenshot', sceneName: currentSceneName });
      if (res?.ok && res.imageData && previewImg) {
        previewImg.src = res.imageData;
        previewImg.style.display = 'block';
        if (previewPlaceholder) previewPlaceholder.style.display = 'none';
      }
    } finally {
      isFetchingPreview = false;
    }
  }

  let draggedSourceItemId = null;

  function renderSourcesList() {
    if (!sourcesList) return;
    sourcesList.innerHTML = '';
    const visibleItems = sceneItems.filter((it) => !isHiddenTransitionItem(it));
    const total = visibleItems.length;
    visibleItems.forEach((it, uiIdx) => {
      const row = document.createElement('div');
      row.draggable = total > 1;
      row.style.cssText = `display:flex; align-items:center; justify-content:space-between; gap:4px; padding:5px 8px; border-radius:7px; background:rgba(30,41,59,0.8); border:1px solid ${selectedItem?.sceneItemId === it.sceneItemId ? '#38bdf8' : 'rgba(148,163,184,0.18)'}; font-size:12px; cursor:pointer;`;

      const grip = document.createElement('span');
      grip.textContent = '⠿';
      grip.title = 'Ziehen zum Sortieren (oben = Vordergrund, unten = Hintergrund)';
      grip.style.cssText = 'color:#64748b; font-size:12px; cursor:grab; user-select:none; padding-right:2px;';

      const nameSpan = document.createElement('span');
      nameSpan.style.cssText = 'flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;';
      nameSpan.textContent = it.sourceName;
      nameSpan.title = `${it.sourceName} (Doppelklick zum Umbenennen)`;
      nameSpan.addEventListener('click', () => {
        selectSourceItem(it);
        renderSourcesList();
        renderCanvasOverlay();
      });

      const startInlineRename = (e) => {
        if (e) e.stopPropagation();
        if (row.dataset.renaming === '1') return;
        row.dataset.renaming = '1';
        row.draggable = false;

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = it.sourceName;
        editInput.style.cssText = 'flex:1; min-width:80px; font-size:11.5px; padding:2px 6px;';
        editInput.addEventListener('click', (ev) => ev.stopPropagation());
        editInput.addEventListener('mousedown', (ev) => ev.stopPropagation());

        let finished = false;
        const finishInline = async (commit) => {
          if (finished) return;
          finished = true;
          row.dataset.renaming = '0';
          row.draggable = total > 1;
          if (commit) {
            const ok = await performSourceRename(it, editInput.value);
            if (ok) return;
          }
          if (editInput.parentNode === row) {
            row.replaceChild(nameSpan, editInput);
          }
        };

        editInput.addEventListener('keydown', (ev) => {
          ev.stopPropagation();
          if (ev.key === 'Enter') {
            ev.preventDefault();
            finishInline(true);
          } else if (ev.key === 'Escape') {
            ev.preventDefault();
            finishInline(false);
          }
        });
        editInput.addEventListener('blur', () => finishInline(true));

        row.replaceChild(editInput, nameSpan);
        editInput.focus();
        editInput.select();
      };

      nameSpan.addEventListener('dblclick', startInlineRename);

      row.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
        selectSourceItem(it);
        renderSourcesList();
        renderCanvasOverlay();
      });

      row.addEventListener('dragstart', (e) => {
        draggedSourceItemId = it.sceneItemId;
        row.style.opacity = '0.5';
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
      });
      row.addEventListener('dragend', () => {
        draggedSourceItemId = null;
        row.style.opacity = '1';
      });
      row.addEventListener('dragover', (e) => {
        if (draggedSourceItemId === null || draggedSourceItemId === it.sceneItemId) return;
        e.preventDefault();
        row.style.borderColor = '#38bdf8';
      });
      row.addEventListener('dragleave', () => {
        row.style.borderColor = selectedItem?.sceneItemId === it.sceneItemId ? '#38bdf8' : 'rgba(148,163,184,0.18)';
      });
      row.addEventListener('drop', async (e) => {
        e.preventDefault();
        const srcItem = sceneItems.find((x) => x.sceneItemId === draggedSourceItemId);
        draggedSourceItemId = null;
        if (!srcItem || srcItem.sceneItemId === it.sceneItemId) return;
        const realIdx = sceneItems.indexOf(it);
        const targetObsIdx = Math.max(0, sceneItems.length - 1 - (realIdx >= 0 ? realIdx : uiIdx));
        await moveItemLayer(srcItem, 'index', targetObsIdx);
      });

      const upBtn = document.createElement('button');
      upBtn.className = 'btn-sm';
      upBtn.style.padding = '2px 5px';
      upBtn.textContent = '🔼';
      upBtn.disabled = uiIdx === 0;
      upBtn.title = 'Eine Ebene nach vorne (Klick mit Shift = ganz nach vorne)';
      upBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await moveItemLayer(it, e.shiftKey ? 'front' : 'up');
      });

      const downBtn = document.createElement('button');
      downBtn.className = 'btn-sm';
      downBtn.style.padding = '2px 5px';
      downBtn.textContent = '🔽';
      downBtn.disabled = uiIdx === total - 1;
      downBtn.title = 'Eine Ebene nach hinten (Klick mit Shift = ganz nach hinten)';
      downBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await moveItemLayer(it, e.shiftKey ? 'back' : 'down');
      });

      const eyeBtn = document.createElement('button');
      eyeBtn.className = 'btn-sm';
      eyeBtn.style.padding = '2px 7px';
      eyeBtn.textContent = it.sceneItemEnabled ? '👁️' : '🚫';
      eyeBtn.title = it.sceneItemEnabled ? 'Quelle ausblenden' : 'Quelle einblenden';
      eyeBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await window.omnichat.obsWsAction({
          action: 'set-scene-item-enabled',
          sceneName: currentSceneName,
          sceneItemId: it.sceneItemId,
          enabled: !it.sceneItemEnabled
        });
        await loadSceneItems(currentSceneName);
        refreshPreview();
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-sm warn';
      delBtn.style.padding = '2px 6px';
      delBtn.textContent = '🗑️';
      delBtn.title = 'Quelle aus Szene entfernen';
      delBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await window.omnichat.obsWsAction({
          action: 'remove-scene-item',
          sceneName: currentSceneName,
          sceneItemId: it.sceneItemId
        });
        if (selectedItem?.sceneItemId === it.sceneItemId) selectSourceItem(null);
        await loadSceneItems(currentSceneName);
        refreshPreview();
      });

      row.appendChild(grip);
      row.appendChild(nameSpan);

      if (!isAudioOnlyItem(it)) {
        const transWrap = document.createElement('div');
        transWrap.style.cssText = 'display:flex; align-items:center; gap:3px; padding:0 3px;';
        transWrap.title = window.__appLang === 'en'
          ? 'Opacity of this source (100% = fully visible, 0% = invisible)'
          : 'Sichtbarkeit dieser Quelle (100% = voll sichtbar, 0% = unsichtbar)';

        const initTrans = Math.max(0, Math.min(100, Number(it.transparencyPct || 0)));
        const initVis = 100 - initTrans;
        const miniSlider = document.createElement('input');
        miniSlider.type = 'range';
        miniSlider.min = '0';
        miniSlider.max = '100';
        miniSlider.step = '1';
        miniSlider.value = String(initVis);
        miniSlider.style.cssText = 'width:54px; cursor:pointer;';

        const miniBadge = document.createElement('span');
        miniBadge.style.cssText = `font-size:10px; min-width:30px; text-align:right; font-variant-numeric:tabular-nums; color:${initVis < 100 ? '#38bdf8' : '#64748b'}; font-weight:${initVis < 100 ? '700' : '500'};`;
        miniBadge.textContent = `${initVis}%`;

        miniSlider.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          row.draggable = false;
        });
        miniSlider.addEventListener('mouseup', () => {
          row.draggable = total > 1;
        });
        miniSlider.addEventListener('click', (e) => e.stopPropagation());
        miniSlider.addEventListener('input', (e) => {
          e.stopPropagation();
          const vis = Math.max(0, Math.min(100, parseInt(miniSlider.value || '100', 10)));
          const p = 100 - vis;
          miniBadge.textContent = `${vis}%`;
          miniBadge.style.color = vis < 100 ? '#38bdf8' : '#64748b';
          miniBadge.style.fontWeight = vis < 100 ? '700' : '500';
          applyItemTransparency(it, p, { commitPreview: false, skipListRebuild: true });
        });
        miniSlider.addEventListener('change', (e) => {
          e.stopPropagation();
          row.draggable = total > 1;
          const vis = Math.max(0, Math.min(100, parseInt(miniSlider.value || '100', 10)));
          const p = 100 - vis;
          applyItemTransparency(it, p, { commitPreview: true, skipListRebuild: false });
        });

        transWrap.appendChild(miniSlider);
        transWrap.appendChild(miniBadge);
        row.appendChild(transWrap);
      }

      const renameBtn = document.createElement('button');
      renameBtn.className = 'btn-sm';
      renameBtn.style.padding = '2px 5px';
      renameBtn.textContent = '✏️';
      renameBtn.title = 'Quelle umbenennen (oder Doppelklick auf den Namen)';
      renameBtn.addEventListener('click', startInlineRename);

      row.appendChild(renameBtn);
      row.appendChild(upBtn);
      row.appendChild(downBtn);
      row.appendChild(eyeBtn);
      row.appendChild(delBtn);
      sourcesList.appendChild(row);
    });
  }

  async function loadSceneItems(sceneName) {
    if (!sourcesList) return;
    const res = await window.omnichat.obsWsAction({ action: 'get-scene-items', sceneName });
    if (!res?.ok) {
      setStatus(`⚠️ ${res?.error || 'OBS nicht verbunden.'}`, '#fbbf24');
      sourcesList.innerHTML = '';
      if (canvasOverlay) canvasOverlay.innerHTML = '';
      return;
    }
    currentSceneName = res.sceneName;
    baseWidth = Number(res.baseWidth || 1920);
    baseHeight = Number(res.baseHeight || 1080);
    sceneItems = Array.isArray(res.items) ? res.items : [];
    if (selectedItem) {
      const updated = sceneItems.find((x) => x.sceneItemId === selectedItem.sceneItemId) || null;
      selectSourceItem(updated);
    }
    renderSourcesList();
    renderCanvasOverlay();
  }

  async function loadAudioInputs() {
    if (!audioList) return;
    const res = await window.omnichat.obsWsAction({ action: 'get-audio-inputs' });
    if (!res?.ok) { audioList.innerHTML = ''; return; }
    audioList.innerHTML = '';
    const list = res.inputs || [];
    if (!list.length) {
      const empty = document.createElement('div');
      empty.style.cssText = 'font-size:11px; color:#94a3b8; padding:6px 4px;';
      empty.textContent = 'Keine Audio-Geräte in OBS gefunden.';
      audioList.appendChild(empty);
      return;
    }
    list.forEach((inp) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex; flex-direction:column; gap:5px; padding:6px 8px; border-radius:7px; background:rgba(30,41,59,0.75); border:1px solid rgba(148,163,184,0.16); font-size:11px;';

      const row = document.createElement('div');
      row.style.cssText = 'display:flex; align-items:center; gap:6px;';
      const lbl = document.createElement('span');
      lbl.style.cssText = 'flex:1; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;';
      const icon = /output/i.test(inp.inputKind || '') ? '🔊 ' : '🎙️ ';
      lbl.textContent = icon + inp.inputName;

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '1';
      slider.step = '0.02';
      slider.value = String(Math.min(1, Math.max(0, inp.volumeMul ?? 1)));
      slider.style.width = '85px';
      slider.addEventListener('change', async () => {
        await window.omnichat.obsWsAction({ action: 'set-input-volume', inputName: inp.inputName, volumeMul: parseFloat(slider.value) });
      });

      const muteBtn = document.createElement('button');
      muteBtn.className = 'btn-sm';
      muteBtn.style.padding = '2px 6px';
      muteBtn.textContent = inp.muted ? '🔇' : '🔊';
      muteBtn.addEventListener('click', async () => {
        await window.omnichat.obsWsAction({ action: 'toggle-mic', inputName: inp.inputName });
        loadAudioInputs();
      });

      const vodBtn = document.createElement('button');
      vodBtn.className = 'btn-sm';
      const isMusicLocked = Boolean(inp.isMusicGuess);
      const isMusicOnly = isMusicLocked || Boolean(inp.vodExcluded);
      vodBtn.disabled = isMusicLocked;
      vodBtn.style.cssText = isMusicLocked
        ? 'padding:2px 6px; font-size:10px; background:rgba(168,85,247,0.28); border-color:#a855f7; color:#e9d5ff; white-space:nowrap; opacity:0.88; cursor:not-allowed;'
        : isMusicOnly
          ? 'padding:2px 6px; font-size:10px; background:rgba(168,85,247,0.25); border-color:#a855f7; color:#e9d5ff; white-space:nowrap;'
          : 'padding:2px 6px; font-size:10px; color:#94a3b8; white-space:nowrap;';
      vodBtn.textContent = isMusicLocked ? '🔒 Nur Live' : isMusicOnly ? '🎵 Nur Live' : '✅ +VOD';
      vodBtn.title = isMusicLocked
        ? 'Musik-Spur fest gesperrt: immer nur im Live-Stream (Spur 1), niemals im VOD (Spur 2)'
        : isMusicOnly
          ? 'Spur 1 (Live) AN • Spur 2 (VOD/Abruf) AUS — Musik landet nicht im VOD (klicken zum Ändern)'
          : 'Spur 1 (Live) & Spur 2 (VOD) AN — klicken, um diese Quelle vom VOD/Abruf auszuschließen (DMCA-Schutz)';
      if (!isMusicLocked) {
        vodBtn.addEventListener('click', async () => {
          const nextMusicOnly = !isMusicOnly;
          const r = await window.omnichat.obsWsAction({
            action: 'set-input-vod-music-only',
            inputName: inp.inputName,
            musicOnly: nextMusicOnly
          });
          if (r?.ok) {
            setStatus(
              nextMusicOnly
                ? `🛡️ „${inp.inputName}“ jetzt auf separater Musik-Spur (Nur Live, NICHT im VOD)!`
                : `✅ „${inp.inputName}“ wieder im Live-Stream & VOD aktiv.`,
              nextMusicOnly ? '#c084fc' : '#4ade80'
            );
            loadAudioInputs();
          }
        });
      }

      row.append(lbl, slider, muteBtn, vodBtn);
      wrap.appendChild(row);

      if (Array.isArray(inp.devices) && inp.devices.length) {
        const devSel = document.createElement('select');
        devSel.style.cssText = 'width:100%; font-size:10.5px; padding:3px 6px; border-radius:5px;';
        devSel.title = 'Audio-Gerät für diese OBS-Quelle auswählen';
        inp.devices.forEach((d) => {
          const opt = document.createElement('option');
          opt.value = d.value;
          opt.textContent = d.name;
          if (d.value === inp.currentDeviceId) opt.selected = true;
          devSel.appendChild(opt);
        });
        devSel.addEventListener('change', async () => {
          const r = await window.omnichat.obsWsAction({
            action: 'set-input-audio-device',
            inputName: inp.inputName,
            deviceId: devSel.value,
            propertyName: inp.devicePropName || 'device_id'
          });
          setStatus(
            r?.ok ? `🎚️ Audio-Gerät für „${inp.inputName}“ gewechselt!` : `⚠️ ${r?.error || 'Gerätewechsel fehlgeschlagen.'}`,
            r?.ok ? '#4ade80' : '#f87171'
          );
        });
        wrap.appendChild(devSel);
      }

      audioList.appendChild(wrap);
    });
  }

  async function refreshAll() {
    const sidebarSel = document.getElementById('selObsScene');
    if (selScene && sidebarSel) {
      selScene.textContent = '';
      Array.from(sidebarSel.options).forEach((srcOpt) => {
        const opt = document.createElement('option');
        opt.value = srcOpt.value;
        opt.textContent = srcOpt.textContent;
        selScene.appendChild(opt);
      });
      selScene.value = sidebarSel.value;
      currentSceneName = selScene.value || '';
    }
    if (!currentSceneName) {
      setStatus('⚠️ Bitte zuerst in Config → OBS WebSocket v5 verbinden.', '#fbbf24');
      return;
    }
    setStatus('');
    await Promise.all([loadSceneItems(currentSceneName), loadAudioInputs(), refreshPreview()]);
    if (transitionsViewOpen) await loadTransitionsPanel();
  }

  async function startVirtualCamPreview() {
    if (!chkAutoPreview?.checked || modal.classList.contains('hidden')) return false;
    try {
      const startRes = await window.omnichat.obsWsAction({ action: 'start-virtual-cam' });
      if (startRes?.ok && startRes.startedByEditor) vcamStartedByEditor = true;

      // Give OBS Virtual Camera a brief moment to initialize if freshly started
      if (startRes?.startedByEditor) await new Promise((r) => setTimeout(r, 450));

      let devices = await navigator.mediaDevices.enumerateDevices();
      let vcamDev = devices.find((d) => d.kind === 'videoinput' && /obs.*virtual/i.test(d.label || ''));
      if (!vcamDev) {
        // Request permission once so device labels become visible
        try {
          const tmp = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          tmp.getTracks().forEach((t) => t.stop());
          devices = await navigator.mediaDevices.enumerateDevices();
          vcamDev = devices.find((d) => d.kind === 'videoinput' && /obs.*virtual/i.test(d.label || ''));
        } catch (e) {}
      }
      if (!vcamDev || !vcamVideo) return false;

      vcamStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: vcamDev.deviceId }, width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
        audio: false
      });
      vcamVideo.srcObject = vcamStream;
      vcamVideo.style.display = 'block';
      if (previewImg) previewImg.style.display = 'none';
      if (previewPlaceholder) previewPlaceholder.style.display = 'none';
      clearInterval(previewTimer);
      return true;
    } catch (e) {
      return false;
    }
  }

  async function stopVirtualCamPreview() {
    if (vcamStream) {
      vcamStream.getTracks().forEach((t) => t.stop());
      vcamStream = null;
    }
    if (vcamVideo) {
      vcamVideo.srcObject = null;
      vcamVideo.style.display = 'none';
    }
    if (vcamStartedByEditor) {
      vcamStartedByEditor = false;
      window.omnichat.obsWsAction({ action: 'stop-virtual-cam' }).catch(() => {});
    }
  }

  function startPreviewLoop() {
    clearInterval(previewTimer);
    stopVirtualCamPreview();
    refreshPreview();
  }

  btnOpen?.addEventListener('click', async () => {
    modal.classList.remove('hidden');
    selectSourceItem(null);
    await refreshAll();
    startPreviewLoop();
  });

  function closeModal() {
    modal.classList.add('hidden');
    clearInterval(previewTimer);
    stopVirtualCamPreview();
  }
  btnClose?.addEventListener('click', closeModal);
  window.addEventListener('beforeunload', () => {
    if (vcamStartedByEditor) stopVirtualCamPreview();
  });

  chkAutoPreview?.addEventListener('change', startPreviewLoop);
  btnRefresh?.addEventListener('click', refreshAll);

  document.getElementById('btnSeObsWsConnect')?.addEventListener('click', async () => {
    const host = document.getElementById('inputObsWsHost')?.value.trim() || '127.0.0.1';
    const port = parseInt(document.getElementById('inputObsWsPort')?.value || '4455', 10) || 4455;
    const password = document.getElementById('inputObsWsPass')?.value || '';
    const micName = document.getElementById('inputObsWsMic')?.value.trim() || '';
    setStatus('⏳ Verbinde mit OBS WebSocket...', '#38bdf8');
    const res = await window.omnichat.obsWsConnect({ host, port, password, micName });
    if (res?.state) updateObsWsUI(res.state);
    if (res?.state?.connected) {
      setStatus('✅ Mit OBS verbunden!', '#4ade80');
      await refreshAll();
      await loadInputKinds();
      startPreviewLoop();
    } else {
      setStatus(`❌ ${res?.state?.error || res?.error || 'Verbindung zu OBS fehlgeschlagen.'}`, '#f87171');
    }
  });

  document.getElementById('btnSeObsWsDisconnect')?.addEventListener('click', () => {
    window.omnichat.obsWsDisconnect();
    clearInterval(previewTimer);
    stopVirtualCamPreview();
    setStatus('🔌 OBS-Verbindung getrennt.', '#94a3b8');
  });

  selScene?.addEventListener('change', async () => {
    const target = selScene.value;
    if (!target) return;
    await window.omnichat.obsWsAction({ action: 'scene', sceneName: target });
    currentSceneName = target;
    selectSourceItem(null);
    await loadSceneItems(target);
    refreshPreview();
  });

  btnCreateScene?.addEventListener('click', async () => {
    const name = newSceneInput?.value.trim() || '';
    if (!name) return;
    const res = await window.omnichat.obsWsAction({ action: 'create-scene', sceneName: name });
    if (res?.ok) {
      if (newSceneInput) newSceneInput.value = '';
      setStatus(`✅ Szene "${name}" erstellt!`, '#4ade80');
      setTimeout(refreshAll, 300);
    } else {
      setStatus(`❌ ${res?.error || 'Fehler beim Erstellen'}`, '#f87171');
    }
  });

  btnApplyTransform?.addEventListener('click', async () => {
    if (!selectedItem || !currentSceneName) return;
    const scale = Math.max(0.05, Math.min(4, (parseFloat(inpScalePct?.value || '100') || 100) / 100));
    const res = await window.omnichat.obsWsAction({
      action: 'set-scene-item-transform',
      sceneName: currentSceneName,
      sceneItemId: selectedItem.sceneItemId,
      transform: {
        positionX: parseFloat(inpPosX?.value || '0') || 0,
        positionY: parseFloat(inpPosY?.value || '0') || 0,
        scaleX: scale,
        scaleY: scale
      }
    });
    if (res?.ok) {
      setStatus(`✅ Transform für "${selectedItem.sourceName}" gesetzt.`, '#4ade80');
      await loadSceneItems(currentSceneName);
      refreshPreview();
    } else {
      setStatus(`❌ ${res?.error || 'Transform fehlgeschlagen'}`, '#f87171');
    }
  });

  btnLayerFront?.addEventListener('click', () => selectedItem && moveItemLayer(selectedItem, 'front'));
  btnLayerUp?.addEventListener('click', () => selectedItem && moveItemLayer(selectedItem, 'up'));
  btnLayerDown?.addEventListener('click', () => selectedItem && moveItemLayer(selectedItem, 'down'));
  btnLayerBack?.addEventListener('click', () => selectedItem && moveItemLayer(selectedItem, 'back'));

  btnRenameSelected?.addEventListener('click', () => {
    if (!selectedItem || !renameBar || !inpRenameSource) return;
    const isHidden = renameBar.classList.contains('hidden');
    if (isHidden) {
      inpRenameSource.value = selectedItem.sourceName;
      renameBar.classList.remove('hidden');
      inpRenameSource.focus();
      inpRenameSource.select();
    } else {
      closeToolbarRenameBar();
    }
  });
  btnRenameSave?.addEventListener('click', () => {
    if (selectedItem && inpRenameSource) {
      performSourceRename(selectedItem, inpRenameSource.value);
    }
  });
  btnRenameCancel?.addEventListener('click', closeToolbarRenameBar);
  inpRenameSource?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && selectedItem) {
      e.preventDefault();
      performSourceRename(selectedItem, inpRenameSource.value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeToolbarRenameBar();
    }
  });

  rngTransparency?.addEventListener('input', () => {
    if (!selectedItem) return;
    const vis = Math.max(0, Math.min(100, parseInt(rngTransparency.value || '100', 10)));
    const pct = 100 - vis;
    syncSelectedTransparencyUI(pct);
    applyItemTransparency(selectedItem, pct, { commitPreview: false, skipListRebuild: false });
  });
  rngTransparency?.addEventListener('change', () => {
    if (!selectedItem) return;
    const vis = Math.max(0, Math.min(100, parseInt(rngTransparency.value || '100', 10)));
    const pct = 100 - vis;
    applyItemTransparency(selectedItem, pct, { commitPreview: true, skipListRebuild: false });
  });
  inpTransparencyPct?.addEventListener('change', () => {
    if (!selectedItem) return;
    const vis = Math.max(0, Math.min(100, parseInt(inpTransparencyPct.value || '100', 10)));
    const pct = 100 - vis;
    syncSelectedTransparencyUI(pct);
    applyItemTransparency(selectedItem, pct, { commitPreview: true, skipListRebuild: false });
  });
  inpTransparencyPct?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && selectedItem) {
      const vis = Math.max(0, Math.min(100, parseInt(inpTransparencyPct.value || '100', 10)));
      const pct = 100 - vis;
      syncSelectedTransparencyUI(pct);
      applyItemTransparency(selectedItem, pct, { commitPreview: true, skipListRebuild: false });
    }
  });
  transPresetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!selectedItem) return;
      const vis = Math.max(0, Math.min(100, parseInt(btn.dataset.opacity || '100', 10)));
      const pct = 100 - vis;
      syncSelectedTransparencyUI(pct);
      applyItemTransparency(selectedItem, pct, { commitPreview: true, skipListRebuild: false });
    });
  });

  btnCenter?.addEventListener('click', async () => {
    if (!selectedItem || !currentSceneName) return;
    const { w, h } = getItemBoxPx(selectedItem);
    const posX = Math.round((baseWidth - w) / 2);
    const posY = Math.round((baseHeight - h) / 2);
    const res = await window.omnichat.obsWsAction({
      action: 'set-scene-item-transform',
      sceneName: currentSceneName,
      sceneItemId: selectedItem.sceneItemId,
      transform: { positionX: posX, positionY: posY }
    });
    if (res?.ok) {
      await loadSceneItems(currentSceneName);
      refreshPreview();
    }
  });

  btnFullscreen?.addEventListener('click', async () => {
    if (!selectedItem || !currentSceneName) return;
    const tr = selectedItem.transform || {};
    const srcW = Math.max(1, Number(tr.sourceWidth || baseWidth));
    const srcH = Math.max(1, Number(tr.sourceHeight || baseHeight));
    const scaleX = baseWidth / srcW;
    const scaleY = baseHeight / srcH;
    const transform = tr.boundsType && tr.boundsType !== 'OBS_BOUNDS_NONE'
      ? { positionX: 0, positionY: 0, boundsWidth: baseWidth, boundsHeight: baseHeight }
      : { positionX: 0, positionY: 0, scaleX, scaleY };
    const res = await window.omnichat.obsWsAction({
      action: 'set-scene-item-transform',
      sceneName: currentSceneName,
      sceneItemId: selectedItem.sceneItemId,
      transform
    });
    if (res?.ok) {
      await loadSceneItems(currentSceneName);
      refreshPreview();
    }
  });

  const selNewKind = document.getElementById('seNewSourceKind');
  const inpNewName = document.getElementById('seNewSourceName');
  const inpNewVal = document.getElementById('seNewSourceValue');
  const btnAddSource = document.getElementById('btnSeAddSource');
  const selBuiltinOverlay = document.getElementById('seBuiltinOverlay');
  const btnAddBuiltinOverlay = document.getElementById('btnSeAddBuiltinOverlay');
  let builtinOverlaysCache = [];

  async function loadBuiltinOverlays() {
    if (!selBuiltinOverlay) return;
    const res = await window.omnichat.obsWsAction({ action: 'get-builtin-overlays' });
    const list = Array.isArray(res?.overlays) ? res.overlays : [];
    builtinOverlaysCache = list;
    const prev = selBuiltinOverlay.value;
    selBuiltinOverlay.innerHTML = '';
    list.forEach((ov) => {
      const opt = document.createElement('option');
      opt.value = ov.id;
      opt.textContent = ov.label;
      selBuiltinOverlay.appendChild(opt);
    });
    if (prev && list.some((x) => x.id === prev)) selBuiltinOverlay.value = prev;
  }

  const btnToggleTransitions = document.getElementById('btnSeToggleTransitions');
  const canvasWrapEl = document.getElementById('seCanvasWrap');
  const transitionsPanel = document.getElementById('seTransitionsPanel');
  const trScenesGrid = document.getElementById('seTransitionScenesGrid');
  const trFromSel = document.getElementById('seTrFromScene');
  const trToSel = document.getElementById('seTrToScene');
  const trBidirChk = document.getElementById('seTrBidir');
  const trDirIcon = document.getElementById('seTrDirIcon');
  const trEffectSel = document.getElementById('seTrEffectSelect');
  const trCustomFileRow = document.getElementById('seTrCustomFileRow');
  const btnPickTrFile = document.getElementById('btnSePickTransitionFile');
  const trCustomFileNameEl = document.getElementById('seTrCustomFileName');
  const btnAddTransition = document.getElementById('btnSeAddTransition');
  const btnTestTransition = document.getElementById('btnSeTestTransition');
  const trRulesList = document.getElementById('seTransitionRulesList');
  let transitionsViewOpen = false;
  let trPickNext = 'from';
  let selectedCustomTransitionFile = null;

  function syncCustomTransitionFileRow() {
    const isCustom = trEffectSel?.value === 'custom-file';
    if (trCustomFileRow) {
      trCustomFileRow.classList.toggle('hidden', !isCustom);
      trCustomFileRow.style.display = isCustom ? 'flex' : 'none';
    }
  }

  function getSelectedTransitionEffect() {
    const val = String(trEffectSel?.value || 'theme');
    if (val === 'custom-file') {
      return {
        mode: 'custom-file',
        filePath: selectedCustomTransitionFile?.filePath || '',
        fileName: selectedCustomTransitionFile?.fileName || '',
        fileKind: selectedCustomTransitionFile?.fileKind || 'video'
      };
    }
    if (val.startsWith('obs:')) {
      return { mode: 'obs', obsTransitionName: val.slice(4) };
    }
    return { mode: 'theme' };
  }

  function setTransitionsView(open) {
    transitionsViewOpen = Boolean(open);
    if (canvasWrapEl) canvasWrapEl.classList.toggle('hidden', transitionsViewOpen);
    if (transitionsPanel) {
      transitionsPanel.classList.toggle('hidden', !transitionsViewOpen);
      transitionsPanel.style.display = transitionsViewOpen ? 'flex' : 'none';
    }
    if (btnToggleTransitions) {
      btnToggleTransitions.style.background = transitionsViewOpen ? 'rgba(168,85,247,0.32)' : '';
      btnToggleTransitions.style.borderColor = transitionsViewOpen ? '#a855f7' : '';
      btnToggleTransitions.style.color = transitionsViewOpen ? '#f3e8ff' : '';
      btnToggleTransitions.textContent = transitionsViewOpen
        ? window.tDyn('trBtnObsPreview')
        : window.tDyn('trBtnTransitions');
    }
    if (transitionsViewOpen) {
      loadTransitionsPanel();
    } else {
      refreshPreview();
    }
  }

  async function loadTransitionsPanel() {
    const res = await window.omnichat.obsWsAction({ action: 'get-scene-transitions' });
    const scenes = (Array.isArray(res?.scenes) && res.scenes.length)
      ? res.scenes
      : [...(selScene?.options || [])].map((o) => o.value).filter(Boolean);
    const rules = Array.isArray(res?.rules) ? res.rules : [];
    const obsTransitions = Array.isArray(res?.obsTransitions) ? res.obsTransitions : [];

    if (trEffectSel) {
      const prevEff = trEffectSel.value || 'theme';
      let effHtml = `<option value="theme">${escapeHtml(window.tDyn('trOptTheme'))}</option>`;
      effHtml += `<option value="custom-file">${escapeHtml(window.tDyn('trOptCustomFile'))}</option>`;
      if (obsTransitions.length) {
        effHtml += `<optgroup label="${escapeHtml(window.tDyn('trOptGroupObs'))}">`
          + obsTransitions.map((t) => `<option value="obs:${escapeHtml(t.name)}">🎬 OBS: ${escapeHtml(t.name)}</option>`).join('')
          + '</optgroup>';
      }
      trEffectSel.innerHTML = effHtml;
      if ([...trEffectSel.options].some((o) => o.value === prevEff)) trEffectSel.value = prevEff;
      syncCustomTransitionFileRow();
    }

    const prevFrom = trFromSel?.value || '';
    const prevTo = trToSel?.value || '';
    const optsHtml = `<option value="__all__">${escapeHtml(window.tDyn('trAllScenes'))}</option>`
      + scenes.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
    if (trFromSel) {
      trFromSel.innerHTML = optsHtml;
      trFromSel.value = (prevFrom && (prevFrom === '__all__' || scenes.includes(prevFrom)))
        ? prevFrom
        : (currentSceneName && scenes.includes(currentSceneName) ? currentSceneName : '__all__');
    }
    if (trToSel) {
      trToSel.innerHTML = optsHtml;
      const fallbackTo = scenes.find((s) => s !== trFromSel?.value) || '__all__';
      trToSel.value = (prevTo && (prevTo === '__all__' || scenes.includes(prevTo))) ? prevTo : fallbackTo;
    }

    if (trScenesGrid) {
      trScenesGrid.innerHTML = '';
      if (!scenes.length) {
        trScenesGrid.innerHTML = `<span style="font-size:11.5px;color:#64748b;">${escapeHtml(window.tDyn('trConnectToSeeScenes'))}</span>`;
      } else {
        scenes.forEach((sc) => {
          const hasRule = rules.some((r) =>
            r.fromScene === '__all__' || r.toScene === '__all__' || r.fromScene === sc || r.toScene === sc
          );
          const isFrom = trFromSel?.value === sc;
          const isTo = trToSel?.value === sc;
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'btn-sm';
          chip.style.cssText = `padding:5px 10px;font-size:11.5px;border-radius:8px;display:inline-flex;align-items:center;gap:5px;${
            isFrom ? 'border-color:#38bdf8;background:rgba(56,189,248,0.2);color:#e0f2fe;'
              : isTo ? 'border-color:#a855f7;background:rgba(168,85,247,0.2);color:#f3e8ff;'
                : hasRule ? 'border-color:rgba(74,222,128,0.45);background:rgba(34,197,94,0.12);color:#dcfce7;'
                  : ''
          }`;
          chip.textContent = `${hasRule ? '✨ ' : '🎬 '}${sc}`;
          chip.title = window.tDyn('trSceneChipTitle');
          chip.addEventListener('click', () => {
            if (trPickNext === 'from' && trFromSel) {
              trFromSel.value = sc;
              trPickNext = 'to';
            } else if (trToSel) {
              trToSel.value = sc;
              trPickNext = 'from';
            }
            loadTransitionsPanel();
          });
          trScenesGrid.appendChild(chip);
        });
      }
    }

    if (trRulesList) {
      trRulesList.innerHTML = '';
      if (!rules.length) {
        trRulesList.innerHTML = `<div style="font-size:11.5px;color:#64748b;padding:8px;border:1px dashed rgba(148,163,184,0.2);border-radius:8px;">${escapeHtml(window.tDyn('trEmptyRules'))}</div>`;
      } else {
        rules.forEach((r) => {
          const row = document.createElement('div');
          row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 10px;border-radius:8px;background:rgba(30,41,59,0.85);border:1px solid rgba(168,85,247,0.35);font-size:12px;';
          const lblFrom = r.fromScene === '__all__' ? window.tDyn('trAllScenes') : r.fromScene;
          const lblTo = r.toScene === '__all__' ? window.tDyn('trAllScenes') : r.toScene;
          const arrow = r.bidirectional !== false ? '↔' : '→';
          const badgeText = r.mode === 'obs'
            ? `🎬 OBS: ${r.obsTransitionName}`
            : r.mode === 'custom-file'
              ? `📁 ${r.fileName || window.tDyn('trBadgeCustomFallback')}`
              : window.tDyn('trBadgeTheme');
          const info = document.createElement('div');
          info.style.cssText = 'display:flex;align-items:center;gap:8px;min-width:0;flex:1;';
          const text = document.createElement('span');
          text.style.cssText = 'color:#f8fafc;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
          text.textContent = `${lblFrom}  ${arrow}  ${lblTo}`;
          const badge = document.createElement('span');
          badge.style.cssText = 'font-size:10.5px;padding:2px 7px;border-radius:999px;background:rgba(168,85,247,0.22);color:#e9d5ff;white-space:nowrap;flex-shrink:0;';
          badge.textContent = badgeText;
          info.append(text, badge);

          const actions = document.createElement('div');
          actions.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
          const playBtn = document.createElement('button');
          playBtn.type = 'button';
          playBtn.className = 'btn-sm';
          playBtn.style.cssText = 'padding:2px 7px;font-size:11px;color:#c084fc;';
          playBtn.textContent = '▶️';
          playBtn.title = window.tDyn('trPlayRuleTitle');
          playBtn.addEventListener('click', async () => {
            await window.omnichat.obsWsAction({ action: 'test-scene-transition', ruleId: r.id });
            setStatus(window.tDyn('trStatusPlayed', { name: badgeText }), '#c084fc');
          });
          const delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.className = 'btn-sm';
          delBtn.style.cssText = 'padding:2px 7px;font-size:11px;color:#f87171;';
          delBtn.textContent = '🗑️';
          delBtn.title = window.tDyn('trDeleteRuleTitle');
          delBtn.addEventListener('click', async () => {
            const delRes = await window.omnichat.obsWsAction({ action: 'remove-scene-transition', id: r.id });
            if (delRes?.ok) {
              setStatus(window.tDyn('trStatusDeleted'), '#94a3b8');
              loadTransitionsPanel();
            }
          });
          actions.append(playBtn, delBtn);
          row.append(info, actions);
          trRulesList.appendChild(row);
        });
      }
    }
  }

  btnToggleTransitions?.addEventListener('click', () => setTransitionsView(!transitionsViewOpen));
  trBidirChk?.addEventListener('change', () => {
    if (trDirIcon) trDirIcon.textContent = trBidirChk.checked ? '↔' : '→';
  });
  trEffectSel?.addEventListener('change', syncCustomTransitionFileRow);
  btnPickTrFile?.addEventListener('click', async () => {
    const picked = await window.omnichat.obsWsAction({ action: 'pick-transition-file' });
    if (picked?.ok && picked.filePath) {
      selectedCustomTransitionFile = picked;
      if (trCustomFileNameEl) {
        trCustomFileNameEl.textContent = `✅ ${picked.fileName}`;
        trCustomFileNameEl.style.color = '#4ade80';
      }
    }
  });
  trFromSel?.addEventListener('change', loadTransitionsPanel);
  trToSel?.addEventListener('change', loadTransitionsPanel);

  btnAddTransition?.addEventListener('click', async () => {
    const fromScene = trFromSel?.value || '__all__';
    const toScene = trToSel?.value || '__all__';
    const bidirectional = Boolean(trBidirChk?.checked);
    const eff = getSelectedTransitionEffect();
    if (fromScene !== '__all__' && fromScene === toScene) {
      setStatus(window.tDyn('trErrSameScene'), '#fbbf24');
      return;
    }
    if (eff.mode === 'custom-file' && !eff.filePath) {
      setStatus(window.tDyn('trErrPickFile'), '#fbbf24');
      return;
    }
    setStatus(window.tDyn('trStatusSetting'), '#38bdf8');
    const res = await window.omnichat.obsWsAction({
      action: 'setup-scene-transition',
      fromScene,
      toScene,
      bidirectional,
      ...eff
    });
    if (res?.ok) {
      const pairLabel = fromScene === '__all__' || toScene === '__all__'
        ? window.tDyn('trPairAll')
        : `„${fromScene}“ ${bidirectional ? '↔' : '→'} „${toScene}“`;
      const effLabel = eff.mode === 'obs'
        ? `OBS: ${eff.obsTransitionName}`
        : eff.mode === 'custom-file'
          ? eff.fileName
          : window.tDyn('trBadgeTheme');
      setStatus(window.tDyn('trStatusSaved', { effect: effLabel, pair: pairLabel }), '#4ade80');
      await loadTransitionsPanel();
      if (currentSceneName) await loadSceneItems(currentSceneName);
    } else {
      setStatus(`❌ ${res?.error || window.tDyn('trErrFailed')}`, '#f87171');
    }
  });

  btnTestTransition?.addEventListener('click', async () => {
    const eff = getSelectedTransitionEffect();
    await window.omnichat.obsWsAction({ action: 'test-scene-transition', ...eff });
    setStatus(window.tDyn('trStatusTriggered'), '#c084fc');
  });

  btnAddBuiltinOverlay?.addEventListener('click', async () => {
    if (!currentSceneName) {
      setStatus('⚠️ Bitte zuerst oben mit OBS verbinden und eine Szene wählen.', '#fbbf24');
      return;
    }
    const overlayId = selBuiltinOverlay?.value || 'chat';
    const res = await window.omnichat.obsWsAction({
      action: 'add-builtin-overlay',
      sceneName: currentSceneName,
      overlayId
    });
    if (res?.ok) {
      setStatus(
        res.reusedInScene
          ? `✅ "${res.inputName}" ist bereits in dieser Szene (wurde eingeblendet & markiert).`
          : `✅ App-Overlay "${res.inputName}" direkt zur Szene hinzugefügt!`,
        '#4ade80'
      );
      await loadSceneItems(currentSceneName);
      const added = sceneItems.find((x) => x.sceneItemId === res.sceneItemId || x.sourceName === res.inputName);
      if (added) {
        selectSourceItem(added);
        renderSourcesList();
        renderCanvasOverlay();
      }
      setTimeout(refreshPreview, 350);
      setTimeout(refreshPreview, 1300);
    } else {
      setStatus(`❌ ${res?.error || 'Overlay konnte nicht hinzugefügt werden.'}`, '#f87171');
    }
  });

  async function applyBuiltinBundle(bundleId, label) {
    if (!currentSceneName) {
      setStatus('⚠️ Bitte zuerst oben mit OBS verbinden und eine Szene wählen.', '#fbbf24');
      return;
    }
    setStatus(`⏳ Füge ${label} in Szene "${currentSceneName}" ein...`, '#38bdf8');
    const res = await window.omnichat.obsWsAction({
      action: 'add-builtin-bundle',
      sceneName: currentSceneName,
      bundleId
    });
    if (res?.ok) {
      if (res.chatTheme && selObsChatTheme) selObsChatTheme.value = res.chatTheme;
      setStatus(`✅ ${label} komplett eingefügt (${(res.added || []).join(', ')})!`, '#4ade80');
      await loadSceneItems(currentSceneName);
      setTimeout(refreshPreview, 450);
      setTimeout(refreshPreview, 1400);
    } else {
      setStatus(`❌ ${res?.error || 'Set konnte nicht eingefügt werden.'}`, '#f87171');
    }
  }

  document.getElementById('btnSeBundleLol')?.addEventListener('click', () => applyBuiltinBundle('lol', '⚔️ Komplettes LoL-Set'));
  document.getElementById('btnSeBundleJc')?.addEventListener('click', () => applyBuiltinBundle('justchatting', '💬 Just-Chatting-Set'));
  document.getElementById('btnSeBundleTron')?.addEventListener('click', () => applyBuiltinBundle('techtalk', '💠 TRON Tech-Talk-Set'));
  document.getElementById('btnSeBundleVal')?.addEventListener('click', () => applyBuiltinBundle('valorant', '🔫 Valorant-Set'));

  document.getElementById('btnSeSetupVodTrack')?.addEventListener('click', async () => {
    setStatus('⏳ Richte separate Musik-VOD-Spur (Spur 2) in OBS ein...', '#38bdf8');
    const r = await window.omnichat.obsWsAction({
      action: 'setup-music-vod-track',
      sceneName: currentSceneName || '',
      createDedicatedSource: false
    });
    if (r?.ok) {
      const mList = (r.updatedMusic || []).join(', ');
      setStatus(
        `🛡️ VOD-Spur 2 aktiv!${mList ? ` Musik getrennt: ${mList}.` : ' Markiere deine Musik-Quelle unten mit „🎵 Nur Live“.'} (OBS ggf. 1× neu starten, falls VOD-Spur neu aktiviert wurde)`,
        '#c084fc'
      );
      loadAudioInputs();
    } else {
      setStatus(`⚠️ ${r?.error || 'Konnte VOD-Spur nicht einrichten.'}`, '#f87171');
    }
  });

  document.getElementById('btnSeAddMusicSource')?.addEventListener('click', async () => {
    if (!currentSceneName) {
      setStatus('⚠️ Bitte zuerst oben eine OBS-Szene auswählen.', '#fbbf24');
      return;
    }
    setStatus('⏳ Lege dedizierte Musik-Audio-Spur (Nur Live / Kein VOD) an...', '#38bdf8');
    const r = await window.omnichat.obsWsAction({
      action: 'setup-music-vod-track',
      sceneName: currentSceneName,
      createDedicatedSource: true
    });
    if (r?.ok) {
      setStatus(`🎵 Musik-Spur „${r.createdSource || 'Musik'}“ angelegt (Spur 1 Live AN, Spur 2 VOD AUS)!`, '#4ade80');
      await loadSceneItems(currentSceneName);
      loadAudioInputs();
    } else {
      setStatus(`⚠️ ${r?.error || 'Konnte Musik-Spur nicht anlegen.'}`, '#f87171');
    }
  });

  const FRIENDLY_KINDS = {
    screen_capture: '🖥️ Bildschirm / Fenster / App-Aufnahme (macOS)',
    window_capture: '🪟 Fensteraufnahme',
    display_capture: '🖥️ Bildschirmaufnahme',
    monitor_capture: '🖥️ Bildschirmaufnahme',
    game_capture: '🎮 Spiel- / Applikationsaufnahme',
    macos_avcapture: '📷 Videoaufnahmegerät / Kamera (macOS)',
    av_capture_input_v2: '📷 Videoaufnahmegerät / Kamera (macOS)',
    av_capture_input: '📷 Videoaufnahmegerät / Kamera',
    dshow_input: '📷 Videoaufnahmegerät / Kamera (Windows)',
    v4l2_input: '📷 Videoaufnahmegerät / Kamera',
    browser_source: '🌐 Browser-Quelle (URL)',
    image_source: '🖼️ Bild (PNG/JPG/GIF)',
    ffmpeg_source: '🎬 Video / Medienquelle',
    color_source_v3: '🎨 Farbfläche',
    text_ft2_source_v2: '📝 Text (FreeType 2)',
    text_gdiplus_v3: '📝 Text (GDI+)',
    coreaudio_input_capture: '🎙️ Mikrofon / Audio-Eingang',
    coreaudio_output_capture: '🔊 Audio-Ausgabe',
    sck_audio_capture: '🎵 Anwendungs-Audioaufnahme (macOS)',
    wasapi_input_capture: '🎙️ Mikrofon / Audio-Eingang',
    wasapi_output_capture: '🔊 Desktop-Audio',
    wasapi_process_output_capture: '🎵 Anwendungs-Audioaufnahme'
  };

  const newSourceFileRow = document.getElementById('seNewSourceFileRow');
  const btnPickNewSourceFile = document.getElementById('btnSePickNewSourceFile');
  const lblNewSourceFile = document.getElementById('lblSeNewSourceFile');
  const btnClearNewSourceFile = document.getElementById('btnSeClearNewSourceFile');
  let pickedNewSourceFilePath = '';
  let pickedNewSourceFileName = '';

  function isFileBasedObsKind(kind) {
    const k = String(kind || '').toLowerCase();
    return k.includes('image') || k.includes('ffmpeg') || k.includes('vlc');
  }

  function updateNewSourceInputMode() {
    const kind = String(selNewKind?.value || 'browser_source').toLowerCase();
    const fileMode = isFileBasedObsKind(kind);
    const isBrowser = kind.includes('browser');
    const isText = kind.includes('text');

    newSourceFileRow?.classList.toggle('hidden', !fileMode && !isText);
    if (inpNewVal) {
      inpNewVal.classList.toggle('hidden', fileMode || (!isBrowser && !isText));
      if (isBrowser) {
        inpNewVal.placeholder = window.__appLang === 'en' ? 'URL (e.g. https://...)' : 'URL (z. B. https://...)';
      } else if (isText) {
        inpNewVal.placeholder = window.__appLang === 'en' ? 'Direct text (or pick file)…' : 'Direkter Text (oder Datei wählen)…';
      }
    }
    if (btnPickNewSourceFile) {
      if (kind.includes('image')) {
        btnPickNewSourceFile.textContent = window.__appLang === 'en' ? '🖼️ Choose image…' : '🖼️ Bild wählen…';
      } else if (kind.includes('ffmpeg') || kind.includes('vlc')) {
        btnPickNewSourceFile.textContent = window.__appLang === 'en' ? '🎬 Choose media…' : '🎬 Video / Audio wählen…';
      } else {
        btnPickNewSourceFile.textContent = window.__appLang === 'en' ? '📂 Choose file…' : '📂 Datei wählen…';
      }
    }
    renderNewSourcePickedBadge();
  }

  function renderNewSourcePickedBadge() {
    if (!lblNewSourceFile) return;
    lblNewSourceFile.textContent = pickedNewSourceFileName
      ? pickedNewSourceFileName
      : (window.__appLang === 'en' ? 'No file selected' : 'Keine Datei gewählt');
    lblNewSourceFile.classList.toggle('has-file', Boolean(pickedNewSourceFileName));
    lblNewSourceFile.title = pickedNewSourceFilePath || '';
    btnClearNewSourceFile?.classList.toggle('hidden', !pickedNewSourceFileName);
  }

  selNewKind?.addEventListener('change', () => {
    pickedNewSourceFilePath = '';
    pickedNewSourceFileName = '';
    updateNewSourceInputMode();
  });

  btnPickNewSourceFile?.addEventListener('click', async () => {
    const kind = String(selNewKind?.value || '').toLowerCase();
    const dialogKind = kind.includes('image') ? 'image' : kind.includes('text') ? 'text' : 'video';
    const picked = await window.omnichat.pickLocalFile?.({ kind: dialogKind });
    if (!picked?.ok) return;
    pickedNewSourceFilePath = picked.filePath;
    pickedNewSourceFileName = picked.fileName;
    if (inpNewName && !inpNewName.value.trim() && picked.baseName) {
      inpNewName.value = picked.baseName;
    }
    renderNewSourcePickedBadge();
  });

  btnClearNewSourceFile?.addEventListener('click', () => {
    pickedNewSourceFilePath = '';
    pickedNewSourceFileName = '';
    renderNewSourcePickedBadge();
  });

  let loadedKindsFromObs = false;
  async function loadInputKinds(force = false) {
    if (!selNewKind) return;
    if (loadedKindsFromObs && !force && selNewKind.options.length > 0) {
      updateNewSourceInputMode();
      return;
    }
    const prevVal = selNewKind.value;
    const res = await window.omnichat.obsWsAction({ action: 'get-input-kinds' });
    const isFromObs = Boolean(res?.ok && Array.isArray(res.kinds) && res.kinds.length);
    if (isFromObs) loadedKindsFromObs = true;
    const isMac = /mac/i.test(navigator.platform || navigator.userAgent || '');
    const fallbackKinds = isMac
      ? ['screen_capture', 'window_capture', 'display_capture', 'macos_avcapture', 'av_capture_input_v2', 'browser_source', 'image_source', 'ffmpeg_source', 'color_source_v3', 'text_ft2_source_v2', 'coreaudio_input_capture', 'coreaudio_output_capture']
      : ['window_capture', 'monitor_capture', 'game_capture', 'dshow_input', 'browser_source', 'image_source', 'ffmpeg_source', 'color_source_v3', 'text_gdiplus_v3', 'wasapi_input_capture', 'wasapi_output_capture'];
    const kinds = isFromObs ? res.kinds : fallbackKinds;
    const priority = Object.keys(FRIENDLY_KINDS);
    const sorted = [...new Set(kinds)].sort((a, b) => {
      const ia = priority.indexOf(a);
      const ib = priority.indexOf(b);
      if (ia >= 0 && ib >= 0) return ia - ib;
      if (ia >= 0) return -1;
      if (ib >= 0) return 1;
      return a.localeCompare(b);
    });
    selNewKind.innerHTML = '';
    sorted.forEach((k) => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = FRIENDLY_KINDS[k] || k;
      selNewKind.appendChild(opt);
    });
    if (prevVal && sorted.includes(prevVal)) selNewKind.value = prevVal;
    updateNewSourceInputMode();
  }

  btnOpen?.addEventListener('click', () => {
    loadInputKinds(true);
    loadBuiltinOverlays();
    window.omnichat.obsWsAction?.({ action: 'refresh-omnigrid-overlays' }).then(() => {
      setTimeout(refreshPreview, 900);
    }).catch(() => {});
  });
  window.omnichat.onObsWsState?.((st) => {
    if (st?.connected && !loadedKindsFromObs) loadInputKinds(true);
  });

  document.getElementById('btnSeQuickAddFile')?.addEventListener('click', async () => {
    if (!currentSceneName) {
      setStatus('⚠️ Bitte zuerst oben mit OBS verbinden und eine Szene wählen.', '#fbbf24');
      return;
    }
    await loadInputKinds();
    const picked = await window.omnichat.pickLocalFile?.({ kind: 'obs_media' });
    if (!picked?.ok) return;

    const extMatch = String(picked.fileName || '').toLowerCase().match(/\.([a-z0-9]+)$/);
    const ext = extMatch ? extMatch[1] : '';
    const availableKinds = Array.from(selNewKind?.options || []).map((o) => o.value);
    const findKind = (needle, fallback) =>
      availableKinds.find((k) => k.toLowerCase().includes(needle)) || fallback;

    let kind = 'ffmpeg_source';
    const settings = {};
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'apng'].includes(ext)) {
      kind = findKind('image', 'image_source');
      settings.file = picked.filePath;
    } else if (['txt', 'log', 'md', 'csv'].includes(ext)) {
      kind = findKind('text', 'text_ft2_source_v2');
      settings.from_file = true;
      settings.text_file = picked.filePath;
    } else {
      kind = findKind('ffmpeg', 'ffmpeg_source');
      settings.local_file = picked.filePath;
      settings.is_local_file = true;
    }

    const baseName = (picked.baseName || picked.fileName || 'Medien').trim();
    const existingNames = new Set(sceneItems.map((x) => String(x.sourceName || '').toLowerCase()));
    let finalName = baseName;
    let suffix = 2;
    while (existingNames.has(finalName.toLowerCase())) {
      finalName = `${baseName} (${suffix++})`;
    }

    const res = await window.omnichat.obsWsAction({
      action: 'create-input',
      sceneName: currentSceneName,
      inputName: finalName,
      inputKind: kind,
      inputSettings: settings
    });
    if (res?.ok) {
      setStatus(`✅ Datei "${picked.fileName}" als Quelle "${finalName}" eingefügt!`, '#4ade80');
      await loadSceneItems(currentSceneName);
      const created = sceneItems.find((x) => x.sourceName === finalName);
      if (created) {
        selectSourceItem(created);
        renderSourcesList();
        renderCanvasOverlay();
      }
      setTimeout(refreshPreview, 300);
    } else {
      setStatus(`❌ ${res?.error || 'Datei-Quelle konnte nicht erstellt werden.'}`, '#f87171');
    }
  });

  btnAddSource?.addEventListener('click', async () => {
    if (!currentSceneName) return;
    const kind = selNewKind?.value || 'browser_source';
    const kLow = kind.toLowerCase();
    const val = inpNewVal?.value.trim() || '';
    let name = inpNewName?.value.trim() || '';
    if (!name && pickedNewSourceFileName) {
      name = pickedNewSourceFileName.replace(/\.[^.]+$/, '');
    }
    if (!name) {
      setStatus('⚠️ Bitte einen Quellennamen eingeben.', '#fbbf24');
      return;
    }
    const settings = {};
    if (kLow.includes('image')) {
      if (pickedNewSourceFilePath) settings.file = pickedNewSourceFilePath;
    } else if (kLow.includes('ffmpeg') || kLow.includes('vlc')) {
      if (pickedNewSourceFilePath) {
        settings.local_file = pickedNewSourceFilePath;
        settings.is_local_file = true;
      }
    } else if (kLow.includes('text')) {
      if (pickedNewSourceFilePath) {
        settings.from_file = true;
        settings.text_file = pickedNewSourceFilePath;
      } else if (val) {
        settings.text = val;
      }
    } else if (kLow.includes('browser') && val) {
      settings.url = val;
      settings.width = 480;
      settings.height = 360;
    }
    const res = await window.omnichat.obsWsAction({
      action: 'create-input',
      sceneName: currentSceneName,
      inputName: name,
      inputKind: kind,
      inputSettings: settings
    });
    if (res?.ok) {
      if (inpNewName) inpNewName.value = '';
      if (inpNewVal) inpNewVal.value = '';
      pickedNewSourceFilePath = '';
      pickedNewSourceFileName = '';
      renderNewSourcePickedBadge();
      setStatus(`✅ Quelle "${name}" hinzugefügt!`, '#4ade80');
      await loadSceneItems(currentSceneName);
      const created = sceneItems.find((x) => x.sourceName === name);
      if (created) {
        selectSourceItem(created);
        renderSourcesList();
        renderCanvasOverlay();
      }
      refreshPreview();
    } else {
      setStatus(`❌ ${res?.error || 'Quelle konnte nicht erstellt werden.'}`, '#f87171');
    }
  });
})();

// ======================================================
// GITHUB RELEASES AUTO-UPDATER UI
// ======================================================
(function initGitHubAutoUpdaterUI() {
  const banner = document.getElementById('updateBanner');
  const bannerText = document.getElementById('updateBannerText');
  const btnInstall = document.getElementById('btnUpdateInstall');
  const btnReleaseUrl = document.getElementById('btnUpdateReleaseUrl');
  const btnDismiss = document.getElementById('btnUpdateDismiss');
  const btnCheck = document.getElementById('btnCheckUpdates');
  const btnForceManual = document.getElementById('btnForceManualUpdate');
  const btnInstallSystem = document.getElementById('btnInstallUpdateSystem');
  const btnTopUpdate = document.getElementById('btnManualUpdateTop');
  const statusText = document.getElementById('updaterStatusText');

  let currentReleaseUrl = '';
  let lastUpdaterState = null;
  let dismissed = false;

  function renderUpdaterState(st) {
    if (!st) return;
    lastUpdaterState = st;
    currentReleaseUrl = st.releaseUrl || '';
    const appVerBadge = document.getElementById('appVersionBadge');
    if (st.currentVersion) {
      if (appVerBadge) appVerBadge.textContent = `v${st.currentVersion}`;
      document.title = `OmniGrid Studio v${st.currentVersion} — Dein Streamer Cockpit`;
    }
    if (btnInstallSystem) btnInstallSystem.classList.toggle('hidden', st.status !== 'downloaded');
    if (btnTopUpdate) {
      if (st.status === 'checking') {
        btnTopUpdate.textContent = '⏳ Prüfe…';
        btnTopUpdate.style.background = '';
        btnTopUpdate.style.color = '#7dd3fc';
      } else if (st.status === 'downloading') {
        btnTopUpdate.textContent = `⬇️ Update ${st.percent || 0}%`;
        btnTopUpdate.style.background = 'rgba(14,165,233,0.22)';
        btnTopUpdate.style.color = '#7dd3fc';
      } else if (st.status === 'downloaded') {
        btnTopUpdate.textContent = '🚀 Update installieren';
        btnTopUpdate.style.background = '#0284c7';
        btnTopUpdate.style.color = '#fff';
      } else if (st.status === 'available') {
        btnTopUpdate.textContent = `🆕 Update v${st.latestVersion}`;
        btnTopUpdate.style.background = 'rgba(245,158,11,0.22)';
        btnTopUpdate.style.color = '#fde047';
      } else if (st.status === 'up-to-date') {
        btnTopUpdate.textContent = '✅ Aktuell';
        btnTopUpdate.style.background = '';
        btnTopUpdate.style.color = '#86efac';
      } else if (st.status === 'error') {
        btnTopUpdate.textContent = '⚠️ Update';
        btnTopUpdate.style.background = '';
        btnTopUpdate.style.color = '#fca5a5';
      } else {
        btnTopUpdate.textContent = '🔄 Update';
        btnTopUpdate.style.background = '';
        btnTopUpdate.style.color = '';
      }
    }
    if (statusText) {
      if (st.status === 'checking') {
        statusText.style.color = '#38bdf8';
        statusText.textContent = '⏳ Prüfe GitHub...';
      } else if (st.status === 'downloading') {
        statusText.style.color = '#38bdf8';
        statusText.textContent = `⬇️ Lade v${st.latestVersion} (${st.percent || 0}%)`;
      } else if (st.status === 'downloaded') {
        statusText.style.color = '#4ade80';
        statusText.textContent = `✅ v${st.latestVersion} bereit`;
      } else if (st.status === 'available') {
        statusText.style.color = '#fbbf24';
        statusText.textContent = `🆕 v${st.latestVersion} verfügbar`;
      } else if (st.status === 'up-to-date') {
        statusText.style.color = '#4ade80';
        statusText.textContent = `✅ Aktuell (v${st.currentVersion})`;
      } else if (st.status === 'error') {
        statusText.style.color = '#f87171';
        statusText.textContent = `❌ ${st.error || 'Fehler'}`;
      } else {
        statusText.style.color = '#94a3b8';
        statusText.textContent = st.currentVersion ? `v${st.currentVersion}` : 'v—';
      }
    }

    if (!banner || dismissed) return;
    const showBanner = st.status === 'downloading' || st.status === 'downloaded' || st.status === 'available';
    banner.style.display = showBanner ? 'flex' : 'none';
    if (!showBanner) return;

    if (st.status === 'downloading') {
      if (bannerText) bannerText.textContent = `⬇️ Update v${st.latestVersion} wird heruntergeladen (${st.percent || 0}%)...`;
      btnInstall?.classList.add('hidden');
      btnReleaseUrl?.classList.add('hidden');
    } else if (st.status === 'downloaded') {
      if (bannerText) bannerText.textContent = `🚀 Update v${st.latestVersion} heruntergeladen (${st.assetName || 'Paket'}) — bereit zur Installation!`;
      btnInstall?.classList.remove('hidden');
      btnReleaseUrl?.classList.toggle('hidden', !currentReleaseUrl);
    } else if (st.status === 'available') {
      if (bannerText) bannerText.textContent = `🆕 Neue Version v${st.latestVersion} auf GitHub verfügbar!`;
      btnInstall?.classList.add('hidden');
      btnReleaseUrl?.classList.toggle('hidden', !currentReleaseUrl);
    }
  }

  window.omnichat.onUpdaterState?.(renderUpdaterState);
  window.omnichat.updaterGetState?.().then(renderUpdaterState).catch(() => {});

  btnCheck?.addEventListener('click', async () => {
    dismissed = false;
    const st = await window.omnichat.updaterCheck?.({ autoDownload: true });
    renderUpdaterState(st);
  });

  btnForceManual?.addEventListener('click', async () => {
    dismissed = false;
    const st = await window.omnichat.updaterCheck?.({ autoDownload: true, forceDownload: true });
    renderUpdaterState(st);
  });

  btnTopUpdate?.addEventListener('click', async () => {
    dismissed = false;
    if (lastUpdaterState?.status === 'downloaded') {
      await window.omnichat.updaterInstall?.();
      return;
    }
    const st = await window.omnichat.updaterCheck?.({ autoDownload: true });
    renderUpdaterState(st);
  });

  const runInstallUpdate = async () => {
    if (btnInstall) btnInstall.disabled = true;
    if (btnInstallSystem) btnInstallSystem.disabled = true;
    await window.omnichat.updaterInstall?.();
    if (btnInstall) btnInstall.disabled = false;
    if (btnInstallSystem) btnInstallSystem.disabled = false;
  };
  btnInstall?.addEventListener('click', runInstallUpdate);
  btnInstallSystem?.addEventListener('click', runInstallUpdate);

  btnReleaseUrl?.addEventListener('click', () => {
    if (currentReleaseUrl) window.omnichat.openExternalUrl?.(currentReleaseUrl);
  });

  btnDismiss?.addEventListener('click', () => {
    dismissed = true;
    if (banner) banner.style.display = 'none';
  });
})();

// ======================================================
// ELGATO KEY LIGHT & STREAM LIGHTING UI
// ======================================================
(function initElgatoLightsUI() {
  const inpIps = document.getElementById('inputElgatoIps');
  const btnDiscover = document.getElementById('btnElgatoDiscover');
  const btnOn = document.getElementById('btnElgatoOn');
  const btnOff = document.getElementById('btnElgatoOff');
  const btnToggle = document.getElementById('btnElgatoToggle');
  const rngBr = document.getElementById('rngElgatoBrightness');
  const valBr = document.getElementById('valElgatoBrightness');
  const rngTp = document.getElementById('rngElgatoTemp');
  const valTp = document.getElementById('valElgatoTemp');
  const chkOn = document.getElementById('chkElgatoAutoOnLive');
  const chkOff = document.getElementById('chkElgatoAutoOffStop');
  const statusEl = document.getElementById('elgatoLightsStatus');

  function setStatus(msg, color = '#94a3b8') {
    if (!statusEl) return;
    statusEl.style.color = color;
    statusEl.textContent = msg;
  }

  function saveElgatoConfig() {
    window.omnichat.saveProfile(getFormConfig());
  }

  [inpIps, chkOn, chkOff].forEach((el) => {
    el?.addEventListener('change', saveElgatoConfig);
  });

  let sliderDebounce = null;
  function scheduleLiveApply() {
    saveElgatoConfig();
    if (!inpIps?.value.trim()) return;
    clearTimeout(sliderDebounce);
    sliderDebounce = setTimeout(async () => {
      const res = await window.omnichat.elgatoLightsSet?.({
        ips: inpIps.value.trim(),
        brightness: parseInt(rngBr?.value || '60', 10) || 60,
        temperatureK: parseInt(rngTp?.value || '4500', 10) || 4500
      });
      if (res?.ok) setStatus(`✅ ${res.updated.length} Licht(er) aktualisiert`, '#4ade80');
    }, 180);
  }

  rngBr?.addEventListener('input', () => {
    if (valBr) valBr.textContent = `${rngBr.value}%`;
    scheduleLiveApply();
  });

  rngTp?.addEventListener('input', () => {
    if (valTp) valTp.textContent = `${rngTp.value}K`;
    scheduleLiveApply();
  });

  btnDiscover?.addEventListener('click', async () => {
    btnDiscover.disabled = true;
    setStatus('🔍 Suche Elgato Lichter im lokalen WLAN (Port 9123)...', '#38bdf8');
    try {
      const res = await window.omnichat.elgatoLightsDiscover?.();
      const found = res?.lights || [];
      if (!found.length) {
        setStatus('⚠️ Keine Elgato Lichter gefunden. Bitte IP manuell eintragen.', '#fbbf24');
      } else {
        const ips = found.map((l) => l.ip).join(', ');
        if (inpIps) inpIps.value = ips;
        saveElgatoConfig();
        const names = found.map((l) => `${l.name} (${l.ip})`).join(', ');
        setStatus(`✅ Gefunden: ${names}`, '#4ade80');
      }
    } catch (e) {
      setStatus(`❌ Suche fehlgeschlagen: ${e.message}`, '#f87171');
    } finally {
      btnDiscover.disabled = false;
    }
  });

  btnOn?.addEventListener('click', async () => {
    saveElgatoConfig();
    setStatus('⏳ Schalte Elgato Licht(er) ein...', '#38bdf8');
    const res = await window.omnichat.elgatoLightsSet?.({
      ips: inpIps?.value.trim() || '',
      on: true,
      brightness: parseInt(rngBr?.value || '60', 10) || 60,
      temperatureK: parseInt(rngTp?.value || '4500', 10) || 4500
    });
    if (res?.ok) {
      setStatus(`💡 Eingeschaltet (${res.updated.length} Gerät(e))`, '#4ade80');
    } else {
      setStatus(`❌ ${res?.error || 'Konnte Licht nicht erreichen.'}`, '#f87171');
    }
  });

  btnOff?.addEventListener('click', async () => {
    saveElgatoConfig();
    setStatus('⏳ Schalte Elgato Licht(er) aus...', '#38bdf8');
    const res = await window.omnichat.elgatoLightsSet?.({
      ips: inpIps?.value.trim() || '',
      on: false
    });
    if (res?.ok) {
      setStatus(`🌑 Ausgeschaltet (${res.updated.length} Gerät(e))`, '#94a3b8');
    } else {
      setStatus(`❌ ${res?.error || 'Konnte Licht nicht erreichen.'}`, '#f87171');
    }
  });

  btnToggle?.addEventListener('click', async () => {
    saveElgatoConfig();
    const res = await window.omnichat.elgatoLightsToggle?.({
      ips: inpIps?.value.trim() || '',
      brightness: parseInt(rngBr?.value || '60', 10) || 60,
      temperatureK: parseInt(rngTp?.value || '4500', 10) || 4500
    });
    if (res?.ok) {
      const isOn = res.updated?.[0]?.on;
      setStatus(isOn ? '💡 Eingeschaltet' : '🌑 Ausgeschaltet', isOn ? '#4ade80' : '#94a3b8');
    } else {
      setStatus(`❌ ${res?.error || 'Konnte Licht nicht erreichen.'}`, '#f87171');
    }
  });
})();

// ======================================================
// GOVEE SMART-LIGHT & EVENT SCENES UI
// ======================================================
(function initGoveeLightsUI() {
  const chkEnabled = document.getElementById('chkGoveeEnabled');
  const btnOpenUrl = document.getElementById('btnGoveeOpenKeyUrl');
  const inpApiKey = document.getElementById('inputGoveeApiKey');
  const btnLoad = document.getElementById('btnGoveeLoadDevices');
  const selDevice = document.getElementById('selGoveeDevice');
  const numRevert = document.getElementById('numGoveeRevertSec');
  const statusEl = document.getElementById('goveeLightsStatus');

  const DEFAULT_COLOR_SCENES = [
    { id: 'color:#9146ff', name: '🎨 Farbe: Twitch Lila (#9146ff)' },
    { id: 'color:#38bdf8', name: '🎨 Farbe: Cyber Cyan (#38bdf8)' },
    { id: 'color:#ef4444', name: '🎨 Farbe: Raid / Alarm Rot (#ef4444)' },
    { id: 'color:#10b981', name: '🎨 Farbe: Emerald Grün (#10b981)' },
    { id: 'color:#f59e0b', name: '🎨 Farbe: Gold / Bits Amber (#f59e0b)' },
    { id: 'color:#ec4899', name: '🎨 Farbe: SubGift Neon Pink (#ec4899)' },
    { id: 'color:#a855f7', name: '🎨 Farbe: Resub Violett (#a855f7)' },
    { id: 'color:#ffffff', name: '🎨 Farbe: Studio Tageslicht Weiß (#ffffff)' },
    { id: 'power:on', name: '💡 Gerät Einschalten' },
    { id: 'power:off', name: '🌑 Gerät Ausschalten' }
  ];

  const checklistEl = document.getElementById('goveeDevicesChecklist');
  const btnOnlyFirst = document.getElementById('btnGoveeSelectOnlyFirst');
  const btnSelectAll = document.getElementById('btnGoveeSelectAll');

  function setStatus(msg, color = '#94a3b8') {
    if (!statusEl) return;
    statusEl.style.color = color;
    statusEl.textContent = msg;
  }

  function saveGoveeConfig() {
    window.omnichat.saveProfile(getFormConfig());
  }

  function renderDevicesChecklist(selectedDevices = []) {
    if (!checklistEl) return;
    if (!goveeCachedDevices.length) {
      checklistEl.textContent = 'Zuerst API-Key eingeben & auf „🔄 Geräte & Szenen laden“ klicken.';
      return;
    }
    const selSet = new Set(Array.isArray(selectedDevices) && selectedDevices.length ? selectedDevices : [`${goveeCachedDevices[0].sku}||${goveeCachedDevices[0].device}`]);
    checklistEl.innerHTML = '';
    goveeCachedDevices.forEach((d) => {
      const key = `${d.sku}||${d.device}`;
      const row = document.createElement('label');
      row.className = 'checkbox-row';
      row.style.marginTop = '2px';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'govee-dev-chk';
      cb.value = key;
      cb.checked = selSet.has(key);
      cb.addEventListener('change', saveGoveeConfig);
      const sp = document.createElement('span');
      sp.textContent = `💡 ${d.deviceName} (${d.sku})`;
      row.appendChild(cb);
      row.appendChild(sp);
      checklistEl.appendChild(row);
    });
  }

  function renderEventDeviceDropdowns(eventDevices = {}) {
    GOVEE_EVENT_KEYS.forEach((evKey) => {
      const sel = document.getElementById(`selGoveeDev_${evKey}`);
      if (!sel) return;
      const curVal = eventDevices[evKey] !== undefined ? eventDevices[evKey] : sel.value;
      sel.innerHTML = '';
      const defOpt = document.createElement('option');
      defOpt.value = '';
      defOpt.textContent = '🎯 Gewählte Lampe(n)';
      sel.appendChild(defOpt);
      goveeCachedDevices.forEach((d) => {
        const key = `${d.sku}||${d.device}`;
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `💡 Nur: ${d.deviceName}`;
        if (key === curVal) opt.selected = true;
        sel.appendChild(opt);
      });
    });
  }

  function renderDeviceDropdown(selectedSku, selectedDevice) {
    if (!selDevice) return;
    selDevice.innerHTML = '';
    if (!goveeCachedDevices.length) {
      const ph = document.createElement('option');
      ph.value = selectedSku && selectedDevice ? `${selectedSku}||${selectedDevice}` : '';
      ph.textContent = selectedSku && selectedDevice ? `${selectedSku} (${selectedDevice})` : '— Zuerst API-Key eingeben & Geräte laden —';
      selDevice.appendChild(ph);
      return;
    }
    goveeCachedDevices.forEach((d) => {
      const opt = document.createElement('option');
      opt.value = `${d.sku}||${d.device}`;
      opt.textContent = `${d.deviceName} [${d.sku}]`;
      if (d.sku === selectedSku && d.device === selectedDevice) opt.selected = true;
      selDevice.appendChild(opt);
    });
  }

  function renderEventSceneDropdowns(eventScenes = {}) {
    const scenes = goveeCachedScenes.length ? goveeCachedScenes : DEFAULT_COLOR_SCENES;
    GOVEE_EVENT_KEYS.forEach((evKey) => {
      const sel = document.getElementById(`selGovee_${evKey}`);
      if (!sel) return;
      const curVal = eventScenes[evKey] !== undefined ? eventScenes[evKey] : sel.value;
      sel.innerHTML = '';
      const noneOpt = document.createElement('option');
      noneOpt.value = '';
      noneOpt.textContent = '— Keine Aktion / Aus —';
      sel.appendChild(noneOpt);
      scenes.forEach((sc) => {
        const opt = document.createElement('option');
        opt.value = sc.id;
        opt.textContent = sc.name;
        if (sc.id === curVal) opt.selected = true;
        sel.appendChild(opt);
      });
    });
  }

  window.__populateGoveeUI = (gov = {}) => {
    renderDeviceDropdown(gov.sku, gov.device);
    renderDevicesChecklist(gov.selectedDevices || (gov.sku && gov.device ? [`${gov.sku}||${gov.device}`] : []));
    renderEventDeviceDropdowns(gov.eventDevices || {});
    renderEventSceneDropdowns(gov.eventScenes || {});
  };

  renderEventDeviceDropdowns({});
  renderEventSceneDropdowns({});

  btnOnlyFirst?.addEventListener('click', () => {
    const cbs = Array.from(document.querySelectorAll('.govee-dev-chk'));
    const catalogVal = selDevice?.value || '';
    let matched = false;
    cbs.forEach((cb) => {
      if (!matched && (cb.value === catalogVal || !catalogVal)) {
        cb.checked = true;
        matched = true;
      } else {
        cb.checked = false;
      }
    });
    if (!matched && cbs[0]) cbs[0].checked = true;
    saveGoveeConfig();
  });

  btnSelectAll?.addEventListener('click', () => {
    document.querySelectorAll('.govee-dev-chk').forEach((cb) => { cb.checked = true; });
    saveGoveeConfig();
  });

  btnOpenUrl?.addEventListener('click', () => {
    window.omnichat.openExternalUrl?.('https://developer.govee.com/');
  });

  [chkEnabled, inpApiKey, numRevert].forEach((el) => {
    el?.addEventListener('change', saveGoveeConfig);
  });

  GOVEE_EVENT_KEYS.forEach((evKey) => {
    document.getElementById(`selGovee_${evKey}`)?.addEventListener('change', saveGoveeConfig);
    document.getElementById(`selGoveeDev_${evKey}`)?.addEventListener('change', saveGoveeConfig);
  });

  async function loadScenesForCurrentDevice() {
    const [sku, device] = String(selDevice?.value || '').split('||');
    const apiKey = inpApiKey?.value.trim() || '';
    if (!apiKey || !sku || !device) return;
    setStatus(`⏳ Lade Govee-Szenen für ${sku}...`, '#38bdf8');
    const currentSelections = {};
    GOVEE_EVENT_KEYS.forEach((k) => {
      currentSelections[k] = document.getElementById(`selGovee_${k}`)?.value || '';
    });
    const scRes = await window.omnichat.goveeListScenes?.({ apiKey, sku, device });
    if (scRes?.scenes) {
      goveeCachedScenes = scRes.scenes;
      renderEventSceneDropdowns(currentSelections);
      saveGoveeConfig();
      setStatus(`✅ ${goveeCachedScenes.length} Szenen & Licht-Aktionen für ${sku} geladen!`, '#4ade80');
    } else {
      setStatus(`⚠️ ${scRes?.error || 'Szenen konnten nicht geladen werden.'}`, '#fbbf24');
    }
  }

  selDevice?.addEventListener('change', async () => {
    saveGoveeConfig();
    await loadScenesForCurrentDevice();
  });

  btnLoad?.addEventListener('click', async () => {
    const apiKey = inpApiKey?.value.trim() || '';
    if (!apiKey) {
      setStatus('⚠️ Bitte zuerst deinen Govee API-Key eintragen.', '#fbbf24');
      return;
    }
    btnLoad.disabled = true;
    setStatus('⏳ Lade Govee-Geräte von Govee OpenAPI...', '#38bdf8');
    try {
      const res = await window.omnichat.goveeListDevices?.({ apiKey });
      if (!res?.ok) {
        setStatus(`❌ ${res?.error || 'Fehler beim Abrufen der Govee-Geräte.'}`, '#f87171');
        return;
      }
      goveeCachedDevices = res.devices || [];
      if (!goveeCachedDevices.length) {
        setStatus('⚠️ Keine Govee-Geräte auf diesem API-Key gefunden.', '#fbbf24');
        return;
      }
      const first = goveeCachedDevices[0];
      renderDeviceDropdown(first.sku, first.device);
      renderDevicesChecklist([`${first.sku}||${first.device}`]);
      const curDevMap = {};
      GOVEE_EVENT_KEYS.forEach((k) => {
        curDevMap[k] = document.getElementById(`selGoveeDev_${k}`)?.value || '';
      });
      renderEventDeviceDropdowns(curDevMap);
      saveGoveeConfig();
      await loadScenesForCurrentDevice();
    } finally {
      btnLoad.disabled = false;
    }
  });

  document.querySelectorAll('.govee-test-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const evKey = btn.getAttribute('data-govee-test');
      const actionId = document.getElementById(`selGovee_${evKey}`)?.value || '';
      const perEventDev = document.getElementById(`selGoveeDev_${evKey}`)?.value || '';
      const checkedDevs = Array.from(document.querySelectorAll('.govee-dev-chk:checked')).map((cb) => cb.value).filter(Boolean);
      const fallbackDev = selDevice?.value || '';
      const targets = perEventDev ? [perEventDev] : (checkedDevs.length ? checkedDevs : (fallbackDev ? [fallbackDev] : []));
      const apiKey = inpApiKey?.value.trim() || '';
      if (!apiKey || !targets.length) {
        setStatus('⚠️ Bitte zuerst API-Key eingeben und mindestens eine Govee-Lampe auswählen.', '#fbbf24');
        return;
      }
      if (!actionId) {
        setStatus('⚠️ Bitte zuerst eine Szene oder Farbe für dieses Event auswählen.', '#fbbf24');
        return;
      }
      setStatus(`⏳ Teste Govee-Szene für "${evKey}" (${targets.length} Lampe(n))...`, '#38bdf8');
      const res = await window.omnichat.goveeApplyAction?.({ apiKey, targets, actionId });
      if (res?.ok) {
        setStatus(`✅ Govee-Szene für "${evKey}" an ${res.updatedCount || targets.length} Lampe(n) gesendet!`, '#4ade80');
      } else {
        setStatus(`❌ ${res?.error || 'Govee-Steuerung fehlgeschlagen.'}`, '#f87171');
      }
    });
  });
})();

// ======================================================
// MULTI-PLATFORM RTMP RESTREAMING RELAY UI
// ======================================================
(function initMultiStreamRelayUI() {
  const badgeLive = document.getElementById('msLiveBadge');
  const telemetryLive = document.getElementById('msLiveTelemetry');
  const btnLiveStart = document.getElementById('btnMsLiveStart');
  const btnLiveStop = document.getElementById('btnMsLiveStop');
  const btnOpenCfg = document.getElementById('btnMsOpenCfg');

  const numPort = document.getElementById('numMsPort');
  const inpLocalKey = document.getElementById('inputMsLocalKey');
  const inpIngestPreview = document.getElementById('inputMsIngestPreview');
  const btnConfigObs = document.getElementById('btnMsConfigureObs');
  const btnCfgStart = document.getElementById('btnMsCfgStart');
  const btnCfgStop = document.getElementById('btnMsCfgStop');
  const statusCfg = document.getElementById('msCfgStatus');

  const inputIds = [
    'numMsPort', 'inputMsLocalKey', 'chkMsAutoConfigObs', 'chkMsAutoStartObs',
    'chkMsTwitch', 'inputMsTwitchUrl', 'inputMsTwitchKey',
    'chkMsYoutube', 'inputMsYoutubeUrl', 'inputMsYoutubeKey', 'selMsYoutubePrivacy',
    'chkMsTiktok', 'inputMsTiktokUrl', 'inputMsTiktokKey',
    'chkMsCustom', 'inputMsCustomName', 'inputMsCustomUrl', 'inputMsCustomKey'
  ];

  function saveMsConfig() {
    if (inpIngestPreview && numPort) {
      inpIngestPreview.value = `rtmp://127.0.0.1:${numPort.value || 1935}/live`;
    }
    window.omnichat.saveProfile(getFormConfig());
  }

  inputIds.forEach((id) => {
    document.getElementById(id)?.addEventListener('change', saveMsConfig);
  });

  function renderRelayState(st) {
    if (!st) return;
    const isRunning = Boolean(st.active);
    btnLiveStart?.classList.toggle('hidden', isRunning);
    btnLiveStop?.classList.toggle('hidden', !isRunning);
    btnCfgStart?.classList.toggle('hidden', isRunning);
    btnCfgStop?.classList.toggle('hidden', !isRunning);

    const targetsStr = (st.activeTargets || []).join(' + ') || 'Keine Ziele';
    const warnSuffix =
      Array.isArray(st.warnings) && st.warnings.length ? ` • ${st.warnings.join(' | ')}` : '';
    const ytSuffix = st.youtubeWatchUrl ? ` • 🔴 YT: ${st.youtubeWatchUrl}` : '';
    if (st.status === 'streaming') {
      if (badgeLive) {
        badgeLive.textContent = '(🔴 LIVE)';
        badgeLive.style.color = st.warnings?.length ? '#fbbf24' : '#4ade80';
      }
      const statLine = `🔴 LIVE → ${targetsStr} • ${st.bitrateKbps || 0} kbps • ${st.fps || 0} FPS (${st.uptime || '00:00:00'})${ytSuffix}${warnSuffix}`;
      if (telemetryLive) {
        telemetryLive.style.color = st.warnings?.length ? '#fbbf24' : '#4ade80';
        telemetryLive.textContent = statLine;
      }
      if (statusCfg) {
        statusCfg.style.color = st.warnings?.length ? '#fbbf24' : '#4ade80';
        statusCfg.textContent = statLine;
      }
    } else if (st.status === 'waiting') {
      if (badgeLive) {
        badgeLive.textContent = '(⏳ Wartet auf OBS)';
        badgeLive.style.color = '#38bdf8';
      }
      const waitLine = `⏳ Relay bereit (${st.ingestServer}/${st.ingestKey}) → Wartet auf OBS-Stream (${targetsStr})${ytSuffix}${warnSuffix}`;
      if (telemetryLive) {
        telemetryLive.style.color = st.warnings?.length ? '#fbbf24' : '#38bdf8';
        telemetryLive.textContent = waitLine;
      }
      if (statusCfg) {
        statusCfg.style.color = st.warnings?.length ? '#fbbf24' : '#38bdf8';
        statusCfg.textContent = waitLine;
      }
    } else if (st.status === 'error') {
      if (badgeLive) {
        badgeLive.textContent = '(❌ Fehler)';
        badgeLive.style.color = '#f87171';
      }
      if (telemetryLive) {
        telemetryLive.style.color = '#f87171';
        telemetryLive.textContent = `❌ ${st.error || 'Relay-Fehler'}`;
      }
      if (statusCfg) {
        statusCfg.style.color = '#f87171';
        statusCfg.textContent = `❌ ${st.error || 'Relay-Fehler'}`;
      }
    } else {
      if (badgeLive) {
        badgeLive.textContent = '(Aus)';
        badgeLive.style.color = '#94a3b8';
      }
      if (telemetryLive) {
        telemetryLive.style.color = '#94a3b8';
        telemetryLive.textContent = 'OBS rendert 1× → OmniGrid verteilt';
      }
      if (statusCfg) {
        statusCfg.style.color = '#94a3b8';
        statusCfg.textContent = 'Bereit';
      }
    }
  }

  window.omnichat.onMultiStreamState?.(renderRelayState);
  window.omnichat.multiStreamGetState?.().then(renderRelayState).catch(() => {});
  window.omnichat.onMultiStreamConfigSynced?.((ms) => {
    if (!ms?.targets?.youtube) return;
    const chk = document.getElementById('chkMsYoutube');
    const urlInp = document.getElementById('inputMsYoutubeUrl');
    const keyInp = document.getElementById('inputMsYoutubeKey');
    const privSel = document.getElementById('selMsYoutubePrivacy');
    if (chk) chk.checked = Boolean(ms.targets.youtube.enabled);
    if (urlInp && ms.targets.youtube.serverUrl) urlInp.value = ms.targets.youtube.serverUrl;
    if (keyInp && ms.targets.youtube.streamKey) keyInp.value = ms.targets.youtube.streamKey;
    if (privSel && ms.targets.youtube.privacyStatus) privSel.value = ms.targets.youtube.privacyStatus;
  });

  document.getElementById('btnOpenGoogleCloudConsole')?.addEventListener('click', () => {
    window.omnichat.openExternalUrl?.('https://console.cloud.google.com/apis/library/youtube.googleapis.com');
  });

  document.getElementById('btnMsPrepareYoutube')?.addEventListener('click', async () => {
    saveMsConfig();
    if (statusCfg) {
      statusCfg.style.color = '#38bdf8';
      statusCfg.textContent = '⏳ Lade YouTube Stream-Schlüssel & bereite YouTube Live-Broadcast per OAuth2 vor...';
    }
    const res = await window.omnichat.multiStreamPrepareYoutube?.({ multiStream: getMultiStreamSettings() });
    if (res?.ok) {
      if (statusCfg) {
        statusCfg.style.color = '#4ade80';
        statusCfg.textContent = `✅ YouTube bereit! Stream-Key geladen & Broadcast (${res.privacyStatus}) auf Auto-Start gesetzt: ${res.watchUrl}`;
      }
    } else if (statusCfg) {
      statusCfg.style.color = '#f87171';
      statusCfg.textContent = `❌ ${res?.error || 'YouTube OAuth2 Vorbereitung fehlgeschlagen.'}`;
    }
  });

  async function handleStart() {
    saveMsConfig();
    const multiStream = getMultiStreamSettings();
    const res = await window.omnichat.multiStreamStart?.({ multiStream });
    if (res?.state) renderRelayState(res.state);
    if (!res?.ok && res?.error) {
      if (statusCfg) {
        statusCfg.style.color = '#f87171';
        statusCfg.textContent = `❌ ${res.error}`;
      }
      if (telemetryLive) {
        telemetryLive.style.color = '#f87171';
        telemetryLive.textContent = `❌ ${res.error}`;
      }
    }
  }

  async function handleStop() {
    const res = await window.omnichat.multiStreamStop?.();
    if (res?.state) renderRelayState(res.state);
  }

  btnLiveStart?.addEventListener('click', handleStart);
  btnCfgStart?.addEventListener('click', handleStart);
  btnLiveStop?.addEventListener('click', handleStop);
  btnCfgStop?.addEventListener('click', handleStop);

  btnConfigObs?.addEventListener('click', async () => {
    saveMsConfig();
    const multiStream = getMultiStreamSettings();
    const res = await window.omnichat.multiStreamConfigureObs?.({ multiStream });
    if (res?.ok) {
      if (statusCfg) {
        statusCfg.style.color = '#4ade80';
        statusCfg.textContent = `✅ OBS vollautomatisch auf ${res.server} (Key: ${res.key}) eingestellt & Erweitertes-Broadcasting-Konflikt deaktiviert!`;
      }
    } else if (statusCfg) {
      statusCfg.style.color = '#f87171';
      statusCfg.textContent = `❌ ${res?.error || 'OBS konnte nicht erreicht werden (bitte OBS starten).'}`;
    }
  });

  btnOpenCfg?.addEventListener('click', () => {
    document.getElementById('configPageModal')?.classList.remove('hidden');
    const tabBtn = document.querySelector('.config-tab-btn[data-cfg-tab="platforms"]');
    tabBtn?.click();
  });
})();

// ======================================================
// GITHUB DISCUSSIONS & FEEDBACK MODAL UI
// ======================================================
(function initFeedbackModalUI() {
  const modal = document.getElementById('feedbackModal');
  const btnOpen = document.getElementById('btnOpenFeedback');
  const btnClose = document.getElementById('btnCloseFeedback');
  const selCategory = document.getElementById('selFeedbackCategory');
  const inpTitle = document.getElementById('inputFeedbackTitle');
  const txtBody = document.getElementById('txtFeedbackBody');
  const inpToken = document.getElementById('inputFeedbackGhToken');
  const btnDiscussion = document.getElementById('btnSubmitFeedbackDiscussion');
  const btnIssue = document.getElementById('btnSubmitFeedbackIssue');
  const statusEl = document.getElementById('feedbackStatus');

  if (!modal) return;

  try {
    const savedTok = localStorage.getItem('omnigrid_gh_feedback_token') || '';
    if (inpToken && savedTok) inpToken.value = savedTok;
  } catch (e) {}

  function setStatus(msg, color = '#94a3b8') {
    if (!statusEl) return;
    statusEl.style.color = color;
    statusEl.textContent = msg;
  }

  btnOpen?.addEventListener('click', () => {
    setStatus('');
    modal.classList.remove('hidden');
    inpTitle?.focus();
  });

  function closeModal() {
    modal.classList.add('hidden');
  }

  btnClose?.addEventListener('click', closeModal);

  async function submitFeedback(targetType) {
    const title = inpTitle?.value.trim() || '';
    const body = txtBody?.value.trim() || '';
    const category = selCategory?.value || 'ideas';
    const githubToken = inpToken?.value.trim() || '';

    if (!title) {
      setStatus('⚠️ Bitte gib einen kurzen Titel ein.', '#fbbf24');
      inpTitle?.focus();
      return;
    }

    try {
      if (githubToken) localStorage.setItem('omnigrid_gh_feedback_token', githubToken);
      else localStorage.removeItem('omnigrid_gh_feedback_token');
    } catch (e) {}

    setStatus('⏳ Übermittle Feedback zu GitHub...', '#38bdf8');
    const res = await window.omnichat.submitGithubFeedback?.({
      category,
      title,
      body,
      targetType,
      githubToken
    });

    if (res?.ok) {
      if (inpTitle) inpTitle.value = '';
      if (txtBody) txtBody.value = '';
      if (res.mode === 'api') {
        setStatus('✅ GitHub Discussion direkt per API angelegt & im Browser geöffnet!', '#4ade80');
      } else {
        setStatus('✅ Vorausgefüllte GitHub Discussion im Browser geöffnet!', '#4ade80');
      }
    } else {
      setStatus(`❌ ${res?.error || 'Konnte Feedback nicht öffnen.'}`, '#f87171');
    }
  }

  btnDiscussion?.addEventListener('click', () => submitFeedback('discussion'));
  btnIssue?.addEventListener('click', () => submitFeedback('issue'));
})();

// ======================================================
// PRIVACY & ZERO-TELEMETRY PROOF MODAL UI
// ======================================================
(function initPrivacyAuditModalUI() {
  const modal = document.getElementById('privacyAuditModal');
  const btnOpen = document.getElementById('btnOpenPrivacyAudit');
  const btnClose = document.getElementById('btnClosePrivacyAudit');
  const banner = document.getElementById('privacyAuditBanner');
  const inpConfigPath = document.getElementById('inputPrivacyConfigPath');
  const inpSrcPath = document.getElementById('inputPrivacySrcPath');
  const inpOsCmd = document.getElementById('inputPrivacyOsCmd');
  const btnRevealConfig = document.getElementById('btnPrivacyRevealConfig');
  const btnOpenSrc = document.getElementById('btnPrivacyOpenSrc');
  const btnCopyOsCmd = document.getElementById('btnPrivacyCopyOsCmd');
  const btnRescan = document.getElementById('btnPrivacyRescan');
  const domainsList = document.getElementById('privacyDomainsList');

  if (!modal) return;

  async function runAudit() {
    if (banner) {
      banner.style.color = '#38bdf8';
      banner.textContent = '⏳ Scanne laufenden App-Quellcode (src/) auf Netzwerk-Domains...';
    }
    const res = await window.omnichat.privacyAuditRun?.();
    if (!res) return;
    if (inpConfigPath) inpConfigPath.value = res.configPath || '';
    if (inpSrcPath) inpSrcPath.value = res.srcPath || '';
    if (inpOsCmd) inpOsCmd.value = res.osNetCmd || '';

    if (banner) {
      if (res.ok) {
        banner.style.color = '#4ade80';
        banner.style.borderColor = 'rgba(16,185,129,0.45)';
        banner.textContent = `✅ ZERO-TELEMETRY AUDIT BESTANDEN: ${res.scannedFiles} Quellcode-Dateien (${res.totalEndpoints} Endpunkte) live geprüft — 0 fremde Server, 0 Tracker, 100 % direkte offizielle APIs.`;
      } else {
        banner.style.color = '#f87171';
        banner.textContent = `⚠️ Unbekannte Domains gefunden (${res.unknownEndpoints?.length || 0})`;
      }
    }

    if (domainsList) {
      domainsList.innerHTML = '';
      (res.domains || []).forEach((d) => {
        const row = document.createElement('div');
        row.style.cssText = 'display: grid; grid-template-columns: 210px 1fr auto; gap: 8px; align-items: center; padding: 5px 8px; border-radius: 6px; background: rgba(15,23,42,0.75); border: 1px solid rgba(148,163,184,0.14);';
        const hostSpan = document.createElement('strong');
        hostSpan.style.color = d.allowed ? '#4ade80' : '#f87171';
        hostSpan.textContent = `${d.allowed ? '✅' : '❌'} ${d.host}`;
        const purposeSpan = document.createElement('span');
        purposeSpan.style.color = '#cbd5e1';
        purposeSpan.textContent = d.purpose;
        const countSpan = document.createElement('span');
        countSpan.style.cssText = 'color: #64748b; font-size: 10px; white-space: nowrap;';
        countSpan.textContent = `${d.count}× (${(d.examples || [])[0] || ''})`;
        row.appendChild(hostSpan);
        row.appendChild(purposeSpan);
        row.appendChild(countSpan);
        domainsList.appendChild(row);
      });
    }
  }

  btnOpen?.addEventListener('click', () => {
    modal.classList.remove('hidden');
    runAudit();
  });

  function closeModal() {
    modal.classList.add('hidden');
  }

  btnClose?.addEventListener('click', closeModal);

  btnRescan?.addEventListener('click', runAudit);
  btnRevealConfig?.addEventListener('click', () => window.omnichat.privacyOpenPath?.('config'));
  btnOpenSrc?.addEventListener('click', () => window.omnichat.privacyOpenPath?.('src'));

  btnCopyOsCmd?.addEventListener('click', () => {
    if (!inpOsCmd?.value) return;
    navigator.clipboard.writeText(inpOsCmd.value);
    btnCopyOsCmd.textContent = '✅ Kopiert!';
    setTimeout(() => {
      btnCopyOsCmd.textContent = '📋 Befehl kopieren';
    }, 1500);
  });
})();







// ======================================================
// DISCORD LIVE-ANNOUNCER STATUS
// ======================================================
function renderDiscordLiveStatus(state) {
  const el = document.getElementById('ssDiscordLiveStatus');
  if (!el) return;
  if (!state || !state.active) {
    el.style.color = '#94a3b8';
    el.textContent = 'Kein aktiver Live-Post.';
    return;
  }
  const since = new Date(state.startedAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const src = { obs: 'OBS', twitch: 'Twitch', manual: 'manuell' }[state.source] || state.source || '';
  el.style.color = '#f87171';
  el.textContent = `🔴 Live-Post aktiv seit ${since} (${src})${state.game ? ` • ${state.game}` : ''}${state.peakViewers ? ` • Peak ${state.peakViewers}` : ''}`;
}

window.omnichat.onDiscordLiveState?.((state) => renderDiscordLiveStatus(state));
// Beim Start: laufende Live-Session (z. B. nach App-Neustart) wieder aufnehmen
window.omnichat.discordLiveGet?.().then((r) => renderDiscordLiveStatus(r?.state)).catch(() => {});

// ======================================================
// JSON I18N / MULTI-LANGUAGE SYSTEM (DE / EN + EXTENSIBLE)
// ======================================================
(function initI18nSystem() {
  const selLang = document.getElementById('selAppLanguage');
  let activeBundle = null;
  let textMap = new Map();
  let titleMap = new Map();
  let phMap = new Map();
  let isApplying = false;

  function normWs(s) {
    return String(s || '').replace(/\s+/g, ' ').trim();
  }

  function collectPairs(baseObj, activeObj, targetMap, normalize = true) {
    if (!baseObj || typeof baseObj !== 'object') return;
    for (const k of Object.keys(baseObj)) {
      const bVal = baseObj[k];
      const aVal = activeObj ? activeObj[k] : undefined;
      if (typeof bVal === 'string' && typeof aVal === 'string') {
        targetMap.set(normalize ? normWs(bVal) : bVal.trim(), aVal);
      } else if (bVal && typeof bVal === 'object') {
        collectPairs(bVal, aVal || {}, targetMap, normalize);
      }
    }
  }

  window.tDyn = function tDyn(key, vars = {}) {
    const dyn = activeBundle?.active?.dynamic || {};
    let str = dyn[key] || activeBundle?.base?.dynamic?.[key] || key;
    if (vars && typeof vars === 'object') {
      for (const [vk, vv] of Object.entries(vars)) {
        str = str.replace(new RegExp(`\\{${vk}\\}`, 'g'), String(vv));
      }
    }
    return str;
  };

  function shouldSkipElement(el) {
    if (!el || el.nodeType !== 1) return false;
    const tag = el.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return true;
    if (el.classList?.contains('chat-msg')) return true;
    const id = el.id;
    if (id === 'diagLogList' || id === 'eventTickerList' || id === 'pinnedBody' || id === 'selAppLanguage') return true;
    return false;
  }

  function translateSubtree(root) {
    if (!root || !activeBundle) return;
    isApplying = true;
    try {
      const stack = [root];
      while (stack.length) {
        const node = stack.pop();
        if (node.nodeType === 1) {
          if (shouldSkipElement(node)) continue;

          if (node.hasAttribute('title')) {
            if (node.__i18nOrigTitle === undefined) {
              const cur = node.getAttribute('title') || '';
              if (titleMap.has(normWs(cur))) node.__i18nOrigTitle = normWs(cur);
            }
            if (node.__i18nOrigTitle && titleMap.has(node.__i18nOrigTitle)) {
              const nextT = titleMap.get(node.__i18nOrigTitle);
              if (node.getAttribute('title') !== nextT) node.setAttribute('title', nextT);
            }
          }

          if (node.tagName === 'OPTGROUP' && node.hasAttribute('label')) {
            if (node.__i18nOrigLabel === undefined) {
              const curL = normWs(node.getAttribute('label') || '');
              if (textMap.has(curL)) node.__i18nOrigLabel = curL;
            }
            if (node.__i18nOrigLabel && textMap.has(node.__i18nOrigLabel)) {
              const nextL = textMap.get(node.__i18nOrigLabel);
              if (node.getAttribute('label') !== nextL) node.setAttribute('label', nextL);
            }
          }

          if (node.hasAttribute('placeholder')) {
            if (node.__i18nOrigPh === undefined) {
              const curP = (node.getAttribute('placeholder') || '').trim();
              if (phMap.has(curP)) node.__i18nOrigPh = curP;
              else if (phMap.has(normWs(curP))) node.__i18nOrigPh = normWs(curP);
            }
            if (node.__i18nOrigPh && phMap.has(node.__i18nOrigPh)) {
              const nextP = phMap.get(node.__i18nOrigPh);
              if (node.getAttribute('placeholder') !== nextP) node.setAttribute('placeholder', nextP);
            }
          }

          const children = node.childNodes;
          for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i]);
          }
        } else if (node.nodeType === 3) {
          const raw = node.nodeValue || '';
          if (!raw.trim()) continue;
          if (node.__i18nOrigCore === undefined) {
            const m = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
            const core = normWs(m ? m[2] : raw);
            if (textMap.has(core)) {
              node.__i18nLead = m ? m[1] : '';
              node.__i18nTrail = m ? m[3] : '';
              node.__i18nOrigCore = core;
            }
          }
          if (node.__i18nOrigCore && textMap.has(node.__i18nOrigCore)) {
            const nextVal = (node.__i18nLead || '') + textMap.get(node.__i18nOrigCore) + (node.__i18nTrail || '');
            if (node.nodeValue !== nextVal) node.nodeValue = nextVal;
          }
        }
      }
    } finally {
      isApplying = false;
    }
  }

  function applyBundle(bundle) {
    if (!bundle?.base || !bundle?.active) return;
    activeBundle = bundle;
    window.__appLang = bundle.lang || 'de';
    document.documentElement.lang = window.__appLang;
    if (bundle.active?.meta?.appTitle) {
      document.title = bundle.active.meta.appTitle;
    }

    textMap = new Map();
    titleMap = new Map();
    phMap = new Map();
    collectPairs(bundle.base.ui, bundle.active.ui, textMap, true);
    collectPairs(bundle.base.titles, bundle.active.titles, titleMap, true);
    collectPairs(bundle.base.placeholders, bundle.active.placeholders, phMap, false);
    collectPairs(bundle.base.placeholders, bundle.active.placeholders, phMap, true);

    if (selLang && Array.isArray(bundle.availableLocales) && bundle.availableLocales.length) {
      selLang.innerHTML = '';
      bundle.availableLocales.forEach((loc) => {
        const opt = document.createElement('option');
        opt.value = loc.code;
        opt.textContent = loc.shortLabel || `${loc.flag || ''} ${loc.code.toUpperCase()}`.trim();
        if (loc.code === bundle.lang) opt.selected = true;
        selLang.appendChild(opt);
      });
    }

    translateSubtree(document.body);
    if (typeof updatePlatformStatusUI === 'function' && currentStates) {
      updatePlatformStatusUI(currentStates);
    }
    if (typeof updateObsWsUI === 'function' && window.__latestObsWsState) {
      updateObsWsUI(window.__latestObsWsState);
    }
  }

  selLang?.addEventListener('change', async () => {
    const res = await window.omnichat.i18nSet?.(selLang.value);
    if (res?.ok) applyBundle(res);
  });

  window.omnichat.onI18nChanged?.((bundle) => {
    if (bundle?.ok) applyBundle(bundle);
  });

  window.omnichat.onMenuCommand?.((data) => {
    if (data?.command === 'open-privacy') document.getElementById('btnOpenPrivacyAudit')?.click();
    if (data?.command === 'open-feedback') document.getElementById('btnOpenFeedback')?.click();
  });

  // Automatically translate dynamically rendered modal controls (Scene Editor, Game Addons, etc.)
  let pendingRaf = false;
  const pendingRoots = new Set();
  const observer = new MutationObserver((mutations) => {
    if (isApplying || !activeBundle || window.__appLang === 'de') return;
    for (const m of mutations) {
      const t = m.target;
      if (!t || t.nodeType !== 1) continue;
      if (t.closest?.('#chatFeed, #diagLogList, #eventTickerList')) continue;
      pendingRoots.add(t);
    }
    if (!pendingRaf && pendingRoots.size) {
      pendingRaf = true;
      requestAnimationFrame(() => {
        pendingRaf = false;
        const roots = [...pendingRoots];
        pendingRoots.clear();
        roots.forEach((r) => translateSubtree(r));
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.omnichat.i18nGet?.().then((bundle) => {
    if (bundle?.ok) applyBundle(bundle);
  }).catch(() => {});
})();

// ======================================================
// PHILIPS HUE & NANOLEAF (100% LOCAL LAN — ZERO CLOUD)
// ======================================================
(function initHueAndNanoleafLights() {
  const EVENT_DEFS = [
    ['defaultScene', '🏠 Standard-Szene'],
    ['streamStart', '🟢 Stream-Start'],
    ['follow', '💙 Neuer Follow'],
    ['sub', '💜 Neuer Sub'],
    ['resub', '🔮 Resub'],
    ['subgift', '🎁 Sub-Gift'],
    ['bits', '🪙 Bits / Gift'],
    ['raid', '🚀 Raid'],
    ['hype', '🔥 Chat-Hype'],
    ['streamStop', '⏹️ Stream-Ende']
  ];

  // --- PHILIPS HUE ---
  const hueStatus = document.getElementById('hueStatus');
  const hueEventRows = document.getElementById('hueEventRows');
  const hueLightsList = document.getElementById('hueLightsList');
  let hueState = { enabled: false, bridgeIp: '', username: '', selectedLights: [], brightness: 80, autoOnLive: false, autoOffStop: false, revertAfterSec: 8, eventScenes: {} };
  let hueActions = [
    { id: 'color:#9146ff', name: '🎨 Farbe: Twitch Lila (#9146ff)' },
    { id: 'color:#38bdf8', name: '🎨 Farbe: Cyber Cyan (#38bdf8)' },
    { id: 'color:#ef4444', name: '🎨 Farbe: Raid / Alarm Rot (#ef4444)' },
    { id: 'color:#10b981', name: '🎨 Farbe: Emerald Grün (#10b981)' },
    { id: 'color:#f59e0b', name: '🎨 Farbe: Gold / Bits Amber (#f59e0b)' },
    { id: 'color:#ec4899', name: '🎨 Farbe: SubGift Neon Pink (#ec4899)' },
    { id: 'color:#ffffff', name: '🎨 Farbe: Studio Weiß (#ffffff)' },
    { id: 'flash:#ef4444', name: '⚡ Alert-Flash: Rot' },
    { id: 'power:on', name: '💡 Lampen Einschalten' },
    { id: 'power:off', name: '🌑 Lampen Ausschalten' }
  ];

  function setHueMsg(msg, color = '#94a3b8') {
    if (!hueStatus) return;
    hueStatus.style.color = color;
    hueStatus.textContent = msg;
  }

  function renderHueEventRows() {
    if (!hueEventRows) return;
    hueEventRows.innerHTML = '';
    EVENT_DEFS.forEach(([evKey, label]) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:grid; grid-template-columns:130px 1fr auto; gap:5px; align-items:center;';
      const lbl = document.createElement('span');
      lbl.style.fontSize = '11px';
      lbl.textContent = label;
      const sel = document.createElement('select');
      sel.dataset.hueEv = evKey;
      const noneOpt = document.createElement('option');
      noneOpt.value = '';
      noneOpt.textContent = '— Keine Aktion —';
      sel.appendChild(noneOpt);
      hueActions.forEach((a) => {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = a.name;
        if ((hueState.eventScenes?.[evKey] || '') === a.id) opt.selected = true;
        sel.appendChild(opt);
      });
      sel.addEventListener('change', () => {
        hueState.eventScenes = { ...(hueState.eventScenes || {}), [evKey]: sel.value };
        saveHue();
      });
      const testBtn = document.createElement('button');
      testBtn.className = 'btn-sm';
      testBtn.textContent = '▶';
      testBtn.title = 'Aktion direkt testen';
      testBtn.addEventListener('click', async () => {
        if (!sel.value) return;
        const r = await window.omnichat.hueApplyAction?.({ hueLights: hueState, actionId: sel.value });
        setHueMsg(r?.ok ? `✅ Hue getestet (${label})` : `❌ ${r?.error || 'Fehler'}`, r?.ok ? '#4ade80' : '#f87171');
      });
      row.appendChild(lbl);
      row.appendChild(sel);
      row.appendChild(testBtn);
      hueEventRows.appendChild(row);
    });
  }

  function saveHue() {
    hueState.enabled = Boolean(document.getElementById('chkHueEnabled')?.checked);
    hueState.bridgeIp = document.getElementById('inputHueBridgeIp')?.value.trim() || '';
    hueState.brightness = parseInt(document.getElementById('rngHueBrightness')?.value || '80', 10) || 80;
    hueState.autoOnLive = Boolean(document.getElementById('chkHueAutoOnLive')?.checked);
    hueState.autoOffStop = Boolean(document.getElementById('chkHueAutoOffStop')?.checked);
    hueState.revertAfterSec = parseInt(document.getElementById('numHueRevertSec')?.value || '8', 10) || 0;
    window.omnichat.hueSave?.(hueState);
  }

  async function loadHueLightsAndScenes() {
    const ip = document.getElementById('inputHueBridgeIp')?.value.trim() || hueState.bridgeIp;
    if (!ip || !hueState.username) {
      setHueMsg('ℹ️ Zuerst Hue Bridge suchen/eingeben und einmalig per Bridge-Knopf koppeln.', '#fbbf24');
      return;
    }
    const res = await window.omnichat.hueResources?.({ bridgeIp: ip, username: hueState.username });
    if (!res?.ok) {
      setHueMsg(`❌ ${res?.error || 'Hue Laden fehlgeschlagen.'}`, '#f87171');
      return;
    }
    if (Array.isArray(res.actions) && res.actions.length) hueActions = res.actions;
    renderHueEventRows();
    if (hueLightsList) {
      hueLightsList.innerHTML = '';
      (res.lights || []).forEach((l) => {
        const chip = document.createElement('label');
        chip.className = 'checkbox-row';
        chip.style.cssText = 'padding:3px 8px; border-radius:6px; background:rgba(30,41,59,0.75); border:1px solid rgba(148,163,184,0.22); font-size:11px;';
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.checked = !hueState.selectedLights?.length || hueState.selectedLights.includes(l.id);
        chk.addEventListener('change', () => {
          const allChks = [...hueLightsList.querySelectorAll('input[type="checkbox"]')];
          hueState.selectedLights = allChks.filter((c) => c.checked).map((c) => c.dataset.lid);
          saveHue();
        });
        chk.dataset.lid = l.id;
        const sp = document.createElement('span');
        sp.textContent = `💡 ${l.name}`;
        chip.appendChild(chk);
        chip.appendChild(sp);
        hueLightsList.appendChild(chip);
      });
    }
    setHueMsg(`✅ ${res.lights?.length || 0} Hue-Lampen & ${Math.max(0, (res.actions?.length || 0) - 10)} Hue-Szenen lokal geladen.`, '#4ade80');
  }

  ['chkHueEnabled', 'inputHueBridgeIp', 'chkHueAutoOnLive', 'chkHueAutoOffStop', 'numHueRevertSec'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', saveHue);
  });
  document.getElementById('rngHueBrightness')?.addEventListener('input', (e) => {
    const lbl = document.getElementById('lblHueBrightness');
    if (lbl) lbl.textContent = `${e.target.value}%`;
  });
  document.getElementById('rngHueBrightness')?.addEventListener('change', async (e) => {
    saveHue();
    await window.omnichat.hueSet?.({ brightness: Number(e.target.value) });
  });
  document.getElementById('btnHueDiscover')?.addEventListener('click', async () => {
    setHueMsg('⏳ Suche Philips Hue Bridge lokal im Heimnetz...', '#38bdf8');
    const res = await window.omnichat.hueDiscover?.();
    if (res?.ok && res.bridges?.length) {
      const first = res.bridges[0];
      const inp = document.getElementById('inputHueBridgeIp');
      if (inp) inp.value = first.ip;
      saveHue();
      setHueMsg(`✅ Gefunden: ${first.name} (${first.ip}) — jetzt Knopf auf der Bridge drücken & „Koppeln“ klicken!`, '#4ade80');
    } else {
      setHueMsg('⚠️ Keine Bridge per Auto-Scan gefunden — du kannst die IP auch direkt eintragen.', '#fbbf24');
    }
  });
  document.getElementById('btnHuePair')?.addEventListener('click', async () => {
    const ip = document.getElementById('inputHueBridgeIp')?.value.trim() || '';
    setHueMsg('⏳ Kopple lokal mit Hue Bridge...', '#38bdf8');
    const res = await window.omnichat.huePair?.({ bridgeIp: ip });
    if (res?.ok && res.username) {
      hueState.bridgeIp = res.bridgeIp;
      hueState.username = res.username;
      hueState.enabled = true;
      const chk = document.getElementById('chkHueEnabled');
      if (chk) chk.checked = true;
      setHueMsg('✅ Erfolgreich lokal mit Philips Hue Bridge gekoppelt!', '#4ade80');
      await loadHueLightsAndScenes();
    } else {
      setHueMsg(`⚠️ ${res?.error || 'Kopplung fehlgeschlagen.'}`, res?.needsLinkButton ? '#fbbf24' : '#f87171');
    }
  });
  document.getElementById('btnHueLoad')?.addEventListener('click', loadHueLightsAndScenes);
  document.getElementById('btnHueOn')?.addEventListener('click', () => window.omnichat.hueSet?.({ on: true, brightness: hueState.brightness }));
  document.getElementById('btnHueOff')?.addEventListener('click', () => window.omnichat.hueSet?.({ on: false }));
  document.getElementById('clrHueQuick')?.addEventListener('change', (e) => window.omnichat.hueSet?.({ on: true, hexColor: e.target.value }));

  // --- NANOLEAF ---
  const nlStatus = document.getElementById('nlStatus');
  const nlEventRows = document.getElementById('nlEventRows');
  const selNlQuickEffect = document.getElementById('selNlQuickEffect');
  let nlState = { enabled: false, ip: '', authToken: '', brightness: 75, autoOnLive: false, autoOffStop: false, revertAfterSec: 8, eventScenes: {} };
  let nlActions = [
    { id: 'color:#9146ff', name: '🎨 Vollfarbe: Twitch Lila (#9146ff)' },
    { id: 'color:#38bdf8', name: '🎨 Vollfarbe: Cyber Cyan (#38bdf8)' },
    { id: 'color:#ef4444', name: '🎨 Vollfarbe: Raid / Alarm Rot (#ef4444)' },
    { id: 'color:#10b981', name: '🎨 Vollfarbe: Emerald Grün (#10b981)' },
    { id: 'color:#f59e0b', name: '🎨 Vollfarbe: Gold / Bits Amber (#f59e0b)' },
    { id: 'color:#ec4899', name: '🎨 Vollfarbe: SubGift Neon Pink (#ec4899)' },
    { id: 'color:#ffffff', name: '🎨 Vollfarbe: Studio Weiß (#ffffff)' },
    { id: 'power:on', name: '💡 Nanoleaf Einschalten' },
    { id: 'power:off', name: '🌑 Nanoleaf Ausschalten' }
  ];

  function setNlMsg(msg, color = '#94a3b8') {
    if (!nlStatus) return;
    nlStatus.style.color = color;
    nlStatus.textContent = msg;
  }

  function renderNlEventRows() {
    if (!nlEventRows) return;
    nlEventRows.innerHTML = '';
    EVENT_DEFS.forEach(([evKey, label]) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:grid; grid-template-columns:130px 1fr auto; gap:5px; align-items:center;';
      const lbl = document.createElement('span');
      lbl.style.fontSize = '11px';
      lbl.textContent = label;
      const sel = document.createElement('select');
      const noneOpt = document.createElement('option');
      noneOpt.value = '';
      noneOpt.textContent = '— Keine Aktion —';
      sel.appendChild(noneOpt);
      nlActions.forEach((a) => {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = a.name;
        if ((nlState.eventScenes?.[evKey] || '') === a.id) opt.selected = true;
        sel.appendChild(opt);
      });
      sel.addEventListener('change', () => {
        nlState.eventScenes = { ...(nlState.eventScenes || {}), [evKey]: sel.value };
        saveNl();
      });
      const testBtn = document.createElement('button');
      testBtn.className = 'btn-sm';
      testBtn.textContent = '▶';
      testBtn.title = 'Aktion direkt testen';
      testBtn.addEventListener('click', async () => {
        if (!sel.value) return;
        const r = await window.omnichat.nanoleafApplyAction?.({ nanoleafLights: nlState, actionId: sel.value });
        setNlMsg(r?.ok ? `✅ Nanoleaf getestet (${label})` : `❌ ${r?.error || 'Fehler'}`, r?.ok ? '#4ade80' : '#f87171');
      });
      row.appendChild(lbl);
      row.appendChild(sel);
      row.appendChild(testBtn);
      nlEventRows.appendChild(row);
    });
  }

  function saveNl() {
    nlState.enabled = Boolean(document.getElementById('chkNlEnabled')?.checked);
    nlState.ip = document.getElementById('inputNlIp')?.value.trim() || '';
    nlState.brightness = parseInt(document.getElementById('rngNlBrightness')?.value || '75', 10) || 75;
    nlState.autoOnLive = Boolean(document.getElementById('chkNlAutoOnLive')?.checked);
    nlState.autoOffStop = Boolean(document.getElementById('chkNlAutoOffStop')?.checked);
    nlState.revertAfterSec = parseInt(document.getElementById('numNlRevertSec')?.value || '8', 10) || 0;
    window.omnichat.nanoleafSave?.(nlState);
  }

  async function loadNlEffects() {
    const ip = document.getElementById('inputNlIp')?.value.trim() || nlState.ip;
    if (!ip || !nlState.authToken) {
      setNlMsg('ℹ️ Zuerst Nanoleaf suchen/eingeben und einmalig koppeln (5–7s Power-Taste halten).', '#fbbf24');
      return;
    }
    const res = await window.omnichat.nanoleafInfo?.({ ip, authToken: nlState.authToken });
    if (!res?.ok) {
      setNlMsg(`❌ ${res?.error || 'Nanoleaf Laden fehlgeschlagen.'}`, '#f87171');
      return;
    }
    if (Array.isArray(res.actions) && res.actions.length) nlActions = res.actions;
    if (selNlQuickEffect) {
      selNlQuickEffect.innerHTML = '<option value="">— Effekt wählen —</option>';
      (res.effects || []).forEach((eff) => {
        const opt = document.createElement('option');
        opt.value = eff;
        opt.textContent = `🔺 ${eff}`;
        if (eff === res.selectedEffect) opt.selected = true;
        selNlQuickEffect.appendChild(opt);
      });
    }
    renderNlEventRows();
    setNlMsg(`✅ Verbunden mit ${res.name} (${res.effects?.length || 0} Effekte lokal geladen).`, '#4ade80');
  }

  ['chkNlEnabled', 'inputNlIp', 'chkNlAutoOnLive', 'chkNlAutoOffStop', 'numNlRevertSec'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', saveNl);
  });
  document.getElementById('rngNlBrightness')?.addEventListener('input', (e) => {
    const lbl = document.getElementById('lblNlBrightness');
    if (lbl) lbl.textContent = `${e.target.value}%`;
  });
  document.getElementById('rngNlBrightness')?.addEventListener('change', async (e) => {
    saveNl();
    await window.omnichat.nanoleafSet?.({ brightness: Number(e.target.value) });
  });
  document.getElementById('btnNlDiscover')?.addEventListener('click', async () => {
    setNlMsg('⏳ Suche Nanoleaf lokal im Heimnetz (Port 16021)...', '#38bdf8');
    const res = await window.omnichat.nanoleafDiscover?.();
    if (res?.ok && res.devices?.length) {
      const first = res.devices[0];
      const inp = document.getElementById('inputNlIp');
      if (inp) inp.value = first.ip;
      saveNl();
      setNlMsg(`✅ Gefunden: ${first.name} — jetzt 5–7s Power-Taste am Controller halten & „Koppeln“ klicken!`, '#4ade80');
    } else {
      setNlMsg('⚠️ Kein Nanoleaf per Auto-Scan gefunden — IP direkt eintragen.', '#fbbf24');
    }
  });
  document.getElementById('btnNlPair')?.addEventListener('click', async () => {
    const ip = document.getElementById('inputNlIp')?.value.trim() || '';
    setNlMsg('⏳ Kopple lokal mit Nanoleaf...', '#38bdf8');
    const res = await window.omnichat.nanoleafPair?.({ ip });
    if (res?.ok && res.authToken) {
      nlState.ip = res.ip;
      nlState.authToken = res.authToken;
      nlState.enabled = true;
      const chk = document.getElementById('chkNlEnabled');
      if (chk) chk.checked = true;
      setNlMsg('✅ Erfolgreich lokal mit Nanoleaf gekoppelt!', '#4ade80');
      await loadNlEffects();
    } else {
      setNlMsg(`⚠️ ${res?.error || 'Kopplung fehlgeschlagen.'}`, res?.needsPairingMode ? '#fbbf24' : '#f87171');
    }
  });
  document.getElementById('btnNlLoad')?.addEventListener('click', loadNlEffects);
  document.getElementById('btnNlOn')?.addEventListener('click', () => window.omnichat.nanoleafSet?.({ on: true, brightness: nlState.brightness }));
  document.getElementById('btnNlOff')?.addEventListener('click', () => window.omnichat.nanoleafSet?.({ on: false }));
  document.getElementById('clrNlQuick')?.addEventListener('change', (e) => window.omnichat.nanoleafSet?.({ on: true, hexColor: e.target.value }));
  selNlQuickEffect?.addEventListener('change', () => {
    if (selNlQuickEffect.value) window.omnichat.nanoleafSet?.({ effect: selNlQuickEffect.value });
  });

  renderHueEventRows();
  renderNlEventRows();

  window.omnichat.onInitState?.((data) => {
    const cfg = data?.config || {};
    if (cfg.hueLights) {
      hueState = { ...hueState, ...cfg.hueLights };
      const setEl = (id, prop, val) => { const el = document.getElementById(id); if (el) el[prop] = val; };
      setEl('chkHueEnabled', 'checked', Boolean(hueState.enabled));
      setEl('inputHueBridgeIp', 'value', hueState.bridgeIp || '');
      setEl('rngHueBrightness', 'value', String(hueState.brightness ?? 80));
      const lblH = document.getElementById('lblHueBrightness');
      if (lblH) lblH.textContent = `${hueState.brightness ?? 80}%`;
      setEl('chkHueAutoOnLive', 'checked', Boolean(hueState.autoOnLive));
      setEl('chkHueAutoOffStop', 'checked', Boolean(hueState.autoOffStop));
      setEl('numHueRevertSec', 'value', String(hueState.revertAfterSec ?? 8));
      renderHueEventRows();
      if (hueState.enabled && hueState.bridgeIp && hueState.username) {
        loadHueLightsAndScenes().catch(() => {});
      }
    }
    if (cfg.nanoleafLights) {
      nlState = { ...nlState, ...cfg.nanoleafLights };
      const setEl = (id, prop, val) => { const el = document.getElementById(id); if (el) el[prop] = val; };
      setEl('chkNlEnabled', 'checked', Boolean(nlState.enabled));
      setEl('inputNlIp', 'value', nlState.ip || '');
      setEl('rngNlBrightness', 'value', String(nlState.brightness ?? 75));
      const lblN = document.getElementById('lblNlBrightness');
      if (lblN) lblN.textContent = `${nlState.brightness ?? 75}%`;
      setEl('chkNlAutoOnLive', 'checked', Boolean(nlState.autoOnLive));
      setEl('chkNlAutoOffStop', 'checked', Boolean(nlState.autoOffStop));
      setEl('numNlRevertSec', 'value', String(nlState.revertAfterSec ?? 8));
      renderNlEventRows();
      if (nlState.enabled && nlState.ip && nlState.authToken) {
        loadNlEffects().catch(() => {});
      }
    }
  });
})();

(() => {
  const badgeEl = document.getElementById('voiceStatusBadge');
  const relayInput = document.getElementById('inputVoiceRelayUrl');
  const codeBox = document.getElementById('voicePairingCodeBox');
  const timerEl = document.getElementById('voicePairingTimer');
  const guideCodeEl = document.getElementById('voiceGuideCode');
  const assistantsEl = document.getElementById('voiceConnectedAssistants');
  const lastCmdEl = document.getElementById('voiceLastCommand');
  const feedbackEl = document.getElementById('voiceFeedbackMsg');
  const btnCopy = document.getElementById('btnVoiceCopyCode');
  if (!badgeEl) return;

  let voiceState = null;

  const setFeedback = (msg, color = '#94a3b8') => {
    if (!feedbackEl) return;
    feedbackEl.textContent = msg;
    feedbackEl.style.color = color;
  };

  const renderVoiceTimer = () => {
    if (!timerEl) return;
    const exp = Number(voiceState?.pairingExpiresAt || 0);
    if (!voiceState?.pairingCode || !exp) {
      timerEl.textContent = 'Noch kein Code generiert';
      return;
    }
    const sec = Math.max(0, Math.floor((exp - Date.now()) / 1000));
    if (sec <= 0) {
      timerEl.textContent = 'Pairing-Code abgelaufen – bitte neu generieren';
      if (codeBox) codeBox.textContent = '--- ---';
      if (btnCopy) btnCopy.disabled = true;
      return;
    }
    const mm = String(Math.floor(sec / 60)).padStart(2, '0');
    const ss = String(sec % 60).padStart(2, '0');
    timerEl.textContent = `Gültig für noch ${mm}:${ss}`;
  };

  const applyVoiceState = (st) => {
    if (!st) return;
    voiceState = st;
    if (relayInput && document.activeElement !== relayInput) {
      relayInput.value = st.relayUrl || '';
    }
    const statusMap = {
      connected: { label: '🟢 Verbunden mit Relay', bg: 'rgba(34,197,94,0.18)', color: '#4ade80' },
      connecting: { label: '🟡 Verbinde...', bg: 'rgba(250,204,21,0.18)', color: '#fde047' },
      local_only: { label: '🔵 Lokaler Testmodus', bg: 'rgba(56,189,248,0.18)', color: '#38bdf8' },
      error: { label: '🔴 Verbindungsfehler', bg: 'rgba(248,113,113,0.18)', color: '#f87171' },
      disconnected: { label: '⚪ Getrennt', bg: 'rgba(148,163,184,0.18)', color: '#cbd5e1' }
    };
    const meta = statusMap[st.status] || statusMap.disconnected;
    badgeEl.textContent = meta.label;
    badgeEl.style.background = meta.bg;
    badgeEl.style.color = meta.color;

    const hasActiveCode = Boolean(st.pairingCode && st.pairingExpiresAt > Date.now());
    const formatted = hasActiveCode ? (st.pairingCodeFormatted || st.pairingCode) : '--- ---';
    if (codeBox) codeBox.textContent = formatted;
    if (guideCodeEl) guideCodeEl.textContent = hasActiveCode ? formatted : '123 456';
    if (btnCopy) btnCopy.disabled = !hasActiveCode;

    if (assistantsEl) {
      const list = Array.isArray(st.connectedAssistants) && st.connectedAssistants.length
        ? st.connectedAssistants.map((a) => (a === 'alexa' ? 'Amazon Alexa' : a === 'google_home' ? 'Google Home' : a)).join(', ')
        : 'Keine';
      assistantsEl.textContent = list;
    }

    if (lastCmdEl) {
      lastCmdEl.textContent = st.lastCommand
        ? `Letzter Befehl: ${st.lastCommand.action} (${st.lastCommand.ok ? 'OK' : 'Fehler'})`
        : '';
    }

    if (st.lastError) setFeedback(`⚠️ ${st.lastError}`, '#fbbf24');
    renderVoiceTimer();
  };

  setInterval(renderVoiceTimer, 1000);

  document.getElementById('btnVoiceSaveRelay')?.addEventListener('click', async () => {
    const relayUrl = String(relayInput?.value || '').trim();
    const res = await window.omnichat.voiceSaveConfig?.({ relayUrl, enabled: Boolean(relayUrl) });
    if (res?.state) applyVoiceState(res.state);
    setFeedback(relayUrl ? '✅ Relay-URL gespeichert.' : 'ℹ️ Lokaler Modus aktiv (keine Relay-URL).', '#4ade80');
  });

  document.getElementById('btnVoiceGeneratePair')?.addEventListener('click', async () => {
    setFeedback('⏳ Generiere Pairing-Code...', '#38bdf8');
    const relayUrl = String(relayInput?.value || '').trim();
    const res = await window.omnichat.voiceGeneratePairing?.({ relayUrl });
    if (res?.state) applyVoiceState(res.state);
    setFeedback(
      res?.mode === 'cloud'
        ? '✅ Pairing-Code im Cloud-Relay registriert (10 Min. gültig).'
        : '✅ Lokaler Pairing-Code generiert (für Cloud-Kopplung Relay-URL eintragen).',
      '#4ade80'
    );
  });

  btnCopy?.addEventListener('click', async () => {
    const code = voiceState?.pairingCode || '';
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setFeedback(`📋 Code ${voiceState.pairingCodeFormatted || code} kopiert!`, '#4ade80');
    } catch (e) {
      setFeedback('⚠️ Kopieren fehlgeschlagen.', '#f87171');
    }
  });

  document.getElementById('btnVoiceDisconnect')?.addEventListener('click', async () => {
    const res = await window.omnichat.voiceDisconnect?.();
    if (res?.state) applyVoiceState(res.state);
    setFeedback('🔌 Verbindung getrennt & Tokens zurückgesetzt.', '#fbbf24');
  });

  document.querySelectorAll('.voice-test-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const action = btn.getAttribute('data-voice-test');
      if (!action) return;
      setFeedback(`⏳ Teste "${action}"...`, '#38bdf8');
      const res = await window.omnichat.voiceTestCommand?.(action, {});
      if (res?.state) applyVoiceState(res.state);
      setFeedback(
        res?.ok ? `✅ ${res.message || 'Befehl ausgeführt.'}` : `⚠️ ${res?.error || 'Befehl fehlgeschlagen.'}`,
        res?.ok ? '#4ade80' : '#fbbf24'
      );
    });
  });

  window.omnichat.onVoiceState?.(applyVoiceState);
  window.omnichat.voiceGetState?.().then(applyVoiceState).catch(() => {});
})();

(() => {
  const btnExport = document.getElementById('btnBackupExportAll');
  const btnImport = document.getElementById('btnBackupImportAll');
  const dropZone = document.getElementById('backupDropZone');
  const statusEl = document.getElementById('backupStatusMsg');
  if (!btnExport || !btnImport) return;

  const setMsg = (text, color = '#94a3b8') => {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.style.color = color;
  };

  const runExport = async () => {
    setMsg('⏳ Exportiere alle Einstellungen & API-Keys...', '#38bdf8');
    await window.omnichat.saveProfile(getFormConfig());
    const res = await window.omnichat.exportConfig();
    if (res?.canceled) {
      setMsg('Export abgebrochen.');
      return;
    }
    if (res?.ok) {
      const inc = res.summary?.included?.length ? ` (${res.summary.included.join(', ')})` : '';
      const aCnt = Number(res.summary?.assetsCount || 0);
      const tCnt = Number(res.summary?.themePacksCount || 0);
      const extra = (aCnt || tCnt) ? ` • ${aCnt} Assets & ${tCnt} Design-Packs eingebettet` : '';
      setMsg(`✅ Komplett-Backup gespeichert${inc}${extra}!`, '#4ade80');
    } else {
      setMsg(`⚠️ Export fehlgeschlagen: ${res?.error || 'Unbekannter Fehler'}`, '#f87171');
    }
  };

  const runImport = async (opts = {}) => {
    setMsg('⏳ Importiere Backup & stelle Custom-Assets wieder her...', '#38bdf8');
    const res = await window.omnichat.importConfig(opts);
    if (res?.canceled) {
      setMsg('Import abgebrochen.');
      return;
    }
    if (res?.ok && res.config) {
      applyConfigToForm(res.config);
      const inc = res.summary?.included?.length ? ` (${res.summary.included.join(', ')})` : '';
      const aCnt = Number(res.summary?.assetsCount || 0);
      const tCnt = Number(res.summary?.themePacksCount || 0);
      const extra = (aCnt || tCnt) ? ` • ${aCnt} Assets & ${tCnt} Design-Packs wiederhergestellt` : '';
      setMsg(`✅ Backup importiert${inc}${extra} – Oberfläche wird neu geladen...`, '#4ade80');
    } else {
      setMsg(`⚠️ Import fehlgeschlagen: ${res?.error || 'Ungültige Datei'}`, '#f87171');
    }
  };

  btnExport.addEventListener('click', runExport);
  btnImport.addEventListener('click', () => runImport());
  dropZone?.addEventListener('click', () => runImport());
  dropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#38bdf8';
    dropZone.style.background = 'rgba(56,189,248,0.12)';
  });
  dropZone?.addEventListener('dragleave', () => {
    dropZone.style.borderColor = 'rgba(148,163,184,0.35)';
    dropZone.style.background = 'rgba(15,23,42,0.35)';
  });
  dropZone?.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'rgba(148,163,184,0.35)';
    dropZone.style.background = 'rgba(15,23,42,0.35)';
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    const rawJson = await file.text();
    await runImport({ rawJson, fileName: file.name });
  });
})();

(() => {
  const modal = document.getElementById('quickSetupModal');
  if (!modal) return;

  const totalSteps = 5;
  let currentStep = 1;
  let obsConnectedNow = false;
  let ytAuthorizedNow = false;

  const panels = Array.from(modal.querySelectorAll('.qs-panel'));
  const pills = Array.from(modal.querySelectorAll('.qs-step-pill'));
  const progressFill = document.getElementById('qsProgressFill');
  const stepIndicator = document.getElementById('qsStepIndicator');
  const btnPrev = document.getElementById('btnQsPrev');
  const btnNext = document.getElementById('btnQsNext');
  const obsBadge = document.getElementById('qsObsStatusBadge');
  const obsFeedback = document.getElementById('qsObsFeedback');
  const ytBadge = document.getElementById('qsYtOAuthBadge');
  const extrasFeedback = document.getElementById('qsExtrasFeedback');
  const summaryList = document.getElementById('qsSummaryList');

  const fieldPairs = [
    ['qsStreamerName', 'inputStreamerName', 'value'],
    ['qsEnableTwitch', 'chkEnableTwitch', 'checked'],
    ['qsTwitchChannel', 'inputTwitchChannel', 'value'],
    ['qsEnableYoutube', 'chkEnableYoutube', 'checked'],
    ['qsYoutubeChannel', 'inputYoutubeChannel', 'value'],
    ['qsEnableTiktok', 'chkEnableTiktok', 'checked'],
    ['qsTiktokChannel', 'inputTiktokChannel', 'value'],
    ['qsTwitchUser', 'inputTwitchUser', 'value'],
    ['qsTwitchToken', 'inputTwitchToken', 'value']
  ];

  const syncFromMainForm = () => {
    for (const [qsId, mainId, prop] of fieldPairs) {
      const qsEl = document.getElementById(qsId);
      const mainEl = document.getElementById(mainId);
      if (qsEl && mainEl) qsEl[prop] = mainEl[prop];
    }
    const ytStat = document.getElementById('ytOAuthStatus')?.textContent || '';
    ytAuthorizedNow = ytStat.toLowerCase().includes('verbunden') || ytStat.toLowerCase().includes('aktiv') || ytStat.includes('✅');
    if (ytBadge) {
      ytBadge.textContent = ytAuthorizedNow ? '🟢 Verbunden' : 'Nur-Lesen';
      ytBadge.style.color = ytAuthorizedNow ? '#4ade80' : '#cbd5e1';
      ytBadge.style.background = ytAuthorizedNow ? 'rgba(34,197,94,0.18)' : 'rgba(148,163,184,0.18)';
    }
  };

  const syncToMainForm = () => {
    for (const [qsId, mainId, prop] of fieldPairs) {
      const qsEl = document.getElementById(qsId);
      const mainEl = document.getElementById(mainId);
      if (qsEl && mainEl) mainEl[prop] = qsEl[prop];
    }
  };

  const renderSummary = () => {
    if (!summaryList) return;
    syncToMainForm();
    const tw = document.getElementById('qsTwitchChannel')?.value.trim();
    const yt = document.getElementById('qsYoutubeChannel')?.value.trim();
    const tt = document.getElementById('qsTiktokChannel')?.value.trim();
    const twTok = document.getElementById('qsTwitchToken')?.value.trim();
    const rows = [
      ['🟣 Twitch', tw ? `✅ ${tw}${twTok ? ' (+ Schreib-Token)' : ' (Lesen)'}` : '⚪ Nicht eingerichtet'],
      ['🔴 YouTube Live', yt ? `✅ ${yt}${ytAuthorizedNow ? ' (+ OAuth2)' : ' (Lesen)'}` : '⚪ Nicht eingerichtet'],
      ['🎵 TikTok Live', tt ? `✅ ${tt}` : '⚪ Nicht eingerichtet'],
      ['🎥 OBS Studio', obsConnectedNow ? '✅ Verbunden' : '⚪ Optional (später unter Config → OBS)']
    ];
    summaryList.innerHTML = '';
    for (const [label, val] of rows) {
      const row = document.createElement('div');
      row.className = 'qs-summary-row';
      const left = document.createElement('strong');
      left.textContent = label;
      const right = document.createElement('span');
      right.textContent = val;
      row.append(left, right);
      summaryList.appendChild(row);
    }
  };

  const goToStep = (step) => {
    currentStep = Math.max(1, Math.min(totalSteps, step));
    panels.forEach((p) => p.classList.toggle('active', Number(p.dataset.qsPanel) === currentStep));
    pills.forEach((b) => {
      const s = Number(b.dataset.qsStep);
      b.classList.toggle('active', s === currentStep);
      b.classList.toggle('done', s < currentStep);
    });
    if (progressFill) progressFill.style.width = `${Math.round((currentStep / totalSteps) * 100)}%`;
    if (stepIndicator) stepIndicator.textContent = `Schritt ${currentStep} von ${totalSteps}`;
    if (btnPrev) btnPrev.disabled = currentStep === 1;
    if (btnNext) btnNext.style.display = currentStep === totalSteps ? 'none' : '';
    if (currentStep === totalSteps) renderSummary();
  };

  const openWizard = () => {
    syncFromMainForm();
    refreshSetupStatusUI();
    goToStep(1);
    document.getElementById('configPageModal')?.classList.add('hidden');
    modal.classList.remove('hidden');
  };

  const evaluateSetupStatus = (cfg = null) => {
    const tw = String((cfg ? (cfg.twitchChannel ?? cfg.twitch?.channel) : document.getElementById('inputTwitchChannel')?.value) || '').trim();
    const yt = String((cfg ? (cfg.youtubeChannel ?? cfg.youtube?.channel) : document.getElementById('inputYoutubeChannel')?.value) || '').trim();
    const tt = String((cfg ? (cfg.tiktokChannel ?? cfg.tiktok?.channel) : document.getElementById('inputTiktokChannel')?.value) || '').trim();
    const items = [];
    if (tw) items.push(`Twitch (${tw})`);
    if (yt) items.push(`YouTube (${yt})`);
    if (tt) items.push(`TikTok (${tt})`);
    if (obsConnectedNow) items.push('OBS');
    const persistedDone = Boolean(cfg?.quickSetupCompleted);
    let localDone = false;
    try { localDone = localStorage.getItem('omnigrid_quick_setup_done') === '1'; } catch (e) {}
    const isConfigured = items.length > 0;
    const isCompleted = isConfigured || persistedDone || localDone;
    return { isConfigured, isCompleted, items };
  };

  const refreshSetupStatusUI = (cfg = null) => {
    const st = evaluateSetupStatus(cfg);
    const sideStatus = document.getElementById('sidebarQuickSetupStatus');
    const sideBtn = document.getElementById('btnOpenQuickSetupSidebar');
    const topBtn = document.getElementById('btnOpenQuickSetup');
    const banner = document.getElementById('qsExistingStatusBanner');
    if (sideStatus) {
      sideStatus.textContent = st.isConfigured
        ? `✅ Aktiv: ${st.items.slice(0, 2).join(', ')}${st.items.length > 2 ? ' …' : ''}`
        : st.isCompleted
          ? '⚪ Übersprungen – jederzeit startbar'
          : '⚡ Noch nicht eingerichtet';
      sideStatus.style.color = st.isConfigured ? '#4ade80' : '#fbbf24';
    }
    if (sideBtn) sideBtn.textContent = st.isCompleted ? 'Neu starten' : 'Starten';
    if (topBtn) {
      topBtn.textContent = st.isConfigured ? '🧭 Quick Setup ✓' : '🧭 Quick Setup';
      topBtn.title = st.isConfigured
        ? `Bereits eingerichtet (${st.items.join(', ')}) – klicken zum erneuten Starten`
        : 'Schritt-für-Schritt Einrichtungs-Assistent starten';
    }
    if (banner) {
      if (st.isConfigured) {
        banner.textContent = `✅ Bereits eingerichtet: ${st.items.join(' • ')} — du kannst alle Werte hier prüfen oder anpassen.`;
        banner.style.background = 'rgba(34,197,94,0.14)';
        banner.style.borderColor = 'rgba(34,197,94,0.4)';
        banner.style.color = '#86efac';
      } else {
        banner.textContent = '✨ Ersteinrichtung — folge den 5 Schritten, in unter 2 Minuten bist du startklar.';
        banner.style.background = 'rgba(56,189,248,0.12)';
        banner.style.borderColor = 'rgba(56,189,248,0.3)';
        banner.style.color = '#bae6fd';
      }
    }
    return st;
  };

  const closeWizard = (markDone = true) => {
    syncToMainForm();
    modal.classList.add('hidden');
    if (markDone) {
      try { localStorage.setItem('omnigrid_quick_setup_done', '1'); } catch (e) {}
      window.omnichat.saveProfile({ quickSetupCompleted: true }).catch(() => {});
    }
    refreshSetupStatusUI();
  };

  document.getElementById('btnOpenQuickSetup')?.addEventListener('click', openWizard);
  document.getElementById('btnOpenQuickSetupSidebar')?.addEventListener('click', openWizard);
  document.getElementById('btnOpenQuickSetupFromConfig')?.addEventListener('click', openWizard);
  document.getElementById('btnOpenQuickSetupSystem')?.addEventListener('click', openWizard);
  document.getElementById('btnQsClose')?.addEventListener('click', () => closeWizard(true));
  pills.forEach((b) => b.addEventListener('click', () => { syncToMainForm(); goToStep(Number(b.dataset.qsStep)); }));
  btnPrev?.addEventListener('click', () => { syncToMainForm(); goToStep(currentStep - 1); });
  btnNext?.addEventListener('click', async () => {
    syncToMainForm();
    await window.omnichat.saveProfile(getFormConfig()).catch(() => {});
    goToStep(currentStep + 1);
  });

  document.getElementById('btnQsGetTwitchToken')?.addEventListener('click', () => {
    document.getElementById('btnGetTwitchToken')?.click();
  });

  document.getElementById('btnQsYtImportJson')?.addEventListener('click', () => {
    document.getElementById('btnYtImportOAuthJson')?.click();
  });

  document.getElementById('btnQsYtGuide')?.addEventListener('click', () => {
    window.omnichat.openHelpWindow?.({ section: '22', anchor: 'Google / YouTube OAuth2' });
  });

  document.getElementById('btnQsImportBackup')?.addEventListener('click', async () => {
    const res = await window.omnichat.importConfig?.();
    if (res?.ok) closeWizard(true);
  });

  const updateObsBadge = (connected) => {
    obsConnectedNow = Boolean(connected);
    if (!obsBadge) return;
    obsBadge.textContent = obsConnectedNow ? '🟢 OBS verbunden' : '⚪ Nicht verbunden';
    obsBadge.style.color = obsConnectedNow ? '#4ade80' : '#cbd5e1';
    obsBadge.style.background = obsConnectedNow ? 'rgba(34,197,94,0.18)' : 'rgba(148,163,184,0.18)';
  };

  window.omnichat.onObsWsState?.((st) => updateObsBadge(Boolean(st?.connected)));

  document.getElementById('btnQsObsAutoSetup')?.addEventListener('click', async () => {
    if (obsFeedback) { obsFeedback.textContent = '⏳ Konfiguriere OBS WebSocket automatisch...'; obsFeedback.style.color = '#38bdf8'; }
    const res = await window.omnichat.obsWsAutoSetup?.();
    updateObsBadge(Boolean(res?.connected || res?.ok));
    if (obsFeedback) {
      obsFeedback.textContent = res?.ok ? `✅ ${res.message || 'OBS erfolgreich verbunden!'}` : `⚠️ ${res?.error || 'Bitte OBS Studio öffnen und erneut testen.'}`;
      obsFeedback.style.color = res?.ok ? '#4ade80' : '#fbbf24';
    }
  });

  document.getElementById('btnQsObsConnectOnly')?.addEventListener('click', async () => {
    if (obsFeedback) { obsFeedback.textContent = '⏳ Teste OBS-Verbindung...'; obsFeedback.style.color = '#38bdf8'; }
    const res = await window.omnichat.obsWsConnect?.();
    updateObsBadge(Boolean(res?.ok));
    if (obsFeedback) {
      obsFeedback.textContent = res?.ok ? '✅ OBS WebSocket verbunden!' : `⚠️ ${res?.error || 'OBS nicht erreichbar.'}`;
      obsFeedback.style.color = res?.ok ? '#4ade80' : '#fbbf24';
    }
  });

  document.getElementById('btnQsCopyOverlay')?.addEventListener('click', async () => {
    const url = document.getElementById('qsObsOverlayUrl')?.value || 'http://127.0.0.1:4588/overlay';
    try {
      await navigator.clipboard.writeText(url);
      if (obsFeedback) { obsFeedback.textContent = '📋 OBS Overlay-URL kopiert!'; obsFeedback.style.color = '#4ade80'; }
    } catch (e) {}
  });

  document.getElementById('btnQsVoicePair')?.addEventListener('click', async () => {
    const res = await window.omnichat.voiceGeneratePairing?.({});
    const out = document.getElementById('qsVoiceCodeOut');
    if (out && res?.pairingCode) out.textContent = `Code: ${res.pairingCodeFormatted || res.pairingCode}`;
    if (extrasFeedback) {
      extrasFeedback.textContent = res?.ok ? '✅ Pairing-Code erstellt (10 Min. gültig).' : `⚠️ ${res?.error || 'Fehler'}`;
      extrasFeedback.style.color = res?.ok ? '#4ade80' : '#fbbf24';
    }
  });

  document.getElementById('btnQsExportBackup')?.addEventListener('click', async () => {
    syncToMainForm();
    await window.omnichat.saveProfile(getFormConfig()).catch(() => {});
    const res = await window.omnichat.exportConfig?.();
    if (extrasFeedback && !res?.canceled) {
      extrasFeedback.textContent = res?.ok ? '✅ Backup gespeichert!' : `⚠️ ${res?.error || 'Export fehlgeschlagen.'}`;
      extrasFeedback.style.color = res?.ok ? '#4ade80' : '#f87171';
    }
  });

  document.getElementById('btnQsFinishConnect')?.addEventListener('click', async () => {
    syncToMainForm();
    const cfg = getFormConfig();
    await window.omnichat.saveProfile(cfg).catch(() => {});
    await window.omnichat.connectAll(cfg).catch(() => {});
    closeWizard(true);
  });

  document.getElementById('btnQsTryDemo')?.addEventListener('click', async () => {
    closeWizard(true);
    document.getElementById('btnDemo')?.click();
  });

  window.omnichat.onInitState?.((data) => {
    if (data?.obsWsState) updateObsBadge(Boolean(data.obsWsState.connected));
    const urlInput = document.getElementById('qsObsOverlayUrl');
    if (urlInput && data?.obsOverlayUrl) urlInput.value = data.obsOverlayUrl;
    const cfg = data?.config || {};
    const st = refreshSetupStatusUI(cfg);
    if (!st.isCompleted) {
      setTimeout(openWizard, 450);
    }
  });
})();

(() => {
  const modal = document.getElementById('sponsorsModal');
  const listEl = document.getElementById('spItemsList');
  const statusEl = document.getElementById('spStatusMsg');
  if (!modal || !listEl) return;

  let spState = { enabled: true, pauseBetweenSec: 0, showQrCode: true, showProgressBar: true, activeIndex: 0, items: [] };
  let overlayUrl = 'http://127.0.0.1:4588/sponsors';

  const setMsg = (text, color = '#94a3b8') => {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.style.color = color;
  };

  const readGlobalInputs = () => {
    spState.enabled = Boolean(document.getElementById('spEnabled')?.checked);
    spState.showQrCode = Boolean(document.getElementById('spShowQr')?.checked);
    spState.showProgressBar = Boolean(document.getElementById('spShowProg')?.checked);
    spState.pauseBetweenSec = Math.max(0, Math.min(300, parseInt(document.getElementById('spPauseSec')?.value || '0', 10) || 0));
  };

  const renderList = () => {
    const chkEn = document.getElementById('spEnabled');
    const chkQr = document.getElementById('spShowQr');
    const chkPr = document.getElementById('spShowProg');
    const inpPause = document.getElementById('spPauseSec');
    if (chkEn) chkEn.checked = spState.enabled !== false;
    if (chkQr) chkQr.checked = spState.showQrCode !== false;
    if (chkPr) chkPr.checked = spState.showProgressBar !== false;
    if (inpPause) inpPause.value = String(spState.pauseBetweenSec ?? 0);

    listEl.innerHTML = '';
    if (!spState.items.length) {
      const empty = document.createElement('div');
      empty.style.cssText = 'padding: 16px; text-align: center; border-radius: 10px; border: 1px dashed rgba(148,163,184,0.3); color: #94a3b8; font-size: 12px;';
      empty.textContent = 'Noch keine Werbepartner angelegt. Klicke unten auf „➕ Neuen Werbepartner hinzufügen“.';
      listEl.appendChild(empty);
      return;
    }

    spState.items.forEach((item, idx) => {
      const nextItem = spState.items.length > 1 ? spState.items[(idx + 1) % spState.items.length] : null;
      const card = document.createElement('div');
      card.style.cssText = 'padding: 10px 12px; border-radius: 10px; background: rgba(15,23,42,0.82); border: 1px solid rgba(148,163,184,0.22); display: flex; flex-direction: column; gap: 8px;';

      const topRow = document.createElement('div');
      topRow.style.cssText = 'display: flex; align-items: center; gap: 6px; flex-wrap: wrap;';

      const orderBadge = document.createElement('span');
      orderBadge.style.cssText = 'font-size: 11px; font-weight: 800; padding: 2px 7px; border-radius: 6px; background: rgba(56,189,248,0.18); color: #7dd3fc;';
      orderBadge.textContent = `#${idx + 1}` + (nextItem ? ` → Danach: ${nextItem.name || `#${((idx + 1) % spState.items.length) + 1}`}` : '');

      const chkActiveWrap = document.createElement('label');
      chkActiveWrap.className = 'checkbox-row';
      chkActiveWrap.style.margin = '0 4px';
      const chkActive = document.createElement('input');
      chkActive.type = 'checkbox';
      chkActive.checked = item.enabled !== false;
      chkActive.addEventListener('change', () => { item.enabled = chkActive.checked; });
      const chkSpan = document.createElement('span');
      chkSpan.textContent = 'Aktiv';
      chkActiveWrap.append(chkActive, chkSpan);

      const mkBtn = (label, title, onClick, style = '') => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn-sm';
        b.textContent = label;
        b.title = title;
        if (style) b.style.cssText = style;
        b.addEventListener('click', onClick);
        return b;
      };

      const btnUp = mkBtn('▲', 'In der Reihenfolge nach oben', () => {
        if (idx === 0) return;
        [spState.items[idx - 1], spState.items[idx]] = [spState.items[idx], spState.items[idx - 1]];
        renderList();
      });
      btnUp.disabled = idx === 0;

      const btnDown = mkBtn('▼', 'In der Reihenfolge nach unten', () => {
        if (idx >= spState.items.length - 1) return;
        [spState.items[idx + 1], spState.items[idx]] = [spState.items[idx], spState.items[idx + 1]];
        renderList();
      });
      btnDown.disabled = idx >= spState.items.length - 1;

      const btnShowNow = mkBtn('▶ Jetzt zeigen', 'Dieses Banner sofort live im OBS-Overlay einblenden', async () => {
        readGlobalInputs();
        spState.activeIndex = idx;
        await window.omnichat.sponsorsSave(spState);
        setMsg(`▶ Zeige jetzt #${idx + 1} (${item.name || 'Partner'}) im OBS-Overlay!`, '#4ade80');
      }, 'background: rgba(56,189,248,0.2); border-color: rgba(56,189,248,0.5); color: #bae6fd;');

      const btnChat = mkBtn('💬 Link in Chat', 'Klickbaren Partner-Link direkt in Twitch & YouTube Chat posten', async () => {
        readGlobalInputs();
        await window.omnichat.sponsorsSave(spState);
        const r = await window.omnichat.sponsorsPostChat(item.id);
        setMsg(r?.ok ? `💬 Link in ${r.sent.join(' & ')} gepostet!` : `⚠️ ${r?.error || 'Senden fehlgeschlagen'}`, r?.ok ? '#4ade80' : '#fbbf24');
      });

      const btnDel = mkBtn('🗑️', 'Werbepartner entfernen', () => {
        spState.items.splice(idx, 1);
        renderList();
      }, 'margin-left: auto; color: #fca5a5;');

      topRow.append(orderBadge, chkActiveWrap, btnUp, btnDown, btnShowNow, btnChat, btnDel);

      const grid = document.createElement('div');
      grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 7px;';

      const mkField = (label, type, value, placeholder, onInput) => {
        const w = document.createElement('div');
        const l = document.createElement('label');
        l.style.cssText = 'display: block; font-size: 10.5px; color: #94a3b8; margin-bottom: 2px;';
        l.textContent = label;
        const inp = document.createElement('input');
        inp.type = type;
        inp.value = value;
        if (placeholder) inp.placeholder = placeholder;
        inp.style.width = '100%';
        inp.addEventListener('input', () => onInput(inp.value));
        w.append(l, inp);
        return w;
      };

      grid.append(
        mkField('Partner-Name', 'text', item.name || '', 'z. B. Holy Energy', (v) => { item.name = v; }),
        mkField('Untertitel / Rabattcode', 'text', item.subtitle || '', 'z. B. 10% mit Code OMNI10', (v) => { item.subtitle = v; }),
        mkField('Badge-Text', 'text', item.badge || 'WERBUNG', 'WERBUNG / PARTNER', (v) => { item.badge = v; }),
        mkField('Anzeigedauer (Sek.)', 'number', String(item.durationSec ?? 15), '15', (v) => { item.durationSec = Math.max(3, parseInt(v || '15', 10) || 15); }),
        mkField('Klick-URL (Link & QR-Code)', 'text', item.url || '', 'partner-seite.de/ref', (v) => { item.url = v; }),
        mkField('Akzentfarbe', 'color', item.accentColor || '#38bdf8', '', (v) => { item.accentColor = v; })
      );

      const mediaRow = document.createElement('div');
      mediaRow.style.cssText = 'display: flex; gap: 6px; align-items: center; flex-wrap: wrap;';
      const imgInput = document.createElement('input');
      imgInput.type = 'text';
      imgInput.style.flex = '1';
      imgInput.placeholder = 'Lokale Bilddatei wählen oder Bild-URL eintragen (optional)';
      imgInput.value = item.imagePath || item.imageUrl || '';
      imgInput.addEventListener('input', () => {
        const val = imgInput.value.trim();
        if (/^https?:\/\//i.test(val)) { item.imageUrl = val; item.imagePath = ''; }
        else { item.imagePath = val; item.imageUrl = ''; }
      });
      const btnPick = mkBtn('🖼️ Bild wählen', 'Lokales Logo/Banner auswählen', async () => {
        const picked = await window.omnichat.pickLocalFile?.({ kind: 'image' });
        if (picked?.ok && picked.filePath) {
          item.imagePath = picked.filePath;
          item.imageUrl = '';
          imgInput.value = picked.filePath;
        }
      });
      mediaRow.append(imgInput, btnPick);

      card.append(topRow, grid, mediaRow);
      listEl.appendChild(card);
    });
  };

  document.getElementById('btnOpenSponsors')?.addEventListener('click', async () => {
    const res = await window.omnichat.sponsorsGet?.();
    if (res?.ok && res.sponsors) spState = res.sponsors;
    if (res?.overlayUrl) overlayUrl = res.overlayUrl;
    renderList();
    modal.classList.remove('hidden');
  });

  document.getElementById('btnCloseSponsors')?.addEventListener('click', () => modal.classList.add('hidden'));

  document.getElementById('btnSpAddItem')?.addEventListener('click', () => {
    spState.items.push({
      id: `sp_${Date.now().toString(36)}`,
      enabled: true,
      name: '',
      subtitle: '',
      badge: 'WERBUNG',
      url: '',
      imagePath: '',
      imageUrl: '',
      accentColor: '#38bdf8',
      durationSec: 15
    });
    renderList();
  });

  document.getElementById('btnSpSave')?.addEventListener('click', async () => {
    readGlobalInputs();
    const res = await window.omnichat.sponsorsSave?.(spState);
    if (res?.ok) {
      spState = res.sponsors;
      renderList();
      setMsg('✅ Werbepartner gespeichert & live ans OBS-Overlay (/sponsors) gesendet!', '#4ade80');
    } else {
      setMsg('⚠️ Speichern fehlgeschlagen.', '#f87171');
    }
  });

  document.getElementById('btnSpCopyUrl')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(overlayUrl);
    setMsg(`🔗 ${overlayUrl} kopiert! (In OBS als Browser-Quelle 460×175 einfügen)`, '#4ade80');
  });

  document.getElementById('btnSpOpenPreview')?.addEventListener('click', () => {
    window.omnichat.openExternalUrl?.(overlayUrl);
  });
})();

(() => {
  const stage = document.getElementById('chatPreviewStage');
  const feed = document.getElementById('chatPreviewFeed');
  const btnObs = document.getElementById('btnPvModeObs');
  const btnApp = document.getElementById('btnPvModeApp');
  const btnAdd = document.getElementById('btnPvAddMsg');
  if (!stage || !feed) return;

  let previewMode = 'app';
  const sampleMessages = [
    { platform: 'twitch', author: 'HyperStreamer99', color: '#a970ff', badge: 'MOD', time: '20:14', text: 'Willkommen im Stream! Der App-Chat sieht mega clean aus 🔥' },
    { platform: 'youtube', author: 'PixelArchitect_Dev', color: '#ff4e45', badge: 'MEM', time: '20:14', text: 'Schriftgröße, Padding und Kontrast sind perfekt lesbar!' },
    { platform: 'tiktok', author: 'NeonLightcycle', color: '#00f2fe', badge: 'VIP', time: '20:15', text: 'GGs! Die Runde war absolut crazy 🚀' },
    { platform: 'twitch', author: 'SuperLongViewerName1234', color: '#38bdf8', badge: 'SUB', time: '20:15', text: 'Test für abgeschnittene Namen & Trennlinien-Vorschau ✨' }
  ];
  const extraSamples = [
    { platform: 'twitch', author: 'ClutchMaster', color: '#4ade80', badge: 'VIP', time: '20:16', text: 'ACE!! Was ein krasser Flick!' },
    { platform: 'youtube', author: 'CodeWizard', color: '#fbbf24', badge: '', time: '20:16', text: 'Welches Theme nutzt du gerade fürs Overlay?' },
    { platform: 'tiktok', author: 'StreamFan_DE', color: '#f472b6', badge: '', time: '20:17', text: 'Grüße aus dem TikTok Live! ❤️' }
  ];
  let extraIdx = 0;

  const toRgba = (hex, pct) => {
    const clean = String(hex || '#0b0f19').replace('#', '');
    const num = parseInt(clean, 16) || 0x0b0f19;
    return `rgba(${(num >> 16) & 255},${(num >> 8) & 255},${num & 255},${(Math.max(0, Math.min(100, pct)) / 100).toFixed(2)})`;
  };

  const renderPreview = () => {
    const layoutMode = selLayoutMode?.value || 'inline';
    const obsTheme = previewMode === 'obs' ? (selObsChatTheme?.value || 'auto') : 'default';
    const nameSize = parseFloat(rngNameSize?.value || '13');
    const msgSize = parseFloat(rngMsgSize?.value || '13.5');
    const maxNameLen = parseInt(rngMaxNameLen?.value || '16', 10);
    const msgPad = parseInt(rngMsgPadding?.value || '5', 10);
    const showIcons = chkShowPlatIcons ? chkShowPlatIcons.checked : true;
    const showTs = chkShowTimestamps ? chkShowTimestamps.checked : true;
    const platStyle = selPlatStyle?.value || 'icon_only';
    const colorMode = selUserColorMode?.value || 'user';
    const showSep = chkShowSeparator ? chkShowSeparator.checked : true;
    const sepCol = clrSeparator?.value || '#ffffff';
    const sepOp = parseInt(rngSepOpacity?.value || '10', 10);
    const sepGap = parseInt(rngSepSpacing?.value || '0', 10);
    const bgCol = clrChatBg?.value || '#0b0f19';
    const bgOp = previewMode === 'obs'
      ? parseInt(rngObsBgOpacity?.value || '65', 10)
      : parseInt(rngBgOpacity?.value || '90', 10);

    stage.style.setProperty('--pv-name-size', `${nameSize}px`);
    stage.style.setProperty('--pv-msg-size', `${msgSize}px`);
    stage.style.setProperty('--pv-pad-v', `${msgPad}px`);
    stage.style.setProperty('--pv-gap', layoutMode === 'bubbles' ? `${Math.max(3, msgPad)}px` : `${sepGap}px`);
    stage.style.setProperty('--pv-sep-display', showSep ? '1px' : '0px');
    stage.style.setProperty('--pv-sep-color', toRgba(sepCol, sepOp));
    stage.style.setProperty('--pv-item-bg', toRgba(bgCol, bgOp));

    stage.classList.toggle('pv-bubbles', layoutMode === 'bubbles');
    stage.classList.toggle('pv-theme-lol', obsTheme === 'lol');
    stage.classList.toggle('pv-theme-valorant', obsTheme === 'valorant');
    stage.classList.toggle('pv-theme-tron', obsTheme === 'tron');

    feed.innerHTML = '';
    const icons = { twitch: '🟣', youtube: '🔴', tiktok: '🎵' };
    sampleMessages.slice(-6).forEach((m) => {
      const row = document.createElement('div');
      row.className = `pv-msg ${m.platform}`;
      if (showTs) {
        const ts = document.createElement('span');
        ts.className = 'pv-time';
        ts.textContent = m.time;
        row.appendChild(ts);
      }
      if (showIcons) {
        if (platStyle === 'icon_badge') {
          const b = document.createElement('span');
          b.className = `pv-plat-badge ${m.platform}`;
          b.textContent = `${icons[m.platform] || '💬'} ${m.platform}`;
          row.appendChild(b);
        } else {
          const ic = document.createElement('span');
          ic.className = 'pv-plat';
          ic.textContent = icons[m.platform] || '💬';
          row.appendChild(ic);
        }
      }
      if (m.badge) {
        const bd = document.createElement('span');
        bd.className = 'pv-badge';
        bd.textContent = m.badge;
        row.appendChild(bd);
      }
      const author = document.createElement('span');
      author.className = 'pv-author';
      const displayName = maxNameLen > 0 && m.author.length > maxNameLen ? `${m.author.slice(0, maxNameLen)}…` : m.author;
      author.textContent = `${displayName}:`;
      author.style.color = colorMode === 'mono'
        ? '#e2e8f0'
        : colorMode === 'platform'
          ? (m.platform === 'twitch' ? '#a970ff' : m.platform === 'youtube' ? '#ff4e45' : '#00f2fe')
          : m.color;
      const txt = document.createElement('span');
      txt.textContent = m.text;
      row.append(author, txt);
      feed.appendChild(row);
    });
  };

  const setMode = (mode) => {
    previewMode = mode;
    if (btnObs) {
      btnObs.style.background = mode === 'obs' ? 'rgba(56,189,248,0.2)' : '';
      btnObs.style.borderColor = mode === 'obs' ? 'rgba(56,189,248,0.55)' : '';
      btnObs.style.color = mode === 'obs' ? '#bae6fd' : '';
    }
    if (btnApp) {
      btnApp.style.background = mode === 'app' ? 'rgba(56,189,248,0.2)' : '';
      btnApp.style.borderColor = mode === 'app' ? 'rgba(56,189,248,0.55)' : '';
      btnApp.style.color = mode === 'app' ? '#bae6fd' : '';
    }
    renderPreview();
  };

  btnObs?.addEventListener('click', () => setMode('obs'));
  btnApp?.addEventListener('click', () => setMode('app'));
  btnAdd?.addEventListener('click', () => {
    sampleMessages.push(extraSamples[extraIdx % extraSamples.length]);
    extraIdx += 1;
    if (sampleMessages.length > 6) sampleMessages.shift();
    renderPreview();
  });

  [
    selLayoutMode, selObsChatTheme, rngNameSize, rngMsgSize, rngMaxNameLen, rngMsgPadding,
    chkShowPlatIcons, chkShowTimestamps, selPlatStyle, selUserColorMode,
    chkShowSeparator, clrSeparator, rngSepOpacity, rngSepSpacing, clrChatBg, rngBgOpacity, rngObsBgOpacity
  ].forEach((el) => {
    el?.addEventListener('input', renderPreview);
    el?.addEventListener('change', renderPreview);
  });

  document.getElementById('btnOpenConfig')?.addEventListener('click', () => setTimeout(renderPreview, 60));
  window.omnichat.onInitState?.(() => setTimeout(renderPreview, 120));
  renderPreview();
})();

(() => {
  const videoEl = document.getElementById('clipStudioVideo');
  const numStart = document.getElementById('numClipStart');
  const numEnd = document.getElementById('numClipEnd');
  const rngStart = document.getElementById('rngClipStart');
  const rngEnd = document.getElementById('rngClipEnd');
  const selLayout = document.getElementById('selClipLayout');
  const markersLayer = document.getElementById('clipTimelineMarkersLayer');
  const listEl = document.getElementById('clipMarkersList');
  const countEl = document.getElementById('clipMarkerCount');
  const statusEl = document.getElementById('clipStudioStatus');
  const btnAddNow = document.getElementById('btnClipAddMarkerNow');
  const btnAddSeg = document.getElementById('btnClipAddSegment');
  const btnExpAll = document.getElementById('btnClipExportAllShorts');
  const btnTrimAll = document.getElementById('btnClipTrimAll');
  const btnMontage169 = document.getElementById('btnClipMontage169');
  const btnMontage916 = document.getElementById('btnClipMontage916');
  const btnClear = document.getElementById('btnClipClearMarkers');
  if (!videoEl || !listEl) return;

  let markers = [];
  let lastVideoSrc = '';

  const fmtTime = (sec) => {
    const s = Math.max(0, Number(sec) || 0);
    const m = Math.floor(s / 60);
    const r = (s % 60).toFixed(1).padStart(4, '0');
    return `${String(m).padStart(2, '0')}:${r}`;
  };

  const getActiveFilePath = () => {
    const raw = videoEl.getAttribute('src') || '';
    if (!raw) return '';
    try {
      const u = new URL(raw);
      return decodeURIComponent(u.pathname).replace(/^\/([A-Za-z]:)/, '$1');
    } catch (e) {
      return '';
    }
  };

  const applyRangeToControls = (startSec, endSec) => {
    const s = Math.max(0, Number(startSec) || 0);
    const e = Math.max(s + 0.5, Number(endSec) || s + 10);
    if (numStart) { numStart.value = s.toFixed(1); numStart.dispatchEvent(new Event('input')); }
    if (numEnd) { numEnd.value = e.toFixed(1); numEnd.dispatchEvent(new Event('input')); }
    if (rngStart) rngStart.value = s.toFixed(1);
    if (rngEnd) rngEnd.value = e.toFixed(1);
  };

  const renderMarkers = () => {
    const dur = Number.isFinite(videoEl.duration) && videoEl.duration > 0 ? videoEl.duration : 30;
    if (countEl) countEl.textContent = String(markers.length);
    if (btnExpAll) btnExpAll.disabled = markers.length === 0;
    if (btnTrimAll) btnTrimAll.disabled = markers.length === 0;
    if (btnMontage169) btnMontage169.disabled = markers.length < 2;
    if (btnMontage916) btnMontage916.disabled = markers.length < 2;
    if (btnClear) btnClear.disabled = markers.length === 0;

    if (markersLayer) {
      markersLayer.innerHTML = '';
      markers.forEach((m) => {
        const pin = document.createElement('div');
        pin.className = 'clip-marker-pin';
        const leftPct = Math.max(0, Math.min(100, (m.start / dur) * 100));
        const widthPct = Math.max(1, Math.min(100 - leftPct, ((m.end - m.start) / dur) * 100));
        pin.style.left = `${leftPct}%`;
        pin.style.width = `${widthPct}%`;
        pin.title = `${m.label}: ${fmtTime(m.start)} – ${fmtTime(m.end)}`;
        markersLayer.appendChild(pin);
      });
    }

    listEl.innerHTML = '';
    if (!markers.length) {
      const hint = document.createElement('div');
      hint.style.color = '#64748b';
      hint.textContent = 'Noch keine Marker gesetzt – spiele das Video ab und klicke „🚩 Marker jetzt“ oder „➕ Auswahl merken“.';
      listEl.appendChild(hint);
      return;
    }

    markers.forEach((m, idx) => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; align-items: center; gap: 6px; padding: 5px 7px; border-radius: 7px; background: rgba(30,41,59,0.78); border: 1px solid rgba(251,191,36,0.25);';
      const idxEl = document.createElement('span');
      idxEl.style.cssText = 'font-weight: 800; color: #fde047; font-size: 11px;';
      idxEl.textContent = `#${idx + 1}`;

      const lblInp = document.createElement('input');
      lblInp.type = 'text';
      lblInp.value = m.label;
      lblInp.style.cssText = 'flex: 1; min-width: 90px; padding: 3px 6px; font-size: 11px;';
      lblInp.addEventListener('input', () => { m.label = lblInp.value; });

      const timeEl = document.createElement('span');
      timeEl.style.cssText = 'font-family: ui-monospace, monospace; font-size: 11px; color: #94a3b8; white-space: nowrap;';
      timeEl.textContent = `${fmtTime(m.start)} – ${fmtTime(m.end)}`;

      const mkBtn = (txt, title, fn) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn-sm';
        b.style.cssText = 'padding: 2px 6px; font-size: 10.5px;';
        b.textContent = txt;
        b.title = title;
        b.addEventListener('click', fn);
        return b;
      };

      const btnPlay = mkBtn('▶', 'Segment anspringen & abspielen', () => {
        applyRangeToControls(m.start, m.end);
        document.getElementById('btnClipPlayRange')?.click();
      });
      const btnLoad = mkBtn('📍', 'In Timeline-Regler laden', () => applyRangeToControls(m.start, m.end));
      const btnDel = mkBtn('🗑️', 'Marker entfernen', () => { markers.splice(idx, 1); renderMarkers(); });

      row.append(idxEl, lblInp, timeEl, btnPlay, btnLoad, btnDel);
      listEl.appendChild(row);
    });
  };

  videoEl.addEventListener('loadedmetadata', () => {
    const src = videoEl.getAttribute('src') || '';
    if (src && src !== lastVideoSrc) {
      lastVideoSrc = src;
      markers = [];
    }
    renderMarkers();
  });

  btnAddNow?.addEventListener('click', () => {
    const dur = Number.isFinite(videoEl.duration) && videoEl.duration > 0 ? videoEl.duration : 30;
    const now = Number(videoEl.currentTime || 0);
    const start = Math.max(0, now - 5);
    const end = Math.min(dur, Math.max(start + 3, now + 10));
    markers.push({ id: `m_${Date.now()}`, label: `Highlight ${markers.length + 1}`, start, end });
    markers.sort((a, b) => a.start - b.start);
    renderMarkers();
  });

  btnAddSeg?.addEventListener('click', () => {
    const start = Math.max(0, parseFloat(numStart?.value || '0') || 0);
    const end = Math.max(start + 0.5, parseFloat(numEnd?.value || String(start + 10)) || start + 10);
    markers.push({ id: `m_${Date.now()}`, label: `Clip ${markers.length + 1}`, start, end });
    markers.sort((a, b) => a.start - b.start);
    renderMarkers();
  });

  btnClear?.addEventListener('click', () => {
    markers = [];
    renderMarkers();
  });

  const exportAllMarkers = async (mode) => {
    const filePath = getActiveFilePath();
    if (!filePath || !markers.length) return;
    if (btnExpAll) btnExpAll.disabled = true;
    if (btnTrimAll) btnTrimAll.disabled = true;
    let okCount = 0;
    for (let i = 0; i < markers.length; i++) {
      const m = markers[i];
      if (statusEl) {
        statusEl.style.color = '#38bdf8';
        statusEl.textContent = `⏳ Exportiere Marker ${i + 1}/${markers.length} (${m.label})...`;
      }
      const proOpts = typeof window.getClipStudioProOptions === 'function'
        ? window.getClipStudioProOptions(mode === 'short')
        : { layoutMode: selLayout?.value || 'blur_bg' };
      const res = mode === 'short'
        ? await window.omnichat.clipStudioExportShort({
            inputPath: filePath,
            startSec: m.start,
            endSec: m.end,
            durationSec: Math.max(0.5, m.end - m.start),
            ...proOpts
          })
        : await window.omnichat.clipStudioTrimOriginal({
            inputPath: filePath,
            startSec: m.start,
            endSec: m.end,
            durationSec: Math.max(0.5, m.end - m.start),
            ...proOpts
          });
      if (res?.ok) okCount += 1;
    }
    if (statusEl) {
      statusEl.style.color = okCount > 0 ? '#4ade80' : '#f87171';
      statusEl.textContent = `✅ ${okCount}/${markers.length} Marker erfolgreich exportiert!`;
    }
    document.getElementById('btnClipRefresh')?.click();
    renderMarkers();
  };

  const exportMontage = async (isVertical) => {
    const filePath = getActiveFilePath();
    if (!filePath || markers.length < 2) return;
    if (btnMontage169) btnMontage169.disabled = true;
    if (btnMontage916) btnMontage916.disabled = true;
    const proOpts = typeof window.getClipStudioProOptions === 'function' ? window.getClipStudioProOptions(isVertical) : {};
    if (statusEl) {
      statusEl.style.color = '#38bdf8';
      statusEl.textContent = `⏳ Rendere Highlight-Montage (${markers.length} Segmente, ${isVertical ? '9:16' : '16:9'}) mit Crossfades...`;
    }
    const res = await window.omnichat.clipStudioMontage?.({
      inputPath: filePath,
      segments: markers.map((m) => ({ startSec: m.start, endSec: m.end })),
      isVertical,
      crossfadeSec: 0.4,
      normalizeAudio: Boolean(proOpts.normalizeAudio),
      watermarkText: proOpts.watermarkText || '',
      overlayPngDataUrl: proOpts.overlayPngDataUrl || ''
    });
    if (statusEl) {
      if (res?.ok) {
        statusEl.style.color = '#4ade80';
        statusEl.textContent = `🎞️ Highlight-Montage fertig: ${res.fileName}`;
      } else {
        statusEl.style.color = '#f87171';
        statusEl.textContent = `❌ ${res?.error || 'Highlight-Montage fehlgeschlagen.'}`;
      }
    }
    document.getElementById('btnClipRefresh')?.click();
    renderMarkers();
  };

  btnExpAll?.addEventListener('click', () => exportAllMarkers('short'));
  btnTrimAll?.addEventListener('click', () => exportAllMarkers('trim'));
  btnMontage169?.addEventListener('click', () => exportMontage(false));
  btnMontage916?.addEventListener('click', () => exportMontage(true));
  renderMarkers();
})();

(() => {
  const sel = document.getElementById('gaChampThemeSelect');
  const statusEl = document.getElementById('gaStatus');
  if (!sel) return;

  const renderThemes = (data) => {
    if (!data) return;
    const packs = Array.isArray(data.packs) ? data.packs : [];
    const mode = data.mode && data.mode !== 'auto' ? data.mode : 'none';
    sel.innerHTML = '';
    const opts = [
      { value: 'none', label: '⚔️ Standard-Design (kein Pack aktiv)' },
      ...packs.map((p) => ({ value: p.id, label: `${p.icon || '🎨'} ${p.name}` }))
    ];
    opts.forEach((o) => {
      const el = document.createElement('option');
      el.value = o.value;
      el.textContent = o.label;
      if (o.value === mode) el.selected = true;
      sel.appendChild(el);
    });
  };

  const loadThemes = async () => {
    const res = await window.omnichat.themesList?.();
    if (res?.ok) renderThemes(res);
  };

  sel.addEventListener('change', async () => {
    const res = await window.omnichat.themesSelect?.(sel.value);
    if (res?.ok && statusEl) {
      statusEl.style.color = '#ff69b4';
      statusEl.textContent = res.active
        ? `💥 Design-Pack aktiv: ${res.active.icon} ${res.active.name} (live auf allen OBS-Overlays!)`
        : '⚔️ Standard-Design aktiv (kein Champion-Pack ausgewählt).';
    }
  });

  document.getElementById('btnGaInstallThemePack')?.addEventListener('click', async () => {
    const res = await window.omnichat.themesInstallFile?.();
    if (res?.ok) {
      renderThemes(res);
      if (statusEl) {
        statusEl.style.color = '#4ade80';
        statusEl.textContent = `✅ Champion-Pack "${res.installedPack?.name}" installiert & live aktiviert!`;
      }
    } else if (res && !res.canceled && statusEl) {
      statusEl.style.color = '#f87171';
      statusEl.textContent = `⚠️ ${res.error || 'Pack konnte nicht installiert werden.'}`;
    }
  });

  document.getElementById('btnGaCheckThemeUpdates')?.addEventListener('click', async () => {
    const isEn = window.__appLang === 'en';
    if (statusEl) {
      statusEl.style.color = '#38bdf8';
      statusEl.textContent = isEn ? '⏳ Checking installed overlay packs for updates...' : '⏳ Prüfe installierte Overlay-Packs auf Updates...';
    }
    const res = await window.omnichat.themesCheckUpdates?.();
    if (res?.ok) {
      renderThemes(res);
      if (statusEl) {
        if (res.updated?.length) {
          const names = res.updated.map((u) => u.name).join(', ');
          statusEl.style.color = '#4ade80';
          statusEl.textContent = isEn
            ? `🔄 Updated ${res.updated.length} pack(s): ${names}`
            : `🔄 ${res.updated.length} Pack(s) aktualisiert: ${names}`;
        } else {
          statusEl.style.color = '#94a3b8';
          statusEl.textContent = isEn
            ? `✅ All installed packs (${res.checked || 0}) are up to date!`
            : `✅ Alle installierten Packs (${res.checked || 0}) sind auf dem neuesten Stand!`;
        }
      }
    }
  });

  document.getElementById('btnGaExportThemePack')?.addEventListener('click', async () => {
    const targetId = sel.value !== 'auto' && sel.value !== 'none' ? sel.value : 'jinx-arcane-zaun';
    await window.omnichat.themesExportPack?.(targetId);
  });

  document.getElementById('btnGaOpenThemesDir')?.addEventListener('click', () => {
    window.omnichat.themesOpenDir?.();
  });

  // Live 18-Band FFT Audio-Device Analyzer for DJ Sona Equalizer (optional Pro Mode; Auto uses OBS InputVolumeMeters + Spotify/Music Sync)
  const eqSel = document.getElementById('gaDjAudioDeviceSelect');
  const eqSelStream = document.getElementById('gaDjStreamAudioDeviceSelect');
  const btnRefreshEqDev = document.getElementById('btnGaRefreshAudioDevices');
  const btnRefreshEqDevStream = document.getElementById('btnGaDjRefreshAudioDevices');
  let eqStream = null;
  let eqCtx = null;
  let eqRaf = 0;

  function stopLiveAudioEq() {
    if (eqRaf) { cancelAnimationFrame(eqRaf); eqRaf = 0; }
    if (eqStream) { eqStream.getTracks().forEach((tr) => tr.stop()); eqStream = null; }
    if (eqCtx) { eqCtx.close().catch(() => {}); eqCtx = null; }
  }

  async function populateAudioEqDevices() {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const selects = [eqSel, eqSelStream].filter(Boolean);
    if (!selects.length) return;
    try {
      const devs = await navigator.mediaDevices.enumerateDevices();
      const inputs = devs.filter((d) => d.kind === 'audioinput');
      selects.forEach((selEl) => {
        const prev = selEl.value || 'auto';
        selEl.innerHTML = '<option value="auto">Auto (OBS Audio-Pegel + Spotify/Music Sync)</option>';
        inputs.forEach((d, idx) => {
          const opt = document.createElement('option');
          opt.value = d.deviceId;
          opt.textContent = `🎛️ 18-Band FFT: ${d.label || `Audio-Eingang ${idx + 1}`}`;
          selEl.appendChild(opt);
        });
        selEl.value = Array.from(selEl.options).some((o) => o.value === prev) ? prev : 'auto';
      });
    } catch (e) {}
  }

  async function startLiveAudioEq(deviceId) {
    stopLiveAudioEq();
    if (!deviceId || deviceId === 'auto' || !navigator.mediaDevices?.getUserMedia) return;
    try {
      eqStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId }, echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        video: false
      });
      eqCtx = new (window.AudioContext || window.webkitAudioContext)();
      const src = eqCtx.createMediaStreamSource(eqStream);
      const analyser = eqCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.72;
      src.connect(analyser);
      const bins = new Uint8Array(analyser.frequencyBinCount);
      let lastSend = 0;
      function tickEq(now) {
        eqRaf = requestAnimationFrame(tickEq);
        if (now - lastSend < 33) return;
        lastSend = now;
        analyser.getByteFrequencyData(bins);
        const bands = [];
        let sum = 0;
        for (let i = 0; i < 18; i++) {
          const idx = Math.min(bins.length - 1, Math.floor(i * 1.9));
          const v = Math.min(1, (bins[idx] || 0) / 230);
          bands.push(Number(v.toFixed(3)));
          sum += v;
        }
        const level = Number(Math.min(1, (sum / 18) * 1.35).toFixed(3));
        window.omnichat.sendAudioEqFrame?.({ level, bands });
      }
      eqRaf = requestAnimationFrame(tickEq);
      if (statusEl) {
        statusEl.style.color = '#38bdf8';
        statusEl.textContent = '🎧 DJ Sona 18-Band Live FFT-Equalizer aktiv!';
      }
    } catch (err) {
      if (statusEl) {
        statusEl.style.color = '#f87171';
        statusEl.textContent = `⚠️ Audio-Eingang konnte nicht geöffnet werden: ${err.message}`;
      }
    }
  }

  eqSel?.addEventListener('change', () => {
    if (eqSelStream) eqSelStream.value = eqSel.value;
    startLiveAudioEq(eqSel.value);
  });
  eqSelStream?.addEventListener('change', () => {
    if (eqSel) eqSel.value = eqSelStream.value;
    startLiveAudioEq(eqSelStream.value);
  });
  btnRefreshEqDev?.addEventListener('click', populateAudioEqDevices);
  btnRefreshEqDevStream?.addEventListener('click', populateAudioEqDevices);
  populateAudioEqDevices();

  document.getElementById('btnOpenGameAddons')?.addEventListener('click', loadThemes);
  loadThemes();
})();

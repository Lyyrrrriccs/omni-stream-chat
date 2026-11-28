const DEFAULT_GAME_ADDONS_CONFIG = {
  selectedMode: 'auto', // 'auto' | 'lol' | 'justchatting' | 'cs2' | 'minecraft' | 'souls' | 'valorant' | 'universal'
  currentGameName: '',
  overlayEnabled: true,
  autoSwitchByGame: true,
  lolPollingEnabled: true,
  autoTriggerEvents: true,
  perAddonStats: {
    universal: { kills: 0, deaths: 0, wins: 0, rank: 'Live' },
    cs2: { kills: 0, deaths: 0, assists: 0, mvps: 0, map: 'Mirage', score: '0 : 0' },
    lol: {
      riotId: '',
      region: 'euw',
      rank: 'Diamond IV',
      lp: 50,
      role: '',
      champion: 'Ahri',
      skinId: 0,
      skinName: '',
      championIconUrl: '',
      skinIconUrl: '',
      skinSplashUrl: '',
      kills: 0,
      deaths: 0,
      assists: 0,
      cs: 0,
      level: 1,
      gameTimeSec: 0,
      currentGold: 0,
      keystone: '',
      spell1: '',
      spell2: '',
      items: [],
      recentMatches: [],
      mapCoverEnabled: false,
      mapCoverText: 'Minimap verdeckt • Kein Ghosting'
    },
    justchatting: {
      topic: 'Chill Talk & Community Q&A',
      subtopic: 'Fragen mit !ask stellen • !agenda für heutigen Plan',
      mood: '☕ Cozy Talk',
      currentLink: '',
      socialTicker: '!discord • !socials • Schön, dass ihr da seid!',
      agendaText: 'Begrüßung & Kaffeerunde\nCommunity News & Clips\nViewer Q&A (!ask)\nAusblick & Games',
      activeAgendaIdx: 0,
      qnaEnabled: true,
      activeQuestion: { id: '', author: '', platform: '', text: '' },
      qnaQueue: []
    },
    techtalk: {
      topic: 'Game Engine Architektur & Live Coding',
      project: 'GameDev Grid // Unreal / Godot / Custom',
      stack: 'C++20 • TypeScript • WebGPU • Node.js',
      phase: 'LIVE CODING',
      repoUrl: '',
      bugsFixed: 0,
      commits: 0,
      agendaText: 'System-Architektur & Grid-Setup\nLive Coding & Shader-Pipeline\nPerformance-Profiling & Netcode\nDev Q&A (!stack / !repo)',
      activeAgendaIdx: 0,
      tickerText: 'GRID ONLINE // !thema • !stack • !repo • !agenda • !bug+ • !commit+'
    },
    productlaunch: {
      productName: 'Studio Pro Series X',
      tagline: 'Präzision, Design & Leistung — Live Keynote',
      priceBadge: 'AB 299 € • NEU',
      promoUrl: 'shop.beispiel.de/launch',
      tickerText: 'KEYNOTE LIVE • Fragen gerne im Chat (!ask) • Launch-Angebot aktiv',
      highlightsText: 'Ultraleichtes Unibody-Aluminiumgehäuse\nBis zu 24 Stunden Akkulaufzeit\nSofort verfügbar mit 3 Jahren Garantie',
      agendaText: 'Willkommen & Vision\nDesign & Verarbeitung\nLive-Demo & Features\nPreise, Verfügbarkeit & Q&A',
      activeAgendaIdx: 0,
      showCard: true
    },
    djstream: {
      djName: 'DJ LIVE SET',
      setTitle: 'Midnight Club Session Vol. 1',
      genre: 'Melodic Techno / House',
      bpm: 128,
      colorScheme: 'cyber_club',
      tickerText: 'LIVE IN THE MIX • Trackwünsche im Chat • !track • !bpm • !genre'
    },
    minecraft: { deaths: 0, diamonds: 0, days: 1, mode: 'Survival' },
    souls: { deaths: 0, bosses: 0, run: 'Any%', bossName: 'Aktueller Boss' },
    valorant: {
      riotId: '',
      rank: 'Diamond II',
      rr: 62,
      agent: 'Jett',
      map: 'Ascent',
      score: '7 : 5',
      kills: 0,
      deaths: 0,
      assists: 0,
      hsPercent: 28,
      wins: 0,
      losses: 0,
      mapCoverEnabled: false,
      mapCoverText: 'RADAR VERDECKT // ANTI-SNIPE'
    }
  }
};

const GAME_ADDONS = [
  {
    id: 'lol',
    name: 'League of Legends — Komplett-Suite',
    icon: '⚔️',
    accent: '#0ac8b9',
    gameMatches: ['league of legends', 'lol', 'teamfight tactics'],
    fields: [
      { key: 'riotId', label: 'Riot-ID (Name#TAG für !opgg)', type: 'text' },
      { key: 'region', label: 'Region (euw, na, kr, eune)', type: 'text' },
      { key: 'rank', label: 'Rank / Elo', type: 'text' },
      { key: 'lp', label: 'LP', type: 'number' },
      { key: 'role', label: 'Rolle / Lane', type: 'text' },
      { key: 'champion', label: 'Champion', type: 'text' },
      { key: 'skinId', label: 'Skin-ID', type: 'number' },
      { key: 'kills', label: 'Kills', type: 'number' },
      { key: 'deaths', label: 'Deaths', type: 'number' },
      { key: 'assists', label: 'Assists', type: 'number' },
      { key: 'cs', label: 'CS', type: 'number' },
      { key: 'level', label: 'Level', type: 'number' }
    ],
    chatCommands: ['!elo', '!lp', '!opgg', '!ugg', '!champ', '!skin', '!build', '!items', '!mh', '!kd', '!stats'],
    eventHint: 'Komplett-Set: Hextech HUD (/game-stats), Live Item-Build & Elo-Bar (/lol-build), Anti-Ghosting Minimap (/lol-map), Live Client API (127.0.0.1:2999) & Auto-Pentakill-Clip!'
  },
  {
    id: 'justchatting',
    name: 'Just Chatting & Talk Suite',
    icon: '💬',
    accent: '#ec4899',
    gameMatches: ['just chatting', 'talk shows', 'podcasts', 'irl', 'special events', 'science & technology', 'music', 'art'],
    fields: [
      { key: 'topic', label: '🎙️ Aktuelles Thema (Bauchbinde)', type: 'text' },
      { key: 'subtopic', label: '💡 Untertitel / Hinweis', type: 'text' },
      { key: 'mood', label: '✨ Vibe / Modus-Badge', type: 'text' },
      { key: 'currentLink', label: '🎬 Aktueller Video-/React-Link (!video)', type: 'text' },
      { key: 'socialTicker', label: '📢 Social-Ticker (Bauchbinde)', type: 'text' }
    ],
    chatCommands: ['!thema', '!topic', '!agenda', '!ask', '!frage', '!video', '!react', '!setthema', '!nextq'],
    eventHint: 'Komplett-Set: TV-Bauchbinde (/jc-lowerthird), Viewer Q&A Spotlight (/jc-qna), Themen-Agenda (/game-stats) & Live Chat-Fragen (!ask).'
  },
  {
    id: 'techtalk',
    name: 'Tech Talk & GameDev — TRON Grid',
    icon: '💠',
    accent: '#00f0ff',
    gameMatches: ['software and game development', 'game development', 'programming', 'coding', 'tech talk', 'gamedev', 'godot', 'unity', 'unreal'],
    fields: [
      { key: 'topic', label: '💠 Tech-Thema (TRON Bauchbinde)', type: 'text' },
      { key: 'project', label: '⚡ Projekt / Engine', type: 'text' },
      { key: 'stack', label: '🧬 Tech-Stack (!stack)', type: 'text' },
      { key: 'phase', label: '🚀 Phase / Status', type: 'text' },
      { key: 'repoUrl', label: '🔗 Repo / Docs-Link (!repo)', type: 'text' },
      { key: 'bugsFixed', label: '🐛 Bugs gefixt', type: 'number' },
      { key: 'commits', label: '📦 Commits', type: 'number' }
    ],
    chatCommands: ['!thema', '!stack', '!repo', '!agenda', '!bug+', '!commit+', '!setthema', '!setphase', '!nextstep'],
    eventHint: 'TRON Legacy Suite: Neon-Grid Bauchbinde (/tron-talk), TRON HUD & Kapitel-Agenda (/game-stats), Live Bug/Commit-Counter & Dev Chat-Commands!'
  },
  {
    id: 'productlaunch',
    name: 'Produkt-Präsentation — Klassisch Modern',
    icon: '🎯',
    accent: '#d4af37',
    gameMatches: ['product launch', 'keynote', 'showcase', 'presentation', 'unboxing', 'review', 'tech review'],
    fields: [
      { key: 'productName', label: '🎯 Produktname', type: 'text' },
      { key: 'tagline', label: '✨ Untertitel / Claim', type: 'text' },
      { key: 'priceBadge', label: '🏷️ Preis / Release-Badge', type: 'text' },
      { key: 'promoUrl', label: '🔗 Link / Code', type: 'text' },
      { key: 'tickerText', label: '📢 Info-Ticker', type: 'text' }
    ],
    chatCommands: ['!produkt', '!preis', '!link', '!agenda'],
    eventHint: 'Klassisch-moderne Keynote-Suite: Elegante Bauchbinde (/product-lowerthird), Produkt-Spotlight-Karte (/product-card) & Kapitel-Stepper!'
  },
  {
    id: 'djstream',
    name: 'DJ Stream Suite — Multi-Color & Audio-EQ',
    icon: '🎧',
    accent: '#00e5ff',
    gameMatches: ['music', 'djs', 'dj', 'electronic music', 'techno', 'house', 'club'],
    fields: [
      { key: 'djName', label: '🎧 DJ / Artist Name', type: 'text' },
      { key: 'setTitle', label: '💿 Set-Titel', type: 'text' },
      { key: 'genre', label: '🎵 Genre', type: 'text' },
      { key: 'bpm', label: '⚡ BPM', type: 'number' },
      { key: 'tickerText', label: '📢 Club-Ticker / Shoutout', type: 'text' }
    ],
    chatCommands: ['!track', '!bpm', '!genre', '!set'],
    eventHint: 'DJ-Stream-Komplett-Set: 36-Band Live Audio-EQ Bühne (/dj-stage), Vinyl/BPM Deck (/dj-nowplaying), 5 Farbschemen & echte Audio-/OBS-Pegel-Kopplung!'
  },
  {
    id: 'cs2',
    name: 'Counter-Strike 2 (GSI)',
    icon: '🎯',
    accent: '#f59e0b',
    gameMatches: ['counter-strike', 'cs2', 'cs:go', 'counter strike'],
    fields: [
      { key: 'kills', label: 'Kills', type: 'number' },
      { key: 'deaths', label: 'Deaths', type: 'number' },
      { key: 'assists', label: 'Assists', type: 'number' },
      { key: 'mvps', label: 'MVPs', type: 'number' },
      { key: 'map', label: 'Map', type: 'text' },
      { key: 'score', label: 'Score', type: 'text' }
    ],
    chatCommands: ['!kd', '!stats', '!map'],
    eventHint: 'CS2 GSI (POST /api/game/cs2-gsi): Live K/D/A, Map, Score & Auto-Aktion bei 3K/Ace.'
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    icon: '⛏️',
    accent: '#22c55e',
    gameMatches: ['minecraft'],
    fields: [
      { key: 'deaths', label: 'Tode', type: 'number' },
      { key: 'diamonds', label: 'Diamanten', type: 'number' },
      { key: 'days', label: 'Tage', type: 'number' },
      { key: 'mode', label: 'Modus', type: 'text' }
    ],
    chatCommands: ['!deaths', '!death+', '!stats'],
    eventHint: 'Chat-Commands (!deaths, !death+) & Webhook (POST /api/game/event).'
  },
  {
    id: 'souls',
    name: 'Elden Ring / Soulsborne',
    icon: '💀',
    accent: '#ef4444',
    gameMatches: ['elden ring', 'dark souls', 'sekiro', 'bloodborne', 'lies of p', 'black myth'],
    fields: [
      { key: 'deaths', label: 'Tode', type: 'number' },
      { key: 'bosses', label: 'Bosskills', type: 'number' },
      { key: 'bossName', label: 'Aktueller Boss', type: 'text' },
      { key: 'run', label: 'Run', type: 'text' }
    ],
    chatCommands: ['!deaths', '!death+', '!boss', '!stats'],
    eventHint: 'Perfekt für Death-Counter per Stream Deck (/api/streamdeck/game-stat?key=deaths&delta=1) oder Chat.'
  },
  {
    id: 'valorant',
    name: 'Valorant — Tactical Esports Suite',
    icon: '🔫',
    accent: '#ff4655',
    gameMatches: ['valorant', 'apex legends', 'fortnite', 'overwatch', 'call of duty', 'warzone'],
    fields: [
      { key: 'riotId', label: 'Riot-ID (Name#TAG)', type: 'text' },
      { key: 'rank', label: 'Rank (z. B. Ascendant II)', type: 'text' },
      { key: 'rr', label: 'RR (0–100)', type: 'number' },
      { key: 'agent', label: 'Agent', type: 'text' },
      { key: 'map', label: 'Map', type: 'text' },
      { key: 'score', label: 'Score (z. B. 7 : 5)', type: 'text' },
      { key: 'kills', label: 'Kills', type: 'number' },
      { key: 'deaths', label: 'Deaths', type: 'number' },
      { key: 'assists', label: 'Assists', type: 'number' },
      { key: 'hsPercent', label: 'HS %', type: 'number' },
      { key: 'wins', label: 'Session Wins', type: 'number' },
      { key: 'losses', label: 'Session Losses', type: 'number' }
    ],
    chatCommands: ['!rank', '!rr', '!agent', '!map', '!kd', '!stats', '!win+', '!loss+', '!kill+', '!death+'],
    eventHint: 'Komplett-Set: Valorant Tactical HUD (/game-stats), Rank/RR & Match-Bar (/val-bar), Anti-Snipe Radar-Cover (/val-map) & Session W/L-Counter!'
  },
  {
    id: 'universal',
    name: 'Universal Game Counter',
    icon: '🏆',
    accent: '#a855f7',
    gameMatches: [],
    fields: [
      { key: 'kills', label: 'Kills', type: 'number' },
      { key: 'deaths', label: 'Tode', type: 'number' },
      { key: 'wins', label: 'Wins', type: 'number' },
      { key: 'rank', label: 'Status / Rank', type: 'text' }
    ],
    chatCommands: ['!stats', '!deaths', '!death+', '!wins', '!win+'],
    eventHint: 'Funktioniert mit jedem Spiel als Fallback für Auto-Switch.'
  }
];

function deepFreeze(obj) {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    for (const v of Object.values(obj)) deepFreeze(v);
  }
  return obj;
}

// Vorgefertigte Addons (Definitionen + Standardwerte) sind schreibgeschützt:
// Laufzeit-Code, Webhooks oder gespeicherte Configs können sie nicht verändern.
deepFreeze(GAME_ADDONS);
deepFreeze(DEFAULT_GAME_ADDONS_CONFIG);

const PRESET_ADDON_IDS = GAME_ADDONS.map((a) => a.id);
const EXTRA_STAT_KEYS = {
  lol: [
    'skinName',
    'championIconUrl',
    'skinIconUrl',
    'skinSplashUrl',
    'gameTimeSec',
    'currentGold',
    'keystone',
    'spell1',
    'spell2',
    'items',
    'recentMatches',
    'mapCoverEnabled',
    'mapCoverText'
  ],
  justchatting: ['agendaText', 'activeAgendaIdx', 'qnaEnabled', 'activeQuestion', 'qnaQueue'],
  techtalk: ['agendaText', 'activeAgendaIdx', 'tickerText'],
  productlaunch: ['highlightsText', 'agendaText', 'activeAgendaIdx', 'showCard'],
  djstream: ['colorScheme'],
  valorant: ['mapCoverEnabled', 'mapCoverText']
};

function sanitizeAddonStats(addonId, rawStats = {}) {
  const defaults = DEFAULT_GAME_ADDONS_CONFIG.perAddonStats[addonId] || {};
  const addon = GAME_ADDONS.find((a) => a.id === addonId);
  const allowed = new Set([
    ...Object.keys(defaults),
    ...((addon && addon.fields) || []).map((f) => f.key),
    ...(EXTRA_STAT_KEYS[addonId] || [])
  ]);
  const out = JSON.parse(JSON.stringify(defaults));
  const src = rawStats && typeof rawStats === 'object' ? rawStats : {};
  for (const key of Object.keys(src)) {
    if (!allowed.has(key)) continue;
    const def = defaults[key];
    const val = src[key];
    if (typeof def === 'number') {
      out[key] = Number.isFinite(Number(val)) ? Number(val) : def;
    } else if (typeof def === 'boolean') {
      out[key] = Boolean(val);
    } else if (Array.isArray(def)) {
      out[key] = Array.isArray(val) ? val.slice(0, 30) : [];
    } else if (def && typeof def === 'object') {
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        const cleanObj = {};
        for (const subK of Object.keys(def)) {
          cleanObj[subK] = val[subK] === undefined || val[subK] === null ? def[subK] : String(val[subK]).slice(0, 280);
        }
        out[key] = cleanObj;
      } else {
        out[key] = JSON.parse(JSON.stringify(def));
      }
    } else {
      const maxLen = key === 'agendaText' ? 1200 : 240;
      out[key] = val === undefined || val === null ? def : String(val).slice(0, maxLen);
    }
  }
  return out;
}

function normalizeGameAddonsConfig(raw = {}) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const mergedStats = {};
  for (const addon of GAME_ADDONS) {
    mergedStats[addon.id] = sanitizeAddonStats(addon.id, src.perAddonStats && src.perAddonStats[addon.id]);
  }
  const mode = String(src.selectedMode || 'auto');
  return {
    selectedMode: mode === 'auto' || PRESET_ADDON_IDS.includes(mode) ? mode : 'auto',
    currentGameName: String(src.currentGameName || ''),
    overlayEnabled: src.overlayEnabled !== false,
    autoSwitchByGame: src.autoSwitchByGame !== false,
    lolPollingEnabled: src.lolPollingEnabled !== false,
    autoTriggerEvents: src.autoTriggerEvents !== false,
    perAddonStats: mergedStats
  };
}

function resetAddonStats(ga, addonId) {
  const next = normalizeGameAddonsConfig(ga);
  if (PRESET_ADDON_IDS.includes(addonId)) {
    next.perAddonStats[addonId] = sanitizeAddonStats(addonId, {});
  }
  return next;
}

function getAddonById(id) {
  return GAME_ADDONS.find((a) => a.id === id) || GAME_ADDONS.find((a) => a.id === 'universal');
}

function matchAddonByGameName(gameName = '') {
  const lower = String(gameName || '').trim().toLowerCase();
  if (!lower) return 'universal';
  for (const addon of GAME_ADDONS) {
    if (addon.gameMatches.some((m) => lower.includes(m))) {
      return addon.id;
    }
  }
  return 'universal';
}

function resolveActiveAddon(cfg = {}) {
  const ga = normalizeGameAddonsConfig(cfg.gameAddons);
  const effectiveId = ga.selectedMode === 'auto'
    ? matchAddonByGameName(ga.currentGameName)
    : ga.selectedMode;
  const addon = getAddonById(effectiveId);
  const stats = ga.perAddonStats[addon.id] || {};
  return { addon, stats, ga };
}

function parseAgendaItems(agendaText = '') {
  return String(agendaText || '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function buildOpggLinks(riotId = '', region = 'euw') {
  const cleanId = String(riotId || '').trim();
  const reg = String(region || 'euw').trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'euw';
  if (!cleanId || !cleanId.includes('#')) return null;
  const [gameName, tagLine] = cleanId.split('#').map((s) => s.trim());
  if (!gameName || !tagLine) return null;
  const slug = `${encodeURIComponent(gameName)}-${encodeURIComponent(tagLine)}`;
  const uggReg = { euw: 'euw1', eune: 'eun1', na: 'na1', kr: 'kr', br: 'br1', oce: 'oc1', tr: 'tr1', jp: 'jp1' }[reg] || `${reg}1`;
  return {
    opgg: `https://www.op.gg/summoners/${reg}/${slug}`,
    ugg: `https://u.gg/lol/profile/${uggReg}/${encodeURIComponent(gameName.toLowerCase())}-${encodeURIComponent(tagLine.toLowerCase())}/overview`
  };
}

function buildObsGameStatsPayload(cfg = {}) {
  const { addon, stats, ga } = resolveActiveAddon(cfg);
  const lolStats = ga.perAddonStats?.lol || {};
  const jcStats = ga.perAddonStats?.justchatting || {};
  const ttStats = ga.perAddonStats?.techtalk || {};
  const prodStats = ga.perAddonStats?.productlaunch || {};
  const djStats = ga.perAddonStats?.djstream || {};
  const valStats = ga.perAddonStats?.valorant || {};

  const lolMatches = Array.isArray(lolStats.recentMatches) ? lolStats.recentMatches.slice(0, 6) : [];
  const lolWins = lolMatches.filter((m) => m && m.win).length;
  const lolLosses = lolMatches.filter((m) => m && !m.win).length;
  const lolTimeMin = Number(lolStats.gameTimeSec || 0) > 60 ? Number(lolStats.gameTimeSec) / 60 : 0;
  const lolCspm = lolTimeMin > 0 ? (Number(lolStats.cs || 0) / lolTimeMin).toFixed(1) : '';

  let displayStats = [];
  if (addon.id === 'lol') {
    const k = Number(stats.kills || 0);
    const d = Number(stats.deaths || 0);
    const a = Number(stats.assists || 0);
    const kd = d > 0 ? (k / d).toFixed(2) : k.toFixed(2);
    displayStats = [
      { key: 'kda', label: 'K / D / A', value: `${k}/${d}/${a}` },
      { key: 'kd', label: 'K/D', value: kd },
      { key: 'cs', label: lolCspm ? `CS (${lolCspm}/m)` : 'CS', value: Number(stats.cs || 0) },
      { key: 'level', label: 'LVL', value: Number(stats.level || 1) }
    ];
  } else if (addon.id === 'justchatting') {
    const qQueue = Array.isArray(stats.qnaQueue) ? stats.qnaQueue : [];
    const agenda = parseAgendaItems(stats.agendaText);
    const curStep = Math.min(Math.max(0, Number(stats.activeAgendaIdx || 0)), Math.max(0, agenda.length - 1));
    displayStats = [
      { key: 'mood', label: 'Vibe', value: stats.mood || '☕ Live' },
      { key: 'step', label: 'Kapitel', value: agenda.length ? `${curStep + 1} / ${agenda.length}` : '—' },
      { key: 'qna', label: 'Offene Fragen', value: qQueue.length }
    ];
  } else if (addon.id === 'techtalk') {
    const agenda = parseAgendaItems(stats.agendaText);
    const curStep = Math.min(Math.max(0, Number(stats.activeAgendaIdx || 0)), Math.max(0, agenda.length - 1));
    displayStats = [
      { key: 'phase', label: 'STATUS', value: stats.phase || 'LIVE CODING' },
      { key: 'bugsFixed', label: 'BUGS FIXED', value: Number(stats.bugsFixed || 0) },
      { key: 'commits', label: 'COMMITS', value: Number(stats.commits || 0) },
      { key: 'step', label: 'SECTOR', value: agenda.length ? `${curStep + 1}/${agenda.length}` : '—' }
    ];
  } else if (addon.id === 'productlaunch') {
    const agenda = parseAgendaItems(stats.agendaText);
    const curStep = Math.min(Math.max(0, Number(stats.activeAgendaIdx || 0)), Math.max(0, agenda.length - 1));
    displayStats = [
      { key: 'price', label: 'ANGEBOT', value: stats.priceBadge || 'LIVE' },
      { key: 'step', label: 'KAPITEL', value: agenda.length ? `${curStep + 1} / ${agenda.length}` : '—' },
      { key: 'link', label: 'INFO', value: stats.promoUrl || 'Keynote' }
    ];
  } else if (addon.id === 'djstream') {
    displayStats = [
      { key: 'genre', label: 'GENRE', value: stats.genre || 'Club Mix' },
      { key: 'bpm', label: 'BPM', value: `${Number(stats.bpm || 128)} BPM` },
      { key: 'scheme', label: 'THEME', value: String(stats.colorScheme || 'cyber_club').replace('_', ' ').toUpperCase() }
    ];
  } else if (addon.id === 'valorant') {
    const k = Number(stats.kills || 0);
    const d = Number(stats.deaths || 0);
    const a = Number(stats.assists || 0);
    const kd = d > 0 ? (k / d).toFixed(2) : k.toFixed(2);
    displayStats = [
      { key: 'kda', label: 'K / D / A', value: `${k}/${d}/${a}` },
      { key: 'kd', label: 'K/D', value: kd },
      { key: 'hs', label: 'HS %', value: `${Number(stats.hsPercent || 0)}%` },
      { key: 'wl', label: 'SESSION', value: `${Number(stats.wins || 0)}W - ${Number(stats.losses || 0)}L` }
    ];
  } else {
    displayStats = addon.fields.map((f) => ({
      key: f.key,
      label: f.label,
      value: stats[f.key] !== undefined && stats[f.key] !== '' ? stats[f.key] : '—'
    }));
    if (typeof stats.kills === 'number' && typeof stats.deaths === 'number') {
      const kd = stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : String(stats.kills.toFixed(2));
      displayStats.push({ key: 'kd', label: 'K/D', value: kd });
    }
  }

  const agendaItems = parseAgendaItems(jcStats.agendaText);
  const activeAgendaIdx = Math.min(Math.max(0, Number(jcStats.activeAgendaIdx || 0)), Math.max(0, agendaItems.length - 1));
  const qnaQueue = Array.isArray(jcStats.qnaQueue) ? jcStats.qnaQueue : [];
  const tronAgendaItems = parseAgendaItems(ttStats.agendaText);
  const tronActiveAgendaIdx = Math.min(Math.max(0, Number(ttStats.activeAgendaIdx || 0)), Math.max(0, tronAgendaItems.length - 1));

  return {
    addonId: addon.id,
    addonName: addon.name,
    icon: addon.icon,
    accent: addon.accent,
    selectedMode: ga.selectedMode,
    overlayEnabled: ga.overlayEnabled !== false,
    currentGameName: ga.currentGameName,
    // LoL payload (usable by /game-stats, /lol-map AND /lol-build simultaneously)
    riotId: lolStats.riotId || '',
    region: lolStats.region || 'euw',
    lolRank: lolStats.rank || 'Unranked',
    lolLp: Number(lolStats.lp || 0),
    lolRole: lolStats.role || '',
    lolWins,
    lolLosses,
    lolCspm,
    gameTimeSec: Number(lolStats.gameTimeSec || 0),
    currentGold: Math.round(Number(lolStats.currentGold || 0)),
    keystone: lolStats.keystone || '',
    spell1: lolStats.spell1 || '',
    spell2: lolStats.spell2 || '',
    items: Array.isArray(lolStats.items) ? lolStats.items.slice(0, 7) : [],
    champion: lolStats.champion || '',
    skinId: Number(lolStats.skinId || 0),
    skinName: lolStats.skinName || '',
    championIconUrl: lolStats.championIconUrl || '',
    skinIconUrl: lolStats.skinIconUrl || '',
    skinSplashUrl: lolStats.skinSplashUrl || '',
    recentMatches: lolMatches,
    mapCoverEnabled: Boolean(lolStats.mapCoverEnabled),
    mapCoverText: String(lolStats.mapCoverText || 'Minimap verdeckt • Kein Ghosting'),
    // Just Chatting payload (usable by /game-stats, /jc-lowerthird AND /jc-qna simultaneously)
    jcTopic: jcStats.topic || 'Chill Talk & Community Q&A',
    jcSubtopic: jcStats.subtopic || '',
    jcMood: jcStats.mood || '☕ Cozy Talk',
    jcCurrentLink: jcStats.currentLink || '',
    jcSocialTicker: jcStats.socialTicker || '',
    jcAgendaItems: agendaItems,
    jcActiveAgendaIdx: activeAgendaIdx,
    jcQnaEnabled: jcStats.qnaEnabled !== false,
    jcActiveQuestion: jcStats.activeQuestion && jcStats.activeQuestion.text ? jcStats.activeQuestion : null,
    jcQnaCount: qnaQueue.length,
    tronTopic: ttStats.topic || 'Game Engine Architektur & Live Coding',
    tronProject: ttStats.project || 'GameDev Grid',
    tronStack: ttStats.stack || 'C++20 • TypeScript • WebGPU',
    tronPhase: ttStats.phase || 'LIVE CODING',
    tronRepoUrl: ttStats.repoUrl || '',
    tronBugsFixed: Number(ttStats.bugsFixed || 0),
    tronCommits: Number(ttStats.commits || 0),
    tronAgendaItems,
    tronActiveAgendaIdx,
    tronTickerText: ttStats.tickerText || 'GRID ONLINE // !stack • !repo • !agenda',
    valRiotId: valStats.riotId || '',
    valRank: valStats.rank || 'Unranked',
    valRr: Number(valStats.rr || 0),
    valAgent: valStats.agent || 'Jett',
    valMap: valStats.map || 'Ascent',
    valScore: valStats.score || '0 : 0',
    valKills: Number(valStats.kills || 0),
    valDeaths: Number(valStats.deaths || 0),
    valAssists: Number(valStats.assists || 0),
    valHsPercent: Number(valStats.hsPercent || 0),
    valWins: Number(valStats.wins || 0),
    valLosses: Number(valStats.losses || 0),
    valMapCoverEnabled: Boolean(valStats.mapCoverEnabled),
    valMapCoverText: String(valStats.mapCoverText || 'RADAR VERDECKT // ANTI-SNIPE'),
    prodName: String(prodStats.productName || 'Studio Pro Series X'),
    prodTagline: String(prodStats.tagline || 'Präzision, Design & Leistung — Live Keynote'),
    prodPriceBadge: String(prodStats.priceBadge || 'AB 299 € • NEU'),
    prodPromoUrl: String(prodStats.promoUrl || ''),
    prodTickerText: String(prodStats.tickerText || 'KEYNOTE LIVE'),
    prodHighlights: parseAgendaItems(prodStats.highlightsText).slice(0, 5),
    prodAgendaItems: parseAgendaItems(prodStats.agendaText),
    prodActiveAgendaIdx: Math.max(0, Number(prodStats.activeAgendaIdx || 0)),
    prodShowCard: prodStats.showCard !== false,
    djName: String(djStats.djName || 'DJ LIVE SET'),
    djSetTitle: String(djStats.setTitle || 'Midnight Club Session Vol. 1'),
    djGenre: String(djStats.genre || 'Melodic Techno / House'),
    djBpm: Math.max(60, Math.min(220, Number(djStats.bpm || 128))),
    djColorScheme: String(djStats.colorScheme || 'cyber_club'),
    djTickerText: String(djStats.tickerText || 'LIVE IN THE MIX'),
    stats: displayStats,
    chatCommands: addon.chatCommands
  };
}

function handleGameChatCommand(cfg = {}, msg = {}) {
  const text = String(msg.text || '').trim();
  if (!text.startsWith('!')) return null;
  const firstSpace = text.indexOf(' ');
  const cmd = (firstSpace > 0 ? text.slice(0, firstSpace) : text).toLowerCase();
  const argText = firstSpace > 0 ? text.slice(firstSpace + 1).trim() : '';
  const { addon, stats, ga } = resolveActiveAddon(cfg);
  const roles = Array.isArray(msg.roles) ? msg.roles.map((r) => String(r).toLowerCase()) : [];
  const isModOrBroadcaster = Boolean(msg.isSelf) || roles.some((r) => ['broadcaster', 'moderator', 'mod'].includes(r));

  if (addon.id === 'valorant') {
    if (cmd === '!rank' || cmd === '!rr') {
      return { mutated: false, reply: `🔫 Valorant Rank: ${stats.rank || 'Unranked'} (${Number(stats.rr || 0)} RR) • Session: ${Number(stats.wins || 0)}W-${Number(stats.losses || 0)}L` };
    }
    if (cmd === '!agent') {
      return { mutated: false, reply: `🔫 Aktueller Agent: ${stats.agent || '—'} auf ${stats.map || '—'} (${stats.score || '0 : 0'})` };
    }
    if (cmd === '!win+' && isModOrBroadcaster) {
      stats.wins = Number(stats.wins || 0) + 1;
      stats.rr = Math.min(100, Number(stats.rr || 0) + 20);
      return {
        mutated: true,
        bypassCooldown: true,
        nextGameAddons: { ...ga, perAddonStats: { ...ga.perAddonStats, valorant: stats } },
        reply: `🏆 Valorant Sieg! Session: ${stats.wins}W-${Number(stats.losses || 0)}L (${stats.rank} • ${stats.rr} RR)`
      };
    }
    if (cmd === '!loss+' && isModOrBroadcaster) {
      stats.losses = Number(stats.losses || 0) + 1;
      stats.rr = Math.max(0, Number(stats.rr || 0) - 18);
      return {
        mutated: true,
        bypassCooldown: true,
        nextGameAddons: { ...ga, perAddonStats: { ...ga.perAddonStats, valorant: stats } },
        reply: `💀 Niederlage verbucht. Session: ${Number(stats.wins || 0)}W-${stats.losses}L (${stats.rank} • ${stats.rr} RR)`
      };
    }
    if (cmd === '!kill+' && isModOrBroadcaster) {
      stats.kills = Number(stats.kills || 0) + 1;
      return {
        mutated: true,
        bypassCooldown: true,
        nextGameAddons: { ...ga, perAddonStats: { ...ga.perAddonStats, valorant: stats } },
        reply: `🎯 Kill! Aktuell ${stats.kills}/${Number(stats.deaths || 0)}/${Number(stats.assists || 0)}`
      };
    }
  }

  // === JUST CHATTING COMMAND SUITE ===
  if (addon.id === 'techtalk') {
    if ((cmd === '!setthema' || cmd === '!settopic') && isModOrBroadcaster && argText) {
      stats.topic = argText.slice(0, 140);
      return {
        mutated: true,
        bypassCooldown: true,
        nextGameAddons: { ...ga, perAddonStats: { ...ga.perAddonStats, techtalk: stats } },
        reply: `💠 TRON Grid Thema aktualisiert: "${stats.topic}"`
      };
    }
    if (cmd === '!setphase' && isModOrBroadcaster && argText) {
      stats.phase = argText.slice(0, 32).toUpperCase();
      return {
        mutated: true,
        bypassCooldown: true,
        nextGameAddons: { ...ga, perAddonStats: { ...ga.perAddonStats, techtalk: stats } },
        reply: `🚀 Grid-Status: ${stats.phase}`
      };
    }
    if (cmd === '!bug+' && isModOrBroadcaster) {
      stats.bugsFixed = Number(stats.bugsFixed || 0) + 1;
      return {
        mutated: true,
        bypassCooldown: true,
        nextGameAddons: { ...ga, perAddonStats: { ...ga.perAddonStats, techtalk: stats } },
        reply: `🐛 Bug eliminiert! Gesamt heute: ${stats.bugsFixed}`
      };
    }
    if (cmd === '!commit+' && isModOrBroadcaster) {
      stats.commits = Number(stats.commits || 0) + 1;
      return {
        mutated: true,
        bypassCooldown: true,
        nextGameAddons: { ...ga, perAddonStats: { ...ga.perAddonStats, techtalk: stats } },
        reply: `📦 Commit gepusht! Gesamt heute: ${stats.commits}`
      };
    }
    if (cmd === '!nextstep' && isModOrBroadcaster) {
      const items = parseAgendaItems(stats.agendaText);
      if (items.length) {
        stats.activeAgendaIdx = (Number(stats.activeAgendaIdx || 0) + 1) % items.length;
        return {
          mutated: true,
          bypassCooldown: true,
          nextGameAddons: { ...ga, perAddonStats: { ...ga.perAddonStats, techtalk: stats } },
          reply: `💠 Nächster Sektor [${stats.activeAgendaIdx + 1}/${items.length}]: ${items[stats.activeAgendaIdx]}`
        };
      }
    }
    if (cmd === '!thema' || cmd === '!topic') {
      return { mutated: false, reply: `💠 Tech Talk: ${stats.topic} (${stats.project} • ${stats.phase})` };
    }
    if (cmd === '!stack') {
      return { mutated: false, reply: `🧬 Tech-Stack: ${stats.stack || '—'} | Projekt: ${stats.project || '—'}` };
    }
    if (cmd === '!repo' || cmd === '!code') {
      return { mutated: false, reply: stats.repoUrl ? `🔗 Repo / Docs: ${stats.repoUrl}` : '🔗 Aktuell kein öffentlicher Repo-Link hinterlegt.' };
    }
    if (cmd === '!agenda') {
      const items = parseAgendaItems(stats.agendaText);
      const idx = Math.min(Math.max(0, Number(stats.activeAgendaIdx || 0)), Math.max(0, items.length - 1));
      const formatted = items.map((it, i) => (i === idx ? `▶ ${i + 1}. ${it}` : `${i + 1}. ${it}`)).join(' | ');
      return { mutated: false, reply: items.length ? `💠 Grid-Agenda: ${formatted}` : '💠 Noch keine Agenda hinterlegt.' };
    }
  }

  if (addon.id === 'justchatting') {
    if ((cmd === '!setthema' || cmd === '!settopic') && isModOrBroadcaster && argText) {
      stats.topic = argText.slice(0, 140);
      return {
        mutated: true,
        bypassCooldown: true,
        nextGameAddons: { ...ga, perAddonStats: { ...ga.perAddonStats, justchatting: stats } },
        reply: `🎙️ Neues Gesprächsthema gesetzt: "${stats.topic}"`
      };
    }

    if (cmd === '!nextq' && isModOrBroadcaster) {
      const queue = Array.isArray(stats.qnaQueue) ? [...stats.qnaQueue] : [];
      const nextQ = queue.shift() || { id: '', author: '', platform: '', text: '' };
      stats.qnaQueue = queue;
      stats.activeQuestion = nextQ;
      return {
        mutated: true,
        bypassCooldown: true,
        nextGameAddons: { ...ga, perAddonStats: { ...ga.perAddonStats, justchatting: stats } },
        reply: nextQ.text
          ? `❓ Aktuelle Frage von @${nextQ.author}: "${nextQ.text}"`
          : '✅ Keine weiteren offenen Fragen in der Q&A-Warteschlange!'
      };
    }

    if ((cmd === '!ask' || cmd === '!frage' || cmd === '!q') && stats.qnaEnabled !== false) {
      if (argText.length < 3) {
        return { mutated: false, reply: `💬 @${msg.author || 'Viewer'}: Schreib deine Frage einfach dahinter, z. B. !ask Was hältst du vom neuen Patch?` };
      }
      const queue = Array.isArray(stats.qnaQueue) ? [...stats.qnaQueue] : [];
      const cleanQ = argText.slice(0, 220);
      const dup = queue.some((q) => q.text.toLowerCase() === cleanQ.toLowerCase());
      if (!dup && queue.length < 30) {
        queue.push({
          id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          author: String(msg.author || 'Zuschauer').slice(0, 40),
          platform: String(msg.platform || 'twitch'),
          text: cleanQ
        });
        stats.qnaQueue = queue;
        return {
          mutated: true,
          bypassCooldown: true,
          nextGameAddons: { ...ga, perAddonStats: { ...ga.perAddonStats, justchatting: stats } },
          reply: `💬 @${msg.author || 'Viewer'}, deine Frage steht auf Platz #${queue.length} der Q&A-Liste!`
        };
      }
      return null;
    }

    if (cmd === '!thema' || cmd === '!topic') {
      return {
        mutated: false,
        reply: `🎙️ Aktuelles Thema: ${stats.topic || 'Chill Talk'}${stats.subtopic ? ` — ${stats.subtopic}` : ''}`
      };
    }

    if (cmd === '!agenda') {
      const items = parseAgendaItems(stats.agendaText);
      if (!items.length) return { mutated: false, reply: '📋 Heute wird spontan gequatscht — keine feste Agenda!' };
      const cur = Math.min(Math.max(0, Number(stats.activeAgendaIdx || 0)), items.length - 1);
      const formatted = items.map((it, i) => `${i < cur ? '✅' : i === cur ? '👉' : '⏳'} ${i + 1}. ${it}`).join(' | ');
      return { mutated: false, reply: `📋 Heutige Themen: ${formatted}` };
    }

    if (cmd === '!video' || cmd === '!react' || cmd === '!link') {
      return {
        mutated: false,
        reply: stats.currentLink
          ? `🎬 Aktuelles Video / Thema: ${stats.currentLink}`
          : `💬 Aktuell ist kein Video-Link hinterlegt (Thema: ${stats.topic || 'Talk'}).`
      };
    }
  }

  // === LEAGUE OF LEGENDS COMMAND SUITE ===
  if (addon.id === 'lol') {
    const matches = Array.isArray(stats.recentMatches) ? stats.recentMatches.slice(0, 6) : [];
    const w = matches.filter((m) => m && m.win).length;
    const l = matches.filter((m) => m && !m.win).length;
    const wr = w + l > 0 ? ` (${Math.round((w / (w + l)) * 100)}% WR)` : '';

    if (cmd === '!elo' || cmd === '!lp' || cmd === '!rank') {
      const rolePart = stats.role ? ` • Rolle: ${stats.role}` : '';
      const sessionPart = w + l > 0 ? ` • Session: ${w}W - ${l}L${wr}` : '';
      return {
        mutated: false,
        reply: `⚔️ Aktuelle Elo: ${stats.rank || 'Unranked'} (${Number(stats.lp || 0)} LP)${rolePart}${sessionPart}`
      };
    }

    if (cmd === '!opgg' || cmd === '!ugg') {
      const links = buildOpggLinks(stats.riotId, stats.region);
      if (!links) {
        return {
          mutated: false,
          reply: `⚔️ ${stats.rank || 'LoL'} (${Number(stats.lp || 0)} LP) — Tipp: Riot-ID (Name#TAG) in Game-Addons eintragen für direkten Profil-Link!`
        };
      }
      const targetUrl = cmd === '!ugg' ? links.ugg : links.opgg;
      return {
        mutated: false,
        reply: `⚔️ LoL-Profil (${stats.riotId} • ${stats.rank || 'Live'} ${Number(stats.lp || 0)} LP): ${targetUrl}`
      };
    }

    if (cmd === '!champ' || cmd === '!skin') {
      const skinPart = stats.skinName ? ` [Skin: ${stats.skinName}]` : '';
      const timeMin = Number(stats.gameTimeSec || 0) > 60 ? Number(stats.gameTimeSec) / 60 : 0;
      const cspm = timeMin > 0 ? ` (${(Number(stats.cs || 0) / timeMin).toFixed(1)}/m)` : '';
      return {
        mutated: false,
        reply: `⚔️ Champion: ${stats.champion || '—'}${skinPart} • Rolle: ${stats.role || '—'} • KDA: ${stats.kills || 0}/${stats.deaths || 0}/${stats.assists || 0} • ${stats.cs || 0} CS${cspm} (Lvl ${stats.level || 1})`
      };
    }

    if (cmd === '!build' || cmd === '!items' || cmd === '!runes') {
      const itemNames = (Array.isArray(stats.items) ? stats.items : [])
        .map((i) => i && i.name)
        .filter(Boolean);
      const runePart = stats.keystone ? `Keystone: ${stats.keystone}` : '';
      const spellsPart = stats.spell1 || stats.spell2 ? `Spells: ${[stats.spell1, stats.spell2].filter(Boolean).join(' / ')}` : '';
      const goldPart = stats.currentGold ? `Gold: ${Math.round(Number(stats.currentGold))}` : '';
      const metaParts = [runePart, spellsPart, goldPart].filter(Boolean).join(' • ');
      return {
        mutated: false,
        reply: itemNames.length
          ? `🛡️ ${stats.champion || 'LoL'} Build: ${itemNames.join(' → ')}${metaParts ? ` | ${metaParts}` : ''}`
          : `🛡️ ${stats.champion || 'LoL'}: Noch keine Items im Inventar${metaParts ? ` (${metaParts})` : ''}.`
      };
    }

    if (cmd === '!mh' || cmd === '!matchhistory' || cmd === '!streak') {
      if (!matches.length) {
        return { mutated: false, reply: '📜 Noch keine Matches in der heutigen Session aufgezeichnet.' };
      }
      const summary = matches
        .map((m) => `${m.win ? '✅W' : '❌L'} ${m.champion || ''}${m.kills !== undefined ? ` (${m.kills}/${m.deaths}/${m.assists})` : ''}`.trim())
        .join(' | ');
      return { mutated: false, reply: `📜 Letzte Matches (${w}W-${l}L${wr}): ${summary}` };
    }
  }

  // Mutating commands (Mod / Broadcaster only)
  if ((cmd === '!death+' || cmd === '!win+') && isModOrBroadcaster) {
    const field = cmd === '!death+' ? 'deaths' : 'wins';
    if (typeof stats[field] === 'number' || stats[field] === undefined) {
      stats[field] = (Number(stats[field]) || 0) + 1;
      return {
        mutated: true,
        nextGameAddons: {
          ...ga,
          perAddonStats: { ...ga.perAddonStats, [addon.id]: stats }
        },
        reply: `${addon.icon} ${addon.name}: ${field === 'deaths' ? 'Tode' : 'Wins'} jetzt bei ${stats[field]}!`
      };
    }
  }

  if (cmd === '!stats' || cmd === '!kd') {
    if (!addon.chatCommands.includes(cmd) && cmd === '!kd') return null;
    const parts = addon.fields
      .filter((f) => !['riotId', 'region', 'skinId', 'subtopic', 'socialTicker', 'currentLink'].includes(f.key))
      .map((f) => `${f.label}: ${stats[f.key] ?? 0}`);
    if (typeof stats.kills === 'number' && typeof stats.deaths === 'number') {
      const kd = stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : String(stats.kills);
      parts.push(`K/D: ${kd}`);
    }
    return { mutated: false, reply: `${addon.icon} ${addon.name} — ${parts.join(' | ')}` };
  }

  if (cmd === '!deaths' && stats.deaths !== undefined) {
    return { mutated: false, reply: `${addon.icon} Aktuelle Tode (${addon.name}): ${stats.deaths}` };
  }
  if (cmd === '!wins' && stats.wins !== undefined) {
    return { mutated: false, reply: `${addon.icon} Aktuelle Wins (${addon.name}): ${stats.wins}` };
  }
  if (cmd === '!rank' && stats.rank !== undefined) {
    return { mutated: false, reply: `${addon.icon} Aktueller Rank (${addon.name}): ${stats.rank}` };
  }
  if (cmd === '!map' && stats.map !== undefined) {
    return { mutated: false, reply: `${addon.icon} Aktuelle Map: ${stats.map} (${stats.score || '0 : 0'})` };
  }
  if (cmd === '!boss' && stats.bossName !== undefined) {
    return { mutated: false, reply: `${addon.icon} Aktueller Boss: ${stats.bossName} (Tode bisher: ${stats.deaths ?? 0})` };
  }
  return null;
}

function buildCs2GsiConfig(port = 4588) {
  return `"OmniGrid Studio CS2 GSI"
{
  "uri" "http://127.0.0.1:${port}/api/game/cs2-gsi"
  "timeout" "5.0"
  "buffer" "0.1"
  "throttle" "0.5"
  "heartbeat" "30.0"
  "data"
  {
    "provider" "1"
    "map" "1"
    "round" "1"
    "player_id" "1"
    "player_state" "1"
    "player_match_stats" "1"
  }
}
`;
}

let cachedDdragon = { version: '', champions: null, champByKey: {}, skinsById: {} };

function normalizeLolPosition(rawPos) {
  const key = String(rawPos || '').trim().toUpperCase();
  if (!key || key === 'NONE' || key === 'INVALID' || key === 'FILL' || key === 'APEX') return '';
  const map = {
    TOP: 'Top',
    JUNGLE: 'Jungle',
    JGL: 'Jungle',
    MIDDLE: 'Mid',
    MID: 'Mid',
    BOTTOM: 'ADC',
    BOT: 'ADC',
    ADC: 'ADC',
    CARRY: 'ADC',
    UTILITY: 'Support',
    SUPPORT: 'Support',
    SUP: 'Support'
  };
  return map[key] || '';
}

const LOL_SUPPORT_ITEM_IDS = new Set([
  3850, 3851, 3853, 3854, 3855, 3857, 3858, 3859, 3860, 3862, 3863, 3864,
  3865, 3866, 3867, 3869, 3870, 3871, 3876, 3877
]);

function detectLolRole({ position, lcuPosition, gameMode, spell1, spell2, spell1Raw, spell2Raw, items, fallbackRole } = {}) {
  const direct = normalizeLolPosition(position) || normalizeLolPosition(lcuPosition);
  if (direct) return direct;
  const mode = String(gameMode || '').trim().toUpperCase();
  if (mode === 'ARAM') return 'ARAM';
  if (mode === 'CHERRY') return 'Arena';
  const spellStr = `${spell1 || ''} ${spell2 || ''} ${spell1Raw || ''} ${spell2Raw || ''}`;
  if (/smite|zerschmettern/i.test(spellStr)) return 'Jungle';
  if (Array.isArray(items) && items.some((it) => LOL_SUPPORT_ITEM_IDS.has(Number(it?.itemID ?? it?.id ?? 0)))) {
    return 'Support';
  }
  return String(fallbackRole || '').trim();
}

async function ensureDdragonLoaded() {
  if (cachedDdragon.version && cachedDdragon.champions) return cachedDdragon;
  try {
    const vResp = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await vResp.json();
    const rawVer = Array.isArray(versions) && versions[0] ? String(versions[0]) : '';
    const ver = /^\d+\.\d+\.\d+$/.test(rawVer) ? rawVer : '14.23.1';
    const cResp = await fetch(`https://ddragon.leagueoflegends.com/cdn/${ver}/data/de_DE/champion.json`);
    const cJson = await cResp.json();
    const map = {};
    const byKey = {};
    for (const champ of Object.values(cJson?.data || {})) {
      map[String(champ.name || '').toLowerCase()] = champ.id;
      map[String(champ.id || '').toLowerCase()] = champ.id;
      if (champ.key) byKey[String(champ.key)] = { id: champ.id, name: champ.name || champ.id };
    }
    cachedDdragon = { version: ver, champions: map, champByKey: byKey, skinsById: {} };
  } catch (e) {}
  return cachedDdragon;
}

async function resolveLolDdragonAssets(championName = '', skinId = 0, explicitSkinName = '') {
  const cleanName = String(championName || '').trim();
  if (!cleanName || cleanName === '—') {
    return { version: cachedDdragon.version || '14.23.1', championIconUrl: '', skinIconUrl: '', skinSplashUrl: '', skinName: explicitSkinName || '' };
  }

  const dd = await ensureDdragonLoaded();
  const ver = dd.version || '14.23.1';
  const lower = cleanName.toLowerCase();
  let champId = dd.champions?.[lower] || '';
  if (!champId) {
    const alias = { wukong: 'MonkeyKing', 'nunu & willump': 'Nunu', 'renata glasc': 'Renata' };
    champId = alias[lower] || cleanName.replace(/[^a-zA-Z0-9]/g, '');
  }

  const num = Math.max(0, parseInt(skinId, 10) || 0);
  const safeChampId = /^[A-Za-z0-9]{1,32}$/.test(champId) ? champId : '';
  if (!safeChampId) {
    return { version: ver, championIconUrl: '', skinIconUrl: '', skinSplashUrl: '', skinName: explicitSkinName || '' };
  }
  let resolvedSkinName = String(explicitSkinName || '').trim();
  if (!resolvedSkinName && num > 0 && safeChampId) {
    try {
      if (!dd.skinsById[safeChampId]) {
        const sResp = await fetch(`https://ddragon.leagueoflegends.com/cdn/${ver}/data/de_DE/champion/${safeChampId}.json`);
        const sJson = await sResp.json();
        const cData = sJson?.data?.[safeChampId];
        if (cData?.skins) dd.skinsById[safeChampId] = cData.skins;
      }
      const match = (dd.skinsById[safeChampId] || []).find((s) => Number(s.num) === num);
      if (match?.name && match.name !== 'default') resolvedSkinName = match.name;
    } catch (e) {}
  }

  const champIcon = `https://ddragon.leagueoflegends.com/cdn/${ver}/img/champion/${safeChampId}.png`;
  return {
    version: ver,
    championIconUrl: champIcon,
    skinIconUrl: num > 0 ? `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${safeChampId}_${num}.jpg` : champIcon,
    skinSplashUrl: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${safeChampId}_${num}.jpg`,
    skinName: resolvedSkinName || (num === 0 ? 'Classic' : `Skin #${num}`)
  };
}

async function resolveLolItemList(rawItems = []) {
  if (!Array.isArray(rawItems) || !rawItems.length) return [];
  const dd = await ensureDdragonLoaded();
  const ver = dd.version || '14.23.1';
  return rawItems
    .filter((it) => it && Number(it.itemID) > 0)
    .slice(0, 7)
    .map((it) => {
      const id = Number(it.itemID);
      return {
        id,
        slot: Number(it.slot ?? 0),
        count: Number(it.count || 1),
        name: String(it.displayName || `Item #${id}`).slice(0, 60),
        iconUrl: `https://ddragon.leagueoflegends.com/cdn/${ver}/img/item/${id}.png`
      };
    });
}

// ======================================================
// LOCAL LEAGUE CLIENT (LCU) READER — RANK, LP & RIOT-ID
// Reads directly from local LeagueClientUx (127.0.0.1) via lockfile / process args.
// Requires NO Riot API key and sends zero external traffic.
// ======================================================
function formatLcuTier(entry) {
  if (!entry || !entry.tier) return { rank: 'Unranked', lp: 0, ranked: false };
  const rawTier = String(entry.tier || '').toUpperCase();
  if (!rawTier || rawTier === 'NONE' || rawTier === 'UNRANKED') {
    return { rank: 'Unranked', lp: 0, ranked: false };
  }
  const tierNames = {
    IRON: 'Iron',
    BRONZE: 'Bronze',
    SILVER: 'Silver',
    GOLD: 'Gold',
    PLATINUM: 'Platinum',
    EMERALD: 'Emerald',
    DIAMOND: 'Diamond',
    MASTER: 'Master',
    GRANDMASTER: 'Grandmaster',
    CHALLENGER: 'Challenger'
  };
  const niceTier = tierNames[rawTier] || rawTier;
  const apex = ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(rawTier);
  const div = String(entry.division || '').toUpperCase();
  const rank = !apex && div && div !== 'NA' ? `${niceTier} ${div}` : niceTier;
  return {
    rank,
    lp: Math.max(0, Number(entry.leaguePoints || 0)),
    wins: Number(entry.wins || 0),
    losses: Number(entry.losses || 0),
    ranked: true
  };
}

async function discoverLcuCredentials() {
  const fs = require('fs');
  const path = require('path');
  const os = require('os');
  const { execFile } = require('child_process');

  const candidates = [
    '/Applications/League of Legends.app/Contents/LoL/lockfile',
    path.join(os.homedir(), 'Applications/League of Legends.app/Contents/LoL/lockfile'),
    'C:\\Riot Games\\League of Legends\\lockfile',
    'D:\\Riot Games\\League of Legends\\lockfile',
    'E:\\Riot Games\\League of Legends\\lockfile'
  ];

  for (const lf of candidates) {
    try {
      if (fs.existsSync(lf)) {
        const content = fs.readFileSync(lf, 'utf8').trim();
        const parts = content.split(':');
        if (parts.length >= 4 && /^\d+$/.test(parts[2]) && parts[3]) {
          return { port: Number(parts[2]), token: parts[3] };
        }
      }
    } catch (e) {}
  }

  return await new Promise((resolve) => {
    if (process.platform === 'win32') {
      execFile(
        'powershell.exe',
        ['-NoProfile', '-Command', "Get-CimInstance Win32_Process -Filter \"name = 'LeagueClientUx.exe'\" | Select-Object -ExpandProperty CommandLine"],
        { timeout: 2500 },
        (err, stdout) => {
          if (err || !stdout) return resolve(null);
          const p = String(stdout).match(/--app-port=(\d+)/);
          const t = String(stdout).match(/--remoting-auth-token=([\w-]+)/);
          resolve(p && t ? { port: Number(p[1]), token: t[1] } : null);
        }
      );
    } else {
      execFile('ps', ['-ax', '-o', 'args='], { timeout: 2000, maxBuffer: 2 * 1024 * 1024 }, (err, stdout) => {
        if (err || !stdout) return resolve(null);
        const line = String(stdout)
          .split('\n')
          .find((l) => l.includes('LeagueClientUx') && l.includes('--app-port='));
        if (!line) return resolve(null);
        const p = line.match(/--app-port=(\d+)/);
        const t = line.match(/--remoting-auth-token=([\w-]+)/);
        resolve(p && t ? { port: Number(p[1]), token: t[1] } : null);
      });
    }
  });
}

// Official Riot Games LoL Game Engineering Root CA for local LCU & Live Client APIs (127.0.0.1)
const RIOT_GAMES_ROOT_CA_PEM = [
  '-----BEGIN CERTIFICATE-----',
  'MIIEIDCCAwgCCQDJC+QAdVx4UDANBgkqhkiG9w0BAQUFADCB0TELMAkGA1UEBhMC',
  'VVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFTATBgNVBAcTDFNhbnRhIE1vbmljYTET',
  'MBEGA1UEChMKUmlvdCBHYW1lczEdMBsGA1UECxMUTG9MIEdhbWUgRW5naW5lZXJp',
  'bmcxMzAxBgNVBAMTKkxvTCBHYW1lIEVuZ2luZWVyaW5nIENlcnRpZmljYXRlIEF1',
  'dGhvcml0eTEtMCsGCSqGSIb3DQEJARYeZ2FtZXRlY2hub2xvZ2llc0ByaW90Z2Ft',
  'ZXMuY29tMB4XDTEzMTIwNDAwNDgzOVoXDTQzMTEyNzAwNDgzOVowgdExCzAJBgNV',
  'BAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRUwEwYDVQQHEwxTYW50YSBNb25p',
  'Y2ExEzARBgNVBAoTClJpb3QgR2FtZXMxHTAbBgNVBAsTFExvTCBHYW1lIEVuZ2lu',
  'ZWVyaW5nMTMwMQYDVQQDEypMb0wgR2FtZSBFbmdpbmVlcmluZyBDZXJ0aWZpY2F0',
  'ZSBBdXRob3JpdHkxLTArBgkqhkiG9w0BCQEWHmdhbWV0ZWNobm9sb2dpZXNAcmlv',
  'dGdhbWVzLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKoJemF/',
  '6PNG3GRJGbjzImTdOo1OJRDI7noRwJgDqkaJFkwv0X8aPUGbZSUzUO23cQcCgpYj',
  '21ygzKu5dtCN2EcQVVpNtyPuM2V4eEGr1woodzALtufL3Nlyh6g5jKKuDIfeUBHv',
  'JNyQf2h3Uha16lnrXmz9o9wsX/jf+jUAljBJqsMeACOpXfuZy+YKUCxSPOZaYTLC',
  'y+0GQfiT431pJHBQlrXAUwzOmaJPQ7M6mLfsnpHibSkxUfMfHROaYCZ/sbWKl3lr',
  'ZA9DbwaKKfS1Iw0ucAeDudyuqb4JntGU/W0aboKA0c3YB02mxAM4oDnqseuKV/CX',
  '8SQAiaXnYotuNXMCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAf3KPmddqEqqC8iLs',
  'lcd0euC4F5+USp9YsrZ3WuOzHqVxTtX3hR1scdlDXNvrsebQZUqwGdZGMS16ln3k',
  'WObw7BbhU89tDNCN7Lt/IjT4MGRYRE+TmRc5EeIXxHkQ78bQqbmAI3GsW+7kJsoO',
  'q3DdeE+M+BUJrhWorsAQCgUyZO166SAtKXKLIcxa+ddC49NvMQPJyzm3V+2b1roP',
  'SvD2WV8gRYUnGmy/N0+u6ANq5EsbhZ548zZc+BI4upsWChTLyxt2RxR7+uGlS1+5',
  'EcGfKZ+g024k/J32XP4hdho7WYAS2xMiV83CfLR/MNi8oSMaVQTdKD8cpgiWJk3L',
  'XWehWA==',
  '-----END CERTIFICATE-----'
].join('\n');

function createRiotLocalHttpsAgent() {
  const https = require('https');
  const tls = require('tls');
  return new https.Agent({
    ca: [...tls.rootCertificates, RIOT_GAMES_ROOT_CA_PEM],
    checkServerIdentity: (targetHost, cert) => {
      if (targetHost !== '127.0.0.1') {
        return new Error('Untrusted local Riot API host');
      }
      if (cert && cert.issuer && cert.issuer.O === 'Riot Games') {
        return undefined;
      }
      return tls.checkServerIdentity(targetHost, cert);
    }
  });
}

function lcuGetJson(port, token, endpoint) {
  const https = require('https');
  const auth = Buffer.from(`riot:${token}`).toString('base64');
  const agent = createRiotLocalHttpsAgent();
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: '127.0.0.1',
        port,
        path: endpoint,
        method: 'GET',
        agent,
        timeout: 1800,
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: 'application/json'
        }
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => { raw += c; });
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error(`LCU HTTP ${res.statusCode}`));
          }
          try { resolve(JSON.parse(raw)); } catch (e) { reject(e); }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('LCU Timeout')); });
    req.end();
  });
}

async function readLolLcuRankedStats() {
  const creds = await discoverLcuCredentials();
  if (!creds) {
    return { ok: false, error: 'League of Legends Client läuft aktuell nicht (keine LCU-Verbindung auf 127.0.0.1 gefunden).' };
  }

  const [rankedData, summonerData, regionData, matchData, gameflowData, champSelectData] = await Promise.all([
    lcuGetJson(creds.port, creds.token, '/lol-ranked/v1/current-ranked-stats').catch(() => null),
    lcuGetJson(creds.port, creds.token, '/lol-summoner/v1/current-summoner').catch(() => null),
    lcuGetJson(creds.port, creds.token, '/riotclient/region-locale').catch(() => null),
    lcuGetJson(creds.port, creds.token, '/lol-match-history/v1/products/lol/current-summoner/matches?begIndex=0&endIndex=6').catch(() => null),
    lcuGetJson(creds.port, creds.token, '/lol-gameflow/v1/session').catch(() => null),
    lcuGetJson(creds.port, creds.token, '/lol-champ-select/v1/session').catch(() => null)
  ]);

  if (!rankedData && !summonerData) {
    return { ok: false, error: 'LoL-Client gefunden, aber Ranked-Daten noch nicht geladen (bitte bis in die Lobby einloggen).' };
  }

  const qMap = rankedData?.queueMap || {};
  let parsed = formatLcuTier(qMap.RANKED_SOLO_5x5);
  let queueLabel = 'Solo/Duo';
  if (!parsed.ranked) {
    const flex = formatLcuTier(qMap.RANKED_FLEX_SR);
    if (flex.ranked) {
      parsed = flex;
      queueLabel = 'Flex';
    } else if (rankedData?.highestRankedEntry) {
      const high = formatLcuTier(rankedData.highestRankedEntry);
      if (high.ranked) parsed = high;
    }
  }

  let riotId = '';
  if (summonerData?.gameName && summonerData?.tagLine) {
    riotId = `${summonerData.gameName}#${summonerData.tagLine}`;
  } else if (summonerData?.displayName) {
    riotId = summonerData.displayName;
  }

  const rawReg = String(regionData?.region || '').toLowerCase();
  const regMap = { euw1: 'euw', eun1: 'eune', na1: 'na', kr: 'kr', br1: 'br', oc1: 'oce', tr1: 'tr', jp1: 'jp' };
  const region = regMap[rawReg] || rawReg || '';

  let lcuRole = '';
  if (champSelectData && Array.isArray(champSelectData.myTeam)) {
    const localCell = champSelectData.myTeam.find((m) => Number(m.cellId) === Number(champSelectData.localPlayerCellId));
    if (localCell?.assignedPosition) lcuRole = normalizeLolPosition(localCell.assignedPosition);
  }
  if (!lcuRole && gameflowData?.gameData) {
    const allTeam = [
      ...(Array.isArray(gameflowData.gameData.teamOne) ? gameflowData.gameData.teamOne : []),
      ...(Array.isArray(gameflowData.gameData.teamTwo) ? gameflowData.gameData.teamTwo : [])
    ];
    const myPuuid = String(summonerData?.puuid || '');
    const mySumId = Number(summonerData?.summonerId || 0);
    const meFlow = allTeam.find((p) => (myPuuid && p.puuid === myPuuid) || (mySumId && Number(p.summonerId) === mySumId));
    if (meFlow?.selectedPosition) lcuRole = normalizeLolPosition(meFlow.selectedPosition);
  }

  const rawGames = Array.isArray(matchData?.games?.games) ? matchData.games.games : [];
  let recentMatches = [];
  if (rawGames.length) {
    const dd = await ensureDdragonLoaded();
    const ver = dd.version || '14.23.1';
    const myPuuid = String(summonerData?.puuid || '');
    const mySumId = Number(summonerData?.summonerId || 0);
    recentMatches = rawGames
      .slice(0, 6)
      .map((g) => {
        const parts = Array.isArray(g?.participants) ? g.participants : [];
        const ids = Array.isArray(g?.participantIdentities) ? g.participantIdentities : [];
        const myIdent = ids.find((pi) => (myPuuid && pi?.player?.puuid === myPuuid) || (mySumId && Number(pi?.player?.summonerId) === mySumId));
        const p = (myIdent ? parts.find((x) => Number(x.participantId) === Number(myIdent.participantId)) : null) || parts[0] || null;
        if (!p) return null;
        const cInfo = dd.champByKey?.[String(p.championId)] || null;
        const champId = cInfo?.id || '';
        return {
          champion: cInfo?.name || `Champ #${p.championId || ''}`,
          championIconUrl: champId ? `https://ddragon.leagueoflegends.com/cdn/${ver}/img/champion/${champId}.png` : '',
          win: Boolean(p.stats?.win),
          kills: Number(p.stats?.kills || 0),
          deaths: Number(p.stats?.deaths || 0),
          assists: Number(p.stats?.assists || 0),
          at: Number(g.gameCreation || Date.now())
        };
      })
      .filter(Boolean);
  }

  return {
    ok: true,
    rank: parsed.rank,
    lp: parsed.lp,
    wins: parsed.wins || 0,
    losses: parsed.losses || 0,
    queueLabel,
    riotId,
    region,
    role: lcuRole,
    recentMatches
  };
}

module.exports = {
  DEFAULT_GAME_ADDONS_CONFIG,
  GAME_ADDONS,
  normalizeGameAddonsConfig,
  sanitizeAddonStats,
  resetAddonStats,
  PRESET_ADDON_IDS,
  parseAgendaItems,
  buildOpggLinks,
  getAddonById,
  matchAddonByGameName,
  resolveActiveAddon,
  buildObsGameStatsPayload,
  handleGameChatCommand,
  buildCs2GsiConfig,
  resolveLolDdragonAssets,
  resolveLolItemList,
  normalizeLolPosition,
  detectLolRole,
  readLolLcuRankedStats,
  createRiotLocalHttpsAgent
};

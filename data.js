/* ─────────────────────────────
   data.js — datasets & helpers
   ───────────────────────────── */

const ACCOUNTS = [
  { account:'Acme Corp',      region:'North America', plan:'Enterprise', mrr:18400, sessions:12840, conv:4.2, health:92, status:'Active' },
  { account:'Brightwave',     region:'Europe',        plan:'Pro',        mrr:6200,  sessions:5310,  conv:3.8, health:85, status:'Active' },
  { account:'DataForge',      region:'APAC',          plan:'Business',   mrr:9100,  sessions:7980,  conv:2.9, health:54, status:'At risk' },
  { account:'Orbis Labs',     region:'North America', plan:'Pro',        mrr:5500,  sessions:4210,  conv:3.1, health:78, status:'Active' },
  { account:'Nuvelo Inc',     region:'Europe',        plan:'Starter',    mrr:1200,  sessions:1840,  conv:1.4, health:66, status:'Active' },
  { account:'Quasar Sys',     region:'APAC',          plan:'Business',   mrr:7800,  sessions:6300,  conv:2.6, health:48, status:'At risk' },
  { account:'Meridian Co',    region:'North America', plan:'Enterprise', mrr:22100, sessions:18700, conv:5.1, health:97, status:'Active' },
  { account:'Pulse Digital',  region:'Europe',        plan:'Pro',        mrr:4900,  sessions:3990,  conv:3.4, health:22, status:'Churned' },
  { account:'SkyStack',       region:'North America', plan:'Starter',    mrr:980,   sessions:1200,  conv:1.1, health:61, status:'Active' },
  { account:'VantaGrid',      region:'APAC',          plan:'Pro',        mrr:5100,  sessions:4440,  conv:2.8, health:73, status:'Active' },
  { account:'Kronos Tech',    region:'Europe',        plan:'Enterprise', mrr:19500, sessions:15200, conv:4.8, health:89, status:'Active' },
  { account:'NexGen AI',      region:'North America', plan:'Business',   mrr:11200, sessions:9800,  conv:3.6, health:81, status:'Active' },
  { account:'Solaris IO',     region:'APAC',          plan:'Pro',        mrr:6800,  sessions:5600,  conv:2.4, health:44, status:'At risk' },
  { account:'BluePeak',       region:'Europe',        plan:'Starter',    mrr:1450,  sessions:2100,  conv:1.8, health:70, status:'Active' },
  { account:'Arctus Labs',    region:'North America', plan:'Enterprise', mrr:24000, sessions:21000, conv:5.5, health:94, status:'Active' },
  { account:'FlowBridge',     region:'APAC',          plan:'Business',   mrr:8400,  sessions:7200,  conv:3.0, health:38, status:'Churned' },
  { account:'Veloxa',         region:'Europe',        plan:'Pro',        mrr:5300,  sessions:4600,  conv:3.3, health:77, status:'Active' },
  { account:'ClearPath',      region:'North America', plan:'Starter',    mrr:750,   sessions:900,   conv:0.9, health:55, status:'Active' },
  { account:'Zephyr Cloud',   region:'APAC',          plan:'Enterprise', mrr:17800, sessions:14500, conv:4.4, health:86, status:'Active' },
  { account:'Luminos',        region:'Europe',        plan:'Business',   mrr:10100, sessions:8700,  conv:3.2, health:68, status:'Active' },
];

const MONTHLY_REVENUE = [142, 158, 175, 168, 192, 210, 198, 225, 240, 218, 258, 276];
const MONTHLY_TREND   = [142, 155, 168, 172, 188, 205, 200, 220, 238, 222, 255, 278];
const MONTHLY_LABELS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const TRAFFIC_SOURCES = { Organic: 41, Direct: 27, Social: 19, Paid: 13 };

const TOP_PRODUCTS = [
  { name: 'Pro Plan',   value: '$892K', pct: 88, color: '#185FA5' },
  { name: 'Business',   value: '$643K', pct: 64, color: '#0F6E56' },
  { name: 'Enterprise', value: '$511K', pct: 51, color: '#534AB7' },
  { name: 'Starter',    value: '$364K', pct: 36, color: '#D85A30' },
];

const TOP_REGIONS = [
  { name: 'North America', value: '44%', pct: 78, color: '#185FA5' },
  { name: 'Europe',        value: '31%', pct: 54, color: '#0F6E56' },
  { name: 'APAC',          value: '17%', pct: 30, color: '#534AB7' },
  { name: 'Other',         value: '8%',  pct: 14, color: '#888780' },
];

const QUARTERLY = {
  labels:  ['Q1 2024','Q2 2024','Q3 2024','Q4 2024'],
  actual:  [475, 570, 663, 752],
  target:  [450, 560, 640, 720],
};

const USER_GROWTH = [3200, 4100, 5400, 4800, 6200, 7100, 6900, 8400, 9200, 8100, 10300, 11800];
const CHURN_DATA  = [2.4, 2.1, 1.9, 2.3, 1.8, 1.6, 2.0, 1.5, 1.3, 1.7, 1.2, 1.0];

const REGION_STACKED = {
  labels: ['Q1','Q2','Q3','Q4'],
  NA:     [208, 249, 291, 329],
  EU:     [147, 176, 205, 233],
  APAC:   [80,  97,  112, 127],
  Other:  [40,  48,  55,  63],
};

const PLAN_DIST = {
  labels: ['Enterprise','Business','Pro','Starter'],
  data:   [38, 27, 24, 11],
};

const WEEKLY_SESSIONS = [18400, 22100, 20300, 24600, 23800, 27200, 25100];
const WEEKLY_LABELS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

/* ── HELPERS ── */
function formatMRR(n) {
  return n >= 1000 ? '$' + (n/1000).toFixed(0) + 'K' : '$' + n;
}
function formatBig(n) {
  if (n >= 1000000) return '$' + (n/1000000).toFixed(2) + 'M';
  if (n >= 1000)    return (n/1000).toFixed(0) + 'K';
  return String(n);
}
function statusBadge(s) {
  if (s === 'Active')  return 'badge badge-active';
  if (s === 'At risk') return 'badge badge-risk';
  return 'badge badge-churned';
}
function healthColor(h) {
  if (h >= 75) return '#1D9E75';
  if (h >= 50) return '#BA7517';
  return '#D85A30';
}

/* ── CSV PARSER ── */
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g,''));
    const obj = {};
    headers.forEach((h, i) => obj[h] = vals[i] || '');
    return obj;
  }).filter(row => row[headers[0]]);
}

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const isPercent = suffix === '%';
  const start = Date.now();
  const duration = 1200;
  function tick() {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    let val = Math.round(target * ease);
    if (prefix === '$') {
      el.textContent = '$' + formatBig(val);
    } else if (isPercent) {
      el.textContent = (val / 100).toFixed(2) + '%';
    } else if (suffix === 's') {
      const m = Math.floor(val / 60);
      const s = val % 60;
      el.textContent = m + 'm ' + s + 's';
    } else {
      el.textContent = prefix + val.toLocaleString() + suffix;
    }
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

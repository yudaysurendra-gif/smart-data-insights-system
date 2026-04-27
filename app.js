/* ─────────────────────────────
   app.js — main application logic
   ───────────────────────────── */

/* ── STATE ── */
let currentPage = 'overview';
let tableData = [...ACCOUNTS];
let sortCol = null;
let sortDir = 1;
let searchQuery = '';
let statusFilter = '';
let planFilter = '';
let regionFilter = '';
let currentPage_table = 1;
const PAGE_SIZE = 10;

/* ── SPLASH ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
      document.getElementById('app').classList.remove('hidden');
      initOverviewPage();
    }, 420);
  }, 1700);
});

/* ── PAGE NAVIGATION ── */
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.page;
    switchPage(page);
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

function switchPage(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');

  if (page === 'overview') initOverviewPage();
  if (page === 'explorer') initExplorer();
  if (page === 'charts')   initChartsPage();
  if (page === 'ai')       initAIPage();
}

/* ── OVERVIEW ── */
function initOverviewPage() {
  // Animate counters
  document.querySelectorAll('.metric-value[data-target]').forEach(el => {
    animateCounter(el);
  });

  // Insight bars
  renderInsightList('topProducts', TOP_PRODUCTS);
  renderInsightList('topRegions', TOP_REGIONS);

  // Charts (slight delay so DOM is ready)
  setTimeout(() => {
    initRevChart();
    initSrcChart();
    initPlanChart();
    initSessChart();
  }, 80);
}

function renderInsightList(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  items.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'insight-row';
    row.innerHTML = `
      <span>${item.name}</span>
      <div class="insight-row-right">
        <div class="insight-bar-bg">
          <div class="insight-bar-fill" id="ibar-${containerId}-${i}" style="width:0%;background:${item.color}"></div>
        </div>
        <span class="insight-val">${item.value}</span>
      </div>`;
    el.appendChild(row);
    // Animate bar
    setTimeout(() => {
      const bar = document.getElementById(`ibar-${containerId}-${i}`);
      if (bar) bar.style.width = item.pct + '%';
    }, 200 + i * 80);
  });
}

/* ── EXPLORER ── */
function initExplorer() {
  tableData = [...ACCOUNTS];
  renderTable();
  setupTableControls();
}

function setupTableControls() {
  const search = document.getElementById('searchInput');
  const statusSel = document.getElementById('filterStatus');
  const planSel = document.getElementById('filterPlanSel');
  const regionSel = document.getElementById('filterRegionSel');

  search?.addEventListener('input', e => { searchQuery = e.target.value.toLowerCase(); renderTable(); });
  statusSel?.addEventListener('change', e => { statusFilter = e.target.value; renderTable(); });
  planSel?.addEventListener('change', e => { planFilter = e.target.value; renderTable(); });
  regionSel?.addEventListener('change', e => { regionFilter = e.target.value; renderTable(); });

  document.getElementById('prevPage')?.addEventListener('click', () => { currentPage_table--; renderTable(); });
  document.getElementById('nextPage')?.addEventListener('click', () => { currentPage_table++; renderTable(); });

  // Sort headers
  document.querySelectorAll('.data-table th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.sort;
      if (sortCol === col) sortDir *= -1;
      else { sortCol = col; sortDir = 1; }
      renderTable();
    });
  });
}

function filteredData() {
  return ACCOUNTS.filter(row => {
    const q = searchQuery;
    if (q && !row.account.toLowerCase().includes(q) && !row.region.toLowerCase().includes(q) && !row.plan.toLowerCase().includes(q)) return false;
    if (statusFilter && row.status !== statusFilter) return false;
    if (planFilter && row.plan !== planFilter) return false;
    if (regionFilter && row.region !== regionFilter) return false;
    return true;
  });
}

function sortedData(data) {
  if (!sortCol) return data;
  return [...data].sort((a, b) => {
    const aVal = a[sortCol], bVal = b[sortCol];
    if (typeof aVal === 'number') return (aVal - bVal) * sortDir;
    return String(aVal).localeCompare(String(bVal)) * sortDir;
  });
}

function renderTable() {
  const data = sortedData(filteredData());
  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  currentPage_table = Math.min(currentPage_table, totalPages);
  const start = (currentPage_table - 1) * PAGE_SIZE;
  const slice = data.slice(start, start + PAGE_SIZE);

  const body = document.getElementById('tableBody');
  if (!body) return;
  body.innerHTML = '';

  if (slice.length === 0) {
    body.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--text3);font-family:var(--mono);font-size:.78rem;">No results found</td></tr>';
  } else {
    slice.forEach((row, i) => {
      const tr = document.createElement('tr');
      tr.style.animationDelay = (i * 0.03) + 's';
      tr.innerHTML = `
        <td style="font-weight:500">${row.account}</td>
        <td style="color:var(--text2)">${row.region}</td>
        <td><span class="badge" style="background:var(--surface3);color:var(--text2)">${row.plan}</span></td>
        <td style="font-family:var(--mono)">${formatMRR(row.mrr)}</td>
        <td style="font-family:var(--mono)">${row.sessions.toLocaleString()}</td>
        <td style="font-family:var(--mono)">${row.conv.toFixed(1)}%</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="health-bar"><div class="health-fill" style="width:${row.health}%;background:${healthColor(row.health)}"></div></div>
            <span style="font-family:var(--mono);font-size:.7rem;color:var(--text2)">${row.health}</span>
          </div>
        </td>
        <td><span class="${statusBadge(row.status)}">${row.status}</span></td>
      `;
      body.appendChild(tr);
    });
  }

  const endIdx = Math.min(start + PAGE_SIZE, total);
  document.getElementById('resultCount').textContent = total + ' result' + (total !== 1 ? 's' : '');
  document.getElementById('paginationInfo').textContent = `Showing ${total > 0 ? start+1 : 0}–${endIdx} of ${total}`;
  document.getElementById('prevPage').disabled = currentPage_table <= 1;
  document.getElementById('nextPage').disabled = currentPage_table >= totalPages;
}

/* ── CHARTS PAGE ── */
function initChartsPage() {
  setTimeout(() => {
    initQtrChart();
    initGrowthChart();
    initChurnChart();
    initRegionChart();
  }, 80);
}

/* ── AI PAGE ── */
function initAIPage() { /* Cards already rendered via HTML */ }

document.getElementById('aiAsk')?.addEventListener('click', runAIQuery);
document.getElementById('aiInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') runAIQuery();
});

function setQuery(q) {
  const input = document.getElementById('aiInput');
  if (input) { input.value = q; input.focus(); }
}

const AI_RESPONSES = {
  default: [
    "Based on your dataset: Revenue is up 14.2% driven primarily by the Pro Plan (+18.4% MoM). North America leads all regions with 44% of total MRR. Conversion rate dipped 0.3% — funnel analysis points to a checkout friction issue introduced in the latest update. Recommendation: audit the payment flow and A/B test the previous checkout UX.",
    "Analyzing your data: The top 3 enterprise accounts (Meridian Co, Acme Corp, Arctus Labs) contribute 38% of total MRR. APAC has the highest churn risk — 3 accounts are below health score 50. Organic traffic is your most efficient acquisition channel at 2.1× ROI over paid ads.",
    "Insight summary: Session duration improved 9.1% this period, correlating with users engaging with new dashboard features. Users who engage with 3+ features have 2.3× longer session times. Churn rate trend is declining (2.4% → 1.0% over 12 months), a strong indicator of improving product-market fit.",
  ],
  growth: "Revenue growth in Q3 was primarily driven by three factors: (1) 22% increase in Enterprise plan upgrades from North America; (2) Improved onboarding completion rate (+14%) reducing early churn; (3) Successful SEO push for product comparison keywords generating 1,800 additional organic leads.",
  churn: "Churn risk analysis: 4 accounts are flagged as 'At risk' — DataForge, Quasar Sys, Solaris IO, and FlowBridge. Common indicators include declining session frequency (-40% vs onboarding week), low feature adoption (< 3 features used), and support ticket volume increase. Recommended action: assign CSM outreach within 48 hours.",
  predict: "Revenue forecast for next month: $298K–$312K (95% confidence interval). Model factors: current MRR trajectory (+7.2% MoM), 2 pending Enterprise renewals ($36K combined), expected 0.8% churn. Key risk: if the APAC at-risk accounts churn, forecast drops to $281K–$294K.",
  compare: "Enterprise vs Pro plan performance: Enterprise accounts have 2.8× higher MRR, 4.6× longer session duration, and 1.8% lower churn rate. However, Pro plan has 3.2× higher volume and contributes 37% of new MRR vs Enterprise at 31%. Pro is your growth engine; Enterprise is your retention anchor.",
};

function runAIQuery() {
  const q = document.getElementById('aiInput')?.value?.trim();
  const respEl = document.getElementById('aiResponse');
  if (!respEl) return;

  respEl.innerHTML = '<div class="ai-typing" style="color:var(--text3);font-family:var(--mono);font-size:.78rem">Analyzing dataset</div>';

  const lower = (q || '').toLowerCase();
  let response;
  if (lower.includes('q3') || lower.includes('growth') || lower.includes('drove')) response = AI_RESPONSES.growth;
  else if (lower.includes('churn') || lower.includes('risk')) response = AI_RESPONSES.churn;
  else if (lower.includes('predict') || lower.includes('forecast') || lower.includes('next')) response = AI_RESPONSES.predict;
  else if (lower.includes('enterprise') || lower.includes('pro') || lower.includes('compare')) response = AI_RESPONSES.compare;
  else response = AI_RESPONSES.default[Math.floor(Math.random() * AI_RESPONSES.default.length)];

  setTimeout(() => {
    respEl.innerHTML = `<div style="line-height:1.75;color:var(--text)">${response}</div>`;
  }, 900 + Math.random() * 600);
}

/* ── THEME TOGGLE ── */
document.getElementById('themeToggle')?.addEventListener('click', () => {
  const isDarkNow = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDarkNow ? '' : 'dark');
  document.getElementById('iconSun').style.display = isDarkNow ? '' : 'none';
  document.getElementById('iconMoon').style.display = isDarkNow ? 'none' : '';
  setTimeout(reinitAllCharts, 50);
  showToast(isDarkNow ? 'Light mode' : 'Dark mode');
});

/* ── CSV IMPORT ── */
document.getElementById('csvInput')?.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const parsed = parseCSV(ev.target.result);
    if (parsed.length > 0) {
      showToast(`Imported ${parsed.length} rows from ${file.name}`);
      document.getElementById('rowCount').textContent = parsed.length;
      switchPage('explorer');
      document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.page === 'explorer');
      });
    } else {
      showToast('Could not parse CSV — check format');
    }
  };
  reader.readAsText(file);
});

/* ── EXPORT ── */
document.getElementById('exportBtn')?.addEventListener('click', () => {
  const headers = ['Account','Region','Plan','MRR','Sessions','Conv Rate','Health','Status'];
  const rows = ACCOUNTS.map(r => [r.account, r.region, r.plan, r.mrr, r.sessions, r.conv + '%', r.health, r.status]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'smart-insights-export.csv';
  a.click(); URL.revokeObjectURL(url);
  showToast('Export downloaded');
});

/* ── REPORT DOWNLOAD ── */
function downloadReport(name) {
  showToast('Preparing ' + name.replace(/-/g,' ') + '…');
  setTimeout(() => showToast('Report ready — download started'), 1200);
}

/* ── SIDEBAR NAVIGATION ── */
document.querySelectorAll('.sidebar-item[data-dataset]').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-item[data-dataset]').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    showToast('Loaded: ' + item.dataset.dataset);
  });
});
document.querySelectorAll('.sidebar-item[data-range]').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-item[data-range]').forEach(i => i.classList.remove('active-range'));
    item.classList.add('active-range');
    showToast('Range: ' + item.dataset.range);
  });
});

/* ── TOAST ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2400);
}

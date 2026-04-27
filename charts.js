/* ───────────────────────────────────
   charts.js — Chart.js initializations
   ─────────────────────────────────── */

let chartsInitialized = {};

function isDark() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function gridColor() { return isDark() ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'; }
function tickColor() { return isDark() ? '#5C5A56' : '#9A9893'; }

function destroyChart(id) {
  const existing = Chart.getChart(id);
  if (existing) existing.destroy();
}

/* ── REVENUE TREND ── */
function initRevChart() {
  destroyChart('revChart');
  new Chart(document.getElementById('revChart'), {
    type: 'bar',
    data: {
      labels: MONTHLY_LABELS,
      datasets: [
        {
          label: 'Revenue ($K)',
          data: MONTHLY_REVENUE,
          backgroundColor: isDark() ? 'rgba(24,95,165,.45)' : 'rgba(24,95,165,.18)',
          borderColor: '#185FA5',
          borderWidth: 1.5,
          borderRadius: 4,
          borderSkipped: 'bottom',
          order: 2,
        },
        {
          type: 'line',
          label: 'Trend',
          data: MONTHLY_TREND,
          borderColor: '#0F6E56',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#0F6E56',
          tension: 0.4,
          fill: false,
          order: 1,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: {
        callbacks: { label: ctx => ' $' + ctx.parsed.y + 'K' }
      }},
      scales: {
        x: { grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 11, family: "'DM Mono'" }, autoSkip: false, maxRotation: 0 } },
        y: { grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 11, family: "'DM Mono'" }, callback: v => '$' + v + 'K' } }
      }
    }
  });
}

/* ── TRAFFIC SOURCES ── */
function initSrcChart() {
  destroyChart('srcChart');
  new Chart(document.getElementById('srcChart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(TRAFFIC_SOURCES),
      datasets: [{
        data: Object.values(TRAFFIC_SOURCES),
        backgroundColor: ['#185FA5','#0F6E56','#534AB7','#D85A30'],
        borderWidth: 0,
        hoverOffset: 5,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '66%',
      plugins: { legend: { display: false }, tooltip: {
        callbacks: { label: ctx => ' ' + ctx.label + ': ' + ctx.parsed + '%' }
      }}
    }
  });
}

/* ── PLAN DISTRIBUTION ── */
function initPlanChart() {
  destroyChart('planChart');
  new Chart(document.getElementById('planChart'), {
    type: 'bar',
    data: {
      labels: PLAN_DIST.labels,
      datasets: [{
        data: PLAN_DIST.data,
        backgroundColor: ['#185FA5','#0F6E56','#534AB7','#D85A30'],
        borderRadius: 4,
        borderSkipped: 'bottom',
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, indexAxis: 'y',
      plugins: { legend: { display: false }, tooltip: {
        callbacks: { label: ctx => ' ' + ctx.parsed.x + '% of accounts' }
      }},
      scales: {
        x: { grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 10, family: "'DM Mono'" }, callback: v => v + '%' } },
        y: { grid: { display: false }, ticks: { color: tickColor(), font: { size: 11, family: "'DM Mono'" } } }
      }
    }
  });
}

/* ── WEEKLY SESSIONS ── */
function initSessChart() {
  destroyChart('sessChart');
  new Chart(document.getElementById('sessChart'), {
    type: 'line',
    data: {
      labels: WEEKLY_LABELS,
      datasets: [{
        data: WEEKLY_SESSIONS,
        borderColor: '#534AB7',
        borderWidth: 2,
        backgroundColor: isDark() ? 'rgba(83,74,183,.15)' : 'rgba(83,74,183,.08)',
        pointRadius: 4,
        pointBackgroundColor: '#534AB7',
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 11, family: "'DM Mono'" } } },
        y: { grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 11, family: "'DM Mono'" }, callback: v => (v/1000).toFixed(0)+'K' } }
      }
    }
  });
}

/* ── QUARTERLY (charts page) ── */
function initQtrChart() {
  destroyChart('qtrChart');
  new Chart(document.getElementById('qtrChart'), {
    type: 'bar',
    data: {
      labels: QUARTERLY.labels,
      datasets: [
        {
          label: 'Actual ($K)',
          data: QUARTERLY.actual,
          backgroundColor: isDark() ? 'rgba(24,95,165,.5)' : 'rgba(24,95,165,.2)',
          borderColor: '#185FA5',
          borderWidth: 1.5,
          borderRadius: 5,
          borderSkipped: 'bottom',
          order: 2,
        },
        {
          type: 'line',
          label: 'Target ($K)',
          data: QUARTERLY.target,
          borderColor: '#D85A30',
          borderWidth: 2,
          borderDash: [5, 3],
          pointRadius: 4,
          pointBackgroundColor: '#D85A30',
          tension: 0,
          fill: false,
          order: 1,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: {
        callbacks: { label: ctx => ' $' + ctx.parsed.y + 'K' }
      }},
      scales: {
        x: { grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 12, family: "'DM Mono'" } } },
        y: { grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 11, family: "'DM Mono'" }, callback: v => '$' + v + 'K' } }
      }
    }
  });
}

/* ── USER GROWTH ── */
function initGrowthChart() {
  destroyChart('growthChart');
  new Chart(document.getElementById('growthChart'), {
    type: 'line',
    data: {
      labels: MONTHLY_LABELS,
      datasets: [{
        label: 'New Users',
        data: USER_GROWTH,
        borderColor: '#0F6E56',
        borderWidth: 2,
        backgroundColor: isDark() ? 'rgba(15,110,86,.15)' : 'rgba(15,110,86,.08)',
        pointRadius: 3,
        pointBackgroundColor: '#0F6E56',
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 10, family: "'DM Mono'" }, autoSkip: false, maxRotation: 0 } },
        y: { grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 10, family: "'DM Mono'" }, callback: v => (v/1000).toFixed(0) + 'K' } }
      }
    }
  });
}

/* ── CHURN RATE ── */
function initChurnChart() {
  destroyChart('churnChart');
  new Chart(document.getElementById('churnChart'), {
    type: 'line',
    data: {
      labels: MONTHLY_LABELS,
      datasets: [{
        label: 'Churn %',
        data: CHURN_DATA,
        borderColor: '#D85A30',
        borderWidth: 2,
        backgroundColor: isDark() ? 'rgba(216,90,48,.15)' : 'rgba(216,90,48,.07)',
        pointRadius: 3,
        pointBackgroundColor: '#D85A30',
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 10, family: "'DM Mono'" }, autoSkip: false, maxRotation: 0 } },
        y: { grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 10, family: "'DM Mono'" }, callback: v => v + '%' } }
      }
    }
  });
}

/* ── REGION STACKED ── */
function initRegionChart() {
  destroyChart('regionChart');
  new Chart(document.getElementById('regionChart'), {
    type: 'bar',
    data: {
      labels: REGION_STACKED.labels,
      datasets: [
        { label: 'North America', data: REGION_STACKED.NA,    backgroundColor: '#185FA5', borderRadius: 0, borderSkipped: false },
        { label: 'Europe',        data: REGION_STACKED.EU,    backgroundColor: '#0F6E56', borderRadius: 0, borderSkipped: false },
        { label: 'APAC',          data: REGION_STACKED.APAC,  backgroundColor: '#534AB7', borderRadius: 0, borderSkipped: false },
        { label: 'Other',         data: REGION_STACKED.Other, backgroundColor: '#888780', borderRadius: 4, borderSkipped: 'bottom' },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ' ' + ctx.dataset.label + ': $' + ctx.parsed.y + 'K' }}
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { color: tickColor(), font: { size: 12, family: "'DM Mono'" } } },
        y: { stacked: true, grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 11, family: "'DM Mono'" }, callback: v => '$' + v + 'K' } }
      }
    }
  });
}

/* ── REINIT ALL ON THEME CHANGE ── */
function reinitAllCharts() {
  const page = document.querySelector('.page.active');
  if (!page) return;
  const id = page.id;
  if (id === 'page-overview') {
    initRevChart(); initSrcChart(); initPlanChart(); initSessChart();
  } else if (id === 'page-charts') {
    initQtrChart(); initGrowthChart(); initChurnChart(); initRegionChart();
  }
}

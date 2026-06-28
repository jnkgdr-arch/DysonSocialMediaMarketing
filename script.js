const chartColors = ['#67e8f9', '#60a5fa', '#a78bfa', '#f0abfc', '#86efac', '#fdba74'];

function formatCompact(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  return String(value);
}

function drawBarChart(canvasId, labels, values, options = {}) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const baseHeight = Number(canvas.getAttribute('height'));
  canvas.width = rect.width * dpr;
  canvas.height = baseHeight * dpr;
  ctx.scale(dpr, dpr);
  const width = rect.width;
  const height = baseHeight;
  const padding = { top: 24, right: 18, bottom: 72, left: 72 };
  const max = Math.max(...values) * 1.16;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  ctx.clearRect(0, 0, width, height);
  ctx.font = '700 12px Inter, sans-serif';
  ctx.strokeStyle = 'rgba(16,24,39,.13)';
  ctx.fillStyle = '#4d5b73';
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + chartHeight - (chartHeight * i / 4);
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(width - padding.right, y); ctx.stroke();
    ctx.fillText(formatCompact(max * i / 4), 10, y + 4);
  }
  const gap = Math.max(12, chartWidth / labels.length * 0.18);
  const barWidth = (chartWidth - gap * (labels.length - 1)) / labels.length;
  values.forEach((value, index) => {
    const x = padding.left + index * (barWidth + gap);
    const barHeight = (value / max) * chartHeight;
    const y = padding.top + chartHeight - barHeight;
    const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
    gradient.addColorStop(0, chartColors[index % chartColors.length]);
    gradient.addColorStop(1, '#2563eb');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, 10);
    ctx.fill();
    ctx.fillStyle = '#101827';
    ctx.textAlign = 'center';
    ctx.fillText(formatCompact(value), x + barWidth / 2, y - 8);
    ctx.save();
    ctx.translate(x + barWidth / 2, height - 44);
    ctx.rotate(options.rotateLabels ? -Math.PI / 5 : 0);
    ctx.fillStyle = '#4d5b73';
    ctx.fillText(labels[index], 0, 0);
    ctx.restore();
  });
}

function drawGroupedChart() {
  const labels = ['TikTok', 'LinkedIn', 'X/Twitter'];
  const series = [
    { name: 'Dyson', values: [67500, 524, 90100], color: '#67e8f9' },
    { name: 'iRobot', values: [70500, 98000, 41200], color: '#a78bfa' },
    { name: 'Bissell', values: [117600, 43000, 19200], color: '#86efac' }
  ];
  const canvas = document.getElementById('competitorChart');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const baseHeight = Number(canvas.getAttribute('height'));
  canvas.width = rect.width * dpr; canvas.height = baseHeight * dpr; ctx.scale(dpr, dpr);
  const width = rect.width; const height = baseHeight;
  const padding = { top: 52, right: 24, bottom: 62, left: 78 };
  const max = 130_000;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  ctx.clearRect(0,0,width,height);
  ctx.font = '700 12px Inter, sans-serif'; ctx.strokeStyle = 'rgba(16,24,39,.13)'; ctx.fillStyle = '#4d5b73';
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + chartHeight - chartHeight * i / 5;
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(width - padding.right, y); ctx.stroke();
    ctx.textAlign = 'right'; ctx.fillText(formatCompact(max * i / 5), padding.left - 10, y + 4);
  }
  const groupGap = 16;
  const groupWidth = (chartWidth - groupGap * (labels.length - 1)) / labels.length;
  const barWidth = groupWidth / series.length - 3;
  labels.forEach((label, labelIndex) => {
    const baseX = padding.left + labelIndex * (groupWidth + groupGap);
    series.forEach((item, seriesIndex) => {
      const value = item.values[labelIndex];
      const barHeight = value / max * chartHeight;
      const x = baseX + seriesIndex * (barWidth + 3);
      const y = padding.top + chartHeight - barHeight;
      ctx.fillStyle = value ? item.color : 'rgba(16,24,39,.08)';
      ctx.beginPath(); ctx.roundRect(x, y, barWidth, Math.max(barHeight, 2), 5); ctx.fill();
      if (value) {
        ctx.fillStyle = '#101827';
        ctx.textAlign = 'center';
        ctx.fillText(formatCompact(value), x + barWidth / 2, y - 7);
      }
    });
    ctx.fillStyle = '#4d5b73';
    ctx.textAlign = 'center';
    ctx.fillText(label, baseX + groupWidth / 2, height - 30);
  });
  series.forEach((item, index) => {
    const x = padding.left + index * 110;
    ctx.fillStyle = item.color; ctx.fillRect(x, 8, 14, 14);
    ctx.fillStyle = '#101827'; ctx.textAlign = 'left'; ctx.fillText(item.name, x + 20, 20);
  });
}

function buildMiniBars(containerId, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = items.map(item => `
    <div>
      <div class="mini-bar-label"><span>${item.label}</span><span>${item.value}</span></div>
      <div class="track"><div class="fill" style="width:${item.width}%"></div></div>
    </div>
  `).join('');
}

function renderCharts() {
  drawBarChart('dysonFollowersChart', ['Facebook', 'Instagram', 'YouTube', 'TikTok'], [3200000, 1000000, 657000, 54800]);
  drawGroupedChart();
  drawBarChart('influencerChart', ['Lori IG', 'Lori TikTok', 'Lori YouTube', 'Vacuum Wars YouTube', 'Vacuum Wars IG', 'Vacuum Wars TikTok'], [499000, 1800000, 524, 301000, 3588, 11300]);
}

document.querySelector('.nav-toggle').addEventListener('click', event => {
  const menu = document.getElementById('nav-links');
  const open = menu.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  document.getElementById('nav-links').classList.remove('open');
  document.querySelector('.nav-toggle').setAttribute('aria-expanded', 'false');
}));

buildMiniBars('b2cBars', [
  { label: 'Age target', value: '35+', width: 70 },
  { label: 'Income', value: 'Middle-upper', width: 84 },
  { label: 'Tech savvy', value: 'High', width: 88 },
  { label: 'Online review behavior', value: 'Preferred', width: 76 }
]);
buildMiniBars('b2bBars', [
  { label: 'Experience', value: '20+ years', width: 86 },
  { label: 'Hotel rating', value: '4/5 star', width: 90 },
  { label: 'Purchase stakeholders', value: '3+', width: 64 },
  { label: 'Reliability focus', value: 'High', width: 88 }
]);

renderCharts();
window.addEventListener('resize', renderCharts);

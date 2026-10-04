import { sourceResults, tomsen, rivals, finalPlacement } from './data.js?v=20261004-1';
import { prepareDrivers, normaliseName, driverColor, presetSelection } from './utils.js?v=20261004-1';

const drivers = prepareDrivers(sourceResults);
const mine = drivers.find(driver => driver.name === tomsen);
const rounds = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
let selected = presetSelection('rivals', drivers, rivals, tomsen);
let preset = 'rivals';
let mode = 'cumulative';
let chart;
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

$('#final-position').replaceChildren(String(finalPlacement.position), Object.assign(document.createElement('span'), { textContent: `/${finalPlacement.field}` }));
$('#my-points').textContent = mine.total;
$('#raw-position').replaceChildren(String(mine.rank), Object.assign(document.createElement('span'), { textContent: `/${drivers.length}` }));
mine.points.forEach((points, index) => {
  const round = document.createElement('div');
  round.className = 'round-bar';
  round.style.setProperty('--height', `${points / Math.max(...mine.points) * 100}%`);
  round.innerHTML = `<span class="round-value">${points}</span><div class="bar-track"><div></div></div><span class="round-label">${rounds[index]}</span>`;
  round.setAttribute('aria-label', `Round ${index + 1}: ${points} points`);
  $('#round-record').append(round);
});

const rowNodes = new Map();
drivers.forEach(driver => {
  const tr = document.createElement('tr');
  if (driver.name === tomsen) { tr.id = 'my-result'; tr.className = 'my-result'; }
  const choice = document.createElement('td');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.setAttribute('aria-label', `Compare ${driver.name}`);
  checkbox.dataset.driverId = driver.id;
  choice.append(checkbox);
  tr.append(choice);
  const rank = document.createElement('td');
  rank.className = 'rank-cell'; rank.textContent = driver.rank;
  tr.append(rank);
  const name = document.createElement('th');
  name.scope = 'row'; name.className = 'driver-col'; name.textContent = driver.name;
  if (driver.name === tomsen) {
    const tag = document.createElement('span'); tag.className = 'me-tag'; tag.textContent = 'me'; name.append(tag);
  }
  tr.append(name);
  [...driver.points, driver.total].forEach((points, index) => {
    const td = document.createElement('td'); td.textContent = points;
    if (points === 0) td.className = 'zero';
    if (index === 7) td.className = 'total-cell';
    tr.append(td);
  });
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) selected.add(driver.id); else selected.delete(driver.id);
    preset = null; renderSelection();
  });
  rowNodes.set(driver.id, tr);
  $('#results-body').append(tr);
});

function filterDrivers() {
  const query = normaliseName($('#driver-search').value);
  let count = 0;
  drivers.forEach(driver => {
    const visible = normaliseName(driver.name).includes(query);
    rowNodes.get(driver.id).hidden = !visible;
    if (visible) count++;
  });
  $('#result-count').textContent = `${count} of ${drivers.length} drivers`;
  $('#no-results').hidden = count > 0;
}

function datasets() {
  const crowded = selected.size > 25;
  return drivers.filter(driver => selected.has(driver.id)).map(driver => ({
    label: driver.name,
    data: mode === 'cumulative' ? driver.cumulative : driver.points,
    borderColor: driverColor(driver.name, document.documentElement.dataset.theme === 'dark'),
    backgroundColor: driverColor(driver.name, document.documentElement.dataset.theme === 'dark'),
    borderWidth: driver.name === tomsen ? 3.5 : crowded ? 1 : 2,
    pointRadius: driver.name === tomsen ? 4 : crowded ? 0 : 3,
    pointHoverRadius: 6,
    pointHitRadius: 8,
    order: driver.name === tomsen ? -1 : 0,
    tension: 0,
    fill: false,
  }));
}

function renderSelection() {
  $$('.presets button').forEach(button => button.setAttribute('aria-pressed', button.dataset.preset === preset));
  $$('.mode-switch button').forEach(button => button.setAttribute('aria-pressed', button.dataset.mode === mode));
  $('#selection-count').textContent = `${selected.size} ${selected.size === 1 ? 'driver' : 'drivers'} on the chart`;
  $('#chart-empty').hidden = selected.size > 0;
  $('#chart-description').textContent = mode === 'cumulative' ? 'Cumulative raw points after each round' : 'Raw points scored in each round';
  $('#season-chart').setAttribute('aria-label', `${mode === 'cumulative' ? 'Cumulative raw points' : 'Raw points per round'} for ${selected.size} selected drivers across seven rounds. Exact values are available in the results table below.`);
  $$('input[data-driver-id]').forEach(input => { input.checked = selected.has(Number(input.dataset.driverId)); });
  $('#chart-legend').replaceChildren();
  drivers.filter(driver => selected.has(driver.id)).forEach(driver => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'legend-item';
    button.style.setProperty('--driver-color', driverColor(driver.name, document.documentElement.dataset.theme === 'dark'));
    button.setAttribute('aria-label', `Remove ${driver.name} from chart`);
    const dot = document.createElement('span'); dot.className = 'legend-dot'; dot.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span'); label.textContent = driver.name;
    const remove = document.createElement('span'); remove.textContent = '×'; remove.className = 'remove'; remove.setAttribute('aria-hidden', 'true');
    button.append(dot, label, remove);
    button.addEventListener('click', () => {
      const siblings = [...button.parentElement.children];
      const focusIndex = siblings.indexOf(button);
      selected.delete(driver.id); preset = null; renderSelection();
      const remaining = [...$('#chart-legend').children];
      (remaining[Math.min(focusIndex, remaining.length - 1)] || $('.presets button')).focus();
    });
    $('#chart-legend').append(button);
  });
  if (chart) {
    chart.data.datasets = datasets();
    chart.options.scales.y.title.text = mode === 'cumulative' ? 'Total points' : 'Round points';
    chart.update('none');
  }
}

$$('[data-preset]').forEach(button => button.addEventListener('click', () => {
  preset = button.dataset.preset; selected = presetSelection(preset, drivers, rivals, tomsen); renderSelection();
}));
$$('[data-mode]').forEach(button => button.addEventListener('click', () => {
  mode = button.dataset.mode; renderSelection();
}));
$('#driver-search').addEventListener('input', filterDrivers);
$('#jump-to-me').addEventListener('click', event => {
  event.preventDefault(); $('#driver-search').value = ''; filterDrivers();
  $('#my-result').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  $('#my-result input').focus({ preventScroll: true });
});

function chartColors() {
  const style = getComputedStyle(document.documentElement);
  return Object.fromEntries(['muted', 'grid', 'ink', 'paper'].map(key => [key, style.getPropertyValue(`--${key}`).trim()]));
}

function updateChartTheme() {
  if (chart) {
    const colors = chartColors();
    chart.options.scales.x.ticks.color = colors.muted;
    chart.options.scales.y.ticks.color = colors.muted;
    chart.options.scales.y.title.color = colors.muted;
    chart.options.scales.y.grid.color = colors.grid;
    Object.assign(chart.options.plugins.tooltip, { backgroundColor: colors.ink, titleColor: colors.paper, bodyColor: colors.paper });
  }
  renderSelection();
}
window.addEventListener('speedwaythemechange', updateChartTheme);

if (window.Chart) {
  chart = new window.Chart($('#season-chart'), {
    type: 'line', data: { labels: rounds, datasets: datasets() },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      interaction: { mode: 'nearest', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: chartColors().ink, titleColor: chartColors().paper, bodyColor: chartColors().paper, padding: 14,
          callbacks: { title: items => `Round ${items[0].label}`, label: item => `${item.dataset.label}: ${item.parsed.y} points` } },
      },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { color: chartColors().muted, font: { size: 12 } } },
        y: { beginAtZero: true, border: { display: false }, grid: { color: chartColors().grid },
          title: { display: true, text: 'Total points', color: chartColors().muted, font: { size: 11 } },
          ticks: { color: chartColors().muted, precision: 0, maxTicksLimit: 7 } },
      },
    },
  });
} else {
  $('#chart-error').hidden = false; $('#season-chart').hidden = true;
}
filterDrivers(); renderSelection();

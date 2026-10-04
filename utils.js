// Pure helpers shared by the page and data-integrity tests.
export function prepareDrivers(source) {
  const drivers = source.map((entry, index) => {
    let running = 0;
    return { ...entry, id: index, total: entry.points.reduce((a, b) => a + b, 0),
      cumulative: entry.points.map(points => (running += points)) };
  }).sort((a, b) => b.total - a.total || a.id - b.id);
  let rank = 0;
  drivers.forEach((driver, index) => {
    if (index === 0 || driver.total !== drivers[index - 1].total) rank = index + 1;
    driver.rank = rank;
  });
  return drivers;
}

export function normaliseName(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function driverColor(name, dark = false) {
  const fixed = { 'Tomas Liutvinas': '#d83b2e', 'Tomas Jurkevičius': '#27688b',
    'Donatas Bieliauskas': '#a6761d', 'Andrius Bareiša': '#77518d', 'Tomas Mikolaitis': '#23786c' };
  const bright = { 'Tomas Liutvinas': '#f06556', 'Tomas Jurkevičius': '#67b4dd',
    'Donatas Bieliauskas': '#dab05b', 'Andrius Bareiša': '#b797d1', 'Tomas Mikolaitis': '#6ac5b0' };
  if (fixed[name]) return dark ? bright[name] : fixed[name];
  let hash = 0;
  for (const character of name) hash = (hash * 31 + character.codePointAt(0)) >>> 0;
  return `hsl(${hash % 360}, 54%, ${dark ? 65 : 42}%)`;
}

export function presetSelection(preset, drivers, rivals, tomsen) {
  switch (preset) {
    case 'rivals': return new Set(drivers.filter(d => rivals.includes(d.name)).map(d => d.id));
    case 'tomsen': return new Set(drivers.filter(d => d.name === tomsen).map(d => d.id));
    case 'top5': return new Set(drivers.slice(0, 5).map(d => d.id));
    case 'top25': return new Set(drivers.slice(0, 25).map(d => d.id));
    case 'all': return new Set(drivers.map(d => d.id));
    case 'clear': return new Set();
    default: throw new Error(`Unknown preset: ${preset}`);
  }
}

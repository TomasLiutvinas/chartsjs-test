// Runs before the stylesheet to apply the saved/system theme without a flash.
(() => {
  const key = 'speedway-theme';
  const system = matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem(key); } catch { /* Storage may be unavailable. */ }
  if (!['light', 'dark'].includes(preference)) preference = null;

  function applyTheme() {
    const theme = preference || (system.matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#131613' : '#f5f3ed';
    const toggle = document.querySelector('#theme-toggle');
    if (toggle) {
      const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
    }
    window.dispatchEvent(new Event('speedwaythemechange'));
  }

  applyTheme();
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    document.querySelector('#theme-toggle').addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch { /* Still toggle for this visit. */ }
      applyTheme();
    });
  });
  system.addEventListener('change', () => { if (!preference) applyTheme(); });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    preference = ['light', 'dark'].includes(event.newValue) ? event.newValue : null;
    applyTheme();
  });
})();

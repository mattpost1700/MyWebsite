/**
 * Matt Post Portfolio - Simple Client Interactions
 * Theme persistence (Dark / Light), Year update, and Automatic Last Updated date.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateFooterYear();
  updateLastModified();
});

function initTheme() {
  const themeBtn = document.getElementById('theme-btn');
  const themeIcon = document.getElementById('theme-icon');

  const currentTheme = localStorage.getItem('mp_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(themeIcon, currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('mp_theme', newTheme);
      updateThemeIcon(themeIcon, newTheme);
    });
  }
}

function updateThemeIcon(iconElement, theme) {
  if (!iconElement) return;
  if (theme === 'light') {
    // Show moon icon to switch to dark
    iconElement.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>`;
    iconElement.setAttribute('title', 'Switch to dark theme');
  } else {
    // Show sun icon to switch to light
    iconElement.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>`;
    iconElement.setAttribute('title', 'Switch to light theme');
  }
}

function updateFooterYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Automatically fetch the last updated / commit date from GitHub API.
 * Falls back to document.lastModified if offline or local.
 */
function updateLastModified() {
  const lastUpdatedEl = document.getElementById('last-updated');
  if (!lastUpdatedEl) return;

  fetch('https://api.github.com/repos/mattpost1700/MyWebsite/commits?per_page=1')
    .then(response => {
      if (!response.ok) throw new Error('GitHub API unavailable');
      return response.json();
    })
    .then(commits => {
      if (commits && commits.length > 0 && commits[0].commit && commits[0].commit.committer) {
        const commitDate = new Date(commits[0].commit.committer.date);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        lastUpdatedEl.textContent = commitDate.toLocaleDateString('en-US', options);
      }
    })
    .catch(() => {
      // Local fallback
      if (document.lastModified) {
        try {
          const modDate = new Date(document.lastModified);
          if (!isNaN(modDate.getTime())) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            lastUpdatedEl.textContent = modDate.toLocaleDateString('en-US', options);
          }
        } catch (e) {}
      }
    });
}

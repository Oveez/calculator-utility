export function initThemeToggle(): void {
  const storageKey = 'calculator-theme';
  const root = document.documentElement;
  const legacyToggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  const themeButtons = document.querySelectorAll<HTMLButtonElement>('[data-set-theme]');

  const applyTheme = (theme: 'light' | 'dark'): void => {
    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', theme === 'dark');

    if (legacyToggle) {
      legacyToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    themeButtons.forEach((btn) => {
      const btnTheme = btn.getAttribute('data-set-theme');
      const isActive = btnTheme === theme;
      btn.setAttribute('aria-checked', String(isActive));
      if (isActive) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  try {
    const savedTheme = localStorage.getItem(storageKey) as 'light' | 'dark' | null;
    const preferredTheme =
      savedTheme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(preferredTheme);
  } catch {
    applyTheme('light');
  }

  // Handle segmented dual buttons (Light & Dark)
  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTheme = btn.getAttribute('data-set-theme') as 'light' | 'dark';
      if (targetTheme) {
        try {
          localStorage.setItem(storageKey, targetTheme);
        } catch {}
        applyTheme(targetTheme);
      }
    });
  });

  // Legacy single toggle button support
  legacyToggle?.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch {}
    applyTheme(nextTheme as 'light' | 'dark');
  });
}
export function initThemeToggle(): void {
  const storageKey = 'calculator-theme';
  const root = document.documentElement;
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');

  const applyTheme = (theme: 'light' | 'dark'): void => {
    root.setAttribute('data-theme', theme);
    if (button) {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  };

  try {
    const savedTheme = localStorage.getItem(storageKey) as 'light' | 'dark' | null;
    const preferredTheme =
      savedTheme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(preferredTheme);
  } catch {
    applyTheme('light');
  }

  button?.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch {}
    applyTheme(nextTheme as 'light' | 'dark');
  });
}
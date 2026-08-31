export function initThemeToggle(): void {
	const storageKey = 'calculator-theme';
	const root = document.documentElement;
	const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
	const icon = document.querySelector<HTMLElement>('[data-theme-icon]');

	const applyTheme = (theme: 'light' | 'dark'): void => {
		root.setAttribute('data-theme', theme);

		if (button) {
			button.setAttribute('aria-pressed', String(theme === 'dark'));
		}

		if (icon) {
			icon.textContent = theme === 'dark' ? '◑' : '◐';
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
		localStorage.setItem(storageKey, nextTheme);
		applyTheme(nextTheme as 'light' | 'dark');
	});
}
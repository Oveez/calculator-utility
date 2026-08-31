import { calculators } from '../data/calculators';

function parseInputValue(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): number | string {
	if (input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement || input.type === 'text' || input.type === 'date' || input.type === 'datetime-local') {
		return input.value;
	}
	return Number.parseFloat(input.value || '0');
}

function collectValues(form: HTMLFormElement): Record<string, number | string> {
	return Array.from(form.elements).reduce<Record<string, number | string>>((values, element) => {
		if (
			!(
				element instanceof HTMLInputElement ||
				element instanceof HTMLSelectElement ||
				element instanceof HTMLTextAreaElement
			) ||
			!element.name
		) {
			return values;
		}

		values[element.name] = parseInputValue(element);
		return values;
	}, {});
}

function setupRoot(root: HTMLElement): void {
	const slug = root.dataset.calculatorSlug;
	const form = root.querySelector<HTMLFormElement>('[data-calculator-form]');
	const result = root.querySelector<HTMLOutputElement>('[data-calculator-result]');
	const summary = root.querySelector<HTMLElement>('[data-calculator-summary]');
	const copyBtn = root.querySelector<HTMLButtonElement>('[data-copy-result]');
	const resetBtn = root.querySelector<HTMLButtonElement>('[data-calculator-reset]');

	if (!slug || !form || !result) {
		return;
	}

	const calculator = calculators.find((entry) => entry.slug === slug);
	if (!calculator) {
		return;
	}

	const updateResult = (): string => {
		const values = collectValues(form);
		const nextValue = calculator.formula(values);
		const nextResult = calculator.resultFormat(nextValue);
		result.textContent = nextResult;
		if (summary) {
			summary.textContent = nextResult;
		}

		// Update range slider value displays if present
		form.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach((rangeInput) => {
			const badge = root.querySelector<HTMLElement>(`[data-range-val="${rangeInput.name}"]`);
			if (badge) {
				badge.textContent = rangeInput.value;
			}
		});

		return nextResult;
	};

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		updateResult();
	});

	form.addEventListener('input', () => {
		updateResult();
	});

	form.addEventListener('change', () => {
		updateResult();
	});

	if (resetBtn) {
		resetBtn.addEventListener('click', () => {
			form.reset();
			setTimeout(() => {
				updateResult();
			}, 10);
		});
	}

	if (copyBtn) {
		copyBtn.addEventListener('click', async () => {
			const textToCopy = result.textContent?.trim() || '';
			if (!textToCopy) return;

			try {
				await navigator.clipboard.writeText(textToCopy);
				const copyTextSpan = copyBtn.querySelector<HTMLElement>('[data-copy-text]');
				const copyIconSpan = copyBtn.querySelector<HTMLElement>('[data-copy-icon]');
				const originalText = copyTextSpan?.textContent || 'Copy';

				if (copyTextSpan) copyTextSpan.textContent = 'Copied!';
				if (copyIconSpan) copyIconSpan.textContent = '✓';
				copyBtn.classList.add('border-emerald-500', 'text-emerald-600', 'dark:text-emerald-400');

				setTimeout(() => {
					if (copyTextSpan) copyTextSpan.textContent = originalText;
					if (copyIconSpan) copyIconSpan.textContent = '📋';
					copyBtn.classList.remove('border-emerald-500', 'text-emerald-600', 'dark:text-emerald-400');
				}, 2000);
			} catch {
				// Fallback if clipboard API is not available
			}
		});
	}

	updateResult();
}

export function initCalculatorEngines(): void {
	document.querySelectorAll<HTMLElement>('[data-calculator-root]').forEach(setupRoot);
}
import { calculators } from '../data/calculators';
import type { CalculatorDetailedResult } from '../types/calculator';

function parseInputValue(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): number | string {
	if (
		input instanceof HTMLSelectElement ||
		input instanceof HTMLTextAreaElement ||
		input.type === 'text' ||
		input.type === 'date' ||
		input.type === 'datetime-local'
	) {
		return input.value;
	}
	const raw = input.value?.trim();
	if (!raw || raw === '') {
		return 0;
	}
	const val = Number.parseFloat(raw);
	return Number.isNaN(val) ? 0 : val;
}

function collectValues(form: HTMLFormElement): Record<string, number | string> {
	return Array.from(form.elements).reduce<Record<string, number | string>>((values, element) => {
		if (
			!(
				element instanceof HTMLInputElement ||
				element instanceof HTMLSelectElement ||
				element instanceof HTMLTextAreaElement
			) ||
			!element.name ||
			element.disabled
		) {
			return values;
		}

		values[element.name] = parseInputValue(element);
		return values;
	}, {});
}

function updateConditionalInputs(form: HTMLFormElement): void {
	const wrappers = form.querySelectorAll<HTMLElement>('[data-show-when-field]');
	if (wrappers.length === 0) return;

	const allValues: Record<string, string> = {};
	Array.from(form.elements).forEach((el) => {
		if (
			(el instanceof HTMLInputElement ||
				el instanceof HTMLSelectElement ||
				el instanceof HTMLTextAreaElement) &&
			el.name
		) {
			allValues[el.name] = String(el.value ?? '');
		}
	});

	wrappers.forEach((wrapper) => {
		const field = wrapper.getAttribute('data-show-when-field');
		const expectedVal = wrapper.getAttribute('data-show-when-value');
		if (!field || !expectedVal) return;

		const currentVal = allValues[field] ?? '';
		const expectedList = expectedVal.split(',').map((s) => s.trim());
		const shouldShow = expectedList.includes(currentVal);

		if (shouldShow) {
			wrapper.style.display = '';
			wrapper
				.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
					'input, select, textarea',
				)
				.forEach((input) => {
					input.disabled = false;
				});
		} else {
			wrapper.style.display = 'none';
			wrapper
				.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
					'input, select, textarea',
				)
				.forEach((input) => {
					input.disabled = true;
				});
		}
	});
}

// Render dynamic SVG chart
function updateChartSvg(chartRoot: HTMLElement, chartConfig: any): void {
	const svg = chartRoot.querySelector<SVGElement>('[data-chart-svg]');
	const titleEl = chartRoot.querySelector<HTMLElement>('[data-chart-title]');
	const badgeEl = chartRoot.querySelector<HTMLElement>('[data-chart-type-badge]');
	const summaryEl = chartRoot.querySelector<HTMLElement>('[data-chart-summary]');
	const legendContainer = chartRoot.querySelector<HTMLElement>('[data-chart-legend-items]');

	if (!svg || !chartConfig) return;

	if (titleEl && chartConfig.title) titleEl.textContent = chartConfig.title;
	if (badgeEl && chartConfig.type) badgeEl.textContent = chartConfig.type.toUpperCase();
	if (summaryEl && chartConfig.summaryText) summaryEl.textContent = chartConfig.summaryText;

	const elementsGroup = svg.querySelector<SVGGElement>('[data-chart-elements]');
	if (!elementsGroup) return;

	const defaultColors = ['#4f46e5', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];

	if (chartConfig.type === 'donut' || chartConfig.type === 'pie') {
		const total = chartConfig.datasets[0]?.data.reduce((sum: number, val: number) => sum + Math.max(val, 0), 0) || 1;
		const cx = 200;
		const cy = 110;
		const radius = 65;
		const circumference = 2 * Math.PI * radius;
		let accumulatedAngle = 0;

		let paths = '';
		chartConfig.datasets[0]?.data.forEach((value: number, idx: number) => {
			const safeVal = Math.max(value, 0);
			const percent = safeVal / total;
			const strokeDash = `${percent * circumference} ${circumference}`;
			const strokeOffset = -accumulatedAngle * circumference;
			accumulatedAngle += percent;
			const color = chartConfig.datasets[0]?.color?.[idx] || defaultColors[idx % defaultColors.length];

			paths += `
				<circle cx="${cx}" cy="${cy}" r="${radius}"
					fill="transparent"
					stroke="${color}"
					stroke-width="26"
					stroke-dasharray="${strokeDash}"
					stroke-dashoffset="${strokeOffset}"
					transform="rotate(-90 ${cx} ${cy})"
					class="transition-all duration-300"
				/>
			`;
		});

		// Inner total label
		paths += `
			<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="currentColor" class="fill-[color:var(--fg)]">
				100%
			</text>
		`;

		elementsGroup.innerHTML = paths;
	} else if (chartConfig.type === 'bar') {
		const data = chartConfig.datasets[0]?.data || [];
		const max = Math.max(...data, 1);
		const barWidth = Math.min(300 / Math.max(data.length, 1), 50);
		const startX = 60;
		const baseHeight = 150;

		let bars = `
			<line x1="40" y1="${baseHeight}" x2="360" y2="${baseHeight}" stroke="currentColor" class="stroke-[color:var(--border)]" stroke-width="1.5" />
		`;

		data.forEach((val: number, idx: number) => {
			const height = (val / max) * 110;
			const x = startX + idx * (barWidth + 15);
			const y = baseHeight - height;
			const color = defaultColors[idx % defaultColors.length];
			const label = chartConfig.labels[idx] || '';

			bars += `
				<rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="${color}" rx="4" class="transition-all duration-300" />
				<text x="${x + barWidth / 2}" y="${baseHeight + 16}" text-anchor="middle" font-size="10" fill="currentColor" class="fill-[color:var(--muted)]">
					${label}
				</text>
			`;
		});

		elementsGroup.innerHTML = bars;
	}

	// Update legend
	if (legendContainer && chartConfig.labels) {
		legendContainer.innerHTML = chartConfig.labels
			.map((label: string, idx: number) => {
				const color = defaultColors[idx % defaultColors.length];
				return `
					<div class="flex items-center gap-1.5">
						<span class="h-2.5 w-2.5 rounded-full" style="background-color: ${color}"></span>
						<span class="font-medium text-[color:var(--fg)]">${label}</span>
					</div>
				`;
			})
			.join('');
	}
}

// Update schedule table
function updateScheduleTable(tableRoot: HTMLElement, tableConfig: any): void {
	const tableBody = tableRoot.querySelector<HTMLTableSectionElement>('[data-table-body]');
	const headerRow = tableRoot.querySelector<HTMLTableRowElement>('[data-table-header-row]');
	const titleEl = tableRoot.querySelector<HTMLElement>('[data-table-title]');

	if (!tableBody || !tableConfig) return;

	if (titleEl && tableConfig.title) titleEl.textContent = tableConfig.title;

	if (headerRow && tableConfig.headers) {
		headerRow.innerHTML = tableConfig.headers
			.map((h: string) => `<th scope="col" class="px-4 py-3 whitespace-nowrap">${h}</th>`)
			.join('');
	}

	if (tableConfig.rows) {
		const initialRows = tableConfig.rows.slice(0, tableConfig.maxInitialRows ?? 10);
		tableBody.innerHTML = initialRows
			.map(
				(row: Array<string | number>) => `
				<tr class="transition-colors hover:bg-[color:var(--surface)]/60">
					${row.map((cell) => `<td class="px-4 py-2.5 whitespace-nowrap">${cell}</td>`).join('')}
				</tr>
			`,
			)
			.join('');
	}
}

function setupRoot(root: HTMLElement): void {
	const slug = root.dataset.calculatorSlug;
	const form = root.querySelector<HTMLFormElement>('[data-calculator-form]');
	const result = root.querySelector<HTMLOutputElement>('[data-calculator-result]');
	const resultBox = root.querySelector<HTMLElement>('[data-result-box]');
	const summary = root.querySelector<HTMLElement>('[data-calculator-summary]');
	const copyBtn = root.querySelector<HTMLButtonElement>('[data-copy-result]');
	const resetBtn = root.querySelector<HTMLButtonElement>('[data-calculator-reset]');

	// Extended UI references
	const secondaryContainer = root.querySelector<HTMLElement>('[data-secondary-results-container]');
	const secondaryGrid = root.querySelector<HTMLElement>('[data-secondary-results-grid]');
	const breakdownContainer = root.querySelector<HTMLElement>('[data-breakdown-container]');
	const breakdownBar = root.querySelector<HTMLElement>('[data-breakdown-bar]');
	const breakdownLegend = root.querySelector<HTMLElement>('[data-breakdown-legend]');
	const warningsContainer = root.querySelector<HTMLElement>('[data-warnings-container]');
	const warningsList = root.querySelector<HTMLElement>('[data-warnings-list]');

	if (!slug || !form || !result) {
		return;
	}

	const calculator = calculators.find((entry) => entry.slug === slug);
	if (!calculator) {
		return;
	}

	const toggleBtns = form.querySelectorAll<HTMLButtonElement>('[data-unit-toggle-btn]');
	toggleBtns.forEach((btn) => {
		btn.addEventListener('click', () => {
			const targetVal = btn.dataset.unitToggleBtn;
			const targetSelectId = btn.dataset.targetSelect;
			if (!targetVal || !targetSelectId) return;

			const targetSelect = form.querySelector<HTMLSelectElement>(`#${targetSelectId}`);
			if (!targetSelect) return;

			if (targetSelect.value !== targetVal) {
				targetSelect.value = targetVal;
				targetSelect.dispatchEvent(new Event('change', { bubbles: true }));
			}
		});
	});

	const updateToggleBtnStyles = (): void => {
		toggleBtns.forEach((btn) => {
			const targetVal = btn.dataset.unitToggleBtn;
			const targetSelectId = btn.dataset.targetSelect;
			if (!targetVal || !targetSelectId) return;
			const targetSelect = form.querySelector<HTMLSelectElement>(`#${targetSelectId}`);
			if (!targetSelect) return;

			const isActive = targetSelect.value === targetVal;
			btn.setAttribute('aria-selected', String(isActive));
			if (isActive) {
				btn.classList.add('bg-[color:var(--accent)]', 'text-white', 'shadow-sm', 'font-black');
				btn.classList.remove('text-[color:var(--muted)]', 'hover:bg-[color:var(--surface-strong)]', 'font-semibold');
			} else {
				btn.classList.remove('bg-[color:var(--accent)]', 'text-white', 'shadow-sm', 'font-black');
				btn.classList.add('text-[color:var(--muted)]', 'hover:bg-[color:var(--surface-strong)]', 'font-semibold');
			}
		});
	};

	const unitSystemSelect = form.querySelector<HTMLSelectElement>('select[name="unitSystem"]');
	if (unitSystemSelect && slug === 'bmi-calculator') {
		let previousUnit = unitSystemSelect.value;
		unitSystemSelect.addEventListener('change', () => {
			const newUnit = unitSystemSelect.value;
			if (newUnit === previousUnit) return;

			const heightFeetInput = form.querySelector<HTMLInputElement>('input[name="heightFeet"]');
			const heightInchesInput = form.querySelector<HTMLInputElement>('input[name="heightInches"]');
			const weightLbsInput = form.querySelector<HTMLInputElement>('input[name="weightLbs"]');
			const heightCmInput = form.querySelector<HTMLInputElement>('input[name="heightCm"]');
			const weightKgInput = form.querySelector<HTMLInputElement>('input[name="weightKg"]');

			if (newUnit === 'metric' && previousUnit === 'us') {
				const ft = Number.parseFloat(heightFeetInput?.value || '') || 0;
				const inches = Number.parseFloat(heightInchesInput?.value || '') || 0;
				const lbs = Number.parseFloat(weightLbsInput?.value || '') || 0;

				const totalInches = (ft * 12) + inches;
				if (totalInches > 0 && heightCmInput) {
					heightCmInput.value = String(Math.round(totalInches * 2.54));
				}
				if (lbs > 0 && weightKgInput) {
					weightKgInput.value = String(Math.round(lbs * 0.45359237 * 10) / 10);
				}
			} else if (newUnit === 'us' && previousUnit === 'metric') {
				const cm = Number.parseFloat(heightCmInput?.value || '') || 0;
				const kg = Number.parseFloat(weightKgInput?.value || '') || 0;

				if (cm > 0) {
					const totalInches = cm / 2.54;
					const ft = Math.floor(totalInches / 12);
					const inches = Math.round((totalInches % 12) * 10) / 10;
					if (heightFeetInput) heightFeetInput.value = String(ft);
					if (heightInchesInput) heightInchesInput.value = String(inches);
				}
				if (kg > 0 && weightLbsInput) {
					weightLbsInput.value = String(Math.round((kg / 0.45359237) * 10) / 10);
				}
			}

			previousUnit = newUnit;
			updateConditionalInputs(form);
			updateToggleBtnStyles();
		});
	}

	const updateResult = (): string => {
		updateConditionalInputs(form);
		updateToggleBtnStyles();

		const values = collectValues(form);
		let formulaOutput: any;

		try {
			formulaOutput = calculator.formula(values);
		} catch (err) {
			result.textContent = 'Calculation error';
			return 'Calculation error';
		}

		let nextResultString = '';

		// Check if structured detailed result
		if (formulaOutput && typeof formulaOutput === 'object' && 'primary' in formulaOutput) {
			const detailed = formulaOutput as CalculatorDetailedResult;
			nextResultString = detailed.primary.formattedValue || String(detailed.primary.value);
			result.textContent = nextResultString;

			// Secondary results
			if (secondaryContainer && secondaryGrid && detailed.secondary && detailed.secondary.length > 0) {
				secondaryContainer.classList.remove('hidden');
				secondaryGrid.innerHTML = detailed.secondary
					.map(
						(sec) => `
					<div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg)] p-3 shadow-2xs">
						<p class="text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]">${sec.label}</p>
						<p class="mt-1 text-base font-bold text-[color:var(--fg)]">${sec.formattedValue ?? sec.value}</p>
						${sec.badge ? `<span class="mt-1 inline-block rounded bg-[color:var(--surface)] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--accent)] border border-[color:var(--border)]">${sec.badge}</span>` : ''}
					</div>
				`,
					)
					.join('');
			} else if (secondaryContainer) {
				secondaryContainer.classList.add('hidden');
			}

			// Breakdown bar
			if (breakdownContainer && breakdownBar && breakdownLegend && detailed.breakdown && detailed.breakdown.length > 0) {
				breakdownContainer.classList.remove('hidden');
				const total = detailed.breakdown.reduce((sum, item) => sum + (item.value || 0), 0) || 1;
				const defaultColors = ['bg-blue-500', 'bg-cyan-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500'];

				breakdownBar.innerHTML = detailed.breakdown
					.map((item, idx) => {
						const pct = Math.max(((item.value || 0) / total) * 100, 0);
						const colorClass = defaultColors[idx % defaultColors.length];
						return `<div class="${colorClass} h-full transition-all duration-300" style="width: ${pct}%" title="${item.label}: ${item.formattedValue}"></div>`;
					})
					.join('');

				breakdownLegend.innerHTML = detailed.breakdown
					.map((item, idx) => {
						const colorClass = defaultColors[idx % defaultColors.length];
						return `
						<div class="flex items-center gap-1.5 text-[11px]">
							<span class="h-2 w-2 rounded-full ${colorClass}"></span>
							<span class="text-[color:var(--muted)]">${item.label}:</span>
							<span class="font-bold text-[color:var(--fg)]">${item.formattedValue}</span>
						</div>
					`;
					})
					.join('');
			} else if (breakdownContainer) {
				breakdownContainer.classList.add('hidden');
			}

			// Warnings & Insights
			if (warningsContainer && warningsList && detailed.warnings && detailed.warnings.length > 0) {
				warningsContainer.classList.remove('hidden');
				warningsList.innerHTML = detailed.warnings.map((w) => `<p>${w}</p>`).join('');
			} else if (warningsContainer) {
				warningsContainer.classList.add('hidden');
			}

			// Chart integration
			const chartRoot = document.querySelector<HTMLElement>('[data-calculator-chart-root]');
			if (chartRoot && detailed.chart) {
				updateChartSvg(chartRoot, detailed.chart);
			}

			// Table integration
			const tableRoot = document.querySelector<HTMLElement>('[data-calculator-table-root]');
			if (tableRoot && detailed.table) {
				updateScheduleTable(tableRoot, detailed.table);
			}
		} else {
			// Primitive result
			nextResultString = calculator.resultFormat(formulaOutput);
			result.textContent = nextResultString;

			if (secondaryContainer) secondaryContainer.classList.add('hidden');
			if (breakdownContainer) breakdownContainer.classList.add('hidden');
			if (warningsContainer) warningsContainer.classList.add('hidden');
		}

		if (summary) {
			summary.textContent = nextResultString;
		}

		if (resultBox) {
			resultBox.classList.remove('calc-result-updated');
			void resultBox.offsetWidth;
			resultBox.classList.add('calc-result-updated');
		}

		// Update range slider live badges
		form.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach((rangeInput) => {
			const badge = root.querySelector<HTMLElement>(`[data-range-val="${rangeInput.name}"]`);
			if (badge) {
				badge.textContent = rangeInput.value;
			}
		});

		return nextResultString;
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
				const originalText = copyTextSpan?.textContent || 'Copy';

				if (copyTextSpan) copyTextSpan.textContent = 'Copied!';
				copyBtn.classList.add('border-[color:var(--accent)]', 'text-[color:var(--accent)]', 'shadow-[0_0_12px_var(--accent-glow)]');

				setTimeout(() => {
					if (copyTextSpan) copyTextSpan.textContent = originalText;
					copyBtn.classList.remove('border-[color:var(--accent)]', 'text-[color:var(--accent)]', 'shadow-[0_0_12px_var(--accent-glow)]');
				}, 2000);
			} catch {
				// Clipboard fallback
			}
		});
	}

	updateResult();
}

export function initCalculatorEngines(): void {
	document.querySelectorAll<HTMLElement>('[data-calculator-root]').forEach(setupRoot);
}
import { getInputVariantClasses } from '@core/ui/variants/input';
import type { StandardSize } from '@src-types/ui/base';

export interface GetCurrencyInputClassesOptions {
	size: StandardSize;
	hasError: boolean;
	hasCurrencySymbol: boolean;
	className?: string | undefined;
}

export function getCurrencyInputClasses(options: GetCurrencyInputClassesOptions): string {
	return getInputVariantClasses({
		size: options.size,
		state: options.hasError ? 'error' : 'normal',
		hasLeftIcon: options.hasCurrencySymbol,
		hasRightIcon: false,
		className: options.className,
	});
}

export function getAriaDescribedBy(
	inputId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${inputId}-error`);
	if (helperText) ids.push(`${inputId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generateCurrencyInputId(
	generatedId: string,
	inputId?: string,
	label?: string
): string | undefined {
	if (inputId) {
		return inputId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `currency-input-${cleanId}`;
}

/**
 * Formats a number as currency string
 *
 * @param value - The numeric value to format
 * @param currency - Currency code (e.g., 'USD', 'EUR')
 * @param locale - Locale string (e.g., 'en-US', 'en-GB')
 * @returns Formatted currency string
 */
export function formatCurrency(
	value: number | string | undefined,
	currency: string,
	locale = 'en-US'
): string {
	if (value === undefined || value === '' || (typeof value === 'string' && value === '')) {
		return '';
	}
	const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
	if (Number.isNaN(numValue)) {
		return '';
	}
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(numValue);
}

/**
 * Parses a currency string to a number
 *
 * @param value - The currency string to parse
 * @returns Parsed number or undefined
 */
export function parseCurrency(value: string): number | undefined {
	if (!value) {
		return undefined;
	}
	// Remove currency symbols and formatting
	const cleaned = value.replaceAll(/[^\d.-]/g, '');
	const parsed = Number.parseFloat(cleaned);
	return Number.isNaN(parsed) ? undefined : parsed;
}

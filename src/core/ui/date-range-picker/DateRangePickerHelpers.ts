import { getInputVariantClasses } from '@core/ui/variants/input';
import type { StandardSize } from '@src-types/ui/base';

export interface GetDateRangePickerClassesOptions {
	size: StandardSize;
	className?: string | undefined;
}

export function getDateRangePickerClasses(options: GetDateRangePickerClassesOptions): string {
	return getInputVariantClasses({
		size: options.size,
		className: options.className,
	});
}

export function getAriaDescribedBy(
	dateRangePickerId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${dateRangePickerId}-error`);
	if (helperText) ids.push(`${dateRangePickerId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generateDateRangePickerId(
	generatedId: string,
	dateRangePickerId?: string,
	label?: string
): string | undefined {
	if (dateRangePickerId) {
		return dateRangePickerId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `daterangepicker-${cleanId}`;
}

export function generateStartDatePickerId(baseId: string | undefined): string | undefined {
	return baseId ? `${baseId}-start` : undefined;
}

export function generateEndDatePickerId(baseId: string | undefined): string | undefined {
	return baseId ? `${baseId}-end` : undefined;
}

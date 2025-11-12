import { getInputVariantClasses } from '@core/ui/variants/input';
import type { StandardSize } from '@src-types/ui/base';

export interface GetTimePickerClassesOptions {
	size: StandardSize;
	className?: string | undefined;
}

export function getTimePickerClasses(options: GetTimePickerClassesOptions): string {
	return getInputVariantClasses({
		size: options.size,
		className: options.className,
	});
}

export function getAriaDescribedBy(
	timePickerId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${timePickerId}-error`);
	if (helperText) ids.push(`${timePickerId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generateTimePickerId(
	generatedId: string,
	timePickerId?: string,
	label?: string
): string | undefined {
	if (timePickerId) {
		return timePickerId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `timepicker-${cleanId}`;
}

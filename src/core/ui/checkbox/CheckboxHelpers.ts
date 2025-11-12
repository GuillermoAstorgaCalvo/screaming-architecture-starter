import { getCheckboxVariantClasses } from '@core/ui/variants/checkbox';
import type { StandardSize } from '@src-types/ui/base';

export interface GetCheckboxClassesOptions {
	size: StandardSize;
	className?: string | undefined;
}

export function getCheckboxClasses(options: GetCheckboxClassesOptions): string {
	return getCheckboxVariantClasses({
		size: options.size,
		className: options.className,
	});
}

export function getAriaDescribedBy(
	checkboxId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${checkboxId}-error`);
	if (helperText) ids.push(`${checkboxId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generateCheckboxId(
	generatedId: string,
	checkboxId?: string,
	label?: string
): string | undefined {
	if (checkboxId) {
		return checkboxId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `checkbox-${cleanId}`;
}

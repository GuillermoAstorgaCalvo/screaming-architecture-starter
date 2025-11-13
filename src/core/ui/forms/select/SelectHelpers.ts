import { getSelectVariantClasses } from '@core/ui/variants/select';
import type { StandardSize } from '@src-types/ui/base';

export interface GetSelectClassesOptions {
	size: StandardSize;
	hasError: boolean;
	className?: string | undefined;
}

export function getSelectClasses(options: GetSelectClassesOptions): string {
	return getSelectVariantClasses({
		size: options.size,
		state: options.hasError ? 'error' : 'normal',
		className: options.className,
	});
}

export function getAriaDescribedBy(
	selectId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${selectId}-error`);
	if (helperText) ids.push(`${selectId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generateSelectId(
	generatedId: string,
	selectId?: string,
	label?: string
): string | undefined {
	if (selectId) {
		return selectId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `select-${cleanId}`;
}

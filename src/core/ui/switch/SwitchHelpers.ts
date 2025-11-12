import { getSwitchThumbVariantClasses, getSwitchVariantClasses } from '@core/ui/variants/switch';
import type { StandardSize } from '@src-types/ui/base';

export interface GetSwitchClassesOptions {
	size: StandardSize;
	checked: boolean;
	className?: string | undefined;
}

export function getSwitchClasses(options: GetSwitchClassesOptions): string {
	return getSwitchVariantClasses({
		size: options.size,
		checked: options.checked,
		className: options.className,
	});
}

export interface GetSwitchThumbClassesOptions {
	size: StandardSize;
	checked: boolean;
	className?: string | undefined;
}

export function getSwitchThumbClasses(options: GetSwitchThumbClassesOptions): string {
	return getSwitchThumbVariantClasses({
		size: options.size,
		checked: options.checked,
		className: options.className,
	});
}

export function getAriaDescribedBy(
	switchId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${switchId}-error`);
	if (helperText) ids.push(`${switchId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generateSwitchId(
	generatedId: string,
	switchId?: string,
	label?: string
): string | undefined {
	if (switchId) {
		return switchId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `switch-${cleanId}`;
}

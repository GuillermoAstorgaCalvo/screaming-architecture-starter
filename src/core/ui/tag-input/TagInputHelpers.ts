import { getInputVariantClasses } from '@core/ui/variants/input';
import type { StandardSize } from '@src-types/ui/base';

export interface GetTagInputClassesOptions {
	size: StandardSize;
	hasError: boolean;
	className?: string | undefined;
}

export function getTagInputClasses(options: GetTagInputClassesOptions): string {
	return getInputVariantClasses({
		size: options.size,
		state: options.hasError ? 'error' : 'normal',
		hasLeftIcon: false,
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

export function generateTagInputId(
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
	return `taginput-${cleanId}`;
}

/**
 * Validates and normalizes a tag value
 */
export function normalizeTag(tag: string): string {
	return tag.trim();
}

/**
 * Checks if a tag is valid (non-empty after normalization)
 */
export function isValidTag(tag: string): boolean {
	return normalizeTag(tag).length > 0;
}

/**
 * Checks if a tag already exists in the tags array
 */
export function isDuplicateTag(tag: string, existingTags: readonly string[]): boolean {
	const normalized = normalizeTag(tag);
	return existingTags.some(existing => existing.toLowerCase() === normalized.toLowerCase());
}

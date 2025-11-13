import { INPUT_BASE_CLASSES, INPUT_SIZE_CLASSES } from '@core/constants/ui/forms';
import { FORM_ERROR_CLASSES } from '@core/constants/ui/shared';
import { classNames } from '@core/utils/classNames';
import { useId } from 'react';

import type { UseAutocompleteStateOptions, UseAutocompleteStateReturn } from './AutocompleteTypes';

export function generateAutocompleteId(
	generatedId: string,
	autocompleteId?: string,
	label?: string
): string {
	if (autocompleteId) {
		return autocompleteId;
	}
	if (label) {
		return generatedId;
	}
	return generatedId;
}

export function getAriaDescribedBy(
	id: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) {
		ids.push(`${id}-error`);
	}
	if (helperText) {
		ids.push(`${id}-helper`);
	}
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function getAutocompleteClasses({
	size = 'md',
	hasError,
	className,
}: {
	readonly size?: 'sm' | 'md' | 'lg';
	readonly hasError: boolean;
	readonly className?: string | undefined;
}): string {
	return classNames(
		INPUT_BASE_CLASSES,
		INPUT_SIZE_CLASSES[size],
		hasError && FORM_ERROR_CLASSES,
		className
	);
}

export function useAutocompleteState({
	autocompleteId,
	label,
	error,
	helperText,
	size = 'md',
	className,
}: Readonly<UseAutocompleteStateOptions>): UseAutocompleteStateReturn {
	const generatedId = useId();
	const finalId = generateAutocompleteId(generatedId, autocompleteId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const inputClasses = getAutocompleteClasses({ size, hasError, className });
	return { finalId, hasError, ariaDescribedBy, inputClasses };
}

export function defaultFilterFn(option: { readonly label: unknown }, inputValue: string): boolean {
	if (!inputValue.trim()) {
		return true;
	}
	const labelStr = typeof option.label === 'string' ? option.label : String(option.label);
	return labelStr.toLowerCase().includes(inputValue.toLowerCase());
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegex(str: string): string {
	return str.replaceAll(/[$()*+.?[\\\]^{|}]/g, String.raw`\$&`);
}

/**
 * Highlights matching text in a string
 * Returns an array of parts with information about whether they are matches
 */
export interface HighlightPart {
	readonly text: string;
	readonly isMatch: boolean;
}

/**
 * Splits text into parts, marking matches for highlighting
 *
 * @param text - The text to highlight
 * @param query - The search query to highlight
 * @returns Array of parts with match information
 *
 * @example
 * ```ts
 * highlightMatches('Hello World', 'world')
 * // Returns: [
 * //   { text: 'Hello ', isMatch: false },
 * //   { text: 'World', isMatch: true }
 * // ]
 * ```
 */
function processMatches(text: string, regex: RegExp): HighlightPart[] {
	const parts: HighlightPart[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	// Reset regex lastIndex to ensure we start from the beginning
	regex.lastIndex = 0;

	while ((match = regex.exec(text)) !== null) {
		const [matchText] = match;
		const matchIndex = match.index;

		// Add text before the match
		if (matchIndex > lastIndex) {
			parts.push({
				text: text.slice(lastIndex, matchIndex),
				isMatch: false,
			});
		}

		// Add the match
		parts.push({
			text: matchText,
			isMatch: true,
		});

		const { lastIndex: newLastIndex } = regex;
		lastIndex = newLastIndex;

		// Prevent infinite loop if regex matches empty string
		const matchLength = matchText.length;
		if (matchLength === 0) {
			regex.lastIndex++;
		}
	}

	// Add remaining text after the last match
	if (lastIndex < text.length) {
		parts.push({
			text: text.slice(lastIndex),
			isMatch: false,
		});
	}

	return parts;
}

export function highlightMatches(text: string, query: string): HighlightPart[] {
	if (!query.trim()) {
		return [{ text, isMatch: false }];
	}

	const escapedQuery = escapeRegex(query);
	// Need dynamic regex for search highlighting - cannot use regex literal
	// eslint-disable-next-line security/detect-non-literal-regexp -- Dynamic regex needed for user input search highlighting
	const regex = new RegExp(`(${escapedQuery})`, 'gi');
	const parts = processMatches(text, regex);

	// If no matches found, return the whole text as non-match
	if (parts.length === 0) {
		return [{ text, isMatch: false }];
	}

	return parts;
}

/**
 * Gets the label string from an option
 */
export function getOptionLabel(option: { readonly label: unknown }): string {
	if (typeof option.label === 'string') {
		return option.label;
	}
	if (typeof option.label === 'number' || typeof option.label === 'boolean') {
		return String(option.label);
	}
	// For ReactNode or other complex types, return empty string
	// The actual rendering will handle the ReactNode properly
	return '';
}

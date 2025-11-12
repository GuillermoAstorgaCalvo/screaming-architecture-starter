/**
 * Gets ARIA described-by attribute value
 *
 * Combines error and helper text IDs into a space-separated string
 * for the aria-describedby attribute.
 *
 * @param inputId - The input element's ID
 * @param error - Optional error message
 * @param helperText - Optional helper text
 * @returns Space-separated string of IDs or undefined
 *
 * @internal
 */
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

/**
 * Generates a unique ID for the number input
 *
 * Uses the provided inputId if available, otherwise generates
 * a unique ID based on the label and generated ID.
 *
 * @param generatedId - React-generated unique ID
 * @param inputId - Optional explicit input ID
 * @param label - Optional label text
 * @returns Generated ID or undefined if no label provided
 *
 * @internal
 */
export function generateNumberInputId(
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
	return `number-input-${cleanId}`;
}

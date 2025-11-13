export function getAriaDescribedBy(
	radioId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${radioId}-error`);
	if (helperText) ids.push(`${radioId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generateRadioId(
	generatedId: string,
	radioId?: string,
	label?: string
): string | undefined {
	if (radioId) {
		return radioId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `radio-${cleanId}`;
}

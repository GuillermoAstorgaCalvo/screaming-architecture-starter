export function getAriaDescribedBy(
	signaturePadId: string,
	error?: string,
	helperText?: string
): string | undefined {
	if (error) return `${signaturePadId}-error`;
	if (helperText) return `${signaturePadId}-helper`;
	return undefined;
}

export function generateSignaturePadId(
	generatedId: string,
	signaturePadId?: string,
	label?: string
): string | undefined {
	if (signaturePadId) {
		return signaturePadId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `signature-pad-${cleanId}`;
}

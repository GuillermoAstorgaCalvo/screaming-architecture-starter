import type { StandardSize } from '@src-types/ui/base';

export function getAriaDescribedBy(
	editorId: string,
	error?: string,
	helperText?: string
): string | undefined {
	if (error) return `${editorId}-error`;
	if (helperText) return `${editorId}-helper`;
	return undefined;
}

export function generateEditorId(
	generatedId: string,
	editorId?: string,
	label?: string
): string | undefined {
	if (editorId) {
		return editorId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `rich-text-editor-${cleanId}`;
}

export function getRichTextEditorClasses(
	size: StandardSize,
	hasError: boolean,
	className?: string
): string {
	const baseClasses = 'w-full';
	const sizeClasses = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg',
	};
	const errorClasses = hasError ? 'border-red-500' : '';
	return `${baseClasses} ${sizeClasses[size]} ${errorClasses} ${className ?? ''}`.trim();
}

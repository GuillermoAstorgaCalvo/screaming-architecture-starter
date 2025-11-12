import type { StandardSize } from '@src-types/ui/base';

export type HeightValue = number | string | undefined;
export type ViewMode = 'edit' | 'preview' | 'split';

export interface EditorViewConfig {
	readonly menu: boolean;
	readonly md: boolean;
	readonly html: boolean;
}

export interface EditorCanViewConfig {
	readonly menu: boolean;
	readonly md: boolean;
	readonly html: boolean;
	readonly fullScreen: boolean;
}

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
	return `markdown-editor-${cleanId}`;
}

export function getMarkdownEditorClasses(
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

export function normalizeHeight(height: HeightValue): string | undefined {
	if (!height) {
		return undefined;
	}
	return typeof height === 'number' ? `${height}px` : height;
}

export function getEditorHeight(minHeight: HeightValue): string {
	if (!minHeight) {
		return '500px';
	}
	return typeof minHeight === 'number' ? `${minHeight}px` : minHeight;
}

export function getContainerStyle(minHeight: HeightValue, maxHeight: HeightValue) {
	return {
		minHeight: normalizeHeight(minHeight),
		maxHeight: normalizeHeight(maxHeight),
	};
}

export function getEditorViewConfig(viewMode: ViewMode, showPreview: boolean): EditorViewConfig {
	return {
		menu: true,
		md: viewMode !== 'preview',
		html: showPreview && viewMode !== 'edit',
	};
}

export function getEditorCanViewConfig(showPreview: boolean): EditorCanViewConfig {
	return {
		menu: true,
		md: true,
		html: showPreview,
		fullScreen: false,
	};
}

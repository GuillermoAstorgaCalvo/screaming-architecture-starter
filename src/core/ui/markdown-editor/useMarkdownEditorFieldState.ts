import { useEffect, useState } from 'react';

import type { ViewMode } from './MarkdownEditorHelpers';

interface UseMarkdownEditorFieldStateOptions {
	readonly value: string | undefined;
	readonly defaultValue: string | undefined;
	readonly viewMode: ViewMode;
	readonly onChange: ((markdown: string) => void) | undefined;
	readonly onViewModeChange: ((mode: ViewMode) => void) | undefined;
}

export interface UseMarkdownEditorFieldStateReturn {
	readonly editorValue: string;
	readonly currentViewMode: ViewMode;
	readonly handleChange: ({ text }: { text: string }) => void;
}

/**
 * Hook to manage markdown editor field state
 *
 * Manages the editor value and view mode state, synchronizing with controlled props
 * and providing change handlers.
 *
 * @param options - Configuration options for editor state
 * @returns Editor state including value, view mode, and change handler
 */
export function useMarkdownEditorFieldState({
	value,
	defaultValue,
	viewMode,
	onChange,
	onViewModeChange,
}: Readonly<UseMarkdownEditorFieldStateOptions>): UseMarkdownEditorFieldStateReturn {
	const [editorValue, setEditorValue] = useState(value ?? defaultValue ?? '');
	const [currentViewMode, setCurrentViewMode] = useState(viewMode);

	useEffect(() => {
		if (value !== undefined) {
			setEditorValue(value);
		}
	}, [value]);

	useEffect(() => {
		setCurrentViewMode(viewMode);
	}, [viewMode]);

	const handleChange = ({ text }: { text: string }) => {
		setEditorValue(text);
		onChange?.(text);
	};

	useEffect(() => {
		onViewModeChange?.(currentViewMode);
	}, [currentViewMode, onViewModeChange]);

	return { editorValue, currentViewMode, handleChange };
}

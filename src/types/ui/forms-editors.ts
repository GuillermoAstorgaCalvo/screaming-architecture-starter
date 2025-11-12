import type { HTMLAttributes } from 'react';

import type { StandardSize } from './base';

/**
 * RichTextEditor component props - WYSIWYG editor for rich text
 */
export interface RichTextEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Label text for the editor. If provided, renders a label element */
	label?: string;
	/** Error message to display below the editor */
	error?: string;
	/** Helper text to display below the editor */
	helperText?: string;
	/** Size of the editor @default 'md' */
	size?: StandardSize;
	/** Whether the editor takes full width @default false */
	fullWidth?: boolean;
	/** ID for the editor element. If not provided and label exists, will be auto-generated */
	editorId?: string;
	/** Current HTML content (controlled) */
	value?: string;
	/** Default HTML content (uncontrolled) */
	defaultValue?: string;
	/** Callback when content changes */
	onChange?: (html: string) => void;
	/** Placeholder text */
	placeholder?: string;
	/** Whether the editor is disabled @default false */
	disabled?: boolean;
	/** Whether the editor is read-only @default false */
	readOnly?: boolean;
	/** Minimum height of the editor */
	minHeight?: number | string;
	/** Maximum height of the editor */
	maxHeight?: number | string;
	/** Custom extensions for TipTap editor */
	extensions?: unknown[];
	/** Custom toolbar configuration */
	toolbar?: {
		/** Show bold button @default true */
		bold?: boolean;
		/** Show italic button @default true */
		italic?: boolean;
		/** Show underline button @default true */
		underline?: boolean;
		/** Show strike button @default true */
		strike?: boolean;
		/** Show heading buttons @default true */
		headings?: boolean;
		/** Show bullet list button @default true */
		bulletList?: boolean;
		/** Show ordered list button @default true */
		orderedList?: boolean;
		/** Show blockquote button @default true */
		blockquote?: boolean;
		/** Show code block button @default true */
		codeBlock?: boolean;
		/** Show link button @default true */
		link?: boolean;
		/** Show image button @default true */
		image?: boolean;
	};
}

/**
 * MarkdownEditor component props - Markdown editor with preview
 */
export interface MarkdownEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Label text for the editor. If provided, renders a label element */
	label?: string;
	/** Error message to display below the editor */
	error?: string;
	/** Helper text to display below the editor */
	helperText?: string;
	/** Size of the editor @default 'md' */
	size?: StandardSize;
	/** Whether the editor takes full width @default false */
	fullWidth?: boolean;
	/** ID for the editor element. If not provided and label exists, will be auto-generated */
	editorId?: string;
	/** Current markdown content (controlled) */
	value?: string;
	/** Default markdown content (uncontrolled) */
	defaultValue?: string;
	/** Callback when content changes */
	onChange?: (markdown: string) => void;
	/** Placeholder text */
	placeholder?: string;
	/** Whether the editor is disabled @default false */
	disabled?: boolean;
	/** Whether the editor is read-only @default false */
	readOnly?: boolean;
	/** Minimum height of the editor */
	minHeight?: number | string;
	/** Maximum height of the editor */
	maxHeight?: number | string;
	/** Whether to show preview pane @default true */
	showPreview?: boolean;
	/** Initial view mode @default 'split' */
	viewMode?: 'edit' | 'preview' | 'split';
	/** Callback when view mode changes */
	onViewModeChange?: (mode: 'edit' | 'preview' | 'split') => void;
}

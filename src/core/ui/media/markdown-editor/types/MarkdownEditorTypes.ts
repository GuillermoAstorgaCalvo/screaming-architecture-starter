import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

export interface MarkdownEditorWrapperProps extends HTMLAttributes<HTMLDivElement> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
}

export interface MarkdownEditorFieldProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly value?: string;
	readonly defaultValue?: string;
	readonly onChange?: (markdown: string) => void;
	readonly placeholder?: string;
	readonly readOnly?: boolean;
	readonly minHeight?: number | string;
	readonly maxHeight?: number | string;
	readonly showPreview?: boolean;
	readonly viewMode?: 'edit' | 'preview' | 'split';
	readonly onViewModeChange?: (mode: 'edit' | 'preview' | 'split') => void;
}

export interface MarkdownEditorMessagesProps {
	readonly editorId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface MarkdownEditorLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
}

export interface UseMarkdownEditorStateOptions {
	readonly editorId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
}

export interface UseMarkdownEditorStateReturn {
	readonly finalId: string | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly editorClasses: string;
}

export interface MarkdownEditorContentProps extends HTMLAttributes<HTMLDivElement> {
	readonly state: UseMarkdownEditorStateReturn;
	readonly editorProps: Readonly<MarkdownEditorFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

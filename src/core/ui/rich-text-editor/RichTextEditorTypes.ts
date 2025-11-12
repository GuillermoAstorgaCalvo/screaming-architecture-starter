import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

export interface RichTextEditorWrapperProps extends HTMLAttributes<HTMLDivElement> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
}

export interface RichTextEditorFieldProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly value?: string;
	readonly defaultValue?: string;
	readonly onChange?: (html: string) => void;
	readonly placeholder?: string;
	readonly readOnly?: boolean;
	readonly minHeight?: number | string;
	readonly maxHeight?: number | string;
	readonly extensions?: unknown[];
	readonly toolbar?: {
		bold?: boolean;
		italic?: boolean;
		underline?: boolean;
		strike?: boolean;
		headings?: boolean;
		bulletList?: boolean;
		orderedList?: boolean;
		blockquote?: boolean;
		codeBlock?: boolean;
		link?: boolean;
		image?: boolean;
	};
}

export interface RichTextEditorMessagesProps {
	readonly editorId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface RichTextEditorLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
}

export interface UseRichTextEditorStateOptions {
	readonly editorId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
}

export interface UseRichTextEditorStateReturn {
	readonly finalId: string | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly editorClasses: string;
}

export interface RichTextEditorContentProps extends HTMLAttributes<HTMLDivElement> {
	readonly state: UseRichTextEditorStateReturn;
	readonly editorProps: Readonly<RichTextEditorFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

export interface TextareaWrapperProps extends HTMLAttributes<HTMLDivElement> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
}

export interface TextareaFieldProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly props: Readonly<
		Omit<
			TextareaHTMLAttributes<HTMLTextAreaElement>,
			'size' | 'id' | 'className' | 'disabled' | 'required' | 'aria-invalid' | 'aria-describedby'
		>
	>;
}

export interface TextareaMessagesProps {
	readonly textareaId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface TextareaLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
}

export interface UseTextareaStateOptions {
	readonly textareaId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
}

export interface UseTextareaStateReturn {
	readonly finalId: string | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly textareaClasses: string;
}

export interface TextareaContentProps extends HTMLAttributes<HTMLDivElement> {
	readonly state: UseTextareaStateReturn;
	readonly fieldProps: Readonly<TextareaFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

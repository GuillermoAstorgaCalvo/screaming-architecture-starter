import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface ColorPickerInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue'> {
	readonly value?: string | undefined;
	readonly defaultValue?: string | undefined;
}

export interface ColorPickerWrapperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface ColorPickerContainerProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface ColorPickerFieldProps {
	readonly id: string | undefined;
	readonly colorPickerClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly value?: string | undefined;
	readonly defaultValue?: string | undefined;
	readonly onChange?: ((color: string) => void) | undefined;
	readonly props: Readonly<ColorPickerInputProps>;
}

export interface ColorPickerSwatchesProps {
	readonly swatches: string[];
	readonly currentColor?: string | undefined;
	readonly onColorSelect: (color: string) => void;
	readonly disabled?: boolean | undefined;
}

export interface ColorPickerMessagesProps {
	readonly colorPickerId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface ColorPickerLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
	readonly size?: 'sm' | 'md' | 'lg' | undefined;
}

export interface ColorPickerContentProps {
	readonly colorPickerId: string | undefined;
	readonly colorPickerClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
	readonly disabled?: boolean | undefined;
	readonly value?: string | undefined;
	readonly defaultValue?: string | undefined;
	readonly swatches?: string[] | undefined;
	readonly showSwatches: boolean;
	readonly onChange?: ((color: string) => void) | undefined;
	readonly fieldProps: Readonly<ColorPickerInputProps>;
}

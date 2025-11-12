import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface SliderInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue'> {
	readonly value?: number | undefined;
	readonly defaultValue?: number | undefined;
}

export interface SliderWrapperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface SliderContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface SliderFieldProps {
	readonly id: string | undefined;
	readonly sliderClasses: string;
	readonly trackClasses: string;
	readonly thumbClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly min: number;
	readonly max: number;
	readonly step?: number | undefined;
	readonly value?: number | undefined;
	readonly defaultValue?: number | undefined;
	readonly props: Readonly<SliderInputProps>;
}

export interface SliderMessagesProps {
	readonly sliderId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface SliderLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
	readonly size?: 'sm' | 'md' | 'lg' | undefined;
}

export interface SliderContentProps {
	readonly sliderId: string | undefined;
	readonly sliderClasses: string;
	readonly trackClasses: string;
	readonly thumbClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
	readonly disabled?: boolean | undefined;
	readonly min: number;
	readonly max: number;
	readonly step?: number | undefined;
	readonly value?: number | undefined;
	readonly defaultValue?: number | undefined;
	readonly fieldProps: Readonly<SliderInputProps>;
}

export interface SliderFieldWithLabelProps
	extends Pick<
		SliderContentProps,
		| 'sliderId'
		| 'sliderClasses'
		| 'trackClasses'
		| 'thumbClasses'
		| 'ariaDescribedBy'
		| 'label'
		| 'required'
		| 'disabled'
		| 'min'
		| 'max'
		| 'step'
		| 'value'
		| 'defaultValue'
		| 'fieldProps'
	> {}

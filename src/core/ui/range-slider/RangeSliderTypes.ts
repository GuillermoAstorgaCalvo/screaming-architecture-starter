import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface RangeSliderInputProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'size' | 'type' | 'value' | 'defaultValue' | 'onChange'
	> {
	readonly value?: [number, number] | undefined;
	readonly defaultValue?: [number, number] | undefined;
}

export interface RangeSliderWrapperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface RangeSliderContainerProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface RangeSliderFieldProps {
	readonly minId: string | undefined;
	readonly maxId: string | undefined;
	readonly sliderClasses: string;
	readonly trackClasses: string;
	readonly activeTrackClasses: string;
	readonly thumbClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly min: number;
	readonly max: number;
	readonly step?: number | undefined;
	readonly value?: [number, number] | undefined;
	readonly defaultValue?: [number, number] | undefined;
	readonly props: Readonly<RangeSliderInputProps>;
}

export interface RangeSliderMessagesProps {
	readonly rangeSliderId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface RangeSliderLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
	readonly size?: 'sm' | 'md' | 'lg' | undefined;
}

export interface RangeSliderContentProps {
	readonly rangeSliderId: string | undefined;
	readonly sliderClasses: string;
	readonly trackClasses: string;
	readonly activeTrackClasses: string;
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
	readonly value?: [number, number] | undefined;
	readonly defaultValue?: [number, number] | undefined;
	readonly onChange?: ((value: [number, number]) => void) | undefined;
	readonly fieldProps: Readonly<RangeSliderInputProps>;
}

export interface RangeSliderFieldWithLabelProps
	extends Pick<
		RangeSliderContentProps,
		| 'rangeSliderId'
		| 'sliderClasses'
		| 'trackClasses'
		| 'activeTrackClasses'
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
		| 'onChange'
		| 'fieldProps'
	> {}

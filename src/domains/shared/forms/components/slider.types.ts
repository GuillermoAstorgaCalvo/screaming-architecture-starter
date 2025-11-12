import type { InputHTMLAttributes } from 'react';

export interface SliderMark {
	readonly value: number;
	readonly label?: string;
}

export interface SliderProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'type' | 'value' | 'onChange' | 'min' | 'max' | 'step'
	> {
	readonly id?: string;
	readonly label?: string;
	readonly value: number;
	readonly min?: number;
	readonly max?: number;
	readonly step?: number;
	readonly helperText?: string;
	readonly showValue?: boolean;
	readonly formatValue?: (value: number) => string;
	readonly marks?: SliderMark[];
	readonly onChange: (value: number) => void;
}

export type OptionalString = string | undefined;
export type OptionalMarks = SliderMark[] | undefined;
export type SliderInputAttributes = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'type' | 'value' | 'onChange' | 'min' | 'max' | 'step'
>;

export interface SliderMarksProps {
	readonly marks: OptionalMarks;
	readonly min: number;
	readonly range: number;
	readonly marksId: OptionalString;
}

export interface SliderInputProps {
	readonly id: string;
	readonly value: number;
	readonly min: number;
	readonly max: number;
	readonly step: number;
	readonly disabled: boolean | undefined;
	readonly helperId: OptionalString;
	readonly percentage: number;
	readonly onChange: (value: number) => void;
	readonly inputProps: SliderInputAttributes;
}

export interface SliderModelArgs {
	readonly sliderId: string;
	readonly value: number;
	readonly min: number;
	readonly max: number;
	readonly step: number;
	readonly helperText: OptionalString;
	readonly formatValue: SliderProps['formatValue'];
	readonly marks: OptionalMarks;
	readonly disabled: boolean | undefined;
	readonly onChange: SliderProps['onChange'];
	readonly inputProps: SliderInputAttributes;
	readonly className: OptionalString;
	readonly label: OptionalString;
	readonly showValue: boolean;
}

export interface SliderViewProps {
	readonly sliderId: string;
	readonly className: OptionalString;
	readonly label: OptionalString;
	readonly showValue: boolean;
	readonly formattedValue: string;
	readonly sliderInputProps: SliderInputProps;
	readonly sliderMarksProps: SliderMarksProps;
	readonly helperText: OptionalString;
	readonly helperId: OptionalString;
}

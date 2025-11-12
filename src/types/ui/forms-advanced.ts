import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

import type { StandardSize } from './base';

/**
 * Slider component props
 */
export interface SliderProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue'> {
	/** Label text for the slider. If provided, renders a label element */
	label?: string;
	/** Error message to display below the slider */
	error?: string;
	/** Helper text to display below the slider */
	helperText?: string;
	/** Size of the slider @default 'md' */
	size?: StandardSize;
	/** Whether the slider takes full width @default false */
	fullWidth?: boolean;
	/** ID for the slider element. If not provided and label exists, will be auto-generated */
	sliderId?: string;
	/** Minimum value @default 0 */
	min?: number;
	/** Maximum value @default 100 */
	max?: number;
	/** Step value for the slider */
	step?: number;
	/** Current value (controlled) */
	value?: number;
	/** Default value (uncontrolled) */
	defaultValue?: number;
}

/**
 * RangeSlider component props (dual handles for min/max selection)
 */
export interface RangeSliderProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'size' | 'type' | 'value' | 'defaultValue' | 'onChange'
	> {
	/** Label text for the range slider. If provided, renders a label element */
	label?: string;
	/** Error message to display below the range slider */
	error?: string;
	/** Helper text to display below the range slider */
	helperText?: string;
	/** Size of the range slider @default 'md' */
	size?: StandardSize;
	/** Whether the range slider takes full width @default false */
	fullWidth?: boolean;
	/** ID for the range slider element. If not provided and label exists, will be auto-generated */
	rangeSliderId?: string;
	/** Minimum value @default 0 */
	min?: number;
	/** Maximum value @default 100 */
	max?: number;
	/** Step value for the range slider */
	step?: number;
	/** Current value range [min, max] (controlled) */
	value?: [number, number];
	/** Default value range [min, max] (uncontrolled) */
	defaultValue?: [number, number];
	/** Callback when value range changes */
	onChange?: (value: [number, number]) => void;
}

/**
 * Rating/StarRating component props
 */
export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Current rating value (0 to max) */
	value?: number;
	/** Default rating value (uncontrolled) */
	defaultValue?: number;
	/** Maximum rating value @default 5 */
	max?: number;
	/** Size of the stars @default 'md' */
	size?: StandardSize;
	/** Whether the rating is read-only @default false */
	readOnly?: boolean;
	/** Whether the rating is disabled @default false */
	disabled?: boolean;
	/** Callback when rating changes (only in interactive mode) */
	onChange?: (value: number) => void;
	/** Custom aria-label for the rating @default 'Rating' */
	'aria-label'?: string;
	/** Whether to show half stars @default false */
	allowHalf?: boolean;
	/** Custom empty icon (unfilled star) */
	emptyIcon?: ReactNode;
	/** Custom filled icon */
	filledIcon?: ReactNode;
}

/**
 * ColorPicker component props
 */
export interface ColorPickerProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'size' | 'type' | 'value' | 'defaultValue' | 'onChange'
	> {
	/** Label text for the color picker. If provided, renders a label element */
	label?: string;
	/** Error message to display below the color picker */
	error?: string;
	/** Helper text to display below the color picker */
	helperText?: string;
	/** Size of the color picker @default 'md' */
	size?: StandardSize;
	/** Whether the color picker takes full width @default false */
	fullWidth?: boolean;
	/** ID for the color picker element. If not provided and label exists, will be auto-generated */
	colorPickerId?: string;
	/** Current color value (hex format, e.g., '#ff0000') */
	value?: string;
	/** Default color value (uncontrolled) */
	defaultValue?: string;
	/** Preset color swatches to display */
	swatches?: string[];
	/** Whether to show preset swatches @default true */
	showSwatches?: boolean;
	/** Callback when color changes */
	onChange?: (color: string) => void;
}

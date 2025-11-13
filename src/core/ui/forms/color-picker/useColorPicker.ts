import type { ColorPickerProps } from '@src-types/ui/forms-advanced';
import { useId } from 'react';

import {
	generateColorPickerId,
	getAriaDescribedBy,
	getColorPickerClasses,
} from './ColorPickerHelpers';
import type { ColorPickerContentProps, ColorPickerInputProps } from './ColorPickerTypes';

export interface UseColorPickerPropsOptions {
	readonly props: Readonly<ColorPickerProps>;
}

export interface UseColorPickerPropsReturn {
	readonly contentProps: Readonly<ColorPickerContentProps>;
}

interface UseColorPickerStateOptions {
	readonly colorPickerId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: 'sm' | 'md' | 'lg';
	readonly className?: string | undefined;
}

interface UseColorPickerStateReturn {
	readonly finalId: string | undefined;
	readonly colorPickerClasses: string;
	readonly ariaDescribedBy: string | undefined;
}

/**
 * Hook to compute color picker state (ID, ARIA attributes, and classes)
 */
function useColorPickerState({
	colorPickerId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UseColorPickerStateOptions>): UseColorPickerStateReturn {
	const generatedId = useId();
	const finalId = generateColorPickerId(generatedId, colorPickerId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const colorPickerClasses = getColorPickerClasses({
		size,
		hasError,
		className,
	});
	return { finalId, colorPickerClasses, ariaDescribedBy };
}

interface BuildColorPickerContentPropsOptions {
	readonly props: Readonly<ColorPickerProps>;
	readonly state: UseColorPickerStateReturn;
	readonly fieldProps: Readonly<ColorPickerInputProps>;
}

function buildColorPickerContentProps(
	options: Readonly<BuildColorPickerContentPropsOptions>
): ColorPickerContentProps {
	const { props, state, fieldProps } = options;
	return {
		colorPickerId: state.finalId,
		colorPickerClasses: state.colorPickerClasses,
		ariaDescribedBy: state.ariaDescribedBy,
		label: props.label,
		error: props.error,
		helperText: props.helperText,
		required: props.required,
		fullWidth: props.fullWidth ?? false,
		disabled: props.disabled,
		value: props.value,
		defaultValue: props.defaultValue,
		swatches: props.swatches,
		showSwatches: props.showSwatches ?? true,
		onChange: props.onChange,
		fieldProps,
	};
}

/**
 * Hook to process ColorPicker component props and return content props
 */
export function useColorPickerProps({
	props,
}: Readonly<UseColorPickerPropsOptions>): UseColorPickerPropsReturn {
	const {
		label,
		error,
		helperText,
		size = 'md',
		colorPickerId,
		className,
		value: _value,
		defaultValue: _defaultValue,
		fullWidth: _fullWidth,
		swatches: _swatches,
		showSwatches: _showSwatches,
		onChange: _onChange,
		...rest
	} = props;

	const state = useColorPickerState({
		colorPickerId,
		label,
		error,
		helperText,
		size,
		className,
	});

	const fieldProps: Readonly<ColorPickerInputProps> = rest;

	const contentProps = buildColorPickerContentProps({ props, state, fieldProps });

	return { contentProps };
}

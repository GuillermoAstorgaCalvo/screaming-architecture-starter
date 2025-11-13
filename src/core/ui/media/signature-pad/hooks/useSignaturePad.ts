import {
	generateSignaturePadId,
	getAriaDescribedBy,
} from '@core/ui/media/signature-pad/helpers/SignaturePadHelpers';
import type {
	SignaturePadCanvasProps,
	UseSignaturePadStateOptions,
	UseSignaturePadStateReturn,
} from '@core/ui/media/signature-pad/types/SignaturePadTypes';
import type { SignaturePadProps } from '@src-types/ui/media';
import { useId } from 'react';

export interface UseSignaturePadPropsOptions {
	readonly props: Readonly<SignaturePadProps>;
}

export interface UseSignaturePadPropsReturn {
	readonly state: UseSignaturePadStateReturn;
	readonly canvasProps: Readonly<SignaturePadCanvasProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

export function useSignaturePadState({
	signaturePadId,
	label,
	error,
	helperText,
	size: _size,
	className: _className,
}: Readonly<UseSignaturePadStateOptions>): UseSignaturePadStateReturn {
	const generatedId = useId();
	const finalId = generateSignaturePadId(generatedId, signaturePadId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	return { finalId, hasError, ariaDescribedBy };
}

function createCanvasProps(
	state: UseSignaturePadStateReturn,
	config: Readonly<{
		width: number;
		height: number;
		backgroundColor: string;
		penColor: string;
		velocityFilterWeight: number;
		minWidth: number;
		maxWidth: number;
		throttle: number;
		disabled: boolean;
		value: string | null | undefined;
		defaultValue: string | null | undefined;
		onChange?: ((dataUrl: string | null) => void) | undefined;
		showClearButton: boolean;
		clearButtonText: string;
		onClear?: (() => void) | undefined;
		canvasClassName?: string | undefined;
	}>
): SignaturePadCanvasProps {
	const { value, defaultValue, onChange, onClear, canvasClassName, ...rest } = config;
	return {
		id: state.finalId,
		...rest,
		value: value ?? null,
		defaultValue: defaultValue ?? null,
		...(onChange && { onChange }),
		...(onClear && { onClear }),
		...(canvasClassName && { canvasClassName }),
	};
}

const DEFAULT_CANVAS_CONFIG = {
	width: 500,
	height: 200,
	backgroundColor: '#FFFFFF',
	penColor: '#000000',
	velocityFilterWeight: 0.7,
	minWidth: 0.5,
	maxWidth: 2.5,
	throttle: 16,
	disabled: false,
	showClearButton: true,
	clearButtonText: 'Clear',
} as const;

function getValueOrDefault<T>(value: T | undefined, defaultValue: T): T {
	return value ?? defaultValue;
}

function extractCanvasConfig(props: Readonly<SignaturePadProps>) {
	return {
		width: getValueOrDefault(props.width, DEFAULT_CANVAS_CONFIG.width),
		height: getValueOrDefault(props.height, DEFAULT_CANVAS_CONFIG.height),
		backgroundColor: getValueOrDefault(
			props.backgroundColor,
			DEFAULT_CANVAS_CONFIG.backgroundColor
		),
		penColor: getValueOrDefault(props.penColor, DEFAULT_CANVAS_CONFIG.penColor),
		velocityFilterWeight: getValueOrDefault(
			props.velocityFilterWeight,
			DEFAULT_CANVAS_CONFIG.velocityFilterWeight
		),
		minWidth: getValueOrDefault(props.minWidth, DEFAULT_CANVAS_CONFIG.minWidth),
		maxWidth: getValueOrDefault(props.maxWidth, DEFAULT_CANVAS_CONFIG.maxWidth),
		throttle: getValueOrDefault(props.throttle, DEFAULT_CANVAS_CONFIG.throttle),
		disabled: getValueOrDefault(props.disabled, DEFAULT_CANVAS_CONFIG.disabled),
		showClearButton: getValueOrDefault(
			props.showClearButton,
			DEFAULT_CANVAS_CONFIG.showClearButton
		),
		clearButtonText: getValueOrDefault(
			props.clearButtonText,
			DEFAULT_CANVAS_CONFIG.clearButtonText
		),
		value: props.value,
		defaultValue: props.defaultValue,
		onChange: props.onChange,
		onClear: props.onClear,
		canvasClassName: props.canvasClassName,
	};
}

export function useSignaturePadProps({
	props,
}: Readonly<UseSignaturePadPropsOptions>): UseSignaturePadPropsReturn {
	const {
		label,
		error,
		helperText,
		size = 'md',
		fullWidth = false,
		signaturePadId,
		className,
	} = props;

	const state = useSignaturePadState({
		signaturePadId,
		label,
		error,
		helperText,
		size,
		className,
	});

	const canvasConfig = extractCanvasConfig(props);
	const canvasProps = createCanvasProps(state, canvasConfig);

	const required =
		'required' in props && typeof props.required === 'boolean' ? props.required : undefined;

	return { state, canvasProps, label, error, helperText, required, fullWidth };
}

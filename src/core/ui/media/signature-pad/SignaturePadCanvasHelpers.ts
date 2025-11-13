import type { CSSProperties } from 'react';

import type { SignaturePadCanvasProps } from './SignaturePadTypes';

export const DISABLED_OPACITY = 0.5;
export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 200;
export const DEFAULT_VELOCITY_FILTER_WEIGHT = 0.7;
export const DEFAULT_MIN_WIDTH = 0.5;
export const DEFAULT_MAX_WIDTH = 2.5;
export const DEFAULT_THROTTLE = 16;
export const DEFAULT_BACKGROUND_COLOR = '#FFFFFF';
export const DEFAULT_PEN_COLOR = '#000000';
export const DEFAULT_CLEAR_BUTTON_TEXT = 'Clear';

export interface GetCanvasStyleOptions {
	readonly backgroundColor: string;
	readonly disabled: boolean;
}

/**
 * Builds the canvas style object
 */
export function getCanvasStyle({
	backgroundColor,
	disabled,
}: Readonly<GetCanvasStyleOptions>): CSSProperties {
	return {
		border: '1px solid',
		borderColor: 'currentColor',
		borderRadius: '0.375rem',
		backgroundColor,
		cursor: disabled ? 'not-allowed' : 'crosshair',
		opacity: disabled ? DISABLED_OPACITY : 1,
	};
}

export interface GetCanvasPropsOptions {
	readonly id: string | undefined;
	readonly width: number;
	readonly height: number;
	readonly canvasClassName?: string | undefined;
	readonly backgroundColor: string;
	readonly disabled: boolean;
}

/**
 * Builds the canvas props object for SignatureCanvas
 */
export function getCanvasProps({
	id,
	width,
	height,
	canvasClassName,
	backgroundColor,
	disabled,
}: Readonly<GetCanvasPropsOptions>) {
	return {
		id,
		width,
		height,
		className: canvasClassName,
		style: getCanvasStyle({ backgroundColor, disabled }),
	};
}

export interface NormalizedSignaturePadCanvasProps {
	readonly id: string | undefined;
	readonly width: number;
	readonly height: number;
	readonly backgroundColor: string;
	readonly penColor: string;
	readonly velocityFilterWeight: number;
	readonly minWidth: number;
	readonly maxWidth: number;
	readonly throttle: number;
	readonly disabled: boolean;
	readonly value?: string | null | undefined;
	readonly defaultValue?: string | null | undefined;
	readonly onChange?: ((dataUrl: string | null) => void) | undefined;
	readonly showClearButton: boolean;
	readonly clearButtonText: string;
	readonly onClear?: (() => void) | undefined;
	readonly canvasClassName?: string | undefined;
}

/**
 * Normalizes canvas dimension props
 */
function normalizeCanvasDimensions(
	width?: number,
	height?: number
): { width: number; height: number } {
	return {
		width: width ?? DEFAULT_WIDTH,
		height: height ?? DEFAULT_HEIGHT,
	};
}

/**
 * Normalizes canvas style props
 */
function normalizeCanvasStyle(
	backgroundColor?: string,
	penColor?: string
): { backgroundColor: string; penColor: string } {
	return {
		backgroundColor: backgroundColor ?? DEFAULT_BACKGROUND_COLOR,
		penColor: penColor ?? DEFAULT_PEN_COLOR,
	};
}

interface CanvasBehaviorProps {
	readonly velocityFilterWeight?: number | undefined;
	readonly minWidth?: number | undefined;
	readonly maxWidth?: number | undefined;
	readonly throttle?: number | undefined;
}

/**
 * Normalizes canvas behavior props
 */
function normalizeCanvasBehavior(props: CanvasBehaviorProps): {
	velocityFilterWeight: number;
	minWidth: number;
	maxWidth: number;
	throttle: number;
} {
	return {
		velocityFilterWeight: props.velocityFilterWeight ?? DEFAULT_VELOCITY_FILTER_WEIGHT,
		minWidth: props.minWidth ?? DEFAULT_MIN_WIDTH,
		maxWidth: props.maxWidth ?? DEFAULT_MAX_WIDTH,
		throttle: props.throttle ?? DEFAULT_THROTTLE,
	};
}

/**
 * Normalizes and applies default values to SignaturePadCanvas props
 */
export function normalizeProps(
	props: Readonly<SignaturePadCanvasProps>
): NormalizedSignaturePadCanvasProps {
	const dimensions = normalizeCanvasDimensions(props.width, props.height);
	const style = normalizeCanvasStyle(props.backgroundColor, props.penColor);
	const behavior = normalizeCanvasBehavior({
		velocityFilterWeight: props.velocityFilterWeight,
		minWidth: props.minWidth,
		maxWidth: props.maxWidth,
		throttle: props.throttle,
	});

	return {
		id: props.id,
		...dimensions,
		...style,
		...behavior,
		disabled: props.disabled ?? false,
		value: props.value,
		defaultValue: props.defaultValue,
		onChange: props.onChange,
		showClearButton: props.showClearButton ?? true,
		clearButtonText: props.clearButtonText ?? DEFAULT_CLEAR_BUTTON_TEXT,
		onClear: props.onClear,
		canvasClassName: props.canvasClassName,
	};
}

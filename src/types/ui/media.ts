import type { HTMLAttributes } from 'react';

import type { StandardSize } from './base';

/**
 * QRCode component props - QR code display component
 */
export interface QRCodeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	/** The value/data to encode in the QR code */
	value: string;
	/** Size of the QR code in pixels @default 256 */
	size?: number;
	/** Error correction level @default 'M' */
	level?: 'L' | 'M' | 'Q' | 'H';
	/** Background color (hex format) @default '#FFFFFF' */
	bgColor?: string;
	/** Foreground color (hex format) @default '#000000' */
	fgColor?: string;
	/** Whether to include margin around the QR code @default true */
	includeMargin?: boolean;
	/** Image to display in the center of the QR code (logo) */
	imageSettings?: {
		src: string;
		height?: number;
		width?: number;
		excavate?: boolean;
	};
	/** Custom render function for the QR code */
	renderAs?: 'svg' | 'canvas';
	/** Size variant for styling @default 'md' */
	sizeVariant?: StandardSize;
	/** Custom class name for the container */
	className?: string;
}

/**
 * Barcode format types
 */
export type BarcodeFormat =
	| 'CODE128'
	| 'CODE39'
	| 'EAN13'
	| 'EAN8'
	| 'ITF14'
	| 'MSI'
	| 'pharmacode'
	| 'codabar'
	| 'upc'
	| 'upce';

/**
 * Barcode component props - Barcode display component
 */
export interface BarcodeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	/** The value/data to encode in the barcode */
	value: string;
	/** Barcode format @default 'CODE128' */
	format?: BarcodeFormat;
	/** Width of a single bar in pixels @default 2 */
	width?: number;
	/** Height of the barcode in pixels @default 100 */
	height?: number;
	/** Display the value as text below the barcode @default true */
	displayValue?: boolean;
	/** Font size for the text @default 20 */
	fontSize?: number;
	/** Font options for the text */
	fontOptions?: string;
	/** Font family for the text @default 'monospace' */
	font?: string;
	/** Text alignment @default 'center' */
	textAlign?: 'left' | 'center' | 'right';
	/** Text position @default 'bottom' */
	textPosition?: 'bottom' | 'top';
	/** Text margin in pixels @default 2 */
	textMargin?: number;
	/** Background color (hex format) @default '#FFFFFF' */
	background?: string;
	/** Foreground color (hex format) @default '#000000' */
	lineColor?: string;
	/** Margin around the barcode in pixels */
	margin?: number;
	/** Size variant for styling @default 'md' */
	sizeVariant?: StandardSize;
	/** Custom class name for the container */
	className?: string;
}

/**
 * SignaturePad component props - Signature capture component
 */
export interface SignaturePadProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
	/** Label text for the signature pad. If provided, renders a label element */
	label?: string;
	/** Error message to display below the signature pad */
	error?: string;
	/** Helper text to display below the signature pad */
	helperText?: string;
	/** Size of the signature pad @default 'md' */
	size?: StandardSize;
	/** Whether the signature pad takes full width @default false */
	fullWidth?: boolean;
	/** ID for the signature pad element. If not provided and label exists, will be auto-generated */
	signaturePadId?: string;
	/** Width of the canvas in pixels @default 500 */
	width?: number;
	/** Height of the canvas in pixels @default 200 */
	height?: number;
	/** Background color (hex format) @default '#FFFFFF' */
	backgroundColor?: string;
	/** Pen color (hex format) @default '#000000' */
	penColor?: string;
	/** Velocity filter weight (0-1) for smoothing @default 0.7 */
	velocityFilterWeight?: number;
	/** Minimum width of the pen stroke @default 0.5 */
	minWidth?: number;
	/** Maximum width of the pen stroke @default 2.5 */
	maxWidth?: number;
	/** Throttle rate for drawing events in milliseconds @default 16 */
	throttle?: number;
	/** Current signature data URL (controlled) */
	value?: string | null;
	/** Default signature data URL (uncontrolled) */
	defaultValue?: string | null;
	/** Callback when signature changes */
	onChange?: (dataUrl: string | null) => void;
	/** Callback when signature is cleared */
	onClear?: () => void;
	/** Whether the signature pad is disabled @default false */
	disabled?: boolean;
	/** Whether to show clear button @default true */
	showClearButton?: boolean;
	/** Custom clear button text @default 'Clear' */
	clearButtonText?: string;
	/** Custom class name for the canvas */
	canvasClassName?: string;
}

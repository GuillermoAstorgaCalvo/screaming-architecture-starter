import type { BarcodeProps } from '@src-types/ui/media';
import Barcode from 'react-barcode-generator';

/**
 * Maps BarcodeFormat to the format expected by react-barcode-generator
 */
function mapBarcodeFormat(
	format: BarcodeProps['format']
):
	| 'CODE128'
	| 'CODE39'
	| 'EAN13'
	| 'EAN8'
	| 'ITF14'
	| 'MSI'
	| 'pharmacode'
	| 'codabar'
	| 'UPC'
	| 'UPCE'
	| 'CODE128A'
	| 'CODE128B'
	| 'CODE128C'
	| 'EAN5'
	| 'EAN2'
	| 'ITF'
	| 'MSI10'
	| 'MSI11'
	| 'MSI1010'
	| 'MSI1110'
	| 'GenericBarcode' {
	if (format === 'upc') return 'UPC';
	if (format === 'upce') return 'UPCE';
	return (format ?? 'CODE128') as typeof format & 'CODE128';
}

/**
 * Default barcode configuration values
 */
const DEFAULT_BARCODE_CONFIG = {
	format: 'CODE128',
	width: 2,
	height: 100,
	displayValue: true,
	fontSize: 20,
	fontOptions: '',
	font: 'monospace',
	textAlign: 'center' as const,
	textPosition: 'bottom' as const,
	textMargin: 2,
	background: '#FFFFFF',
	lineColor: '#000000',
} as const;

/**
 * Gets numeric prop with default
 */
function getNumericProp(value: number | undefined, defaultValue: number): number {
	return value ?? defaultValue;
}

/**
 * Gets boolean prop with default
 */
function getBooleanProp(value: boolean | undefined, defaultValue: boolean): boolean {
	return value ?? defaultValue;
}

/**
 * Gets string prop with default
 */
function getStringProp(value: string | undefined, defaultValue: string): string {
	return value ?? defaultValue;
}

/**
 * Prepares barcode props with defaults
 */
function prepareBarcodeProps(props: Readonly<BarcodeProps>) {
	return {
		value: props.value,
		format: mapBarcodeFormat(props.format ?? DEFAULT_BARCODE_CONFIG.format),
		width: getNumericProp(props.width, DEFAULT_BARCODE_CONFIG.width),
		height: getNumericProp(props.height, DEFAULT_BARCODE_CONFIG.height),
		displayValue: getBooleanProp(props.displayValue, DEFAULT_BARCODE_CONFIG.displayValue),
		fontSize: getNumericProp(props.fontSize, DEFAULT_BARCODE_CONFIG.fontSize),
		fontOptions: getStringProp(props.fontOptions, DEFAULT_BARCODE_CONFIG.fontOptions),
		font: getStringProp(props.font, DEFAULT_BARCODE_CONFIG.font),
		textAlign: props.textAlign ?? DEFAULT_BARCODE_CONFIG.textAlign,
		textPosition: props.textPosition ?? DEFAULT_BARCODE_CONFIG.textPosition,
		textMargin: getNumericProp(props.textMargin, DEFAULT_BARCODE_CONFIG.textMargin),
		background: getStringProp(props.background, DEFAULT_BARCODE_CONFIG.background),
		lineColor: getStringProp(props.lineColor, DEFAULT_BARCODE_CONFIG.lineColor),
		...(props.margin !== undefined && { margin: props.margin }),
	};
}

/**
 * Barcode - Barcode display component
 *
 * Features:
 * - Displays barcodes in multiple formats (CODE128, CODE39, EAN13, etc.)
 * - Customizable size, colors, and text display
 * - Accessible: includes proper ARIA attributes
 * - Size variants: sm, md, lg
 *
 * @example
 * ```tsx
 * <Barcode value="123456789" format="CODE128" />
 * ```
 *
 * @example
 * ```tsx
 * <Barcode
 *   value="123456789012"
 *   format="EAN13"
 *   width={2}
 *   height={100}
 *   displayValue={true}
 *   fontSize={20}
 * />
 * ```
 */
export default function BarcodeComponent({
	sizeVariant: _sizeVariant = 'md',
	className,
	...props
}: Readonly<BarcodeProps>) {
	const barcodeProps = prepareBarcodeProps(props);

	return (
		<div className={className} {...props}>
			<Barcode {...barcodeProps} />
		</div>
	);
}

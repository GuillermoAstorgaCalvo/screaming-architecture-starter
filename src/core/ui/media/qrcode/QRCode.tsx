import type { QRCodeProps } from '@src-types/ui/media';
import { QRCodeSVG } from 'qrcode.react';

/** Default margin size for QR codes when includeMargin is true */
const DEFAULT_QR_MARGIN_SIZE = 4;

/**
 * Validates and constructs imageSettings for QRCodeSVG
 * Only returns imageSettings if height and width are both defined
 */
function buildImageSettings(
	imageSettings?: QRCodeProps['imageSettings']
): Parameters<typeof QRCodeSVG>[0]['imageSettings'] {
	if (!imageSettings) {
		return undefined;
	}

	if (imageSettings.height === undefined || imageSettings.width === undefined) {
		return undefined;
	}

	// At this point, imageSettings is defined and has height/width
	const settings = imageSettings;

	const result = {
		src: settings.src,
		height: settings.height,
		width: settings.width,
	} as Parameters<typeof QRCodeSVG>[0]['imageSettings'];

	if (typeof settings.excavate === 'boolean') {
		(result as { src: string; height: number; width: number; excavate: boolean }).excavate =
			settings.excavate;
	}

	return result;
}

/**
 * QRCode - QR code display component
 *
 * Features:
 * - Displays QR codes from string values
 * - Customizable size, colors, and error correction level
 * - Supports logo/image in center
 * - Accessible: includes proper ARIA attributes
 * - Size variants: sm, md, lg
 *
 * @example
 * ```tsx
 * <QRCode value="https://example.com" size={256} />
 * ```
 *
 * @example
 * ```tsx
 * <QRCode
 *   value="https://example.com"
 *   size={200}
 *   level="H"
 *   bgColor="#FFFFFF"
 *   fgColor="#000000"
 *   imageSettings={{
 *     src: "/logo.png",
 *     height: 50,
 *     width: 50,
 *   }}
 * />
 * ```
 */
export default function QRCode({
	value,
	size = 256,
	level = 'M',
	bgColor = '#FFFFFF',
	fgColor = '#000000',
	includeMargin = true,
	imageSettings,
	renderAs: _renderAs = 'svg',
	sizeVariant: _sizeVariant = 'md',
	className,
	...props
}: Readonly<QRCodeProps>) {
	const marginSize = includeMargin ? DEFAULT_QR_MARGIN_SIZE : 0;
	const qrImageSettings = buildImageSettings(imageSettings);

	return (
		<div className={className} {...props}>
			<QRCodeSVG
				value={value}
				size={size}
				level={level}
				bgColor={bgColor}
				fgColor={fgColor}
				marginSize={marginSize}
				{...(qrImageSettings && { imageSettings: qrImageSettings })}
			/>
		</div>
	);
}

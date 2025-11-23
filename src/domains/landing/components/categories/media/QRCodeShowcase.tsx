import QRCode from '@core/ui/media/qrcode/QRCode';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

/**
 * QRCodeShowcase - Showcase for QRCode component
 */
export function QRCodeShowcase() {
	return (
		<ShowcaseSection
			title="QRCode"
			description="QR code component"
			tags={['media', 'qrcode', 'code', 'barcode']}
		>
			<div className="space-y-4">
				<QRCode value="https://example.com" size={128} />
				<QRCode value="Hello, World!" size={200} level="H" />
			</div>
		</ShowcaseSection>
	);
}

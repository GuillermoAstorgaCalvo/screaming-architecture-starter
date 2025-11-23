import SignaturePad from '@core/ui/media/signature-pad/SignaturePad';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

/**
 * SignaturePadShowcase - Showcase for SignaturePad component
 */
export function SignaturePadShowcase() {
	return (
		<ShowcaseSection
			title="SignaturePad"
			description="Signature capture component"
			tags={['media', 'signature', 'pad', 'draw', 'input']}
		>
			<SignaturePad
				label="Digital Signature"
				width={500}
				height={200}
				helperText="Please sign in the box above"
				onChange={dataUrl => {
					// Signature captured callback
					if (dataUrl) {
						// Handle signature data
					}
				}}
			/>
		</ShowcaseSection>
	);
}

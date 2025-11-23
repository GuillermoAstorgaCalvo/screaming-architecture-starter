import Text from '@core/ui/text/Text';
import CopyButton from '@core/ui/utilities/copy-button/CopyButton';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function CopyButtonShowcase() {
	return (
		<ShowcaseSection
			title="CopyButton"
			description="Copy to clipboard button"
			tags={['utility', 'copy', 'clipboard', 'button']}
		>
			<div className="space-y-4">
				<div className="flex items-center gap-4">
					<Text>Text to copy: &quot;Hello, World!&quot;</Text>
					<CopyButton text="Hello, World!" />
				</div>
				<div className="flex items-center gap-4">
					<Text>Code snippet:</Text>
					<CopyButton text='console.log("Hello, World!");' />
				</div>
			</div>
		</ShowcaseSection>
	);
}

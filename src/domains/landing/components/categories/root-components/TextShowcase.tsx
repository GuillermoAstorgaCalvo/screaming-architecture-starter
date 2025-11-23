import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function TextShowcase() {
	return (
		<ShowcaseSection
			title="Text"
			description="Typography text component"
			tags={['text', 'typography']}
		>
			<div className="space-y-2">
				<Text size="sm">Small text</Text>
				<Text size="md">Medium text</Text>
				<Text size="lg">Large text</Text>
			</div>
		</ShowcaseSection>
	);
}

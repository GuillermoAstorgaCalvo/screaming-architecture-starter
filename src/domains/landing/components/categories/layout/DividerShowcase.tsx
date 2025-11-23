import Divider from '@core/ui/layout/divider/Divider';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function DividerShowcase() {
	return (
		<ShowcaseSection
			title="Divider"
			description="Divider component"
			tags={['layout', 'divider', 'separator']}
		>
			<div className="space-y-4">
				<Text>Content above</Text>
				<Divider />
				<Text>Content below</Text>
			</div>
		</ShowcaseSection>
	);
}

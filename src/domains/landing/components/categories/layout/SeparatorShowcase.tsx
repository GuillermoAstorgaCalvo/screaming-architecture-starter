import Separator from '@core/ui/layout/separator/Separator';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function SeparatorShowcase() {
	return (
		<ShowcaseSection
			title="Separator"
			description="Light visual separator component"
			tags={['layout', 'separator', 'divider']}
		>
			<div className="space-y-4">
				<Text>Content above separator</Text>
				<Separator orientation="horizontal" />
				<Text>Content below separator</Text>
				<div className="flex items-center gap-4">
					<Text>Left content</Text>
					<Separator orientation="vertical" className="h-8" />
					<Text>Right content</Text>
				</div>
			</div>
		</ShowcaseSection>
	);
}

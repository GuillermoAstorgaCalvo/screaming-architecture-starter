import Heading from '@core/ui/heading/Heading';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function HeadingShowcase() {
	return (
		<ShowcaseSection
			title="Heading"
			description="Typography heading component"
			tags={['text', 'typography', 'heading']}
		>
			<div className="space-y-2">
				<Heading as="h1" size="lg">
					Heading Large (h1)
				</Heading>
				<Heading as="h2" size="md">
					Heading Medium (h2)
				</Heading>
				<Heading as="h3" size="sm">
					Heading Small (h3)
				</Heading>
			</div>
		</ShowcaseSection>
	);
}

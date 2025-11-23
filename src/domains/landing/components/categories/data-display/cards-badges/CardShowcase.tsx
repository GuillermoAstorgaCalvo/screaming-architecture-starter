import Card from '@core/ui/data-display/card/Card';
import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function CardShowcase() {
	return (
		<ShowcaseSection
			title="Card"
			description="Container component for grouping content"
			tags={['data', 'card', 'container', 'layout']}
		>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card variant="elevated" padding="md">
					<Heading as="h3" size="sm" className="mb-2">
						Elevated Card
					</Heading>
					<Text size="sm">This is an elevated card with shadow.</Text>
				</Card>
				<Card variant="outlined" padding="md">
					<Heading as="h3" size="sm" className="mb-2">
						Outlined Card
					</Heading>
					<Text size="sm">This is an outlined card with border.</Text>
				</Card>
				<Card variant="flat" padding="md">
					<Heading as="h3" size="sm" className="mb-2">
						Flat Card
					</Heading>
					<Text size="sm">This is a flat card with no elevation.</Text>
				</Card>
			</div>
		</ShowcaseSection>
	);
}

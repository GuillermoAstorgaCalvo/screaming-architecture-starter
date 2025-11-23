import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ScrollPositionShowcase() {
	return (
		<ShowcaseSection
			title="useScrollPosition"
			description="Track scroll position"
			tags={['hook', 'scroll', 'position']}
		>
			<Card variant="outlined" padding="sm">
				<Text size="sm">
					<strong>Scroll Position:</strong> Scroll the page to see updates
				</Text>
				<Text size="sm" className="mt-2 text-muted-foreground">
					useScrollPosition tracks scroll position with throttling and SSR safety
				</Text>
			</Card>
		</ShowcaseSection>
	);
}

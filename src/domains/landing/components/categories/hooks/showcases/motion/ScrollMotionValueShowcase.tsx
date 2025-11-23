import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ScrollMotionValueShowcase() {
	return (
		<ShowcaseSection
			title="useScrollMotionValue"
			description="Track scroll as motion values"
			tags={['hook', 'scroll', 'motion', 'animation', 'framer']}
		>
			<Card variant="outlined" padding="sm">
				<Text size="sm">
					<strong>Status:</strong> Scroll position and progress as motion values
				</Text>
				<Text size="sm" className="mt-2 text-muted-foreground">
					useScrollMotionValue provides motion values for scroll position (x, y) and progress (0-1).
					These can be used with useMotionTransform to create scroll-based animations.
				</Text>
			</Card>
		</ShowcaseSection>
	);
}

import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function MotionVelocityShowcase() {
	return (
		<ShowcaseSection
			title="useMotionVelocity"
			description="Track velocity of motion values"
			tags={['hook', 'motion', 'animation', 'velocity', 'framer']}
		>
			<Card variant="outlined" padding="sm">
				<Text size="sm">
					<strong>Status:</strong> Track rate of change of motion values
				</Text>
				<Text size="sm" className="mt-2 text-muted-foreground">
					useMotionVelocity tracks the velocity (rate of change) of a motion value. Useful for
					creating momentum-based animations and detecting fast movements.
				</Text>
			</Card>
		</ShowcaseSection>
	);
}

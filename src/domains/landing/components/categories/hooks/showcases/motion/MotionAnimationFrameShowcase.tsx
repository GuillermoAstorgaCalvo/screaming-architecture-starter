import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function MotionAnimationFrameShowcase() {
	return (
		<ShowcaseSection
			title="useMotionAnimationFrame"
			description="Update motion values on every animation frame"
			tags={['hook', 'motion', 'animation', 'frame', 'framer']}
		>
			<Card variant="outlined" padding="sm">
				<Text size="sm">
					<strong>Status:</strong> Frame-by-frame animation control
				</Text>
				<Text size="sm" className="mt-2 text-muted-foreground">
					useMotionAnimationFrame provides frame-by-frame control for custom animations. Useful for
					continuous animations that need precise timing control.
				</Text>
			</Card>
		</ShowcaseSection>
	);
}

import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function MotionTransformShowcase() {
	return (
		<ShowcaseSection
			title="useMotionTransform"
			description="Transform motion values"
			tags={['hook', 'motion', 'animation', 'transform', 'framer']}
		>
			<Card variant="outlined" padding="sm">
				<Text size="sm">
					<strong>Status:</strong> Transform one motion value to another
				</Text>
				<Text size="sm" className="mt-2 text-muted-foreground">
					useMotionTransform maps one motion value to another using input/output ranges or custom
					transform functions. Useful for creating derived animations (e.g., scroll position to
					opacity).
				</Text>
			</Card>
		</ShowcaseSection>
	);
}

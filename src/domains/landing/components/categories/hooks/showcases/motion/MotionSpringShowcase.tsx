import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function MotionSpringShowcase() {
	return (
		<ShowcaseSection
			title="useMotionSpring"
			description="Create spring-animated motion values"
			tags={['hook', 'motion', 'animation', 'spring', 'framer']}
		>
			<Card variant="outlined" padding="sm">
				<Text size="sm">
					<strong>Status:</strong> Spring animations provide natural, physics-based motion
				</Text>
				<Text size="sm" className="mt-2 text-muted-foreground">
					useMotionSpring creates spring-animated motion values from source motion values. Springs
					provide smooth, natural animations with configurable stiffness, damping, and mass.
				</Text>
			</Card>
		</ShowcaseSection>
	);
}

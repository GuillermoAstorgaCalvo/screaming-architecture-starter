import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function MotionValueShowcase() {
	return (
		<ShowcaseSection
			title="useMotionValue"
			description="Create reactive motion values"
			tags={['hook', 'motion', 'animation', 'framer']}
		>
			<Card variant="outlined" padding="sm">
				<Text size="sm">
					<strong>Status:</strong> Motion values are reactive values that drive animations
				</Text>
				<Text size="sm" className="mt-2 text-muted-foreground">
					useMotionValue creates motion values that can be used with Framer Motion components. These
					values can be transformed, animated, and synchronized. See useMotionSpring,
					useMotionTransform examples below.
				</Text>
			</Card>
		</ShowcaseSection>
	);
}

import { useInView } from '@core/hooks/motion/useInView';
import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function InViewShowcase() {
	const { ref: inViewRef, inView } = useInView({ threshold: 0.5, triggerOnce: true });

	return (
		<ShowcaseSection
			title="useInView"
			description="Detect when element enters viewport"
			tags={['hook', 'scroll', 'viewport', 'intersection']}
		>
			<div className="space-y-4" ref={inViewRef}>
				<Card variant="outlined" padding="sm">
					<Text size="sm">
						<strong>In View:</strong> {inView ? 'Yes' : 'No'}
					</Text>
					<Text size="sm" className="mt-2 text-muted-foreground">
						Scroll this section into view to see the status change. This element is observed with a
						50% threshold and triggers once.
					</Text>
				</Card>
			</div>
		</ShowcaseSection>
	);
}

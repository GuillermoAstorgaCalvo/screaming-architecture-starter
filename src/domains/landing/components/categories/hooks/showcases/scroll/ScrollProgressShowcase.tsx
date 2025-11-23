import { useScrollProgress } from '@core/hooks/motion/useScrollProgress';
import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ScrollProgressShowcase() {
	const scrollProgress = useScrollProgress();

	return (
		<ShowcaseSection
			title="useScrollProgress"
			description="Track scroll progress as motion value"
			tags={['hook', 'scroll', 'progress', 'animation', 'motion']}
		>
			<Card variant="outlined" padding="sm">
				<Text size="sm">
					<strong>Scroll Progress:</strong> {Math.round(scrollProgress.get() * 100)}%
				</Text>
				<Text size="sm" className="mt-2 text-muted-foreground">
					Scroll the page to see the progress update. This returns a motion value (0-1).
				</Text>
			</Card>
		</ShowcaseSection>
	);
}

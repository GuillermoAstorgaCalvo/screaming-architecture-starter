import { useWindowSize } from '@core/hooks/ui/useWindowSize';
import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function WindowSizeShowcase() {
	const windowSize = useWindowSize();

	return (
		<ShowcaseSection
			title="useWindowSize"
			description="Track window dimensions"
			tags={['hook', 'window', 'size', 'responsive']}
		>
			<Card variant="outlined" padding="sm">
				<Text size="sm">
					<strong>Width:</strong> {windowSize.width}px
				</Text>
				<Text size="sm">
					<strong>Height:</strong> {windowSize.height}px
				</Text>
				<Text size="sm" className="mt-2 text-muted-foreground">
					Resize the window to see updates
				</Text>
			</Card>
		</ShowcaseSection>
	);
}

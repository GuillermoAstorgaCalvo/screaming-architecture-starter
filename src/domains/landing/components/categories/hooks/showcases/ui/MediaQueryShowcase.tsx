import { useMediaQuery } from '@core/hooks/ui/useMediaQuery';
import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function MediaQueryShowcase() {
	const isMobile = useMediaQuery('(max-width: 768px)');

	return (
		<ShowcaseSection
			title="useMediaQuery"
			description="Track media query matches"
			tags={['hook', 'media', 'query', 'responsive']}
		>
			<Card variant="outlined" padding="sm">
				<Text size="sm">
					<strong>Is Mobile (max-width: 768px):</strong> {isMobile ? 'Yes' : 'No'}
				</Text>
			</Card>
		</ShowcaseSection>
	);
}

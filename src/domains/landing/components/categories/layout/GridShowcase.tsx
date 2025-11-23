import Card from '@core/ui/data-display/card/Card';
import Grid from '@core/ui/layout/grid/Grid';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function GridShowcase() {
	return (
		<ShowcaseSection title="Grid" description="Grid layout component" tags={['layout', 'grid']}>
			<Grid
				cols={3}
				gap="md"
				className="rounded-lg border border-border bg-surface p-4 dark:border-border dark:bg-surface"
			>
				<Card variant="outlined" padding="sm">
					<Text size="sm">Grid Item 1</Text>
				</Card>
				<Card variant="outlined" padding="sm">
					<Text size="sm">Grid Item 2</Text>
				</Card>
				<Card variant="outlined" padding="sm">
					<Text size="sm">Grid Item 3</Text>
				</Card>
			</Grid>
		</ShowcaseSection>
	);
}

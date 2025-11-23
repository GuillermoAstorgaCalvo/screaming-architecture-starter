import Card from '@core/ui/data-display/card/Card';
import Stack from '@core/ui/layout/stack/Stack';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function StackShowcase() {
	return (
		<ShowcaseSection title="Stack" description="Stack layout component" tags={['layout', 'stack']}>
			<Stack
				gap="md"
				className="rounded-lg border border-border bg-surface p-4 dark:border-border dark:bg-surface"
			>
				<Card variant="outlined" padding="sm">
					<Text size="sm">Stack Item 1</Text>
				</Card>
				<Card variant="outlined" padding="sm">
					<Text size="sm">Stack Item 2</Text>
				</Card>
				<Card variant="outlined" padding="sm">
					<Text size="sm">Stack Item 3</Text>
				</Card>
			</Stack>
		</ShowcaseSection>
	);
}

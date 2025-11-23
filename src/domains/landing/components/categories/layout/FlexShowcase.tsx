import Card from '@core/ui/data-display/card/Card';
import Flex from '@core/ui/layout/flex/Flex';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function FlexShowcase() {
	return (
		<ShowcaseSection
			title="Flex"
			description="Flexbox layout component"
			tags={['layout', 'flex', 'flexbox']}
		>
			<Flex
				gap="md"
				className="rounded-lg border border-border bg-surface p-4 dark:border-border dark:bg-surface"
			>
				<Card variant="outlined" padding="sm">
					<Text size="sm">Item 1</Text>
				</Card>
				<Card variant="outlined" padding="sm">
					<Text size="sm">Item 2</Text>
				</Card>
				<Card variant="outlined" padding="sm">
					<Text size="sm">Item 3</Text>
				</Card>
			</Flex>
		</ShowcaseSection>
	);
}

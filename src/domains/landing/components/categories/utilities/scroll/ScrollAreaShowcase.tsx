import Text from '@core/ui/text/Text';
import ScrollArea from '@core/ui/utilities/scroll-area/ScrollArea';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ScrollAreaShowcase() {
	return (
		<ShowcaseSection
			title="ScrollArea"
			description="Custom scrollable container"
			tags={['utility', 'scroll', 'container']}
		>
			<ScrollArea className="h-32 w-full rounded-lg border border-border bg-surface p-4 dark:border-border dark:bg-surface">
				<div className="space-y-2">
					<Text>Scrollable content area</Text>
					<Text>Line 1</Text>
					<Text>Line 2</Text>
					<Text>Line 3</Text>
					<Text>Line 4</Text>
					<Text>Line 5</Text>
					<Text>Line 6</Text>
					<Text>Line 7</Text>
					<Text>Line 8</Text>
					<Text>Line 9</Text>
					<Text>Line 10</Text>
				</div>
			</ScrollArea>
		</ShowcaseSection>
	);
}

import Button from '@core/ui/button/Button';
import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function AsyncShowcase() {
	return (
		<ShowcaseSection
			title="useAsync"
			description="Generic async execution hook"
			tags={['hook', 'async', 'promise']}
		>
			<div className="space-y-4">
				<Button
					variant="primary"
					onClick={() => {
						console.warn('Async operation triggered');
					}}
				>
					Trigger Async
				</Button>
				<Card variant="outlined" padding="sm">
					<Text size="sm">
						<strong>Status:</strong> Check console for async operations
					</Text>
					<Text size="sm" className="mt-2 text-muted-foreground">
						useAsync provides flexible async execution with loading, data, and error states
					</Text>
				</Card>
			</div>
		</ShowcaseSection>
	);
}

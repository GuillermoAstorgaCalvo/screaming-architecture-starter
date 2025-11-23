import Button from '@core/ui/button/Button';
import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function FetchShowcase() {
	return (
		<ShowcaseSection
			title="useFetch"
			description="Data fetching hook"
			tags={['hook', 'fetch', 'api', 'data']}
		>
			<div className="space-y-4">
				<Button
					variant="primary"
					onClick={() => {
						console.warn('Fetch triggered');
					}}
				>
					Trigger Fetch
				</Button>
				<Card variant="outlined" padding="sm">
					<Text size="sm">
						<strong>Status:</strong> Check console for fetch operations
					</Text>
					<Text size="sm" className="mt-2 text-muted-foreground">
						useFetch provides loading, data, error states and automatic request management
					</Text>
				</Card>
			</div>
		</ShowcaseSection>
	);
}

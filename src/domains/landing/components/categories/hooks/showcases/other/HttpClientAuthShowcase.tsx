import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function HttpClientAuthShowcase() {
	return (
		<ShowcaseSection
			title="useHttpClientAuth"
			description="Attach auth interceptor to HTTP client"
			tags={['hook', 'http', 'auth', 'api']}
		>
			<Card variant="outlined" padding="sm">
				<Text size="sm">
					<strong>Status:</strong> Documentation only
				</Text>
				<Text size="sm" className="mt-2 text-muted-foreground">
					useHttpClientAuth attaches an authentication token interceptor to the HTTP client. It
					requires an AuthPort adapter and is typically used in app-level providers.
				</Text>
			</Card>
		</ShowcaseSection>
	);
}

import ErrorBoundaryUI from '@core/ui/error-boundary/ErrorBoundaryUI';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ErrorBoundaryShowcase() {
	return (
		<ShowcaseSection
			title="ErrorBoundary"
			description="Error boundary component"
			tags={['error', 'boundary', 'error-handling']}
		>
			<ErrorBoundaryUI error={null} onRetry={() => {}}>
				<Text>This content is wrapped in an error boundary.</Text>
			</ErrorBoundaryUI>
		</ShowcaseSection>
	);
}

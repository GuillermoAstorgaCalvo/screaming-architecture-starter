import StatusIndicator from '@core/ui/data-display/status-indicator/StatusIndicator';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function StatusIndicatorShowcase() {
	return (
		<ShowcaseSection
			title="StatusIndicator"
			description="Status indicator component"
			tags={['data', 'status', 'indicator', 'badge']}
		>
			<div className="flex flex-wrap gap-4">
				<StatusIndicator status="online" variant="badge" label="Online" />
				<StatusIndicator status="offline" variant="badge" label="Offline" />
				<StatusIndicator status="busy" variant="dot" />
				<StatusIndicator status="away" variant="dot" animated />
			</div>
		</ShowcaseSection>
	);
}

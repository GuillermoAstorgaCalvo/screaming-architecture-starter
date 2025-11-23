import Alert from '@core/ui/feedback/alert/Alert';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function AlertShowcase() {
	return (
		<ShowcaseSection
			title="Alert"
			description="Alert notification component"
			tags={['feedback', 'alert', 'notification']}
		>
			<div className="space-y-4">
				<Alert intent="info" title="Info Alert" description="This is an informational alert." />
				<Alert
					intent="success"
					title="Success Alert"
					description="Operation completed successfully."
				/>
				<Alert intent="warning" title="Warning Alert" description="Please review this warning." />
				<Alert intent="error" title="Error Alert" description="An error has occurred." />
				<Alert intent="info" onDismiss={() => {}}>
					Dismissible alert
				</Alert>
			</div>
		</ShowcaseSection>
	);
}

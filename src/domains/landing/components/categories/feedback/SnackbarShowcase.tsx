import { useSnackbar } from '@core/providers/snackbar/useSnackbar';
import Button from '@core/ui/button/Button';
import Snackbar from '@core/ui/feedback/snackbar/Snackbar';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';
import { useState } from 'react';

export function SnackbarShowcase() {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const snackbar = useSnackbar();

	return (
		<ShowcaseSection
			title="Snackbar"
			description="Snackbar notification component"
			tags={['feedback', 'snackbar', 'notification']}
		>
			<div className="space-y-4">
				<div className="flex flex-wrap gap-4">
					<Button variant="primary" onClick={() => setSnackbarOpen(true)}>
						Show Snackbar
					</Button>
					<Button variant="secondary" onClick={() => snackbar.success('Success snackbar!')}>
						Show Success (Provider)
					</Button>
					<Button variant="ghost" onClick={() => snackbar.error('Error snackbar!')}>
						Show Error (Provider)
					</Button>
				</div>
				<Snackbar
					isOpen={snackbarOpen}
					onDismiss={() => setSnackbarOpen(false)}
					message="This is a snackbar notification"
					intent="info"
				/>
			</div>
		</ShowcaseSection>
	);
}

import { useToast } from '@core/providers/toast/useToast';
import Button from '@core/ui/button/Button';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ToastShowcase() {
	const toast = useToast();

	return (
		<ShowcaseSection
			title="Toast"
			description="Toast notification component (use buttons to test)"
			tags={['feedback', 'toast', 'notification']}
		>
			<div className="flex flex-wrap gap-4">
				<Button variant="primary" onClick={() => toast.success('Success toast notification!')}>
					Show Success Toast
				</Button>
				<Button variant="secondary" onClick={() => toast.error('Error toast notification!')}>
					Show Error Toast
				</Button>
				<Button variant="ghost" onClick={() => toast.warning('Warning toast notification!')}>
					Show Warning Toast
				</Button>
				<Button variant="primary" onClick={() => toast.info('Info toast notification!')}>
					Show Info Toast
				</Button>
			</div>
		</ShowcaseSection>
	);
}

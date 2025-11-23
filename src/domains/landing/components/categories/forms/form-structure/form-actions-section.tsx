import Button from '@core/ui/button/Button';
import FormActions from '@core/ui/forms/form-actions/FormActions';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function FormActionsSection() {
	return (
		<ShowcaseSection
			title="FormActions"
			description="Container for submit/cancel button groups"
			tags={['form', 'button', 'action', 'layout']}
		>
			<div className="space-y-4">
				<FormActions align="end" gap="md">
					<Button variant="secondary">Cancel</Button>
					<Button variant="primary">Submit</Button>
				</FormActions>
				<FormActions align="space-between" gap="lg" fullWidth>
					<Button variant="ghost">Reset</Button>
					<Button variant="primary">Save Changes</Button>
				</FormActions>
				<FormActions align="center" gap="sm">
					<Button variant="primary" size="sm">
						Save
					</Button>
					<Button variant="secondary" size="sm">
						Cancel
					</Button>
				</FormActions>
			</div>
		</ShowcaseSection>
	);
}

import FormWizard from '@core/ui/forms/form-wizard/FormWizard';
import Text from '@core/ui/text/Text';
import { getFormWizardSteps } from '@domains/landing/components/categories/forms/wizard-config';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';
import { useMemo } from 'react';

export function FormWizardSection() {
	const formWizardSteps = useMemo(() => getFormWizardSteps(), []);

	return (
		<ShowcaseSection
			title="FormWizard"
			description="Multi-step form wizard with react-hook-form validation (simplified demo)"
			tags={['form', 'wizard', 'validation', 'multi-step']}
		>
			<div className="space-y-4">
				<Text size="sm" className="text-muted-foreground">
					FormWizard requires react-hook-form setup. This is a simplified demonstration. In a real
					application, you would configure form validation, default values, and form resolvers.
				</Text>
				<FormWizard
					steps={formWizardSteps}
					onComplete={data => {
						console.warn('FormWizard completed with data:', data);
					}}
					showProgress
					allowBackNavigation
				/>
			</div>
		</ShowcaseSection>
	);
}

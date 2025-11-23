import Wizard from '@core/ui/forms/wizard/Wizard';
import { getWizardSteps } from '@domains/landing/components/categories/forms/wizard-config';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function WizardSection() {
	return (
		<ShowcaseSection
			title="Wizard"
			description="Multi-step form wizard with navigation"
			tags={['form', 'wizard', 'navigation', 'multi-step']}
		>
			<div className="space-y-4">
				<Wizard
					steps={getWizardSteps()}
					onComplete={() => {
						console.warn('Wizard completed!');
					}}
					showProgress
					allowBackNavigation
				/>
			</div>
		</ShowcaseSection>
	);
}

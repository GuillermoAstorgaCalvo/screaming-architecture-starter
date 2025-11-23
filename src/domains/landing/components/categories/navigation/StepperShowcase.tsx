import Stepper from '@core/ui/navigation/stepper/Stepper';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';
import { useState } from 'react';

export function StepperShowcase() {
	const [activeStep, setActiveStep] = useState(0);

	return (
		<ShowcaseSection
			title="Stepper"
			description="Step-by-step progress indicator"
			tags={['navigation', 'stepper', 'step', 'wizard']}
		>
			<Stepper
				steps={[
					{ id: 'step1', label: 'Step 1' },
					{ id: 'step2', label: 'Step 2' },
					{ id: 'step3', label: 'Step 3' },
					{ id: 'step4', label: 'Step 4' },
				]}
				activeStep={activeStep}
				onStepClick={setActiveStep}
			/>
		</ShowcaseSection>
	);
}

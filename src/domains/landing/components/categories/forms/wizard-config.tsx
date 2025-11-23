import Input from '@core/ui/forms/input/Input';

import { ContactInfoStep, PersonalInfoStep } from './wizard-steps';

export const getWizardSteps = () => [
	{
		id: 'step1',
		label: 'Personal Info',
		content: (
			<div className="space-y-4">
				<Input label="First Name" placeholder="John" />
				<Input label="Last Name" placeholder="Doe" />
			</div>
		),
	},
	{
		id: 'step2',
		label: 'Contact',
		content: (
			<div className="space-y-4">
				<Input label="Email" type="email" placeholder="john@example.com" />
				<Input label="Phone" placeholder="+1 234 567 8900" />
			</div>
		),
	},
	{
		id: 'step3',
		label: 'Review',
		content: <div>Review your information and submit</div>,
	},
];

export const getFormWizardSteps = () => [
	{
		id: 'personal',
		label: 'Personal Info',
		content: PersonalInfoStep,
	},
	{
		id: 'contact',
		label: 'Contact Info',
		content: ContactInfoStep,
	},
];

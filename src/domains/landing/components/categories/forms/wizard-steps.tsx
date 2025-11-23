import Input from '@core/ui/forms/input/Input';

// FormWizard step content components
export const PersonalInfoStep = (_formControls: unknown) => (
	<div className="space-y-4">
		<Input label="Name" placeholder="Enter your name" />
		<Input label="Age" type="number" placeholder="Enter your age" />
	</div>
);

export const ContactInfoStep = (_formControls: unknown) => (
	<div className="space-y-4">
		<Input label="Email" type="email" placeholder="Enter your email" />
		<Input label="Phone" placeholder="Enter your phone" />
	</div>
);

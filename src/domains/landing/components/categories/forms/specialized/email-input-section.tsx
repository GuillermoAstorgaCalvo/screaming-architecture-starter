import EmailInput from '@core/ui/forms/email-input/EmailInput';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderEmailInputSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="EmailInput"
			description="Email input component with validation"
			tags={['form', 'input', 'email', 'validation']}
		>
			<div className="space-y-4">
				<EmailInput
					label="Email Address"
					value={state.emailValue}
					onChange={e => state.setEmailValue(e.target.value)}
				/>
				<EmailInput
					label="Email with Error"
					value="invalid-email"
					error="Please enter a valid email address"
				/>
			</div>
		</ShowcaseSection>
	);
}

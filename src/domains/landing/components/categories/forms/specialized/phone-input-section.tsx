import PhoneInput from '@core/ui/forms/phone-input/PhoneInput';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderPhoneInputSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="PhoneInput"
			description="Phone number input component"
			tags={['form', 'input', 'phone', 'number']}
		>
			<div className="space-y-4">
				<PhoneInput
					label="Phone Number"
					value={state.phoneValue}
					onChange={e => state.setPhoneValue(e.target.value)}
				/>
			</div>
		</ShowcaseSection>
	);
}

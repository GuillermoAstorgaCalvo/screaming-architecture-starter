import PasswordInput from '@core/ui/forms/password-input/PasswordInput';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderPasswordInputSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="PasswordInput"
			description="Password input component with show/hide toggle"
			tags={['form', 'input', 'password', 'security']}
		>
			<div className="space-y-4">
				<PasswordInput
					label="Password"
					value={state.passwordValue}
					onChange={e => state.setPasswordValue(e.target.value)}
				/>
				<PasswordInput
					label="Password with Helper Text"
					helperText="Must be at least 8 characters"
				/>
			</div>
		</ShowcaseSection>
	);
}

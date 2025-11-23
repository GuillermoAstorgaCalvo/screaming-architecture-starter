import OTPInput from '@core/ui/forms/otp-input/OTPInput';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderOTPInputSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="OTPInput"
			description="One-Time Password input component"
			tags={['form', 'input', 'otp', 'password', 'security']}
		>
			<div className="space-y-4">
				<OTPInput
					label="Enter OTP"
					length={6}
					value={state.otpValue}
					onChange={state.setOtpValue}
				/>
			</div>
		</ShowcaseSection>
	);
}

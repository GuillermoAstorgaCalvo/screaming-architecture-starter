import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';

import { renderColorInputSection } from './specialized/color-input-section';
import { renderColorPickerSection } from './specialized/color-picker-section';
import { renderCurrencyInputSection } from './specialized/currency-input-section';
import { renderEmailInputSection } from './specialized/email-input-section';
import { renderOTPInputSection } from './specialized/otp-input-section';
import { renderPasswordInputSection } from './specialized/password-input-section';
import { renderPhoneInputSection } from './specialized/phone-input-section';
import { renderRatingSection } from './specialized/rating-section';
import { renderTagInputSection } from './specialized/tag-input-section';

export function renderSpecialized(state: FormsCategoryState) {
	return (
		<div className="space-y-8">
			{renderEmailInputSection(state)}
			{renderPasswordInputSection(state)}
			{renderPhoneInputSection(state)}
			{renderOTPInputSection(state)}
			{renderCurrencyInputSection(state)}
			{renderColorInputSection(state)}
			{renderColorPickerSection(state)}
			{renderTagInputSection(state)}
			{renderRatingSection(state)}
		</div>
	);
}

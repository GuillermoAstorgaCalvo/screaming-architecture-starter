import { getInputVariantClasses } from '@core/ui/variants/input';
import type { StandardSize } from '@src-types/ui/base';

import type { CountryCode } from './PhoneInputTypes';

export interface GetPhoneInputClassesOptions {
	size: StandardSize;
	hasError: boolean;
	className?: string | undefined;
}

export function getPhoneInputClasses(options: GetPhoneInputClassesOptions): string {
	return getInputVariantClasses({
		size: options.size,
		state: options.hasError ? 'error' : 'normal',
		hasLeftIcon: true, // Always has country code selector
		hasRightIcon: false,
		className: options.className,
	});
}

export function getAriaDescribedBy(
	inputId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${inputId}-error`);
	if (helperText) ids.push(`${inputId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generatePhoneInputId(
	generatedId: string,
	inputId?: string,
	label?: string
): string | undefined {
	if (inputId) {
		return inputId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `phone-input-${cleanId}`;
}

/**
 * Common country codes for phone input
 */
export const COUNTRY_CODES: readonly CountryCode[] = [
	{ code: 'US', dialCode: '+1', name: 'United States' },
	{ code: 'GB', dialCode: '+44', name: 'United Kingdom' },
	{ code: 'CA', dialCode: '+1', name: 'Canada' },
	{ code: 'AU', dialCode: '+61', name: 'Australia' },
	{ code: 'DE', dialCode: '+49', name: 'Germany' },
	{ code: 'FR', dialCode: '+33', name: 'France' },
	{ code: 'IT', dialCode: '+39', name: 'Italy' },
	{ code: 'ES', dialCode: '+34', name: 'Spain' },
	{ code: 'NL', dialCode: '+31', name: 'Netherlands' },
	{ code: 'BE', dialCode: '+32', name: 'Belgium' },
	{ code: 'CH', dialCode: '+41', name: 'Switzerland' },
	{ code: 'AT', dialCode: '+43', name: 'Austria' },
	{ code: 'SE', dialCode: '+46', name: 'Sweden' },
	{ code: 'NO', dialCode: '+47', name: 'Norway' },
	{ code: 'DK', dialCode: '+45', name: 'Denmark' },
	{ code: 'FI', dialCode: '+358', name: 'Finland' },
	{ code: 'PL', dialCode: '+48', name: 'Poland' },
	{ code: 'IE', dialCode: '+353', name: 'Ireland' },
	{ code: 'PT', dialCode: '+351', name: 'Portugal' },
	{ code: 'GR', dialCode: '+30', name: 'Greece' },
	{ code: 'JP', dialCode: '+81', name: 'Japan' },
	{ code: 'CN', dialCode: '+86', name: 'China' },
	{ code: 'IN', dialCode: '+91', name: 'India' },
	{ code: 'BR', dialCode: '+55', name: 'Brazil' },
	{ code: 'MX', dialCode: '+52', name: 'Mexico' },
	{ code: 'AR', dialCode: '+54', name: 'Argentina' },
	{ code: 'ZA', dialCode: '+27', name: 'South Africa' },
	{ code: 'NZ', dialCode: '+64', name: 'New Zealand' },
	{ code: 'SG', dialCode: '+65', name: 'Singapore' },
	{ code: 'HK', dialCode: '+852', name: 'Hong Kong' },
] as const;

/**
 * Get country code by dial code
 */
export function getCountryCodeByDialCode(dialCode: string): CountryCode | undefined {
	return COUNTRY_CODES.find(country => country.dialCode === dialCode);
}

/**
 * Get default country code (US)
 */
export function getDefaultCountryCode(): CountryCode {
	const [defaultCode] = COUNTRY_CODES;
	if (!defaultCode) {
		throw new Error('No country codes available');
	}
	return defaultCode;
}

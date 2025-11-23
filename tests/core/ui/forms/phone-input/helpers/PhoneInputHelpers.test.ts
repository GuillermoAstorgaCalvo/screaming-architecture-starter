/**
 * PhoneInputHelpers Tests
 *
 * Tests for helper functions:
 * - getPhoneInputClasses
 * - getAriaDescribedBy
 * - generatePhoneInputId
 * - COUNTRY_CODES constant
 * - getCountryCodeByDialCode
 * - getDefaultCountryCode
 */

import {
	COUNTRY_CODES,
	generatePhoneInputId,
	getAriaDescribedBy,
	getCountryCodeByDialCode,
	getDefaultCountryCode,
	getPhoneInputClasses,
} from '@core/ui/forms/phone-input/helpers/PhoneInputHelpers';
import { describe, expect, it } from 'vitest';

describe('getPhoneInputClasses', () => {
	it('should be a function', () => {
		expect(typeof getPhoneInputClasses).toBe('function');
	});

	it('should return classes for small size without error', () => {
		const classes = getPhoneInputClasses({
			size: 'sm',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for medium size without error', () => {
		const classes = getPhoneInputClasses({
			size: 'md',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for large size without error', () => {
		const classes = getPhoneInputClasses({
			size: 'lg',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return different classes for different sizes', () => {
		const smClasses = getPhoneInputClasses({ size: 'sm', hasError: false });
		const mdClasses = getPhoneInputClasses({ size: 'md', hasError: false });
		const lgClasses = getPhoneInputClasses({ size: 'lg', hasError: false });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('should return error state classes when hasError is true', () => {
		const normalClasses = getPhoneInputClasses({
			size: 'md',
			hasError: false,
		});
		const errorClasses = getPhoneInputClasses({
			size: 'md',
			hasError: true,
		});

		expect(errorClasses).not.toBe(normalClasses);
		expect(typeof errorClasses).toBe('string');
		expect(errorClasses.length).toBeGreaterThan(0);
	});

	it('should merge custom className', () => {
		const customClass = 'custom-phone-input-class';
		const classes = getPhoneInputClasses({
			size: 'md',
			hasError: false,
			className: customClass,
		});
		expect(classes).toContain(customClass);
	});

	it('should work with undefined className', () => {
		const classes = getPhoneInputClasses({
			size: 'md',
			hasError: false,
			className: undefined,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should combine all props correctly', () => {
		const customClass = 'my-custom-class';
		const classes = getPhoneInputClasses({
			size: 'lg',
			hasError: true,
			className: customClass,
		});
		expect(classes).toContain(customClass);
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getAriaDescribedBy', () => {
	it('should be a function', () => {
		expect(typeof getAriaDescribedBy).toBe('function');
	});

	it('should return undefined when no error or helperText', () => {
		const result = getAriaDescribedBy('phone-input-1');
		expect(result).toBeUndefined();
	});

	it('should return error ID when only error is provided', () => {
		const inputId = 'phone-input-1';
		const error = 'This field is required';
		const result = getAriaDescribedBy(inputId, error);
		expect(result).toBe(`${inputId}-error`);
	});

	it('should return helper ID when only helperText is provided', () => {
		const inputId = 'phone-input-1';
		const helperText = 'Enter your phone number';
		const result = getAriaDescribedBy(inputId, undefined, helperText);
		expect(result).toBe(`${inputId}-helper`);
	});

	it('should return both IDs when error and helperText are provided', () => {
		const inputId = 'phone-input-1';
		const error = 'Invalid phone number';
		const helperText = 'Enter your phone number';
		const result = getAriaDescribedBy(inputId, error, helperText);
		expect(result).toBe(`${inputId}-error ${inputId}-helper`);
	});

	it('should handle different inputId values', () => {
		const inputId = 'my-custom-phone-input';
		const error = 'Error message';
		const result = getAriaDescribedBy(inputId, error);
		expect(result).toBe(`${inputId}-error`);
	});

	it('should return undefined for empty string error (falsy check)', () => {
		const inputId = 'phone-input-1';
		const result = getAriaDescribedBy(inputId, '');
		expect(result).toBeUndefined();
	});

	it('should return undefined for empty string helperText (falsy check)', () => {
		const inputId = 'phone-input-1';
		const result = getAriaDescribedBy(inputId, undefined, '');
		expect(result).toBeUndefined();
	});

	it('should return undefined for both empty strings (falsy check)', () => {
		const inputId = 'phone-input-1';
		const result = getAriaDescribedBy(inputId, '', '');
		expect(result).toBeUndefined();
	});
});

describe('generatePhoneInputId', () => {
	it('should be a function', () => {
		expect(typeof generatePhoneInputId).toBe('function');
	});

	it('should return inputId when provided', () => {
		const customId = 'my-custom-id';
		const result = generatePhoneInputId('generated:123', customId);
		expect(result).toBe(customId);
	});

	it('should return inputId even when label is provided', () => {
		const customId = 'my-custom-id';
		const result = generatePhoneInputId('generated:123', customId, 'Phone Label');
		expect(result).toBe(customId);
	});

	it('should return undefined when no inputId and no label', () => {
		const result = generatePhoneInputId('generated:123');
		expect(result).toBeUndefined();
	});

	it('should return undefined when no inputId and empty label', () => {
		const result = generatePhoneInputId('generated:123', undefined, '');
		expect(result).toBeUndefined();
	});

	it('should generate ID from label when inputId is not provided', () => {
		const generatedId = 'generated:123';
		const label = 'Phone Label';
		const result = generatePhoneInputId(generatedId, undefined, label);
		expect(result).toBe('phone-input-generated123');
	});

	it('should remove colons from generatedId', () => {
		const generatedId = 'generated:123:456';
		const label = 'Phone Label';
		const result = generatePhoneInputId(generatedId, undefined, label);
		expect(result).toBe('phone-input-generated123456');
	});

	it('should handle generatedId with multiple colons', () => {
		const generatedId = 'form:field:phone:input';
		const label = 'Phone';
		const result = generatePhoneInputId(generatedId, undefined, label);
		expect(result).toBe('phone-input-formfieldphoneinput');
	});

	it('should handle generatedId without colons', () => {
		const generatedId = 'generated123';
		const label = 'Phone Label';
		const result = generatePhoneInputId(generatedId, undefined, label);
		expect(result).toBe('phone-input-generated123');
	});

	it('should handle empty generatedId with label', () => {
		const generatedId = '';
		const label = 'Phone Label';
		const result = generatePhoneInputId(generatedId, undefined, label);
		expect(result).toBe('phone-input-');
	});

	it('should prioritize inputId over label', () => {
		const customId = 'custom-id';
		const generatedId = 'generated:123';
		const label = 'Phone Label';
		const result = generatePhoneInputId(generatedId, customId, label);
		expect(result).toBe(customId);
	});
});

describe('COUNTRY_CODES', () => {
	it('should be a readonly array', () => {
		expect(Array.isArray(COUNTRY_CODES)).toBe(true);
		expect(COUNTRY_CODES.length).toBeGreaterThan(0);
	});

	it('should contain common country codes', () => {
		const codes = COUNTRY_CODES.map(country => country.dialCode);
		expect(codes).toContain('+1'); // US
		expect(codes).toContain('+44'); // UK
		expect(codes).toContain('+33'); // France
		expect(codes).toContain('+49'); // Germany
	});

	it('should have country code objects with code, dialCode, and name', () => {
		const firstCountry = COUNTRY_CODES[0];
		expect(firstCountry).toBeDefined();
		if (firstCountry) {
			expect(firstCountry).toHaveProperty('code');
			expect(firstCountry).toHaveProperty('dialCode');
			expect(firstCountry).toHaveProperty('name');
			expect(typeof firstCountry.code).toBe('string');
			expect(typeof firstCountry.dialCode).toBe('string');
			expect(typeof firstCountry.name).toBe('string');
		}
	});

	it('should have dial codes starting with +', () => {
		for (const country of COUNTRY_CODES) {
			expect(country.dialCode).toMatch(/^\+/);
		}
	});
});

describe('getCountryCodeByDialCode', () => {
	it('should be a function', () => {
		expect(typeof getCountryCodeByDialCode).toBe('function');
	});

	it('should return country code for valid dial code', () => {
		const result = getCountryCodeByDialCode('+1');
		expect(result).toBeDefined();
		expect(result?.dialCode).toBe('+1');
	});

	it('should return country code for UK dial code', () => {
		const result = getCountryCodeByDialCode('+44');
		expect(result).toBeDefined();
		expect(result?.dialCode).toBe('+44');
		expect(result?.code).toBe('GB');
	});

	it('should return country code for France dial code', () => {
		const result = getCountryCodeByDialCode('+33');
		expect(result).toBeDefined();
		expect(result?.dialCode).toBe('+33');
		expect(result?.code).toBe('FR');
	});

	it('should return undefined for invalid dial code', () => {
		const result = getCountryCodeByDialCode('+999');
		expect(result).toBeUndefined();
	});

	it('should return undefined for empty string', () => {
		const result = getCountryCodeByDialCode('');
		expect(result).toBeUndefined();
	});

	it('should handle dial codes with different lengths', () => {
		const twoDigit = getCountryCodeByDialCode('+1');
		const threeDigit = getCountryCodeByDialCode('+358');
		const fourDigit = getCountryCodeByDialCode('+852');

		expect(twoDigit).toBeDefined();
		expect(threeDigit).toBeDefined();
		expect(fourDigit).toBeDefined();
	});
});

describe('getDefaultCountryCode', () => {
	it('should be a function', () => {
		expect(typeof getDefaultCountryCode).toBe('function');
	});

	it('should return the first country code from COUNTRY_CODES', () => {
		const result = getDefaultCountryCode();
		expect(result).toBeDefined();
		expect(result).toEqual(COUNTRY_CODES[0]);
	});

	it('should return US country code as default', () => {
		const result = getDefaultCountryCode();
		expect(result.dialCode).toBe('+1');
		expect(result.code).toBe('US');
	});

	it('should return country code with all required properties', () => {
		const result = getDefaultCountryCode();
		expect(result).toHaveProperty('code');
		expect(result).toHaveProperty('dialCode');
		expect(result).toHaveProperty('name');
		expect(typeof result.code).toBe('string');
		expect(typeof result.dialCode).toBe('string');
		expect(typeof result.name).toBe('string');
	});
});

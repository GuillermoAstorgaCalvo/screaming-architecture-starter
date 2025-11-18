import {
	CREDIT_CARD_REGEX,
	EMAIL_REGEX,
	HEX_COLOR_REGEX,
	IPV4_REGEX,
	IPV6_REGEX,
	PASSWORD_MIN_REGEX,
	PASSWORD_STRONG_REGEX,
	PHONE_REGEX,
	SLUG_REGEX,
	testRegex,
	URL_REGEX,
	USERNAME_REGEX,
	UUID_REGEX,
	ZIP_CODE_REGEX,
} from '@core/constants/regex';
import { describe, expect, it } from 'vitest';

interface RegexCase {
	label: string;
	pattern: RegExp;
	valid: string[];
	invalid: string[];
}

const regexCases: RegexCase[] = [
	{
		label: 'EMAIL_REGEX',
		pattern: EMAIL_REGEX,
		valid: ['user@example.com', 'first.last+tag@sub.domain.co'],
		invalid: ['plainaddress', 'user@', 'user@example', 'user@@example.com'],
	},
	{
		label: 'URL_REGEX',
		pattern: URL_REGEX,
		valid: ['http://example.com', 'https://sub.example.co/path?query=1'],
		invalid: ['ftp://example.com', 'http:/example.com', 'https://'],
	},
	{
		label: 'PHONE_REGEX',
		pattern: PHONE_REGEX,
		valid: ['1234567', '+1 (555) 123-4567', '555-123-4567'],
		invalid: ['123', 'abc-defg', '123456789012345678901'],
	},
	{
		label: 'IPV4_REGEX',
		pattern: IPV4_REGEX,
		valid: ['192.168.0.1', '8.8.8.8'],
		invalid: ['192.168.0', '192.168.0.1.1', 'abc.def.ghi.jkl'],
	},
	{
		label: 'IPV6_REGEX',
		pattern: IPV6_REGEX,
		valid: [
			'2001:0db8:85a3:0000:0000:8a2e:0370:7334',
			'FE80:0000:0000:0000:0202:B3FF:FE1E:8329',
			'::1',
		],
		invalid: ['2001:db8::1', 'GGGG:0000:0000:0000:0000:0000:0000:0001'],
	},
	{
		label: 'PASSWORD_MIN_REGEX',
		pattern: PASSWORD_MIN_REGEX,
		valid: ['abcde123', 'Password1', 'P@ssw0rd!'],
		invalid: ['short1', 'nonumbers', '12345678'],
	},
	{
		label: 'PASSWORD_STRONG_REGEX',
		pattern: PASSWORD_STRONG_REGEX,
		valid: ['Abcdef1!', 'Z9yXwVu1$'],
		invalid: ['abcdef1!', 'ABCDEFG1!', 'Abcdefgh'],
	},
	{
		label: 'USERNAME_REGEX',
		pattern: USERNAME_REGEX,
		valid: ['user_name', 'john-doe', 'abc123'],
		invalid: ['ab', 'usernamewithtoolongvalue', 'bad!*name'],
	},
	{
		label: 'SLUG_REGEX',
		pattern: SLUG_REGEX,
		valid: ['my-slug', 'slug123', 'a'],
		invalid: ['-leading', 'trailing-', 'Slug', 'my slug'],
	},
	{
		label: 'UUID_REGEX',
		pattern: UUID_REGEX,
		valid: ['123e4567-e89b-42d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440000'],
		invalid: ['123e4567-e89b-22d3-a456-426614174000', '550e8400e29b41d4a716446655440000'],
	},
	{
		label: 'HEX_COLOR_REGEX',
		pattern: HEX_COLOR_REGEX,
		valid: ['#fff', '#1A2B3C'],
		invalid: ['#zzzzzz', '123456', '#12345'],
	},
	{
		label: 'CREDIT_CARD_REGEX',
		pattern: CREDIT_CARD_REGEX,
		valid: ['4242424242424242', '1234567890123', '1234567890123456789'],
		invalid: ['4242 4242 4242 4242', '123456', '1234567890123456789010'],
	},
	{
		label: 'ZIP_CODE_REGEX',
		pattern: ZIP_CODE_REGEX,
		valid: ['12345', '12345-6789'],
		invalid: ['1234', '123456', '12345_6789'],
	},
];

describe('regex constants', () => {
	for (const { label, pattern, valid, invalid } of regexCases) {
		describe(label, () => {
			it('matches valid inputs', () => {
				for (const value of valid) {
					expect(pattern.test(value)).toBe(true);
				}
			});

			it('rejects invalid inputs', () => {
				for (const value of invalid) {
					expect(pattern.test(value)).toBe(false);
				}
			});
		});
	}
});

describe('testRegex helper', () => {
	it('returns true for matching input', () => {
		expect(testRegex(EMAIL_REGEX, 'test@example.com')).toBe(true);
	});

	it('returns false for non-matching input', () => {
		expect(testRegex(EMAIL_REGEX, 'invalid-email')).toBe(false);
	});
});

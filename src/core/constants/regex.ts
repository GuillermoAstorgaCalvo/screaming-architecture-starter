/**
 * Regular expression patterns
 * Central source of truth for validation patterns
 * Use these constants instead of creating inline regex patterns
 *
 * All patterns are compiled RegExp objects ready to use
 * Patterns are designed to avoid ReDoS vulnerabilities by avoiding nested quantifiers
 */

/**
 * Email validation pattern
 * Validates standard email format (RFC 5322 simplified)
 * Allows most common email formats but may not catch all edge cases
 *
 * @example
 * ```ts
 * if (EMAIL_REGEX.test(email)) {
 *   // valid email
 * }
 * ```
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * URL validation pattern
 * Validates HTTP/HTTPS URLs and common protocols
 * Simplified pattern - validates basic URL structure
 * For strict validation, consider using the URL constructor
 *
 * @example
 * ```ts
 * if (URL_REGEX.test(url)) {
 *   // valid URL format
 * }
 * ```
 */
export const URL_REGEX = /^https?:\/\/[\w.-]+\.[a-z]{2,}/i;

/**
 * Phone number validation pattern
 * Validates common phone number formats
 * Supports formats with or without country codes, dashes, spaces, parentheses
 * Simplified to reduce complexity - validates basic phone number format
 *
 * @example
 * ```ts
 * if (PHONE_REGEX.test(phone)) {
 *   // valid phone number
 * }
 * ```
 */
export const PHONE_REGEX = /^[\d\s()+.-]{7,20}$/;

/**
 * IPv4 address validation pattern
 * Validates IPv4 addresses (0.0.0.0 - 255.255.255.255)
 * Simplified pattern - for strict validation, parse the octets separately
 * Note: This pattern accepts any 1-3 digit numbers; validate range (0-255) separately if needed
 *
 * @example
 * ```ts
 * if (IPV4_REGEX.test(ip)) {
 *   // valid IPv4 format (check octet ranges separately if strict validation needed)
 * }
 * ```
 */
export const IPV4_REGEX = /^(?:\d{1,3}\.){3}\d{1,3}$/;

/**
 * IPv6 address validation pattern (simplified)
 * Validates IPv6 addresses in common formats
 * Note: Full IPv6 validation is complex; this covers most common cases
 *
 * @example
 * ```ts
 * if (IPV6_REGEX.test(ip)) {
 *   // valid IPv6
 * }
 * ```
 */
export const IPV6_REGEX = /^(?:[\da-f]{1,4}:){7}[\da-f]{1,4}$|^:{2}1$|^:{2}$/i;

/**
 * Password strength pattern - at least 8 characters, one letter and one number
 * Minimum password strength requirement
 *
 * @example
 * ```ts
 * if (PASSWORD_MIN_REGEX.test(password)) {
 *   // meets minimum requirements
 * }
 * ```
 */
export const PASSWORD_MIN_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[\d!#$%&*?@A-Za-z]{8,}$/;

/**
 * Password strength pattern - strong password
 * Requires uppercase, lowercase, number, and special character
 *
 * @example
 * ```ts
 * if (PASSWORD_STRONG_REGEX.test(password)) {
 *   // strong password
 * }
 * ```
 */
export const PASSWORD_STRONG_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$%&*?@])[\d!$%&*?@A-Za-z]{8,}$/;

/**
 * Username validation pattern
 * Allows alphanumeric characters, underscores, and hyphens
 * Typically 3-20 characters long
 *
 * @example
 * ```ts
 * if (USERNAME_REGEX.test(username)) {
 *   // valid username format
 * }
 * ```
 */
export const USERNAME_REGEX = /^[\w-]{3,20}$/;

/**
 * Slug validation pattern
 * Validates URL-friendly slugs (lowercase letters, numbers, hyphens)
 * Pattern avoids nested quantifiers to prevent ReDoS vulnerabilities
 * Requires alphanumeric characters, allows single hyphens between segments
 *
 * @example
 * ```ts
 * if (SLUG_REGEX.test(slug)) {
 *   // valid slug
 * }
 * ```
 */
export const SLUG_REGEX = /^[\da-z][\da-z-]*[\da-z]$|^[\da-z]$/;

/**
 * UUID validation pattern
 * Validates UUID v4 format (most common)
 *
 * @example
 * ```ts
 * if (UUID_REGEX.test(uuid)) {
 *   // valid UUID
 * }
 * ```
 */
export const UUID_REGEX = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;

/**
 * Hex color validation pattern
 * Validates hex color codes (#RRGGBB or #RGB format)
 *
 * @example
 * ```ts
 * if (HEX_COLOR_REGEX.test(color)) {
 *   // valid hex color
 * }
 * ```
 */
export const HEX_COLOR_REGEX = /^#([\dA-Fa-f]{6}|[\dA-Fa-f]{3})$/;

/**
 * Credit card number validation pattern (simplified)
 * Validates basic credit card format (13-19 digits)
 * Note: This doesn't validate Luhn algorithm, just format
 *
 * @example
 * ```ts
 * if (CREDIT_CARD_REGEX.test(card)) {
 *   // valid format (run Luhn check separately)
 * }
 * ```
 */
export const CREDIT_CARD_REGEX = /^\d{13,19}$/;

/**
 * ZIP code validation pattern (US format)
 * Validates US ZIP codes (5 digits or 5+4 format)
 *
 * @example
 * ```ts
 * if (ZIP_CODE_REGEX.test(zip)) {
 *   // valid US ZIP code
 * }
 * ```
 */
export const ZIP_CODE_REGEX = /^\d{5}$|^\d{5}-\d{4}$/;

/**
 * Helper function to test a string against a pattern
 * Convenience wrapper for regex.test()
 *
 * @param pattern - The regex pattern to test against
 * @param value - The string value to test
 * @returns True if the value matches the pattern
 *
 * @example
 * ```ts
 * const isValid = testRegex(EMAIL_REGEX, userInput);
 * ```
 */
export function testRegex(pattern: RegExp, value: string): boolean {
	return pattern.test(value);
}

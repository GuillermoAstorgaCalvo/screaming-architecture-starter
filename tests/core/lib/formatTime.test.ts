import { formatTime } from '@core/lib/formatTime';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('core/lib/formatTime', () => {
	const sampleDateISO = '2024-01-15T14:30:45Z';

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns empty string for invalid date input', () => {
		expect(formatTime('invalid-date')).toBe('');
	});

	it('formats time in 12-hour clock by default', () => {
		expect(formatTime(sampleDateISO, { timeZone: 'America/New_York' })).toBe('9:30 AM');
	});

	it('formats time in 24-hour clock when hour12 is false', () => {
		expect(formatTime(sampleDateISO, { timeZone: 'UTC', hour12: false })).toBe('14:30');
	});

	it('formats time using the provided locale', () => {
		expect(formatTime(sampleDateISO, { locale: 'fr-FR', timeZone: 'UTC', hour12: false })).toBe(
			'14:30'
		);
	});

	it('includes seconds when requested', () => {
		expect(formatTime(sampleDateISO, { timeZone: 'UTC', includeSeconds: true })).toBe('2:30:45 PM');
	});

	it('falls back to manual formatting when Intl.DateTimeFormat is unavailable', () => {
		const date = new Date(sampleDateISO);
		const expected =
			`${String(date.getHours()).padStart(2, '0')}:` +
			`${String(date.getMinutes()).padStart(2, '0')}:` +
			`${String(date.getSeconds()).padStart(2, '0')}`;

		vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => {
			throw new Error('Intl not available');
		});

		expect(formatTime(date, { hour12: false, includeSeconds: true })).toBe(expected);
	});
});

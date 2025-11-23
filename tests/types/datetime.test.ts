import type {
	CalendarDate,
	DateFormat,
	DateFormatOptions,
	DateLike,
	DateManipulationOptions,
	DateParseOptions,
	DateRange,
	DateValidationResult,
	DurationWithUnit,
	RelativeTime,
	RelativeTimeUnit,
	TimeComponents,
	TimePeriod,
	TimeRange,
} from '@src-types/datetime';
import { describe, expect, it } from 'vitest';

describe('datetime types', () => {
	const TEST_DATE = '2023-01-01';
	const TEST_ISO_DATE = '2023-01-01T00:00:00Z';
	const TEST_LOCALE = 'en-US';
	const TEST_DATE_FORMAT = 'YYYY-MM-DD';

	describe('DateLike', () => {
		it('should accept Date object', () => {
			const date: DateLike = new Date(TEST_DATE);
			expect(date).toBeInstanceOf(Date);
		});

		it('should accept timestamp number', () => {
			const date: DateLike = 1704067199000;
			expect(date).toBe(1704067199000);
		});

		it('should accept ISO string', () => {
			const date: DateLike = TEST_ISO_DATE;
			expect(date).toBe(TEST_ISO_DATE);
		});
	});

	describe('DateFormat', () => {
		it('should accept all date format types', () => {
			const formats: DateFormat[] = [
				'iso',
				'iso-date',
				'iso-time',
				'short',
				'long',
				'relative',
				'timestamp',
				'custom',
			];
			expect(formats).toHaveLength(8);
		});
	});

	describe('DateRange', () => {
		it('should allow DateRange with DateLike values', () => {
			const range: DateRange = {
				start: new Date(TEST_DATE),
				end: new Date('2023-12-31'),
			};
			expect(range.start).toBeInstanceOf(Date);
			expect(range.end).toBeInstanceOf(Date);
		});

		it('should allow DateRange with timestamp values', () => {
			const range: DateRange = {
				start: 1704067199000,
				end: 1735689599000,
			};
			expect(range.start).toBe(1704067199000);
			expect(range.end).toBe(1735689599000);
		});

		it('should allow DateRange with ISO string values', () => {
			const range: DateRange = {
				start: TEST_ISO_DATE,
				end: '2023-12-31T23:59:59Z',
			};
			expect(range.start).toBe(TEST_ISO_DATE);
			expect(range.end).toBe('2023-12-31T23:59:59Z');
		});
	});

	describe('TimeRange', () => {
		it('should allow TimeRange with time strings', () => {
			const range: TimeRange = {
				start: '09:00',
				end: '17:00',
			};
			expect(range.start).toBe('09:00');
			expect(range.end).toBe('17:00');
		});
	});

	describe('CalendarDate', () => {
		it('should allow CalendarDate with all properties', () => {
			const date: CalendarDate = {
				year: 2023,
				month: 12,
				day: 25,
			};
			expect(date.year).toBe(2023);
			expect(date.month).toBe(12);
			expect(date.day).toBe(25);
		});
	});

	describe('TimeComponents', () => {
		it('should allow TimeComponents with all properties', () => {
			const time: TimeComponents = {
				hours: 14,
				minutes: 30,
				seconds: 45,
				milliseconds: 123,
			};
			expect(time.hours).toBe(14);
			expect(time.minutes).toBe(30);
			expect(time.seconds).toBe(45);
			expect(time.milliseconds).toBe(123);
		});

		it('should allow TimeComponents without optional properties', () => {
			const time: TimeComponents = {
				hours: 14,
				minutes: 30,
			};
			expect(time.hours).toBe(14);
			expect(time.minutes).toBe(30);
		});
	});

	describe('DateFormatOptions', () => {
		it('should allow DateFormatOptions with all properties', () => {
			const options: DateFormatOptions = {
				format: 'custom',
				customFormat: TEST_DATE_FORMAT,
				locale: TEST_LOCALE,
				timezone: 'America/New_York',
				includeTime: true,
				use12Hour: true,
			};
			expect(options.format).toBe('custom');
			expect(options.customFormat).toBe(TEST_DATE_FORMAT);
			expect(options.locale).toBe(TEST_LOCALE);
			expect(options.timezone).toBe('America/New_York');
			expect(options.includeTime).toBe(true);
			expect(options.use12Hour).toBe(true);
		});

		it('should allow DateFormatOptions without optional properties', () => {
			const options: DateFormatOptions = {
				format: 'iso',
			};
			expect(options.format).toBe('iso');
		});
	});

	describe('DateParseOptions', () => {
		it('should allow DateParseOptions with all properties', () => {
			const options: DateParseOptions = {
				format: 'custom',
				customFormat: TEST_DATE_FORMAT,
				locale: TEST_LOCALE,
				timezone: 'UTC',
				strict: true,
			};
			expect(options.format).toBe('custom');
			expect(options.customFormat).toBe(TEST_DATE_FORMAT);
			expect(options.locale).toBe(TEST_LOCALE);
			expect(options.timezone).toBe('UTC');
			expect(options.strict).toBe(true);
		});
	});

	describe('DateManipulationOptions', () => {
		it('should allow DateManipulationOptions with all properties', () => {
			const options: DateManipulationOptions = {
				amount: 5,
				unit: 'days',
				roundToStart: true,
				roundToEnd: false,
			};
			expect(options.amount).toBe(5);
			expect(options.unit).toBe('days');
			expect(options.roundToStart).toBe(true);
			expect(options.roundToEnd).toBe(false);
		});
	});

	describe('DateValidationResult', () => {
		it('should allow DateValidationResult with valid date', () => {
			const result: DateValidationResult = {
				valid: true,
				date: new Date(TEST_DATE),
			};
			expect(result.valid).toBe(true);
			expect(result.date).toBeInstanceOf(Date);
		});

		it('should allow DateValidationResult with invalid date', () => {
			const result: DateValidationResult = {
				valid: false,
				error: 'Invalid date format',
			};
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Invalid date format');
		});
	});

	describe('DurationWithUnit', () => {
		it('should allow DurationWithUnit with all units', () => {
			const durations: DurationWithUnit[] = [
				{ value: 1, unit: 'years' },
				{ value: 2, unit: 'months' },
				{ value: 3, unit: 'weeks' },
				{ value: 4, unit: 'days' },
				{ value: 5, unit: 'hours' },
				{ value: 6, unit: 'minutes' },
				{ value: 7, unit: 'seconds' },
				{ value: 8, unit: 'milliseconds' },
			];
			expect(durations).toHaveLength(8);
		});
	});

	describe('TimePeriod', () => {
		it('should accept all time period types', () => {
			const periods: TimePeriod[] = ['day', 'week', 'month', 'year', 'all'];
			expect(periods).toHaveLength(5);
		});
	});

	describe('RelativeTimeUnit', () => {
		it('should accept all relative time units', () => {
			const units: RelativeTimeUnit[] = [
				'now',
				'seconds',
				'minutes',
				'hours',
				'days',
				'weeks',
				'months',
				'years',
			];
			expect(units).toHaveLength(8);
		});
	});

	describe('RelativeTime', () => {
		it('should allow RelativeTime with all properties', () => {
			const time: RelativeTime = {
				value: 2,
				unit: 'days',
				label: '2 days ago',
			};
			expect(time.value).toBe(2);
			expect(time.unit).toBe('days');
			expect(time.label).toBe('2 days ago');
		});
	});
});

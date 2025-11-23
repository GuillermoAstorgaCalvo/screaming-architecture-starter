/**
 * Rating.helpers Tests
 *
 * Tests for Rating helper functions including:
 * - getStarFill
 * - getStarClasses
 * - getEmptyStarClasses
 * - getStarButtonProps
 * - getRatingContainerProps
 * - getRatingStyles
 * - normalizeRatingProps
 */

import { ARIA_LABELS } from '@core/constants/aria';
import {
	getEmptyStarClasses,
	getRatingContainerProps,
	getRatingStyles,
	getStarButtonProps,
	getStarClasses,
	getStarFill,
	HALF_STAR_VALUE,
	normalizeRatingProps,
} from '@core/ui/forms/rating/helpers/Rating.helpers';
import type { RatingProps } from '@src-types/ui/forms-advanced';
import { describe, expect, it } from 'vitest';

describe('Rating.helpers - getStarFill', () => {
	it('returns 1 for fully filled star', () => {
		expect(getStarFill({ displayValue: 5, starIndex: 0, allowHalf: false })).toBe(1);
		expect(getStarFill({ displayValue: 5, starIndex: 4, allowHalf: false })).toBe(1);
		expect(getStarFill({ displayValue: 3, starIndex: 2, allowHalf: false })).toBe(1);
	});

	it('returns 0 for empty star', () => {
		expect(getStarFill({ displayValue: 0, starIndex: 0, allowHalf: false })).toBe(0);
		expect(getStarFill({ displayValue: 2, starIndex: 3, allowHalf: false })).toBe(0);
		expect(getStarFill({ displayValue: 1, starIndex: 1, allowHalf: false })).toBe(0);
	});

	it('returns 0.5 for half star when allowHalf is true', () => {
		expect(getStarFill({ displayValue: 0.5, starIndex: 0, allowHalf: true })).toBe(HALF_STAR_VALUE);
		expect(getStarFill({ displayValue: 1.5, starIndex: 1, allowHalf: true })).toBe(HALF_STAR_VALUE);
		expect(getStarFill({ displayValue: 2.5, starIndex: 2, allowHalf: true })).toBe(HALF_STAR_VALUE);
	});

	it('returns 0 for half star when allowHalf is false', () => {
		expect(getStarFill({ displayValue: 0.5, starIndex: 0, allowHalf: false })).toBe(0);
		expect(getStarFill({ displayValue: 1.5, starIndex: 1, allowHalf: false })).toBe(0);
	});

	it('handles edge cases correctly', () => {
		expect(getStarFill({ displayValue: 0.5, starIndex: 0, allowHalf: true })).toBe(0.5);
		expect(getStarFill({ displayValue: 0.4, starIndex: 0, allowHalf: true })).toBe(0);
		expect(getStarFill({ displayValue: 0.6, starIndex: 0, allowHalf: true })).toBe(0.5);
	});
});

describe('Rating.helpers - getStarClasses', () => {
	it('returns filled classes for interactive star', () => {
		const classes = getStarClasses({ readOnly: false, disabled: false });
		expect(classes).toContain('text-warning');
		expect(classes).toContain('cursor-pointer');
	});

	it('returns filled classes for read-only star', () => {
		const classes = getStarClasses({ readOnly: true, disabled: false });
		expect(classes).toContain('text-warning');
		expect(classes).not.toContain('cursor-pointer');
	});

	it('returns filled classes with disabled styles', () => {
		const classes = getStarClasses({ readOnly: false, disabled: true });
		expect(classes).toContain('text-warning');
		expect(classes).toContain('cursor-not-allowed');
		expect(classes).toContain('opacity-50');
	});
});

describe('Rating.helpers - getEmptyStarClasses', () => {
	it('returns empty classes for interactive star', () => {
		const classes = getEmptyStarClasses({ readOnly: false, disabled: false });
		expect(classes).toContain('text-muted');
		expect(classes).toContain('cursor-pointer');
	});

	it('returns empty classes for read-only star', () => {
		const classes = getEmptyStarClasses({ readOnly: true, disabled: false });
		expect(classes).toContain('text-muted');
		expect(classes).not.toContain('cursor-pointer');
	});

	it('returns empty classes with disabled styles', () => {
		const classes = getEmptyStarClasses({ readOnly: false, disabled: true });
		expect(classes).toContain('text-muted');
		expect(classes).toContain('cursor-not-allowed');
		expect(classes).toContain('opacity-50');
	});
});

describe('Rating.helpers - getStarButtonProps', () => {
	it('returns correct props for interactive button', () => {
		const props = getStarButtonProps({ starIndex: 0, fill: 1, readOnly: false, disabled: false });
		expect(props.type).toBe('button');
		expect(props.role).toBe('radio');
		expect(props['aria-checked']).toBe(true);
		expect(props['aria-label']).toBe('1 star');
		expect(props.disabled).toBe(false);
		expect(props.className).toContain('inline-flex');
	});

	it('returns correct props for read-only button', () => {
		const props = getStarButtonProps({ starIndex: 0, fill: 1, readOnly: true, disabled: false });
		expect(props.type).toBe('button');
		expect(props.role).toBeUndefined();
		expect(props['aria-checked']).toBeUndefined();
		expect(props['aria-label']).toBe('1 star');
		expect(props.disabled).toBe(true);
	});

	it('returns correct props for disabled button', () => {
		const props = getStarButtonProps({ starIndex: 0, fill: 1, readOnly: false, disabled: true });
		expect(props.type).toBe('button');
		expect(props.disabled).toBe(true);
	});

	it('generates correct aria-label for multiple stars', () => {
		const props1 = getStarButtonProps({ starIndex: 1, fill: 1, readOnly: false, disabled: false });
		expect(props1['aria-label']).toBe('2 stars');

		const props2 = getStarButtonProps({ starIndex: 2, fill: 1, readOnly: false, disabled: false });
		expect(props2['aria-label']).toBe('3 stars');
	});

	it('sets aria-checked to false for unfilled star', () => {
		const props = getStarButtonProps({ starIndex: 0, fill: 0, readOnly: false, disabled: false });
		expect(props['aria-checked']).toBe(false);
	});
});

describe('Rating.helpers - getRatingContainerProps', () => {
	it('returns correct props for interactive rating', () => {
		const handleMouseLeave = () => {};
		const props = getRatingContainerProps({
			readOnly: false,
			currentValue: 3,
			max: 5,
			ariaLabel: 'Rating',
			classes: 'test-class',
			handleMouseLeave,
		});

		expect(props.role).toBe('radiogroup');
		expect(props['aria-label']).toBe('Rating');
		expect(props['aria-valuenow']).toBeUndefined();
		// aria-valuemin and aria-valuemax are not allowed on radiogroup per accessibility rules
		expect(props['aria-valuemin']).toBeUndefined();
		expect(props['aria-valuemax']).toBeUndefined();
		expect(props.className).toBe('test-class');
		expect(props.onMouseLeave).toBe(handleMouseLeave);
	});

	it('returns correct props for read-only rating', () => {
		const props = getRatingContainerProps({
			readOnly: true,
			currentValue: 3,
			max: 5,
			ariaLabel: 'Rating',
			classes: 'test-class',
			handleMouseLeave: () => {},
		});

		expect(props.role).toBeUndefined();
		expect(props['aria-label']).toBe('Rating');
		expect(props['aria-valuenow']).toBe(3);
		expect(props['aria-valuemin']).toBe(0);
		expect(props['aria-valuemax']).toBe(5);
		expect(props.className).toBe('test-class');
		expect(props.onMouseLeave).toBeUndefined();
	});

	it('handles undefined handleMouseLeave', () => {
		const props = getRatingContainerProps({
			readOnly: false,
			currentValue: 3,
			max: 5,
			ariaLabel: 'Rating',
			classes: 'test-class',
		});

		expect(props.onMouseLeave).toBeUndefined();
	});
});

describe('Rating.helpers - getRatingStyles', () => {
	it('returns classes for default size', () => {
		const styles = getRatingStyles({
			size: 'md',
			className: undefined,
			readOnly: false,
			disabled: false,
		});

		expect(styles.classes).toBeDefined();
		expect(styles.starClasses).toBeDefined();
		expect(styles.emptyStarClasses).toBeDefined();
	});

	it('merges custom className', () => {
		const styles = getRatingStyles({
			size: 'md',
			className: 'custom-class',
			readOnly: false,
			disabled: false,
		});

		expect(styles.classes).toContain('custom-class');
	});

	it('returns different classes for different sizes', () => {
		const smStyles = getRatingStyles({
			size: 'sm',
			className: undefined,
			readOnly: false,
			disabled: false,
		});
		const lgStyles = getRatingStyles({
			size: 'lg',
			className: undefined,
			readOnly: false,
			disabled: false,
		});

		expect(smStyles.classes).not.toBe(lgStyles.classes);
	});
});

describe('Rating.helpers - normalizeRatingProps', () => {
	it('normalizes props with defaults', () => {
		const normalized = normalizeRatingProps({});

		expect(normalized.max).toBe(5);
		expect(normalized.size).toBe('md');
		expect(normalized.readOnly).toBe(false);
		expect(normalized.disabled).toBe(false);
		expect(normalized.ariaLabel).toBe(ARIA_LABELS.RATING);
		expect(normalized.allowHalf).toBe(false);
	});

	it('preserves provided props', () => {
		const onChange = () => {};
		const normalized = normalizeRatingProps({
			value: 3,
			max: 10,
			size: 'lg',
			readOnly: true,
			disabled: true,
			onChange,
			'aria-label': 'Custom label',
			allowHalf: true,
			className: 'custom-class',
		});

		expect(normalized.controlledValue).toBe(3);
		expect(normalized.max).toBe(10);
		expect(normalized.size).toBe('lg');
		expect(normalized.readOnly).toBe(true);
		expect(normalized.disabled).toBe(true);
		expect(normalized.onChange).toBe(onChange);
		expect(normalized.ariaLabel).toBe('Custom label');
		expect(normalized.allowHalf).toBe(true);
		expect(normalized.className).toBe('custom-class');
	});

	it('separates rest props', () => {
		const normalized = normalizeRatingProps({
			'data-testid': 'rating',
			'data-custom': 'value',
		} as RatingProps);

		expect(normalized.restProps['data-testid']).toBe('rating');
		expect(normalized.restProps['data-custom']).toBe('value');
	});

	it('handles defaultValue', () => {
		const normalized = normalizeRatingProps({
			defaultValue: 2,
		});

		expect(normalized.defaultValue).toBe(2);
		expect(normalized.controlledValue).toBeUndefined();
	});

	it('handles value (controlled)', () => {
		const normalized = normalizeRatingProps({
			value: 4,
		});

		expect(normalized.controlledValue).toBe(4);
		expect(normalized.defaultValue).toBeUndefined();
	});
});

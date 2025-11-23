/**
 * useRatingStyles Tests
 *
 * Tests for the useRatingStylesAndContainer hook including:
 * - Style class generation
 * - Container props generation
 * - Size variants
 * - Read-only and disabled states
 */

import { useRatingStylesAndContainer } from '@core/ui/forms/rating/hooks/useRatingStyles';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useRatingStylesAndContainer - Styles', () => {
	it('generates star classes for interactive rating', () => {
		const { result } = renderHook(() =>
			useRatingStylesAndContainer({
				readOnly: false,
				disabled: false,
				currentValue: 3,
				max: 5,
				ariaLabel: 'Rating',
				size: 'md',
				className: undefined,
				handleMouseLeave: () => {},
			})
		);

		expect(result.current.starClasses).toBeDefined();
		expect(result.current.starClasses).toContain('text-warning');
		expect(result.current.emptyStarClasses).toBeDefined();
		expect(result.current.emptyStarClasses).toContain('text-muted');
	});

	it('generates star classes for read-only rating', () => {
		const { result } = renderHook(() =>
			useRatingStylesAndContainer({
				readOnly: true,
				disabled: false,
				currentValue: 3,
				max: 5,
				ariaLabel: 'Rating',
				size: 'md',
				className: undefined,
				handleMouseLeave: () => {},
			})
		);

		expect(result.current.starClasses).toBeDefined();
		expect(result.current.emptyStarClasses).toBeDefined();
		expect(result.current.starClasses).not.toContain('cursor-pointer');
	});

	it('generates star classes for disabled rating', () => {
		const { result } = renderHook(() =>
			useRatingStylesAndContainer({
				readOnly: false,
				disabled: true,
				currentValue: 3,
				max: 5,
				ariaLabel: 'Rating',
				size: 'md',
				className: undefined,
				handleMouseLeave: () => {},
			})
		);

		expect(result.current.starClasses).toContain('cursor-not-allowed');
		expect(result.current.starClasses).toContain('opacity-50');
		expect(result.current.emptyStarClasses).toContain('cursor-not-allowed');
	});
});

describe('useRatingStylesAndContainer - Container Props', () => {
	it('generates container props for interactive rating', () => {
		const handleMouseLeave = () => {};
		const { result } = renderHook(() =>
			useRatingStylesAndContainer({
				readOnly: false,
				disabled: false,
				currentValue: 3,
				max: 5,
				ariaLabel: 'Custom Rating',
				size: 'md',
				className: 'custom-class',
				handleMouseLeave,
			})
		);

		expect(result.current.containerProps.role).toBe('radiogroup');
		expect(result.current.containerProps['aria-label']).toBe('Custom Rating');
		// aria-valuemin and aria-valuemax are not allowed on radiogroup per accessibility rules
		expect(result.current.containerProps['aria-valuemin']).toBeUndefined();
		expect(result.current.containerProps['aria-valuemax']).toBeUndefined();
		expect(result.current.containerProps.onMouseLeave).toBe(handleMouseLeave);
		expect(result.current.containerProps.className).toBeDefined();
		expect(result.current.containerProps.className).toContain('custom-class');
	});

	it('generates container props for read-only rating', () => {
		const { result } = renderHook(() =>
			useRatingStylesAndContainer({
				readOnly: true,
				disabled: false,
				currentValue: 4,
				max: 5,
				ariaLabel: 'Rating',
				size: 'md',
				className: undefined,
				handleMouseLeave: () => {},
			})
		);

		expect(result.current.containerProps.role).toBeUndefined();
		expect(result.current.containerProps['aria-valuenow']).toBe(4);
		expect(result.current.containerProps.onMouseLeave).toBeUndefined();
	});

	it('handles different sizes', () => {
		const smResult = renderHook(() =>
			useRatingStylesAndContainer({
				readOnly: false,
				disabled: false,
				currentValue: 3,
				max: 5,
				ariaLabel: 'Rating',
				size: 'sm',
				className: undefined,
				handleMouseLeave: () => {},
			})
		);

		const lgResult = renderHook(() =>
			useRatingStylesAndContainer({
				readOnly: false,
				disabled: false,
				currentValue: 3,
				max: 5,
				ariaLabel: 'Rating',
				size: 'lg',
				className: undefined,
				handleMouseLeave: () => {},
			})
		);

		expect(smResult.result.current.containerProps.className).not.toBe(
			lgResult.result.current.containerProps.className
		);
	});

	it('merges custom className', () => {
		const { result } = renderHook(() =>
			useRatingStylesAndContainer({
				readOnly: false,
				disabled: false,
				currentValue: 3,
				max: 5,
				ariaLabel: 'Rating',
				size: 'md',
				className: 'my-custom-class',
				handleMouseLeave: () => {},
			})
		);

		expect(result.current.containerProps.className).toContain('my-custom-class');
	});

	it('handles undefined handleMouseLeave', () => {
		const { result } = renderHook(() =>
			useRatingStylesAndContainer({
				readOnly: false,
				disabled: false,
				currentValue: 3,
				max: 5,
				ariaLabel: 'Rating',
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.containerProps.onMouseLeave).toBeUndefined();
	});
});

describe('useRatingStylesAndContainer - Integration', () => {
	it('generates complete props for interactive state', () => {
		const { result } = renderHook(() =>
			useRatingStylesAndContainer({
				readOnly: false,
				disabled: false,
				currentValue: 3,
				max: 5,
				ariaLabel: 'Rating',
				size: 'md',
				className: undefined,
				handleMouseLeave: () => {},
			})
		);

		expect(result.current.starClasses).toBeDefined();
		expect(result.current.emptyStarClasses).toBeDefined();
		expect(result.current.containerProps).toBeDefined();
		expect(result.current.containerProps.role).toBe('radiogroup');
		// aria-valuemin and aria-valuemax are not allowed on radiogroup per accessibility rules
		expect(result.current.containerProps['aria-valuemin']).toBeUndefined();
		expect(result.current.containerProps['aria-valuemax']).toBeUndefined();
	});

	it('generates complete props for read-only state', () => {
		const { result } = renderHook(() =>
			useRatingStylesAndContainer({
				readOnly: true,
				disabled: false,
				currentValue: 3,
				max: 5,
				ariaLabel: 'Rating',
				size: 'md',
				className: undefined,
				handleMouseLeave: () => {},
			})
		);

		expect(result.current.starClasses).toBeDefined();
		expect(result.current.emptyStarClasses).toBeDefined();
		expect(result.current.containerProps).toBeDefined();
		expect(result.current.containerProps['aria-valuemin']).toBe(0);
		expect(result.current.containerProps['aria-valuemax']).toBe(5);
	});

	it('generates complete props for disabled state', () => {
		const { result } = renderHook(() =>
			useRatingStylesAndContainer({
				readOnly: false,
				disabled: true,
				currentValue: 3,
				max: 5,
				ariaLabel: 'Rating',
				size: 'md',
				className: undefined,
				handleMouseLeave: () => {},
			})
		);

		expect(result.current.starClasses).toBeDefined();
		expect(result.current.emptyStarClasses).toBeDefined();
		expect(result.current.containerProps).toBeDefined();
		expect(result.current.containerProps.role).toBe('radiogroup');
		// aria-valuemin and aria-valuemax are not allowed on radiogroup per accessibility rules
		expect(result.current.containerProps['aria-valuemin']).toBeUndefined();
		expect(result.current.containerProps['aria-valuemax']).toBeUndefined();
	});
});

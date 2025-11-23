/**
 * useRatingConfig Tests
 *
 * Tests for the useRatingConfig hook including:
 * - Integration of state, handlers, and styles
 * - Display value calculation
 * - Container props generation
 * - Star classes generation
 */

import { useRatingConfig } from '@core/ui/forms/rating/hooks/useRatingConfig';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useRatingConfig - Integration', () => {
	it('integrates state, handlers, and styles', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRatingConfig({
				controlledValue: undefined,
				defaultValue: 2,
				readOnly: false,
				disabled: false,
				onChange,
				size: 'md',
				className: undefined,
				max: 5,
				ariaLabel: 'Rating',
			})
		);

		expect(result.current.displayValue).toBe(2);
		expect(result.current.starClasses).toBeDefined();
		expect(result.current.emptyStarClasses).toBeDefined();
		expect(result.current.containerProps).toBeDefined();
		expect(result.current.handleStarClick).toBeDefined();
		expect(result.current.handleStarHover).toBeDefined();
	});

	it('handles controlled mode', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRatingConfig({
				controlledValue: 4,
				defaultValue: undefined,
				readOnly: false,
				disabled: false,
				onChange,
				size: 'md',
				className: undefined,
				max: 5,
				ariaLabel: 'Rating',
			})
		);

		expect(result.current.displayValue).toBe(4);

		act(() => {
			result.current.handleStarClick(2);
		});

		expect(onChange).toHaveBeenCalledWith(3);
	});

	it('handles uncontrolled mode', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRatingConfig({
				controlledValue: undefined,
				defaultValue: 1,
				readOnly: false,
				disabled: false,
				onChange,
				size: 'md',
				className: undefined,
				max: 5,
				ariaLabel: 'Rating',
			})
		);

		expect(result.current.displayValue).toBe(1);

		act(() => {
			result.current.handleStarClick(3);
		});

		expect(onChange).toHaveBeenCalledWith(4);
		expect(result.current.displayValue).toBe(4);
	});

	it('handles hover state', () => {
		const { result } = renderHook(() =>
			useRatingConfig({
				controlledValue: undefined,
				defaultValue: 2,
				readOnly: false,
				disabled: false,
				onChange: undefined,
				size: 'md',
				className: undefined,
				max: 5,
				ariaLabel: 'Rating',
			})
		);

		act(() => {
			result.current.handleStarHover(4);
		});

		expect(result.current.displayValue).toBe(5);

		act(() => {
			result.current.handleStarHover(0);
		});

		expect(result.current.displayValue).toBe(1);
	});

	it('handles mouse leave', () => {
		const { result } = renderHook(() =>
			useRatingConfig({
				controlledValue: undefined,
				defaultValue: 2,
				readOnly: false,
				disabled: false,
				onChange: undefined,
				size: 'md',
				className: undefined,
				max: 5,
				ariaLabel: 'Rating',
			})
		);

		act(() => {
			result.current.handleStarHover(4);
		});

		expect(result.current.displayValue).toBe(5);

		// Simulate mouse leave through container props
		const handleMouseLeave = result.current.containerProps.onMouseLeave as (() => void) | undefined;
		if (handleMouseLeave) {
			act(() => {
				handleMouseLeave();
			});
		}

		expect(result.current.displayValue).toBe(2);
	});
});

describe('useRatingConfig - Styles', () => {
	it('generates star classes based on state', () => {
		const { result: interactiveResult } = renderHook(() =>
			useRatingConfig({
				controlledValue: undefined,
				defaultValue: 2,
				readOnly: false,
				disabled: false,
				onChange: undefined,
				size: 'md',
				className: undefined,
				max: 5,
				ariaLabel: 'Rating',
			})
		);

		const { result: readOnlyResult } = renderHook(() =>
			useRatingConfig({
				controlledValue: undefined,
				defaultValue: 2,
				readOnly: true,
				disabled: false,
				onChange: undefined,
				size: 'md',
				className: undefined,
				max: 5,
				ariaLabel: 'Rating',
			})
		);

		expect(interactiveResult.current.starClasses).toContain('cursor-pointer');
		expect(readOnlyResult.current.starClasses).not.toContain('cursor-pointer');
	});

	it('generates container props with correct ARIA attributes', () => {
		const { result } = renderHook(() =>
			useRatingConfig({
				controlledValue: undefined,
				defaultValue: 3,
				readOnly: false,
				disabled: false,
				onChange: undefined,
				size: 'md',
				className: 'custom-class',
				max: 5,
				ariaLabel: 'Custom Rating',
			})
		);

		expect(result.current.containerProps.role).toBe('radiogroup');
		expect(result.current.containerProps['aria-label']).toBe('Custom Rating');
		// aria-valuemin and aria-valuemax are not allowed on radiogroup per accessibility rules
		expect(result.current.containerProps['aria-valuemin']).toBeUndefined();
		expect(result.current.containerProps['aria-valuemax']).toBeUndefined();
		expect(result.current.containerProps.className).toContain('custom-class');
	});

	it('generates read-only container props', () => {
		const { result } = renderHook(() =>
			useRatingConfig({
				controlledValue: undefined,
				defaultValue: 3,
				readOnly: true,
				disabled: false,
				onChange: undefined,
				size: 'md',
				className: undefined,
				max: 5,
				ariaLabel: 'Rating',
			})
		);

		expect(result.current.containerProps.role).toBeUndefined();
		expect(result.current.containerProps['aria-valuenow']).toBe(3);
		expect(result.current.containerProps.onMouseLeave).toBeUndefined();
	});
});

describe('useRatingConfig - Size Variants', () => {
	it('handles different sizes', () => {
		const sizes = ['sm', 'md', 'lg'] as const;

		for (const size of sizes) {
			const { result } = renderHook(() =>
				useRatingConfig({
					controlledValue: undefined,
					defaultValue: 2,
					readOnly: false,
					disabled: false,
					onChange: undefined,
					size,
					className: undefined,
					max: 5,
					ariaLabel: 'Rating',
				})
			);

			expect(result.current.containerProps.className).toBeDefined();
		}
	});
});

describe('useRatingConfig - Disabled State', () => {
	it('handles disabled state', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRatingConfig({
				controlledValue: undefined,
				defaultValue: 2,
				readOnly: false,
				disabled: true,
				onChange,
				size: 'md',
				className: undefined,
				max: 5,
				ariaLabel: 'Rating',
			})
		);

		expect(result.current.starClasses).toContain('cursor-not-allowed');
		expect(result.current.starClasses).toContain('opacity-50');

		act(() => {
			result.current.handleStarClick(3);
		});

		expect(onChange).not.toHaveBeenCalled();
	});
});

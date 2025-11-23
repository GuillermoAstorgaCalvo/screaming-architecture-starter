/**
 * useRating Tests
 *
 * Tests for the useRating hook including:
 * - Props extraction
 * - Config data integration
 * - Content props integration
 * - Return values
 * - Complete flow
 */

import { useRating } from '@core/ui/forms/rating/hooks/useRating';
import type { RatingProps } from '@src-types/ui/forms-advanced';
import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useRating - Props Extraction', () => {
	it('extracts all props correctly', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRating({
				value: 3,
				max: 5,
				size: 'lg',
				readOnly: false,
				disabled: false,
				onChange,
				'aria-label': 'Custom Rating',
				allowHalf: true,
				className: 'custom-class',
			})
		);

		expect(result.current.containerProps).toBeDefined();
		expect(result.current.contentProps).toBeDefined();
		expect(result.current.restProps).toBeDefined();
	});

	it('uses default props when not provided', () => {
		const { result } = renderHook(() => useRating({}));

		expect(result.current.contentProps.max).toBe(5);
		expect(result.current.contentProps.size).toBe('md');
		expect(result.current.contentProps.readOnly).toBe(false);
		expect(result.current.contentProps.disabled).toBe(false);
		expect(result.current.contentProps.allowHalf).toBe(false);
	});
});

describe('useRating - Content Props', () => {
	it('generates content props correctly', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRating({
				value: 3,
				max: 5,
				size: 'md',
				readOnly: false,
				disabled: false,
				onChange,
				allowHalf: true,
			})
		);

		expect(result.current.contentProps.max).toBe(5);
		expect(result.current.contentProps.displayValue).toBe(3);
		expect(result.current.contentProps.allowHalf).toBe(true);
		expect(result.current.contentProps.size).toBe('md');
		expect(result.current.contentProps.readOnly).toBe(false);
		expect(result.current.contentProps.disabled).toBe(false);
		expect(result.current.contentProps.starClasses).toBeDefined();
		expect(result.current.contentProps.emptyStarClasses).toBeDefined();
		expect(result.current.contentProps.onClick).toBeDefined();
		expect(result.current.contentProps.onMouseEnter).toBeDefined();
	});

	it('passes icon props through', () => {
		const emptyIcon = React.createElement('span', null, 'Empty');
		const filledIcon = React.createElement('span', null, 'Filled');

		const { result } = renderHook(() =>
			useRating({
				emptyIcon,
				filledIcon,
			})
		);

		expect(result.current.contentProps.emptyIcon).toBe(emptyIcon);
		expect(result.current.contentProps.filledIcon).toBe(filledIcon);
	});
});

describe('useRating - Container Props', () => {
	it('generates container props correctly', () => {
		const { result } = renderHook(() =>
			useRating({
				value: 3,
				max: 5,
				'aria-label': 'Custom Rating',
				className: 'custom-class',
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
			useRating({
				value: 3,
				readOnly: true,
			})
		);

		expect(result.current.containerProps.role).toBeUndefined();
		expect(result.current.containerProps['aria-valuenow']).toBe(3);
	});
});

describe('useRating - Interactions', () => {
	it('handles star clicks', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRating({
				defaultValue: 0,
				onChange,
			})
		);

		act(() => {
			result.current.contentProps.onClick(2);
		});

		expect(onChange).toHaveBeenCalledWith(3);
	});

	it('handles star hover', () => {
		const { result } = renderHook(() =>
			useRating({
				defaultValue: 2,
			})
		);

		act(() => {
			result.current.contentProps.onMouseEnter(4);
		});

		expect(result.current.contentProps.displayValue).toBe(5);
	});

	it('handles mouse leave', () => {
		const { result } = renderHook(() =>
			useRating({
				defaultValue: 2,
			})
		);

		act(() => {
			result.current.contentProps.onMouseEnter(4);
		});

		expect(result.current.contentProps.displayValue).toBe(5);

		const handleMouseLeave = result.current.containerProps.onMouseLeave as (() => void) | undefined;
		if (handleMouseLeave) {
			act(() => {
				handleMouseLeave();
			});
		}

		expect(result.current.contentProps.displayValue).toBe(2);
	});
});

describe('useRating - Controlled Mode', () => {
	it('handles controlled value', () => {
		const onChange = vi.fn();

		const { result, rerender } = renderHook(
			({ value }: { value?: number }) => {
				const props = value === undefined ? { onChange } : { value, onChange };
				return useRating(props);
			},
			{
				initialProps: { value: 2 },
			}
		);

		expect(result.current.contentProps.displayValue).toBe(2);

		rerender({ value: 4 });

		expect(result.current.contentProps.displayValue).toBe(4);
	});

	it('calls onChange in controlled mode', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRating({
				value: 3,
				onChange,
			})
		);

		act(() => {
			result.current.contentProps.onClick(4);
		});

		expect(onChange).toHaveBeenCalledWith(5);
	});
});

describe('useRating - Uncontrolled Mode', () => {
	it('handles uncontrolled value', () => {
		const { result } = renderHook(() =>
			useRating({
				defaultValue: 2,
			})
		);

		expect(result.current.contentProps.displayValue).toBe(2);

		act(() => {
			result.current.contentProps.onClick(3);
		});

		expect(result.current.contentProps.displayValue).toBe(4);
	});
});

describe('useRating - Rest Props', () => {
	it('separates rest props', () => {
		const { result } = renderHook(() =>
			useRating({
				'data-testid': 'rating',
				'data-custom': 'value',
			} as RatingProps)
		);

		expect(result.current.restProps['data-testid']).toBe('rating');
		expect(result.current.restProps['data-custom']).toBe('value');
	});
});

describe('useRating - Read-Only and Disabled', () => {
	it('handles read-only mode', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRating({
				value: 3,
				readOnly: true,
				onChange,
			})
		);

		expect(result.current.contentProps.readOnly).toBe(true);
		expect(result.current.containerProps.role).toBeUndefined();

		act(() => {
			result.current.contentProps.onClick(4);
		});

		expect(onChange).not.toHaveBeenCalled();
	});

	it('handles disabled mode', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRating({
				value: 3,
				disabled: true,
				onChange,
			})
		);

		expect(result.current.contentProps.disabled).toBe(true);

		act(() => {
			result.current.contentProps.onClick(4);
		});

		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('useRating - Integration', () => {
	it('handles complete interaction flow', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRating({
				defaultValue: 0,
				onChange,
			})
		);

		// Initial state
		expect(result.current.contentProps.displayValue).toBe(0);

		// Hover
		act(() => {
			result.current.contentProps.onMouseEnter(2);
		});
		expect(result.current.contentProps.displayValue).toBe(3);

		// Click
		act(() => {
			result.current.contentProps.onClick(2);
		});
		expect(onChange).toHaveBeenCalledWith(3);
		expect(result.current.contentProps.displayValue).toBe(3);

		// Mouse leave
		const handleMouseLeave = result.current.containerProps.onMouseLeave as (() => void) | undefined;
		if (handleMouseLeave) {
			act(() => {
				handleMouseLeave();
			});
		}
		expect(result.current.contentProps.displayValue).toBe(3);
	});
});

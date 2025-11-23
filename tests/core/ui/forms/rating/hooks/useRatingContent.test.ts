/**
 * useRatingContent Tests
 *
 * Tests for the useRatingContent hook including:
 * - Props transformation
 * - Handler mapping
 * - Return values
 */

import { useRatingContent } from '@core/ui/forms/rating/hooks/useRatingContent';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

describe('useRatingContent - Props Transformation', () => {
	it('transforms props correctly', () => {
		const handleStarClick = () => {};
		const handleStarHover = () => {};

		const { result } = renderHook(() =>
			useRatingContent({
				max: 5,
				allowHalf: true,
				size: 'lg',
				readOnly: false,
				disabled: false,
				starClasses: 'star-class',
				emptyStarClasses: 'empty-class',
				emptyIcon: undefined,
				filledIcon: undefined,
				displayValue: 3,
				handleStarClick,
				handleStarHover,
			})
		);

		expect(result.current.max).toBe(5);
		expect(result.current.allowHalf).toBe(true);
		expect(result.current.size).toBe('lg');
		expect(result.current.readOnly).toBe(false);
		expect(result.current.disabled).toBe(false);
		expect(result.current.starClasses).toBe('star-class');
		expect(result.current.emptyStarClasses).toBe('empty-class');
		expect(result.current.displayValue).toBe(3);
	});

	it('maps handlers correctly', () => {
		const handleStarClick = () => {};
		const handleStarHover = () => {};

		const { result } = renderHook(() =>
			useRatingContent({
				max: 5,
				allowHalf: false,
				size: 'md',
				readOnly: false,
				disabled: false,
				starClasses: 'star-class',
				emptyStarClasses: 'empty-class',
				emptyIcon: undefined,
				filledIcon: undefined,
				displayValue: 2,
				handleStarClick,
				handleStarHover,
			})
		);

		expect(result.current.onClick).toBe(handleStarClick);
		expect(result.current.onMouseEnter).toBe(handleStarHover);
	});

	it('preserves icon props', () => {
		const emptyIcon = React.createElement('span', null, 'Empty');
		const filledIcon = React.createElement('span', null, 'Filled');

		const { result } = renderHook(() =>
			useRatingContent({
				max: 5,
				allowHalf: false,
				size: 'md',
				readOnly: false,
				disabled: false,
				starClasses: 'star-class',
				emptyStarClasses: 'empty-class',
				emptyIcon,
				filledIcon,
				displayValue: 3,
				handleStarClick: () => {},
				handleStarHover: () => {},
			})
		);

		expect(result.current.emptyIcon).toBe(emptyIcon);
		expect(result.current.filledIcon).toBe(filledIcon);
	});

	it('handles all size variants', () => {
		const sizes = ['sm', 'md', 'lg'] as const;

		for (const size of sizes) {
			const { result } = renderHook(() =>
				useRatingContent({
					max: 5,
					allowHalf: false,
					size,
					readOnly: false,
					disabled: false,
					starClasses: 'star-class',
					emptyStarClasses: 'empty-class',
					emptyIcon: undefined,
					filledIcon: undefined,
					displayValue: 3,
					handleStarClick: () => {},
					handleStarHover: () => {},
				})
			);

			expect(result.current.size).toBe(size);
		}
	});

	it('handles read-only and disabled states', () => {
		const testCases = [
			{ readOnly: true, disabled: false },
			{ readOnly: false, disabled: true },
			{ readOnly: true, disabled: true },
		];

		for (const { readOnly, disabled } of testCases) {
			const { result } = renderHook(() =>
				useRatingContent({
					max: 5,
					allowHalf: false,
					size: 'md',
					readOnly,
					disabled,
					starClasses: 'star-class',
					emptyStarClasses: 'empty-class',
					emptyIcon: undefined,
					filledIcon: undefined,
					displayValue: 3,
					handleStarClick: () => {},
					handleStarHover: () => {},
				})
			);

			expect(result.current.readOnly).toBe(readOnly);
			expect(result.current.disabled).toBe(disabled);
		}
	});
});

describe('useRatingContent - Return Values', () => {
	it('returns all expected properties', () => {
		const { result } = renderHook(() =>
			useRatingContent({
				max: 5,
				allowHalf: true,
				size: 'md',
				readOnly: false,
				disabled: false,
				starClasses: 'star-class',
				emptyStarClasses: 'empty-class',
				emptyIcon: undefined,
				filledIcon: undefined,
				displayValue: 2.5,
				handleStarClick: () => {},
				handleStarHover: () => {},
			})
		);

		expect(result.current).toHaveProperty('max');
		expect(result.current).toHaveProperty('displayValue');
		expect(result.current).toHaveProperty('allowHalf');
		expect(result.current).toHaveProperty('size');
		expect(result.current).toHaveProperty('readOnly');
		expect(result.current).toHaveProperty('disabled');
		expect(result.current).toHaveProperty('starClasses');
		expect(result.current).toHaveProperty('emptyStarClasses');
		expect(result.current).toHaveProperty('emptyIcon');
		expect(result.current).toHaveProperty('filledIcon');
		expect(result.current).toHaveProperty('onClick');
		expect(result.current).toHaveProperty('onMouseEnter');
	});
});

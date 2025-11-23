/**
 * Tests for useVirtualizedListRef hook
 *
 * Tests ref creation for virtualized list container
 */

import { useVirtualizedListRef } from '@core/ui/utilities/virtualized-list/hooks/utils/useVirtualizedListRef';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useVirtualizedListRef', () => {
	it('should return a ref object', () => {
		const { result } = renderHook(() => useVirtualizedListRef());

		expect(result.current).toBeDefined();
		expect(result.current).toHaveProperty('current');
	});

	it('should initialize ref with null', () => {
		const { result } = renderHook(() => useVirtualizedListRef());

		expect(result.current.current).toBeNull();
	});

	it('should return a stable ref across re-renders', () => {
		const { result, rerender } = renderHook(() => useVirtualizedListRef());

		const firstRef = result.current;

		rerender();

		expect(result.current).toBe(firstRef);
	});

	it('should have correct type for HTMLDivElement', () => {
		const { result } = renderHook(() => useVirtualizedListRef());

		// Type check: ref should accept HTMLDivElement
		const div = document.createElement('div');
		result.current.current = div;

		expect(result.current.current).toBe(div);
		expect(result.current.current).toBeInstanceOf(HTMLDivElement);
	});
});

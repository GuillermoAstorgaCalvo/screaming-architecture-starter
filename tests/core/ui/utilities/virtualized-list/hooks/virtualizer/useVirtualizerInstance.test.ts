/**
 * Tests for useVirtualizerInstance hook
 *
 * Tests virtualizer instance creation and configuration
 */

import { useVirtualizerInstance } from '@core/ui/utilities/virtualized-list/hooks/virtualizer/useVirtualizerInstance';
import { renderHook } from '@testing-library/react';
import { createRef, type RefObject } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock @tanstack/react-virtual
vi.mock('@tanstack/react-virtual', () => ({
	useVirtualizer: vi.fn(),
}));

// Shared test setup
let parentRef: RefObject<HTMLDivElement | null>;
const mockItems = [{ id: 1 }, { id: 2 }, { id: 3 }];
const mockVirtualizer = {
	getVirtualItems: vi.fn(() => []),
	getTotalSize: vi.fn(() => 300),
	measureElement: vi.fn(),
};
let mockUseVirtualizer: ReturnType<typeof vi.fn>;

async function setupTest() {
	vi.clearAllMocks();
	parentRef = createRef<HTMLDivElement>();
	parentRef.current = document.createElement('div');
	const virtualModule = await import('@tanstack/react-virtual');
	mockUseVirtualizer = virtualModule.useVirtualizer as ReturnType<typeof vi.fn>;
	vi.mocked(mockUseVirtualizer).mockReturnValue(mockVirtualizer);
}

function createGetItemKeyFunction() {
	return (_item: { id: number }, index: number) => `key-${index}`;
}

function getVirtualizerCallArgs() {
	const [firstCall] = mockUseVirtualizer.mock.calls;
	return firstCall?.[0];
}

describe('useVirtualizerInstance - item size configuration - fixed size', () => {
	beforeEach(async () => {
		await setupTest();
	});

	it('should create virtualizer with correct configuration for fixed item size', () => {
		renderHook(() =>
			useVirtualizerInstance({
				items: mockItems,
				itemSize: 50,
				orientation: 'vertical',
				parentRef,
			})
		);

		expect(mockUseVirtualizer).toHaveBeenCalledWith({
			count: 3,
			getScrollElement: expect.any(Function),
			estimateSize: expect.any(Function),
			overscan: 2,
			horizontal: false,
		});
	});

	it('should use fixed size for estimateSize function', () => {
		renderHook(() =>
			useVirtualizerInstance({
				items: mockItems,
				itemSize: 50,
				orientation: 'vertical',
				parentRef,
			})
		);

		const callArgs = getVirtualizerCallArgs();
		if (callArgs) {
			const { estimateSize } = callArgs;
			if (estimateSize) {
				expect(estimateSize(0)).toBe(50);
				expect(estimateSize(1)).toBe(50);
				expect(estimateSize(2)).toBe(50);
			}
		}
	});
});

describe('useVirtualizerInstance - item size configuration - function size', () => {
	beforeEach(async () => {
		await setupTest();
	});

	it('should create virtualizer with function itemSize', () => {
		const itemSizeFn = (index: number) => index * 10 + 50;

		renderHook(() =>
			useVirtualizerInstance({
				items: mockItems,
				itemSize: itemSizeFn,
				orientation: 'vertical',
				parentRef,
			})
		);

		expect(mockUseVirtualizer).toHaveBeenCalledWith({
			count: 3,
			getScrollElement: expect.any(Function),
			estimateSize: itemSizeFn,
			overscan: 2,
			horizontal: false,
		});
	});
});

describe('useVirtualizerInstance - item size configuration - memoization', () => {
	beforeEach(async () => {
		await setupTest();
	});

	it('should memoize estimateSize function for fixed itemSize', () => {
		const { rerender } = renderHook(
			({ itemSize }) =>
				useVirtualizerInstance({
					items: mockItems,
					itemSize,
					orientation: 'vertical',
					parentRef,
				}),
			{ initialProps: { itemSize: 50 } }
		);

		const [firstCall] = mockUseVirtualizer.mock.calls;
		const firstEstimateSize = firstCall?.[0]?.estimateSize;

		rerender({ itemSize: 50 });

		const [, secondCall] = mockUseVirtualizer.mock.calls;
		const secondEstimateSize = secondCall?.[0]?.estimateSize;
		if (firstEstimateSize && secondEstimateSize) {
			expect(secondEstimateSize).toBe(firstEstimateSize);
		}
	});
});

describe('useVirtualizerInstance - orientation configuration', () => {
	beforeEach(async () => {
		await setupTest();
	});

	it('should create horizontal virtualizer', () => {
		renderHook(() =>
			useVirtualizerInstance({
				items: mockItems,
				itemSize: 50,
				orientation: 'horizontal',
				parentRef,
			})
		);

		expect(mockUseVirtualizer).toHaveBeenCalledWith(
			expect.objectContaining({
				horizontal: true,
			})
		);
	});
});

describe('useVirtualizerInstance - overscan configuration', () => {
	beforeEach(async () => {
		await setupTest();
	});

	it('should use custom overscan when provided', () => {
		renderHook(() =>
			useVirtualizerInstance({
				items: mockItems,
				itemSize: 50,
				orientation: 'vertical',
				overscan: 5,
				parentRef,
			})
		);

		expect(mockUseVirtualizer).toHaveBeenCalledWith(
			expect.objectContaining({
				overscan: 5,
			})
		);
	});

	it('should use default overscan when not provided', () => {
		renderHook(() =>
			useVirtualizerInstance({
				items: mockItems,
				itemSize: 50,
				orientation: 'vertical',
				parentRef,
			})
		);

		expect(mockUseVirtualizer).toHaveBeenCalledWith(
			expect.objectContaining({
				overscan: 2,
			})
		);
	});
});

describe('useVirtualizerInstance - getItemKey configuration - when provided', () => {
	beforeEach(async () => {
		await setupTest();
	});

	it('should include getItemKey when provided', () => {
		const getItemKey = createGetItemKeyFunction();

		renderHook(() =>
			useVirtualizerInstance({
				items: mockItems,
				itemSize: 50,
				orientation: 'vertical',
				getItemKey,
				parentRef,
			})
		);

		expect(mockUseVirtualizer).toHaveBeenCalledWith(
			expect.objectContaining({
				getItemKey: expect.any(Function),
			})
		);
	});
});

describe('useVirtualizerInstance - getItemKey configuration - function calls', () => {
	beforeEach(async () => {
		await setupTest();
	});

	it('should call getItemKey function correctly', () => {
		const getItemKey = createGetItemKeyFunction();

		renderHook(() =>
			useVirtualizerInstance({
				items: mockItems,
				itemSize: 50,
				orientation: 'vertical',
				getItemKey,
				parentRef,
			})
		);

		const callArgs = getVirtualizerCallArgs();
		if (callArgs) {
			const { getItemKey: getItemKeyFn } = callArgs;
			if (getItemKeyFn) {
				expect(getItemKeyFn(0)).toBe('key-0');
				expect(getItemKeyFn(1)).toBe('key-1');
				expect(getItemKeyFn(2)).toBe('key-2');
			}
		}
	});
});

describe('useVirtualizerInstance - getItemKey configuration - null/undefined items', () => {
	beforeEach(async () => {
		await setupTest();
	});

	it('should return index when item is null or undefined', () => {
		const getItemKey = createGetItemKeyFunction();
		const itemsWithNulls = [{ id: 1 }, null, undefined, { id: 4 }] as Array<
			{ id: number } | null | undefined
		>;

		renderHook(() =>
			useVirtualizerInstance({
				items: itemsWithNulls as readonly { id: number }[],
				itemSize: 50,
				orientation: 'vertical',
				getItemKey,
				parentRef,
			})
		);

		const callArgs = getVirtualizerCallArgs();
		if (callArgs) {
			const { getItemKey: getItemKeyFn } = callArgs;
			if (getItemKeyFn) {
				// Valid items should use getItemKey
				expect(getItemKeyFn(0)).toBe('key-0');
				expect(getItemKeyFn(3)).toBe('key-3');
				// Null/undefined items should return index
				expect(getItemKeyFn(1)).toBe(1);
				expect(getItemKeyFn(2)).toBe(2);
			}
		}
	});
});

describe('useVirtualizerInstance - getItemKey configuration - when not provided', () => {
	beforeEach(async () => {
		await setupTest();
	});

	it('should not include getItemKey when not provided', () => {
		renderHook(() =>
			useVirtualizerInstance({
				items: mockItems,
				itemSize: 50,
				orientation: 'vertical',
				parentRef,
			})
		);

		const callArgs = getVirtualizerCallArgs();
		if (callArgs) {
			expect(callArgs).not.toHaveProperty('getItemKey');
		}
	});
});

describe('useVirtualizerInstance - scroll element configuration', () => {
	beforeEach(async () => {
		await setupTest();
	});

	describe('valid ref', () => {
		it('should return scroll element from parentRef', () => {
			renderHook(() =>
				useVirtualizerInstance({
					items: mockItems,
					itemSize: 50,
					orientation: 'vertical',
					parentRef,
				})
			);

			const callArgs = getVirtualizerCallArgs();
			if (callArgs) {
				const { getScrollElement } = callArgs;
				if (getScrollElement) {
					expect(getScrollElement()).toBe(parentRef.current);
				}
			}
		});
	});

	describe('null ref', () => {
		it('should return null when parentRef.current is null', () => {
			const nullRef = createRef<HTMLDivElement>();

			renderHook(() =>
				useVirtualizerInstance({
					items: mockItems,
					itemSize: 50,
					orientation: 'vertical',
					parentRef: nullRef,
				})
			);

			const callArgs = getVirtualizerCallArgs();
			if (callArgs) {
				const { getScrollElement } = callArgs;
				if (getScrollElement) {
					expect(getScrollElement()).toBeNull();
				}
			}
		});
	});
});

describe('useVirtualizerInstance - return values', () => {
	beforeEach(async () => {
		await setupTest();
	});

	it('should return virtualizer instance', () => {
		const { result } = renderHook(() =>
			useVirtualizerInstance({
				items: mockItems,
				itemSize: 50,
				orientation: 'vertical',
				parentRef,
			})
		);

		expect(result.current).toBe(mockVirtualizer);
	});
});

describe('useVirtualizerInstance - edge cases', () => {
	beforeEach(async () => {
		await setupTest();
	});

	it('should handle empty items array', () => {
		renderHook(() =>
			useVirtualizerInstance({
				items: [],
				itemSize: 50,
				orientation: 'vertical',
				parentRef,
			})
		);

		expect(mockUseVirtualizer).toHaveBeenCalledWith(
			expect.objectContaining({
				count: 0,
			})
		);
	});
});

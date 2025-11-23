/**
 * Tests for useVirtualizedListSetup hook
 *
 * Tests complete virtualized list setup including scroll handlers
 */

import { useVirtualizedListSetup } from '@core/ui/utilities/virtualized-list/hooks/virtualizer/useVirtualizedListSetup';
import { renderHook } from '@testing-library/react';
import { createRef, type RefObject } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/utilities/virtualized-list/hooks/virtualizer/useVirtualizerInstance', () => ({
	useVirtualizerInstance: vi.fn(),
}));

vi.mock('@core/ui/utilities/virtualized-list/hooks/scroll/useScrollHandler', () => ({
	useScrollHandler: vi.fn(),
}));

vi.mock('@core/ui/utilities/virtualized-list/hooks/scroll/useInitialScroll', () => ({
	useInitialScroll: vi.fn(),
}));

const mockItems = [{ id: 1 }, { id: 2 }, { id: 3 }];
const mockVirtualizer = {
	getVirtualItems: vi.fn(() => []),
	getTotalSize: vi.fn(() => 300),
	measureElement: vi.fn(),
};

interface MockSetup {
	readonly parentRef: RefObject<HTMLDivElement | null>;
	readonly mockUseVirtualizerInstance: ReturnType<typeof vi.fn>;
	readonly mockUseScrollHandler: ReturnType<typeof vi.fn>;
	readonly mockUseInitialScroll: ReturnType<typeof vi.fn>;
}

async function setupMocks(): Promise<MockSetup> {
	vi.clearAllMocks();
	const parentRef = createRef<HTMLDivElement>();
	parentRef.current = document.createElement('div');
	const virtualizerModule = await import(
		'@core/ui/utilities/virtualized-list/hooks/virtualizer/useVirtualizerInstance'
	);
	const scrollHandlerModule = await import(
		'@core/ui/utilities/virtualized-list/hooks/scroll/useScrollHandler'
	);
	const initialScrollModule = await import(
		'@core/ui/utilities/virtualized-list/hooks/scroll/useInitialScroll'
	);
	const mockUseVirtualizerInstance = virtualizerModule.useVirtualizerInstance as ReturnType<
		typeof vi.fn
	>;
	const mockUseScrollHandler = scrollHandlerModule.useScrollHandler as ReturnType<typeof vi.fn>;
	const mockUseInitialScroll = initialScrollModule.useInitialScroll as ReturnType<typeof vi.fn>;
	vi.mocked(mockUseVirtualizerInstance).mockReturnValue(mockVirtualizer);
	return {
		parentRef,
		mockUseVirtualizerInstance,
		mockUseScrollHandler,
		mockUseInitialScroll,
	};
}

interface SetupProps {
	readonly items: typeof mockItems;
	readonly itemSize: number | ((index: number) => number);
	readonly orientation: 'vertical' | 'horizontal';
	readonly overscan: number;
	readonly initialScrollOffset: number;
	readonly onScrollChange?: (offset: number) => void;
	readonly getItemKey?: (item: { id: number }, index: number) => string;
	readonly parentRef: RefObject<HTMLDivElement | null>;
}

function createDefaultProps(parentRef: RefObject<HTMLDivElement | null>): SetupProps {
	return {
		items: mockItems,
		itemSize: 50,
		orientation: 'vertical',
		overscan: 2,
		initialScrollOffset: 0,
		parentRef,
	};
}

describe('useVirtualizedListSetup - hook calls', () => {
	let mocks: MockSetup;

	beforeEach(async () => {
		mocks = await setupMocks();
	});

	it('should call useVirtualizerInstance with correct params', () => {
		const props = createDefaultProps(mocks.parentRef);
		renderHook(() => useVirtualizedListSetup(props));

		expect(mocks.mockUseVirtualizerInstance).toHaveBeenCalledWith({
			items: mockItems,
			itemSize: 50,
			orientation: 'vertical',
			overscan: 2,
			parentRef: mocks.parentRef,
		});
	});

	it('should call useScrollHandler with correct params', () => {
		const onScrollChange = vi.fn();
		const props = { ...createDefaultProps(mocks.parentRef), onScrollChange };
		renderHook(() => useVirtualizedListSetup(props));

		expect(mocks.mockUseScrollHandler).toHaveBeenCalledWith({
			onScrollChange,
			orientation: 'vertical',
			parentRef: mocks.parentRef,
		});
	});

	it('should call useInitialScroll with correct params', () => {
		const props = { ...createDefaultProps(mocks.parentRef), initialScrollOffset: 100 };
		renderHook(() => useVirtualizedListSetup(props));

		expect(mocks.mockUseInitialScroll).toHaveBeenCalledWith({
			initialScrollOffset: 100,
			orientation: 'vertical',
			parentRef: mocks.parentRef,
		});
	});
});

describe('useVirtualizedListSetup - parameter handling', () => {
	let mocks: MockSetup;

	beforeEach(async () => {
		mocks = await setupMocks();
	});

	it('should handle horizontal orientation', () => {
		const props = {
			...createDefaultProps(mocks.parentRef),
			orientation: 'horizontal' as const,
		};
		renderHook(() => useVirtualizedListSetup(props));

		expect(mocks.mockUseVirtualizerInstance).toHaveBeenCalledWith(
			expect.objectContaining({
				orientation: 'horizontal',
			})
		);
		expect(mocks.mockUseScrollHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				orientation: 'horizontal',
			})
		);
		expect(mocks.mockUseInitialScroll).toHaveBeenCalledWith(
			expect.objectContaining({
				orientation: 'horizontal',
			})
		);
	});

	it('should handle function itemSize', () => {
		const itemSizeFn = (index: number) => index * 10 + 50;
		const props = { ...createDefaultProps(mocks.parentRef), itemSize: itemSizeFn };
		renderHook(() => useVirtualizedListSetup(props));

		expect(mocks.mockUseVirtualizerInstance).toHaveBeenCalledWith(
			expect.objectContaining({
				itemSize: itemSizeFn,
			})
		);
	});

	it('should handle getItemKey', () => {
		const getItemKey = (_item: { id: number }, index: number) => `key-${index}`;
		const props = { ...createDefaultProps(mocks.parentRef), getItemKey };
		renderHook(() => useVirtualizedListSetup(props));

		expect(mocks.mockUseVirtualizerInstance).toHaveBeenCalledWith(
			expect.objectContaining({
				getItemKey,
			})
		);
	});

	it('should handle undefined onScrollChange', () => {
		const props = {
			...createDefaultProps(mocks.parentRef),
			onScrollChange: undefined,
		};
		renderHook(() => useVirtualizedListSetup(props));

		expect(mocks.mockUseScrollHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				onScrollChange: undefined,
			})
		);
	});
});

describe('useVirtualizedListSetup - return value', () => {
	let mocks: MockSetup;

	beforeEach(async () => {
		mocks = await setupMocks();
	});

	it('should return virtualizer instance', () => {
		const props = createDefaultProps(mocks.parentRef);
		const { result } = renderHook(() => useVirtualizedListSetup(props));

		expect(result.current).toBe(mockVirtualizer);
	});
});

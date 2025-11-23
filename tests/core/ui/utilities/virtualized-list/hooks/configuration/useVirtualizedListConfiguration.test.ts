/**
 * Tests for useVirtualizedListConfiguration hook
 *
 * Tests virtualizer configuration setup
 */

import { useVirtualizedListConfiguration } from '@core/ui/utilities/virtualized-list/hooks/configuration/useVirtualizedListConfiguration';
import { renderHook } from '@testing-library/react';
import { createRef, type RefObject } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock useVirtualizedListSetup
vi.mock('@core/ui/utilities/virtualized-list/hooks/virtualizer/useVirtualizedListSetup', () => ({
	useVirtualizedListSetup: vi.fn(),
}));

// Test constants
const mockItems = [{ id: 1 }, { id: 2 }, { id: 3 }];
const mockVirtualizer = {
	getVirtualItems: vi.fn(() => []),
	getTotalSize: vi.fn(() => 300),
	measureElement: vi.fn(),
};

// Helper functions
function createDefaultConfig(parentRef: RefObject<HTMLDivElement | null>) {
	return {
		items: mockItems,
		itemSize: 50,
		orientation: 'vertical' as const,
		overscan: 2,
		initialScrollOffset: 0,
		parentRef,
	};
}

function renderConfigurationHook<T>(
	config: Parameters<typeof useVirtualizedListConfiguration<T>>[0]
) {
	return renderHook(() => useVirtualizedListConfiguration(config));
}

function assertSetupCalledWith(mockFn: ReturnType<typeof vi.fn>, expected: unknown) {
	expect(mockFn).toHaveBeenCalledWith(expected);
}

function assertSetupCalledWithContaining(mockFn: ReturnType<typeof vi.fn>, expected: unknown) {
	expect(mockFn).toHaveBeenCalledWith(expect.objectContaining(expected));
}

describe('useVirtualizedListConfiguration', () => {
	let parentRef: RefObject<HTMLDivElement | null>;
	let mockUseVirtualizedListSetup: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		vi.clearAllMocks();
		parentRef = createRef<HTMLDivElement>();
		parentRef.current = document.createElement('div');
		const setupModule = await import(
			'@core/ui/utilities/virtualized-list/hooks/virtualizer/useVirtualizedListSetup'
		);
		mockUseVirtualizedListSetup = setupModule.useVirtualizedListSetup as ReturnType<typeof vi.fn>;
		vi.mocked(mockUseVirtualizedListSetup).mockReturnValue(mockVirtualizer);
	});

	it('should call useVirtualizedListSetup with all params', () => {
		const getItemKey = (item: { id: number }, index: number) => `key-${index}`;
		const onScrollChange = vi.fn();
		const config = {
			...createDefaultConfig(parentRef),
			getItemKey,
			onScrollChange,
			initialScrollOffset: 100,
		};

		renderConfigurationHook<{ id: number }>(config);

		assertSetupCalledWith(mockUseVirtualizedListSetup, config);
	});

	it('should return virtualizer from useVirtualizedListSetup', () => {
		const config = createDefaultConfig(parentRef);
		const { result } = renderConfigurationHook(config);

		expect(result.current).toBe(mockVirtualizer);
	});

	it('should handle function itemSize', () => {
		const itemSizeFn = (index: number) => index * 10 + 50;
		const config = {
			...createDefaultConfig(parentRef),
			itemSize: itemSizeFn,
		};

		renderConfigurationHook(config);

		assertSetupCalledWithContaining(mockUseVirtualizedListSetup, {
			itemSize: itemSizeFn,
		});
	});

	it('should handle horizontal orientation', () => {
		const config = {
			...createDefaultConfig(parentRef),
			orientation: 'horizontal' as const,
		};

		renderConfigurationHook(config);

		assertSetupCalledWithContaining(mockUseVirtualizedListSetup, {
			orientation: 'horizontal',
		});
	});

	it('should handle undefined optional params', () => {
		const config = createDefaultConfig(parentRef);
		renderConfigurationHook(config);

		assertSetupCalledWithContaining(mockUseVirtualizedListSetup, {
			getItemKey: undefined,
			onScrollChange: undefined,
		});
	});
});

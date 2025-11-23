/**
 * Tests for useVirtualizedListSetupAndProps hook
 *
 * Tests wrapper props preparation from virtualizer setup
 */

import { useVirtualizedListSetupAndProps } from '@core/ui/utilities/virtualized-list/hooks/configuration/useVirtualizedListSetupAndProps';
import { renderHook } from '@testing-library/react';
import { createElement, createRef, type ReactNode, type RefObject } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock(
	'@core/ui/utilities/virtualized-list/hooks/configuration/useVirtualizedListConfiguration',
	() => ({
		useVirtualizedListConfiguration: vi.fn(),
	})
);

vi.mock('@core/ui/utilities/virtualized-list/helpers/VirtualizedListPropsHelpers', () => ({
	prepareWrapperProps: vi.fn(),
}));

// Test data constants
const mockItems = [{ id: 1 }, { id: 2 }, { id: 3 }];
const mockRenderItem = () => createElement('div', null, 'Item') as ReactNode;
const mockVirtualizer = {
	getVirtualItems: vi.fn(() => []),
	getTotalSize: vi.fn(() => 300),
	measureElement: vi.fn(),
};

// Helper functions
function createMockWrapperProps(parentRef: RefObject<HTMLDivElement | null>) {
	return {
		items: mockItems,
		renderItem: mockRenderItem,
		virtualizer: mockVirtualizer,
		orientation: 'vertical' as const,
		containerSize: 400,
		smoothScroll: false,
		parentRef,
	};
}

function createDefaultHookProps(parentRef: RefObject<HTMLDivElement | null>) {
	return {
		items: mockItems,
		renderItem: mockRenderItem,
		itemSize: 50,
		orientation: 'vertical' as const,
		containerSize: 400,
		overscan: 2,
		initialScrollOffset: 0,
		smoothScroll: false,
		parentRef,
		restProps: {} as Record<string, unknown>,
	};
}

async function setupMocks() {
	vi.clearAllMocks();
	const parentRef = createRef<HTMLDivElement | null>();
	parentRef.current = document.createElement('div');
	const configModule = await import(
		'@core/ui/utilities/virtualized-list/hooks/configuration/useVirtualizedListConfiguration'
	);
	const propsModule = await import(
		'@core/ui/utilities/virtualized-list/helpers/VirtualizedListPropsHelpers'
	);
	const mockUseVirtualizedListConfiguration =
		configModule.useVirtualizedListConfiguration as ReturnType<typeof vi.fn>;
	const mockPrepareWrapperProps = propsModule.prepareWrapperProps as ReturnType<typeof vi.fn>;
	const mockWrapperProps = createMockWrapperProps(parentRef);
	vi.mocked(mockUseVirtualizedListConfiguration).mockReturnValue(mockVirtualizer);
	vi.mocked(mockPrepareWrapperProps).mockReturnValue(mockWrapperProps);
	return {
		parentRef,
		mockUseVirtualizedListConfiguration,
		mockPrepareWrapperProps,
		mockWrapperProps,
	};
}

// Shared test state
let parentRef: RefObject<HTMLDivElement | null>;
let mockUseVirtualizedListConfiguration: ReturnType<typeof vi.fn>;
let mockPrepareWrapperProps: ReturnType<typeof vi.fn>;
let mockWrapperProps: ReturnType<typeof createMockWrapperProps>;

describe('useVirtualizedListSetupAndProps', () => {
	beforeEach(async () => {
		({ parentRef, mockUseVirtualizedListConfiguration, mockPrepareWrapperProps, mockWrapperProps } =
			await setupMocks());
	});

	describe('configuration calls', () => {
		it('should call useVirtualizedListConfiguration with correct params', () => {
			const getItemKey = (_item: { id: number }, index: number) => `key-${index}`;
			const onScrollChange = vi.fn();
			const props = {
				...createDefaultHookProps(parentRef),
				getItemKey,
				onScrollChange,
				initialScrollOffset: 100,
			};

			renderHook(() => useVirtualizedListSetupAndProps(props));

			expect(mockUseVirtualizedListConfiguration).toHaveBeenCalledWith({
				items: mockItems,
				itemSize: 50,
				orientation: 'vertical',
				overscan: 2,
				getItemKey,
				onScrollChange,
				initialScrollOffset: 100,
				parentRef,
			});
		});
	});
});

describe('useVirtualizedListSetupAndProps - wrapper props', () => {
	beforeEach(async () => {
		({ parentRef, mockUseVirtualizedListConfiguration, mockPrepareWrapperProps, mockWrapperProps } =
			await setupMocks());
	});

	it('should call prepareWrapperProps with virtualizer and params', () => {
		const props = createDefaultHookProps(parentRef);
		renderHook(() => useVirtualizedListSetupAndProps(props));

		expect(mockPrepareWrapperProps).toHaveBeenCalledWith({
			items: mockItems,
			renderItem: mockRenderItem,
			virtualizer: mockVirtualizer,
			orientation: 'vertical',
			containerSize: 400,
			smoothScroll: false,
			parentRef,
		});
	});

	it('should return wrapper props from prepareWrapperProps', () => {
		const props = createDefaultHookProps(parentRef);
		const { result } = renderHook(() => useVirtualizedListSetupAndProps(props));

		expect(result.current).toBe(mockWrapperProps);
	});
});

describe('useVirtualizedListSetupAndProps - optional props', () => {
	beforeEach(async () => {
		({ parentRef, mockUseVirtualizedListConfiguration, mockPrepareWrapperProps, mockWrapperProps } =
			await setupMocks());
	});

	it('should pass optional props to prepareWrapperProps', () => {
		const getItemKey = (_item: { id: number }, index: number) => `key-${index}`;
		const props = {
			...createDefaultHookProps(parentRef),
			getItemKey,
			smoothScroll: true,
			emptyMessage: 'No items',
			className: 'custom-class',
		};

		renderHook(() => useVirtualizedListSetupAndProps(props));

		expect(mockPrepareWrapperProps).toHaveBeenCalledWith(
			expect.objectContaining({
				getItemKey,
				smoothScroll: true,
				emptyMessage: 'No items',
				className: 'custom-class',
			})
		);
	});

	it('should pass restProps to prepareWrapperProps', () => {
		const props = {
			...createDefaultHookProps(parentRef),
			restProps: {
				'data-testid': 'test-list',
				'aria-label': 'Test list',
			},
		};

		renderHook(() => useVirtualizedListSetupAndProps(props));

		expect(mockPrepareWrapperProps).toHaveBeenCalledWith(
			expect.objectContaining({
				'data-testid': 'test-list',
				'aria-label': 'Test list',
			})
		);
	});
});

describe('useVirtualizedListSetupAndProps - orientation and container size', () => {
	beforeEach(async () => {
		({ parentRef, mockUseVirtualizedListConfiguration, mockPrepareWrapperProps, mockWrapperProps } =
			await setupMocks());
	});

	it('should handle horizontal orientation', () => {
		const props = {
			...createDefaultHookProps(parentRef),
			orientation: 'horizontal' as const,
			containerSize: 600,
		};

		renderHook(() => useVirtualizedListSetupAndProps(props));

		expect(mockUseVirtualizedListConfiguration).toHaveBeenCalledWith(
			expect.objectContaining({
				orientation: 'horizontal',
			})
		);

		expect(mockPrepareWrapperProps).toHaveBeenCalledWith(
			expect.objectContaining({
				orientation: 'horizontal',
				containerSize: 600,
			})
		);
	});

	it('should handle string containerSize', () => {
		const props = {
			...createDefaultHookProps(parentRef),
			containerSize: '100%',
		};

		renderHook(() => useVirtualizedListSetupAndProps(props));

		expect(mockPrepareWrapperProps).toHaveBeenCalledWith(
			expect.objectContaining({
				containerSize: '100%',
			})
		);
	});
});

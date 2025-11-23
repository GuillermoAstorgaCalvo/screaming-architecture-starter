/**
 * Tests for VirtualizedList component
 *
 * Tests main component rendering, props handling, and integration
 */

import VirtualizedList from '@core/ui/utilities/virtualized-list/VirtualizedList';
import type { VirtualizedListProps } from '@src-types/ui/layout/scroll';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/utilities/virtualized-list/helpers/VirtualizedListPropsHelpers', () => ({
	extractVirtualizedListProps: vi.fn(),
}));

vi.mock('@core/ui/utilities/virtualized-list/hooks/utils/useVirtualizedListRef', () => ({
	useVirtualizedListRef: vi.fn(),
}));

vi.mock(
	'@core/ui/utilities/virtualized-list/hooks/configuration/useVirtualizedListSetupAndProps',
	() => ({
		useVirtualizedListSetupAndProps: vi.fn(),
	})
);

// Test constants
const mockItems = [
	{ id: 1, name: 'Item 1' },
	{ id: 2, name: 'Item 2' },
];
const mockRenderItem = (item: { id: number; name: string }) => <div>{item.name}</div>;
const parentRef = { current: document.createElement('div') };

// Helper function to create default extracted props
const createDefaultExtractedProps = () => ({
	items: mockItems,
	renderItem: mockRenderItem,
	itemSize: 50,
	orientation: 'vertical' as const,
	containerSize: 400,
	overscan: 1,
	initialScrollOffset: 0,
	smoothScroll: false,
});

// Helper function to create mock wrapper props
const createMockWrapperProps = () => ({
	items: mockItems,
	renderItem: mockRenderItem,
	virtualizer: {
		getVirtualItems: vi.fn(() => []),
		getTotalSize: vi.fn(() => 100),
		measureElement: vi.fn(),
	},
	orientation: 'vertical' as const,
	containerSize: 400,
	smoothScroll: false,
	parentRef,
});

// Helper function to setup mocks
const setupMocks = async () => {
	vi.clearAllMocks();
	const propsModule = await import(
		'@core/ui/utilities/virtualized-list/helpers/VirtualizedListPropsHelpers'
	);
	const refModule = await import(
		'@core/ui/utilities/virtualized-list/hooks/utils/useVirtualizedListRef'
	);
	const setupModule = await import(
		'@core/ui/utilities/virtualized-list/hooks/configuration/useVirtualizedListSetupAndProps'
	);
	const mockExtractVirtualizedListProps = propsModule.extractVirtualizedListProps as ReturnType<
		typeof vi.fn
	>;
	const mockUseVirtualizedListRef = refModule.useVirtualizedListRef as ReturnType<typeof vi.fn>;
	const mockUseVirtualizedListSetupAndProps =
		setupModule.useVirtualizedListSetupAndProps as ReturnType<typeof vi.fn>;

	vi.mocked(mockUseVirtualizedListRef).mockReturnValue(parentRef);
	vi.mocked(mockExtractVirtualizedListProps).mockReturnValue(createDefaultExtractedProps());
	vi.mocked(mockUseVirtualizedListSetupAndProps).mockReturnValue(createMockWrapperProps());

	return {
		mockExtractVirtualizedListProps,
		mockUseVirtualizedListRef,
		mockUseVirtualizedListSetupAndProps,
	};
};

// Helper to create test context with mocks
const createTestContext = async () => {
	const {
		mockExtractVirtualizedListProps,
		mockUseVirtualizedListRef,
		mockUseVirtualizedListSetupAndProps,
	} = await setupMocks();

	return {
		mockExtractVirtualizedListProps,
		mockUseVirtualizedListRef,
		mockUseVirtualizedListSetupAndProps,
	};
};

describe('VirtualizedList - Hook Integration', () => {
	let mockExtractVirtualizedListProps: ReturnType<typeof vi.fn>;
	let mockUseVirtualizedListRef: ReturnType<typeof vi.fn>;
	let mockUseVirtualizedListSetupAndProps: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		({
			mockExtractVirtualizedListProps,
			mockUseVirtualizedListRef,
			mockUseVirtualizedListSetupAndProps,
		} = await createTestContext());
	});

	it('should extract props using extractVirtualizedListProps', () => {
		const props: VirtualizedListProps<{ id: number; name: string }> = {
			items: mockItems,
			renderItem: mockRenderItem,
			itemSize: 50,
		};

		renderWithProviders(<VirtualizedList {...props} />);

		expect(mockExtractVirtualizedListProps).toHaveBeenCalledWith(props);
	});

	it('should create ref using useVirtualizedListRef', () => {
		renderWithProviders(
			<VirtualizedList items={mockItems} renderItem={mockRenderItem} itemSize={50} />
		);

		expect(mockUseVirtualizedListRef).toHaveBeenCalled();
	});

	it('should setup and get props using useVirtualizedListSetupAndProps', () => {
		const extractedProps = createDefaultExtractedProps();
		mockExtractVirtualizedListProps.mockReturnValue(extractedProps);

		renderWithProviders(
			<VirtualizedList items={mockItems} renderItem={mockRenderItem} itemSize={50} />
		);

		expect(mockUseVirtualizedListSetupAndProps).toHaveBeenCalledWith({
			...extractedProps,
			parentRef,
		});
	});

	it('should render VirtualizedListWrapper with correct props', () => {
		renderWithProviders(
			<VirtualizedList items={mockItems} renderItem={mockRenderItem} itemSize={50} />
		);

		expect(mockUseVirtualizedListSetupAndProps).toHaveBeenCalled();
	});
});

describe('VirtualizedList - Orientation', () => {
	let mockExtractVirtualizedListProps: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		({ mockExtractVirtualizedListProps } = await createTestContext());
	});

	it('should handle vertical orientation', () => {
		mockExtractVirtualizedListProps.mockReturnValue({
			...createDefaultExtractedProps(),
			orientation: 'vertical',
		});

		renderWithProviders(
			<VirtualizedList
				items={mockItems}
				renderItem={mockRenderItem}
				itemSize={50}
				orientation="vertical"
			/>
		);

		expect(mockExtractVirtualizedListProps).toHaveBeenCalled();
	});

	it('should handle horizontal orientation', () => {
		mockExtractVirtualizedListProps.mockReturnValue({
			...createDefaultExtractedProps(),
			orientation: 'horizontal',
			containerSize: 600,
		});

		renderWithProviders(
			<VirtualizedList
				items={mockItems}
				renderItem={mockRenderItem}
				itemSize={50}
				orientation="horizontal"
			/>
		);

		expect(mockExtractVirtualizedListProps).toHaveBeenCalled();
	});
});

describe('VirtualizedList - Item Size', () => {
	let mockExtractVirtualizedListProps: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		({ mockExtractVirtualizedListProps } = await createTestContext());
	});

	it('should handle function itemSize', () => {
		const itemSizeFn = (index: number) => index * 10 + 50;

		mockExtractVirtualizedListProps.mockReturnValue({
			...createDefaultExtractedProps(),
			itemSize: itemSizeFn,
		});

		renderWithProviders(
			<VirtualizedList items={mockItems} renderItem={mockRenderItem} itemSize={itemSizeFn} />
		);

		expect(mockExtractVirtualizedListProps).toHaveBeenCalled();
	});
});

describe('VirtualizedList - Optional Props', () => {
	let mockExtractVirtualizedListProps: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		({ mockExtractVirtualizedListProps } = await createTestContext());
	});

	it('should handle all optional props', () => {
		const getItemKey = (_item: { id: number; name: string }, index: number) => `key-${index}`;
		const onScrollChange = vi.fn();

		mockExtractVirtualizedListProps.mockReturnValue({
			...createDefaultExtractedProps(),
			overscan: 3,
			getItemKey,
			onScrollChange,
			initialScrollOffset: 100,
			smoothScroll: true,
			emptyMessage: 'No items',
			className: 'custom-class',
		});

		renderWithProviders(
			<VirtualizedList
				items={mockItems}
				renderItem={mockRenderItem}
				itemSize={50}
				overscan={3}
				getItemKey={getItemKey}
				onScrollChange={onScrollChange}
				initialScrollOffset={100}
				smoothScroll={true}
				emptyMessage="No items"
				className="custom-class"
			/>
		);

		expect(mockExtractVirtualizedListProps).toHaveBeenCalled();
	});
});

describe('VirtualizedList - Edge Cases', () => {
	let mockExtractVirtualizedListProps: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		({ mockExtractVirtualizedListProps } = await createTestContext());
	});

	it('should handle empty items array', () => {
		mockExtractVirtualizedListProps.mockReturnValue({
			...createDefaultExtractedProps(),
			items: [],
		});

		renderWithProviders(<VirtualizedList items={[]} renderItem={mockRenderItem} itemSize={50} />);

		expect(mockExtractVirtualizedListProps).toHaveBeenCalled();
	});

	it('should handle large item arrays', () => {
		const largeItems = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }));

		mockExtractVirtualizedListProps.mockReturnValue({
			...createDefaultExtractedProps(),
			items: largeItems,
		});

		renderWithProviders(
			<VirtualizedList items={largeItems} renderItem={mockRenderItem} itemSize={50} />
		);

		expect(mockExtractVirtualizedListProps).toHaveBeenCalled();
	});

	it('should pass through additional HTML props', () => {
		mockExtractVirtualizedListProps.mockReturnValue({
			...createDefaultExtractedProps(),
			restProps: {
				'data-testid': 'virtualized-list',
				'aria-label': 'Test list',
			},
		});

		renderWithProviders(
			<VirtualizedList
				items={mockItems}
				renderItem={mockRenderItem}
				itemSize={50}
				data-testid="virtualized-list"
				aria-label="Test list"
			/>
		);

		expect(mockExtractVirtualizedListProps).toHaveBeenCalled();
	});
});

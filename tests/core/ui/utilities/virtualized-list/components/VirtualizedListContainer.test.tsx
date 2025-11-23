/**
 * Tests for VirtualizedListContainer component
 *
 * Tests container rendering with virtualized items
 */

import { VirtualizedListContainer } from '@core/ui/utilities/virtualized-list/components/VirtualizedListContainer';
import type { useVirtualizer } from '@tanstack/react-virtual';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { RefObject } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock i18n
vi.mock('@core/i18n/i18n', () => ({
	default: {
		t: vi.fn((key: string) => {
			if (key === 'a11y.virtualizedList') {
				return 'Virtualized list';
			}
			return key;
		}),
	},
}));

interface TestItem {
	id: number;
	name: string;
}

interface RenderOptions {
	orientation?: 'vertical' | 'horizontal';
	containerSize?: number;
	smoothScroll?: boolean;
	className?: string;
	getItemKey?: (item: TestItem, index: number) => string | number;
	'data-testid'?: string;
}

const mockItems: TestItem[] = [
	{ id: 1, name: 'Item 1' },
	{ id: 2, name: 'Item 2' },
	{ id: 3, name: 'Item 3' },
];

const mockRenderItem = (item: TestItem) => <div>{item.name}</div>;

function createMockVirtualizer(): ReturnType<typeof useVirtualizer<HTMLDivElement, Element>> {
	return {
		getVirtualItems: vi.fn(() => [
			{ index: 0, start: 0, end: 50, size: 50 },
			{ index: 1, start: 50, end: 100, size: 50 },
		]),
		getTotalSize: vi.fn(() => 150),
		measureElement: vi.fn(),
	} as unknown as ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
}

function renderContainer(
	parentRef: RefObject<HTMLDivElement>,
	virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>,
	options: RenderOptions = {}
): ReturnType<typeof renderWithProviders> {
	const {
		orientation = 'vertical',
		containerSize = 400,
		smoothScroll = false,
		className,
		getItemKey,
		'data-testid': dataTestId,
	} = options;

	return renderWithProviders(
		<VirtualizedListContainer
			items={mockItems}
			renderItem={mockRenderItem}
			virtualizer={virtualizer}
			orientation={orientation}
			containerSize={containerSize}
			smoothScroll={smoothScroll}
			{...(className ? { className } : {})}
			{...(getItemKey ? { getItemKey } : {})}
			parentRef={parentRef}
			{...(dataTestId ? { 'data-testid': dataTestId } : {})}
		/>
	);
}

function getContainerElement(
	container: ReturnType<typeof renderWithProviders>['container']
): HTMLElement {
	return container.firstChild as HTMLElement;
}

interface TestContext {
	parentRef: RefObject<HTMLDivElement>;
	mockVirtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
}

function setupTestContext(): TestContext {
	const parentRef: RefObject<HTMLDivElement> = { current: document.createElement('div') };
	const mockVirtualizer = createMockVirtualizer();
	return { parentRef, mockVirtualizer };
}

describe('VirtualizedListContainer', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('rendering', () => {
		it('should render container with items', () => {
			const { parentRef, mockVirtualizer } = setupTestContext();

			renderContainer(parentRef, mockVirtualizer);

			expect(screen.getByText('Item 1')).toBeInTheDocument();
			expect(screen.getByText('Item 2')).toBeInTheDocument();
		});

		it('should use getItemKey when provided', () => {
			const { parentRef, mockVirtualizer } = setupTestContext();
			const getItemKey = (_item: TestItem, index: number) => `key-${index}`;

			renderContainer(parentRef, mockVirtualizer, { getItemKey });

			expect(screen.getByText('Item 1')).toBeInTheDocument();
		});
	});

	describe('refs', () => {
		it('should apply container ref', () => {
			const { parentRef, mockVirtualizer } = setupTestContext();
			const { container } = renderContainer(parentRef, mockVirtualizer);

			const div = getContainerElement(container);
			expect(div).toBe(parentRef.current);
		});
	});
});

describe('VirtualizedListContainer styling', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should apply vertical container styles', () => {
		const { parentRef, mockVirtualizer } = setupTestContext();
		const { container } = renderContainer(parentRef, mockVirtualizer, {
			orientation: 'vertical',
			containerSize: 400,
		});

		const div = getContainerElement(container);
		expect(div).toHaveStyle({
			height: '400px',
			scrollBehavior: 'auto',
		});
	});

	it('should apply horizontal container styles', () => {
		const { parentRef, mockVirtualizer } = setupTestContext();
		const { container } = renderContainer(parentRef, mockVirtualizer, {
			orientation: 'horizontal',
			containerSize: 600,
		});

		const div = getContainerElement(container);
		expect(div).toHaveStyle({
			width: '600px',
			scrollBehavior: 'auto',
		});
	});

	it('should enable smooth scroll', () => {
		const { parentRef, mockVirtualizer } = setupTestContext();
		const { container } = renderContainer(parentRef, mockVirtualizer, {
			smoothScroll: true,
		});

		const div = getContainerElement(container);
		expect(div).toHaveStyle({
			scrollBehavior: 'smooth',
		});
	});

	it('should apply custom className', () => {
		const { parentRef, mockVirtualizer } = setupTestContext();
		const { container } = renderContainer(parentRef, mockVirtualizer, {
			className: 'custom-class',
		});

		const div = getContainerElement(container);
		expect(div).toHaveClass('custom-class');
		expect(div).toHaveClass('overflow-auto');
	});
});

describe('VirtualizedListContainer accessibility', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should set aria-label', () => {
		const { parentRef, mockVirtualizer } = setupTestContext();
		const { container } = renderContainer(parentRef, mockVirtualizer);

		const div = getContainerElement(container);
		expect(div).toHaveAttribute('aria-label', 'Virtualized list');
	});
});

describe('VirtualizedListContainer props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should pass through additional props', () => {
		const { parentRef, mockVirtualizer } = setupTestContext();
		const { container } = renderContainer(parentRef, mockVirtualizer, {
			'data-testid': 'virtualized-list',
		});

		const div = getContainerElement(container);
		expect(div).toHaveAttribute('data-testid', 'virtualized-list');
	});
});

describe('VirtualizedListContainer virtualizer integration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should call virtualizer.getTotalSize', () => {
		const { parentRef, mockVirtualizer } = setupTestContext();

		renderContainer(parentRef, mockVirtualizer);

		expect(mockVirtualizer.getTotalSize).toHaveBeenCalled();
	});

	it('should call virtualizer.getVirtualItems', () => {
		const { parentRef, mockVirtualizer } = setupTestContext();

		renderContainer(parentRef, mockVirtualizer);

		expect(mockVirtualizer.getVirtualItems).toHaveBeenCalled();
	});
});

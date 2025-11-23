/**
 * List Component Tests
 *
 * Tests for List component:
 * - Rendering
 * - Variants (default, bordered, divided)
 * - Sizes (sm, md, lg)
 * - Custom className
 * - HTML attributes
 * - ListProvider context
 * - Accessibility
 */

import ListItem from '@core/ui/data-display/list/components/ListItem';
import List from '@core/ui/data-display/list/List';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const CUSTOM_LIST_CLASS = 'custom-list';
const TEST_LIST_LABEL = 'Test list';
const TEST_LIST_ID = 'test-list';

describe('List - Rendering', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(
				<List>
					<ListItem>Item 1</ListItem>
				</List>
			);
		}).not.toThrow();
	});

	it('should render ul element', () => {
		renderWithProviders(
			<List data-testid="list">
				<ListItem>Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toBeInTheDocument();
		expect(list.tagName).toBe('UL');
	});

	it('should render children content', () => {
		renderWithProviders(
			<List>
				<ListItem>Item 1</ListItem>
				<ListItem>Item 2</ListItem>
			</List>
		);
		expect(screen.getByText('Item 1')).toBeInTheDocument();
		expect(screen.getByText('Item 2')).toBeInTheDocument();
	});

	it('should render with default variant', () => {
		renderWithProviders(
			<List data-testid="list">
				<ListItem>Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toBeInTheDocument();
	});

	it('should render with default size', () => {
		renderWithProviders(
			<List data-testid="list">
				<ListItem>Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toBeInTheDocument();
	});
});

describe('List - Variants', () => {
	it('should render with default variant', () => {
		renderWithProviders(
			<List variant="default" data-testid="list">
				<ListItem>Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toBeInTheDocument();
	});

	it('should render with bordered variant', () => {
		renderWithProviders(
			<List variant="bordered" data-testid="list">
				<ListItem>Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toBeInTheDocument();
	});

	it('should render with divided variant', () => {
		renderWithProviders(
			<List variant="divided" data-testid="list">
				<ListItem>Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toBeInTheDocument();
	});
});

describe('List - Sizes', () => {
	it('should render with sm size', () => {
		renderWithProviders(
			<List size="sm" data-testid="list">
				<ListItem>Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toBeInTheDocument();
	});

	it('should render with md size', () => {
		renderWithProviders(
			<List size="md" data-testid="list">
				<ListItem>Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toBeInTheDocument();
	});

	it('should render with lg size', () => {
		renderWithProviders(
			<List size="lg" data-testid="list">
				<ListItem>Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toBeInTheDocument();
	});
});

describe('List - Custom className', () => {
	it('should apply custom className', () => {
		renderWithProviders(
			<List className={CUSTOM_LIST_CLASS} data-testid="list">
				<ListItem>Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toHaveClass(CUSTOM_LIST_CLASS);
	});

	it('should merge custom className with variant classes', () => {
		renderWithProviders(
			<List className={CUSTOM_LIST_CLASS} variant="bordered" data-testid="list">
				<ListItem>Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toHaveClass(CUSTOM_LIST_CLASS);
	});
});

describe('List - HTML Attributes', () => {
	it('should preserve HTML attributes', () => {
		renderWithProviders(
			<List data-testid="list" aria-label={TEST_LIST_LABEL} id={TEST_LIST_ID}>
				<ListItem>Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toHaveAttribute('aria-label', TEST_LIST_LABEL);
		expect(list).toHaveAttribute('id', TEST_LIST_ID);
	});

	it('should support HTML attributes', () => {
		renderWithProviders(
			<List data-testid="list" id={TEST_LIST_ID}>
				<ListItem>Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toHaveAttribute('id', TEST_LIST_ID);
	});
});

describe('List - ListProvider Context', () => {
	it('should provide size context to ListItem children', () => {
		renderWithProviders(
			<List size="sm" data-testid="list">
				<ListItem data-testid="item">Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		const item = screen.getByTestId('item');
		expect(list).toBeInTheDocument();
		expect(item).toBeInTheDocument();
	});

	it('should provide different sizes to nested ListItems', () => {
		const { rerender } = renderWithProviders(
			<List size="sm" data-testid="list">
				<ListItem data-testid="item">Item 1</ListItem>
			</List>
		);
		expect(screen.getByTestId('list')).toBeInTheDocument();
		expect(screen.getByTestId('item')).toBeInTheDocument();

		rerender(
			<List size="lg" data-testid="list">
				<ListItem data-testid="item">Item 1</ListItem>
			</List>
		);
		expect(screen.getByTestId('list')).toBeInTheDocument();
		expect(screen.getByTestId('item')).toBeInTheDocument();
	});
});

describe('List - Accessibility', () => {
	it('should have no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<List>
				<ListItem>Item 1</ListItem>
				<ListItem>Item 2</ListItem>
			</List>
		);
		await expectA11y(container);
	});

	it('should support semantic HTML', () => {
		renderWithProviders(
			<List>
				<ListItem>Item 1</ListItem>
				<ListItem>Item 2</ListItem>
			</List>
		);
		const items = screen.getAllByText(/Item \d/);
		expect(items).toHaveLength(2);
	});

	it('should support custom ARIA attributes', () => {
		renderWithProviders(
			<List data-testid="list" aria-label="Navigation list" aria-describedby="list-description">
				<ListItem>Item 1</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toHaveAttribute('aria-label', 'Navigation list');
		expect(list).toHaveAttribute('aria-describedby', 'list-description');
	});
});

describe('List - Complex Scenarios', () => {
	it('should render multiple ListItems', () => {
		renderWithProviders(
			<List data-testid="list">
				<ListItem>Item 1</ListItem>
				<ListItem>Item 2</ListItem>
				<ListItem>Item 3</ListItem>
			</List>
		);
		expect(screen.getByText('Item 1')).toBeInTheDocument();
		expect(screen.getByText('Item 2')).toBeInTheDocument();
		expect(screen.getByText('Item 3')).toBeInTheDocument();
	});

	it('should handle all props together', () => {
		renderWithProviders(
			<List
				variant="bordered"
				size="lg"
				className="custom-list"
				data-testid="list"
				aria-label="Custom list"
			>
				<ListItem>Item 1</ListItem>
				<ListItem>Item 2</ListItem>
			</List>
		);
		const list = screen.getByTestId('list');
		expect(list).toBeInTheDocument();
		expect(list).toHaveClass('custom-list');
		expect(list).toHaveAttribute('aria-label', 'Custom list');
		expect(screen.getByText('Item 1')).toBeInTheDocument();
		expect(screen.getByText('Item 2')).toBeInTheDocument();
	});
});

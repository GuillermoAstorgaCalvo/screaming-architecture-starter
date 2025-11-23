/**
 * Tests for VirtualizedListEmpty component
 *
 * Tests empty state rendering
 */

import { VirtualizedListEmpty } from '@core/ui/utilities/virtualized-list/components/VirtualizedListEmpty';
import { type RenderResult, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock i18n
vi.mock('@core/i18n/i18n', () => ({
	default: {
		t: vi.fn((key: string) => {
			if (key === 'common.noDataAvailable') {
				return 'No data available';
			}
			return key;
		}),
	},
}));

// Helper function to render component with default props
function renderEmptyComponent(
	props?: Partial<React.ComponentProps<typeof VirtualizedListEmpty>>
): RenderResult {
	return renderWithProviders(
		<VirtualizedListEmpty
			containerSize={400}
			orientation="vertical"
			smoothScroll={false}
			{...props}
		/>
	);
}

// Helper function to get the rendered element
function getRenderedElement(container: HTMLElement): HTMLElement {
	return container.firstChild as HTMLElement;
}

// Helper function to test vertical container styles
function testVerticalStyles(container: HTMLElement, expectedHeight: string): void {
	const view = getRenderedElement(container);
	expect(view).toHaveStyle({
		height: expectedHeight,
		scrollBehavior: 'auto',
	});
}

// Helper function to test horizontal container styles
function testHorizontalStyles(container: HTMLElement, expectedWidth: string): void {
	const view = getRenderedElement(container);
	expect(view).toHaveStyle({
		width: expectedWidth,
		scrollBehavior: 'auto',
	});
}

// Helper function to test string containerSize
function testStringContainerSize(container: HTMLElement, expectedHeight: string): void {
	const view = getRenderedElement(container);
	expect(view).toHaveStyle({
		height: expectedHeight,
	});
}

// Helper function to test smooth scroll
function testSmoothScroll(container: HTMLElement): void {
	const view = getRenderedElement(container);
	expect(view).toHaveStyle({
		scrollBehavior: 'smooth',
	});
}

// Helper function to test custom className
function testCustomClassName(container: HTMLElement, className: string): void {
	const view = getRenderedElement(container);
	expect(view).toHaveClass(className);
	expect(view).toHaveClass('overflow-auto');
	expect(view).toHaveClass('flex', 'items-center', 'justify-center', 'text-text-muted');
}

// Helper function to test additional props
function testAdditionalProps(container: HTMLElement, testId: string, ariaLabel: string): void {
	const view = getRenderedElement(container);
	expect(view).toHaveAttribute('data-testid', testId);
	expect(view).toHaveAttribute('aria-label', ariaLabel);
}

describe('VirtualizedListEmpty', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Empty message rendering', () => {
		it('should render default empty message', () => {
			renderEmptyComponent();
			expect(screen.getByText('No data available')).toBeInTheDocument();
		});

		it('should render custom empty message', () => {
			renderEmptyComponent({ emptyMessage: 'Custom empty message' });
			expect(screen.getByText('Custom empty message')).toBeInTheDocument();
		});
	});

	describe('Container styles', () => {
		it('should apply vertical container styles', () => {
			const { container } = renderEmptyComponent({
				containerSize: 400,
				orientation: 'vertical',
			});
			testVerticalStyles(container, '400px');
		});

		it('should apply horizontal container styles', () => {
			const { container } = renderEmptyComponent({
				containerSize: 600,
				orientation: 'horizontal',
			});
			testHorizontalStyles(container, '600px');
		});

		it('should apply string containerSize', () => {
			const { container } = renderEmptyComponent({
				containerSize: '100%',
				orientation: 'vertical',
			});
			testStringContainerSize(container, '100%');
		});

		it('should enable smooth scroll', () => {
			const { container } = renderEmptyComponent({ smoothScroll: true });
			testSmoothScroll(container);
		});
	});

	describe('Customization', () => {
		it('should apply custom className', () => {
			const { container } = renderEmptyComponent({
				className: 'custom-empty-class',
			});
			testCustomClassName(container, 'custom-empty-class');
		});

		it('should pass through additional props', () => {
			const { container } = renderEmptyComponent({
				containerSize: 400,
				orientation: 'vertical',
				smoothScroll: false,
				'data-testid': 'empty-list',
				'aria-label': 'Empty list',
			} as React.ComponentProps<typeof VirtualizedListEmpty>);
			testAdditionalProps(container, 'empty-list', 'Empty list');
		});
	});
});

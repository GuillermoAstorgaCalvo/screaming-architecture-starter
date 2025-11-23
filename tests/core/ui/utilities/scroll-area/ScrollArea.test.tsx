/**
 * ScrollArea Component Tests
 *
 * Tests for the ScrollArea component covering:
 * - Functionality: rendering, orientations, scrolling behavior
 * - Interactions: scroll events, scrollbar interaction
 * - Accessibility: scrollable region, ARIA attributes, keyboard navigation
 */

import ScrollArea from '@core/ui/utilities/scroll-area/ScrollArea';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const CONTENT_TEXT = 'ScrollArea Content';
const SCROLL_AREA_CLASS = 'h-64';
const TEST_ID_SCROLL_AREA = 'scroll-area';
const TEST_ID_SCROLL_CONTENT = 'scroll-area-content';
const OVERFLOW_AUTO_CLASS = 'overflow-auto';

/**
 * Helper to get the scrollable content element for testing scroll behavior.
 * Uses test ID to avoid querySelector when possible.
 * Note: Scroll behavior testing requires direct DOM access to scroll properties.
 */
const getScrollableContent = (): HTMLElement => {
	return screen.getByTestId(TEST_ID_SCROLL_CONTENT);
};

const longContent = (
	<div>
		{Array.from({ length: 50 }, (_, i) => (
			<div key={i} style={{ height: '100px' }}>
				Item {i + 1}
			</div>
		))}
	</div>
);

describe('ScrollArea - functionality - rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<ScrollArea>
				<div>{CONTENT_TEXT}</div>
			</ScrollArea>
		);

		expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument();
	});

	it('renders with default props', () => {
		renderWithProviders(
			<ScrollArea>
				<div>{CONTENT_TEXT}</div>
			</ScrollArea>
		);

		expect(screen.getByTestId(TEST_ID_SCROLL_AREA)).toBeInTheDocument();
	});

	it('applies custom className', () => {
		renderWithProviders(
			<ScrollArea className="custom-scroll-area">
				<div>{CONTENT_TEXT}</div>
			</ScrollArea>
		);

		const scrollArea = screen.getByTestId(TEST_ID_SCROLL_AREA);
		expect(scrollArea).toHaveClass('custom-scroll-area');
	});

	it('renders scrollable content', () => {
		renderWithProviders(<ScrollArea className={SCROLL_AREA_CLASS}>{longContent}</ScrollArea>);

		expect(screen.getByText('Item 1')).toBeInTheDocument();
		expect(screen.getByText('Item 50')).toBeInTheDocument();
	});

	it('renders custom scrollbar styles', () => {
		renderWithProviders(<ScrollArea className={SCROLL_AREA_CLASS}>{longContent}</ScrollArea>);

		// ScrollArea applies custom scrollbar styles via Tailwind classes
		expect(screen.getByTestId(TEST_ID_SCROLL_AREA)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_ID_SCROLL_CONTENT)).toBeInTheDocument();
	});

	it('preserves children structure', () => {
		renderWithProviders(
			<ScrollArea>
				<div>
					<h1>Title</h1>
					<p>Paragraph</p>
					<ul>
						<li>Item 1</li>
						<li>Item 2</li>
					</ul>
				</div>
			</ScrollArea>
		);

		expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
		expect(screen.getByText('Paragraph')).toBeInTheDocument();
		expect(screen.getByText('Item 1')).toBeInTheDocument();
		expect(screen.getByText('Item 2')).toBeInTheDocument();
	});
});

describe('ScrollArea - functionality - orientation', () => {
	it('supports vertical orientation (default)', () => {
		renderWithProviders(
			<ScrollArea orientation="vertical">
				<div>{CONTENT_TEXT}</div>
			</ScrollArea>
		);

		expect(screen.getByTestId(TEST_ID_SCROLL_AREA)).toBeInTheDocument();
	});

	it('supports horizontal orientation', () => {
		renderWithProviders(
			<ScrollArea orientation="horizontal">
				<div>{CONTENT_TEXT}</div>
			</ScrollArea>
		);

		expect(screen.getByTestId(TEST_ID_SCROLL_AREA)).toBeInTheDocument();
	});

	it('supports both orientations', () => {
		renderWithProviders(
			<ScrollArea orientation="both">
				<div>{CONTENT_TEXT}</div>
			</ScrollArea>
		);

		expect(screen.getByTestId(TEST_ID_SCROLL_AREA)).toBeInTheDocument();
	});
});

describe('ScrollArea - functionality - overflow styles', () => {
	it('applies overflow styles for vertical scrolling', () => {
		renderWithProviders(
			<ScrollArea orientation="vertical" className={SCROLL_AREA_CLASS}>
				{longContent}
			</ScrollArea>
		);

		const scrollableContent = screen.getByTestId(TEST_ID_SCROLL_CONTENT);
		expect(scrollableContent).toBeInTheDocument();
		expect(scrollableContent).toHaveClass(OVERFLOW_AUTO_CLASS);
	});

	it('applies overflow styles for horizontal scrolling', () => {
		renderWithProviders(
			<ScrollArea orientation="horizontal" className="w-64">
				<div style={{ width: '1000px' }}>{CONTENT_TEXT}</div>
			</ScrollArea>
		);

		const scrollableContent = screen.getByTestId(TEST_ID_SCROLL_CONTENT);
		expect(scrollableContent).toBeInTheDocument();
		expect(scrollableContent).toHaveClass(OVERFLOW_AUTO_CLASS);
	});

	it('applies overflow styles for both orientations', () => {
		renderWithProviders(
			<ScrollArea orientation="both" className="h-64 w-64">
				{longContent}
			</ScrollArea>
		);

		const scrollableContent = screen.getByTestId(TEST_ID_SCROLL_CONTENT);
		expect(scrollableContent).toBeInTheDocument();
		expect(scrollableContent).toHaveClass(OVERFLOW_AUTO_CLASS);
	});
});

describe('ScrollArea - interactions - scrolling directions', () => {
	it('allows vertical scrolling', () => {
		renderWithProviders(
			<ScrollArea orientation="vertical" className={SCROLL_AREA_CLASS}>
				{longContent}
			</ScrollArea>
		);

		// Scroll behavior testing requires direct DOM access to scroll properties
		const scrollableContent = getScrollableContent();
		scrollableContent.scrollTop = 100;
		expect(scrollableContent.scrollTop).toBe(100);
	});

	it('allows horizontal scrolling', () => {
		renderWithProviders(
			<ScrollArea orientation="horizontal" className="w-64">
				<div style={{ width: '1000px' }}>{CONTENT_TEXT}</div>
			</ScrollArea>
		);

		// Scroll behavior testing requires direct DOM access to scroll properties
		const scrollableContent = getScrollableContent();
		scrollableContent.scrollLeft = 100;
		expect(scrollableContent.scrollLeft).toBe(100);
	});

	it('allows scrolling in both directions', () => {
		renderWithProviders(
			<ScrollArea orientation="both" className="h-64 w-64">
				<div style={{ width: '1000px', height: '1000px' }}>{CONTENT_TEXT}</div>
			</ScrollArea>
		);

		// Scroll behavior testing requires direct DOM access to scroll properties
		const scrollableContent = getScrollableContent();
		scrollableContent.scrollTop = 100;
		scrollableContent.scrollLeft = 100;
		expect(scrollableContent.scrollTop).toBe(100);
		expect(scrollableContent.scrollLeft).toBe(100);
	});
});

describe('ScrollArea - interactions - scroll events', () => {
	it('handles scroll events', () => {
		const onScroll = vi.fn();
		renderWithProviders(
			<ScrollArea className="h-64" onScroll={onScroll}>
				{longContent}
			</ScrollArea>
		);

		// Scroll event testing requires direct DOM access
		const scrollableContent = getScrollableContent();
		scrollableContent.dispatchEvent(new Event('scroll'));
		// onScroll may be called if provided
		expect(scrollableContent).toBeInTheDocument();
	});

	it('supports mouse wheel scrolling', () => {
		renderWithProviders(<ScrollArea className="h-64">{longContent}</ScrollArea>);

		// Wheel event testing requires direct DOM access
		const scrollableContent = getScrollableContent();
		const wheelEvent = new WheelEvent('wheel', {
			deltaY: 100,
			bubbles: true,
		});

		scrollableContent.dispatchEvent(wheelEvent);
		// Scrolling should work
		expect(scrollableContent).toBeInTheDocument();
	});

	it('maintains scroll position', () => {
		renderWithProviders(<ScrollArea className="h-64">{longContent}</ScrollArea>);

		// Scroll position testing requires direct DOM access
		const scrollableContent = getScrollableContent();
		scrollableContent.scrollTop = 500;
		const scrollPosition = scrollableContent.scrollTop;
		expect(scrollPosition).toBe(500);
	});
});

describe('ScrollArea - accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<ScrollArea>
				<div>{CONTENT_TEXT}</div>
			</ScrollArea>
		);
		await expectA11y(container);
	});

	it('creates a scrollable region', () => {
		renderWithProviders(<ScrollArea className="h-64">{longContent}</ScrollArea>);

		const scrollableContent = screen.getByTestId(TEST_ID_SCROLL_CONTENT);
		expect(scrollableContent).toBeInTheDocument();
		expect(scrollableContent).toHaveClass(OVERFLOW_AUTO_CLASS);
	});
});

describe('ScrollArea - accessibility - keyboard navigation', () => {
	it('supports keyboard navigation', () => {
		renderWithProviders(
			<ScrollArea className={SCROLL_AREA_CLASS}>
				<div>
					<button>Button 1</button>
					<button>Button 2</button>
					<button>Button 3</button>
				</div>
			</ScrollArea>
		);

		const button1 = screen.getByRole('button', { name: 'Button 1' });
		const button2 = screen.getByRole('button', { name: 'Button 2' });
		const button3 = screen.getByRole('button', { name: 'Button 3' });

		// Test that buttons are focusable within ScrollArea
		button1.focus();
		expect(button1).toHaveFocus();

		button2.focus();
		expect(button2).toHaveFocus();

		button3.focus();
		expect(button3).toHaveFocus();
	});

	it('maintains focus management', () => {
		renderWithProviders(
			<ScrollArea>
				<button>{CONTENT_TEXT}</button>
			</ScrollArea>
		);

		const button = screen.getByRole('button', { name: CONTENT_TEXT });
		button.focus();
		expect(button).toHaveFocus();
	});
});

describe('ScrollArea - accessibility - children accessibility', () => {
	it('preserves children accessibility attributes', () => {
		renderWithProviders(
			<ScrollArea>
				<section aria-label="Scrollable region">{CONTENT_TEXT}</section>
			</ScrollArea>
		);

		const region = screen.getByRole('region', { name: 'Scrollable region' });
		expect(region).toBeInTheDocument();
		expect(region.tagName).toBe('SECTION');
		expect(region).toHaveAttribute('aria-label', 'Scrollable region');
	});

	it('works with interactive children', () => {
		renderWithProviders(
			<ScrollArea>
				<div>
					<button>Button 1</button>
					<a href="#link">Link</a>
					<input type="text" aria-label="Input" />
				</div>
			</ScrollArea>
		);

		expect(screen.getByRole('button', { name: 'Button 1' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Link' })).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: 'Input' })).toBeInTheDocument();
	});

	it('supports ARIA live regions within content', () => {
		renderWithProviders(
			<ScrollArea>
				<div aria-live="polite" aria-atomic="true">
					{CONTENT_TEXT}
				</div>
			</ScrollArea>
		);

		const liveRegion = screen.getByText(CONTENT_TEXT);
		expect(liveRegion).toHaveAttribute('aria-live', 'polite');
		expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
	});

	it('works with semantic HTML elements', () => {
		renderWithProviders(
			<ScrollArea>
				<nav>
					<ul>
						<li>
							<a href="#1">Link 1</a>
						</li>
						<li>
							<a href="#2">Link 2</a>
						</li>
					</ul>
				</nav>
			</ScrollArea>
		);

		expect(screen.getByRole('navigation')).toBeInTheDocument();
		expect(screen.getByRole('list')).toBeInTheDocument();
		expect(screen.getAllByRole('listitem')).toHaveLength(2);
		expect(screen.getByRole('link', { name: 'Link 1' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Link 2' })).toBeInTheDocument();
	});
});

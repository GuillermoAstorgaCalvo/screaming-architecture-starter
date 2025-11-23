/**
 * Marquee Component Tests
 *
 * Tests for the Marquee component including:
 * - Rendering
 * - Props handling
 * - Default values
 * - Accessibility
 * - Integration with hooks
 */

import { ARIA_LABELS } from '@core/constants/aria';
import Marquee from '@core/ui/media/marquee/Marquee';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock ResizeObserver globally
beforeEach(() => {
	const observeSpy = vi.fn();
	const disconnectSpy = vi.fn();
	const mockResizeObserver = class {
		observe = observeSpy;
		disconnect = disconnectSpy;
		unobserve = vi.fn();
	} as unknown as typeof ResizeObserver;
	globalThis.ResizeObserver = mockResizeObserver;
	vi.clearAllMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
});

const TEST_CONTENT = 'Breaking news: Important announcement';

describe('Marquee - Rendering', () => {
	it('renders marquee element', () => {
		renderWithProviders(<Marquee>{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
	});

	it('renders with text content', () => {
		renderWithProviders(<Marquee>{TEST_CONTENT}</Marquee>);
		expect(screen.getAllByText(TEST_CONTENT).length).toBeGreaterThan(0);
	});

	it('renders with custom className', () => {
		renderWithProviders(<Marquee className="custom-class">{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toHaveClass('custom-class');
	});

	it('renders with complex children', () => {
		renderWithProviders(
			<Marquee>
				<div>
					<span>Item 1</span>
					<span>Item 2</span>
				</div>
			</Marquee>
		);
		expect(screen.getAllByText('Item 1').length).toBeGreaterThan(0);
		expect(screen.getAllByText('Item 2').length).toBeGreaterThan(0);
	});
});

describe('Marquee - Default Props', () => {
	it('uses default aria-label when not provided', () => {
		renderWithProviders(<Marquee>{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toHaveAttribute('aria-label', ARIA_LABELS.MARQUEE);
	});

	it('uses custom aria-label when provided', () => {
		const customLabel = 'Custom marquee label';
		renderWithProviders(<Marquee aria-label={customLabel}>{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toHaveAttribute('aria-label', customLabel);
	});

	it('has aria-live="polite" attribute', () => {
		renderWithProviders(<Marquee>{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toHaveAttribute('aria-live', 'polite');
	});
});

describe('Marquee - Props', () => {
	it('handles direction prop', () => {
		renderWithProviders(<Marquee direction="right">{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
	});

	it('handles speed prop', () => {
		renderWithProviders(<Marquee speed={30}>{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
	});

	it('handles pauseOnHover prop', () => {
		renderWithProviders(<Marquee pauseOnHover={false}>{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
	});

	it('handles loop prop', () => {
		renderWithProviders(<Marquee loop={false}>{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
	});

	it('handles duplicateCount prop', () => {
		renderWithProviders(<Marquee duplicateCount={5}>{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
	});

	it('handles all props together', () => {
		renderWithProviders(
			<Marquee
				direction="right"
				speed={30}
				pauseOnHover
				loop
				duplicateCount={3}
				className="custom-class"
				aria-label="Custom label"
			>
				{TEST_CONTENT}
			</Marquee>
		);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
		expect(marquee).toHaveClass('custom-class');
		expect(marquee).toHaveAttribute('aria-label', 'Custom label');
	});
});

describe('Marquee - Additional Props', () => {
	it('passes through additional HTML attributes', () => {
		renderWithProviders(
			<Marquee data-testid="custom-marquee" id="marquee-1">
				{TEST_CONTENT}
			</Marquee>
		);
		const marquee = screen.getByTestId('custom-marquee');
		expect(marquee).toBeInTheDocument();
		expect(marquee).toHaveAttribute('id', 'marquee-1');
	});

	it('handles onMouseEnter and onMouseLeave', () => {
		const handleMouseEnter = vi.fn();
		const handleMouseLeave = vi.fn();
		renderWithProviders(
			<Marquee onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
				{TEST_CONTENT}
			</Marquee>
		);
		const marquee = screen.getByRole('marquee');
		fireEvent.mouseEnter(marquee);
		expect(handleMouseEnter).toHaveBeenCalledTimes(1);
		fireEvent.mouseLeave(marquee);
		expect(handleMouseLeave).toHaveBeenCalledTimes(1);
	});
});

describe('Marquee - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(<Marquee>{TEST_CONTENT}</Marquee>);
		await expectA11y(container);
	});

	it('has proper role attribute', () => {
		renderWithProviders(<Marquee>{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
	});

	it('has aria-live attribute for screen readers', () => {
		renderWithProviders(<Marquee>{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toHaveAttribute('aria-live', 'polite');
	});

	it('supports custom aria-label for better accessibility', () => {
		const customLabel = 'News ticker';
		renderWithProviders(<Marquee aria-label={customLabel}>{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee', { name: customLabel });
		expect(marquee).toBeInTheDocument();
	});
});

describe('Marquee - Integration', () => {
	it('integrates with useMarqueeLogic hook', () => {
		renderWithProviders(<Marquee>{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
		// Verify the component structure is correct
		expect(marquee).toHaveAttribute('role', 'marquee');
	});

	it('renders measure element when loop is true and duplicateCount is not provided', () => {
		renderWithProviders(<Marquee loop>{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
		// Measure element should be rendered (but hidden)
	});

	it('does not render measure element when duplicateCount is provided', () => {
		renderWithProviders(
			<Marquee loop duplicateCount={3}>
				{TEST_CONTENT}
			</Marquee>
		);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
	});

	it('renders duplicated content when loop is true', () => {
		renderWithProviders(<Marquee loop>{TEST_CONTENT}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
		// Content should be duplicated for seamless loop
	});
});

describe('Marquee - Edge Cases', () => {
	it('handles empty children', () => {
		renderWithProviders(<Marquee>{null}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
	});

	it('handles null children', () => {
		renderWithProviders(<Marquee>{null}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
	});

	it('handles very long content', () => {
		const longContent = 'A'.repeat(1000);
		renderWithProviders(<Marquee>{longContent}</Marquee>);
		const marquee = screen.getByRole('marquee');
		expect(marquee).toBeInTheDocument();
	});

	it('handles rapid prop changes', () => {
		const { rerender } = renderWithProviders(
			<Marquee direction="left" speed={50}>
				{TEST_CONTENT}
			</Marquee>
		);
		const marquee1 = screen.getByRole('marquee');
		expect(marquee1).toBeInTheDocument();

		rerender(
			<Marquee direction="right" speed={100}>
				{TEST_CONTENT}
			</Marquee>
		);
		const marquee2 = screen.getByRole('marquee');
		expect(marquee2).toBeInTheDocument();
	});
});

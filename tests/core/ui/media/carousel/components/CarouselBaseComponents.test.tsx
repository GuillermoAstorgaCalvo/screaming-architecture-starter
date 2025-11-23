/**
 * CarouselBaseComponents Tests
 *
 * Tests for CarouselArrow and CarouselDots components including:
 * - Rendering
 * - Arrow directions and states
 * - Dot navigation
 * - Custom arrows
 * - Accessibility
 */

import {
	CarouselArrow,
	CarouselDots,
} from '@core/ui/media/carousel/components/CarouselBaseComponents';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('CarouselArrow - Rendering', () => {
	it('renders previous arrow', () => {
		renderWithProviders(<CarouselArrow direction="prev" onClick={vi.fn()} disabled={false} />);

		const button = screen.getByLabelText(/previous/i);
		expect(button).toBeInTheDocument();
	});

	it('renders next arrow', () => {
		renderWithProviders(<CarouselArrow direction="next" onClick={vi.fn()} disabled={false} />);

		const button = screen.getByLabelText(/next/i);
		expect(button).toBeInTheDocument();
	});

	it('renders with disabled state', () => {
		renderWithProviders(<CarouselArrow direction="prev" onClick={vi.fn()} disabled />);

		const button = screen.getByLabelText(/previous/i);
		expect(button).toBeDisabled();
	});

	it('renders with enabled state', () => {
		renderWithProviders(<CarouselArrow direction="prev" onClick={vi.fn()} disabled={false} />);

		const button = screen.getByLabelText(/previous/i);
		expect(button).not.toBeDisabled();
	});

	it('applies correct position classes for prev arrow', () => {
		const { container } = renderWithProviders(
			<CarouselArrow direction="prev" onClick={vi.fn()} disabled={false} />
		);

		const button = container.querySelector('button');
		expect(button).toHaveClass('left-2');
	});

	it('applies correct position classes for next arrow', () => {
		const { container } = renderWithProviders(
			<CarouselArrow direction="next" onClick={vi.fn()} disabled={false} />
		);

		const button = container.querySelector('button');
		expect(button).toHaveClass('right-2');
	});
});

describe('CarouselArrow - Custom Arrow', () => {
	it('renders custom arrow when provided', () => {
		renderWithProviders(
			<CarouselArrow
				direction="prev"
				onClick={vi.fn()}
				disabled={false}
				customArrow={<span data-testid="custom-arrow">Custom</span>}
			/>
		);

		expect(screen.getByTestId('custom-arrow')).toBeInTheDocument();
	});

	it('renders default arrow when custom arrow is not provided', () => {
		renderWithProviders(<CarouselArrow direction="prev" onClick={vi.fn()} disabled={false} />);

		const button = screen.getByLabelText(/previous/i);
		const svg = button.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('custom arrow is clickable', () => {
		const onClick = vi.fn();

		renderWithProviders(
			<CarouselArrow
				direction="prev"
				onClick={onClick}
				disabled={false}
				customArrow={<button data-testid="custom-arrow">Custom</button>}
			/>
		);

		const customArrow = screen.getByTestId('custom-arrow');
		fireEvent.click(customArrow);

		expect(onClick).toHaveBeenCalledTimes(1);
	});
});

describe('CarouselArrow - Interactions', () => {
	it('calls onClick when clicked and not disabled', () => {
		const onClick = vi.fn();

		renderWithProviders(<CarouselArrow direction="prev" onClick={onClick} disabled={false} />);

		const button = screen.getByLabelText(/previous/i);
		fireEvent.click(button);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('does not call onClick when disabled', () => {
		const onClick = vi.fn();

		renderWithProviders(<CarouselArrow direction="prev" onClick={onClick} disabled />);

		const button = screen.getByLabelText(/previous/i);
		fireEvent.click(button);

		expect(onClick).not.toHaveBeenCalled();
	});
});

describe('CarouselDots - Rendering', () => {
	it('renders correct number of dots', () => {
		renderWithProviders(
			<CarouselDots
				totalSlides={5}
				activeIndex={0}
				carouselId="test-carousel"
				onDotClick={vi.fn()}
			/>
		);

		const dots = screen.getAllByRole('tab');
		expect(dots).toHaveLength(5);
	});

	it('renders with active dot highlighted', () => {
		renderWithProviders(
			<CarouselDots
				totalSlides={3}
				activeIndex={1}
				carouselId="test-carousel"
				onDotClick={vi.fn()}
			/>
		);

		const dots = screen.getAllByRole('tab');
		expect(dots[1]).toHaveAttribute('aria-selected', 'true');
		expect(dots[0]).toHaveAttribute('aria-selected', 'false');
		expect(dots[2]).toHaveAttribute('aria-selected', 'false');
	});

	it('renders tablist with correct aria-label', () => {
		renderWithProviders(
			<CarouselDots
				totalSlides={3}
				activeIndex={0}
				carouselId="test-carousel"
				onDotClick={vi.fn()}
			/>
		);

		const tablist = screen.getByRole('tablist');
		expect(tablist).toBeInTheDocument();
		expect(tablist).toHaveAttribute('aria-label');
	});
});

describe('CarouselDots - Dot Attributes', () => {
	it('has correct aria attributes on dots', () => {
		renderWithProviders(
			<CarouselDots
				totalSlides={3}
				activeIndex={1}
				carouselId="test-carousel"
				onDotClick={vi.fn()}
			/>
		);

		const dots = screen.getAllByRole('tab');
		expect(dots[0]).toHaveAttribute('aria-controls', 'test-carousel-slide-0');
		expect(dots[1]).toHaveAttribute('aria-controls', 'test-carousel-slide-1');
		expect(dots[2]).toHaveAttribute('aria-controls', 'test-carousel-slide-2');
	});

	it('has correct aria-label on dots', () => {
		renderWithProviders(
			<CarouselDots
				totalSlides={3}
				activeIndex={0}
				carouselId="test-carousel"
				onDotClick={vi.fn()}
			/>
		);

		const dots = screen.getAllByRole('tab');
		expect(dots[0]).toHaveAttribute('aria-label');
		expect(dots[1]).toHaveAttribute('aria-label');
		expect(dots[2]).toHaveAttribute('aria-label');
	});

	it('has unique keys for dots', () => {
		renderWithProviders(
			<CarouselDots
				totalSlides={3}
				activeIndex={0}
				carouselId="test-carousel"
				onDotClick={vi.fn()}
			/>
		);

		const dots = screen.getAllByRole('tab');
		expect(dots[0]).toHaveAttribute('aria-controls', 'test-carousel-slide-0');
		expect(dots[1]).toHaveAttribute('aria-controls', 'test-carousel-slide-1');
		expect(dots[2]).toHaveAttribute('aria-controls', 'test-carousel-slide-2');
	});
});

describe('CarouselDots - Interactions', () => {
	it('calls onDotClick with correct index when dot is clicked', () => {
		const onDotClick = vi.fn();

		renderWithProviders(
			<CarouselDots
				totalSlides={3}
				activeIndex={0}
				carouselId="test-carousel"
				onDotClick={onDotClick}
			/>
		);

		const dots = screen.getAllByRole('tab');
		const dot = dots[2];
		if (dot) {
			fireEvent.click(dot);
		}

		expect(onDotClick).toHaveBeenCalledWith(2);
		expect(onDotClick).toHaveBeenCalledTimes(1);
	});

	it('calls onDotClick for each dot', () => {
		const onDotClick = vi.fn();

		renderWithProviders(
			<CarouselDots
				totalSlides={3}
				activeIndex={0}
				carouselId="test-carousel"
				onDotClick={onDotClick}
			/>
		);

		const dots = screen.getAllByRole('tab');
		if (dots[0]) fireEvent.click(dots[0]);
		if (dots[1]) fireEvent.click(dots[1]);
		if (dots[2]) fireEvent.click(dots[2]);

		expect(onDotClick).toHaveBeenCalledWith(0);
		expect(onDotClick).toHaveBeenCalledWith(1);
		expect(onDotClick).toHaveBeenCalledWith(2);
		expect(onDotClick).toHaveBeenCalledTimes(3);
	});
});

describe('CarouselDots - Visual States', () => {
	it('applies active styles to active dot', () => {
		renderWithProviders(
			<CarouselDots
				totalSlides={3}
				activeIndex={1}
				carouselId="test-carousel"
				onDotClick={vi.fn()}
			/>
		);

		const dots = screen.getAllByRole('tab');
		const activeDot = dots[1];
		expect(activeDot).toHaveClass('bg-primary');
		expect(activeDot).toHaveClass('w-6');
	});

	it('applies inactive styles to inactive dots', () => {
		renderWithProviders(
			<CarouselDots
				totalSlides={3}
				activeIndex={1}
				carouselId="test-carousel"
				onDotClick={vi.fn()}
			/>
		);

		const dots = screen.getAllByRole('tab');
		const inactiveDot = dots[0];
		expect(inactiveDot).toHaveClass('bg-muted');
		expect(inactiveDot).not.toHaveClass('w-6');
	});
});

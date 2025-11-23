/**
 * Carousel Component Tests
 *
 * Tests for the Carousel component including:
 * - Rendering
 * - Navigation (arrows, dots)
 * - Auto-play
 * - Loop functionality
 * - Keyboard navigation
 * - Controlled and uncontrolled modes
 * - Custom arrows
 * - Accessibility
 */

import Carousel from '@core/ui/media/carousel/Carousel';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('Carousel - Rendering', () => {
	it('renders carousel with children', () => {
		renderWithProviders(
			<Carousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</Carousel>
		);

		expect(screen.getByText('Slide 1')).toBeInTheDocument();
		expect(screen.getByText('Slide 2')).toBeInTheDocument();
		expect(screen.getByText('Slide 3')).toBeInTheDocument();
	});

	it('renders with default aria-label', () => {
		renderWithProviders(
			<Carousel>
				<div>Slide 1</div>
			</Carousel>
		);

		const carousel = screen.getByRole('region', { name: /carousel/i });
		expect(carousel).toBeInTheDocument();
	});

	it('renders with custom aria-label', () => {
		renderWithProviders(
			<Carousel aria-label="Image gallery">
				<div>Slide 1</div>
			</Carousel>
		);

		const carousel = screen.getByRole('region', { name: 'Image gallery' });
		expect(carousel).toBeInTheDocument();
	});

	it('applies custom className', () => {
		const { container } = renderWithProviders(
			<Carousel className="custom-carousel">
				<div>Slide 1</div>
			</Carousel>
		);

		const carousel = container.querySelector('section');
		expect(carousel).toHaveClass('custom-carousel');
	});

	it('renders navigation arrows by default', () => {
		renderWithProviders(
			<Carousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		const prevButton = screen.getByLabelText(/previous/i);
		const nextButton = screen.getByLabelText(/next/i);
		expect(prevButton).toBeInTheDocument();
		expect(nextButton).toBeInTheDocument();
	});

	it('renders navigation dots by default', () => {
		renderWithProviders(
			<Carousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		const dots = screen.getByRole('tablist');
		expect(dots).toBeInTheDocument();
	});

	it('does not render arrows when showArrows is false', () => {
		renderWithProviders(
			<Carousel showArrows={false}>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		expect(screen.queryByLabelText(/previous/i)).not.toBeInTheDocument();
		expect(screen.queryByLabelText(/next/i)).not.toBeInTheDocument();
	});

	it('does not render dots when showDots is false', () => {
		renderWithProviders(
			<Carousel showDots={false}>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
	});

	it('does not render navigation when only one slide', () => {
		renderWithProviders(
			<Carousel>
				<div>Slide 1</div>
			</Carousel>
		);

		expect(screen.queryByLabelText(/previous/i)).not.toBeInTheDocument();
		expect(screen.queryByLabelText(/next/i)).not.toBeInTheDocument();
		expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
	});
});

describe('Carousel - Navigation', () => {
	it('navigates to next slide when next arrow is clicked', () => {
		renderWithProviders(
			<Carousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</Carousel>
		);

		const nextButton = screen.getByLabelText(/next/i);
		fireEvent.click(nextButton);

		// The active slide should change (checking via aria-selected on dots)
		const dots = screen.getAllByRole('tab');
		expect(dots[1]).toHaveAttribute('aria-selected', 'true');
	});

	it('navigates to previous slide when prev arrow is clicked', () => {
		renderWithProviders(
			<Carousel defaultActiveIndex={1}>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</Carousel>
		);

		const prevButton = screen.getByLabelText(/previous/i);
		fireEvent.click(prevButton);

		const dots = screen.getAllByRole('tab');
		expect(dots[0]).toHaveAttribute('aria-selected', 'true');
	});

	it('navigates to specific slide when dot is clicked', () => {
		renderWithProviders(
			<Carousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</Carousel>
		);

		const dots = screen.getAllByRole('tab');
		const dot = dots[2];
		if (dot) {
			fireEvent.click(dot);
		}

		expect(dots[2]).toHaveAttribute('aria-selected', 'true');
	});

	it('calls onSlideChange when slide changes', () => {
		const onSlideChange = vi.fn();

		renderWithProviders(
			<Carousel onSlideChange={onSlideChange}>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		const nextButton = screen.getByLabelText(/next/i);
		fireEvent.click(nextButton);

		expect(onSlideChange).toHaveBeenCalledWith(1);
	});
});

describe('Carousel - Loop Functionality', () => {
	it('loops to first slide when next is clicked on last slide', () => {
		renderWithProviders(
			<Carousel defaultActiveIndex={2} loop>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</Carousel>
		);

		const nextButton = screen.getByLabelText(/next/i);
		fireEvent.click(nextButton);

		const dots = screen.getAllByRole('tab');
		expect(dots[0]).toHaveAttribute('aria-selected', 'true');
	});

	it('loops to last slide when prev is clicked on first slide', () => {
		renderWithProviders(
			<Carousel defaultActiveIndex={0} loop>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</Carousel>
		);

		const prevButton = screen.getByLabelText(/previous/i);
		fireEvent.click(prevButton);

		const dots = screen.getAllByRole('tab');
		expect(dots[2]).toHaveAttribute('aria-selected', 'true');
	});

	it('disables prev arrow on first slide when loop is false', () => {
		renderWithProviders(
			<Carousel defaultActiveIndex={0} loop={false}>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		const prevButton = screen.getByLabelText(/previous/i);
		expect(prevButton).toBeDisabled();
	});

	it('disables next arrow on last slide when loop is false', () => {
		renderWithProviders(
			<Carousel defaultActiveIndex={1} loop={false}>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		const nextButton = screen.getByLabelText(/next/i);
		expect(nextButton).toBeDisabled();
	});
});

describe('Carousel - Keyboard Navigation', () => {
	it('navigates to next slide on ArrowRight key', () => {
		renderWithProviders(
			<Carousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		const carousel = screen.getByRole('region');
		carousel.focus();

		fireEvent.keyDown(carousel, { key: 'ArrowRight' });

		const dots = screen.getAllByRole('tab');
		expect(dots[1]).toHaveAttribute('aria-selected', 'true');
	});

	it('navigates to previous slide on ArrowLeft key', () => {
		renderWithProviders(
			<Carousel defaultActiveIndex={1}>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		const carousel = screen.getByRole('region');
		carousel.focus();

		fireEvent.keyDown(carousel, { key: 'ArrowLeft' });

		const dots = screen.getAllByRole('tab');
		expect(dots[0]).toHaveAttribute('aria-selected', 'true');
	});

	it('has tabIndex for keyboard focus', () => {
		renderWithProviders(
			<Carousel>
				<div>Slide 1</div>
			</Carousel>
		);

		const carousel = screen.getByRole('region');
		expect(carousel).toHaveAttribute('tabIndex', '0');
	});
});

describe('Carousel - Controlled Mode', () => {
	it('displays controlled activeIndex', () => {
		renderWithProviders(
			<Carousel activeIndex={1}>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</Carousel>
		);

		const dots = screen.getAllByRole('tab');
		expect(dots[1]).toHaveAttribute('aria-selected', 'true');
	});

	it('updates when controlled activeIndex changes', () => {
		const { rerender } = renderWithProviders(
			<Carousel activeIndex={0}>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		let dots = screen.getAllByRole('tab');
		expect(dots[0]).toHaveAttribute('aria-selected', 'true');

		rerender(
			<Carousel activeIndex={1}>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		dots = screen.getAllByRole('tab');
		expect(dots[1]).toHaveAttribute('aria-selected', 'true');
	});
});

describe('Carousel - Uncontrolled Mode', () => {
	it('starts at defaultActiveIndex', () => {
		renderWithProviders(
			<Carousel defaultActiveIndex={1}>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</Carousel>
		);

		const dots = screen.getAllByRole('tab');
		expect(dots[1]).toHaveAttribute('aria-selected', 'true');
	});

	it('defaults to first slide when defaultActiveIndex is not provided', () => {
		renderWithProviders(
			<Carousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		const dots = screen.getAllByRole('tab');
		expect(dots[0]).toHaveAttribute('aria-selected', 'true');
	});
});

describe('Carousel - Custom Arrows', () => {
	it('renders custom previous arrow', () => {
		renderWithProviders(
			<Carousel prevArrow={<span data-testid="custom-prev">Custom Prev</span>}>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		expect(screen.getByTestId('custom-prev')).toBeInTheDocument();
		// Custom arrow is rendered inside the button, so the button with aria-label still exists
		const prevButton = screen.getByLabelText(/previous/i);
		expect(prevButton).toBeInTheDocument();
		expect(prevButton).toContainElement(screen.getByTestId('custom-prev'));
	});

	it('renders custom next arrow', () => {
		renderWithProviders(
			<Carousel nextArrow={<span data-testid="custom-next">Custom Next</span>}>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		expect(screen.getByTestId('custom-next')).toBeInTheDocument();
		// Custom arrow is rendered inside the button, so the button with aria-label still exists
		const nextButton = screen.getByLabelText(/next/i);
		expect(nextButton).toBeInTheDocument();
		expect(nextButton).toContainElement(screen.getByTestId('custom-next'));
	});

	it('custom arrows are functional', () => {
		renderWithProviders(
			<Carousel nextArrow={<span data-testid="custom-next">Next</span>}>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		// Click the button that contains the custom arrow
		const nextButton = screen.getByLabelText(/next/i);
		fireEvent.click(nextButton);

		const dots = screen.getAllByRole('tab');
		expect(dots[1]).toHaveAttribute('aria-selected', 'true');
	});
});

describe('Carousel - Auto-play', () => {
	it('does not auto-play by default', () => {
		renderWithProviders(
			<Carousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		const dots = screen.getAllByRole('tab');
		expect(dots[0]).toHaveAttribute('aria-selected', 'true');
		// Without autoPlay, the slide should remain on the first one
		expect(dots[1]).toHaveAttribute('aria-selected', 'false');
	});

	it('auto-plays when enabled', () => {
		renderWithProviders(
			<Carousel autoPlay autoPlayInterval={100}>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		// Verify carousel renders with autoPlay enabled
		const dots = screen.getAllByRole('tab');
		expect(dots[0]).toHaveAttribute('aria-selected', 'true');
		// The auto-play functionality is tested in the hook tests
		// Here we just verify the component accepts the prop and renders
	});

	it('uses custom autoPlayInterval', () => {
		renderWithProviders(
			<Carousel autoPlay autoPlayInterval={500}>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		// Verify carousel renders with custom interval
		const dots = screen.getAllByRole('tab');
		expect(dots[0]).toHaveAttribute('aria-selected', 'true');
		// The auto-play functionality is tested in the hook tests
		// Here we just verify the component accepts the prop and renders
	});
});

describe('Carousel - Accessibility', () => {
	it('passes accessibility checks', async () => {
		const { container } = renderWithProviders(
			<Carousel aria-label="Image carousel" autoPlay={false}>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		await expectA11y(container);
	});

	it('has correct ARIA attributes on carousel', () => {
		renderWithProviders(
			<Carousel aria-label="Gallery">
				<div>Slide 1</div>
			</Carousel>
		);

		const carousel = screen.getByRole('region', { name: 'Gallery' });
		expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
	});

	it('has correct ARIA attributes on slides', () => {
		renderWithProviders(
			<Carousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		const slide1 = screen.getByLabelText('Slide 1 of 2');
		expect(slide1).toHaveAttribute('aria-roledescription', 'slide');
	});

	it('has correct ARIA attributes on dots', () => {
		renderWithProviders(
			<Carousel>
				<div>Slide 1</div>
				<div>Slide 2</div>
			</Carousel>
		);

		const dots = screen.getAllByRole('tab');
		expect(dots[0]).toHaveAttribute('aria-selected', 'true');
		expect(dots[1]).toHaveAttribute('aria-selected', 'false');
	});
});

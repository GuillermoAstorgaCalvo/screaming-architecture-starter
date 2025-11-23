/**
 * CarouselArrowsSection Component Tests
 *
 * Tests for the CarouselArrowsSection component including:
 * - Rendering
 * - Conditional rendering based on showArrows and hasMultipleSlides
 * - Arrow disabled states
 * - Custom arrows
 * - Loop behavior
 */

import { CarouselArrowsSection } from '@core/ui/media/carousel/components/CarouselArrowsSection';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('CarouselArrowsSection - Rendering', () => {
	it('renders arrows when showArrows is true and hasMultipleSlides is true', () => {
		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides
				loop
				activeIndex={0}
				totalSlides={2}
				goToPrevious={vi.fn()}
				goToNext={vi.fn()}
			/>
		);

		expect(screen.getByLabelText(/previous/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/next/i)).toBeInTheDocument();
	});

	it('does not render when showArrows is false', () => {
		renderWithProviders(
			<CarouselArrowsSection
				showArrows={false}
				hasMultipleSlides
				loop
				activeIndex={0}
				totalSlides={2}
				goToPrevious={vi.fn()}
				goToNext={vi.fn()}
			/>
		);

		expect(screen.queryByLabelText(/previous/i)).not.toBeInTheDocument();
		expect(screen.queryByLabelText(/next/i)).not.toBeInTheDocument();
	});

	it('does not render when hasMultipleSlides is false', () => {
		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides={false}
				loop
				activeIndex={0}
				totalSlides={1}
				goToPrevious={vi.fn()}
				goToNext={vi.fn()}
			/>
		);

		expect(screen.queryByLabelText(/previous/i)).not.toBeInTheDocument();
		expect(screen.queryByLabelText(/next/i)).not.toBeInTheDocument();
	});

	it('does not render when both showArrows and hasMultipleSlides are false', () => {
		renderWithProviders(
			<CarouselArrowsSection
				showArrows={false}
				hasMultipleSlides={false}
				loop
				activeIndex={0}
				totalSlides={1}
				goToPrevious={vi.fn()}
				goToNext={vi.fn()}
			/>
		);

		expect(screen.queryByLabelText(/previous/i)).not.toBeInTheDocument();
		expect(screen.queryByLabelText(/next/i)).not.toBeInTheDocument();
	});
});

describe('CarouselArrowsSection - Arrow States', () => {
	it('disables prev arrow on first slide when loop is false', () => {
		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides
				loop={false}
				activeIndex={0}
				totalSlides={3}
				goToPrevious={vi.fn()}
				goToNext={vi.fn()}
			/>
		);

		const prevButton = screen.getByLabelText(/previous/i);
		expect(prevButton).toBeDisabled();
	});

	it('enables prev arrow on first slide when loop is true', () => {
		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides
				loop
				activeIndex={0}
				totalSlides={3}
				goToPrevious={vi.fn()}
				goToNext={vi.fn()}
			/>
		);

		const prevButton = screen.getByLabelText(/previous/i);
		expect(prevButton).not.toBeDisabled();
	});

	it('disables next arrow on last slide when loop is false', () => {
		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides
				loop={false}
				activeIndex={2}
				totalSlides={3}
				goToPrevious={vi.fn()}
				goToNext={vi.fn()}
			/>
		);

		const nextButton = screen.getByLabelText(/next/i);
		expect(nextButton).toBeDisabled();
	});

	it('enables next arrow on last slide when loop is true', () => {
		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides
				loop
				activeIndex={2}
				totalSlides={3}
				goToPrevious={vi.fn()}
				goToNext={vi.fn()}
			/>
		);

		const nextButton = screen.getByLabelText(/next/i);
		expect(nextButton).not.toBeDisabled();
	});

	it('enables both arrows on middle slide when loop is false', () => {
		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides
				loop={false}
				activeIndex={1}
				totalSlides={3}
				goToPrevious={vi.fn()}
				goToNext={vi.fn()}
			/>
		);

		const prevButton = screen.getByLabelText(/previous/i);
		const nextButton = screen.getByLabelText(/next/i);
		expect(prevButton).not.toBeDisabled();
		expect(nextButton).not.toBeDisabled();
	});
});

describe('CarouselArrowsSection - Arrow Actions', () => {
	it('calls goToPrevious when prev arrow is clicked', () => {
		const goToPrevious = vi.fn();

		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides
				loop
				activeIndex={1}
				totalSlides={3}
				goToPrevious={goToPrevious}
				goToNext={vi.fn()}
			/>
		);

		const prevButton = screen.getByLabelText(/previous/i);
		fireEvent.click(prevButton);

		expect(goToPrevious).toHaveBeenCalledTimes(1);
	});

	it('calls goToNext when next arrow is clicked', () => {
		const goToNext = vi.fn();

		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides
				loop
				activeIndex={1}
				totalSlides={3}
				goToPrevious={vi.fn()}
				goToNext={goToNext}
			/>
		);

		const nextButton = screen.getByLabelText(/next/i);
		fireEvent.click(nextButton);

		expect(goToNext).toHaveBeenCalledTimes(1);
	});

	it('does not call goToPrevious when prev arrow is disabled and clicked', () => {
		const goToPrevious = vi.fn();

		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides
				loop={false}
				activeIndex={0}
				totalSlides={3}
				goToPrevious={goToPrevious}
				goToNext={vi.fn()}
			/>
		);

		const prevButton = screen.getByLabelText(/previous/i);
		fireEvent.click(prevButton);

		expect(goToPrevious).not.toHaveBeenCalled();
	});

	it('does not call goToNext when next arrow is disabled and clicked', () => {
		const goToNext = vi.fn();

		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides
				loop={false}
				activeIndex={2}
				totalSlides={3}
				goToPrevious={vi.fn()}
				goToNext={goToNext}
			/>
		);

		const nextButton = screen.getByLabelText(/next/i);
		fireEvent.click(nextButton);

		expect(goToNext).not.toHaveBeenCalled();
	});
});

describe('CarouselArrowsSection - Custom Arrows', () => {
	it('renders custom previous arrow', () => {
		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides
				loop
				activeIndex={0}
				totalSlides={2}
				goToPrevious={vi.fn()}
				goToNext={vi.fn()}
				prevArrow={<span data-testid="custom-prev">Custom Prev</span>}
			/>
		);

		expect(screen.getByTestId('custom-prev')).toBeInTheDocument();
		// Custom arrow is rendered inside the button, so the button with aria-label still exists
		const prevButton = screen.getByLabelText(/previous/i);
		expect(prevButton).toBeInTheDocument();
		expect(prevButton).toContainElement(screen.getByTestId('custom-prev'));
	});

	it('renders custom next arrow', () => {
		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides
				loop
				activeIndex={0}
				totalSlides={2}
				goToPrevious={vi.fn()}
				goToNext={vi.fn()}
				nextArrow={<span data-testid="custom-next">Custom Next</span>}
			/>
		);

		expect(screen.getByTestId('custom-next')).toBeInTheDocument();
		// Custom arrow is rendered inside the button, so the button with aria-label still exists
		const nextButton = screen.getByLabelText(/next/i);
		expect(nextButton).toBeInTheDocument();
		expect(nextButton).toContainElement(screen.getByTestId('custom-next'));
	});

	it('renders both custom arrows', () => {
		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides
				loop
				activeIndex={0}
				totalSlides={2}
				goToPrevious={vi.fn()}
				goToNext={vi.fn()}
				prevArrow={<span data-testid="custom-prev">Prev</span>}
				nextArrow={<span data-testid="custom-next">Next</span>}
			/>
		);

		expect(screen.getByTestId('custom-prev')).toBeInTheDocument();
		expect(screen.getByTestId('custom-next')).toBeInTheDocument();
	});

	it('custom arrows are functional', () => {
		const goToPrevious = vi.fn();
		const goToNext = vi.fn();

		renderWithProviders(
			<CarouselArrowsSection
				showArrows
				hasMultipleSlides
				loop
				activeIndex={0}
				totalSlides={2}
				goToPrevious={goToPrevious}
				goToNext={goToNext}
				prevArrow={<span data-testid="custom-prev">Prev</span>}
				nextArrow={<span data-testid="custom-next">Next</span>}
			/>
		);

		// Click the buttons that contain the custom arrows
		const prevButton = screen.getByLabelText(/previous/i);
		fireEvent.click(prevButton);
		expect(goToPrevious).toHaveBeenCalledTimes(1);

		const nextButton = screen.getByLabelText(/next/i);
		fireEvent.click(nextButton);
		expect(goToNext).toHaveBeenCalledTimes(1);
	});
});

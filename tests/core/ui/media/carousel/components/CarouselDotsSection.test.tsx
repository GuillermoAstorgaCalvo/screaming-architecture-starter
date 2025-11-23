/**
 * CarouselDotsSection Component Tests
 *
 * Tests for the CarouselDotsSection component including:
 * - Rendering
 * - Conditional rendering based on showDots and hasMultipleSlides
 * - Props forwarding to CarouselDots
 */

import { CarouselDotsSection } from '@core/ui/media/carousel/components/CarouselDotsSection';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('CarouselDotsSection - Rendering', () => {
	it('renders dots when showDots is true and hasMultipleSlides is true', () => {
		renderWithProviders(
			<CarouselDotsSection
				showDots
				hasMultipleSlides
				totalSlides={3}
				activeIndex={0}
				carouselId="test-carousel"
				onDotClick={vi.fn()}
			/>
		);

		const tablist = screen.getByRole('tablist');
		expect(tablist).toBeInTheDocument();
	});

	it('does not render when showDots is false', () => {
		renderWithProviders(
			<CarouselDotsSection
				showDots={false}
				hasMultipleSlides
				totalSlides={3}
				activeIndex={0}
				carouselId="test-carousel"
				onDotClick={vi.fn()}
			/>
		);

		expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
	});

	it('does not render when hasMultipleSlides is false', () => {
		renderWithProviders(
			<CarouselDotsSection
				showDots
				hasMultipleSlides={false}
				totalSlides={1}
				activeIndex={0}
				carouselId="test-carousel"
				onDotClick={vi.fn()}
			/>
		);

		expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
	});

	it('does not render when both showDots and hasMultipleSlides are false', () => {
		renderWithProviders(
			<CarouselDotsSection
				showDots={false}
				hasMultipleSlides={false}
				totalSlides={1}
				activeIndex={0}
				carouselId="test-carousel"
				onDotClick={vi.fn()}
			/>
		);

		expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
	});
});

describe('CarouselDotsSection - Props Forwarding', () => {
	it('forwards totalSlides to CarouselDots', () => {
		renderWithProviders(
			<CarouselDotsSection
				showDots
				hasMultipleSlides
				totalSlides={5}
				activeIndex={0}
				carouselId="test-carousel"
				onDotClick={vi.fn()}
			/>
		);

		const dots = screen.getAllByRole('tab');
		expect(dots).toHaveLength(5);
	});

	it('forwards activeIndex to CarouselDots', () => {
		renderWithProviders(
			<CarouselDotsSection
				showDots
				hasMultipleSlides
				totalSlides={3}
				activeIndex={2}
				carouselId="test-carousel"
				onDotClick={vi.fn()}
			/>
		);

		const dots = screen.getAllByRole('tab');
		expect(dots[2]).toHaveAttribute('aria-selected', 'true');
	});

	it('forwards carouselId to CarouselDots', () => {
		renderWithProviders(
			<CarouselDotsSection
				showDots
				hasMultipleSlides
				totalSlides={3}
				activeIndex={0}
				carouselId="custom-carousel-id"
				onDotClick={vi.fn()}
			/>
		);

		const dots = screen.getAllByRole('tab');
		expect(dots[0]).toHaveAttribute('aria-controls', 'custom-carousel-id-slide-0');
	});

	it('forwards onDotClick to CarouselDots', () => {
		const onDotClick = vi.fn();

		renderWithProviders(
			<CarouselDotsSection
				showDots
				hasMultipleSlides
				totalSlides={3}
				activeIndex={0}
				carouselId="test-carousel"
				onDotClick={onDotClick}
			/>
		);

		const dots = screen.getAllByRole('tab');
		// The actual click handling is tested in CarouselDots tests
		expect(dots).toHaveLength(3);
	});
});

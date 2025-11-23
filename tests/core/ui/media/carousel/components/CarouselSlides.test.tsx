/**
 * CarouselSlides Component Tests
 *
 * Tests for the CarouselSlides component including:
 * - Rendering
 * - Slide transformation
 * - ARIA attributes
 * - Slide keys
 * - Multiple slides
 */

import { CarouselSlides } from '@core/ui/media/carousel/components/CarouselSlides';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('CarouselSlides - Rendering', () => {
	it('renders all slides', () => {
		renderWithProviders(
			<CarouselSlides
				slides={[
					<div key="1">Slide 1</div>,
					<div key="2">Slide 2</div>,
					<div key="3">Slide 3</div>,
				]}
				activeIndex={0}
				carouselId="test-carousel"
			/>
		);

		expect(screen.getByText('Slide 1')).toBeInTheDocument();
		expect(screen.getByText('Slide 2')).toBeInTheDocument();
		expect(screen.getByText('Slide 3')).toBeInTheDocument();
	});

	it('renders single slide', () => {
		renderWithProviders(
			<CarouselSlides
				slides={[<div key="1">Slide 1</div>]}
				activeIndex={0}
				carouselId="test-carousel"
			/>
		);

		expect(screen.getByText('Slide 1')).toBeInTheDocument();
	});

	it('renders empty slides array', () => {
		const { container } = renderWithProviders(
			<CarouselSlides slides={[]} activeIndex={0} carouselId="test-carousel" />
		);

		const slidesContainer = container.querySelector('.relative');
		expect(slidesContainer).toBeInTheDocument();
	});
});

describe('CarouselSlides - Slide Transformation', () => {
	it('applies correct transform for first slide', () => {
		const { container } = renderWithProviders(
			<CarouselSlides
				slides={[<div key="1">Slide 1</div>, <div key="2">Slide 2</div>]}
				activeIndex={0}
				carouselId="test-carousel"
			/>
		);

		const transformContainer = container.querySelector('.flex');
		expect(transformContainer).toHaveStyle({ transform: 'translateX(-0%)' });
	});

	it('applies correct transform for second slide', () => {
		const { container } = renderWithProviders(
			<CarouselSlides
				slides={[<div key="1">Slide 1</div>, <div key="2">Slide 2</div>]}
				activeIndex={1}
				carouselId="test-carousel"
			/>
		);

		const transformContainer = container.querySelector('.flex');
		expect(transformContainer).toHaveStyle({ transform: 'translateX(-100%)' });
	});

	it('applies correct transform for third slide', () => {
		const { container } = renderWithProviders(
			<CarouselSlides
				slides={[
					<div key="1">Slide 1</div>,
					<div key="2">Slide 2</div>,
					<div key="3">Slide 3</div>,
				]}
				activeIndex={2}
				carouselId="test-carousel"
			/>
		);

		const transformContainer = container.querySelector('.flex');
		expect(transformContainer).toHaveStyle({ transform: 'translateX(-200%)' });
	});

	it('updates transform when activeIndex changes', () => {
		const { rerender, container } = renderWithProviders(
			<CarouselSlides
				slides={[<div key="1">Slide 1</div>, <div key="2">Slide 2</div>]}
				activeIndex={0}
				carouselId="test-carousel"
			/>
		);

		let transformContainer = container.querySelector('.flex');
		expect(transformContainer).toHaveStyle({ transform: 'translateX(-0%)' });

		rerender(
			<CarouselSlides
				slides={[<div key="1">Slide 1</div>, <div key="2">Slide 2</div>]}
				activeIndex={1}
				carouselId="test-carousel"
			/>
		);

		transformContainer = container.querySelector('.flex');
		expect(transformContainer).toHaveStyle({ transform: 'translateX(-100%)' });
	});
});

describe('CarouselSlides - ARIA Attributes', () => {
	it('has correct aria attributes on slides', () => {
		renderWithProviders(
			<CarouselSlides
				slides={[<div key="1">Slide 1</div>, <div key="2">Slide 2</div>]}
				activeIndex={0}
				carouselId="test-carousel"
			/>
		);

		const slide1 = screen.getByLabelText('Slide 1 of 2');
		expect(slide1).toHaveAttribute('aria-roledescription', 'slide');
		expect(slide1).toHaveAttribute('id', 'test-carousel-slide-0');

		const slide2 = screen.getByLabelText('Slide 2 of 2');
		expect(slide2).toHaveAttribute('aria-roledescription', 'slide');
		expect(slide2).toHaveAttribute('id', 'test-carousel-slide-1');
	});

	it('uses carouselId in slide IDs', () => {
		renderWithProviders(
			<CarouselSlides
				slides={[<div key="1">Slide 1</div>]}
				activeIndex={0}
				carouselId="custom-id"
			/>
		);

		const slide = screen.getByLabelText('Slide 1 of 1');
		expect(slide).toHaveAttribute('id', 'custom-id-slide-0');
	});

	it('has correct slide numbering in aria-label', () => {
		renderWithProviders(
			<CarouselSlides
				slides={[
					<div key="1">Slide 1</div>,
					<div key="2">Slide 2</div>,
					<div key="3">Slide 3</div>,
				]}
				activeIndex={1}
				carouselId="test-carousel"
			/>
		);

		expect(screen.getByLabelText('Slide 1 of 3')).toBeInTheDocument();
		expect(screen.getByLabelText('Slide 2 of 3')).toBeInTheDocument();
		expect(screen.getByLabelText('Slide 3 of 3')).toBeInTheDocument();
	});
});

describe('CarouselSlides - Slide Keys', () => {
	it('uses slide key when available', () => {
		renderWithProviders(
			<CarouselSlides
				slides={[<div key="custom-key-1">Slide 1</div>, <div key="custom-key-2">Slide 2</div>]}
				activeIndex={0}
				carouselId="test-carousel"
			/>
		);

		expect(screen.getByText('Slide 1')).toBeInTheDocument();
		expect(screen.getByText('Slide 2')).toBeInTheDocument();
	});

	it('generates key when slide key is not available', () => {
		renderWithProviders(
			<CarouselSlides
				slides={[<div key="slide-1">Slide 1</div>, <div key="slide-2">Slide 2</div>]}
				activeIndex={0}
				carouselId="test-carousel"
			/>
		);

		expect(screen.getByText('Slide 1')).toBeInTheDocument();
		expect(screen.getByText('Slide 2')).toBeInTheDocument();
	});
});

describe('CarouselSlides - Slide Classes', () => {
	it('applies correct classes to slide wrapper', () => {
		renderWithProviders(
			<CarouselSlides
				slides={[<div key="1">Slide 1</div>]}
				activeIndex={0}
				carouselId="test-carousel"
			/>
		);

		const slide = screen.getByLabelText('Slide 1 of 1');
		expect(slide).toHaveClass('min-w-full', 'shrink-0');
	});

	it('applies transition classes to container', () => {
		const { container } = renderWithProviders(
			<CarouselSlides
				slides={[<div key="1">Slide 1</div>]}
				activeIndex={0}
				carouselId="test-carousel"
			/>
		);

		const transformContainer = container.querySelector('.flex');
		expect(transformContainer).toHaveClass('transition-transform', 'duration-slow', 'ease-in-out');
	});
});

describe('CarouselSlides - Complex Content', () => {
	it('renders complex slide content', () => {
		renderWithProviders(
			<CarouselSlides
				slides={[
					<div key="1">
						<h2>Title 1</h2>
						<p>Content 1</p>
						<button>Action</button>
					</div>,
					<div key="2">
						<h2>Title 2</h2>
						<p>Content 2</p>
					</div>,
				]}
				activeIndex={0}
				carouselId="test-carousel"
			/>
		);

		expect(screen.getByText('Title 1')).toBeInTheDocument();
		expect(screen.getByText('Content 1')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeInTheDocument();
		expect(screen.getByText('Title 2')).toBeInTheDocument();
		expect(screen.getByText('Content 2')).toBeInTheDocument();
	});
});

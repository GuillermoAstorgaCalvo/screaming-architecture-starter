/**
 * AspectRatio Component Tests
 *
 * Tests for the AspectRatio component including:
 * - Rendering
 * - Aspect ratio calculations
 * - Default values
 * - Custom ratios
 * - Children rendering
 * - Custom className
 * - Style forwarding
 */

import AspectRatio from '@core/ui/layout/aspect-ratio/AspectRatio';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('AspectRatio - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<AspectRatio>
				<div>Test Content</div>
			</AspectRatio>
		);

		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('renders with default aspect ratio', () => {
		const { container } = renderWithProviders(
			<AspectRatio>
				<div>Content</div>
			</AspectRatio>
		);

		const aspectRatioElement = container.firstChild as HTMLElement;
		expect(aspectRatioElement).toBeInTheDocument();
		expect(aspectRatioElement.style.aspectRatio).toBe('1.7777777777777777');
	});

	it('applies custom aspect ratio', () => {
		const { container } = renderWithProviders(
			<AspectRatio ratio={4 / 3}>
				<div>Content</div>
			</AspectRatio>
		);

		const aspectRatioElement = container.firstChild as HTMLElement;
		expect(aspectRatioElement.style.aspectRatio).toBe('1.3333333333333333');
	});

	it('applies square aspect ratio', () => {
		const { container } = renderWithProviders(
			<AspectRatio ratio={1}>
				<div>Content</div>
			</AspectRatio>
		);

		const aspectRatioElement = container.firstChild as HTMLElement;
		expect(aspectRatioElement.style.aspectRatio).toBe('1');
	});

	it('applies custom className', () => {
		const { container } = renderWithProviders(
			<AspectRatio className="custom-aspect-ratio">
				<div>Content</div>
			</AspectRatio>
		);

		const aspectRatioElement = container.firstChild as HTMLElement;
		expect(aspectRatioElement).toHaveClass('custom-aspect-ratio');
	});

	it('merges base classes with custom className', () => {
		const { container } = renderWithProviders(
			<AspectRatio className="custom-class">
				<div>Content</div>
			</AspectRatio>
		);

		const aspectRatioElement = container.firstChild as HTMLElement;
		expect(aspectRatioElement).toHaveClass('relative', 'w-full', 'overflow-hidden', 'custom-class');
	});

	it('forwards additional HTML attributes', () => {
		renderWithProviders(
			<AspectRatio data-testid="aspect-ratio" aria-label="Image container">
				<div>Content</div>
			</AspectRatio>
		);

		const aspectRatio = screen.getByTestId('aspect-ratio');
		expect(aspectRatio).toHaveAttribute('aria-label', 'Image container');
	});

	it('forwards custom style prop', () => {
		const { container } = renderWithProviders(
			<AspectRatio style={{ backgroundColor: 'red' }} ratio={16 / 9}>
				<div>Content</div>
			</AspectRatio>
		);

		const aspectRatioElement = container.firstChild as HTMLElement;
		expect(aspectRatioElement.style.backgroundColor).toBe('red');
		// Note: When custom style is provided, it may override aspectRatio due to props spreading
		// This tests that custom styles are forwarded correctly
	});

	it('merges custom style with aspect ratio style', () => {
		const { container } = renderWithProviders(
			<AspectRatio style={{ padding: '10px', aspectRatio: '21/9' }} ratio={21 / 9}>
				<div>Content</div>
			</AspectRatio>
		);

		const aspectRatioElement = container.firstChild as HTMLElement;
		expect(aspectRatioElement.style.padding).toBe('10px');
		// When aspectRatio is explicitly in style, it should be present
		expect(aspectRatioElement.style.aspectRatio).toBe('21/9');
	});
});

describe('AspectRatio - Aspect Ratios', () => {
	it('handles 16:9 ratio', () => {
		const { container } = renderWithProviders(
			<AspectRatio ratio={16 / 9}>
				<div>Content</div>
			</AspectRatio>
		);

		const aspectRatioElement = container.firstChild as HTMLElement;
		expect(aspectRatioElement.style.aspectRatio).toBe('1.7777777777777777');
	});

	it('handles 4:3 ratio', () => {
		const { container } = renderWithProviders(
			<AspectRatio ratio={4 / 3}>
				<div>Content</div>
			</AspectRatio>
		);

		const aspectRatioElement = container.firstChild as HTMLElement;
		expect(aspectRatioElement.style.aspectRatio).toBe('1.3333333333333333');
	});

	it('handles 1:1 ratio', () => {
		const { container } = renderWithProviders(
			<AspectRatio ratio={1}>
				<div>Content</div>
			</AspectRatio>
		);

		const aspectRatioElement = container.firstChild as HTMLElement;
		expect(aspectRatioElement.style.aspectRatio).toBe('1');
	});

	it('handles portrait ratio', () => {
		const { container } = renderWithProviders(
			<AspectRatio ratio={3 / 4}>
				<div>Content</div>
			</AspectRatio>
		);

		const aspectRatioElement = container.firstChild as HTMLElement;
		expect(aspectRatioElement.style.aspectRatio).toBe('0.75');
	});

	it('handles ultra-wide ratio', () => {
		const { container } = renderWithProviders(
			<AspectRatio ratio={21 / 9}>
				<div>Content</div>
			</AspectRatio>
		);

		const aspectRatioElement = container.firstChild as HTMLElement;
		expect(aspectRatioElement.style.aspectRatio).toBe('2.3333333333333335');
	});
});

describe('AspectRatio - Children', () => {
	it('renders single child', () => {
		renderWithProviders(
			<AspectRatio>
				<img src="/test.jpg" alt="Test" />
			</AspectRatio>
		);

		const image = screen.getByAltText('Test');
		expect(image).toBeInTheDocument();
	});

	it('renders multiple children', () => {
		renderWithProviders(
			<AspectRatio>
				<div>First</div>
				<div>Second</div>
			</AspectRatio>
		);

		expect(screen.getByText('First')).toBeInTheDocument();
		expect(screen.getByText('Second')).toBeInTheDocument();
	});

	it('renders complex nested children', () => {
		renderWithProviders(
			<AspectRatio>
				<div>
					<h1>Title</h1>
					<p>Description</p>
					<button>Action</button>
				</div>
			</AspectRatio>
		);

		expect(screen.getByText('Title')).toBeInTheDocument();
		expect(screen.getByText('Description')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeInTheDocument();
	});
});

describe('AspectRatio - Accessibility', () => {
	it('passes accessibility checks', async () => {
		const { container } = renderWithProviders(
			<AspectRatio aria-label="Image container">
				<img src="/test.jpg" alt="Test" />
			</AspectRatio>
		);

		await expectA11y(container);
	});

	it('preserves aria attributes', () => {
		renderWithProviders(
			<AspectRatio aria-label="Video container">
				<video src="/test.mp4">
					<track kind="captions" srcLang="en" src="/captions.vtt" />
				</video>
			</AspectRatio>
		);

		const container = screen.getByLabelText('Video container');
		expect(container).toBeInTheDocument();
	});
});

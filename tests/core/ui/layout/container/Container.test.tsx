/**
 * Container Component Tests
 *
 * Tests for the Container component including:
 * - Rendering
 * - Max width variants
 * - Padding options
 * - Custom className
 * - Children rendering
 * - Accessibility
 */

import Container from '@core/ui/layout/container/Container';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('Container - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<Container>
				<div>Test Content</div>
			</Container>
		);

		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('renders with default maxWidth', () => {
		const { container } = renderWithProviders(
			<Container>
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-xl');
	});

	it('renders with default padding', () => {
		const { container } = renderWithProviders(
			<Container>
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('px-lg', 'sm:px-xl', 'lg:px-2xl');
	});

	it('renders without padding when padding is false', () => {
		const { container } = renderWithProviders(
			<Container padding={false}>
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).not.toHaveClass('px-lg', 'sm:px-xl', 'lg:px-2xl');
	});

	it('applies custom className', () => {
		const { container } = renderWithProviders(
			<Container className="custom-container">
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('custom-container');
	});

	it('merges base classes with custom className', () => {
		const { container } = renderWithProviders(
			<Container className="custom-class">
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('mx-auto', 'w-full', 'max-w-xl', 'custom-class');
	});

	it('forwards additional HTML attributes', () => {
		renderWithProviders(
			<Container data-testid="container" aria-label="Main container">
				<div>Content</div>
			</Container>
		);

		const container = screen.getByTestId('container');
		expect(container).toHaveAttribute('aria-label', 'Main container');
	});
});

describe('Container - Max Width Variants', () => {
	it('renders with xs maxWidth', () => {
		const { container } = renderWithProviders(
			<Container maxWidth="xs">
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-xs');
	});

	it('renders with sm maxWidth', () => {
		const { container } = renderWithProviders(
			<Container maxWidth="sm">
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-sm');
	});

	it('renders with md maxWidth', () => {
		const { container } = renderWithProviders(
			<Container maxWidth="md">
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-md');
	});

	it('renders with lg maxWidth', () => {
		const { container } = renderWithProviders(
			<Container maxWidth="lg">
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-lg');
	});

	it('renders with xl maxWidth', () => {
		const { container } = renderWithProviders(
			<Container maxWidth="xl">
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-xl');
	});

	it('renders with 2xl maxWidth', () => {
		const { container } = renderWithProviders(
			<Container maxWidth="2xl">
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-2xl');
	});

	it('renders with 3xl maxWidth', () => {
		const { container } = renderWithProviders(
			<Container maxWidth="3xl">
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-3xl');
	});

	it('renders with 4xl maxWidth', () => {
		const { container } = renderWithProviders(
			<Container maxWidth="4xl">
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-4xl');
	});

	it('renders with 5xl maxWidth', () => {
		const { container } = renderWithProviders(
			<Container maxWidth="5xl">
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-5xl');
	});

	it('renders with 6xl maxWidth', () => {
		const { container } = renderWithProviders(
			<Container maxWidth="6xl">
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-6xl');
	});

	it('renders with 7xl maxWidth', () => {
		const { container } = renderWithProviders(
			<Container maxWidth="7xl">
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-7xl');
	});

	it('renders with full maxWidth', () => {
		const { container } = renderWithProviders(
			<Container maxWidth="full">
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-full');
	});
});

describe('Container - Padding', () => {
	it('applies padding by default', () => {
		const { container } = renderWithProviders(
			<Container>
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('px-lg', 'sm:px-xl', 'lg:px-2xl');
	});

	it('applies padding when padding is true', () => {
		const { container } = renderWithProviders(
			<Container padding={true}>
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('px-lg', 'sm:px-xl', 'lg:px-2xl');
	});

	it('does not apply padding when padding is false', () => {
		const { container } = renderWithProviders(
			<Container padding={false}>
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).not.toHaveClass('px-lg', 'sm:px-xl', 'lg:px-2xl');
	});

	it('combines maxWidth and padding correctly', () => {
		const { container } = renderWithProviders(
			<Container maxWidth="2xl" padding>
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-2xl', 'px-lg', 'sm:px-xl', 'lg:px-2xl');
	});

	it('combines maxWidth and no padding correctly', () => {
		const { container } = renderWithProviders(
			<Container maxWidth="2xl" padding={false}>
				<div>Content</div>
			</Container>
		);

		const containerElement = container.firstChild as HTMLElement;
		expect(containerElement).toHaveClass('max-w-2xl');
		expect(containerElement).not.toHaveClass('px-lg', 'sm:px-xl', 'lg:px-2xl');
	});
});

describe('Container - Children', () => {
	it('renders single child', () => {
		renderWithProviders(
			<Container>
				<div>Single child</div>
			</Container>
		);

		expect(screen.getByText('Single child')).toBeInTheDocument();
	});

	it('renders multiple children', () => {
		renderWithProviders(
			<Container>
				<div>First</div>
				<div>Second</div>
			</Container>
		);

		expect(screen.getByText('First')).toBeInTheDocument();
		expect(screen.getByText('Second')).toBeInTheDocument();
	});

	it('renders complex nested children', () => {
		renderWithProviders(
			<Container>
				<header>
					<h1>Title</h1>
				</header>
				<main>
					<p>Content</p>
				</main>
				<footer>
					<p>Footer</p>
				</footer>
			</Container>
		);

		expect(screen.getByText('Title')).toBeInTheDocument();
		expect(screen.getByText('Content')).toBeInTheDocument();
		expect(screen.getByText('Footer')).toBeInTheDocument();
	});
});

describe('Container - Accessibility', () => {
	it('passes accessibility checks', async () => {
		const { container } = renderWithProviders(
			<Container aria-label="Main content container">
				<div>Content</div>
			</Container>
		);

		await expectA11y(container);
	});

	it('preserves semantic HTML', () => {
		renderWithProviders(
			<Container>
				<main>
					<h1>Page Title</h1>
					<p>Page content</p>
				</main>
			</Container>
		);

		expect(screen.getByRole('main')).toBeInTheDocument();
		expect(screen.getByRole('heading')).toBeInTheDocument();
	});
});

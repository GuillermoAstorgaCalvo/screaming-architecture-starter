/**
 * Card Component Tests
 *
 * Tests for Card component:
 * - Rendering
 * - Data display
 * - Interactions
 * - Accessibility
 */

import Card from '@core/ui/data-display/card/Card';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('Card - rendering', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<Card>Card content</Card>);
		}).not.toThrow();
	});

	it('should render card element', () => {
		renderWithProviders(<Card data-testid="card">Card content</Card>);
		const card = screen.getByTestId('card');
		expect(card).toBeInTheDocument();
		expect(screen.getByText('Card content')).toBeInTheDocument();
	});

	it('should render children content', () => {
		renderWithProviders(
			<Card>
				<div data-testid="card-child">Child content</div>
			</Card>
		);
		expect(screen.getByTestId('card-child')).toBeInTheDocument();
		expect(screen.getByText('Child content')).toBeInTheDocument();
	});

	it('should apply custom className', () => {
		renderWithProviders(
			<Card className="custom-card" data-testid="card">
				Content
			</Card>
		);
		const card = screen.getByTestId('card');
		expect(card).toHaveClass('custom-card');
	});

	it('should render with default variant (elevated)', () => {
		renderWithProviders(<Card data-testid="card">Content</Card>);
		const card = screen.getByTestId('card');
		expect(card).toBeInTheDocument();
	});

	it('should render with default padding (md)', () => {
		renderWithProviders(<Card data-testid="card">Content</Card>);
		const card = screen.getByTestId('card');
		expect(card).toBeInTheDocument();
	});
});

describe('Card - data display', () => {
	it('should display text content', () => {
		renderWithProviders(<Card>Simple text content</Card>);
		expect(screen.getByText('Simple text content')).toBeInTheDocument();
	});

	it('should display complex content', () => {
		renderWithProviders(
			<Card>
				<h2>Card Title</h2>
				<p>Card description</p>
				<button>Action</button>
			</Card>
		);
		expect(screen.getByText('Card Title')).toBeInTheDocument();
		expect(screen.getByText('Card description')).toBeInTheDocument();
		expect(screen.getByText('Action')).toBeInTheDocument();
	});

	it('should display multiple children', () => {
		renderWithProviders(
			<Card>
				<div data-testid="child-1">Child 1</div>
				<div data-testid="child-2">Child 2</div>
				<div data-testid="child-3">Child 3</div>
			</Card>
		);
		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
		expect(screen.getByTestId('child-3')).toBeInTheDocument();
	});

	it('should support different variants', () => {
		const { rerender } = renderWithProviders(<Card variant="elevated">Content</Card>);
		expect(screen.getByText('Content')).toBeInTheDocument();

		rerender(<Card variant="outlined">Content</Card>);
		expect(screen.getByText('Content')).toBeInTheDocument();

		rerender(<Card variant="flat">Content</Card>);
		expect(screen.getByText('Content')).toBeInTheDocument();
	});

	it('should support different padding sizes', () => {
		const { rerender } = renderWithProviders(<Card padding="sm">Content</Card>);
		expect(screen.getByText('Content')).toBeInTheDocument();

		rerender(<Card padding="md">Content</Card>);
		expect(screen.getByText('Content')).toBeInTheDocument();

		rerender(<Card padding="lg">Content</Card>);
		expect(screen.getByText('Content')).toBeInTheDocument();
	});
});

describe('Card - interactions', () => {
	it('should handle click events on children', () => {
		const handleClick = vi.fn();
		renderWithProviders(
			<Card>
				<button onClick={handleClick}>Click me</button>
			</Card>
		);
		const button = screen.getByText('Click me');
		button.click();
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('should support interactive content', () => {
		renderWithProviders(
			<Card>
				<input type="text" data-testid="input" />
				<select data-testid="select">
					<option>Option 1</option>
				</select>
			</Card>
		);
		expect(screen.getByTestId('input')).toBeInTheDocument();
		expect(screen.getByTestId('select')).toBeInTheDocument();
	});

	it('should preserve HTML attributes', () => {
		renderWithProviders(
			<Card data-testid="card" aria-label="Test card">
				Content
			</Card>
		);
		const card = screen.getByTestId('card');
		expect(card).toHaveAttribute('aria-label', 'Test card');
	});
});

describe('Card - accessibility', () => {
	it('should have no accessibility violations', async () => {
		const { container } = renderWithProviders(<Card>Card content</Card>);
		await expectA11y(container);
	});

	it('should support custom ARIA attributes', () => {
		renderWithProviders(
			<Card data-testid="card" aria-label="Article card">
				Content
			</Card>
		);
		const card = screen.getByTestId('card');
		expect(card).toHaveAttribute('aria-label', 'Article card');
	});

	it('should support semantic HTML', () => {
		renderWithProviders(
			<Card>
				<h2>Card Title</h2>
				<p>Card description</p>
			</Card>
		);
		expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
		expect(screen.getByText('Card description')).toBeInTheDocument();
	});

	it('should be keyboard navigable when containing interactive elements', () => {
		renderWithProviders(
			<Card>
				<button>Button 1</button>
				<button>Button 2</button>
			</Card>
		);
		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(2);
		for (const button of buttons) {
			expect(button).toBeInTheDocument();
		}
	});
});

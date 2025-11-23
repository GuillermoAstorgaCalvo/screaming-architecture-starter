/**
 * Toggle Component Tests
 *
 * Tests for the Toggle component including:
 * - Rendering
 * - User interactions
 * - Pressed/unpressed states
 * - Variants and sizes
 * - Disabled states
 * - Accessibility
 */

import Toggle from '@core/ui/forms/toggle/Toggle';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('Toggle - Rendering', () => {
	it('renders toggle button element', () => {
		renderWithProviders(<Toggle>Toggle me</Toggle>);
		const button = screen.getByRole('button', { name: 'Toggle me' });
		expect(button).toBeInTheDocument();
		expect(button.tagName).toBe('BUTTON');
	});

	it('renders with children', () => {
		renderWithProviders(<Toggle>Click me</Toggle>);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('renders with default variant', () => {
		renderWithProviders(<Toggle>Toggle</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('renders with outline variant', () => {
		renderWithProviders(<Toggle variant="outline">Toggle</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('renders different size variants', () => {
		const { rerender } = renderWithProviders(<Toggle size="sm">Small</Toggle>);
		expect(screen.getByText('Small')).toBeInTheDocument();

		rerender(<Toggle size="md">Medium</Toggle>);
		expect(screen.getByText('Medium')).toBeInTheDocument();

		rerender(<Toggle size="lg">Large</Toggle>);
		expect(screen.getByText('Large')).toBeInTheDocument();
	});
});

describe('Toggle - User Interactions', () => {
	it('calls onPressedChange when clicked', () => {
		const handlePressedChange = vi.fn();
		renderWithProviders(<Toggle onPressedChange={handlePressedChange}>Toggle</Toggle>);
		const button = screen.getByRole('button');

		fireEvent.click(button);
		expect(handlePressedChange).toHaveBeenCalledTimes(1);
		expect(handlePressedChange).toHaveBeenCalledWith(true);
	});

	it('toggles pressed state when clicked', () => {
		const handlePressedChange = vi.fn();
		renderWithProviders(
			<Toggle pressed={false} onPressedChange={handlePressedChange}>
				Toggle
			</Toggle>
		);
		const button = screen.getByRole('button');

		fireEvent.click(button);
		expect(handlePressedChange).toHaveBeenCalledWith(true);
	});

	it('toggles from pressed to unpressed', () => {
		const handlePressedChange = vi.fn();
		renderWithProviders(
			<Toggle pressed={true} onPressedChange={handlePressedChange}>
				Toggle
			</Toggle>
		);
		const button = screen.getByRole('button');

		fireEvent.click(button);
		expect(handlePressedChange).toHaveBeenCalledWith(false);
	});

	it('does not call onPressedChange when disabled', () => {
		const handlePressedChange = vi.fn();
		renderWithProviders(
			<Toggle disabled onPressedChange={handlePressedChange}>
				Toggle
			</Toggle>
		);
		const button = screen.getByRole('button');

		fireEvent.click(button);
		expect(handlePressedChange).not.toHaveBeenCalled();
	});

	it('handles multiple clicks', () => {
		const handlePressedChange = vi.fn();
		renderWithProviders(
			<Toggle pressed={false} onPressedChange={handlePressedChange}>
				Toggle
			</Toggle>
		);
		const button = screen.getByRole('button');

		fireEvent.click(button);
		fireEvent.click(button);
		fireEvent.click(button);

		expect(handlePressedChange).toHaveBeenCalledTimes(3);
		expect(handlePressedChange).toHaveBeenNthCalledWith(1, true);
		expect(handlePressedChange).toHaveBeenNthCalledWith(2, true);
		expect(handlePressedChange).toHaveBeenNthCalledWith(3, true);
	});
});

describe('Toggle - Pressed State', () => {
	it('renders with pressed state', () => {
		renderWithProviders(<Toggle pressed={true}>Toggle</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-pressed', 'true');
	});

	it('renders with unpressed state', () => {
		renderWithProviders(<Toggle pressed={false}>Toggle</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-pressed', 'false');
	});

	it('defaults to unpressed when pressed is not provided', () => {
		renderWithProviders(<Toggle>Toggle</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-pressed', 'false');
	});
});

describe('Toggle - Disabled State', () => {
	it('renders disabled button', () => {
		renderWithProviders(<Toggle disabled>Toggle</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute('disabled');
	});

	it('renders enabled button when disabled is false', () => {
		renderWithProviders(<Toggle disabled={false}>Toggle</Toggle>);
		const button = screen.getByRole('button');
		expect(button).not.toBeDisabled();
	});

	it('prevents interaction when disabled', () => {
		const handlePressedChange = vi.fn();
		renderWithProviders(
			<Toggle disabled onPressedChange={handlePressedChange}>
				Toggle
			</Toggle>
		);
		const button = screen.getByRole('button');

		fireEvent.click(button);
		expect(handlePressedChange).not.toHaveBeenCalled();
	});
});

describe('Toggle - Variants', () => {
	it('renders default variant', () => {
		renderWithProviders(<Toggle variant="default">Toggle</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('renders outline variant', () => {
		renderWithProviders(<Toggle variant="outline">Toggle</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('defaults to default variant when not provided', () => {
		renderWithProviders(<Toggle>Toggle</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});
});

describe('Toggle - Size Variants', () => {
	it('renders small size', () => {
		renderWithProviders(<Toggle size="sm">Small</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('renders medium size (default)', () => {
		renderWithProviders(<Toggle size="md">Medium</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('renders large size', () => {
		renderWithProviders(<Toggle size="lg">Large</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('defaults to medium size when size is not provided', () => {
		renderWithProviders(<Toggle>Default</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});
});

describe('Toggle - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(<Toggle>Toggle button</Toggle>);
		await expectA11y(container);
	});

	it('has correct aria-pressed attribute', () => {
		renderWithProviders(<Toggle pressed={true}>Toggle</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-pressed', 'true');
	});

	it('has button type', () => {
		renderWithProviders(<Toggle>Toggle</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('type', 'button');
	});

	it('supports custom aria-label', () => {
		renderWithProviders(<Toggle aria-label="Custom toggle">Toggle</Toggle>);
		const button = screen.getByRole('button', { name: 'Custom toggle' });
		expect(button).toBeInTheDocument();
	});
});

describe('Toggle - Props Forwarding', () => {
	it('forwards additional HTML button attributes', () => {
		renderWithProviders(
			<Toggle data-testid="custom-toggle" aria-label="Custom">
				Toggle
			</Toggle>
		);
		const button = screen.getByTestId('custom-toggle');
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute('aria-label', 'Custom');
	});

	it('forwards className prop', () => {
		renderWithProviders(<Toggle className="custom-class">Toggle</Toggle>);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('custom-class');
	});

	it('forwards onPressedChange handler', () => {
		const handlePressedChange = vi.fn();
		renderWithProviders(<Toggle onPressedChange={handlePressedChange}>Toggle</Toggle>);
		const button = screen.getByRole('button');

		fireEvent.click(button);
		expect(handlePressedChange).toHaveBeenCalled();
	});
});

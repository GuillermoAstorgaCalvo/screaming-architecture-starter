/**
 * NumberInputButton Component Tests
 *
 * Tests for the NumberInputButton component including:
 * - Rendering
 * - Click handling
 * - Disabled state
 * - Accessibility
 */

import { NumberInputButton } from '@core/ui/forms/number-input/components/NumberInputButton';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('NumberInputButton - Rendering', () => {
	it('renders button element', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<NumberInputButton onClick={onClick} disabled={false} aria-label="Increment">
				<span>+</span>
			</NumberInputButton>
		);

		const button = screen.getByRole('button', { name: 'Increment' });
		expect(button).toBeInTheDocument();
		expect(button.tagName).toBe('BUTTON');
	});

	it('renders children', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<NumberInputButton onClick={onClick} disabled={false} aria-label="Increment">
				<span data-testid="icon">+</span>
			</NumberInputButton>
		);

		expect(screen.getByTestId('icon')).toBeInTheDocument();
	});

	it('applies aria-label', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<NumberInputButton onClick={onClick} disabled={false} aria-label="Decrement">
				<span>-</span>
			</NumberInputButton>
		);

		const button = screen.getByRole('button', { name: 'Decrement' });
		expect(button).toHaveAttribute('aria-label', 'Decrement');
	});

	it('has type="button" attribute', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<NumberInputButton onClick={onClick} disabled={false} aria-label="Increment">
				<span>+</span>
			</NumberInputButton>
		);

		const button = screen.getByRole('button', { name: 'Increment' });
		expect(button).toHaveAttribute('type', 'button');
	});
});

describe('NumberInputButton - User Interactions', () => {
	it('calls onClick when clicked and not disabled', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<NumberInputButton onClick={onClick} disabled={false} aria-label="Increment">
				<span>+</span>
			</NumberInputButton>
		);

		const button = screen.getByRole('button', { name: 'Increment' });
		fireEvent.click(button);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('does not call onClick when disabled', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<NumberInputButton onClick={onClick} disabled={true} aria-label="Increment">
				<span>+</span>
			</NumberInputButton>
		);

		const button = screen.getByRole('button', { name: 'Increment' });
		fireEvent.click(button);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('prevents default behavior on click', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<NumberInputButton onClick={onClick} disabled={false} aria-label="Increment">
				<span>+</span>
			</NumberInputButton>
		);

		const button = screen.getByRole('button', { name: 'Increment' });
		const event = new MouseEvent('click', { bubbles: true, cancelable: true });
		const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

		fireEvent(button, event);

		expect(preventDefaultSpy).toHaveBeenCalled();
	});

	it('handles multiple clicks', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<NumberInputButton onClick={onClick} disabled={false} aria-label="Increment">
				<span>+</span>
			</NumberInputButton>
		);

		const button = screen.getByRole('button', { name: 'Increment' });
		fireEvent.click(button);
		fireEvent.click(button);
		fireEvent.click(button);

		expect(onClick).toHaveBeenCalledTimes(3);
	});
});

describe('NumberInputButton - Disabled State', () => {
	it('renders disabled button', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<NumberInputButton onClick={onClick} disabled={true} aria-label="Increment">
				<span>+</span>
			</NumberInputButton>
		);

		const button = screen.getByRole('button', { name: 'Increment' });
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute('disabled');
	});

	it('renders enabled button when disabled is false', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<NumberInputButton onClick={onClick} disabled={false} aria-label="Increment">
				<span>+</span>
			</NumberInputButton>
		);

		const button = screen.getByRole('button', { name: 'Increment' });
		expect(button).not.toBeDisabled();
		expect(button).not.toHaveAttribute('disabled');
	});

	it('applies disabled styling', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<NumberInputButton onClick={onClick} disabled={true} aria-label="Increment">
				<span>+</span>
			</NumberInputButton>
		);

		const button = screen.getByRole('button', { name: 'Increment' });
		expect(button).toBeDisabled();
	});
});

describe('NumberInputButton - Accessibility', () => {
	it('has proper aria-label', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<NumberInputButton onClick={onClick} disabled={false} aria-label="Increment value">
				<span>+</span>
			</NumberInputButton>
		);

		const button = screen.getByRole('button', { name: 'Increment value' });
		expect(button).toHaveAttribute('aria-label', 'Increment value');
	});

	it('maintains aria-label when disabled', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<NumberInputButton onClick={onClick} disabled={true} aria-label="Decrement value">
				<span>-</span>
			</NumberInputButton>
		);

		const button = screen.getByRole('button', { name: 'Decrement value' });
		expect(button).toHaveAttribute('aria-label', 'Decrement value');
		expect(button).toBeDisabled();
	});
});

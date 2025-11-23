/**
 * InlineEditRenderers Tests
 *
 * Tests for renderer functions:
 * - renderEditInput
 * - renderDisplayButton
 * - renderViewMode
 */

import {
	renderDisplayButton,
	renderEditInput,
	renderViewMode,
} from '@core/ui/forms/inline-edit/helpers/InlineEditRenderers';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('renderEditInput', () => {
	it('should be a function', () => {
		expect(typeof renderEditInput).toBe('function');
	});

	it('renders input element with correct props', () => {
		const handleChange = vi.fn((e: ChangeEvent<HTMLInputElement>) => {});
		const handleKeyDown = vi.fn((e: KeyboardEvent<HTMLInputElement>) => {});
		const handleBlur = vi.fn((e: FocusEvent<HTMLInputElement>) => {});

		const { container } = renderWithProviders(
			renderEditInput({
				id: 'test-input',
				editValue: 'Test Value',
				inputClasses: 'custom-input',
				placeholder: 'Click to edit',
				disabled: false,
				handleChange,
				handleKeyDown,
				handleBlur,
				inputProps: {},
			})
		);

		const input = container.querySelector('input');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('id', 'test-input');
		expect(input).toHaveAttribute('type', 'text');
		expect(input).toHaveValue('Test Value');
		expect(input).toHaveAttribute('aria-label', 'Click to edit');
		expect(input).toHaveClass('custom-input');
		expect(input).not.toBeDisabled();
	});

	it('renders disabled input when disabled is true', () => {
		const handleChange = vi.fn((e: ChangeEvent<HTMLInputElement>) => {});
		const handleKeyDown = vi.fn((e: KeyboardEvent<HTMLInputElement>) => {});
		const handleBlur = vi.fn((e: FocusEvent<HTMLInputElement>) => {});

		const { container } = renderWithProviders(
			renderEditInput({
				id: 'test-input',
				editValue: 'Test Value',
				inputClasses: 'custom-input',
				placeholder: 'Click to edit',
				disabled: true,
				handleChange,
				handleKeyDown,
				handleBlur,
				inputProps: {},
			})
		);

		const input = container.querySelector('input');
		expect(input).toBeDisabled();
	});

	it('forwards additional inputProps', () => {
		const handleChange = vi.fn((e: ChangeEvent<HTMLInputElement>) => {});
		const handleKeyDown = vi.fn((e: KeyboardEvent<HTMLInputElement>) => {});
		const handleBlur = vi.fn((e: FocusEvent<HTMLInputElement>) => {});

		const { container } = renderWithProviders(
			renderEditInput({
				id: 'test-input',
				editValue: 'Test Value',
				inputClasses: 'custom-input',
				placeholder: 'Click to edit',
				disabled: false,
				handleChange,
				handleKeyDown,
				handleBlur,
				inputProps: {
					'data-testid': 'custom-input',
					maxLength: 100,
				} as any,
			})
		);

		const input = container.querySelector('input');
		expect(input).toHaveAttribute('data-testid', 'custom-input');
		expect(input).toHaveAttribute('maxLength', '100');
	});

	it('handles empty value', () => {
		const handleChange = vi.fn((e: ChangeEvent<HTMLInputElement>) => {});
		const handleKeyDown = vi.fn((e: KeyboardEvent<HTMLInputElement>) => {});
		const handleBlur = vi.fn((e: FocusEvent<HTMLInputElement>) => {});

		const { container } = renderWithProviders(
			renderEditInput({
				id: 'test-input',
				editValue: '',
				inputClasses: 'custom-input',
				placeholder: 'Click to edit',
				disabled: false,
				handleChange,
				handleKeyDown,
				handleBlur,
				inputProps: {},
			})
		);

		const input = container.querySelector('input');
		expect(input).toHaveValue('');
	});
});

describe('renderDisplayButton', () => {
	it('should be a function', () => {
		expect(typeof renderDisplayButton).toBe('function');
	});

	it('renders button element with correct props', () => {
		const handleDisplayClick = vi.fn();
		const handleDisplayKeyDown = vi.fn((e: KeyboardEvent<HTMLButtonElement>) => {});

		renderWithProviders(
			renderDisplayButton({
				displayContent: 'Test Value',
				displayClasses: 'custom-display',
				placeholder: 'Click to edit',
				disabled: false,
				handleDisplayClick,
				handleDisplayKeyDown,
			})
		);

		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent('Test Value');
		expect(button).toHaveAttribute('type', 'button');
		expect(button).toHaveAttribute('aria-label', 'Click to edit');
		expect(button).toHaveClass('custom-display');
		expect(button).not.toBeDisabled();
	});

	it('renders disabled button when disabled is true', () => {
		const handleDisplayClick = vi.fn();
		const handleDisplayKeyDown = vi.fn((e: KeyboardEvent<HTMLButtonElement>) => {});

		renderWithProviders(
			renderDisplayButton({
				displayContent: 'Test Value',
				displayClasses: 'custom-display',
				placeholder: 'Click to edit',
				disabled: true,
				handleDisplayClick,
				handleDisplayKeyDown,
			})
		);

		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});

	it('renders ReactNode as displayContent', () => {
		const handleDisplayClick = vi.fn();
		const handleDisplayKeyDown = vi.fn((e: KeyboardEvent<HTMLButtonElement>) => {});

		renderWithProviders(
			renderDisplayButton({
				displayContent: <strong>Bold Text</strong>,
				displayClasses: 'custom-display',
				placeholder: 'Click to edit',
				disabled: false,
				handleDisplayClick,
				handleDisplayKeyDown,
			})
		);

		const button = screen.getByRole('button');
		const strong = button.querySelector('strong');
		expect(strong).toBeInTheDocument();
		expect(strong).toHaveTextContent('Bold Text');
	});

	it('applies correct button classes', () => {
		const handleDisplayClick = vi.fn();
		const handleDisplayKeyDown = vi.fn((e: KeyboardEvent<HTMLButtonElement>) => {});

		renderWithProviders(
			renderDisplayButton({
				displayContent: 'Test',
				displayClasses: 'custom-display',
				placeholder: 'Click to edit',
				disabled: false,
				handleDisplayClick,
				handleDisplayKeyDown,
			})
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass('custom-display');
		expect(button).toHaveClass('text-left');
		expect(button).toHaveClass('bg-transparent');
		expect(button).toHaveClass('border-none');
		expect(button).toHaveClass('p-0');
	});
});

describe('renderViewMode', () => {
	it('should be a function', () => {
		expect(typeof renderViewMode).toBe('function');
	});

	it('renders view mode with placeholder when empty and showEmptyPlaceholder is true', () => {
		const handleDisplayClick = vi.fn();
		const handleDisplayKeyDown = vi.fn((e: KeyboardEvent<HTMLButtonElement>) => {});

		renderWithProviders(
			renderViewMode({
				isEmpty: true,
				showEmptyPlaceholder: true,
				placeholder: 'Click to edit',
				displayValue: '',
				renderDisplay: undefined,
				displayClasses: 'custom-display',
				disabled: false,
				handleDisplayClick,
				handleDisplayKeyDown,
			})
		);

		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		// Should contain placeholder text
		const placeholder = button.querySelector('span');
		expect(placeholder).toBeInTheDocument();
	});

	it('renders view mode with displayValue when not empty', () => {
		const handleDisplayClick = vi.fn();
		const handleDisplayKeyDown = vi.fn((e: KeyboardEvent<HTMLButtonElement>) => {});

		renderWithProviders(
			renderViewMode({
				isEmpty: false,
				showEmptyPlaceholder: true,
				placeholder: 'Click to edit',
				displayValue: 'Test Value',
				renderDisplay: undefined,
				displayClasses: 'custom-display',
				disabled: false,
				handleDisplayClick,
				handleDisplayKeyDown,
			})
		);

		const button = screen.getByRole('button');
		expect(button).toHaveTextContent('Test Value');
	});

	it('renders view mode with custom renderDisplay', () => {
		const handleDisplayClick = vi.fn();
		const handleDisplayKeyDown = vi.fn((e: KeyboardEvent<HTMLButtonElement>) => {});
		const renderDisplay = (value: string) => <em>{value}</em>;

		renderWithProviders(
			renderViewMode({
				isEmpty: false,
				showEmptyPlaceholder: true,
				placeholder: 'Click to edit',
				displayValue: 'Test Value',
				renderDisplay,
				displayClasses: 'custom-display',
				disabled: false,
				handleDisplayClick,
				handleDisplayKeyDown,
			})
		);

		const button = screen.getByRole('button');
		const em = button.querySelector('em');
		expect(em).toBeInTheDocument();
		expect(em).toHaveTextContent('Test Value');
	});

	it('renders empty when isEmpty is true and showEmptyPlaceholder is false', () => {
		const handleDisplayClick = vi.fn();
		const handleDisplayKeyDown = vi.fn((e: KeyboardEvent<HTMLButtonElement>) => {});

		renderWithProviders(
			renderViewMode({
				isEmpty: true,
				showEmptyPlaceholder: false,
				placeholder: 'Click to edit',
				displayValue: '',
				renderDisplay: undefined,
				displayClasses: 'custom-display',
				disabled: false,
				handleDisplayClick,
				handleDisplayKeyDown,
			})
		);

		const button = screen.getByRole('button');
		expect(button.textContent).toBe('');
	});

	it('renders disabled state', () => {
		const handleDisplayClick = vi.fn();
		const handleDisplayKeyDown = vi.fn((e: KeyboardEvent<HTMLButtonElement>) => {});

		renderWithProviders(
			renderViewMode({
				isEmpty: false,
				showEmptyPlaceholder: true,
				placeholder: 'Click to edit',
				displayValue: 'Test Value',
				renderDisplay: undefined,
				displayClasses: 'custom-display',
				disabled: true,
				handleDisplayClick,
				handleDisplayKeyDown,
			})
		);

		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});
});

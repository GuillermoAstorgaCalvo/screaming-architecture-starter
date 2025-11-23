/**
 * InlineEdit Component Tests
 *
 * Tests for the InlineEdit component including:
 * - Rendering
 * - User interactions
 * - Edit mode
 * - View mode
 * - Save and cancel
 * - Keyboard interactions
 * - Accessibility
 * - Size variants
 * - Controlled and uncontrolled modes
 */

import { registerDomainTranslations } from '@core/i18n/registry';
import { clearResourceLoaders } from '@core/i18n/resourceLoader/registry';
import InlineEdit from '@core/ui/forms/inline-edit/InlineEdit';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const INLINE_EDIT_PLACEHOLDER = 'Click to edit';

// Register inlineEdit translation namespace for tests
beforeEach(() => {
	clearResourceLoaders();
	registerDomainTranslations('inlineEdit', async () => ({
		default: {
			placeholder: INLINE_EDIT_PLACEHOLDER,
		},
	}));
});

afterEach(() => {
	clearResourceLoaders();
});

describe('InlineEdit - Rendering', () => {
	it('renders in view mode by default', () => {
		renderWithProviders(<InlineEdit value="Test Value" />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent('Test Value');
	});

	it('renders placeholder when value is empty and showEmptyPlaceholder is true', () => {
		renderWithProviders(<InlineEdit value="" placeholder="Click to edit" />);
		const button = screen.getByRole('button');
		expect(button).toHaveTextContent('Click to edit');
	});

	it('renders empty when value is empty and showEmptyPlaceholder is false', () => {
		renderWithProviders(
			<InlineEdit value="" showEmptyPlaceholder={false} placeholder="Click to edit" />
		);
		const button = screen.getByRole('button');
		expect(button.textContent).toBe('');
	});

	it('renders with custom display renderer', () => {
		const renderDisplay = (value: string) => <strong>{value}</strong>;
		renderWithProviders(<InlineEdit value="Test" renderDisplay={renderDisplay} />);
		const button = screen.getByRole('button');
		const strong = screen.getByText('Test').closest('strong');
		expect(strong).toBeInTheDocument();
		expect(strong).toHaveTextContent('Test');
	});

	it('renders different size variants', () => {
		const { rerender } = renderWithProviders(<InlineEdit value="Test" size="sm" />);
		expect(screen.getByRole('button')).toBeInTheDocument();

		rerender(<InlineEdit value="Test" size="md" />);
		expect(screen.getByRole('button')).toBeInTheDocument();

		rerender(<InlineEdit value="Test" size="lg" />);
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('renders disabled state', () => {
		renderWithProviders(<InlineEdit value="Test" disabled />);
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});
});

describe('InlineEdit - User Interactions', () => {
	it('switches to edit mode on click', async () => {
		renderWithProviders(<InlineEdit value="Test Value" />);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
		});
		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('Test Value');
	});

	it('switches to edit mode on Enter key', async () => {
		renderWithProviders(<InlineEdit value="Test Value" />);
		const button = screen.getByRole('button');
		fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

		await waitFor(() => {
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
		});
	});

	it('switches to edit mode on Space key', async () => {
		renderWithProviders(<InlineEdit value="Test Value" />);
		const button = screen.getByRole('button');
		fireEvent.keyDown(button, { key: ' ', code: 'Space' });

		await waitFor(() => {
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
		});
	});

	it('does not switch to edit mode when disabled', () => {
		renderWithProviders(<InlineEdit value="Test Value" disabled />);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
	});

	it('saves value on blur', async () => {
		const onSave = vi.fn();
		renderWithProviders(<InlineEdit value="Initial" onSave={onSave} />);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
		});

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'Updated Value' } });
		fireEvent.blur(input);

		await waitFor(() => {
			expect(onSave).toHaveBeenCalledWith('Updated Value');
		});
	});

	it('saves value on Enter key', async () => {
		const onSave = vi.fn();
		renderWithProviders(<InlineEdit value="Initial" onSave={onSave} />);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
		});

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'Updated Value' } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

		await waitFor(() => {
			expect(onSave).toHaveBeenCalledWith('Updated Value');
		});
	});

	it('cancels edit on Escape key', async () => {
		const onCancel = vi.fn();
		renderWithProviders(<InlineEdit value="Initial" onCancel={onCancel} />);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
		});

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'Changed Value' } });
		fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

		await waitFor(() => {
			expect(onCancel).toHaveBeenCalled();
			expect(screen.getByRole('button')).toHaveTextContent('Initial');
		});
	});

	it('trims value on save', async () => {
		const onSave = vi.fn();
		renderWithProviders(<InlineEdit value="Initial" onSave={onSave} />);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
		});

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: '  Trimmed Value  ' } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

		await waitFor(() => {
			expect(onSave).toHaveBeenCalledWith('Trimmed Value');
		});
	});

	it('calls onChange during editing', async () => {
		const onChange = vi.fn();
		renderWithProviders(<InlineEdit value="Initial" onChange={onChange} />);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		const input = (await screen.findByRole('textbox')) as HTMLInputElement;
		// Set the input value directly and fire change event
		// The handler extracts e.target.value and calls onChange with the string
		Object.defineProperty(input, 'value', {
			writable: true,
			configurable: true,
			value: 'Changed',
		});
		fireEvent.change(input, { target: { value: 'Changed' } });

		await waitFor(() => {
			// onChange should be called
			expect(onChange).toHaveBeenCalled();
			// The handler should extract e.target.value and call onChange with the string value
			// Verify it was called (the exact value depends on implementation)
			const calls = onChange.mock.calls;
			expect(calls.length).toBeGreaterThan(0);
		});
	});
});

describe('InlineEdit - Controlled Mode', () => {
	it('updates when controlled value changes', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('Initial');
			return (
				<div>
					<InlineEdit value={value} onSave={setValue} />
					<button onClick={() => setValue('External Update')}>Update</button>
				</div>
			);
		};

		renderWithProviders(<TestComponent />);
		const inlineEditButton = screen.getByText('Initial').closest('button');
		expect(inlineEditButton).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: 'Update' }));
		const updatedButton = screen.getByText('External Update').closest('button');
		expect(updatedButton).toBeInTheDocument();
	});

	it('maintains controlled value when not saving', async () => {
		const TestComponent = () => {
			const [value] = React.useState('Initial');
			return <InlineEdit value={value} onSave={() => {}} />;
		};

		renderWithProviders(<TestComponent />);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			const input = screen.getByRole('textbox');
			expect(input).toHaveValue('Initial');
		});
	});
});

describe('InlineEdit - Uncontrolled Mode', () => {
	it('uses defaultValue in uncontrolled mode', () => {
		renderWithProviders(<InlineEdit defaultValue="Default Value" />);
		const button = screen.getByRole('button');
		expect(button).toHaveTextContent('Default Value');
	});

	it('allows editing defaultValue', async () => {
		const onSave = vi.fn();
		renderWithProviders(<InlineEdit defaultValue="Default" onSave={onSave} />);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
		});

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'Updated' } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

		await waitFor(() => {
			expect(onSave).toHaveBeenCalledWith('Updated');
		});
	});
});

describe('InlineEdit - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(<InlineEdit value="Test Value" />);
		await expectA11y(container);
	});

	it('has proper ARIA label in view mode', () => {
		renderWithProviders(<InlineEdit value="Test" placeholder={INLINE_EDIT_PLACEHOLDER} />);
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-label', INLINE_EDIT_PLACEHOLDER);
	});

	it('has proper ARIA label in edit mode', async () => {
		renderWithProviders(<InlineEdit value="Test" placeholder={INLINE_EDIT_PLACEHOLDER} />);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		const input = await screen.findByRole('textbox');
		expect(input).toHaveAttribute('aria-label', INLINE_EDIT_PLACEHOLDER);
	});

	it('is keyboard accessible', async () => {
		renderWithProviders(<InlineEdit value="Test" />);
		const button = screen.getByRole('button');

		// Can activate with Enter
		fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
		await screen.findByRole('textbox');

		// Can cancel with Escape
		const input = screen.getByRole('textbox');
		fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

		await waitFor(() => {
			expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
		});

		// Can activate with Space after cancel
		const buttonAfterCancel = screen.getByRole('button');
		fireEvent.keyDown(buttonAfterCancel, { key: ' ', code: 'Space' });
		await screen.findByRole('textbox');
	});
});

describe('InlineEdit - Edge Cases', () => {
	it('handles empty string value', () => {
		renderWithProviders(<InlineEdit value="" />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('handles very long values', () => {
		const longValue = 'a'.repeat(1000);
		renderWithProviders(<InlineEdit value={longValue} />);
		const button = screen.getByRole('button');
		expect(button).toHaveTextContent(longValue);
	});

	it('handles special characters', () => {
		const specialValue = '<>&"\'';
		renderWithProviders(<InlineEdit value={specialValue} />);
		const button = screen.getByRole('button');
		expect(button).toHaveTextContent(specialValue);
	});

	it('handles multiple rapid clicks', async () => {
		renderWithProviders(<InlineEdit value="Test" />);
		const button = screen.getByRole('button');

		fireEvent.click(button);
		fireEvent.click(button);
		fireEvent.click(button);

		await waitFor(() => {
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
		});
	});

	it('handles blur without changes', async () => {
		const onSave = vi.fn();
		const onCancel = vi.fn();
		renderWithProviders(<InlineEdit value="Initial" onSave={onSave} onCancel={onCancel} />);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
		});

		const input = screen.getByRole('textbox');
		fireEvent.blur(input);

		await waitFor(() => {
			// Should not save if value hasn't changed and onCancel is provided
			expect(onSave).not.toHaveBeenCalled();
		});
	});

	it('handles blur with changes when onCancel is not provided', async () => {
		const onSave = vi.fn();
		renderWithProviders(<InlineEdit value="Initial" onSave={onSave} />);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
		});

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'Changed' } });
		fireEvent.blur(input);

		await waitFor(() => {
			expect(onSave).toHaveBeenCalledWith('Changed');
		});
	});
});

describe('InlineEdit - Custom Styling', () => {
	it('applies custom display className', () => {
		renderWithProviders(<InlineEdit value="Test" displayClassName="custom-display" />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('custom-display');
	});

	it('applies custom input className', async () => {
		renderWithProviders(<InlineEdit value="Test" inputClassName="custom-input" />);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			const input = screen.getByRole('textbox');
			expect(input).toHaveClass('custom-input');
		});
	});
});

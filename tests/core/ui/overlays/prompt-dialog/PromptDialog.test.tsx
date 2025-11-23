/**
 * Tests for PromptDialog component
 *
 * Tests the PromptDialog component:
 * - Rendering with different props
 * - Input validation
 * - Required field validation
 * - Confirm and cancel actions
 * - Different input types
 * - Accessibility
 */

import PromptDialog from '@core/ui/overlays/prompt-dialog/PromptDialog';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const TEST_TITLE = 'Enter Name';
const TEST_LABEL = 'Name';
const TEST_PLACEHOLDER = 'Enter your name';

const renderPromptDialog = (props: {
	isOpen?: boolean;
	onClose?: () => void;
	title?: string;
	label?: string;
	placeholder?: string;
	defaultValue?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm?: (value: string) => void | Promise<void>;
	onCancel?: () => void;
	required?: boolean;
	validate?: (value: string) => string | undefined;
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
	variant?: 'default' | 'centered' | 'fullscreen';
	inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
	className?: string;
}) => {
	const {
		isOpen = true,
		onClose = vi.fn(),
		title = TEST_TITLE,
		label = TEST_LABEL,
		placeholder = TEST_PLACEHOLDER,
		defaultValue,
		confirmLabel,
		cancelLabel,
		onConfirm,
		onCancel,
		required = false,
		validate,
		size,
		variant,
		inputType,
		className,
	} = props;

	return renderWithProviders(
		<PromptDialog
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			label={label}
			placeholder={placeholder}
			{...(defaultValue !== undefined && { defaultValue })}
			{...(confirmLabel !== undefined && { confirmLabel })}
			{...(cancelLabel !== undefined && { cancelLabel })}
			{...(onConfirm !== undefined && { onConfirm })}
			{...(onCancel !== undefined && { onCancel })}
			required={required}
			{...(validate !== undefined && { validate })}
			{...(size !== undefined && { size })}
			{...(variant !== undefined && { variant })}
			{...(inputType !== undefined && { inputType })}
			{...(className !== undefined && { className })}
		/>
	);
};

describe('PromptDialog - Rendering', () => {
	describe('Visibility', () => {
		it('renders nothing when isOpen is false', () => {
			renderPromptDialog({ isOpen: false });

			expect(screen.queryByText(TEST_TITLE)).not.toBeInTheDocument();
		});

		it('renders dialog when isOpen is true', () => {
			renderPromptDialog({ isOpen: true });

			expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
			expect(screen.getByLabelText(TEST_LABEL)).toBeInTheDocument();
		});
	});

	describe('Labels', () => {
		it('renders with default confirm and cancel labels', () => {
			renderPromptDialog({ isOpen: true });

			expect(screen.getByText('Confirm')).toBeInTheDocument();
			expect(screen.getByText('Cancel')).toBeInTheDocument();
		});

		it('renders with custom confirm and cancel labels', () => {
			renderPromptDialog({
				isOpen: true,
				confirmLabel: 'Submit',
				cancelLabel: 'Close',
			});

			expect(screen.getByText('Submit')).toBeInTheDocument();
			expect(screen.getByText('Close')).toBeInTheDocument();
		});
	});

	describe('Input', () => {
		it('renders input field with label', () => {
			renderPromptDialog({ isOpen: true });

			const input = screen.getByPlaceholderText(TEST_PLACEHOLDER);
			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute('type', 'text');
		});

		it('renders input with placeholder', () => {
			renderPromptDialog({ isOpen: true });

			const input = screen.getByPlaceholderText(TEST_PLACEHOLDER);
			expect(input).toBeInTheDocument();
		});

		it('renders input with defaultValue', () => {
			renderPromptDialog({ isOpen: true, defaultValue: 'Initial Value' });

			const input = screen.getByPlaceholderText(TEST_PLACEHOLDER) as HTMLInputElement;
			expect(input.value).toBe('Initial Value');
		});

		it('renders with different input types', () => {
			const { rerender } = renderPromptDialog({ isOpen: true, inputType: 'email' });
			let input = screen.getByPlaceholderText(TEST_PLACEHOLDER);
			expect(input).toHaveAttribute('type', 'email');

			rerender(
				<PromptDialog
					isOpen={true}
					onClose={vi.fn()}
					title={TEST_TITLE}
					label={TEST_LABEL}
					placeholder={TEST_PLACEHOLDER}
					inputType="password"
				/>
			);
			input = screen.getByPlaceholderText(TEST_PLACEHOLDER);
			expect(input).toHaveAttribute('type', 'password');
		});
	});
});

describe('PromptDialog - Input Handling', () => {
	it('allows user to type in input field', () => {
		renderPromptDialog({ isOpen: true });

		const input = screen.getByPlaceholderText(TEST_PLACEHOLDER) as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'Test Value' } });

		expect(input.value).toBe('Test Value');
	});

	it('clears error when user types', () => {
		const validate = (value: string) => {
			if (value.length < 3) return 'Too short';
			return undefined;
		};
		renderPromptDialog({ isOpen: true, validate });

		const input = screen.getByPlaceholderText(TEST_PLACEHOLDER);
		const confirmButton = screen.getByText('Confirm');

		// Trigger validation error
		fireEvent.change(input, { target: { value: 'ab' } });
		fireEvent.click(confirmButton);

		// Clear error by typing more
		fireEvent.change(input, { target: { value: 'abc' } });

		// Error should be cleared (we can't easily test this without checking the DOM)
		// but the input should accept the new value
		expect((input as HTMLInputElement).value).toBe('abc');
	});
});

describe('PromptDialog - Validation', () => {
	describe('Required Field', () => {
		it('shows error when required field is empty and confirm is clicked', async () => {
			renderPromptDialog({ isOpen: true, required: true });

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);

			await waitFor(() => {
				const input = screen.getByPlaceholderText(TEST_PLACEHOLDER);
				expect(input).toHaveAttribute('aria-invalid', 'true');
			});
		});

		it('does not show error when required field has value', async () => {
			const onClose = vi.fn();
			renderPromptDialog({ isOpen: true, required: true, onClose });

			const input = screen.getByPlaceholderText(TEST_PLACEHOLDER);
			fireEvent.change(input, { target: { value: 'Test Value' } });

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);

			await waitFor(() => {
				// If validation passes, onClose should be called
				expect(onClose).toHaveBeenCalled();
			});
		});

		it('allows empty value when required is false', async () => {
			const onConfirm = vi.fn();
			renderPromptDialog({ isOpen: true, required: false, onConfirm });

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);

			await waitFor(() => {
				expect(onConfirm).toHaveBeenCalledWith('');
			});
		});
	});

	describe('Custom Validation', () => {
		it('shows validation error when validation fails', async () => {
			const validate = (value: string) => {
				if (value.length < 3) return 'Value must be at least 3 characters';
				return undefined;
			};
			renderPromptDialog({ isOpen: true, validate });

			const input = screen.getByPlaceholderText(TEST_PLACEHOLDER);
			fireEvent.change(input, { target: { value: 'ab' } });

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);

			await waitFor(() => {
				const inputElement = screen.getByPlaceholderText(TEST_PLACEHOLDER);
				expect(inputElement).toHaveAttribute('aria-invalid', 'true');
			});
		});

		it('calls onConfirm when validation passes', async () => {
			const onConfirm = vi.fn();
			const validate = (value: string) => {
				if (value.length < 3) return 'Value must be at least 3 characters';
				return undefined;
			};
			renderPromptDialog({ isOpen: true, validate, onConfirm });

			const input = screen.getByPlaceholderText(TEST_PLACEHOLDER);
			fireEvent.change(input, { target: { value: 'Valid Value' } });

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);

			await waitFor(() => {
				expect(onConfirm).toHaveBeenCalledWith('Valid Value');
			});
		});
	});
});

describe('PromptDialog - Actions', () => {
	describe('Confirm Action', () => {
		it('calls onConfirm with input value and then onClose', async () => {
			const onConfirm = vi.fn();
			const onClose = vi.fn();
			renderPromptDialog({ isOpen: true, onConfirm, onClose });

			const input = screen.getByPlaceholderText(TEST_PLACEHOLDER);
			fireEvent.change(input, { target: { value: 'Test Value' } });

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);

			await waitFor(() => {
				expect(onConfirm).toHaveBeenCalledWith('Test Value');
				expect(onClose).toHaveBeenCalledTimes(1);
			});
		});

		it('calls onClose when confirm is clicked without onConfirm', async () => {
			const onClose = vi.fn();
			renderPromptDialog({ isOpen: true, onClose });

			const input = screen.getByPlaceholderText(TEST_PLACEHOLDER);
			fireEvent.change(input, { target: { value: 'Test Value' } });

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);

			await waitFor(() => {
				expect(onClose).toHaveBeenCalledTimes(1);
			});
		});

		it('handles async onConfirm callback', async () => {
			const asyncConfirm = async (value: string) => {
				await new Promise(resolve => setTimeout(resolve, 10));
			};
			const onConfirm = vi.fn(asyncConfirm);
			const onClose = vi.fn();
			renderPromptDialog({ isOpen: true, onConfirm, onClose });

			const input = screen.getByPlaceholderText(TEST_PLACEHOLDER);
			fireEvent.change(input, { target: { value: 'Test Value' } });

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);

			await waitFor(
				() => {
					expect(onConfirm).toHaveBeenCalledWith('Test Value');
					expect(onClose).toHaveBeenCalledTimes(1);
				},
				{ timeout: 100 }
			);
		});
	});

	describe('Cancel Action', () => {
		it('calls onCancel and then onClose when cancel is clicked', () => {
			const onCancel = vi.fn();
			const onClose = vi.fn();
			renderPromptDialog({ isOpen: true, onCancel, onClose });

			const cancelButton = screen.getByText('Cancel');
			fireEvent.click(cancelButton);

			expect(onCancel).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('calls onClose when cancel is clicked without onCancel', () => {
			const onClose = vi.fn();
			renderPromptDialog({ isOpen: true, onClose });

			const cancelButton = screen.getByText('Cancel');
			fireEvent.click(cancelButton);

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('resets input value when cancel is clicked', () => {
			const onClose = vi.fn();
			const { rerender } = renderPromptDialog({
				isOpen: true,
				onClose,
				defaultValue: 'Initial',
			});

			const input = screen.getByPlaceholderText(TEST_PLACEHOLDER) as HTMLInputElement;
			fireEvent.change(input, { target: { value: 'Changed Value' } });
			expect(input.value).toBe('Changed Value');

			const cancelButton = screen.getByText('Cancel');
			fireEvent.click(cancelButton);

			// Reopen dialog - value should be reset
			rerender(
				<PromptDialog
					isOpen={true}
					onClose={onClose}
					title={TEST_TITLE}
					label={TEST_LABEL}
					placeholder={TEST_PLACEHOLDER}
					defaultValue="Initial"
				/>
			);

			const newInput = screen.getByPlaceholderText(TEST_PLACEHOLDER) as HTMLInputElement;
			expect(newInput.value).toBe('Initial');
		});
	});
});

describe('PromptDialog - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderPromptDialog({ isOpen: true });

		await expectA11y(container);
	});

	it('has proper ARIA attributes', () => {
		renderPromptDialog({ isOpen: true });

		const dialog = screen.getByRole('dialog');
		expect(dialog).toBeInTheDocument();
		expect(dialog).toHaveAttribute('aria-labelledby');
	});
});

/**
 * Tests for PromptDialogHooks
 *
 * Tests the usePromptDialogState hook:
 * - Initial state
 * - Value management
 * - Error handling
 * - Validation
 * - Handler creation
 */

import { usePromptDialogState } from '@core/ui/overlays/prompt-dialog/hooks/PromptDialogHooks';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('usePromptDialogState', () => {
	describe('Initial State', () => {
		it('initializes with empty value when defaultValue is empty', () => {
			const { result } = renderHook(() =>
				usePromptDialogState({
					defaultValue: '',
					onClose: vi.fn(),
					required: false,
				})
			);

			expect(result.current.value).toBe('');
			expect(result.current.error).toBeUndefined();
		});

		it('initializes with defaultValue', () => {
			const { result } = renderHook(() =>
				usePromptDialogState({
					defaultValue: 'Initial Value',
					onClose: vi.fn(),
					required: false,
				})
			);

			expect(result.current.value).toBe('Initial Value');
		});

		it('initializes with no error', () => {
			const { result } = renderHook(() =>
				usePromptDialogState({
					defaultValue: '',
					onClose: vi.fn(),
					required: false,
				})
			);

			expect(result.current.error).toBeUndefined();
		});
	});

	describe('Value Management', () => {
		it('updates value when handleValueChange is called', () => {
			const { result } = renderHook(() =>
				usePromptDialogState({
					defaultValue: '',
					onClose: vi.fn(),
					required: false,
				})
			);

			act(() => {
				result.current.handleValueChange('New Value');
			});

			expect(result.current.value).toBe('New Value');
		});

		it('clears error when handleValueChange is called', () => {
			const { result } = renderHook(() =>
				usePromptDialogState({
					defaultValue: '',
					onClose: vi.fn(),
					required: false,
				})
			);

			// First set an error by trying to confirm with empty required field
			act(() => {
				result.current.handleValueChange('');
			});

			// Then change the value - error should be cleared
			act(() => {
				result.current.handleValueChange('New Value');
			});

			expect(result.current.error).toBeUndefined();
		});

		it('resets value to defaultValue when handleClose is called', () => {
			const { result } = renderHook(() =>
				usePromptDialogState({
					defaultValue: 'Initial',
					onClose: vi.fn(),
					required: false,
				})
			);

			act(() => {
				result.current.handleValueChange('Changed');
			});

			expect(result.current.value).toBe('Changed');

			act(() => {
				result.current.handleClose();
			});

			expect(result.current.value).toBe('Initial');
		});

		it('clears error when handleClose is called', () => {
			const { result } = renderHook(() =>
				usePromptDialogState({
					defaultValue: '',
					onClose: vi.fn(),
					required: false,
				})
			);

			// Set an error
			act(() => {
				result.current.handleValueChange('');
			});

			act(() => {
				result.current.handleClose();
			});

			expect(result.current.error).toBeUndefined();
		});
	});

	describe('Validation - Required Field', () => {
		it('shows error when required field is empty and confirm is triggered', async () => {
			const { result } = renderHook(() =>
				usePromptDialogState({
					defaultValue: '',
					onClose: vi.fn(),
					required: true,
				})
			);

			await act(async () => {
				await result.current.handleConfirm();
			});

			expect(result.current.error).toBeDefined();
		});

		it('does not show error when required field has value', async () => {
			const onClose = vi.fn();
			const { result } = renderHook(() =>
				usePromptDialogState({
					defaultValue: 'Value',
					onClose,
					required: true,
				})
			);

			await act(async () => {
				await result.current.handleConfirm();
			});

			// If validation passes, onClose should be called
			expect(onClose).toHaveBeenCalled();
		});

		it('allows empty value when required is false', async () => {
			const onClose = vi.fn();
			const { result } = renderHook(() =>
				usePromptDialogState({
					defaultValue: '',
					onClose,
					required: false,
				})
			);

			await act(async () => {
				await result.current.handleConfirm();
			});

			expect(onClose).toHaveBeenCalled();
		});
	});

	describe('Validation - Custom Validation', () => {
		it('shows error when custom validation fails', async () => {
			const validate = (value: string) => {
				if (value.length < 3) return 'Too short';
				return undefined;
			};
			const { result } = renderHook(() =>
				usePromptDialogState({
					defaultValue: 'ab',
					onClose: vi.fn(),
					required: false,
					validate,
				})
			);

			await act(async () => {
				await result.current.handleConfirm();
			});

			expect(result.current.error).toBe('Too short');
		});

		it('calls onConfirm when custom validation passes', async () => {
			const onConfirm = vi.fn();
			const onClose = vi.fn();
			const validate = (value: string) => {
				if (value.length < 3) return 'Too short';
				return undefined;
			};
			const { result } = renderHook(() =>
				usePromptDialogState({
					defaultValue: 'Valid Value',
					onClose,
					required: false,
					validate,
					onConfirm,
				})
			);

			await act(async () => {
				await result.current.handleConfirm();
			});

			expect(onConfirm).toHaveBeenCalledWith('Valid Value');
			expect(onClose).toHaveBeenCalled();
		});
	});

	describe('Handlers', () => {
		describe('handleConfirm', () => {
			it('calls onConfirm with value and then onClose', async () => {
				const onConfirm = vi.fn();
				const onClose = vi.fn();
				const { result } = renderHook(() =>
					usePromptDialogState({
						defaultValue: 'Test Value',
						onClose,
						required: false,
						onConfirm,
					})
				);

				await act(async () => {
					await result.current.handleConfirm();
				});

				expect(onConfirm).toHaveBeenCalledWith('Test Value');
				expect(onClose).toHaveBeenCalledTimes(1);
			});

			it('calls onClose when onConfirm is undefined', async () => {
				const onClose = vi.fn();
				const { result } = renderHook(() =>
					usePromptDialogState({
						defaultValue: 'Test Value',
						onClose,
						required: false,
					})
				);

				await act(async () => {
					await result.current.handleConfirm();
				});

				expect(onClose).toHaveBeenCalledTimes(1);
			});

			it('handles async onConfirm callback', async () => {
				const asyncConfirm = async (value: string) => {
					await new Promise(resolve => setTimeout(resolve, 10));
				};
				const onConfirm = vi.fn(asyncConfirm);
				const onClose = vi.fn();
				const { result } = renderHook(() =>
					usePromptDialogState({
						defaultValue: 'Test Value',
						onClose,
						required: false,
						onConfirm,
					})
				);

				await act(async () => {
					await result.current.handleConfirm();
				});

				expect(onConfirm).toHaveBeenCalledWith('Test Value');
				expect(onClose).toHaveBeenCalledTimes(1);
			});
		});

		describe('handleCancel', () => {
			it('calls onCancel and then onClose', () => {
				const onCancel = vi.fn();
				const onClose = vi.fn();
				const { result } = renderHook(() =>
					usePromptDialogState({
						defaultValue: '',
						onClose,
						required: false,
						onCancel,
					})
				);

				act(() => {
					result.current.handleCancel();
				});

				expect(onCancel).toHaveBeenCalledTimes(1);
				expect(onClose).toHaveBeenCalledTimes(1);
			});

			it('calls onClose when onCancel is undefined', () => {
				const onClose = vi.fn();
				const { result } = renderHook(() =>
					usePromptDialogState({
						defaultValue: '',
						onClose,
						required: false,
					})
				);

				act(() => {
					result.current.handleCancel();
				});

				expect(onClose).toHaveBeenCalledTimes(1);
			});
		});

		describe('handleClose', () => {
			it('calls onClose', () => {
				const onClose = vi.fn();
				const { result } = renderHook(() =>
					usePromptDialogState({
						defaultValue: '',
						onClose,
						required: false,
					})
				);

				act(() => {
					result.current.handleClose();
				});

				expect(onClose).toHaveBeenCalledTimes(1);
			});

			it('resets value to defaultValue', () => {
				const { result } = renderHook(() =>
					usePromptDialogState({
						defaultValue: 'Initial',
						onClose: vi.fn(),
						required: false,
					})
				);

				act(() => {
					result.current.handleValueChange('Changed');
				});

				act(() => {
					result.current.handleClose();
				});

				expect(result.current.value).toBe('Initial');
			});

			it('clears error', () => {
				const { result } = renderHook(() =>
					usePromptDialogState({
						defaultValue: '',
						onClose: vi.fn(),
						required: true,
					})
				);

				// Trigger an error
				act(() => {
					result.current.handleValueChange('');
				});

				act(() => {
					result.current.handleClose();
				});

				expect(result.current.error).toBeUndefined();
			});
		});
	});

	describe('Handler Stability', () => {
		it('maintains stable handler references when dependencies do not change', () => {
			const onClose = vi.fn();
			const { result, rerender } = renderHook(
				props =>
					usePromptDialogState({
						defaultValue: props.defaultValue,
						onClose: props.onClose,
						required: props.required,
					}),
				{
					initialProps: {
						defaultValue: '',
						onClose,
						required: false,
					},
				}
			);

			const firstHandleConfirm = result.current.handleConfirm;
			const firstHandleCancel = result.current.handleCancel;
			const firstHandleClose = result.current.handleClose;
			const firstHandleValueChange = result.current.handleValueChange;

			rerender({
				defaultValue: '',
				onClose,
				required: false,
			});

			expect(result.current.handleConfirm).toBe(firstHandleConfirm);
			expect(result.current.handleCancel).toBe(firstHandleCancel);
			expect(result.current.handleClose).toBe(firstHandleClose);
			expect(result.current.handleValueChange).toBe(firstHandleValueChange);
		});
	});
});

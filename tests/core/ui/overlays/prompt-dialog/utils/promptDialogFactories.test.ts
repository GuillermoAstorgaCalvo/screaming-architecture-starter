/**
 * Tests for promptDialogFactories
 *
 * Tests the factory functions used to build prompt dialog props:
 * - createDialogProps
 * - createDialogParts
 * - prepareDialogProps
 * - preparePromptDialog
 */

import type { PrepareDialogOptions } from '@core/ui/overlays/prompt-dialog/types/PromptDialogTypes';
import { preparePromptDialog } from '@core/ui/overlays/prompt-dialog/utils/promptDialogFactories';
import { describe, expect, it, vi } from 'vitest';

describe('promptDialogFactories', () => {
	describe('preparePromptDialog', () => {
		it('should be a function', () => {
			expect(typeof preparePromptDialog).toBe('function');
		});

		it('creates dialog props with all required options', () => {
			const options: PrepareDialogOptions = {
				isOpen: true,
				onClose: vi.fn(),
				title: 'Test Title',
				size: 'sm',
				variant: 'centered',
				label: 'Test Label',
				inputType: 'text',
				value: 'test value',
				handleValueChange: vi.fn(),
				placeholder: 'Enter value',
				required: false,
				error: undefined,
				cancelLabel: 'Cancel',
				confirmLabel: 'Confirm',
				handleCancel: vi.fn(),
				handleConfirm: vi.fn(),
				className: undefined,
			};

			const result = preparePromptDialog(options);

			expect(result).toBeDefined();
			expect(result.isOpen).toBe(true);
			expect(result.onClose).toBe(options.onClose);
			expect(result.title).toBe('Test Title');
			expect(result.size).toBe('sm');
			expect(result.variant).toBe('centered');
			expect(result.showCloseButton).toBe(false);
			expect(result.closeOnOverlayClick).toBe(false);
			expect(result.children).toBeDefined();
			expect(result.footer).toBeDefined();
		});

		it('always sets showCloseButton to false', () => {
			const options: PrepareDialogOptions = {
				isOpen: true,
				onClose: vi.fn(),
				title: 'Test Title',
				size: 'sm',
				variant: 'centered',
				label: 'Test Label',
				inputType: 'text',
				value: '',
				handleValueChange: vi.fn(),
				placeholder: undefined,
				required: false,
				error: undefined,
				cancelLabel: 'Cancel',
				confirmLabel: 'Confirm',
				handleCancel: vi.fn(),
				handleConfirm: vi.fn(),
				className: undefined,
			};

			const result = preparePromptDialog(options);

			expect(result.showCloseButton).toBe(false);
		});

		it('always sets closeOnOverlayClick to false', () => {
			const options: PrepareDialogOptions = {
				isOpen: true,
				onClose: vi.fn(),
				title: 'Test Title',
				size: 'sm',
				variant: 'centered',
				label: 'Test Label',
				inputType: 'text',
				value: '',
				handleValueChange: vi.fn(),
				placeholder: undefined,
				required: false,
				error: undefined,
				cancelLabel: 'Cancel',
				confirmLabel: 'Confirm',
				handleCancel: vi.fn(),
				handleConfirm: vi.fn(),
				className: undefined,
			};

			const result = preparePromptDialog(options);

			expect(result.closeOnOverlayClick).toBe(false);
		});

		it('includes className when provided', () => {
			const options: PrepareDialogOptions = {
				isOpen: true,
				onClose: vi.fn(),
				title: 'Test Title',
				size: 'sm',
				variant: 'centered',
				label: 'Test Label',
				inputType: 'text',
				value: '',
				handleValueChange: vi.fn(),
				placeholder: undefined,
				required: false,
				error: undefined,
				cancelLabel: 'Cancel',
				confirmLabel: 'Confirm',
				handleCancel: vi.fn(),
				handleConfirm: vi.fn(),
				className: 'custom-class',
			};

			const result = preparePromptDialog(options);

			expect(result.className).toBe('custom-class');
		});

		it('omits className when undefined', () => {
			const options: PrepareDialogOptions = {
				isOpen: true,
				onClose: vi.fn(),
				title: 'Test Title',
				size: 'sm',
				variant: 'centered',
				label: 'Test Label',
				inputType: 'text',
				value: '',
				handleValueChange: vi.fn(),
				placeholder: undefined,
				required: false,
				error: undefined,
				cancelLabel: 'Cancel',
				confirmLabel: 'Confirm',
				handleCancel: vi.fn(),
				handleConfirm: vi.fn(),
				className: undefined,
			};

			const result = preparePromptDialog(options);

			expect(result.className).toBeUndefined();
		});

		it('creates footer and content from parts options', () => {
			const handleCancel = vi.fn();
			const handleConfirm = vi.fn();
			const handleValueChange = vi.fn();

			const options: PrepareDialogOptions = {
				isOpen: true,
				onClose: vi.fn(),
				title: 'Test Title',
				size: 'md',
				variant: 'default',
				label: 'Email',
				inputType: 'email',
				value: 'user@example.com',
				handleValueChange,
				placeholder: 'Enter email',
				required: true,
				error: 'Invalid email',
				cancelLabel: 'Discard',
				confirmLabel: 'Save',
				handleCancel,
				handleConfirm,
				className: undefined,
			};

			const result = preparePromptDialog(options);

			expect(result.footer).toBeDefined();
			expect(result.children).toBeDefined();
		});

		it('handles all size variants', () => {
			const sizes: PrepareDialogOptions['size'][] = ['sm', 'md', 'lg', 'xl'];

			for (const size of sizes) {
				const options: PrepareDialogOptions = {
					isOpen: true,
					onClose: vi.fn(),
					title: 'Test Title',
					size,
					variant: 'centered',
					label: 'Test Label',
					inputType: 'text',
					value: '',
					handleValueChange: vi.fn(),
					placeholder: undefined,
					required: false,
					error: undefined,
					cancelLabel: 'Cancel',
					confirmLabel: 'Confirm',
					handleCancel: vi.fn(),
					handleConfirm: vi.fn(),
					className: undefined,
				};

				const result = preparePromptDialog(options);
				expect(result.size).toBe(size);
			}
		});

		it('handles all variant types', () => {
			const variants: PrepareDialogOptions['variant'][] = ['default', 'centered', 'fullscreen'];

			for (const variant of variants) {
				const options: PrepareDialogOptions = {
					isOpen: true,
					onClose: vi.fn(),
					title: 'Test Title',
					size: 'sm',
					variant,
					label: 'Test Label',
					inputType: 'text',
					value: '',
					handleValueChange: vi.fn(),
					placeholder: undefined,
					required: false,
					error: undefined,
					cancelLabel: 'Cancel',
					confirmLabel: 'Confirm',
					handleCancel: vi.fn(),
					handleConfirm: vi.fn(),
					className: undefined,
				};

				const result = preparePromptDialog(options);
				expect(result.variant).toBe(variant);
			}
		});

		it('handles all input types', () => {
			const inputTypes: PrepareDialogOptions['inputType'][] = [
				'text',
				'email',
				'password',
				'number',
				'tel',
				'url',
			];

			for (const inputType of inputTypes) {
				const options: PrepareDialogOptions = {
					isOpen: true,
					onClose: vi.fn(),
					title: 'Test Title',
					size: 'sm',
					variant: 'centered',
					label: 'Test Label',
					inputType,
					value: '',
					handleValueChange: vi.fn(),
					placeholder: undefined,
					required: false,
					error: undefined,
					cancelLabel: 'Cancel',
					confirmLabel: 'Confirm',
					handleCancel: vi.fn(),
					handleConfirm: vi.fn(),
					className: undefined,
				};

				const result = preparePromptDialog(options);
				expect(result).toBeDefined();
			}
		});

		it('handles error state', () => {
			const options: PrepareDialogOptions = {
				isOpen: true,
				onClose: vi.fn(),
				title: 'Test Title',
				size: 'sm',
				variant: 'centered',
				label: 'Test Label',
				inputType: 'text',
				value: 'invalid',
				handleValueChange: vi.fn(),
				placeholder: undefined,
				required: false,
				error: 'Validation error',
				cancelLabel: 'Cancel',
				confirmLabel: 'Confirm',
				handleCancel: vi.fn(),
				handleConfirm: vi.fn(),
				className: undefined,
			};

			const result = preparePromptDialog(options);

			expect(result).toBeDefined();
			expect(result.children).toBeDefined();
		});

		it('handles required field', () => {
			const options: PrepareDialogOptions = {
				isOpen: true,
				onClose: vi.fn(),
				title: 'Test Title',
				size: 'sm',
				variant: 'centered',
				label: 'Test Label',
				inputType: 'text',
				value: '',
				handleValueChange: vi.fn(),
				placeholder: undefined,
				required: true,
				error: undefined,
				cancelLabel: 'Cancel',
				confirmLabel: 'Confirm',
				handleCancel: vi.fn(),
				handleConfirm: vi.fn(),
				className: undefined,
			};

			const result = preparePromptDialog(options);

			expect(result).toBeDefined();
			expect(result.children).toBeDefined();
		});
	});
});

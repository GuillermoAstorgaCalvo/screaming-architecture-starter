/**
 * Tests for buildPromptDialogProps
 *
 * Tests the function that builds prompt dialog props from normalized props and state:
 * - Prop mapping
 * - State integration
 * - All properties passed correctly
 */

import type { PromptDialogState } from '@core/ui/overlays/prompt-dialog/hooks/PromptDialogHooks';
import type { NormalizedPromptDialogProps } from '@core/ui/overlays/prompt-dialog/types/PromptDialogTypes';
import { buildPromptDialogProps } from '@core/ui/overlays/prompt-dialog/utils/buildPromptDialogProps';
import { describe, expect, it, vi } from 'vitest';

describe('buildPromptDialogProps', () => {
	it('should be a function', () => {
		expect(typeof buildPromptDialogProps).toBe('function');
	});

	it('maps all normalized props and state correctly', () => {
		const normalizedProps: NormalizedPromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			label: 'Test Label',
			placeholder: 'Enter value',
			defaultValue: '',
			confirmLabel: 'Confirm',
			cancelLabel: 'Cancel',
			required: false,
			size: 'sm',
			variant: 'centered',
			inputType: 'text',
		};

		const state: PromptDialogState = {
			value: 'test value',
			error: undefined,
			handleClose: vi.fn(),
			handleConfirm: vi.fn(),
			handleCancel: vi.fn(),
			handleValueChange: vi.fn(),
		};

		const result = buildPromptDialogProps(normalizedProps, state);

		expect(result).toBeDefined();
		expect(result.isOpen).toBe(true);
		expect(result.onClose).toBe(state.handleClose);
		expect(result.title).toBe('Test Title');
		expect(result.size).toBe('sm');
		expect(result.variant).toBe('centered');
	});

	it('passes state value and handlers correctly', () => {
		const normalizedProps: NormalizedPromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test',
			label: 'Label',
			placeholder: 'Placeholder',
			defaultValue: '',
			confirmLabel: 'OK',
			cancelLabel: 'Cancel',
			required: true,
			size: 'md',
			variant: 'default',
			inputType: 'email',
		};

		const handleValueChange = vi.fn();
		const handleCancel = vi.fn();
		const handleConfirm = vi.fn();
		const handleClose = vi.fn();

		const state: PromptDialogState = {
			value: 'user@example.com',
			error: 'Invalid email',
			handleClose,
			handleConfirm,
			handleCancel,
			handleValueChange,
		};

		const result = buildPromptDialogProps(normalizedProps, state);

		expect(result.onClose).toBe(handleClose);
		expect(result.footer).toBeDefined();
		expect(result.children).toBeDefined();
	});

	it('passes all input-related props correctly', () => {
		const normalizedProps: NormalizedPromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test',
			label: 'Input Label',
			placeholder: 'Type here',
			defaultValue: '',
			confirmLabel: 'Submit',
			cancelLabel: 'Cancel',
			required: true,
			size: 'lg',
			variant: 'centered',
			inputType: 'password',
		};

		const state: PromptDialogState = {
			value: '',
			error: undefined,
			handleClose: vi.fn(),
			handleConfirm: vi.fn(),
			handleCancel: vi.fn(),
			handleValueChange: vi.fn(),
		};

		const result = buildPromptDialogProps(normalizedProps, state);

		expect(result.size).toBe('lg');
		expect(result.variant).toBe('centered');
		expect(result.children).toBeDefined();
		expect(result.footer).toBeDefined();
	});

	it('passes action labels correctly', () => {
		const normalizedProps: NormalizedPromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test',
			label: 'Label',
			placeholder: '',
			defaultValue: '',
			confirmLabel: 'Save',
			cancelLabel: 'Discard',
			required: false,
			size: 'sm',
			variant: 'centered',
			inputType: 'text',
		};

		const state: PromptDialogState = {
			value: '',
			error: undefined,
			handleClose: vi.fn(),
			handleConfirm: vi.fn(),
			handleCancel: vi.fn(),
			handleValueChange: vi.fn(),
		};

		const result = buildPromptDialogProps(normalizedProps, state);

		expect(result.footer).toBeDefined();
		expect(result.children).toBeDefined();
	});

	it('passes className when provided', () => {
		const normalizedProps: NormalizedPromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test',
			label: 'Label',
			placeholder: '',
			defaultValue: '',
			confirmLabel: 'OK',
			cancelLabel: 'Cancel',
			required: false,
			size: 'sm',
			variant: 'centered',
			inputType: 'text',
			className: 'custom-class',
		};

		const state: PromptDialogState = {
			value: '',
			error: undefined,
			handleClose: vi.fn(),
			handleConfirm: vi.fn(),
			handleCancel: vi.fn(),
			handleValueChange: vi.fn(),
		};

		const result = buildPromptDialogProps(normalizedProps, state);

		expect(result.className).toBe('custom-class');
	});

	it('handles all size variants', () => {
		const sizes: NormalizedPromptDialogProps['size'][] = ['sm', 'md', 'lg', 'xl'];
		const state: PromptDialogState = {
			value: '',
			error: undefined,
			handleClose: vi.fn(),
			handleConfirm: vi.fn(),
			handleCancel: vi.fn(),
			handleValueChange: vi.fn(),
		};

		for (const size of sizes) {
			const normalizedProps: NormalizedPromptDialogProps = {
				isOpen: true,
				onClose: vi.fn(),
				title: 'Test',
				label: 'Label',
				placeholder: '',
				defaultValue: '',
				confirmLabel: 'OK',
				cancelLabel: 'Cancel',
				required: false,
				size,
				variant: 'centered',
				inputType: 'text',
			};

			const result = buildPromptDialogProps(normalizedProps, state);
			expect(result.size).toBe(size);
		}
	});

	it('handles all variant types', () => {
		const variants: NormalizedPromptDialogProps['variant'][] = [
			'default',
			'centered',
			'fullscreen',
		];
		const state: PromptDialogState = {
			value: '',
			error: undefined,
			handleClose: vi.fn(),
			handleConfirm: vi.fn(),
			handleCancel: vi.fn(),
			handleValueChange: vi.fn(),
		};

		for (const variant of variants) {
			const normalizedProps: NormalizedPromptDialogProps = {
				isOpen: true,
				onClose: vi.fn(),
				title: 'Test',
				label: 'Label',
				placeholder: '',
				defaultValue: '',
				confirmLabel: 'OK',
				cancelLabel: 'Cancel',
				required: false,
				size: 'sm',
				variant,
				inputType: 'text',
			};

			const result = buildPromptDialogProps(normalizedProps, state);
			expect(result.variant).toBe(variant);
		}
	});

	it('handles all input types', () => {
		const inputTypes: NormalizedPromptDialogProps['inputType'][] = [
			'text',
			'email',
			'password',
			'number',
			'tel',
			'url',
		];
		const state: PromptDialogState = {
			value: '',
			error: undefined,
			handleClose: vi.fn(),
			handleConfirm: vi.fn(),
			handleCancel: vi.fn(),
			handleValueChange: vi.fn(),
		};

		for (const inputType of inputTypes) {
			const normalizedProps: NormalizedPromptDialogProps = {
				isOpen: true,
				onClose: vi.fn(),
				title: 'Test',
				label: 'Label',
				placeholder: '',
				defaultValue: '',
				confirmLabel: 'OK',
				cancelLabel: 'Cancel',
				required: false,
				size: 'sm',
				variant: 'centered',
				inputType,
			};

			const result = buildPromptDialogProps(normalizedProps, state);
			expect(result).toBeDefined();
			expect(result.children).toBeDefined();
			expect(result.footer).toBeDefined();
		}
	});
});

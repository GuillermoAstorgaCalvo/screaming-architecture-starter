/**
 * Tests for normalizePromptDialogProps
 *
 * Tests the function that normalizes prompt dialog props:
 * - Default value handling
 * - Required field validation
 * - Prop transformation
 * - Optional props handling
 */

import type {
	PromptDialogInputType,
	PromptDialogProps,
	PromptDialogVariant,
} from '@core/ui/overlays/prompt-dialog/types/PromptDialogTypes';
import { normalizePromptDialogProps } from '@core/ui/overlays/prompt-dialog/utils/normalizePromptDialogProps';
import type { ModalSize } from '@src-types/ui/base';
import { describe, expect, it, vi } from 'vitest';

describe('normalizePromptDialogProps', () => {
	it('should be a function', () => {
		expect(typeof normalizePromptDialogProps).toBe('function');
	});

	it('normalizes props with all required fields', () => {
		const props: PromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			label: 'Test Label',
			confirmLabel: 'Confirm',
			cancelLabel: 'Cancel',
		};

		const result = normalizePromptDialogProps(props);

		expect(result.isOpen).toBe(true);
		expect(result.onClose).toBe(props.onClose);
		expect(result.title).toBe('Test Title');
		expect(result.label).toBe('Test Label');
		expect(result.confirmLabel).toBe('Confirm');
		expect(result.cancelLabel).toBe('Cancel');
	});

	it('throws error when label is missing', () => {
		const props: PromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			confirmLabel: 'Confirm',
			cancelLabel: 'Cancel',
		};

		expect(() => normalizePromptDialogProps(props)).toThrow(
			'Label must be provided. Use i18n defaults in PromptDialog component.'
		);
	});

	it('throws error when confirmLabel is missing', () => {
		const props: PromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			label: 'Test Label',
			cancelLabel: 'Cancel',
		};

		expect(() => normalizePromptDialogProps(props)).toThrow(
			'Confirm and cancel labels must be provided. Use i18n defaults in PromptDialog component.'
		);
	});

	it('throws error when cancelLabel is missing', () => {
		const props: PromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			label: 'Test Label',
			confirmLabel: 'Confirm',
		};

		expect(() => normalizePromptDialogProps(props)).toThrow(
			'Confirm and cancel labels must be provided. Use i18n defaults in PromptDialog component.'
		);
	});

	it('applies default values for optional props', () => {
		const props: PromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			label: 'Test Label',
			confirmLabel: 'Confirm',
			cancelLabel: 'Cancel',
		};

		const result = normalizePromptDialogProps(props);

		expect(result.placeholder).toBe('');
		expect(result.defaultValue).toBe('');
		expect(result.required).toBe(false);
		expect(result.inputType).toBe('text');
		expect(result.size).toBe('sm');
		expect(result.variant).toBe('centered');
	});

	it('preserves provided optional props', () => {
		const props: PromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			label: 'Test Label',
			confirmLabel: 'Confirm',
			cancelLabel: 'Cancel',
			placeholder: 'Enter value',
			defaultValue: 'initial',
			required: true,
			inputType: 'email',
			size: 'lg',
			variant: 'default',
			className: 'custom-class',
		};

		const result = normalizePromptDialogProps(props);

		expect(result.placeholder).toBe('Enter value');
		expect(result.defaultValue).toBe('initial');
		expect(result.required).toBe(true);
		expect(result.inputType).toBe('email');
		expect(result.size).toBe('lg');
		expect(result.variant).toBe('default');
		expect(result.className).toBe('custom-class');
	});

	it('includes onConfirm when provided', () => {
		const onConfirm = vi.fn();
		const props: PromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			label: 'Test Label',
			confirmLabel: 'Confirm',
			cancelLabel: 'Cancel',
			onConfirm,
		};

		const result = normalizePromptDialogProps(props);

		expect(result.onConfirm).toBe(onConfirm);
	});

	it('includes onCancel when provided', () => {
		const onCancel = vi.fn();
		const props: PromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			label: 'Test Label',
			confirmLabel: 'Confirm',
			cancelLabel: 'Cancel',
			onCancel,
		};

		const result = normalizePromptDialogProps(props);

		expect(result.onCancel).toBe(onCancel);
	});

	it('includes validate when provided', () => {
		const validate = vi.fn((value: string) => (value.length < 3 ? 'Too short' : undefined));
		const props: PromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			label: 'Test Label',
			confirmLabel: 'Confirm',
			cancelLabel: 'Cancel',
			validate,
		};

		const result = normalizePromptDialogProps(props);

		expect(result.validate).toBe(validate);
	});

	it('handles all input types', () => {
		const inputTypes: PromptDialogInputType[] = [
			'text',
			'email',
			'password',
			'number',
			'tel',
			'url',
		];

		for (const inputType of inputTypes) {
			const props: PromptDialogProps = {
				isOpen: true,
				onClose: vi.fn(),
				title: 'Test Title',
				label: 'Test Label',
				confirmLabel: 'Confirm',
				cancelLabel: 'Cancel',
				inputType,
			};

			const result = normalizePromptDialogProps(props);
			expect(result.inputType).toBe(inputType);
		}
	});

	it('handles all size variants', () => {
		const sizes: ModalSize[] = ['sm', 'md', 'lg', 'xl'];

		for (const size of sizes) {
			const props: PromptDialogProps = {
				isOpen: true,
				onClose: vi.fn(),
				title: 'Test Title',
				label: 'Test Label',
				confirmLabel: 'Confirm',
				cancelLabel: 'Cancel',
				size,
			};

			const result = normalizePromptDialogProps(props);
			expect(result.size).toBe(size);
		}
	});

	it('handles all variant types', () => {
		const variants: PromptDialogVariant[] = ['default', 'centered', 'fullscreen'];

		for (const variant of variants) {
			const props: PromptDialogProps = {
				isOpen: true,
				onClose: vi.fn(),
				title: 'Test Title',
				label: 'Test Label',
				confirmLabel: 'Confirm',
				cancelLabel: 'Cancel',
				variant,
			};

			const result = normalizePromptDialogProps(props);
			expect(result.variant).toBe(variant);
		}
	});

	it('handles undefined className', () => {
		const props: PromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			label: 'Test Label',
			confirmLabel: 'Confirm',
			cancelLabel: 'Cancel',
		};

		const result = normalizePromptDialogProps(props);

		expect(result.className).toBeUndefined();
	});

	it('handles empty string placeholder and defaultValue', () => {
		const props: PromptDialogProps = {
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			label: 'Test Label',
			confirmLabel: 'Confirm',
			cancelLabel: 'Cancel',
			placeholder: '',
			defaultValue: '',
		};

		const result = normalizePromptDialogProps(props);

		expect(result.placeholder).toBe('');
		expect(result.defaultValue).toBe('');
	});
});

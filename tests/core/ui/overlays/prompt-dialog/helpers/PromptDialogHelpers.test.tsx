/**
 * Tests for PromptDialogHelpers
 *
 * Tests the helper functions:
 * - createConfirmHandler
 * - createCancelHandler
 * - renderFooter
 * - renderDialogContent
 * - createDialogFooter
 * - createDialogContent
 */

import {
	createCancelHandler,
	createConfirmHandler,
	createDialogContent,
	createDialogFooter,
	renderDialogContent,
	renderFooter,
} from '@core/ui/overlays/prompt-dialog/helpers/PromptDialogHelpers';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('createConfirmHandler', () => {
	it('validates required field and shows error when empty', async () => {
		const setError = vi.fn();
		const getRequiredError = () => 'Field is required';
		const handler = createConfirmHandler(
			{
				value: '',
				validate: undefined,
				required: true,
				onConfirm: undefined,
				onClose: vi.fn(),
				setError,
			},
			getRequiredError
		);

		await handler();

		expect(setError).toHaveBeenCalledWith('Field is required');
	});

	it('validates required field and allows when value is provided', async () => {
		const onClose = vi.fn();
		const setError = vi.fn();
		const getRequiredError = () => 'Field is required';
		const handler = createConfirmHandler(
			{
				value: 'Test Value',
				validate: undefined,
				required: true,
				onConfirm: undefined,
				onClose,
				setError,
			},
			getRequiredError
		);

		await handler();

		expect(setError).toHaveBeenCalledWith(undefined);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('runs custom validation and shows error when validation fails', async () => {
		const setError = vi.fn();
		const validate = (value: string) => {
			if (value.length < 3) return 'Too short';
			return undefined;
		};
		const getRequiredError = () => 'Field is required';
		const handler = createConfirmHandler(
			{
				value: 'ab',
				validate,
				required: false,
				onConfirm: undefined,
				onClose: vi.fn(),
				setError,
			},
			getRequiredError
		);

		await handler();

		expect(setError).toHaveBeenCalledWith('Too short');
	});

	it('runs custom validation and calls onConfirm when validation passes', async () => {
		const onConfirm = vi.fn();
		const onClose = vi.fn();
		const setError = vi.fn();
		const validate = (value: string) => {
			if (value.length < 3) return 'Too short';
			return undefined;
		};
		const getRequiredError = () => 'Field is required';
		const handler = createConfirmHandler(
			{
				value: 'Valid Value',
				validate,
				required: false,
				onConfirm,
				onClose,
				setError,
			},
			getRequiredError
		);

		await handler();

		expect(setError).toHaveBeenCalledWith(undefined);
		expect(onConfirm).toHaveBeenCalledWith('Valid Value');
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('calls onConfirm and then onClose when validation passes', async () => {
		const onConfirm = vi.fn();
		const onClose = vi.fn();
		const setError = vi.fn();
		const getRequiredError = () => 'Field is required';
		const handler = createConfirmHandler(
			{
				value: 'Test Value',
				validate: undefined,
				required: false,
				onConfirm,
				onClose,
				setError,
			},
			getRequiredError
		);

		await handler();

		expect(onConfirm).toHaveBeenCalledWith('Test Value');
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onConfirm).toHaveBeenCalledBefore(onClose);
	});

	it('calls onClose when onConfirm is undefined', async () => {
		const onClose = vi.fn();
		const setError = vi.fn();
		const getRequiredError = () => 'Field is required';
		const handler = createConfirmHandler(
			{
				value: 'Test Value',
				validate: undefined,
				required: false,
				onConfirm: undefined,
				onClose,
				setError,
			},
			getRequiredError
		);

		await handler();

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('handles async onConfirm callback', async () => {
		const asyncConfirm = async (value: string) => {
			await new Promise(resolve => setTimeout(resolve, 10));
		};
		const onConfirm = vi.fn(asyncConfirm);
		const onClose = vi.fn();
		const setError = vi.fn();
		const getRequiredError = () => 'Field is required';
		const handler = createConfirmHandler(
			{
				value: 'Test Value',
				validate: undefined,
				required: false,
				onConfirm,
				onClose,
				setError,
			},
			getRequiredError
		);

		await handler();

		expect(onConfirm).toHaveBeenCalledWith('Test Value');
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe('createCancelHandler', () => {
	it('calls onCancel and then onClose when onCancel is provided', () => {
		const onCancel = vi.fn();
		const onClose = vi.fn();
		const handler = createCancelHandler(onCancel, onClose);

		handler();

		expect(onCancel).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onCancel).toHaveBeenCalledBefore(onClose);
	});

	it('calls onClose when onCancel is undefined', () => {
		const onClose = vi.fn();
		const handler = createCancelHandler(undefined, onClose);

		handler();

		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe('renderFooter', () => {
	it('renders footer with cancel and confirm buttons', () => {
		const footer = renderFooter({
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			onCancel: vi.fn(),
			onConfirm: vi.fn().mockResolvedValue(undefined),
		});

		renderWithProviders(footer);

		expect(screen.getByText('Cancel')).toBeInTheDocument();
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});

	it('renders with custom labels', () => {
		const footer = renderFooter({
			cancelLabel: 'Close',
			confirmLabel: 'Submit',
			onCancel: vi.fn(),
			onConfirm: vi.fn().mockResolvedValue(undefined),
		});

		renderWithProviders(footer);

		expect(screen.getByText('Close')).toBeInTheDocument();
		expect(screen.getByText('Submit')).toBeInTheDocument();
	});

	it('calls onCancel when cancel button is clicked', () => {
		const onCancel = vi.fn();
		const footer = renderFooter({
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			onCancel,
			onConfirm: vi.fn().mockResolvedValue(undefined),
		});

		renderWithProviders(footer);

		const cancelButton = screen.getByText('Cancel');
		fireEvent.click(cancelButton);

		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('calls onConfirm when confirm button is clicked', async () => {
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const footer = renderFooter({
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			onCancel: vi.fn(),
			onConfirm,
		});

		renderWithProviders(footer);

		const confirmButton = screen.getByText('Confirm');
		fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(onConfirm).toHaveBeenCalledTimes(1);
		});
	});
});

describe('renderDialogContent', () => {
	it('renders dialog content with input field', () => {
		const content = renderDialogContent({
			label: 'Name',
			inputType: 'text',
			value: '',
			handleValueChange: vi.fn(),
			placeholder: 'Enter name',
			required: false,
			error: undefined,
		});

		renderWithProviders(content as React.ReactElement);

		expect(screen.getByLabelText('Name')).toBeInTheDocument();
	});

	it('renders with error message when error is provided', () => {
		const content = renderDialogContent({
			label: 'Name',
			inputType: 'text',
			value: '',
			handleValueChange: vi.fn(),
			placeholder: 'Enter name',
			required: false,
			error: 'This field is required',
		});

		renderWithProviders(content as React.ReactElement);

		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});
});

describe('createDialogFooter', () => {
	it('creates footer with handlers', () => {
		const footer = createDialogFooter({
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			handleCancel: vi.fn(),
			handleConfirm: vi.fn().mockResolvedValue(undefined),
		});

		renderWithProviders(footer);

		expect(screen.getByText('Cancel')).toBeInTheDocument();
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});
});

describe('createDialogContent', () => {
	it('creates dialog content with input', () => {
		const content = createDialogContent({
			label: 'Name',
			inputType: 'text',
			value: '',
			handleValueChange: vi.fn(),
			placeholder: 'Enter name',
			required: false,
			error: undefined,
		});

		renderWithProviders(content as React.ReactElement);

		expect(screen.getByLabelText('Name')).toBeInTheDocument();
	});
});

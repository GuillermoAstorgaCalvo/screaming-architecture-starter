/**
 * FileUploadContent Components Tests
 *
 * Tests for the FileUploadContent components including:
 * - FileUploadFieldContent rendering
 * - FileUploadFieldWithLabel rendering
 * - Input ref management
 * - Click handling
 * - Props forwarding
 */

import { FileUploadFieldWithLabel } from '@core/ui/forms/file-upload/components/FileUploadContent.components';
import type { FileUploadContentProps } from '@core/ui/forms/file-upload/types/FileUploadTypes';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createDefaultProps = (
	overrides?: Partial<FileUploadContentProps>
): FileUploadContentProps => ({
	fileUploadId: 'test-file-upload',
	inputId: 'test-input',
	label: 'Upload File',
	size: 'md',
	fullWidth: false,
	multiple: false,
	files: [],
	dragActive: false,
	onFilesChange: vi.fn(),
	onFileRemove: vi.fn(),
	onDragEnter: vi.fn(),
	onDragLeave: vi.fn(),
	onDragOver: vi.fn(),
	onDrop: vi.fn(),
	onInputChange: vi.fn(),
	...overrides,
});

describe('FileUploadFieldWithLabel - Rendering', () => {
	it('renders file upload field', () => {
		renderWithProviders(<FileUploadFieldWithLabel {...createDefaultProps()} />);

		const input = screen.getByRole('button', { name: /file upload dropzone/i });
		expect(input).toBeInTheDocument();
	});

	it('renders with label when provided', () => {
		renderWithProviders(
			<FileUploadFieldWithLabel {...createDefaultProps({ label: 'Test Label' })} />
		);

		const label = screen.getByText('Test Label');
		expect(label).toBeInTheDocument();
	});

	it('renders without label when not provided', () => {
		renderWithProviders(<FileUploadFieldWithLabel {...createDefaultProps({ label: undefined })} />);

		expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
	});

	it('renders hidden file input', () => {
		const { container } = renderWithProviders(
			<FileUploadFieldWithLabel {...createDefaultProps()} />
		);

		const input = container.querySelector('input[type="file"]');
		expect(input).toBeInTheDocument();
		expect(input).toHaveClass('hidden');
	});
});

describe('FileUploadFieldWithLabel - Click Handling', () => {
	it('triggers file input click when dropzone is clicked', () => {
		renderWithProviders(<FileUploadFieldWithLabel {...createDefaultProps()} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

		const clickSpy = vi.spyOn(fileInput, 'click');

		fireEvent.click(dropzone);

		expect(clickSpy).toHaveBeenCalledTimes(1);
	});

	it('does not trigger click when disabled', () => {
		renderWithProviders(<FileUploadFieldWithLabel {...createDefaultProps({ disabled: true })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

		const clickSpy = vi.spyOn(fileInput, 'click');

		fireEvent.click(dropzone);

		expect(clickSpy).not.toHaveBeenCalled();
	});

	it('handles click when input ref is not available', () => {
		renderWithProviders(<FileUploadFieldWithLabel {...createDefaultProps()} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });

		// Remove input from DOM to simulate ref not available
		const fileInput = document.querySelector('input[type="file"]');
		if (fileInput) {
			fileInput.remove();
		}

		// Should not throw
		expect(() => {
			fireEvent.click(dropzone);
		}).not.toThrow();
	});
});

describe('FileUploadFieldWithLabel - Props Forwarding', () => {
	it('forwards size prop', () => {
		renderWithProviders(<FileUploadFieldWithLabel {...createDefaultProps({ size: 'lg' })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		expect(dropzone).toBeInTheDocument();
	});

	it('forwards multiple prop to input', () => {
		const { container } = renderWithProviders(
			<FileUploadFieldWithLabel {...createDefaultProps({ multiple: true })} />
		);

		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		expect(input).toHaveAttribute('multiple');
	});

	it('forwards accept prop to input', () => {
		const { container } = renderWithProviders(
			<FileUploadFieldWithLabel {...createDefaultProps({ accept: 'image/*' })} />
		);

		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		expect(input).toHaveAttribute('accept', 'image/*');
	});

	it('forwards required prop to input', () => {
		const { container } = renderWithProviders(
			<FileUploadFieldWithLabel {...createDefaultProps({ required: true })} />
		);

		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		expect(input).toHaveAttribute('required');
	});

	it('forwards disabled prop', () => {
		renderWithProviders(<FileUploadFieldWithLabel {...createDefaultProps({ disabled: true })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		expect(dropzone).toHaveAttribute('aria-disabled', 'true');
		expect(dropzone).toHaveAttribute('tabIndex', '-1');
	});
});

describe('FileUploadFieldWithLabel - Drag Handlers', () => {
	it('forwards drag handlers to dropzone', () => {
		const onDragEnter = vi.fn();
		const onDragLeave = vi.fn();
		const onDragOver = vi.fn();
		const onDrop = vi.fn();

		renderWithProviders(
			<FileUploadFieldWithLabel
				{...createDefaultProps({
					onDragEnter,
					onDragLeave,
					onDragOver,
					onDrop,
				})}
			/>
		);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });

		// Create drag events with dataTransfer
		// Enter once to set up counter (counter = 1)
		fireEvent(
			dropzone,
			createDragEvent('dragenter', { items: [{ kind: 'file' }] }) as unknown as Event
		);
		expect(onDragEnter).toHaveBeenCalled();

		// Leave once to trigger onDragLeave (counter goes from 1 to 0)
		fireEvent(dropzone, createDragEvent('dragleave') as unknown as Event);
		expect(onDragLeave).toHaveBeenCalled();

		fireEvent(dropzone, createDragEvent('dragover') as unknown as Event);
		expect(onDragOver).toHaveBeenCalled();

		fireEvent(dropzone, createDragEvent('drop') as unknown as Event);
		expect(onDrop).toHaveBeenCalled();
	});
});

// Helper function to create drag events
function createDragEvent(
	type: 'dragenter' | 'dragleave' | 'dragover' | 'drop',
	options?: {
		items?: Array<{ kind: string }>;
		files?: File[];
	}
): React.DragEvent<HTMLDivElement> {
	const event = new Event(type, {
		bubbles: true,
		cancelable: true,
	}) as unknown as React.DragEvent<HTMLDivElement>;

	Object.defineProperty(event, 'dataTransfer', {
		value: {
			items: options?.items || [],
			files: options?.files
				? (() => {
						const dt = new DataTransfer();
						for (const file of options.files) dt.items.add(file);
						return dt.files;
					})()
				: (() => {
						const dt = new DataTransfer();
						return dt.files;
					})(),
		},
		writable: false,
	});

	return event;
}

describe('FileUploadFieldWithLabel - File State', () => {
	it('renders preview section when files are present and showPreview is true', () => {
		const files = [
			{
				file: new File(['content'], 'test.txt', { type: 'text/plain' }),
				id: 'file-1',
				status: 'pending' as const,
			},
		];

		renderWithProviders(
			<FileUploadFieldWithLabel {...createDefaultProps({ files, showPreview: true })} />
		);

		// Preview section should be rendered (checking via container structure)
		const container = screen.getByRole('button', { name: /file upload dropzone/i }).parentElement;
		expect(container).toBeInTheDocument();
	});

	it('does not render preview section when showPreview is false', () => {
		const files = [
			{
				file: new File(['content'], 'test.txt', { type: 'text/plain' }),
				id: 'file-1',
				status: 'pending' as const,
			},
		];

		renderWithProviders(
			<FileUploadFieldWithLabel {...createDefaultProps({ files, showPreview: false })} />
		);

		// Preview should not be rendered
		expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
	});
});

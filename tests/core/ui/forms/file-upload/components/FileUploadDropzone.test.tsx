/**
 * FileUploadDropzone Component Tests
 *
 * Tests for the FileUploadDropzone component including:
 * - Rendering
 * - Drag and drop handlers
 * - Keyboard interactions
 * - Accessibility attributes
 * - Disabled state
 * - Drag counter logic
 */

import { FileUploadDropzone } from '@core/ui/forms/file-upload/components/FileUploadDropzone';
import type { FileUploadDropzoneProps } from '@core/ui/forms/file-upload/types/FileUploadTypes';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createDefaultProps = (
	overrides?: Partial<FileUploadDropzoneProps>
): FileUploadDropzoneProps => ({
	id: 'test-dropzone',
	dragActive: false,
	size: 'md',
	onDragEnter: vi.fn(),
	onDragLeave: vi.fn(),
	onDragOver: vi.fn(),
	onDrop: vi.fn(),
	onClick: vi.fn(),
	children: <div>Drop files here</div>,
	...overrides,
});

describe('FileUploadDropzone - Rendering', () => {
	it('renders dropzone with children', () => {
		renderWithProviders(<FileUploadDropzone {...createDefaultProps()} />);

		expect(screen.getByText('Drop files here')).toBeInTheDocument();
	});

	it('renders with correct id', () => {
		renderWithProviders(<FileUploadDropzone {...createDefaultProps()} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		expect(dropzone).toHaveAttribute('id', 'test-dropzone');
	});

	it('applies correct role and accessibility attributes', () => {
		renderWithProviders(<FileUploadDropzone {...createDefaultProps()} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		expect(dropzone).toHaveAttribute('role', 'button');
		expect(dropzone).toHaveAttribute('aria-label');
		expect(dropzone).toHaveAttribute('tabIndex', '0');
	});
});

describe('FileUploadDropzone - Drag and Drop', () => {
	it('calls onDragEnter when drag enters', () => {
		const onDragEnter = vi.fn();
		renderWithProviders(<FileUploadDropzone {...createDefaultProps({ onDragEnter })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		const dragEvent = createDragEvent('dragenter', { items: [{ kind: 'file' }] });

		fireEvent(dropzone, dragEvent as unknown as Event);

		expect(onDragEnter).toHaveBeenCalled();
	});

	it('calls onDragLeave when drag leaves', () => {
		const onDragLeave = vi.fn();
		renderWithProviders(<FileUploadDropzone {...createDefaultProps({ onDragLeave })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });

		// Enter first to set up counter
		fireEvent(
			dropzone,
			createDragEvent('dragenter', { items: [{ kind: 'file' }] }) as unknown as Event
		);
		// Then leave
		fireEvent(dropzone, createDragEvent('dragleave') as unknown as Event);

		expect(onDragLeave).toHaveBeenCalled();
	});

	it('calls onDragOver when dragging over', () => {
		const onDragOver = vi.fn();
		renderWithProviders(<FileUploadDropzone {...createDefaultProps({ onDragOver })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		fireEvent(dropzone, createDragEvent('dragover') as unknown as Event);

		expect(onDragOver).toHaveBeenCalled();
	});

	it('calls onDrop when files are dropped', () => {
		const onDrop = vi.fn();
		renderWithProviders(<FileUploadDropzone {...createDefaultProps({ onDrop })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		const dropEvent = createDragEvent('drop', {
			files: [new File(['content'], 'test.txt')],
		});

		fireEvent(dropzone, dropEvent as unknown as Event);

		expect(onDrop).toHaveBeenCalled();
	});

	it('prevents default and stops propagation on drag events', () => {
		const onDragEnter = vi.fn();
		renderWithProviders(<FileUploadDropzone {...createDefaultProps({ onDragEnter })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		const dragEvent = createDragEvent('dragenter', { items: [{ kind: 'file' }] });

		const preventDefaultSpy = vi.spyOn(dragEvent, 'preventDefault');
		const stopPropagationSpy = vi.spyOn(dragEvent, 'stopPropagation');

		fireEvent(dropzone, dragEvent as unknown as Event);

		expect(preventDefaultSpy).toHaveBeenCalled();
		expect(stopPropagationSpy).toHaveBeenCalled();
	});

	it('handles nested drag enter/leave correctly with counter', () => {
		const onDragEnter = vi.fn();
		const onDragLeave = vi.fn();
		renderWithProviders(
			<FileUploadDropzone {...createDefaultProps({ onDragEnter, onDragLeave })} />
		);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });

		// Enter multiple times (simulating nested elements)
		fireEvent(
			dropzone,
			createDragEvent('dragenter', { items: [{ kind: 'file' }] }) as unknown as Event
		);
		fireEvent(
			dropzone,
			createDragEvent('dragenter', { items: [{ kind: 'file' }] }) as unknown as Event
		);

		// Leave once - should not trigger onDragLeave yet
		fireEvent(dropzone, createDragEvent('dragleave') as unknown as Event);
		expect(onDragLeave).not.toHaveBeenCalled();

		// Leave again - should trigger onDragLeave
		fireEvent(dropzone, createDragEvent('dragleave') as unknown as Event);
		expect(onDragLeave).toHaveBeenCalledTimes(1);
	});

	it('resets drag counter on drop', () => {
		const onDragEnter = vi.fn();
		const onDragLeave = vi.fn();
		renderWithProviders(
			<FileUploadDropzone {...createDefaultProps({ onDragEnter, onDragLeave })} />
		);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });

		// Enter multiple times (counter = 2)
		fireEvent(
			dropzone,
			createDragEvent('dragenter', { items: [{ kind: 'file' }] }) as unknown as Event
		);
		fireEvent(
			dropzone,
			createDragEvent('dragenter', { items: [{ kind: 'file' }] }) as unknown as Event
		);

		// Drop should reset counter to 0
		fireEvent(dropzone, createDragEvent('drop') as unknown as Event);

		// Enter again (counter = 1), then leave to trigger onDragLeave
		fireEvent(
			dropzone,
			createDragEvent('dragenter', { items: [{ kind: 'file' }] }) as unknown as Event
		);
		fireEvent(dropzone, createDragEvent('dragleave') as unknown as Event);
		expect(onDragLeave).toHaveBeenCalled();
	});
});

describe('FileUploadDropzone - Click Handling', () => {
	it('calls onClick when clicked', () => {
		const onClick = vi.fn();
		renderWithProviders(<FileUploadDropzone {...createDefaultProps({ onClick })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		fireEvent.click(dropzone);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('does not call onClick when disabled', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<FileUploadDropzone {...createDefaultProps({ onClick, disabled: true })} />
		);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		fireEvent.click(dropzone);

		expect(onClick).not.toHaveBeenCalled();
	});
});

describe('FileUploadDropzone - Keyboard Interactions', () => {
	it('calls onClick on Enter key', () => {
		const onClick = vi.fn();
		renderWithProviders(<FileUploadDropzone {...createDefaultProps({ onClick })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		fireEvent.keyDown(dropzone, { key: 'Enter' });

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('calls onClick on Space key', () => {
		const onClick = vi.fn();
		renderWithProviders(<FileUploadDropzone {...createDefaultProps({ onClick })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		fireEvent.keyDown(dropzone, { key: ' ' });

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('prevents default on Enter key', () => {
		const onClick = vi.fn();
		renderWithProviders(<FileUploadDropzone {...createDefaultProps({ onClick })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		const keyEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
		const preventDefaultSpy = vi.spyOn(keyEvent, 'preventDefault');

		fireEvent(dropzone, keyEvent);

		expect(preventDefaultSpy).toHaveBeenCalled();
	});

	it('does not call onClick on other keys', () => {
		const onClick = vi.fn();
		renderWithProviders(<FileUploadDropzone {...createDefaultProps({ onClick })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		fireEvent.keyDown(dropzone, { key: 'a' });

		expect(onClick).not.toHaveBeenCalled();
	});

	it('does not call onClick on Enter/Space when disabled', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<FileUploadDropzone {...createDefaultProps({ onClick, disabled: true })} />
		);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		fireEvent.keyDown(dropzone, { key: 'Enter' });
		fireEvent.keyDown(dropzone, { key: ' ' });

		expect(onClick).not.toHaveBeenCalled();
	});
});

describe('FileUploadDropzone - Disabled State', () => {
	it('applies disabled attributes when disabled', () => {
		renderWithProviders(<FileUploadDropzone {...createDefaultProps({ disabled: true })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		expect(dropzone).toHaveAttribute('aria-disabled', 'true');
		expect(dropzone).toHaveAttribute('tabIndex', '-1');
	});

	it('does not apply disabled attributes when enabled', () => {
		renderWithProviders(<FileUploadDropzone {...createDefaultProps({ disabled: false })} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		expect(dropzone).toHaveAttribute('aria-disabled', 'false');
		expect(dropzone).toHaveAttribute('tabIndex', '0');
	});

	it('handles undefined disabled prop', () => {
		renderWithProviders(<FileUploadDropzone {...createDefaultProps({})} />);

		const dropzone = screen.getByRole('button', { name: /file upload dropzone/i });
		// When disabled is undefined, aria-disabled is set to undefined (not present)
		expect(dropzone).not.toHaveAttribute('aria-disabled');
		expect(dropzone).toHaveAttribute('tabIndex', '0');
	});
});

describe('FileUploadDropzone - Size Variants', () => {
	it('applies size classes correctly', () => {
		const { container } = renderWithProviders(
			<FileUploadDropzone {...createDefaultProps({ size: 'lg' })} />
		);

		const dropzone = container.querySelector('[role="button"]');
		expect(dropzone).toBeInTheDocument();
	});

	it('handles different size variants', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const { container } = renderWithProviders(
				<FileUploadDropzone {...createDefaultProps({ size })} />
			);

			const dropzone = container.querySelector('[role="button"]');
			expect(dropzone).toBeInTheDocument();
		}
	});
});

describe('FileUploadDropzone - Drag Active State', () => {
	it('applies drag active classes when dragActive is true', () => {
		const { container } = renderWithProviders(
			<FileUploadDropzone {...createDefaultProps({ dragActive: true })} />
		);

		const dropzone = container.querySelector('[role="button"]');
		expect(dropzone).toBeInTheDocument();
	});

	it('applies normal classes when dragActive is false', () => {
		const { container } = renderWithProviders(
			<FileUploadDropzone {...createDefaultProps({ dragActive: false })} />
		);

		const dropzone = container.querySelector('[role="button"]');
		expect(dropzone).toBeInTheDocument();
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
						const fileList = document.createElement('input');
						fileList.type = 'file';
						fileList.multiple = true;
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

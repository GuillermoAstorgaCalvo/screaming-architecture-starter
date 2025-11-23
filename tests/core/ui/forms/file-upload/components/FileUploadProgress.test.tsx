/**
 * FileUploadProgress Component Tests
 *
 * Tests for the FileUploadProgress component including:
 * - Rendering
 * - Progress value display
 * - Size variants
 * - Accessibility
 * - Translation integration
 */

import { FileUploadProgress } from '@core/ui/forms/file-upload/components/FileUploadProgress';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const PROGRESS_50 = 50;
const PROGRESS_0 = 0;
const PROGRESS_100 = 100;

describe('FileUploadProgress - Rendering', () => {
	it('renders progress component', () => {
		renderWithProviders(<FileUploadProgress progress={PROGRESS_50} size="md" />);
		const progress = screen.getByRole('progressbar');
		expect(progress).toBeInTheDocument();
	});

	it('renders with correct progress value', () => {
		renderWithProviders(<FileUploadProgress progress={PROGRESS_50} size="md" />);
		const progress = screen.getByRole('progressbar');
		expect(progress).toHaveAttribute('value', String(PROGRESS_50));
		expect(progress).toHaveAttribute('max', '100');
	});

	it('renders with progress at 0', () => {
		renderWithProviders(<FileUploadProgress progress={PROGRESS_0} size="md" />);
		const progress = screen.getByRole('progressbar');
		expect(progress).toHaveAttribute('value', String(PROGRESS_0));
	});

	it('renders with progress at 100', () => {
		renderWithProviders(<FileUploadProgress progress={PROGRESS_100} size="md" />);
		const progress = screen.getByRole('progressbar');
		expect(progress).toHaveAttribute('value', String(PROGRESS_100));
	});

	it('renders with wrapper div', () => {
		const { container } = renderWithProviders(
			<FileUploadProgress progress={PROGRESS_50} size="md" />
		);
		const wrapper = container.firstChild;
		expect(wrapper).toBeInstanceOf(HTMLDivElement);
		if (wrapper instanceof HTMLDivElement) {
			expect(wrapper).toHaveClass('mt-2', 'w-full');
		}
	});
});

describe('FileUploadProgress - Size Variants', () => {
	it('renders with sm size', () => {
		renderWithProviders(<FileUploadProgress progress={PROGRESS_50} size="sm" />);
		const progress = screen.getByRole('progressbar');
		expect(progress).toBeInTheDocument();
	});

	it('renders with md size', () => {
		renderWithProviders(<FileUploadProgress progress={PROGRESS_50} size="md" />);
		const progress = screen.getByRole('progressbar');
		expect(progress).toBeInTheDocument();
	});

	it('renders with lg size', () => {
		renderWithProviders(<FileUploadProgress progress={PROGRESS_50} size="lg" />);
		const progress = screen.getByRole('progressbar');
		expect(progress).toBeInTheDocument();
	});

	it('passes size prop to Progress component', () => {
		renderWithProviders(<FileUploadProgress progress={PROGRESS_50} size="lg" />);
		const progress = screen.getByRole('progressbar');
		expect(progress).toBeInTheDocument();
		// Size is passed to Progress component which applies size classes
	});
});

describe('FileUploadProgress - Progress Values', () => {
	it('handles various progress values', () => {
		const values = [0, 25, 50, 75, 100];
		for (const value of values) {
			const { unmount } = renderWithProviders(<FileUploadProgress progress={value} size="md" />);
			const progress = screen.getByRole('progressbar');
			expect(progress).toHaveAttribute('value', String(value));
			unmount();
		}
	});

	it('handles decimal progress values', () => {
		renderWithProviders(<FileUploadProgress progress={33.33} size="md" />);
		const progress = screen.getByRole('progressbar');
		expect(progress).toHaveAttribute('value', '33.33');
	});

	it('handles progress values above 100', () => {
		renderWithProviders(<FileUploadProgress progress={150} size="md" />);
		const progress = screen.getByRole('progressbar');
		expect(progress).toHaveAttribute('value', '150');
	});
});

describe('FileUploadProgress - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<FileUploadProgress progress={PROGRESS_50} size="md" />
		);
		await expectA11y(container);
	});

	it('has aria-label with progress value', () => {
		renderWithProviders(<FileUploadProgress progress={PROGRESS_50} size="md" />);
		const progress = screen.getByRole('progressbar');
		expect(progress).toHaveAttribute('aria-label');
		const ariaLabel = progress.getAttribute('aria-label');
		expect(ariaLabel).toContain('50');
	});

	it('has correct max attribute', () => {
		renderWithProviders(<FileUploadProgress progress={PROGRESS_50} size="md" />);
		const progress = screen.getByRole('progressbar');
		expect(progress).toHaveAttribute('max', '100');
	});

	it('shows value in progress element', () => {
		renderWithProviders(<FileUploadProgress progress={PROGRESS_50} size="md" />);
		const progress = screen.getByRole('progressbar');
		expect(progress).toHaveAttribute('value', String(PROGRESS_50));
	});
});

describe('FileUploadProgress - Translation', () => {
	it('uses translation for aria-label', () => {
		renderWithProviders(<FileUploadProgress progress={PROGRESS_50} size="md" />);
		const progress = screen.getByRole('progressbar');
		const ariaLabel = progress.getAttribute('aria-label');
		expect(ariaLabel).toBeTruthy();
		// Translation key: fileUpload.uploadProgress
		// Should include progress value in the label
		expect(ariaLabel).toContain('50');
	});

	it('updates aria-label when progress changes', () => {
		const { rerender } = renderWithProviders(
			<FileUploadProgress progress={PROGRESS_50} size="md" />
		);
		let progress = screen.getByRole('progressbar');
		let ariaLabel = progress.getAttribute('aria-label');
		expect(ariaLabel).toContain('50');

		rerender(<FileUploadProgress progress={75} size="md" />);
		progress = screen.getByRole('progressbar');
		ariaLabel = progress.getAttribute('aria-label');
		expect(ariaLabel).toContain('75');
	});
});

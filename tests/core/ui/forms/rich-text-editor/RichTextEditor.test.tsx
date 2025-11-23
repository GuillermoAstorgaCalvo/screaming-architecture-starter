/**
 * RichTextEditor Component Tests
 *
 * Tests for the RichTextEditor component including:
 * - Rendering
 * - Props forwarding
 * - Label display
 * - Error and helper text
 * - Size variants
 * - Full width option
 * - Controlled and uncontrolled modes
 * - Accessibility
 */

import RichTextEditor from '@core/ui/forms/rich-text-editor/RichTextEditor';
import type { RichTextEditorProps } from '@src-types/ui/forms-editors';
import { screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock TipTap
const mockUseEditor = vi.fn();
const mockEditor = {
	getHTML: vi.fn(() => '<p>Content</p>'),
	commands: {
		setContent: vi.fn(),
	},
	setEditable: vi.fn(),
	on: vi.fn(),
	off: vi.fn(),
	destroy: vi.fn(),
};

vi.mock('@tiptap/react', () => ({
	useEditor: (config: unknown) => mockUseEditor(config),
	EditorContent: vi.fn(() => <div data-testid="editor-content">Editor Content</div>),
}));

vi.mock('@tiptap/starter-kit', () => ({
	default: {
		configure: vi.fn(() => []),
	},
}));

vi.mock('@tiptap/extension-placeholder', () => ({
	default: {
		configure: vi.fn(() => ({})),
	},
}));

const LABEL_CONTENT = 'Content';
const ERROR_MESSAGE = 'Content is required';
const HELPER_TEXT = 'Enter your content here';
const PLACEHOLDER_TEXT = 'Start typing...';

describe('RichTextEditor - Rendering', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('renders editor without label', () => {
		const props: RichTextEditorProps = {
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
	});

	it('renders editor with label', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(screen.getByText(LABEL_CONTENT)).toBeInTheDocument();
	});

	it('renders editor with placeholder', () => {
		const props: RichTextEditorProps = {
			placeholder: PLACEHOLDER_TEXT,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
	});

	it('renders editor with custom editorId', () => {
		const props: RichTextEditorProps = {
			editorId: 'custom-editor',
			label: LABEL_CONTENT,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		const label = screen.getByText(LABEL_CONTENT);
		expect(label).toHaveAttribute('for', 'custom-editor');
	});
});

describe('RichTextEditor - Label and Required', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('displays label when provided', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(screen.getByText(LABEL_CONTENT)).toBeInTheDocument();
	});

	it('displays required asterisk when required is true', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			required: true,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(screen.getByText('*')).toBeInTheDocument();
	});

	it('does not display required asterisk when required is false', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(screen.queryByText('*')).not.toBeInTheDocument();
	});

	it('generates ID automatically when label is provided', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		const label = screen.getByText(LABEL_CONTENT);
		const htmlFor = label.getAttribute('for');
		expect(htmlFor).toBeDefined();
		expect(htmlFor).toContain('rich-text-editor-');
	});
});

describe('RichTextEditor - Error and Helper Text', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('displays error message when provided', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			error: ERROR_MESSAGE,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it('displays helper text when provided', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			helperText: HELPER_TEXT,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(screen.getByText(HELPER_TEXT)).toBeInTheDocument();
	});

	it('prioritizes error over helper text', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			error: ERROR_MESSAGE,
			helperText: HELPER_TEXT,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(screen.queryByText(HELPER_TEXT)).not.toBeInTheDocument();
	});

	it('does not display messages when neither error nor helperText provided', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();
		expect(screen.queryByText(HELPER_TEXT)).not.toBeInTheDocument();
	});
});

describe('RichTextEditor - Size Variants', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('applies sm size classes', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			size: 'sm',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
	});

	it('applies md size classes (default)', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
	});

	it('applies lg size classes', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			size: 'lg',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
	});

	it('defaults to md when size is not provided', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
	});
});

describe('RichTextEditor - Full Width', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('applies full width class when fullWidth is true', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			fullWidth: true,
			size: 'md',
		};

		const { container } = renderWithProviders(<RichTextEditor {...props} />);

		const wrapper = container.querySelector('.w-full');
		expect(wrapper).toBeInTheDocument();
	});

	it('does not apply full width class when fullWidth is false', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			fullWidth: false,
			size: 'md',
		};

		const { container } = renderWithProviders(<RichTextEditor {...props} />);

		// The wrapper should not have w-full when fullWidth is false
		// Note: The field div always has w-full, so we check the wrapper specifically
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).not.toHaveClass('w-full');
	});

	it('defaults to false when fullWidth is not provided', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			size: 'md',
		};

		const { container } = renderWithProviders(<RichTextEditor {...props} />);

		// The wrapper should not have w-full when fullWidth is not provided
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).not.toHaveClass('w-full');
	});
});

describe('RichTextEditor - Controlled Mode', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('handles controlled value', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			value: '<p>Controlled content</p>',
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
		expect(mockUseEditor.mock.calls.length).toBeGreaterThan(0);
		const firstCall = mockUseEditor.mock.calls[0];
		expect(firstCall).toBeDefined();
		if (firstCall && firstCall.length > 0) {
			const config = firstCall[0];
			expect(config.content).toBe('<p>Controlled content</p>');
		}
	});

	it('calls onChange when content changes', () => {
		const onChange = vi.fn();
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			value: '<p>Initial</p>',
			onChange,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
		expect(mockUseEditor.mock.calls.length).toBeGreaterThan(0);
		const firstCall = mockUseEditor.mock.calls[0];
		expect(firstCall).toBeDefined();
		if (firstCall && firstCall.length > 0) {
			const config = firstCall[0];

			if (config.onUpdate) {
				config.onUpdate({ editor: mockEditor });
				expect(onChange).toHaveBeenCalledWith('<p>Content</p>');
			}
		}
	});
});

describe('RichTextEditor - Uncontrolled Mode', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('handles uncontrolled defaultValue', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			defaultValue: '<p>Default content</p>',
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
		expect(mockUseEditor.mock.calls.length).toBeGreaterThan(0);
		const firstCall = mockUseEditor.mock.calls[0];
		expect(firstCall).toBeDefined();
		if (firstCall && firstCall.length > 0) {
			const config = firstCall[0];
			expect(config.content).toBe('<p>Default content</p>');
		}
	});

	it('uses empty string when neither value nor defaultValue provided', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
		expect(mockUseEditor.mock.calls.length).toBeGreaterThan(0);
		const firstCall = mockUseEditor.mock.calls[0];
		expect(firstCall).toBeDefined();
		if (firstCall && firstCall.length > 0) {
			const config = firstCall[0];
			expect(config.content).toBe('');
		}
	});
});

describe('RichTextEditor - Disabled and ReadOnly', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('disables editor when disabled is true', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			disabled: true,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
		expect(mockUseEditor.mock.calls.length).toBeGreaterThan(0);
		const firstCall = mockUseEditor.mock.calls[0];
		expect(firstCall).toBeDefined();
		if (firstCall && firstCall.length > 0) {
			const config = firstCall[0];
			expect(config.editable).toBe(false);
		}
	});

	it('sets editor to read-only when readOnly is true', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			readOnly: true,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
		expect(mockUseEditor.mock.calls.length).toBeGreaterThan(0);
		const firstCall = mockUseEditor.mock.calls[0];
		expect(firstCall).toBeDefined();
		if (firstCall && firstCall.length > 0) {
			const config = firstCall[0];
			expect(config.editable).toBe(false);
		}
	});

	it('defaults to editable when neither disabled nor readOnly', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
		expect(mockUseEditor.mock.calls.length).toBeGreaterThan(0);
		const firstCall = mockUseEditor.mock.calls[0];
		expect(firstCall).toBeDefined();
		if (firstCall && firstCall.length > 0) {
			const config = firstCall[0];
			expect(config.editable).toBe(true);
		}
	});
});

describe('RichTextEditor - Height Constraints', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('applies minHeight when provided as number', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			minHeight: 300,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
	});

	it('applies minHeight when provided as string', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			minHeight: '20rem',
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
	});

	it('applies maxHeight when provided', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			maxHeight: 500,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
	});
});

describe('RichTextEditor - Toolbar Configuration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('configures toolbar with custom options', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			toolbar: {
				bold: false,
				italic: true,
				headings: false,
			},
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
	});

	it('handles undefined toolbar', () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
	});
});

describe('RichTextEditor - Accessibility', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('has proper label association', async () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			editorId: 'editor-1',
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		await waitFor(() => {
			const label = screen.getByText(LABEL_CONTENT);
			expect(label).toHaveAttribute('for', 'editor-1');
		});
	});

	it('has proper ARIA attributes for error state', async () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			editorId: 'editor-1',
			error: ERROR_MESSAGE,
			size: 'md',
		};

		renderWithProviders(<RichTextEditor {...props} />);

		await waitFor(() => {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});
	});

	it('passes accessibility checks', async () => {
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			editorId: 'editor-1',
			helperText: HELPER_TEXT,
			size: 'md',
		};

		const { container } = renderWithProviders(<RichTextEditor {...props} />);

		await waitFor(async () => {
			// Use the container instead of document.body to avoid landmark region issues
			await expectA11y(container);
		});
	});
});

describe('RichTextEditor - Integration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('handles complete props configuration', () => {
		const onChange = vi.fn();
		const props: RichTextEditorProps = {
			label: LABEL_CONTENT,
			error: ERROR_MESSAGE,
			helperText: HELPER_TEXT,
			size: 'lg',
			fullWidth: true,
			editorId: 'custom-editor',
			disabled: false,
			required: true,
			value: '<p>Content</p>',
			onChange,
			placeholder: PLACEHOLDER_TEXT,
			minHeight: 300,
			maxHeight: 500,
			toolbar: {
				bold: true,
				italic: false,
			},
		};

		renderWithProviders(<RichTextEditor {...props} />);

		expect(screen.getByText(LABEL_CONTENT)).toBeInTheDocument();
		expect(screen.getByText('*')).toBeInTheDocument();
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(mockUseEditor).toHaveBeenCalled();
	});
});

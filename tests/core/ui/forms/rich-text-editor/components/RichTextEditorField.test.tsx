/**
 * RichTextEditorField Component Tests
 *
 * Tests for the RichTextEditorField component including:
 * - Rendering
 * - Editor initialization
 * - Props forwarding
 * - Container styling
 * - Null handling
 */

import { RichTextEditorField } from '@core/ui/forms/rich-text-editor/components/RichTextEditorField';
import type { RichTextEditorFieldProps } from '@core/ui/forms/rich-text-editor/types/RichTextEditorTypes';
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

vi.mock('@core/ui/forms/rich-text-editor/components/RichTextEditorEditorContent', () => ({
	RichTextEditorEditorContent: vi.fn(({ editor, hasError, ariaDescribedBy }) => (
		<div
			data-testid="editor-content-wrapper"
			data-has-error={hasError}
			data-aria-describedby={ariaDescribedBy}
		>
			Editor Content
		</div>
	)),
}));

describe('RichTextEditorField - Rendering', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('renders editor when initialization succeeds', () => {
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: false,
			ariaDescribedBy: undefined,
			disabled: false,
			readOnly: false,
		};

		renderWithProviders(<RichTextEditorField {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
	});

	it('returns null when editor initialization fails', () => {
		mockUseEditor.mockReturnValue(null);

		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: false,
			ariaDescribedBy: undefined,
			disabled: false,
			readOnly: false,
		};

		const { container } = renderWithProviders(<RichTextEditorField {...props} />);

		expect(container.firstChild).toBeNull();
	});

	it('applies className to container', () => {
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'custom-class',
			hasError: false,
			ariaDescribedBy: undefined,
			disabled: false,
			readOnly: false,
		};

		const { container } = renderWithProviders(<RichTextEditorField {...props} />);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass('custom-class');
	});
});

describe('RichTextEditorField - Container Styling', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('applies minHeight style when provided as number', () => {
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: false,
			ariaDescribedBy: undefined,
			disabled: false,
			readOnly: false,
			minHeight: 300,
		};

		const { container } = renderWithProviders(<RichTextEditorField {...props} />);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveStyle({ minHeight: '300px' });
	});

	it('applies minHeight style when provided as string', () => {
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: false,
			ariaDescribedBy: undefined,
			disabled: false,
			readOnly: false,
			minHeight: '20rem',
		};

		const { container } = renderWithProviders(<RichTextEditorField {...props} />);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveStyle({ minHeight: '20rem' });
	});

	it('applies maxHeight style when provided as number', () => {
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: false,
			ariaDescribedBy: undefined,
			disabled: false,
			readOnly: false,
			maxHeight: 500,
		};

		const { container } = renderWithProviders(<RichTextEditorField {...props} />);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveStyle({ maxHeight: '500px' });
	});

	it('applies both minHeight and maxHeight', () => {
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: false,
			ariaDescribedBy: undefined,
			disabled: false,
			readOnly: false,
			minHeight: 300,
			maxHeight: 500,
		};

		const { container } = renderWithProviders(<RichTextEditorField {...props} />);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveStyle({ minHeight: '300px', maxHeight: '500px' });
	});
});

describe('RichTextEditorField - Props Forwarding', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('passes hasError to editor content', () => {
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: true,
			ariaDescribedBy: undefined,
			disabled: false,
			readOnly: false,
		};

		renderWithProviders(<RichTextEditorField {...props} />);

		const editorContent = document.querySelector('[data-testid="editor-content-wrapper"]');
		expect(editorContent).toHaveAttribute('data-has-error', 'true');
	});

	it('passes ariaDescribedBy to editor content', () => {
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: false,
			ariaDescribedBy: 'editor-1-helper',
			disabled: false,
			readOnly: false,
		};

		renderWithProviders(<RichTextEditorField {...props} />);

		const editorContent = document.querySelector('[data-testid="editor-content-wrapper"]');
		expect(editorContent).toHaveAttribute('data-aria-describedby', 'editor-1-helper');
	});

	it('passes editor instance to editor content', () => {
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: false,
			ariaDescribedBy: undefined,
			disabled: false,
			readOnly: false,
		};

		renderWithProviders(<RichTextEditorField {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
	});
});

describe('RichTextEditorField - Editor Configuration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseEditor.mockReturnValue(mockEditor);
	});

	it('configures editor with value when provided', () => {
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: false,
			ariaDescribedBy: undefined,
			disabled: false,
			readOnly: false,
			value: '<p>Initial content</p>',
		};

		renderWithProviders(<RichTextEditorField {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
		expect(mockUseEditor.mock.calls.length).toBeGreaterThan(0);
		const firstCall = mockUseEditor.mock.calls[0];
		expect(firstCall).toBeDefined();
		if (firstCall && firstCall.length > 0) {
			const config = firstCall[0];
			expect(config.content).toBe('<p>Initial content</p>');
		}
	});

	it('configures editor with defaultValue when value not provided', () => {
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: false,
			ariaDescribedBy: undefined,
			disabled: false,
			readOnly: false,
			defaultValue: '<p>Default content</p>',
		};

		renderWithProviders(<RichTextEditorField {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
		expect(mockUseEditor.mock.calls.length).toBeGreaterThan(0);
		const firstCall = mockUseEditor.mock.calls[0];
		expect(firstCall).toBeDefined();
		if (firstCall && firstCall.length > 0) {
			const config = firstCall[0];
			expect(config.content).toBe('<p>Default content</p>');
		}
	});

	it('configures editor with placeholder', () => {
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: false,
			ariaDescribedBy: undefined,
			disabled: false,
			readOnly: false,
			placeholder: 'Enter content',
		};

		renderWithProviders(<RichTextEditorField {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
	});

	it('configures editor with disabled state', () => {
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: false,
			ariaDescribedBy: undefined,
			disabled: true,
			readOnly: false,
		};

		renderWithProviders(<RichTextEditorField {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
		expect(mockUseEditor.mock.calls.length).toBeGreaterThan(0);
		const firstCall = mockUseEditor.mock.calls[0];
		expect(firstCall).toBeDefined();
		if (firstCall && firstCall.length > 0) {
			const config = firstCall[0];
			expect(config.editable).toBe(false);
		}
	});

	it('configures editor with readOnly state', () => {
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: false,
			ariaDescribedBy: undefined,
			disabled: false,
			readOnly: true,
		};

		renderWithProviders(<RichTextEditorField {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
		expect(mockUseEditor.mock.calls.length).toBeGreaterThan(0);
		const firstCall = mockUseEditor.mock.calls[0];
		expect(firstCall).toBeDefined();
		if (firstCall && firstCall.length > 0) {
			const config = firstCall[0];
			expect(config.editable).toBe(false);
		}
	});

	it('configures editor with onChange callback', () => {
		const onChange = vi.fn();
		const props: RichTextEditorFieldProps = {
			id: 'editor-1',
			className: 'test-class',
			hasError: false,
			ariaDescribedBy: undefined,
			disabled: false,
			readOnly: false,
			onChange,
		};

		renderWithProviders(<RichTextEditorField {...props} />);

		expect(mockUseEditor).toHaveBeenCalled();
		expect(mockUseEditor.mock.calls.length).toBeGreaterThan(0);
		const firstCall = mockUseEditor.mock.calls[0];
		expect(firstCall).toBeDefined();
		if (firstCall && firstCall.length > 0) {
			const config = firstCall[0];
			expect(config.onUpdate).toBeDefined();

			// Simulate editor update
			if (config.onUpdate) {
				config.onUpdate({ editor: mockEditor });
				expect(onChange).toHaveBeenCalledWith('<p>Content</p>');
			}
		}
	});
});

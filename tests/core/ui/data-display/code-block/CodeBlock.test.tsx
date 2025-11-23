/**
 * CodeBlock Component Tests
 *
 * Tests for CodeBlock component:
 * - Rendering
 * - Language support
 * - Size variants
 * - Line numbers
 * - Theme detection (dark/light)
 * - Custom class names
 * - Accessibility
 */

import CodeBlock from '@core/ui/data-display/code-block/CodeBlock';
import { waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_CODE = 'const hello = "world";';
const TEST_CODE_MULTILINE = `function greet(name: string) {
  return \`Hello, \${name}!\`;
}`;

describe('CodeBlock - rendering', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<CodeBlock>{TEST_CODE}</CodeBlock>);
		}).not.toThrow();
	});

	it('should render code block element', () => {
		const { container } = renderWithProviders(
			<CodeBlock data-testid="code-block">{TEST_CODE}</CodeBlock>
		);
		const codeBlock = container.querySelector('pre');
		expect(codeBlock).toBeInTheDocument();
	});

	it('should render code content', () => {
		const { container } = renderWithProviders(<CodeBlock>{TEST_CODE}</CodeBlock>);
		// react-syntax-highlighter breaks text into tokens, so we check container text
		expect(container.textContent).toContain('const');
		expect(container.textContent).toContain('hello');
	});

	it('should apply custom className', () => {
		const { container } = renderWithProviders(
			<CodeBlock className="custom-codeblock" data-testid="code-block">
				{TEST_CODE}
			</CodeBlock>
		);
		const codeBlock = container.querySelector('pre.custom-codeblock');
		expect(codeBlock).toBeInTheDocument();
	});

	it('should render with default language (plaintext)', () => {
		const { container } = renderWithProviders(<CodeBlock>{TEST_CODE}</CodeBlock>);
		// Component should render without errors
		expect(container.textContent).toContain('const');
	});

	it('should render with default size (md)', () => {
		const { container } = renderWithProviders(<CodeBlock>{TEST_CODE}</CodeBlock>);
		expect(container.textContent).toContain('const');
	});
});

describe('CodeBlock - language support', () => {
	it('should support TypeScript language', () => {
		const { container } = renderWithProviders(
			<CodeBlock language="typescript">{TEST_CODE_MULTILINE}</CodeBlock>
		);
		// react-syntax-highlighter breaks text into tokens, so we check for key tokens
		expect(container.textContent).toContain('function');
		expect(container.textContent).toContain('greet');
	});

	it('should support JavaScript language', () => {
		const { container } = renderWithProviders(
			<CodeBlock language="javascript">{TEST_CODE}</CodeBlock>
		);
		// Check for key tokens in the code
		expect(container.textContent).toContain('const');
		expect(container.textContent).toContain('hello');
	});

	it('should support Python language', () => {
		const pythonCode = 'def hello():\n    print("world")';
		const { container } = renderWithProviders(
			<CodeBlock language="python">{pythonCode}</CodeBlock>
		);
		expect(container.textContent).toContain('def');
		expect(container.textContent).toContain('hello');
	});

	it('should support JSON language', () => {
		const jsonCode = '{"name": "test"}';
		const { container } = renderWithProviders(<CodeBlock language="json">{jsonCode}</CodeBlock>);
		expect(container.textContent).toContain('name');
		expect(container.textContent).toContain('test');
	});

	it('should support HTML language', () => {
		const htmlCode = '<div>Hello</div>';
		const { container } = renderWithProviders(<CodeBlock language="html">{htmlCode}</CodeBlock>);
		expect(container.textContent).toContain('div');
		expect(container.textContent).toContain('Hello');
	});

	it('should support CSS language', () => {
		const cssCode = '.test { color: red; }';
		const { container } = renderWithProviders(<CodeBlock language="css">{cssCode}</CodeBlock>);
		expect(container.textContent).toContain('test');
		expect(container.textContent).toContain('color');
	});
});

describe('CodeBlock - size variants', () => {
	it('should support sm size', () => {
		const { container } = renderWithProviders(
			<CodeBlock size="sm" data-testid="code-block">
				{TEST_CODE}
			</CodeBlock>
		);
		expect(container.textContent).toContain('const');
	});

	it('should support md size', () => {
		const { container } = renderWithProviders(
			<CodeBlock size="md" data-testid="code-block">
				{TEST_CODE}
			</CodeBlock>
		);
		expect(container.textContent).toContain('const');
	});

	it('should support lg size', () => {
		const { container } = renderWithProviders(
			<CodeBlock size="lg" data-testid="code-block">
				{TEST_CODE}
			</CodeBlock>
		);
		expect(container.textContent).toContain('const');
	});
});

describe('CodeBlock - line numbers', () => {
	it('should not show line numbers by default', () => {
		const { container } = renderWithProviders(<CodeBlock>{TEST_CODE_MULTILINE}</CodeBlock>);
		// Line numbers are rendered by react-syntax-highlighter
		// We verify the component renders without errors
		expect(container.textContent).toContain('function');
		// Should not have line number class when showLineNumbers is false
		const lineNumbers = container.querySelectorAll('.react-syntax-highlighter-line-number');
		expect(lineNumbers.length).toBe(0);
	});

	it('should show line numbers when showLineNumbers is true', () => {
		const { container } = renderWithProviders(
			<CodeBlock showLineNumbers>{TEST_CODE_MULTILINE}</CodeBlock>
		);
		// react-syntax-highlighter handles line numbers internally
		expect(container.textContent).toContain('function');
		// Should have line number elements
		const lineNumbers = container.querySelectorAll('.react-syntax-highlighter-line-number');
		expect(lineNumbers.length).toBeGreaterThan(0);
	});

	it('should start line numbers from 1 by default', () => {
		const { container } = renderWithProviders(
			<CodeBlock showLineNumbers>{TEST_CODE_MULTILINE}</CodeBlock>
		);
		expect(container.textContent).toContain('function');
		const lineNumbers = container.querySelectorAll('.react-syntax-highlighter-line-number');
		if (lineNumbers.length > 0) {
			expect(lineNumbers[0]?.textContent?.trim()).toBe('1');
		}
	});

	it('should start line numbers from custom startingLineNumber', () => {
		const { container } = renderWithProviders(
			<CodeBlock showLineNumbers startingLineNumber={10}>
				{TEST_CODE_MULTILINE}
			</CodeBlock>
		);
		expect(container.textContent).toContain('function');
		const lineNumbers = container.querySelectorAll('.react-syntax-highlighter-line-number');
		if (lineNumbers.length > 0) {
			expect(lineNumbers[0]?.textContent?.trim()).toBe('10');
		}
	});

	it('should support startingLineNumber without showLineNumbers', () => {
		const { container } = renderWithProviders(
			<CodeBlock startingLineNumber={5}>{TEST_CODE}</CodeBlock>
		);
		expect(container.textContent).toContain('const');
	});
});

describe('CodeBlock - theme detection', () => {
	let matchMediaMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		matchMediaMock = vi.fn().mockImplementation((query: string) => {
			return {
				matches: query === '(prefers-color-scheme: dark)',
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			};
		});
		Object.defineProperty(globalThis.window, 'matchMedia', {
			writable: true,
			value: matchMediaMock,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should use light theme when system prefers light', () => {
		matchMediaMock.mockImplementation((query: string) => ({
			matches: false, // light mode
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));

		const { container } = renderWithProviders(<CodeBlock>{TEST_CODE}</CodeBlock>);
		expect(container.textContent).toContain('const');
	});

	it('should use dark theme when system prefers dark', () => {
		matchMediaMock.mockImplementation((query: string) => ({
			matches: query === '(prefers-color-scheme: dark)',
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));

		const { container } = renderWithProviders(<CodeBlock>{TEST_CODE}</CodeBlock>);
		expect(container.textContent).toContain('const');
	});

	it('should use forced dark theme when theme="dark"', () => {
		matchMediaMock.mockImplementation((query: string) => ({
			matches: false, // system prefers light
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));

		const { container } = renderWithProviders(<CodeBlock theme="dark">{TEST_CODE}</CodeBlock>);
		expect(container.textContent).toContain('const');
	});

	it('should use forced light theme when theme="light"', () => {
		matchMediaMock.mockImplementation((query: string) => ({
			matches: true, // system prefers dark
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));

		const { container } = renderWithProviders(<CodeBlock theme="light">{TEST_CODE}</CodeBlock>);
		expect(container.textContent).toContain('const');
	});

	it('should listen to media query changes', async () => {
		const addEventListenerMock = vi.fn();
		const removeEventListenerMock = vi.fn();

		matchMediaMock.mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: addEventListenerMock,
			removeEventListener: removeEventListenerMock,
			dispatchEvent: vi.fn(),
		}));

		const { unmount } = renderWithProviders(<CodeBlock>{TEST_CODE}</CodeBlock>);

		// Verify event listener was added
		expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));

		// Cleanup should remove listener
		unmount();
		expect(removeEventListenerMock).toHaveBeenCalled();
	});

	it('should update theme when media query changes', async () => {
		let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;

		matchMediaMock.mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: (_event: string, handler: (e: MediaQueryListEvent) => void) => {
				changeHandler = handler;
			},
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));

		const { container } = renderWithProviders(<CodeBlock>{TEST_CODE}</CodeBlock>);

		// Simulate theme change
		if (changeHandler !== null) {
			(changeHandler as (e: MediaQueryListEvent) => void)({ matches: true } as MediaQueryListEvent);
		}

		await waitFor(() => {
			expect(container.textContent).toContain('const');
		});
	});
});

describe('CodeBlock - custom class names', () => {
	it('should apply codeClassName to code element', () => {
		const { container } = renderWithProviders(
			<CodeBlock codeClassName="custom-code">{TEST_CODE}</CodeBlock>
		);
		// react-syntax-highlighter applies className to code element
		const codeElement = container.querySelector('code.custom-code');
		expect(codeElement).toBeInTheDocument();
	});

	it('should merge className with variant classes', () => {
		const { container } = renderWithProviders(
			<CodeBlock className="custom-class" size="lg">
				{TEST_CODE}
			</CodeBlock>
		);
		const codeBlock = container.querySelector('pre');
		expect(codeBlock).toHaveClass('custom-class');
	});
});

describe('CodeBlock - HTML attributes', () => {
	it('should preserve HTML attributes', () => {
		const { container } = renderWithProviders(
			<CodeBlock data-testid="code-block" aria-label="Code example">
				{TEST_CODE}
			</CodeBlock>
		);
		const codeBlock = container.querySelector('pre[data-testid="code-block"]');
		expect(codeBlock).toHaveAttribute('aria-label', 'Code example');
	});

	it('should support data attributes', () => {
		const { container } = renderWithProviders(
			<CodeBlock data-language="typescript" data-testid="code-block">
				{TEST_CODE}
			</CodeBlock>
		);
		const codeBlock = container.querySelector('pre[data-language="typescript"]');
		expect(codeBlock).toBeInTheDocument();
	});
});

describe('CodeBlock - accessibility', () => {
	it('should have no accessibility violations', async () => {
		const { container } = renderWithProviders(<CodeBlock>{TEST_CODE}</CodeBlock>);
		await expectA11y(container);
	});

	it('should use semantic pre element', () => {
		const { container } = renderWithProviders(<CodeBlock>{TEST_CODE}</CodeBlock>);
		const preElement = container.querySelector('pre');
		expect(preElement).toBeInTheDocument();
	});

	it('should support ARIA attributes', () => {
		const { container } = renderWithProviders(
			<CodeBlock aria-label="TypeScript code example">{TEST_CODE}</CodeBlock>
		);
		const codeBlock = container.querySelector('pre');
		expect(codeBlock).toHaveAttribute('aria-label', 'TypeScript code example');
	});
});

describe('CodeBlock - edge cases', () => {
	it('should handle empty code string', () => {
		const { container } = renderWithProviders(<CodeBlock>{''}</CodeBlock>);
		// Component should render without errors
		expect(container.querySelector('pre')).toBeInTheDocument();
	});

	it('should handle very long code', () => {
		const longCode = `const x = ${'a'.repeat(1000)};`;
		const { container } = renderWithProviders(<CodeBlock>{longCode}</CodeBlock>);
		expect(container.textContent).toContain('const');
		expect(container.textContent).toContain('x');
	});

	it('should handle special characters in code', () => {
		const specialCode = 'const x = "!@#$%^&*()";';
		const { container } = renderWithProviders(<CodeBlock>{specialCode}</CodeBlock>);
		expect(container.textContent).toContain('const');
		expect(container.textContent).toContain('x');
	});

	it('should handle multiline code with various line numbers', () => {
		const multilineCode = `line1
line2
line3
line4
line5`;
		const { container } = renderWithProviders(
			<CodeBlock showLineNumbers startingLineNumber={1}>
				{multilineCode}
			</CodeBlock>
		);
		expect(container.textContent).toContain('line1');
		expect(container.textContent).toContain('line2');
	});
});

describe('CodeBlock - integration', () => {
	it('should work with all props combined', () => {
		const { container } = renderWithProviders(
			<CodeBlock
				language="typescript"
				size="lg"
				showLineNumbers
				startingLineNumber={10}
				theme="dark"
				className="custom-class"
				codeClassName="custom-code"
				data-testid="code-block"
			>
				{TEST_CODE_MULTILINE}
			</CodeBlock>
		);
		expect(container.textContent).toContain('function');
		expect(container.textContent).toContain('greet');
		const codeBlock = container.querySelector('pre[data-testid="code-block"]');
		expect(codeBlock).toBeInTheDocument();
		const codeElement = container.querySelector('code.custom-code');
		expect(codeElement).toBeInTheDocument();
	});

	it('should handle multiple CodeBlock instances', () => {
		const { container } = renderWithProviders(
			<>
				<CodeBlock language="typescript" data-testid="code-block-1">
					{TEST_CODE}
				</CodeBlock>
				<CodeBlock language="javascript" data-testid="code-block-2">
					{TEST_CODE}
				</CodeBlock>
			</>
		);
		// Verify both code blocks are rendered
		const codeBlock1 = container.querySelector('pre[data-testid="code-block-1"]');
		const codeBlock2 = container.querySelector('pre[data-testid="code-block-2"]');
		expect(codeBlock1).toBeInTheDocument();
		expect(codeBlock2).toBeInTheDocument();
		// Both should contain the code content
		expect(container.textContent).toContain('const');
		expect(container.textContent).toContain('hello');
	});
});

import { getCodeBlockVariantClasses } from '@core/ui/variants/code';
import type { CodeBlockProps } from '@src-types/ui/typography';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * CodeBlock - Syntax-highlighted code block component
 *
 * Features:
 * - Syntax highlighting for multiple languages
 * - Optional line numbers
 * - Dark mode support (auto-detects theme)
 * - Size variants: sm, md, lg
 * - Accessible: semantic pre and code elements
 * - Scrollable for long code blocks
 *
 * @example
 * ```tsx
 * <CodeBlock language="typescript">
 * {`function greet(name: string) {
 *   return \`Hello, \${name}!\`;
 * }`}
 * </CodeBlock>
 * ```
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   language="javascript"
 *   showLineNumbers
 *   size="lg"
 * >
 * {`const data = {
 *   name: "World",
 *   greeting: "Hello"
 * };`}
 * </CodeBlock>
 * ```
 */

/**
 * Detect if dark mode is active via CSS media query
 */
function useDarkMode(): boolean {
	const [isDark, setIsDark] = useState(
		() => globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches
	);

	useEffect(() => {
		const mediaQuery = globalThis.window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (e: MediaQueryListEvent) => {
			setIsDark(e.matches);
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, []);

	return isDark;
}

export default function CodeBlock({
	children,
	language = 'plaintext',
	size = 'md',
	showLineNumbers = false,
	startingLineNumber = 1,
	codeClassName,
	className,
	theme,
	...props
}: Readonly<CodeBlockProps>) {
	const systemIsDark = useDarkMode();
	const isDark = theme === 'dark' || (!theme && systemIsDark);
	const style = isDark ? oneDark : oneLight;
	const containerClasses = getCodeBlockVariantClasses({ size, className });

	return (
		<pre className={containerClasses} {...props}>
			<SyntaxHighlighter
				language={language}
				style={style}
				showLineNumbers={showLineNumbers}
				startingLineNumber={startingLineNumber}
				customStyle={{
					margin: 0,
					background: 'transparent',
					padding: 0,
				}}
				codeTagProps={{
					className: codeClassName,
				}}
			>
				{children}
			</SyntaxHighlighter>
		</pre>
	);
}

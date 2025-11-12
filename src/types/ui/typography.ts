import type { HTMLAttributes, ReactNode } from 'react';

import type { StandardSize } from './base';

/**
 * Text component props - typography paragraph component
 */
export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
	/** Text content */
	children: ReactNode;
	/** Size variant @default 'md' */
	size?: StandardSize;
}

/**
 * Heading level type
 */
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Heading component props - typography heading component
 */
export interface HeadingProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'as'> {
	/** Heading content */
	children: ReactNode;
	/** Heading level (h1-h6) @default 'h1' */
	as?: HeadingLevel;
	/** Size variant @default 'md' */
	size?: StandardSize;
}

/**
 * Code component props - inline code component
 */
export interface CodeProps extends HTMLAttributes<HTMLElement> {
	/** Code content */
	children: ReactNode;
	/** Size variant @default 'md' */
	size?: StandardSize;
}

/**
 * Supported programming languages for syntax highlighting
 */
export type CodeLanguage =
	| 'javascript'
	| 'typescript'
	| 'jsx'
	| 'tsx'
	| 'python'
	| 'java'
	| 'c'
	| 'cpp'
	| 'csharp'
	| 'php'
	| 'ruby'
	| 'go'
	| 'rust'
	| 'swift'
	| 'kotlin'
	| 'html'
	| 'css'
	| 'scss'
	| 'sass'
	| 'json'
	| 'xml'
	| 'yaml'
	| 'yml'
	| 'markdown'
	| 'md'
	| 'bash'
	| 'shell'
	| 'sql'
	| 'graphql'
	| 'dockerfile'
	| 'plaintext'
	| 'text';

/**
 * CodeBlock component props - code block with syntax highlighting
 */
export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLPreElement>, 'children'> {
	/** Code content to display */
	children: string;
	/** Programming language for syntax highlighting @default 'plaintext' */
	language?: CodeLanguage;
	/** Size variant @default 'md' */
	size?: StandardSize;
	/** Show line numbers @default false */
	showLineNumbers?: boolean;
	/** Starting line number @default 1 */
	startingLineNumber?: number;
	/** Custom class name for the code element */
	codeClassName?: string;
	/** Force dark or light theme. If not provided, auto-detects from system preference */
	theme?: 'light' | 'dark';
}

import type { Plugin } from 'vite';

/**
 * Vite plugin that adds source file information to JSX elements in development mode
 * Similar to lovable-tagger, this adds data attributes to DOM elements showing
 * their source file path and line number (e.g., data-source-file="src/core/ui/copy-button/useCopyButton.ts:23")
 *
 * Only runs in development mode for performance.
 */

/**
 * Checks if a file should be processed by the plugin
 */
function shouldProcessFile(id: string): boolean {
	// Only process TypeScript/TSX files
	if (!/\.(tsx?|jsx)$/.test(id)) {
		return false;
	}

	// Skip node_modules
	if (id.includes('node_modules')) {
		return false;
	}

	// Must be in src directory
	return id.includes('src/');
}

/**
 * Gets the relative path from src directory
 * Handles file IDs with query parameters (e.g., "file.tsx?vue&type=template")
 */
function getRelativePath(id: string): string | null {
	// Remove query parameters and hash from file ID
	const filePath = id.split('?')[0]?.split('#')[0] ?? id;
	const srcIndex = filePath.indexOf('src/');
	if (srcIndex === -1) {
		return null;
	}

	return filePath.slice(srcIndex);
}

/**
 * Context for tag skipping checks
 */
interface SkipTagContext {
	tagName: string;
	attrs: string;
	line: string;
	matchIndex: number;
}

/**
 * Checks if a tag is a TypeScript generic (single uppercase letter)
 */
function isTypeScriptGeneric(tagName: string): boolean {
	return tagName.length === 1 && /^[A-Z]$/.test(tagName);
}

/**
 * Checks if a tag is inside a JSX comment
 */
function isInJSXComment(line: string, matchIndex: number): boolean {
	// Look for comment start before the tag
	const commentStartBefore = line.slice(0, matchIndex).includes('<!--');
	const commentEndBefore = line.slice(0, matchIndex).includes('-->');
	if (commentStartBefore && !commentEndBefore) {
		// Check if comment closes after the tag
		return line.slice(matchIndex).includes('-->');
	}

	return false;
}

/**
 * Checks if a tag is inside a code comment
 * Note: Using string.includes() for substring checks (not Set membership)
 */
function isInCodeComment(line: string, matchIndex: number): boolean {
	// Check for // comments on the same line before the match
	if (line.slice(0, matchIndex).includes('//')) {
		return true;
	}
	// Check for /* */ comments (simplified - looks for /* before match)
	// Inlining to avoid linter false positive about Set usage for substring checks
	return line.slice(0, matchIndex).includes('/*') && !line.slice(0, matchIndex).includes('*/');
}

/**
 * Checks if a tag should be skipped
 */
function shouldSkipTag(context: SkipTagContext): boolean {
	const { tagName, attrs, line, matchIndex } = context;

	// Skip if already has data-source-file attribute
	if (attrs.includes('data-source-file')) {
		return true;
	}

	// Skip React fragments
	if (tagName === 'Fragment' || tagName.startsWith('React.Fragment')) {
		return true;
	}

	// Skip single uppercase letter tags (likely TypeScript generics like <T>, <K>, etc.)
	if (isTypeScriptGeneric(tagName)) {
		return true;
	}

	// Skip JSX comments (<!-- ... -->)
	if (isInJSXComment(line, matchIndex)) {
		return true;
	}

	// Skip if inside a regular code comment (// or /* */)
	return isInCodeComment(line, matchIndex);
}

/**
 * Creates a replacement for a JSX tag with source file information
 */
interface TagReplacementParams {
	tagName: string;
	attrs: string;
	closing: string;
	relativePath: string;
	lineNumber: number;
}

/**
 * Escapes special characters in attribute values to prevent XSS
 */
function escapeAttributeValue(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;');
}

function createTagReplacement(params: TagReplacementParams): string {
	const { tagName, attrs, closing, relativePath, lineNumber } = params;
	const escapedPath = escapeAttributeValue(`${relativePath}:${lineNumber}`);
	const sourceAttr = ` data-source-file="${escapedPath}"`;

	if (attrs.trim()) {
		// Has attributes, add before closing bracket
		return `<${tagName}${attrs}${sourceAttr}${closing}`;
	}

	// No attributes, add after tag name
	return `<${tagName}${sourceAttr}${closing}`;
}

/**
 * Transforms a single line of code, adding source file attributes to JSX tags
 */
interface TransformLineParams {
	line: string;
	lineNumber: number;
	relativePath: string;
}

/**
 * Handles tag replacement for a single match
 */
interface TagMatchParams {
	match: string;
	tagName: string;
	attributes: string | undefined;
	closing: string;
	relativePath: string;
	lineNumber: number;
	line: string;
	matchIndex: number;
}

function handleTagMatch(params: TagMatchParams): string {
	const { match, tagName, attributes, closing, relativePath, lineNumber, line, matchIndex } =
		params;
	const attrs = attributes ?? '';

	// Skip if should be skipped
	if (
		shouldSkipTag({
			tagName,
			attrs,
			line,
			matchIndex,
		})
	) {
		return match;
	}

	// Process both regular opening tags and self-closing tags
	if (closing === '>' || closing === '/>') {
		return createTagReplacement({
			tagName,
			attrs,
			closing,
			relativePath,
			lineNumber,
		});
	}

	return match;
}

/**
 * Creates a tag replacement handler for regex replace
 * Uses rest parameters to avoid too many parameters lint error
 * String.replace callback signature: (match, p1, p2, p3, offset, string) => string
 */
function createTagReplacer(
	relativePath: string,
	lineNumber: number,
	line: string
): (match: string, ...args: unknown[]) => string {
	return (match: string, ...args: unknown[]) => {
		// Extract parameters from String.replace callback
		// args[0] = tagName (first capture group)
		// args[1] = attributes (second capture group)
		// args[2] = closing (third capture group)
		// args[3] = offset (match index)
		const tagName = args[0] as string;
		const attributes = args[1] as string | undefined;
		const closing = args[2] as string;
		const offset = typeof args[3] === 'number' ? args[3] : 0;

		return handleTagMatch({
			match,
			tagName,
			attributes,
			closing,
			relativePath,
			lineNumber,
			line,
			matchIndex: offset,
		});
	};
}

/**
 * Safely matches JSX tag attributes with bounded length to prevent ReDoS
 * Uses explicit character class with strict upper bound to prevent backtracking attacks
 */
function getJSXTagRegex(): RegExp {
	// Regex with bounded quantifier - safe from ReDoS
	// Pattern: <tagName ...> or <tagName ... />
	// Uses explicit bounded repetition {0,2000} to limit maximum match length
	// The quantifier is bounded (not unbounded like * or +), preventing ReDoS
	// Character class [^>] matches any character except '>', bounded to max 2000 chars
	const maxAttributeLength = 2000;
	const attributePattern = `\\s[^>]{0,${maxAttributeLength}}`;
	const pattern = `<([A-Za-z][\\w.-]*)(${attributePattern})?(/?>)`;
	return new RegExp(pattern, 'g');
}

function transformLine(params: TransformLineParams): { transformed: string; changed: boolean } {
	const { line, lineNumber, relativePath } = params;

	const originalLine = line;
	const replacer = createTagReplacer(relativePath, lineNumber, line);
	const jsxTagRegex = getJSXTagRegex();

	// Use replace() for regex with callback - replaceAll() only works with string-to-string replacements
	// For regex patterns with function callbacks, replace() is the required method
	const transformed = line.replace(jsxTagRegex, replacer);

	const changed = transformed !== originalLine;

	return { transformed, changed };
}

/**
 * Transforms code to add source file information to JSX elements
 */
function transformCode(code: string, relativePath: string): string | null {
	// Handle empty or null code
	if (!code || typeof code !== 'string') {
		return null;
	}

	const lines = code.split('\n');
	const transformedLines: string[] = [];
	let hasChanges = false;

	for (const [index, line] of lines.entries()) {
		const lineNumber = index + 1;
		const { transformed, changed } = transformLine({
			line,
			lineNumber,
			relativePath,
		});

		transformedLines.push(transformed);

		if (changed) {
			hasChanges = true;
		}
	}

	if (!hasChanges) {
		return null;
	}

	return transformedLines.join('\n');
}

export function sourceTagger(): Plugin {
	return {
		name: 'source-tagger',
		enforce: 'pre',
		apply: 'serve', // Only run in dev server
		transform(code, id) {
			try {
				// Handle null/undefined code
				if (!code || typeof code !== 'string') {
					return null;
				}

				if (!shouldProcessFile(id)) {
					return null;
				}

				const relativePath = getRelativePath(id);
				if (!relativePath) {
					return null;
				}

				const transformedCode = transformCode(code, relativePath);
				if (!transformedCode) {
					return null;
				}

				return {
					code: transformedCode,
					// Returning null for map lets Vite generate source maps automatically
					// This is appropriate for simple text transformations
					map: null,
				};
			} catch (error) {
				// Log error but don't crash the dev server
				// Return null on error to allow development to continue
				console.warn(`[source-tagger] Failed to process ${id}:`, error);
				return null;
			}
		},
	};
}

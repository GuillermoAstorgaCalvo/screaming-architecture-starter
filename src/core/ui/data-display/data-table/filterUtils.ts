import type { ReactNode } from 'react';

const EMPTY_STRING = '';

/**
 * Safely converts ReactNode to string for display - handles simple types
 */
function reactNodeToStringSimple(node: ReactNode): string | null {
	if (node === null || node === undefined) {
		return null;
	}
	if (typeof node === 'string') {
		return node;
	}
	if (typeof node === 'number' || typeof node === 'boolean') {
		return String(node);
	}
	return null;
}

/**
 * Extracts text from ReactNode props
 */
function extractTextFromProps(props: { children?: ReactNode }): string | null {
	if (typeof props.children === 'string') {
		return props.children;
	}
	if (Array.isArray(props.children)) {
		const texts = props.children
			.map((child: ReactNode) => reactNodeToString(child))
			.filter(Boolean);
		return texts.length > 0 ? texts.join(' ') : null;
	}
	return null;
}

/**
 * Safely converts ReactNode to string for display
 */
export function reactNodeToString(node: ReactNode): string {
	const simple = reactNodeToStringSimple(node);
	if (simple !== null) {
		return simple;
	}
	// For complex ReactNode, try to extract text content
	if (node !== null && typeof node === 'object' && 'props' in node) {
		const props = node.props as { children?: ReactNode };
		const extracted = extractTextFromProps(props);
		if (extracted !== null) {
			return extracted;
		}
	}
	return EMPTY_STRING;
}

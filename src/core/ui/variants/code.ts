import {
	CODE_BASE_CLASSES,
	CODE_BLOCK_BASE_CLASSES,
	CODE_BLOCK_SIZE_CLASSES,
	CODE_SIZE_CLASSES,
} from '@core/constants/ui/display/typography';
import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Code variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Code component.
 */
export const codeVariants = cva(CODE_BASE_CLASSES, {
	variants: {
		size: {
			sm: CODE_SIZE_CLASSES.sm,
			md: CODE_SIZE_CLASSES.md,
			lg: CODE_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		size: 'md',
	},
});

/**
 * Type for code variant props
 * Extracted from codeVariants using VariantProps
 */
export type CodeVariants = VariantProps<typeof codeVariants>;

/**
 * Helper function to get code class names with proper merging
 *
 * @param props - Code variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getCodeVariantClasses(
	props: CodeVariants & { className?: string | undefined }
): string {
	return twMerge(codeVariants(props), props.className);
}

/**
 * CodeBlock variant definition using class-variance-authority
 *
 * Provides type-safe variant management for CodeBlock component.
 */
export const codeBlockVariants = cva(CODE_BLOCK_BASE_CLASSES, {
	variants: {
		size: {
			sm: CODE_BLOCK_SIZE_CLASSES.sm,
			md: CODE_BLOCK_SIZE_CLASSES.md,
			lg: CODE_BLOCK_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		size: 'md',
	},
});

/**
 * Type for codeBlock variant props
 * Extracted from codeBlockVariants using VariantProps
 */
export type CodeBlockVariants = VariantProps<typeof codeBlockVariants>;

/**
 * Helper function to get codeBlock class names with proper merging
 *
 * @param props - CodeBlock variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getCodeBlockVariantClasses(
	props: CodeBlockVariants & { className?: string | undefined }
): string {
	return twMerge(codeBlockVariants(props), props.className);
}

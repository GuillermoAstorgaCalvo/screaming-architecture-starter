import type { StandardSize } from '@src-types/ui/base';
import type { BoxProps } from '@src-types/ui/layout/primitives';
import { twMerge } from 'tailwind-merge';

/**
 * Padding size classes
 * Uses design tokens for spacing
 */
const BOX_PADDING_CLASSES: Record<StandardSize | 'none', string> = {
	none: '',
	sm: 'p-sm',
	md: 'p-md',
	lg: 'p-lg',
} as const;

/**
 * Margin size classes
 * Uses design tokens for spacing
 */
const BOX_MARGIN_CLASSES: Record<StandardSize | 'none', string> = {
	none: '',
	sm: 'm-sm',
	md: 'm-md',
	lg: 'm-lg',
} as const;

/**
 * Box - Base wrapper component with spacing/padding support
 *
 * Features:
 * - Configurable padding and margin
 * - Size variants: sm, md, lg
 * - Extends all standard div attributes
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Box padding="md" margin="sm">
 *   <div>Content with padding and margin</div>
 * </Box>
 * ```
 *
 * @example
 * ```tsx
 * <Box padding="lg" className="bg-muted">
 *   <h2>Title</h2>
 *   <p>Content</p>
 * </Box>
 * ```
 */
export default function Box({
	children,
	padding,
	margin,
	className,
	...props
}: Readonly<BoxProps>) {
	const paddingClasses = padding ? BOX_PADDING_CLASSES[padding] : '';
	const marginClasses = margin ? BOX_MARGIN_CLASSES[margin] : '';
	const classes = twMerge(paddingClasses, marginClasses, className);

	return (
		<div className={classes} {...props}>
			{children}
		</div>
	);
}

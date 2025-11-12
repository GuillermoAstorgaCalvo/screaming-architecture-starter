import type { ContainerProps } from '@src-types/layout';
import { twMerge } from 'tailwind-merge';

const CONTAINER_BASE_CLASSES = 'mx-auto w-full';

const CONTAINER_MAX_WIDTH_CLASSES: Record<NonNullable<ContainerProps['maxWidth']>, string> = {
	xs: 'max-w-xs',
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
	'2xl': 'max-w-2xl',
	'3xl': 'max-w-3xl',
	'4xl': 'max-w-4xl',
	'5xl': 'max-w-5xl',
	'6xl': 'max-w-6xl',
	'7xl': 'max-w-7xl',
	full: 'max-w-full',
} as const;

const CONTAINER_PADDING_CLASSES = 'px-4 sm:px-6 lg:px-8';

/**
 * Container - Layout component for consistent max-width and padding
 *
 * Features:
 * - Configurable max-width sizes: xs, sm, md, lg, xl, 2xl, full
 * - Optional responsive padding
 * - Centered by default (mx-auto)
 * - Dark mode support
 * - Accessible semantic HTML
 *
 * @example
 * ```tsx
 * <Container maxWidth="xl" padding>
 *   <h1>Page Title</h1>
 *   <p>Page content goes here</p>
 * </Container>
 * ```
 *
 * @example
 * ```tsx
 * <Container maxWidth="2xl">
 *   <div>Content without padding</div>
 * </Container>
 * ```
 *
 * @example
 * ```tsx
 * <Container maxWidth="full" padding className="bg-gray-100">
 *   <div>Full width with padding and custom styling</div>
 * </Container>
 * ```
 */
export default function Container({
	maxWidth = 'xl',
	padding = true,
	className,
	children,
	...props
}: Readonly<ContainerProps>) {
	const maxWidthClass = CONTAINER_MAX_WIDTH_CLASSES[maxWidth];
	const paddingClass = padding ? CONTAINER_PADDING_CLASSES : '';
	const classes = twMerge(CONTAINER_BASE_CLASSES, maxWidthClass, paddingClass, className);

	return (
		<div className={classes} {...props}>
			{children}
		</div>
	);
}

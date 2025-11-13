import type { StandardSize } from '@src-types/ui/base';
import type { StackProps } from '@src-types/ui/layout/primitives';
import { twMerge } from 'tailwind-merge';

/**
 * Stack direction classes
 */
const STACK_DIRECTION_CLASSES: Record<'vertical' | 'horizontal', string> = {
	vertical: 'flex flex-col',
	horizontal: 'flex flex-row',
} as const;

/**
 * Stack gap classes
 */
const STACK_GAP_CLASSES: Record<StandardSize | 'none', string> = {
	none: '',
	sm: 'gap-2',
	md: 'gap-4',
	lg: 'gap-6',
} as const;

/**
 * Stack alignment classes
 */
const STACK_ALIGN_CLASSES: Record<'start' | 'center' | 'end' | 'stretch', string> = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
	stretch: 'items-stretch',
} as const;

/**
 * Stack justify classes
 */
const STACK_JUSTIFY_CLASSES: Record<
	'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly',
	string
> = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
	'space-between': 'justify-between',
	'space-around': 'justify-around',
	'space-evenly': 'justify-evenly',
} as const;

/**
 * Stack - Vertical/horizontal stacking component with gap
 *
 * Features:
 * - Vertical or horizontal stacking
 * - Configurable gap between items
 * - Alignment and justification options
 * - Size variants for gap: sm, md, lg
 * - Extends all standard div attributes
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Stack direction="vertical" gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Stack>
 * ```
 *
 * @example
 * ```tsx
 * <Stack direction="horizontal" gap="lg" align="center" justify="space-between">
 *   <div>Left</div>
 *   <div>Right</div>
 * </Stack>
 * ```
 */
export default function Stack({
	children,
	direction = 'vertical',
	gap = 'md',
	align = 'start',
	justify = 'start',
	className,
	...props
}: Readonly<StackProps>) {
	const directionClasses = STACK_DIRECTION_CLASSES[direction];
	const gapClasses = STACK_GAP_CLASSES[gap];
	const alignClasses = STACK_ALIGN_CLASSES[align];
	const justifyClasses = STACK_JUSTIFY_CLASSES[justify];
	const classes = twMerge(directionClasses, gapClasses, alignClasses, justifyClasses, className);

	return (
		<div className={classes} {...props}>
			{children}
		</div>
	);
}

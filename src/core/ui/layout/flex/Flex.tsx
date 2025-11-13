import type { StandardSize } from '@src-types/ui/base';
import type { FlexProps } from '@src-types/ui/layout/primitives';
import { twMerge } from 'tailwind-merge';

/**
 * Flex direction classes
 */
const FLEX_DIRECTION_CLASSES: Record<'row' | 'row-reverse' | 'col' | 'col-reverse', string> = {
	row: 'flex-row',
	'row-reverse': 'flex-row-reverse',
	col: 'flex-col',
	'col-reverse': 'flex-col-reverse',
} as const;

/**
 * Flex gap classes
 */
const FLEX_GAP_CLASSES: Record<StandardSize | 'none', string> = {
	none: '',
	sm: 'gap-2',
	md: 'gap-4',
	lg: 'gap-6',
} as const;

/**
 * Flex alignment classes
 */
const FLEX_ALIGN_CLASSES: Record<'start' | 'center' | 'end' | 'stretch' | 'baseline', string> = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
	stretch: 'items-stretch',
	baseline: 'items-baseline',
} as const;

/**
 * Flex justify classes
 */
const FLEX_JUSTIFY_CLASSES: Record<
	'start' | 'center' | 'end' | 'between' | 'around' | 'evenly',
	string
> = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
	between: 'justify-between',
	around: 'justify-around',
	evenly: 'justify-evenly',
} as const;

/**
 * Flex - Flexbox wrapper component
 *
 * Features:
 * - Full flexbox control with direction, gap, alignment, and justification
 * - Configurable gap between items
 * - Wrap support
 * - Size variants for gap: sm, md, lg
 * - Extends all standard div attributes
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Flex direction="row" gap="md" align="center" justify="between">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Flex>
 * ```
 *
 * @example
 * ```tsx
 * <Flex direction="col" gap="lg" wrap>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Flex>
 * ```
 */
export default function Flex({
	children,
	direction = 'row',
	gap,
	align = 'start',
	justify = 'start',
	wrap = false,
	className,
	...props
}: Readonly<FlexProps>) {
	const directionClasses = FLEX_DIRECTION_CLASSES[direction];
	const gapClasses = gap ? FLEX_GAP_CLASSES[gap] : '';
	const alignClasses = FLEX_ALIGN_CLASSES[align];
	const justifyClasses = FLEX_JUSTIFY_CLASSES[justify];
	const wrapClasses = wrap ? 'flex-wrap' : '';
	const classes = twMerge(
		'flex',
		directionClasses,
		gapClasses,
		alignClasses,
		justifyClasses,
		wrapClasses,
		className
	);

	return (
		<div className={classes} {...props}>
			{children}
		</div>
	);
}

/* eslint-disable no-magic-numbers */
import type { StandardSize } from '@src-types/ui/base';
import type { GridCols, GridProps } from '@src-types/ui/layout/primitives';
import { twMerge } from 'tailwind-merge';

const AUTO_MIN_WIDTH_FALLBACK = 200 as const;

/**
 * Grid column classes
 */
const GRID_COLS_CLASSES: Record<Exclude<GridCols, 'auto'>, string> = {
	1: 'grid-cols-1',
	2: 'grid-cols-2',
	3: 'grid-cols-3',
	4: 'grid-cols-4',
	5: 'grid-cols-5',
	6: 'grid-cols-6',
	7: 'grid-cols-7',
	8: 'grid-cols-8',
	9: 'grid-cols-9',
	10: 'grid-cols-10',
	11: 'grid-cols-11',
	12: 'grid-cols-12',
} as const;

/**
 * Grid gap classes
 */
const GRID_GAP_CLASSES: Record<StandardSize | 'none', string> = {
	none: '',
	sm: 'gap-2',
	md: 'gap-4',
	lg: 'gap-6',
} as const;

/**
 * Grid alignment classes
 */
const GRID_ALIGN_CLASSES: Record<'start' | 'center' | 'end' | 'stretch', string> = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
	stretch: 'items-stretch',
} as const;

/**
 * Grid justify classes
 */
const GRID_JUSTIFY_CLASSES: Record<
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
 * Grid - CSS Grid wrapper component
 *
 * Features:
 * - CSS Grid layout with configurable columns
 * - Configurable gap between items
 * - Alignment and justification options
 * - Size variants for gap: sm, md, lg
 * - Auto-fit option for responsive grids
 * - Extends all standard div attributes
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Grid cols={3} gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 * ```
 *
 * @example
 * ```tsx
 * <Grid cols="auto" gap="lg" align="center" justify="between">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 * ```
 */
export default function Grid({
	children,
	cols,
	gap = 'md',
	align = 'start',
	justify = 'start',
	autoMinWidth = AUTO_MIN_WIDTH_FALLBACK,
	className,
	style,
	...props
}: Readonly<GridProps>) {
	let colsClasses = '';
	if (cols === 'auto') {
		colsClasses = `grid-cols-[repeat(auto-fit,minmax(${autoMinWidth}px,1fr))]`;
	} else if (cols !== undefined) {
		colsClasses = GRID_COLS_CLASSES[cols];
	}
	const gapClasses = GRID_GAP_CLASSES[gap];
	const alignClasses = GRID_ALIGN_CLASSES[align];
	const justifyClasses = GRID_JUSTIFY_CLASSES[justify];
	const classes = twMerge('grid', colsClasses, gapClasses, alignClasses, justifyClasses, className);

	return (
		<div className={classes} style={style} {...props}>
			{children}
		</div>
	);
}

import { DIVIDER_BASE_CLASSES, DIVIDER_ORIENTATION_CLASSES } from '@core/constants/ui/display';
import type { DividerProps } from '@src-types/ui/layout/divider';
import { twMerge } from 'tailwind-merge';

/**
 * Divider - Visual separation component
 *
 * Features:
 * - Orientation variants: horizontal, vertical
 * - Dark mode support
 * - Accessible semantic HTML (hr element)
 *
 * @example
 * ```tsx
 * <Divider orientation="horizontal" />
 * ```
 *
 * @example
 * ```tsx
 * <div className="flex">
 *   <div>Left content</div>
 *   <Divider orientation="vertical" className="mx-4" />
 *   <div>Right content</div>
 * </div>
 * ```
 */
export default function Divider({
	orientation = 'horizontal',
	className,
	...props
}: Readonly<DividerProps>) {
	const classes = twMerge(
		DIVIDER_BASE_CLASSES,
		DIVIDER_ORIENTATION_CLASSES[orientation],
		className
	);
	return <hr className={classes} {...props} />;
}

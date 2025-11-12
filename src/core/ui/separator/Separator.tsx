import { SEPARATOR_BASE_CLASSES, SEPARATOR_ORIENTATION_CLASSES } from '@core/constants/ui/display';
import type { SeparatorProps } from '@src-types/ui/layout/divider';
import { twMerge } from 'tailwind-merge';

/**
 * Separator - Light visual separator component
 *
 * Features:
 * - Lighter styling than Divider for subtle visual separation
 * - Orientation variants: horizontal, vertical
 * - Dark mode support
 * - Accessible semantic HTML (hr element)
 *
 * @example
 * ```tsx
 * <Separator orientation="horizontal" />
 * ```
 *
 * @example
 * ```tsx
 * <div className="flex">
 *   <div>Left content</div>
 *   <Separator orientation="vertical" className="mx-4" />
 *   <div>Right content</div>
 * </div>
 * ```
 */
export default function Separator({
	orientation = 'horizontal',
	className,
	...props
}: Readonly<SeparatorProps>) {
	const classes = twMerge(
		SEPARATOR_BASE_CLASSES,
		SEPARATOR_ORIENTATION_CLASSES[orientation],
		className
	);
	return <hr className={classes} {...props} />;
}

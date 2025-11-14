import { getScrollAreaClasses } from '@core/ui/utilities/scroll-area/helpers/ScrollAreaHelpers';
import type { ScrollAreaProps } from '@src-types/ui/layout/scroll';

/**
 * ScrollArea - Custom scrollable container component
 *
 * Features:
 * - Custom scrollbar styling
 * - Horizontal and vertical scrolling
 * - Accessible scrollable region
 * - Dark mode support
 * - Optional orientation (vertical, horizontal, both)
 *
 * @example
 * ```tsx
 * <ScrollArea className="h-64">
 *   <div>Long content here...</div>
 * </ScrollArea>
 * ```
 *
 * @example
 * ```tsx
 * <ScrollArea orientation="horizontal" className="w-full">
 *   <div className="flex gap-4">
 *     <div className="min-w-64">Item 1</div>
 *     <div className="min-w-64">Item 2</div>
 *   </div>
 * </ScrollArea>
 * ```
 */
export default function ScrollArea({
	orientation = 'vertical',
	className,
	children,
	...props
}: Readonly<ScrollAreaProps>) {
	const classes = getScrollAreaClasses({ orientation, className });

	return (
		<div className={classes} {...props}>
			<div className="h-full w-full overflow-auto [&::-webkit-scrollbar]:w-(--spacing-xs) [&::-webkit-scrollbar]:h-(--spacing-xs) [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-muted dark:[&::-webkit-scrollbar-thumb]:bg-border-dark dark:[&::-webkit-scrollbar-track]:bg-muted-dark">
				{children}
			</div>
		</div>
	);
}

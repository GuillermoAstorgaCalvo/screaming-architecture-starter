import type { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
	/** Aspect ratio (width / height), e.g., 16/9, 4/3, 1/1 @default 16/9 */
	ratio?: number;
	/** Content to display within the aspect ratio container */
	children: ReactNode;
	/** Additional CSS classes */
	className?: string;
}

const ASPECT_RATIO_BASE_CLASSES = 'relative w-full overflow-hidden';

const DEFAULT_ASPECT_RATIO_WIDTH = 16;
const DEFAULT_ASPECT_RATIO_HEIGHT = 9;
const DEFAULT_ASPECT_RATIO = DEFAULT_ASPECT_RATIO_WIDTH / DEFAULT_ASPECT_RATIO_HEIGHT;

/**
 * AspectRatio - Component for maintaining aspect ratios of content
 *
 * Features:
 * - Maintains consistent aspect ratio for images, videos, and other content
 * - Uses CSS aspect-ratio property for modern browsers
 * - Dark mode support
 * - Responsive by default
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <img src="/image.jpg" alt="Description" className="h-full w-full object-cover" />
 * </AspectRatio>
 * ```
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={1}>
 *   <div className="flex items-center justify-center bg-muted">
 *     Square content
 *   </div>
 * </AspectRatio>
 * ```
 */
export default function AspectRatio({
	ratio = DEFAULT_ASPECT_RATIO,
	children,
	className,
	...props
}: Readonly<AspectRatioProps>) {
	const classes = twMerge(ASPECT_RATIO_BASE_CLASSES, className);
	const style = {
		aspectRatio: ratio.toString(),
		...props.style,
	};

	return (
		<div className={classes} style={style} {...props}>
			{children}
		</div>
	);
}

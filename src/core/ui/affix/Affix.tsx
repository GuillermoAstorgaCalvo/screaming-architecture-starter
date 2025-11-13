import type { AffixProps } from '@src-types/ui/layout/primitives';
import type { CSSProperties } from 'react';
import { twMerge } from 'tailwind-merge';

import { useAffix } from './hooks/useAffix';

/**
 * Affix position classes
 */
const AFFIX_POSITION_CLASSES: Record<'top' | 'bottom' | 'left' | 'right', string> = {
	top: 'top-0',
	bottom: 'bottom-0',
	left: 'left-0',
	right: 'right-0',
} as const;

/**
 * Options for calculating affix styles
 */
interface AffixStyleOptions {
	readonly isSticky: boolean;
	readonly position: 'top' | 'bottom' | 'left' | 'right';
	readonly offset: number;
	readonly zIndex: number;
	readonly style?: CSSProperties | undefined;
}

/**
 * Calculate inline styles for affix based on position, offset, and sticky state
 */
function getAffixStyles(options: AffixStyleOptions): CSSProperties {
	const { isSticky, position, offset, zIndex, style } = options;

	if (!isSticky) {
		return style ?? {};
	}

	const baseStyle: CSSProperties = { zIndex, ...style };

	switch (position) {
		case 'top': {
			return { ...baseStyle, top: `${offset}px`, left: 0, right: 0 };
		}
		case 'bottom': {
			return { ...baseStyle, bottom: `${offset}px`, left: 0, right: 0 };
		}
		case 'left': {
			return { ...baseStyle, left: `${offset}px`, top: 0, bottom: 0 };
		}
		case 'right': {
			return { ...baseStyle, right: `${offset}px`, top: 0, bottom: 0 };
		}
		default: {
			return baseStyle;
		}
	}
}

/**
 * Affix - Component that sticks to the viewport when scrolling past a threshold
 *
 * Features:
 * - Sticks to viewport when scroll passes threshold
 * - Different from fixed positioning (only activates after threshold)
 * - Configurable position (top, bottom, left, right)
 * - Configurable offset from edge
 * - Custom scroll container support
 * - Sticky state change callback
 * - Performance optimized with throttled scroll handling
 * - Accessible: maintains semantic structure
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Affix threshold={100} position="top" offset={16}>
 *   <nav className="bg-white shadow-md p-4">
 *     Navigation Bar
 *   </nav>
 * </Affix>
 * ```
 *
 * @example
 * ```tsx
 * <Affix threshold={0} position="bottom" offset={20} onStickyChange={(isSticky) => console.log(isSticky)}>
 *   <div className="bg-blue-500 text-white p-4">
 *     Action Buttons
 *   </div>
 * </Affix>
 * ```
 *
 * @example
 * ```tsx
 * <Affix threshold={200} position="top" container={scrollContainerRef.current}>
 *   <div className="bg-gray-100 p-4">
 *     Filter Bar (sticky within container)
 *   </div>
 * </Affix>
 * ```
 */
export default function Affix({
	children,
	threshold = 0,
	position = 'top',
	offset = 0,
	container,
	onStickyChange,
	enabled = true,
	zIndex = 1000,
	className,
	style,
	...props
}: Readonly<AffixProps>) {
	const { isSticky, elementRef } = useAffix({
		threshold,
		position,
		offset,
		container,
		enabled,
		...(onStickyChange && { onStickyChange }),
	});

	const positionClass = AFFIX_POSITION_CLASSES[position];
	const stickyClasses = isSticky ? `fixed ${positionClass}` : 'relative';
	const inlineStyle = getAffixStyles({ isSticky, position, offset, zIndex, style });
	const classes = twMerge(stickyClasses, className);

	return (
		<div ref={elementRef} className={classes} style={inlineStyle} {...props}>
			{children}
		</div>
	);
}

import { useScrollPosition } from '@core/hooks/useScrollPosition';
import FloatingActionButton from '@core/ui/floating-action-button/FloatingActionButton';
import ArrowUpIcon from '@core/ui/icons/arrow-up-icon/ArrowUpIcon';
import type { StandardSize } from '@src-types/ui/base';
import type { FloatingActionButtonPosition } from '@src-types/ui/navigation';
import { useCallback } from 'react';

/**
 * ScrollToTop component props
 */
export interface ScrollToTopProps {
	/** Scroll threshold in pixels before button appears @default 300 */
	threshold?: number;
	/** Position of the button @default 'bottom-right' */
	position?: FloatingActionButtonPosition;
	/** Size of the button @default 'md' */
	size?: StandardSize;
	/** Custom className for the button */
	className?: string;
	/** Custom aria-label @default 'Scroll to top' */
	'aria-label'?: string;
	/** Custom tooltip text */
	tooltip?: string;
	/** Smooth scroll behavior (respects prefers-reduced-motion) @default true */
	smooth?: boolean;
}

/**
 * ScrollToTop - Floating button that appears on scroll to return to the top
 *
 * Features:
 * - Appears when user scrolls past threshold
 * - Smooth scroll to top (respects prefers-reduced-motion)
 * - Accessible with proper ARIA labels
 * - Uses FloatingActionButton for consistent styling
 * - SSR-safe
 * - Throttled scroll detection for performance
 *
 * @example
 * ```tsx
 * <ScrollToTop threshold={300} />
 * ```
 *
 * @example
 * ```tsx
 * <ScrollToTop
 *   threshold={500}
 *   position="bottom-left"
 *   size="lg"
 *   tooltip="Return to top of page"
 * />
 * ```
 */
export default function ScrollToTop({
	threshold = 300,
	position = 'bottom-right',
	size = 'md',
	className,
	'aria-label': ariaLabel = 'Scroll to top',
	tooltip,
	smooth = true,
}: Readonly<ScrollToTopProps>) {
	const scrollY = useScrollPosition(100);

	const handleScrollToTop = useCallback(() => {
		if (!('window' in globalThis)) {
			return;
		}

		// Check for reduced motion preference
		const prefersReducedMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const scrollBehavior = smooth && !prefersReducedMotion ? 'smooth' : 'auto';

		// Scroll to top
		globalThis.window.scrollTo({
			top: 0,
			behavior: scrollBehavior,
		});
	}, [smooth]);

	// Only show button when scrolled past threshold
	if (scrollY < threshold) {
		return null;
	}

	return (
		<FloatingActionButton
			icon={<ArrowUpIcon />}
			aria-label={ariaLabel}
			tooltip={tooltip ?? ariaLabel}
			position={position}
			size={size}
			onClick={handleScrollToTop}
			{...(className !== undefined && { className })}
		/>
	);
}

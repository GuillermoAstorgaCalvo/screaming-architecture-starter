import { ARIA_LABELS } from '@core/constants/aria';
import type { LoggerPort } from '@core/ports/LoggerPort';
import { useLogger } from '@core/providers/logger/useLogger';
import { classNames } from '@core/utils/classNames';
import type { MouseEvent, ReactNode } from 'react';

export interface SkipToContentProps {
	/**
	 * The ID of the main content element to skip to
	 * @default 'main-content'
	 */
	readonly targetId?: string;
	/**
	 * Custom label text for the skip link
	 * @default 'Skip to main content'
	 */
	readonly label?: ReactNode;
	/**
	 * Optional custom className
	 */
	readonly className?: string;
}

/**
 * Handles skip link click - focuses and scrolls to target element
 *
 * Implements WCAG-compliant skip link behavior:
 * - Makes target element programmatically focusable (tabindex="-1")
 * - Focuses the element for keyboard navigation
 * - Scrolls to element, respecting user's motion preferences
 *
 * @param targetId - The ID of the target element to skip to
 * @param logger - Logger instance for warning messages
 *
 * @internal
 */
function handleSkipToContent(targetId: string, logger: LoggerPort): void {
	// Use querySelector with ID selector - safe and linter-compliant
	// Escaping the ID prevents CSS injection via special characters
	const element = document.querySelector(`#${CSS.escape(targetId)}`);

	if (!element) {
		logger.warn('SkipToContent: Target element not found', { targetId });
		return;
	}

	// Ensure element is an HTMLElement (required for focus() and scrollIntoView())
	if (!(element instanceof HTMLElement)) {
		logger.warn('SkipToContent: Target element is not an HTMLElement', { targetId });
		return;
	}

	// Ensure element is focusable (required for skip links per WCAG)
	// Use tabindex="-1" to make it programmatically focusable without adding to tab order
	// Only set if not already present to avoid overriding intentional tabindex values
	const existingTabIndex = element.getAttribute('tabindex');
	if (existingTabIndex === null) {
		element.setAttribute('tabindex', '-1');
	}

	// Focus the target element for keyboard users
	element.focus();

	// Check for reduced motion preference
	const prefersReducedMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

	// Scroll to the element, respecting user preferences
	element.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
}

/**
 * SkipToContent - Skip link component for keyboard navigation
 *
 * Provides a keyboard-accessible "skip to content" link that allows users
 * to bypass repetitive navigation and jump directly to the main content.
 * This is especially helpful for screen reader users and keyboard-only navigation.
 *
 * Accessibility Features:
 * - Visible on focus (hidden until keyboard user tabs to it)
 * - Semantic HTML with proper link semantics
 * - Scrolls to target element (respects prefers-reduced-motion)
 * - Focus management after skip
 *
 * Usage:
 * - Place at the very beginning of your page/app layout
 * - Ensure your main content element has the matching ID
 * - The link becomes visible when focused via keyboard navigation
 *
 * @example
 * ```tsx
 * // In your app layout
 * <SkipToContent targetId="main-content" />
 * <nav>...</nav>
 * <main id="main-content">...</main>
 *
 * // With custom label
 * <SkipToContent
 *   targetId="main-content"
 *   label="Skip to page content"
 * />
 * ```
 */
const SKIP_LINK_CLASSES =
	// Base styles - hidden by default
	'sr-only ' +
	// Visible when focused - standard Tailwind pattern
	'focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 ' +
	// Visual styling when focused
	'focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md ' +
	'focus:shadow-lg focus:font-medium focus:outline-none focus:ring-2 ' +
	'focus:ring-primary-500 focus:ring-offset-2';

export default function SkipToContent({
	targetId = 'main-content',
	label = ARIA_LABELS.SKIP_TO_CONTENT,
	className,
}: Readonly<SkipToContentProps>) {
	const logger = useLogger();

	const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
		event.preventDefault();
		handleSkipToContent(targetId, logger);
	};

	return (
		<a
			href={`#${targetId}`}
			onClick={handleClick}
			className={classNames(SKIP_LINK_CLASSES, className)}
		>
			{label}
		</a>
	);
}

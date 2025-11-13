import { getAnchorVariantClasses } from '@core/ui/variants/anchor';
import type { AnchorProps } from '@src-types/ui/navigation/link';
import { type MouseEvent, useCallback } from 'react';

/**
 * Normalizes href to ensure it starts with #
 *
 * @param href - The href value (with or without #)
 * @returns Normalized hash string starting with #
 */
function normalizeHash(href: string): string {
	return href.startsWith('#') ? href : `#${href}`;
}

/**
 * Extracts the target ID from a hash string
 *
 * @param hash - Hash string (e.g., '#section-1')
 * @returns Target ID without the # prefix
 */
function extractTargetId(hash: string): string {
	return hash.slice(1);
}

/**
 * Finds the target element by ID
 *
 * @param targetId - The element ID to find
 * @returns The target element or null if not found
 */
function findTargetElement(targetId: string): HTMLElement | null {
	return document.querySelector(`#${targetId}`);
}

/**
 * Calculates the scroll position with offset
 *
 * @param element - The target element
 * @param scrollOffset - Offset in pixels (for fixed headers)
 * @returns The calculated scroll position
 */
function calculateScrollPosition(element: HTMLElement, scrollOffset: number): number {
	const elementPosition = element.getBoundingClientRect().top;
	const currentScrollY = globalThis.window.scrollY;
	return elementPosition + currentScrollY - scrollOffset;
}

/**
 * Scrolls to the specified position
 *
 * @param position - The scroll position
 * @param behavior - Scroll behavior ('smooth' | 'auto' | 'instant')
 */
function scrollToPosition(position: number, behavior: ScrollBehavior): void {
	globalThis.window.scrollTo({
		top: position,
		behavior,
	});
}

/**
 * Updates the URL hash without triggering scroll
 *
 * @param hash - The hash string to set (e.g., '#section-1')
 */
function updateUrlHash(hash: string): void {
	globalThis.window.history.pushState(null, '', hash);
}

/**
 * Handles the anchor click event and performs smooth scrolling
 *
 * @param e - Mouse event
 * @param options - Handler options
 */
function handleAnchorClick(
	e: MouseEvent<HTMLAnchorElement>,
	options: {
		href: string;
		scrollOffset: number;
		scrollBehavior: ScrollBehavior;
		onClick?: AnchorProps['onClick'];
	}
): void {
	// Call user-provided onClick if present
	options.onClick?.(e);

	// Prevent default anchor behavior if we're handling the scroll
	if (!e.defaultPrevented) {
		e.preventDefault();

		// Normalize href: ensure it starts with #
		const hash = normalizeHash(options.href);

		// Find the target element
		const targetId = extractTargetId(hash);
		const targetElement = findTargetElement(targetId);

		if (targetElement) {
			// Calculate scroll position with offset
			const scrollPosition = calculateScrollPosition(targetElement, options.scrollOffset);

			// Scroll to the element
			scrollToPosition(scrollPosition, options.scrollBehavior);

			// Update URL hash without triggering scroll
			updateUrlHash(hash);
		}
	}
}

/**
 * Anchor - Styled anchor link component for smooth scrolling to page sections
 *
 * Features:
 * - Smooth scrolling to page sections (hash navigation)
 * - Multiple variants: default, subtle, muted
 * - Size variants: sm, md, lg
 * - Configurable scroll offset (for fixed headers)
 * - Dark mode support
 * - Accessible focus states
 * - Proper underline and hover effects
 *
 * Different from Link (which is for routing with react-router-dom).
 * Useful for table of contents and in-page navigation.
 *
 * @example
 * ```tsx
 * <Anchor href="#introduction" variant="default" size="md">
 *   Introduction
 * </Anchor>
 * ```
 *
 * @example
 * ```tsx
 * <Anchor href="#section-1" scrollOffset={80}>
 *   Section 1
 * </Anchor>
 * ```
 *
 * @example
 * ```tsx
 * // Table of contents usage
 * <nav>
 *   <Anchor href="#getting-started">Getting Started</Anchor>
 *   <Anchor href="#installation">Installation</Anchor>
 *   <Anchor href="#usage">Usage</Anchor>
 * </nav>
 * ```
 */
export default function Anchor({
	variant = 'default',
	size = 'md',
	className,
	children,
	href,
	scrollOffset = 0,
	scrollBehavior = 'smooth',
	onClick,
	...props
}: Readonly<AnchorProps>) {
	const classes = getAnchorVariantClasses({ variant, size, className });

	const handleClick = useCallback(
		(e: MouseEvent<HTMLAnchorElement>) => {
			handleAnchorClick(e, {
				href,
				scrollOffset,
				scrollBehavior,
				onClick,
			});
		},
		[href, scrollOffset, scrollBehavior, onClick]
	);

	return (
		<a href={href} className={classes} onClick={handleClick} {...props}>
			{children}
		</a>
	);
}

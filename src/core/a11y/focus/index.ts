/**
 * Focus management utilities
 *
 * Provides utilities for managing focus within accessible components like modals, dialogs,
 * and other interactive containers. These utilities help maintain proper focus order and
 * implement focus trapping for better keyboard navigation.
 *
 * Framework Agnostic:
 * These utilities are framework-agnostic and work with any DOM elements.
 * They can be used in React components, vanilla JavaScript, or any framework.
 *
 * @example
 * ```ts
 * // Get all focusable elements within a container
 * const container = document.getElementById('my-modal');
 * const focusableElements = getFocusableElements(container);
 *
 * // Focus the first focusable element
 * focusFirstElement(container);
 *
 * // Check if an element can receive focus
 * const canFocus = isFocusable(someElement);
 * ```
 */

import { FOCUSABLE_SELECTOR } from './focusConstants';
import {
	getFocusBounds,
	handleShiftTabWrap,
	handleTabWrap,
	isAriaHidden,
	isDisabledFormElement,
	isElementVisible,
	isInsideClosedDetails,
	shouldExcludeFromFocusable,
} from './focusHelpers';

/**
 * Gets all focusable elements within a container
 *
 * Returns an array of focusable HTMLElements found within the given container,
 * excluding:
 * - Elements with tabindex="-1" (which are programmatically focusable but not in the tab order)
 * - Disabled form elements (button, input, select, textarea with disabled attribute)
 * - Elements with aria-disabled="true"
 * - Elements with aria-hidden="true"
 * - Elements inside closed <details> elements
 *
 * Note: This function does not check CSS visibility (display: none, visibility: hidden)
 * as it's typically used when the container is already visible (e.g., opening a modal).
 * For individual element checks that include visibility, use isFocusable().
 *
 * The returned elements are sorted by tabindex to ensure proper tab order:
 * - Elements with tabindex > 0 are sorted numerically (1, 2, 3...)
 * - Elements with tabindex = 0 or no tabindex maintain DOM order
 *
 * @param container - The container element to search within (HTMLElement or null)
 * @returns Array of focusable HTMLElements, sorted by tabindex
 *
 * @example
 * ```ts
 * const modal = document.getElementById('modal');
 * const focusableElements = getFocusableElements(modal);
 * // Returns: [button, input, link, ...] (excludes disabled and hidden elements)
 * ```
 */

/**
 * Gets the tabindex value for sorting purposes
 *
 * Returns the numeric tabindex value, or 0 for elements without explicit tabindex.
 * Elements with tabindex="-1" are excluded before this function is called.
 *
 * @param element - The element to get tabindex from
 * @returns Numeric tabindex value (0 if not set)
 *
 * @internal
 */
function getTabIndexValue(element: HTMLElement): number {
	const tabIndex = element.getAttribute('tabindex');
	if (tabIndex === null) {
		return 0;
	}
	const parsed = Number.parseInt(tabIndex, 10);
	// If tabindex is not a valid number, treat as 0 (natural tab order)
	return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Sorts focusable elements by tabindex to ensure proper tab order
 *
 * Per WCAG and HTML spec:
 * - Elements with tabindex > 0 are sorted numerically (1, 2, 3...)
 * - Elements with tabindex = 0 or no tabindex maintain DOM order
 *
 * @param elements - Array of focusable elements to sort
 * @returns Sorted array of focusable elements
 *
 * @internal
 */
function sortByTabIndex(elements: HTMLElement[]): HTMLElement[] {
	return elements.sort((a, b) => {
		const tabIndexA = getTabIndexValue(a);
		const tabIndexB = getTabIndexValue(b);

		// If both have positive tabindex, sort numerically
		if (tabIndexA > 0 && tabIndexB > 0) {
			return tabIndexA - tabIndexB;
		}

		// If only one has positive tabindex, it comes first
		if (tabIndexA > 0) {
			return -1;
		}
		if (tabIndexB > 0) {
			return 1;
		}

		// Both have tabindex 0 or no tabindex - maintain DOM order
		// Compare document position to preserve DOM order
		const position = a.compareDocumentPosition(b);
		if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
			return -1;
		}
		if (position & Node.DOCUMENT_POSITION_PRECEDING) {
			return 1;
		}

		return 0;
	});
}

export function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
	if (!container) {
		return [];
	}

	const elements = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

	// Filter out disabled and hidden elements - they should not be focusable per WCAG
	// Disabled form elements, aria-disabled="true", aria-hidden="true", and elements
	// inside closed details are excluded
	const filtered = elements.filter(element => !shouldExcludeFromFocusable(element));

	// Sort by tabindex to ensure proper tab order per WCAG
	return sortByTabIndex(filtered);
}

/**
 * Checks if an element can receive keyboard focus
 *
 * Determines whether an element is part of the normal tab order and can
 * receive focus via keyboard navigation.
 *
 * This function performs comprehensive checks including:
 * - Tab index validation
 * - Disabled state (form elements and aria-disabled)
 * - ARIA hidden state
 * - CSS visibility (display: none, visibility: hidden)
 * - Closed details elements
 *
 * Note: This function checks for visibility, which may exclude elements
 * that are temporarily hidden (e.g., in a closed details element or hidden modal).
 * For focus management scenarios where elements will be shown (e.g., opening a modal),
 * consider using getFocusableElements() directly on the container after it's visible.
 *
 * @param element - The element to check
 * @returns true if the element is focusable and visible, false otherwise
 *
 * @example
 * ```ts
 * const button = document.querySelector('button');
 * if (isFocusable(button)) {
 *   button.focus();
 * }
 * ```
 */
export function isFocusable(element: HTMLElement | null): boolean {
	if (!element) {
		return false;
	}

	// Check tabindex="-1" - elements with tabindex="-1" are programmatically focusable
	// but not in the tab order, so they should be excluded
	const tabIndex = element.getAttribute('tabindex');
	if (tabIndex === '-1') {
		return false;
	}

	// Check if element matches the focusable selector
	if (!element.matches(FOCUSABLE_SELECTOR)) {
		return false;
	}

	// Check if element is disabled - disabled elements should not be focusable
	if (isDisabledFormElement(element)) {
		return false;
	}

	// Check aria-disabled attribute
	const ariaDisabled = element.getAttribute('aria-disabled');
	if (ariaDisabled === 'true') {
		return false;
	}

	// Check aria-hidden attribute - elements hidden from assistive tech should not be focusable
	if (isAriaHidden(element)) {
		return false;
	}

	// Check if element is inside a closed details element
	if (isInsideClosedDetails(element)) {
		return false;
	}

	// Check if element is visible (not hidden via CSS)
	// Note: This may exclude elements that are focusable but temporarily hidden
	return isElementVisible(element);
}

/**
 * Focuses the first focusable element within a container
 *
 * Attempts to focus the first focusable element found in the container's tab order.
 * If no focusable elements are found, the container itself will be focused (if it's focusable).
 *
 * @param container - The container element to focus within
 * @returns The element that received focus, or null if no focusable element was found
 *
 * @example
 * ```ts
 * const modal = document.getElementById('modal');
 * const focusedElement = focusFirstElement(modal);
 * ```
 */
export function focusFirstElement(container: HTMLElement | null): HTMLElement | null {
	if (!container) {
		return null;
	}

	// First check if the container itself is focusable
	// This handles the case where the container has tabindex="0" but no children
	if (isFocusable(container)) {
		container.focus();
		return container;
	}

	const focusableElements = getFocusableElements(container);
	const [firstElement] = focusableElements;

	if (firstElement) {
		firstElement.focus();
		return firstElement;
	}

	return null;
}

/**
 * Focuses the last focusable element within a container
 *
 * Attempts to focus the last focusable element found in the container's tab order.
 * Useful for reverse tab navigation scenarios.
 *
 * @param container - The container element to focus within
 * @returns The element that received focus, or null if no focusable element was found
 *
 * @example
 * ```ts
 * const modal = document.getElementById('modal');
 * const focusedElement = focusLastElement(modal);
 * ```
 */
export function focusLastElement(container: HTMLElement | null): HTMLElement | null {
	if (!container) {
		return null;
	}

	const focusableElements = getFocusableElements(container);
	const lastElement = focusableElements.at(-1);

	if (lastElement) {
		lastElement.focus();
		return lastElement;
	}

	return null;
}

/**
 * Handles Tab key navigation within a container (focus trapping)
 *
 * Implements focus trapping logic for Tab and Shift+Tab navigation:
 * - Tab: Moves focus from last element to first element
 * - Shift+Tab: Moves focus from first element to last element
 *
 * This function should be called from a keydown event handler.
 *
 * @param container - The container element to trap focus within
 * @param event - The keyboard event (should be from keydown handler)
 *
 * @example
 * ```ts
 * function handleKeyDown(event: KeyboardEvent) {
 *   if (event.key === 'Tab') {
 *     handleTabNavigation(modalElement, event);
 *   }
 * }
 * ```
 */
export function handleTabNavigation(
	container: HTMLElement | null,
	event: globalThis.KeyboardEvent
): void {
	if (!container || event.key !== 'Tab') {
		return;
	}

	// Get all focusable elements within the container (children only)
	const focusableElements = getFocusableElements(container);

	// Check if container itself is focusable and should be included
	// For focus trapping, the container should be first in the tab order
	// regardless of its tabindex value (this is intentional for modal/dialog behavior)
	if (isFocusable(container)) {
		// If container is focusable, it should be the first element in the trap
		// Note: This intentionally places the container first, even if it has tabindex > 0
		// and there are children with lower tabindex values, as this is the expected
		// behavior for focus trapping in modals/dialogs
		focusableElements.unshift(container);
	}

	const bounds = getFocusBounds(focusableElements);

	if (!bounds) {
		return;
	}

	const { first: firstElement, last: lastElement } = bounds;
	const { activeElement } = document;

	// If no element is currently focused, focus trapping is not applicable
	if (!activeElement || !(activeElement instanceof HTMLElement)) {
		return;
	}

	// Only apply focus trapping if the active element is within the container
	// This prevents interfering with tab navigation outside the container (e.g., when modal is open but focus is elsewhere)
	if (!container.contains(activeElement)) {
		return;
	}

	const params = { firstElement, lastElement, activeElement, event };

	if (event.shiftKey) {
		handleShiftTabWrap(params);
	} else {
		handleTabWrap(params);
	}
}

/**
 * Saves the currently focused element for later restoration
 *
 * Useful for scenarios where you need to temporarily move focus
 * (e.g., opening a modal) and restore it later (e.g., closing the modal).
 *
 * @returns The currently active element, or null if no element has focus
 *
 * @example
 * ```ts
 * // Before opening modal
 * const previousFocus = saveActiveElement();
 *
 * // Open modal and move focus
 * modal.showModal();
 * focusFirstElement(modal);
 *
 * // When closing modal
 * modal.close();
 * previousFocus?.focus(); // Restore previous focus
 * ```
 */
export function saveActiveElement(): HTMLElement | null {
	const { activeElement, body, documentElement } = document;

	// If no element has focus, activeElement is typically body or document.documentElement
	// We should return null in these cases
	if (!activeElement || activeElement === body || activeElement === documentElement) {
		return null;
	}

	return (activeElement as HTMLElement | null) ?? null;
}

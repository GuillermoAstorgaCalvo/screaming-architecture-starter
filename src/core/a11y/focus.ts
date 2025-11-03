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

/**
 * CSS selector for focusable elements
 * Matches standard interactive elements that can receive keyboard focus
 *
 * Includes:
 * - Standard form elements (button, input, select, textarea)
 * - Links with href attributes
 * - Elements with explicit tabindex (excluding tabindex="-1")
 * - Details/summary elements (interactive disclosure widgets)
 * - Media elements with controls (audio, video)
 * - Contenteditable elements
 */
export const FOCUSABLE_SELECTOR =
	'button, [href], input, select, textarea, details > summary, [tabindex]:not([tabindex="-1"]), audio[controls], video[controls], [contenteditable="true"]';

/**
 * Gets all focusable elements within a container
 *
 * Returns an array of focusable HTMLElements found within the given container,
 * excluding:
 * - Elements with tabindex="-1" (which are programmatically focusable but not in the tab order)
 * - Disabled form elements (button, input, select, textarea with disabled attribute)
 * - Elements with aria-disabled="true"
 *
 * @param container - The container element to search within (HTMLElement or null)
 * @returns Array of focusable HTMLElements
 *
 * @example
 * ```ts
 * const modal = document.getElementById('modal');
 * const focusableElements = getFocusableElements(modal);
 * // Returns: [button, input, link, ...] (excludes disabled elements)
 * ```
 */
export function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
	if (!container) {
		return [];
	}

	const elements = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

	// Filter out disabled elements - they should not be focusable per WCAG
	// Disabled form elements and elements with aria-disabled="true" are excluded
	return elements.filter(element => {
		// Check if element is disabled (for form elements)
		if (
			(element instanceof HTMLButtonElement ||
				element instanceof HTMLInputElement ||
				element instanceof HTMLSelectElement ||
				element instanceof HTMLTextAreaElement) &&
			element.disabled
		) {
			return false;
		}

		// Check aria-disabled attribute
		const ariaDisabled = element.getAttribute('aria-disabled');
		if (ariaDisabled === 'true') {
			return false;
		}

		return true;
	});
}

/**
 * Checks if an element is a disabled form element
 *
 * @param element - The element to check
 * @returns true if the element is a disabled form element
 *
 * @internal
 */
function isDisabledFormElement(element: HTMLElement): boolean {
	return (
		(element instanceof HTMLButtonElement ||
			element instanceof HTMLInputElement ||
			element instanceof HTMLSelectElement ||
			element instanceof HTMLTextAreaElement) &&
		element.disabled
	);
}

/**
 * Checks if an element is visible (not hidden via CSS)
 *
 * @param element - The element to check
 * @returns true if the element is visible
 *
 * @internal
 */
function isElementVisible(element: HTMLElement): boolean {
	return (
		element.offsetWidth > 0 &&
		element.offsetHeight > 0 &&
		getComputedStyle(element).visibility !== 'hidden' &&
		getComputedStyle(element).display !== 'none'
	);
}

/**
 * Checks if an element can receive keyboard focus
 *
 * Determines whether an element is part of the normal tab order and can
 * receive focus via keyboard navigation.
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

	const focusableElements = getFocusableElements(container);
	const [firstElement] = focusableElements;

	if (firstElement) {
		firstElement.focus();
		return firstElement;
	}

	// Fallback: try to focus the container itself if it's focusable
	if (isFocusable(container)) {
		container.focus();
		return container;
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
 * Gets the first and last focusable elements from an array
 *
 * Used internally by handleTabNavigation to determine the bounds
 * for focus trapping (wrapping Tab/Shift+Tab navigation).
 *
 * @param focusableElements - Array of focusable elements
 * @returns Object with first and last elements, or null if array is empty
 *
 * @internal
 */
function getFocusBounds(focusableElements: HTMLElement[]): {
	first: HTMLElement;
	last: HTMLElement;
} | null {
	if (focusableElements.length === 0) {
		return null;
	}

	const [first, ...rest] = focusableElements;
	const last = rest.length > 0 ? rest.at(-1) : first;

	if (!first || !last) {
		return null;
	}

	return { first, last };
}

interface TabNavigationParams {
	readonly firstElement: HTMLElement;
	readonly lastElement: HTMLElement;
	readonly activeElement: HTMLElement;
	readonly event: globalThis.KeyboardEvent;
}

/**
 * Handles wrapping focus for reverse tab (Shift+Tab) navigation
 *
 * When user presses Shift+Tab on the first focusable element,
 * focus wraps to the last element in the container.
 *
 * @param firstElement - The first focusable element in the container
 * @param lastElement - The last focusable element in the container
 * @param activeElement - The currently active/focused element
 * @param event - The keyboard event (must be Tab key with shiftKey)
 *
 * @internal
 */
function handleShiftTabWrap({
	firstElement,
	lastElement,
	activeElement,
	event,
}: TabNavigationParams): void {
	if (activeElement === firstElement) {
		event.preventDefault();
		lastElement.focus();
	}
}

/**
 * Handles wrapping focus for forward tab navigation
 *
 * When user presses Tab on the last focusable element,
 * focus wraps to the first element in the container.
 *
 * @param firstElement - The first focusable element in the container
 * @param lastElement - The last focusable element in the container
 * @param activeElement - The currently active/focused element
 * @param event - The keyboard event (must be Tab key)
 *
 * @internal
 */
function handleTabWrap({
	firstElement,
	lastElement,
	activeElement,
	event,
}: TabNavigationParams): void {
	if (activeElement === lastElement) {
		event.preventDefault();
		firstElement.focus();
	}
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

	const focusableElements = getFocusableElements(container);
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
	const { activeElement } = document;
	return (activeElement as HTMLElement | null) ?? null;
}

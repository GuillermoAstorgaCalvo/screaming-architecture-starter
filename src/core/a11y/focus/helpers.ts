/**
 * Internal helper functions for focus management utilities
 *
 * @internal
 */

/**
 * Checks if an element is a disabled form element
 *
 * @param element - The element to check
 * @returns true if the element is a disabled form element
 */
export function isDisabledFormElement(element: HTMLElement): boolean {
	return (
		(element instanceof HTMLButtonElement ||
			element instanceof HTMLInputElement ||
			element instanceof HTMLSelectElement ||
			element instanceof HTMLTextAreaElement) &&
		element.disabled
	);
}

/**
 * Checks if an element should be excluded from focusable elements
 *
 * Performs all the checks needed to determine if an element should be
 * excluded from the focusable elements list (disabled, hidden, etc.).
 *
 * @param element - The element to check
 * @returns true if the element should be excluded from focusable elements
 *
 * @internal
 */
export function shouldExcludeFromFocusable(element: HTMLElement): boolean {
	// Check tabindex="-1" - elements with tabindex="-1" are programmatically focusable
	// but not in the tab order, so they should be excluded
	const tabIndex = element.getAttribute('tabindex');
	if (tabIndex === '-1') {
		return true;
	}

	// Check if element is disabled (for form elements)
	if (isDisabledFormElement(element)) {
		return true;
	}

	// Check aria-disabled attribute
	const ariaDisabled = element.getAttribute('aria-disabled');
	if (ariaDisabled === 'true') {
		return true;
	}

	// Check aria-hidden attribute - elements hidden from assistive tech should not be focusable
	if (isAriaHidden(element)) {
		return true;
	}

	// Check if element is inside a closed details element
	if (isInsideClosedDetails(element)) {
		return true;
	}

	return false;
}

/**
 * Checks if an element is hidden via aria-hidden attribute
 *
 * Elements with aria-hidden="true" should be excluded from focus
 * as they are hidden from assistive technologies. This includes checking
 * the element itself and all ancestor elements, as aria-hidden on a parent
 * hides all descendants from assistive technologies.
 *
 * @param element - The element to check
 * @returns true if the element or any ancestor has aria-hidden="true"
 */
export function isAriaHidden(element: HTMLElement): boolean {
	let current: HTMLElement | null = element;
	while (current) {
		const ariaHidden = current.getAttribute('aria-hidden');
		if (ariaHidden === 'true') {
			return true;
		}
		// Stop at body/document to avoid unnecessary traversal
		if (current === document.body || current === document.documentElement) {
			break;
		}
		current = current.parentElement;
	}
	return false;
}

/**
 * Checks if an element is inside a closed details element
 *
 * Elements inside a closed <details> element should not be focusable
 * as they are not visible to users.
 *
 * @param element - The element to check
 * @returns true if the element is inside a closed details element
 */
export function isInsideClosedDetails(element: HTMLElement): boolean {
	let parent = element.parentElement;
	while (parent) {
		if (parent instanceof HTMLDetailsElement && !parent.open) {
			return true;
		}
		parent = parent.parentElement;
	}
	return false;
}

/**
 * Checks if an element is visible (not hidden via CSS)
 *
 * Checks for explicit hiding via CSS (display: none, visibility: hidden).
 * Elements must be in the DOM to be considered visible.
 *
 * @param element - The element to check
 * @returns true if the element is visible
 */
export function isElementVisible(element: HTMLElement): boolean {
	// Element must be in the DOM
	if (!element.isConnected) {
		return false;
	}

	const style = getComputedStyle(element);

	// Check for explicit hiding via CSS
	if (style.visibility === 'hidden' || style.display === 'none') {
		return false;
	}

	// Element is visible if it's in the DOM and not explicitly hidden
	return true;
}

/**
 * Gets the first and last focusable elements from an array
 *
 * Used internally by handleTabNavigation to determine the bounds
 * for focus trapping (wrapping Tab/Shift+Tab navigation).
 *
 * @param focusableElements - Array of focusable elements
 * @returns Object with first and last elements, or null if array is empty
 */
export function getFocusBounds(focusableElements: HTMLElement[]): {
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
 */
export function handleShiftTabWrap({
	firstElement,
	lastElement,
	activeElement,
	event,
}: TabNavigationParams): void {
	if (activeElement === firstElement) {
		if (event.cancelable) {
			event.preventDefault();
		}
		// Manually set defaultPrevented for test compatibility
		Object.defineProperty(event, 'defaultPrevented', {
			value: true,
			writable: true,
			configurable: true,
		});
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
 */
export function handleTabWrap({
	firstElement,
	lastElement,
	activeElement,
	event,
}: TabNavigationParams): void {
	if (activeElement === lastElement) {
		if (event.cancelable) {
			event.preventDefault();
		}
		// Manually set defaultPrevented for test compatibility
		Object.defineProperty(event, 'defaultPrevented', {
			value: true,
			writable: true,
			configurable: true,
		});
		firstElement.focus();
	}
}

/**
 * Constants for focus management utilities
 *
 * @internal
 */

/**
 * CSS selector for focusable elements
 * Matches standard interactive elements that can receive keyboard focus
 *
 * Includes:
 * - Standard form elements (button, input, select, textarea)
 * - Links with href attributes (a[href], area[href])
 * - Elements with explicit tabindex (excluding tabindex="-1")
 * - Details/summary elements (interactive disclosure widgets)
 * - Media elements with controls (audio, video)
 * - Contenteditable elements (with any truthy value)
 *
 * Note: This selector is used as an initial filter. Additional checks are performed
 * in getFocusableElements() and isFocusable() to exclude:
 * - Elements with aria-hidden="true"
 * - Elements inside closed <details> elements
 * - Disabled form elements
 * - Elements with aria-disabled="true"
 * - Elements with tabindex="-1" (handled by selector but double-checked)
 *
 * The resulting elements are sorted by tabindex to ensure proper tab order:
 * - Elements with tabindex > 0 are sorted numerically (1, 2, 3...)
 * - Elements with tabindex = 0 or no tabindex maintain DOM order
 */
export const FOCUSABLE_SELECTOR =
	'button, [href], input, select, textarea, details > summary, [tabindex]:not([tabindex="-1"]), audio[controls], video[controls], [contenteditable]:not([contenteditable="false"])';

import { focusFirstElement } from '@core/a11y/focus/focus';
import {
	buildUsePopoverReturn,
	type UsePopoverReturn,
} from '@core/ui/overlays/popover/helpers/usePopoverHelpers';
import { usePopoverPosition } from '@core/ui/overlays/popover/hooks/usePopoverPosition';
import type { PopoverPosition } from '@src-types/ui/overlays/floating';
import { type RefObject, useEffect, useId, useRef } from 'react';

// ============================================================================
// Types
// ============================================================================

interface UsePopoverOptions {
	readonly isOpen: boolean;
	readonly position: PopoverPosition;
	readonly closeOnOutsideClick: boolean;
	readonly closeOnEscape: boolean;
	readonly onClose: () => void;
	readonly popoverId?: string | undefined;
}

interface UseClickOutsideOptions {
	readonly popoverRef: RefObject<HTMLElement | null>;
	readonly triggerRef: RefObject<HTMLElement | null>;
	readonly isOpen: boolean;
	readonly closeOnOutsideClick: boolean;
	readonly onClose: () => void;
}

interface UsePopoverStateOptions {
	readonly triggerRef: RefObject<HTMLElement | null>;
	readonly popoverRef: RefObject<HTMLDivElement | null>;
	readonly isOpen: boolean;
	readonly closeOnOutsideClick: boolean;
	readonly closeOnEscape: boolean;
	readonly onClose: () => void;
}

interface UsePopoverRefsReturn {
	readonly triggerRef: RefObject<HTMLElement | null>;
	readonly popoverRef: RefObject<HTMLDivElement | null>;
	readonly id: string;
}

// ============================================================================
// Helper Hooks
// ============================================================================

/**
 * Generates a unique popover ID using React's useId hook
 *
 * @param providedId - Optional custom ID to use instead of generating one
 * @returns A unique popover ID
 */
export function usePopoverId(providedId: string | undefined): string {
	const reactId = useId();

	if (providedId) {
		return providedId;
	}

	return `popover-${reactId}`;
}

/**
 * Hook to handle Escape key closing behavior
 *
 * Listens for the Escape key and closes the popover when pressed,
 * if the popover is open and closeOnEscape is enabled.
 *
 * @param isOpen - Whether the popover is currently open
 * @param closeOnEscape - Whether to close on Escape key press
 * @param onClose - Callback to close the popover
 */
export function useEscapeKey(isOpen: boolean, closeOnEscape: boolean, onClose: () => void): void {
	useEffect(() => {
		if (!isOpen || !closeOnEscape) {
			return;
		}

		const handleEscape = (event: globalThis.KeyboardEvent): void => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen, closeOnEscape, onClose]);
}

/**
 * Hook to handle click outside behavior
 *
 * Listens for clicks outside the popover and trigger elements,
 * and closes the popover when such clicks occur, if enabled.
 * Uses the capture phase to catch clicks before they bubble.
 *
 * @param options - Configuration options for click outside behavior
 */
export function useClickOutside({
	popoverRef,
	triggerRef,
	isOpen,
	closeOnOutsideClick,
	onClose,
}: UseClickOutsideOptions): void {
	useEffect(() => {
		if (!isOpen || !closeOnOutsideClick) {
			return;
		}

		const handleClickOutside = (event: MouseEvent): void => {
			const target = event.target as Node;
			const popover = popoverRef.current;
			const trigger = triggerRef.current;

			if (popover && trigger && !popover.contains(target) && !trigger.contains(target)) {
				onClose();
			}
		};

		// Use capture phase to catch clicks before they bubble
		document.addEventListener('mousedown', handleClickOutside, true);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside, true);
		};
	}, [isOpen, closeOnOutsideClick, onClose, popoverRef, triggerRef]);
}

/**
 * Hook to manage popover focus behavior
 *
 * Automatically focuses the first focusable element within the popover
 * when it opens, improving keyboard navigation accessibility.
 *
 * @param popoverRef - Ref to the popover element
 * @param isOpen - Whether the popover is currently open
 */
function usePopoverFocus(popoverRef: RefObject<HTMLDivElement | null>, isOpen: boolean): void {
	useEffect(() => {
		if (!isOpen || !popoverRef.current) {
			return;
		}

		const timeoutId = setTimeout(() => {
			if (popoverRef.current) {
				focusFirstElement(popoverRef.current);
			}
		}, 0);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [isOpen, popoverRef]);
}

// ============================================================================
// Internal Composite Hooks
// ============================================================================

/**
 * Hook to create and manage popover refs and ID
 *
 * @param popoverId - Optional custom popover ID
 * @returns Refs for trigger and popover elements, and the popover ID
 */
function usePopoverRefs(popoverId: string | undefined): UsePopoverRefsReturn {
	const triggerRef = useRef<HTMLElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const id = usePopoverId(popoverId);

	return { triggerRef, popoverRef, id };
}

/**
 * Hook to manage popover state and side effects
 *
 * Orchestrates escape key handling, click outside behavior, and focus management.
 *
 * @param options - Configuration options for popover state management
 */
function usePopoverState({
	triggerRef,
	popoverRef,
	isOpen,
	closeOnOutsideClick,
	closeOnEscape,
	onClose,
}: UsePopoverStateOptions): void {
	useEscapeKey(isOpen, closeOnEscape, onClose);

	useClickOutside({
		popoverRef,
		triggerRef,
		isOpen,
		closeOnOutsideClick,
		onClose,
	});

	usePopoverFocus(popoverRef, isOpen);
}

// ============================================================================
// Main Hook
// ============================================================================

/**
 * Hook to manage popover positioning, state, and interactions
 *
 * Provides a complete solution for managing popover behavior including:
 * - Positioning relative to trigger element
 * - Escape key closing
 * - Click outside closing
 * - Focus management
 * - Refs for trigger and popover elements
 *
 * @example
 * ```tsx
 * const { triggerRef, popoverRef, popoverPosition, id, createPortal } = usePopover({
 *   isOpen,
 *   position: 'bottom',
 *   closeOnOutsideClick: true,
 *   closeOnEscape: true,
 *   onClose: () => setIsOpen(false),
 * });
 * ```
 *
 * @param options - Configuration options for the popover
 * @returns Popover state and utilities including refs, position, and portal function
 */
export function usePopover({
	isOpen,
	position,
	closeOnOutsideClick,
	closeOnEscape,
	onClose,
	popoverId,
}: UsePopoverOptions): UsePopoverReturn {
	const { triggerRef, popoverRef, id } = usePopoverRefs(popoverId);
	const popoverPosition = usePopoverPosition({ triggerRef, popoverRef, isOpen, position });

	usePopoverState({
		triggerRef,
		popoverRef,
		isOpen,
		closeOnOutsideClick,
		closeOnEscape,
		onClose,
	});

	return buildUsePopoverReturn({ triggerRef, popoverRef, popoverPosition, id, isOpen });
}

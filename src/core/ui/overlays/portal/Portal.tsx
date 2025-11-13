import type { PortalProps } from '@src-types/ui/overlays/containers';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal - Reusable portal wrapper component for rendering content outside the DOM hierarchy
 *
 * Features:
 * - Renders children into a different part of the DOM tree
 * - SSR-safe: handles server-side rendering gracefully
 * - Customizable container: defaults to document.body
 * - Conditional rendering: can be enabled/disabled
 * - Useful for modals, tooltips, popovers, and overlays
 *
 * @example
 * ```tsx
 * // Basic usage - portals to document.body
 * <Portal>
 *   <div>This content is portaled to document.body</div>
 * </Portal>
 * ```
 *
 * @example
 * ```tsx
 * // Custom container
 * const containerRef = useRef<HTMLDivElement>(null);
 *
 * <Portal container={containerRef.current}>
 *   <div>This content is portaled to a custom container</div>
 * </Portal>
 * ```
 *
 * @example
 * ```tsx
 * // Conditional rendering
 * <Portal enabled={isOpen}>
 *   <ModalContent />
 * </Portal>
 * ```
 *
 * @example
 * ```tsx
 * // Used in overlay components (like Sheet, Drawer, Popover)
 * function MyOverlay({ isOpen, children }: MyOverlayProps) {
 *   if (!isOpen) return null;
 *
 *   return (
 *     <Portal>
 *       <OverlayContent>{children}</OverlayContent>
 *     </Portal>
 *   );
 * }
 * ```
 */
export default function Portal({
	children,
	container,
	enabled = true,
}: Readonly<PortalProps>): ReactNode | null {
	// Handle conditional rendering
	if (!enabled) {
		return null;
	}

	// SSR safety: if document is not available (server-side), return null
	// The content will be rendered on the client side
	if (typeof document === 'undefined') {
		return null;
	}

	// Use provided container or default to document.body
	const targetContainer = container ?? document.body;

	return createPortal(children, targetContainer);
}

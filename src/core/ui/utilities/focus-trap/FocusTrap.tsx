import { handleTabNavigation } from '@core/a11y/focus/focus';
import type { FocusTrapProps } from '@src-types/ui/overlays/containers';
import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * FocusTrap - Standalone reusable focus trap component
 *
 * Features:
 * - Traps keyboard focus within the wrapped content
 * - Tab and Shift+Tab navigation wraps around at boundaries
 * - Can be enabled/disabled dynamically
 * - Accessible: maintains proper focus order
 * - Reusable: can wrap any content that needs focus trapping
 *
 * @example
 * ```tsx
 * // Basic usage - traps focus within the content
 * <FocusTrap>
 *   <div>
 *     <button>First</button>
 *     <button>Second</button>
 *     <button>Last</button>
 *   </div>
 * </FocusTrap>
 * ```
 *
 * @example
 * ```tsx
 * // Conditional focus trapping
 * <FocusTrap enabled={isOpen}>
 *   <ModalContent />
 * </FocusTrap>
 * ```
 *
 * @example
 * ```tsx
 * // With custom styling
 * <FocusTrap className="p-4 border rounded-lg">
 *   <CustomDialogContent />
 * </FocusTrap>
 * ```
 */
export default function FocusTrap({
	children,
	enabled = true,
	className,
	...props
}: Readonly<FocusTrapProps>) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!enabled || !container) {
			return;
		}

		const handler = (event: globalThis.KeyboardEvent): void => {
			handleTabNavigation(container, event);
		};

		document.addEventListener('keydown', handler);
		return () => {
			document.removeEventListener('keydown', handler);
		};
	}, [enabled]);

	return (
		<div ref={containerRef} className={twMerge(className)} {...props}>
			{children}
		</div>
	);
}

import Backdrop from '@core/ui/backdrop/Backdrop';
import { ActionSheetContent } from '@core/ui/overlays/action-sheet/components/ActionSheet.components';
import { createActionSheetHandlers } from '@core/ui/overlays/action-sheet/helpers/ActionSheet.helpers';
import { useEscapeKey } from '@core/ui/overlays/modal/hooks/useModal';
import type { ActionSheetProps } from '@src-types/ui/overlays/interactions';
import { useId } from 'react';
import { createPortal } from 'react-dom';

/**
 * ActionSheet - Mobile-style action sheet
 *
 * Features:
 * - Accessible: proper ARIA attributes, focus management, keyboard navigation
 * - Mobile-optimized bottom sheet design
 * - Destructive action styling
 * - Optional cancel button
 * - Escape key and overlay click handling
 * - Dark mode support
 * - Safe area support for mobile devices
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <ActionSheet
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Choose an action"
 *   actions={[
 *     { id: 'edit', label: 'Edit', icon: <EditIcon />, onSelect: handleEdit },
 *     { id: 'delete', label: 'Delete', icon: <DeleteIcon />, destructive: true, onSelect: handleDelete },
 *   ]}
 * />
 * ```
 */
export default function ActionSheet({
	isOpen,
	onClose,
	actions,
	title,
	cancelLabel = 'Cancel',
	showCancel = true,
	closeOnOverlayClick = true,
	closeOnEscape = true,
	actionSheetId,
	className,
	overlayClassName,
}: Readonly<ActionSheetProps>) {
	const generatedId = useId();
	const id = actionSheetId ?? generatedId;
	useEscapeKey(isOpen, closeOnEscape, onClose);
	const { onOverlayClick, onActionClick } = createActionSheetHandlers(closeOnOverlayClick, onClose);

	if (!isOpen) return null;

	const backdropProps = overlayClassName ? { className: overlayClassName } : {};
	const contentProps = {
		...(title && { title }),
		...(className && { className }),
	};

	return createPortal(
		<>
			<Backdrop isOpen={isOpen} onClick={onOverlayClick} {...backdropProps} zIndex={40} />
			<ActionSheetContent
				id={id}
				actions={actions}
				cancelLabel={cancelLabel}
				showCancel={showCancel}
				onClose={onClose}
				onActionClick={onActionClick}
				{...contentProps}
			/>
		</>,
		document.body
	);
}

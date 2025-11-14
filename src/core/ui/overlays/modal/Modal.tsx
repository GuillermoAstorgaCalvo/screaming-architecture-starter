import { useModalSetup } from '@core/ui/overlays/modal/hooks/useModalSetup';
import {
	extractModalProps,
	prepareModalOptions,
	renderModalDialog,
} from '@core/ui/overlays/modal/utils/modalUtils';
import type { ModalProps } from '@src-types/ui/overlays/panels';

/**
 * Modal - Accessible modal dialog component
 *
 * Features:
 * - Accessible: proper ARIA attributes, focus management, keyboard navigation
 * - Customizable sizes: sm, md, lg, xl, full
 * - Optional footer and close button
 * - Escape key and overlay click handling
 * - Focus trapping within modal
 * - Dark mode support
 * - Restores focus to previous element on close
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 *   size="md"
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 * ```
 */
export default function Modal(props: Readonly<ModalProps>) {
	const modalProps = extractModalProps(props);
	const setup = useModalSetup(
		prepareModalOptions(modalProps.modalId, modalProps.closeOnOverlayClick, modalProps.onClose),
		modalProps.isOpen,
		modalProps.closeOnEscape
	);

	if (!modalProps.isOpen) {
		return null;
	}

	return renderModalDialog({
		setup,
		...(modalProps.className !== undefined && { className: modalProps.className }),
		closeOnEscape: modalProps.closeOnEscape,
		onClose: modalProps.onClose,
		size: modalProps.size,
		title: modalProps.title,
		showCloseButton: modalProps.showCloseButton,
		footer: modalProps.footer,
		children: modalProps.children,
	});
}

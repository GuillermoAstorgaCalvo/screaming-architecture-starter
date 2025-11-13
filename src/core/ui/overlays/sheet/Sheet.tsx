import { SheetDialog } from '@core/ui/overlays/sheet/components/SheetDialog';
import { SheetOverlay } from '@core/ui/overlays/sheet/components/SheetParts';
import { useSheetId } from '@core/ui/overlays/sheet/hooks/useSheet';
import { useSheetSetup } from '@core/ui/overlays/sheet/hooks/useSheetSetup';
import type { SheetPosition, SheetProps, SheetSize } from '@src-types/ui/overlays/panels';
import type { MouseEvent, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';

interface SheetPortalContentProps {
	readonly id: string;
	readonly sheetRef: RefObject<HTMLDivElement | null>;
	readonly position: SheetPosition;
	readonly size: SheetSize;
	readonly isOpen: boolean;
	readonly title?: string;
	readonly showCloseButton: boolean;
	readonly onClose: () => void;
	readonly footer?: ReactNode;
	readonly children: ReactNode;
	readonly className?: string;
	readonly overlayClassName?: string;
	readonly handleOverlayClick: (
		e: MouseEvent<HTMLDivElement>,
		closeOnOverlayClick: boolean
	) => void;
	readonly closeOnOverlayClick: boolean;
}

function SheetPortalContent(props: SheetPortalContentProps) {
	const overlayClick = (e: MouseEvent<HTMLDivElement>) =>
		props.handleOverlayClick(e, props.closeOnOverlayClick);

	const overlayProps = {
		isOpen: props.isOpen,
		onClick: overlayClick,
		...(props.overlayClassName !== undefined && { overlayClassName: props.overlayClassName }),
	};

	const dialogProps = {
		id: props.id,
		sheetRef: props.sheetRef,
		position: props.position,
		size: props.size,
		isOpen: props.isOpen,
		showCloseButton: props.showCloseButton,
		onClose: props.onClose,
		children: props.children,
		...(props.title !== undefined && { title: props.title }),
		...(props.footer !== undefined && { footer: props.footer }),
		...(props.className !== undefined && { className: props.className }),
	};

	return (
		<>
			<SheetOverlay {...overlayProps} />
			<SheetDialog {...dialogProps} />
		</>
	);
}

function buildSheetPortalProps(options: {
	readonly props: Readonly<SheetProps>;
	readonly id: string;
	readonly sheetRef: RefObject<HTMLDivElement | null>;
	readonly handleOverlayClick: (
		e: MouseEvent<HTMLDivElement>,
		closeOnOverlayClick: boolean
	) => void;
}): SheetPortalContentProps {
	const { props, id, sheetRef, handleOverlayClick } = options;
	return {
		id,
		sheetRef,
		position: props.position ?? 'right',
		size: props.size ?? 'md',
		isOpen: props.isOpen,
		showCloseButton: props.showCloseButton ?? true,
		onClose: props.onClose,
		children: props.children,
		handleOverlayClick,
		closeOnOverlayClick: props.closeOnOverlayClick ?? true,
		...(props.title !== undefined && { title: props.title }),
		...(props.footer !== undefined && { footer: props.footer }),
		...(props.className !== undefined && { className: props.className }),
		...(props.overlayClassName !== undefined && { overlayClassName: props.overlayClassName }),
	};
}

/** Sheet - Alternative to Drawer for bottom/top/side panels. Features: Accessible, multiple positions, customizable sizes, escape key handling, dark mode */
export default function Sheet(props: Readonly<SheetProps>) {
	const id = useSheetId(props.sheetId);
	const { sheetRef, handleOverlayClick } = useSheetSetup(
		props.isOpen,
		props.closeOnEscape ?? true,
		props.onClose
	);

	if (!props.isOpen) {
		return null;
	}
	return createPortal(
		<SheetPortalContent {...buildSheetPortalProps({ props, id, sheetRef, handleOverlayClick })} />,
		document.body
	);
}

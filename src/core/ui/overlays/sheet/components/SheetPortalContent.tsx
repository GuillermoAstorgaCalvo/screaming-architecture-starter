import { SheetDialog } from '@core/ui/overlays/sheet/components/SheetDialog';
import { SheetOverlay } from '@core/ui/overlays/sheet/components/SheetParts';
import type { SheetPosition, SheetSize } from '@src-types/ui/overlays/panels';
import type { MouseEvent, ReactNode, RefObject } from 'react';

export interface SheetPortalContentProps {
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

export function SheetPortalContent(props: SheetPortalContentProps) {
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

import type { DrawerPosition, DrawerProps, DrawerSize } from '@src-types/ui/overlays/panels';
import type { MouseEvent, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';

import { DrawerDialog } from './DrawerDialog';
import { DrawerOverlay } from './DrawerParts';
import { useDrawerId } from './useDrawer';
import { useDrawerSetup } from './useDrawerSetup';

interface DrawerPortalContentProps {
	readonly id: string;
	readonly drawerRef: RefObject<HTMLDivElement | null>;
	readonly position: DrawerPosition;
	readonly size: DrawerSize;
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

function DrawerPortalContent(props: DrawerPortalContentProps) {
	const overlayClick = (e: MouseEvent<HTMLDivElement>) =>
		props.handleOverlayClick(e, props.closeOnOverlayClick);

	const overlayProps = {
		isOpen: props.isOpen,
		onClick: overlayClick,
		...(props.overlayClassName !== undefined && { overlayClassName: props.overlayClassName }),
	};

	const dialogProps = {
		id: props.id,
		drawerRef: props.drawerRef,
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
			<DrawerOverlay {...overlayProps} />
			<DrawerDialog {...dialogProps} />
		</>
	);
}

function buildDrawerPortalProps(options: {
	readonly props: Readonly<DrawerProps>;
	readonly id: string;
	readonly drawerRef: RefObject<HTMLDivElement | null>;
	readonly handleOverlayClick: (
		e: MouseEvent<HTMLDivElement>,
		closeOnOverlayClick: boolean
	) => void;
}): DrawerPortalContentProps {
	const { props, id, drawerRef, handleOverlayClick } = options;
	return {
		id,
		drawerRef,
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

/** Drawer - Side panel/drawer component. Features: Accessible, multiple positions, customizable sizes, escape key handling, dark mode */
export default function Drawer(props: Readonly<DrawerProps>) {
	const id = useDrawerId(props.drawerId);
	const { drawerRef, handleOverlayClick } = useDrawerSetup(
		props.isOpen,
		props.closeOnEscape ?? true,
		props.onClose
	);

	if (!props.isOpen) {
		return null;
	}
	return createPortal(
		<DrawerPortalContent
			{...buildDrawerPortalProps({ props, id, drawerRef, handleOverlayClick })}
		/>,
		document.body
	);
}

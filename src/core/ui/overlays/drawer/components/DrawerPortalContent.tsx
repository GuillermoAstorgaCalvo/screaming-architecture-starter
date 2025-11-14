import { DrawerDialog } from '@core/ui/overlays/drawer/components/DrawerDialog';
import { DrawerOverlay } from '@core/ui/overlays/drawer/components/DrawerParts';
import type { DrawerPortalContentProps } from '@core/ui/overlays/drawer/types/drawer.types';
import type { MouseEvent } from 'react';

/**
 * DrawerPortalContent - Renders the drawer overlay and dialog content
 */
export function DrawerPortalContent(props: Readonly<DrawerPortalContentProps>) {
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

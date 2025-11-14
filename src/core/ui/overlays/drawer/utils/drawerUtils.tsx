import type {
	BuildDrawerPortalPropsOptions,
	DrawerPortalContentProps,
} from '@core/ui/overlays/drawer/types/drawer.types';

function getOptionalProps(props: BuildDrawerPortalPropsOptions['props']) {
	return {
		...(props.title !== undefined && { title: props.title }),
		...(props.footer !== undefined && { footer: props.footer }),
		...(props.className !== undefined && { className: props.className }),
		...(props.overlayClassName !== undefined && { overlayClassName: props.overlayClassName }),
	};
}

/**
 * Builds props for the DrawerPortalContent component from Drawer props and setup
 */
export function buildDrawerPortalProps(
	options: BuildDrawerPortalPropsOptions
): DrawerPortalContentProps {
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
		...getOptionalProps(props),
	};
}

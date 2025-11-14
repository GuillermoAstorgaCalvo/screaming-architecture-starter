import type { DrawerPosition, DrawerProps, DrawerSize } from '@src-types/ui/overlays/panels';
import type { MouseEvent, ReactNode, RefObject } from 'react';

/**
 * Props for the DrawerPortalContent component
 */
export interface DrawerPortalContentProps {
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

/**
 * Options for building drawer portal props
 */
export interface BuildDrawerPortalPropsOptions {
	readonly props: Readonly<DrawerProps>;
	readonly id: string;
	readonly drawerRef: RefObject<HTMLDivElement | null>;
	readonly handleOverlayClick: (
		e: MouseEvent<HTMLDivElement>,
		closeOnOverlayClick: boolean
	) => void;
}

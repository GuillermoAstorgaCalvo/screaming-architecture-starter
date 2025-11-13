import {
	DrawerFooter,
	DrawerHeader,
	DrawerMainContent,
} from '@core/ui/overlays/drawer/components/DrawerParts';
import { getDrawerClasses } from '@core/ui/overlays/drawer/helpers/DrawerHelpers';
import type { DrawerPosition, DrawerSize } from '@src-types/ui/overlays/panels';
import type { ReactNode, RefObject } from 'react';

interface DrawerDialogProps {
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
}

export function DrawerDialog(props: DrawerDialogProps) {
	const dialogProps = {
		ref: props.drawerRef,
		id: props.id,
		role: 'dialog' as const,
		'aria-modal': true,
		'aria-labelledby': props.title ? `${props.id}-title` : undefined,
		className: `${getDrawerClasses(props.position, props.size, props.isOpen)} ${props.className ?? ''}`,
	};

	return (
		<div {...dialogProps}>
			<DrawerHeader
				id={props.id}
				{...(props.title !== undefined && { title: props.title })}
				showCloseButton={props.showCloseButton}
				onClose={props.onClose}
			/>
			<DrawerMainContent>{props.children}</DrawerMainContent>
			{props.footer !== undefined && <DrawerFooter footer={props.footer} />}
		</div>
	);
}

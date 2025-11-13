import type { SheetPosition, SheetSize } from '@src-types/ui/overlays/panels';
import type { ReactNode, RefObject } from 'react';

import { getSheetClasses } from './SheetHelpers';
import { SheetFooter, SheetHeader, SheetMainContent } from './SheetParts';

interface SheetDialogProps {
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
}

export function SheetDialog(props: SheetDialogProps) {
	const dialogProps = {
		ref: props.sheetRef,
		id: props.id,
		role: 'dialog' as const,
		'aria-modal': true,
		'aria-labelledby': props.title ? `${props.id}-title` : undefined,
		className: `${getSheetClasses(props.position, props.size, props.isOpen)} ${props.className ?? ''}`,
	};

	return (
		<div {...dialogProps}>
			<SheetHeader
				id={props.id}
				{...(props.title !== undefined && { title: props.title })}
				showCloseButton={props.showCloseButton}
				onClose={props.onClose}
			/>
			<SheetMainContent>{props.children}</SheetMainContent>
			{props.footer !== undefined && <SheetFooter footer={props.footer} />}
		</div>
	);
}

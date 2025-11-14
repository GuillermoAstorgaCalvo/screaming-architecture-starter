import {
	SHEET_BASE_CLASSES,
	SHEET_OVERLAY_BASE_CLASSES,
	SHEET_POSITION_CLASSES,
	SHEET_SIZE_CLASSES,
} from '@core/constants/ui/navigation';
import type { SheetPortalContentProps } from '@core/ui/overlays/sheet/components/SheetPortalContent';
import type { SheetPosition, SheetProps, SheetSize } from '@src-types/ui/overlays/panels';
import type { MouseEvent, RefObject } from 'react';

export function getTransformClass(position: SheetPosition, isOpen: boolean): string {
	if (isOpen) return 'translate-x-0 translate-y-0';
	if (position === 'left') return '-translate-x-full';
	if (position === 'right') return 'translate-x-full';
	if (position === 'top') return '-translate-y-full';
	return 'translate-y-full';
}

export function getSheetClasses(position: SheetPosition, size: SheetSize, isOpen: boolean): string {
	return `${SHEET_BASE_CLASSES} ${SHEET_POSITION_CLASSES[position]} ${SHEET_SIZE_CLASSES[size]} ${getTransformClass(position, isOpen)}`;
}

export function getOverlayClasses(isOpen: boolean, className?: string): string {
	return `${SHEET_OVERLAY_BASE_CLASSES} ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${className ?? ''}`;
}

function getDefaultSheetProps(props: Readonly<SheetProps>) {
	return {
		position: props.position ?? 'right',
		size: props.size ?? 'md',
		showCloseButton: props.showCloseButton ?? true,
		closeOnOverlayClick: props.closeOnOverlayClick ?? true,
	};
}

function getOptionalSheetProps(props: Readonly<SheetProps>) {
	return {
		...(props.title !== undefined && { title: props.title }),
		...(props.footer !== undefined && { footer: props.footer }),
		...(props.className !== undefined && { className: props.className }),
		...(props.overlayClassName !== undefined && { overlayClassName: props.overlayClassName }),
	};
}

export function buildSheetPortalProps(options: {
	readonly props: Readonly<SheetProps>;
	readonly id: string;
	readonly sheetRef: RefObject<HTMLDivElement | null>;
	readonly handleOverlayClick: (
		e: MouseEvent<HTMLDivElement>,
		closeOnOverlayClick: boolean
	) => void;
}): SheetPortalContentProps {
	const { props, id, sheetRef, handleOverlayClick } = options;
	const defaults = getDefaultSheetProps(props);
	const optional = getOptionalSheetProps(props);

	return {
		id,
		sheetRef,
		position: defaults.position,
		size: defaults.size,
		isOpen: props.isOpen,
		showCloseButton: defaults.showCloseButton,
		onClose: props.onClose,
		children: props.children,
		handleOverlayClick,
		closeOnOverlayClick: defaults.closeOnOverlayClick,
		...optional,
	};
}

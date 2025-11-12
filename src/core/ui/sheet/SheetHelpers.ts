import {
	SHEET_BASE_CLASSES,
	SHEET_OVERLAY_BASE_CLASSES,
	SHEET_POSITION_CLASSES,
	SHEET_SIZE_CLASSES,
} from '@core/constants/ui/navigation';
import type { SheetPosition, SheetSize } from '@src-types/ui/overlays';

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

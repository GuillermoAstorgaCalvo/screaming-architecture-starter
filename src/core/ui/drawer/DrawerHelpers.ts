import {
	DRAWER_BASE_CLASSES,
	DRAWER_OVERLAY_BASE_CLASSES,
	DRAWER_POSITION_CLASSES,
	DRAWER_SIZE_CLASSES,
} from '@core/constants/ui/navigation';
import type { DrawerPosition, DrawerSize } from '@src-types/ui/overlays';

export function getTransformClass(position: DrawerPosition, isOpen: boolean): string {
	if (isOpen) return 'translate-x-0 translate-y-0';
	if (position === 'left') return '-translate-x-full';
	if (position === 'right') return 'translate-x-full';
	if (position === 'top') return '-translate-y-full';
	return 'translate-y-full';
}

export function getDrawerClasses(
	position: DrawerPosition,
	size: DrawerSize,
	isOpen: boolean
): string {
	return `${DRAWER_BASE_CLASSES} ${DRAWER_POSITION_CLASSES[position]} ${DRAWER_SIZE_CLASSES[size]} ${getTransformClass(position, isOpen)}`;
}

export function getOverlayClasses(isOpen: boolean, className?: string): string {
	return `${DRAWER_OVERLAY_BASE_CLASSES} ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${className ?? ''}`;
}

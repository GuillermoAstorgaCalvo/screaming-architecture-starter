import {
	FAB_BASE_CLASSES,
	FAB_EXTENDED_CLASSES,
	FAB_EXTENDED_SIZE_CLASSES,
	FAB_POSITION_CLASSES,
	FAB_SIZE_CLASSES,
	FAB_VARIANT_CLASSES,
} from '@core/ui/navigation/floating-action-button/constants/FloatingActionButtonConstants';
import type { StandardSize } from '@src-types/ui/base';
import type { FloatingActionButtonPosition } from '@src-types/ui/navigation/floatingActionButton';
import { twMerge } from 'tailwind-merge';

/**
 * Gets the position classes for the FAB
 *
 * @param position - Position of the FAB
 * @returns Position classes string
 *
 * @internal
 */
export function getPositionClasses(position: FloatingActionButtonPosition): string {
	return FAB_POSITION_CLASSES[position];
}

/**
 * Gets the size classes for the regular (non-extended) FAB
 *
 * @param size - Size of the FAB
 * @returns Size classes string
 *
 * @internal
 */
export function getRegularSizeClasses(size: StandardSize): string {
	return FAB_SIZE_CLASSES[size];
}

/**
 * Gets the size classes for the extended FAB
 *
 * @param size - Size of the FAB
 * @returns Extended size classes string
 *
 * @internal
 */
export function getExtendedSizeClasses(size: StandardSize): string {
	return FAB_EXTENDED_SIZE_CLASSES[size];
}

/**
 * Gets the variant classes for the FAB
 *
 * @param variant - Variant of the FAB
 * @returns Variant classes string
 *
 * @internal
 */
export function getVariantClasses(variant: 'primary' | 'secondary'): string {
	return FAB_VARIANT_CLASSES[variant];
}

/**
 * Gets the extended padding classes for the FAB
 *
 * @returns Extended padding classes string
 *
 * @internal
 */
export function getExtendedPaddingClasses(): string {
	return FAB_EXTENDED_CLASSES;
}

interface GetFloatingActionButtonClassesParams {
	readonly position: FloatingActionButtonPosition;
	readonly size: StandardSize;
	readonly variant: 'primary' | 'secondary';
	readonly extended: boolean;
	readonly className?: string;
}

/**
 * Computes all classes for the FAB
 *
 * @param params - Parameters for computing classes
 * @returns Merged class string
 *
 * @internal
 */
export function getFloatingActionButtonClasses({
	position,
	size,
	variant,
	extended,
	className,
}: GetFloatingActionButtonClassesParams): string {
	const sizeClasses = extended ? getExtendedSizeClasses(size) : getRegularSizeClasses(size);

	const extendedPaddingClasses = extended ? getExtendedPaddingClasses() : '';

	return twMerge(
		FAB_BASE_CLASSES,
		getPositionClasses(position),
		sizeClasses,
		getVariantClasses(variant),
		extendedPaddingClasses,
		className
	);
}

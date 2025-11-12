import {
	SEGMENTED_CONTROL_BASE_CLASSES,
	SEGMENTED_CONTROL_VARIANT_CLASSES,
} from '@core/constants/ui/navigation';
import type { SegmentedControlProps } from '@src-types/ui/navigation';
import { useId } from 'react';
import { twMerge } from 'tailwind-merge';

export function useSegmentedControlId(segmentedControlId?: string): string {
	const generatedId = useId();
	return segmentedControlId ?? `segmented-control-${generatedId}`;
}

export function getContainerClasses(
	variant: SegmentedControlProps['variant'],
	className?: string
): string {
	const variantKey = variant ?? 'default';
	return twMerge(
		SEGMENTED_CONTROL_BASE_CLASSES,
		SEGMENTED_CONTROL_VARIANT_CLASSES[variantKey],
		className
	);
}

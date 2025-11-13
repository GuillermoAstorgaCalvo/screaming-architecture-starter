import { classNames } from '@core/utils/classNames';
import type { ScrollAreaOrientation } from '@src-types/ui/layout/scroll';

interface GetScrollAreaClassesParams {
	readonly orientation: ScrollAreaOrientation;
	readonly className?: string | undefined;
}

export function getScrollAreaClasses({
	orientation,
	className,
}: GetScrollAreaClassesParams): string {
	const baseClasses = 'relative w-full';
	let orientationClasses: string;
	if (orientation === 'horizontal') {
		orientationClasses = 'overflow-x-auto overflow-y-hidden';
	} else if (orientation === 'both') {
		orientationClasses = 'overflow-auto';
	} else {
		orientationClasses = 'overflow-y-auto overflow-x-hidden';
	}

	return classNames(baseClasses, orientationClasses, className);
}

import { getRadioVariantClasses } from '@core/ui/variants/radio';
import type { StandardSize } from '@src-types/ui/base';

export interface GetRadioClassesOptions {
	size: StandardSize;
	className?: string | undefined;
}

export function getRadioClasses(options: GetRadioClassesOptions): string {
	return getRadioVariantClasses({
		size: options.size,
		className: options.className,
	});
}

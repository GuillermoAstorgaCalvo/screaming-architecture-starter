import { getIconVariantClasses } from '@core/ui/variants/icon';
import type { BaseIconProps } from '@src-types/ui/base';

/**
 * ArrowLeftIcon - Arrow left icon SVG component for navigation
 */
export default function ArrowLeftIcon({
	size = 'md',
	className,
	...props
}: Readonly<BaseIconProps>) {
	return (
		<svg
			className={getIconVariantClasses({ size, className })}
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			{...props}
		>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
		</svg>
	);
}

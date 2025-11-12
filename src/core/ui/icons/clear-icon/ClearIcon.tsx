import { getIconVariantClasses } from '@core/ui/variants/icon';
import type { BaseIconProps } from '@src-types/ui/base';

/**
 * ClearIcon - X/Clear icon SVG component
 */
export default function ClearIcon({ size = 'md', className, ...props }: Readonly<BaseIconProps>) {
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
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
		</svg>
	);
}

import { getIconVariantClasses } from '@core/ui/variants/icon';
import type { BaseIconProps } from '@src-types/ui/base';

/**
 * HeartIcon - Heart/like icon SVG component
 */
export default function HeartIcon({ size = 'md', className, ...props }: Readonly<BaseIconProps>) {
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
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
			/>
		</svg>
	);
}

import { getIconVariantClasses } from '@core/ui/variants/icon';
import type { BaseIconProps } from '@src-types/ui/base';

/**
 * CopyIcon - Copy/clipboard icon SVG component
 */
export default function CopyIcon({ size = 'md', className, ...props }: Readonly<BaseIconProps>) {
	return (
		<svg
			className={getIconVariantClasses({ size, className })}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
			{...props}
		>
			<path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
			<path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 100-2h-2v2z" />
		</svg>
	);
}

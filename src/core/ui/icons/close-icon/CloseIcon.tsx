import { getIconVariantClasses } from '@core/ui/variants/icon';
import type { BaseIconProps } from '@src-types/ui/base';

/**
 * CloseIcon - X/Close icon SVG component
 */
export default function CloseIcon({ size = 'md', className, ...props }: Readonly<BaseIconProps>) {
	return (
		<svg
			className={getIconVariantClasses({ size, className })}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
			{...props}
		>
			<path
				fillRule="evenodd"
				d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

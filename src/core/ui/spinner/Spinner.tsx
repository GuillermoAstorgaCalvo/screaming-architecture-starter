import { getSpinnerVariantClasses } from '@core/ui/variants/spinner';
import type { SpinnerProps } from '@src-types/ui';

import { filterSpinnerSvgProps, getSpinnerSvgProps } from './SpinnerHelpers';
import { SpinnerContent } from './SpinnerParts';

export type { SpinnerProps, StandardSize as SpinnerSize } from '@src-types/ui';

/**
 * Spinner - Loading indicator component
 *
 * Features:
 * - Accessible: proper ARIA labels
 * - Sizes: sm, md, lg, or custom numeric size
 * - Customizable color
 * - Smooth animation
 */
export default function Spinner({
	size = 'md',
	color = 'currentColor',
	className,
	'aria-label': ariaLabel = 'Loading',
	...props
}: Readonly<SpinnerProps>) {
	const svgProps = getSpinnerSvgProps(size);
	const spinnerClassName = getSpinnerVariantClasses({
		size: typeof size === 'string' ? size : 'md',
		className,
	});
	const svgRestProps = filterSpinnerSvgProps(props);
	return (
		<div aria-label={ariaLabel} aria-live="polite" className={spinnerClassName} role="status">
			<svg
				{...svgProps}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				aria-hidden="true"
				{...svgRestProps}
			>
				<SpinnerContent color={color} />
			</svg>
		</div>
	);
}

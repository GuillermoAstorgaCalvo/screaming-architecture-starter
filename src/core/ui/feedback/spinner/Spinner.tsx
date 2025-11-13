import { ARIA_LABELS, ARIA_LIVE, ARIA_ROLES } from '@core/constants/aria';
import { getSpinnerVariantClasses } from '@core/ui/variants/spinner';
import type { SpinnerProps } from '@src-types/ui/feedback';

import { filterSpinnerSvgProps, getSpinnerSvgProps } from './SpinnerHelpers';
import { SpinnerContent } from './SpinnerParts';

/**
 * Render spinner SVG element
 */
function renderSpinnerSvg(
	size: SpinnerProps['size'],
	color: SpinnerProps['color'],
	props: Record<string, unknown>
) {
	const svgProps = getSpinnerSvgProps(size ?? 'md');
	const svgRestProps = filterSpinnerSvgProps(props);
	return (
		<svg
			{...svgProps}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true"
			{...svgRestProps}
		>
			<SpinnerContent color={color ?? 'currentColor'} />
		</svg>
	);
}

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
	'aria-label': ariaLabel = ARIA_LABELS.LOADING,
	...props
}: Readonly<SpinnerProps>) {
	const spinnerClassName = getSpinnerVariantClasses({
		size: typeof size === 'string' ? size : 'md',
		className,
	});
	return (
		<div
			aria-label={ariaLabel}
			aria-live={ARIA_LIVE.POLITE}
			className={spinnerClassName}
			role={ARIA_ROLES.STATUS}
		>
			{renderSpinnerSvg(size, color, props)}
		</div>
	);
}

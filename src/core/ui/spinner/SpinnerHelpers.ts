import { SPINNER_SIZE_CLASSES } from '@core/constants/ui';
import { classNames } from '@core/utils/classNames';
import type { StandardSize } from '@src-types/ui';

/**
 * Gets the SVG props for the spinner
 */
export function getSpinnerSvgProps(size: StandardSize | number): {
	className: string;
	width?: number | undefined;
	height?: number | undefined;
} {
	const isCustomSize = typeof size === 'number';
	const sizeClass = typeof size === 'string' ? SPINNER_SIZE_CLASSES[size] : '';
	const props: { className: string; width?: number | undefined; height?: number | undefined } = {
		className: classNames('animate-spin', sizeClass),
	};
	if (isCustomSize) {
		props.width = size;
		props.height = size;
	}
	return props;
}

/**
 * Filters out SVG props that conflict with hardcoded spinner attributes
 */
export function filterSpinnerSvgProps(props: Record<string, unknown>) {
	// Destructuring to exclude these props (underscore prefix indicates intentionally unused)
	const {
		xmlns: _xmlns,
		fill: _fill,
		viewBox: _viewBox,
		'aria-hidden': _ariaHidden,
		width: _width,
		height: _height,
		...rest
	} = props;
	return rest;
}

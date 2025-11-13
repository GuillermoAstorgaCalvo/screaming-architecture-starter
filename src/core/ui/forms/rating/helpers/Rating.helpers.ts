import { ARIA_LABELS } from '@core/constants/aria';
import {
	RATING_STAR_DISABLED_CLASSES,
	RATING_STAR_EMPTY_CLASSES,
	RATING_STAR_FILLED_CLASSES,
	RATING_STAR_INTERACTIVE_CLASSES,
} from '@core/constants/ui/rating';
import type {
	NormalizedRatingProps,
	RatingContainerPropsParams,
	RatingStylesParams,
	StarButtonPropsParams,
	StarClassesParams,
	StarFillParams,
} from '@core/ui/forms/rating/types/Rating.helpers.types';
import { getRatingVariantClasses } from '@core/ui/variants/rating';
import { classNames } from '@core/utils/classNames';
import type { RatingProps } from '@src-types/ui/forms-advanced';

export const HALF_STAR_VALUE = 0.5;

export const getStarFill = ({ displayValue, starIndex, allowHalf }: StarFillParams): number => {
	const starValue = starIndex + 1;
	if (displayValue >= starValue) return 1;
	if (displayValue > starIndex && allowHalf) {
		const remainder = displayValue - starIndex;
		return remainder >= HALF_STAR_VALUE ? HALF_STAR_VALUE : 0;
	}
	return 0;
};

export const getStarClasses = ({ readOnly, disabled }: StarClassesParams): string => {
	return classNames(
		RATING_STAR_FILLED_CLASSES,
		!readOnly && !disabled && RATING_STAR_INTERACTIVE_CLASSES,
		disabled && RATING_STAR_DISABLED_CLASSES
	);
};

export const getEmptyStarClasses = ({ readOnly, disabled }: StarClassesParams): string => {
	return classNames(
		RATING_STAR_EMPTY_CLASSES,
		!readOnly && !disabled && RATING_STAR_INTERACTIVE_CLASSES,
		disabled && RATING_STAR_DISABLED_CLASSES
	);
};

export const getStarButtonProps = ({
	starIndex,
	fill,
	readOnly,
	disabled,
}: StarButtonPropsParams) => {
	const ariaLabel = `${starIndex + 1} ${starIndex === 0 ? 'star' : 'stars'}`;
	return {
		key: starIndex,
		type: 'button' as const,
		role: readOnly ? undefined : ('radio' as const),
		'aria-checked': readOnly ? undefined : fill === 1,
		'aria-label': ariaLabel,
		disabled: readOnly || disabled,
		className: classNames(
			'inline-flex items-center justify-center p-0.5 border-0 bg-transparent',
			'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded'
		),
	};
};

export const getRatingContainerProps = ({
	readOnly,
	currentValue,
	max,
	ariaLabel,
	classes,
	handleMouseLeave,
}: RatingContainerPropsParams) => {
	return {
		role: readOnly ? undefined : ('radiogroup' as const),
		'aria-label': ariaLabel,
		'aria-valuenow': readOnly ? currentValue : undefined,
		'aria-valuemin': 0,
		'aria-valuemax': max,
		className: classes,
		onMouseLeave: readOnly || !handleMouseLeave ? undefined : handleMouseLeave,
	};
};

export const getRatingStyles = ({ size, className, readOnly, disabled }: RatingStylesParams) => {
	return {
		classes: getRatingVariantClasses({ size, className }),
		starClasses: getStarClasses({ readOnly, disabled }),
		emptyStarClasses: getEmptyStarClasses({ readOnly, disabled }),
	};
};

const DEFAULT_RATING_PROPS = {
	max: 5,
	size: 'md' as const,
	readOnly: false,
	disabled: false,
	'aria-label': ARIA_LABELS.RATING,
	allowHalf: false,
} as const;

export const normalizeRatingProps = (props: Readonly<RatingProps>): NormalizedRatingProps => {
	const {
		value: controlledValue,
		defaultValue,
		max,
		size,
		readOnly,
		disabled,
		onChange,
		'aria-label': ariaLabel,
		allowHalf,
		emptyIcon,
		filledIcon,
		className,
		...restProps
	} = { ...DEFAULT_RATING_PROPS, ...props };

	return {
		controlledValue,
		defaultValue,
		max,
		size,
		readOnly,
		disabled,
		onChange,
		ariaLabel,
		allowHalf,
		emptyIcon,
		filledIcon,
		className,
		restProps,
	};
};

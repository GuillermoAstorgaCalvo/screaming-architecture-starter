import { ARIA_LABELS } from '@core/constants/aria';
import {
	RATING_STAR_DISABLED_CLASSES,
	RATING_STAR_EMPTY_CLASSES,
	RATING_STAR_FILLED_CLASSES,
	RATING_STAR_INTERACTIVE_CLASSES,
} from '@core/constants/ui/rating';
import { getRatingVariantClasses } from '@core/ui/variants/rating';
import { classNames } from '@core/utils/classNames';
import type { RatingProps } from '@src-types/ui/forms-advanced';
import type { ReactNode } from 'react';

export const HALF_STAR_VALUE = 0.5;

export interface StarFillParams {
	displayValue: number;
	starIndex: number;
	allowHalf: boolean;
}

export const getStarFill = ({ displayValue, starIndex, allowHalf }: StarFillParams): number => {
	const starValue = starIndex + 1;
	if (displayValue >= starValue) return 1;
	if (displayValue > starIndex && allowHalf) {
		const remainder = displayValue - starIndex;
		return remainder >= HALF_STAR_VALUE ? HALF_STAR_VALUE : 0;
	}
	return 0;
};

export interface StarClassesParams {
	readOnly: boolean;
	disabled: boolean;
}

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

export interface StarButtonPropsParams {
	starIndex: number;
	fill: number;
	readOnly: boolean;
	disabled: boolean;
}

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

export interface RatingContainerPropsParams {
	readOnly: boolean;
	currentValue: number;
	max: number;
	ariaLabel: string;
	classes: string;
	handleMouseLeave?: () => void;
}

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

export interface RatingStylesParams {
	size: RatingProps['size'];
	className?: string | undefined;
	readOnly: boolean;
	disabled: boolean;
}

export const getRatingStyles = ({ size, className, readOnly, disabled }: RatingStylesParams) => {
	return {
		classes: getRatingVariantClasses({ size, className }),
		starClasses: getStarClasses({ readOnly, disabled }),
		emptyStarClasses: getEmptyStarClasses({ readOnly, disabled }),
	};
};

export interface NormalizedRatingProps {
	controlledValue?: number | undefined;
	defaultValue?: number | undefined;
	max: number;
	size: RatingProps['size'];
	readOnly: boolean;
	disabled: boolean;
	onChange?: ((value: number) => void) | undefined;
	ariaLabel: string;
	allowHalf: boolean;
	emptyIcon?: ReactNode | undefined;
	filledIcon?: ReactNode | undefined;
	className?: string | undefined;
	restProps: Record<string, unknown>;
}

export const normalizeRatingProps = (props: Readonly<RatingProps>): NormalizedRatingProps => {
	const {
		value: controlledValue,
		defaultValue,
		max = 5,
		size = 'md',
		readOnly = false,
		disabled = false,
		onChange,
		'aria-label': ariaLabel = ARIA_LABELS.RATING,
		allowHalf = false,
		emptyIcon,
		filledIcon,
		className,
		...restProps
	} = props;

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

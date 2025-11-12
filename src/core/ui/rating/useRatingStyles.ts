import type { RatingProps } from '@src-types/ui/forms-advanced';

import { getRatingContainerProps, getRatingStyles } from './Rating.helpers';

export interface UseRatingStylesAndContainerParams {
	readOnly: boolean;
	disabled: boolean;
	currentValue: number;
	max: number;
	ariaLabel: string;
	size: RatingProps['size'];
	className?: string | undefined;
	handleMouseLeave: () => void;
}

export const useRatingStylesAndContainer = ({
	readOnly,
	disabled,
	currentValue,
	max,
	ariaLabel,
	size,
	className,
	handleMouseLeave,
}: UseRatingStylesAndContainerParams) => {
	const { classes, starClasses, emptyStarClasses } = getRatingStyles({
		size,
		className,
		readOnly,
		disabled,
	});
	const containerProps = getRatingContainerProps({
		readOnly,
		currentValue,
		max,
		ariaLabel,
		classes,
		handleMouseLeave,
	});

	return { starClasses, emptyStarClasses, containerProps };
};

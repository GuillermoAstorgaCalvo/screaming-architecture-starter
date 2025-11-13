import type { RatingProps } from '@src-types/ui/forms-advanced';
import type { ReactNode } from 'react';

export interface UseRatingContentParams {
	max: number;
	allowHalf: boolean;
	size: RatingProps['size'];
	readOnly: boolean;
	disabled: boolean;
	starClasses: string;
	emptyStarClasses: string;
	emptyIcon?: ReactNode;
	filledIcon?: ReactNode;
	displayValue: number;
	handleStarClick: (index: number) => void;
	handleStarHover: (index: number) => void;
}

export const useRatingContent = ({
	max,
	allowHalf,
	size,
	readOnly,
	disabled,
	starClasses,
	emptyStarClasses,
	emptyIcon,
	filledIcon,
	displayValue,
	handleStarClick,
	handleStarHover,
}: UseRatingContentParams) => {
	return {
		max,
		displayValue,
		allowHalf,
		size,
		readOnly,
		disabled,
		starClasses,
		emptyStarClasses,
		emptyIcon,
		filledIcon,
		onClick: handleStarClick,
		onMouseEnter: handleStarHover,
	};
};

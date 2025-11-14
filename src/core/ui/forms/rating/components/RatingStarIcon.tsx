import StarIcon from '@core/ui/icons/star-icon/StarIcon';
import { classNames } from '@core/utils/classNames';
import type { RatingProps } from '@src-types/ui/forms-advanced';
import type { ReactNode } from 'react';

const DEFAULT_SIZE = 'md';

export interface RatingStarIconProps {
	size: RatingProps['size'];
	starClasses: string;
	emptyStarClasses: string;
	isFilled: boolean;
	isHalf: boolean;
	emptyIcon?: ReactNode;
	filledIcon?: ReactNode;
}

export function RatingStarIcon({
	size,
	starClasses,
	emptyStarClasses,
	isFilled,
	isHalf,
	emptyIcon,
	filledIcon,
}: Readonly<RatingStarIconProps>) {
	const iconSize = size ?? DEFAULT_SIZE;

	if (isFilled) {
		return (
			filledIcon ?? (
				<StarIcon
					size={iconSize}
					className={classNames(starClasses, isHalf && 'opacity-disabled')}
				/>
			)
		);
	}

	return (
		emptyIcon ?? (
			<StarIcon size={iconSize} className={emptyStarClasses} fill="none" stroke="currentColor" />
		)
	);
}

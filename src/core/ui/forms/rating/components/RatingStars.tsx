import { RatingStarButton } from '@core/ui/forms/rating/components/RatingStarButton';
import { getStarFill } from '@core/ui/forms/rating/helpers/Rating.helpers';
import type { RatingProps } from '@src-types/ui/forms-advanced';
import type { ReactNode } from 'react';

export interface RatingStarsProps {
	max: number;
	displayValue: number;
	allowHalf: boolean;
	size: RatingProps['size'];
	readOnly: boolean;
	disabled: boolean;
	starClasses: string;
	emptyStarClasses: string;
	emptyIcon?: ReactNode;
	filledIcon?: ReactNode;
	onClick: (index: number) => void;
	onMouseEnter: (index: number) => void;
}

export function RatingStars({
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
	onClick,
	onMouseEnter,
}: Readonly<RatingStarsProps>) {
	return (
		<>
			{Array.from({ length: max }, (_, index) => {
				const fill = getStarFill({ displayValue, starIndex: index, allowHalf });

				return (
					<RatingStarButton
						key={index}
						starIndex={index}
						fill={fill}
						size={size}
						readOnly={readOnly}
						disabled={disabled}
						starClasses={starClasses}
						emptyStarClasses={emptyStarClasses}
						emptyIcon={emptyIcon}
						filledIcon={filledIcon}
						onClick={onClick}
						onMouseEnter={onMouseEnter}
					/>
				);
			})}
		</>
	);
}

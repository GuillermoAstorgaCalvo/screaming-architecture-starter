import type { RatingProps } from '@src-types/ui/forms-advanced';
import type { ReactNode } from 'react';

import { getStarButtonProps, HALF_STAR_VALUE } from './Rating.helpers';
import { RatingStarIcon } from './RatingStarIcon';

export interface RatingStarButtonProps {
	starIndex: number;
	fill: number;
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

export function RatingStarButton({
	starIndex,
	fill,
	size,
	readOnly,
	disabled,
	starClasses,
	emptyStarClasses,
	emptyIcon,
	filledIcon,
	onClick,
	onMouseEnter,
}: Readonly<RatingStarButtonProps>) {
	const isFilled = fill > 0;
	const isHalf = fill === HALF_STAR_VALUE;
	const buttonProps = getStarButtonProps({ starIndex, fill, readOnly, disabled });

	return (
		<button
			{...buttonProps}
			onClick={() => onClick(starIndex)}
			onMouseEnter={() => onMouseEnter(starIndex)}
		>
			<RatingStarIcon
				size={size}
				starClasses={starClasses}
				emptyStarClasses={emptyStarClasses}
				isFilled={isFilled}
				isHalf={isHalf}
				emptyIcon={emptyIcon}
				filledIcon={filledIcon}
			/>
		</button>
	);
}

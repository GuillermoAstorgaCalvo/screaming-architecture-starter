import type { RatingProps } from '@src-types/ui/forms-advanced';
import type { ReactNode } from 'react';

import { RatingStars } from './RatingStars';

export interface RatingContentProps {
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

export function RatingContent({
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
}: Readonly<RatingContentProps>) {
	return (
		<RatingStars
			max={max}
			displayValue={displayValue}
			allowHalf={allowHalf}
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
}

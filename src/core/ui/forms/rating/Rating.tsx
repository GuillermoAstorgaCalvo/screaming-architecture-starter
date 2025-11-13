import { RatingContainer } from '@core/ui/forms/rating/components/RatingContainer';
import { RatingContent } from '@core/ui/forms/rating/components/RatingContent';
import { useRating } from '@core/ui/forms/rating/hooks/useRating';
import type { RatingProps } from '@src-types/ui/forms-advanced';

/**
 * Rating - Star rating component with interactive and read-only modes
 *
 * Features:
 * - Interactive rating selection (click to rate)
 * - Read-only display mode
 * - Half-star support
 * - Size variants: sm, md, lg
 * - Accessible ARIA attributes
 * - Dark mode support
 * - Customizable icons
 *
 * @example
 * ```tsx
 * <Rating
 *   value={4}
 *   max={5}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Rating
 *   value={3.5}
 *   readOnly
 *   allowHalf
 *   size="lg"
 * />
 * ```
 */
export default function Rating(props: Readonly<RatingProps>) {
	const { containerProps, contentProps, restProps } = useRating(props);

	return (
		<RatingContainer containerProps={containerProps} restProps={restProps}>
			<RatingContent {...contentProps} />
		</RatingContainer>
	);
}

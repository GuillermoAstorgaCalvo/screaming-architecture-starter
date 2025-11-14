import {
	DEFAULT_DIRECTION,
	DEFAULT_LOOP,
	DEFAULT_PAUSE_ON_HOVER,
	DEFAULT_SPEED,
} from '@core/ui/media/marquee/constants/Marquee.constants';
import { shouldShowMeasure } from '@core/ui/media/marquee/helpers/useMarqueeHelpers';
import { useMarquee } from '@core/ui/media/marquee/hooks/useMarquee';
import { useMarqueeState } from '@core/ui/media/marquee/hooks/useMarqueeHooks';
import type { MarqueeProps } from '@src-types/ui/layout/marquee';

/**
 * Hook to manage all marquee logic
 */
export function useMarqueeLogic(props: Readonly<MarqueeProps>) {
	const {
		children,
		direction = DEFAULT_DIRECTION,
		speed = DEFAULT_SPEED,
		pauseOnHover = DEFAULT_PAUSE_ON_HOVER,
		loop = DEFAULT_LOOP,
		duplicateCount: providedDuplicateCount,
	} = props;

	const { containerRef } = useMarquee({ direction, speed, pauseOnHover, loop });
	const { contentRef, animationStyle, loopAnimationStyle, duplicatedContent, measureRef } =
		useMarqueeState({
			children,
			direction,
			speed,
			pauseOnHover,
			loop,
			providedDuplicateCount,
			containerRef,
		});

	const showMeasure = shouldShowMeasure(loop, providedDuplicateCount);

	return {
		containerRef,
		contentRef,
		animationStyle,
		loopAnimationStyle,
		duplicatedContent,
		measureRef,
		showMeasure,
		loop,
	};
}

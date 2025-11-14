import { ARIA_LABELS } from '@core/constants/aria';
import { MarqueeContainer } from '@core/ui/media/marquee/components/MarqueeContainer';
import { useMarqueeLogic } from '@core/ui/media/marquee/hooks/useMarqueeLogic';
import type { MarqueeProps } from '@src-types/ui/layout/marquee';

/**
 * Marquee - Auto-scrolling text/banner component
 *
 * Features:
 * - Horizontal scrolling (left/right)
 * - Configurable scroll speed
 * - Pause on hover
 * - Seamless looping
 * - Accessible with proper ARIA attributes
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Marquee>
 *   <span>Breaking news: Important announcement</span>
 * </Marquee>
 * ```
 *
 * @example
 * ```tsx
 * <Marquee
 *   direction="right"
 *   speed={30}
 *   pauseOnHover
 * >
 *   <div className="flex gap-4">
 *     <Badge>New</Badge>
 *     <Badge>Featured</Badge>
 *     <Badge>Sale</Badge>
 *   </div>
 * </Marquee>
 * ```
 */
export default function Marquee(props: Readonly<MarqueeProps>) {
	const {
		children,
		className,
		'aria-label': ariaLabel = ARIA_LABELS.MARQUEE,
		...restProps
	} = props;

	const {
		containerRef,
		contentRef,
		animationStyle,
		loopAnimationStyle,
		duplicatedContent,
		measureRef,
		showMeasure,
		loop,
	} = useMarqueeLogic(props);

	return (
		<MarqueeContainer
			containerRef={containerRef}
			contentRef={contentRef}
			showMeasure={showMeasure}
			loop={loop}
			loopAnimationStyle={loopAnimationStyle}
			animationStyle={animationStyle}
			duplicatedContent={duplicatedContent}
			measureRef={measureRef}
			className={className}
			aria-label={ariaLabel}
			{...restProps}
		>
			{children}
		</MarqueeContainer>
	);
}

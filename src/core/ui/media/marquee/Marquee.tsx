import { ARIA_LABELS } from '@core/constants/aria';
import { shouldShowMeasure } from '@core/ui/media/marquee/helpers/useMarqueeHelpers';
import { useMarquee } from '@core/ui/media/marquee/hooks/useMarquee';
import { useMarqueeState } from '@core/ui/media/marquee/hooks/useMarqueeHooks';
import { classNames } from '@core/utils/classNames';
import type { MarqueeProps } from '@src-types/ui/layout/marquee';
import type { CSSProperties, ReactNode, RefObject } from 'react';

const DEFAULT_SPEED = 50;
const DEFAULT_DIRECTION = 'left';
const DEFAULT_PAUSE_ON_HOVER = true;
const DEFAULT_LOOP = true;

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

/**
 * Render the marquee content wrapper
 */
function MarqueeContent({
	contentRef,
	loop,
	loopAnimationStyle,
	animationStyle,
	duplicatedContent,
}: Readonly<{
	contentRef: RefObject<HTMLDivElement | null>;
	loop: boolean;
	loopAnimationStyle: CSSProperties | undefined;
	animationStyle: CSSProperties;
	duplicatedContent: ReactNode[];
}>) {
	return (
		<div ref={contentRef} className="flex" style={loop ? loopAnimationStyle : animationStyle}>
			{duplicatedContent}
		</div>
	);
}

const BASE_CLASSES = 'relative flex w-full overflow-hidden whitespace-nowrap will-change-transform';

/**
 * Render the measure element for calculating duplicate count
 */
function MeasureElement({
	children,
	measureRef,
}: Readonly<{ children: ReactNode; measureRef: RefObject<HTMLDivElement | null> }>) {
	return (
		<div ref={measureRef} className="invisible absolute -z-10 flex" aria-hidden="true">
			{children}
		</div>
	);
}

interface MarqueeContainerProps {
	readonly containerRef: RefObject<HTMLDivElement | null>;
	readonly contentRef: RefObject<HTMLDivElement | null>;
	readonly showMeasure: boolean;
	readonly loop: boolean;
	readonly loopAnimationStyle: CSSProperties | undefined;
	readonly animationStyle: CSSProperties;
	readonly duplicatedContent: ReactNode[];
	readonly measureRef: RefObject<HTMLDivElement | null>;
	readonly children: ReactNode;
	readonly className?: string | undefined;
	readonly 'aria-label'?: string | undefined;
}

/**
 * Render the marquee container
 */
function MarqueeContainer({
	containerRef,
	contentRef,
	showMeasure,
	loop,
	loopAnimationStyle,
	animationStyle,
	duplicatedContent,
	measureRef,
	children,
	className,
	'aria-label': ariaLabel,
	...props
}: Readonly<MarqueeContainerProps & Omit<MarqueeProps, 'children' | 'className' | 'aria-label'>>) {
	return (
		<div
			ref={containerRef}
			role="marquee"
			aria-label={ariaLabel}
			aria-live="polite"
			className={classNames(BASE_CLASSES, className)}
			{...props}
		>
			{showMeasure ? <MeasureElement measureRef={measureRef}>{children}</MeasureElement> : null}
			<MarqueeContent
				contentRef={contentRef}
				loop={loop}
				loopAnimationStyle={loopAnimationStyle}
				animationStyle={animationStyle}
				duplicatedContent={duplicatedContent}
			/>
		</div>
	);
}

/**
 * Hook to manage all marquee logic
 */
function useMarqueeLogic(props: Readonly<MarqueeProps>) {
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

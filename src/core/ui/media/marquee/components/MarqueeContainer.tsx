import { MarqueeContent } from '@core/ui/media/marquee/components/MarqueeContent';
import { MeasureElement } from '@core/ui/media/marquee/components/MeasureElement';
import { BASE_CLASSES } from '@core/ui/media/marquee/constants/Marquee.constants';
import { classNames } from '@core/utils/classNames';
import type { MarqueeProps } from '@src-types/ui/layout/marquee';
import type { CSSProperties, ReactNode, RefObject } from 'react';

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
export function MarqueeContainer({
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

import type { CSSProperties, ReactNode, RefObject } from 'react';

interface MarqueeContentProps {
	readonly contentRef: RefObject<HTMLDivElement | null>;
	readonly loop: boolean;
	readonly loopAnimationStyle: CSSProperties | undefined;
	readonly animationStyle: CSSProperties;
	readonly duplicatedContent: ReactNode[];
}

/**
 * Render the marquee content wrapper
 */
export function MarqueeContent({
	contentRef,
	loop,
	loopAnimationStyle,
	animationStyle,
	duplicatedContent,
}: Readonly<MarqueeContentProps>) {
	return (
		<div ref={contentRef} className="flex" style={loop ? loopAnimationStyle : animationStyle}>
			{duplicatedContent}
		</div>
	);
}

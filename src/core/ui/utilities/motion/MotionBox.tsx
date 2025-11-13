import { createMotionProps } from '@core/ui/utilities/motion/helpers/MotionBox/createMotionProps';
import { renderMotionComponent } from '@core/ui/utilities/motion/helpers/MotionBox/renderMotionComponent';
import { useMotionConfig } from '@core/ui/utilities/motion/hooks/useMotionConfig';
import type { MotionBoxProps } from '@core/ui/utilities/motion/types/motionTypes';

export function MotionBox({
	variant = 'fade',
	duration = 'normal',
	ease = 'ease-out',
	delay = 0,
	initial = false,
	repeat = false,
	repeatType = 'loop',
	className,
	children,
	as,
	reducedMotionStrategy = 'fade',
	...props
}: Readonly<MotionBoxProps>) {
	const { createTransition, resolveReducedMotionStrategy } = useMotionConfig();
	const strategy = resolveReducedMotionStrategy(reducedMotionStrategy);
	const motionProps = createMotionProps({
		strategy,
		variant,
		duration,
		ease,
		delay,
		initial,
		repeat,
		repeatType,
		createTransition,
		props,
	});

	return renderMotionComponent({ as, className, motionProps, children });
}

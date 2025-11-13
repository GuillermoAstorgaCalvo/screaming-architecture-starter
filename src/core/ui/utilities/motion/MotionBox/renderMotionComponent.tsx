import type { HTMLElementType, MotionBoxProps } from '@core/ui/motion/motionTypes';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import type { MotionBoxMotionProps } from './createMotionProps';

interface RenderMotionConfig {
	as: MotionBoxProps['as'];
	className: string | undefined;
	motionProps: MotionBoxMotionProps;
	children: ReactNode;
}

const motionElementMap = motion as unknown as Record<HTMLElementType, typeof motion.div>;

export function renderMotionComponent(config: RenderMotionConfig) {
	const { as, className, motionProps, children } = config;

	if (!as) {
		return (
			<motion.div className={twMerge(className)} {...motionProps}>
				{children}
			</motion.div>
		);
	}

	const CustomComponent = motionElementMap[as];

	return (
		<CustomComponent className={twMerge(className)} {...motionProps}>
			{children}
		</CustomComponent>
	);
}

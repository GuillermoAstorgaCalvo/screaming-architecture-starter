/**
 * MotionProvider - Framer Motion global configuration wrapper
 *
 * Wraps LazyMotion and MotionConfig so we can enable feature tree-shaking
 * while supplying consistent animation defaults (reduced motion, transitions, etc.).
 */

import { domMax, LazyMotion, MotionConfig, type MotionConfigProps } from 'framer-motion';
import type { ComponentProps, ReactNode } from 'react';

/**
 * Props for MotionProvider wrapper
 */
type LazyMotionProps = ComponentProps<typeof LazyMotion>;

export interface MotionProviderProps extends MotionConfigProps {
	/** Children to animate */
	children: ReactNode;
	/** Feature bundle loader for LazyMotion @default domAnimation */
	features?: LazyMotionProps['features'];
	/** Enable StrictMode compatibility warnings from LazyMotion */
	strict?: LazyMotionProps['strict'];
}

const defaultFeatures: NonNullable<LazyMotionProps['features']> = domMax;

/**
 * MotionProvider component
 *
 * Ensures the app tree uses LazyMotion for feature level tree-shaking
 * and shares MotionConfig defaults across all animations.
 */
export function MotionProvider({
	children,
	features = defaultFeatures,
	strict,
	...motionConfigProps
}: Readonly<MotionProviderProps>) {
	const lazyMotionProps: Partial<LazyMotionProps> = {};
	if (strict !== undefined) {
		lazyMotionProps.strict = strict;
	}

	return (
		<LazyMotion features={features} {...lazyMotionProps}>
			<MotionConfig {...motionConfigProps}>{children}</MotionConfig>
		</LazyMotion>
	);
}

/**
 * Scale configuration helpers
 * Functions for extracting and configuring scale animation props
 */

import type { MotionScaleProps } from '@core/ui/utilities/motion/types/motionTypes';

/**
 * Scale animation configuration
 */
export interface ScaleConfig {
	initialScale: number;
	finalScale: number;
	duration: MotionScaleProps['duration'];
	ease: MotionScaleProps['ease'];
	delay: MotionScaleProps['delay'];
	initial: MotionScaleProps['initial'];
}

/**
 * Extract scale animation config from props
 */

const DEFAULT_SCALE_CONFIG: ScaleConfig = {
	initialScale: 0.95,
	finalScale: 1,
	duration: 'normal',
	ease: 'ease-out',
	delay: 0,
	initial: false,
};

function applyScaleOverride<K extends keyof ScaleConfig>(
	config: ScaleConfig,
	key: K,
	value: MotionScaleProps[K]
) {
	if (value !== undefined) {
		config[key] = value as ScaleConfig[K];
	}
}

export function extractScaleConfig(props: Readonly<MotionScaleProps>): ScaleConfig {
	const config: ScaleConfig = { ...DEFAULT_SCALE_CONFIG };

	applyScaleOverride(config, 'initialScale', props.initialScale);
	applyScaleOverride(config, 'finalScale', props.finalScale);
	applyScaleOverride(config, 'duration', props.duration);
	applyScaleOverride(config, 'ease', props.ease);
	applyScaleOverride(config, 'delay', props.delay);
	applyScaleOverride(config, 'initial', props.initial);

	return config;
}

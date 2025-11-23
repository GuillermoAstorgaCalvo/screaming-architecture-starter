/**
 * Tests for motion props helpers
 *
 * Tests the motion props helper functions:
 * - buildGestureLayoutProps
 * - buildMotionProps
 * - filterDefinedProps (internal)
 * - getGestureLayoutKeys (internal)
 */

import {
	buildGestureLayoutProps,
	buildMotionProps,
	type GestureLayoutProps,
	type MotionPropsConfig,
} from '@core/ui/utilities/motion/helpers/motionPropsHelpers';
import type { Variants } from 'framer-motion';
import { describe, expect, it, vi } from 'vitest';

describe('buildGestureLayoutProps - basic behavior', () => {
	it('returns empty object when no props are provided', () => {
		const result = buildGestureLayoutProps({});

		expect(result).toEqual({});
	});

	it('filters out undefined properties', () => {
		const props: GestureLayoutProps = {
			layout: true,
			layoutId: undefined,
			whileHover: { scale: 1.1 },
			whileTap: undefined,
		};

		const result = buildGestureLayoutProps(props);

		expect(result).toEqual({
			layout: true,
			whileHover: { scale: 1.1 },
		});
		expect(result).not.toHaveProperty('layoutId');
		expect(result).not.toHaveProperty('whileTap');
	});

	it('handles partial props correctly', () => {
		const props: GestureLayoutProps = {
			layout: 'position',
			drag: 'x',
			whileHover: { opacity: 0.8 },
		};

		const result = buildGestureLayoutProps(props);

		expect(result).toEqual({
			layout: 'position',
			drag: 'x',
			whileHover: { opacity: 0.8 },
		});
	});
});

describe('buildGestureLayoutProps - complete props', () => {
	it('includes all gesture and layout props when provided', () => {
		const props: GestureLayoutProps = {
			layout: true,
			layoutId: 'test-id',
			whileHover: { scale: 1.1 },
			whileTap: { scale: 0.9 },
			drag: true,
			dragConstraints: { left: 0, right: 100 },
			dragElastic: 0.2,
			dragMomentum: false,
			dragTransition: { type: 'spring' } as any,
			onDragStart: vi.fn(),
			onDragEnd: vi.fn(),
		};

		const result = buildGestureLayoutProps(props);

		expect(result).toEqual({
			layout: true,
			layoutId: 'test-id',
			whileHover: { scale: 1.1 },
			whileTap: { scale: 0.9 },
			drag: true,
			dragConstraints: { left: 0, right: 100 },
			dragElastic: 0.2,
			dragMomentum: false,
			dragTransition: { type: 'spring' },
			onDragStart: props.onDragStart,
			onDragEnd: props.onDragEnd,
		});
	});
});

describe('buildGestureLayoutProps - drag constraints', () => {
	it('handles drag constraints as object', () => {
		const props: GestureLayoutProps = {
			drag: true,
			dragConstraints: { top: 0, bottom: 200, left: 0, right: 300 },
		};

		const result = buildGestureLayoutProps(props);

		expect(result).toEqual({
			drag: true,
			dragConstraints: { top: 0, bottom: 200, left: 0, right: 300 },
		});
	});

	it('handles drag constraints as ref', () => {
		const ref = { current: document.createElement('div') };
		const props: GestureLayoutProps = {
			drag: true,
			dragConstraints: ref,
		};

		const result = buildGestureLayoutProps(props);

		expect(result).toEqual({
			drag: true,
			dragConstraints: ref,
		});
	});
});

const mockVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
	exit: { opacity: 0 },
};

describe('buildMotionProps - minimal configuration', () => {
	it('builds motion props with minimal configuration', () => {
		const config: MotionPropsConfig = {
			variants: mockVariants,
			initialState: 'hidden',
			customTransition: {
				duration: 0.3,
				ease: [0.25, 0.1, 0.25, 1],
				delay: 0,
			},
			repeat: false,
			repeatType: 'loop',
			props: {},
		};

		const result = buildMotionProps(config);

		expect(result).toMatchObject({
			initial: 'hidden',
			animate: 'visible',
			exit: 'exit',
			variants: mockVariants,
			transition: {
				duration: 0.3,
				ease: [0.25, 0.1, 0.25, 1],
				delay: 0,
			},
		});
		expect(result).not.toHaveProperty('repeat');
		expect(result).not.toHaveProperty('repeatType');
	});
});

describe('buildMotionProps - additional props', () => {
	it('includes additional props from config', () => {
		const config: MotionPropsConfig = {
			variants: mockVariants,
			initialState: 'hidden',
			customTransition: {
				duration: 0.3,
				ease: [0.25, 0.1, 0.25, 1],
				delay: 0,
			},
			repeat: false,
			repeatType: 'loop',
			props: {
				style: { color: 'red' },
				'data-testid': 'motion-element',
			} as any,
		};

		const result = buildMotionProps(config);

		expect(result).toMatchObject({
			style: { color: 'red' },
			'data-testid': 'motion-element',
		});
	});
});

describe('buildMotionProps - initial states', () => {
	it('handles different initial states', () => {
		const config1: MotionPropsConfig = {
			variants: mockVariants,
			initialState: 'hidden',
			customTransition: {
				duration: 0.3,
				ease: [0.25, 0.1, 0.25, 1],
				delay: 0,
			},
			repeat: false,
			repeatType: 'loop',
			props: {},
		};

		const config2: MotionPropsConfig = {
			...config1,
			initialState: 'visible',
		};

		const result1 = buildMotionProps(config1);
		const result2 = buildMotionProps(config2);

		expect(result1.initial).toBe('hidden');
		expect(result2.initial).toBe('visible');
	});
});

describe('buildMotionProps - repeat when true', () => {
	it('includes repeat when repeat is true', () => {
		const config: MotionPropsConfig = {
			variants: mockVariants,
			initialState: 'visible',
			customTransition: {
				duration: 0.5,
				ease: [0.25, 0.1, 0.25, 1],
				delay: 0,
			},
			repeat: true,
			repeatType: 'loop',
			props: {},
		};

		const result = buildMotionProps(config);

		expect(result).toMatchObject({
			initial: 'visible',
			animate: 'visible',
			exit: 'exit',
			variants: mockVariants,
			repeat: Infinity,
			repeatType: 'loop',
		});
	});
});

describe('buildMotionProps - repeat with numeric value', () => {
	it('includes repeat with numeric value', () => {
		const config: MotionPropsConfig = {
			variants: mockVariants,
			initialState: 'hidden',
			customTransition: {
				duration: 0.2,
				ease: [0.25, 0.1, 0.25, 1],
				delay: 0,
			},
			repeat: 3,
			repeatType: 'reverse',
			props: {},
		};

		const result = buildMotionProps(config);

		expect(result).toMatchObject({
			repeat: 3,
			repeatType: 'reverse',
		});
	});
});

describe('buildMotionProps - repeat types', () => {
	it('handles different repeat types', () => {
		const baseConfig: Omit<MotionPropsConfig, 'repeat' | 'repeatType'> = {
			variants: mockVariants,
			initialState: 'hidden',
			customTransition: {
				duration: 0.3,
				ease: [0.25, 0.1, 0.25, 1],
				delay: 0,
			},
			props: {},
		};

		const loopConfig: MotionPropsConfig = {
			...baseConfig,
			repeat: true,
			repeatType: 'loop',
		};

		const reverseConfig: MotionPropsConfig = {
			...baseConfig,
			repeat: true,
			repeatType: 'reverse',
		};

		const mirrorConfig: MotionPropsConfig = {
			...baseConfig,
			repeat: true,
			repeatType: 'mirror',
		};

		expect((buildMotionProps(loopConfig) as any).repeatType).toBe('loop');
		expect((buildMotionProps(reverseConfig) as any).repeatType).toBe('reverse');
		expect((buildMotionProps(mirrorConfig) as any).repeatType).toBe('mirror');
	});
});

describe('buildMotionProps - merge props with repeat', () => {
	it('merges props correctly with repeat', () => {
		const config: MotionPropsConfig = {
			variants: mockVariants,
			initialState: 'hidden',
			customTransition: {
				duration: 0.3,
				ease: [0.25, 0.1, 0.25, 1],
				delay: 0,
			},
			repeat: 2,
			repeatType: 'reverse',
			props: {
				'data-testid': 'test',
			} as any,
		};

		const result = buildMotionProps(config);

		expect(result).toMatchObject({
			initial: 'hidden',
			animate: 'visible',
			exit: 'exit',
			variants: mockVariants,
			repeat: 2,
			repeatType: 'reverse',
			'data-testid': 'test',
		});
	});
});

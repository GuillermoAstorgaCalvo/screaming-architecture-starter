/**
 * Tests for scaleProps helper
 *
 * Tests the scale props functions:
 * - Gesture layout props extraction
 * - Scale motion props building
 * - All motion props building
 */

import { buildGestureLayoutProps } from '@core/ui/utilities/motion/helpers/motionPropsHelpers';
import {
	extractScaleConfig,
	type ScaleConfig,
} from '@core/ui/utilities/motion/helpers/MotionScale/scaleConfig';
import {
	buildAllMotionProps,
	buildScaleMotionProps,
	extractGestureLayoutProps,
} from '@core/ui/utilities/motion/helpers/MotionScale/scaleProps';
import {
	buildScaleAnimateState,
	buildScaleExitState,
	getScaleInitialState,
} from '@core/ui/utilities/motion/helpers/MotionScale/scaleState';
import { buildScaleTransition } from '@core/ui/utilities/motion/helpers/MotionScale/scaleTransition';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/utilities/motion/helpers/motionPropsHelpers');
vi.mock('@core/ui/utilities/motion/helpers/MotionScale/scaleState');
vi.mock('@core/ui/utilities/motion/helpers/MotionScale/scaleTransition');
vi.mock('@core/ui/utilities/motion/helpers/MotionScale/scaleConfig');

const mockBuildGestureLayoutProps = vi.mocked(buildGestureLayoutProps);
const mockGetScaleInitialState = vi.mocked(getScaleInitialState);
const mockBuildScaleAnimateState = vi.mocked(buildScaleAnimateState);
const mockBuildScaleExitState = vi.mocked(buildScaleExitState);
const mockBuildScaleTransition = vi.mocked(buildScaleTransition);
const mockExtractScaleConfig = vi.mocked(extractScaleConfig);

// Helper functions
const createAllGestureProps = () => ({
	layout: true,
	layoutId: 'test-id',
	whileHover: { scale: 1.1 },
	whileTap: { scale: 0.9 },
	drag: true,
	dragConstraints: { left: 0, right: 100 },
	dragElastic: 0.2,
	dragMomentum: false,
	dragTransition: { type: 'spring' },
	onDragStart: vi.fn(),
	onDragEnd: vi.fn(),
	initialScale: 0.9,
});

const createExpectedAllProps = (props: ReturnType<typeof createAllGestureProps>) => ({
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

const createExpectedUndefinedProps = () => ({
	layout: undefined,
	layoutId: undefined,
	whileHover: undefined,
	whileTap: undefined,
	drag: undefined,
	dragConstraints: undefined,
	dragElastic: undefined,
	dragMomentum: undefined,
	dragTransition: undefined,
	onDragStart: undefined,
	onDragEnd: undefined,
});

describe('extractGestureLayoutProps', () => {
	it('extracts all gesture and layout props', () => {
		const props = createAllGestureProps();
		const result = extractGestureLayoutProps(props as any);
		expect(result).toEqual(createExpectedAllProps(props));
	});

	it('handles undefined gesture props', () => {
		const props = { initialScale: 0.9 };
		const result = extractGestureLayoutProps(props as any);
		expect(result).toEqual(createExpectedUndefinedProps());
	});

	it('handles partial gesture props', () => {
		const props = {
			layout: true,
			drag: 'x',
			onDragStart: vi.fn(),
			initialScale: 0.9,
		};

		const result = extractGestureLayoutProps(props as any);

		expect(result).toEqual({
			layout: true,
			layoutId: undefined,
			whileHover: undefined,
			whileTap: undefined,
			drag: 'x',
			dragConstraints: undefined,
			dragElastic: undefined,
			dragMomentum: undefined,
			dragTransition: undefined,
			onDragStart: props.onDragStart,
			onDragEnd: undefined,
		});
	});
});

// Helper functions for buildScaleMotionProps
const setupScaleMocks = () => {
	mockGetScaleInitialState.mockReturnValue({
		opacity: 0,
		scale: 0.9,
	} as any);
	mockBuildScaleAnimateState.mockReturnValue({
		opacity: 1,
		scale: 1,
	} as any);
	mockBuildScaleExitState.mockReturnValue({
		opacity: 0,
		scale: 0.9,
	} as any);
	mockBuildScaleTransition.mockReturnValue({
		duration: 0.3,
		ease: [0, 0, 0.58, 1],
	} as any);
};

const createScaleMotionParams = (delay = 0) => ({
	initialState: { opacity: 0, scale: 0.9 } as any,
	finalScale: 1,
	initialScale: 0.9,
	duration: 'normal' as const,
	ease: 'ease-out' as const,
	delay,
});

describe('buildScaleMotionProps', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupScaleMocks();
	});

	it('builds scale motion props', () => {
		const params = createScaleMotionParams();
		const result = buildScaleMotionProps(params);

		expect(mockBuildScaleTransition).toHaveBeenCalledWith({
			duration: 'normal',
			ease: 'ease-out',
			delay: 0,
		});
		expect(mockBuildScaleAnimateState).toHaveBeenCalledWith(1);
		expect(mockBuildScaleExitState).toHaveBeenCalledWith(0.9);

		expect(result).toEqual({
			initial: { opacity: 0, scale: 0.9 },
			animate: { opacity: 1, scale: 1 },
			exit: { opacity: 0, scale: 0.9 },
			transition: {
				duration: 0.3,
				ease: [0, 0, 0.58, 1],
			},
		});
	});

	it('handles custom delay', () => {
		mockBuildScaleTransition.mockReturnValue({
			duration: 0.3,
			ease: [0, 0, 0.58, 1],
			delay: 0.5,
		} as any);

		const result = buildScaleMotionProps(createScaleMotionParams(0.5));
		expect(result.transition).toHaveProperty('delay', 0.5);
	});
});

// Helper functions for buildAllMotionProps
const setupDefaultMocks = () => {
	mockExtractScaleConfig.mockReturnValue({
		initialScale: 0.9,
		finalScale: 1,
		duration: 'normal',
		ease: 'ease-out',
		delay: 0,
		initial: false,
	});
	mockGetScaleInitialState.mockReturnValue({
		opacity: 0,
		scale: 0.9,
	} as any);
	mockBuildScaleAnimateState.mockReturnValue({
		opacity: 1,
		scale: 1,
	} as any);
	mockBuildScaleExitState.mockReturnValue({
		opacity: 0,
		scale: 0.9,
	} as any);
	mockBuildScaleTransition.mockReturnValue({
		duration: 0.3,
		ease: [0, 0, 0.58, 1],
	} as any);
	mockBuildGestureLayoutProps.mockReturnValue({});
};

const createScaleConfig = (overrides: Partial<ScaleConfig> = {}): ScaleConfig => ({
	initialScale: 0.9,
	finalScale: 1,
	duration: 'normal' as const,
	ease: 'ease-out' as const,
	delay: 0,
	initial: false,
	...overrides,
});

const assertDefaultConfigCalls = (props: any) => {
	expect(mockExtractScaleConfig).toHaveBeenCalledWith(props);
	expect(mockGetScaleInitialState).toHaveBeenCalledWith(false, 0.9);
	expect(mockBuildScaleTransition).toHaveBeenCalledWith({
		duration: 'normal',
		ease: 'ease-out',
		delay: 0,
	});
	expect(mockBuildScaleAnimateState).toHaveBeenCalledWith(1);
	expect(mockBuildScaleExitState).toHaveBeenCalledWith(0.9);
	expect(mockBuildGestureLayoutProps).toHaveBeenCalled();
};

describe('buildAllMotionProps', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupDefaultMocks();
	});

	describe('default configuration', () => {
		it('builds all motion props with default config', () => {
			const props = { initialScale: 0.9 };
			const result = buildAllMotionProps(props as any);

			assertDefaultConfigCalls(props);
			expect(result).toHaveProperty('motionProps');
			expect(result).toHaveProperty('gestureProps');
		});
	});

	describe('gesture props', () => {
		it('builds all motion props with gesture props', () => {
			const props = {
				initialScale: 0.9,
				layout: true,
				drag: true,
			};

			mockBuildGestureLayoutProps.mockReturnValue({
				layout: true,
				drag: true,
			} as any);

			const result = buildAllMotionProps(props as any);

			expect(result.gestureProps).toEqual({
				layout: true,
				drag: true,
			});
		});
	});

	describe('custom configurations', () => {
		it('handles custom initial state', () => {
			mockExtractScaleConfig.mockReturnValue(createScaleConfig({ initial: true }));
			mockGetScaleInitialState.mockReturnValue('visible' as any);

			const props = { initialScale: 0.9, initial: true };
			buildAllMotionProps(props as any);

			expect(mockGetScaleInitialState).toHaveBeenCalledWith(true, 0.9);
		});

		it('handles custom scale values', () => {
			mockExtractScaleConfig.mockReturnValue(
				createScaleConfig({ initialScale: 0.8, finalScale: 1.1 })
			);

			const props = { initialScale: 0.8, finalScale: 1.1 };
			buildAllMotionProps(props as any);

			expect(mockBuildScaleAnimateState).toHaveBeenCalledWith(1.1);
			expect(mockBuildScaleExitState).toHaveBeenCalledWith(0.8);
		});
	});
});

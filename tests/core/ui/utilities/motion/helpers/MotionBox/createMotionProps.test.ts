/**
 * Tests for createMotionProps helper
 *
 * Tests the createMotionProps function:
 * - Motion props creation
 * - Strategy resolution
 * - Variant handling
 * - Transition building
 * - Repeat configuration
 */

import {
	createMotionProps,
	type CreateMotionPropsParams,
} from '@core/ui/utilities/motion/helpers/MotionBox/createMotionProps';
import { resolveMotionStrategy } from '@core/ui/utilities/motion/helpers/MotionBox/motionStrategy';
import { buildMotionProps } from '@core/ui/utilities/motion/helpers/motionPropsHelpers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/utilities/motion/helpers/MotionBox/motionStrategy');
vi.mock('@core/ui/utilities/motion/helpers/motionPropsHelpers');

const mockResolveMotionStrategy = vi.mocked(resolveMotionStrategy);
const mockBuildMotionProps = vi.mocked(buildMotionProps);

// Helper function to create default motion props
const createDefaultMotionProps = (
	overrides: Partial<CreateMotionPropsParams> = {}
): CreateMotionPropsParams => ({
	strategy: 'normal' as const,
	variant: 'fade',
	duration: 'normal',
	ease: 'ease-out',
	delay: 0,
	initial: false,
	repeat: false,
	repeatType: 'loop',
	createTransition: vi.fn(),
	props: {},
	...overrides,
});

// Helper function to setup mocks
const setupMocks = () => {
	vi.clearAllMocks();
	mockResolveMotionStrategy.mockReturnValue({
		variants: {},
		initialState: 'hidden',
		transition: { duration: 0.3, ease: [0, 0, 0.58, 1], delay: 0 },
		repeat: false,
	});
	mockBuildMotionProps.mockReturnValue({
		initial: 'hidden',
		animate: 'visible',
		exit: 'exit',
		variants: {},
		transition: { duration: 0.3 },
	} as any);
};

beforeEach(() => {
	setupMocks();
});

describe('createMotionProps', () => {
	describe('default behavior', () => {
		it('creates motion props with default values', () => {
			const result = createMotionProps(createDefaultMotionProps());

			expect(mockResolveMotionStrategy).toHaveBeenCalledWith({
				strategy: 'normal',
				variant: 'fade',
				duration: 'normal',
				ease: 'ease-out',
				delay: 0,
				initial: false,
				repeat: false,
				createTransition: expect.any(Function),
			});

			expect(mockBuildMotionProps).toHaveBeenCalledWith({
				variants: {},
				initialState: 'hidden',
				customTransition: { duration: 0.3, ease: [0, 0, 0.58, 1], delay: 0 },
				repeat: false,
				repeatType: 'loop',
				props: {},
			});

			expect(result).toBeDefined();
		});
	});

	describe('configuration options', () => {
		it('creates motion props with custom variant', () => {
			createMotionProps(createDefaultMotionProps({ variant: 'scale' }));

			expect(mockResolveMotionStrategy).toHaveBeenCalledWith(
				expect.objectContaining({
					variant: 'scale',
				})
			);
		});

		it('creates motion props with custom duration', () => {
			createMotionProps(createDefaultMotionProps({ duration: 'slow' }));

			expect(mockResolveMotionStrategy).toHaveBeenCalledWith(
				expect.objectContaining({
					duration: 'slow',
				})
			);
		});

		it('creates motion props with custom ease', () => {
			createMotionProps(createDefaultMotionProps({ ease: 'ease-in' }));

			expect(mockResolveMotionStrategy).toHaveBeenCalledWith(
				expect.objectContaining({
					ease: 'ease-in',
				})
			);
		});

		it('creates motion props with custom delay', () => {
			createMotionProps(createDefaultMotionProps({ delay: 0.5 }));

			expect(mockResolveMotionStrategy).toHaveBeenCalledWith(
				expect.objectContaining({
					delay: 0.5,
				})
			);
		});
	});
});

describe('createMotionProps - initial state', () => {
	it('creates motion props with initial true', () => {
		createMotionProps(createDefaultMotionProps({ initial: true }));

		expect(mockResolveMotionStrategy).toHaveBeenCalledWith(
			expect.objectContaining({
				initial: true,
			})
		);
	});
});

describe('createMotionProps - repeat configuration', () => {
	it('creates motion props with repeat enabled', () => {
		createMotionProps(createDefaultMotionProps({ repeat: true }));

		expect(mockResolveMotionStrategy).toHaveBeenCalledWith(
			expect.objectContaining({
				repeat: true,
			})
		);
	});

	it('creates motion props with custom repeat type', () => {
		mockResolveMotionStrategy.mockReturnValue({
			variants: {},
			initialState: 'hidden',
			transition: { duration: 0.3, ease: [0, 0, 0.58, 1], delay: 0 },
			repeat: true,
		});

		createMotionProps(createDefaultMotionProps({ repeat: true, repeatType: 'reverse' }));

		expect(mockBuildMotionProps).toHaveBeenCalledWith(
			expect.objectContaining({
				repeatType: 'reverse',
			})
		);
	});

	it('uses loop as default repeat type when repeatType is undefined', () => {
		createMotionProps(createDefaultMotionProps({ repeatType: undefined }));

		expect(mockBuildMotionProps).toHaveBeenCalledWith(
			expect.objectContaining({
				repeatType: 'loop',
			})
		);
	});
});

describe('createMotionProps - props forwarding', () => {
	it('forwards additional props to buildMotionProps', () => {
		const additionalProps = {
			'data-testid': 'test',
			'aria-label': 'Test',
		};

		createMotionProps(createDefaultMotionProps({ props: additionalProps }));

		expect(mockBuildMotionProps).toHaveBeenCalledWith(
			expect.objectContaining({
				props: additionalProps,
			})
		);
	});
});

describe('createMotionProps - strategy handling', () => {
	it('handles different strategies', () => {
		const strategies: Array<'normal' | 'skip' | 'fade' | 'static'> = [
			'normal',
			'skip',
			'fade',
			'static',
		];

		for (const strategy of strategies) {
			createMotionProps(createDefaultMotionProps({ strategy }));

			expect(mockResolveMotionStrategy).toHaveBeenCalledWith(
				expect.objectContaining({
					strategy,
				})
			);
		}
	});
});

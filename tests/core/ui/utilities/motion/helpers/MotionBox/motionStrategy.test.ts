/**
 * Tests for motionStrategy helper
 *
 * Tests the resolveMotionStrategy function:
 * - Strategy resolution
 * - Variant selection
 * - Initial state selection
 * - Transition building
 * - Repeat handling
 */

import { resolveMotionStrategy } from '@core/ui/utilities/motion/helpers/MotionBox/motionStrategy';
import { getInitialState } from '@core/ui/utilities/motion/helpers/motionStateHelpers';
import { createTransition } from '@core/ui/utilities/motion/helpers/motionUtils';
import { getVariant } from '@core/ui/utilities/motion/helpers/motionVariantHelpers';
import {
	REDUCED_FADE_VARIANTS,
	STATIC_VARIANTS,
	withInstantTransitions,
} from '@core/ui/utilities/motion/variants/reducedMotionVariants';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/utilities/motion/helpers/motionStateHelpers');
vi.mock('@core/ui/utilities/motion/helpers/motionVariantHelpers');
vi.mock('@core/ui/utilities/motion/variants/reducedMotionVariants', async () => {
	const actual = await vi.importActual('@core/ui/utilities/motion/variants/reducedMotionVariants');
	return {
		...actual,
		withInstantTransitions: vi.fn(variants => variants),
	};
});

const mockGetInitialState = vi.mocked(getInitialState);
const mockGetVariant = vi.mocked(getVariant);
const mockWithInstantTransitions = vi.mocked(withInstantTransitions);

// Use the real createTransition function to get proper conversions
const mockCreateTransition = vi.fn(options => createTransition(options));

const mockVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
	exit: { opacity: 0 },
};

type StrategyParams = Parameters<typeof resolveMotionStrategy>[0];

function createStrategyParams(overrides: Partial<StrategyParams> = {}): StrategyParams {
	return {
		strategy: 'normal',
		variant: 'fade',
		duration: 'normal',
		ease: 'ease-out',
		delay: 0,
		initial: false,
		repeat: false,
		createTransition: mockCreateTransition,
		...overrides,
	};
}

function setupMocks() {
	vi.clearAllMocks();
	mockGetVariant.mockReturnValue(mockVariants as any);
	mockGetInitialState.mockReturnValue('hidden');
	mockWithInstantTransitions.mockImplementation(variants => variants);
}

describe('resolveMotionStrategy - strategy resolution', () => {
	beforeEach(setupMocks);

	describe('normal strategy', () => {
		it('resolves normal strategy with default variant', () => {
			const result = resolveMotionStrategy(createStrategyParams());

			expect(mockGetVariant).toHaveBeenCalledWith('fade');
			expect(mockGetInitialState).toHaveBeenCalledWith(false);
			expect(result.variants).toBe(mockVariants);
			expect(result.initialState).toBe('hidden');
			expect(result.repeat).toBe(false);
			expect(result.transition).toEqual({
				duration: 0.2, // normal duration: 200ms = 0.2s
				ease: [0, 0, 0.58, 1],
				delay: 0,
			});
		});
	});
});

describe('resolveMotionStrategy - skip strategy', () => {
	beforeEach(setupMocks);

	it('resolves skip strategy', () => {
		const result = resolveMotionStrategy(createStrategyParams({ strategy: 'skip' }));

		expect(mockGetVariant).not.toHaveBeenCalled();
		expect(result.variants).toBe(STATIC_VARIANTS);
		expect(result.initialState).toBe('visible');
		expect(result.repeat).toBe(false);
		expect(result.transition.duration).toBe(0);
		expect(result.transition.delay).toBe(0);
	});
});

describe('resolveMotionStrategy - fade strategy', () => {
	beforeEach(setupMocks);

	it('resolves fade strategy', () => {
		const result = resolveMotionStrategy(
			createStrategyParams({
				strategy: 'fade',
				variant: 'scale',
				duration: 'slow',
				ease: 'ease-in',
				delay: 0.5,
			})
		);

		expect(mockGetVariant).not.toHaveBeenCalled();
		expect(result.variants).toBe(REDUCED_FADE_VARIANTS);
		expect(result.initialState).toBe('hidden');
		expect(result.repeat).toBe(false);
		expect(result.transition.duration).toBe(0.1); // micro duration: 100ms = 0.1s
		expect(result.transition.ease).toEqual([0, 0, 0.58, 1]); // ease-out (overridden for fade)
		expect(result.transition.delay).toBe(0.5); // delay is not overridden for fade strategy
	});
});

describe('resolveMotionStrategy - static strategy', () => {
	beforeEach(setupMocks);

	it('resolves static strategy', () => {
		mockGetVariant.mockReturnValue(mockVariants as any);
		const result = resolveMotionStrategy(createStrategyParams({ strategy: 'static' }));

		expect(mockGetVariant).toHaveBeenCalledWith('fade');
		expect(mockWithInstantTransitions).toHaveBeenCalledWith(mockVariants);
		expect(result.variants).toBe(mockVariants);
		expect(result.initialState).toBe('hidden');
		expect(result.repeat).toBe(false);
		expect(result.transition.duration).toBe(0);
		expect(result.transition.delay).toBe(0);
	});
});

describe('resolveMotionStrategy - variant handling', () => {
	beforeEach(setupMocks);

	it('handles undefined variant with normal strategy', () => {
		resolveMotionStrategy(createStrategyParams({ variant: undefined }));

		expect(mockGetVariant).toHaveBeenCalledWith('fade');
	});
});

describe('resolveMotionStrategy - transition configuration', () => {
	beforeEach(setupMocks);

	describe('duration', () => {
		it('handles custom duration with normal strategy', () => {
			const result = resolveMotionStrategy(createStrategyParams({ duration: 'slow' }));

			expect(mockCreateTransition).toHaveBeenCalledWith({
				duration: 'slow',
				ease: 'ease-out',
				delay: 0,
			});
			expect(result.transition.duration).toBe(0.3); // slow duration: 300ms = 0.3s
		});
	});

	describe('ease', () => {
		it('handles custom ease with normal strategy', () => {
			const result = resolveMotionStrategy(createStrategyParams({ ease: 'ease-in' }));

			expect(mockCreateTransition).toHaveBeenCalledWith({
				duration: 'normal',
				ease: 'ease-in',
				delay: 0,
			});
			expect(result.transition.ease).toEqual([0.42, 0, 1, 1]);
		});
	});

	describe('delay', () => {
		it('handles custom delay with normal strategy', () => {
			const result = resolveMotionStrategy(createStrategyParams({ delay: 0.5 }));

			expect(mockCreateTransition).toHaveBeenCalledWith({
				duration: 'normal',
				ease: 'ease-out',
				delay: 0.5,
			});
			expect(result.transition.delay).toBe(0.5);
		});
	});
});

describe('resolveMotionStrategy - initial state handling', () => {
	beforeEach(setupMocks);

	it('handles initial true', () => {
		mockGetInitialState.mockReturnValue('visible');
		const result = resolveMotionStrategy(createStrategyParams({ initial: true }));

		expect(mockGetInitialState).toHaveBeenCalledWith(true);
		expect(result.initialState).toBe('visible');
	});

	it('handles initial undefined', () => {
		mockGetInitialState.mockReturnValue('hidden');
		const result = resolveMotionStrategy(createStrategyParams({ initial: undefined }));

		expect(mockGetInitialState).toHaveBeenCalledWith(false); // undefined defaults to false via ??
		expect(result.initialState).toBe('hidden');
	});
});

describe('resolveMotionStrategy - repeat handling', () => {
	beforeEach(setupMocks);

	it('handles repeat true with normal strategy', () => {
		const result = resolveMotionStrategy(createStrategyParams({ repeat: true }));

		expect(result.repeat).toBe(true);
	});

	it('handles repeat false with normal strategy', () => {
		const result = resolveMotionStrategy(createStrategyParams({ repeat: false }));

		expect(result.repeat).toBe(false);
	});

	it('handles repeat undefined with normal strategy', () => {
		const result = resolveMotionStrategy(createStrategyParams({ repeat: undefined }));

		expect(result.repeat).toBe(false);
	});
});

describe('resolveMotionStrategy - strategy-specific overrides', () => {
	beforeEach(setupMocks);

	describe('repeat disabling', () => {
		it('disables repeat for skip strategy even when repeat is true', () => {
			const result = resolveMotionStrategy(
				createStrategyParams({ strategy: 'skip', repeat: true })
			);

			expect(result.repeat).toBe(false);
		});

		it('disables repeat for fade strategy even when repeat is true', () => {
			const result = resolveMotionStrategy(
				createStrategyParams({ strategy: 'fade', repeat: true })
			);

			expect(result.repeat).toBe(false);
		});

		it('disables repeat for static strategy even when repeat is true', () => {
			const result = resolveMotionStrategy(
				createStrategyParams({ strategy: 'static', repeat: true })
			);

			expect(result.repeat).toBe(false);
		});
	});

	describe('delay override', () => {
		it('sets delay to 0 for skip strategy regardless of input', () => {
			const result = resolveMotionStrategy(createStrategyParams({ strategy: 'skip', delay: 0.5 }));

			expect(mockCreateTransition).toHaveBeenCalledWith({
				duration: 'instant',
				ease: 'ease-out',
				delay: 0,
			});
			expect(result.transition.delay).toBe(0);
		});

		it('sets delay to 0 for static strategy regardless of input', () => {
			const result = resolveMotionStrategy(
				createStrategyParams({ strategy: 'static', delay: 0.5 })
			);

			expect(mockCreateTransition).toHaveBeenCalledWith({
				duration: 'instant',
				ease: 'ease-out',
				delay: 0,
			});
			expect(result.transition.delay).toBe(0);
		});
	});
});

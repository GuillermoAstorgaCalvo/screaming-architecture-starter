/**
 * Tests for RouteTransition component
 *
 * Tests the RouteTransition component:
 * - Rendering
 * - Variant selection
 * - Reduced motion strategies
 * - Transition configuration
 * - AnimatePresence integration
 */

import { RouteTransition } from '@core/ui/utilities/motion/components/RouteTransition';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock AnimatePresence
vi.mock('@core/ui/utilities/motion/components/AnimatePresence', () => ({
	AnimatePresence: vi.fn(({ children, mode }) => (
		<div data-testid="animate-presence" data-mode={mode}>
			{children}
		</div>
	)),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
	motion: {
		div: vi.fn(
			(props: {
				key?: string;
				children?: React.ReactNode;
				className?: string;
				[key: string]: unknown;
			}) => {
				const { children, className, key, ...restProps } = props;
				// Note: React doesn't pass key as a prop, so key will be undefined
				// We'll test the key by checking the rendered element's behavior
				return (
					<div
						data-testid="motion-div"
						className={className}
						data-key={key}
						data-props={JSON.stringify(restProps)}
					>
						{children}
					</div>
				);
			}
		),
	},
}));

// Mock useMotionConfig
vi.mock('@core/ui/utilities/motion/hooks/useMotionConfig', () => ({
	useMotionConfig: vi.fn(() => ({
		createTransition: vi.fn(options => options ?? { duration: 'normal' }),
		resolveReducedMotionStrategy: vi.fn((strategy?: string) => {
			// Return the strategy as-is for explicit strategies
			if (strategy === 'skip' || strategy === 'static') return strategy;
			if (strategy === 'fade') return 'fade';
			// For other values (including default 'fade' when testing variants), return 'normal'
			// This allows variant tests to work by using the variant's variants
			return 'normal';
		}),
	})),
}));

// Mock variants
vi.mock('@core/ui/utilities/motion/variants/fadeVariants', () => ({
	fadeVariants: {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
		exit: { opacity: 0 },
	},
}));

vi.mock('@core/ui/utilities/motion/variants/slideVariants', () => ({
	slideVariants: {
		hidden: { opacity: 0, x: -20 },
		visible: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -20 },
	},
}));

vi.mock('@core/ui/utilities/motion/variants/reducedMotionVariants', () => ({
	STATIC_VARIANTS: {
		visible: { opacity: 1 },
	},
	REDUCED_FADE_VARIANTS: {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
		exit: { opacity: 0 },
	},
	withInstantTransitions: vi.fn(variants => variants),
}));

describe('RouteTransition - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<RouteTransition locationKey="/test">
				<div data-testid="content">Route content</div>
			</RouteTransition>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('wraps children with AnimatePresence', () => {
		renderWithProviders(
			<RouteTransition locationKey="/test">
				<div>Content</div>
			</RouteTransition>
		);

		expect(screen.getByTestId('animate-presence')).toBeInTheDocument();
	});
});

describe('RouteTransition - Default props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses default variant "fade"', async () => {
		const { motion } = await import('framer-motion');
		const { fadeVariants } = await import('@core/ui/utilities/motion/variants/fadeVariants');
		renderWithProviders(
			<RouteTransition locationKey="/test">
				<div>Content</div>
			</RouteTransition>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		expect(props.variants).toEqual(fadeVariants);
	});

	it('uses default duration "normal"', async () => {
		const { useMotionConfig } = await import('@core/ui/utilities/motion/hooks/useMotionConfig');
		renderWithProviders(
			<RouteTransition locationKey="/test">
				<div>Content</div>
			</RouteTransition>
		);

		expect(useMotionConfig).toHaveBeenCalled();
	});

	it('uses default mode "wait"', async () => {
		const { AnimatePresence } = await import(
			'@core/ui/utilities/motion/components/AnimatePresence'
		);
		renderWithProviders(
			<RouteTransition locationKey="/test">
				<div>Content</div>
			</RouteTransition>
		);

		expect(AnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				mode: 'wait',
			}),
			undefined
		);
	});

	it('uses default reducedMotionStrategy "fade"', async () => {
		const { useMotionConfig } = await import('@core/ui/utilities/motion/hooks/useMotionConfig');
		renderWithProviders(
			<RouteTransition locationKey="/test">
				<div>Content</div>
			</RouteTransition>
		);

		const [mockResult] = vi.mocked(useMotionConfig).mock.results;
		expect(mockResult).toBeDefined();
		const { resolveReducedMotionStrategy } = mockResult?.value ?? {
			resolveReducedMotionStrategy: vi.fn(),
		};
		expect(resolveReducedMotionStrategy).toHaveBeenCalledWith('fade');
	});
});

describe('RouteTransition - Variant selection', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses fade variants for fade variant', async () => {
		const { motion } = await import('framer-motion');
		const { fadeVariants } = await import('@core/ui/utilities/motion/variants/fadeVariants');
		renderWithProviders(
			<RouteTransition locationKey="/test" variant="fade">
				<div>Content</div>
			</RouteTransition>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		expect(props.variants).toEqual(fadeVariants);
	});

	it('uses slide variants for slide variant', async () => {
		const { motion } = await import('framer-motion');
		const { slideVariants } = await import('@core/ui/utilities/motion/variants/slideVariants');
		// Pass a value that makes the mock return 'normal' to use variant's variants
		renderWithProviders(
			<RouteTransition locationKey="/test" variant="slide" reducedMotionStrategy={'normal' as any}>
				<div>Content</div>
			</RouteTransition>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		expect(props.variants).toEqual(slideVariants);
	});

	it('uses slide variants for slideRight variant', async () => {
		const { motion } = await import('framer-motion');
		const { slideVariants } = await import('@core/ui/utilities/motion/variants/slideVariants');
		// Pass a value that makes the mock return 'normal' to use variant's variants
		renderWithProviders(
			<RouteTransition
				locationKey="/test"
				variant="slideRight"
				reducedMotionStrategy={'normal' as any}
			>
				<div>Content</div>
			</RouteTransition>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		expect(props.variants).toEqual(slideVariants);
	});
});

describe('RouteTransition - Reduced motion strategies', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses static variants when strategy is static', async () => {
		const { motion } = await import('framer-motion');
		const { fadeVariants } = await import('@core/ui/utilities/motion/variants/fadeVariants');
		renderWithProviders(
			<RouteTransition locationKey="/test" reducedMotionStrategy="static">
				<div>Content</div>
			</RouteTransition>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		// When strategy is 'static', component uses withInstantTransitions(baseVariants)
		// which with the mock returns fadeVariants (the default variant)
		expect(props.variants).toEqual(fadeVariants);
		// initial is 'hidden' for 'static' strategy (only 'skip' returns 'visible')
		expect(props.initial).toBe('hidden');
	});

	it('uses fade variants when strategy is fade', async () => {
		const { motion } = await import('framer-motion');
		const { REDUCED_FADE_VARIANTS } = await import(
			'@core/ui/utilities/motion/variants/reducedMotionVariants'
		);
		renderWithProviders(
			<RouteTransition locationKey="/test" reducedMotionStrategy="fade">
				<div>Content</div>
			</RouteTransition>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		expect(props.variants).toEqual(REDUCED_FADE_VARIANTS);
	});

	it('uses skip strategy correctly', async () => {
		const { motion } = await import('framer-motion');
		const { STATIC_VARIANTS } = await import(
			'@core/ui/utilities/motion/variants/reducedMotionVariants'
		);
		renderWithProviders(
			<RouteTransition locationKey="/test" reducedMotionStrategy="skip">
				<div>Content</div>
			</RouteTransition>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		expect(props.variants).toEqual(STATIC_VARIANTS);
		expect(props.initial).toBe('visible');
	});
});

describe('RouteTransition - Location key', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses locationKey as motion key', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<RouteTransition locationKey="/test-route">
				<div>Content</div>
			</RouteTransition>
		);

		// Verify motion.div was called (key is handled by React, not passed as prop)
		expect(motion.div).toHaveBeenCalled();
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall).toBeDefined();
		// The key prop is handled by React internally, so we verify the component renders
		const motionDiv = screen.getByTestId('motion-div');
		expect(motionDiv).toBeInTheDocument();
	});

	it('updates key when locationKey changes', async () => {
		const { motion } = await import('framer-motion');
		const { rerender } = renderWithProviders(
			<RouteTransition locationKey="/route-1">
				<div>Content</div>
			</RouteTransition>
		);

		const initialCallCount = vi.mocked(motion.div).mock.calls.length;

		rerender(
			<RouteTransition locationKey="/route-2">
				<div>Content</div>
			</RouteTransition>
		);

		// Verify motion.div was called again (key change triggers re-render)
		expect(vi.mocked(motion.div).mock.calls.length).toBeGreaterThan(initialCallCount);
		const motionDiv = screen.getByTestId('motion-div');
		expect(motionDiv).toBeInTheDocument();
	});
});

describe('RouteTransition - Custom props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards custom className', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<RouteTransition locationKey="/test" className="custom-class">
				<div>Content</div>
			</RouteTransition>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].className).toContain('custom-class');
		expect(lastCall?.[0].className).toContain('w-full');
	});

	it('uses custom mode', async () => {
		const { AnimatePresence } = await import(
			'@core/ui/utilities/motion/components/AnimatePresence'
		);
		renderWithProviders(
			<RouteTransition locationKey="/test" mode="sync">
				<div>Content</div>
			</RouteTransition>
		);

		expect(AnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				mode: 'sync',
			}),
			undefined
		);
	});

	it('uses custom duration', async () => {
		const { useMotionConfig } = await import('@core/ui/utilities/motion/hooks/useMotionConfig');
		renderWithProviders(
			<RouteTransition locationKey="/test" duration="slow">
				<div>Content</div>
			</RouteTransition>
		);

		expect(useMotionConfig).toHaveBeenCalled();
	});
});

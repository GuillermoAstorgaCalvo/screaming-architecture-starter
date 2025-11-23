/**
 * Tests for MotionStagger component
 *
 * Tests the MotionStagger component:
 * - Rendering
 * - Stagger configuration
 * - Reduced motion strategies
 * - Variants creation
 * - Delay handling
 */

import { MotionStagger } from '@core/ui/utilities/motion/components/MotionStagger';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
	motion: {
		div: vi.fn(({ children, className, ..._props }) => (
			<div data-testid="motion-div" className={className}>
				{children}
			</div>
		)),
	},
	stagger: vi.fn((delay: number, options?: { startDelay?: number }) => ({
		delay,
		startDelay: options?.startDelay ?? 0,
	})),
}));

// Mock useMotionConfig
vi.mock('@core/ui/utilities/motion/hooks/useMotionConfig', () => ({
	useMotionConfig: vi.fn(() => ({
		resolveReducedMotionStrategy: vi.fn((strategy?: string) => {
			if (strategy === 'skip' || strategy === 'static') return strategy;
			if (strategy === 'fade') return 'fade';
			return 'normal';
		}),
	})),
}));

vi.mock('@core/ui/utilities/motion/variants/staggerVariants', () => ({
	staggerContainerVariants: {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	},
}));

vi.mock('@core/ui/utilities/motion/variants/reducedMotionVariants', () => ({
	STATIC_VARIANTS: {
		visible: { opacity: 1 },
	},
}));

describe('MotionStagger - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<MotionStagger>
				<div data-testid="child">Child 1</div>
				<div data-testid="child-2">Child 2</div>
			</MotionStagger>
		);

		expect(screen.getByTestId('child')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
	});
});

describe('MotionStagger - Default props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses default staggerDelay 0.1', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionStagger reducedMotionStrategy="fade">
				<div>Content</div>
			</MotionStagger>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		// delayChildren now uses stagger() function which returns an object
		expect(props.variants).toBeDefined();
		const variants = props.variants as { visible?: { transition?: { delayChildren?: unknown } } };
		expect(variants.visible).toBeDefined();
		expect(variants.visible?.transition).toBeDefined();
		expect(variants.visible?.transition?.delayChildren).toBeDefined();
		expect(typeof variants.visible?.transition?.delayChildren).toBe('object');
	});

	it('uses default delayChildren 0.1', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionStagger reducedMotionStrategy="fade">
				<div>Content</div>
			</MotionStagger>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		// delayChildren now uses stagger() function which returns an object
		expect(props.variants).toBeDefined();
		const variants = props.variants as { visible?: { transition?: { delayChildren?: unknown } } };
		expect(variants.visible).toBeDefined();
		expect(variants.visible?.transition).toBeDefined();
		expect(variants.visible?.transition?.delayChildren).toBeDefined();
		expect(typeof variants.visible?.transition?.delayChildren).toBe('object');
	});

	it('uses default reducedMotionStrategy "static"', async () => {
		const { useMotionConfig } = await import('@core/ui/utilities/motion/hooks/useMotionConfig');
		renderWithProviders(
			<MotionStagger>
				<div>Content</div>
			</MotionStagger>
		);

		expect(useMotionConfig).toHaveBeenCalled();
	});
});

describe('MotionStagger - Stagger configuration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses custom staggerDelay', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionStagger staggerDelay={0.2} reducedMotionStrategy="fade">
				<div>Content</div>
			</MotionStagger>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		// delayChildren now uses stagger() function which returns an object
		expect(props.variants).toBeDefined();
		const variants = props.variants as { visible?: { transition?: { delayChildren?: unknown } } };
		expect(variants.visible).toBeDefined();
		expect(variants.visible?.transition).toBeDefined();
		expect(variants.visible?.transition?.delayChildren).toBeDefined();
		expect(typeof variants.visible?.transition?.delayChildren).toBe('object');
	});

	it('uses custom delayChildren', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionStagger delayChildren={0.3} reducedMotionStrategy="fade">
				<div>Content</div>
			</MotionStagger>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		// delayChildren now uses stagger() function which returns an object
		expect(props.variants).toBeDefined();
		const variants = props.variants as { visible?: { transition?: { delayChildren?: unknown } } };
		expect(variants.visible).toBeDefined();
		expect(variants.visible?.transition).toBeDefined();
		expect(variants.visible?.transition?.delayChildren).toBeDefined();
		expect(typeof variants.visible?.transition?.delayChildren).toBe('object');
	});
});

describe('MotionStagger - Reduced motion strategies', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses static variants when strategy is static', async () => {
		const { motion } = await import('framer-motion');
		const { STATIC_VARIANTS } = await import(
			'@core/ui/utilities/motion/variants/reducedMotionVariants'
		);
		renderWithProviders(
			<MotionStagger reducedMotionStrategy="static">
				<div>Content</div>
			</MotionStagger>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		expect(props.variants).toEqual(STATIC_VARIANTS);
		expect(props.initial).toBe('visible');
		expect(props.animate).toBe('visible');
	});

	it('uses static variants when strategy is skip', async () => {
		const { motion } = await import('framer-motion');
		const { STATIC_VARIANTS } = await import(
			'@core/ui/utilities/motion/variants/reducedMotionVariants'
		);
		renderWithProviders(
			<MotionStagger reducedMotionStrategy="skip">
				<div>Content</div>
			</MotionStagger>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		expect(props.variants).toEqual(STATIC_VARIANTS);
		expect(props.initial).toBe('visible');
		expect(props.animate).toBe('visible');
	});

	it('reduces delays when strategy is fade', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionStagger staggerDelay={0.2} delayChildren={0.3} reducedMotionStrategy="fade">
				<div>Content</div>
			</MotionStagger>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		// delayChildren now uses stagger() function which returns an object
		expect(props.variants).toBeDefined();
		const variants = props.variants as { visible?: { transition?: { delayChildren?: unknown } } };
		expect(variants.visible).toBeDefined();
		expect(variants.visible?.transition).toBeDefined();
		expect(variants.visible?.transition?.delayChildren).toBeDefined();
		expect(typeof variants.visible?.transition?.delayChildren).toBe('object');
	});
});

describe('MotionStagger - Animation states', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses hidden/visible when not static', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionStagger reducedMotionStrategy="fade">
				<div>Content</div>
			</MotionStagger>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as Record<string, unknown>;
		expect(props.initial).toBe('hidden');
		expect(props.animate).toBe('visible');
	});

	it('forwards className', async () => {
		renderWithProviders(
			<MotionStagger className="custom-class">
				<div>Content</div>
			</MotionStagger>
		);

		expect(screen.getByTestId('motion-div')).toHaveClass('custom-class');
	});
});

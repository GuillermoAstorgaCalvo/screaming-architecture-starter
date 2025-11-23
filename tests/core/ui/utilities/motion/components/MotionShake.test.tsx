/**
 * Tests for MotionShake component
 *
 * Tests the MotionShake component:
 * - Rendering
 * - Animation variants
 * - Initial state handling
 * - Transition configuration
 * - Gesture and layout props
 * - Props forwarding
 */

import { MotionShake } from '@core/ui/utilities/motion/components/MotionShake';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
	motion: {
		div: vi.fn(({ children, className, ...props }) => (
			<div data-testid="motion-div" className={className} data-props={JSON.stringify(props)}>
				{children}
			</div>
		)),
	},
}));

// Mock helpers
vi.mock('@core/ui/utilities/motion/helpers/motionPropsHelpers', () => ({
	buildGestureLayoutProps: vi.fn(props => props),
}));

vi.mock('@core/ui/utilities/motion/helpers/motionUtils', () => ({
	getMotionDuration: vi.fn(duration => {
		const durations: Record<string, number> = {
			fast: 0.2,
			normal: 0.3,
			slow: 0.5,
		};
		return durations[duration ?? 'normal'] ?? 0.3;
	}),
	getMotionEasing: vi.fn(ease => {
		const easings: Record<string, readonly [number, number, number, number]> = {
			ease: [0.25, 0.1, 0.25, 1],
			'ease-out': [0, 0, 0.2, 1],
			'ease-in': [0.4, 0, 1, 1],
		};
		return easings[ease ?? 'ease'] ?? [0.25, 0.1, 0.25, 1];
	}),
}));

vi.mock('@core/ui/utilities/motion/variants/effectVariants', () => ({
	shakeVariants: {
		hidden: { x: 0 },
		visible: {
			x: [0, -10, 10, -10, 10, -5, 5, 0],
			transition: {
				duration: 0.3,
				ease: [0.25, 0.1, 0.25, 1],
			},
		},
		exit: { x: 0 },
	},
}));

describe('MotionShake - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<MotionShake>
				<div data-testid="content">Shake content</div>
			</MotionShake>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});
});

describe('MotionShake - Default props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses default duration "normal"', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake>
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			duration: 0.3, // normal duration
		});
	});

	it('uses default ease "ease"', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake>
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			ease: [0.25, 0.1, 0.25, 1], // ease
		});
	});

	it('uses default delay 0', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake>
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			delay: 0,
		});
	});

	it('uses default initial false', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake>
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.initial).toBe('hidden');
	});
});

describe('MotionShake - Initial state', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles initial true', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake initial={true}>
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.initial).toBe('visible');
	});

	it('handles initial false', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake initial={false}>
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.initial).toBe('hidden');
	});

	it('handles initial "hidden"', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake initial="hidden">
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.initial).toBe('hidden');
	});

	it('handles initial "visible"', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake initial="visible">
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.initial).toBe('visible');
	});
});

describe('MotionShake - Animation configuration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses shakeVariants', async () => {
		const { motion } = await import('framer-motion');
		const { shakeVariants } = await import('@core/ui/utilities/motion/variants/effectVariants');
		renderWithProviders(
			<MotionShake>
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.variants).toEqual(shakeVariants);
	});

	it('sets animate to "visible"', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake>
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.animate).toBe('visible');
	});

	it('sets exit to "exit"', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake>
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.exit).toBe('exit');
	});
});

describe('MotionShake - Custom props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses custom duration', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake duration="slow">
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			duration: 0.5, // slow duration
		});
	});

	it('uses custom ease', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake ease="ease-out">
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			ease: [0, 0, 0.2, 1], // ease-out
		});
	});

	it('uses custom delay', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake delay={0.2}>
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			delay: 0.2,
		});
	});

	it('forwards className', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake className="custom-class">
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].className).toBe('custom-class');
	});
});

describe('MotionShake - Gesture and layout props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards layout prop', async () => {
		const { buildGestureLayoutProps } = await import(
			'@core/ui/utilities/motion/helpers/motionPropsHelpers'
		);
		renderWithProviders(
			<MotionShake layout>
				<div>Content</div>
			</MotionShake>
		);

		expect(buildGestureLayoutProps).toHaveBeenCalledWith(
			expect.objectContaining({
				layout: true,
			})
		);
	});

	it('forwards whileHover prop', async () => {
		const { buildGestureLayoutProps } = await import(
			'@core/ui/utilities/motion/helpers/motionPropsHelpers'
		);
		renderWithProviders(
			<MotionShake whileHover={{ scale: 1.1 }}>
				<div>Content</div>
			</MotionShake>
		);

		expect(buildGestureLayoutProps).toHaveBeenCalledWith(
			expect.objectContaining({
				whileHover: { scale: 1.1 },
			})
		);
	});
});

describe('MotionShake - Transition configuration edge cases', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses default delay 0 when delay prop is not provided', async () => {
		const { motion } = await import('framer-motion');
		// When delay is not provided, component uses default delay = 0
		// The buildShakeTransition function will receive 0 and include it in transition
		renderWithProviders(
			<MotionShake>
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			duration: 0.3,
			ease: [0.25, 0.1, 0.25, 1],
			delay: 0,
		});
	});

	it('includes delay property when delay is 0', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionShake delay={0}>
				<div>Content</div>
			</MotionShake>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			duration: 0.3,
			ease: [0.25, 0.1, 0.25, 1],
			delay: 0,
		});
	});
});

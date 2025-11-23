/**
 * Tests for MotionRotate component
 *
 * Tests the MotionRotate component:
 * - Rendering
 * - Animation variants
 * - Initial state handling
 * - Transition configuration
 * - Gesture and layout props
 * - Props forwarding
 */

import { MotionRotate } from '@core/ui/utilities/motion/components/MotionRotate';
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
			'ease-out': [0, 0, 0.2, 1],
			'ease-in': [0.4, 0, 1, 1],
			'ease-in-out': [0.4, 0, 0.2, 1],
		};
		return easings[ease ?? 'ease-out'] ?? [0, 0, 0.2, 1];
	}),
}));

vi.mock('@core/ui/utilities/motion/variants/rotateVariants', () => ({
	rotateVariants: {
		hidden: { rotate: -180, opacity: 0 },
		visible: { rotate: 0, opacity: 1 },
		exit: { rotate: 180, opacity: 0 },
	},
}));

describe('MotionRotate - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<MotionRotate>
				<div data-testid="content">Rotate content</div>
			</MotionRotate>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});
});

describe('MotionRotate - Default props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses default duration "normal"', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate>
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			duration: 0.3, // normal duration
		});
	});

	it('uses default ease "ease-out"', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate>
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			ease: [0, 0, 0.2, 1], // ease-out
		});
	});

	it('uses default delay 0', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate>
				<div>Content</div>
			</MotionRotate>
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
			<MotionRotate>
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.initial).toBe('hidden');
	});
});

describe('MotionRotate - Initial state', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles initial true', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate initial={true}>
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.initial).toBe('visible');
	});

	it('handles initial false', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate initial={false}>
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.initial).toBe('hidden');
	});

	it('handles initial "hidden"', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate initial="hidden">
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.initial).toBe('hidden');
	});

	it('handles initial "visible"', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate initial="visible">
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.initial).toBe('visible');
	});
});

describe('MotionRotate - Animation configuration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses rotateVariants', async () => {
		const { motion } = await import('framer-motion');
		const { rotateVariants } = await import('@core/ui/utilities/motion/variants/rotateVariants');
		renderWithProviders(
			<MotionRotate>
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.variants).toEqual(rotateVariants);
	});

	it('sets animate to "visible"', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate>
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.animate).toBe('visible');
	});

	it('sets exit to "exit"', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate>
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.exit).toBe('exit');
	});
});

describe('MotionRotate - Custom props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses custom duration', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate duration="slow">
				<div>Content</div>
			</MotionRotate>
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
			<MotionRotate ease="ease-in">
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			ease: [0.4, 0, 1, 1], // ease-in
		});
	});

	it('uses custom delay', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate delay={0.2}>
				<div>Content</div>
			</MotionRotate>
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
			<MotionRotate className="custom-class">
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.className).toBe('custom-class');
	});
});

describe('MotionRotate - Gesture and layout props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards layout prop', async () => {
		const { buildGestureLayoutProps } = await import(
			'@core/ui/utilities/motion/helpers/motionPropsHelpers'
		);
		renderWithProviders(
			<MotionRotate layout>
				<div>Content</div>
			</MotionRotate>
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
			<MotionRotate whileHover={{ scale: 1.1 }}>
				<div>Content</div>
			</MotionRotate>
		);

		expect(buildGestureLayoutProps).toHaveBeenCalledWith(
			expect.objectContaining({
				whileHover: { scale: 1.1 },
			})
		);
	});
});

describe('MotionRotate - Transition configuration edge cases', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses default duration when duration is undefined', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate>
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			duration: 0.3, // normal duration (default)
		});
	});

	it('uses default ease when ease is undefined', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate>
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			ease: [0, 0, 0.2, 1], // ease-out (default)
		});
	});

	it('uses default delay when delay is undefined', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate>
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			delay: 0, // default delay
		});
	});

	it('handles all undefined transition props', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionRotate>
				<div>Content</div>
			</MotionRotate>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		const props = lastCall?.[0] as any;
		expect(props.transition).toMatchObject({
			duration: 0.3,
			ease: [0, 0, 0.2, 1],
			delay: 0,
		});
	});
});

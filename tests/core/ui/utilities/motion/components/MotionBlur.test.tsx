/**
 * Tests for MotionBlur component
 *
 * Tests the MotionBlur component:
 * - Rendering
 * - Animation variants
 * - Initial state handling
 * - Transition configuration
 * - Gesture and layout props
 * - Props forwarding
 */

import { MotionBlur } from '@core/ui/utilities/motion/components/MotionBlur';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => {
	const mockMotionDiv = vi.fn(({ children, className, ..._props }) => (
		<div data-testid="motion-div" className={className}>
			{children}
		</div>
	));
	return {
		motion: {
			div: mockMotionDiv,
		},
	};
});

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

vi.mock('@core/ui/utilities/motion/variants/effectVariants', () => ({
	blurVariants: {
		hidden: { filter: 'blur(10px)', opacity: 0 },
		visible: { filter: 'blur(0px)', opacity: 1 },
		exit: { filter: 'blur(10px)', opacity: 0 },
	},
}));

describe('MotionBlur - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<MotionBlur>
				<div data-testid="content">Blur content</div>
			</MotionBlur>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});
});

describe('MotionBlur - Default props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses default duration "normal"', async () => {
		renderWithProviders(
			<MotionBlur>
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].transition).toMatchObject({
			duration: 0.3, // normal duration
		});
	});

	it('uses default ease "ease-out"', async () => {
		renderWithProviders(
			<MotionBlur>
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].transition).toMatchObject({
			ease: [0, 0, 0.2, 1], // ease-out
		});
	});

	it('uses default delay 0', async () => {
		renderWithProviders(
			<MotionBlur>
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].transition).toMatchObject({
			delay: 0,
		});
	});

	it('uses default initial false', async () => {
		renderWithProviders(
			<MotionBlur>
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].initial).toBe('hidden');
	});
});

describe('MotionBlur - Initial state', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles initial true', async () => {
		renderWithProviders(
			<MotionBlur initial={true}>
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].initial).toBe('visible');
	});

	it('handles initial false', async () => {
		renderWithProviders(
			<MotionBlur initial={false}>
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].initial).toBe('hidden');
	});

	it('handles initial "hidden"', async () => {
		renderWithProviders(
			<MotionBlur initial="hidden">
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].initial).toBe('hidden');
	});

	it('handles initial "visible"', async () => {
		renderWithProviders(
			<MotionBlur initial="visible">
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].initial).toBe('visible');
	});
});

describe('MotionBlur - Animation configuration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses blurVariants', async () => {
		const { blurVariants } = await import('@core/ui/utilities/motion/variants/effectVariants');
		renderWithProviders(
			<MotionBlur>
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].variants).toEqual(blurVariants);
	});

	it('sets animate to "visible"', async () => {
		renderWithProviders(
			<MotionBlur>
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].animate).toBe('visible');
	});

	it('sets exit to "exit"', async () => {
		renderWithProviders(
			<MotionBlur>
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].exit).toBe('exit');
	});
});

describe('MotionBlur - Custom props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses custom duration', async () => {
		renderWithProviders(
			<MotionBlur duration="slow">
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].transition).toMatchObject({
			duration: 0.5, // slow duration
		});
	});

	it('uses custom ease', async () => {
		renderWithProviders(
			<MotionBlur ease="ease-in">
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].transition).toMatchObject({
			ease: [0.4, 0, 1, 1], // ease-in
		});
	});

	it('uses custom delay', async () => {
		renderWithProviders(
			<MotionBlur delay={0.2}>
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].transition).toMatchObject({
			delay: 0.2,
		});
	});

	it('forwards className', async () => {
		renderWithProviders(
			<MotionBlur className="custom-class">
				<div>Content</div>
			</MotionBlur>
		);

		const { motion } = await import('framer-motion');
		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].className).toBe('custom-class');
	});
});

// Helper function to render component with props
const renderMotionBlur = (props: React.ComponentProps<typeof MotionBlur>) => {
	renderWithProviders(
		<MotionBlur {...props}>
			<div>Content</div>
		</MotionBlur>
	);
};

describe('MotionBlur - Layout props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards layout prop', async () => {
		renderMotionBlur({ layout: true });
		const { buildGestureLayoutProps } = await import(
			'@core/ui/utilities/motion/helpers/motionPropsHelpers'
		);

		expect(buildGestureLayoutProps).toHaveBeenCalledWith(
			expect.objectContaining({
				layout: true,
			})
		);
	});

	it('forwards layoutId prop', async () => {
		renderMotionBlur({ layoutId: 'test-id' });
		const { buildGestureLayoutProps } = await import(
			'@core/ui/utilities/motion/helpers/motionPropsHelpers'
		);

		expect(buildGestureLayoutProps).toHaveBeenCalledWith(
			expect.objectContaining({
				layoutId: 'test-id',
			})
		);
	});
});

describe('MotionBlur - Gesture props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards whileHover prop', async () => {
		renderMotionBlur({ whileHover: { scale: 1.1 } });
		const { buildGestureLayoutProps } = await import(
			'@core/ui/utilities/motion/helpers/motionPropsHelpers'
		);

		expect(buildGestureLayoutProps).toHaveBeenCalledWith(
			expect.objectContaining({
				whileHover: { scale: 1.1 },
			})
		);
	});

	it('forwards drag prop', async () => {
		renderMotionBlur({ drag: true });
		const { buildGestureLayoutProps } = await import(
			'@core/ui/utilities/motion/helpers/motionPropsHelpers'
		);

		expect(buildGestureLayoutProps).toHaveBeenCalledWith(
			expect.objectContaining({
				drag: true,
			})
		);
	});
});

describe('MotionBlur - Transition configuration edge cases', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses default duration when duration is undefined', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionBlur>
				<div>Content</div>
			</MotionBlur>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].transition).toMatchObject({
			duration: 0.3, // normal duration (default)
		});
	});

	it('uses default ease when ease is undefined', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionBlur>
				<div>Content</div>
			</MotionBlur>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].transition).toMatchObject({
			ease: [0, 0, 0.2, 1], // ease-out (default)
		});
	});

	it('uses default delay when delay is undefined', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionBlur>
				<div>Content</div>
			</MotionBlur>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].transition).toMatchObject({
			delay: 0, // default delay
		});
	});

	it('handles all undefined transition props', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionBlur>
				<div>Content</div>
			</MotionBlur>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].transition).toMatchObject({
			duration: 0.3,
			ease: [0, 0, 0.2, 1],
			delay: 0,
		});
	});
});

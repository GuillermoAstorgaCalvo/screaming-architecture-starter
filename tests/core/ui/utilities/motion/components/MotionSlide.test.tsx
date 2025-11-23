/**
 * Tests for MotionSlide component
 *
 * Tests the MotionSlide component:
 * - Rendering
 * - Direction variants
 * - Props forwarding
 * - Custom variant override
 */

import { MotionSlide } from '@core/ui/utilities/motion/components/MotionSlide';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock MotionBox and getSlideVariant
vi.mock('@core/ui/utilities/motion/MotionBox', () => ({
	MotionBox: vi.fn(({ children, variant, ...props }) => (
		<div data-testid="motion-box" data-variant={variant} {...props}>
			{children}
		</div>
	)),
}));

vi.mock('@core/ui/utilities/motion/helpers/motionUtils', () => ({
	getSlideVariant: vi.fn(direction => {
		const variants: Record<string, string> = {
			left: 'slide',
			right: 'slideRight',
			top: 'slideTop',
			bottom: 'slideBottom',
		};
		return variants[direction] ?? 'slide';
	}),
}));

describe('MotionSlide - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<MotionSlide>
				<div data-testid="content">Slide content</div>
			</MotionSlide>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('uses left direction by default', async () => {
		const { getSlideVariant } = await import('@core/ui/utilities/motion/helpers/motionUtils');
		renderWithProviders(
			<MotionSlide>
				<div>Content</div>
			</MotionSlide>
		);

		expect(getSlideVariant).toHaveBeenCalledWith('left');
	});
});

describe('MotionSlide - Direction variants', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses slide variant for left direction', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		const { getSlideVariant } = await import('@core/ui/utilities/motion/helpers/motionUtils');
		renderWithProviders(
			<MotionSlide direction="left">
				<div>Content</div>
			</MotionSlide>
		);

		expect(getSlideVariant).toHaveBeenCalledWith('left');
		expect(MotionBox).toHaveBeenCalled();
		const { calls } = vi.mocked(MotionBox).mock;
		expect(calls.length).toBeGreaterThan(0);
		const lastCall = calls.at(-1);
		if (lastCall) {
			expect(lastCall[0]).toMatchObject({
				variant: 'slide',
			});
		}
	});

	it('uses slideRight variant for right direction', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		const { getSlideVariant } = await import('@core/ui/utilities/motion/helpers/motionUtils');
		renderWithProviders(
			<MotionSlide direction="right">
				<div>Content</div>
			</MotionSlide>
		);

		expect(getSlideVariant).toHaveBeenCalledWith('right');
		expect(MotionBox).toHaveBeenCalled();
		const { calls } = vi.mocked(MotionBox).mock;
		expect(calls.length).toBeGreaterThan(0);
		const lastCall = calls.at(-1);
		if (lastCall) {
			expect(lastCall[0]).toMatchObject({
				variant: 'slideRight',
			});
		}
	});
});

describe('MotionSlide - Vertical directions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses slideTop variant for top direction', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		const { getSlideVariant } = await import('@core/ui/utilities/motion/helpers/motionUtils');
		renderWithProviders(
			<MotionSlide direction="top">
				<div>Content</div>
			</MotionSlide>
		);

		expect(getSlideVariant).toHaveBeenCalledWith('top');
		expect(MotionBox).toHaveBeenCalled();
		const { calls } = vi.mocked(MotionBox).mock;
		expect(calls.length).toBeGreaterThan(0);
		const lastCall = calls.at(-1);
		if (lastCall) {
			expect(lastCall[0]).toMatchObject({
				variant: 'slideTop',
			});
		}
	});

	it('uses slideBottom variant for bottom direction', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		const { getSlideVariant } = await import('@core/ui/utilities/motion/helpers/motionUtils');
		renderWithProviders(
			<MotionSlide direction="bottom">
				<div>Content</div>
			</MotionSlide>
		);

		expect(getSlideVariant).toHaveBeenCalledWith('bottom');
		expect(MotionBox).toHaveBeenCalled();
		const { calls } = vi.mocked(MotionBox).mock;
		expect(calls.length).toBeGreaterThan(0);
		const lastCall = calls.at(-1);
		if (lastCall) {
			expect(lastCall[0]).toMatchObject({
				variant: 'slideBottom',
			});
		}
	});
});

describe('MotionSlide - Props forwarding', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards duration prop to MotionBox', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		renderWithProviders(
			<MotionSlide duration="slow">
				<div>Content</div>
			</MotionSlide>
		);

		expect(MotionBox).toHaveBeenCalled();
		const { calls } = vi.mocked(MotionBox).mock;
		expect(calls.length).toBeGreaterThan(0);
		const lastCall = calls.at(-1);
		if (lastCall) {
			expect(lastCall[0]).toMatchObject({
				duration: 'slow',
			});
		}
	});

	it('forwards delay prop to MotionBox', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		renderWithProviders(
			<MotionSlide delay={0.3}>
				<div>Content</div>
			</MotionSlide>
		);

		expect(MotionBox).toHaveBeenCalled();
		const { calls } = vi.mocked(MotionBox).mock;
		expect(calls.length).toBeGreaterThan(0);
		const lastCall = calls.at(-1);
		if (lastCall) {
			expect(lastCall[0]).toMatchObject({
				delay: 0.3,
			});
		}
	});

	it('allows overriding variant directly', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		const { getSlideVariant } = await import('@core/ui/utilities/motion/helpers/motionUtils');
		renderWithProviders(
			<MotionSlide variant="fade" direction="left">
				<div>Content</div>
			</MotionSlide>
		);

		expect(MotionBox).toHaveBeenCalled();
		const { calls } = vi.mocked(MotionBox).mock;
		expect(calls.length).toBeGreaterThan(0);
		const lastCall = calls.at(-1);
		if (lastCall) {
			expect(lastCall[0]).toMatchObject({
				variant: 'fade',
			});
		}
		// Should not call getSlideVariant when variant is provided
		expect(getSlideVariant).not.toHaveBeenCalled();
	});
});

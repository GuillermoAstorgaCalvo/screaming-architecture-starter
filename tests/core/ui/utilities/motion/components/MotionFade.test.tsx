/**
 * Tests for MotionFade component
 *
 * Tests the MotionFade component:
 * - Rendering
 * - Fade variant
 * - Props forwarding
 * - Custom duration and delay
 */

import { MotionFade } from '@core/ui/utilities/motion/components/MotionFade';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock MotionBox
vi.mock('@core/ui/utilities/motion/MotionBox', () => ({
	MotionBox: vi.fn(
		({
			children,
			variant,
			initial: _initial,
			repeat: _repeat,
			duration: _duration,
			delay: _delay,
			ease: _ease,
			repeatType: _repeatType,
			reducedMotionStrategy: _reducedMotionStrategy,
			layout: _layout,
			layoutId: _layoutId,
			whileHover: _whileHover,
			whileTap: _whileTap,
			drag: _drag,
			dragConstraints: _dragConstraints,
			dragElastic: _dragElastic,
			dragMomentum: _dragMomentum,
			dragTransition: _dragTransition,
			onDragStart: _onDragStart,
			onDragEnd: _onDragEnd,
			...props
		}) => (
			<div data-testid="motion-box" data-variant={variant} {...props}>
				{children}
			</div>
		)
	),
}));

const MOTION_BOX_NOT_CALLED_ERROR = 'MotionBox was not called';

/**
 * Helper function to get the last call arguments from MotionBox mock
 */
async function getLastMotionBoxCall() {
	const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
	expect(MotionBox).toHaveBeenCalled();
	const { calls } = vi.mocked(MotionBox).mock;
	const lastCall = calls.at(-1);
	if (!lastCall) {
		throw new Error(MOTION_BOX_NOT_CALLED_ERROR);
	}
	return lastCall[0];
}

/**
 * Helper function to verify MotionBox was called with expected props
 */
async function expectMotionBoxProps(expectedProps: Record<string, unknown>) {
	const props = await getLastMotionBoxCall();
	expect(props).toMatchObject(expectedProps);
}

describe('MotionFade - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<MotionFade>
				<div data-testid="content">Fade content</div>
			</MotionFade>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('renders with fade variant by default', async () => {
		vi.clearAllMocks();
		renderWithProviders(
			<MotionFade>
				<div>Content</div>
			</MotionFade>
		);

		await expectMotionBoxProps({
			variant: 'fade',
		});
	});
});

describe('MotionFade - Props forwarding', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards duration prop to MotionBox', async () => {
		renderWithProviders(
			<MotionFade duration="slow">
				<div>Content</div>
			</MotionFade>
		);

		await expectMotionBoxProps({
			duration: 'slow',
		});
	});

	it('forwards delay prop to MotionBox', async () => {
		renderWithProviders(
			<MotionFade delay={0.5}>
				<div>Content</div>
			</MotionFade>
		);

		await expectMotionBoxProps({
			delay: 0.5,
		});
	});

	it('forwards className prop to MotionBox', async () => {
		renderWithProviders(
			<MotionFade className="custom-class">
				<div>Content</div>
			</MotionFade>
		);

		await expectMotionBoxProps({
			className: 'custom-class',
		});
	});
});

describe('MotionFade - Advanced props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards all props to MotionBox', async () => {
		renderWithProviders(
			<MotionFade duration="fast" delay={0.2} initial={true} repeat={true}>
				<div>Content</div>
			</MotionFade>
		);

		await expectMotionBoxProps({
			duration: 'fast',
			delay: 0.2,
			initial: true,
			repeat: true,
		});
	});

	it('allows overriding variant', async () => {
		renderWithProviders(
			<MotionFade variant="scale">
				<div>Content</div>
			</MotionFade>
		);

		await expectMotionBoxProps({
			variant: 'scale',
		});
	});
});

describe('MotionFade - Layout props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards reducedMotionStrategy prop to MotionBox', async () => {
		renderWithProviders(
			<MotionFade reducedMotionStrategy="static">
				<div>Content</div>
			</MotionFade>
		);

		await expectMotionBoxProps({
			reducedMotionStrategy: 'static',
		});
	});

	it('forwards layout prop to MotionBox', async () => {
		renderWithProviders(
			<MotionFade layout>
				<div>Content</div>
			</MotionFade>
		);

		await expectMotionBoxProps({
			layout: true,
		});
	});

	it('forwards layoutId prop to MotionBox', async () => {
		renderWithProviders(
			<MotionFade layoutId="fade-element">
				<div>Content</div>
			</MotionFade>
		);

		await expectMotionBoxProps({
			layoutId: 'fade-element',
		});
	});
});

describe('MotionFade - Gesture props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards gesture props to MotionBox', async () => {
		const whileHover = { scale: 1.1 };
		const whileTap = { scale: 0.9 };

		renderWithProviders(
			<MotionFade whileHover={whileHover} whileTap={whileTap}>
				<div>Content</div>
			</MotionFade>
		);

		await expectMotionBoxProps({
			whileHover,
			whileTap,
		});
	});

	it('forwards drag props to MotionBox', async () => {
		renderWithProviders(
			<MotionFade drag dragConstraints={{ left: 0, right: 100 }}>
				<div>Content</div>
			</MotionFade>
		);

		await expectMotionBoxProps({
			drag: true,
			dragConstraints: { left: 0, right: 100 },
		});
	});
});

describe('MotionFade - Children handling', () => {
	it('handles empty children', () => {
		renderWithProviders(<MotionFade>{null}</MotionFade>);

		expect(screen.getByTestId('motion-box')).toBeInTheDocument();
	});

	it('handles fragment children', () => {
		renderWithProviders(
			<MotionFade>
				<>
					<div data-testid="child-1">First</div>
					<div data-testid="child-2">Second</div>
				</>
			</MotionFade>
		);

		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
	});
});

// Test the component directly to ensure coverage tracking
// This ensures the component file is tracked even when dependencies are mocked
describe('MotionFade - Direct Component Test (Coverage)', () => {
	it('should execute the MotionFade function directly', async () => {
		// Import the component directly to ensure it's tracked
		const { MotionFade: MotionFadeComponent } = await import(
			'@core/ui/utilities/motion/components/MotionFade'
		);

		// Verify the component is a function
		expect(typeof MotionFadeComponent).toBe('function');

		// Render with the component to ensure the wrapper function executes
		// Even with the mock, the wrapper function (lines 28-30) should execute
		renderWithProviders(
			<MotionFadeComponent>
				<div data-testid="direct-test">Direct Test</div>
			</MotionFadeComponent>
		);

		expect(screen.getByTestId('direct-test')).toBeInTheDocument();
	});
});

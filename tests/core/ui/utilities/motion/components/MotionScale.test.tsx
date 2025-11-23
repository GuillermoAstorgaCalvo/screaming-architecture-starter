/**
 * Tests for MotionScale component
 *
 * Tests the MotionScale component:
 * - Rendering
 * - Props extraction
 * - Motion props building
 * - Gesture props
 */

import { MotionScale } from '@core/ui/utilities/motion/components/MotionScale';
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
vi.mock('@core/ui/utilities/motion/helpers/MotionScale/propExtractors', () => ({
	extractRenderProps: vi.fn(props => ({
		className: props.className,
		children: props.children,
	})),
	extractRestProps: vi.fn(props => {
		const {
			className: _className,
			children: _children,
			initialScale: _initialScale,
			finalScale: _finalScale,
			duration: _duration,
			ease: _ease,
			delay: _delay,
			initial: _initial,
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
			...rest
		} = props;
		return rest;
	}),
}));

vi.mock('@core/ui/utilities/motion/helpers/MotionScale/scaleProps', () => ({
	buildAllMotionProps: vi.fn(props => ({
		motionProps: {
			initial: props.initial === false ? 'hidden' : 'visible',
			animate: { scale: props.finalScale ?? 1 },
			exit: { scale: props.initialScale ?? 0 },
			transition: {
				duration: props.duration === 'slow' ? 0.5 : 0.3,
				ease: [0, 0, 0.2, 1],
				delay: props.delay ?? 0,
			},
		},
		gestureProps: {
			layout: props.layout,
			layoutId: props.layoutId,
			whileHover: props.whileHover,
			whileTap: props.whileTap,
			drag: props.drag,
		},
	})),
}));

describe('MotionScale - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<MotionScale>
				<div data-testid="content">Scale content</div>
			</MotionScale>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});
});

describe('MotionScale - Props extraction', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('extracts render props correctly', async () => {
		const { extractRenderProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionScale/propExtractors'
		);
		renderWithProviders(
			<MotionScale className="custom-class">
				<div>Content</div>
			</MotionScale>
		);

		expect(extractRenderProps).toHaveBeenCalledWith(
			expect.objectContaining({
				className: 'custom-class',
			})
		);
	});

	it('extracts rest props correctly', async () => {
		const { extractRestProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionScale/propExtractors'
		);
		renderWithProviders(
			<MotionScale data-testid="scale">
				<div>Content</div>
			</MotionScale>
		);

		expect(extractRestProps).toHaveBeenCalled();
	});
});

describe('MotionScale - Motion props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('builds motion props correctly', async () => {
		const { buildAllMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionScale/scaleProps'
		);
		renderWithProviders(
			<MotionScale initialScale={0.5} finalScale={1}>
				<div>Content</div>
			</MotionScale>
		);

		expect(buildAllMotionProps).toHaveBeenCalledWith(
			expect.objectContaining({
				initialScale: 0.5,
				finalScale: 1,
			})
		);
	});

	it('forwards className', async () => {
		const { motion } = await import('framer-motion');
		renderWithProviders(
			<MotionScale className="custom-class">
				<div>Content</div>
			</MotionScale>
		);

		const lastCall = vi.mocked(motion.div).mock.calls.at(-1);
		expect(lastCall?.[0].className).toBe('custom-class');
	});
});

/**
 * Tests for MotionBox component
 *
 * Tests the MotionBox component:
 * - Rendering
 * - Variants
 * - Transitions
 * - Reduced motion strategies
 * - Custom element types
 * - Props forwarding
 */

import { MotionBox } from '@core/ui/utilities/motion/MotionBox';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
	motion: {
		div: vi.fn(({ children, className, ...props }) => (
			<div data-testid="motion-div" className={className} {...props}>
				{children}
			</div>
		)),
		span: vi.fn(({ children, className, ...props }) => (
			<span data-testid="motion-span" className={className} {...props}>
				{children}
			</span>
		)),
		section: vi.fn(({ children, className, ...props }) => (
			<section data-testid="motion-section" className={className} {...props}>
				{children}
			</section>
		)),
	},
}));

// Mock useMotionConfig
const mockResolveReducedMotionStrategy = vi.hoisted(() => vi.fn(strategy => strategy ?? 'normal'));
vi.mock('@core/ui/utilities/motion/hooks/useMotionConfig', () => ({
	useMotionConfig: vi.fn(() => ({
		reducedMotion: false,
		durationTokens: {},
		durations: { fast: 0.15, normal: 0.3, slow: 0.5 },
		easingTokens: {},
		easings: { 'ease-out': [0, 0, 0.58, 1] },
		createTransition: vi.fn(options => ({
			duration: options?.duration ?? 0.3,
			ease: options?.ease ?? [0, 0, 0.58, 1],
			delay: options?.delay ?? 0,
		})),
		resolveReducedMotionStrategy: mockResolveReducedMotionStrategy,
	})),
}));

// Mock createMotionProps
vi.mock('@core/ui/utilities/motion/helpers/MotionBox/createMotionProps', () => ({
	createMotionProps: vi.fn(() => ({
		initial: 'hidden',
		animate: 'visible',
		variants: {},
		transition: { duration: 0.3 },
	})),
}));

// Don't mock renderMotionComponent - let it use the real implementation with mocked framer-motion

describe('MotionBox - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<MotionBox>
				<div data-testid="content">Content</div>
			</MotionBox>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('renders as div by default', () => {
		renderWithProviders(
			<MotionBox>
				<div>Content</div>
			</MotionBox>
		);

		expect(screen.getByTestId('motion-div')).toBeInTheDocument();
	});

	it('renders as custom element when as prop is provided', () => {
		renderWithProviders(
			<MotionBox as="span">
				<span>Content</span>
			</MotionBox>
		);

		expect(screen.getByTestId('motion-span')).toBeInTheDocument();
	});

	it('applies className', () => {
		renderWithProviders(
			<MotionBox className="custom-class">
				<div>Content</div>
			</MotionBox>
		);

		const motionDiv = screen.getByTestId('motion-div');
		expect(motionDiv).toHaveClass('custom-class');
	});
});

describe('MotionBox - Variants', () => {
	it('uses fade variant by default', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox>
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				variant: 'fade',
			})
		);
	});

	it('uses custom variant', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox variant="scale">
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				variant: 'scale',
			})
		);
	});

	it('supports different variant types', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		const variants: Array<'fade' | 'slide' | 'scale' | 'rotate'> = [
			'fade',
			'slide',
			'scale',
			'rotate',
		];

		for (const variant of variants) {
			const { unmount } = renderWithProviders(
				<MotionBox variant={variant}>
					<div>Content</div>
				</MotionBox>
			);

			expect(createMotionProps).toHaveBeenCalledWith(
				expect.objectContaining({
					variant,
				})
			);
			unmount();
		}
	});
});

describe('MotionBox - Transitions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses normal duration by default', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox>
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				duration: 'normal',
			})
		);
	});

	it('uses custom duration', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox duration="slow">
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				duration: 'slow',
			})
		);
	});
});

describe('MotionBox - Easing', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses ease-out easing by default', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox>
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				ease: 'ease-out',
			})
		);
	});

	it('uses custom easing', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox ease="ease-in">
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				ease: 'ease-in',
			})
		);
	});
});

describe('MotionBox - Delay', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses zero delay by default', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox>
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				delay: 0,
			})
		);
	});

	it('uses custom delay', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox delay={0.5}>
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				delay: 0.5,
			})
		);
	});
});

describe('MotionBox - Initial state', () => {
	it('uses false initial by default', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox>
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				initial: false,
			})
		);
	});

	it('uses custom initial state', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox initial={true}>
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				initial: true,
			})
		);
	});
});

describe('MotionBox - Repeat', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses false repeat by default', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox>
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				repeat: false,
			})
		);
	});

	it('uses custom repeat', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox repeat={true}>
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				repeat: true,
			})
		);
	});
});

describe('MotionBox - Repeat types', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses loop repeat type by default', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox repeat={true}>
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				repeatType: 'loop',
			})
		);
	});

	it('uses custom repeat type', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox repeat={true} repeatType="reverse">
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				repeatType: 'reverse',
			})
		);
	});
});

describe('MotionBox - Reduced motion strategy', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses fade strategy by default', async () => {
		const { useMotionConfig } = await import('@core/ui/utilities/motion/hooks/useMotionConfig');
		renderWithProviders(
			<MotionBox>
				<div>Content</div>
			</MotionBox>
		);

		expect(useMotionConfig).toHaveBeenCalled();
		expect(mockResolveReducedMotionStrategy).toHaveBeenCalledWith('fade');
	});

	it('uses custom reduced motion strategy', async () => {
		const { useMotionConfig } = await import('@core/ui/utilities/motion/hooks/useMotionConfig');
		renderWithProviders(
			<MotionBox reducedMotionStrategy="static">
				<div>Content</div>
			</MotionBox>
		);

		expect(useMotionConfig).toHaveBeenCalled();
		expect(mockResolveReducedMotionStrategy).toHaveBeenCalledWith('static');
	});

	it('handles skip strategy', async () => {
		const { useMotionConfig } = await import('@core/ui/utilities/motion/hooks/useMotionConfig');
		renderWithProviders(
			<MotionBox reducedMotionStrategy="skip">
				<div>Content</div>
			</MotionBox>
		);

		expect(useMotionConfig).toHaveBeenCalled();
		expect(mockResolveReducedMotionStrategy).toHaveBeenCalledWith('skip');
	});
});

describe('MotionBox - Props forwarding', () => {
	it('forwards additional props to motion component', async () => {
		const { createMotionProps } = await import(
			'@core/ui/utilities/motion/helpers/MotionBox/createMotionProps'
		);
		renderWithProviders(
			<MotionBox data-testid="custom" aria-label="Test">
				<div>Content</div>
			</MotionBox>
		);

		expect(createMotionProps).toHaveBeenLastCalledWith(
			expect.objectContaining({
				props: expect.objectContaining({
					'data-testid': 'custom',
					'aria-label': 'Test',
				}),
			})
		);
	});
});

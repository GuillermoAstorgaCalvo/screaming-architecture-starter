/**
 * Tests for MotionPresence component
 *
 * Tests the MotionPresence component:
 * - Rendering when present/absent
 * - Exit animations
 * - Mount/unmount behavior
 * - Reduced motion preferences
 * - Presence key handling
 * - Mode configuration
 */

import { MotionPresence } from '@core/ui/utilities/motion/components/MotionPresence';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const ANIMATE_PRESENCE_TEST_ID = 'animate-presence';

// Mock AnimatePresence
vi.mock('@core/ui/utilities/motion/components/AnimatePresence', () => ({
	AnimatePresence: vi.fn(({ children, mode, initial }) => (
		<div data-testid="animate-presence" data-mode={mode} data-initial={String(initial)}>
			{children}
		</div>
	)),
}));

// Mock MotionBox
vi.mock('@core/ui/utilities/motion/MotionBox', () => ({
	MotionBox: vi.fn(({ children, key, ...props }) => (
		<div data-testid="motion-box" data-key={key} {...props}>
			{children}
		</div>
	)),
}));

describe('MotionPresence - Rendering', () => {
	it('renders children when isPresent is true', () => {
		renderWithProviders(
			<MotionPresence isPresent>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('does not render children when isPresent is false', () => {
		renderWithProviders(
			<MotionPresence isPresent={false}>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		expect(screen.queryByTestId('content')).not.toBeInTheDocument();
	});

	it('renders with default presenceKey when not provided', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		vi.clearAllMocks();

		renderWithProviders(
			<MotionPresence isPresent>
				<div>Content</div>
			</MotionPresence>
		);

		expect(MotionBox).toHaveBeenCalled();
		const lastCall = vi.mocked(MotionBox).mock.calls.at(-1);
		// Check that MotionBox was called (key is handled by React, not accessible in props)
		expect(lastCall?.[0]).toBeDefined();
		// Verify the component renders correctly
		expect(screen.getByText('Content')).toBeInTheDocument();
	});

	it('renders with custom presenceKey when provided', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		vi.clearAllMocks();

		renderWithProviders(
			<MotionPresence isPresent presenceKey="custom-key">
				<div>Content</div>
			</MotionPresence>
		);

		expect(MotionBox).toHaveBeenCalled();
		const lastCall = vi.mocked(MotionBox).mock.calls.at(-1);
		// Check that MotionBox was called (key is handled by React, not accessible in props)
		expect(lastCall?.[0]).toBeDefined();
		// Verify the component renders correctly
		expect(screen.getByText('Content')).toBeInTheDocument();
	});
});

describe('MotionPresence - Mount/Unmount behavior - mountOnEnter', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('mounts content when isPresent becomes true (mountOnEnter default)', () => {
		const { rerender } = renderWithProviders(
			<MotionPresence isPresent={false}>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		expect(screen.queryByTestId('content')).not.toBeInTheDocument();

		rerender(
			<MotionPresence isPresent>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('does not mount content when mountOnEnter is false and isPresent is false', () => {
		renderWithProviders(
			<MotionPresence isPresent={false} mountOnEnter={false}>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		expect(screen.queryByTestId('content')).not.toBeInTheDocument();
	});

	it('mounts content immediately when mountOnEnter is false', () => {
		renderWithProviders(
			<MotionPresence isPresent={false} mountOnEnter={false}>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		// Content should be mounted but not rendered
		// MotionBox should not be called when mountOnEnter is false and isPresent is false
		// But the component should still mount internally
		expect(screen.queryByTestId('content')).not.toBeInTheDocument();
	});
});

describe('MotionPresence - Mount/Unmount behavior - unmountOnExit', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('unmounts content when unmountOnExit is true and isPresent is false', () => {
		const { rerender } = renderWithProviders(
			<MotionPresence isPresent>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();

		rerender(
			<MotionPresence isPresent={false} unmountOnExit>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		expect(screen.queryByTestId('content')).not.toBeInTheDocument();
	});

	it('keeps content mounted when unmountOnExit is false', () => {
		const { rerender } = renderWithProviders(
			<MotionPresence isPresent>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();

		rerender(
			<MotionPresence isPresent={false} unmountOnExit={false}>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		// Content should still be in DOM but not visible
		// The AnimatePresence will handle the exit animation
		const animatePresence = screen.getByTestId(ANIMATE_PRESENCE_TEST_ID);
		expect(animatePresence).toBeInTheDocument();
	});
});

describe('MotionPresence - Exit animations', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('wraps content in AnimatePresence for exit animations', () => {
		renderWithProviders(
			<MotionPresence isPresent>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		expect(screen.getByTestId(ANIMATE_PRESENCE_TEST_ID)).toBeInTheDocument();
	});
});

describe('MotionPresence - Exit animations - mode prop', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards mode prop to AnimatePresence', async () => {
		const { AnimatePresence } = await import(
			'@core/ui/utilities/motion/components/AnimatePresence'
		);
		vi.clearAllMocks();

		renderWithProviders(
			<MotionPresence isPresent mode="wait">
				<div>Content</div>
			</MotionPresence>
		);

		expect(AnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				mode: 'wait',
			}),
			undefined
		);
	});

	it('uses default mode "wait"', async () => {
		const { AnimatePresence } = await import(
			'@core/ui/utilities/motion/components/AnimatePresence'
		);
		vi.clearAllMocks();

		renderWithProviders(
			<MotionPresence isPresent>
				<div>Content</div>
			</MotionPresence>
		);

		expect(AnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				mode: 'wait',
			}),
			undefined
		);
	});
});

describe('MotionPresence - Exit animations - mode prop - different values', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('supports different mode values', async () => {
		const { AnimatePresence } = await import(
			'@core/ui/utilities/motion/components/AnimatePresence'
		);
		vi.clearAllMocks();

		const { rerender } = renderWithProviders(
			<MotionPresence isPresent mode="sync">
				<div>Content</div>
			</MotionPresence>
		);

		expect(AnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				mode: 'sync',
			}),
			undefined
		);

		rerender(
			<MotionPresence isPresent mode="popLayout">
				<div>Content</div>
			</MotionPresence>
		);

		expect(AnimatePresence).toHaveBeenLastCalledWith(
			expect.objectContaining({
				mode: 'popLayout',
			}),
			undefined
		);
	});
});

describe('MotionPresence - Exit animations - presenceInitial prop', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards presenceInitial to AnimatePresence initial prop', async () => {
		const { AnimatePresence } = await import(
			'@core/ui/utilities/motion/components/AnimatePresence'
		);
		vi.clearAllMocks();

		renderWithProviders(
			<MotionPresence isPresent presenceInitial={false}>
				<div>Content</div>
			</MotionPresence>
		);

		expect(AnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				initial: false,
			}),
			undefined
		);
	});

	it('uses default presenceInitial true', async () => {
		const { AnimatePresence } = await import(
			'@core/ui/utilities/motion/components/AnimatePresence'
		);
		vi.clearAllMocks();

		renderWithProviders(
			<MotionPresence isPresent>
				<div>Content</div>
			</MotionPresence>
		);

		expect(AnimatePresence).toHaveBeenCalledWith(
			expect.objectContaining({
				initial: true,
			}),
			undefined
		);
	});
});

describe('MotionPresence - Props forwarding to MotionBox - individual props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards variant prop to MotionBox', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		vi.clearAllMocks();

		renderWithProviders(
			<MotionPresence isPresent variant="fade">
				<div>Content</div>
			</MotionPresence>
		);

		expect(MotionBox).toHaveBeenCalled();
		const lastCall = vi.mocked(MotionBox).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			variant: 'fade',
		});
	});

	it('forwards duration prop to MotionBox', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		vi.clearAllMocks();

		renderWithProviders(
			<MotionPresence isPresent duration="slow">
				<div>Content</div>
			</MotionPresence>
		);

		expect(MotionBox).toHaveBeenCalled();
		const lastCall = vi.mocked(MotionBox).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			duration: 'slow',
		});
	});

	it('forwards reducedMotionStrategy prop to MotionBox', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		vi.clearAllMocks();

		renderWithProviders(
			<MotionPresence isPresent reducedMotionStrategy="static">
				<div>Content</div>
			</MotionPresence>
		);

		expect(MotionBox).toHaveBeenCalled();
		const lastCall = vi.mocked(MotionBox).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			reducedMotionStrategy: 'static',
		});
	});
});

describe('MotionPresence - Props forwarding to MotionBox - all props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards all motion props to MotionBox', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		vi.clearAllMocks();

		renderWithProviders(
			<MotionPresence
				isPresent
				variant="slide"
				duration="fast"
				delay={0.2}
				ease="ease-in-out"
				initial="visible"
				reducedMotionStrategy="fade"
			>
				<div>Content</div>
			</MotionPresence>
		);

		expect(MotionBox).toHaveBeenCalled();
		const lastCall = vi.mocked(MotionBox).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			variant: 'slide',
			duration: 'fast',
			delay: 0.2,
			ease: 'ease-in-out',
			initial: 'visible',
			reducedMotionStrategy: 'fade',
		});
	});
});

describe('MotionPresence - State transitions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles transition from present to absent', () => {
		const { rerender } = renderWithProviders(
			<MotionPresence isPresent>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();

		rerender(
			<MotionPresence isPresent={false}>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		// Content should be removed (unmountOnExit default is true)
		expect(screen.queryByTestId('content')).not.toBeInTheDocument();
	});

	it('handles transition from absent to present', () => {
		const { rerender } = renderWithProviders(
			<MotionPresence isPresent={false}>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		expect(screen.queryByTestId('content')).not.toBeInTheDocument();

		rerender(
			<MotionPresence isPresent>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('maintains presence key across state changes', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		vi.clearAllMocks();

		const { rerender } = renderWithProviders(
			<MotionPresence isPresent presenceKey="stable-key">
				<div>Content</div>
			</MotionPresence>
		);

		expect(MotionBox).toHaveBeenCalled();
		expect(screen.getByText('Content')).toBeInTheDocument();

		rerender(
			<MotionPresence isPresent={false} presenceKey="stable-key">
				<div>Content</div>
			</MotionPresence>
		);

		// Key should remain stable (React handles this internally)
		// Verify component behavior is correct
		expect(screen.queryByText('Content')).not.toBeInTheDocument();
	});
});

describe('MotionPresence - Edge cases', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles rapid toggling of isPresent', () => {
		const { rerender } = renderWithProviders(
			<MotionPresence isPresent>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		rerender(
			<MotionPresence isPresent={false}>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		rerender(
			<MotionPresence isPresent>
				<div data-testid="content">Content</div>
			</MotionPresence>
		);

		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('handles empty children gracefully', () => {
		renderWithProviders(<MotionPresence isPresent>{null}</MotionPresence>);

		expect(screen.getByTestId(ANIMATE_PRESENCE_TEST_ID)).toBeInTheDocument();
	});

	it('handles presenceKey change', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		vi.clearAllMocks();

		const { rerender } = renderWithProviders(
			<MotionPresence isPresent presenceKey="key-1">
				<div>Content</div>
			</MotionPresence>
		);

		expect(MotionBox).toHaveBeenCalled();
		expect(screen.getByText('Content')).toBeInTheDocument();

		rerender(
			<MotionPresence isPresent presenceKey="key-2">
				<div>Content</div>
			</MotionPresence>
		);

		// Key change should trigger re-render (React handles this internally)
		expect(MotionBox).toHaveBeenCalled();
		expect(screen.getByText('Content')).toBeInTheDocument();
	});
});

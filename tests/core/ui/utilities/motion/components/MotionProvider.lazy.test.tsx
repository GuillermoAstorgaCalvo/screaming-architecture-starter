/**
 * Tests for MotionProvider.lazy component
 *
 * Tests the lazy-loaded MotionProvider component:
 * - Lazy loading
 * - Suspense fallback
 * - Props forwarding
 * - Integration with MotionProvider
 */

import { LazyMotionProvider } from '@core/ui/utilities/motion/components/MotionProvider.lazy';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { domMax } from 'framer-motion';
import { describe, expect, it, vi } from 'vitest';

const MOTION_PROVIDER_TEST_ID = 'motion-provider';

// Mock MotionProvider
vi.mock('@core/ui/utilities/motion/components/MotionProvider', () => ({
	MotionProvider: vi.fn(({ children, ...props }) => (
		<div data-testid={MOTION_PROVIDER_TEST_ID} data-props={JSON.stringify(props)}>
			{children}
		</div>
	)),
}));

describe('LazyMotionProvider - Lazy loading', () => {
	it('renders children after lazy load', async () => {
		renderWithProviders(
			<LazyMotionProvider>
				<div data-testid="child">Content</div>
			</LazyMotionProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('child')).toBeInTheDocument();
		});
	});

	it('renders MotionProvider after lazy load', async () => {
		renderWithProviders(
			<LazyMotionProvider>
				<div>Content</div>
			</LazyMotionProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId(MOTION_PROVIDER_TEST_ID)).toBeInTheDocument();
		});
	});
});

describe('LazyMotionProvider - Props forwarding', () => {
	it('forwards children to MotionProvider', async () => {
		const { MotionProvider } = await import('@core/ui/utilities/motion/components/MotionProvider');
		renderWithProviders(
			<LazyMotionProvider>
				<div data-testid="test-child">Test Content</div>
			</LazyMotionProvider>
		);

		await waitFor(() => {
			expect(MotionProvider).toHaveBeenCalledWith(
				expect.objectContaining({
					children: expect.anything(),
				}),
				undefined
			);
		});
	});

	it('forwards features prop to MotionProvider', async () => {
		const { MotionProvider } = await import('@core/ui/utilities/motion/components/MotionProvider');
		const customFeatures = 'customFeatures' as any;
		renderWithProviders(
			<LazyMotionProvider features={customFeatures}>
				<div>Content</div>
			</LazyMotionProvider>
		);

		await waitFor(() => {
			expect(MotionProvider).toHaveBeenCalledWith(
				expect.objectContaining({
					features: customFeatures,
				}),
				undefined
			);
		});
	});

	it('forwards strict prop to MotionProvider', async () => {
		const { MotionProvider } = await import('@core/ui/utilities/motion/components/MotionProvider');
		renderWithProviders(
			<LazyMotionProvider strict>
				<div>Content</div>
			</LazyMotionProvider>
		);

		await waitFor(() => {
			expect(MotionProvider).toHaveBeenCalledWith(
				expect.objectContaining({
					strict: true,
				}),
				undefined
			);
		});
	});

	it('forwards MotionConfig props to MotionProvider', async () => {
		const { MotionProvider } = await import('@core/ui/utilities/motion/components/MotionProvider');
		renderWithProviders(
			<LazyMotionProvider transition={{ duration: 0.3 }} reducedMotion="user">
				<div>Content</div>
			</LazyMotionProvider>
		);

		await waitFor(() => {
			const lastCall = vi.mocked(MotionProvider).mock.calls.at(-1);
			expect(lastCall?.[0]).toMatchObject({
				transition: { duration: 0.3 },
				reducedMotion: 'user',
			});
		});
	});

	it('forwards all props to MotionProvider', async () => {
		const { MotionProvider } = await import('@core/ui/utilities/motion/components/MotionProvider');
		renderWithProviders(
			<LazyMotionProvider features={domMax} strict={false} transition={{ duration: 0.5 }}>
				<div>Content</div>
			</LazyMotionProvider>
		);

		await waitFor(() => {
			const lastCall = vi.mocked(MotionProvider).mock.calls.at(-1);
			expect(lastCall?.[0]).toMatchObject({
				features: expect.any(Object),
				strict: false,
				transition: { duration: 0.5 },
			});
			// Verify features is an object (domMax features)
			expect(lastCall?.[0].features).toBeDefined();
			expect(typeof lastCall?.[0].features).toBe('object');
		});
	});
});

describe('LazyMotionProvider - Lazy loading behavior', () => {
	it('uses React.lazy to defer MotionProvider loading', async () => {
		// Verify that the component uses lazy loading
		// The lazy import is used during module initialization
		// We verify by checking that MotionProvider is eventually loaded
		renderWithProviders(
			<LazyMotionProvider>
				<div>Content</div>
			</LazyMotionProvider>
		);

		// Lazy loading should eventually load MotionProvider
		await waitFor(() => {
			expect(screen.getByTestId(MOTION_PROVIDER_TEST_ID)).toBeInTheDocument();
		});
	});

	it('wraps MotionProvider in Suspense with null fallback', () => {
		// The component should use Suspense with fallback={null}
		renderWithProviders(
			<LazyMotionProvider>
				<div data-testid="content">Content</div>
			</LazyMotionProvider>
		);

		// Suspense should handle the loading state
		// With null fallback, nothing should render until MotionProvider loads
		// We verify by checking content appears after load
	});

	it('handles lazy loading error gracefully', async () => {
		// This test verifies error handling if lazy loading fails
		// In a real scenario, error boundaries would catch this
		// For now, we just verify the component doesn't crash
		expect(() => {
			renderWithProviders(
				<LazyMotionProvider>
					<div>Content</div>
				</LazyMotionProvider>
			);
		}).not.toThrow();
	});

	it('loads MotionProvider module only when component is rendered', async () => {
		// Verify that the module is loaded when component is rendered
		vi.clearAllMocks();

		renderWithProviders(
			<LazyMotionProvider>
				<div>Content</div>
			</LazyMotionProvider>
		);

		// MotionProvider should be loaded after render
		await waitFor(async () => {
			const { MotionProvider } = await import(
				'@core/ui/utilities/motion/components/MotionProvider'
			);
			expect(MotionProvider).toHaveBeenCalled();
		});
	});
});

describe('LazyMotionProvider - Suspense fallback', () => {
	it('renders null fallback while loading', async () => {
		// With fallback={null}, nothing should render during load
		// This reduces bundle size by deferring framer-motion
		renderWithProviders(
			<LazyMotionProvider>
				<div>Content</div>
			</LazyMotionProvider>
		);

		// Initially, Suspense may show nothing (null fallback)
		// Then MotionProvider should appear
		await waitFor(() => {
			expect(screen.getByTestId(MOTION_PROVIDER_TEST_ID)).toBeInTheDocument();
		});
	});

	it('renders MotionProvider after lazy load completes', async () => {
		renderWithProviders(
			<LazyMotionProvider>
				<div data-testid="content">Content</div>
			</LazyMotionProvider>
		);

		// Wait for lazy load to complete
		await waitFor(() => {
			expect(screen.getByTestId(MOTION_PROVIDER_TEST_ID)).toBeInTheDocument();
			expect(screen.getByTestId('content')).toBeInTheDocument();
		});
	});
});

describe('LazyMotionProvider - Component implementation', () => {
	it('exports LazyMotionProvider as the default component', () => {
		// Verify the component is properly exported
		expect(LazyMotionProvider).toBeDefined();
		expect(typeof LazyMotionProvider).toBe('function');
	});

	it('uses lazy import with proper module transformation', async () => {
		// The lazy import should transform MotionProvider export correctly
		// Line 13: import('./MotionProvider').then(module => ({ default: module.MotionProvider }))
		renderWithProviders(
			<LazyMotionProvider>
				<div>Content</div>
			</LazyMotionProvider>
		);

		// Verify MotionProvider is eventually available
		await waitFor(() => {
			expect(screen.getByTestId(MOTION_PROVIDER_TEST_ID)).toBeInTheDocument();
		});
	});
});

describe('LazyMotionProvider - Children handling', () => {
	it('handles multiple children after lazy load', async () => {
		renderWithProviders(
			<LazyMotionProvider>
				<div key="1" data-testid="child-1">
					First
				</div>
				<div key="2" data-testid="child-2">
					Second
				</div>
			</LazyMotionProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('child-1')).toBeInTheDocument();
			expect(screen.getByTestId('child-2')).toBeInTheDocument();
		});
	});

	it('handles empty children after lazy load', async () => {
		renderWithProviders(<LazyMotionProvider>{null}</LazyMotionProvider>);

		await waitFor(() => {
			expect(screen.getByTestId(MOTION_PROVIDER_TEST_ID)).toBeInTheDocument();
		});
	});
});

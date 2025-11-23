/**
 * Tests for MotionProvider component
 *
 * Tests the MotionProvider wrapper component:
 * - Rendering
 * - Props forwarding
 * - Default features
 * - LazyMotion integration
 * - MotionConfig integration
 */

import { MotionProvider } from '@core/ui/utilities/motion/components/MotionProvider';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
	LazyMotion: vi.fn(({ children, features, strict }) => (
		<div data-testid="lazy-motion" data-features={features} data-strict={strict}>
			{children}
		</div>
	)),
	MotionConfig: vi.fn(({ children, ...config }) => (
		<div data-testid="motion-config" data-config={JSON.stringify(config)}>
			{children}
		</div>
	)),
	domMax: 'domMax',
}));

describe('MotionProvider - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<MotionProvider>
				<div data-testid="child">Content</div>
			</MotionProvider>
		);

		expect(screen.getByTestId('child')).toBeInTheDocument();
	});

	it('wraps children with LazyMotion and MotionConfig', () => {
		renderWithProviders(
			<MotionProvider>
				<div data-testid="child">Content</div>
			</MotionProvider>
		);

		expect(screen.getByTestId('lazy-motion')).toBeInTheDocument();
		expect(screen.getByTestId('motion-config')).toBeInTheDocument();
	});
});

describe('MotionProvider - Default features', () => {
	it('uses domMax as default features', async () => {
		const { LazyMotion } = await import('framer-motion');
		renderWithProviders(
			<MotionProvider>
				<div>Content</div>
			</MotionProvider>
		);

		expect(LazyMotion).toHaveBeenCalledWith(
			expect.objectContaining({
				features: 'domMax',
			}),
			undefined
		);
	});

	it('allows custom features', async () => {
		const { LazyMotion } = await import('framer-motion');
		const customFeatures = 'customFeatures' as any;
		renderWithProviders(
			<MotionProvider features={customFeatures}>
				<div>Content</div>
			</MotionProvider>
		);

		expect(LazyMotion).toHaveBeenCalledWith(
			expect.objectContaining({
				features: customFeatures,
			}),
			undefined
		);
	});
});

describe('MotionProvider - Strict mode', () => {
	it('does not pass strict prop when undefined', async () => {
		const { LazyMotion } = await import('framer-motion');
		renderWithProviders(
			<MotionProvider>
				<div>Content</div>
			</MotionProvider>
		);

		const lastCall = vi.mocked(LazyMotion).mock.calls.at(-1);
		expect(lastCall?.[0]).not.toHaveProperty('strict');
	});

	it('passes strict prop when provided', async () => {
		const { LazyMotion } = await import('framer-motion');
		renderWithProviders(
			<MotionProvider strict>
				<div>Content</div>
			</MotionProvider>
		);

		expect(LazyMotion).toHaveBeenCalledWith(
			expect.objectContaining({
				strict: true,
			}),
			undefined
		);
	});
});

describe('MotionProvider - MotionConfig props', () => {
	it('forwards MotionConfig props', async () => {
		const { MotionConfig } = await import('framer-motion');
		renderWithProviders(
			<MotionProvider transition={{ duration: 0.3 }}>
				<div>Content</div>
			</MotionProvider>
		);

		expect(MotionConfig).toHaveBeenCalledWith(
			expect.objectContaining({
				transition: { duration: 0.3 },
			}),
			undefined
		);
	});

	it('forwards all MotionConfig props', async () => {
		const { MotionConfig } = await import('framer-motion');
		renderWithProviders(
			<MotionProvider transition={{ duration: 0.5 }} reducedMotion="user">
				<div>Content</div>
			</MotionProvider>
		);

		const lastCall = vi.mocked(MotionConfig).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			transition: { duration: 0.5 },
			reducedMotion: 'user',
		});
	});
});

/**
 * Tests for LayoutGroup.lazy component
 *
 * Tests the lazy-loaded LayoutGroup component:
 * - Lazy loading
 * - Suspense fallback
 * - Props forwarding
 */

import { LazyLayoutGroup } from '@core/ui/utilities/motion/components/LayoutGroup.lazy';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

// Mock LayoutGroup
vi.mock('@core/ui/utilities/motion/components/LayoutGroup', () => ({
	LayoutGroup: vi.fn(({ children, ...props }) => (
		<div data-testid="layout-group" data-props={JSON.stringify(props)}>
			{children}
		</div>
	)),
}));

describe('LazyLayoutGroup - Lazy loading', () => {
	it('renders children after lazy load', async () => {
		renderWithProviders(
			<LazyLayoutGroup>
				<div data-testid="child">Content</div>
			</LazyLayoutGroup>
		);

		await waitFor(() => {
			expect(screen.getByTestId('child')).toBeInTheDocument();
		});
	});

	it('renders LayoutGroup after lazy load', async () => {
		renderWithProviders(
			<LazyLayoutGroup id="test-group">
				<div>Content</div>
			</LazyLayoutGroup>
		);

		await waitFor(() => {
			expect(screen.getByTestId('layout-group')).toBeInTheDocument();
		});
	});
});

describe('LazyLayoutGroup - Props forwarding', () => {
	it('forwards props to LayoutGroup', async () => {
		const { LayoutGroup } = await import('@core/ui/utilities/motion/components/LayoutGroup');
		renderWithProviders(
			<LazyLayoutGroup id="test-group">
				<div>Content</div>
			</LazyLayoutGroup>
		);

		await waitFor(() => {
			expect(LayoutGroup).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 'test-group',
				}),
				undefined
			);
		});
	});

	it('forwards all props to LayoutGroup', async () => {
		const { LayoutGroup } = await import('@core/ui/utilities/motion/components/LayoutGroup');
		renderWithProviders(
			<LazyLayoutGroup id="test">
				<div>Content</div>
			</LazyLayoutGroup>
		);

		await waitFor(() => {
			const lastCall = vi.mocked(LayoutGroup).mock.calls.at(-1);
			expect(lastCall?.[0]).toMatchObject({
				id: 'test',
			});
		});
	});

	it('forwards className prop to LayoutGroup', async () => {
		const { LayoutGroup } = await import('@core/ui/utilities/motion/components/LayoutGroup');
		renderWithProviders(
			<LazyLayoutGroup id="test" className="lazy-class">
				<div>Content</div>
			</LazyLayoutGroup>
		);

		await waitFor(() => {
			const lastCall = vi.mocked(LayoutGroup).mock.calls.at(-1);
			expect(lastCall?.[0]).toMatchObject({
				id: 'test',
				className: 'lazy-class',
			});
		});
	});
});

describe('LazyLayoutGroup - Children handling', () => {
	it('handles multiple children after lazy load', async () => {
		renderWithProviders(
			<LazyLayoutGroup>
				<div key="1" data-testid="child-1">
					First
				</div>
				<div key="2" data-testid="child-2">
					Second
				</div>
			</LazyLayoutGroup>
		);

		await waitFor(() => {
			expect(screen.getByTestId('child-1')).toBeInTheDocument();
			expect(screen.getByTestId('child-2')).toBeInTheDocument();
		});
	});

	it('handles empty children after lazy load', async () => {
		renderWithProviders(<LazyLayoutGroup>{null}</LazyLayoutGroup>);

		await waitFor(() => {
			expect(screen.getByTestId('layout-group')).toBeInTheDocument();
		});
	});
});

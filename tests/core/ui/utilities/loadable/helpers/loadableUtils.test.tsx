/**
 * Loadable Utils Tests
 *
 * Tests for the loadableUtils helper functions including:
 * - createLoadable function
 * - Default loading fallback integration
 */

import { createLoadable } from '@core/ui/utilities/loadable/helpers/loadableUtils';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ComponentType } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_COMPONENT_ID = 'test-component';

// Test component to lazy load
const TestComponent: ComponentType<{ message?: string }> = ({ message = 'Loaded' }) => {
	return (
		<div data-testid={TEST_COMPONENT_ID}>
			<p>{message}</p>
		</div>
	);
};

// Mock loader that resolves immediately
const createMockLoader = (delay = 0) => {
	return vi.fn(
		() =>
			new Promise<{ default: ComponentType<unknown> }>(resolve => {
				setTimeout(() => {
					resolve({ default: TestComponent as ComponentType<unknown> });
				}, delay);
			})
	);
};

describe('createLoadable', () => {
	it('creates a loadable component with default loading fallback', () => {
		const loader = createMockLoader();
		const LoadableComponent = createLoadable(loader);

		expect(LoadableComponent).toBeDefined();
		expect(typeof LoadableComponent).toBe('function');
	});

	it('renders default loading fallback while loading', async () => {
		const loader = createMockLoader(10);
		const LoadableComponent = createLoadable(loader);

		renderWithProviders(<LoadableComponent />);

		// Should show default loading fallback
		await waitFor(() => {
			expect(screen.getByText('Loading...')).toBeInTheDocument();
		});
	});

	it('renders lazy-loaded component after loading', async () => {
		const loader = createMockLoader(10);
		const LoadableComponent = createLoadable(loader);

		renderWithProviders(<LoadableComponent />);

		// Wait for component to load
		await waitFor(() => {
			expect(screen.getByTestId(TEST_COMPONENT_ID)).toBeInTheDocument();
		});

		expect(screen.getByText('Loaded')).toBeInTheDocument();
	});

	it('passes props to lazy-loaded component', async () => {
		const loader = createMockLoader(10);
		const LoadableComponent = createLoadable(loader);

		renderWithProviders(<LoadableComponent {...({ message: 'Custom Message' } as any)} />);

		await waitFor(() => {
			expect(screen.getByTestId(TEST_COMPONENT_ID)).toBeInTheDocument();
		});

		expect(screen.getByText('Custom Message')).toBeInTheDocument();
	});

	it('allows overriding fallback with fallback prop', async () => {
		const loader = createMockLoader(10);
		const LoadableComponent = createLoadable(loader);

		renderWithProviders(<LoadableComponent fallback={<div>Custom Fallback</div>} />);

		// Should show custom fallback, not default
		expect(screen.getByText('Custom Fallback')).toBeInTheDocument();

		await waitFor(() => {
			expect(screen.getByTestId(TEST_COMPONENT_ID)).toBeInTheDocument();
		});
	});
});

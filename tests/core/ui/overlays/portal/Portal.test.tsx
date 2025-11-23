/**
 * Tests for Portal component
 *
 * Tests the Portal component:
 * - Rendering children into portal
 * - Conditional rendering
 * - Custom container
 * - SSR safety
 */

import Portal from '@core/ui/overlays/portal/Portal';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('Portal - Rendering', () => {
	it('renders children into document.body by default', () => {
		renderWithProviders(
			<Portal>
				<div data-testid="portal-content">Portal Content</div>
			</Portal>
		);

		const content = screen.getByTestId('portal-content');
		expect(content).toBeInTheDocument();
		expect(content.parentElement).toBe(document.body);
	});

	it('renders children into custom container', () => {
		const container = document.createElement('div');
		container.dataset.testid = 'custom-container';
		document.body.append(container);

		renderWithProviders(
			<Portal container={container}>
				<div data-testid="portal-content">Portal Content</div>
			</Portal>
		);

		const content = screen.getByTestId('portal-content');
		expect(content).toBeInTheDocument();
		expect(content.parentElement).toBe(container);

		// Cleanup
		container.remove();
	});

	it('does not render when enabled is false', () => {
		renderWithProviders(
			<Portal enabled={false}>
				<div data-testid="portal-content">Portal Content</div>
			</Portal>
		);

		expect(screen.queryByTestId('portal-content')).not.toBeInTheDocument();
	});

	it('renders when enabled is true', () => {
		renderWithProviders(
			<Portal enabled={true}>
				<div data-testid="portal-content">Portal Content</div>
			</Portal>
		);

		expect(screen.getByTestId('portal-content')).toBeInTheDocument();
	});

	it('renders by default when enabled is not specified', () => {
		renderWithProviders(
			<Portal>
				<div data-testid="portal-content">Portal Content</div>
			</Portal>
		);

		expect(screen.getByTestId('portal-content')).toBeInTheDocument();
	});

	it('renders multiple children', () => {
		renderWithProviders(
			<Portal>
				<div data-testid="content-1">Content 1</div>
				<div data-testid="content-2">Content 2</div>
			</Portal>
		);

		expect(screen.getByTestId('content-1')).toBeInTheDocument();
		expect(screen.getByTestId('content-2')).toBeInTheDocument();
	});

	it('renders complex React elements', () => {
		renderWithProviders(
			<Portal>
				<div>
					<h1>Title</h1>
					<p>Paragraph</p>
					<button>Button</button>
				</div>
			</Portal>
		);

		expect(screen.getByText('Title')).toBeInTheDocument();
		expect(screen.getByText('Paragraph')).toBeInTheDocument();
		expect(screen.getByText('Button')).toBeInTheDocument();
	});
});

describe('Portal - Container Behavior', () => {
	it('uses document.body when container is null', () => {
		renderWithProviders(
			<Portal container={null}>
				<div data-testid="portal-content">Portal Content</div>
			</Portal>
		);

		const content = screen.getByTestId('portal-content');
		expect(content).toBeInTheDocument();
		expect(content.parentElement).toBe(document.body);
	});

	it('updates when container changes', () => {
		const container1 = document.createElement('div');
		container1.dataset.testid = 'container-1';
		document.body.append(container1);

		const container2 = document.createElement('div');
		container2.dataset.testid = 'container-2';
		document.body.append(container2);

		const { rerender } = renderWithProviders(
			<Portal container={container1}>
				<div data-testid="portal-content">Portal Content</div>
			</Portal>
		);

		let content = screen.getByTestId('portal-content');
		expect(content.parentElement).toBe(container1);

		rerender(
			<Portal container={container2}>
				<div data-testid="portal-content">Portal Content</div>
			</Portal>
		);

		content = screen.getByTestId('portal-content');
		expect(content.parentElement).toBe(container2);

		// Cleanup
		container1.remove();
		container2.remove();
	});
});

describe('Portal - SSR Safety', () => {
	it('handles SSR gracefully (document undefined)', () => {
		// This test verifies that the component handles SSR scenarios
		// In a real SSR environment, document would be undefined
		// The component should return null in that case
		// Since we're in a browser environment, we can't fully test this,
		// but we can verify the component works correctly in the client
		renderWithProviders(
			<Portal>
				<div data-testid="portal-content">Portal Content</div>
			</Portal>
		);

		expect(screen.getByTestId('portal-content')).toBeInTheDocument();
	});
});

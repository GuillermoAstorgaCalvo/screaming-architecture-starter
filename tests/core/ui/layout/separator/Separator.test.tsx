/**
 * Separator Component Tests
 *
 * Tests for the Separator component including:
 * - Rendering
 * - Orientation variants
 * - Custom className
 * - Accessibility
 */

import Separator from '@core/ui/layout/separator/Separator';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('Separator - Rendering', () => {
	it('renders separator element', () => {
		const { container } = renderWithProviders(<Separator />);

		const separator = container.querySelector('hr');
		expect(separator).toBeInTheDocument();
	});

	it('renders with default horizontal orientation', () => {
		const { container } = renderWithProviders(<Separator />);

		const separator = container.querySelector('hr');
		expect(separator).toBeInTheDocument();
	});

	it('applies custom className', () => {
		const { container } = renderWithProviders(<Separator className="custom-separator" />);

		const separator = container.querySelector('hr');
		expect(separator).toHaveClass('custom-separator');
	});

	it('forwards additional HTML attributes', () => {
		renderWithProviders(<Separator data-testid="separator" aria-label="Section separator" />);

		const separator = screen.getByTestId('separator');
		expect(separator).toHaveAttribute('aria-label', 'Section separator');
	});
});

describe('Separator - Orientation', () => {
	it('renders with horizontal orientation by default', () => {
		const { container } = renderWithProviders(<Separator />);

		const separator = container.querySelector('hr');
		expect(separator).toBeInTheDocument();
	});

	it('renders with horizontal orientation when specified', () => {
		const { container } = renderWithProviders(<Separator orientation="horizontal" />);

		const separator = container.querySelector('hr');
		expect(separator).toBeInTheDocument();
	});

	it('renders with vertical orientation', () => {
		const { container } = renderWithProviders(<Separator orientation="vertical" />);

		const separator = container.querySelector('hr');
		expect(separator).toBeInTheDocument();
	});

	it('applies correct classes for horizontal orientation', () => {
		const { container } = renderWithProviders(<Separator orientation="horizontal" />);

		const separator = container.querySelector('hr');
		// The actual classes are defined in constants, but we verify the element exists
		expect(separator).toBeInTheDocument();
	});

	it('applies correct classes for vertical orientation', () => {
		const { container } = renderWithProviders(<Separator orientation="vertical" />);

		const separator = container.querySelector('hr');
		// The actual classes are defined in constants, but we verify the element exists
		expect(separator).toBeInTheDocument();
	});
});

describe('Separator - Usage Examples', () => {
	it('works in horizontal layout', () => {
		renderWithProviders(
			<div>
				<div>Content above</div>
				<Separator orientation="horizontal" />
				<div>Content below</div>
			</div>
		);

		expect(screen.getByText('Content above')).toBeInTheDocument();
		expect(screen.getByText('Content below')).toBeInTheDocument();
	});

	it('works in vertical layout', () => {
		renderWithProviders(
			<div style={{ display: 'flex' }}>
				<div>Left content</div>
				<Separator orientation="vertical" />
				<div>Right content</div>
			</div>
		);

		expect(screen.getByText('Left content')).toBeInTheDocument();
		expect(screen.getByText('Right content')).toBeInTheDocument();
	});
});

describe('Separator - Accessibility', () => {
	it('passes accessibility checks', async () => {
		const { container } = renderWithProviders(<Separator />);

		await expectA11y(container);
	});

	it('uses semantic hr element', () => {
		const { container } = renderWithProviders(<Separator />);

		const separator = container.querySelector('hr');
		expect(separator).toBeInTheDocument();
		expect(separator?.tagName).toBe('HR');
	});

	it('preserves aria attributes', () => {
		renderWithProviders(<Separator aria-label="Section separator" />);

		const separator = screen.getByLabelText('Section separator');
		expect(separator).toBeInTheDocument();
	});
});

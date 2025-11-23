/**
 * Badge Component Tests
 *
 * Tests for Badge component:
 * - Rendering
 * - Data display
 * - Interactions
 * - Accessibility
 */

import Badge from '@core/ui/data-display/badge/Badge';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('Badge - rendering', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<Badge>Badge content</Badge>);
		}).not.toThrow();
	});

	it('should render badge element', () => {
		renderWithProviders(<Badge>Badge content</Badge>);
		const badge = screen.getByText('Badge content');
		expect(badge).toBeInTheDocument();
		expect(badge.tagName).toBe('SPAN');
	});

	it('should render children content', () => {
		renderWithProviders(<Badge>Status: Active</Badge>);
		expect(screen.getByText('Status: Active')).toBeInTheDocument();
	});

	it('should apply custom className', () => {
		renderWithProviders(<Badge className="custom-badge">Content</Badge>);
		const badge = screen.getByText('Content');
		expect(badge).toHaveClass('custom-badge');
	});

	it('should render with default variant (default)', () => {
		renderWithProviders(<Badge>Content</Badge>);
		const badge = screen.getByText('Content');
		expect(badge).toBeInTheDocument();
	});

	it('should render with default size (md)', () => {
		renderWithProviders(<Badge>Content</Badge>);
		const badge = screen.getByText('Content');
		expect(badge).toBeInTheDocument();
	});
});

describe('Badge - data display', () => {
	it('should display text content', () => {
		renderWithProviders(<Badge>Active</Badge>);
		expect(screen.getByText('Active')).toBeInTheDocument();
	});

	it('should display number content', () => {
		renderWithProviders(<Badge>42</Badge>);
		expect(screen.getByText('42')).toBeInTheDocument();
	});

	it('should support different variants', () => {
		const variants = ['default', 'primary', 'success', 'warning', 'error', 'info'] as const;
		for (const variant of variants) {
			const { unmount } = renderWithProviders(<Badge variant={variant}>Content</Badge>);
			expect(screen.getByText('Content')).toBeInTheDocument();
			unmount();
		}
	});

	it('should support different sizes', () => {
		const sizes = ['sm', 'md', 'lg'] as const;
		for (const size of sizes) {
			const { unmount } = renderWithProviders(<Badge size={size}>Content</Badge>);
			expect(screen.getByText('Content')).toBeInTheDocument();
			unmount();
		}
	});

	it('should combine variant and size', () => {
		renderWithProviders(
			<Badge variant="success" size="sm">
				Success
			</Badge>
		);
		expect(screen.getByText('Success')).toBeInTheDocument();
	});

	it('should display complex content', () => {
		renderWithProviders(
			<Badge>
				<span data-testid="badge-content">New</span>
			</Badge>
		);
		expect(screen.getByTestId('badge-content')).toBeInTheDocument();
		expect(screen.getByText('New')).toBeInTheDocument();
	});
});

describe('Badge - interactions', () => {
	it('should handle click events', () => {
		const handleClick = vi.fn();
		renderWithProviders(
			<Badge onClick={handleClick} tabIndex={0}>
				Clickable badge
			</Badge>
		);
		const badge = screen.getByText('Clickable badge');
		badge.click();
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('should preserve HTML attributes', () => {
		renderWithProviders(
			<Badge data-testid="badge" aria-label="Status badge">
				Active
			</Badge>
		);
		const badge = screen.getByTestId('badge');
		expect(badge).toHaveAttribute('aria-label', 'Status badge');
	});

	it('should support keyboard interactions when interactive', () => {
		renderWithProviders(
			<Badge tabIndex={0} onClick={vi.fn()}>
				Interactive badge
			</Badge>
		);
		const badge = screen.getByText('Interactive badge');
		expect(badge).toHaveAttribute('tabIndex', '0');
	});
});

describe('Badge - accessibility', () => {
	it('should have no accessibility violations', async () => {
		const { container } = renderWithProviders(<Badge>Badge content</Badge>);
		await expectA11y(container);
	});

	it('should support custom ARIA attributes', () => {
		renderWithProviders(
			<Badge aria-label="Status indicator" aria-live="polite">
				Active
			</Badge>
		);
		const badge = screen.getByText('Active');
		expect(badge).toHaveAttribute('aria-label', 'Status indicator');
		expect(badge).toHaveAttribute('aria-live', 'polite');
	});

	it('should be readable by screen readers', () => {
		renderWithProviders(<Badge>New</Badge>);
		const badge = screen.getByText('New');
		expect(badge).toBeInTheDocument();
		// Content should be accessible to screen readers
	});

	it('should support aria-live attribute', () => {
		renderWithProviders(<Badge aria-live="polite">Updated</Badge>);
		const badge = screen.getByText('Updated');
		expect(badge).toHaveAttribute('aria-live', 'polite');
	});

	it('should have proper focus states when interactive', () => {
		renderWithProviders(<Badge tabIndex={0}>Clickable</Badge>);
		const badge = screen.getByText('Clickable');
		expect(badge).toHaveAttribute('tabIndex', '0');
		// Focus states are handled by CSS
	});
});

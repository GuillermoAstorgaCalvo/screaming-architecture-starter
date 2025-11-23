/**
 * StatusIndicator Component Tests
 *
 * Tests for the StatusIndicator component including:
 * - Rendering (dot and badge variants)
 * - Status variants (online, offline, busy, away)
 * - Size variants (sm, md, lg)
 * - Label text (badge variant)
 * - Animated prop
 * - Custom className
 * - Accessibility attributes
 * - HTML attributes spreading
 */

import StatusIndicator from '@core/ui/data-display/status-indicator/StatusIndicator';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

// Helper to get badge indicator element
function getBadgeIndicator(container: HTMLElement): HTMLElement {
	const indicator = container.querySelector('span[aria-hidden="true"]')?.parentElement;
	if (!indicator) {
		throw new Error('Badge indicator not found');
	}
	return indicator;
}

describe('StatusIndicator - Rendering', () => {
	it('renders dot variant by default', () => {
		renderWithProviders(<StatusIndicator />);
		const indicator = screen.getByLabelText('Status: online');
		expect(indicator).toBeInTheDocument();
		expect(indicator.tagName).toBe('SPAN');
	});

	it('renders with default props (online, dot, md)', () => {
		renderWithProviders(<StatusIndicator />);
		const indicator = screen.getByLabelText('Status: online');
		expect(indicator).toBeInTheDocument();
	});

	it('renders dot variant', () => {
		renderWithProviders(<StatusIndicator variant="dot" />);
		const indicator = screen.getByLabelText('Status: online');
		expect(indicator).toBeInTheDocument();
	});

	it('renders badge variant', () => {
		const { container } = renderWithProviders(<StatusIndicator variant="badge" />);
		const indicator = getBadgeIndicator(container);
		expect(indicator).toBeInTheDocument();
	});

	it('renders with custom className', () => {
		renderWithProviders(<StatusIndicator className="custom-class" />);
		const indicator = screen.getByLabelText('Status: online');
		expect(indicator).toHaveClass('custom-class');
	});

	it('renders badge variant with custom className', () => {
		const { container } = renderWithProviders(
			<StatusIndicator variant="badge" className="custom-badge-class" />
		);
		const indicator = getBadgeIndicator(container);
		expect(indicator).toHaveClass('custom-badge-class');
	});
});

describe('StatusIndicator - Status Variants', () => {
	it('renders with online status', () => {
		renderWithProviders(<StatusIndicator status="online" />);
		const indicator = screen.getByLabelText('Status: online');
		expect(indicator).toBeInTheDocument();
	});

	it('renders with offline status', () => {
		renderWithProviders(<StatusIndicator status="offline" />);
		const indicator = screen.getByLabelText('Status: offline');
		expect(indicator).toBeInTheDocument();
	});

	it('renders with busy status', () => {
		renderWithProviders(<StatusIndicator status="busy" />);
		const indicator = screen.getByLabelText('Status: busy');
		expect(indicator).toBeInTheDocument();
	});

	it('renders with away status', () => {
		renderWithProviders(<StatusIndicator status="away" />);
		const indicator = screen.getByLabelText('Status: away');
		expect(indicator).toBeInTheDocument();
	});

	it('renders badge variant with online status', () => {
		const { container } = renderWithProviders(<StatusIndicator variant="badge" status="online" />);
		const indicator = getBadgeIndicator(container);
		expect(indicator).toBeInTheDocument();
	});

	it('renders badge variant with offline status', () => {
		const { container } = renderWithProviders(<StatusIndicator variant="badge" status="offline" />);
		const indicator = getBadgeIndicator(container);
		expect(indicator).toBeInTheDocument();
	});

	it('renders badge variant with busy status', () => {
		const { container } = renderWithProviders(<StatusIndicator variant="badge" status="busy" />);
		const indicator = getBadgeIndicator(container);
		expect(indicator).toBeInTheDocument();
	});

	it('renders badge variant with away status', () => {
		const { container } = renderWithProviders(<StatusIndicator variant="badge" status="away" />);
		const indicator = getBadgeIndicator(container);
		expect(indicator).toBeInTheDocument();
	});
});

describe('StatusIndicator - Size Variants', () => {
	it('renders with sm size', () => {
		renderWithProviders(<StatusIndicator size="sm" />);
		const indicator = screen.getByLabelText('Status: online');
		expect(indicator).toBeInTheDocument();
	});

	it('renders with md size (default)', () => {
		renderWithProviders(<StatusIndicator size="md" />);
		const indicator = screen.getByLabelText('Status: online');
		expect(indicator).toBeInTheDocument();
	});

	it('renders with lg size', () => {
		renderWithProviders(<StatusIndicator size="lg" />);
		const indicator = screen.getByLabelText('Status: online');
		expect(indicator).toBeInTheDocument();
	});

	it('renders badge variant with sm size', () => {
		const { container } = renderWithProviders(<StatusIndicator variant="badge" size="sm" />);
		const indicator = getBadgeIndicator(container);
		expect(indicator).toBeInTheDocument();
	});

	it('renders badge variant with md size', () => {
		const { container } = renderWithProviders(<StatusIndicator variant="badge" size="md" />);
		const indicator = getBadgeIndicator(container);
		expect(indicator).toBeInTheDocument();
	});

	it('renders badge variant with lg size', () => {
		const { container } = renderWithProviders(<StatusIndicator variant="badge" size="lg" />);
		const indicator = getBadgeIndicator(container);
		expect(indicator).toBeInTheDocument();
	});
});

describe('StatusIndicator - Label', () => {
	it('renders badge variant without label', () => {
		const { container } = renderWithProviders(<StatusIndicator variant="badge" />);
		const indicator = getBadgeIndicator(container);
		expect(indicator).toBeInTheDocument();
		expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
	});

	it('renders badge variant with label', () => {
		renderWithProviders(<StatusIndicator variant="badge" label="Online" />);
		expect(screen.getByText('Online')).toBeInTheDocument();
	});

	it('renders badge variant with different label text', () => {
		renderWithProviders(<StatusIndicator variant="badge" label="Offline" />);
		expect(screen.getByText('Offline')).toBeInTheDocument();
	});

	it('renders badge variant with label and status', () => {
		renderWithProviders(<StatusIndicator variant="badge" status="busy" label="Busy" />);
		expect(screen.getByText('Busy')).toBeInTheDocument();
	});

	it('does not render label for dot variant', () => {
		renderWithProviders(<StatusIndicator variant="dot" label="Should not appear" />);
		expect(screen.queryByText('Should not appear')).not.toBeInTheDocument();
	});
});

describe('StatusIndicator - Animated', () => {
	it('renders dot variant without animation by default', () => {
		renderWithProviders(<StatusIndicator />);
		const indicator = screen.getByLabelText('Status: online');
		expect(indicator).toBeInTheDocument();
		// Check that animate-pulse class is not present when animated is false
		expect(indicator.className).not.toContain('animate-pulse');
	});

	it('renders dot variant with animation', () => {
		renderWithProviders(<StatusIndicator animated />);
		const indicator = screen.getByLabelText('Status: online');
		expect(indicator.className).toContain('animate-pulse');
	});

	it('renders badge variant without animation by default', () => {
		const { container } = renderWithProviders(<StatusIndicator variant="badge" />);
		const indicator = getBadgeIndicator(container);
		expect(indicator).toBeInTheDocument();
	});

	it('renders badge variant with animation', () => {
		const { container } = renderWithProviders(<StatusIndicator variant="badge" animated />);
		const indicator = getBadgeIndicator(container);
		expect(indicator).toBeInTheDocument();
		// The dot inside the badge should have animate-pulse
		const dot = indicator.querySelector('span[aria-hidden="true"]');
		expect(dot).toBeInTheDocument();
		expect(dot?.className).toContain('animate-pulse');
	});

	it('renders dot variant with animation and custom status', () => {
		renderWithProviders(<StatusIndicator status="busy" animated />);
		const indicator = screen.getByLabelText('Status: busy');
		expect(indicator.className).toContain('animate-pulse');
	});

	it('renders badge variant with animation and label', () => {
		const { container } = renderWithProviders(
			<StatusIndicator variant="badge" animated label="Online" />
		);
		expect(screen.getByText('Online')).toBeInTheDocument();
		const indicator = getBadgeIndicator(container);
		const dot = indicator.querySelector('span[aria-hidden="true"]');
		expect(dot?.className).toContain('animate-pulse');
	});
});

describe('StatusIndicator - Accessibility', () => {
	it('has aria-label for dot variant', () => {
		renderWithProviders(<StatusIndicator status="online" />);
		const indicator = screen.getByLabelText('Status: online');
		expect(indicator).toHaveAttribute('aria-label', 'Status: online');
	});

	it('has correct aria-label for different statuses', () => {
		const { rerender } = renderWithProviders(<StatusIndicator status="offline" />);
		expect(screen.getByLabelText('Status: offline')).toHaveAttribute(
			'aria-label',
			'Status: offline'
		);

		rerender(<StatusIndicator status="busy" />);
		expect(screen.getByLabelText('Status: busy')).toHaveAttribute('aria-label', 'Status: busy');

		rerender(<StatusIndicator status="away" />);
		expect(screen.getByLabelText('Status: away')).toHaveAttribute('aria-label', 'Status: away');
	});

	it('has aria-hidden on dot inside badge variant', () => {
		const { container } = renderWithProviders(<StatusIndicator variant="badge" />);
		const indicator = getBadgeIndicator(container);
		const dot = indicator.querySelector('span[aria-hidden="true"]');
		expect(dot).toBeInTheDocument();
		expect(dot).toHaveAttribute('aria-hidden', 'true');
	});
});

describe('StatusIndicator - HTML Attributes', () => {
	it('spreads HTML attributes to dot variant', () => {
		renderWithProviders(<StatusIndicator data-testid="status-dot" id="test-id" />);
		const indicator = screen.getByTestId('status-dot');
		expect(indicator).toHaveAttribute('id', 'test-id');
	});

	it('spreads HTML attributes to badge variant', () => {
		renderWithProviders(
			<StatusIndicator variant="badge" data-testid="status-badge" id="badge-id" />
		);
		const indicator = screen.getByTestId('status-badge');
		expect(indicator).toHaveAttribute('id', 'badge-id');
	});

	it('handles onClick event', () => {
		const handleClick = vi.fn();
		renderWithProviders(<StatusIndicator onClick={handleClick} />);
		const indicator = screen.getByLabelText('Status: online');
		indicator.click();
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('handles onClick event on badge variant', () => {
		const handleClick = vi.fn();
		const { container } = renderWithProviders(
			<StatusIndicator variant="badge" onClick={handleClick} />
		);
		const indicator = getBadgeIndicator(container);
		indicator.click();
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});

describe('StatusIndicator - Combined Props', () => {
	it('renders with all props combined (dot variant)', () => {
		renderWithProviders(
			<StatusIndicator
				status="busy"
				variant="dot"
				size="lg"
				animated
				className="custom-class"
				data-testid="combined-dot"
			/>
		);
		const indicator = screen.getByTestId('combined-dot');
		expect(indicator).toBeInTheDocument();
		expect(indicator).toHaveClass('custom-class');
		expect(indicator).toHaveAttribute('aria-label', 'Status: busy');
		expect(indicator.className).toContain('animate-pulse');
	});

	it('renders with all props combined (badge variant)', () => {
		renderWithProviders(
			<StatusIndicator
				status="away"
				variant="badge"
				size="sm"
				label="Away"
				animated
				className="custom-badge-class"
				data-testid="combined-badge"
			/>
		);
		const indicator = screen.getByTestId('combined-badge');
		expect(indicator).toBeInTheDocument();
		expect(indicator).toHaveClass('custom-badge-class');
		expect(screen.getByText('Away')).toBeInTheDocument();
		const dot = indicator.querySelector('span[aria-hidden="true"]');
		expect(dot?.className).toContain('animate-pulse');
	});

	it('renders all status variants with badge and label', () => {
		const statuses = ['online', 'offline', 'busy', 'away'] as const;
		for (const status of statuses) {
			const { unmount } = renderWithProviders(
				<StatusIndicator
					variant="badge"
					status={status}
					label={status.charAt(0).toUpperCase() + status.slice(1)}
				/>
			);
			expect(
				screen.getByText(status.charAt(0).toUpperCase() + status.slice(1))
			).toBeInTheDocument();
			unmount();
		}
	});

	it('renders all size variants with badge variant', () => {
		const sizes = ['sm', 'md', 'lg'] as const;
		for (const size of sizes) {
			const { unmount } = renderWithProviders(
				<StatusIndicator variant="badge" size={size} label="Test" />
			);
			expect(screen.getByText('Test')).toBeInTheDocument();
			unmount();
		}
	});
});

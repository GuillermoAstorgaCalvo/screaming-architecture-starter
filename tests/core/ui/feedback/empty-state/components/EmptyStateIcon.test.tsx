/**
 * EmptyStateIcon Component Tests
 *
 * Tests for the EmptyStateIcon component including:
 * - Rendering with icon
 * - Rendering without icon (null case)
 * - Size variants (sm, md, lg)
 * - CSS classes application
 */

import { EmptyStateIcon } from '@core/ui/feedback/empty-state/components/EmptyStateIcon';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const TestIcon = () => <svg data-testid="test-icon">Icon</svg>;

describe('EmptyStateIcon - Rendering', () => {
	it('renders icon when provided', () => {
		render(<EmptyStateIcon icon={<TestIcon />} size="md" />);

		const icon = screen.getByTestId('test-icon');
		expect(icon).toBeInTheDocument();
	});

	it('returns null when icon is null', () => {
		const { container } = render(<EmptyStateIcon icon={null} size="md" />);

		expect(container.firstChild).toBeNull();
	});

	it('returns null when icon is undefined', () => {
		const { container } = render(<EmptyStateIcon icon={undefined} size="md" />);

		expect(container.firstChild).toBeNull();
	});
});

describe('EmptyStateIcon - Size Variants', () => {
	it('applies correct classes for lg size', () => {
		const { container } = render(<EmptyStateIcon icon={<TestIcon />} size="lg" />);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass('mb-4', 'text-muted-foreground');
	});

	it('applies correct classes for md size', () => {
		const { container } = render(<EmptyStateIcon icon={<TestIcon />} size="md" />);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass('mb-2', 'text-muted-foreground');
	});

	it('applies correct classes for sm size', () => {
		const { container } = render(<EmptyStateIcon icon={<TestIcon />} size="sm" />);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass('mb-2', 'text-muted-foreground');
	});
});

describe('EmptyStateIcon - Icon Content', () => {
	it('renders custom ReactNode icon', () => {
		const CustomIcon = () => <div data-testid="custom-icon">Custom</div>;
		render(<EmptyStateIcon icon={<CustomIcon />} size="md" />);

		expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
	});

	it('preserves icon structure', () => {
		render(<EmptyStateIcon icon={<TestIcon />} size="md" />);

		const icon = screen.getByTestId('test-icon');
		expect(icon).toBeInTheDocument();
		expect(icon.closest('div')).toHaveClass('mb-2', 'text-muted-foreground');
	});
});

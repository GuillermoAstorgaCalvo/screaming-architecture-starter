/**
 * Icon Component Tests
 *
 * Tests for the Icon component including:
 * - Rendering registered icons
 * - Size variants
 * - Fallback handling
 * - Props forwarding
 * - Class name merging
 * - Warning for missing icons
 */

import Icon from '@core/ui/icons/Icon';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock console.warn to test warnings
const originalWarn = console.warn;
beforeEach(() => {
	console.warn = vi.fn();
});

afterEach(() => {
	console.warn = originalWarn;
});

describe('Icon - Rendering', () => {
	it('should render registered icon', () => {
		const { container } = render(<Icon name="search" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('should render icon with default size', () => {
		const { container } = render(<Icon name="search" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('should render icon with sm size', () => {
		const { container } = render(<Icon name="search" size="sm" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveClass('w-4', 'h-4');
	});

	it('should render icon with md size', () => {
		const { container } = render(<Icon name="search" size="md" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveClass('w-5', 'h-5');
	});

	it('should render icon with lg size', () => {
		const { container } = render(<Icon name="search" size="lg" />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveClass('w-6', 'h-6');
	});

	it('should apply custom className', () => {
		const { container } = render(<Icon name="search" className="custom-class" />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveClass('custom-class');
	});

	it('should forward additional props to icon component', () => {
		render(<Icon name="search" data-testid="custom-icon" />);
		const svg = screen.getByTestId('custom-icon');
		expect(svg).toBeInTheDocument();
	});

	it('should render different registered icons', () => {
		const { rerender, container } = render(<Icon name="search" />);
		expect(container.querySelector('svg')).toBeInTheDocument();

		rerender(<Icon name="settings" />);
		expect(container.querySelector('svg')).toBeInTheDocument();

		rerender(<Icon name="close" />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});
});

describe('Icon - Fallback', () => {
	it('should render fallback when icon not found', () => {
		const fallback = <span data-testid="fallback">Fallback Icon</span>;
		render(<Icon name="non-existent" fallback={fallback} />);
		expect(screen.getByTestId('fallback')).toBeInTheDocument();
	});

	it('should not render fallback when icon is found', () => {
		const fallback = <span data-testid="fallback">Fallback Icon</span>;
		render(<Icon name="search" fallback={fallback} />);
		expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
	});

	it('should return null when icon not found and no fallback', () => {
		const { container } = render(<Icon name="non-existent" />);
		expect(container.firstChild).toBeNull();
	});

	it('should warn when icon not found and no fallback', () => {
		render(<Icon name="non-existent" />);
		expect(console.warn).toHaveBeenCalledWith('Icon "non-existent" not found in registry');
	});

	it('should not warn when icon is found', () => {
		render(<Icon name="search" />);
		expect(console.warn).not.toHaveBeenCalled();
	});
});

describe('Icon - Size Variants', () => {
	it('should apply size classes correctly', () => {
		const { rerender, container } = render(<Icon name="search" size="sm" />);
		let svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveClass('w-4', 'h-4');

		rerender(<Icon name="search" size="md" />);
		svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveClass('w-5', 'h-5');

		rerender(<Icon name="search" size="lg" />);
		svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveClass('w-6', 'h-6');
	});
});

describe('Icon - Edge Cases', () => {
	it('should handle empty string as icon name', () => {
		const fallback = <span data-testid="fallback">Fallback</span>;
		render(<Icon name="" fallback={fallback} />);
		expect(screen.getByTestId('fallback')).toBeInTheDocument();
	});

	it('should handle undefined className', () => {
		const { container } = render(<Icon name="search" className={undefined} />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});
});

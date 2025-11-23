import Backdrop from '@core/ui/overlays/backdrop/Backdrop';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('Backdrop Component - Basic Rendering', () => {
	it('renders nothing when isOpen is false', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={false} />);

		expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
	});

	it('renders Backdrop when isOpen is true', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} />);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toBeInTheDocument();
		expect(backdrop).toHaveAttribute('aria-hidden', 'true');
	});

	it('renders Backdrop with default variant', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} />);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toBeInTheDocument();
	});

	it('renders Backdrop with default opacity', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} />);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toBeInTheDocument();
	});
});

describe('Backdrop Component - Variants', () => {
	it('renders with default variant', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} variant="default" />);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toBeInTheDocument();
	});

	it('renders with blur variant', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} variant="blur" />);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toHaveClass('backdrop-blur-md');
	});

	it('renders with solid variant', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} variant="solid" />);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toBeInTheDocument();
		expect(backdrop).not.toHaveClass('backdrop-blur-md');
	});
});

describe('Backdrop Component - Opacity', () => {
	it('renders with default opacity', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} opacity="default" />);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toHaveClass('bg-overlay');
	});

	it('renders with light opacity', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} opacity="light" />);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toHaveClass('bg-overlay-light');
	});

	it('renders with medium opacity', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} opacity="medium" />);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toHaveClass('bg-overlay-medium');
	});

	it('renders with dark opacity', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} opacity="dark" />);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toHaveClass('bg-overlay-dark');
	});
});

describe('Backdrop Component - Click Handling', () => {
	it('calls onClick when backdrop is clicked', () => {
		const onClick = vi.fn();
		const { container } = renderWithProviders(<Backdrop isOpen={true} onClick={onClick} />);

		const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement;
		fireEvent.click(backdrop);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('does not call onClick when onClick is not provided', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} />);

		const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement;
		expect(() => fireEvent.click(backdrop)).not.toThrow();
	});

	it('calls onClick only when target is currentTarget', () => {
		const onClick = vi.fn();
		const { container } = renderWithProviders(<Backdrop isOpen={true} onClick={onClick} />);
		const childElement = document.createElement('div');
		childElement.setAttribute('data-testid', 'child');
		childElement.textContent = 'Child content';
		container.appendChild(childElement);

		const child = screen.getByTestId('child');
		fireEvent.click(child);

		// Clicking child should not trigger onClick
		expect(onClick).not.toHaveBeenCalled();
	});

	it('calls onClick when clicking backdrop directly', () => {
		const onClick = vi.fn();
		const { container } = renderWithProviders(<Backdrop isOpen={true} onClick={onClick} />);

		// Get the backdrop element (it's the container's first child)
		const backdrop = container.firstChild as HTMLElement;
		fireEvent.click(backdrop);

		expect(onClick).toHaveBeenCalledTimes(1);
	});
});

describe('Backdrop Component - Custom Styling', () => {
	it('applies custom className', () => {
		const { container } = renderWithProviders(
			<Backdrop isOpen={true} className="custom-backdrop" />
		);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toHaveClass('custom-backdrop');
	});

	it('applies custom zIndex', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} zIndex={9999} />);

		const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement;
		expect(backdrop.style.zIndex).toBe('9999');
	});

	it('does not apply zIndex style when zIndex is undefined', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} />);

		const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement;
		// zIndex should not be in inline styles when undefined
		expect(backdrop.style.zIndex).toBe('');
	});
});

describe('Backdrop Component - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} />);

		await expectA11y(container);
	});

	it('has aria-hidden attribute', () => {
		const { container } = renderWithProviders(<Backdrop isOpen={true} />);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toHaveAttribute('aria-hidden', 'true');
	});
});

describe('Backdrop Component - Combinations', () => {
	it('renders with blur variant and light opacity', () => {
		const { container } = renderWithProviders(
			<Backdrop isOpen={true} variant="blur" opacity="light" />
		);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toHaveClass('backdrop-blur-md');
		expect(backdrop).toHaveClass('bg-overlay-light');
	});

	it('renders with solid variant and dark opacity', () => {
		const { container } = renderWithProviders(
			<Backdrop isOpen={true} variant="solid" opacity="dark" />
		);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).not.toHaveClass('backdrop-blur-md');
		expect(backdrop).toHaveClass('bg-overlay-dark');
	});

	it('renders with custom className, zIndex, and onClick', () => {
		const onClick = vi.fn();
		const { container } = renderWithProviders(
			<Backdrop isOpen={true} className="custom" zIndex={5000} onClick={onClick} />
		);

		const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement;
		expect(backdrop).toHaveClass('custom');
		expect(backdrop.style.zIndex).toBe('5000');

		fireEvent.click(backdrop);
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});

describe('Backdrop Component - Edge Cases', () => {
	it('handles rapid open/close state changes', () => {
		const { container, rerender } = renderWithProviders(<Backdrop isOpen={true} />);

		expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();

		rerender(<Backdrop isOpen={false} />);
		expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();

		rerender(<Backdrop isOpen={true} />);
		expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
	});

	it('handles onClick with event object', () => {
		const onClick = vi.fn();
		const { container } = renderWithProviders(<Backdrop isOpen={true} onClick={onClick} />);

		const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement;
		fireEvent.click(backdrop);

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(expect.any(Object));
	});

	it('merges custom className with variant and opacity classes', () => {
		const { container } = renderWithProviders(
			<Backdrop isOpen={true} variant="blur" opacity="light" className="custom-class" />
		);

		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toHaveClass('custom-class');
		expect(backdrop).toHaveClass('backdrop-blur-md');
		expect(backdrop).toHaveClass('bg-overlay-light');
	});
});

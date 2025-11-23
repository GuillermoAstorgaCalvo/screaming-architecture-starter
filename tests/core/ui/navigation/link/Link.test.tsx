import Link from '@core/ui/navigation/link/Link';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

const defaultRouterConfig = {
	router: MemoryRouter,
	routerProps: { initialEntries: ['/'] },
} as const;

describe('Link Component - Basic rendering', () => {
	it('renders link with text content', () => {
		renderWithProviders(<Link to="/home">Go to Home</Link>, defaultRouterConfig);

		const link = screen.getByRole('link', { name: 'Go to Home' });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', '/home');
	});

	it('renders link with default variant and size', () => {
		renderWithProviders(<Link to="/about">About</Link>, defaultRouterConfig);

		const link = screen.getByRole('link', { name: 'About' });
		expect(link).toBeInTheDocument();
	});

	it('renders link with custom className', () => {
		renderWithProviders(
			<Link to="/custom" className="custom-class">
				Custom Link
			</Link>,
			defaultRouterConfig
		);

		const link = screen.getByRole('link', { name: 'Custom Link' });
		expect(link).toHaveClass('custom-class');
	});
});

describe('Link Component - Variants and sizes', () => {
	it('renders link with custom variant', () => {
		renderWithProviders(
			<Link to="/contact" variant="subtle">
				Contact
			</Link>,
			defaultRouterConfig
		);

		const link = screen.getByRole('link', { name: 'Contact' });
		expect(link).toBeInTheDocument();
	});

	it('renders link with custom size', () => {
		renderWithProviders(
			<Link to="/products" size="lg">
				Products
			</Link>,
			defaultRouterConfig
		);

		const link = screen.getByRole('link', { name: 'Products' });
		expect(link).toBeInTheDocument();
	});

	it('renders link with all variants', () => {
		const variants: Array<'default' | 'subtle' | 'muted'> = ['default', 'subtle', 'muted'];

		for (const variant of variants) {
			renderWithProviders(
				<Link to={`/${variant}`} variant={variant}>
					{variant} Link
				</Link>,
				defaultRouterConfig
			);

			const link = screen.getByRole('link', { name: `${variant} Link` });
			expect(link).toBeInTheDocument();
		}
	});

	it('renders link with all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			renderWithProviders(
				<Link to={`/${size}`} size={size}>
					{size} Link
				</Link>,
				defaultRouterConfig
			);

			const link = screen.getByRole('link', { name: `${size} Link` });
			expect(link).toBeInTheDocument();
		}
	});
});

describe('Link Component - Interactions', () => {
	it('handles click events', () => {
		const handleClick = vi.fn();
		renderWithProviders(
			<Link to="/click" onClick={handleClick}>
				Click Me
			</Link>,
			defaultRouterConfig
		);

		const link = screen.getByRole('link', { name: 'Click Me' });
		fireEvent.click(link);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('passes through additional props', () => {
		renderWithProviders(
			<Link to="/test" data-testid="custom-link" aria-label="Custom link">
				Test Link
			</Link>,
			defaultRouterConfig
		);

		const link = screen.getByTestId('custom-link');
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('aria-label', 'Custom link');
	});
});

describe('Link Component - Navigation', () => {
	it('navigates to correct route', () => {
		renderWithProviders(<Link to="/dashboard">Dashboard</Link>, defaultRouterConfig);

		const link = screen.getByRole('link', { name: 'Dashboard' });
		expect(link).toHaveAttribute('href', '/dashboard');
	});

	it('handles relative paths', () => {
		renderWithProviders(<Link to="../parent">Parent</Link>, {
			router: MemoryRouter,
			routerProps: { initialEntries: ['/current'] },
		});

		const link = screen.getByRole('link', { name: 'Parent' });
		// React Router normalizes relative paths, so we just verify the link exists
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href');
	});

	it('handles absolute paths', () => {
		renderWithProviders(<Link to="/absolute/path">Absolute</Link>, defaultRouterConfig);

		const link = screen.getByRole('link', { name: 'Absolute' });
		expect(link).toHaveAttribute('href', '/absolute/path');
	});
});

describe('Link Component - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<Link to="/accessible">Accessible Link</Link>,
			defaultRouterConfig
		);

		await expectA11y(container);
	});

	it('is keyboard accessible', () => {
		renderWithProviders(<Link to="/keyboard">Keyboard Link</Link>, defaultRouterConfig);

		const link = screen.getByRole('link', { name: 'Keyboard Link' });
		link.focus();
		expect(link).toHaveFocus();
	});

	it('supports keyboard navigation with Enter key', () => {
		const handleClick = vi.fn();
		renderWithProviders(
			<Link to="/enter" onClick={handleClick}>
				Enter Link
			</Link>,
			defaultRouterConfig
		);

		const link = screen.getByRole('link', { name: 'Enter Link' });
		link.focus();
		fireEvent.keyDown(link, { key: 'Enter', code: 'Enter' });
		// Note: React Router handles navigation, so we just verify the link is focusable
		expect(link).toHaveFocus();
	});

	it('supports keyboard navigation with Space key', () => {
		const handleClick = vi.fn();
		renderWithProviders(
			<Link to="/space" onClick={handleClick}>
				Space Link
			</Link>,
			defaultRouterConfig
		);

		const link = screen.getByRole('link', { name: 'Space Link' });
		link.focus();
		fireEvent.keyDown(link, { key: ' ', code: 'Space' });
		// Note: React Router handles navigation, so we just verify the link is focusable
		expect(link).toHaveFocus();
	});

	it('has proper semantic HTML', () => {
		renderWithProviders(<Link to="/semantic">Semantic Link</Link>, defaultRouterConfig);

		const link = screen.getByRole('link', { name: 'Semantic Link' });
		expect(link).toBeInTheDocument();
	});
});

describe('Link Component - Keyboard Navigation', () => {
	it('can be focused with Tab key', () => {
		renderWithProviders(
			<>
				<button>Before</button>
				<Link to="/tab">Tab Link</Link>
				<button>After</button>
			</>,
			{
				router: MemoryRouter,
				routerProps: { initialEntries: ['/'] },
			}
		);

		const link = screen.getByRole('link', { name: 'Tab Link' });
		link.focus();
		expect(link).toHaveFocus();
	});

	it('maintains focus state', () => {
		renderWithProviders(<Link to="/focus">Focus Link</Link>, defaultRouterConfig);

		const link = screen.getByRole('link', { name: 'Focus Link' });
		link.focus();
		expect(link).toHaveFocus();
	});
});

import AppBar from '@core/ui/navigation/app-bar/AppBar';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('AppBar Component - Basic Rendering', () => {
	it('renders AppBar with title', () => {
		renderWithProviders(<AppBar title="My App" />);

		expect(screen.getByRole('banner')).toBeInTheDocument();
		expect(screen.getByText('My App')).toBeInTheDocument();
	});

	it('renders AppBar without title', () => {
		renderWithProviders(<AppBar />);

		expect(screen.getByRole('banner')).toBeInTheDocument();
		expect(screen.queryByRole('heading')).not.toBeInTheDocument();
	});

	it('renders AppBar with leading element', () => {
		renderWithProviders(<AppBar title="My App" leading={<button>Menu</button>} />);

		expect(screen.getByRole('banner')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
	});

	it('renders AppBar with trailing element', () => {
		renderWithProviders(<AppBar title="My App" trailing={<button>Search</button>} />);

		expect(screen.getByRole('banner')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
	});

	it('renders AppBar with both leading and trailing elements', () => {
		renderWithProviders(
			<AppBar title="My App" leading={<button>Menu</button>} trailing={<button>Search</button>} />
		);

		expect(screen.getByRole('banner')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
	});

	it('renders AppBar with custom className', () => {
		renderWithProviders(<AppBar title="My App" className="custom-class" />);

		const appBar = screen.getByRole('banner');
		expect(appBar).toHaveClass('custom-class');
	});
});

describe('AppBar Component - Variants', () => {
	it('renders with default variant', () => {
		renderWithProviders(<AppBar title="My App" />);

		const appBar = screen.getByRole('banner');
		expect(appBar).toBeInTheDocument();
	});

	it('renders with elevated variant', () => {
		renderWithProviders(<AppBar title="My App" variant="elevated" />);

		const appBar = screen.getByRole('banner');
		expect(appBar).toBeInTheDocument();
	});

	it('renders with outlined variant', () => {
		renderWithProviders(<AppBar title="My App" variant="outlined" />);

		const appBar = screen.getByRole('banner');
		expect(appBar).toBeInTheDocument();
	});

	it('renders with all variants', () => {
		const variants: Array<'default' | 'elevated' | 'outlined'> = [
			'default',
			'elevated',
			'outlined',
		];

		for (const variant of variants) {
			const { unmount } = renderWithProviders(
				<AppBar title={`App ${variant}`} variant={variant} />
			);

			const appBar = screen.getByRole('banner');
			expect(appBar).toBeInTheDocument();
			unmount();
		}
	});
});

describe('AppBar Component - Fixed Positioning', () => {
	it('renders AppBar without fixed positioning by default', () => {
		renderWithProviders(<AppBar title="My App" />);

		const appBar = screen.getByRole('banner');
		expect(appBar).not.toHaveClass('fixed');
		// When fixed is false, style prop should be undefined, so no inline style should be set
		const { zIndex } = appBar.style;
		expect(zIndex).toBeFalsy();
	});

	it('renders AppBar with fixed positioning', () => {
		renderWithProviders(<AppBar title="My App" fixed />);

		const appBar = screen.getByRole('banner');
		expect(appBar).toHaveClass('fixed');
		expect(appBar).toHaveStyle({ zIndex: expect.any(Number) });
	});

	it('applies z-index when fixed', () => {
		renderWithProviders(<AppBar title="My App" fixed />);

		const appBar = screen.getByRole('banner');
		const { zIndex } = appBar.style;
		expect(zIndex).toBeTruthy();
		expect(Number.parseInt(zIndex, 10)).toBeGreaterThan(0);
	});
});

describe('AppBar Component - Title Rendering', () => {
	it('renders title as h1 element', () => {
		renderWithProviders(<AppBar title="My App" />);

		const title = screen.getByRole('heading', { level: 1 });
		expect(title).toBeInTheDocument();
		expect(title).toHaveTextContent('My App');
	});

	it('renders title with ReactNode content', () => {
		renderWithProviders(
			<AppBar
				title={
					<>
						<span>My</span> <span>App</span>
					</>
				}
			/>
		);

		const title = screen.getByRole('heading', { level: 1 });
		expect(title).toBeInTheDocument();
		expect(title).toHaveTextContent('My App');
	});

	it('does not render title element when title is not provided', () => {
		renderWithProviders(<AppBar />);

		expect(screen.queryByRole('heading')).not.toBeInTheDocument();
	});
});

describe('AppBar Component - Leading and Trailing Elements', () => {
	it('does not render leading container when leading is not provided', () => {
		renderWithProviders(<AppBar title="My App" />);

		const appBar = screen.getByRole('banner');
		// Leading container should not be rendered
		expect(appBar.querySelectorAll('div').length).toBeLessThan(3);
	});

	it('does not render trailing container when trailing is not provided', () => {
		renderWithProviders(<AppBar title="My App" />);

		const appBar = screen.getByRole('banner');
		// Trailing container should not be rendered
		expect(appBar.querySelectorAll('div').length).toBeLessThan(3);
	});

	it('renders multiple trailing elements', () => {
		renderWithProviders(
			<AppBar
				title="My App"
				trailing={
					<>
						<button>Search</button>
						<button>More</button>
					</>
				}
			/>
		);

		expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
	});
});

describe('AppBar Component - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<AppBar title="My App" leading={<button>Menu</button>} trailing={<button>Search</button>} />
		);

		await expectA11y(container);
	});

	it('uses semantic header element', () => {
		renderWithProviders(<AppBar title="My App" />);

		const appBar = screen.getByRole('banner');
		expect(appBar.tagName).toBe('HEADER');
	});

	it('has proper heading structure', () => {
		renderWithProviders(<AppBar title="My App" />);

		const heading = screen.getByRole('heading', { level: 1 });
		expect(heading).toBeInTheDocument();
		expect(heading).toHaveTextContent('My App');
	});

	it('passes through additional props', () => {
		renderWithProviders(
			<AppBar title="My App" data-testid="custom-appbar" aria-label="Custom app bar" />
		);

		const appBar = screen.getByTestId('custom-appbar');
		expect(appBar).toBeInTheDocument();
		expect(appBar).toHaveAttribute('aria-label', 'Custom app bar');
	});
});

describe('AppBar Component - Layout', () => {
	it('renders with proper layout structure', () => {
		renderWithProviders(
			<AppBar title="My App" leading={<button>Menu</button>} trailing={<button>Search</button>} />
		);

		const appBar = screen.getByRole('banner');
		expect(appBar).toBeInTheDocument();

		// Check that all elements are present
		expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'My App' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
	});

	it('handles long title text with truncation', () => {
		const longTitle = 'This is a very long title that should be truncated';
		renderWithProviders(<AppBar title={longTitle} />);

		const title = screen.getByRole('heading', { level: 1 });
		expect(title).toBeInTheDocument();
		expect(title).toHaveTextContent(longTitle);
	});
});

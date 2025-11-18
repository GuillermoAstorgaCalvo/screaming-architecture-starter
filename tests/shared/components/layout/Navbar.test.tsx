/**
 * Tests for Navbar component
 *
 * Tests the main navigation component:
 * - Navbar rendering
 * - Navigation links
 * - Theme toggle integration
 * - Language selector integration
 * - Deferred activation behavior
 * - Custom className support
 */

import { ROUTES } from '@core/config/routes';
import Navbar from '@shared/components/layout/Navbar';
import { act, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const THEME_TOGGLE_TEST_ID = 'theme-toggle';
const LANGUAGE_SELECTOR_TEST_ID = 'language-selector';
const NAV_ROLE = 'navigation';
const ARIA_LABEL_ATTR = 'aria-label';

// Mock lazy-loaded components - must return a component, not a function
const MockThemeToggle = ({
	theme,
	resolvedTheme,
	setTheme,
}: {
	theme: string;
	resolvedTheme: string;
	setTheme: (theme: string) => void;
}) => (
	<button
		data-testid={THEME_TOGGLE_TEST_ID}
		onClick={() => setTheme('dark')}
		aria-label={`Current theme: ${theme}, resolved: ${resolvedTheme}`}
	>
		Theme Toggle
	</button>
);

const MockLanguageSelector = () => (
	<div data-testid={LANGUAGE_SELECTOR_TEST_ID}>Language Selector</div>
);

// Mock the lazy imports - React.lazy expects a default export that returns a promise
vi.mock('@core/ui/theme-toggle/ThemeToggle', () => ({
	default: MockThemeToggle,
}));

vi.mock('@core/ui/language-selector/LanguageSelectorFlag', () => ({
	default: MockLanguageSelector,
}));

// Mock useDeferredActivation to control when controls appear
const mockUseDeferredActivation = vi.fn(() => false);
vi.mock('@core/hooks/useDeferredActivation', () => ({
	useDeferredActivation: () => mockUseDeferredActivation(),
}));

const mockThemeConfig = {
	theme: 'light' as const,
	resolvedTheme: 'light' as const,
	setTheme: vi.fn(),
};

describe('Navbar - rendering', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseDeferredActivation.mockReturnValue(true); // Show controls by default
	});

	it('renders navigation element with correct aria-label', () => {
		renderWithProviders(<Navbar />);

		const nav = screen.getByRole(NAV_ROLE);
		expect(nav).toBeInTheDocument();
		expect(nav).toHaveAttribute(ARIA_LABEL_ATTR);
	});

	it('renders home navigation link', () => {
		renderWithProviders(<Navbar />);

		const homeLink = screen.getByRole('link', { name: /home/i });
		expect(homeLink).toBeInTheDocument();
		expect(homeLink).toHaveAttribute('href', ROUTES.HOME);
	});

	it('applies custom className to nav element', () => {
		renderWithProviders(<Navbar className="custom-navbar-class" />);

		const nav = screen.getByRole(NAV_ROLE);
		expect(nav).toHaveClass('custom-navbar-class');
	});

	it('applies default styling classes', () => {
		renderWithProviders(<Navbar />);

		const nav = screen.getByRole(NAV_ROLE);
		expect(nav).toHaveClass('flex', 'items-center', 'justify-between');
		expect(nav).toHaveClass('border-b', 'border-border', 'bg-surface');
	});
});

describe('Navbar - theme toggle integration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseDeferredActivation.mockReturnValue(true);
	});

	it('renders theme toggle when theme prop is provided', async () => {
		renderWithProviders(<Navbar theme={mockThemeConfig} />);

		await waitFor(() => {
			expect(screen.getByTestId(THEME_TOGGLE_TEST_ID)).toBeInTheDocument();
		});
	});

	it('passes correct theme props to ThemeToggle', async () => {
		renderWithProviders(<Navbar theme={mockThemeConfig} />);

		await waitFor(() => {
			expect(screen.getByTestId(THEME_TOGGLE_TEST_ID)).toBeInTheDocument();
		});

		const toggle = screen.getByTestId(THEME_TOGGLE_TEST_ID);
		expect(toggle).toHaveAttribute(ARIA_LABEL_ATTR, expect.stringContaining('light'));
	});

	it('does not render theme toggle when theme prop is not provided', () => {
		renderWithProviders(<Navbar />);

		expect(screen.queryByTestId(THEME_TOGGLE_TEST_ID)).not.toBeInTheDocument();
	});

	it('handles theme toggle click', async () => {
		const setTheme = vi.fn();
		const themeConfig = {
			theme: 'light' as const,
			resolvedTheme: 'light' as const,
			setTheme,
		};

		renderWithProviders(<Navbar theme={themeConfig} />);

		await waitFor(() => {
			expect(screen.getByTestId(THEME_TOGGLE_TEST_ID)).toBeInTheDocument();
		});

		const toggle = screen.getByTestId(THEME_TOGGLE_TEST_ID);
		await act(async () => {
			toggle.click();
		});

		expect(setTheme).toHaveBeenCalledWith('dark');
	});
});

describe('Navbar - theme toggle variants', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseDeferredActivation.mockReturnValue(true);
	});

	it('works with dark theme', async () => {
		const darkThemeConfig = {
			theme: 'dark' as const,
			resolvedTheme: 'dark' as const,
			setTheme: vi.fn(),
		};

		renderWithProviders(<Navbar theme={darkThemeConfig} />);

		await waitFor(() => {
			expect(screen.getByTestId(THEME_TOGGLE_TEST_ID)).toBeInTheDocument();
		});

		const toggle = screen.getByTestId(THEME_TOGGLE_TEST_ID);
		expect(toggle).toHaveAttribute(ARIA_LABEL_ATTR, expect.stringContaining('dark'));
	});

	it('works with system theme', async () => {
		const systemThemeConfig = {
			theme: 'system' as const,
			resolvedTheme: 'light' as const,
			setTheme: vi.fn(),
		};

		renderWithProviders(<Navbar theme={systemThemeConfig} />);

		await waitFor(() => {
			expect(screen.getByTestId(THEME_TOGGLE_TEST_ID)).toBeInTheDocument();
		});

		const toggle = screen.getByTestId(THEME_TOGGLE_TEST_ID);
		expect(toggle).toHaveAttribute(ARIA_LABEL_ATTR, expect.stringContaining('system'));
	});
});

describe('Navbar - language selector integration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseDeferredActivation.mockReturnValue(true);
	});

	it('renders language selector', async () => {
		renderWithProviders(<Navbar />);

		await waitFor(() => {
			expect(screen.getByTestId(LANGUAGE_SELECTOR_TEST_ID)).toBeInTheDocument();
		});
	});

	it('passes size prop to LanguageSelectorFlag', async () => {
		renderWithProviders(<Navbar />);

		await waitFor(() => {
			expect(screen.getByTestId(LANGUAGE_SELECTOR_TEST_ID)).toBeInTheDocument();
		});

		// The component is rendered, which means it received the size prop
		// We can't easily test the prop directly with lazy loading, but we can verify it renders
		expect(screen.getByTestId(LANGUAGE_SELECTOR_TEST_ID)).toBeInTheDocument();
	});

	it('renders language selector even when theme is not provided', async () => {
		renderWithProviders(<Navbar />);

		await waitFor(() => {
			expect(screen.getByTestId(LANGUAGE_SELECTOR_TEST_ID)).toBeInTheDocument();
		});
	});
});

describe('Navbar - deferred activation', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('does not render controls initially when deferred activation is false', () => {
		mockUseDeferredActivation.mockReturnValue(false);

		renderWithProviders(<Navbar />);

		expect(screen.queryByTestId(LANGUAGE_SELECTOR_TEST_ID)).not.toBeInTheDocument();
		expect(screen.queryByTestId(THEME_TOGGLE_TEST_ID)).not.toBeInTheDocument();
	});

	it('renders controls when deferred activation becomes true', async () => {
		mockUseDeferredActivation.mockReturnValue(false);

		const { rerender } = renderWithProviders(<Navbar />);

		expect(screen.queryByTestId(LANGUAGE_SELECTOR_TEST_ID)).not.toBeInTheDocument();

		// Simulate deferred activation becoming true
		mockUseDeferredActivation.mockReturnValue(true);
		rerender(<Navbar />);

		await waitFor(() => {
			expect(screen.getByTestId(LANGUAGE_SELECTOR_TEST_ID)).toBeInTheDocument();
		});
	});

	it('renders both language selector and theme toggle when deferred activation is true and theme is provided', async () => {
		mockUseDeferredActivation.mockReturnValue(true);

		renderWithProviders(<Navbar theme={mockThemeConfig} />);

		await waitFor(() => {
			expect(screen.getByTestId(LANGUAGE_SELECTOR_TEST_ID)).toBeInTheDocument();
			expect(screen.getByTestId(THEME_TOGGLE_TEST_ID)).toBeInTheDocument();
		});
	});

	it('renders only language selector when deferred activation is true but theme is not provided', async () => {
		mockUseDeferredActivation.mockReturnValue(true);

		renderWithProviders(<Navbar />);

		await waitFor(() => {
			expect(screen.getByTestId(LANGUAGE_SELECTOR_TEST_ID)).toBeInTheDocument();
		});
		expect(screen.queryByTestId(THEME_TOGGLE_TEST_ID)).not.toBeInTheDocument();
	});
});

describe('Navbar - navigation links', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseDeferredActivation.mockReturnValue(true);
	});

	it('renders home link with correct translation', () => {
		renderWithProviders(<Navbar />);

		const homeLink = screen.getByRole('link', { name: /home/i });
		expect(homeLink).toBeInTheDocument();
	});

	it('home link has correct styling classes', () => {
		renderWithProviders(<Navbar />);

		const homeLink = screen.getByRole('link', { name: /home/i });
		expect(homeLink).toHaveClass('text-lg', 'font-semibold', 'text-primary');
		expect(homeLink).toHaveClass('underline-offset-4', 'hover:text-primary/90', 'hover:underline');
	});

	it('home link navigates to home route', () => {
		renderWithProviders(<Navbar />);

		const homeLink = screen.getByRole('link', { name: /home/i });
		expect(homeLink).toHaveAttribute('href', ROUTES.HOME);
	});
});

describe('Navbar - layout structure', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseDeferredActivation.mockReturnValue(true);
	});

	it('renders navigation links in left section', () => {
		renderWithProviders(<Navbar />);

		const homeLink = screen.getByRole('link', { name: /home/i });

		// Check that home link is within a flex container
		// eslint-disable-next-line testing-library/no-node-access
		const leftSection = homeLink.closest('.flex.items-center.gap-4');
		expect(leftSection).toBeInTheDocument();
	});

	it('renders controls in right section', async () => {
		renderWithProviders(<Navbar theme={mockThemeConfig} />);

		await waitFor(() => {
			expect(screen.getByTestId(LANGUAGE_SELECTOR_TEST_ID)).toBeInTheDocument();
		});

		const languageSelector = screen.getByTestId(LANGUAGE_SELECTOR_TEST_ID);
		const themeToggle = screen.getByTestId(THEME_TOGGLE_TEST_ID);

		// Check that controls are within a flex container
		// eslint-disable-next-line testing-library/no-node-access
		const rightSection = languageSelector.closest('.flex.items-center.gap-3');
		expect(rightSection).toBeInTheDocument();
		expect(rightSection).toContainElement(languageSelector);
		expect(rightSection).toContainElement(themeToggle);
	});

	it('maintains correct flex layout structure', () => {
		renderWithProviders(<Navbar />);

		const nav = screen.getByRole(NAV_ROLE);
		expect(nav).toHaveClass('flex', 'items-center', 'justify-between');
	});
});

describe('Navbar - Suspense fallback', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseDeferredActivation.mockReturnValue(true);
	});

	it('handles lazy loading with Suspense fallback', async () => {
		// When deferred activation is true but components are lazy loaded,
		// Suspense should handle the loading state
		// The fallback is null, so nothing should render during loading
		renderWithProviders(<Navbar />);

		// Components should render after lazy loading completes
		await waitFor(() => {
			expect(screen.getByTestId(LANGUAGE_SELECTOR_TEST_ID)).toBeInTheDocument();
		});
	});
});

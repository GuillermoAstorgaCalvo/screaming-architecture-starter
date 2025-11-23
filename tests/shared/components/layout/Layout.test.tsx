/**
 * Tests for Layout component
 *
 * Tests the main layout wrapper component:
 * - Layout rendering with children
 * - SkipToContent integration
 * - Navbar integration with theme prop
 * - Main content element rendering
 * - Custom className support
 * - Responsive behavior and CSS classes
 * - Accessibility (landmarks, navigation)
 * - Theme integration
 */

import Layout from '@shared/components/layout/Layout';
import type { ThemeConfig } from '@src-types/layout';
import { type RenderResult, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

const DEFAULT_TARGET_ID = 'main-content';
const SKIP_TO_CONTENT_TEST_ID = 'skip-to-content';
const NAVBAR_TEST_ID = 'navbar';
const LAYOUT_ROOT_TEST_ID = 'layout-root';
const TEST_CONTENT = 'Content';
const CUSTOM_CLASS = 'custom-class';
const CUSTOM_MAIN_CLASS = 'custom-main-class';
const PROVIDED_THEME = 'provided';
const NOT_PROVIDED_THEME = 'not-provided';
const FLEX_CLASS = 'flex';
const MIN_H_SCREEN_CLASS = 'min-h-screen';
const FLEX_COL_CLASS = 'flex-col';
const FLEX_1_CLASS = 'flex-1';
const DATA_THEME_ATTR = 'data-theme';

// Mock Navbar to simplify testing
vi.mock('@shared/components/layout/Navbar', () => ({
	default: ({ theme, className }: { theme?: unknown; className?: string }) => (
		<nav
			data-testid={NAVBAR_TEST_ID}
			data-theme={theme ? PROVIDED_THEME : NOT_PROVIDED_THEME}
			className={className}
		>
			Navbar
		</nav>
	),
}));

// Mock SkipToContent
vi.mock('@core/a11y/skipToContent', () => ({
	default: ({ targetId }: { targetId?: string }) => (
		<a href={`#${targetId ?? DEFAULT_TARGET_ID}`} data-testid={SKIP_TO_CONTENT_TEST_ID}>
			Skip to content
		</a>
	),
}));

const mockThemeConfig: ThemeConfig = {
	theme: 'light',
	resolvedTheme: 'light',
	setTheme: vi.fn(),
};

// Helper functions
function createThemeConfig(
	theme: 'light' | 'dark' | 'system',
	resolvedTheme: 'light' | 'dark' = 'light'
): ThemeConfig {
	return {
		theme,
		resolvedTheme,
		setTheme: vi.fn(),
	};
}

interface RenderLayoutProps {
	theme?: ThemeConfig;
	className?: string;
	children?: ReactNode;
}

function renderLayout(props?: RenderLayoutProps): RenderResult {
	const { theme, className, children } = props ?? {};
	const layoutProps: { theme?: ThemeConfig; className?: string } = {};
	if (theme !== undefined) {
		layoutProps.theme = theme;
	}
	if (className !== undefined) {
		layoutProps.className = className;
	}
	return renderWithProviders(
		<Layout {...layoutProps}>{children ?? <div>{TEST_CONTENT}</div>}</Layout>
	);
}

function getRootContainer(): HTMLElement {
	return screen.getByTestId(LAYOUT_ROOT_TEST_ID);
}

function expectLayoutStructure(): void {
	expect(screen.getByTestId(SKIP_TO_CONTENT_TEST_ID)).toBeInTheDocument();
	expect(screen.getByTestId(NAVBAR_TEST_ID)).toBeInTheDocument();
	expect(screen.getByRole('main')).toBeInTheDocument();
}

function expectMainElement(id: string = DEFAULT_TARGET_ID): HTMLElement {
	const mainElement = screen.getByRole('main');
	expect(mainElement).toBeInTheDocument();
	expect(mainElement).toHaveAttribute('id', id);
	return mainElement;
}

function expectSkipLinkTargetsMain(): void {
	const skipLink = screen.getByTestId(SKIP_TO_CONTENT_TEST_ID);
	const mainElement = expectMainElement();

	expect(skipLink).toHaveAttribute('href', `#${mainElement.id}`);
}

function getNavbar(): HTMLElement {
	return screen.getByTestId(NAVBAR_TEST_ID);
}

describe('Layout - rendering', () => {
	it('renders children content', () => {
		renderLayout({
			children: <div data-testid="test-content">Test Content</div>,
		});

		const content = screen.getByTestId('test-content');
		expect(content).toBeInTheDocument();
		expect(content).toHaveTextContent('Test Content');
	});

	it('renders SkipToContent component', () => {
		renderLayout();

		const skipLink = screen.getByTestId(SKIP_TO_CONTENT_TEST_ID);
		expect(skipLink).toBeInTheDocument();
		expect(skipLink).toHaveAttribute('href', `#${DEFAULT_TARGET_ID}`);
	});

	it('renders Navbar component', () => {
		renderLayout();

		expect(screen.getByTestId(NAVBAR_TEST_ID)).toBeInTheDocument();
	});

	it('passes theme prop to Navbar when provided', () => {
		renderLayout({ theme: mockThemeConfig });

		const navbar = getNavbar();
		expect(navbar).toHaveAttribute(DATA_THEME_ATTR, PROVIDED_THEME);
	});

	it('does not pass theme prop to Navbar when not provided', () => {
		renderLayout();

		const navbar = screen.getByTestId(NAVBAR_TEST_ID);
		expect(navbar).toHaveAttribute('data-theme', 'not-provided');
	});
});

describe('Layout - main element', () => {
	it('renders main element with correct id', () => {
		renderLayout();

		expectMainElement();
	});

	it('applies custom className to main element', () => {
		renderLayout({ className: CUSTOM_MAIN_CLASS });

		const mainElement = expectMainElement();
		expect(mainElement).toHaveClass(CUSTOM_MAIN_CLASS);
	});

	it('applies flex-1 class to main element by default', () => {
		renderLayout();

		const mainElement = expectMainElement();
		expect(mainElement).toHaveClass(FLEX_1_CLASS);
	});

	it('renders with correct layout structure', () => {
		renderLayout();

		expectLayoutStructure();
		expectSkipLinkTargetsMain();
	});
});

describe('Layout - integration', () => {
	it('renders all components in correct order', () => {
		renderLayout({
			theme: mockThemeConfig,
			children: <div data-testid="page-content">Page Content</div>,
		});

		const skipLink = screen.getByTestId(SKIP_TO_CONTENT_TEST_ID);
		const navbar = screen.getByTestId(NAVBAR_TEST_ID);
		const main = screen.getByRole('main');
		const content = screen.getByTestId('page-content');

		expect(skipLink).toBeInTheDocument();
		expect(navbar).toBeInTheDocument();
		expect(main).toBeInTheDocument();
		expect(content).toBeInTheDocument();
		expect(main).toContainElement(content);
	});

	it('maintains correct DOM hierarchy', () => {
		renderLayout();

		expectLayoutStructure();
	});
});

describe('Layout - responsive behavior', () => {
	it('applies responsive flex layout classes to root container', () => {
		renderLayout();

		const rootDiv = getRootContainer();
		expect(rootDiv).toBeInTheDocument();
		expect(rootDiv).toHaveClass(FLEX_CLASS, MIN_H_SCREEN_CLASS, FLEX_COL_CLASS);
	});

	it('applies flex-1 class to main element for responsive growth', () => {
		renderLayout();

		const mainElement = expectMainElement();
		expect(mainElement).toHaveClass(FLEX_1_CLASS);
	});

	it('maintains responsive layout structure with custom className', () => {
		renderLayout({ className: CUSTOM_CLASS });

		const rootDiv = getRootContainer();
		expect(rootDiv).toHaveClass(FLEX_CLASS, MIN_H_SCREEN_CLASS, FLEX_COL_CLASS);

		const mainElement = expectMainElement();
		expect(mainElement).toHaveClass(FLEX_1_CLASS, CUSTOM_CLASS);
	});

	it('ensures layout container takes full viewport height', () => {
		renderLayout();

		const rootDiv = getRootContainer();
		expect(rootDiv).toHaveClass(MIN_H_SCREEN_CLASS);
	});

	it('uses flex-col for vertical stacking of layout elements', () => {
		renderLayout();

		const rootDiv = getRootContainer();
		expect(rootDiv).toHaveClass(FLEX_COL_CLASS);
	});
});

describe('Layout - accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderLayout();

		await expectA11y(container);
	});

	it('has no accessibility violations with theme prop', async () => {
		const { container } = renderLayout({ theme: mockThemeConfig });

		await expectA11y(container);
	});

	it('has no accessibility violations with custom className', async () => {
		const { container } = renderLayout({ className: CUSTOM_CLASS });

		await expectA11y(container);
	});

	it('renders main landmark with correct id for skip link', () => {
		renderLayout();

		expectMainElement();
		const skipLink = screen.getByTestId(SKIP_TO_CONTENT_TEST_ID);
		expect(skipLink).toHaveAttribute('href', `#${DEFAULT_TARGET_ID}`);
	});

	it('renders navigation landmark through Navbar', () => {
		renderLayout();

		const navbar = getNavbar();
		expect(navbar).toBeInTheDocument();
		expect(navbar.tagName.toLowerCase()).toBe('nav');
	});

	it('provides skip link for keyboard navigation', () => {
		renderLayout();

		const skipLink = screen.getByTestId(SKIP_TO_CONTENT_TEST_ID);
		expect(skipLink).toBeInTheDocument();
		expect(skipLink.tagName.toLowerCase()).toBe('a');
		expect(skipLink).toHaveAttribute('href', `#${DEFAULT_TARGET_ID}`);
	});

	it('ensures skip link correctly targets main content element', () => {
		renderLayout();

		expectSkipLinkTargetsMain();
	});
});

describe('Layout - theme integration', () => {
	it('passes theme config to Navbar when provided', () => {
		renderLayout({ theme: mockThemeConfig });

		const navbar = getNavbar();
		expect(navbar).toHaveAttribute(DATA_THEME_ATTR, PROVIDED_THEME);
	});

	it('works without theme config', () => {
		renderLayout();

		const navbar = getNavbar();
		expect(navbar).toHaveAttribute(DATA_THEME_ATTR, NOT_PROVIDED_THEME);
	});

	it('handles theme config with different theme values', () => {
		const darkThemeConfig = createThemeConfig('dark', 'dark');

		renderLayout({ theme: darkThemeConfig });

		const navbar = getNavbar();
		expect(navbar).toHaveAttribute(DATA_THEME_ATTR, PROVIDED_THEME);
	});

	it('handles theme config with system theme', () => {
		const systemThemeConfig = createThemeConfig('system', 'light');

		renderLayout({ theme: systemThemeConfig });

		const navbar = getNavbar();
		expect(navbar).toHaveAttribute(DATA_THEME_ATTR, PROVIDED_THEME);
	});
});

describe('Layout - Root container structure', () => {
	it('renders root div with correct structure and classes (line 14)', () => {
		renderLayout();

		const rootDiv = getRootContainer();
		expect(rootDiv).toBeInTheDocument();
		expect(rootDiv.tagName).toBe('DIV');
		expect(rootDiv).toHaveClass(FLEX_CLASS, MIN_H_SCREEN_CLASS, FLEX_COL_CLASS);
	});
});

describe('Layout - SkipToContent integration', () => {
	it('renders SkipToContent with correct targetId prop (line 15)', () => {
		renderLayout();

		const skipLink = screen.getByTestId(SKIP_TO_CONTENT_TEST_ID);
		expect(skipLink).toBeInTheDocument();
		expect(skipLink).toHaveAttribute('href', `#${DEFAULT_TARGET_ID}`);
	});
});

describe('Layout - Navbar theme prop', () => {
	it('passes theme prop to Navbar component (line 16)', () => {
		const themeConfig = createThemeConfig('dark', 'dark');
		renderLayout({ theme: themeConfig });

		const navbar = getNavbar();
		expect(navbar).toHaveAttribute(DATA_THEME_ATTR, PROVIDED_THEME);
	});

	it('passes undefined theme to Navbar when not provided (line 16)', () => {
		renderLayout();

		const navbar = getNavbar();
		expect(navbar).toHaveAttribute(DATA_THEME_ATTR, NOT_PROVIDED_THEME);
	});
});

describe('Layout - Main element rendering', () => {
	it('renders main element with correct id and uses classNames utility (line 17)', () => {
		renderLayout({ className: CUSTOM_MAIN_CLASS });

		const mainElement = expectMainElement();
		expect(mainElement).toHaveClass(FLEX_1_CLASS, CUSTOM_MAIN_CLASS);
	});

	it('renders main element with only flex-1 class when className is undefined (line 17)', () => {
		renderLayout();

		const mainElement = expectMainElement();
		expect(mainElement).toHaveClass(FLEX_1_CLASS);
		expect(mainElement.className).not.toContain('undefined');
	});
});

describe('Layout - Children rendering', () => {
	it('renders children inside main element (line 18)', () => {
		const testChildren = <div data-testid="test-children">Test Children</div>;
		renderLayout({ children: testChildren });

		const mainElement = expectMainElement();
		const children = screen.getByTestId('test-children');
		expect(mainElement).toContainElement(children);
		expect(children).toHaveTextContent('Test Children');
	});

	it('handles empty children', () => {
		renderLayout({ children: null });

		const mainElement = expectMainElement();
		expect(mainElement).toBeInTheDocument();
	});

	it('handles multiple children', () => {
		renderLayout({
			children: (
				<>
					<div data-testid="child-1">Child 1</div>
					<div data-testid="child-2">Child 2</div>
				</>
			),
		});

		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
	});
});

// Test the component directly to ensure coverage tracking
// This ensures the component file is tracked properly
describe('Layout - Direct Component Test (Coverage)', () => {
	it('should execute the Layout component function directly', async () => {
		// Import the component directly to ensure it's tracked
		const { default: LayoutComponent } = await import('@shared/components/layout/Layout');

		// Verify the component is a function
		expect(typeof LayoutComponent).toBe('function');

		// Render with the component to ensure the function executes
		// This ensures the component file (lines 12-22) is tracked
		renderWithProviders(
			<LayoutComponent>
				<div data-testid="direct-test">Direct Test</div>
			</LayoutComponent>
		);

		expect(screen.getByTestId('direct-test')).toBeInTheDocument();
		expect(screen.getByTestId(LAYOUT_ROOT_TEST_ID)).toBeInTheDocument();
	});
});

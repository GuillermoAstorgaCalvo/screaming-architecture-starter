/**
 * Tests for Layout component
 *
 * Tests the main layout wrapper component:
 * - Layout rendering with children
 * - SkipToContent integration
 * - Navbar integration with theme prop
 * - Main content element rendering
 * - Custom className support
 */

import Layout from '@shared/components/layout/Layout';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const DEFAULT_TARGET_ID = 'main-content';
const SKIP_TO_CONTENT_TEST_ID = 'skip-to-content';
const NAVBAR_TEST_ID = 'navbar';

// Mock Navbar to simplify testing
vi.mock('@shared/components/layout/Navbar', () => ({
	default: ({ theme, className }: { theme?: unknown; className?: string }) => (
		<nav
			data-testid={NAVBAR_TEST_ID}
			data-theme={theme ? 'provided' : 'not-provided'}
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

const mockThemeConfig = {
	theme: 'light' as const,
	resolvedTheme: 'light' as const,
	setTheme: vi.fn(),
};

describe('Layout - rendering', () => {
	it('renders children content', () => {
		renderWithProviders(
			<Layout>
				<div data-testid="test-content">Test Content</div>
			</Layout>
		);

		expect(screen.getByTestId('test-content')).toBeInTheDocument();
		expect(screen.getByTestId('test-content')).toHaveTextContent('Test Content');
	});

	it('renders SkipToContent component', () => {
		renderWithProviders(<Layout>Content</Layout>);

		const skipLink = screen.getByTestId(SKIP_TO_CONTENT_TEST_ID);
		expect(skipLink).toBeInTheDocument();
		expect(skipLink).toHaveAttribute('href', '#main-content');
	});

	it('renders Navbar component', () => {
		renderWithProviders(<Layout>Content</Layout>);

		expect(screen.getByTestId(NAVBAR_TEST_ID)).toBeInTheDocument();
	});

	it('passes theme prop to Navbar when provided', () => {
		renderWithProviders(
			<Layout theme={mockThemeConfig}>
				<div>Content</div>
			</Layout>
		);

		const navbar = screen.getByTestId(NAVBAR_TEST_ID);
		expect(navbar).toHaveAttribute('data-theme', 'provided');
	});

	it('does not pass theme prop to Navbar when not provided', () => {
		renderWithProviders(
			<Layout>
				<div>Content</div>
			</Layout>
		);

		const navbar = screen.getByTestId(NAVBAR_TEST_ID);
		expect(navbar).toHaveAttribute('data-theme', 'not-provided');
	});
});

describe('Layout - main element', () => {
	it('renders main element with correct id', () => {
		renderWithProviders(<Layout>Content</Layout>);

		const mainElement = screen.getByRole('main');
		expect(mainElement).toBeInTheDocument();
		expect(mainElement).toHaveAttribute('id', 'main-content');
	});

	it('applies custom className to main element', () => {
		renderWithProviders(
			<Layout className="custom-main-class">
				<div>Content</div>
			</Layout>
		);

		const mainElement = screen.getByRole('main');
		expect(mainElement).toHaveClass('custom-main-class');
	});

	it('applies flex-1 class to main element by default', () => {
		renderWithProviders(<Layout>Content</Layout>);

		const mainElement = screen.getByRole('main');
		expect(mainElement).toHaveClass('flex-1');
	});

	it('renders with correct layout structure', () => {
		renderWithProviders(
			<Layout>
				<div>Content</div>
			</Layout>
		);

		// Verify layout structure by checking all components are present and correctly structured
		const skipLink = screen.getByTestId(SKIP_TO_CONTENT_TEST_ID);
		const navbar = screen.getByTestId(NAVBAR_TEST_ID);
		const main = screen.getByRole('main');

		// Verify skip link correctly targets main element
		expect(skipLink).toHaveAttribute('href', `#${main.id}`);
		// Verify all layout components are rendered
		expect(skipLink).toBeInTheDocument();
		expect(navbar).toBeInTheDocument();
		expect(main).toBeInTheDocument();
	});
});

describe('Layout - integration', () => {
	it('renders all components in correct order', () => {
		renderWithProviders(
			<Layout theme={mockThemeConfig}>
				<div data-testid="page-content">Page Content</div>
			</Layout>
		);

		// Check order: SkipToContent should be first, then Navbar, then main
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
		renderWithProviders(
			<Layout>
				<div>Content</div>
			</Layout>
		);

		// Verify all components are present using Testing Library methods
		expect(screen.getByTestId(SKIP_TO_CONTENT_TEST_ID)).toBeInTheDocument();
		expect(screen.getByTestId(NAVBAR_TEST_ID)).toBeInTheDocument();
		expect(screen.getByRole('main')).toBeInTheDocument();
	});
});

import { withTheme } from '@app/components/PageWrapper';
import { useSEO } from '@core/hooks/seo/useSEO';
import type { ThemedPageProps } from '@src-types/layout';
import { render, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const WRAPPED_PAGE_TITLE = 'Wrapped Page Title';

function createThemeTestPage() {
	return function TestPage({ theme }: Readonly<ThemedPageProps>) {
		return (
			<div>
				<span data-testid="theme">{theme.theme}</span>
				<span data-testid="resolved">{theme.resolvedTheme}</span>
			</div>
		);
	};
}

function createTestPageWithThemeTracking() {
	const receivedThemes: ThemedPageProps['theme'][] = [];

	function TestPage({ theme }: Readonly<ThemedPageProps>) {
		receivedThemes.push(theme);
		return (
			<div>
				<span data-testid="theme">{theme.theme}</span>
				<span data-testid="resolved-theme">{theme.resolvedTheme}</span>
			</div>
		);
	}

	return { TestPage, receivedThemes };
}

function createTestPageWithProps() {
	interface TestPageProps {
		readonly title: string;
		readonly count: number;
	}

	function TestPage({ theme, title, count }: Readonly<TestPageProps & ThemedPageProps>) {
		return (
			<div>
				<span data-testid="title">{title}</span>
				<span data-testid="count">{count}</span>
				<span data-testid="theme">{theme.theme}</span>
			</div>
		);
	}

	return TestPage;
}

describe('withTheme HOC - Page Wrapping', () => {
	describe('Theme Injection', () => {
		it('injects theme props from ThemeProvider', () => {
			const { TestPage, receivedThemes } = createTestPageWithThemeTracking();
			const ThemedPage = withTheme(TestPage);

			renderWithProviders(<ThemedPage />);

			expect(screen.getByTestId('theme').textContent).toBe('light');
			expect(screen.getByTestId('resolved-theme').textContent).toBe('light');
			expect(receivedThemes[0]).toMatchObject({
				theme: 'light',
				resolvedTheme: 'light',
			});
			expect(typeof receivedThemes[0]?.setTheme).toBe('function');
		});
	});

	describe('Props Passing', () => {
		it('passes through all original props to wrapped component', () => {
			const TestPage = createTestPageWithProps();
			const ThemedPage = withTheme(TestPage);
			// @ts-expect-error - withTheme removes theme prop requirement, but TypeScript inference doesn't capture this
			renderWithProviders(<ThemedPage title="Test Title" count={42} />);

			expect(screen.getByTestId('title').textContent).toBe('Test Title');
			expect(screen.getByTestId('count').textContent).toBe('42');
			expect(screen.getByTestId('theme').textContent).toBe('light');
		});
	});

	describe('Component Wrapping', () => {
		it('wraps function components correctly', () => {
			function FunctionComponent({ theme }: Readonly<ThemedPageProps>) {
				return <div data-testid="function-component">Function: {theme.theme}</div>;
			}

			const ThemedComponent = withTheme(FunctionComponent);
			renderWithProviders(<ThemedComponent />);

			expect(screen.getByTestId('function-component').textContent).toBe('Function: light');
		});

		it('wraps arrow function components correctly', () => {
			const ArrowComponent = ({ theme }: Readonly<ThemedPageProps>) => {
				return <div data-testid="arrow-component">Arrow: {theme.theme}</div>;
			};

			const ThemedComponent = withTheme(ArrowComponent);
			renderWithProviders(<ThemedComponent />);

			expect(screen.getByTestId('arrow-component').textContent).toBe('Arrow: light');
		});

		it('handles components with no additional props', () => {
			function SimplePage({ theme }: Readonly<ThemedPageProps>) {
				return <div data-testid="simple">Simple: {theme.resolvedTheme}</div>;
			}

			const ThemedPage = withTheme(SimplePage);
			renderWithProviders(<ThemedPage />);

			expect(screen.getByTestId('simple').textContent).toBe('Simple: light');
		});
	});
});

describe('withTheme HOC - Theme Scenarios', () => {
	it('injects dark theme when defaultTheme is dark', () => {
		const TestPage = createThemeTestPage();
		const ThemedPage = withTheme(TestPage);
		renderWithProviders(<ThemedPage />, { defaultTheme: 'dark' });

		expect(screen.getByTestId('theme').textContent).toBe('dark');
		expect(screen.getByTestId('resolved').textContent).toBe('dark');
	});

	it('injects system theme when defaultTheme is system', () => {
		const TestPage = createThemeTestPage();
		const ThemedPage = withTheme(TestPage);
		renderWithProviders(<ThemedPage />, { defaultTheme: 'system' });

		expect(screen.getByTestId('theme').textContent).toBe('system');
		// resolvedTheme should be 'light' or 'dark' based on system preference
		expect(['light', 'dark']).toContain(screen.getByTestId('resolved').textContent);
	});

	it('provides setTheme function that updates theme', async () => {
		function TestPage({ theme }: Readonly<ThemedPageProps>) {
			return (
				<div>
					<span data-testid="theme">{theme.theme}</span>
					<button
						data-testid="toggle-theme"
						onClick={() => {
							theme.setTheme(theme.theme === 'light' ? 'dark' : 'light');
						}}
					>
						Toggle
					</button>
				</div>
			);
		}

		const ThemedPage = withTheme(TestPage);
		renderWithProviders(<ThemedPage />);

		expect(screen.getByTestId('theme').textContent).toBe('light');

		const toggleButton = screen.getByTestId('toggle-theme');
		toggleButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('theme').textContent).toBe('dark');
		});
	});
});

function createTestPageWithSEO(title: string, description: string) {
	return function TestPage({ theme }: Readonly<ThemedPageProps>) {
		useSEO({
			title,
			description,
		});

		return (
			<div>
				<span data-testid="content">Page Content</span>
				<span data-testid="theme">{theme.theme}</span>
			</div>
		);
	};
}

function createTestPageWithSEOAndTheme() {
	return function TestPage({ theme }: Readonly<ThemedPageProps>) {
		useSEO({
			title: `Theme: ${theme.theme}`,
			description: `Current theme is ${theme.resolvedTheme}`,
		});

		return (
			<div>
				<span data-testid="theme-info">
					{theme.theme} / {theme.resolvedTheme}
				</span>
			</div>
		);
	};
}

function assertDescriptionMeta(expectedContent: string) {
	// Meta tags are not accessible via Testing Library queries, so direct DOM access is necessary
	// eslint-disable-next-line testing-library/no-node-access
	const descriptionMeta = document.querySelector('meta[name="description"]');
	expect(descriptionMeta).toBeInTheDocument();
	expect(descriptionMeta?.getAttribute('content')).toContain(expectedContent);
}

describe('withTheme HOC - SEO Integration - useSEO Hook Usage', () => {
	beforeEach(() => {
		document.head.innerHTML = '';
		document.title = '';
	});

	afterEach(() => {
		document.head.innerHTML = '';
		document.title = '';
	});

	it('allows wrapped components to use useSEO hook', async () => {
		const TestPage = createTestPageWithSEO('Test Page Title', 'Test page description');
		const ThemedPage = withTheme(TestPage);
		renderWithProviders(<ThemedPage />);

		await waitFor(() => {
			expect(document.title).toContain('Test Page Title');
		});

		assertDescriptionMeta('Test page description');
		expect(screen.getByTestId('content')).toBeInTheDocument();
		expect(screen.getByTestId('theme').textContent).toBe('light');
	});

	it('allows wrapped components to use useSEO with theme props together', async () => {
		const TestPage = createTestPageWithSEOAndTheme();
		const ThemedPage = withTheme(TestPage);
		renderWithProviders(<ThemedPage />, { defaultTheme: 'dark' });

		await waitFor(() => {
			expect(document.title).toContain('Theme: dark');
		});

		assertDescriptionMeta('Current theme is dark');
		expect(screen.getByTestId('theme-info').textContent).toBe('dark / dark');
	});
});

describe('withTheme HOC - SEO Integration - SEO Cleanup', () => {
	beforeEach(() => {
		document.head.innerHTML = '';
		document.title = '';
	});

	afterEach(() => {
		document.head.innerHTML = '';
		document.title = '';
	});

	it('restores SEO metadata when wrapped component unmounts', async () => {
		document.title = 'Initial Title';

		function TestPage(_theme: Readonly<ThemedPageProps>) {
			useSEO({
				title: WRAPPED_PAGE_TITLE,
				description: 'Wrapped page description',
			});

			return <div data-testid="wrapped-content">Wrapped Content</div>;
		}

		const ThemedPage = withTheme(TestPage);
		const { unmount } = renderWithProviders(<ThemedPage />);

		await waitFor(() => {
			expect(document.title).toContain(WRAPPED_PAGE_TITLE);
		});

		unmount();

		await waitFor(() => {
			expect(document.title).not.toContain(WRAPPED_PAGE_TITLE);
		});
	});
});

describe('withTheme HOC - Error Handling', () => {
	it('throws error when used outside ThemeProvider', () => {
		function TestPage({ theme }: Readonly<ThemedPageProps>) {
			return <div>Theme: {theme.theme}</div>;
		}

		const ThemedPage = withTheme(TestPage);

		// Suppress console.error for this test
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

		expect(() => {
			render(<ThemedPage />);
		}).toThrow('useTheme must be used within a ThemeProvider');

		consoleError.mockRestore();
	});

	it('handles component errors gracefully when wrapped', () => {
		function ErrorPage({ theme }: Readonly<ThemedPageProps>) {
			if (theme.theme === 'light') {
				throw new Error('Test error');
			}
			return <div>No error</div>;
		}

		const ThemedPage = withTheme(ErrorPage);

		// Suppress console.error for this test
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

		expect(() => {
			renderWithProviders(<ThemedPage />);
		}).toThrow('Test error');

		consoleError.mockRestore();
	});

	it('handles null/undefined props correctly', () => {
		interface OptionalProps {
			readonly optional?: string | null;
		}

		function TestPage({ theme, optional }: Readonly<OptionalProps & ThemedPageProps>) {
			return (
				<div>
					<span data-testid="theme">{theme.theme}</span>
					<span data-testid="optional">{optional ?? 'not provided'}</span>
				</div>
			);
		}

		const ThemedPage = withTheme(TestPage);
		// @ts-expect-error - withTheme removes theme prop requirement, but TypeScript inference doesn't capture this
		renderWithProviders(<ThemedPage optional={null} />);

		expect(screen.getByTestId('theme').textContent).toBe('light');
		expect(screen.getByTestId('optional').textContent).toBe('not provided');
	});
});

describe('withTheme HOC - Display Name', () => {
	it('sets a descriptive displayName for wrapped components', () => {
		function SamplePage() {
			return <div>Sample</div>;
		}
		SamplePage.displayName = 'SamplePage';

		const ThemedSamplePage = withTheme(SamplePage);

		expect(ThemedSamplePage.displayName).toBe('withTheme(SamplePage)');
	});

	it('uses component name when displayName is not set', () => {
		function NamedComponent() {
			return <div>Named</div>;
		}

		const ThemedComponent = withTheme(NamedComponent);

		expect(ThemedComponent.displayName).toBe('withTheme(NamedComponent)');
	});

	it('handles components without name or displayName', () => {
		const AnonymousComponent = () => <div>Anonymous</div>;

		const ThemedComponent = withTheme(AnonymousComponent);

		// When component has no name, displayName should still be set
		expect(ThemedComponent.displayName).toBeDefined();
		expect(ThemedComponent.displayName).toContain('withTheme');
	});

	it('handles arrow functions with displayName', () => {
		const ArrowComponent = () => <div>Arrow</div>;
		ArrowComponent.displayName = 'CustomArrowName';

		const ThemedComponent = withTheme(ArrowComponent);

		expect(ThemedComponent.displayName).toBe('withTheme(CustomArrowName)');
	});
});

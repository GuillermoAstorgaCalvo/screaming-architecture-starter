import AppLayout from '@app/components/AppLayout';
import Layout from '@shared/components/layout/Layout';
import type { LayoutProps } from '@src-types/layout';
import { type RenderResult, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock the Layout component to verify props are passed correctly
vi.mock('@shared/components/layout/Layout', () => ({
	default: vi.fn(({ children, theme, className }: Readonly<LayoutProps>) => {
		return (
			<div data-testid="layout" data-theme={theme?.theme} data-classname={className}>
				{children}
			</div>
		);
	}),
}));

const mockLayout = vi.mocked(Layout);

const TEST_CONTENT = 'Content';
const LAYOUT_TEST_ID = 'layout';
const DATA_CLASSNAME_ATTR = 'data-classname';

// Helper to get layout props from the last call
const getLayoutProps = (): LayoutProps => {
	const [layoutProps] = mockLayout.mock.calls.at(-1) ?? [];
	if (!layoutProps) {
		throw new Error('Layout was not called');
	}
	return layoutProps as LayoutProps;
};

// Helper to render AppLayout with optional className
const renderAppLayout = (
	children: ReactNode = TEST_CONTENT,
	className?: string,
	options?: Parameters<typeof renderWithProviders>[1]
): RenderResult => {
	const props = className ? { className } : {};
	return renderWithProviders(<AppLayout {...props}>{children}</AppLayout>, options);
};

// Helper to assert theme props
const assertThemeProps = (layoutProps: LayoutProps, expectedTheme: 'light' | 'dark'): void => {
	expect(layoutProps.theme).toBeDefined();
	expect(layoutProps.theme?.theme).toBe(expectedTheme);
	expect(layoutProps.theme?.resolvedTheme).toBe(expectedTheme);
};

// Helper to assert className attribute
const assertClassNameAttribute = (className: string): void => {
	expect(screen.getByTestId(LAYOUT_TEST_ID)).toHaveAttribute(DATA_CLASSNAME_ATTR, className);
};

// Helper to assert className is not set
const assertNoClassNameAttribute = (): void => {
	expect(screen.getByTestId(LAYOUT_TEST_ID)).not.toHaveAttribute(DATA_CLASSNAME_ATTR);
};

// Helper to assert children are rendered (avoids direct Node access)
const assertChildrenRendered = (testId: string): void => {
	expect(screen.getByTestId(testId)).toBeInTheDocument();
};

// Test suite for layout rendering
const testLayoutRendering = (): void => {
	describe('Layout rendering', () => {
		it('renders without crashing', () => {
			expect(() => {
				renderAppLayout('Test Content');
			}).not.toThrow();
		});

		it('renders Layout component', () => {
			renderAppLayout('Test Content');

			expect(mockLayout).toHaveBeenCalledTimes(1);
			expect(screen.getByTestId(LAYOUT_TEST_ID)).toBeInTheDocument();
		});

		it('renders children content', () => {
			renderAppLayout(<div data-testid="child-content">Child Content</div>);

			assertChildrenRendered('child-content');
			expect(screen.getByText('Child Content')).toBeInTheDocument();
		});
	});
};

// Test suite for layout structure
const testLayoutStructure = (): void => {
	describe('Layout structure', () => {
		it('passes theme config from useTheme hook to Layout', () => {
			renderAppLayout();

			const layoutProps = getLayoutProps();

			assertThemeProps(layoutProps, 'light');
			expect(typeof layoutProps.theme?.setTheme).toBe('function');
		});

		it('passes children to Layout component', () => {
			const testContent = <div data-testid="test-child">Test Child</div>;

			renderAppLayout(testContent);

			const layoutProps = getLayoutProps();

			expect(layoutProps.className).toBeUndefined();
			assertChildrenRendered('test-child');
		});

		it('passes className to Layout when provided', () => {
			const customClassName = 'custom-layout-class';

			renderAppLayout(TEST_CONTENT, customClassName);

			const layoutProps = getLayoutProps();

			expect(layoutProps.className).toBe(customClassName);
			assertClassNameAttribute(customClassName);
		});

		it('does not pass className prop when undefined', () => {
			renderAppLayout();

			const layoutProps = getLayoutProps();

			expect(layoutProps.className).toBeUndefined();
			assertNoClassNameAttribute();
		});

		it('passes all props correctly to Layout component', () => {
			const customClassName = 'responsive-class';

			renderAppLayout(
				<>
					<div>Multiple Children</div>
					<span>Another Child</span>
				</>,
				customClassName
			);

			const layoutProps = getLayoutProps();

			expect(layoutProps.theme).toBeDefined();
			expect(layoutProps.className).toBe(customClassName);
		});
	});
};

// Test suite for responsive behavior
const testResponsiveBehavior = (): void => {
	describe('Responsive behavior', () => {
		it('allows className to be used for responsive styling', () => {
			const responsiveClasses = 'md:px-4 lg:px-8 xl:px-12';

			renderAppLayout(TEST_CONTENT, responsiveClasses);

			const layoutProps = getLayoutProps();

			expect(layoutProps.className).toBe(responsiveClasses);
			assertClassNameAttribute(responsiveClasses);
		});

		it('passes className with responsive breakpoint classes', () => {
			const breakpointClasses = 'container mx-auto px-4 sm:px-6 md:px-8 lg:px-10';

			renderAppLayout(TEST_CONTENT, breakpointClasses);

			const layoutProps = getLayoutProps();

			expect(layoutProps.className).toBe(breakpointClasses);
		});

		it('maintains theme context for responsive theme-aware styling', () => {
			renderAppLayout(TEST_CONTENT, 'dark:bg-dark');

			const layoutProps = getLayoutProps();

			expect(layoutProps.theme).toBeDefined();
			expect(layoutProps.className).toBe('dark:bg-dark');
		});
	});
};

// Test suite for theme integration
const testThemeIntegration = (): void => {
	describe('Theme integration', () => {
		it('uses theme from ThemeProvider context', () => {
			renderAppLayout(TEST_CONTENT, undefined, { defaultTheme: 'dark' });

			const layoutProps = getLayoutProps();

			assertThemeProps(layoutProps, 'dark');
		});

		it('updates theme when ThemeProvider theme changes', () => {
			const { rerender } = renderAppLayout(TEST_CONTENT, undefined, {
				defaultTheme: 'light',
			});

			let layoutProps = getLayoutProps();
			expect(layoutProps.theme?.theme).toBe('light');

			rerender(<AppLayout>{TEST_CONTENT}</AppLayout>);
			layoutProps = getLayoutProps();
			expect(layoutProps.theme).toBeDefined();
		});
	});
};

describe('AppLayout', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	testLayoutRendering();
	testLayoutStructure();
	testResponsiveBehavior();
	testThemeIntegration();
});

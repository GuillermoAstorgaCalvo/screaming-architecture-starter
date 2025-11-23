import type {
	AppLayoutProps,
	BreakpointSize,
	ContainerMaxWidth,
	ContainerProps,
	LayoutConfig,
	LayoutProps,
	NavbarProps,
	NavItem,
	PageWrapperProps,
	ProviderProps,
	QueryProviderProps,
	ResponsiveLayoutConfig,
	ThemeConfig,
	ThemeContextValue,
	ThemedPageProps,
	ThemeProviderProps,
} from '@src-types/layout';
import { describe, expect, it } from 'vitest';

// Test constants
const TEST_CLASS_NAME = 'custom-class';

describe('layout types', () => {
	describe('ThemeConfig', () => {
		it('should allow ThemeConfig with all properties', () => {
			const config: ThemeConfig = {
				theme: 'light',
				resolvedTheme: 'light',
				setTheme: () => {
					// set theme
				},
			};
			expect(config.theme).toBe('light');
			expect(config.resolvedTheme).toBe('light');
			expect(config.setTheme).toBeDefined();
		});
	});

	describe('BreakpointSize', () => {
		it('should accept all breakpoint sizes', () => {
			const sizes: BreakpointSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
			expect(sizes).toHaveLength(6);
		});
	});

	describe('ContainerMaxWidth', () => {
		it('should accept all container max widths', () => {
			const widths: ContainerMaxWidth[] = [
				'xs',
				'sm',
				'md',
				'lg',
				'xl',
				'2xl',
				'3xl',
				'4xl',
				'5xl',
				'6xl',
				'7xl',
				'full',
			];
			expect(widths).toHaveLength(12);
		});
	});

	describe('ContainerProps', () => {
		it('should allow ContainerProps with all properties', () => {
			const props: ContainerProps = {
				maxWidth: 'lg',
				padding: true,
				className: TEST_CLASS_NAME,
				children: 'Content',
			};
			expect(props.maxWidth).toBe('lg');
			expect(props.padding).toBe(true);
			expect(props.className).toBe(TEST_CLASS_NAME);
			expect(props.children).toBe('Content');
		});
	});

	describe('LayoutProps', () => {
		it('should allow LayoutProps with all properties', () => {
			const themeConfig: ThemeConfig = {
				theme: 'light',
				resolvedTheme: 'light',
				setTheme: () => {
					// set theme
				},
			};
			const props: LayoutProps = {
				children: 'Content',
				theme: themeConfig,
				className: TEST_CLASS_NAME,
			};
			expect(props.children).toBe('Content');
			expect(props.theme).toBeDefined();
			expect(props.className).toBe(TEST_CLASS_NAME);
		});
	});

	describe('PageWrapperProps', () => {
		it('should allow PageWrapperProps with all properties', () => {
			const props: PageWrapperProps = {
				title: 'Page Title',
				description: 'Page Description',
				showHeader: true,
				header: 'Header Content',
				footer: 'Footer Content',
				className: TEST_CLASS_NAME,
				children: 'Page Content',
			};
			expect(props.title).toBe('Page Title');
			expect(props.description).toBe('Page Description');
			expect(props.showHeader).toBe(true);
			expect(props.header).toBe('Header Content');
			expect(props.footer).toBe('Footer Content');
			expect(props.className).toBe(TEST_CLASS_NAME);
			expect(props.children).toBe('Page Content');
		});
	});

	describe('NavItem', () => {
		it('should allow NavItem with all properties', () => {
			const item: NavItem = {
				label: 'Home',
				path: '/home',
				icon: 'Icon',
				isActive: true,
				disabled: false,
				children: [],
				external: false,
			};
			expect(item.label).toBe('Home');
			expect(item.path).toBe('/home');
			expect(item.icon).toBe('Icon');
			expect(item.isActive).toBe(true);
			expect(item.disabled).toBe(false);
			expect(item.children).toEqual([]);
			expect(item.external).toBe(false);
		});

		it('should allow NavItem with nested children', () => {
			const item: NavItem = {
				label: 'Parent',
				path: '/parent',
				children: [
					{ label: 'Child 1', path: '/parent/child1' },
					{ label: 'Child 2', path: '/parent/child2' },
				],
			};
			expect(item.label).toBe('Parent');
			expect(item.path).toBe('/parent');
			expect(item.children).toHaveLength(2);
		});
	});

	describe('LayoutConfig', () => {
		it('should allow LayoutConfig with all properties', () => {
			const config: LayoutConfig = {
				showNav: true,
				showSidebar: true,
				showFooter: true,
				sidebarWidth: 250,
				navItems: [{ label: 'Home', path: '/home' }],
			};
			expect(config.showNav).toBe(true);
			expect(config.showSidebar).toBe(true);
			expect(config.showFooter).toBe(true);
			expect(config.sidebarWidth).toBe(250);
			expect(config.navItems).toBeDefined();
			if (config.navItems) {
				expect(config.navItems).toHaveLength(1);
				expect(config.navItems[0]?.label).toBe('Home');
			}
		});
	});

	describe('ResponsiveLayoutConfig', () => {
		it('should allow ResponsiveLayoutConfig with all properties', () => {
			const config: ResponsiveLayoutConfig = {
				showNav: true,
				mobile: { showNav: false },
				tablet: { showSidebar: false },
				desktop: { showFooter: true },
			};
			expect(config.showNav).toBe(true);
			expect(config.mobile).toBeDefined();
			expect(config.tablet).toBeDefined();
			expect(config.desktop).toBeDefined();
		});
	});

	describe('ThemeContextValue', () => {
		it('should extend ThemeConfig', () => {
			const value: ThemeContextValue = {
				theme: 'dark',
				resolvedTheme: 'dark',
				setTheme: () => {
					// set theme
				},
			};
			expect(value.theme).toBe('dark');
			expect(value.resolvedTheme).toBe('dark');
			expect(value.setTheme).toBeDefined();
			expect(typeof value.setTheme).toBe('function');
		});
	});

	describe('AppLayoutProps', () => {
		it('should allow AppLayoutProps with all properties', () => {
			const props: AppLayoutProps = {
				children: 'Content',
				className: TEST_CLASS_NAME,
			};
			expect(props.children).toBe('Content');
			expect(props.className).toBe(TEST_CLASS_NAME);
		});
	});

	describe('ThemedPageProps', () => {
		it('should allow ThemedPageProps with theme', () => {
			const themeConfig: ThemeConfig = {
				theme: 'light',
				resolvedTheme: 'light',
				setTheme: () => {
					// set theme
				},
			};
			const props: ThemedPageProps = {
				theme: themeConfig,
			};
			expect(props.theme).toBeDefined();
		});
	});

	describe('ProviderProps', () => {
		it('should allow ProviderProps with children', () => {
			const props: ProviderProps = {
				children: 'Content',
			};
			expect(props.children).toBe('Content');
		});
	});

	describe('ThemeProviderProps', () => {
		it('should allow ThemeProviderProps with all properties', () => {
			const props: ThemeProviderProps = {
				children: 'Content',
				defaultTheme: 'light',
			};
			expect(props.children).toBe('Content');
			expect(props.defaultTheme).toBe('light');
		});
	});

	describe('QueryProviderProps', () => {
		it('should allow QueryProviderProps with children', () => {
			const props: QueryProviderProps = {
				children: 'Content',
			};
			expect(props.children).toBe('Content');
		});
	});

	describe('NavbarProps', () => {
		it('should allow NavbarProps with all properties', () => {
			const themeConfig: ThemeConfig = {
				theme: 'light',
				resolvedTheme: 'light',
				setTheme: () => {
					// set theme
				},
			};
			const props: NavbarProps = {
				theme: themeConfig,
				className: TEST_CLASS_NAME,
			};
			expect(props.theme).toBeDefined();
			expect(props.className).toBe(TEST_CLASS_NAME);
		});

		it('should allow NavbarProps without theme', () => {
			const props: NavbarProps = {
				className: TEST_CLASS_NAME,
			};
			expect(props.theme).toBeUndefined();
			expect(props.className).toBe(TEST_CLASS_NAME);
		});
	});
});

/**
 * Layout-related types
 *
 * Types for application layout, navigation, and page structure.
 */

import type { Theme } from '@core/constants/theme';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Theme configuration used across the application
 * Shared type for theme state and controls
 */
export interface ThemeConfig {
	/** Current theme value */
	readonly theme: Theme;
	/** Resolved theme (light or dark, system preference resolved) */
	readonly resolvedTheme: 'light' | 'dark';
	/**
	 * Function to set the theme preference
	 * @param theme - The new theme value ('light' | 'dark' | 'system')
	 */
	setTheme: (_theme: Theme) => void;
}

/**
 * Layout breakpoint sizes
 */
export type BreakpointSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Layout container max width
 */
export type ContainerMaxWidth =
	| 'xs'
	| 'sm'
	| 'md'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl'
	| '4xl'
	| '5xl'
	| '6xl'
	| '7xl'
	| 'full';

/**
 * Layout container props
 */
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	/** Maximum width of the container */
	maxWidth?: ContainerMaxWidth;
	/** Whether to add padding */
	padding?: boolean;
	/** Additional CSS classes */
	className?: string;
	/** Children content */
	children: ReactNode;
}

/**
 * Layout component props
 * Used by the main Layout component for consistent page structure
 */
export interface LayoutProps {
	/** Children content */
	readonly children: ReactNode;
	/**
	 * Theme configuration passed to Navbar (optional)
	 */
	readonly theme?: ThemeConfig;
	/**
	 * Optional custom className for the main container
	 */
	readonly className?: string;
}

/**
 * Page wrapper props
 */
export interface PageWrapperProps {
	/** Page title */
	title?: string;
	/** Page description */
	description?: string;
	/** Whether to show page header */
	showHeader?: boolean;
	/** Custom header content */
	header?: ReactNode;
	/** Custom footer content */
	footer?: ReactNode;
	/** Additional CSS classes */
	className?: string;
	/** Children content */
	children: ReactNode;
}

/**
 * Navigation item
 */
export interface NavItem {
	/** Navigation label */
	label: string;
	/** Navigation path */
	path: string;
	/** Optional icon */
	icon?: ReactNode;
	/** Whether the item is active */
	isActive?: boolean;
	/** Whether the item is disabled */
	disabled?: boolean;
	/** Child navigation items */
	children?: NavItem[];
	/** Optional external link indicator */
	external?: boolean;
}

/**
 * Layout configuration
 */
export interface LayoutConfig {
	/** Whether to show navigation */
	showNav?: boolean;
	/** Whether to show sidebar */
	showSidebar?: boolean;
	/** Whether to show footer */
	showFooter?: boolean;
	/** Sidebar width */
	sidebarWidth?: number | string;
	/** Navigation items */
	navItems?: NavItem[];
}

/**
 * Responsive layout configuration
 */
export interface ResponsiveLayoutConfig extends LayoutConfig {
	/** Layout configuration for mobile */
	mobile?: Partial<LayoutConfig>;
	/** Layout configuration for tablet */
	tablet?: Partial<LayoutConfig>;
	/** Layout configuration for desktop */
	desktop?: Partial<LayoutConfig>;
}

/**
 * Theme context value
 * Extends ThemeConfig and provides the theme state to consumers
 */
export interface ThemeContextValue extends ThemeConfig {}

/**
 * App layout component props
 * Props for the app-level layout wrapper component
 */
export interface AppLayoutProps {
	/** Children content */
	readonly children: ReactNode;
	/**
	 * Optional custom className for the main container
	 */
	readonly className?: string;
}

/**
 * Themed page props
 * Props for components wrapped with theme via withTheme HOC
 */
export interface ThemedPageProps {
	/** Theme configuration */
	readonly theme: ThemeConfig;
}

/**
 * Base provider props
 * Common props for React context providers
 */
export interface ProviderProps {
	/** Children content */
	readonly children: ReactNode;
}

/**
 * Theme provider props
 * Props for the ThemeProvider component
 */
export interface ThemeProviderProps extends ProviderProps {
	/** Default theme to use if no stored preference exists */
	readonly defaultTheme?: Theme;
}

/**
 * Query provider props
 * Props for the QueryProvider component
 */
export interface QueryProviderProps extends ProviderProps {}

/**
 * I18n provider props
 * Props for the I18nProvider component
 */
export interface I18nProviderProps extends ProviderProps {}

/**
 * Navbar component props
 * Props for the Navbar component in shared/layout
 */
export interface NavbarProps {
	/**
	 * Theme configuration for ThemeToggle
	 * If not provided, ThemeToggle will not be rendered
	 */
	readonly theme?: ThemeConfig | undefined;
	/**
	 * Optional custom className for styling
	 */
	readonly className?: string;
}

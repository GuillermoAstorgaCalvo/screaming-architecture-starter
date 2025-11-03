import { useTheme } from '@app/providers/useTheme';
import Layout from '@shared/components/layout/Layout';
import type { ReactNode } from 'react';

export interface AppLayoutProps {
	readonly children: ReactNode;
	/**
	 * Optional custom className for the main container
	 */
	readonly className?: string;
}

/**
 * AppLayout - App-level layout wrapper that integrates theme provider
 *
 * Connects shared Layout component with app-level theme context
 * This bridges the boundary: app-level providers → shared components
 */
export default function AppLayout({ children, className }: AppLayoutProps) {
	const { theme, resolvedTheme, setTheme } = useTheme();

	const themeConfig = {
		theme,
		resolvedTheme,
		setTheme,
	};

	const layoutProps: {
		theme: typeof themeConfig;
		className?: string;
		children: ReactNode;
	} = {
		theme: themeConfig,
		children,
	};

	if (className !== undefined) {
		layoutProps.className = className;
	}

	return <Layout {...layoutProps} />;
}

import { useTheme } from '@app/providers/useTheme';
import Layout from '@shared/components/layout/Layout';
import type { AppLayoutProps, ThemeConfig } from '@src-types/layout';

/**
 * AppLayout - App-level layout wrapper that integrates theme provider
 *
 * Connects shared Layout component with app-level theme context
 * This bridges the boundary: app-level providers → shared components
 */
export default function AppLayout({ children, className }: Readonly<AppLayoutProps>) {
	const themeConfig: ThemeConfig = useTheme();

	const layoutProps = {
		theme: themeConfig,
		children,
		...(className !== undefined && { className }),
	};

	return <Layout {...layoutProps} />;
}

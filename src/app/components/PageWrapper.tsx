import { useTheme } from '@app/providers/useTheme';
import type { ThemedPageProps } from '@src-types/layout';
import type { ComponentType } from 'react';

/**
 * HOC to inject theme as props into page components
 * This bridges the boundary: app-level theme context → domain pages via props
 */
export function withTheme<T extends Record<string, unknown>>(
	Component: ComponentType<T & ThemedPageProps>
): ComponentType<T> {
	function ThemedPage(props: Readonly<T>) {
		const theme = useTheme();

		const themeProps: ThemedPageProps['theme'] = {
			theme: theme.theme,
			resolvedTheme: theme.resolvedTheme,
			setTheme: theme.setTheme,
		};

		return <Component {...props} theme={themeProps} />;
	}

	// Set display name for better debugging in React DevTools
	const componentName = Component.displayName ?? Component.name;
	ThemedPage.displayName = `withTheme(${componentName})`;

	return ThemedPage;
}

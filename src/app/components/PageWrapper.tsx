import { useTheme } from '@app/providers/useTheme';
import type { Theme } from '@core/constants/theme';
import type { ComponentType } from 'react';

export interface PageWrapperProps {
	readonly theme: {
		readonly theme: Theme;
		readonly resolvedTheme: 'light' | 'dark';
		/**
		 * Function to set the theme preference
		 * @param theme - The new theme value ('light' | 'dark' | 'system')
		 */
		readonly setTheme: (_theme: Theme) => void;
	};
}

/**
 * HOC to inject theme as props into page components
 * This bridges the boundary: app-level theme context → domain pages via props
 */
export function withTheme<T extends Record<string, unknown>>(
	Component: ComponentType<T & PageWrapperProps>
): ComponentType<T> {
	return function ThemedPage(props: T) {
		const theme = useTheme();

		const themeProps: PageWrapperProps['theme'] = {
			theme: theme.theme,
			resolvedTheme: theme.resolvedTheme,
			setTheme: theme.setTheme,
		};

		return <Component {...props} theme={themeProps} />;
	};
}

import i18n from '@core/i18n/i18n';
import type { I18nProviderProps } from '@src-types/layout';
import { I18nextProvider } from 'react-i18next';

/**
 * I18n Provider
 * Provides i18next instance to the React component tree
 *
 * This provider should be added to the app composition in App.tsx
 * It wraps the application with i18next context for translations
 */
export function I18nProvider({ children }: Readonly<I18nProviderProps>) {
	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

I18nProvider.displayName = 'I18nProvider';

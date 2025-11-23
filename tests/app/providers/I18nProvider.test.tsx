import { I18nProvider } from '@app/providers/I18nProvider';
import i18n, { i18nInitPromise } from '@core/i18n/i18n';
import { clearResourceLoaders, registerResourceLoader } from '@core/i18n/resourceLoader/registry';
import type { ResourceLoader } from '@core/i18n/resourceLoader/types';
import { useTranslation } from '@core/i18n/useTranslation';
import { act, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const INITIALIZED_STATUS = 'initialized';
const READY_STATUS = 'ready';
const INIT_STATUS_TEST_ID = 'init-status';

function TranslationStatus({ children }: Readonly<{ children?: ReactNode }>) {
	const { t, i18n: i18nextInstance, ready } = useTranslation('common');

	return (
		<div>
			<span data-testid="init-status">
				{i18nextInstance.isInitialized ? 'initialized' : 'pending'}
			</span>
			<span data-testid="translation">{t('retry')}</span>
			<span data-testid="ready-flag">{ready ? 'ready' : 'loading'}</span>
			{children}
		</div>
	);
}

function LandingTranslationProbe() {
	const { t, ready } = useTranslation('landing');

	return (
		<div>
			<span data-testid="landing-ready">{ready ? 'ready' : 'loading'}</span>
			<span data-testid="landing-hero-subtitle">{t('hero.subtitle')}</span>
		</div>
	);
}

/**
 * Create a resource loader for the landing namespace with test translations
 */
function createLandingLoader(): ResourceLoader {
	return async (_namespace, language) => {
		const translations: Record<string, unknown> = {
			hero: {
				subtitle:
					language === 'es'
						? 'Tu aplicación está en ejecución. Todos los componentes UI principales y características se demuestran a continuación.'
						: 'Your app is running. All core UI components and features are demonstrated below.',
			},
		};
		return translations;
	};
}

/**
 * Setup i18n for tests
 */
async function setupI18n(): Promise<void> {
	await i18nInitPromise;
	await i18n.changeLanguage('en');
	registerResourceLoader('landing', createLandingLoader());
}

/**
 * Cleanup i18n after tests
 */
async function cleanupI18n(): Promise<void> {
	await i18n.changeLanguage('en');
	clearResourceLoaders();
}

describe('I18nProvider', () => {
	beforeEach(setupI18n);
	afterEach(cleanupI18n);

	it('provides initialized translations to descendants once i18n is ready', async () => {
		render(
			<I18nProvider>
				<TranslationStatus />
			</I18nProvider>
		);

		expect(await screen.findByTestId(INIT_STATUS_TEST_ID)).toHaveTextContent(INITIALIZED_STATUS);
		expect(screen.getByTestId('translation')).toHaveTextContent('Retry');
		expect(screen.getByTestId('ready-flag')).toHaveTextContent(READY_STATUS);
	});

	it('updates rendered translations when the active language changes', async () => {
		render(
			<I18nProvider>
				<TranslationStatus />
			</I18nProvider>
		);

		expect(await screen.findByTestId('translation')).toHaveTextContent('Retry');

		await act(async () => {
			await i18n.changeLanguage('es');
		});

		await waitFor(() => {
			expect(screen.getByTestId('translation')).toHaveTextContent('Reintentar');
		});

		await act(async () => {
			await i18n.changeLanguage('ar');
		});

		await waitFor(() => {
			expect(screen.getByTestId('translation')).toHaveTextContent('إعادة المحاولة');
		});
	});

	it('loads additional namespaces on demand so domain translations become available', async () => {
		render(
			<I18nProvider>
				<LandingTranslationProbe />
			</I18nProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('landing-hero-subtitle')).toHaveTextContent(
				'Your app is running. All core UI components and features are demonstrated below.'
			);
		});

		await act(async () => {
			await i18n.changeLanguage('es');
		});

		await waitFor(() => {
			expect(screen.getByTestId('landing-hero-subtitle')).toHaveTextContent(
				'Tu aplicación está en ejecución. Todos los componentes UI principales y características se demuestran a continuación.'
			);
		});
	});
});

describe('I18nProvider lifecycle', () => {
	it('maintains i18n instance on unmount and remount', async () => {
		const { unmount } = render(
			<I18nProvider>
				<TranslationStatus />
			</I18nProvider>
		);

		expect(await screen.findByTestId(INIT_STATUS_TEST_ID)).toHaveTextContent(INITIALIZED_STATUS);

		unmount();

		// Re-render should work correctly
		render(
			<I18nProvider>
				<TranslationStatus />
			</I18nProvider>
		);

		expect(await screen.findByTestId(INIT_STATUS_TEST_ID)).toHaveTextContent(INITIALIZED_STATUS);
	});
});

describe('I18nProvider composition', () => {
	it('works correctly when nested with other providers', async () => {
		const NestedWrapper = ({ children }: { children: ReactNode }) => (
			<I18nProvider>
				<div data-testid="nested">{children}</div>
			</I18nProvider>
		);

		render(
			<NestedWrapper>
				<TranslationStatus />
			</NestedWrapper>
		);

		expect(await screen.findByTestId(INIT_STATUS_TEST_ID)).toHaveTextContent(INITIALIZED_STATUS);
		expect(screen.getByTestId('nested')).toBeInTheDocument();
	});
});

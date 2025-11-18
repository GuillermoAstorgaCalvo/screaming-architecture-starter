import '@domains/landing/i18n';

import { I18nProvider } from '@app/providers/I18nProvider';
import i18n, { i18nInitPromise } from '@core/i18n/i18n';
import { useTranslation } from '@core/i18n/useTranslation';
import { act, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

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

describe('I18nProvider', () => {
	beforeEach(async () => {
		await i18nInitPromise;
		await i18n.changeLanguage('en');
	});

	afterEach(async () => {
		await i18n.changeLanguage('en');
	});

	it('provides initialized translations to descendants once i18n is ready', async () => {
		render(
			<I18nProvider>
				<TranslationStatus />
			</I18nProvider>
		);

		expect(await screen.findByTestId('init-status')).toHaveTextContent('initialized');
		expect(screen.getByTestId('translation')).toHaveTextContent('Retry');
		expect(screen.getByTestId('ready-flag')).toHaveTextContent('ready');
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

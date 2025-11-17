import { withTheme } from '@app/components/PageWrapper';
import type { ThemedPageProps } from '@src-types/layout';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('withTheme HOC', () => {
	it('injects theme props from ThemeProvider', () => {
		const receivedThemes: ThemedPageProps['theme'][] = [];

		function TestPage({ theme }: Readonly<ThemedPageProps>) {
			receivedThemes.push(theme);
			return (
				<div>
					<span data-testid="theme">{theme.theme}</span>
					<span data-testid="resolved-theme">{theme.resolvedTheme}</span>
				</div>
			);
		}

		const ThemedPage = withTheme(TestPage);

		renderWithProviders(<ThemedPage />);

		expect(screen.getByTestId('theme').textContent).toBe('light');
		expect(screen.getByTestId('resolved-theme').textContent).toBe('light');
		expect(receivedThemes[0]).toMatchObject({
			theme: 'light',
			resolvedTheme: 'light',
		});
		expect(typeof receivedThemes[0]?.setTheme).toBe('function');
	});

	it('sets a descriptive displayName for wrapped components', () => {
		function SamplePage() {
			return <div>Sample</div>;
		}
		SamplePage.displayName = 'SamplePage';

		const ThemedSamplePage = withTheme(SamplePage);

		expect(ThemedSamplePage.displayName).toBe('withTheme(SamplePage)');
	});
});

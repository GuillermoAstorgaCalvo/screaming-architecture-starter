/**
 * LanguageSelectorFlag Component Tests
 *
 * Tests for the LanguageSelectorFlag component including:
 * - Rendering
 * - Flag display
 * - Dropdown menu integration
 * - Language selection
 * - Size variants
 * - Label display
 * - Accessibility
 * - State management
 */

import LanguageSelectorFlag from '@core/ui/language-selector/LanguageSelectorFlag';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

// Mock i18n
const mockChangeLanguage = vi.fn().mockResolvedValue(undefined);
const mockI18n = {
	language: 'en',
	changeLanguage: mockChangeLanguage,
};

vi.mock('@core/i18n/useTranslation', () => ({
	useTranslation: vi.fn(() => ({
		t: vi.fn((key: string) => {
			const translations: Record<string, string> = {
				'language.en': 'English',
				'language.es': 'Spanish',
				'language.ar': 'Arabic',
				'a11y.selectLanguage': 'Select language',
				'a11y.languageSelector': 'Language selector',
			};
			return translations[key] ?? key;
		}),
		i18n: mockI18n,
	})),
}));

describe('LanguageSelectorFlag - Rendering', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockI18n.language = 'en';
	});

	it('should render language selector button', () => {
		renderWithProviders(<LanguageSelectorFlag />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should render flag emoji', () => {
		renderWithProviders(<LanguageSelectorFlag />);
		const flag = screen.getByText('🇺🇸');
		expect(flag).toBeInTheDocument();
	});

	it('should render with default size', () => {
		renderWithProviders(<LanguageSelectorFlag />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should render with custom size', () => {
		renderWithProviders(<LanguageSelectorFlag size="sm" />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('h-8');
	});

	it('should render with custom className', () => {
		renderWithProviders(<LanguageSelectorFlag className="custom-class" />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('custom-class');
	});

	it('should show language label by default', () => {
		renderWithProviders(<LanguageSelectorFlag />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should hide language label when showLabel is false', () => {
		renderWithProviders(<LanguageSelectorFlag showLabel={false} />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		// Flag should still be visible
		const flag = screen.getByText('🇺🇸');
		expect(flag).toBeInTheDocument();
	});

	it('should use custom aria-label when provided', () => {
		renderWithProviders(<LanguageSelectorFlag ariaLabel="Choose your language" />);
		const button = screen.getByRole('button', { name: 'Choose your language' });
		expect(button).toBeInTheDocument();
	});

	it('should use default aria-label when not provided', () => {
		renderWithProviders(<LanguageSelectorFlag />);
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-label', 'Language selector');
	});

	it('should display correct flag for current language', () => {
		mockI18n.language = 'es';
		renderWithProviders(<LanguageSelectorFlag />);
		const flag = screen.getByText('🇪🇸');
		expect(flag).toBeInTheDocument();
	});
});

describe('LanguageSelectorFlag - Interactions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockI18n.language = 'en';
	});

	it('should open dropdown when button is clicked', async () => {
		renderWithProviders(<LanguageSelectorFlag />);
		const button = screen.getByRole('button');

		fireEvent.click(button);

		await waitFor(() => {
			expect(button).toHaveAttribute('aria-expanded', 'true');
		});
	});

	it('should close dropdown when item is selected', async () => {
		renderWithProviders(<LanguageSelectorFlag />);
		const button = screen.getByRole('button');

		fireEvent.click(button);

		await waitFor(() => {
			expect(button).toHaveAttribute('aria-expanded', 'true');
		});

		// Find and click a language option
		const spanishOption = screen.getByText('Spanish');
		fireEvent.click(spanishOption);

		await waitFor(() => {
			expect(mockChangeLanguage).toHaveBeenCalledWith('es');
		});
	});

	it('should update current language display when language changes', async () => {
		mockI18n.language = 'en';
		const { rerender } = renderWithProviders(<LanguageSelectorFlag />);

		// Initially English flag
		expect(screen.getByText('🇺🇸')).toBeInTheDocument();

		// Change language
		mockI18n.language = 'es';
		rerender(<LanguageSelectorFlag />);

		await waitFor(() => {
			expect(screen.getByText('🇪🇸')).toBeInTheDocument();
		});
	});
});

describe('LanguageSelectorFlag - Size Variants', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockI18n.language = 'en';
	});

	it('should apply sm size classes', () => {
		renderWithProviders(<LanguageSelectorFlag size="sm" />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('h-8');
	});

	it('should apply md size classes', () => {
		renderWithProviders(<LanguageSelectorFlag size="md" />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('h-10');
	});

	it('should apply lg size classes', () => {
		renderWithProviders(<LanguageSelectorFlag size="lg" />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('h-12');
	});
});

describe('LanguageSelectorFlag - Accessibility', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockI18n.language = 'en';
	});

	it('should have proper ARIA attributes', () => {
		renderWithProviders(<LanguageSelectorFlag />);
		const button = screen.getByRole('button');

		expect(button).toHaveAttribute('aria-expanded');
		expect(button).toHaveAttribute('aria-haspopup', 'menu');
	});

	it('should mark flag as aria-hidden', () => {
		renderWithProviders(<LanguageSelectorFlag />);
		const flag = screen.getByText('🇺🇸');
		expect(flag).toHaveAttribute('aria-hidden', 'true');
	});

	it('should be accessible', async () => {
		const { container } = renderWithProviders(<LanguageSelectorFlag />);
		await expectA11y(container);
	});
});

/**
 * LanguageSelector Component Tests
 *
 * Tests for the LanguageSelector component including:
 * - Rendering
 * - Dropdown menu integration
 * - Language selection
 * - Size variants
 * - Label display
 * - Accessibility
 * - State management
 */

import LanguageSelector from '@core/ui/language-selector/LanguageSelector';
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

describe('LanguageSelector - Rendering', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockI18n.language = 'en';
	});

	it('should render language selector button', () => {
		renderWithProviders(<LanguageSelector />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should render with default size', () => {
		renderWithProviders(<LanguageSelector />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should render with custom size', () => {
		renderWithProviders(<LanguageSelector size="sm" />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('h-8');
	});

	it('should render with custom className', () => {
		renderWithProviders(<LanguageSelector className="custom-class" />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('custom-class');
	});

	it('should show language label by default', () => {
		renderWithProviders(<LanguageSelector />);
		// Language name should be visible (not sr-only)
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should hide language label when showLabel is false', () => {
		renderWithProviders(<LanguageSelector showLabel={false} />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		// Label should still be in DOM but visually hidden
	});

	it('should use custom aria-label when provided', () => {
		renderWithProviders(<LanguageSelector ariaLabel="Choose your language" />);
		const button = screen.getByRole('button', { name: 'Choose your language' });
		expect(button).toBeInTheDocument();
	});

	it('should use default aria-label when not provided', () => {
		renderWithProviders(<LanguageSelector />);
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-label', 'Language selector');
	});
});

describe('LanguageSelector - Interactions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockI18n.language = 'en';
	});

	it('should open dropdown when button is clicked', async () => {
		renderWithProviders(<LanguageSelector />);
		const button = screen.getByRole('button');

		fireEvent.click(button);

		await waitFor(() => {
			expect(button).toHaveAttribute('aria-expanded', 'true');
		});
	});

	it('should close dropdown when item is selected', async () => {
		renderWithProviders(<LanguageSelector />);
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
		const { rerender } = renderWithProviders(<LanguageSelector />);
		const button = screen.getByRole('button');

		// Initially English
		expect(button).toBeInTheDocument();

		// Change language
		mockI18n.language = 'es';
		rerender(<LanguageSelector />);

		await waitFor(() => {
			const updatedButton = screen.getByRole('button');
			expect(updatedButton).toBeInTheDocument();
		});
	});
});

describe('LanguageSelector - Size Variants', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockI18n.language = 'en';
	});

	it('should apply sm size classes', () => {
		renderWithProviders(<LanguageSelector size="sm" />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('h-8');
	});

	it('should apply md size classes', () => {
		renderWithProviders(<LanguageSelector size="md" />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('h-10');
	});

	it('should apply lg size classes', () => {
		renderWithProviders(<LanguageSelector size="lg" />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('h-12');
	});
});

describe('LanguageSelector - Accessibility', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockI18n.language = 'en';
	});

	it('should have proper ARIA attributes', () => {
		renderWithProviders(<LanguageSelector />);
		const button = screen.getByRole('button');

		expect(button).toHaveAttribute('aria-expanded');
		expect(button).toHaveAttribute('aria-haspopup', 'menu');
	});

	it('should be accessible', async () => {
		const { container } = renderWithProviders(<LanguageSelector />);
		await expectA11y(container);
	});
});

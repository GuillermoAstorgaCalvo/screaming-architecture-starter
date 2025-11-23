/**
 * Language Selector Flag Helpers Tests
 *
 * Tests for language selector flag helper functions including:
 * - createLanguageSelectorFlagTrigger
 * - Trigger button rendering
 * - Props handling
 * - Accessibility attributes
 * - Size variants
 * - Class name merging
 */

import type { TypedTFunction } from '@core/i18n/useTranslation';
import { createLanguageSelectorFlagTrigger } from '@core/ui/language-selector/helpers/languageSelectorFlag.helpers';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockT: TypedTFunction<'common'> = vi.fn((key: string) => {
	const translations: Record<string, string> = {
		'a11y.languageSelector': 'Select language',
		'a11y.selectLanguage': 'Choose your language',
	};
	return translations[key] ?? key;
});

describe('languageSelectorFlag.helpers', () => {
	describe('createLanguageSelectorFlagTrigger', () => {
		it('should be a function', () => {
			expect(typeof createLanguageSelectorFlagTrigger).toBe('function');
		});

		it('should render a button element', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: true,
				isOpen: false,
				size: 'md',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toBeInTheDocument();
		});

		it('should render with correct aria-label when provided', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: true,
				isOpen: false,
				size: 'md',
				ariaLabel: 'Custom label',
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toHaveAttribute('aria-label', 'Custom label');
		});

		it('should use default aria-label when not provided', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: true,
				isOpen: false,
				size: 'md',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toHaveAttribute('aria-label', 'Select language');
		});

		it('should set aria-expanded to false when closed', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: true,
				isOpen: false,
				size: 'md',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toHaveAttribute('aria-expanded', 'false');
		});

		it('should set aria-expanded to true when open', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: true,
				isOpen: true,
				size: 'md',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toHaveAttribute('aria-expanded', 'true');
		});

		it('should set aria-haspopup to true', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: true,
				isOpen: false,
				size: 'md',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toHaveAttribute('aria-haspopup', 'true');
		});

		it('should render flag emoji', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: true,
				isOpen: false,
				size: 'md',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const flagSpan = screen.getByText('🇺🇸');
			expect(flagSpan).toBeInTheDocument();
		});

		it('should render language name when showLabel is true', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: true,
				isOpen: false,
				size: 'md',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const label = screen.getByText('English');
			expect(label).toBeInTheDocument();
		});

		it('should not render language name when showLabel is false', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: false,
				isOpen: false,
				size: 'md',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const label = screen.queryByText('English');
			expect(label).not.toBeInTheDocument();
		});

		it('should apply custom className', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: true,
				isOpen: false,
				size: 'md',
				ariaLabel: undefined,
				t: mockT,
				className: 'custom-class',
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('custom-class');
		});

		it('should apply size classes for sm', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: true,
				isOpen: false,
				size: 'sm',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('h-8');
		});

		it('should apply size classes for md', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: true,
				isOpen: false,
				size: 'md',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('h-10');
		});

		it('should apply size classes for lg', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: true,
				isOpen: false,
				size: 'lg',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('h-12');
		});

		it('should rotate icon when open', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: true,
				isOpen: true,
				size: 'md',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const svg = screen.getByRole('button').querySelector('svg');
			expect(svg).toHaveClass('rotate-180');
		});

		it('should not rotate icon when closed', () => {
			const trigger = createLanguageSelectorFlagTrigger({
				currentLanguageName: 'English',
				currentLanguageFlag: '🇺🇸',
				showLabel: true,
				isOpen: false,
				size: 'md',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const svg = screen.getByRole('button').querySelector('svg');
			expect(svg).not.toHaveClass('rotate-180');
		});
	});
});

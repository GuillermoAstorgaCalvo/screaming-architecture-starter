/**
 * Language Selector Helpers Tests
 *
 * Tests for language selector helper functions including:
 * - createLanguageSelectorTrigger
 * - Trigger button rendering
 * - Props handling
 * - Accessibility attributes
 * - Size variants
 * - Class name merging
 */

import type { TypedTFunction } from '@core/i18n/useTranslation';
import { createLanguageSelectorTrigger } from '@core/ui/language-selector/helpers/languageSelector.helpers';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockT: TypedTFunction<'common'> = vi.fn((key: string) => {
	const translations: Record<string, string> = {
		'a11y.languageSelector': 'Select language',
		'a11y.selectLanguage': 'Choose your language',
	};
	return translations[key] ?? key;
});

describe('languageSelector.helpers', () => {
	describe('createLanguageSelectorTrigger', () => {
		it('should be a function', () => {
			expect(typeof createLanguageSelectorTrigger).toBe('function');
		});

		it('should render a button element', () => {
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
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
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
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
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
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
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
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
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
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
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
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

		it('should render language name when showLabel is true', () => {
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
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
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
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
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
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
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
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
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
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
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
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
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
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
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
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

		it('should set aria-hidden on label span based on showLabel', () => {
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
				showLabel: true,
				isOpen: false,
				size: 'md',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			const labelSpan = screen.getByText('English');
			expect(labelSpan).toHaveAttribute('aria-hidden', 'false');
		});

		it('should set aria-hidden to true when showLabel is false', () => {
			const trigger = createLanguageSelectorTrigger({
				currentLanguageName: 'English',
				showLabel: false,
				isOpen: false,
				size: 'md',
				ariaLabel: undefined,
				t: mockT,
				className: undefined,
			});

			render(trigger);
			// When showLabel is false, the span should have aria-hidden="true"
			// but the text content is empty, so we check the structure
			const button = screen.getByRole('button');
			const span = button.querySelector('span');
			expect(span).toHaveAttribute('aria-hidden', 'true');
		});
	});
});

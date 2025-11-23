/**
 * Affix Component Tests - Accessibility
 *
 * Tests for the Affix component covering:
 * - Accessibility violations
 * - Semantic structure
 * - Interactive elements
 */

import Affix from '@core/ui/affix/Affix';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BANNER_ROLE, CONTENT_TEXT, HEADER_LABEL, setupScrollMocks } from './Affix.test.helpers';

beforeEach(() => {
	setupScrollMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Affix - accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<Affix>
				<div>{CONTENT_TEXT}</div>
			</Affix>
		);
		await expectA11y(container);
	});
});

describe('Affix - accessibility - semantic structure', () => {
	it('maintains semantic structure', () => {
		renderWithProviders(
			<Affix>
				<nav>{CONTENT_TEXT}</nav>
			</Affix>
		);

		expect(screen.getByRole('navigation')).toBeInTheDocument();
	});

	it('preserves ARIA attributes on children', () => {
		renderWithProviders(
			<Affix>
				<header aria-label={HEADER_LABEL}>{CONTENT_TEXT}</header>
			</Affix>
		);

		const header = screen.getByRole(BANNER_ROLE);
		expect(header).toHaveAttribute('aria-label', HEADER_LABEL);
	});
});

describe('Affix - accessibility - interactive elements', () => {
	it('preserves children accessibility attributes', () => {
		renderWithProviders(
			<Affix>
				<button aria-label="Test button">{CONTENT_TEXT}</button>
			</Affix>
		);

		const button = screen.getByRole('button', { name: 'Test button' });
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute('aria-label', 'Test button');
	});

	it('does not interfere with focus management', () => {
		renderWithProviders(
			<Affix>
				<button>{CONTENT_TEXT}</button>
			</Affix>
		);

		const button = screen.getByRole('button');
		button.focus();
		expect(button).toHaveFocus();
	});

	it('works with interactive children', () => {
		renderWithProviders(
			<Affix>
				<div>
					<button>Button 1</button>
					<button>Button 2</button>
				</div>
			</Affix>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(2);
		expect(buttons[0]).toBeInTheDocument();
		expect(buttons[1]).toBeInTheDocument();
	});
});

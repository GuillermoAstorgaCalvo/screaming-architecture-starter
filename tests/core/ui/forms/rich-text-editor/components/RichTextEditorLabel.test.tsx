/**
 * RichTextEditorLabel Component Tests
 *
 * Tests for the RichTextEditorLabel component including:
 * - Rendering
 * - Label text display
 * - Required indicator
 * - HTML attributes
 * - Accessibility
 */

import { RichTextEditorLabel } from '@core/ui/forms/rich-text-editor/components/RichTextEditorLabel';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const LABEL_TEXT = 'Content';
const EDITOR_ID = 'editor-1';

describe('RichTextEditorLabel - Rendering', () => {
	it('renders label element', () => {
		renderWithProviders(
			<RichTextEditorLabel id={EDITOR_ID} label={LABEL_TEXT} required={undefined} />
		);

		const label = screen.getByText(LABEL_TEXT);
		expect(label).toBeInTheDocument();
		expect(label.tagName).toBe('LABEL');
	});

	it('displays label text', () => {
		renderWithProviders(
			<RichTextEditorLabel id={EDITOR_ID} label={LABEL_TEXT} required={undefined} />
		);

		expect(screen.getByText(LABEL_TEXT)).toBeInTheDocument();
	});

	it('applies htmlFor attribute with id', () => {
		renderWithProviders(
			<RichTextEditorLabel id={EDITOR_ID} label={LABEL_TEXT} required={undefined} />
		);

		const label = screen.getByText(LABEL_TEXT);
		expect(label).toHaveAttribute('for', EDITOR_ID);
	});
});

describe('RichTextEditorLabel - Required Indicator', () => {
	it('displays required asterisk when required is true', () => {
		renderWithProviders(<RichTextEditorLabel id={EDITOR_ID} label={LABEL_TEXT} required={true} />);

		const asterisk = screen.getByText('*');
		expect(asterisk).toBeInTheDocument();
		expect(asterisk).toHaveClass('text-destructive');
	});

	it('does not display required asterisk when required is false', () => {
		renderWithProviders(<RichTextEditorLabel id={EDITOR_ID} label={LABEL_TEXT} required={false} />);

		const asterisk = screen.queryByText('*');
		expect(asterisk).not.toBeInTheDocument();
	});

	it('does not display required asterisk when required is undefined', () => {
		renderWithProviders(
			<RichTextEditorLabel id={EDITOR_ID} label={LABEL_TEXT} required={undefined} />
		);

		const asterisk = screen.queryByText('*');
		expect(asterisk).not.toBeInTheDocument();
	});
});

describe('RichTextEditorLabel - Styling', () => {
	it('applies base classes', () => {
		renderWithProviders(
			<RichTextEditorLabel id={EDITOR_ID} label={LABEL_TEXT} required={undefined} />
		);

		const label = screen.getByText(LABEL_TEXT);
		expect(label).toHaveClass('mb-1');
		expect(label).toHaveClass('block');
		expect(label).toHaveClass('text-sm');
		expect(label).toHaveClass('font-medium');
	});

	it('applies destructive color to required asterisk', () => {
		renderWithProviders(<RichTextEditorLabel id={EDITOR_ID} label={LABEL_TEXT} required={true} />);

		const asterisk = screen.getByText('*');
		expect(asterisk).toHaveClass('text-destructive');
		expect(asterisk).toHaveClass('ml-1');
	});
});

describe('RichTextEditorLabel - Accessibility', () => {
	it('has proper label association with editor', () => {
		renderWithProviders(
			<RichTextEditorLabel id={EDITOR_ID} label={LABEL_TEXT} required={undefined} />
		);

		const label = screen.getByText(LABEL_TEXT);
		expect(label).toHaveAttribute('for', EDITOR_ID);
	});

	it('maintains label association when required', () => {
		renderWithProviders(<RichTextEditorLabel id={EDITOR_ID} label={LABEL_TEXT} required={true} />);

		const label = screen.getByText(LABEL_TEXT);
		expect(label).toHaveAttribute('for', EDITOR_ID);
	});
});

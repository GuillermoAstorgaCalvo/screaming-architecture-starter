/**
 * Fieldset Component Tests
 *
 * Tests for the Fieldset component including:
 * - Rendering
 * - Legend display
 * - Disabled state
 * - Size variants
 * - Accessibility
 * - Children rendering
 */

import Fieldset from '@core/ui/forms/fieldset/Fieldset';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const LEGEND_TEXT = 'Personal Information';
const CHILD_TEXT = 'Field content';

describe('Fieldset - Rendering', () => {
	it('renders fieldset element', () => {
		renderWithProviders(
			<Fieldset>
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		const fieldset = screen.getByRole('group');
		expect(fieldset).toBeInTheDocument();
		expect(fieldset.tagName).toBe('FIELDSET');
	});

	it('renders children', () => {
		renderWithProviders(
			<Fieldset>
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		expect(screen.getByText(CHILD_TEXT)).toBeInTheDocument();
	});

	it('renders with legend', () => {
		renderWithProviders(
			<Fieldset legend={LEGEND_TEXT}>
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		expect(screen.getByText(LEGEND_TEXT)).toBeInTheDocument();
		const legend = screen.getByText(LEGEND_TEXT);
		expect(legend.tagName).toBe('LEGEND');
	});

	it('does not render legend when not provided', () => {
		renderWithProviders(
			<Fieldset>
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		const fieldset = screen.getByRole('group');
		const legend = fieldset.querySelector('legend');
		expect(legend).not.toBeInTheDocument();
	});

	it('renders with custom className', () => {
		const customClass = 'custom-fieldset';
		renderWithProviders(
			<Fieldset className={customClass}>
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		const fieldset = screen.getByRole('group');
		expect(fieldset).toHaveClass(customClass);
	});
});

describe('Fieldset - Disabled State', () => {
	it('renders disabled fieldset', () => {
		renderWithProviders(
			<Fieldset disabled>
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		const fieldset = screen.getByRole('group');
		expect(fieldset).toBeDisabled();
	});

	it('renders enabled fieldset by default', () => {
		renderWithProviders(
			<Fieldset>
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		const fieldset = screen.getByRole('group');
		expect(fieldset).not.toBeDisabled();
	});

	it('applies disabled styling when disabled', () => {
		renderWithProviders(
			<Fieldset disabled>
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		const fieldset = screen.getByRole('group');
		expect(fieldset).toHaveAttribute('disabled');
	});
});

describe('Fieldset - Size Variants', () => {
	it('renders with sm size', () => {
		renderWithProviders(
			<Fieldset legend={LEGEND_TEXT} size="sm">
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		expect(screen.getByText(LEGEND_TEXT)).toBeInTheDocument();
	});

	it('renders with md size (default)', () => {
		renderWithProviders(
			<Fieldset legend={LEGEND_TEXT} size="md">
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		expect(screen.getByText(LEGEND_TEXT)).toBeInTheDocument();
	});

	it('renders with lg size', () => {
		renderWithProviders(
			<Fieldset legend={LEGEND_TEXT} size="lg">
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		expect(screen.getByText(LEGEND_TEXT)).toBeInTheDocument();
	});

	it('applies size classes to legend', () => {
		const { rerender } = renderWithProviders(
			<Fieldset legend={LEGEND_TEXT} size="sm">
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		let legend = screen.getByText(LEGEND_TEXT);
		expect(legend).toHaveClass('text-xs');

		rerender(
			<Fieldset legend={LEGEND_TEXT} size="md">
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		legend = screen.getByText(LEGEND_TEXT);
		expect(legend).toHaveClass('text-sm');

		rerender(
			<Fieldset legend={LEGEND_TEXT} size="lg">
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		legend = screen.getByText(LEGEND_TEXT);
		expect(legend).toHaveClass('text-base');
	});
});

describe('Fieldset - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<Fieldset legend={LEGEND_TEXT}>
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		await expectA11y(container);
	});

	it('uses semantic fieldset element', () => {
		renderWithProviders(
			<Fieldset legend={LEGEND_TEXT}>
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		const fieldset = screen.getByRole('group');
		expect(fieldset.tagName).toBe('FIELDSET');
	});

	it('associates legend with fieldset', () => {
		renderWithProviders(
			<Fieldset legend={LEGEND_TEXT}>
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		const fieldset = screen.getByRole('group');
		const legend = screen.getByText(LEGEND_TEXT);
		expect(fieldset).toContainElement(legend);
		expect(legend.tagName).toBe('LEGEND');
	});

	it('maintains accessibility when disabled', () => {
		renderWithProviders(
			<Fieldset legend={LEGEND_TEXT} disabled>
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		const fieldset = screen.getByRole('group');
		expect(fieldset).toBeDisabled();
		const legend = screen.getByText(LEGEND_TEXT);
		expect(legend).toBeInTheDocument();
	});
});

describe('Fieldset - Props Forwarding', () => {
	it('forwards additional props to fieldset element', () => {
		renderWithProviders(
			<Fieldset data-testid="custom-fieldset" aria-label="Custom fieldset">
				<div>{CHILD_TEXT}</div>
			</Fieldset>
		);
		const fieldset = screen.getByTestId('custom-fieldset');
		expect(fieldset).toBeInTheDocument();
		expect(fieldset).toHaveAttribute('aria-label', 'Custom fieldset');
	});
});

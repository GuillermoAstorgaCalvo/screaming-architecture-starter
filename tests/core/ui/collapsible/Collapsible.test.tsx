/**
 * Collapsible Component Tests
 *
 * Tests for the Collapsible component covering:
 * - Functionality: rendering, controlled/uncontrolled modes, default state
 * - Interactions: expand/collapse, keyboard navigation
 * - Accessibility: ARIA attributes, keyboard support, screen reader compatibility
 */

import Collapsible from '@core/ui/collapsible/Collapsible';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const HEADER_TEXT = 'Click to expand';
const CONTENT_TEXT = 'Hidden content';
const ARIA_EXPANDED = 'aria-expanded';
const ARIA_CONTROLS = 'aria-controls';
const ARIA_HIDDEN = 'aria-hidden';
const ARIA_LABELLEDBY = 'aria-labelledby';

// Helper to find content section by header relationship (avoids querySelector)
const getContentByHeader = (header: HTMLElement): HTMLElement | null => {
	const contentId = header.getAttribute(ARIA_CONTROLS);
	if (!contentId) return null;
	// Find content by role and aria-labelledby relationship
	const regions = screen.getAllByRole('region', { hidden: true });
	return regions.find(region => region.getAttribute(ARIA_LABELLEDBY) === header.id) ?? null;
};

describe('Collapsible - functionality - rendering', () => {
	it('renders header and content', () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		expect(screen.getByText(HEADER_TEXT)).toBeInTheDocument();
		expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument();
	});

	it('renders collapsed by default', () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		expect(header).toHaveAttribute(ARIA_EXPANDED, 'false');
	});

	it('renders expanded when defaultExpanded is true', () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT} defaultExpanded={true}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		expect(header).toHaveAttribute(ARIA_EXPANDED, 'true');
		expect(screen.getByText(CONTENT_TEXT)).toBeVisible();
	});
});

describe('Collapsible - functionality - state management - controlled mode', () => {
	it('supports controlled mode with expanded prop', () => {
		const { rerender } = renderWithProviders(
			<Collapsible header={HEADER_TEXT} expanded={false}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		expect(header).toHaveAttribute(ARIA_EXPANDED, 'false');

		rerender(
			<Collapsible header={HEADER_TEXT} expanded={true}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		expect(header).toHaveAttribute(ARIA_EXPANDED, 'true');
	});

	it('calls onExpandedChange in controlled mode', async () => {
		const onExpandedChange = vi.fn();

		renderWithProviders(
			<Collapsible header={HEADER_TEXT} expanded={false} onExpandedChange={onExpandedChange}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		fireEvent.click(header);

		expect(onExpandedChange).toHaveBeenCalledWith(true);
	});
});

describe('Collapsible - functionality - state management - uncontrolled mode', () => {
	it('supports uncontrolled mode', async () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		expect(header).toHaveAttribute(ARIA_EXPANDED, 'false');

		fireEvent.click(header);

		await waitFor(() => {
			expect(header).toHaveAttribute(ARIA_EXPANDED, 'true');
		});
	});

	it('calls onExpandedChange in uncontrolled mode', async () => {
		const onExpandedChange = vi.fn();

		renderWithProviders(
			<Collapsible header={HEADER_TEXT} onExpandedChange={onExpandedChange}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		fireEvent.click(header);

		expect(onExpandedChange).toHaveBeenCalledWith(true);
	});
});

describe('Collapsible - functionality - state management - disabled state', () => {
	it('handles disabled state', () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT} disabled={true}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		expect(header).toBeDisabled();
		expect(header).toHaveAttribute('aria-disabled', 'true');
	});
});

describe('Collapsible - functionality - customization', () => {
	it('applies custom className', () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT} className="custom-collapsible" data-testid="collapsible">
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const collapsible = screen.getByTestId('collapsible');
		expect(collapsible).toHaveClass('custom-collapsible');
	});

	it('applies custom headerClassName', () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT} headerClassName="custom-header">
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		expect(header).toHaveClass('custom-header');
	});

	it('applies custom contentClassName', () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT} contentClassName="custom-content">
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		const contentSection = getContentByHeader(header);
		expect(contentSection).toHaveClass('custom-content');
	});
});

describe('Collapsible - functionality - ReactNode rendering', () => {
	it('renders header as ReactNode', () => {
		const headerNode = <span data-testid="custom-header">Custom Header</span>;

		renderWithProviders(
			<Collapsible header={headerNode}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		expect(screen.getByTestId('custom-header')).toBeInTheDocument();
	});

	it('renders children as ReactNode', () => {
		const contentNode = (
			<div>
				<p>Paragraph 1</p>
				<p>Paragraph 2</p>
			</div>
		);

		renderWithProviders(<Collapsible header={HEADER_TEXT}>{contentNode}</Collapsible>);

		expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
		expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
	});
});

describe('Collapsible - interactions - mouse', () => {
	it('expands on header click', async () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		expect(header).toHaveAttribute(ARIA_EXPANDED, 'false');

		fireEvent.click(header);

		await waitFor(() => {
			expect(header).toHaveAttribute(ARIA_EXPANDED, 'true');
		});
	});

	it('collapses expanded item on click', async () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT} defaultExpanded={true}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		expect(header).toHaveAttribute(ARIA_EXPANDED, 'true');

		fireEvent.click(header);

		await waitFor(() => {
			expect(header).toHaveAttribute(ARIA_EXPANDED, 'false');
		});
	});

	it('does not toggle when disabled', async () => {
		const onExpandedChange = vi.fn();

		renderWithProviders(
			<Collapsible header={HEADER_TEXT} disabled={true} onExpandedChange={onExpandedChange}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		fireEvent.click(header);

		expect(onExpandedChange).not.toHaveBeenCalled();
		expect(header).toHaveAttribute(ARIA_EXPANDED, 'false');
	});
});

describe('Collapsible - interactions - keyboard', () => {
	it('handles keyboard Enter key', async () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		header.focus();
		fireEvent.keyDown(header, { key: 'Enter', code: 'Enter' });

		await waitFor(() => {
			expect(header).toHaveAttribute(ARIA_EXPANDED, 'true');
		});
	});

	it('handles keyboard Space key', async () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		header.focus();
		fireEvent.keyDown(header, { key: ' ', code: 'Space' });

		await waitFor(() => {
			expect(header).toHaveAttribute(ARIA_EXPANDED, 'true');
		});
	});

	it('does not toggle on keyboard when disabled', async () => {
		const onExpandedChange = vi.fn();

		renderWithProviders(
			<Collapsible header={HEADER_TEXT} disabled={true} onExpandedChange={onExpandedChange}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		header.focus();
		fireEvent.keyDown(header, { key: 'Enter', code: 'Enter' });

		expect(onExpandedChange).not.toHaveBeenCalled();
		expect(header).toHaveAttribute(ARIA_EXPANDED, 'false');
	});
});

describe('Collapsible - accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<Collapsible header={HEADER_TEXT}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);
		await expectA11y(container);
	});
});

describe('Collapsible - accessibility - ARIA header attributes', () => {
	it('has correct ARIA attributes on header', () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		expect(header).toHaveAttribute(ARIA_EXPANDED);
		expect(header).toHaveAttribute(ARIA_CONTROLS);
		expect(header).toHaveAttribute('id');
	});

	it('updates aria-expanded when toggled', async () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		expect(header).toHaveAttribute(ARIA_EXPANDED, 'false');

		fireEvent.click(header);

		await waitFor(() => {
			expect(header).toHaveAttribute(ARIA_EXPANDED, 'true');
		});
	});
});

describe('Collapsible - accessibility - ARIA content attributes', () => {
	it('has correct ARIA attributes on content', () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		const headerId = header.id;
		const contentId = header.getAttribute(ARIA_CONTROLS);

		expect(contentId).toBeTruthy();

		const content = getContentByHeader(header);
		expect(content).toBeInTheDocument();
		expect(content).toHaveAttribute(ARIA_LABELLEDBY, headerId);
		expect(content).toHaveAttribute(ARIA_HIDDEN);
	});

	it('updates aria-hidden on content when toggled', async () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		const content = getContentByHeader(header);

		expect(content).toBeInTheDocument();
		expect(content).toHaveAttribute(ARIA_HIDDEN, 'true');

		fireEvent.click(header);

		await waitFor(() => {
			expect(content).toHaveAttribute(ARIA_HIDDEN, 'false');
		});
	});

	it('maintains proper header-content relationship', () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		const headerId = header.id;
		const contentId = header.getAttribute(ARIA_CONTROLS);

		expect(contentId).toBeTruthy();

		const content = getContentByHeader(header);
		expect(content).toBeInTheDocument();
		expect(content).toHaveAttribute(ARIA_LABELLEDBY, headerId);
		expect(header).toHaveAttribute(ARIA_CONTROLS, contentId);
	});
});

describe('Collapsible - accessibility - behavior', () => {
	it('handles disabled state correctly for accessibility', () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT} disabled={true}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		expect(header).toBeDisabled();
		expect(header).toHaveAttribute('aria-disabled', 'true');
	});
});

describe('Collapsible - accessibility - semantic structure', () => {
	it('uses semantic section element for content', () => {
		renderWithProviders(
			<Collapsible header={HEADER_TEXT}>
				<div>{CONTENT_TEXT}</div>
			</Collapsible>
		);

		const header = screen.getByRole('button', { name: HEADER_TEXT });
		const content = getContentByHeader(header);

		expect(content).toBeInTheDocument();
		expect(content?.tagName).toBe('SECTION');
	});
});

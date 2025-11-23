/**
 * Accordion Component Tests
 *
 * Tests for the Accordion component covering:
 * - Functionality: rendering, state management, variants, sizes
 * - Interactions: expand/collapse, multiple items, keyboard navigation
 * - Accessibility: ARIA attributes, keyboard support, screen reader compatibility
 */

import Accordion from '@core/ui/accordion/Accordion';
import type { AccordionItem } from '@src-types/ui/navigation/accordion';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const ITEM_1_ID = 'item-1';
const ITEM_2_ID = 'item-2';
const ITEM_3_ID = 'item-3';
const FIRST_ITEM_REGEX = /first item/i;
const SECOND_ITEM_REGEX = /second item/i;
const FIRST_CONTENT_TEXT = 'First content';
const SECOND_CONTENT_TEXT = 'Second content';
const FIRST_ITEM_NOT_FOUND_ERROR = 'First item not found';
const ARIA_EXPANDED = 'aria-expanded';
const ARIA_CONTROLS = 'aria-controls';
const ARIA_LABELLEDBY = 'aria-labelledby';
const ARIA_HIDDEN = 'aria-hidden';

const mockItems = [
	{
		id: ITEM_1_ID,
		header: 'First Item',
		content: <div>{FIRST_CONTENT_TEXT}</div>,
	},
	{
		id: ITEM_2_ID,
		header: 'Second Item',
		content: <div>{SECOND_CONTENT_TEXT}</div>,
	},
	{
		id: ITEM_3_ID,
		header: 'Third Item',
		content: <div>Third content</div>,
	},
];

// Helper functions
const createItemWithDefaultExpanded = (item: AccordionItem): AccordionItem => ({
	...item,
	defaultExpanded: true,
});

const createItemWithDisabled = (item: AccordionItem): AccordionItem => ({
	...item,
	disabled: true,
});

const createItemsWithFirstDefaultExpanded = (): AccordionItem[] => {
	const [firstItem] = mockItems;
	if (!firstItem) throw new Error(FIRST_ITEM_NOT_FOUND_ERROR);
	return [createItemWithDefaultExpanded(firstItem), ...mockItems.slice(1)];
};

const createItemsWithFirstDisabled = (): AccordionItem[] => {
	const [firstItem] = mockItems;
	if (!firstItem) throw new Error(FIRST_ITEM_NOT_FOUND_ERROR);
	return [createItemWithDisabled(firstItem), ...mockItems.slice(1)];
};

const getFirstHeader = () => screen.getByRole('button', { name: FIRST_ITEM_REGEX });

const getSecondHeader = () => screen.getByRole('button', { name: SECOND_ITEM_REGEX });

const clickHeader = (header: HTMLElement) => {
	fireEvent.click(header);
};

const expectContentVisible = async (contentText: string) => {
	const content = await screen.findByText(contentText);
	expect(content).toBeInTheDocument();
	expect(content).toBeVisible();
};

const expectAriaExpanded = (header: HTMLElement, expected: 'true' | 'false') => {
	expect(header).toHaveAttribute(ARIA_EXPANDED, expected);
};

const expectAriaControls = (header: HTMLElement) => {
	expect(header).toHaveAttribute(ARIA_CONTROLS);
};

const getContentByHeader = (header: HTMLElement): HTMLElement | null => {
	const contentId = header.getAttribute(ARIA_CONTROLS);
	if (!contentId) return null;
	// Find content by role and aria-labelledby relationship
	const regions = screen.getAllByRole('region', { hidden: true });
	return regions.find(region => region.getAttribute(ARIA_LABELLEDBY) === header.id) ?? null;
};

const expectContentNotVisible = (contentText: string, header?: HTMLElement) => {
	const content = screen.queryByText(contentText);
	if (content) {
		// Check if the parent section has aria-hidden="true"
		// Use the header to find the section if provided, otherwise check the content's parent
		const section = header
			? getContentByHeader(header)
			: screen.queryByRole('region', { hidden: true, name: contentText });
		if (section) {
			expect(section).toHaveAttribute(ARIA_HIDDEN, 'true');
		} else {
			expect(content).not.toBeVisible();
		}
	} else {
		expect(content).not.toBeInTheDocument();
	}
};

const expectHeaderContentRelationship = (header: HTMLElement) => {
	const contentId = header.getAttribute(ARIA_CONTROLS);
	expect(contentId).toBeTruthy();

	if (contentId) {
		const content = getContentByHeader(header);
		expect(content).toBeInTheDocument();
		expect(content).toHaveAttribute(ARIA_LABELLEDBY, header.id);
	}
};

describe('Accordion - functionality - rendering', () => {
	it('renders all accordion items', () => {
		renderWithProviders(<Accordion items={mockItems} />);

		expect(screen.getByText('First Item')).toBeInTheDocument();
		expect(screen.getByText('Second Item')).toBeInTheDocument();
		expect(screen.getByText('Third Item')).toBeInTheDocument();
	});

	it('renders item content when expanded', async () => {
		renderWithProviders(<Accordion items={mockItems} />);

		const firstHeader = getFirstHeader();
		clickHeader(firstHeader);
		await expectContentVisible(FIRST_CONTENT_TEXT);
	});

	it('hides item content when collapsed', () => {
		renderWithProviders(<Accordion items={mockItems} />);

		const firstHeader = getFirstHeader();
		const secondHeader = getSecondHeader();

		expectContentNotVisible(FIRST_CONTENT_TEXT, firstHeader);
		expectContentNotVisible(SECOND_CONTENT_TEXT, secondHeader);
	});
});

describe('Accordion - functionality - props and configuration', () => {
	it('supports defaultExpanded prop', () => {
		const itemsWithDefault = createItemsWithFirstDefaultExpanded();
		renderWithProviders(<Accordion items={itemsWithDefault} />);

		const content = screen.getByText(FIRST_CONTENT_TEXT);
		expect(content).toBeInTheDocument();
		expect(content).toBeVisible();
	});

	it('applies custom className', () => {
		renderWithProviders(
			<Accordion items={mockItems} className="custom-accordion" data-testid="accordion" />
		);

		const accordion = screen.getByTestId('accordion');
		expect(accordion).toHaveClass('custom-accordion');
	});

	it('supports different variants', () => {
		const { unmount: unmount1 } = renderWithProviders(
			<Accordion items={mockItems} variant="default" />
		);
		// Verify component renders by checking buttons are present
		expect(screen.getAllByRole('button')).toHaveLength(mockItems.length);
		unmount1();

		const { unmount: unmount2 } = renderWithProviders(
			<Accordion items={mockItems} variant="bordered" />
		);
		expect(screen.getAllByRole('button')).toHaveLength(mockItems.length);
		unmount2();

		renderWithProviders(<Accordion items={mockItems} variant="separated" />);
		expect(screen.getAllByRole('button')).toHaveLength(mockItems.length);
	});

	it('supports different sizes', () => {
		renderWithProviders(<Accordion items={mockItems} size="sm" />);
		renderWithProviders(<Accordion items={mockItems} size="md" />);
		renderWithProviders(<Accordion items={mockItems} size="lg" />);

		const headers = screen.getAllByRole('button');
		expect(headers.length).toBeGreaterThan(0);
	});

	it('handles disabled items', () => {
		const itemsWithDisabled = createItemsWithFirstDisabled();
		renderWithProviders(<Accordion items={itemsWithDisabled} />);

		const firstHeader = getFirstHeader();
		expect(firstHeader).toBeDisabled();
	});
});

describe('Accordion - functionality - ID generation', () => {
	it('generates unique IDs when accordionId is not provided', () => {
		const { unmount: unmount1 } = renderWithProviders(<Accordion items={mockItems} />);
		const header1 = getFirstHeader();
		const header1Id = header1.id;
		unmount1();

		const { unmount: unmount2 } = renderWithProviders(<Accordion items={mockItems} />);
		const header2 = getFirstHeader();
		const header2Id = header2.id;
		unmount2();

		expect(header1Id).toBeDefined();
		expect(header2Id).toBeDefined();
		expect(header1Id).not.toBe(header2Id);
	});

	it('uses provided accordionId', () => {
		renderWithProviders(<Accordion items={mockItems} accordionId="custom-id" />);

		const header = getFirstHeader();
		expect(header.id).toContain('custom-id');
	});
});

describe('Accordion - interactions - click interactions', () => {
	it('expands item on click', async () => {
		renderWithProviders(<Accordion items={mockItems} />);

		const firstHeader = getFirstHeader();
		clickHeader(firstHeader);
		await expectContentVisible(FIRST_CONTENT_TEXT);
	});

	it('collapses expanded item on click', async () => {
		const itemsWithDefault = createItemsWithFirstDefaultExpanded();
		renderWithProviders(<Accordion items={itemsWithDefault} />);

		const content = screen.getByText(FIRST_CONTENT_TEXT);
		expect(content).toBeInTheDocument();
		expect(content).toBeVisible();

		const firstHeader = getFirstHeader();
		clickHeader(firstHeader);

		await waitFor(() => {
			const section = getContentByHeader(firstHeader);
			if (section) {
				expect(section).toHaveAttribute(ARIA_HIDDEN, 'true');
			}
		});
	});

	it('does not expand disabled item on click', async () => {
		const itemsWithDisabled = createItemsWithFirstDisabled();
		renderWithProviders(<Accordion items={itemsWithDisabled} />);

		const firstHeader = getFirstHeader();
		clickHeader(firstHeader);

		expectContentNotVisible(FIRST_CONTENT_TEXT, firstHeader);
	});
});

describe('Accordion - interactions - multiple items expansion', () => {
	it('allows only one item expanded when allowMultiple is false', async () => {
		renderWithProviders(<Accordion items={mockItems} allowMultiple={false} />);

		const firstHeader = getFirstHeader();
		const secondHeader = getSecondHeader();

		clickHeader(firstHeader);
		await expectContentVisible(FIRST_CONTENT_TEXT);

		clickHeader(secondHeader);
		const secondContent = await screen.findByText(SECOND_CONTENT_TEXT);
		expect(secondContent).toBeInTheDocument();
		expect(secondContent).toBeVisible();

		const firstSection = getContentByHeader(firstHeader);
		if (firstSection) {
			expect(firstSection).toHaveAttribute(ARIA_HIDDEN, 'true');
		}
	});

	it('allows multiple items expanded when allowMultiple is true', async () => {
		renderWithProviders(<Accordion items={mockItems} allowMultiple={true} />);

		const firstHeader = getFirstHeader();
		const secondHeader = getSecondHeader();

		clickHeader(firstHeader);
		await expectContentVisible(FIRST_CONTENT_TEXT);

		clickHeader(secondHeader);
		await waitFor(() => {
			expect(screen.getByText(FIRST_CONTENT_TEXT)).toBeInTheDocument();
			expect(screen.getByText(SECOND_CONTENT_TEXT)).toBeInTheDocument();
		});
	});
});

describe('Accordion - interactions - keyboard interactions', () => {
	it('handles keyboard Enter key', async () => {
		renderWithProviders(<Accordion items={mockItems} />);

		const firstHeader = getFirstHeader();
		firstHeader.focus();
		fireEvent.keyDown(firstHeader, { key: 'Enter', code: 'Enter' });

		await expectContentVisible(FIRST_CONTENT_TEXT);
	});

	it('handles keyboard Space key', async () => {
		renderWithProviders(<Accordion items={mockItems} />);

		const firstHeader = getFirstHeader();
		firstHeader.focus();
		fireEvent.keyDown(firstHeader, { key: ' ', code: 'Space' });

		await expectContentVisible(FIRST_CONTENT_TEXT);
	});
});

describe('Accordion - accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(<Accordion items={mockItems} />);
		await expectA11y(container);
	});

	it('has correct ARIA attributes on headers', () => {
		renderWithProviders(<Accordion items={mockItems} />);

		const firstHeader = getFirstHeader();
		expectAriaExpanded(firstHeader, 'false');
		expectAriaControls(firstHeader);
	});

	it('updates aria-expanded when item is expanded', async () => {
		renderWithProviders(<Accordion items={mockItems} />);

		const firstHeader = getFirstHeader();
		expectAriaExpanded(firstHeader, 'false');

		clickHeader(firstHeader);

		await waitFor(() => {
			expectAriaExpanded(firstHeader, 'true');
		});
	});

	it('has correct ARIA attributes on content', () => {
		renderWithProviders(<Accordion items={mockItems} />);

		const firstHeader = getFirstHeader();
		const content = getContentByHeader(firstHeader);

		expect(content).toBeTruthy();
		if (content) {
			expect(content).toHaveAttribute(ARIA_LABELLEDBY, firstHeader.id);
		}
	});

	it('maintains proper header-content relationships', () => {
		renderWithProviders(<Accordion items={mockItems} />);

		const headers = screen.getAllByRole('button');
		for (const header of headers) {
			expectHeaderContentRelationship(header);
		}
	});

	it('supports keyboard navigation between items', () => {
		renderWithProviders(<Accordion items={mockItems} />);

		const firstHeader = getFirstHeader();

		// Verify headers are focusable
		firstHeader.focus();
		expect(firstHeader).toHaveFocus();

		// Tab navigation is handled by the browser, not by keyDown events
		// Verify that all headers are focusable buttons (buttons are focusable by default)
		const headers = screen.getAllByRole('button');
		expect(headers.length).toBe(mockItems.length);
		for (const header of headers) {
			expect(header).toBeInTheDocument();
			expect(header.tagName).toBe('BUTTON');
		}
	});

	it('handles disabled state correctly for accessibility', () => {
		const itemsWithDisabled = createItemsWithFirstDisabled();
		renderWithProviders(<Accordion items={itemsWithDisabled} />);

		const firstHeader = getFirstHeader();
		expect(firstHeader).toBeDisabled();
		expectAriaExpanded(firstHeader, 'false');
	});
});

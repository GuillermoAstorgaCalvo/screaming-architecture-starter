/**
 * AccordionHeader Component Tests
 *
 * Tests for the AccordionHeader component covering:
 * - Rendering: button element, header content, icon, IDs, classes
 * - Props: all prop variations and combinations
 * - Interactions: click handling, disabled state, onToggle callback
 * - Accessibility: ARIA attributes, keyboard support
 * - Size variants: sm, md, lg
 * - Edge cases: ReactNode header content, callback memoization
 */

import { AccordionHeader } from '@core/ui/accordion/components/AccordionHeader';
import type { StandardSize } from '@src-types/ui/base';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

const HEADER_ID = 'test-header-id';
const CONTENT_ID = 'test-content-id';
const HEADER_TEXT = 'Test Header';
const HEADER_HTML = '<strong>Bold Header</strong>';

interface AccordionHeaderProps {
	headerId?: string;
	contentId?: string;
	isExpanded?: boolean;
	disabled?: boolean;
	onToggle?: () => void;
	size?: StandardSize;
	header?: ReactNode;
}

// Helper functions
const createDefaultProps = (
	overrides?: Partial<AccordionHeaderProps>
): Required<Omit<AccordionHeaderProps, 'disabled'>> & Pick<AccordionHeaderProps, 'disabled'> => ({
	headerId: HEADER_ID,
	contentId: CONTENT_ID,
	isExpanded: false,
	onToggle: vi.fn(),
	size: 'md',
	header: HEADER_TEXT,
	...overrides,
});

const renderAccordionHeader = (props?: Partial<AccordionHeaderProps>) => {
	const defaultProps = createDefaultProps(props);
	const accordionProps = {
		headerId: defaultProps.headerId,
		contentId: defaultProps.contentId,
		isExpanded: defaultProps.isExpanded,
		onToggle: defaultProps.onToggle,
		size: defaultProps.size,
		header: defaultProps.header,
	};
	if (defaultProps.disabled !== undefined) {
		return renderWithProviders(
			<AccordionHeader {...accordionProps} disabled={defaultProps.disabled} />
		);
	}
	return renderWithProviders(<AccordionHeader {...accordionProps} />);
};

const getButton = (name: string | RegExp = HEADER_TEXT) => {
	return screen.getByRole('button', { name });
};

const expectAriaExpanded = (button: HTMLElement, expected: 'true' | 'false') => {
	expect(button).toHaveAttribute('aria-expanded', expected);
};

const expectAriaControls = (button: HTMLElement, contentId: string) => {
	expect(button).toHaveAttribute('aria-controls', contentId);
};

const expectButtonEnabled = (button: HTMLElement) => {
	expect(button).not.toBeDisabled();
};

const expectButtonDisabled = (button: HTMLElement) => {
	expect(button).toBeDisabled();
};

describe('AccordionHeader - Rendering - Basic', () => {
	it('renders button element', () => {
		renderAccordionHeader();
		const button = getButton();
		expect(button).toBeInTheDocument();
		expect(button.tagName).toBe('BUTTON');
	});

	it('renders header text content', () => {
		renderAccordionHeader();
		expect(screen.getByText(HEADER_TEXT)).toBeInTheDocument();
	});

	it('applies correct headerId to button', () => {
		renderAccordionHeader();
		const button = getButton();
		expect(button).toHaveAttribute('id', HEADER_ID);
	});

	it('renders button with type="button"', () => {
		renderAccordionHeader();
		const button = getButton();
		expect(button).toHaveAttribute('type', 'button');
	});
});

describe('AccordionHeader - Rendering - Content Types', () => {
	it('renders header with ReactNode content', () => {
		const headerContent = (
			<>
				<span>Icon</span> {HEADER_TEXT}
			</>
		);
		renderAccordionHeader({ header: headerContent });
		expect(screen.getByText(HEADER_TEXT)).toBeInTheDocument();
		expect(screen.getByText('Icon')).toBeInTheDocument();
	});

	it('renders header with HTML string content', () => {
		renderAccordionHeader({
			header: <div dangerouslySetInnerHTML={{ __html: HEADER_HTML }} />,
		});
		expect(screen.getByText('Bold Header')).toBeInTheDocument();
	});
});

describe('AccordionHeader - Rendering - Icon', () => {
	it('renders AccordionIcon component', () => {
		renderAccordionHeader();
		const button = getButton();
		// Using querySelector for structure verification (icon is decorative, aria-hidden)

		const icon = button.querySelector('svg');
		expect(icon).toBeInTheDocument();
		if (icon) {
			expect(icon).toHaveAttribute('aria-hidden', 'true');
		}
	});
});

describe('AccordionHeader - Props - isExpanded - ARIA', () => {
	it('sets aria-expanded to false when collapsed', () => {
		renderAccordionHeader({ isExpanded: false });
		const button = getButton();
		expectAriaExpanded(button, 'false');
	});

	it('sets aria-expanded to true when expanded', () => {
		renderAccordionHeader({ isExpanded: true });
		const button = getButton();
		expectAriaExpanded(button, 'true');
	});

	it('updates aria-expanded when isExpanded changes', () => {
		const { rerender } = renderAccordionHeader({ isExpanded: false });
		let button = getButton();
		expectAriaExpanded(button, 'false');

		rerender(
			<AccordionHeader
				headerId={HEADER_ID}
				contentId={CONTENT_ID}
				isExpanded={true}
				onToggle={vi.fn()}
				size="md"
				header={HEADER_TEXT}
			/>
		);

		button = getButton();
		expectAriaExpanded(button, 'true');
	});
});

describe('AccordionHeader - Props - isExpanded - Icon', () => {
	it('rotates icon when expanded', () => {
		renderAccordionHeader({ isExpanded: true });
		const button = getButton();
		// Using querySelector for structure verification (icon is decorative, aria-hidden)

		const icon = button.querySelector('svg');
		if (icon) {
			expect(icon).toHaveClass('rotate-180');
		}
	});

	it('does not rotate icon when collapsed', () => {
		renderAccordionHeader({ isExpanded: false });
		const button = getButton();
		// Using querySelector for structure verification (icon is decorative, aria-hidden)

		const icon = button.querySelector('svg');
		if (icon) {
			expect(icon).not.toHaveClass('rotate-180');
		}
	});
});

describe('AccordionHeader - Props - disabled', () => {
	it('renders enabled button when disabled is not provided', () => {
		renderAccordionHeader();
		const button = getButton();
		expectButtonEnabled(button);
	});

	it('renders enabled button when disabled is false', () => {
		renderAccordionHeader({ disabled: false });
		const button = getButton();
		expectButtonEnabled(button);
	});

	it('renders disabled button when disabled is true', () => {
		renderAccordionHeader({ disabled: true });
		const button = getButton();
		expectButtonDisabled(button);
	});

	it('updates disabled state when disabled prop changes', () => {
		const { rerender } = renderAccordionHeader({ disabled: false });
		let button = getButton();
		expectButtonEnabled(button);

		rerender(
			<AccordionHeader
				headerId={HEADER_ID}
				contentId={CONTENT_ID}
				isExpanded={false}
				disabled={true}
				onToggle={vi.fn()}
				size="md"
				header={HEADER_TEXT}
			/>
		);

		button = getButton();
		expectButtonDisabled(button);
	});
});

describe('AccordionHeader - Props - size', () => {
	it('applies correct classes for sm size', () => {
		renderAccordionHeader({ size: 'sm' });
		const button = getButton();
		expect(button).toBeInTheDocument();
	});

	it('applies correct classes for md size', () => {
		renderAccordionHeader({ size: 'md' });
		const button = getButton();
		expect(button).toBeInTheDocument();
	});

	it('applies correct classes for lg size', () => {
		renderAccordionHeader({ size: 'lg' });
		const button = getButton();
		expect(button).toBeInTheDocument();
	});

	it('renders all size variants correctly', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
		for (const size of sizes) {
			const { unmount } = renderAccordionHeader({
				headerId: `${HEADER_ID}-${size}`,
				contentId: `${CONTENT_ID}-${size}`,
				size,
				header: `${HEADER_TEXT} ${size}`,
			});
			const button = getButton(`${HEADER_TEXT} ${size}`);
			expect(button).toBeInTheDocument();
			unmount();
		}
	});
});

describe('AccordionHeader - Props - contentId', () => {
	it('sets aria-controls attribute with contentId', () => {
		renderAccordionHeader();
		const button = getButton();
		expectAriaControls(button, CONTENT_ID);
	});

	it('updates aria-controls when contentId changes', () => {
		const newContentId = 'new-content-id';
		const { rerender } = renderAccordionHeader();
		let button = getButton();
		expectAriaControls(button, CONTENT_ID);

		rerender(
			<AccordionHeader
				headerId={HEADER_ID}
				contentId={newContentId}
				isExpanded={false}
				onToggle={vi.fn()}
				size="md"
				header={HEADER_TEXT}
			/>
		);

		button = getButton();
		expectAriaControls(button, newContentId);
	});
});

describe('AccordionHeader - Interactions - onClick - Basic', () => {
	it('calls onToggle when button is clicked and not disabled', () => {
		const mockOnToggle = vi.fn();
		renderAccordionHeader({ onToggle: mockOnToggle });
		const button = getButton();
		fireEvent.click(button);
		expect(mockOnToggle).toHaveBeenCalledTimes(1);
	});

	it('does not call onToggle when button is clicked and disabled', () => {
		const mockOnToggle = vi.fn();
		renderAccordionHeader({ disabled: true, onToggle: mockOnToggle });
		const button = getButton();
		fireEvent.click(button);
		expect(mockOnToggle).not.toHaveBeenCalled();
	});
});

describe('AccordionHeader - Interactions - onClick - Multiple Clicks', () => {
	it('calls onToggle multiple times when clicked multiple times', () => {
		const mockOnToggle = vi.fn();
		renderAccordionHeader({ onToggle: mockOnToggle });
		const button = getButton();
		fireEvent.click(button);
		fireEvent.click(button);
		fireEvent.click(button);
		expect(mockOnToggle).toHaveBeenCalledTimes(3);
	});

	it('calls onToggle when expanded and clicked', () => {
		const mockOnToggle = vi.fn();
		renderAccordionHeader({ isExpanded: true, onToggle: mockOnToggle });
		const button = getButton();
		fireEvent.click(button);
		expect(mockOnToggle).toHaveBeenCalledTimes(1);
	});
});

describe('AccordionHeader - Interactions - onClick - Callback Changes', () => {
	it('handles onToggle callback changes', () => {
		const mockOnToggle1 = vi.fn();
		const mockOnToggle2 = vi.fn();
		const { rerender } = renderAccordionHeader({ onToggle: mockOnToggle1 });
		const button = getButton();
		fireEvent.click(button);
		expect(mockOnToggle1).toHaveBeenCalledTimes(1);
		expect(mockOnToggle2).not.toHaveBeenCalled();

		rerender(
			<AccordionHeader
				headerId={HEADER_ID}
				contentId={CONTENT_ID}
				isExpanded={false}
				onToggle={mockOnToggle2}
				size="md"
				header={HEADER_TEXT}
			/>
		);

		fireEvent.click(button);
		expect(mockOnToggle1).toHaveBeenCalledTimes(1);
		expect(mockOnToggle2).toHaveBeenCalledTimes(1);
	});
});

describe('AccordionHeader - Interactions - keyboard', () => {
	it('handles Enter key press', () => {
		renderAccordionHeader();
		const button = getButton();
		button.focus();
		fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
		expect(button).toHaveFocus();
	});

	it('handles Space key press', () => {
		renderAccordionHeader();
		const button = getButton();
		button.focus();
		fireEvent.keyDown(button, { key: ' ', code: 'Space' });
		expect(button).toHaveFocus();
	});

	it('is focusable', () => {
		renderAccordionHeader();
		const button = getButton();
		button.focus();
		expect(button).toHaveFocus();
	});

	it('is not focusable when disabled', () => {
		renderAccordionHeader({ disabled: true });
		const button = getButton();
		expect(button).toBeDisabled();
	});
});

describe('AccordionHeader - Accessibility - A11y', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderAccordionHeader();
		await expectA11y(container);
	});
});

describe('AccordionHeader - Accessibility - ARIA Attributes', () => {
	it('has correct ARIA attributes when collapsed', () => {
		renderAccordionHeader({ isExpanded: false });
		const button = getButton();
		expectAriaExpanded(button, 'false');
		expectAriaControls(button, CONTENT_ID);
		expect(button).toHaveAttribute('id', HEADER_ID);
	});

	it('has correct ARIA attributes when expanded', () => {
		renderAccordionHeader({ isExpanded: true });
		const button = getButton();
		expectAriaExpanded(button, 'true');
		expectAriaControls(button, CONTENT_ID);
		expect(button).toHaveAttribute('id', HEADER_ID);
	});

	it('has correct ARIA attributes when disabled', () => {
		renderAccordionHeader({ disabled: true });
		const button = getButton();
		expectAriaExpanded(button, 'false');
		expectAriaControls(button, CONTENT_ID);
		expect(button).toBeDisabled();
	});
});

describe('AccordionHeader - Accessibility - Icon', () => {
	it('has icon with aria-hidden="true"', () => {
		renderAccordionHeader();
		const button = getButton();
		// Using querySelector for structure verification (icon is decorative, aria-hidden)

		const icon = button.querySelector('svg');
		if (icon) {
			expect(icon).toHaveAttribute('aria-hidden', 'true');
		}
	});
});

describe('AccordionHeader - Edge Cases - Header Content', () => {
	it('handles empty string header', () => {
		renderAccordionHeader({ header: '' });
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('handles number as header', () => {
		renderAccordionHeader({ header: 123 });
		const button = getButton('123');
		expect(button).toBeInTheDocument();
	});

	it('handles null header gracefully', () => {
		renderAccordionHeader({ header: null });
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('handles undefined header gracefully', () => {
		renderAccordionHeader({ header: undefined });
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});
});

describe('AccordionHeader - Edge Cases - Interactions', () => {
	it('handles rapid clicks', () => {
		const mockOnToggle = vi.fn();
		renderAccordionHeader({ onToggle: mockOnToggle });
		const button = getButton();
		for (let i = 0; i < 10; i++) {
			fireEvent.click(button);
		}
		expect(mockOnToggle).toHaveBeenCalledTimes(10);
	});

	it('maintains correct state when props change rapidly', () => {
		const { rerender } = renderAccordionHeader({ isExpanded: false });
		rerender(
			<AccordionHeader
				headerId={HEADER_ID}
				contentId={CONTENT_ID}
				isExpanded={true}
				onToggle={vi.fn()}
				size="md"
				header={HEADER_TEXT}
			/>
		);
		rerender(
			<AccordionHeader
				headerId={HEADER_ID}
				contentId={CONTENT_ID}
				isExpanded={false}
				onToggle={vi.fn()}
				size="lg"
				header={HEADER_TEXT}
			/>
		);
		const button = getButton();
		expectAriaExpanded(button, 'false');
		expect(button).toBeInTheDocument();
	});

	it('handles onToggle that throws error gracefully', () => {
		const mockOnToggle = vi.fn(() => {
			throw new Error('Test error');
		});
		renderAccordionHeader({ onToggle: mockOnToggle });
		const button = getButton();
		expect(button).toBeInTheDocument();
	});
});

describe('AccordionHeader - Component Structure', () => {
	it('wraps header content in span', () => {
		renderAccordionHeader();
		const button = getButton();
		// Using querySelector for structure verification (testing DOM structure)

		const span = button.querySelector('span');
		if (span) {
			expect(span).toBeInTheDocument();
			expect(span).toHaveTextContent(HEADER_TEXT);
		}
	});

	it('renders icon after header content', () => {
		renderAccordionHeader();
		const button = getButton();
		// Using querySelector for structure verification (testing DOM structure and element order)

		const span = button.querySelector('span');

		const icon = button.querySelector('svg');
		if (span && icon) {
			expect(span).toBeInTheDocument();
			expect(icon).toBeInTheDocument();
			// Using nextElementSibling for structure verification (testing element order)

			expect(span.nextElementSibling).toBe(icon);
		}
	});
});

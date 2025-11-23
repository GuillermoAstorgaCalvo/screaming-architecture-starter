/**
 * DescriptionList Component Tests
 *
 * Tests for DescriptionList component including:
 * - Rendering
 * - Size variants (sm, md, lg)
 * - Orientation (horizontal, vertical)
 * - Divided prop
 * - Context size inheritance
 * - Custom className
 * - Semantic HTML elements (dl, dt, dd)
 * - Accessibility
 */

import DescriptionList, {
	DescriptionDetails,
	DescriptionTerm,
} from '@core/ui/data-display/description-list/DescriptionList';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const TERM_NAME = 'Name';
const TERM_EMAIL = 'Email';
const DETAILS_NAME = 'John Doe';
const DETAILS_EMAIL = 'john@example.com';

describe('DescriptionList - Rendering', () => {
	it('renders description list element', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		expect(list).toBeInTheDocument();
		expect(list?.tagName).toBe('DL');
	});

	it('renders description term element', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const term = screen.getByText(TERM_NAME);
		expect(term).toBeInTheDocument();
		expect(term.tagName).toBe('DT');
	});

	it('renders description details element', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const details = screen.getByText(DETAILS_NAME);
		expect(details).toBeInTheDocument();
		expect(details.tagName).toBe('DD');
	});

	it('renders multiple term-details pairs', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
				<DescriptionTerm>{TERM_EMAIL}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_EMAIL}</DescriptionDetails>
			</DescriptionList>
		);
		expect(screen.getByText(TERM_NAME)).toBeInTheDocument();
		expect(screen.getByText(DETAILS_NAME)).toBeInTheDocument();
		expect(screen.getByText(TERM_EMAIL)).toBeInTheDocument();
		expect(screen.getByText(DETAILS_EMAIL)).toBeInTheDocument();
	});

	it('renders with custom className on DescriptionList', () => {
		renderWithProviders(
			<DescriptionList className="custom-list">
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		expect(list).toHaveClass('custom-list');
	});

	it('renders with custom className on DescriptionTerm', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm className="custom-term">{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const term = screen.getByText(TERM_NAME);
		expect(term).toHaveClass('custom-term');
	});

	it('renders with custom className on DescriptionDetails', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails className="custom-details">{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const details = screen.getByText(DETAILS_NAME);
		expect(details).toHaveClass('custom-details');
	});
});

describe('DescriptionList - Size Variants', () => {
	it('renders with default size (md)', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		expect(list).toBeInTheDocument();
	});

	it('renders with size="sm"', () => {
		renderWithProviders(
			<DescriptionList size="sm">
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		expect(list).toBeInTheDocument();
	});

	it('renders with size="md"', () => {
		renderWithProviders(
			<DescriptionList size="md">
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		expect(list).toBeInTheDocument();
	});

	it('renders with size="lg"', () => {
		renderWithProviders(
			<DescriptionList size="lg">
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		expect(list).toBeInTheDocument();
	});

	it('inherits size from context for DescriptionTerm', () => {
		renderWithProviders(
			<DescriptionList size="lg">
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const term = screen.getByText(TERM_NAME);
		expect(term).toBeInTheDocument();
	});

	it('inherits size from context for DescriptionDetails', () => {
		renderWithProviders(
			<DescriptionList size="sm">
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const details = screen.getByText(DETAILS_NAME);
		expect(details).toBeInTheDocument();
	});

	it('allows overriding size on DescriptionTerm', () => {
		renderWithProviders(
			<DescriptionList size="md">
				<DescriptionTerm size="lg">{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const term = screen.getByText(TERM_NAME);
		expect(term).toBeInTheDocument();
	});

	it('allows overriding size on DescriptionDetails', () => {
		renderWithProviders(
			<DescriptionList size="md">
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails size="sm">{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const details = screen.getByText(DETAILS_NAME);
		expect(details).toBeInTheDocument();
	});
});

describe('DescriptionList - Orientation', () => {
	it('renders with default orientation (horizontal)', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		expect(list).toBeInTheDocument();
	});

	it('renders with orientation="horizontal"', () => {
		renderWithProviders(
			<DescriptionList orientation="horizontal">
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		expect(list).toBeInTheDocument();
	});

	it('renders with orientation="vertical"', () => {
		renderWithProviders(
			<DescriptionList orientation="vertical">
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		expect(list).toBeInTheDocument();
	});
});

describe('DescriptionList - Divided Prop', () => {
	it('renders without dividers by default', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
				<DescriptionTerm>{TERM_EMAIL}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_EMAIL}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		expect(list).toBeInTheDocument();
	});

	it('renders with dividers when divided=true', () => {
		renderWithProviders(
			<DescriptionList divided>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
				<DescriptionTerm>{TERM_EMAIL}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_EMAIL}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		expect(list).toBeInTheDocument();
	});

	it('renders without dividers when divided=false', () => {
		renderWithProviders(
			<DescriptionList divided={false}>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		expect(list).toBeInTheDocument();
	});
});

describe('DescriptionList - Combined Props', () => {
	it('renders with all props combined', () => {
		renderWithProviders(
			<DescriptionList orientation="vertical" size="lg" divided className="custom-class">
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
				<DescriptionTerm>{TERM_EMAIL}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_EMAIL}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		expect(list).toBeInTheDocument();
		expect(list).toHaveClass('custom-class');
		expect(screen.getByText(TERM_NAME)).toBeInTheDocument();
		expect(screen.getByText(DETAILS_NAME)).toBeInTheDocument();
		expect(screen.getByText(TERM_EMAIL)).toBeInTheDocument();
		expect(screen.getByText(DETAILS_EMAIL)).toBeInTheDocument();
	});
});

describe('DescriptionList - HTML Attributes', () => {
	it('preserves HTML attributes on DescriptionList', () => {
		renderWithProviders(
			<DescriptionList data-testid="description-list" aria-label="User information">
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByTestId('description-list');
		expect(list).toBeInTheDocument();
		expect(list).toHaveAttribute('aria-label', 'User information');
	});

	it('preserves HTML attributes on DescriptionTerm', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm data-testid="term" aria-label="Name term">
					{TERM_NAME}
				</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const term = screen.getByTestId('term');
		expect(term).toBeInTheDocument();
		expect(term).toHaveAttribute('aria-label', 'Name term');
	});

	it('preserves HTML attributes on DescriptionDetails', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails data-testid="details" aria-label="Name details">
					{DETAILS_NAME}
				</DescriptionDetails>
			</DescriptionList>
		);
		const details = screen.getByTestId('details');
		expect(details).toBeInTheDocument();
		expect(details).toHaveAttribute('aria-label', 'Name details');
	});
});

describe('DescriptionList - Context Default Behavior', () => {
	it('uses default size (md) when DescriptionTerm is used without DescriptionList', () => {
		renderWithProviders(
			<dl>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</dl>
		);
		const term = screen.getByText(TERM_NAME);
		expect(term).toBeInTheDocument();
		expect(term.tagName).toBe('DT');
	});

	it('uses default size (md) when DescriptionDetails is used without DescriptionList', () => {
		renderWithProviders(
			<dl>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</dl>
		);
		const details = screen.getByText(DETAILS_NAME);
		expect(details).toBeInTheDocument();
		expect(details.tagName).toBe('DD');
	});
});

describe('DescriptionList - Edge Cases', () => {
	it('handles empty children gracefully', () => {
		renderWithProviders(<DescriptionList>{null}</DescriptionList>);
		const list = document.querySelector('dl');
		expect(list).toBeInTheDocument();
	});

	it('handles multiple DescriptionList components independently', () => {
		renderWithProviders(
			<>
				<DescriptionList size="sm" data-testid="list-1">
					<DescriptionTerm>Term 1</DescriptionTerm>
					<DescriptionDetails>Details 1</DescriptionDetails>
				</DescriptionList>
				<DescriptionList size="lg" data-testid="list-2">
					<DescriptionTerm>Term 2</DescriptionTerm>
					<DescriptionDetails>Details 2</DescriptionDetails>
				</DescriptionList>
			</>
		);
		expect(screen.getByTestId('list-1')).toBeInTheDocument();
		expect(screen.getByTestId('list-2')).toBeInTheDocument();
		expect(screen.getByText('Term 1')).toBeInTheDocument();
		expect(screen.getByText('Details 1')).toBeInTheDocument();
		expect(screen.getByText('Term 2')).toBeInTheDocument();
		expect(screen.getByText('Details 2')).toBeInTheDocument();
	});

	it('handles complex nested content in DescriptionTerm', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm>
					<span data-testid="nested-term">Complex Term</span>
				</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		expect(screen.getByTestId('nested-term')).toBeInTheDocument();
		expect(screen.getByText('Complex Term')).toBeInTheDocument();
	});

	it('handles complex nested content in DescriptionDetails', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>
					<span data-testid="nested-details">Complex Details</span>
				</DescriptionDetails>
			</DescriptionList>
		);
		expect(screen.getByTestId('nested-details')).toBeInTheDocument();
		expect(screen.getByText('Complex Details')).toBeInTheDocument();
	});
});

describe('DescriptionList - Accessibility', () => {
	it('should have no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<DescriptionList>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		await expectA11y(container);
	});

	it('uses semantic HTML structure', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		const term = screen.getByText(TERM_NAME);
		const details = screen.getByText(DETAILS_NAME);
		expect(list?.tagName).toBe('DL');
		expect(term.tagName).toBe('DT');
		expect(details.tagName).toBe('DD');
	});

	it('supports custom ARIA attributes', () => {
		renderWithProviders(
			<DescriptionList aria-label="User profile information">
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
			</DescriptionList>
		);
		const list = screen.getByText(TERM_NAME).closest('dl');
		expect(list).toHaveAttribute('aria-label', 'User profile information');
	});

	it('maintains proper semantic relationship between dt and dd', () => {
		renderWithProviders(
			<DescriptionList>
				<DescriptionTerm>{TERM_NAME}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_NAME}</DescriptionDetails>
				<DescriptionTerm>{TERM_EMAIL}</DescriptionTerm>
				<DescriptionDetails>{DETAILS_EMAIL}</DescriptionDetails>
			</DescriptionList>
		);
		// Verify proper semantic structure
		const allTerms = document.querySelectorAll('dt');
		const allDetails = document.querySelectorAll('dd');
		expect(allTerms).toHaveLength(2);
		expect(allDetails).toHaveLength(2);
		// Verify they are siblings within the same dl
		const list = screen.getByText(TERM_NAME).closest('dl');
		const termsInList = list?.querySelectorAll('dt');
		const detailsInList = list?.querySelectorAll('dd');
		expect(termsInList).toHaveLength(2);
		expect(detailsInList).toHaveLength(2);
	});
});

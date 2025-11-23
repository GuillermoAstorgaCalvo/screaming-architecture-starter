/**
 * FilterBuilderHeader Component Tests
 *
 * Tests for the FilterBuilderHeader and FilterBuilderClosed components:
 * - Rendering header with close button
 * - Rendering closed state button
 * - Click handlers
 * - Disabled state
 */

import {
	FilterBuilderClosed,
	FilterBuilderHeader,
} from '@core/ui/data-display/data-table/components/advanced-filter/FilterBuilderHeader';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const mockOnClose = vi.fn();
const mockOnToggle = vi.fn();

describe('FilterBuilderHeader', () => {
	it('renders header with title', () => {
		renderWithProviders(<FilterBuilderHeader onClose={mockOnClose} />);
		expect(screen.getByText(/filter builder/i)).toBeInTheDocument();
	});

	it('renders close button', () => {
		renderWithProviders(<FilterBuilderHeader onClose={mockOnClose} />);
		const closeButton = screen.getByRole('button', { name: /close filter builder/i });
		expect(closeButton).toBeInTheDocument();
	});

	it('calls onClose when close button is clicked', () => {
		renderWithProviders(<FilterBuilderHeader onClose={mockOnClose} />);
		const closeButton = screen.getByRole('button', { name: /close filter builder/i });
		fireEvent.click(closeButton);
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});
});

describe('FilterBuilderClosed', () => {
	it('renders "Add Filter" button', () => {
		renderWithProviders(<FilterBuilderClosed onToggle={mockOnToggle} />);
		expect(screen.getByText(/add filter/i)).toBeInTheDocument();
	});

	it('calls onToggle when button is clicked', () => {
		renderWithProviders(<FilterBuilderClosed onToggle={mockOnToggle} />);
		const button = screen.getByText(/add filter/i);
		fireEvent.click(button);
		expect(mockOnToggle).toHaveBeenCalledTimes(1);
	});

	it('renders disabled button when disabled prop is true', () => {
		renderWithProviders(<FilterBuilderClosed onToggle={mockOnToggle} disabled />);
		const button = screen.getByText(/add filter/i);
		expect(button).toBeDisabled();
	});

	it('renders enabled button when disabled prop is false', () => {
		renderWithProviders(<FilterBuilderClosed onToggle={mockOnToggle} disabled={false} />);
		const button = screen.getByText(/add filter/i);
		expect(button).not.toBeDisabled();
	});

	it('does not call onToggle when disabled and clicked', () => {
		mockOnToggle.mockClear();
		renderWithProviders(<FilterBuilderClosed onToggle={mockOnToggle} disabled />);
		const button = screen.getByText(/add filter/i);
		fireEvent.click(button);
		expect(mockOnToggle).not.toHaveBeenCalled();
	});
});

describe('FilterBuilderHeader - Direct Component Test (Coverage)', () => {
	it('should execute the FilterBuilderHeader component function directly', async () => {
		const { FilterBuilderHeader: FilterBuilderHeaderComponent } = await import(
			'@core/ui/data-display/data-table/components/advanced-filter/FilterBuilderHeader'
		);
		expect(typeof FilterBuilderHeaderComponent).toBe('function');
		renderWithProviders(<FilterBuilderHeaderComponent onClose={mockOnClose} />);
		expect(screen.getByText(/filter builder/i)).toBeInTheDocument();
	});
});

describe('FilterBuilderClosed - Direct Component Test (Coverage)', () => {
	it('should execute the FilterBuilderClosed component function directly', async () => {
		const { FilterBuilderClosed: FilterBuilderClosedComponent } = await import(
			'@core/ui/data-display/data-table/components/advanced-filter/FilterBuilderHeader'
		);
		expect(typeof FilterBuilderClosedComponent).toBe('function');
		renderWithProviders(<FilterBuilderClosedComponent onToggle={mockOnToggle} />);
		expect(screen.getByText(/add filter/i)).toBeInTheDocument();
	});
});

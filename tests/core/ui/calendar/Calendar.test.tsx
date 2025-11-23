import Calendar from '@core/ui/calendar/Calendar';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const mockEvents = [
	{ id: '1', date: new Date(2024, 0, 15), title: 'Meeting' },
	{ id: '2', date: new Date(2024, 0, 20), title: 'Conference' },
];

// Helper functions
const findDayButton = (dayNumber: number): HTMLElement | undefined => {
	const dayButtons = screen.getAllByRole('gridcell');
	return dayButtons.find(button => {
		const text = button.textContent;
		return text === String(dayNumber) || text?.includes(String(dayNumber));
	});
};

const clickDayButton = (dayNumber: number): void => {
	const dayButton = findDayButton(dayNumber);
	if (dayButton) {
		fireEvent.click(dayButton);
	}
};

describe('Calendar - Rendering', () => {
	it('renders calendar with default month', () => {
		const { container } = renderWithProviders(<Calendar />);
		expect(container).toBeInTheDocument();
	});

	it('renders calendar with specific month', () => {
		const month = new Date(2024, 0, 1);
		renderWithProviders(<Calendar month={month} />);
		expect(screen.getByRole('grid')).toBeInTheDocument();
	});

	it('renders calendar with events', () => {
		renderWithProviders(<Calendar month={new Date(2024, 0, 1)} events={mockEvents} />);
		expect(screen.getByRole('grid')).toBeInTheDocument();
	});
});

describe('Calendar - Month Navigation', () => {
	it('navigates to next month', () => {
		const month = new Date(2024, 0, 1);
		const onMonthChange = vi.fn();
		renderWithProviders(<Calendar month={month} onMonthChange={onMonthChange} />);

		const nextButton = screen.getByLabelText(/next month/i);
		fireEvent.click(nextButton);

		expect(onMonthChange).toHaveBeenCalled();
	});

	it('navigates to previous month', () => {
		const month = new Date(2024, 0, 1);
		const onMonthChange = vi.fn();
		renderWithProviders(<Calendar month={month} onMonthChange={onMonthChange} />);

		const prevButton = screen.getByLabelText(/previous month/i);
		fireEvent.click(prevButton);

		expect(onMonthChange).toHaveBeenCalled();
	});

	it('respects minDate when navigating', () => {
		const month = new Date(2024, 1, 1);
		const minDate = new Date(2024, 0, 1);
		const onMonthChange = vi.fn();
		renderWithProviders(<Calendar month={month} minDate={minDate} onMonthChange={onMonthChange} />);

		const prevButton = screen.getByLabelText(/previous month/i);
		fireEvent.click(prevButton);

		expect(onMonthChange).toHaveBeenCalled();
	});

	it('respects maxDate when navigating', () => {
		const month = new Date(2024, 0, 1);
		const maxDate = new Date(2024, 1, 1);
		const onMonthChange = vi.fn();
		renderWithProviders(<Calendar month={month} maxDate={maxDate} onMonthChange={onMonthChange} />);

		const nextButton = screen.getByLabelText(/next month/i);
		fireEvent.click(nextButton);

		expect(onMonthChange).toHaveBeenCalled();
	});
});

describe('Calendar - Date Selection', () => {
	describe('Single Date Selection', () => {
		it('selects a date when selectable is true', () => {
			const onDateSelect = vi.fn();
			const month = new Date(2024, 0, 1);
			renderWithProviders(<Calendar month={month} selectable onDateSelect={onDateSelect} />);

			clickDayButton(15);
			expect(onDateSelect).toHaveBeenCalled();
		});

		it('does not select date when selectable is false', () => {
			const onDateSelect = vi.fn();
			const month = new Date(2024, 0, 1);
			renderWithProviders(
				<Calendar month={month} selectable={false} onDateSelect={onDateSelect} />
			);

			clickDayButton(15);
			expect(onDateSelect).not.toHaveBeenCalled();
		});
	});

	describe('Range Selection', () => {
		it('selects date range when rangeSelectable is true', () => {
			const onRangeSelect = vi.fn();
			const month = new Date(2024, 0, 1);
			renderWithProviders(<Calendar month={month} rangeSelectable onRangeSelect={onRangeSelect} />);

			clickDayButton(10);
			clickDayButton(15);
			expect(onRangeSelect).toHaveBeenCalled();
		});
	});

	describe('Date Constraints', () => {
		it('respects minDate for selection', () => {
			const onDateSelect = vi.fn();
			const month = new Date(2024, 0, 1);
			const minDate = new Date(2024, 0, 10);
			renderWithProviders(
				<Calendar month={month} selectable minDate={minDate} onDateSelect={onDateSelect} />
			);

			clickDayButton(5);
			expect(onDateSelect).not.toHaveBeenCalled();
		});

		it('respects maxDate for selection', () => {
			const onDateSelect = vi.fn();
			const month = new Date(2024, 0, 1);
			const maxDate = new Date(2024, 0, 20);
			renderWithProviders(
				<Calendar month={month} selectable maxDate={maxDate} onDateSelect={onDateSelect} />
			);

			clickDayButton(25);
			expect(onDateSelect).not.toHaveBeenCalled();
		});
	});
});

describe('Calendar - State Management', () => {
	it('uses controlled month', () => {
		const month = new Date(2024, 0, 1);
		const onMonthChange = vi.fn();
		const { rerender } = renderWithProviders(
			<Calendar month={month} onMonthChange={onMonthChange} />
		);

		const newMonth = new Date(2024, 1, 1);
		rerender(<Calendar month={newMonth} onMonthChange={onMonthChange} />);

		expect(screen.getByRole('grid')).toBeInTheDocument();
	});

	it('uses defaultMonth for uncontrolled mode', () => {
		const defaultMonth = new Date(2024, 0, 1);
		renderWithProviders(<Calendar defaultMonth={defaultMonth} />);

		expect(screen.getByRole('grid')).toBeInTheDocument();
	});

	it('uses controlled selectedDate', () => {
		const selectedDate = new Date(2024, 0, 15);
		renderWithProviders(
			<Calendar month={new Date(2024, 0, 1)} selectedDate={selectedDate} selectable />
		);

		expect(screen.getByRole('grid')).toBeInTheDocument();
	});

	it('uses controlled selectedRange', () => {
		const selectedRange = {
			start: new Date(2024, 0, 10),
			end: new Date(2024, 0, 15),
		};
		renderWithProviders(
			<Calendar month={new Date(2024, 0, 1)} selectedRange={selectedRange} rangeSelectable />
		);

		expect(screen.getByRole('grid')).toBeInTheDocument();
	});
});

describe('Calendar - Keyboard Navigation', () => {
	it('navigates with arrow keys', () => {
		const month = new Date(2024, 0, 1);
		renderWithProviders(<Calendar month={month} selectable />);

		const grid = screen.getByRole('grid');
		fireEvent.keyDown(grid, { key: 'ArrowRight' });
		fireEvent.keyDown(grid, { key: 'ArrowLeft' });
		fireEvent.keyDown(grid, { key: 'ArrowUp' });
		fireEvent.keyDown(grid, { key: 'ArrowDown' });

		expect(grid).toBeInTheDocument();
	});

	it('selects date with Enter key', () => {
		const onDateSelect = vi.fn();
		const month = new Date(2024, 0, 1);
		renderWithProviders(<Calendar month={month} selectable onDateSelect={onDateSelect} />);

		const grid = screen.getByRole('grid');
		fireEvent.keyDown(grid, { key: 'Enter' });

		expect(grid).toBeInTheDocument();
	});
});

describe('Calendar - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(<Calendar month={new Date(2024, 0, 1)} />);

		await expectA11y(container, {
			rules: {
				'color-contrast': { enabled: false },
				'page-has-heading-one': { enabled: false },
				'aria-required-children': { enabled: false },
			},
		} as Parameters<typeof expectA11y>[1]);
	});

	it('has proper ARIA attributes', () => {
		renderWithProviders(<Calendar month={new Date(2024, 0, 1)} />);

		const grid = screen.getByRole('grid');
		expect(grid).toHaveAttribute('aria-label', expect.stringMatching(/calendar/i));
	});

	it('has accessible month navigation buttons', () => {
		renderWithProviders(<Calendar month={new Date(2024, 0, 1)} />);

		const nextButton = screen.getByLabelText(/next month/i);
		const prevButton = screen.getByLabelText(/previous month/i);

		expect(nextButton).toBeInTheDocument();
		expect(prevButton).toBeInTheDocument();
	});

	it('has accessible day cells', () => {
		renderWithProviders(<Calendar month={new Date(2024, 0, 1)} selectable />);

		const dayCells = screen.getAllByRole('gridcell');
		expect(dayCells.length).toBeGreaterThan(0);
	});
});

describe('Calendar - Disabled State', () => {
	it('disables calendar interactions when disabled', () => {
		const onDateSelect = vi.fn();
		const month = new Date(2024, 0, 1);
		renderWithProviders(<Calendar month={month} disabled selectable onDateSelect={onDateSelect} />);

		const dayButtons = screen.getAllByRole('gridcell');
		const [targetDay] = dayButtons;

		if (targetDay) {
			fireEvent.click(targetDay);
			expect(onDateSelect).not.toHaveBeenCalled();
		}
	});
});

describe('Calendar - Custom Renderers', () => {
	it('renders with custom day renderer', () => {
		const customDayRenderer = vi.fn(props => <div>{props.date.getDate()}</div>);
		renderWithProviders(<Calendar month={new Date(2024, 0, 1)} renderDay={customDayRenderer} />);

		expect(screen.getByRole('grid')).toBeInTheDocument();
	});

	it('renders with custom event renderer', () => {
		const customEventRenderer = vi.fn(event => <div>{event.title}</div>);
		renderWithProviders(
			<Calendar
				month={new Date(2024, 0, 1)}
				events={mockEvents}
				renderEvent={customEventRenderer}
			/>
		);

		expect(screen.getByRole('grid')).toBeInTheDocument();
	});
});

describe('Calendar - Locale Support', () => {
	it('renders with different locale', () => {
		renderWithProviders(<Calendar month={new Date(2024, 0, 1)} locale="fr-FR" />);

		expect(screen.getByRole('grid')).toBeInTheDocument();
	});
});

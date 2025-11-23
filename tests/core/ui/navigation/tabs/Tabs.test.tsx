import Tabs from '@core/ui/navigation/tabs/Tabs';
import type { TabItem } from '@src-types/ui/navigation/tabs';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const mockTabs: readonly TabItem[] = [
	{
		id: 'tab1',
		label: 'Tab 1',
		content: <div>Content 1</div>,
	},
	{
		id: 'tab2',
		label: 'Tab 2',
		content: <div>Content 2</div>,
	},
	{
		id: 'tab3',
		label: 'Tab 3',
		content: <div>Content 3</div>,
	},
] as const;

const mockTabsWithDisabled: readonly TabItem[] = [
	{
		id: 'tab1',
		label: 'Tab 1',
		content: <div>Content 1</div>,
	},
	{
		id: 'tab2',
		label: 'Tab 2',
		content: <div>Content 2</div>,
		disabled: true,
	},
	{
		id: 'tab3',
		label: 'Tab 3',
		content: <div>Content 3</div>,
	},
] as const;

describe('Tabs Component - Basic Rendering', () => {
	it('renders tabs with items', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />);

		expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
		expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
		expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeInTheDocument();
	});

	it('renders active tab content', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />);

		expect(screen.getByText('Content 1')).toBeInTheDocument();
		expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
		expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
	});

	it('renders disabled tabs', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(
			<Tabs items={mockTabsWithDisabled} activeTabId="tab1" onTabChange={handleTabChange} />
		);

		const disabledTab = screen.getByRole('tab', { name: 'Tab 2' });
		expect(disabledTab).toBeInTheDocument();
		expect(disabledTab).toBeDisabled();
	});
});

describe('Tabs Component - Variant and Styling', () => {
	it('renders with default variant', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />);

		expect(screen.getByRole('tablist')).toBeInTheDocument();
	});

	it('renders with custom variant', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(
			<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} variant="pills" />
		);

		expect(screen.getByRole('tablist')).toBeInTheDocument();
	});

	it('renders with custom size', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(
			<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} size="lg" />
		);

		expect(screen.getByRole('tablist')).toBeInTheDocument();
	});

	it('renders with fullWidth', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(
			<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} fullWidth />
		);

		expect(screen.getByRole('tablist')).toBeInTheDocument();
	});

	it('renders with custom tabsId', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(
			<Tabs
				items={mockTabs}
				activeTabId="tab1"
				onTabChange={handleTabChange}
				tabsId="custom-tabs-id"
			/>
		);

		expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
	});
});

describe('Tabs Component - Interactions', () => {
	it('calls onTabChange when tab is clicked', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />);

		const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
		fireEvent.click(tab2);

		expect(handleTabChange).toHaveBeenCalledWith('tab2');
		expect(handleTabChange).toHaveBeenCalledTimes(1);
	});

	it('does not call onTabChange when disabled tab is clicked', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(
			<Tabs items={mockTabsWithDisabled} activeTabId="tab1" onTabChange={handleTabChange} />
		);

		const disabledTab = screen.getByRole('tab', { name: 'Tab 2' });
		fireEvent.click(disabledTab);

		expect(handleTabChange).not.toHaveBeenCalled();
	});

	it('updates active tab content when tab changes', () => {
		const handleTabChange = vi.fn();
		const { rerender } = renderWithProviders(
			<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />
		);

		expect(screen.getByText('Content 1')).toBeInTheDocument();

		rerender(<Tabs items={mockTabs} activeTabId="tab2" onTabChange={handleTabChange} />);

		expect(screen.getByText('Content 2')).toBeInTheDocument();
		expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
	});
});

describe('Tabs Component - Navigation', () => {
	it('navigates between tabs correctly', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />);

		const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
		fireEvent.click(tab3);

		expect(handleTabChange).toHaveBeenCalledWith('tab3');
	});

	it('handles tab navigation with multiple clicks', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />);

		fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
		fireEvent.click(screen.getByRole('tab', { name: 'Tab 3' }));
		fireEvent.click(screen.getByRole('tab', { name: 'Tab 1' }));

		expect(handleTabChange).toHaveBeenCalledTimes(3);
		expect(handleTabChange).toHaveBeenNthCalledWith(1, 'tab2');
		expect(handleTabChange).toHaveBeenNthCalledWith(2, 'tab3');
		expect(handleTabChange).toHaveBeenNthCalledWith(3, 'tab1');
	});
});

describe('Tabs Component - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const handleTabChange = vi.fn();
		const { container } = renderWithProviders(
			<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />
		);

		await expectA11y(container);
	});

	it('has proper ARIA roles', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />);

		expect(screen.getByRole('tablist')).toBeInTheDocument();
		expect(screen.getAllByRole('tab')).toHaveLength(3);
		expect(screen.getByRole('tabpanel')).toBeInTheDocument();
	});

	it('has proper ARIA attributes for active tab', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />);

		const activeTab = screen.getByRole('tab', { name: 'Tab 1' });
		expect(activeTab).toHaveAttribute('aria-selected', 'true');
	});

	it('has proper ARIA attributes for inactive tabs', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />);

		const inactiveTab = screen.getByRole('tab', { name: 'Tab 2' });
		expect(inactiveTab).toHaveAttribute('aria-selected', 'false');
	});

	it('has proper ARIA attributes for disabled tabs', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(
			<Tabs items={mockTabsWithDisabled} activeTabId="tab1" onTabChange={handleTabChange} />
		);

		const disabledTab = screen.getByRole('tab', { name: 'Tab 2' });
		expect(disabledTab).toBeDisabled();
	});

	it('has proper tabpanel aria-labelledby', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />);

		const tabpanel = screen.getByRole('tabpanel');
		const activeTab = screen.getByRole('tab', { name: 'Tab 1' });
		const tabId = activeTab.getAttribute('id');

		expect(tabpanel).toHaveAttribute('aria-labelledby', tabId);
	});
});

describe('Tabs Component - Keyboard Navigation - Arrow Keys', () => {
	it('navigates to next tab with ArrowRight', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />);

		const tablist = screen.getByRole('tablist');
		fireEvent.keyDown(tablist, { key: 'ArrowRight' });

		expect(handleTabChange).toHaveBeenCalledWith('tab2');
	});

	it('navigates to previous tab with ArrowLeft', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab2" onTabChange={handleTabChange} />);

		const tablist = screen.getByRole('tablist');
		fireEvent.keyDown(tablist, { key: 'ArrowLeft' });

		expect(handleTabChange).toHaveBeenCalledWith('tab1');
	});

	it('wraps around when navigating with ArrowRight from last tab', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab3" onTabChange={handleTabChange} />);

		const tablist = screen.getByRole('tablist');
		fireEvent.keyDown(tablist, { key: 'ArrowRight' });

		expect(handleTabChange).toHaveBeenCalledWith('tab1');
	});

	it('wraps around when navigating with ArrowLeft from first tab', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />);

		const tablist = screen.getByRole('tablist');
		fireEvent.keyDown(tablist, { key: 'ArrowLeft' });

		expect(handleTabChange).toHaveBeenCalledWith('tab3');
	});
});

describe('Tabs Component - Keyboard Navigation - Home/End', () => {
	it('navigates to first tab with Home key', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab3" onTabChange={handleTabChange} />);

		const tablist = screen.getByRole('tablist');
		fireEvent.keyDown(tablist, { key: 'Home' });

		expect(handleTabChange).toHaveBeenCalledWith('tab1');
	});

	it('navigates to last tab with End key', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />);

		const tablist = screen.getByRole('tablist');
		fireEvent.keyDown(tablist, { key: 'End' });

		expect(handleTabChange).toHaveBeenCalledWith('tab3');
	});
});

describe('Tabs Component - Keyboard Navigation - Disabled Tabs', () => {
	it('skips disabled tabs when navigating with ArrowRight', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(
			<Tabs items={mockTabsWithDisabled} activeTabId="tab1" onTabChange={handleTabChange} />
		);

		const tablist = screen.getByRole('tablist');
		fireEvent.keyDown(tablist, { key: 'ArrowRight' });

		// Should skip tab2 (disabled) and go to tab3
		expect(handleTabChange).toHaveBeenCalledWith('tab3');
	});

	it('skips disabled tabs when navigating with ArrowLeft', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(
			<Tabs items={mockTabsWithDisabled} activeTabId="tab3" onTabChange={handleTabChange} />
		);

		const tablist = screen.getByRole('tablist');
		fireEvent.keyDown(tablist, { key: 'ArrowLeft' });

		// Should skip tab2 (disabled) and go to tab1
		expect(handleTabChange).toHaveBeenCalledWith('tab1');
	});

	it('skips disabled tabs when navigating with Home', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(
			<Tabs items={mockTabsWithDisabled} activeTabId="tab3" onTabChange={handleTabChange} />
		);

		const tablist = screen.getByRole('tablist');
		fireEvent.keyDown(tablist, { key: 'Home' });

		// Should go to first enabled tab (tab1)
		expect(handleTabChange).toHaveBeenCalledWith('tab1');
	});

	it('skips disabled tabs when navigating with End', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(
			<Tabs items={mockTabsWithDisabled} activeTabId="tab1" onTabChange={handleTabChange} />
		);

		const tablist = screen.getByRole('tablist');
		fireEvent.keyDown(tablist, { key: 'End' });

		// Should go to last enabled tab (tab3)
		expect(handleTabChange).toHaveBeenCalledWith('tab3');
	});
});

describe('Tabs Component - Keyboard Navigation - Other Keys', () => {
	it('does not navigate on other keys', () => {
		const handleTabChange = vi.fn();
		renderWithProviders(<Tabs items={mockTabs} activeTabId="tab1" onTabChange={handleTabChange} />);

		const tablist = screen.getByRole('tablist');
		fireEvent.keyDown(tablist, { key: 'a' });
		fireEvent.keyDown(tablist, { key: 'Enter' });
		fireEvent.keyDown(tablist, { key: 'Space' });

		expect(handleTabChange).not.toHaveBeenCalled();
	});
});

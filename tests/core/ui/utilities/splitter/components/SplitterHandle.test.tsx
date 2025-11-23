/**
 * Tests for SplitterHandle component
 *
 * Tests the SplitterHandle component:
 * - Rendering
 * - Orientation handling
 * - Disabled state
 * - Mouse event handling
 * - Styling
 */

import { SplitterContext } from '@core/ui/utilities/splitter/components/SplitterContext';
import { SplitterHandle } from '@core/ui/utilities/splitter/components/SplitterHandle';
import { SplitterPanel } from '@core/ui/utilities/splitter/components/SplitterPanel';
import Splitter from '@core/ui/utilities/splitter/Splitter';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock useTranslation
vi.mock('@core/i18n/useTranslation', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

beforeEach(() => {
	vi.clearAllMocks();
});

const RESIZE_PANEL_1_LABEL = 'Resize panel 1';

describe('SplitterHandle - Rendering', () => {
	it('renders handle with correct aria-label', () => {
		renderWithProviders(
			<Splitter>
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
				<SplitterPanel id="panel2">Panel 2</SplitterPanel>
			</Splitter>
		);

		const handle = screen.getByLabelText(RESIZE_PANEL_1_LABEL);
		expect(handle).toBeInTheDocument();
	});

	it('renders as button element', () => {
		renderWithProviders(
			<Splitter>
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
				<SplitterPanel id="panel2">Panel 2</SplitterPanel>
			</Splitter>
		);

		const handle = screen.getByLabelText(RESIZE_PANEL_1_LABEL);
		expect(handle.tagName).toBe('BUTTON');
	});

	it('applies custom className', () => {
		const mockContextValue = {
			orientation: 'horizontal' as const,
			disabled: false,
			handleSize: 4,
			handleClassName: 'custom-handle',
			panelStates: [],
			registerPanel: vi.fn(),
			unregisterPanel: vi.fn(),
			handleMouseDown: vi.fn(),
			isResizing: false,
			setPanelCollapsed: vi.fn(),
			getPanelState: vi.fn(),
		};

		renderWithProviders(
			<SplitterContext.Provider value={mockContextValue}>
				<SplitterHandle panelIndex={0} className="additional-class" />
			</SplitterContext.Provider>
		);

		const handle = screen.getByTestId('splitter-handle-0');
		expect(handle).toHaveClass('custom-handle');
		expect(handle).toHaveClass('additional-class');
	});
});

describe('SplitterHandle - Orientation', () => {
	it('applies horizontal styles for horizontal orientation', () => {
		renderWithProviders(
			<Splitter orientation="horizontal">
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
				<SplitterPanel id="panel2">Panel 2</SplitterPanel>
			</Splitter>
		);

		const handle = screen.getByLabelText(RESIZE_PANEL_1_LABEL);
		expect(handle).toHaveClass('cursor-ew-resize');
	});

	it('applies vertical styles for vertical orientation', () => {
		renderWithProviders(
			<Splitter orientation="vertical">
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
				<SplitterPanel id="panel2">Panel 2</SplitterPanel>
			</Splitter>
		);

		const handle = screen.getByLabelText(RESIZE_PANEL_1_LABEL);
		expect(handle).toHaveClass('cursor-ns-resize');
	});

	it('applies correct width for horizontal orientation', () => {
		renderWithProviders(
			<Splitter orientation="horizontal" handleSize={8}>
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
				<SplitterPanel id="panel2">Panel 2</SplitterPanel>
			</Splitter>
		);

		const handle = screen.getByLabelText(RESIZE_PANEL_1_LABEL);
		expect(handle).toHaveStyle({ width: '8px' });
	});

	it('applies correct height for vertical orientation', () => {
		renderWithProviders(
			<Splitter orientation="vertical" handleSize={8}>
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
				<SplitterPanel id="panel2">Panel 2</SplitterPanel>
			</Splitter>
		);

		const handle = screen.getByLabelText(RESIZE_PANEL_1_LABEL);
		expect(handle).toHaveStyle({ height: '8px' });
	});
});

describe('SplitterHandle - Disabled State', () => {
	it('disables handle when splitter is disabled', () => {
		renderWithProviders(
			<Splitter disabled>
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
				<SplitterPanel id="panel2">Panel 2</SplitterPanel>
			</Splitter>
		);

		const handle = screen.getByLabelText(RESIZE_PANEL_1_LABEL);
		expect(handle).toBeDisabled();
		expect(handle).toHaveAttribute('tabIndex', '-1');
	});

	it('does not apply hover styles when disabled', () => {
		const mockContextValue = {
			orientation: 'horizontal' as const,
			disabled: true,
			handleSize: 4,
			panelStates: [],
			registerPanel: vi.fn(),
			unregisterPanel: vi.fn(),
			handleMouseDown: vi.fn(),
			isResizing: false,
			setPanelCollapsed: vi.fn(),
			getPanelState: vi.fn(),
		};

		renderWithProviders(
			<SplitterContext.Provider value={mockContextValue}>
				<SplitterHandle panelIndex={0} />
			</SplitterContext.Provider>
		);

		const handle = screen.getByTestId('splitter-handle-0');
		expect(handle).not.toHaveClass('hover:bg-muted');
	});
});

describe('SplitterHandle - Mouse Events', () => {
	it('calls handleMouseDown on mousedown', () => {
		const handleMouseDown = vi.fn();

		const mockContextValue = {
			orientation: 'horizontal' as const,
			disabled: false,
			handleSize: 4,
			panelStates: [],
			registerPanel: vi.fn(),
			unregisterPanel: vi.fn(),
			handleMouseDown,
			isResizing: false,
			setPanelCollapsed: vi.fn(),
			getPanelState: vi.fn(),
		};

		renderWithProviders(
			<SplitterContext.Provider value={mockContextValue}>
				<SplitterHandle panelIndex={0} />
			</SplitterContext.Provider>
		);

		const handle = screen.getByLabelText(RESIZE_PANEL_1_LABEL);
		fireEvent.mouseDown(handle);

		expect(handleMouseDown).toHaveBeenCalledTimes(1);
		expect(handleMouseDown).toHaveBeenCalledWith(expect.any(Object), 0);
	});

	it('handles click events', () => {
		const handleMouseDown = vi.fn();

		const mockContextValue = {
			orientation: 'horizontal' as const,
			disabled: false,
			handleSize: 4,
			panelStates: [],
			registerPanel: vi.fn(),
			unregisterPanel: vi.fn(),
			handleMouseDown,
			isResizing: false,
			setPanelCollapsed: vi.fn(),
			getPanelState: vi.fn(),
		};

		renderWithProviders(
			<SplitterContext.Provider value={mockContextValue}>
				<SplitterHandle panelIndex={0} />
			</SplitterContext.Provider>
		);

		const handle = screen.getByLabelText(RESIZE_PANEL_1_LABEL);
		fireEvent.click(handle);

		// Component should handle click events
		expect(handle).toBeInTheDocument();
	});
});

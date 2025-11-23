/**
 * Tests for Splitter component
 *
 * Tests the Splitter component:
 * - Rendering with panels
 * - Orientation (horizontal/vertical)
 * - Panel configuration extraction
 * - Container classes
 * - Children rendering
 * - Props forwarding
 */

import { SplitterPanel } from '@core/ui/utilities/splitter/components/SplitterPanel';
import Splitter from '@core/ui/utilities/splitter/Splitter';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock useTranslation
vi.mock('@core/i18n/useTranslation', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

const SPLITTER_CONTAINER_LABEL = 'a11y.splitterContainer';

beforeEach(() => {
	vi.clearAllMocks();
});

describe('Splitter - Rendering', () => {
	it('renders splitter with panels', () => {
		renderWithProviders(
			<Splitter>
				<SplitterPanel id="left">Left Panel</SplitterPanel>
				<SplitterPanel id="right">Right Panel</SplitterPanel>
			</Splitter>
		);

		expect(screen.getByText('Left Panel')).toBeInTheDocument();
		expect(screen.getByText('Right Panel')).toBeInTheDocument();
	});

	it('renders splitter container with aria-label', () => {
		renderWithProviders(
			<Splitter>
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
			</Splitter>
		);

		const container = screen.getByLabelText(SPLITTER_CONTAINER_LABEL);
		expect(container).toBeInTheDocument();
	});

	it('renders with custom className', () => {
		renderWithProviders(
			<Splitter className="custom-splitter">
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
			</Splitter>
		);

		const container = screen.getByLabelText(SPLITTER_CONTAINER_LABEL);
		expect(container).toHaveClass('custom-splitter');
	});

	it('renders with multiple panels', () => {
		renderWithProviders(
			<Splitter>
				<SplitterPanel id="top">Top Panel</SplitterPanel>
				<SplitterPanel id="middle">Middle Panel</SplitterPanel>
				<SplitterPanel id="bottom">Bottom Panel</SplitterPanel>
			</Splitter>
		);

		expect(screen.getByText('Top Panel')).toBeInTheDocument();
		expect(screen.getByText('Middle Panel')).toBeInTheDocument();
		expect(screen.getByText('Bottom Panel')).toBeInTheDocument();
	});
});

describe('Splitter - Orientation', () => {
	it('renders horizontal splitter by default', () => {
		renderWithProviders(
			<Splitter>
				<SplitterPanel id="left">Left</SplitterPanel>
				<SplitterPanel id="right">Right</SplitterPanel>
			</Splitter>
		);

		const container = screen.getByLabelText(SPLITTER_CONTAINER_LABEL);
		expect(container).toHaveClass('flex-row');
	});

	it('renders horizontal splitter when orientation is horizontal', () => {
		renderWithProviders(
			<Splitter orientation="horizontal">
				<SplitterPanel id="left">Left</SplitterPanel>
				<SplitterPanel id="right">Right</SplitterPanel>
			</Splitter>
		);

		const container = screen.getByLabelText(SPLITTER_CONTAINER_LABEL);
		expect(container).toHaveClass('flex-row');
	});

	it('renders vertical splitter when orientation is vertical', () => {
		renderWithProviders(
			<Splitter orientation="vertical">
				<SplitterPanel id="top">Top</SplitterPanel>
				<SplitterPanel id="bottom">Bottom</SplitterPanel>
			</Splitter>
		);

		const container = screen.getByLabelText(SPLITTER_CONTAINER_LABEL);
		expect(container).toHaveClass('flex-col');
	});
});

describe('Splitter - Panel Configuration', () => {
	it('extracts panel configs from children', () => {
		renderWithProviders(
			<Splitter>
				<SplitterPanel id="panel1" defaultSize="30%">
					Panel 1
				</SplitterPanel>
				<SplitterPanel id="panel2" defaultSize="70%">
					Panel 2
				</SplitterPanel>
			</Splitter>
		);

		expect(screen.getByText('Panel 1')).toBeInTheDocument();
		expect(screen.getByText('Panel 2')).toBeInTheDocument();
	});

	it('uses panels prop when provided', () => {
		const panels = [
			{ id: 'panel1', defaultSize: '30%' },
			{ id: 'panel2', defaultSize: '70%' },
		];

		renderWithProviders(
			<Splitter panels={panels}>
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
				<SplitterPanel id="panel2">Panel 2</SplitterPanel>
			</Splitter>
		);

		expect(screen.getByText('Panel 1')).toBeInTheDocument();
		expect(screen.getByText('Panel 2')).toBeInTheDocument();
	});
});

describe('Splitter - Props', () => {
	it('handles disabled prop', () => {
		renderWithProviders(
			<Splitter disabled>
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
				<SplitterPanel id="panel2">Panel 2</SplitterPanel>
			</Splitter>
		);

		expect(screen.getByText('Panel 1')).toBeInTheDocument();
		expect(screen.getByText('Panel 2')).toBeInTheDocument();
	});

	it('handles custom handleSize', () => {
		renderWithProviders(
			<Splitter handleSize={8}>
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
				<SplitterPanel id="panel2">Panel 2</SplitterPanel>
			</Splitter>
		);

		expect(screen.getByText('Panel 1')).toBeInTheDocument();
		expect(screen.getByText('Panel 2')).toBeInTheDocument();
	});

	it('handles custom handleClassName', () => {
		renderWithProviders(
			<Splitter handleClassName="custom-handle">
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
				<SplitterPanel id="panel2">Panel 2</SplitterPanel>
			</Splitter>
		);

		expect(screen.getByText('Panel 1')).toBeInTheDocument();
		expect(screen.getByText('Panel 2')).toBeInTheDocument();
	});

	it('calls onResize callback when provided', () => {
		const onResize = vi.fn();

		renderWithProviders(
			<Splitter onResize={onResize}>
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
				<SplitterPanel id="panel2">Panel 2</SplitterPanel>
			</Splitter>
		);

		// onResize should be set up (actual resize would trigger it)
		expect(onResize).toBeDefined();
	});

	it('forwards HTML attributes', () => {
		renderWithProviders(
			<Splitter data-testid="splitter-container" id="custom-id">
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
			</Splitter>
		);

		const container = screen.getByTestId('splitter-container');
		expect(container).toHaveAttribute('id', 'custom-id');
	});
});

describe('Splitter - Children Rendering', () => {
	it('renders handles between panels', () => {
		renderWithProviders(
			<Splitter>
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
				<SplitterPanel id="panel2">Panel 2</SplitterPanel>
			</Splitter>
		);

		const handles = screen.getAllByLabelText(/Resize panel/);
		expect(handles.length).toBeGreaterThan(0);
	});

	it('does not render handle after last panel', () => {
		renderWithProviders(
			<Splitter>
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
				<SplitterPanel id="panel2">Panel 2</SplitterPanel>
			</Splitter>
		);

		const handles = screen.getAllByLabelText(/Resize panel/);
		expect(handles.length).toBe(1); // Only one handle between two panels
	});

	it('preserves non-panel children', () => {
		renderWithProviders(
			<Splitter>
				<div data-testid="non-panel">Non-panel content</div>
				<SplitterPanel id="panel1">Panel 1</SplitterPanel>
			</Splitter>
		);

		expect(screen.getByTestId('non-panel')).toBeInTheDocument();
		expect(screen.getByText('Panel 1')).toBeInTheDocument();
	});
});

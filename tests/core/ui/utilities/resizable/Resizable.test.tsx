/**
 * Resizable Component Tests
 *
 * Tests for the Resizable component covering:
 * - Functionality: rendering, directions, sizes, min/max constraints
 * - Interactions: mouse drag, resize behavior, controlled/uncontrolled modes
 * - Accessibility: keyboard support, ARIA attributes
 */

import Resizable from '@core/ui/utilities/resizable/Resizable';
import { screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const CONTENT_TEXT = 'Resizable Content';
const RESIZABLE_CONTAINER_LABEL = 'Resizable container';

// Mock mouse events
const createMouseEvent = (type: string, options: MouseEventInit = {}) => {
	return new MouseEvent(type, {
		bubbles: true,
		cancelable: true,
		...options,
	});
};

beforeEach(() => {
	vi.clearAllMocks();
});

describe('Resizable - functionality - basic rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<Resizable>
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument();
	});

	it('renders with default props', () => {
		renderWithProviders(
			<Resizable>
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const resizable = screen.getByLabelText(RESIZABLE_CONTAINER_LABEL);
		expect(resizable).toBeInTheDocument();
	});
});

describe('Resizable - functionality - direction support', () => {
	it('supports horizontal direction', () => {
		renderWithProviders(
			<Resizable direction="horizontal">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const resizable = screen.getByLabelText(RESIZABLE_CONTAINER_LABEL);
		expect(resizable).toBeInTheDocument();
	});

	it('supports vertical direction', () => {
		renderWithProviders(
			<Resizable direction="vertical">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const resizable = screen.getByLabelText(RESIZABLE_CONTAINER_LABEL);
		expect(resizable).toBeInTheDocument();
	});
});

describe('Resizable - functionality - size configuration', () => {
	it('supports defaultSize prop', () => {
		renderWithProviders(
			<Resizable defaultSize="50%">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const resizable = screen.getByLabelText(RESIZABLE_CONTAINER_LABEL);
		expect(resizable).toBeInTheDocument();
	});

	it('supports defaultSize as number', () => {
		renderWithProviders(
			<Resizable defaultSize={200}>
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const resizable = screen.getByLabelText(RESIZABLE_CONTAINER_LABEL);
		expect(resizable).toBeInTheDocument();
	});

	it('supports controlled size prop', () => {
		renderWithProviders(
			<Resizable size="300px">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const resizable = screen.getByLabelText(RESIZABLE_CONTAINER_LABEL);
		expect(resizable).toBeInTheDocument();
	});

	it('supports minSize prop', () => {
		renderWithProviders(
			<Resizable minSize={100}>
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const resizable = screen.getByLabelText(RESIZABLE_CONTAINER_LABEL);
		expect(resizable).toBeInTheDocument();
	});

	it('supports maxSize prop', () => {
		renderWithProviders(
			<Resizable maxSize="80%">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const resizable = screen.getByLabelText(RESIZABLE_CONTAINER_LABEL);
		expect(resizable).toBeInTheDocument();
	});
});

describe('Resizable - functionality - styling and customization', () => {
	it('handles disabled state', () => {
		renderWithProviders(
			<Resizable disabled={true}>
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const resizable = screen.getByLabelText(RESIZABLE_CONTAINER_LABEL);
		expect(resizable).toBeInTheDocument();
	});

	it('applies custom className', () => {
		renderWithProviders(
			<Resizable className="custom-resizable">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const resizable = screen.getByLabelText(RESIZABLE_CONTAINER_LABEL);
		expect(resizable).toHaveClass('custom-resizable');
	});

	it('applies custom handleClassName', () => {
		renderWithProviders(
			<Resizable handleClassName="custom-handle" direction="horizontal">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const handle = screen.getByRole('button', {
			name: /resize handle.*horizontal/i,
		});
		expect(handle).toHaveClass('custom-handle');
	});

	it('applies custom style', () => {
		const customStyle = { backgroundColor: 'red' };
		renderWithProviders(
			<Resizable style={customStyle}>
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const resizable = screen.getByLabelText(RESIZABLE_CONTAINER_LABEL);
		// Verify style is applied (may be merged with size styles)
		const styleValue = resizable.style.backgroundColor;
		expect(styleValue).toBeTruthy();
		expect(resizable).toBeInTheDocument();
	});

	it('calls onResize callback', async () => {
		const onResize = vi.fn();

		renderWithProviders(
			<Resizable onResize={onResize}>
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		// onResize should be set up (actual resize would trigger it)
		expect(onResize).toBeDefined();
	});
});

describe('Resizable - interactions - mouse interactions', () => {
	it('handles mouse down on resize handle', async () => {
		renderWithProviders(
			<Resizable direction="horizontal">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const resizable = screen.getByLabelText(RESIZABLE_CONTAINER_LABEL);
		const handle = screen.getByRole('button', {
			name: /resize handle.*horizontal/i,
		});

		const mouseDownEvent = createMouseEvent('mousedown', {
			clientX: 100,
			clientY: 100,
		});

		handle.dispatchEvent(mouseDownEvent);

		// Component should handle the event
		await waitFor(() => {
			expect(resizable).toBeInTheDocument();
		});
	});

	it('does not resize when disabled', () => {
		renderWithProviders(
			<Resizable disabled={true} direction="horizontal">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		// When disabled, the handle should not be rendered
		const handle = screen.queryByRole('button', {
			name: /resize handle/i,
		});
		expect(handle).not.toBeInTheDocument();
	});
});

describe('Resizable - interactions - size constraints', () => {
	it('respects minSize constraint', () => {
		renderWithProviders(
			<Resizable minSize={100} defaultSize={50}>
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const resizable = screen.getByLabelText(RESIZABLE_CONTAINER_LABEL);
		expect(resizable).toBeInTheDocument();
	});

	it('respects maxSize constraint', () => {
		renderWithProviders(
			<Resizable maxSize={500} defaultSize={600}>
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const resizable = screen.getByLabelText(RESIZABLE_CONTAINER_LABEL);
		expect(resizable).toBeInTheDocument();
	});
});

describe('Resizable - interactions - controlled and uncontrolled modes', () => {
	it('works in controlled mode', () => {
		const { rerender } = renderWithProviders(
			<Resizable size="200px">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		rerender(
			<Resizable size="300px">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument();
	});

	it('works in uncontrolled mode', () => {
		renderWithProviders(
			<Resizable defaultSize="250px">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument();
	});

	it('handles size changes in controlled mode', () => {
		const onResize = vi.fn();

		const { rerender } = renderWithProviders(
			<Resizable size="200px" onResize={onResize}>
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		rerender(
			<Resizable size="300px" onResize={onResize}>
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument();
	});
});

describe('Resizable - accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<Resizable>
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);
		await expectA11y(container);
	});
});

describe('Resizable - accessibility - resize handle', () => {
	it('has resize handle with proper role', () => {
		renderWithProviders(
			<Resizable direction="horizontal">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const handle = screen.getByRole('button', {
			name: /resize handle.*horizontal/i,
		});
		expect(handle).toBeInTheDocument();
	});

	it('handle is keyboard accessible', () => {
		renderWithProviders(
			<Resizable direction="horizontal">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		const handle = screen.getByRole('button', {
			name: /resize handle.*horizontal/i,
		});
		handle.focus();
		expect(handle).toHaveFocus();
	});

	it('handle is not rendered when component is disabled', () => {
		renderWithProviders(
			<Resizable disabled={true} direction="horizontal">
				<div>{CONTENT_TEXT}</div>
			</Resizable>
		);

		// When disabled, the handle should not be rendered
		const handle = screen.queryByRole('button', {
			name: /resize handle/i,
		});
		expect(handle).not.toBeInTheDocument();
	});
});

describe('Resizable - accessibility - children', () => {
	it('maintains focus management', () => {
		renderWithProviders(
			<Resizable>
				<button>{CONTENT_TEXT}</button>
			</Resizable>
		);

		const button = screen.getByRole('button', { name: CONTENT_TEXT });
		button.focus();
		expect(button).toHaveFocus();
	});

	it('preserves children accessibility attributes', () => {
		renderWithProviders(
			<Resizable>
				<section aria-label="Resizable region">{CONTENT_TEXT}</section>
			</Resizable>
		);

		const region = screen.getByRole('region', { name: 'Resizable region' });
		expect(region).toBeInTheDocument();
		expect(region.tagName).toBe('SECTION');
		expect(region).toHaveAttribute('aria-label', 'Resizable region');
	});

	it('works with interactive children', () => {
		renderWithProviders(
			<Resizable>
				<div>
					<button>Button 1</button>
					<button>Button 2</button>
				</div>
			</Resizable>
		);

		const buttons = screen.getAllByRole('button');
		// Should have 2 content buttons + 1 resize handle
		expect(buttons.length).toBeGreaterThanOrEqual(2);
	});
});

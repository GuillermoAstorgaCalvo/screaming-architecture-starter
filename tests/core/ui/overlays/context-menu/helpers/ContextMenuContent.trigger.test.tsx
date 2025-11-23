/**
 * ContextMenuContent.trigger Tests
 *
 * Tests for the createTriggerNode function including:
 * - Clones trigger element with context menu handler
 * - Prevents default context menu behavior
 * - Calls original onContextMenu if provided
 * - Sets ARIA attributes
 * - Handles non-object triggers
 */

import { createTriggerNode } from '@core/ui/overlays/context-menu/helpers/ContextMenuContent.trigger';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('createTriggerNode', () => {
	it('returns trigger as-is when not an object', () => {
		const trigger = 'string trigger';
		const result = createTriggerNode({
			trigger: trigger as never,
			open: false,
			menuId: 'test-menu',
			setOpen: vi.fn(),
		});

		expect(result).toBe(trigger);
	});

	it('clones trigger element with context menu handler', () => {
		const setOpen = vi.fn();
		const trigger = <div data-testid="trigger">Right-click me</div>;
		const result = createTriggerNode({
			trigger,
			open: false,
			menuId: 'test-menu',
			setOpen,
		});

		renderWithProviders(<>{result}</>);

		const triggerElement = screen.getByTestId('trigger');
		fireEvent.contextMenu(triggerElement);

		expect(setOpen).toHaveBeenCalledWith(true);
	});

	it('prevents default context menu behavior', () => {
		const setOpen = vi.fn();
		const trigger = <div data-testid="trigger">Right-click me</div>;
		const result = createTriggerNode({
			trigger,
			open: false,
			menuId: 'test-menu',
			setOpen,
		});

		renderWithProviders(<>{result}</>);

		const triggerElement = screen.getByTestId('trigger');
		const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
		const preventDefault = vi.spyOn(event, 'preventDefault');

		fireEvent(triggerElement, event);

		expect(preventDefault).toHaveBeenCalled();
	});

	it('stops event propagation', () => {
		const setOpen = vi.fn();
		const trigger = <div data-testid="trigger">Right-click me</div>;
		const result = createTriggerNode({
			trigger,
			open: false,
			menuId: 'test-menu',
			setOpen,
		});

		renderWithProviders(<>{result}</>);

		const triggerElement = screen.getByTestId('trigger');
		const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
		const stopPropagation = vi.spyOn(event, 'stopPropagation');

		fireEvent(triggerElement, event);

		expect(stopPropagation).toHaveBeenCalled();
	});

	it('calls original onContextMenu if provided', () => {
		const originalHandler = vi.fn();
		const setOpen = vi.fn();
		const trigger = (
			<div data-testid="trigger" onContextMenu={originalHandler}>
				Right-click me
			</div>
		);
		const result = createTriggerNode({
			trigger,
			open: false,
			menuId: 'test-menu',
			setOpen,
		});

		renderWithProviders(<>{result}</>);

		const triggerElement = screen.getByTestId('trigger');
		fireEvent.contextMenu(triggerElement);

		expect(originalHandler).toHaveBeenCalled();
		expect(setOpen).toHaveBeenCalledWith(true);
	});

	it('sets aria-haspopup attribute', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		const result = createTriggerNode({
			trigger,
			open: false,
			menuId: 'test-menu',
			setOpen: vi.fn(),
		});

		renderWithProviders(<>{result}</>);

		const triggerElement = screen.getByTestId('trigger');
		expect(triggerElement).toHaveAttribute('aria-haspopup', 'menu');
	});

	it('sets aria-expanded attribute based on open state', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		const resultOpen = createTriggerNode({
			trigger,
			open: true,
			menuId: 'test-menu',
			setOpen: vi.fn(),
		});

		const { unmount: unmountOpen } = renderWithProviders(resultOpen);

		const triggerElementOpen = screen.getByTestId('trigger');
		expect(triggerElementOpen).toHaveAttribute('aria-expanded', 'true');
		unmountOpen();

		const resultClosed = createTriggerNode({
			trigger,
			open: false,
			menuId: 'test-menu',
			setOpen: vi.fn(),
		});

		renderWithProviders(resultClosed);

		const triggerElementClosed = screen.getByTestId('trigger');
		expect(triggerElementClosed).toHaveAttribute('aria-expanded', 'false');
	});

	it('sets aria-controls when open', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		const result = createTriggerNode({
			trigger,
			open: true,
			menuId: 'test-menu',
			setOpen: vi.fn(),
		});

		renderWithProviders(<>{result}</>);

		const triggerElement = screen.getByTestId('trigger');
		expect(triggerElement).toHaveAttribute('aria-controls', 'test-menu');
	});

	it('does not set aria-controls when closed', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		const result = createTriggerNode({
			trigger,
			open: false,
			menuId: 'test-menu',
			setOpen: vi.fn(),
		});

		renderWithProviders(<>{result}</>);

		const triggerElement = screen.getByTestId('trigger');
		expect(triggerElement).not.toHaveAttribute('aria-controls');
	});

	it('preserves other trigger props', () => {
		const trigger = (
			<div data-testid="trigger" className="custom-class" data-custom="value">
				Right-click me
			</div>
		);
		const result = createTriggerNode({
			trigger,
			open: false,
			menuId: 'test-menu',
			setOpen: vi.fn(),
		});

		renderWithProviders(<>{result}</>);

		const triggerElement = screen.getByTestId('trigger');
		expect(triggerElement).toHaveClass('custom-class');
		expect(triggerElement).toHaveAttribute('data-custom', 'value');
	});
});

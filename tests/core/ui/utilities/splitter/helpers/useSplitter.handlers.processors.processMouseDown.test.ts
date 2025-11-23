/**
 * Tests for processMouseDown processor function
 */

import { processMouseDown } from '@core/ui/utilities/splitter/helpers/useSplitter.handlers.processors';
import type { PanelRef } from '@core/ui/utilities/splitter/types/useSplitter.handlers.types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
	createMouseDownContext,
	createMouseEvent,
	createPanel,
	mockGetDimension,
	mockIsHorizontal,
} from './useSplitter.handlers.processors.test-helpers';

vi.mock('@core/ui/utilities/splitter/helpers/useSplitter.handlers.calculations');
vi.mock('@core/ui/utilities/splitter/helpers/useSplitter.helpers', () => ({
	getDimension: (...args: unknown[]) =>
		(mockGetDimension as (...args: unknown[]) => unknown)(...args),
	isHorizontal: (...args: unknown[]) =>
		(mockIsHorizontal as (...args: unknown[]) => unknown)(...args),
}));

beforeEach(() => {
	vi.clearAllMocks();
	mockIsHorizontal.mockReturnValue(true);
	mockGetDimension.mockImplementation((orientation, element) => {
		return orientation === 'horizontal' ? element.offsetWidth : element.offsetHeight;
	});
});

function describeValidResizeStartConditions(): void {
	describe('Valid resize start conditions', () => {
		it('starts resize when conditions are valid', () => {
			const panel1 = createPanel('panel1', 'width', 200);
			const panel2 = createPanel('panel2', 'width', 300);
			const context = createMouseDownContext([panel1, panel2]);
			const event = createMouseEvent(100, 50);
			mockIsHorizontal.mockReturnValue(true);

			processMouseDown(event, 0, context);

			expect(event.preventDefault).toHaveBeenCalled();
			expect(event.stopPropagation).toHaveBeenCalled();
			expect(context.setResizeState).toHaveBeenCalledWith({
				isResizing: true,
				panelIndex: 0,
				startPos: 100,
				startSizes: [200, 300],
			});
		});

		it('starts resize with vertical orientation', () => {
			const panel1 = createPanel('panel1', 'height', 200);
			const panel2 = createPanel('panel2', 'height', 300);
			const context = createMouseDownContext([panel1, panel2], { orientation: 'vertical' });
			const event = createMouseEvent(50, 100);
			mockIsHorizontal.mockReturnValue(false);

			processMouseDown(event, 0, context);

			expect(context.setResizeState).toHaveBeenCalledWith({
				isResizing: true,
				panelIndex: 0,
				startPos: 100,
				startSizes: [200, 300],
			});
		});
	});
}

function describeStartPositionCapture(): void {
	describe('Start position capture', () => {
		it('captures start position correctly for horizontal orientation', () => {
			const panel1 = createPanel('panel1', 'width', 200);
			const panel2 = createPanel('panel2', 'width', 300);
			const context = createMouseDownContext([panel1, panel2]);
			const event = createMouseEvent(250, 100);
			mockIsHorizontal.mockReturnValue(true);

			processMouseDown(event, 0, context);

			expect(context.setResizeState).toHaveBeenCalledWith(
				expect.objectContaining({
					startPos: 250,
				})
			);
		});

		it('captures start position correctly for vertical orientation', () => {
			const panel1 = createPanel('panel1', 'height', 200);
			const panel2 = createPanel('panel2', 'height', 300);
			const context = createMouseDownContext([panel1, panel2], { orientation: 'vertical' });
			const event = createMouseEvent(100, 250);
			mockIsHorizontal.mockReturnValue(false);

			processMouseDown(event, 0, context);

			expect(context.setResizeState).toHaveBeenCalledWith(
				expect.objectContaining({
					startPos: 250,
				})
			);
		});

		it('captures all panel start sizes', () => {
			const panel1 = createPanel('panel1', 'width', 200);
			const panel2 = createPanel('panel2', 'width', 300);
			const panel3 = createPanel('panel3', 'width', 100);
			const context = createMouseDownContext([panel1, panel2, panel3]);
			const event = createMouseEvent(100, 50);
			mockIsHorizontal.mockReturnValue(true);

			processMouseDown(event, 0, context);

			expect(context.setResizeState).toHaveBeenCalledWith(
				expect.objectContaining({
					startSizes: [200, 300, 100],
				})
			);
		});
	});
}

function describeDisabledAndInvalidIndices(): void {
	describe('Disabled and invalid indices', () => {
		it('does not start resize when disabled', () => {
			const panel1 = createPanel('panel1', 'width', 200);
			const panel2 = createPanel('panel2', 'width', 300);
			const context = createMouseDownContext([panel1, panel2], { disabled: true });
			const event = createMouseEvent(100, 50);

			processMouseDown(event, 0, context);

			expect(event.preventDefault).not.toHaveBeenCalled();
			expect(event.stopPropagation).not.toHaveBeenCalled();
			expect(context.setResizeState).not.toHaveBeenCalled();
		});

		it('does not start resize when panelIndex is negative', () => {
			const panel1 = createPanel('panel1', 'width', 200);
			const panel2 = createPanel('panel2', 'width', 300);
			const context = createMouseDownContext([panel1, panel2]);
			const event = createMouseEvent(100, 50);

			processMouseDown(event, -1, context);

			expect(context.setResizeState).not.toHaveBeenCalled();
		});

		it('does not start resize when panelIndex is last panel', () => {
			const panel1 = createPanel('panel1', 'width', 200);
			const panel2 = createPanel('panel2', 'width', 300);
			const context = createMouseDownContext([panel1, panel2]);
			const event = createMouseEvent(100, 50);

			processMouseDown(event, 1, context);

			expect(context.setResizeState).not.toHaveBeenCalled();
		});

		it('does not start resize when panelIndex is out of bounds', () => {
			const panel1 = createPanel('panel1', 'width', 200);
			const panel2 = createPanel('panel2', 'width', 300);
			const context = createMouseDownContext([panel1, panel2]);
			const event = createMouseEvent(100, 50);

			processMouseDown(event, 5, context);

			expect(context.setResizeState).not.toHaveBeenCalled();
		});
	});
}

function describeMissingPanels(): void {
	describe('Missing panels', () => {
		it('does not start resize when panel is missing', () => {
			const panel1 = createPanel('panel1', 'width', 200);
			const context = createMouseDownContext([panel1, null as unknown as PanelRef]);
			const event = createMouseEvent(100, 50);

			processMouseDown(event, 0, context);

			expect(context.setResizeState).not.toHaveBeenCalled();
		});

		it('does not start resize when nextPanel is missing', () => {
			const panel1 = createPanel('panel1', 'width', 200);
			const context = createMouseDownContext([panel1]);
			const event = createMouseEvent(100, 50);

			processMouseDown(event, 0, context);

			expect(context.setResizeState).not.toHaveBeenCalled();
		});
	});
}

function describeInvalidConditions(): void {
	describe('Invalid conditions', () => {
		describeDisabledAndInvalidIndices();
		describeMissingPanels();
	});
}

describe('processMouseDown', () => {
	describeValidResizeStartConditions();
	describeStartPositionCapture();
	describeInvalidConditions();
});

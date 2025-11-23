/**
 * Tests for processMouseMove processor function
 */

import { processMouseMove } from '@core/ui/utilities/splitter/helpers/useSplitter.handlers.processors';
import type { PanelRef } from '@core/ui/utilities/splitter/types/useSplitter.handlers.types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
	createMouseMoveContext,
	createMouseMoveEvent,
	createPanel,
	createResizeState,
} from './useSplitter.handlers.processors.test-helpers';

const mockCalculatePanelSizes = vi.hoisted(() => vi.fn());
const mockGetPanelConstraints = vi.hoisted(() => vi.fn());
const mockCalculateNewSize = vi.hoisted(() => vi.fn());
const mockGetDimension = vi.hoisted(() => vi.fn());
const mockSetDimension = vi.hoisted(() => vi.fn());
const mockIsHorizontal = vi.hoisted(() => vi.fn());

vi.mock('@core/ui/utilities/splitter/helpers/useSplitter.handlers.calculations', () => ({
	calculatePanelSizes: mockCalculatePanelSizes,
	getPanelConstraints: mockGetPanelConstraints,
}));

vi.mock('@core/ui/utilities/splitter/helpers/useSplitter.helpers', () => ({
	calculateNewSize: mockCalculateNewSize,
	getDimension: mockGetDimension,
	setDimension: mockSetDimension,
	isHorizontal: mockIsHorizontal,
}));

function setupMockConstraints(
	panelMinSize = 0,
	panelMaxSize?: number,
	nextPanelMinSize = 0,
	nextPanelMaxSize?: number
): void {
	mockGetPanelConstraints.mockReturnValue({
		panelMinSize,
		panelMaxSize,
		nextPanelMinSize,
		nextPanelMaxSize,
	});
}

beforeEach(() => {
	vi.clearAllMocks();
	mockIsHorizontal.mockReturnValue(true);
	mockGetDimension.mockImplementation((orientation, element) => {
		return orientation === 'horizontal' ? element.offsetWidth : element.offsetHeight;
	});
});

describe('processMouseMove - Basic resize calculations', () => {
	it('calculates and updates panel sizes during resize', () => {
		const panel1 = createPanel('panel1', 'width', 200);
		const panel2 = createPanel('panel2', 'width', 300);
		const resizeState = createResizeState(0, 100, [200, 300]);
		const context = createMouseMoveContext([panel1, panel2], resizeState);

		const event = createMouseMoveEvent(150, 50);
		mockCalculateNewSize.mockReturnValue(250);
		setupMockConstraints();
		mockCalculatePanelSizes.mockReturnValue({
			newPanelSize: 250,
			newNextPanelSize: 250,
		});

		processMouseMove(event, context);

		expect(mockCalculateNewSize).toHaveBeenCalledWith({
			event,
			orientation: 'horizontal',
			startPos: 100,
			startSize: 200,
		});
		expect(mockGetPanelConstraints).toHaveBeenCalled();
		expect(mockCalculatePanelSizes).toHaveBeenCalled();
		expect(mockSetDimension).toHaveBeenCalledWith('horizontal', panel1.element, 250);
		expect(mockSetDimension).toHaveBeenCalledWith('horizontal', panel2.element, 250);
		expect(context.setPanelSize).toHaveBeenCalledWith('panel1', 250);
		expect(context.setPanelSize).toHaveBeenCalledWith('panel2', 250);
	});

	it('handles resize with vertical orientation', () => {
		const panel1 = createPanel('panel1', 'height', 200);
		const panel2 = createPanel('panel2', 'height', 300);
		const resizeState = createResizeState(0, 100, [200, 300]);
		const context = createMouseMoveContext([panel1, panel2], resizeState, {
			orientation: 'vertical',
		});

		const event = createMouseMoveEvent(50, 150);
		mockCalculateNewSize.mockReturnValue(250);
		setupMockConstraints();
		mockCalculatePanelSizes.mockReturnValue({
			newPanelSize: 250,
			newNextPanelSize: 250,
		});

		processMouseMove(event, context);

		expect(mockCalculateNewSize).toHaveBeenCalledWith({
			event,
			orientation: 'vertical',
			startPos: 100,
			startSize: 200,
		});
		expect(mockSetDimension).toHaveBeenCalledWith('vertical', panel1.element, 250);
		expect(mockSetDimension).toHaveBeenCalledWith('vertical', panel2.element, 250);
	});
});

describe('processMouseMove - Delta calculations', () => {
	it('calculates delta correctly from start size', () => {
		const panel1 = createPanel('panel1', 'width', 200);
		const panel2 = createPanel('panel2', 'width', 300);
		const resizeState = createResizeState(0, 100, [200, 300]);
		const context = createMouseMoveContext([panel1, panel2], resizeState);

		const event = createMouseMoveEvent(150, 50);
		mockCalculateNewSize.mockReturnValue(250);
		setupMockConstraints();
		mockCalculatePanelSizes.mockReturnValue({
			newPanelSize: 250,
			newNextPanelSize: 250,
		});

		processMouseMove(event, context);

		expect(mockCalculatePanelSizes).toHaveBeenCalledWith(
			50,
			{ panel: panel1, nextPanel: panel2, orientation: 'horizontal' },
			expect.any(Object)
		);
	});
});

describe('processMouseMove - Resize constraints', () => {
	it('applies min size constraints', () => {
		const panel1 = createPanel('panel1', 'width', 200);
		const panel2 = createPanel('panel2', 'width', 300);
		const resizeState = createResizeState(0, 100, [200, 300]);
		const context = createMouseMoveContext([panel1, panel2], resizeState, {
			sizeGetters: {
				getPanelMinSize: id => (id === 'panel1' ? 150 : 200),
				getPanelMaxSize: () => undefined,
			},
		});

		const event = createMouseMoveEvent(50, 50);
		mockCalculateNewSize.mockReturnValue(100);
		setupMockConstraints(150, undefined, 200);
		mockCalculatePanelSizes.mockReturnValue({
			newPanelSize: 150,
			newNextPanelSize: 350,
		});

		processMouseMove(event, context);

		expect(mockGetPanelConstraints).toHaveBeenCalledWith(panel1, panel2, context.sizeGetters);
		expect(mockSetDimension).toHaveBeenCalledWith('horizontal', panel1.element, 150);
		expect(context.setPanelSize).toHaveBeenCalledWith('panel1', 150);
	});

	it('applies max size constraints', () => {
		const panel1 = createPanel('panel1', 'width', 200);
		const panel2 = createPanel('panel2', 'width', 300);
		const resizeState = createResizeState(0, 100, [200, 300]);
		const context = createMouseMoveContext([panel1, panel2], resizeState, {
			sizeGetters: {
				getPanelMinSize: () => 0,
				getPanelMaxSize: id => (id === 'panel1' ? 250 : undefined),
			},
		});

		const event = createMouseMoveEvent(200, 50);
		mockCalculateNewSize.mockReturnValue(400);
		setupMockConstraints(0, 250, 0);
		mockCalculatePanelSizes.mockReturnValue({
			newPanelSize: 250,
			newNextPanelSize: 250,
		});

		processMouseMove(event, context);

		expect(mockSetDimension).toHaveBeenCalledWith('horizontal', panel1.element, 250);
		expect(context.setPanelSize).toHaveBeenCalledWith('panel1', 250);
	});
});

describe('processMouseMove - Multiple panel constraints', () => {
	it('applies constraints to both panels', () => {
		const panel1 = createPanel('panel1', 'width', 200);
		const panel2 = createPanel('panel2', 'width', 300);
		const resizeState = createResizeState(0, 100, [200, 300]);
		const context = createMouseMoveContext([panel1, panel2], resizeState, {
			sizeGetters: {
				getPanelMinSize: id => (id === 'panel1' ? 150 : 200),
				getPanelMaxSize: id => (id === 'panel1' ? 250 : 400),
			},
		});

		const event = createMouseMoveEvent(150, 50);
		mockCalculateNewSize.mockReturnValue(250);
		setupMockConstraints(150, 250, 200, 400);
		mockCalculatePanelSizes.mockReturnValue({
			newPanelSize: 250,
			newNextPanelSize: 250,
		});

		processMouseMove(event, context);

		expect(mockGetPanelConstraints).toHaveBeenCalledWith(panel1, panel2, context.sizeGetters);
		expect(mockCalculatePanelSizes).toHaveBeenCalledWith(
			expect.any(Number),
			{ panel: panel1, nextPanel: panel2, orientation: 'horizontal' },
			expect.objectContaining({
				panelMinSize: 150,
				panelMaxSize: 250,
				nextPanelMinSize: 200,
				nextPanelMaxSize: 400,
			})
		);
	});
});

describe('processMouseMove - onResize callback', () => {
	it('calls onResize callback for both panels', () => {
		const panel1 = createPanel('panel1', 'width', 200);
		const panel2 = createPanel('panel2', 'width', 300);
		const resizeState = createResizeState(0, 100, [200, 300]);
		const onResize = vi.fn();
		const context = createMouseMoveContext([panel1, panel2], resizeState, { onResize });

		const event = createMouseMoveEvent(150, 50);
		mockCalculateNewSize.mockReturnValue(250);
		setupMockConstraints();
		mockCalculatePanelSizes.mockReturnValue({
			newPanelSize: 250,
			newNextPanelSize: 250,
		});

		processMouseMove(event, context);

		expect(onResize).toHaveBeenCalledWith('panel1', 250);
		expect(onResize).toHaveBeenCalledWith('panel2', 250);
		expect(onResize).toHaveBeenCalledTimes(2);
	});

	it('does not call onResize when callback is undefined', () => {
		const panel1 = createPanel('panel1', 'width', 200);
		const panel2 = createPanel('panel2', 'width', 300);
		const resizeState = createResizeState(0, 100, [200, 300]);
		const context = createMouseMoveContext([panel1, panel2], resizeState);

		const event = createMouseMoveEvent(150, 50);
		mockCalculateNewSize.mockReturnValue(250);
		setupMockConstraints();
		mockCalculatePanelSizes.mockReturnValue({
			newPanelSize: 250,
			newNextPanelSize: 250,
		});

		processMouseMove(event, context);

		expect(mockSetDimension).toHaveBeenCalled();
		expect(context.setPanelSize).toHaveBeenCalled();
	});
});

describe('processMouseMove - Early return conditions', () => {
	it('returns early when not resizing', () => {
		const panel1 = createPanel('panel1', 'width', 200);
		const panel2 = createPanel('panel2', 'width', 300);
		const resizeState = createResizeState(0, 100, [200, 300], false);
		const context = createMouseMoveContext([panel1, panel2], resizeState);
		const event = createMouseMoveEvent(150, 50);

		processMouseMove(event, context);

		expect(mockCalculateNewSize).not.toHaveBeenCalled();
		expect(mockSetDimension).not.toHaveBeenCalled();
		expect(context.setPanelSize).not.toHaveBeenCalled();
	});

	it('returns early when panelIndex is negative', () => {
		const panel1 = createPanel('panel1', 'width', 200);
		const panel2 = createPanel('panel2', 'width', 300);
		const resizeState = createResizeState(-1, 100, [200, 300]);
		const context = createMouseMoveContext([panel1, panel2], resizeState);
		const event = createMouseMoveEvent(150, 50);

		processMouseMove(event, context);

		expect(mockCalculateNewSize).not.toHaveBeenCalled();
		expect(mockSetDimension).not.toHaveBeenCalled();
	});
});

describe('processMouseMove - Missing panels', () => {
	it('returns early when panel is missing', () => {
		const panel2 = createPanel('panel2', 'width', 300);
		const resizeState = createResizeState(0, 100, [200, 300]);
		const context = createMouseMoveContext([null as unknown as PanelRef, panel2], resizeState);
		const event = createMouseMoveEvent(150, 50);

		processMouseMove(event, context);

		expect(mockCalculateNewSize).not.toHaveBeenCalled();
		expect(mockSetDimension).not.toHaveBeenCalled();
	});

	it('returns early when nextPanel is missing', () => {
		const panel1 = createPanel('panel1', 'width', 200);
		const resizeState = createResizeState(0, 100, [200]);
		const context = createMouseMoveContext([panel1], resizeState);
		const event = createMouseMoveEvent(150, 50);

		processMouseMove(event, context);

		expect(mockCalculateNewSize).not.toHaveBeenCalled();
		expect(mockSetDimension).not.toHaveBeenCalled();
	});
});

describe('processMouseMove - Edge cases', () => {
	it('handles missing startSize gracefully', () => {
		const panel1 = createPanel('panel1', 'width', 200);
		const panel2 = createPanel('panel2', 'width', 300);
		const resizeState = createResizeState(0, 100, []);
		const context = createMouseMoveContext([panel1, panel2], resizeState);

		const event = createMouseMoveEvent(150, 50);
		mockCalculateNewSize.mockReturnValue(50);
		setupMockConstraints();
		mockCalculatePanelSizes.mockReturnValue({
			newPanelSize: 50,
			newNextPanelSize: 450,
		});

		processMouseMove(event, context);

		expect(mockCalculateNewSize).toHaveBeenCalledWith({
			event,
			orientation: 'horizontal',
			startPos: 100,
			startSize: 0,
		});
	});
});

describe('processMouseMove - Multiple panels', () => {
	it('handles resize between middle panels', () => {
		const panel1 = createPanel('panel1', 'width', 200);
		const panel2 = createPanel('panel2', 'width', 300);
		const panel3 = createPanel('panel3', 'width', 100);
		const resizeState = createResizeState(1, 100, [200, 300, 100]);
		const context = createMouseMoveContext([panel1, panel2, panel3], resizeState);

		const event = createMouseMoveEvent(150, 50);
		mockCalculateNewSize.mockReturnValue(350);
		setupMockConstraints();
		mockCalculatePanelSizes.mockReturnValue({
			newPanelSize: 350,
			newNextPanelSize: 50,
		});

		processMouseMove(event, context);

		expect(mockCalculateNewSize).toHaveBeenCalledWith({
			event,
			orientation: 'horizontal',
			startPos: 100,
			startSize: 300,
		});
		expect(mockSetDimension).toHaveBeenCalledWith('horizontal', panel2.element, 350);
		expect(mockSetDimension).toHaveBeenCalledWith('horizontal', panel3.element, 50);
		expect(context.setPanelSize).toHaveBeenCalledWith('panel2', 350);
		expect(context.setPanelSize).toHaveBeenCalledWith('panel3', 50);
	});
});

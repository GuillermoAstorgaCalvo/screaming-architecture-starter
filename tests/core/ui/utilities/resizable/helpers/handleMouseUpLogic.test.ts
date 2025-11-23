import { handleMouseUpLogic } from '@core/ui/utilities/resizable/helpers/useResizable.helpers';
import { describe, expect, it, vi } from 'vitest';

describe('useResizable.helpers - handleMouseUpLogic', () => {
	it('sets isResizing to false and resets refs', () => {
		const setIsResizing = vi.fn();
		const startPosRef = { current: 150 };
		const startSizeRef = { current: 250 };

		handleMouseUpLogic({
			setIsResizing,
			startPosRef,
			startSizeRef,
		});

		expect(setIsResizing).toHaveBeenCalledWith(false);
		expect(setIsResizing).toHaveBeenCalledTimes(1);
		expect(startPosRef.current).toBe(0);
		expect(startSizeRef.current).toBe(0);
	});

	it('resets refs even when they have different values', () => {
		const setIsResizing = vi.fn();
		const startPosRef = { current: 999 };
		const startSizeRef = { current: 888 };

		handleMouseUpLogic({
			setIsResizing,
			startPosRef,
			startSizeRef,
		});

		expect(startPosRef.current).toBe(0);
		expect(startSizeRef.current).toBe(0);
	});
});

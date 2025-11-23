/**
 * PullToRefreshContainer Component Tests
 *
 * Tests for the PullToRefreshContainer component:
 * - Rendering
 * - Touch event handlers
 * - Indicator display
 * - Content padding
 * - Props forwarding
 */

import {
	PullToRefreshContainer,
	type PullToRefreshContainerProps,
} from '@core/ui/utilities/pull-to-refresh/components/PullToRefreshContainer';
import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, type TouchEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_ID_CONTAINER = 'pull-to-refresh-container';
const TEST_ID_CONTENT = 'content';
const TEST_ID_INDICATOR_WRAPPER = 'pull-to-refresh-indicator-wrapper';
const TEST_ID_CONTENT_WRAPPER = 'pull-to-refresh-content-wrapper';

const CLASS_CUSTOM = 'custom-class';
const CLASS_RELATIVE = 'relative';
const CLASS_OVERFLOW_AUTO = 'overflow-auto';

/**
 * Creates default mock handlers for touch events
 */
function createMockHandlers() {
	return {
		handleTouchStart: vi.fn(),
		handleTouchMove: vi.fn(),
		handleTouchEnd: vi.fn(),
	};
}

/**
 * Creates default props for PullToRefreshContainer
 */
function createDefaultProps(
	overrides?: Partial<PullToRefreshContainerProps>
): PullToRefreshContainerProps {
	const containerRef = createRef<HTMLDivElement | null>();
	const handlers = createMockHandlers();

	const defaultContainerProps = {
		'data-testid': TEST_ID_CONTAINER,
	};

	return {
		containerRef,
		onTouchStart: handlers.handleTouchStart,
		onTouchMove: handlers.handleTouchMove,
		onTouchEnd: handlers.handleTouchEnd,
		indicatorStyle: {},
		indicator: <div>Indicator</div>,
		isIdle: true,
		pullDistance: 0,
		children: <div data-testid={TEST_ID_CONTENT}>Test Content</div>,
		...overrides,
		containerProps: {
			...defaultContainerProps,
			...overrides?.containerProps,
		},
	};
}

/**
 * Renders PullToRefreshContainer with given props
 */
function renderContainer(props?: Partial<PullToRefreshContainerProps>) {
	const defaultProps = createDefaultProps(props);
	return render(<PullToRefreshContainer {...defaultProps} />);
}

/**
 * Creates a mock touch event
 */
function createTouchEvent(clientX: number, clientY: number): TouchEvent<HTMLDivElement> {
	return {
		touches: [{ clientX, clientY }],
	} as unknown as TouchEvent<HTMLDivElement>;
}

/**
 * Renders container with mock handlers and returns handlers and container element
 */
function renderWithHandlers() {
	const handlers = createMockHandlers();
	renderContainer({
		onTouchStart: handlers.handleTouchStart,
		onTouchMove: handlers.handleTouchMove,
		onTouchEnd: handlers.handleTouchEnd,
	});
	const containerElement = screen.getByTestId(TEST_ID_CONTAINER);
	return { handlers, containerElement };
}

describe('PullToRefreshContainer - Rendering', () => {
	it('renders children content', () => {
		renderContainer();

		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('renders indicator', () => {
		renderContainer({
			indicator: <div data-testid="indicator">Indicator</div>,
			isIdle: false,
		});

		expect(screen.getByTestId('indicator')).toBeInTheDocument();
	});
});

describe('PullToRefreshContainer - Class Names', () => {
	it('applies custom className', () => {
		renderContainer({
			className: CLASS_CUSTOM,
		});

		const containerElement = screen.getByTestId(TEST_ID_CONTAINER);
		expect(containerElement).toHaveClass(CLASS_CUSTOM);
	});

	it('applies default classes', () => {
		renderContainer();

		const containerElement = screen.getByTestId(TEST_ID_CONTAINER);
		expect(containerElement).toHaveClass(CLASS_RELATIVE);
		expect(containerElement).toHaveClass(CLASS_OVERFLOW_AUTO);
	});
});

describe('PullToRefreshContainer - Touch Event Handlers', () => {
	it('calls onTouchStart when touch starts', () => {
		const { handlers, containerElement } = renderWithHandlers();
		const touchEvent = createTouchEvent(100, 200);

		fireEvent.touchStart(containerElement, touchEvent);

		expect(handlers.handleTouchStart).toHaveBeenCalledTimes(1);
	});

	it('calls onTouchMove when touch moves', () => {
		const { handlers, containerElement } = renderWithHandlers();
		const touchEvent = createTouchEvent(150, 250);

		fireEvent.touchMove(containerElement, touchEvent);

		expect(handlers.handleTouchMove).toHaveBeenCalledTimes(1);
	});
});

describe('PullToRefreshContainer - Touch End Handler', () => {
	it('calls onTouchEnd when touch ends', () => {
		const { handlers, containerElement } = renderWithHandlers();

		fireEvent.touchEnd(containerElement);

		expect(handlers.handleTouchEnd).toHaveBeenCalledTimes(1);
	});
});

describe('PullToRefreshContainer - Indicator Display', () => {
	it('applies indicator style', () => {
		const indicatorStyle = {
			transform: 'translateY(0)',
			opacity: 1,
		};

		renderContainer({
			indicatorStyle,
			indicator: <div data-testid="indicator">Indicator</div>,
			isIdle: false,
		});

		const indicatorWrapper = screen.getByTestId(TEST_ID_INDICATOR_WRAPPER);
		expect(indicatorWrapper).toHaveStyle({ transform: 'translateY(0)', opacity: 1 });
	});

	it('hides indicator when idle', () => {
		renderContainer({
			indicatorStyle: {
				transform: 'translateY(-100%)',
				opacity: 0,
			},
			indicator: <div data-testid="indicator">Indicator</div>,
		});

		const indicatorWrapper = screen.getByTestId(TEST_ID_INDICATOR_WRAPPER);
		expect(indicatorWrapper).toHaveStyle({ transform: 'translateY(-100%)', opacity: 0 });
	});
});

describe('PullToRefreshContainer - Content Padding', () => {
	it('applies padding when not idle', () => {
		renderContainer({
			isIdle: false,
			pullDistance: 50,
		});

		const contentWrapper = screen.getByTestId(TEST_ID_CONTENT_WRAPPER);
		expect(contentWrapper).toHaveStyle({ paddingTop: '50px' });
	});

	it('applies no padding when idle', () => {
		renderContainer({
			isIdle: true,
			pullDistance: 0,
		});

		const contentWrapper = screen.getByTestId(TEST_ID_CONTENT_WRAPPER);
		expect(contentWrapper).toHaveStyle({ paddingTop: '0' });
	});
});

describe('PullToRefreshContainer - Props Forwarding', () => {
	it('forwards additional props to container', () => {
		renderContainer({
			containerProps: {
				id: 'test-container',
				'aria-label': 'Pull to refresh',
			},
		});

		const containerElement = screen.getByTestId(TEST_ID_CONTAINER);
		expect(containerElement).toHaveAttribute('id', 'test-container');
		expect(containerElement).toHaveAttribute('aria-label', 'Pull to refresh');
	});

	it('forwards all containerProps except excluded ones', () => {
		renderContainer({
			containerProps: {
				id: 'test-id',
				'aria-label': 'Custom label',
				role: 'region',
			},
		});

		const containerElement = screen.getByTestId(TEST_ID_CONTAINER);
		expect(containerElement).toHaveAttribute('id', 'test-id');
		expect(containerElement).toHaveAttribute('aria-label', 'Custom label');
		expect(containerElement).toHaveAttribute('role', 'region');
	});
});

describe('PullToRefreshContainer - Ref Assignment', () => {
	it('assigns ref to container element', () => {
		const containerRef = createRef<HTMLDivElement | null>();
		renderContainer({ containerRef });

		expect(containerRef.current).toBeInstanceOf(HTMLDivElement);
		expect(containerRef.current).toBe(screen.getByTestId(TEST_ID_CONTAINER));
	});

	it('ref points to the correct DOM element', () => {
		const containerRef = createRef<HTMLDivElement | null>();
		renderContainer({ containerRef });

		const containerElement = screen.getByTestId(TEST_ID_CONTAINER);
		expect(containerRef.current).toBe(containerElement);
	});
});

describe('PullToRefreshContainer - Async Touch End Handler', () => {
	const createAsyncHandler = () => {
		return vi.fn(async () => {
			await new Promise<void>(resolve => {
				const timerId = setTimeout(resolve, 10);
				// Timer ID is intentionally unused - timer will complete naturally
				expect(timerId).toBeDefined();
			});
		});
	};

	it('handles async onTouchEnd handler', async () => {
		const handleTouchEnd = createAsyncHandler();

		renderContainer({ onTouchEnd: handleTouchEnd });
		const containerElement = screen.getByTestId(TEST_ID_CONTAINER);

		fireEvent.touchEnd(containerElement);

		expect(handleTouchEnd).toHaveBeenCalledTimes(1);
		await handleTouchEnd();
	});

	it('handles onTouchEnd that returns void', () => {
		const handleTouchEnd = vi.fn(() => {
			// Returns void
		});

		renderContainer({ onTouchEnd: handleTouchEnd });
		const containerElement = screen.getByTestId(TEST_ID_CONTAINER);

		fireEvent.touchEnd(containerElement);

		expect(handleTouchEnd).toHaveBeenCalledTimes(1);
	});
});

describe('PullToRefreshContainer - ClassName Merging', () => {
	it('merges custom className with default classes', () => {
		renderContainer({
			className: 'custom-class another-class',
		});

		const containerElement = screen.getByTestId(TEST_ID_CONTAINER);
		expect(containerElement).toHaveClass(CLASS_RELATIVE);
		expect(containerElement).toHaveClass(CLASS_OVERFLOW_AUTO);
		expect(containerElement).toHaveClass('custom-class');
		expect(containerElement).toHaveClass('another-class');
	});

	it('handles undefined className', () => {
		renderContainer({
			className: undefined,
		});

		const containerElement = screen.getByTestId(TEST_ID_CONTAINER);
		expect(containerElement).toHaveClass(CLASS_RELATIVE);
		expect(containerElement).toHaveClass(CLASS_OVERFLOW_AUTO);
	});
});

describe('PullToRefreshContainer - Indicator Wrapper', () => {
	it('renders indicator wrapper with correct classes', () => {
		renderContainer({
			indicator: <div data-testid="indicator">Indicator</div>,
		});

		const indicatorWrapper = screen.getByTestId(TEST_ID_INDICATOR_WRAPPER);
		expect(indicatorWrapper).toHaveClass('absolute');
		expect(indicatorWrapper).toHaveClass('top-0');
		expect(indicatorWrapper).toHaveClass('left-0');
		expect(indicatorWrapper).toHaveClass('right-0');
		expect(indicatorWrapper).toHaveClass('z-10');
	});

	it('renders indicator inside wrapper', () => {
		renderContainer({
			indicator: <div data-testid="indicator">Indicator</div>,
		});

		const indicatorWrapper = screen.getByTestId(TEST_ID_INDICATOR_WRAPPER);
		const indicator = screen.getByTestId('indicator');

		expect(indicatorWrapper).toContainElement(indicator);
	});
});

describe('PullToRefreshContainer - Content Padding Edge Cases', () => {
	it('applies padding when not idle and pullDistance is 0', () => {
		renderContainer({
			isIdle: false,
			pullDistance: 0,
		});

		const contentWrapper = screen.getByTestId(TEST_ID_CONTENT_WRAPPER);
		expect(contentWrapper).toHaveStyle({ paddingTop: '0px' });
	});

	it('applies padding when not idle and pullDistance is positive', () => {
		renderContainer({
			isIdle: false,
			pullDistance: 100,
		});

		const contentWrapper = screen.getByTestId(TEST_ID_CONTENT_WRAPPER);
		expect(contentWrapper).toHaveStyle({ paddingTop: '100px' });
	});

	it('applies no padding when idle regardless of pullDistance', () => {
		renderContainer({
			isIdle: true,
			pullDistance: 50,
		});

		const contentWrapper = screen.getByTestId(TEST_ID_CONTENT_WRAPPER);
		expect(contentWrapper).toHaveStyle({ paddingTop: '0' });
	});
});

// Test the component directly to ensure coverage tracking
// This ensures the component file is tracked properly
describe('PullToRefreshContainer - Direct Component Test (Coverage)', () => {
	it('should execute the PullToRefreshContainer function directly', async () => {
		// Import the component directly to ensure it's tracked
		const { PullToRefreshContainer: PullToRefreshContainerComponent } = await import(
			'@core/ui/utilities/pull-to-refresh/components/PullToRefreshContainer'
		);

		// Verify the component is a function
		expect(typeof PullToRefreshContainerComponent).toBe('function');

		// Render with the component to ensure the function executes
		// This ensures the component file (lines 27-64) is tracked
		const containerRef = createRef<HTMLDivElement | null>();
		const handlers = createMockHandlers();

		render(
			<PullToRefreshContainerComponent
				containerRef={containerRef}
				onTouchStart={handlers.handleTouchStart}
				onTouchMove={handlers.handleTouchMove}
				onTouchEnd={handlers.handleTouchEnd}
				indicatorStyle={{}}
				indicator={<div>Indicator</div>}
				isIdle={true}
				pullDistance={0}
				containerProps={{ 'data-testid': TEST_ID_CONTAINER }}
			>
				<div data-testid="direct-test">Direct Test</div>
			</PullToRefreshContainerComponent>
		);

		expect(screen.getByTestId('direct-test')).toBeInTheDocument();
		expect(screen.getByTestId(TEST_ID_CONTAINER)).toBeInTheDocument();
	});
});

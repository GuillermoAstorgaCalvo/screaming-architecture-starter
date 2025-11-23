/**
 * Tests for TimelineConnector component
 *
 * Tests the timeline connector component:
 * - Rendering with different orientations
 * - Different sizes
 * - Color classes based on event states
 * - Accessibility attributes
 */

import { TimelineConnector } from '@core/ui/data-display/timeline/components/TimelineConnector';
import type { StandardSize } from '@src-types/ui/base';
import type { TimelineEvent, TimelineOrientation } from '@src-types/ui/layout/timeline';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const createMockEvent = (overrides?: Partial<TimelineEvent>): TimelineEvent => ({
	id: 'event-1',
	title: 'Test Event',
	...overrides,
});

describe('TimelineConnector - Rendering', () => {
	it('renders connector element', () => {
		const currentEvent = createMockEvent();
		const { container } = render(
			<TimelineConnector orientation="vertical" size="md" currentEvent={currentEvent} />
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toBeInTheDocument();
	});

	it('renders with aria-hidden attribute', () => {
		const currentEvent = createMockEvent();
		const { container } = render(
			<TimelineConnector orientation="vertical" size="md" currentEvent={currentEvent} />
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveAttribute('aria-hidden', 'true');
	});
});

describe('TimelineConnector - Orientation', () => {
	it('renders vertical connector with correct classes', () => {
		const currentEvent = createMockEvent();
		const { container } = render(
			<TimelineConnector orientation="vertical" size="md" currentEvent={currentEvent} />
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('h-8');
		expect(connector).toHaveClass('mt-2');
		expect(connector).toHaveClass('mb-2');
	});

	it('renders horizontal connector with correct classes', () => {
		const currentEvent = createMockEvent();
		const { container } = render(
			<TimelineConnector orientation="horizontal" size="md" currentEvent={currentEvent} />
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('w-8');
		expect(connector).toHaveClass('mt-2');
		expect(connector).toHaveClass('mb-2');
	});

	it('renders all orientations correctly', () => {
		const orientations: TimelineOrientation[] = ['vertical', 'horizontal'];
		const currentEvent = createMockEvent();

		for (const orientation of orientations) {
			const { container, unmount } = render(
				<TimelineConnector orientation={orientation} size="md" currentEvent={currentEvent} />
			);
			const connector = container.firstChild as HTMLElement;
			if (orientation === 'vertical') {
				expect(connector).toHaveClass('h-8');
			} else {
				expect(connector).toHaveClass('w-8');
			}
			unmount();
		}
	});
});

describe('TimelineConnector - Sizes', () => {
	it('renders with sm size', () => {
		const currentEvent = createMockEvent();
		const { container } = render(
			<TimelineConnector orientation="vertical" size="sm" currentEvent={currentEvent} />
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('w-0.5');
	});

	it('renders with md size', () => {
		const currentEvent = createMockEvent();
		const { container } = render(
			<TimelineConnector orientation="vertical" size="md" currentEvent={currentEvent} />
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('w-0.5');
	});

	it('renders with lg size', () => {
		const currentEvent = createMockEvent();
		const { container } = render(
			<TimelineConnector orientation="vertical" size="lg" currentEvent={currentEvent} />
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('w-1');
	});

	it('renders all sizes correctly', () => {
		const sizes: StandardSize[] = ['sm', 'md', 'lg'];
		const currentEvent = createMockEvent();

		for (const size of sizes) {
			const { container, unmount } = render(
				<TimelineConnector orientation="vertical" size={size} currentEvent={currentEvent} />
			);
			const connector = container.firstChild as HTMLElement;
			if (size === 'lg') {
				expect(connector).toHaveClass('w-1');
			} else {
				expect(connector).toHaveClass('w-0.5');
			}
			unmount();
		}
	});
});

describe('TimelineConnector - Color Classes', () => {
	it('renders with muted color when no events are active or completed', () => {
		const currentEvent = createMockEvent({ active: false, completed: false });
		const { container } = render(
			<TimelineConnector orientation="vertical" size="md" currentEvent={currentEvent} />
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('bg-muted');
	});

	it('renders with primary color when previous event is completed', () => {
		const previousEvent = createMockEvent({ completed: true });
		const currentEvent = createMockEvent({ active: false, completed: false });
		const { container } = render(
			<TimelineConnector
				orientation="vertical"
				size="md"
				previousEvent={previousEvent}
				currentEvent={currentEvent}
			/>
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('bg-primary');
	});

	it('renders with primary color when current event is active', () => {
		const currentEvent = createMockEvent({ active: true, completed: false });
		const { container } = render(
			<TimelineConnector orientation="vertical" size="md" currentEvent={currentEvent} />
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('bg-primary');
	});

	it('renders with primary color when current event is completed', () => {
		const currentEvent = createMockEvent({ active: false, completed: true });
		const { container } = render(
			<TimelineConnector orientation="vertical" size="md" currentEvent={currentEvent} />
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('bg-primary');
	});

	it('renders with primary color when current event is both active and completed', () => {
		const currentEvent = createMockEvent({ active: true, completed: true });
		const { container } = render(
			<TimelineConnector orientation="vertical" size="md" currentEvent={currentEvent} />
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('bg-primary');
	});

	it('prioritizes previous event completed over current event state', () => {
		const previousEvent = createMockEvent({ completed: true });
		const currentEvent = createMockEvent({ active: false, completed: false });
		const { container } = render(
			<TimelineConnector
				orientation="vertical"
				size="md"
				previousEvent={previousEvent}
				currentEvent={currentEvent}
			/>
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('bg-primary');
	});

	it('renders with muted color when previous event is not completed and current is inactive', () => {
		const previousEvent = createMockEvent({ completed: false, active: false });
		const currentEvent = createMockEvent({ active: false, completed: false });
		const { container } = render(
			<TimelineConnector
				orientation="vertical"
				size="md"
				previousEvent={previousEvent}
				currentEvent={currentEvent}
			/>
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('bg-muted');
	});

	it('renders with primary color when previous event is undefined but current is active', () => {
		const currentEvent = createMockEvent({ active: true });
		const { container } = render(
			<TimelineConnector orientation="vertical" size="md" currentEvent={currentEvent} />
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('bg-primary');
	});

	it('renders with primary color when previous event is undefined but current is completed', () => {
		const currentEvent = createMockEvent({ completed: true });
		const { container } = render(
			<TimelineConnector orientation="vertical" size="md" currentEvent={currentEvent} />
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('bg-primary');
	});
});

describe('TimelineConnector - Combined Props', () => {
	it('renders correctly with all props combined', () => {
		const previousEvent = createMockEvent({ completed: true });
		const currentEvent = createMockEvent({ active: true, completed: true });
		const { container } = render(
			<TimelineConnector
				orientation="horizontal"
				size="lg"
				previousEvent={previousEvent}
				currentEvent={currentEvent}
			/>
		);
		const connector = container.firstChild as HTMLElement;
		expect(connector).toHaveClass('w-8');
		expect(connector).toHaveClass('w-1');
		expect(connector).toHaveClass('bg-primary');
		expect(connector).toHaveClass('mt-2');
		expect(connector).toHaveClass('mb-2');
		expect(connector).toHaveAttribute('aria-hidden', 'true');
	});
});

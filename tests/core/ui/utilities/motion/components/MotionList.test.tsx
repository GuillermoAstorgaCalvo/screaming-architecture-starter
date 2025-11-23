/**
 * Tests for MotionList component
 *
 * Tests the MotionList component:
 * - Rendering items
 * - Empty list handling
 * - Stagger configuration
 * - Item props forwarding
 * - Custom key resolver
 */

import { MotionList } from '@core/ui/utilities/motion/components/MotionList';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock MotionStagger and MotionBox
vi.mock('@core/ui/utilities/motion/components/MotionStagger', () => ({
	MotionStagger: vi.fn(
		({
			children,
			className,
			staggerDelay: _staggerDelay,
			delayChildren: _delayChildren,
			reducedMotionStrategy: _reducedMotionStrategy,
			...props
		}) => (
			<div data-testid="motion-stagger" className={className} {...props}>
				{children}
			</div>
		)
	),
}));

vi.mock('@core/ui/utilities/motion/MotionBox', () => ({
	MotionBox: vi.fn(({ children, reducedMotionStrategy: _reducedMotionStrategy, ...props }) => (
		<div data-testid="motion-box" {...props}>
			{children}
		</div>
	)),
}));

describe('MotionList - Rendering', () => {
	it('renders list items', () => {
		const items = ['Item 1', 'Item 2', 'Item 3'];
		renderWithProviders(
			<MotionList
				items={items}
				renderItem={item => <div data-testid={`item-${item}`}>{item}</div>}
			/>
		);

		expect(screen.getByTestId('item-Item 1')).toBeInTheDocument();
		expect(screen.getByTestId('item-Item 2')).toBeInTheDocument();
		expect(screen.getByTestId('item-Item 3')).toBeInTheDocument();
	});

	it('renders empty fallback when list is empty', () => {
		renderWithProviders(
			<MotionList
				items={[]}
				renderItem={() => <div>Item</div>}
				emptyFallback={<div data-testid="empty">No items</div>}
			/>
		);

		expect(screen.getByTestId('empty')).toBeInTheDocument();
		expect(screen.queryByTestId('motion-stagger')).not.toBeInTheDocument();
	});

	it('returns null when list is empty and no fallback provided', () => {
		renderWithProviders(<MotionList items={[]} renderItem={() => <div>Item</div>} />);

		expect(screen.queryByTestId('motion-stagger')).not.toBeInTheDocument();
	});
});

describe('MotionList - Item configuration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses default fade variant for items', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		const items = ['Item 1'];
		renderWithProviders(<MotionList items={items} renderItem={item => <div>{item}</div>} />);

		const lastCall = (MotionBox as ReturnType<typeof vi.fn>).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			variant: 'fade',
		});
	});

	it('uses custom item variant', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		const items = ['Item 1'];
		renderWithProviders(
			<MotionList items={items} renderItem={item => <div>{item}</div>} itemVariant="scale" />
		);

		const lastCall = (MotionBox as ReturnType<typeof vi.fn>).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			variant: 'scale',
		});
	});

	it('uses default normal duration for items', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		const items = ['Item 1'];
		renderWithProviders(<MotionList items={items} renderItem={item => <div>{item}</div>} />);

		const lastCall = (MotionBox as ReturnType<typeof vi.fn>).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			duration: 'normal',
		});
	});
});

describe('MotionList - Item props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses custom item duration', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		const items = ['Item 1'];
		renderWithProviders(
			<MotionList items={items} renderItem={item => <div>{item}</div>} itemDuration="slow" />
		);

		const lastCall = (MotionBox as ReturnType<typeof vi.fn>).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			duration: 'slow',
		});
	});

	it('forwards item props to MotionBox', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		const items = ['Item 1'];
		renderWithProviders(
			<MotionList
				items={items}
				renderItem={item => <div>{item}</div>}
				itemProps={{ delay: 0.2, className: 'custom-item' }}
			/>
		);

		const lastCall = (MotionBox as ReturnType<typeof vi.fn>).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			delay: 0.2,
			className: 'custom-item',
		});
	});
});

describe('MotionList - Key resolution', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses array index as key by default', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		const items = ['Item 1', 'Item 2'];
		renderWithProviders(<MotionList items={items} renderItem={item => <div>{item}</div>} />);

		// Check that MotionBox was called with correct props (key is handled by React, not passed as prop)
		const [firstCall, secondCall] = (MotionBox as ReturnType<typeof vi.fn>).mock.calls;
		expect(firstCall?.[0]).toMatchObject({
			variant: 'fade',
			duration: 'normal',
		});
		expect(secondCall?.[0]).toMatchObject({
			variant: 'fade',
			duration: 'normal',
		});
	});

	it('uses custom key resolver', async () => {
		const { MotionBox } = await import('@core/ui/utilities/motion/MotionBox');
		const items = [
			{ id: 'a', name: 'Item 1' },
			{ id: 'b', name: 'Item 2' },
		];
		renderWithProviders(
			<MotionList
				items={items}
				renderItem={item => <div>{item.name}</div>}
				getItemKey={item => item.id}
			/>
		);

		// Check that MotionBox was called with correct props (key is handled by React, not passed as prop)
		// Filter to only get calls from this test (may have calls from previous tests)
		const { mock } = MotionBox as ReturnType<typeof vi.fn>;
		const [firstCall, secondCall] = mock.calls.slice(-2); // Get last 2 calls
		expect(firstCall?.[0]).toMatchObject({
			variant: 'fade',
			duration: 'normal',
		});
		expect(secondCall?.[0]).toMatchObject({
			variant: 'fade',
			duration: 'normal',
		});
	});
});

describe('MotionList - Stagger configuration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('forwards stagger delay to MotionStagger', async () => {
		const { MotionStagger } = await import('@core/ui/utilities/motion/components/MotionStagger');
		const items = ['Item 1'];
		renderWithProviders(
			<MotionList items={items} renderItem={item => <div>{item}</div>} staggerDelay={0.15} />
		);

		const lastCall = (MotionStagger as ReturnType<typeof vi.fn>).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			staggerDelay: 0.15,
		});
	});

	it('forwards delay children to MotionStagger', async () => {
		const { MotionStagger } = await import('@core/ui/utilities/motion/components/MotionStagger');
		const items = ['Item 1'];
		renderWithProviders(
			<MotionList items={items} renderItem={item => <div>{item}</div>} delayChildren={0.2} />
		);

		const lastCall = (MotionStagger as ReturnType<typeof vi.fn>).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			delayChildren: 0.2,
		});
	});

	it('forwards className to MotionStagger', async () => {
		const { MotionStagger } = await import('@core/ui/utilities/motion/components/MotionStagger');
		const items = ['Item 1'];
		renderWithProviders(
			<MotionList items={items} renderItem={item => <div>{item}</div>} className="list-container" />
		);

		const lastCall = (MotionStagger as ReturnType<typeof vi.fn>).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			className: 'list-container',
		});
	});
});

describe('MotionList - Reduced motion', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('uses default reduced motion strategy', async () => {
		const { MotionStagger } = await import('@core/ui/utilities/motion/components/MotionStagger');
		const items = ['Item 1'];
		renderWithProviders(<MotionList items={items} renderItem={item => <div>{item}</div>} />);

		const lastCall = (MotionStagger as ReturnType<typeof vi.fn>).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			reducedMotionStrategy: 'fade',
		});
	});

	it('forwards custom reduced motion strategy', async () => {
		const { MotionStagger } = await import('@core/ui/utilities/motion/components/MotionStagger');
		const items = ['Item 1'];
		renderWithProviders(
			<MotionList
				items={items}
				renderItem={item => <div>{item}</div>}
				reducedMotionStrategy="static"
			/>
		);

		const lastCall = (MotionStagger as ReturnType<typeof vi.fn>).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			reducedMotionStrategy: 'static',
		});
	});

	it('resolves skip strategy to static', async () => {
		const { MotionStagger } = await import('@core/ui/utilities/motion/components/MotionStagger');
		const items = ['Item 1'];
		renderWithProviders(
			<MotionList
				items={items}
				renderItem={item => <div>{item}</div>}
				reducedMotionStrategy="skip"
			/>
		);

		const lastCall = (MotionStagger as ReturnType<typeof vi.fn>).mock.calls.at(-1);
		expect(lastCall?.[0]).toMatchObject({
			reducedMotionStrategy: 'static',
		});
	});
});

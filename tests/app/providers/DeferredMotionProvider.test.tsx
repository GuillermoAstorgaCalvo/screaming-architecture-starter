/**
 * Tests for DeferredMotionProvider component
 */

import { DeferredMotionProvider } from '@app/providers/DeferredMotionProvider';
import { useDeferredActivation } from '@core/hooks/useDeferredActivation';
import { LazyMotionProvider } from '@core/ui/utilities/motion/components/MotionProvider.lazy';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_ID_TEST_CHILD = 'test-child';
const TEST_ID_LAZY_MOTION_PROVIDER = 'lazy-motion-provider';

vi.mock('@core/hooks/useDeferredActivation', () => ({
	useDeferredActivation: vi.fn(),
}));

vi.mock('@core/ui/utilities/motion/components/MotionProvider.lazy', () => ({
	LazyMotionProvider: vi.fn(({ children }: { children?: ReactNode }) => (
		<div data-testid={TEST_ID_LAZY_MOTION_PROVIDER}>{children}</div>
	)),
}));

const mockedUseDeferredActivation = vi.mocked(useDeferredActivation);
const mockedLazyMotionProvider = vi.mocked(LazyMotionProvider);

const setupDeferredMotionProviderTests = () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});
};

describe('DeferredMotionProvider - when activation is not ready', () => {
	setupDeferredMotionProviderTests();

	it('should render children directly without LazyMotionProvider', () => {
		mockedUseDeferredActivation.mockReturnValue(false);

		const TestChild = () => <div data-testid={TEST_ID_TEST_CHILD}>Test Content</div>;

		render(
			<DeferredMotionProvider>
				<TestChild />
			</DeferredMotionProvider>
		);

		expect(screen.getByTestId(TEST_ID_TEST_CHILD)).toBeInTheDocument();
		expect(screen.queryByTestId(TEST_ID_LAZY_MOTION_PROVIDER)).not.toBeInTheDocument();
		expect(mockedLazyMotionProvider).not.toHaveBeenCalled();
	});

	it('should call useDeferredActivation with correct options', () => {
		mockedUseDeferredActivation.mockReturnValue(false);

		render(
			<DeferredMotionProvider>
				<div>Test</div>
			</DeferredMotionProvider>
		);

		expect(mockedUseDeferredActivation).toHaveBeenCalledWith({
			timeout: 0,
			triggerOnVisibilityHidden: true,
		});
	});
});

describe('DeferredMotionProvider - when activation is ready', () => {
	setupDeferredMotionProviderTests();

	it('should render LazyMotionProvider with children', () => {
		mockedUseDeferredActivation.mockReturnValue(true);

		const TestChild = () => <div data-testid={TEST_ID_TEST_CHILD}>Test Content</div>;

		render(
			<DeferredMotionProvider>
				<TestChild />
			</DeferredMotionProvider>
		);

		expect(screen.getByTestId(TEST_ID_LAZY_MOTION_PROVIDER)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_ID_TEST_CHILD)).toBeInTheDocument();
		expect(mockedLazyMotionProvider).toHaveBeenCalled();
		const callArgs = mockedLazyMotionProvider.mock.calls[0] as Parameters<
			typeof LazyMotionProvider
		>;
		expect(callArgs[0]).toMatchObject({
			reducedMotion: 'user',
		});
	});

	it('should pass reducedMotion="user" prop to LazyMotionProvider', () => {
		mockedUseDeferredActivation.mockReturnValue(true);

		render(
			<DeferredMotionProvider>
				<div>Test</div>
			</DeferredMotionProvider>
		);

		expect(mockedLazyMotionProvider).toHaveBeenCalled();
		const callArgs = mockedLazyMotionProvider.mock.calls[0] as Parameters<
			typeof LazyMotionProvider
		>;
		expect(callArgs[0]).toMatchObject({
			reducedMotion: 'user',
		});
	});

	it('should pass children to LazyMotionProvider', () => {
		mockedUseDeferredActivation.mockReturnValue(true);

		const TestChild = () => <div data-testid="nested-child">Nested Content</div>;

		render(
			<DeferredMotionProvider>
				<TestChild />
			</DeferredMotionProvider>
		);

		expect(screen.getByTestId('nested-child')).toBeInTheDocument();
		expect(screen.getByTestId(TEST_ID_LAZY_MOTION_PROVIDER)).toContainElement(
			screen.getByTestId('nested-child')
		);
	});
});

describe('DeferredMotionProvider - component behavior', () => {
	setupDeferredMotionProviderTests();

	it('should handle multiple children', () => {
		mockedUseDeferredActivation.mockReturnValue(true);

		render(
			<DeferredMotionProvider>
				<div data-testid="child-1">Child 1</div>
				<div data-testid="child-2">Child 2</div>
			</DeferredMotionProvider>
		);

		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
		expect(screen.getByTestId(TEST_ID_LAZY_MOTION_PROVIDER)).toBeInTheDocument();
	});

	it('should handle empty children', () => {
		mockedUseDeferredActivation.mockReturnValue(false);

		render(<DeferredMotionProvider>{null}</DeferredMotionProvider>);

		expect(mockedLazyMotionProvider).not.toHaveBeenCalled();
	});

	it('should update when activation state changes', () => {
		mockedUseDeferredActivation.mockReturnValueOnce(false).mockReturnValueOnce(true);

		const TestChild = () => <div data-testid={TEST_ID_TEST_CHILD}>Test</div>;

		const { rerender } = render(
			<DeferredMotionProvider>
				<TestChild />
			</DeferredMotionProvider>
		);

		// Initially not ready
		expect(screen.getByTestId(TEST_ID_TEST_CHILD)).toBeInTheDocument();
		expect(screen.queryByTestId(TEST_ID_LAZY_MOTION_PROVIDER)).not.toBeInTheDocument();

		// Rerender with activation ready
		rerender(
			<DeferredMotionProvider>
				<TestChild />
			</DeferredMotionProvider>
		);

		// Now should render LazyMotionProvider
		expect(screen.getByTestId(TEST_ID_LAZY_MOTION_PROVIDER)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_ID_TEST_CHILD)).toBeInTheDocument();
	});
});

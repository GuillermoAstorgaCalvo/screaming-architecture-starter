/**
 * LoadingWrapperHelpers.empty Tests
 *
 * Tests for the empty state helpers including:
 * - buildEmptyStateProps
 * - renderEmptyStateWithString
 * - renderEmptyState
 */

import {
	buildEmptyStateProps,
	renderEmptyState,
	renderEmptyStateWithString,
} from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.empty';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_EMPTY_TITLE = 'No Data';
const TEST_EMPTY_MESSAGE = 'No items found';
const TEST_EMPTY_STATE_WRAPPER_ID = 'empty-state-wrapper';
const TEST_CUSTOM_CLASS = 'custom-class';

type EmptyStateProps = Readonly<{
	emptyMessage?: string | ReactNode;
	emptyTitle: string;
	emptyDescription?: string;
	emptyActionLabel?: string;
	onEmptyAction?: (() => void) | undefined;
	className?: string;
	props: Readonly<Record<string, unknown>>;
}>;

type EmptyStateWithStringProps = Readonly<{
	emptyMessage: string;
	emptyTitle: string;
	emptyDescription?: string;
	emptyActionLabel?: string;
	onEmptyAction?: (() => void) | undefined;
	className?: string;
	props: Readonly<Record<string, unknown>>;
}>;

// Helper functions
function createBasicProps(overrides: Partial<EmptyStateProps> = {}): EmptyStateProps {
	return {
		emptyTitle: TEST_EMPTY_TITLE,
		props: {},
		...overrides,
	};
}

function createStringMessageProps(
	overrides: Partial<EmptyStateWithStringProps> = {}
): EmptyStateWithStringProps {
	return {
		emptyMessage: TEST_EMPTY_MESSAGE,
		emptyTitle: TEST_EMPTY_TITLE,
		props: {},
		...overrides,
	};
}

function renderAndAssertEmptyState(props: EmptyStateProps): void {
	render(<>{renderEmptyState(props)}</>);
	expect(screen.getByTestId(TEST_EMPTY_STATE_WRAPPER_ID)).toBeInTheDocument();
}

function renderAndAssertEmptyStateWithString(props: EmptyStateWithStringProps): void {
	render(<>{renderEmptyStateWithString(props)}</>);
	expect(screen.getByTestId(TEST_EMPTY_STATE_WRAPPER_ID)).toBeInTheDocument();
}

function assertEmptyStateWithClass(props: EmptyStateProps, className: string): void {
	render(<>{renderEmptyState(props)}</>);
	expect(screen.getByTestId(TEST_EMPTY_STATE_WRAPPER_ID)).toHaveClass(className);
}

function assertEmptyStateWithStringClass(
	props: EmptyStateWithStringProps,
	className: string
): void {
	render(<>{renderEmptyStateWithString(props)}</>);
	expect(screen.getByTestId(TEST_EMPTY_STATE_WRAPPER_ID)).toHaveClass(className);
}

describe('buildEmptyStateProps', () => {
	it('builds empty state props with title only', () => {
		const props = buildEmptyStateProps({
			emptyTitle: TEST_EMPTY_TITLE,
		});

		expect(props.title).toBe(TEST_EMPTY_TITLE);
		expect(props.description).toBeUndefined();
		expect(props.actionLabel).toBeUndefined();
		expect(props.onAction).toBeUndefined();
	});

	it('builds empty state props with description', () => {
		const props = buildEmptyStateProps({
			emptyTitle: TEST_EMPTY_TITLE,
			emptyDescription: TEST_EMPTY_MESSAGE,
		});

		expect(props.title).toBe(TEST_EMPTY_TITLE);
		expect(props.description).toBe(TEST_EMPTY_MESSAGE);
	});

	it('builds empty state props with message as description', () => {
		const props = buildEmptyStateProps({
			emptyTitle: TEST_EMPTY_TITLE,
			emptyMessage: TEST_EMPTY_MESSAGE,
		});

		expect(props.title).toBe(TEST_EMPTY_TITLE);
		expect(props.description).toBe(TEST_EMPTY_MESSAGE);
	});

	it('builds empty state props with action', () => {
		const onAction = vi.fn();
		const props = buildEmptyStateProps({
			emptyTitle: TEST_EMPTY_TITLE,
			emptyActionLabel: 'Add Item',
			onEmptyAction: onAction,
		});

		expect(props.title).toBe(TEST_EMPTY_TITLE);
		expect(props.actionLabel).toBe('Add Item');
		expect(props.onAction).toBe(onAction);
	});

	it('prioritizes emptyDescription over emptyMessage', () => {
		const props = buildEmptyStateProps({
			emptyTitle: TEST_EMPTY_TITLE,
			emptyDescription: 'Description',
			emptyMessage: 'Message',
		});

		expect(props.description).toBe('Description');
	});
});

describe('renderEmptyStateWithString', () => {
	it('renders empty state with string message', () => {
		const props = createStringMessageProps();
		renderAndAssertEmptyStateWithString(props);
	});

	it('applies className to container', () => {
		const props = createStringMessageProps({
			emptyMessage: 'No items',
			className: TEST_CUSTOM_CLASS,
		});
		assertEmptyStateWithStringClass(props, TEST_CUSTOM_CLASS);
	});

	it('renders empty state with string message without optional props', () => {
		const props = createStringMessageProps();
		renderAndAssertEmptyStateWithString(props);
	});

	it('renders empty state with string message without emptyDescription', () => {
		const props = createStringMessageProps({
			emptyActionLabel: 'Add Item',
			onEmptyAction: vi.fn(),
		});
		renderAndAssertEmptyStateWithString(props);
	});

	it('renders empty state with string message without emptyActionLabel', () => {
		const props = createStringMessageProps({
			emptyDescription: 'Description',
			onEmptyAction: vi.fn(),
		});
		renderAndAssertEmptyStateWithString(props);
	});

	it('renders empty state with string message without onEmptyAction', () => {
		const props = createStringMessageProps({
			emptyDescription: 'Description',
			emptyActionLabel: 'Add Item',
		});
		renderAndAssertEmptyStateWithString(props);
	});
});

describe('renderEmptyState', () => {
	it('renders default empty state when no message provided', () => {
		const props = createBasicProps();
		renderAndAssertEmptyState(props);
	});

	it('renders empty state with string message', () => {
		const props = createStringMessageProps();
		renderAndAssertEmptyState(props);
	});

	it('renders empty state with ReactNode message', () => {
		const props = createBasicProps({
			emptyMessage: <div data-testid="custom-empty">Custom Empty</div>,
		});

		render(<>{renderEmptyState(props)}</>);
		expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
	});

	it('renders empty state with action button', () => {
		const onAction = vi.fn();
		const props = createBasicProps({
			emptyActionLabel: 'Add Item',
			onEmptyAction: onAction,
		});

		render(<>{renderEmptyState(props)}</>);
		const actionButton = screen.getByRole('button', { name: /add item/i });
		expect(actionButton).toBeInTheDocument();

		fireEvent.click(actionButton);
		expect(onAction).toHaveBeenCalledTimes(1);
	});

	it('applies className to container', () => {
		const props = createBasicProps({
			className: TEST_CUSTOM_CLASS,
		});
		assertEmptyStateWithClass(props, TEST_CUSTOM_CLASS);
	});

	it('renders default empty state without optional props', () => {
		const props = createBasicProps();
		renderAndAssertEmptyState(props);
	});

	it('renders default empty state without className', () => {
		const props = createBasicProps({
			emptyDescription: 'Description',
			emptyActionLabel: 'Add Item',
			onEmptyAction: vi.fn(),
		});

		render(<>{renderEmptyState(props)}</>);
		expect(screen.getByTestId(TEST_EMPTY_STATE_WRAPPER_ID)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_EMPTY_STATE_WRAPPER_ID)).not.toHaveClass(TEST_CUSTOM_CLASS);
	});

	it('renders string empty state without className', () => {
		const props = createStringMessageProps({
			emptyDescription: 'Description',
		});
		renderAndAssertEmptyState(props);
	});
});

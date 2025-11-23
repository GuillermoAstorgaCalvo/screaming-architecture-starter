/**
 * LoadingWrapperHelpers.state.empty Tests
 *
 * Tests for the empty state helper functions including:
 * - buildEmptyStateParams
 * - renderEmptyStateIfPresent
 */

import {
	buildEmptyStateParams,
	renderEmptyStateIfPresent,
} from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.empty';
import type { LoadingWrapperStateParams } from '@core/ui/utilities/loading-wrapper/types/LoadingWrapperHelpers.state.types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const EMPTY_STATE_WRAPPER_TEST_ID = 'empty-state-wrapper';

describe('buildEmptyStateParams', () => {
	it('builds empty state params with all properties', () => {
		const onAction = () => {};
		const params = buildEmptyStateParams({
			emptyMessage: 'No items',
			emptyTitle: 'No Data',
			emptyDescription: 'Description',
			emptyActionLabel: 'Add Item',
			onEmptyAction: onAction,
			className: 'test-class',
			props: {},
		});

		expect(params.emptyTitle).toBe('No Data');
		expect(params.emptyMessage).toBe('No items');
		expect(params.emptyDescription).toBe('Description');
		expect(params.emptyActionLabel).toBe('Add Item');
		expect(params.onEmptyAction).toBe(onAction);
		expect(params.className).toBe('test-class');
		expect(params.props).toEqual({});
	});

	it('filters out undefined properties', () => {
		const params = buildEmptyStateParams({
			emptyTitle: 'No Data',
			props: {},
		});

		expect(params.emptyTitle).toBe('No Data');
		expect(params.emptyMessage).toBeUndefined();
		expect(params.emptyDescription).toBeUndefined();
		expect(params.emptyActionLabel).toBeUndefined();
		expect(params.onEmptyAction).toBeUndefined();
		expect(params.className).toBeUndefined();
	});
});

function createBaseParams(
	overrides: Partial<LoadingWrapperStateParams> = {}
): LoadingWrapperStateParams {
	return {
		isLoading: false,
		error: null,
		isEmpty: true,
		useSkeleton: false,
		emptyTitle: 'No Data',
		props: {},
		...overrides,
	};
}

describe('renderEmptyStateIfPresent', () => {
	describe('basic rendering', () => {
		it('returns null when not empty', () => {
			const params = createBaseParams({ isEmpty: false });

			const view = renderEmptyStateIfPresent(params);
			expect(view).toBeNull();
		});

		it('renders empty state when isEmpty is true', () => {
			const params = createBaseParams();

			render(<>{renderEmptyStateIfPresent(params)}</>);
			expect(screen.getByTestId(EMPTY_STATE_WRAPPER_TEST_ID)).toBeInTheDocument();
		});
	});

	describe('message rendering', () => {
		it('renders empty state with string message', () => {
			const params = createBaseParams({
				emptyMessage: 'No items found',
			});

			render(<>{renderEmptyStateIfPresent(params)}</>);
			expect(screen.getByTestId(EMPTY_STATE_WRAPPER_TEST_ID)).toBeInTheDocument();
		});

		it('renders empty state with ReactNode message', () => {
			const params = createBaseParams({
				emptyMessage: <div data-testid="custom-empty">Custom</div>,
			});

			render(<>{renderEmptyStateIfPresent(params)}</>);
			expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
		});
	});

	describe('styling', () => {
		it('renders empty state without className', () => {
			const params = createBaseParams({
				emptyDescription: 'Description',
				emptyActionLabel: 'Add Item',
				onEmptyAction: () => {},
			});

			render(<>{renderEmptyStateIfPresent(params)}</>);
			expect(screen.getByTestId(EMPTY_STATE_WRAPPER_TEST_ID)).toBeInTheDocument();
		});

		it('renders empty state with className', () => {
			const params = createBaseParams({
				className: 'custom-class',
			});

			render(<>{renderEmptyStateIfPresent(params)}</>);
			const wrapper = screen.getByTestId(EMPTY_STATE_WRAPPER_TEST_ID);
			expect(wrapper).toBeInTheDocument();
			expect(wrapper).toHaveClass('custom-class');
		});
	});
});

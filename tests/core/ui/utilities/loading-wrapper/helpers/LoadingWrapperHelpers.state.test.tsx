/**
 * LoadingWrapperHelpers.state Tests
 *
 * Tests for the state rendering helpers including:
 * - renderState function
 * - State priority logic
 * - Error state rendering
 * - Loading state rendering
 * - Empty state rendering
 * - Success state rendering
 */

import { renderState } from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state';
import type { LoadingWrapperStateParams } from '@core/ui/utilities/loading-wrapper/types/LoadingWrapperHelpers.state.types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const DEFAULT_EMPTY_TITLE = 'No Data';
const ERROR_MESSAGE = 'Error occurred';
const TEST_ID_ERROR = 'loading-wrapper-error';
const TEST_ID_LOADING = 'loading-wrapper-loading';

describe('renderState - state rendering', () => {
	it('renders error state when error is present', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: false,
			error: ERROR_MESSAGE,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: DEFAULT_EMPTY_TITLE,
			props: { 'data-testid': TEST_ID_ERROR },
		};

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId(TEST_ID_ERROR)).toBeInTheDocument();
	});

	it('renders loading state when loading and no error', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: true,
			error: null,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: DEFAULT_EMPTY_TITLE,
			props: { 'data-testid': TEST_ID_LOADING },
		};

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId(TEST_ID_LOADING)).toBeInTheDocument();
	});

	it('renders empty state when empty and no error or loading', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: false,
			error: null,
			isEmpty: true,
			useSkeleton: false,
			emptyTitle: DEFAULT_EMPTY_TITLE,
			props: {},
		};

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId('empty-state-wrapper')).toBeInTheDocument();
	});

	it('renders success state when no error, loading, or empty', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: false,
			error: null,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: DEFAULT_EMPTY_TITLE,
			children: <div data-testid="content">Content</div>,
			props: {},
		};

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId('content')).toBeInTheDocument();
	});
});

describe('renderState - state priority', () => {
	it('prioritizes error over loading', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: true,
			error: ERROR_MESSAGE,
			isEmpty: false,
			useSkeleton: false,
			emptyTitle: DEFAULT_EMPTY_TITLE,
			props: { 'data-testid': TEST_ID_ERROR },
		};

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId(TEST_ID_ERROR)).toBeInTheDocument();
	});

	it('prioritizes error over empty', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: false,
			error: ERROR_MESSAGE,
			isEmpty: true,
			useSkeleton: false,
			emptyTitle: DEFAULT_EMPTY_TITLE,
			props: { 'data-testid': TEST_ID_ERROR },
		};

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId(TEST_ID_ERROR)).toBeInTheDocument();
	});

	it('prioritizes loading over empty', () => {
		const params: LoadingWrapperStateParams = {
			isLoading: true,
			error: null,
			isEmpty: true,
			useSkeleton: false,
			emptyTitle: DEFAULT_EMPTY_TITLE,
			props: { 'data-testid': TEST_ID_LOADING },
		};

		render(<>{renderState(params)}</>);
		expect(screen.getByTestId(TEST_ID_LOADING)).toBeInTheDocument();
	});
});

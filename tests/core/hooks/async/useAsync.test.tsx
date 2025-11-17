import { afterEach, describe, vi } from 'vitest';

import {
	describeCancellation,
	describeDependencyChanges,
	describeEdgeCases,
	describeMultipleExecutions,
	describeResetFunctionality,
} from './useAsync.test.sections.advanced';
import {
	describeAsyncOperationExecution,
	describeErrorStates,
	describeLoadingStates,
	describeSuccessStates,
} from './useAsync.test.sections.basic';

describe('useAsync', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	describeAsyncOperationExecution();
	describeLoadingStates();
	describeSuccessStates();
	describeErrorStates();
	describeCancellation();
	describeDependencyChanges();
	describeResetFunctionality();
	describeMultipleExecutions();
	describeEdgeCases();
});

/**
 * useTransfer.helpers Tests
 *
 * Tests for useTransfer helper functions including:
 * - Transfer return value building
 */

import { buildTransferReturn } from '@core/ui/forms/transfer/helpers/useTransfer.helpers';
import type {
	BuildTransferReturnParams,
	TransferHandlers,
	TransferState,
} from '@core/ui/forms/transfer/types/useTransfer.types';
import type { TransferOption, TransferProps } from '@src-types/ui/data/transfer';
import { describe, expect, it, vi } from 'vitest';

describe('buildTransferReturn', () => {
	const createMockState = (): TransferState => ({
		sourceSearchValue: '',
		targetSearchValue: '',
		selectedSourceValues: new Set(),
		selectedTargetValues: new Set(),
		setSourceSearchValue: vi.fn(),
		setTargetSearchValue: vi.fn(),
		setSelectedSourceValues: vi.fn(),
		setSelectedTargetValues: vi.fn(),
	});

	const createMockHandlers = (): TransferHandlers => ({
		handleSourceSearchChange: vi.fn(),
		handleTargetSearchChange: vi.fn(),
		handleSourceItemToggle: vi.fn(),
		handleTargetItemToggle: vi.fn(),
		handleSourceSelectAll: vi.fn(),
		handleSourceSelectNone: vi.fn(),
		handleTargetSelectAll: vi.fn(),
		handleTargetSelectNone: vi.fn(),
		handleMoveToTarget: vi.fn(),
		handleMoveToSource: vi.fn(),
	});

	const createMockProps = (): TransferProps => ({
		options: [],
	});

	it('builds return value with all required properties', () => {
		const state = createMockState();
		const handlers = createMockHandlers();
		const filteredSourceOptions: TransferOption[] = [{ value: '1', label: 'Source 1' }];
		const filteredTargetOptions: TransferOption[] = [{ value: '2', label: 'Target 1' }];
		const props = createMockProps();

		const params: BuildTransferReturnParams<unknown> = {
			state,
			filteredSourceOptions,
			filteredTargetOptions,
			handlers,
			isMoveToTargetDisabled: false,
			isMoveToSourceDisabled: true,
			props,
		};

		const result = buildTransferReturn(params);

		expect(result.sourceOptions).toBe(filteredSourceOptions);
		expect(result.targetOptions).toBe(filteredTargetOptions);
		expect(result.selectedSourceValues).toBe(state.selectedSourceValues);
		expect(result.selectedTargetValues).toBe(state.selectedTargetValues);
		expect(result.sourceSearchValue).toBe(state.sourceSearchValue);
		expect(result.targetSearchValue).toBe(state.targetSearchValue);
		expect(result.handleSourceSearchChange).toBe(handlers.handleSourceSearchChange);
		expect(result.handleTargetSearchChange).toBe(handlers.handleTargetSearchChange);
		expect(result.handleSourceItemToggle).toBe(handlers.handleSourceItemToggle);
		expect(result.handleTargetItemToggle).toBe(handlers.handleTargetItemToggle);
		expect(result.handleSourceSelectAll).toBe(handlers.handleSourceSelectAll);
		expect(result.handleSourceSelectNone).toBe(handlers.handleSourceSelectNone);
		expect(result.handleTargetSelectAll).toBe(handlers.handleTargetSelectAll);
		expect(result.handleTargetSelectNone).toBe(handlers.handleTargetSelectNone);
		expect(result.handleMoveToTarget).toBe(handlers.handleMoveToTarget);
		expect(result.handleMoveToSource).toBe(handlers.handleMoveToSource);
		expect(result.isMoveToTargetDisabled).toBe(false);
		expect(result.isMoveToSourceDisabled).toBe(true);
		expect(result.props).toBe(props);
	});

	it('preserves state values correctly', () => {
		const state: TransferState = {
			...createMockState(),
			sourceSearchValue: 'source search',
			targetSearchValue: 'target search',
			selectedSourceValues: new Set(['1', '2']),
			selectedTargetValues: new Set(['3']),
		};

		const params: BuildTransferReturnParams<unknown> = {
			state,
			filteredSourceOptions: [],
			filteredTargetOptions: [],
			handlers: createMockHandlers(),
			isMoveToTargetDisabled: false,
			isMoveToSourceDisabled: false,
			props: createMockProps(),
		};

		const result = buildTransferReturn(params);

		expect(result.sourceSearchValue).toBe('source search');
		expect(result.targetSearchValue).toBe('target search');
		expect(result.selectedSourceValues).toEqual(new Set(['1', '2']));
		expect(result.selectedTargetValues).toEqual(new Set(['3']));
	});
});

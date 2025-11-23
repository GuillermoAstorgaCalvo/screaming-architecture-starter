/**
 * TransferContent.builders Tests
 *
 * Tests for TransferContent builder functions including:
 * - Source list props building
 * - Target list props building
 * - Actions props building
 */

import {
	buildActionsProps,
	buildSourceListProps,
	buildTargetListProps,
} from '@core/ui/forms/transfer/helpers/TransferContent.builders';
import { extractTransferProps } from '@core/ui/forms/transfer/helpers/TransferContent.helpers';
import type { UseTransferReturn } from '@core/ui/forms/transfer/types/useTransfer.types';
import type { TransferOption, TransferProps } from '@src-types/ui/data/transfer';
import { describe, expect, it, vi } from 'vitest';

describe('buildSourceListProps', () => {
	const createMockTransferData = (): UseTransferReturn<unknown> => ({
		sourceOptions: [],
		targetOptions: [],
		selectedSourceValues: new Set(),
		selectedTargetValues: new Set(),
		sourceSearchValue: '',
		targetSearchValue: '',
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
		isMoveToTargetDisabled: false,
		isMoveToSourceDisabled: false,
		props: { options: [] },
	});

	it('builds source list props correctly', () => {
		const transferData: UseTransferReturn<unknown> = {
			...createMockTransferData(),
			sourceOptions: [{ value: '1', label: 'Option 1' }] as TransferOption[],
			selectedSourceValues: new Set(['1']),
			sourceSearchValue: 'search',
		};

		const props: TransferProps<unknown> = {
			options: [],
			sourceTitle: 'Source',
			searchPlaceholder: 'Search...',
			showSearch: true,
			size: 'md',
			disabled: false,
			maxHeight: 300,
			showSelectAll: true,
		};
		const transferProps = extractTransferProps(props);

		const listLabels = { selectAll: 'Select All' };

		const result = buildSourceListProps(transferData, transferProps, listLabels);

		expect(result.sourceOptions).toBe(transferData.sourceOptions);
		expect(result.selectedSourceValues).toBe(transferData.selectedSourceValues);
		expect(result.sourceSearchValue).toBe('search');
		expect(result.handleSourceSearchChange).toBe(transferData.handleSourceSearchChange);
		expect(result.handleSourceItemToggle).toBe(transferData.handleSourceItemToggle);
		expect(result.handleSourceSelectAll).toBe(transferData.handleSourceSelectAll);
		expect(result.handleSourceSelectNone).toBe(transferData.handleSourceSelectNone);
		expect(result.sourceTitle).toBe('Source');
		expect(result.searchPlaceholder).toBe('Search...');
		expect(result.showSearch).toBe(true);
		expect(result.size).toBe('md');
		expect(result.disabled).toBe(false);
		expect(result.maxHeight).toBe(300);
		expect(result.showSelectAll).toBe(true);
		expect(result.listLabels).toBe(listLabels);
	});
});

describe('buildTargetListProps', () => {
	const createMockTransferData = (): UseTransferReturn<unknown> => ({
		sourceOptions: [],
		targetOptions: [],
		selectedSourceValues: new Set(),
		selectedTargetValues: new Set(),
		sourceSearchValue: '',
		targetSearchValue: '',
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
		isMoveToTargetDisabled: false,
		isMoveToSourceDisabled: false,
		props: { options: [] },
	});

	it('builds target list props correctly', () => {
		const transferData: UseTransferReturn<unknown> = {
			...createMockTransferData(),
			targetOptions: [{ value: '2', label: 'Option 2' }] as TransferOption[],
			selectedTargetValues: new Set(['2']),
			targetSearchValue: 'target search',
		};

		const props: TransferProps<unknown> = {
			options: [],
			targetTitle: 'Target',
			searchPlaceholder: 'Search...',
			showSearch: true,
			size: 'lg',
			disabled: true,
			maxHeight: 500,
			showSelectAll: false,
		};
		const transferProps = extractTransferProps(props);

		const listLabels = { selectNone: 'Deselect All' };

		const result = buildTargetListProps(transferData, transferProps, listLabels);

		expect(result.targetOptions).toBe(transferData.targetOptions);
		expect(result.selectedTargetValues).toBe(transferData.selectedTargetValues);
		expect(result.targetSearchValue).toBe('target search');
		expect(result.handleTargetSearchChange).toBe(transferData.handleTargetSearchChange);
		expect(result.handleTargetItemToggle).toBe(transferData.handleTargetItemToggle);
		expect(result.handleTargetSelectAll).toBe(transferData.handleTargetSelectAll);
		expect(result.handleTargetSelectNone).toBe(transferData.handleTargetSelectNone);
		expect(result.targetTitle).toBe('Target');
		expect(result.searchPlaceholder).toBe('Search...');
		expect(result.showSearch).toBe(true);
		expect(result.size).toBe('lg');
		expect(result.disabled).toBe(true);
		expect(result.maxHeight).toBe(500);
		expect(result.showSelectAll).toBe(false);
		expect(result.listLabels).toBe(listLabels);
	});
});

describe('buildActionsProps', () => {
	const createMockTransferData = (): UseTransferReturn<unknown> => ({
		sourceOptions: [],
		targetOptions: [],
		selectedSourceValues: new Set(),
		selectedTargetValues: new Set(),
		sourceSearchValue: '',
		targetSearchValue: '',
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
		isMoveToTargetDisabled: false,
		isMoveToSourceDisabled: false,
		props: { options: [] },
	});

	it('builds actions props correctly', () => {
		const transferData = createMockTransferData();
		const props: TransferProps<unknown> = {
			options: [],
			size: 'md',
			disabled: false,
		};
		const transferProps = extractTransferProps(props);

		const actionLabels = {
			moveToRight: 'Move Right',
			moveToLeft: 'Move Left',
		};

		const result = buildActionsProps(transferData, transferProps, actionLabels);

		expect(result.handleMoveToTarget).toBe(transferData.handleMoveToTarget);
		expect(result.handleMoveToSource).toBe(transferData.handleMoveToSource);
		expect(result.isMoveToTargetDisabled).toBe(false);
		expect(result.isMoveToSourceDisabled).toBe(false);
		expect(result.size).toBe('md');
		expect(result.disabled).toBe(false);
		expect(result.actionLabels).toBe(actionLabels);
	});

	it('handles disabled states correctly', () => {
		const transferData: UseTransferReturn<unknown> = {
			...createMockTransferData(),
			isMoveToTargetDisabled: true,
			isMoveToSourceDisabled: true,
		};

		const props: TransferProps<unknown> = {
			options: [],
			size: 'sm',
			disabled: true,
		};
		const transferProps = extractTransferProps(props);

		const result = buildActionsProps(transferData, transferProps, undefined);

		expect(result.isMoveToTargetDisabled).toBe(true);
		expect(result.isMoveToSourceDisabled).toBe(true);
		expect(result.disabled).toBe(true);
	});
});

import { useTranslation } from '@core/i18n/useTranslation';
import { PaginationButton } from '@core/ui/navigation/pagination/components/PaginationButton';
import { createPageChangeHandler } from '@core/ui/navigation/pagination/helpers/PaginationHandlers';
import type { StandardSize } from '@src-types/ui/base';

// ============================================================================
// First/Last Button Components
// ============================================================================

export interface FirstButtonProps {
	size: StandardSize;
	onPageChange: (page: number) => void;
}

export function FirstButton({ size, onPageChange }: Readonly<FirstButtonProps>) {
	const { t } = useTranslation('common');
	return (
		<PaginationButton
			ariaLabel={t('pagination.goToFirstPage')}
			onClick={createPageChangeHandler(onPageChange, 1)}
			size={size}
		>
			{t('pagination.first')}
		</PaginationButton>
	);
}

export interface LastButtonProps {
	totalPages: number;
	size: StandardSize;
	onPageChange: (page: number) => void;
}

export function LastButton({ totalPages, size, onPageChange }: Readonly<LastButtonProps>) {
	const { t } = useTranslation('common');
	return (
		<PaginationButton
			ariaLabel={t('pagination.goToLastPage')}
			onClick={createPageChangeHandler(onPageChange, totalPages)}
			size={size}
		>
			{t('pagination.last')}
		</PaginationButton>
	);
}

export interface FirstLastButtonsProps {
	currentPage: number;
	totalPages: number;
	size: StandardSize;
	showFirstLast: boolean;
	onPageChange: (page: number) => void;
}

export function FirstLastButtons({
	currentPage,
	totalPages,
	size,
	showFirstLast,
	onPageChange,
}: Readonly<FirstLastButtonsProps>) {
	if (!showFirstLast) return null;
	return (
		<>
			{currentPage > 1 && <FirstButton size={size} onPageChange={onPageChange} />}
			{currentPage < totalPages && (
				<LastButton totalPages={totalPages} size={size} onPageChange={onPageChange} />
			)}
		</>
	);
}

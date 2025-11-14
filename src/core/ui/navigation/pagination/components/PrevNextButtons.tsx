import { useTranslation } from '@core/i18n/useTranslation';
import { PaginationButton } from '@core/ui/navigation/pagination/components/PaginationButton';
import {
	createNextPageHandler,
	createPreviousPageHandler,
} from '@core/ui/navigation/pagination/helpers/PaginationHandlers';
import type { StandardSize } from '@src-types/ui/base';

// ============================================================================
// Previous/Next Button Components
// ============================================================================

export interface PreviousButtonProps {
	currentPage: number;
	size: StandardSize;
	onPageChange: (page: number) => void;
}

export function PreviousButton({ currentPage, size, onPageChange }: Readonly<PreviousButtonProps>) {
	const { t } = useTranslation('common');
	return (
		<PaginationButton
			ariaLabel={t('pagination.goToPreviousPage')}
			onClick={createPreviousPageHandler(onPageChange, currentPage)}
			disabled={currentPage === 1}
			size={size}
		>
			{t('pagination.previous')}
		</PaginationButton>
	);
}

export interface NextButtonProps {
	currentPage: number;
	totalPages: number;
	size: StandardSize;
	onPageChange: (page: number) => void;
}

export function NextButton({
	currentPage,
	totalPages,
	size,
	onPageChange,
}: Readonly<NextButtonProps>) {
	const { t } = useTranslation('common');
	return (
		<PaginationButton
			ariaLabel={t('pagination.goToNextPage')}
			onClick={createNextPageHandler(onPageChange, currentPage)}
			disabled={currentPage === totalPages}
			size={size}
		>
			{t('pagination.next')}
		</PaginationButton>
	);
}

export interface PrevNextButtonsProps {
	currentPage: number;
	totalPages: number;
	size: StandardSize;
	showPrevNext: boolean;
	onPageChange: (page: number) => void;
}

export function PrevNextButtons({
	currentPage,
	totalPages,
	size,
	showPrevNext,
	onPageChange,
}: Readonly<PrevNextButtonsProps>) {
	if (!showPrevNext) return null;
	return (
		<>
			<PreviousButton currentPage={currentPage} size={size} onPageChange={onPageChange} />
			<NextButton
				currentPage={currentPage}
				totalPages={totalPages}
				size={size}
				onPageChange={onPageChange}
			/>
		</>
	);
}

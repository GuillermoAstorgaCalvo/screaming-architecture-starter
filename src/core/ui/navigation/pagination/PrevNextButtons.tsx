import type { StandardSize } from '@src-types/ui/base';

import { PaginationButton } from './PaginationButton';
import { createNextPageHandler, createPreviousPageHandler } from './PaginationHandlers';

// ============================================================================
// Previous/Next Button Components
// ============================================================================

export interface PreviousButtonProps {
	currentPage: number;
	size: StandardSize;
	onPageChange: (page: number) => void;
}

export function PreviousButton({ currentPage, size, onPageChange }: Readonly<PreviousButtonProps>) {
	return (
		<PaginationButton
			ariaLabel="Go to previous page"
			onClick={createPreviousPageHandler(onPageChange, currentPage)}
			disabled={currentPage === 1}
			size={size}
		>
			Previous
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
	return (
		<PaginationButton
			ariaLabel="Go to next page"
			onClick={createNextPageHandler(onPageChange, currentPage)}
			disabled={currentPage === totalPages}
			size={size}
		>
			Next
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

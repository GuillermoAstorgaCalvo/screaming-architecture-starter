import { ARIA_LABELS } from '@core/constants/aria';
import {
	PAGINATION_BASE_CLASSES,
	PAGINATION_BUTTON_BASE_CLASSES,
	PAGINATION_BUTTON_SIZE_CLASSES,
	PAGINATION_BUTTON_VARIANT_CLASSES,
} from '@core/constants/ui/data';
import {
	PaginationButtons,
	type PaginationButtonsProps,
} from '@core/ui/navigation/pagination/components/PaginationButtons';
import type { StandardSize } from '@src-types/ui/base';
import { type HTMLAttributes, useId } from 'react';
import { twMerge } from 'tailwind-merge';

export function getPaginationClasses(className?: string): string {
	return twMerge(PAGINATION_BASE_CLASSES, className);
}

export function getButtonClasses(size: StandardSize, isActive: boolean): string {
	const sizeClasses = PAGINATION_BUTTON_SIZE_CLASSES[size];
	const variantClasses = isActive
		? PAGINATION_BUTTON_VARIANT_CLASSES.active
		: PAGINATION_BUTTON_VARIANT_CLASSES.inactive;
	return twMerge(PAGINATION_BUTTON_BASE_CLASSES, sizeClasses, variantClasses);
}

export function getVisiblePages(
	currentPage: number,
	totalPages: number,
	maxVisiblePages: number
): number[] {
	const pages: number[] = [];
	const halfVisible = Math.floor(maxVisiblePages / 2);
	let start = Math.max(1, currentPage - halfVisible);
	const end = Math.min(totalPages, start + maxVisiblePages - 1);
	if (end - start < maxVisiblePages - 1) {
		start = Math.max(1, end - maxVisiblePages + 1);
	}
	for (let i = start; i <= end; i++) {
		pages.push(i);
	}
	return pages;
}

export function usePaginationId(paginationId: string | undefined): string {
	const generatedId = useId();
	return paginationId ?? `pagination-${generatedId}`;
}

export interface RenderPaginationNavOptions {
	id: string;
	className: string | undefined;
	buttonProps: PaginationButtonsProps;
	restProps: Omit<HTMLAttributes<HTMLElement>, 'className' | 'id' | 'aria-label'>;
}

/**
 * Renders the pagination navigation element
 */
export function renderPaginationNav(options: RenderPaginationNavOptions) {
	return (
		<nav
			id={options.id}
			aria-label={ARIA_LABELS.PAGINATION}
			className={getPaginationClasses(options.className)}
			{...options.restProps}
		>
			<PaginationButtons {...options.buttonProps} />
		</nav>
	);
}

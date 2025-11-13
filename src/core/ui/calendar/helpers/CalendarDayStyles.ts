/**
 * Get classes for current month days
 */
export function getCurrentMonthClasses(): string {
	return 'text-foreground';
}

/**
 * Get classes for days in other months
 */
export function getOtherMonthClasses(): string {
	return 'text-muted-foreground opacity-50';
}

/**
 * Get state-specific classes (today, selected, range, etc.)
 */
export function getStateClasses({
	isToday,
	isSelected,
	isInRange,
	isRangeStart,
	isRangeEnd,
	disabled,
}: {
	isToday: boolean;
	isSelected?: boolean;
	isInRange?: boolean;
	isRangeStart?: boolean;
	isRangeEnd?: boolean;
	disabled?: boolean;
}): string {
	const classes: string[] = [];
	if (isToday) classes.push('font-semibold ring-2 ring-primary');
	if (isSelected) classes.push('bg-primary text-primary-foreground');
	if (isInRange && !isSelected) classes.push('bg-primary/20');
	if (isRangeStart) classes.push('rounded-l-lg');
	if (isRangeEnd) classes.push('rounded-r-lg');
	if (disabled) classes.push('opacity-50 cursor-not-allowed');
	if (!disabled && !isSelected) classes.push('hover:bg-accent hover:text-accent-foreground');
	return classes.join(' ');
}

/**
 * Get day CSS classes
 */
export function getDayClasses({
	isCurrentMonth,
	isToday,
	isSelected,
	isInRange,
	isRangeStart,
	isRangeEnd,
	disabled,
}: {
	isCurrentMonth: boolean;
	isToday: boolean;
	isSelected?: boolean;
	isInRange?: boolean;
	isRangeStart?: boolean;
	isRangeEnd?: boolean;
	disabled?: boolean;
}): string {
	const baseClasses =
		'aspect-square flex flex-col items-center justify-start p-1 text-sm cursor-pointer transition-colors';
	const monthClasses = isCurrentMonth ? getCurrentMonthClasses() : getOtherMonthClasses();
	const stateParams: Parameters<typeof getStateClasses>[0] = { isToday };
	if (isSelected !== undefined) stateParams.isSelected = isSelected;
	if (isInRange !== undefined) stateParams.isInRange = isInRange;
	if (isRangeStart !== undefined) stateParams.isRangeStart = isRangeStart;
	if (isRangeEnd !== undefined) stateParams.isRangeEnd = isRangeEnd;
	if (disabled !== undefined) stateParams.disabled = disabled;
	const stateClasses = getStateClasses(stateParams);

	return `${baseClasses} ${monthClasses} ${stateClasses}`.trim();
}

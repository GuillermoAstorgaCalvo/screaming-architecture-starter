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
	return 'text-muted-foreground opacity-disabled';
}

/**
 * Get state-specific classes (today, selected, range, etc.)
 */
function isRangeHighlighted(isSelected: boolean, isInRange: boolean): boolean {
	return isInRange && !isSelected;
}

function shouldApplyHover(disabled: boolean, isSelected: boolean): boolean {
	return !disabled && !isSelected;
}

type StateParams = Parameters<typeof getStateClasses>[0];
type OptionalStateKey = Exclude<keyof StateParams, 'isToday'>;

function buildStateParams(
	isToday: boolean,
	...optionals: Array<[OptionalStateKey, boolean | undefined]>
): StateParams {
	const stateParams: Parameters<typeof getStateClasses>[0] = { isToday };

	for (const [key, value] of optionals) {
		if (value === undefined) continue;
		stateParams[key] = value;
	}

	return stateParams;
}

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
	const conditionalClasses: Array<[boolean, string]> = [
		[isToday, 'font-semibold ring-2 ring-primary'],
		[isSelected === true, 'bg-primary text-primary-foreground'],
		[isRangeHighlighted(isSelected === true, isInRange === true), 'bg-primary/20'],
		[isRangeStart === true, 'rounded-l-lg'],
		[isRangeEnd === true, 'rounded-r-lg'],
		[disabled === true, 'opacity-disabled cursor-not-allowed'],
		[
			shouldApplyHover(disabled === true, isSelected === true),
			'hover:bg-accent hover:text-accent-foreground',
		],
	];

	return conditionalClasses
		.filter(([condition]) => condition)
		.map(([, className]) => className)
		.join(' ');
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
		'aspect-square flex flex-col items-center justify-start p-xs text-sm cursor-pointer transition-colors';
	const monthClasses = isCurrentMonth ? getCurrentMonthClasses() : getOtherMonthClasses();
	const stateParams = buildStateParams(
		isToday,
		['isSelected', isSelected],
		['isInRange', isInRange],
		['isRangeStart', isRangeStart],
		['isRangeEnd', isRangeEnd],
		['disabled', disabled]
	);
	const stateClasses = getStateClasses(stateParams);

	return `${baseClasses} ${monthClasses} ${stateClasses}`.trim();
}

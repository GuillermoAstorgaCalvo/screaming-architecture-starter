export interface ShowcasesProps {
	readonly inputValue: string;
	readonly setInputValue: (value: string) => void;
	readonly debouncedValue: string;
	readonly throttledValue: string;
	readonly previousValue: string | undefined;
}

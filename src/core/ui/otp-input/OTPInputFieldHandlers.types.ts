export interface HandlerDependencies {
	length: number;
	onComplete: ((value: string) => void) | undefined;
	getValueArray: () => string[];
	updateValue: (valueArray: string[]) => void;
	focusInput: (index: number) => void;
}

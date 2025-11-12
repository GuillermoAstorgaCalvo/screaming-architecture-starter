import type { KeyboardEvent } from 'react';

export interface HandleAddTagOptions {
	readonly trimmedValue: string;
	readonly tags: readonly string[];
	readonly maxTags: number | undefined;
	readonly allowDuplicates: boolean;
	readonly isControlled: boolean;
	readonly setInternalTags: (tags: string[]) => void;
	readonly onChange: ((tags: string[]) => void) | undefined;
}

export interface CreateKeyDownHandlerOptions {
	readonly inputValue: string;
	readonly tags: readonly string[];
	readonly disabled: boolean | undefined;
	readonly maxTags: number | undefined;
	readonly allowDuplicates: boolean;
	readonly separator: string | RegExp;
	readonly isControlled: boolean;
	readonly setInternalTags: (tags: string[]) => void;
	readonly setInputValue: (value: string) => void;
	readonly onChange: ((tags: string[]) => void) | undefined;
	readonly handleRemoveTag: (tag: string) => void;
}

export interface UseTagInputHandlersOptions {
	readonly inputValue: string;
	readonly tags: readonly string[];
	readonly disabled?: boolean | undefined;
	readonly maxTags?: number | undefined;
	readonly allowDuplicates: boolean;
	readonly separator: string | RegExp;
	readonly isControlled: boolean;
	readonly setInternalTags: (tags: string[]) => void;
	readonly setInputValue: (value: string) => void;
	readonly onChange?: ((tags: string[]) => void) | undefined;
	readonly handleRemoveTag: (tag: string) => void;
}

export interface UseTagInputHandlersReturn {
	readonly handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	readonly handleRemoveTag: (tag: string) => void;
}

export interface HandlerOptionsParams {
	readonly inputValue: string;
	readonly tags: readonly string[];
	readonly disabled: boolean | undefined;
	readonly maxTags: number | undefined;
	readonly allowDuplicates: boolean;
	readonly separator: string | RegExp;
	readonly isControlled: boolean;
	readonly onChange: ((tags: string[]) => void) | undefined;
	readonly handleRemoveTag: (tag: string) => void;
	readonly setInternalTags: (tags: string[]) => void;
	readonly setInputValue: (value: string) => void;
}

import type { FieldState, PrepareFieldStateParams } from './MultiSelectField.types';
import { getSelectedOptions } from './MultiSelectField.utils';
import { createKeyDownHandler, type KeyDownHandlerParams } from './MultiSelectFieldHelpers';

export function prepareFieldState(params: PrepareFieldStateParams): FieldState {
	const selectedOptions = getSelectedOptions(params.options, params.selectedValues);
	const keyDownHandlerParams: KeyDownHandlerParams = {
		selectedValues: params.selectedValues,
		onRemoveChip: params.onRemoveChip,
		handleKeyDown: params.handleKeyDown,
		props: params.inputProps,
	};
	const onKeyDown = createKeyDownHandler(keyDownHandlerParams);
	return { selectedOptions, onKeyDown };
}

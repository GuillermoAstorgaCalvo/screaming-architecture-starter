import { FieldContainer } from '@core/ui/forms/multi-select/components/MultiSelectField.container';
import { FieldInput } from '@core/ui/forms/multi-select/components/MultiSelectField.input';
import { prepareFieldState } from '@core/ui/forms/multi-select/helpers/MultiSelectField.state';
import type {
	MultiSelectFieldComponentProps,
	RenderFieldContentParams,
} from '@core/ui/forms/multi-select/types/MultiSelectField.types';
import { forwardRef, type ReactElement } from 'react';

function renderFieldContent(params: RenderFieldContentParams): ReactElement {
	return (
		<FieldContainer
			selectedOptions={params.selectedOptions}
			onRemoveChip={params.onRemoveChip}
			isOpen={params.isOpen}
			menuId={params.menuId}
		>
			<FieldInput
				ref={params.ref}
				id={params.id}
				disabled={params.disabled}
				required={params.required}
				hasError={params.hasError}
				ariaDescribedBy={params.ariaDescribedBy}
				props={params.inputProps}
				onKeyDown={params.onKeyDown}
			/>
		</FieldContainer>
	);
}

const MultiSelectFieldBody = forwardRef<HTMLInputElement, Readonly<MultiSelectFieldComponentProps>>(
	(props, ref) => {
		const {
			id,
			hasError,
			ariaDescribedBy,
			disabled,
			required,
			props: inputProps,
			selectedValues,
			options,
			onRemoveChip,
			handleKeyDown,
			menuId,
			isOpen = false,
		} = props;
		const { selectedOptions, onKeyDown } = prepareFieldState({
			options,
			selectedValues,
			onRemoveChip,
			handleKeyDown,
			inputProps,
		});
		return renderFieldContent({
			ref,
			id,
			disabled,
			required,
			hasError,
			ariaDescribedBy,
			inputProps,
			onKeyDown,
			selectedOptions,
			onRemoveChip,
			isOpen,
			menuId,
		});
	}
);

MultiSelectFieldBody.displayName = 'MultiSelectFieldBody';

export const MultiSelectField = forwardRef<
	HTMLInputElement,
	Readonly<MultiSelectFieldComponentProps>
>((props, ref) => <MultiSelectFieldBody {...props} ref={ref} />);

MultiSelectField.displayName = 'MultiSelectField';

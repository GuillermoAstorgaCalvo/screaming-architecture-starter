import { CheckboxField } from './CheckboxField';
import { CheckboxLabel } from './CheckboxLabel';
import { CheckboxMessages } from './CheckboxMessages';
import type { CheckboxContentProps, CheckboxFieldWithLabelProps } from './CheckboxTypes';
import { CheckboxContainer, CheckboxWrapper } from './CheckboxWrapper';

function CheckboxFieldWithLabel(props: Readonly<CheckboxFieldWithLabelProps>) {
	const {
		checkboxId,
		checkboxClasses,
		ariaDescribedBy,
		label,
		required,
		disabled,
		checked,
		defaultChecked,
		fieldProps,
	} = props;
	return (
		<CheckboxContainer>
			<CheckboxField
				id={checkboxId}
				className={checkboxClasses}
				ariaDescribedBy={ariaDescribedBy}
				disabled={disabled}
				required={required}
				checked={checked}
				defaultChecked={defaultChecked}
				props={fieldProps}
			/>
			{label && checkboxId ? (
				<CheckboxLabel id={checkboxId} label={label} required={required} />
			) : null}
		</CheckboxContainer>
	);
}

export function CheckboxContent(props: Readonly<CheckboxContentProps>) {
	const { checkboxId, error, helperText, fullWidth } = props;
	return (
		<CheckboxWrapper fullWidth={fullWidth}>
			<CheckboxFieldWithLabel {...props} />
			{checkboxId ? (
				<CheckboxMessages checkboxId={checkboxId} error={error} helperText={helperText} />
			) : null}
		</CheckboxWrapper>
	);
}

import { SwitchContainer } from './SwitchContainer';
import { SwitchField } from './SwitchField';
import { SwitchLabel } from './SwitchLabel';
import { SwitchMessages } from './SwitchMessages';
import type { SwitchContentProps, SwitchFieldWithLabelProps } from './SwitchTypes';
import { SwitchWrapper } from './SwitchWrapper';

function buildSwitchFieldPropsFromLabelProps(props: Readonly<SwitchFieldWithLabelProps>) {
	const {
		switchId,
		switchClasses,
		thumbClasses,
		ariaDescribedBy,
		disabled,
		required,
		checked,
		defaultChecked,
		fieldProps,
	} = props;
	return {
		id: switchId,
		switchClasses,
		thumbClasses,
		ariaDescribedBy,
		disabled,
		required,
		checked,
		defaultChecked,
		props: fieldProps,
	};
}

function SwitchFieldWithLabel(props: Readonly<SwitchFieldWithLabelProps>) {
	const { switchId, label, required } = props;
	const fieldProps = buildSwitchFieldPropsFromLabelProps(props);
	return (
		<SwitchContainer>
			<SwitchField {...fieldProps} />
			{label && switchId ? <SwitchLabel id={switchId} label={label} required={required} /> : null}
		</SwitchContainer>
	);
}

function buildSwitchFieldWithLabelProps(props: Readonly<SwitchContentProps>) {
	const {
		switchId,
		switchClasses,
		thumbClasses,
		ariaDescribedBy,
		label,
		required,
		disabled,
		checked,
		defaultChecked,
		fieldProps,
	} = props;
	return {
		switchId,
		switchClasses,
		thumbClasses,
		ariaDescribedBy,
		label,
		required,
		disabled,
		checked,
		defaultChecked,
		fieldProps,
	};
}

export function SwitchContent(props: Readonly<SwitchContentProps>) {
	const { switchId, error, helperText, fullWidth } = props;
	const fieldWithLabelProps = buildSwitchFieldWithLabelProps(props);
	return (
		<SwitchWrapper fullWidth={fullWidth}>
			<SwitchFieldWithLabel {...fieldWithLabelProps} />
			{switchId ? (
				<SwitchMessages switchId={switchId} error={error} helperText={helperText} />
			) : null}
		</SwitchWrapper>
	);
}

import { SwitchInput } from './SwitchInput';
import type { SwitchFieldProps } from './SwitchTypes';
import { useSwitchField } from './useSwitchField';

export function SwitchField(props: Readonly<SwitchFieldProps>) {
	const fieldState = useSwitchField(props);
	const { id, switchClasses, disabled, thumbClasses, handlers } = fieldState;

	return (
		<label htmlFor={id} className={switchClasses} aria-disabled={disabled} {...handlers.labelProps}>
			<SwitchInput {...fieldState} />
			<span className={thumbClasses} />
		</label>
	);
}

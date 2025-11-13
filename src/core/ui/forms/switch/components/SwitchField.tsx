import { SwitchInput } from '@core/ui/forms/switch/components/SwitchInput';
import { useSwitchField } from '@core/ui/forms/switch/hooks/useSwitchField';
import type { SwitchFieldProps } from '@core/ui/forms/switch/types/SwitchTypes';

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

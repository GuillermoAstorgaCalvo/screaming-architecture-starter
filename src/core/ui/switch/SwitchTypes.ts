import type {
	ChangeEvent,
	HTMLAttributes,
	InputHTMLAttributes,
	MouseEvent,
	ReactNode,
} from 'react';

export type SwitchInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	| 'size'
	| 'type'
	| 'id'
	| 'className'
	| 'disabled'
	| 'required'
	| 'aria-describedby'
	| 'checked'
	| 'defaultChecked'
>;

export interface SwitchWrapperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface SwitchContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
	readonly children: ReactNode;
	readonly className?: string | undefined;
}

export interface SwitchFieldStateConfig {
	readonly checked: boolean | undefined;
	readonly defaultChecked: boolean | undefined;
	readonly disabled: boolean | undefined;
}

export interface SwitchFieldProps {
	readonly id: string | undefined;
	readonly switchClasses: string;
	readonly thumbClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly checked?: boolean | undefined;
	readonly defaultChecked?: boolean | undefined;
	readonly props: Readonly<SwitchInputProps>;
}

export interface SwitchHandlers {
	readonly onChange: ((e: ChangeEvent<HTMLInputElement>) => void) | undefined;
	readonly onClick: ((e: MouseEvent<HTMLInputElement>) => void) | undefined;
	readonly onMouseDown: ((e: MouseEvent<HTMLInputElement>) => void) | undefined;
	readonly labelProps: Readonly<
		| { readonly onMouseDown?: undefined; readonly onClick?: undefined }
		| {
				readonly onMouseDown: (e: MouseEvent<HTMLLabelElement>) => void;
				readonly onClick: (e: MouseEvent<HTMLLabelElement>) => void;
		  }
	>;
}

export interface SwitchHandlersConfig {
	readonly disabled: boolean | undefined;
	readonly getLockedChecked: () => boolean;
	readonly inputProps: Readonly<Pick<SwitchInputProps, 'onChange' | 'onClick' | 'onMouseDown'>>;
}

export interface SwitchMessagesProps {
	readonly switchId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface SwitchLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
	readonly size?: 'sm' | 'md' | 'lg' | undefined;
}

export interface SwitchContentProps {
	readonly switchId: string | undefined;
	readonly switchClasses: string;
	readonly thumbClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
	readonly disabled?: boolean | undefined;
	readonly checked?: boolean | undefined;
	readonly defaultChecked?: boolean | undefined;
	readonly fieldProps: Readonly<SwitchInputProps>;
}

export interface SwitchFieldWithLabelProps
	extends Pick<
		SwitchContentProps,
		| 'switchId'
		| 'switchClasses'
		| 'thumbClasses'
		| 'ariaDescribedBy'
		| 'label'
		| 'required'
		| 'disabled'
		| 'checked'
		| 'defaultChecked'
		| 'fieldProps'
	> {}

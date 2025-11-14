import type {
	NormalizedPromptDialogProps,
	PromptDialogInputType,
	PromptDialogProps,
	PromptDialogVariant,
} from '@core/ui/overlays/prompt-dialog/types/PromptDialogTypes';

function withDefault<T>(value: T | undefined, fallback: T): T {
	return value ?? fallback;
}

function getDefaultVariant(variant: PromptDialogVariant | undefined) {
	return withDefault(variant, 'centered');
}

function getDefaultInputType(inputType: PromptDialogInputType | undefined) {
	return withDefault(inputType, 'text');
}

type StateProps = Pick<
	NormalizedPromptDialogProps,
	'isOpen' | 'onClose' | 'onConfirm' | 'onCancel'
>;

export function normalizePromptDialogProps(
	props: Readonly<PromptDialogProps>
): NormalizedPromptDialogProps {
	return {
		...createStateProps(props),
		...createContentProps(props),
		...createActionLabels(props),
		...createInputProps(props),
		...createLayoutProps(props),
	};
}

function createStateProps(props: Readonly<PromptDialogProps>): StateProps {
	const stateProps: StateProps = {
		isOpen: props.isOpen,
		onClose: props.onClose,
	};

	if (props.onConfirm) {
		stateProps.onConfirm = props.onConfirm;
	}

	if (props.onCancel) {
		stateProps.onCancel = props.onCancel;
	}

	return stateProps;
}

function createContentProps(props: Readonly<PromptDialogProps>) {
	// Label should always be provided by caller with i18n defaults, but ensure it's a string
	if (!props.label) {
		throw new Error('Label must be provided. Use i18n defaults in PromptDialog component.');
	}
	const contentProps = {
		title: props.title,
		label: props.label,
		placeholder: withDefault(props.placeholder, ''),
		defaultValue: withDefault(props.defaultValue, ''),
	} satisfies Pick<NormalizedPromptDialogProps, 'title' | 'label' | 'placeholder' | 'defaultValue'>;

	if (props.validate) {
		return {
			...contentProps,
			validate: props.validate,
		};
	}

	return contentProps;
}

function createActionLabels(props: Readonly<PromptDialogProps>) {
	// Labels should always be provided by caller with i18n defaults, but ensure they're strings
	if (!props.confirmLabel || !props.cancelLabel) {
		throw new Error(
			'Confirm and cancel labels must be provided. Use i18n defaults in PromptDialog component.'
		);
	}
	return {
		confirmLabel: props.confirmLabel,
		cancelLabel: props.cancelLabel,
	};
}

function createInputProps(props: Readonly<PromptDialogProps>) {
	return {
		required: withDefault(props.required, false),
		inputType: getDefaultInputType(props.inputType),
	};
}

function createLayoutProps(props: Readonly<PromptDialogProps>) {
	const layoutProps = {
		size: withDefault(props.size, 'sm'),
		variant: getDefaultVariant(props.variant),
	} satisfies Pick<NormalizedPromptDialogProps, 'size' | 'variant'>;

	if (props.className !== undefined) {
		return {
			...layoutProps,
			className: props.className,
		};
	}

	return layoutProps;
}

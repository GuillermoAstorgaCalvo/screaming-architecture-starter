import { HEADING_LEVELS } from '@core/ui/forms/rich-text-editor/constants/RichTextEditorConstants';
import type { RichTextEditorFieldProps } from '@core/ui/forms/rich-text-editor/types/RichTextEditorTypes';
import StarterKit from '@tiptap/starter-kit';

type StarterKitConfig = Parameters<typeof StarterKit.configure>[0];

export function getHeadingConfig(headingsEnabled?: boolean) {
	return headingsEnabled === false ? false : { levels: HEADING_LEVELS };
}

function disableIfFalse(
	config: StarterKitConfig,
	toolbarValue: boolean | undefined,
	setter: (config: StarterKitConfig) => void
) {
	if (toolbarValue === false && config) {
		setter(config);
	}
}

export function configureTextFeatures(
	config: StarterKitConfig,
	toolbar?: RichTextEditorFieldProps['toolbar']
) {
	disableIfFalse(config, toolbar?.bold, c => {
		if (c) c.bold = false;
	});
	disableIfFalse(config, toolbar?.italic, c => {
		if (c) c.italic = false;
	});
	disableIfFalse(config, toolbar?.strike, c => {
		if (c) c.strike = false;
	});
}

export function configureListFeatures(
	config: StarterKitConfig,
	toolbar?: RichTextEditorFieldProps['toolbar']
) {
	disableIfFalse(config, toolbar?.bulletList, c => {
		if (c) c.bulletList = false;
	});
	disableIfFalse(config, toolbar?.orderedList, c => {
		if (c) c.orderedList = false;
	});
}

export function configureBlockFeatures(
	config: StarterKitConfig,
	toolbar?: RichTextEditorFieldProps['toolbar']
) {
	disableIfFalse(config, toolbar?.blockquote, c => {
		if (c) c.blockquote = false;
	});
	disableIfFalse(config, toolbar?.codeBlock, c => {
		if (c) c.codeBlock = false;
	});
}

export function getStarterKitConfig(toolbar?: RichTextEditorFieldProps['toolbar']) {
	const config: StarterKitConfig = {};
	configureTextFeatures(config, toolbar);
	config.heading = getHeadingConfig(toolbar?.headings);
	configureListFeatures(config, toolbar);
	configureBlockFeatures(config, toolbar);
	return StarterKit.configure(config);
}

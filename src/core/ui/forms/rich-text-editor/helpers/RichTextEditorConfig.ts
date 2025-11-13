import StarterKit from '@tiptap/starter-kit';

import { HEADING_LEVELS } from './RichTextEditorConstants';
import type { RichTextEditorFieldProps } from './RichTextEditorTypes';

type StarterKitConfig = Parameters<typeof StarterKit.configure>[0];

export function getHeadingConfig(headingsEnabled?: boolean) {
	return headingsEnabled === false ? false : { levels: HEADING_LEVELS };
}

export function configureTextFeatures(
	config: StarterKitConfig,
	toolbar?: RichTextEditorFieldProps['toolbar']
) {
	if (toolbar?.bold === false && config) {
		config.bold = false;
	}
	if (toolbar?.italic === false && config) {
		config.italic = false;
	}
	if (toolbar?.strike === false && config) {
		config.strike = false;
	}
}

export function configureListFeatures(
	config: StarterKitConfig,
	toolbar?: RichTextEditorFieldProps['toolbar']
) {
	if (toolbar?.bulletList === false && config) {
		config.bulletList = false;
	}
	if (toolbar?.orderedList === false && config) {
		config.orderedList = false;
	}
}

export function configureBlockFeatures(
	config: StarterKitConfig,
	toolbar?: RichTextEditorFieldProps['toolbar']
) {
	if (toolbar?.blockquote === false && config) {
		config.blockquote = false;
	}
	if (toolbar?.codeBlock === false && config) {
		config.codeBlock = false;
	}
}

export function getStarterKitConfig(toolbar?: RichTextEditorFieldProps['toolbar']) {
	const config: StarterKitConfig = {};
	configureTextFeatures(config, toolbar);
	config.heading = getHeadingConfig(toolbar?.headings);
	configureListFeatures(config, toolbar);
	configureBlockFeatures(config, toolbar);
	return StarterKit.configure(config);
}

import { useRef } from 'react';

import { FileUploadContainer } from './FileUploadContainer';
import {
	prepareFieldContentProps,
	prepareFileUploadFieldProps,
} from './FileUploadContent.builders';
import type { FileUploadFieldContentProps } from './FileUploadContent.types';
import { prepareFileUploadState } from './FileUploadContentHelpers';
import {
	FileUploadDropzoneSection,
	FileUploadLabelSection,
	FileUploadPreviewSection,
} from './FileUploadContentSections';
import { FileUploadInput } from './FileUploadInput';
import type { FileUploadContentProps } from './FileUploadTypes';

/**
 * FileUploadFieldContent - Internal component that renders the field content
 */
function FileUploadFieldContent(props: Readonly<FileUploadFieldContentProps>) {
	const prepared = prepareFieldContentProps(props);
	return (
		<FileUploadContainer>
			<FileUploadLabelSection {...prepared.labelProps} />
			<FileUploadDropzoneSection {...prepared.dropzoneProps} />
			<FileUploadInput {...prepared.inputProps} />
			<FileUploadPreviewSection {...prepared.previewProps} />
		</FileUploadContainer>
	);
}

/**
 * FileUploadFieldWithLabel - Component that manages input ref and click handling
 */
export function FileUploadFieldWithLabel(props: Readonly<FileUploadContentProps>) {
	const { disabled } = props;
	const inputRef = useRef<HTMLInputElement>(null);
	const state = prepareFileUploadState(props);
	const fieldContentProps = prepareFileUploadFieldProps({ props, state });
	const handleDropzoneClick = () => {
		if (disabled || !inputRef.current) return;
		inputRef.current.click();
	};
	return (
		<FileUploadFieldContent
			{...fieldContentProps}
			inputRef={inputRef}
			onClick={handleDropzoneClick}
		/>
	);
}

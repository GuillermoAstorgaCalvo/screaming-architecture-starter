import { FileUploadContainer } from '@core/ui/forms/file-upload/components/FileUploadContainer';
import {
	FileUploadDropzoneSection,
	FileUploadLabelSection,
	FileUploadPreviewSection,
} from '@core/ui/forms/file-upload/components/FileUploadContentSections';
import { FileUploadInput } from '@core/ui/forms/file-upload/components/FileUploadInput';
import {
	prepareFieldContentProps,
	prepareFileUploadFieldProps,
} from '@core/ui/forms/file-upload/helpers/FileUploadContent.builders';
import { prepareFileUploadState } from '@core/ui/forms/file-upload/helpers/FileUploadContentHelpers';
import type { FileUploadFieldContentProps } from '@core/ui/forms/file-upload/types/FileUploadContent.types';
import type { FileUploadContentProps } from '@core/ui/forms/file-upload/types/FileUploadTypes';
import { useRef } from 'react';

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

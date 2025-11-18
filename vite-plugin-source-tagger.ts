import ts from 'typescript';
import type { Plugin } from 'vite';

const SOURCE_ATTRIBUTE_NAME = 'data-source-file';

function shouldProcessFile(id: string): boolean {
	if (!/\.(tsx?|jsx)$/.test(id)) {
		return false;
	}

	if (id.includes('node_modules')) {
		return false;
	}

	return id.includes('src/');
}

function getRelativePath(id: string): string | null {
	const filePath = id.split('?')[0]?.split('#')[0] ?? id;
	const srcIndex = filePath.indexOf('src/');
	if (srcIndex === -1) {
		return null;
	}

	return filePath.slice(srcIndex);
}

function hasSourceAttribute(attributes: ts.JsxAttributes): boolean {
	return attributes.properties.some(
		prop =>
			ts.isJsxAttribute(prop) &&
			ts.isIdentifier(prop.name) &&
			prop.name.escapedText === SOURCE_ATTRIBUTE_NAME
	);
}

function appendSourceAttribute(attributes: ts.JsxAttributes, value: string): ts.JsxAttributes {
	const sourceAttribute = ts.factory.createJsxAttribute(
		ts.factory.createIdentifier(SOURCE_ATTRIBUTE_NAME),
		ts.factory.createStringLiteral(value)
	);

	return ts.factory.createJsxAttributes([...attributes.properties, sourceAttribute]);
}

function getLineNumber(node: ts.Node, sourceFile: ts.SourceFile): number {
	const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
	return line + 1;
}

function createTransformer(
	relativePath: string,
	sourceFile: ts.SourceFile,
	onChange: () => void
): ts.TransformerFactory<ts.SourceFile> {
	return context => {
		const visit: ts.Visitor = node => {
			if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
				if (hasSourceAttribute(node.attributes)) {
					return ts.visitEachChild(node, visit, context);
				}

				const lineNumber = getLineNumber(node, sourceFile);
				const attributeValue = `${relativePath}:${lineNumber}`;
				const updatedAttributes = appendSourceAttribute(node.attributes, attributeValue);

				onChange();

				if (ts.isJsxOpeningElement(node)) {
					const updatedNode = ts.factory.updateJsxOpeningElement(
						node,
						node.tagName,
						node.typeArguments,
						updatedAttributes
					);

					return ts.visitEachChild(updatedNode, visit, context);
				}

				return ts.factory.updateJsxSelfClosingElement(
					node,
					node.tagName,
					node.typeArguments,
					updatedAttributes
				);
			}

			return ts.visitEachChild(node, visit, context);
		};

		return rootNode => ts.visitNode(rootNode, visit) as ts.SourceFile;
	};
}

function transformCode(code: string, relativePath: string): string | null {
	if (!code.trim()) {
		return null;
	}

	const sourceFile = ts.createSourceFile(
		relativePath,
		code,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TSX
	);

	let changeCount = 0;
	const transformer = createTransformer(relativePath, sourceFile, () => {
		changeCount += 1;
	});

	const result = ts.transform(sourceFile, [transformer]);
	const [transformedSource = sourceFile] = result.transformed;

	if (changeCount === 0) {
		result.dispose();
		return null;
	}

	const printer = ts.createPrinter({
		newLine: ts.NewLineKind.LineFeed,
	});

	const output = printer.printFile(transformedSource);
	result.dispose();
	return output;
}

export function sourceTagger(): Plugin {
	return {
		name: 'source-tagger',
		enforce: 'pre',
		apply: 'serve',
		transform(code, id) {
			try {
				if (!code) {
					return null;
				}

				if (!shouldProcessFile(id)) {
					return null;
				}

				const relativePath = getRelativePath(id);
				if (!relativePath) {
					return null;
				}

				const transformedCode = transformCode(code, relativePath);
				if (!transformedCode) {
					return null;
				}

				return {
					code: transformedCode,
					map: null,
				};
			} catch (error) {
				console.warn(`[source-tagger] Failed to process ${id}:`, error);
				return null;
			}
		},
	};
}

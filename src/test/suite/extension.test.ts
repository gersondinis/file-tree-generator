import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import {applyReplacements, split, toCamelCase, toKebabCase, toPascalCase, toScreamingKebabCase, toScreamingSnakeCase, toSnakeCase} from '../../utils';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
	const NAME = 'some example name';
	const TARGET = 'fn$:cN$:cn$:Cn$:Pn$:pn$:kn$:sn$:Kn$:Sn$';

	test('utils', () => {
		assert.deepEqual(split(NAME), ['some', 'example', 'name']);
		assert.strictEqual(toCamelCase(NAME), 'someExampleName');
		assert.strictEqual(toPascalCase(NAME), 'SomeExampleName');
		assert.strictEqual(toKebabCase(NAME), 'some-example-name');
		assert.strictEqual(toSnakeCase(NAME), 'some_example_name');
		assert.strictEqual(toScreamingSnakeCase(NAME), 'SOME_EXAMPLE_NAME');
		assert.strictEqual(toScreamingKebabCase(NAME), 'SOME-EXAMPLE-NAME');
		assert.strictEqual(applyReplacements(TARGET, NAME),
		  `${NAME}:someExampleName:someExampleName:SomeExampleName:SomeExampleName:SomeExampleName:some-example-name:some_example_name:SOME-EXAMPLE-NAME:SOME_EXAMPLE_NAME`
		);
	});
});

import {Uri, workspace, window} from 'vscode';
import {writeFileSync} from 'fs';


export const regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;

export const getComponentNameFromUser = async () => {
  return (await window.showInputBox({
    value: '',
    placeHolder: 'Please enter component name: e.g. `test-component`',
    validateInput: (text: string) => {
      return text.length === 0 || text.match(regex) === null ? 'Please enter a valid value' : null;
    },
    prompt: 'Examples: `test-component`, `test_component`, `test component`',
  }) || '').toLowerCase();
};

export const getDirectoryPathFromUser = async (componentName: string,pathFormRoot: string) => {
  const directoryName = await window.showInputBox({
    value: pathFormRoot,
    placeHolder: "Please enter *relative* directory path for your component: e.g. `/client/src/components/` ",
    ignoreFocusOut: true,
    prompt: `Examples: client/src/components will create a folder ${componentName} and add relevant files in it`,
    valueSelection: [pathFormRoot.length, pathFormRoot.length]
  }) || '';
  return directoryName.endsWith('/') ? directoryName : `${directoryName}/`;
};

export const split = (str: string): RegExpMatchArray => {
  return str.match(regex) || [];
};

export const toKebabCase = (str: string) => {
  return split(str).join('-');
};

export const toSnakeCase = (str: string) => {
  return split(str).join('_');
};

export const toCamelCase = (str: string) => {
  return split(str).reduce((pName, name, idx) => {
    return !idx ? `${pName}${name.toLowerCase()}` : `${pName}${name.toLowerCase().substring(0, 1).toUpperCase()}${name.toLowerCase().substring(1)}`;
  }, '');
};

export const toPascalCase = (str: string) => {
  return split(str).reduce((pName, name) => {
    return `${pName}${name.toLowerCase().substr(0, 1).toUpperCase()}${name.toLowerCase().substr(1)}`;
  }, '');
};

export const toScreamingSnakeCase = (str: string) => {
  return toSnakeCase(str).toUpperCase();
};

export const toScreamingKebabCase = (str: string) => {
  return toKebabCase(str).toUpperCase();
};

export const applyReplacements = (str: string, replacer: string) => {
  const camelCase = toCamelCase(replacer);
  const pascalCase = toPascalCase(replacer);
  const snakeCase = toSnakeCase(replacer);
  const kebabCase = toKebabCase(replacer);
  const screamingSnakeCase = toScreamingSnakeCase(replacer);
  const screamingKebabCase = toScreamingKebabCase(replacer);
  return str
    .replace(/cN\$/g, camelCase)
    .replace(/cn\$/g, camelCase)
    .replace(/Cn\$/g, pascalCase)
    .replace(/Pn\$/gi, pascalCase)
    .replace(/kn\$/g, kebabCase)
    .replace(/Kn\$/g, screamingKebabCase)
    .replace(/sn\$/g, snakeCase)
    .replace(/Sn\$/g, screamingSnakeCase)
    .replace(/fn\$/gi, replacer);
};

export const createComponentDirectory = workspace.fs.createDirectory;

export const createComponentFile = async (componentFilePath: Uri, content: string) => {
  await workspace.fs.writeFile(componentFilePath, new Uint8Array([]));
  writeFileSync(componentFilePath.fsPath, content, 'utf8');
};

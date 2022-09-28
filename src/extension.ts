import {commands, ExtensionContext, Uri, window, workspace} from 'vscode';
import {
  createComponentDirectory,
  createComponentFile,
  getComponentNameFromUser,
  getDirectoryPathFromUser,
  applyReplacements
} from './utils';

interface FileProps {
  fileName: string;
  content: string;
}

export const EXT_SETTINGS_NAME = 'filetreegenerator';
export const EXT_COMMAND_NAME = 'extension.generatefiletree';

export const activate = (context: ExtensionContext) => {
  const disposable = commands.registerCommand(
    EXT_COMMAND_NAME,
    async (uri: Uri) => {
      const currentlyOpenedWorkspace = workspace.workspaceFolders;
      if (!currentlyOpenedWorkspace) {
        return window.showErrorMessage('Open a workspace/project and try again!');
      }

      // Fetch and filter component name
      const componentName = await getComponentNameFromUser();

      if (!componentName) {
        return window.showErrorMessage('Invalid component name! Please try again!');
      }

      // Custom Configuration(s)
      const configurationFiles:
        | FileProps[] = workspace
        .getConfiguration(EXT_SETTINGS_NAME)
        .get('files') || [];

      const configurationComponentDirectoryName:
        | string
        | undefined = workspace
        .getConfiguration(EXT_SETTINGS_NAME)
        .get('directory') || componentName;

      // Component activated via right click from explorer menu
      const pathFromRoot = uri ? `${uri.fsPath}/` : `${currentlyOpenedWorkspace[0].uri.fsPath}/`;

      const componentDirectoryLeafName = applyReplacements(configurationComponentDirectoryName, componentName);

      let componentDirectoryPath = Uri.parse(
        `${pathFromRoot}${componentDirectoryLeafName}`
      );
      // Fetch and create component directory
      if (!uri) {
        const componentParentDirectoryPath = await getDirectoryPathFromUser(
          componentDirectoryLeafName,
          pathFromRoot
        );
        componentDirectoryPath = Uri.parse(
          `${componentParentDirectoryPath}${componentDirectoryLeafName}`
        );
      }

      try {
        await createComponentDirectory(componentDirectoryPath);
      } catch (err) {
        window.showInformationMessage(String(err));
      }

      // Create individual component files
      configurationFiles.forEach(async ({fileName, content}) => {
        const name = fileName ? applyReplacements(fileName, componentName) : `${componentDirectoryLeafName}.tsx`;
        const fileContent = applyReplacements(content, componentName);

        const componentFilePath = Uri.parse(
          componentDirectoryPath.fsPath + `/${name}`
        );
        await createComponentFile(componentFilePath, fileContent);
      });

      window.showInformationMessage(`${componentName} created successfully under ${componentDirectoryPath.fsPath}!`);
    }
  );
  context.subscriptions.push(disposable);
};

export const deactivate = () => {};

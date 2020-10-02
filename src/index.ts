import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

// for adding commad to the command palette
import { ICommandPalette } from '@jupyterlab/apputils';
// for path creation for the document
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
// for adding the command to launcher
import { ILauncher } from '@jupyterlab/launcher';
// for adding the command to main menu
import { IMainMenu } from '@jupyterlab/mainmenu';
// for adding a icon to the launcher menu
import { LabIcon } from '@jupyterlab/ui-components';
// custom icon
import pythonIconStr from '../style/Python-logo-notext.svg';

const FACTORY = 'Editor';
const PALETTE_CATEGORY = 'Extension Examples';

namespace CommandIDs {
  export const createNew = 'jlab-examples:create-new-python-file';
}

const extension: JupyterFrontEndPlugin<void> = {
  id: 'launcher',
  autoStart: true,
  requires: [IFileBrowserFactory],
  optional: [ILauncher, IMainMenu, ICommandPalette],
  activate: (
    app: JupyterFrontEnd,
    browserFactory: IFileBrowserFactory,
    launcher: ILauncher | null,
    menu: IMainMenu | null,
    palette: ICommandPalette | null
  ) => {
    // defining constants 
    const { commands } = app;
    const command = CommandIDs.createNew;
    const icon = new LabIcon({
      name: 'launcher:python-icon',
      svgstr: pythonIconStr
    });
    // to see the app object and what inside it
    console.log('the JupyterLab main application:', app);
    // add custom command to the commandsRegistry
    commands.addCommand(command, {
      label: args => (args['isPalette'] ? 'New Python File' : 'Python File'),
      caption: 'Create a new Python file',
      icon: args => (args['isPalette'] ? null : icon),
      execute: async args => {
        // Get the directory in which the Python file must be created;
        // otherwise take the current filebrowser directory
        const cwd = args['cwd'] || browserFactory.defaultBrowser.model.path;

        // Create a new untitled python file
        const model = await commands.execute('docmanager:new-untitled', {
          path: cwd,
          type: 'file',
          ext: 'py'
        });

        // Open the newly created file with the 'Editor'
        return commands.execute('docmanager:open', {
          path: model.path,
          factory: FACTORY
        });
      }
    });

    // Add the command to the launcher
    if (launcher) {
      launcher.add({
        command,
        category: 'Extension Examples',
        rank: 1
      });
    }

    // Add the command to the palette
    if (palette) {
      palette.addItem({
        command,
        args: { isPalette: true },
        category: PALETTE_CATEGORY
      });
    }

    //Add the command to the menu
    if (menu) {
      menu.fileMenu.newMenu.addGroup([{ command }], 30);
    }
  }
};

export default extension;
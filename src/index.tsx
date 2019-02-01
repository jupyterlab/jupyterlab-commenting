import * as React from 'react';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILabShell
} from '@jupyterlab/application';

import '../style/index.css';

import { ReactWidget } from '@jupyterlab/apputils';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';

import App from './App';

import 'bootstrap/dist/css/bootstrap.css';

/**
 * Activate the extension
 */
function activate(
  app: JupyterFrontEnd,
  labShell: ILabShell,
  comments: IMetadataCommentsService
) {
  const widget = ReactWidget.create(
    <App commentsService={comments} signal={labShell.currentChanged} />
  );
  widget.id = 'jupyterlab-commenting';
  widget.title.iconClass = 'jp-ChatIcon jp-SideBar-tabIcon';
  widget.title.caption = 'Commenting';
  labShell.add(widget, 'right');
}

/**
 * Initialization data for the jupyterlab-commenting extension
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-commenting',
  autoStart: true,
  activate: activate,
  requires: [ILabShell, IMetadataCommentsService]
};

export default extension;

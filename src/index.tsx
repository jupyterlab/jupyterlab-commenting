import * as React from 'react';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILabShell
} from '@jupyterlab/application';

import '../style/index.css';

import { ReactWidget } from '@jupyterlab/apputils';

import { UseSignal } from '@jupyterlab/apputils';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';

import { IActiveDataset } from '@jupyterlab/databus';

import App from './App';

import 'bootstrap/dist/css/bootstrap.css';

/**
 * Activate the extension
 */
function activate(
  app: JupyterFrontEnd,
  activeDataset: IActiveDataset,
  labShell: ILabShell,
  comments: IMetadataCommentsService
) {
  const widget = ReactWidget.create(
    <UseSignal signal={activeDataset.signal}>
      {(sender, args) => {
        try {
          return (
            <App
              commentsService={comments}
              target={activeDataset.active.pathname}
              targetName={activeDataset.active.pathname.split('/').pop()}
            />
          );
        } catch {
          return (
            <App
              commentsService={comments}
              target={undefined}
              targetName={undefined}
            />
          );
        }
      }}
    </UseSignal>
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
  requires: [IActiveDataset, ILabShell, IMetadataCommentsService]
};

export default extension;

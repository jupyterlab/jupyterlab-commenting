import * as React from 'react';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILabShell
} from '@jupyterlab/application';

import '../style/index.css';

import { ReactWidget } from '@jupyterlab/apputils';

import { UseSignal } from '@jupyterlab/apputils';

import { FocusTracker, Widget } from '@phosphor/widgets';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';

import { DocumentWidget } from '@jupyterlab/docregistry';

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
    <UseSignal signal={labShell.currentChanged}>
      {(sender: ILabShell, args: FocusTracker.IChangedArgs<Widget>) => {
        return (
          <App
            commentsService={comments}
            target={args && getPath(args.newValue)}
            targetName={args && getName(args.newValue)}
          />
        );
      }}
    </UseSignal>
  );
  widget.id = 'jupyterlab-commenting';
  widget.title.iconClass = 'jp-ChatIcon jp-SideBar-tabIcon';
  widget.title.caption = 'Commenting';
  labShell.add(widget, 'right');
}

function getName(widget: Widget): string | undefined {
  if (isDocumentWidget(widget)) {
    return widget.context.session.name;
  }
}

function getPath(widget: Widget): string | undefined {
  if (isDocumentWidget(widget)) {
    return widget.context.session.path;
  }
}

function isDocumentWidget(widget: Widget): widget is DocumentWidget {
  return (widget as DocumentWidget).context !== undefined;
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

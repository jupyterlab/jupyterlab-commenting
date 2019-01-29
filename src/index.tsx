import * as React from 'react';

import { JupyterLab, JupyterLabPlugin } from '@jupyterlab/application';

import '../style/index.css';

import { ReactWidget } from '@jupyterlab/apputils';

// import { DocumentRegistry } from '@jupyterlab/docregistry';

import App from './App';

import 'bootstrap/dist/css/bootstrap.css';

function activate(app: JupyterLab) {
  const widget = ReactWidget.create(<App signal={app.shell.currentChanged} />);
  widget.id = 'jupyterlab-commenting';
  widget.title.iconClass = 'jp-ChatIcon jp-SideBar-tabIcon';
  widget.title.caption = 'Commenting';
  app.shell.addToRightArea(widget);
}

const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-commenting',
  autoStart: true,
  activate: activate
};

export default extension;

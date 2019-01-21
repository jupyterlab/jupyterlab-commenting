import * as React from 'react';

import { JupyterLab, JupyterLabPlugin } from '@jupyterlab/application';

import '../style/index.css';

import { ReactWidget } from '@jupyterlab/apputils';

import App from './App';

import 'bootstrap/dist/css/bootstrap.css';

/**
 * Initialization data for the jupyterlab-commenting extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-commenting',
  autoStart: true,
  activate: (app: JupyterLab) => {
    const widget = ReactWidget.create(<App />);
    widget.id = 'jupyterlab-commenting';
    widget.title.iconClass = 'jp-ChatIcon jp-SideBar-tabIcon';
    widget.title.caption = 'Commenting';
    app.shell.addToRightArea(widget);
  }
};

export default extension;

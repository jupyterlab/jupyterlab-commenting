import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the jupyterlab-commenting extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-commenting',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension jupyterlab-commenting is activated!');
  }
};

export default extension;

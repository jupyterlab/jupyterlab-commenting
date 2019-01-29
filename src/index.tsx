import * as React from 'react';

import { JupyterLab, JupyterLabPlugin } from '@jupyterlab/application';

import '../style/index.css';

import { ReactWidget } from '@jupyterlab/apputils';

// import { DocumentRegistry } from '@jupyterlab/docregistry';

import App from './App';

import 'bootstrap/dist/css/bootstrap.css';

/**
 * Activate the extension
 */
function activate(app: JupyterLab) {
  const widget = ReactWidget.create(
    <App data={testData} signal={app.shell.currentChanged} />
  );
  widget.id = 'jupyterlab-commenting';
  widget.title.iconClass = 'jp-ChatIcon jp-SideBar-tabIcon';
  widget.title.caption = 'Commenting';
  app.shell.addToRightArea(widget);
}
/**
 * Initialization data for the jupyterlab-commenting extension
 */

const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-commenting',
  autoStart: true,
  activate: activate
};

/**
 * Data used for testing
 */
const testData: any = {
  s0: {
    startComment: {
      name: 'Jacob Houssian',
      context:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delectus enim, laudantium excepturi corrupti eligendi corporis',
      timestamp: 'Aug 15th 5:30pm',
      photoMain:
        'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png',
      tag: 'Meta',
      resolved: false
    },
    allComments: {
      c0: {
        name: 'Igor Derke',
        context: 'Lorem ipsum',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c1: {
        name: 'Igor Derke',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c2: {
        name: 'Igor Derke',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c3: {
        name: 'Igor Derke',
        context: 'Lorem',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c4: {
        name: 'Igor Derke',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      }
    }
  },
  s1: {
    startComment: {
      name: 'Jacob Houssian',
      context:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delectus enim, laudantium excepturi corrupti eligendi corporis',
      timestamp: 'Aug 15th 5:30pm',
      photoMain:
        'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png',
      tag: 'Meta',
      resolved: true
    },
    allComments: {
      c0: {
        name: 'Igor',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c1: {
        name: 'Igor Derke',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c2: {
        name: 'Igor Derke',
        context: 'Lorem, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      }
    }
  },
  s2: {
    startComment: {
      name: 'Jacob Houssian',
      context:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delectus enim, laudantium excepturi corrupti eligendi corporis',
      timestamp: 'Aug 15th 5:30pm',
      photoMain:
        'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png',
      tag: 'Meta'
    },
    allComments: {}
  }
};

export default extension;

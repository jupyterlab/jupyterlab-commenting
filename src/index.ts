import { JupyterFrontEndPlugin, ILabShell } from '@jupyterlab/application';

import '../style/index.css';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';

import { IActiveDataset, IConverterRegistry } from '@jupyterlab/dataregistry';

import { IMetadataPeopleService } from 'jupyterlab-metadata-service';

import { activate } from './comments/index';

const commentingExtension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-commenting:commentsUI',
  autoStart: true,
  requires: [
    IActiveDataset,
    ILabShell,
    IMetadataCommentsService,
    IMetadataPeopleService,
    IConverterRegistry,
    IEditorTracker
  ],
  activate
};

const plugins: JupyterFrontEndPlugin<any>[] = [commentingExtension];

export default plugins;

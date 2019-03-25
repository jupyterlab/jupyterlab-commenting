import { JupyterFrontEndPlugin, ILabShell } from '@jupyterlab/application';

import '../style/index.css';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';

import { IActiveDataset, IConverterRegistry } from '@jupyterlab/dataregistry';

import { IMetadataPeopleService } from 'jupyterlab-metadata-service';

import { activateCommenting } from './comments/index';

import { activateAnnotations } from './annotations/index';

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
  activate: activateCommenting
};

const annotationExtension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-commenting:annotationWidget',
  autoStart: true,
  requires: [ILabShell, IEditorTracker],
  activate: activateAnnotations
};

const plugins: JupyterFrontEndPlugin<any>[] = [
  commentingExtension,
  annotationExtension
];

export default plugins;

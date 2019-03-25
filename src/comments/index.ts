import { JupyterFrontEnd, ILabShell } from '@jupyterlab/application';

import '../../style/index.css';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';

import { IActiveDataset, IConverterRegistry } from '@jupyterlab/dataregistry';

import { IMetadataPeopleService } from 'jupyterlab-metadata-service';

import { CommentingWidget } from './commenting';

export let commenting: CommentingWidget;

export function activateCommenting(
  app: JupyterFrontEnd,
  activeDataset: IActiveDataset,
  labShell: ILabShell,
  comments: IMetadataCommentsService,
  people: IMetadataPeopleService,
  converters: IConverterRegistry
) {
  commenting = new CommentingWidget(activeDataset, comments, people);

  commenting.id = 'jupyterlab-commenting:commentsUI';
  commenting.title.iconClass = 'jp-ChatIcon jp-SideBar-tabIcon';
  commenting.title.caption = 'Commenting';

  labShell.add(commenting, 'right');
}

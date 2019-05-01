import '../style/index.css';

import {
  JupyterFrontEndPlugin,
  ILabShell,
  JupyterFrontEnd
} from '@jupyterlab/application';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { IDocumentManager } from '@jupyterlab/docmanager';

import {
  IActiveDataset,
  IConverterRegistry,
  ActiveDataset
} from '@jupyterlab/dataregistry';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';
import { IMetadataPeopleService } from 'jupyterlab-metadata-service';

import { CommentingWidget } from './comments/commenting';
import { CommentingStates } from './comments/states';
import { CommentingDataProvider } from './comments/provider';
import { CommentingDataReceiver } from './comments/receiver';
import { CommentingIndicatorHandler } from './comments/indicator';

/**
 * CommentingUI
 */
export let commentingUI: CommentingWidget;

/**
 * Handles commenting overlay for viewers
 */
export let indicatorHandler: CommentingIndicatorHandler;

/**
 * Data receiver / handler
 */
export let receiver: CommentingDataReceiver;

/**
 * State holder for entire extension
 */
export const states: CommentingStates = new CommentingStates();

/**
 * Data provider
 */
export const provider: CommentingDataProvider = new CommentingDataProvider(
  states
);

/**
 * Activate function for commentingUI
 */
export function activate(
  app: JupyterFrontEnd,
  activeDataset: IActiveDataset,
  labShell: ILabShell,
  comments: IMetadataCommentsService,
  people: IMetadataPeopleService,
  converters: IConverterRegistry,
  tracker: IEditorTracker,
  docManager: IDocumentManager
) {
  // Create receiver object
  receiver = new CommentingDataReceiver(
    states,
    comments,
    people,
    activeDataset
  );

  // Create CommentingUI React widget
  commentingUI = new CommentingWidget(provider, receiver);
  commentingUI.id = 'jupyterlab-commenting:commentsUI';
  commentingUI.title.iconClass = 'jp-ChatIcon jp-SideBar-tabIcon';
  commentingUI.title.caption = 'Commenting';

  // Add widget to the right area
  labShell.add(commentingUI, 'right');

  // Create CommentingIndicatorHandler
  indicatorHandler = new CommentingIndicatorHandler(
    app,
    tracker,
    provider,
    receiver,
    labShell,
    docManager
  );

  // Called when ActiveDataset signal is emitted
  receiver.activeUpdated.connect((sender: ActiveDataset, value: URL) => {
    if (value !== null && value.pathname) {
      receiver.setTarget(value.pathname);
      receiver.getAllComments();
    } else {
      receiver.setTarget(undefined);
      receiver.getAllComments();
    }
  });

  // Called when new data is received from a metadata service
  receiver.newDataReceived.connect(() => {
    receiver.getAllComments();
  });

  // Called when commenting is opened or closed
  commentingUI.showSignal.connect((sender, args) => {
    if (args) {
      indicatorHandler.setIndicatorWidget();
    } else {
      indicatorHandler.clearIndicatorWidget();
    }
  });
}

// creates extension
const commentingExtension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-commenting:commentsUI',
  autoStart: true,
  requires: [
    IActiveDataset,
    ILabShell,
    IMetadataCommentsService,
    IMetadataPeopleService,
    IConverterRegistry,
    IEditorTracker,
    IDocumentManager
  ],
  activate
};

const plugins: JupyterFrontEndPlugin<any>[] = [commentingExtension];

export default plugins;

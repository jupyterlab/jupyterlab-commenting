import '../style/index.css';

import {
  JupyterFrontEndPlugin,
  ILabShell,
  JupyterFrontEnd
} from '@jupyterlab/application';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { IDocumentManager } from '@jupyterlab/docmanager';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';

import {
  IActiveDataset,
  IConverterRegistry,
  ActiveDataset
} from '@jupyterlab/dataregistry';

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
    labShell
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

  // Called when state 'target' is changed
  receiver.targetSet.connect(() => {
    // Clear past widget
    indicatorHandler.clearIndicatorWidget();

    if (commentingUI.isVisible) {
      addIndicatorWidget(docManager);
    }
  });

  // Called when new data is received from a metadata service
  receiver.newDataReceived.connect(() => {
    receiver.getAllComments();
  });

  commentingUI.showSignal.connect((sender, args) => {
    if (args) {
      addIndicatorWidget(docManager);
    } else {
      indicatorHandler.clearIndicatorWidget();
    }
  });
}

function addIndicatorWidget(docManager: IDocumentManager): void {
  let path = provider.getState('target') as string;

  let curWidget;

  if (path) {
    curWidget = docManager.findWidget(path);
  }

  // If widget is active, add indicator
  if (curWidget) {
    let context = docManager.contextForWidget(curWidget);

    const promise = context.ready;
    promise.then(() => {
      if (
        context.contentsModel.type === 'file' &&
        context.contentsModel.mimetype
      ) {
        receiver.setState({ curDocType: context.contentsModel.mimetype });
      } else if (context.contentsModel.type === 'notebook') {
        receiver.setState({ curDocType: context.contentsModel.type });
      } else {
        receiver.setState({ curDocType: '' });
      }
      indicatorHandler.addIndicatorWidget();
    });
  }
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

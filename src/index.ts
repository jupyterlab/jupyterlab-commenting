import '../style/index.css';

import {
  JupyterFrontEndPlugin,
  ILabShell,
  JupyterFrontEnd
} from '@jupyterlab/application';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { IDocumentManager } from '@jupyterlab/docmanager';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

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
  labShell: ILabShell,
  tracker: IEditorTracker,
  docManager: IDocumentManager,
  browserFactory: IFileBrowserFactory
) {
  // Create receiver object
  receiver = new CommentingDataReceiver(states, browserFactory);

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
    provider,
    receiver,
    labShell,
    docManager
  );

  // Tracks active file open
  labShell.currentChanged.connect((sender, args) => {
    const widget = args.newValue;

    if (widget === null) {
      receiver.setTarget(undefined);
      receiver.getAllComments();
    } else {
      const context = docManager.contextForWidget(widget);

      if (!context) {
        receiver.setTarget(undefined);
        receiver.getAllComments();
        return;
      }
      receiver.setTarget(context.path);
      receiver.getAllComments();
    }
  });

  // Called when new data is received from comments service
  receiver.newDataReceived.connect(() => {
    receiver.getAllComments();
  });
}

// creates extension
const commentingExtension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-commenting:commentsUI',
  autoStart: true,
  requires: [ILabShell, IEditorTracker, IDocumentManager, IFileBrowserFactory],
  activate
};

const plugins: JupyterFrontEndPlugin<any>[] = [commentingExtension];

export default plugins;

import '../style/index.css';

import {
  JupyterFrontEndPlugin,
  ILabShell,
  JupyterFrontEnd
} from '@jupyterlab/application';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';

import {
  IActiveDataset,
  IConverterRegistry,
  ActiveDataset
} from '@jupyterlab/dataregistry';

import { IMetadataPeopleService } from 'jupyterlab-metadata-service';
import { CommentingWidget } from './comments/commenting';
import { TargetHandler } from './comments/targetHandler';
import { CommentingStates } from './comments/states';
import { CommentingDataProvider } from './comments/provider';
import { CommentingDataReceiver } from './comments/receiver';

/**
 * CommentingUI
 */
export let commentingUI: CommentingWidget;

/**
 * Handles commenting overlay for viewers
 */
export let targetHandler: TargetHandler;

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
  tracker: IEditorTracker
) {
  // Create receiver object
  receiver = new CommentingDataReceiver(
    states,
    comments,
    people,
    activeDataset
  );

  // Init commenting states in state holder
  initCommentingUIStates();

  // Connect signals
  receiver.targetUpdated.connect(targetUpdated);
  receiver.newDataReceived.connect(newDataReceived);

  // Create CommentingUI React widget
  commentingUI = new CommentingWidget(provider, receiver);
  commentingUI.id = 'jupyterlab-commenting:commentsUI';
  commentingUI.title.iconClass = 'jp-ChatIcon jp-SideBar-tabIcon';
  commentingUI.title.caption = 'Commenting';

  // Add widget to the right area
  labShell.add(commentingUI, 'right');

  // Create target handler widget
  targetHandler = new TargetHandler(app, labShell, tracker);
  targetHandler.id = 'jupyterlab-commenting:target-handler';
  targetHandler.activate();
}

/**
 * Sets the initial states for commentingUI
 */
function initCommentingUIStates(): void {
  receiver.setState({
    creator: {},
    curTargetHasThreads: false,
    expandedCard: ' ',
    myThreads: [],
    newThreadActive: false,
    newThreadFile: ' ',
    replyActiveCard: ' ',
    response: {},
    pastTarget: '',
    showResolved: true,
    sortState: 'latest',
    userSet: false,
    target: ' '
  });
}

/**
 * Called when target is updated each time activeDataset signal is emitted
 *
 * @param sender - signal sender
 * @param value - signal params
 */
function targetUpdated(sender: ActiveDataset, value: URL): void {
  try {
    receiver.setTarget(value.pathname);
    receiver.getAllComments();
  } catch (e) {
    receiver.setTarget(undefined);
    receiver.getAllComments();
  }
}

/**
 * Called when new data received signal from receiver is emitted
 */
function newDataReceived(): void {
  receiver.getAllComments();
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
    IEditorTracker
  ],
  activate
};

const plugins: JupyterFrontEndPlugin<any>[] = [commentingExtension];

export default plugins;

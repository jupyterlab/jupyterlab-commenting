import { JupyterFrontEnd, ILabShell } from '@jupyterlab/application';

import { IDocumentManager } from '@jupyterlab/docmanager';

import { NotebookPanel, Notebook } from '@jupyterlab/notebook';

import { DocumentRegistry, IDocumentWidget } from '@jupyterlab/docregistry';

import { ICellModel, Cell } from '@jupyterlab/cells';

import { Message } from '@phosphor/messaging';

import { Widget } from '@phosphor/widgets';

import { commentingUI, indicatorHandler } from '..';
import { IndicatorWidget } from './indicator';
import { CommentingDataProvider } from './provider';
import { CommentingDataReceiver } from './receiver';
import { CommentingWidget } from './commenting';
import { ICommentThread } from './service';

export class NotebookIndicators extends Widget implements IndicatorWidget {
  constructor(
    app: JupyterFrontEnd,
    labShell: ILabShell,
    provider: CommentingDataProvider,
    receiver: CommentingDataReceiver,
    docManager: IDocumentManager,
    path: string
  ) {
    super();
    this._app = app;
    this._labShell = labShell;
    this._provider = provider;
    this._receiver = receiver;
    this._docManager = docManager;
    this._path = path;
    this._app;

    this._panelWidget = this._docManager.findWidget(
      this._path
    ) as IDocumentWidget<NotebookPanel, DocumentRegistry.IModel>;

    this._createThreadButtons = new Array<HTMLDivElement>();
    this._threadIndicatorButtons = new Array<HTMLDivElement>();
  }

  /**
   * Called when the activate message is sent to the widget
   *
   * @param msg Type: Message - activate message
   */
  protected onActivateRequest(msg: Message): void {
    this.addNewCommentButtons();
    this.putIndicators();

    // Handles indicator when a new thread is created or canceled
    commentingUI.newThreadCreated.connect(this.handleNewThreadCreated, this);

    let panel = this._panelWidget.content as any; // Should be NotebookPanel

    panel.stateChanged.connect(this.updateCommentIndicators, this);
    panel.activeCellChanged.connect(this.handleCellChange, this);
  }

  /**
   * Called when the close message is sent to the widget
   *
   * @param msg Type: Message - close message
   */
  protected onCloseRequest(msg: Message): void {
    this.dispose();
  }

  dispose(): void {
    // Disconnect signals
    commentingUI.newThreadCreated.disconnect(this.handleNewThreadCreated, this);

    let panel = this._panelWidget.content as any; // Should be NotebookPanel
    panel.stateChanged.disconnect(this.updateCommentIndicators, this);
    panel.activeCellChanged.disconnect(this.handleCellChange, this);

    this.removeNewCommentButtons();
    this.removeAllCommentIndicators();

    this._createThreadButtons = [];
    this._threadIndicatorButtons = [];

    super.dispose();
  }

  /**
   * Sets the commentingUI widget to show and expands the right area
   */
  openCommenting(): void {
    commentingUI.show();
    this._labShell.expandRight();
  }

  /**
   * Opens the new thread card of the commentingUI widget
   */
  openNewThread(): void {
    if (!commentingUI.isVisible) {
      this.openCommenting();
    }
    commentingUI.setNewThreadActive(true);
  }

  /**
   * Focus a thread based on the id
   *
   * @param threadId Type: string - threadID of thread to expand
   */
  focusThread(threadId: string): void {
    if (this._provider.getState('expandedCard') !== threadId) {
      commentingUI.setExpandedCard(threadId);
      this.putIndicators();
    }
  }

  /**
   * Scrolls an indicator into view based on the given thread id
   *
   * @param threadId - Type: string - id of thread to scroll
   */
  scrollIntoView(threadId: string): void {}

  /**
   * Adds all indicators to the current widget
   */
  putIndicators(): void {
    this.removeAllCommentIndicators();

    let panel = this._panelWidget.content as any; // Should be NotebookPanel

    let cells = panel.model.cells;

    for (let i = 0; i < cells.length; i++) {
      this.addCommentIndicator(i);
    }
  }

  /**
   * Gets the amount of threads the given cell has related to it
   *
   * @param index Type: number - index of cell to get amount to threads for
   *
   * @return Type: number - number of comment threads cell has related to it
   */
  getAmountOfThreads(index: number): number {
    let panel = this._panelWidget.content as any; // Should be NotebookPanel

    let cells = panel.model.cells;
    let cell = cells.get(index);

    let metadata = cell.metadata;

    if (!metadata.has('comments')) {
      return 0;
    }

    let threads = cell.metadata.get('comments');

    return threads.length;
  }

  /**
   * Handles clearing all the indicators from the current widget
   */
  clearAllIndicators(): void {}

  /**
   * Adds new/create new comment buttons to the notebook widget
   */
  addNewCommentButtons(): void {
    this.removeNewCommentButtons();
    let panel = this._panelWidget.content as any;
    let cellNodes = panel.layout.parent.node.childNodes;

    cellNodes.forEach((child: ChildNode, index: number) => {
      let button = document.createElement('div');

      button.className =
        panel.activeCellIndex === index
          ? this._provider.getState('newThreadActive')
            ? this._cellIndexClicked
              ? 'jp-Icon jp-ChatIconBlue'
              : 'jp-Icon jp-NbCommentIcon'
            : 'jp-Icon jp-NbCommentIcon'
          : '';

      button.hidden = panel.activeCellIndex !== index;

      button.style.minWidth = '20px';
      button.style.minHeight = '20px';
      button.style.backgroundSize = '20px';
      button.style.padding = '4px';
      button.style.cssFloat = 'right';
      button.style.cursor = this._provider.getState('newThreadActive')
        ? ''
        : 'pointer';

      button.id =
        'nb-commenting-create-button-' + this._uniqueId() + '/' + index;

      // Cell element node
      let insertPosition =
        child.firstChild.nextSibling.childNodes[1].childNodes[1].childNodes[0];

      insertPosition.before(button);

      button.addEventListener('click', () => {
        if (this._provider.getState('newThreadActive')) {
          return;
        }

        this.openNewThread();

        let panel = this._panelWidget.content as any; // Should be NotebookPanel

        let id = button.id.split('/').pop();
        this._cellIndexClicked = Number(id);

        panel.activeCellIndex = this._cellIndexClicked;

        button.className = 'jp-Icon jp-ChatIconBlue';
        button.style.cursor = '';
      });

      this._createThreadButtons.push(button);
    });
  }

  handleCellChange(sender, args): void {
    let panel = this._panelWidget.content as any;

    this._createThreadButtons.forEach(element => {
      let id = this._getCellIndexFromId(element.id);

      if (
        !this._provider.getState('newThreadActive') &&
        panel.activeCellIndex === id
      ) {
        element.hidden = false;
        element.className = 'jp-Icon jp-NbCommentIcon';
      }

      if (panel.activeCellIndex !== id) {
        element.className = '';
        element.hidden = true;
      }
    });
  }

  /**
   * Removes all comment buttons from the notebook widget
   */
  removeNewCommentButtons(): void {
    this._createThreadButtons.forEach(element => {
      let id = element.id;
      let button = document.getElementById(id);

      if (button) {
        button.remove();
      }
    });
    this._createThreadButtons = [];
  }

  /**
   * Creates a new comment indicator for the given cell
   *
   * @param index Type: number - cell index to add indicator to
   */
  addCommentIndicator(index: number): void {
    let threadAmount = this.getAmountOfThreads(index);

    if (threadAmount <= 0) {
      return;
    }

    let panel = this._panelWidget.content as any; // Should be NotebookPanel

    let cellNodes: NodeListOf<ChildNode> = panel.layout.parent.node.childNodes;

    let cell: ChildNode = cellNodes[index];

    let indicator = document.createElement('div');

    indicator.className = 'jp-Icon jp-ChatIcon';
    indicator.style.minWidth = '20px';
    indicator.style.minHeight = '20px';
    indicator.style.backgroundSize = '20px';
    indicator.style.padding = '10px';
    indicator.style.cssFloat = 'right';
    indicator.style.textAlign = 'center';
    indicator.style.fontWeight = 'bold';

    indicator.id = 'nb-commenting-indicator-' + this._uniqueId() + '/' + index;

    cell.childNodes[1].childNodes[1].firstChild.appendChild(indicator);

    this._threadIndicatorButtons.push(indicator);
  }

  /**
   * Removes all comment indicators from the notebook widget
   */
  removeAllCommentIndicators(): void {
    this._threadIndicatorButtons.forEach(element => {
      element.remove();
    });

    this._threadIndicatorButtons.length = 0;
  }

  /**
   * Removes all elements then adds new elements
   */
  updateCommentIndicators(sender?, args?): void {
    this.putIndicators();
    this.addNewCommentButtons();
  }

  /**
   * Called when a new thread is created or canceled on creation
   *
   * @param sender CommentingWidget - the commentingUI
   * @param args - true if new thread created, false if canceled
   */
  handleNewThreadCreated(sender: CommentingWidget, args: boolean): void {
    if (args && this._cellIndexClicked) {
      let panel = this._panelWidget.content as any; // Should be NotebookPanel

      let cell: ICellModel = panel.model.cells.get(this._cellIndexClicked);

      let nextCommentId = this._receiver
        .getLatestCommentId()
        .split('/')
        .pop();

      let latestCommentId = 'anno/' + (Number(nextCommentId) - 1);

      let threads = this._provider.getState('response') as Array<
        ICommentThread
      >;

      let thread = {};

      threads.forEach(curThread => {
        if (curThread.id === latestCommentId) {
          thread = curThread;
        }
      });

      let metadata = cell.metadata;

      if (metadata.has('comments')) {
        let curThreads = metadata.get('comments') as Array<{}>;

        curThreads.push(thread);

        cell.metadata.set('comments', curThreads);
      } else {
        cell.metadata.set('comments', [thread]);
      }

      this.putIndicators();
      this._cellIndexClicked = undefined;
    } else {
      this._cellIndexClicked = undefined;
    }
    this.updateCommentIndicators();
  }

  /**
   * Removes all comment metadata from the notebook
   */
  removeAllCommentMetadata(): void {
    let panel = this._panelWidget.content as any; // Should be NotebookPanel

    let cells = panel.model.cells;

    for (let i = 0; i < cells.length; i++) {
      cells.get(i).metadata.delete('comments');
    }
  }

  /**
   * Creates a unique id
   *
   * @return Type: string - id as a string
   */
  private _uniqueId(): string {
    return Math.random()
      .toString(36)
      .substr(2, 16);
  }

  private _getCellIndexFromId(id: string): number {
    return Number(id.split('/').pop());
  }

  private _app: JupyterFrontEnd;
  private _labShell: ILabShell;
  private _receiver: CommentingDataReceiver;
  private _provider: CommentingDataProvider;
  private _docManager: IDocumentManager;
  private _path: string;
  private _panelWidget: IDocumentWidget<NotebookPanel, DocumentRegistry.IModel>;
  private _createThreadButtons: Array<HTMLDivElement>;
  private _threadIndicatorButtons: Array<HTMLDivElement>;
  private _cellIndexClicked: number;
}

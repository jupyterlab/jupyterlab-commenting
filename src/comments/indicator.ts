import { ILabShell, JupyterFrontEnd } from '@jupyterlab/application';

import { IDocumentManager } from '@jupyterlab/docmanager';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { Widget } from '@phosphor/widgets';

import { CommentingDataProvider } from './provider';
import { TextEditorIndicator } from './text';
import { NotebookIndicators } from './notebook';
import { CommentingDataReceiver } from './receiver';

/**
 * This class handles setting and clearing indicator widgets
 */
export class CommentingIndicatorHandler {
  private _app: JupyterFrontEnd;
  private _tracker: IEditorTracker;
  private _provider: CommentingDataProvider;
  private _receiver: CommentingDataReceiver;
  private _labShell: ILabShell;
  private _docManager: IDocumentManager;

  private _activeIndicatorWidget: Widget & IndicatorWidget;

  constructor(
    app: JupyterFrontEnd,
    tracker: IEditorTracker,
    provider: CommentingDataProvider,
    receiver: CommentingDataReceiver,
    labShell: ILabShell,
    docManager: IDocumentManager
  ) {
    this._app = app;
    this._provider = provider;
    this._labShell = labShell;
    this._tracker = tracker;
    this._receiver = receiver;
    this._docManager = docManager;

    // Called when state 'target' is changed
    this._receiver.targetSet.connect(this.handleTargetChanged, this);
  }

  /**
   * Handles determining which indicator widget to add to the opened widget
   */
  setIndicatorWidget(): void {
    const path = this._provider.getState('target') as string;

    if (!path) {
      return;
    }

    const curWidget = this._docManager.findWidget(path);

    // If widget is active, add indicator
    if (curWidget) {
      const context = this._docManager.contextForWidget(curWidget);

      if (context) {
        const promise = context.ready;
        promise
          .then(() => {
            if (
              context.contentsModel.type === 'file' &&
              context.contentsModel.mimetype
            ) {
              this.addTextEditorIndicatorWidget();
            } else if (context.contentsModel.type === 'notebook') {
              this.addNotebookIndicatorWidget();
            } else {
              return;
            }
          })
          .catch(err => {
            console.error('Add indicator error', err);
          });
      }
    }
  }

  /**
   * Adds indicator widget for text editor
   */
  addTextEditorIndicatorWidget(): void {
    this.clearIndicatorWidget();
    const target = this._provider.getState('target') as string;

    if (target) {
      // Indicator Widget for text editor
      this._activeIndicatorWidget = new TextEditorIndicator(
        this._app,
        this._labShell,
        this._tracker,
        this._provider,
        this._receiver,
        this._docManager,
        target
      );
      this._activeIndicatorWidget.id =
        'jupyterlab-commenting:indicator:' + target;
      this._activeIndicatorWidget.activate();
    }
  }

  /**
   * Adds the indicator widget for notebooks
   */
  addNotebookIndicatorWidget(): void {
    // Indicator widget for notebooks
    this._activeIndicatorWidget = new NotebookIndicators(
      this._app,
      this._labShell,
      this._provider,
      this._receiver
    );
    this._activeIndicatorWidget.id = 'jupyterlab-commenting:indicator:';
    this._activeIndicatorWidget.activate();
  }

  /**
   * If the active indicator widget exists, a 'close-request' message is sent,
   * then dispose is called.
   *
   * @return Type: boolean - true if close and dispose complete and widget exists, false otherwise
   */
  clearIndicatorWidget(): boolean {
    if (this._activeIndicatorWidget) {
      this._activeIndicatorWidget.close();
      this._activeIndicatorWidget.dispose();
      return true;
    }
    return false;
  }

  /**
   * Handles when the target changes
   */
  handleTargetChanged() {
    // Clear past widget
    this.setIndicatorWidget();
  }

  /**
   * @return - Type: IndicatorWidget & Widget - the active indicator widget
   */
  get activeIndicatorWidget() {
    return this._activeIndicatorWidget;
  }
}

/**
 * Interface for indicator widgets to implements
 */
export abstract class IndicatorWidget {
  /**
   * Opens the commentingUI panel
   */
  abstract openCommenting(): void;

  /**
   * Opens commentingUI panel with new thread window active
   */
  abstract openNewThread(): void;

  /**
   * Focus the given thread
   *
   * @param threadId Type: string - Thread ID to focus
   */
  abstract focusThread(threadId: string): void;

  /**
   * Scrolls indicator into view
   */
  abstract scrollIntoView(threadId: string): void;

  /**
   * Puts indicators on the current widget
   */
  abstract putIndicators(): void;

  /**
   * Handle clearing indicators if needed
   */
  abstract clearAllIndicators(): void;
}

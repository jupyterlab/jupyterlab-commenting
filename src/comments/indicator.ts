import { ILabShell, JupyterFrontEnd } from '@jupyterlab/application';

import { IDocumentManager } from '@jupyterlab/docmanager';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { Widget } from '@phosphor/widgets';

import { CommentingDataProvider } from './provider';
import { TextEditorIndicator } from './text';
import { NotebookIndicators } from './notebook';
import { CommentingDataReceiver } from './receiver';
import { commentingUI } from '..';

// Active indicator widget
export let activeIndicatorWidget: Widget & IndicatorWidget;

export class CommentingIndicatorHandler {
  private _app: JupyterFrontEnd;
  private _tracker: IEditorTracker;
  private _provider: CommentingDataProvider;
  private _receiver: CommentingDataReceiver;
  private _labShell: ILabShell;
  private _docManager: IDocumentManager;

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

  handleTargetChanged() {
    // Clear past widget
    this.clearIndicatorWidget();
    if (commentingUI.isVisible) {
      this.setIndicatorWidget();
    }
  }

  setIndicatorWidget(): void {
    const path = this._provider.getState('target') as string;
    const curWidget = this._docManager.findWidget(path);

    if (activeIndicatorWidget) {
      activeIndicatorWidget.clearAllIndicators();
    }

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

  addTextEditorIndicatorWidget(): void {
    const target = this._provider.getState('target') as string;

    // Indicator Widget for text editor
    activeIndicatorWidget = new TextEditorIndicator(
      this._app,
      this._labShell,
      this._tracker,
      this._provider,
      this._receiver,
      this._docManager,
      target
    );
    activeIndicatorWidget.id = 'jupyterlab-commenting:target-handler';
    activeIndicatorWidget.activate();
  }

  addNotebookIndicatorWidget(): void {
    // Indicator widget for notebooks
    activeIndicatorWidget = new NotebookIndicators(
      this._app,
      this._labShell,
      this._provider,
      this._receiver
    );
    activeIndicatorWidget.id = 'jupyterlab-commenting:target-handler';
    activeIndicatorWidget.activate();
  }

  clearIndicatorWidget(): void {
    if (activeIndicatorWidget) {
      activeIndicatorWidget.close();
      activeIndicatorWidget.dispose();
    }
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

/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2019 Project Jupyter Contributors.
 * Distributed under the terms of the 3-Clause BSD License.
 */

import { ILabShell, JupyterFrontEnd } from '@jupyterlab/application';

import { IDocumentManager } from '@jupyterlab/docmanager';

import { Widget } from '@lumino/widgets';

import { CommentingDataProvider } from './provider';
import { TextEditorIndicator } from './text';
import { NotebookIndicators } from './notebook';
import { CommentingDataReceiver } from './receiver';

/**
 * This class handles setting and clearing indicator widgets
 */
export class CommentingIndicatorHandler {
  constructor(
    app: JupyterFrontEnd,
    provider: CommentingDataProvider,
    receiver: CommentingDataReceiver,
    labShell: ILabShell,
    docManager: IDocumentManager
  ) {
    this._app = app;
    this._provider = provider;
    this._labShell = labShell;
    this._receiver = receiver;
    this._docManager = docManager;

    // Called when state 'target' is changed
    this._receiver.targetSet.connect(this.handleTargetChanged, this);

    // Save comments before refresh
    window.addEventListener('beforeunload', evt => {
      let path = this._provider.getState('target') as string;

      this._receiver.saveComments(path);

      evt.returnValue = '';

      return null;
    });
  }

  /**
   * Handles determining which indicator widget to add to the opened widget
   */
  setIndicatorWidget(): void {
    let path = this._provider.getState('target') as string;

    if (!path) {
      return;
    }

    this._receiver.saveComments(path);

    const curWidget = this._docManager.findWidget(path);

    // If widget is active, add indicator
    if (curWidget) {
      const context = this._docManager.contextForWidget(curWidget);

      // Connect to save signal of widget to save comments on file save
      context.saveState.connect((sender, args) => {
        if (args === 'started') {
          this._receiver.saveComments(path);
        }
      }, this);

      if (context) {
        const promise = context.ready;
        promise
          .then(() => {
            this.clearIndicatorWidget();
            if (
              context.contentsModel.type === 'file' &&
              context.contentsModel.mimetype &&
              context.contentsModel.mimetype.indexOf('text') > -1
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
    const target = this._provider.getState('target') as string;

    if (target) {
      // Indicator Widget for text editor
      this._activeIndicatorWidget = new TextEditorIndicator(
        this._app,
        this._labShell,
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
    const target = this._provider.getState('target') as string;

    // Indicator widget for notebooks
    this._activeIndicatorWidget = new NotebookIndicators(
      this._app,
      this._labShell,
      this._provider,
      this._receiver,
      this._docManager,
      target
    );
    this._activeIndicatorWidget.id =
      'jupyterlab-commenting:indicator:' + target;
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
    const target = this._provider.getState('target') as string;
    // Clear past widget
    this.clearIndicatorWidget();
    this.setIndicatorWidget();
    this._receiver.saveComments(target);
  }

  /**
   * @return - Type: IndicatorWidget & Widget - the active indicator widget
   */
  get activeIndicatorWidget() {
    return this._activeIndicatorWidget;
  }

  private _app: JupyterFrontEnd;
  private _provider: CommentingDataProvider;
  private _receiver: CommentingDataReceiver;
  private _labShell: ILabShell;
  private _docManager: IDocumentManager;
  private _activeIndicatorWidget: Widget & IndicatorWidget;
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

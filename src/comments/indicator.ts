import { ILabShell, JupyterFrontEnd } from '@jupyterlab/application';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { Widget } from '@phosphor/widgets';

import { CommentingDataProvider } from './provider';
import { TextEditorIndicator } from './text';
import { NotebookIndicators } from './notebook';
import { CommentingDataReceiver } from './receiver';

// Active indicator widget
export let activeIndicatorWidget: Widget & IndicatorWidget;

export class CommentingIndicatorHandler {
  private _app: JupyterFrontEnd;
  private _tracker: IEditorTracker;
  private _provider: CommentingDataProvider;
  private _receiver: CommentingDataReceiver;
  private _labShell: ILabShell;

  constructor(
    app: JupyterFrontEnd,
    tracker: IEditorTracker,
    provider: CommentingDataProvider,
    receiver: CommentingDataReceiver,
    labShell: ILabShell
  ) {
    this._app = app;
    this._provider = provider;
    this._labShell = labShell;
    this._tracker = tracker;
    this._receiver = receiver;

    this._provider.getState;

    this._labShell;
  }

  /**
   * Adds an indicator widget based on the current document viewer open
   */
  addIndicatorWidget(): void {
    let type: string = this._provider.getState('curDocType') as string;

    if (type.indexOf('text') > -1) {
      // Indicator Widget for text editor
      activeIndicatorWidget = new TextEditorIndicator(
        this._app,
        this._labShell,
        this._tracker,
        this._provider,
        this._receiver
      );
      activeIndicatorWidget.id = 'jupyterlab-commenting:target-handler';
      activeIndicatorWidget.activate();
    } else if (type === 'notebook') {
      // Indicator widget for notebooks
      activeIndicatorWidget = new NotebookIndicators(
        this._app,
        this._labShell,
        this._provider,
        this._receiver
      );
      activeIndicatorWidget.id = 'jupyterlab-commenting:target-handler';
      activeIndicatorWidget.activate();
    } else {
      this.clearIndicatorWidget();
    }
  }

  clearIndicatorWidget(): void {
    if (activeIndicatorWidget && !activeIndicatorWidget.isDisposed) {
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
   * Puts indicators on the current widget
   */
  abstract putIndicators(): void;

  /**
   * Handle clearing indicators if needed
   */
  abstract clearIndicators(): void;
}

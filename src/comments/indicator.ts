import { ILabShell, JupyterFrontEnd } from '@jupyterlab/application';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { CommentingDataProvider } from './provider';
import { TextEditorIndicator } from './text';
import { Widget } from '@phosphor/widgets';
import { NotebookIndicators } from './notebook';

export class CommentingIndicatorHandler {
  private _app: JupyterFrontEnd;
  private _tracker: IEditorTracker;
  private _provider: CommentingDataProvider;
  private _labShell: ILabShell;
  private _activeWidget: Widget;

  constructor(
    app: JupyterFrontEnd,
    tracker: IEditorTracker,
    provider: CommentingDataProvider,
    labShell: ILabShell
  ) {
    this._app = app;
    this._provider = provider;
    this._labShell = labShell;
    this._tracker = tracker;

    this._provider.getState;

    this._labShell;
  }

  addIndicatorWidget(): void {
    let type: string = this._provider.getState('curDocType') as string;

    if (type.indexOf('text') > -1) {
      // Indicator Widget for text editor
      this._activeWidget = new TextEditorIndicator(
        this._app,
        this._labShell,
        this._tracker,
        this._provider
      );
      this._activeWidget.id = 'jupyterlab-commenting:target-handler';
      this._activeWidget.activate();
    } else if (type === 'notebook') {
      // Indicator widget for notebooks
      this._activeWidget = new NotebookIndicators();
      this._activeWidget.id = 'jupyterlab-commenting:target-handler';
      this._activeWidget.activate();
    } else {
      this.clearIndicatorWidget();
      console.log('No indicators');
    }
  }

  clearIndicatorWidget(): void {
    if (this._activeWidget && !this._activeWidget.isDisposed) {
      this._activeWidget.close();
      this._activeWidget.dispose();
    }
  }
}

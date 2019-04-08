import { JupyterFrontEnd, ILabShell } from '@jupyterlab/application';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { CodeMirrorEditor } from '@jupyterlab/codemirror';

import { Widget } from '@phosphor/widgets';

import { Message } from '@phosphor/messaging';

import { ITextIndicator, INotebookIndicator } from '../types';
import { commentingUI } from '../index';
import { CommentingDataProvider } from './provider';
import { IndicatorWidget } from './indicator';
import { CommentingDataReceiver } from './receiver';
import { JSONValue } from '@phosphor/coreutils';

/**
 * Indicator widget for the text editor viewer / widget
 */
export class TextEditorIndicator extends Widget implements IndicatorWidget {
  private _app: JupyterFrontEnd;
  private _labShell: ILabShell;
  private _tracker: IEditorTracker;
  private _receiver: CommentingDataReceiver;
  private _provider: CommentingDataProvider;

  // setInterval for querying new indicators
  private _periodicUpdate: number;

  constructor(
    app: JupyterFrontEnd,
    labShell: ILabShell,
    tracker: IEditorTracker,
    provider: CommentingDataProvider,
    receiver: CommentingDataReceiver
  ) {
    super();
    this._app = app;
    this._labShell = labShell;
    this._tracker = tracker;
    this._provider = provider;
    this._receiver = receiver;

    this.putIndicators = this.putIndicators.bind(this);
  }

  protected onActivateRequest(msg: Message): void {
    console.log('TEXT INDICATORS ACTIVE');
    if (!this._app.commands.hasCommand('jupyterlab-commenting:createComment')) {
      this.createContextMenu();
    }
    this.putIndicators();
    this._periodicUpdate = setInterval(this.putIndicators, 1000);
  }

  protected onCloseRequest(msg: Message): void {
    clearInterval(this._periodicUpdate);
    this.clearIndicators();
    console.log('TEXT INDICATORS CLOSE');
  }

  openCommenting(): void {
    commentingUI.show();
    this._labShell.expandRight();
  }

  openNewThread(): void {
    if (!commentingUI.isVisible) {
      this.openCommenting();
    }
    commentingUI.setNewThreadActive(true);
  }

  focusThread(threadId: string): void {
    throw new Error('Method not implemented.');
  }

  getCurrentIndicatorInfo(): ITextIndicator | INotebookIndicator {
    return this._provider.getState('latestIndicatorInfo');
  }

  putIndicators(): void {
    let response = this._provider.getState('response') as any;
    for (let index in response.data.annotationsByTarget) {
      this.addHighlight(
        response.data.annotationsByTarget[index].indicator,
        false
      );
    }
  }

  clearIndicators(): void {
    let response = this._provider.getState('response') as any;
    for (let index in response.data.annotationsByTarget) {
      this.addHighlight(
        response.data.annotationsByTarget[index].indicator,
        true
      );
    }
  }

  addHighlight(selection: ITextIndicator, remove: boolean): void {
    if (selection === null) {
      return;
    }
    let widget = this._tracker.currentWidget;
    let editor = widget.content.editor as CodeMirrorEditor;

    let startLine =
      selection.start.line <= selection.end.line
        ? selection.start.line
        : selection.end.line;
    let endLine =
      selection.end.line >= selection.start.line
        ? selection.end.line
        : selection.start.line;
    let startCol =
      selection.start.column < selection.end.column
        ? selection.start.column
        : selection.end.column;
    let endCol =
      selection.end.column > selection.start.column
        ? selection.end.column
        : selection.start.column;

    if (!remove) {
      editor.doc.markText(
        { line: startLine, ch: startCol },
        { line: endLine, ch: endCol },
        { css: 'background-color: yellow;' }
      );
    } else {
      editor.doc.markText(
        { line: startLine, ch: startCol },
        { line: endLine, ch: endCol },
        { css: 'background-color: transparent;' }
      );
    }
  }

  createContextMenu(): void {
    this._app.commands.addCommand('jupyterlab-commenting:createComment', {
      label: 'Comment',
      isVisible: () => {
        let doc = this._provider.getState('curDocType') as string;
        return doc.indexOf('text') > -1;
      },
      execute: () => {
        this.addHighlight(this.getSelection(), false);
        this.openNewThread();
      }
    });

    this._app.contextMenu.addItem({
      command: 'jupyterlab-commenting:createComment',
      selector: 'body',
      rank: Infinity
    });
  }

  getSelection(): ITextIndicator {
    let widget = this._tracker.currentWidget;
    let editor = widget.content.editor as CodeMirrorEditor;

    let selection = editor.getSelection();
    let curSelected: ITextIndicator;

    if (
      selection.start.line === selection.end.line &&
      selection.start.column === selection.end.column
    ) {
      curSelected = {
        end: {
          line: selection.end.line,
          column: editor.getLine(selection.start.line).length
        },
        start: { line: selection.start.line, column: 0 }
      };
    } else {
      curSelected = {
        end: {
          line: selection.end.line,
          column: selection.end.column
        },
        start: {
          line: selection.start.line,
          column: selection.start.column
        }
      };
    }
    this._receiver.setState({
      latestIndicatorInfo: (curSelected as object) as JSONValue
    });
    return curSelected;
  }
}

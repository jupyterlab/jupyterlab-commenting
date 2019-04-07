import { JupyterFrontEnd, ILabShell } from '@jupyterlab/application';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { CodeMirrorEditor } from '@jupyterlab/codemirror';

import { Widget } from '@phosphor/widgets';

import { Message } from '@phosphor/messaging';

import { IAnnotationSelection } from '../types';

import { commentingUI } from '../index';
import { CommentingDataProvider } from './provider';

export class TextEditorIndicator extends Widget {
  private _app: JupyterFrontEnd;
  private _labShell: ILabShell;
  private _tracker: IEditorTracker;

  private _provider: CommentingDataProvider;

  // private _periodicUpdate: number;

  constructor(
    app: JupyterFrontEnd,
    labShell: ILabShell,
    tracker: IEditorTracker,
    provider: CommentingDataProvider
  ) {
    super();
    this._app = app;
    this._labShell = labShell;
    this._tracker = tracker;
    this._provider = provider;

    this._provider;
    // this.markSelections = this.markSelections.bind(this);
  }

  protected onActivateRequest(msg: Message): void {
    console.log('TEXT INDICATORS ACTIVE');
    if (!this._app.commands.hasCommand('jupyterlab-commenting:createComment')) {
      this.createContextMenu();
    }
    // this._periodicUpdate = setInterval(this.markSelections, 1000);
  }

  protected onCloseRequest(msg: Message): void {
    // clearInterval(this._periodicUpdate);
    console.log('TEXT INDICATORS CLOSE');
  }

  createContextMenu(): void {
    this._app.commands.addCommand('jupyterlab-commenting:createComment', {
      label: 'Comment',
      isVisible: () => {
        let doc = this._provider.getState('curDocType') as string;
        return doc.indexOf('text') > -1;
      },
      execute: () => {
        let widget = this._tracker.currentWidget;
        let editor = widget.content.editor as CodeMirrorEditor;

        let selection = editor.getSelection();

        if (
          selection.start.line === selection.end.line &&
          selection.start.column === selection.end.column
        ) {
          editor.doc.markText(
            { line: selection.start.line, ch: 0 },
            {
              line: selection.end.line,
              ch: editor.getLine(selection.start.line).length
            },
            { className: 'jp-commenting-highlight' }
          );
        } else {
          this.addHighlight(selection);
        }
        this.addCommentBoxOverlay();
      }
    });

    this._app.contextMenu.addItem({
      command: 'jupyterlab-commenting:createComment',
      selector: 'body',
      rank: Infinity
    });
  }

  // markSelections(): void {
  //   commenting.commentService
  //     .queryAllByTarget(commenting.getTarget())
  //     .then((response: any) => {
  //       for (let index in response.data.annotationsByTarget) {
  //         this.addHighlight(response.data.annotationsByTarget[index].selection);
  //       }
  //     });
  // }

  addCommentBoxOverlay(): void {
    this._labShell.expandRight();
    commentingUI.setNewThreadActive(true);
  }

  addHighlight(selection: IAnnotationSelection): void {
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

    editor.doc.markText(
      { line: startLine, ch: startCol },
      { line: endLine, ch: endCol },
      { className: 'jp-commenting-highlight' }
    );
  }

  getSelection(): IAnnotationSelection {
    let widget = this._tracker.currentWidget;
    let editor = widget.content.editor as CodeMirrorEditor;

    let selection = editor.getSelection();

    if (
      selection.start.line === selection.end.line &&
      selection.start.column === selection.end.column
    ) {
      // TODO: if same start and end -> whole line needs marked
    }

    let curSelected: IAnnotationSelection = {
      end: {
        line: selection.end.line,
        column: selection.end.column
      },
      start: {
        line: selection.start.line,
        column: selection.start.column
      }
    };

    return curSelected;
  }
}

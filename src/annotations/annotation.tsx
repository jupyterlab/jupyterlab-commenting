import * as React from 'react';

import { JupyterFrontEnd, ILabShell } from '@jupyterlab/application';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { CodeMirrorEditor } from '@jupyterlab/codemirror';

import { Widget } from '@phosphor/widgets';

import { Message } from '@phosphor/messaging';

import { ReactWidget, UseSignal } from '@jupyterlab/apputils';

import { commenting } from '../comments/index';

import { NewThreadCard } from '../comments/components/NewThreadCard';

export class Annotation extends Widget {
  app: JupyterFrontEnd;
  labShell: ILabShell;
  tracker: IEditorTracker;

  private _commentOverlay: ReactWidget;

  constructor(
    app: JupyterFrontEnd,
    labShell: ILabShell,
    tracker: IEditorTracker
  ) {
    super();
    this.app = app;
    this.labShell = labShell;
    this.tracker = tracker;
  }

  protected onActivateRequest(msg: Message): void {
    this.createContextMenu();
  }

  protected onUpdateRequest(): void {}

  createContextMenu(): void {
    this.app.commands.addCommand('jupyterlab-commenting:createComment', {
      label: 'Comment',
      isEnabled: () => true,
      execute: () => {
        let widget = this.tracker.currentWidget;
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
        this.addCommentBoxOverlay();
      }
    });

    this.app.contextMenu.addItem({
      command: 'jupyterlab-commenting:createComment',
      selector: 'body',
      rank: Infinity
    });
  }

  addCommentBoxOverlay(): void {
    let widget = this.tracker.currentWidget;
    let editor = widget.content.editor as CodeMirrorEditor;

    let coords = editor.cursorCoords(true, 'window');

    this._commentOverlay = ReactWidget.create(
      <UseSignal signal={commenting.newThreadActive}>
        {(sender, args) => {
          if (args === undefined) {
            return (
              <div
                style={{
                  position: 'fixed',
                  zIndex: 100,
                  top: coords.top,
                  left: coords.left + 300,
                  bottom: coords.bottom
                }}
              >
                <NewThreadCard
                  creator={{
                    id: '0',
                    name: 'Jacob Houssian',
                    image: 'a'
                  }}
                  putThread={commenting.putThread}
                  setNewThreadActive={commenting.setNewThreadActive}
                />
              </div>
            );
          } else {
            return <span />;
          }
        }}
      </UseSignal>
    );

    this._commentOverlay.id = 'jupyterlab-commenting:commentBox';

    this.labShell.add(this._commentOverlay, 'top');
  }
}

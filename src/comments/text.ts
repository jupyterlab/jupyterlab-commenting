import { JupyterFrontEnd, ILabShell } from '@jupyterlab/application';

import { IEditorTracker, FileEditor } from '@jupyterlab/fileeditor';

import { CodeMirrorEditor } from '@jupyterlab/codemirror';

import { IDocumentManager } from '@jupyterlab/docmanager';

import { Widget } from '@phosphor/widgets';

import { Message } from '@phosphor/messaging';

import { TextMarker } from 'codemirror';

import { ITextIndicator } from '../types';
import { commentingUI } from '../index';
import { CommentingDataProvider } from './provider';
import { IndicatorWidget } from './indicator';
import { CommentingDataReceiver } from './receiver';
import { CommentingWidget } from './commenting';
import { IDocumentWidget, DocumentRegistry } from '@jupyterlab/docregistry';
import { JSONValue } from '@phosphor/coreutils';

/**
 * Indicator widget for the text editor viewer / widget
 */
export class TextEditorIndicator extends Widget implements IndicatorWidget {
  private _app: JupyterFrontEnd;
  private _labShell: ILabShell;
  private _tracker: IEditorTracker;
  private _docManager: IDocumentManager;
  private _path: string;

  // Commenting Data receiver
  private _receiver: CommentingDataReceiver;

  // Commenting Data provider
  private _provider: CommentingDataProvider;

  private _indicators: { [key: string]: TextMarker };

  // Code editor widget
  private _editorWidget: IDocumentWidget<FileEditor, DocumentRegistry.IModel>;

  // Code mirror editor
  private _editor: CodeMirrorEditor;

  constructor(
    app: JupyterFrontEnd,
    labShell: ILabShell,
    tracker: IEditorTracker,
    provider: CommentingDataProvider,
    receiver: CommentingDataReceiver,
    docManager: IDocumentManager,
    path: string
  ) {
    super();
    this._app = app;
    this._labShell = labShell;
    this._tracker = tracker;
    this._provider = provider;
    this._receiver = receiver;
    this._docManager = docManager;
    this._path = path;

    this._tracker;

    this._indicators = {};

    this._editorWidget = this._docManager.findWidget(
      this._path
    ) as IDocumentWidget<FileEditor, DocumentRegistry.IModel>;

    this._editor = this._editorWidget.content.editor as CodeMirrorEditor;

    this.putIndicators = this.putIndicators.bind(this);
  }

  /**
   * Called when the activate message is sent to the widget
   *
   * @param msg Type: Message - activate message
   */
  protected onActivateRequest(msg: Message): void {
    if (!this._app.commands.hasCommand('jupyterlab-commenting:createComment')) {
      this.createContextMenu();
    }
    this.putIndicators();

    // Handles indicator when a new thread is created or canceled
    commentingUI.newThreadCreated.connect(this.handleNewThreadCreated, this);

    // Called when comments are queried
    this._receiver.commentsQueried.connect(this.putIndicators, this);

    // Called when new data is received from a metadata service
    this._receiver.newDataReceived.connect(this.putIndicators, this);
  }

  /**
   * Called when the close message is sent to the widget
   */
  protected onCloseRequest(msg: Message): void {
    // Disconnect signals
    commentingUI.newThreadCreated.disconnect(this.handleNewThreadCreated, this);
    this._receiver.commentsQueried.disconnect(this.putIndicators, this);
    this._receiver.newDataReceived.disconnect(this.putIndicators, this);

    this.clearAllIndicators();
    this._indicators = {};
  }

  dispose(): void {
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
    }
  }

  /**
   * Scrolls an indicator into view based on the given thread id
   *
   * @param threadId - Type: string - id of thread to scroll into view
   */
  scrollIntoView(threadId: string): void {
    const indicator = this._indicators[threadId];

    if (indicator) {
      const position = indicator.find();
      if (position) {
        this._editor.editor.scrollIntoView(position.from, 500);
      }
    }
  }

  /**
   * Adds all indicators to the current widget
   */
  putIndicators(): void {
    const response = this._provider.getState('response') as any;
    const expandedCard = this._provider.getState('expandedCard') as string;

    if (response && response.data && response.data.annotationsByTarget) {
      const annotations = response.data.annotationsByTarget;

      if (!this._provider.getState('newThreadActive')) {
        this._editor.doc.getAllMarks().forEach(mark => {
          mark.clear();
        });
      }

      for (let index in annotations) {
        let indicator = annotations[index].indicator;
        let resolved = annotations[index].resolved;
        let id = annotations[index].id;

        if (indicator !== null && indicator) {
          if (id !== expandedCard && !resolved) {
            this.createIndicator(indicator, id, 'highlight');
          } else if (id !== expandedCard && resolved) {
            this.createIndicator(indicator, id, 'clear');
          } else if (id === expandedCard) {
            this.createIndicator(
              indicator,
              id,
              'highlight',
              'rgba(255, 255, 0, 0.7)'
            );
          }
        }
      }
    }
  }

  /**
   * Adds indicators to text editor
   *
   * @param selection - Type: ITextIndicator - selection to highlight
   * @param type - Type: string - type of indicator
   * @param color - Type: string - color of indicator, any CSS color
   */
  createIndicator(
    selection: ITextIndicator,
    threadId: string,
    type: 'highlight' | 'clear',
    color?: string
  ): void {
    if (!color) {
      color = 'rgba(255, 255, 0, 0.25)';
    }

    if (type === 'highlight') {
      this._indicators[threadId] = this._editor.doc.markText(
        { line: selection.start.line, ch: selection.start.column },
        { line: selection.end.line, ch: selection.end.column },
        { css: `background-color: ${color};` }
      );

      this._indicators[threadId].on('beforeCursorEnter', () => {
        if (threadId && this._editor.doc.getSelection().length <= 1) {
          this.focusThread(threadId);
        }
      });
    }
    if (type === 'clear') {
      this._indicators[threadId] = this._editor.doc.markText(
        { line: selection.start.line, ch: selection.start.column },
        { line: selection.end.line, ch: selection.end.column },
        { css: 'background-color: transparent; border-bottom: 0;' }
      );

      this._indicators[threadId].on('beforeCursorEnter', () => {
        return;
      });

      this._indicators[threadId].clear();
    }
  }

  /**
   * Handles clearing all the indicators from the current widget
   */
  clearAllIndicators(): void {
    Object.keys(this._indicators).forEach(key => {
      this._indicators[key].clear();
    });
  }

  /**
   * Creates the context menu button "Comment"
   */
  createContextMenu(): void {
    this._app.commands.addCommand('jupyterlab-commenting:createComment', {
      label: 'Comment',
      isVisible: () => {
        return true;
      },
      execute: () => {
        const widget = this._tracker.currentWidget;
        const editor = widget.content.editor as CodeMirrorEditor;

        const selection = this.getSelection();

        this._receiver.setState({
          latestIndicatorInfo: (selection as object) as JSONValue
        });

        const from = {
          line: selection.start.line,
          ch: selection.start.column
        };

        const to = {
          line: selection.end.line,
          ch: selection.end.column
        };

        editor.doc.markText(from, to, {
          css: `border-bottom: 2px solid rgba(0, 0, 255, 0.5);`
        });

        this.openNewThread();
      }
    });

    this._app.contextMenu.addItem({
      command: 'jupyterlab-commenting:createComment',
      selector: 'body',
      rank: Infinity
    });
  }

  handleNewThreadCreated(sender: CommentingWidget, args: boolean) {
    this._receiver.setState({
      latestIndicatorInfo: undefined
    });
  }

  /**
   * Gets the current selection range from the codemirror editor.
   * If the selection range start and end values are the same,
   * it returns the range of the entire line
   *
   * @return Type: ITextIndicator
   */
  getSelection(): ITextIndicator {
    const widget = this._tracker.currentWidget;
    const editor = widget.content.editor as CodeMirrorEditor;

    let selection = editor.getSelection();
    let curSelected: ITextIndicator;

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

    if (startLine === endLine && startCol === endCol) {
      curSelected = {
        end: {
          line: endLine,
          column: editor.getLine(selection.start.line).length
        },
        start: { line: startLine, column: 0 }
      };
    } else {
      curSelected = {
        end: {
          line: endLine,
          column: endCol
        },
        start: {
          line: startLine,
          column: startCol
        }
      };
    }
    return curSelected;
  }
}

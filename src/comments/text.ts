import { JupyterFrontEnd, ILabShell } from '@jupyterlab/application';

import { IEditorTracker } from '@jupyterlab/fileeditor';

import { CodeMirrorEditor } from '@jupyterlab/codemirror';

import { JSONValue } from '@phosphor/coreutils';

import { Widget } from '@phosphor/widgets';

import { Message } from '@phosphor/messaging';

import { ITextIndicator } from '../types';
import { commentingUI } from '../index';
import { CommentingDataProvider } from './provider';
import { IndicatorWidget } from './indicator';
import { CommentingDataReceiver } from './receiver';

/**
 * Indicator widget for the text editor viewer / widget
 */
export class TextEditorIndicator extends Widget implements IndicatorWidget {
  private _app: JupyterFrontEnd;
  private _labShell: ILabShell;
  private _tracker: IEditorTracker;

  // Commenting Data receiver
  private _receiver: CommentingDataReceiver;

  // Commenting Data provider
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
    this._periodicUpdate = setInterval(this.putIndicators, 1000);

    // Handles indicator when a new thread is created or canceled
    // TODO: add disconnect signal when widget is closed / disposed
    commentingUI.newThreadCreated.connect((sender, args) => {
      if (!this._provider.getState('latestIndicatorInfo')) {
        return;
      }

      if (args) {
        this.addIndicator(
          (this._provider.getState(
            'latestIndicatorInfo'
          ) as object) as ITextIndicator,
          'clear-underline'
        );
        this._receiver.setState({ latestIndicatorInfo: '' });
      } else {
        this.addIndicator(
          (this._provider.getState(
            'latestIndicatorInfo'
          ) as object) as ITextIndicator,
          'clear'
        );
      }
    });
  }

  /**
   * Called when the close message is sent to the widget
   */
  protected onCloseRequest(msg: Message): void {
    clearInterval(this._periodicUpdate);
    this.clearIndicators();
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
    commentingUI.setExpandedCard(threadId);
  }

  /**
   * Adds all indicators to the current widget
   */
  putIndicators(): void {
    let response = this._provider.getState('response') as any;
    for (let index in response.data.annotationsByTarget) {
      this.addIndicator(
        response.data.annotationsByTarget[index].indicator,
        'highlight'
      );
    }
  }

  /**
   * Handles clearing all the indicators from the current widget
   */
  clearIndicators(): void {
    let response = this._provider.getState('response') as any;
    for (let index in response.data.annotationsByTarget) {
      this.addIndicator(
        response.data.annotationsByTarget[index].indicator,
        'clear'
      );
    }
  }

  /**
   *
   * @param selection - Type: ITextIndicator - selection to highlight
   * @param type - Type: string - type of indicator
   * @param color - Type: string - color of indicator, any CSS color
   */
  addIndicator(
    selection: ITextIndicator,
    type:
      | 'highlight'
      | 'underline'
      | 'clear'
      | 'clear-highlight'
      | 'clear-underline',
    color?: string
  ): void {
    if (selection === null) {
      return;
    }

    if (!color) {
      color = 'yellow';
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

    switch (type) {
      case 'highlight':
        editor.doc.markText(
          { line: startLine, ch: startCol },
          { line: endLine, ch: endCol },
          { css: `background-color: ${color};` }
        );
        break;
      case 'underline':
        editor.doc.markText(
          { line: startLine, ch: startCol },
          { line: endLine, ch: endCol },
          {
            css: `border-bottom: 2px solid ${color};`
          }
        );
        break;
      case 'clear':
        editor.doc.markText(
          { line: startLine, ch: startCol },
          { line: endLine, ch: endCol },
          { css: 'background-color: transparent; border-bottom: 0;' }
        );
        break;
      case 'clear-highlight':
        editor.doc.markText(
          { line: startLine, ch: startCol },
          { line: endLine, ch: endCol },
          { css: 'background-color: transparent;' }
        );
        break;
      case 'clear-underline':
        editor.doc.markText(
          { line: startLine, ch: startCol },
          { line: endLine, ch: endCol },
          { css: 'border: 0;' }
        );
        break;
      default:
        break;
    }
  }

  /**
   * Creates the context menu button "Comment"
   */
  createContextMenu(): void {
    this._app.commands.addCommand('jupyterlab-commenting:createComment', {
      label: 'Comment',
      isVisible: () => {
        let doc = this._provider.getState('curDocType') as string;
        return doc.indexOf('text') > -1;
      },
      execute: () => {
        this.addIndicator(this.getSelection(), 'underline', 'orange');
        this.openNewThread();
      }
    });

    this._app.contextMenu.addItem({
      command: 'jupyterlab-commenting:createComment',
      selector: 'body',
      rank: Infinity
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

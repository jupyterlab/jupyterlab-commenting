/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2019 Project Jupyter Contributors.
 * Distributed under the terms of the 3-Clause BSD License.
 */

import { JupyterFrontEnd, ILabShell } from '@jupyterlab/application';

import { FileEditor } from '@jupyterlab/fileeditor';

import { CodeMirrorEditor } from '@jupyterlab/codemirror';

import { IDocumentManager } from '@jupyterlab/docmanager';

import { IDocumentWidget, DocumentRegistry } from '@jupyterlab/docregistry';

import { Widget } from '@lumino/widgets';

import { Message } from '@lumino/messaging';

import { IDisposable } from '@lumino/disposable';

import { TextMarker, Editor, EditorChangeLinkedList } from 'codemirror';

import { ITextIndicator, CommentIndicator } from './service';
import { commentingUI, indicatorHandler } from '../index';
import { CommentingDataProvider } from './provider';
import { IndicatorWidget } from './indicator';
import { CommentingDataReceiver } from './receiver';
import { CommentingWidget } from './commenting';

/**
 * Indicator widget for the text editor viewer / widget
 */
export class TextEditorIndicator extends Widget implements IndicatorWidget {
  constructor(
    app: JupyterFrontEnd,
    labShell: ILabShell,
    provider: CommentingDataProvider,
    receiver: CommentingDataReceiver,
    docManager: IDocumentManager,
    path: string
  ) {
    super();
    this._app = app;
    this._labShell = labShell;
    this._provider = provider;
    this._receiver = receiver;
    this._docManager = docManager;
    this._path = path;

    // TextEditorIndicator object store, the CodeMirrorEditor markers
    this._indicators = {};

    // An ordered list of
    this._markerIdOrdered = [];

    // Load in indicator values from the comment service
    let loadIndicators = this._receiver.getAllIndicatorValues();

    this._indicatorValues = loadIndicators ? loadIndicators : {};

    // Sets the initial state of commenting UI opened
    this._commentingUIOpened = commentingUI.isVisible;

    // The widget that contains the text editor
    this._editorWidget = this._docManager.findWidget(
      this._path
    ) as IDocumentWidget<FileEditor, DocumentRegistry.IModel>;

    // The CodeMirrorEditor object
    this._editor = this._editorWidget.content.editor as CodeMirrorEditor;

    // If no editor dispose of this
    if (!this._editor) {
      this.dispose();
    }

    this.handleEditorBeforeChange = this.handleEditorBeforeChange.bind(this);
    this.handleEditorOnChange = this.handleEditorOnChange.bind(this);
    this.handleNewThreadCreated = this.handleNewThreadCreated.bind(this);
    this.updateMarkerIdOrdered = this.updateMarkerIdOrdered.bind(this);
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

    // Called when commenting is opened or closed
    commentingUI.showSignal.connect(this.handleCommentingUIShow, this);

    // Handles indicator when a new thread is created or canceled
    commentingUI.newThreadCreated.connect(this.handleNewThreadCreated, this);

    // Updates indicators when the back button is pressed
    commentingUI.backPressed.connect(this.putIndicators, this);

    // Handler for updating when new commenting values are received
    this._receiver.threadResolved.connect(this.handleThreadResolved, this);

    this._editor.editor.on('beforeChange', this.handleEditorBeforeChange);
    this._editor.editor.on('change', this.handleEditorOnChange);
  }

  /**
   * Called when the close message is sent to the widget
   */
  protected onCloseRequest(msg: Message): void {
    this._receiver.setAllIndicatorValues(this._path, this._indicatorValues);
    this.dispose();
  }

  dispose(): void {
    // Disconnect signals
    commentingUI.newThreadCreated.disconnect(this.handleNewThreadCreated, this);
    commentingUI.showSignal.disconnect(this.handleCommentingUIShow, this);
    commentingUI.backPressed.disconnect(this.putIndicators, this);

    this._receiver.threadResolved.disconnect(this.handleThreadResolved, this);

    this._editor.editor.off('beforeChange', this.handleEditorBeforeChange);
    this._editor.editor.off('change', this.handleEditorOnChange);

    if (this._createCommentCommand) {
      this._createCommentCommand.dispose();
    }

    if (this._commentCommandMenuItem) {
      this._commentCommandMenuItem.dispose();
    }

    this.clearAllIndicators();
    this._indicators = {};
    this._indicatorValues = {};
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
   * @param threadId - Type: string - id of thread to scroll
   */
  scrollIntoView(threadId: string): void {
    const indicator = this._indicators[threadId];

    if (indicator) {
      const position = indicator.find();
      if (position) {
        this._editor.editor.scrollIntoView(position.to, 500);
      }
    }
    this.putIndicators();
  }

  /**
   * Adds all indicators to the current widget
   */
  putIndicators(sender?: any, args?: any): void {
    let target = this._provider.getState('target') as string;

    // If paths are different, handle the target change
    if (this._path !== target) {
      this.clearAllIndicators();
      indicatorHandler.handleTargetChanged();
      return;
    }

    const expandedCard = this._provider.getState('expandedCard') as string;

    // If the new thread card is not active
    if (!this._provider.getState('newThreadActive')) {
      this._editor.doc.getAllMarks().forEach(mark => {
        mark.clear();
      });

      Object.keys(this._indicatorValues).forEach(key => {
        let indicator = this._indicatorValues[key] as ITextIndicator;
        let id = key;

        if (id !== expandedCard && this._commentingUIOpened) {
          this.createIndicator(indicator, id, 'highlight');
        } else if (!this._commentingUIOpened) {
          this.createIndicator(indicator, id, 'clear');
        } else if (id === expandedCard) {
          this.createIndicator(
            indicator,
            id,
            'highlight',
            'rgba(255, 255, 0, 0.7)'
          );
        }
      });
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
      // Create new indicator
      this._indicators[threadId] = this._editor.doc.markText(
        {
          line: selection.current.start.line,
          ch: selection.current.start.column
        },
        { line: selection.current.end.line, ch: selection.current.end.column },
        { css: `background-color: ${color};` }
      );

      // Handles focusing card on beforeCursorEnter
      this._indicators[threadId].on('beforeCursorEnter', () => {
        if (threadId && this._editor.doc.getSelection().length <= 1) {
          if (!commentingUI.getExpandedCard(threadId)) {
            this.focusThread(threadId);
            this.putIndicators();
          }
        }
      });
    }

    if (type === 'clear') {
      // Create new indicator with new CSS values to make the indicator look cleared
      this._indicators[threadId] = this._editor.doc.markText(
        {
          line: selection.current.start.line,
          ch: selection.current.start.column
        },
        { line: selection.current.end.line, ch: selection.current.end.column },
        { css: 'background-color: clear; border-bottom: 0;' }
      );

      // Override past beforeCursorEnter functions if any exist
      this._indicators[threadId].on('beforeCursorEnter', () => {
        return;
      });
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
    this._createCommentCommand = this._app.commands.addCommand(
      'jupyterlab-commenting:createComment',
      {
        label: 'Create New Comment',
        isVisible: () => {
          return this._provider.getState('userSet') as boolean;
        },
        execute: () => {
          let selection = this.getSelection();

          let nextId = this._receiver.getLatestCommentId();

          this._indicatorValues[nextId] = selection;

          const from = {
            line: selection.current.start.line,
            ch: selection.current.start.column
          };

          const to = {
            line: selection.current.end.line,
            ch: selection.current.end.column
          };

          this._editor.doc.markText(from, to, {
            css: `border-bottom: 2px solid rgba(0, 0, 255, 0.5);`
          });

          this.openNewThread();
        }
      }
    );

    this._commentCommandMenuItem = this._app.contextMenu.addItem({
      command: 'jupyterlab-commenting:createComment',
      selector: 'body',
      rank: Infinity
    });
  }

  /**
   * Called when a thread is resolved
   *
   * @param sender Type: CommentingDataReceiver - sender of signal
   * @param args Type: {value: boolean, threadId: string, target: string}
   *
   * value - resolve value
   * threadId - id of thread being resolved
   * target - file path thread is related to
   */
  handleThreadResolved(sender: CommentingDataReceiver, args: any): void {
    if (args.value) {
      let indicator = this._indicatorValues[args.threadId] as ITextIndicator;

      // Clear indicator's current value to all zeros
      indicator.current = {
        end: {
          line: 0,
          column: 0
        },
        start: {
          line: 0,
          column: 0
        },
        context: ''
      };

      this._receiver.setAllIndicatorValues(this._path, this._indicatorValues);
      this._indicatorValues = this._receiver.getAllIndicatorValues();
      this.putIndicators();
    }
  }

  /**
   * Called before a change is applied on the text editor
   *
   * @param instance Type: Editor - instance of the text editor
   */
  handleEditorBeforeChange(
    instance: Editor,
    change: EditorChangeLinkedList
  ): void {
    this.updateMarkerIdOrdered(instance, change);
  }

  /**
   * Called on the change of the text editor. Updates indicator
   * positioning and context based on the new changes to the editor
   *
   * ### Notes
   *
   * How this works is that the CodeMirrorEditor's text marker functionality already
   * handles the changes to the marks made in the editor so this function gets the markers
   * from top to bottom of the page in an array and uses another array, that gets updated
   * before change, that contains id's (this._markerIdOrdered) that stores threadId's in
   * the same order the marks are gathered. So the Id is matched with the position related
   * marker and the new (current) value is updated.
   *
   * @param instance Type: Editor - instance of the text editor
   */
  handleEditorOnChange(instance: Editor): void {
    const doc = instance.getDoc();
    const allMarks = doc.getAllMarks();

    for (let index in allMarks) {
      // Range of marker
      let mark = allMarks[index].find();

      // Id matches index. Explained in notes.
      let id = this._markerIdOrdered[index];

      // The updated contents from the text editor
      let newContext = doc.getRange(mark.from, mark.to);

      let indicator = this._indicatorValues[id] as ITextIndicator;

      // Apply new value
      indicator.current = {
        end: {
          line: mark.to.line,
          column: mark.to.ch
        },
        start: {
          line: mark.from.line,
          column: mark.from.ch
        },
        context: newContext
      };
    }
    this.putIndicators();
  }

  /**
   * Creates an array of thread Ids in related to the text markers in the
   * editor from top to bottom. This array is used to relate a marker to
   * a thread in handleEditorOnChange.
   *
   * @param instance Type: Editor - instance of the text editor
   */
  updateMarkerIdOrdered(
    instance: Editor,
    change: EditorChangeLinkedList
  ): void {
    this._markerIdOrdered = [];
    instance
      .getDoc()
      .getAllMarks()
      .forEach(mark => {
        /**
         * Compares values of the stored marker with the marker on the page,
         * and checks if they are the same. Then the thread id is added to
         * the array in the order they are matched.
         */
        for (let id in this._indicators) {
          let storedRange = this._indicators[id].find();
          let currentRange = mark.find();

          if (
            storedRange &&
            change.from.line === storedRange.from.line &&
            change.from.ch === storedRange.from.ch &&
            change.to.line === storedRange.to.line &&
            change.to.ch === storedRange.to.ch
          ) {
            this._receiver.setResolvedValue(this._path, id, true);
          } else if (
            storedRange &&
            currentRange &&
            storedRange.from.line === currentRange.from.line &&
            storedRange.from.ch === currentRange.from.ch &&
            storedRange.to.line === currentRange.to.line &&
            storedRange.to.ch === currentRange.to.ch
          ) {
            this._markerIdOrdered.push(id);
          }
        }
      });
  }

  /**
   * Called when a new thread is created or canceled on creation
   *
   * @param sender CommentingWidget - the commentingUI
   * @param args - true if new thread created, false if canceled
   */
  handleNewThreadCreated(sender: CommentingWidget, args: boolean): void {
    if (!args) {
      let nextId = this._receiver.getLatestCommentId();
      delete this._indicatorValues[nextId];
    }
    this.putIndicators();
  }

  /**
   * Called when the commentingUI is opened
   *
   * @param sender CommentingWidget - the commentingUI
   * @param args - true if commentingUI is opened, false if closed
   */
  handleCommentingUIShow(sender: CommentingWidget, args: boolean) {
    if (args) {
      this._commentingUIOpened = true;
    } else {
      this._commentingUIOpened = false;
    }
    this.putIndicators();
  }

  /**
   * Gets the current selection range from the codemirror editor.
   * If the selection range start and end values are the same,
   * it returns the range of the entire line
   *
   * @return Type: ITextIndicator
   */
  getSelection(): ITextIndicator {
    // Selection start and end range, start relative to where the user starts the selection
    let selection = this._editor.getSelection();

    // Context that is selected
    let context = this._editor.doc.getSelection();

    let indicator: ITextIndicator;
    let selected;

    // Sets start values as the most left, and end values as the most right of the editor
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

    // If start position is same as end position, mark entire line
    if (startLine === endLine && startCol === endCol) {
      context = this._editor.getLine(selection.start.line);
      selected = {
        end: {
          line: endLine,
          column: this._editor.getLine(selection.start.line).length
        },
        start: { line: startLine, column: 0 },
        context: context
      };
    } else {
      selected = {
        end: {
          line: endLine,
          column: endCol
        },
        start: {
          line: startLine,
          column: startCol
        },
        context: context
      };
    }

    indicator = {
      initial: selected,
      current: selected
    };

    return indicator;
  }

  private _app: JupyterFrontEnd;
  private _labShell: ILabShell;
  private _docManager: IDocumentManager;
  private _path: string;
  private _receiver: CommentingDataReceiver;
  private _provider: CommentingDataProvider;
  private _indicators: { [key: string]: TextMarker };
  private _indicatorValues: { [key: string]: CommentIndicator };
  private _editorWidget: IDocumentWidget<FileEditor, DocumentRegistry.IModel>;
  private _editor: CodeMirrorEditor;
  private _commentingUIOpened: boolean;
  private _markerIdOrdered: string[];
  private _createCommentCommand: IDisposable;
  private _commentCommandMenuItem: IDisposable;
}

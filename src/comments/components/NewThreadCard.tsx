/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2019 Project Jupyter Contributors.
 * Distributed under the terms of the 3-Clause BSD License.
 */

import * as React from 'react';

import { IPerson } from '../service';
import { CommentingWidget } from '../commenting';
import { Signal } from '@phosphor/signaling';

interface INewThreadCardProps {
  /**
   * Creator object
   *
   * @type IPerson
   */
  creator: IPerson;
  /**
   * New thread created signal
   */
  newThreadCreated: Signal<CommentingWidget, boolean>;
  /**
   * Creates new thread
   *
   * @param comment Type: string -  the comment to be added
   */
  putThread(comment: string): void;
  /**
   * Sets the state if this component is visible
   *
   * @param state Type: boolean - state to set to
   */
  setNewThreadActive(state: boolean): void;
}

interface INewThreadCardStates {
  /**
   * Text in the input box
   *
   * @type string
   */
  inputBox: string;
}

export class NewThreadCard extends React.Component<
  INewThreadCardProps,
  INewThreadCardStates
> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: INewThreadCardProps) {
    super(props);
    this.state = { inputBox: '' };

    this.handleChangeCommentBox = this.handleChangeCommentBox.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleCreateNewThread = this.handleCreateNewThread.bind(this);
    this.handleCancelThread = this.handleCancelThread.bind(this);
  }

  /**
   * Called when a component is mounted
   */
  componentDidMount(): void {
    document.getElementById('commentBox').focus();
  }

  /**
   * React render function
   */
  render(): React.ReactNode {
    return (
      <div style={this.styles['jp-commenting-new-thread-area']}>
        <div style={this.styles['jp-commenting-new-thread-name-area']}>
          <span style={this.styles['jp-commenting-new-thread-name']}>
            {this.props.creator.name}
          </span>
        </div>
        <div style={this.styles['jp-commenting-text-input-area']}>
          <textarea
            className="jp-commenting-text-area"
            id={'commentBox'}
            value={
              this.state.inputBox.trim() === ''
                ? this.state.inputBox.trim()
                : this.state.inputBox
            }
            onChange={this.handleChangeCommentBox}
            onKeyPress={this.handleKeyPress}
          />
        </div>
        <div style={this.styles['jp-commenting-new-thread-button-area']}>
          {this.getCommentButton()}
          {this.getCancelButton()}
        </div>
      </div>
    );
  }

  /**
   * Creates and returns the comment button
   *
   * @return Type: React.ReactNode - JSX button
   */
  getCommentButton(): React.ReactNode {
    return (
      <button
        className="jp-commenting-button-blue"
        type="button"
        onClick={this.handleCreateNewThread}
        disabled={this.state.inputBox.trim() === ''}
      >
        Comment
      </button>
    );
  }

  /**
   * Handles when the comment box changes
   *
   * @param e Type: React.ChangeEvent<HTMLTextAreaElement> - input box event
   */
  handleChangeCommentBox(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({ inputBox: e.target.value });
  }

  /**
   * Handles comment button
   */
  handleCreateNewThread(): void {
    this.props.setNewThreadActive(false);
    this.props.putThread(this.state.inputBox);
    this.props.newThreadCreated.emit(true);
  }

  /**
   * Handles cancel button
   */
  handleCancelThread(): void {
    this.setState({ inputBox: '' });
    this.props.setNewThreadActive(false);
    this.props.newThreadCreated.emit(false);
  }

  /**
   * Handles key events
   *
   * @param e Type: React.KeyboardEvent - keyboard event
   */
  handleKeyPress(e: React.KeyboardEvent): void {
    if (this.state.inputBox.trim() !== '' && e.key === 'Enter' && !e.shiftKey) {
      this.handleCreateNewThread();
    }
  }

  /**
   * Creates and returns the cancel button
   *
   * @return Type: React.ReactNode - JSX button
   */
  getCancelButton(): React.ReactNode {
    return (
      <button
        className="jp-commenting-button-red"
        type="button"
        onClick={this.handleCancelThread}
      >
        Cancel
      </button>
    );
  }

  /**
   * CSS styles
   */
  styles = {
    'jp-commenting-new-thread-area': {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column' as 'column',
      borderRadius: 'var(--jp-border-radius)',
      border: '1px solid var(--jp-border-color2)',
      boxSizing: 'border-box' as 'border-box',
      background: 'var(--jp-layout-color1)'
    },
    'jp-commenting-text-input-area': {
      display: 'flex',
      padding: '8px',
      width: '95%',
      height: '80px'
    },
    'jp-commenting-new-thread-name': {
      fontSize: 'var(--jp-ui-font-size1)',
      fontWeight: 'bold' as 'bold',
      color: 'var(--jp-ui-font-color1)'
    },
    'jp-commenting-new-thread-name-area': {
      display: 'flex',
      padding: '4px'
    },
    'jp-commenting-new-thread-button-area': {
      display: 'flex',
      padding: '4px'
    }
  };
}

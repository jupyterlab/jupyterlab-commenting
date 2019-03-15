import * as React from 'react';

/**
 * React Props interface
 */
interface ICommentFooterProps {
  /**
   * Tracks if card is expanded
   *
   * @type boolean
   */
  expanded: boolean;
  /**
   * Function to call to parent component to handle expanding and opening the reply box
   *
   * @type void
   */
  expandAndReply: () => void;
  /**
   * Passes comment message to putComment in App.tsx
   *
   * @param comment Type: string - comment message
   *
   * @type void
   */
  getInput: (comment: string) => void;
  /**
   * Reverses resolve state
   *
   * @type: void
   */
  handleResolve: () => void;
  /**
   * Function to call to parent component to close the reply box
   *
   * @type void
   */
  handleReplyClose: () => void;
  /**
   * Function to call to parent component to open the reply box
   *
   * @type void
   */
  handleReplyOpen: () => void;
  /**
   * Tracks if the reply box is active
   *
   * @type return function
   */
  replyActive: boolean;
  /**
   * Is the card resolved
   *
   * @type boolean
   */
  resolved: boolean;
}

/**
 * React States interface
 */
interface ICommentFooterStates {
  /**
   * Tracks what is in the text area
   *
   * @type string
   */
  commentBox: string;
}

/**
 * CommentFooter React Component
 */
export class CommentFooter extends React.Component<
  ICommentFooterProps,
  ICommentFooterStates
> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: ICommentFooterProps) {
    super(props);
    this.state = {
      commentBox: ''
    };

    this.handleChangeCommentBox = this.handleChangeCommentBox.bind(this);
    this.handleCommentButton = this.handleCommentButton.bind(this);
    this.handleCancelButton = this.handleCancelButton.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  /**
   * React render function
   */
  render(): React.ReactNode {
    return (
      <div style={this.styles['jp-commenting-thread-footer-area']}>
        <div
          style={
            this.props.replyActive
              ? this.styles['jp-commenting-thread-footer-input-active']
              : this.styles['jp-commenting-thread-footer-input-not-active']
          }
        >
          {this.props.expanded && (
            <textarea
              className="jp-commenting-text-area"
              id={'commentBox'}
              value={
                this.state.commentBox.trim() === ''
                  ? this.state.commentBox.trim()
                  : this.state.commentBox
              }
              onChange={this.handleChangeCommentBox}
              onKeyPress={this.handleKeyPress}
              onFocusCapture={this.props.handleReplyOpen}
              placeholder="Reply..."
            />
          )}
        </div>
        <div style={this.styles['jp-commenting-thread-footer-button-area']}>
          {this.getButtons()}
        </div>
      </div>
    );
  }

  /**
   * Handles key events
   *
   * @param e Type: React.KeyboardEvent - keyboard event
   */
  handleKeyPress(e: React.KeyboardEvent): void {
    if (
      this.state.commentBox.trim() !== '' &&
      e.key === 'Enter' &&
      !e.shiftKey
    ) {
      this.handleCommentButton();
      document.getElementById('commentBox').blur();
    }
  }

  /**
   * Handles when the comment box changes
   *
   * @param e Type: React.ChangeEvent<HTMLTextAreaElement> - input box event
   */
  handleChangeCommentBox(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({ commentBox: e.target.value });
  }

  /**
   * Handles clicking the comment button
   */
  handleCommentButton(): void {
    this.props.getInput(this.state.commentBox);
    this.setState({ commentBox: '' });
    this.props.handleReplyClose();
  }

  /**
   * Handles states when cancel is pressed
   */
  handleCancelButton(): void {
    this.setState({ commentBox: '' });
    this.props.handleReplyClose();
  }

  /**
   * Returns the correct buttons for different state combinations
   *
   * @return Type: React.ReactNode - JSX with buttons
   */
  getButtons(): React.ReactNode {
    if (this.props.replyActive) {
      return (
        <div>
          {this.getCommentButton()}
          {this.getCancelButton()}
        </div>
      );
    }
  }

  /**
   * Creates and returns reply button
   *
   * @return Type: React.ReactNode
   */
  getCommentButton(): React.ReactNode {
    return (
      <button
        onClick={this.handleCommentButton}
        className="jp-commenting-button-blue"
        type="button"
        disabled={this.state.commentBox.trim() === ''}
      >
        Comment
      </button>
    );
  }

  /**
   * Creates and returns cancel button
   *
   * @return Type: React.ReactNode
   */
  getCancelButton(): React.ReactNode {
    return (
      <button
        onClick={this.handleCancelButton}
        className="jp-commenting-button-red"
        type="button"
      >
        Cancel
      </button>
    );
  }

  /**
   * CSS styles
   */
  styles = {
    'jp-commenting-thread-footer-area': {
      display: 'flex',
      flexDirection: 'column' as 'column',
      padding: '4px'
    },
    'jp-commenting-thread-footer-button-area': {
      display: 'flex',
      paddingTop: '4px'
    },
    'jp-commenting-thread-footer-input-active': {
      display: 'flex',
      height: '72px'
    },
    'jp-commenting-thread-footer-input-not-active': {
      display: 'flex',
      height: '24px'
    }
  };
}

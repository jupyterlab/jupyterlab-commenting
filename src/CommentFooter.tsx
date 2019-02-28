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
   * Is the card resolved
   *
   * @type boolean
   */
  resolved: boolean;
  /**
   * Tracks if the reply box is active
   *
   * @type return function
   */
  replyActive: boolean;
  /**
   * Function to call to parent component to open the reply box
   *
   * @type VoidFunction
   */
  handleReplyOpen: VoidFunction;
  /**
   * Function to call to parent component to close the reply box
   *
   * @type VoidFunction
   */
  handleReplyClose: VoidFunction;
  /**
   * Function to call to parent component to handle expanding and opening the reply box
   *
   * @type VoidFunction
   */
  expandAndReply: VoidFunction;
  /**
   * Passes comment message to putComment in App.tsx
   *
   * @param comment Type: string - comment message
   *
   * @type void function
   */
  getInput: (comment: string) => void;
  /**
   * Reverses resolve state
   *
   * @type: void function
   */
  handleResolve: VoidFunction;
}

/**
 * React States interface
 */
interface ICommentFooterStates {
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
  render() {
    return (
      <div style={this.styles.footerArea}>
        <div
          style={
            this.props.replyActive
              ? this.styles.inputBoxAreaActive
              : this.styles.inputBoxAreaNotActive
          }
        >
          {this.props.expanded && (
            <textarea
              className="--jp-commenting-text-area"
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
        <div style={this.styles.buttonArea}>{this.getButtons()}</div>
      </div>
    );
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
        className="--jp-commenting-button-blue"
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
        className="--jp-commenting-button-red"
        type="button"
      >
        Cancel
      </button>
    );
  }

  /**
   * Handles key events
   *
   * @param e Type: ? - keyboard event
   */
  handleKeyPress(e: any): void {
    if (
      this.state.commentBox.trim() !== '' &&
      e.key === 'Enter' &&
      !e.shiftKey
    ) {
      this.handleCommentButton();
      document.getElementById('commentBox').blur();
    }
  }

  // TODO: Get correct type
  /**
   * Handles when the comment box changes
   *
   * @param e Type: any - input box event
   */
  handleChangeCommentBox(e: any): void {
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

  handleCancelButton(): void {
    this.setState({ commentBox: '' });
    this.props.handleReplyClose();
  }

  /**
   * CSS styles
   */
  styles = {
    footerArea: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      maxHeight: '94px',
      padding: '4px'
    },
    buttonArea: {
      display: 'flex',
      marginTop: '16px'
    },
    inputBoxAreaActive: {
      display: 'flex',
      height: '60px'
    },
    inputBoxAreaNotActive: {
      display: 'flex',
      height: '14px'
    }
  };
}

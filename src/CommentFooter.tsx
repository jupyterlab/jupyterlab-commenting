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
      <div className={this.bsc.buttonArea} style={this.styles.footerArea}>
        <div>
          {(this.props.expanded &&
            this.props.replyActive && (
              <textarea
                className={this.bsc.input}
                style={this.styles.replyBoxActive}
                id={'commentBox'}
                value={
                  this.state.commentBox.trim() === ''
                    ? this.state.commentBox.trim()
                    : this.state.commentBox
                }
                onChange={this.handleChangeCommentBox}
                onKeyPress={this.handleKeyPress}
                placeholder="Reply..."
              />
            )) ||
            (this.props.expanded &&
              !this.props.replyActive && (
                <textarea
                  className={this.bsc.input}
                  style={this.styles.replyBoxDisabled}
                  id={'commentBox'}
                  value={this.state.commentBox.trim()}
                  onChange={this.handleChangeCommentBox}
                  onKeyPress={this.handleKeyPress}
                  onFocusCapture={this.props.handleReplyOpen}
                  placeholder="Reply..."
                />
              ))}
        </div>
        <div>
          <div style={this.styles.buttonArea}>{this.getButtons()}</div>
        </div>
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
        className="commentCommentButton commentFooterRightButton float-right"
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
        className="commentCancelButton commentFooterLeftButton float-right"
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
   * Bootstrap classNames
   */
  bsc = {
    buttonArea: 'col',
    input: 'form-control form-control-sm'
  };

  /**
   * CSS styles
   */
  styles = {
    footerArea: {
      marginBottom: '5px',
      paddingLeft: '5px',
      paddingRight: '5px',
      paddingTop: '0px',
      paddingBottom: '0px',
      background: 'white'
    },
    buttonArea: {
      marginRight: '5px',
      marginTop: '8px'
    },
    replyBoxActive: {
      width: '100%',
      height: '80px',
      lineHeight: 'normal'
    },
    replyBoxDisabled: {
      width: '100%',
      height: '25px',
      lineHeight: 'normal'
    }
  };
}

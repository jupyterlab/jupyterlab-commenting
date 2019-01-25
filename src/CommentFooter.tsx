import * as React from 'react';

/**
 * React Props interface
 */
interface ICommentFooterProps {
  /**
   * Tracks if card is expanded
   * @type boolean
   */
  expanded: boolean;
  /**
   * Tracks if the reply box is active
   * @type boolean
   */
  replyActive: boolean;
  /**
   * Function to call to parent component to handle reply active
   * @type VoidFunction
   */
  handleReplyActive: VoidFunction;
  /**
   * Function to call to parent component to handle expanding and opening the reply box
   * @type VoidFunction
   */
  expandAndReply: VoidFunction;
}

/**
 * CommentFooter React Component
 */
export class CommentFooter extends React.Component<ICommentFooterProps> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: any) {
    super(props);
  }

  /**
   * React render function
   */
  render() {
    return (
      <div className={this.bsc.buttonArea} style={this.styles.footerArea}>
        <div>
          {this.props.expanded &&
            this.props.replyActive && (
              <textarea
                className={this.bsc.input}
                style={this.styles.replyBox}
              />
            )}
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
    if (this.props.expanded && this.props.replyActive) {
      return (
        <div>
          <button
            className={this.bsc.button}
            style={this.styles.buttonRight}
            type="button"
          >
            Reply
          </button>
          <button
            className={this.bsc.button}
            style={this.styles.buttonLeft}
            type="button"
            onClick={this.props.handleReplyActive}
          >
            Cancel
          </button>
        </div>
      );
    } else if (this.props.expanded && !this.props.replyActive) {
      return (
        <div>
          <button
            className={this.bsc.button}
            style={this.styles.buttonRight}
            type="button"
            onClick={this.props.handleReplyActive}
          >
            Reply
          </button>
          <button
            className={this.bsc.button}
            style={this.styles.buttonLeft}
            type="button"
          >
            Resolve
          </button>
        </div>
      );
    } else if (!this.props.expanded && !this.props.replyActive) {
      return (
        <div>
          <button
            className={this.bsc.button}
            style={this.styles.buttonRight}
            type="button"
            onClick={this.props.expandAndReply}
          >
            Reply
          </button>
          <button
            className={this.bsc.button}
            style={this.styles.buttonLeft}
            type="button"
          >
            Resolve
          </button>
        </div>
      );
    }
  }

  /**
   * Bootstrap classNames
   */
  bsc = {
    button: 'btn-secondary float-right',
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
    buttonRight: {
      background: '#E0E0E0',
      color: 'black',
      borderRadius: '2px',
      border: 'none',
      outline: '0px',
      marginLeft: '4px',
      marginRight: '-5px'
    },
    buttonLeft: {
      background: '#E0E0E0',
      color: 'black',
      borderRadius: '2px',
      border: 'none',
      outline: '0px',
      marginLeft: '0px',
      marginRight: '4px'
    },
    replyBox: {
      width: '100%',
      height: '80px',
      lineHeight: 'normal'
    }
  };
}

import * as React from 'react';

interface ICommentFooter {
  expanded?: boolean;
  handleExpand?: VoidFunction;
  replyActive?: boolean;
  handleReplyActive?: VoidFunction;
  expandAndReply?: VoidFunction;
  resolved?: boolean;
  active?: boolean;
}

export class CommentFooter extends React.Component<ICommentFooter> {
  constructor(props: any) {
    super(props);
  }

  getButtons(): any {
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

  styles = {
    footerArea: {
      marginBottom: '5px',
      paddingLeft: '5px',
      paddingRight: '5px',
      paddingTop: '0px',
      paddingBottom: '0px'
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

  bsc = {
    button: 'btn-secondary float-right',
    buttonArea: 'col',
    input: 'form-control form-control-sm'
  };
}

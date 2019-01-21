import * as React from 'react';

interface ICommentFooter {
  expanded?: boolean;
  replyActive?: boolean;
  resolved?: boolean;
  active?: boolean;
}

export class CommentFooter extends React.Component<ICommentFooter> {
  constructor(props: any) {
    super(props);
  }

  getButtons(): any {
    if (this.props.expanded) {
      return (
        <div>
          <button
            className={this.bsc.button}
            style={this.styles.buttonRight}
            type="button"
          >
            Cancel
          </button>
          <button
            className={this.bsc.button}
            style={this.styles.buttonLeft}
            type="button"
          >
            Reply
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <button
            className={this.bsc.button}
            style={this.styles.buttonRight}
            type="button"
          >
            Resolve
          </button>
          <button
            className={this.bsc.button}
            style={this.styles.buttonLeft}
            type="button"
          >
            Reply
          </button>
        </div>
      );
    }
  }

  render() {
    return (
      <div className={this.bsc.buttonArea} style={this.styles.footerArea}>
        <div>
          <div>{this.getButtons()}</div>
        </div>
      </div>
    );
  }

  styles = {
    footerArea: {
      marginBottom: '5px'
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
    }
  };

  bsc = {
    button: 'btn-secondary float-right',
    buttonArea: 'col'
  };
}

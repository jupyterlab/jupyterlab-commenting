import * as React from 'react';

interface ICommentProps {
  name?: string;
  context?: string;
  timestamp?: string;
  photo?: string;
  expanded?: boolean;
}

export class Comment extends React.Component<ICommentProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div style={this.styles.commentHeader}>
        <div style={this.styles.upperComment} className={this.bsc.upperComment}>
          <div>
            <img style={this.styles.photo} src={this.props.photo} />
          </div>
          <div style={this.styles.nameArea} className={this.bsc.nameArea}>
            <h1 style={this.styles.name} className={this.bsc.name}>
              {this.props.name}
            </h1>
            <p style={this.styles.timestamp} className={this.bsc.timestamp}>
              {this.props.timestamp}
            </p>
          </div>
        </div>
        <div
          style={
            this.props.expanded
              ? this.styles.contextExpanded
              : this.styles.contextNotExpanded
          }
        >
          <p style={this.styles.commentStyle}>{this.props.context}</p>
        </div>
      </div>
    );
  }

  styles = {
    upperComment: {},
    commentHeader: {
      marginBottom: '10px'
    },
    nameArea: {
      paddingLeft: '5px'
    },
    commentStyle: {
      marginBottom: '0px'
    },
    photo: {
      height: '2em',
      width: '2em',
      marginLeft: '20px'
    },
    name: {
      fontSize: '12px',
      fontWeight: 'bold' as 'bold',
      marginBottom: '1px'
    },
    timestamp: {
      fontSize: '.7em',
      marginBottom: '0px',
      marginTop: '-5px'
    },
    contextNotExpanded: {
      maxHeight: '30px',
      maxWidth: '350px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '.8em',
      lineHeight: 'normal',
      paddingLeft: '5px',
      paddingRight: '10px',
      marginBottom: '0px'
    },
    contextExpanded: {
      height: '100%',
      maxWidth: '350px',
      overflow: '',
      textOverflow: 'ellipsis',
      fontSize: '.8em',
      lineHeight: 'normal',
      paddingLeft: '5px',
      paddingRight: '10px',
      marginBottom: '0px'
    }
  };

  bsc = {
    upperComment: 'row',
    nameArea: 'col',
    timestamp: 'row-offset-1',
    name: 'row-offset-1'
  };
}

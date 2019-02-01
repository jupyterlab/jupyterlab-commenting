import * as React from 'react';

interface ICommentProps {
  /**
   * Name of person commenting
   *
   * @type string
   */
  name: string;
  /**
   * Actual comment from the user
   *
   * @type string
   */
  context?: string;
  /**
   * Time comment was made
   *
   * @type string
   */
  timestamp: string;
  /**
   * Source of the profile picture
   *
   * @type string
   */
  photo: string;
  /**
   * State if the CommentCard is expanded
   *
   * @type string
   */
  expanded: boolean;
}

/**
 * Comment React Component
 */
export class Comment extends React.Component<ICommentProps> {
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

  /**
   * CSS Styles
   */
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

  /**
   * Bootstrap classNames
   */
  bsc = {
    upperComment: 'row',
    nameArea: 'col',
    timestamp: 'row-offset-1',
    name: 'row-offset-1'
  };
}

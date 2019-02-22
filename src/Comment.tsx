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
  constructor(props: ICommentProps) {
    super(props);
  }

  /**
   * React render function
   */
  render() {
    return (
      <div style={this.styles.commentHeader}>
        <div style={this.styles.upperComment}>
          <div>
            <img style={this.styles.photo} src={this.props.photo} />
          </div>
          <div style={this.styles.nameArea}>
            <h1 style={this.styles.name}>{this.props.name}</h1>
            <p style={this.styles.timestamp}>{this.timeStampStyle()}</p>
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

  timeStampStyle(): string {
    let serverTimeStamp = new Date(this.props.timestamp);
    let localTimeStamp = serverTimeStamp.toLocaleString();
    let fullDate = localTimeStamp.split(',')[0].split('/');
    let fullTime = localTimeStamp.split(',')[1].split(':');
    let timeIdentifier = fullTime[2].slice(3).toLowerCase();

    let month: any = {
      '1': 'Jan',
      '2': 'Feb',
      '3': 'Mar',
      '4': 'Apr',
      '5': 'May',
      '6': 'Jun',
      '7': 'Jul',
      '8': 'Aug',
      '9': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dec'
    };
    let timestamp =
      month[fullDate[0]] +
      ' ' +
      fullDate[1] +
      fullTime[0] +
      ':' +
      fullTime[1] +
      timeIdentifier;
    return timestamp;
  }
  /**
   * CSS Styles
   */
  styles = {
    upperComment: { display: 'flex', flexDirection: 'row' as 'row' },
    commentHeader: { marginBottom: '10px' },
    nameArea: {
      paddingLeft: '5px',
      display: 'flex',
      flexDirection: 'column' as 'column'
    },
    commentStyle: { marginBottom: '0px' },
    photo: {
      height: '2em',
      width: '2em',
      marginLeft: '6px',
      marginTop: '5px',
      borderRadius: '2px'
    },
    name: {
      fontSize: '12px',
      fontWeight: 'bold' as 'bold',
      marginBottom: '4px',
      marginTop: '8px'
    },
    timestamp: { fontSize: '.7em', marginBottom: '0px', marginTop: '-4px' },
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
}

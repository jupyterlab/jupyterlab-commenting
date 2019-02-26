import * as React from 'react';

/**
 * React Props interface
 */
interface ICommentHeaderProps {
  /**
   * Person name of comment
   *
   * @type string
   */
  name: string;
  /**
   * Time stamp of comment
   *
   * @type string
   */
  timestamp: string;
  /**
   * URL to Person photo to display
   *
   * @type string
   */
  photo: string;
  /**
   * Text comment to display
   *
   * @type string
   */
  context?: string;
  /**
   * Tag to display in the header
   *
   * @type string
   */
  tag?: string;
  /**
   * Tracks the state if the card is expanded
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
   * Function to handle the CommentCard expanding
   *
   * @type VoidFunction
   */
  handleExpand: VoidFunction;
  /**
   * Function to handle the CommentCard shrinking
   *
   * @type VoidFunction
   */
  handleShrink: VoidFunction;
  /**
   * Reverses resolve state
   *
   * @type: void function
   */
  handleResolve: VoidFunction;
  hover: boolean;
  handleShouldExpand: (state: boolean) => void;
}

/**
 * CommentHeader React Component
 */
export class CommentHeader extends React.Component<ICommentHeaderProps> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: ICommentHeaderProps) {
    super(props);
  }

  /**
   * React render function
   */
  render() {
    return (
      <div>
        <div style={this.styles.upperHeader}>
          <div>
            <img style={this.styles.photo} src={this.props.photo} />
          </div>
          <div style={this.styles.nameArea}>
            <h1 style={this.styles.name}>{this.props.name}</h1>
            <p style={this.styles.timestamp}>{this.timeStampStyle()}</p>
          </div>
          {this.shouldRenderCornerButtons()}
        </div>
        <p
          className={
            this.props.expanded ? 'textFieldExpanded' : 'textFieldNotExpanded'
          }
        >
          {this.props.context}
        </p>
      </div>
    );
  }

  /**
   * Creates and returns resolve button
   *
   * @return Type: React.ReactNode
   */
  getResolveButton(): React.ReactNode {
    return (
      <button
        className="--jp-commenting-button-blue"
        style={this.styles.resolveButton}
        type="button"
        onClick={this.props.handleResolve}
        onMouseEnter={() => this.props.handleShouldExpand(false)}
        onMouseLeave={() => this.props.handleShouldExpand(true)}
      >
        Resolve
      </button>
    );
  }

  getReopenButton(): React.ReactNode {
    return (
      <button
        className="--jp-commenting-button-blue --jp-commenting-button-resolved"
        style={this.styles.resolveButton}
        type="button"
        onClick={this.props.handleResolve}
        onMouseEnter={() => this.props.handleShouldExpand(false)}
        onMouseLeave={() => this.props.handleShouldExpand(true)}
      >
        Re-open
      </button>
    );
  }

  shouldRenderCornerButtons(): React.ReactNode {
    if (this.props.hover && !this.props.expanded) {
      return (
        <div>
          {!this.props.resolved
            ? this.getResolveButton()
            : this.getReopenButton()}
        </div>
      );
    } else if (this.props.expanded) {
      return (
        <div>
          {!this.props.resolved
            ? this.getResolveButton()
            : this.getReopenButton()}
        </div>
      );
    } else {
      return;
    }
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
   * CSS styles
   */
  styles = {
    upperHeader: { display: 'flex', flexDirection: 'row' as 'row' },
    resolveButton: {
      marginRight: '5px',
      marginTop: '5px',
      fontSize: 'var(--jp-content-font-size0)',
      fontFamily: 'var(--jp-content-font-family)'
    },
    nameArea: {
      paddingLeft: '5px',
      display: 'flex',
      flexGrow: 2,
      flexDirection: 'column' as 'column'
    },
    photo: {
      display: 'flex',
      flexGrow: 1,
      height: '36px',
      width: '36px',
      marginLeft: '5px',
      marginTop: '5px',
      borderRadius: '2px'
    },
    name: {
      fontSize: '13px',
      fontWeight: 'bold' as 'bold',
      marginTop: '11px',
      marginBottom: '0px'
    },
    timestamp: { fontSize: '.7em', marginBottom: '0px', marginTop: '0px' },
    contextNotExpanded: {
      display: 'flex',
      maxHeight: '30px',
      maxWidth: '350px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '.8em',
      marginLeft: '5px',
      marginRight: '10px',
      marginTop: '5px',
      marginBottom: '5px',
      lineHeight: 'normal'
    },
    contextExpanded: {
      display: 'flex',
      maxHeight: '100%',
      maxWidth: '350px',
      overflow: '',
      textOverflow: 'ellipsis',
      fontSize: '.8em',
      lineHeight: 'normal',
      marginLeft: '5px',
      marginRight: '10px',
      marginTop: '5px',
      marginBottom: '5px'
    },
    cornerButton: {
      display: 'flex',
      flexGrow: 1,
      marginTop: '9px',
      marginRight: '9px',
      width: '24px',
      height: '24px'
    },
    tag: {
      background: '#E0E0E0',
      fontSize: '.7em',
      fontWeight: 'normal' as 'normal',
      color: 'black',
      borderRadius: '2px',
      marginBottom: '0px',
      marginTop: '-4px'
    },
    resolvedTag: {
      background: '#E0E0E0',
      fontSize: '.7em',
      fontWeight: 'normal' as 'normal',
      color: 'black',
      borderRadius: '2px',
      marginBottom: '0px',
      marginTop: '-4px',
      marginLeft: '5px'
    },
    tagArea: { marginTop: '-5px', paddingLeft: '0px', paddingRight: '0px' }
  };
  // justifyContent: 'space-between'
}

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
        <div style={this.styles['jp-commenting-thread-header-upper-area']}>
          <div style={this.styles['jp-commenting-thread-header-photo-area']}>
            <img
              style={this.styles['jp-commenting-thread-header-photo']}
              src={this.props.photo}
            />
          </div>
          <div style={this.styles['jp-commenting-thread-header-info-area']}>
            <div style={this.styles['jp-commenting-thread-header-name-area']}>
              <h1 style={this.styles['jp-commenting-thread-header-name']}>
                {this.props.name}
              </h1>
            </div>
            <div
              style={this.styles['jp-commenting-thread-header-timestamp-area']}
            >
              <p style={this.styles['jp-commenting-thread-header-timestamp']}>
                {this.timeStampStyle()}
              </p>
            </div>
          </div>
          <div style={this.styles['jp-commenting-thread-header-button-area']}>
            {this.getCornerButton()}
          </div>
        </div>
        <div style={this.styles['jp-commenting-annotation-area']}>
          <p style={this.styles['jp-commenting-annotation']}>
            {this.props.context.length >= 125 && !this.props.expanded
              ? this.props.context.slice(0, 125) + '...'
              : this.props.context}
          </p>
        </div>
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
        className="jp-commenting-button-blue"
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
        className="jp-commenting-button-blue jp-commenting-button-resolved"
        type="button"
        onClick={this.props.handleResolve}
        onMouseEnter={() => this.props.handleShouldExpand(false)}
        onMouseLeave={() => this.props.handleShouldExpand(true)}
      >
        Re-open
      </button>
    );
  }

  getCornerButton(): React.ReactNode {
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
    'jp-commenting-thread-header-upper-area': {
      display: 'flex',
      flexDirection: 'row' as 'row',
      boxSizing: 'border-box' as 'border-box',
      padding: '4px',
      background: 'var(--jp-layout-color0)'
    },
    'jp-commenting-thread-header-info-area': {
      display: 'flex',
      flexDirection: 'column' as 'column',
      flexShrink: 1,
      minWidth: '52px',
      width: '100%',
      paddingLeft: '4px',
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-thread-header-photo-area': {
      display: 'flex'
    },
    'jp-commenting-thread-header-photo': {
      height: '36px',
      width: '36px',
      borderRadius: 'var(--jp-border-radius)'
    },
    'jp-commenting-thread-header-name-area': {
      display: 'flex',
      flexShrink: 1,
      minWidth: '52px',
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-thread-header-name': {
      fontSize: '13px',
      color: 'var(--jp-ui-font-color0)',
      fontWeight: 'bold' as 'bold',
      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      margin: '0px'
    },
    'jp-commenting-thread-header-timestamp-area': {
      display: 'flex',
      minWidth: '52px',
      flexShrink: 1,
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-thread-header-timestamp': {
      fontSize: 'var(--jp-ui-font-size0)',
      color: 'var(--jp-ui-font-color0)',
      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    'jp-commenting-annotation-area': {
      display: 'flex',
      maxHeight: '100%',
      maxWidth: '350px',
      boxSizing: 'border-box' as 'border-box',
      padding: '4px',
      background: 'var(--jp-layout-color0)'
    },
    'jp-commenting-annotation': {
      fontSize: 'var(--jp-content-font-size0)',
      color: 'var(--jp-ui-font-color0)',
      lineHeight: 'normal'
    },
    'jp-commenting-thread-header-button-area': {
      display: 'flex',
      minWidth: '72px',
      paddingRight: '4px',
      paddingLeft: '8px',
      boxSizing: 'border-box' as 'border-box'
    }
  };
}

import * as React from 'react';

/**
 * React Props interface
 */
interface ICommentHeaderProps {
  /**
   * Text comment to display
   *
   * @type string
   */
  context: string;
  /**
   * Tracks the state if the card is expanded
   *
   * @type boolean
   */
  expanded: boolean;
  /**
   * Function to handle the CommentCard expanding
   *
   * @type void
   */
  handleExpand: () => void;
  /**
   * Reverses resolve state
   *
   * @type: void
   */
  handleResolve: () => void;
  /**
   * Handles expanding
   *
   * @type void
   */
  handleShouldExpand: (state: boolean) => void;
  /**
   * Function to handle the CommentCard shrinking
   *
   * @type void
   */
  handleShrink: () => void;
  /**
   * Tracks if cursor is hovering over card
   *
   * @type boolean
   */
  hover: boolean;
  /**
   * Person name of comment
   *
   * @type string
   */
  name: string;
  /**
   * URL to Person photo to display
   *
   * @type string
   */
  photo: string;
  /**
   * Is the card resolved
   *
   * @type boolean
   */
  resolved: boolean;
  /**
   * Time stamp of comment
   *
   * @type string
   */
  timestamp: string;
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
  render(): React.ReactNode {
    return this.props.resolved ? (
      <div style={this.styles['jp-commenting-thread-header-resolved']}>
        <div
          style={this.styles['jp-commenting-thread-header-upper-area-resolved']}
        >
          <div style={this.styles['jp-commenting-thread-header-photo-area']}>
            <img
              style={this.styles['jp-commenting-thread-header-photo-resolved']}
              src={this.props.photo}
            />
          </div>
          <div style={this.styles['jp-commenting-thread-header-info-area']}>
            <div style={this.styles['jp-commenting-thread-header-name-area']}>
              <h1
                style={this.styles['jp-commenting-thread-header-name-resolved']}
              >
                {this.props.name}
              </h1>
            </div>
            <div
              style={this.styles['jp-commenting-thread-header-timestamp-area']}
            >
              <p
                style={
                  this.styles['jp-commenting-thread-header-timestamp-resolved']
                }
              >
                {this.getStyledTimeStamp()}
              </p>
            </div>
          </div>
          <div style={this.styles['jp-commenting-thread-header-button-area']}>
            {this.getCornerButton()}
          </div>
        </div>
        <div style={this.styles['jp-commenting-annotation-area-resolved']}>
          <p style={this.styles['jp-commenting-annotation-resolved']}>
            {this.props.context.length >= 125 && !this.props.expanded
              ? this.props.context.slice(0, 125) + '...'
              : this.props.context}
          </p>
        </div>
      </div>
    ) : (
      <div style={this.styles['jp-commenting-thread-header']}>
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
                {this.getStyledTimeStamp()}
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

  /**
   * Creates and returns re-open button
   *
   * @type Type: React.ReactNode
   */
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

  /**
   * Creates and returns the corner button based on states
   *
   * @type React.ReactNode
   */
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

  /**
   * Styles and returns timestamp
   *
   * @type string
   */
  getStyledTimeStamp(): string {
    let serverTimeStamp = new Date(this.props.timestamp);
    let localTimeStamp = serverTimeStamp.toLocaleString();
    let fullDate = localTimeStamp.split(',')[0].split('/');
    let fullTime = localTimeStamp.split(',')[1].split(':');
    let timeIdentifier = fullTime[2].slice(3).toLowerCase();

    let month: { [key: string]: String } = {
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
    'jp-commenting-thread-header': {
      background: 'var(--jp-layout-color1)'
    },
    'jp-commenting-thread-header-resolved': {
      background: 'var(--jp-layout-color2)'
    },
    'jp-commenting-thread-header-upper-area': {
      display: 'flex',
      flexDirection: 'row' as 'row',
      boxSizing: 'border-box' as 'border-box',
      padding: '4px',
      background: 'var(--jp-layout-color1)'
    },
    'jp-commenting-thread-header-upper-area-resolved': {
      display: 'flex',
      flexDirection: 'row' as 'row',
      boxSizing: 'border-box' as 'border-box',
      padding: '4px',
      background: 'var(--jp-layout-color2)'
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
    'jp-commenting-thread-header-photo-resolved': {
      height: '36px',
      width: '36px',
      opacity: 0.5,
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
      color: 'var(--jp-ui-font-color1)',
      fontWeight: 'bold' as 'bold',
      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      margin: '0px'
    },
    'jp-commenting-thread-header-name-resolved': {
      fontSize: '13px',
      color: 'var(--jp-ui-font-color2)',
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
      color: 'var(--jp-ui-font-color1)',
      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    'jp-commenting-thread-header-timestamp-resolved': {
      fontSize: 'var(--jp-ui-font-size0)',
      color: 'var(--jp-ui-font-color2)',
      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    'jp-commenting-annotation-area': {
      display: 'flex',
      maxHeight: '100%',
      maxWidth: '350px',
      boxSizing: 'border-box' as 'border-box',
      paddingBottom: '4px',
      paddingLeft: '4px',
      paddingRight: '4px',
      background: 'var(--jp-layout-color1)'
    },
    'jp-commenting-annotation': {
      fontSize: 'var(--jp-content-font-size0)',
      color: 'var(--jp-ui-font-color1)',
      lineHeight: 'normal'
    },
    'jp-commenting-annotation-area-resolved': {
      display: 'flex',
      maxHeight: '100%',
      maxWidth: '350px',
      boxSizing: 'border-box' as 'border-box',
      paddingBottom: '4px',
      paddingLeft: '4px',
      paddingRight: '4px',
      background: 'var(--jp-layout-color2)'
    },
    'jp-commenting-annotation-resolved': {
      fontSize: 'var(--jp-content-font-size0)',
      color: 'var(--jp-ui-font-color2)',
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

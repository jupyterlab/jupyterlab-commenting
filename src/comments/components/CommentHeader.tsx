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
  /**
   * Id of the thread
   *
   * @type string
   */
  threadId: string;
  /**
   * Removes an annotation by Id
   *
   * @param threadId Type: string - id of annotation to remove
   */
  removeAnnotationById(threadId: string): void;
}

interface ICommentHeaderStates {
  /**
   * State of drop down menu
   */
  moreOptionsOpened: boolean;
}

/**
 * CommentHeader React Component
 */
export class CommentHeader extends React.Component<
  ICommentHeaderProps,
  ICommentHeaderStates
> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: ICommentHeaderProps) {
    super(props);

    this.state = {
      moreOptionsOpened: false
    };
  }

  /**
   * React render function
   */
  render(): React.ReactNode {
    const optionsClass = `jp-commenting-header-options-dropdown-menu${
      (this.state.moreOptionsOpened && this.props.hover) ||
      (this.state.moreOptionsOpened && this.props.expanded)
        ? ' show'
        : ''
    }`;

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
          {this.getCornerButton()}
          <div
            className={optionsClass}
            style={this.styles['jp-commenting-annotations-more-options-area']}
            onBlurCapture={() => this.setOptionsShow(false)}
          >
            {this.getDropDownMenu()}
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
          {this.getCornerButton()}
          <div
            className={optionsClass}
            style={this.styles['jp-commenting-annotations-more-options-area']}
            onBlurCapture={() => this.setOptionsShow(false)}
          >
            {this.getDropDownMenu()}
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

  getMoreButton(): React.ReactNode {
    return (
      <span
        className={'jp-Icon jp-DownCaretIcon'}
        title="More options..."
        style={this.styles['jp-commenting-annotation-more-icon']}
        onMouseEnter={() => this.props.handleShouldExpand(false)}
        onMouseLeave={() => this.props.handleShouldExpand(true)}
        onClick={() => this.setOptionsShow(!this.state.moreOptionsOpened)}
      />
    );
  }

  getDropDownMenu(): React.ReactNode {
    let options = [];

    if (this.props.expanded) {
      options.push(
        <a
          key={'edit'}
          className={'jp-commenting-header-options-dropdown-item'}
          onMouseEnter={() => this.props.handleShouldExpand(false)}
          onMouseLeave={() => this.props.handleShouldExpand(true)}
          style={this.styles['jp-commenting-annotation-more-option-style']}
        >
          Edit
        </a>
      );
    }

    options.push(
      <a
        key={'delete'}
        className={'jp-commenting-header-options-dropdown-item'}
        onMouseEnter={() => this.props.handleShouldExpand(false)}
        onMouseLeave={() => this.props.handleShouldExpand(true)}
        style={this.styles['jp-commenting-annotation-more-option-style']}
        onClick={() => this.props.removeAnnotationById(this.props.threadId)}
      >
        Delete
      </a>
    );

    options.push(
      <a
        key={'re-open-or-resolve'}
        className={'jp-commenting-header-options-dropdown-item'}
        onClick={this.props.handleResolve}
        onMouseEnter={() => this.props.handleShouldExpand(false)}
        onMouseLeave={() => this.props.handleShouldExpand(true)}
        style={this.styles['jp-commenting-annotation-more-option-style']}
      >
        {this.props.resolved ? 'Re-open' : 'Resolve'}
      </a>
    );

    return options;
  }

  setOptionsShow(state: boolean): void {
    this.setState({ moreOptionsOpened: state });
  }

  /**
   * Creates and returns the corner button based on states
   *
   * @type React.ReactNode
   */
  getCornerButton(): React.ReactNode {
    if (this.props.hover && !this.props.expanded) {
      return (
        <div style={this.styles['jp-commenting-thread-header-button-area']}>
          <div
            style={
              this.styles[
                'jp-commenting-thread-header-resolve-reopen-button-area'
              ]
            }
          >
            {!this.props.resolved
              ? this.getResolveButton()
              : this.getReopenButton()}
          </div>
          <div
            style={this.styles['jp-commenting-thread-header-more-icon-area']}
          >
            {this.getMoreButton()}
          </div>
        </div>
      );
    } else if (this.props.expanded) {
      return (
        <div style={this.styles['jp-commenting-thread-header-button-area']}>
          <div
            style={
              this.styles[
                'jp-commenting-thread-header-resolve-reopen-button-area'
              ]
            }
          >
            {!this.props.resolved
              ? this.getResolveButton()
              : this.getReopenButton()}
          </div>
          <div
            style={this.styles['jp-commenting-thread-header-more-icon-area']}
          >
            {this.getMoreButton()}
          </div>
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
      minWidth: '32px',
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
      minWidth: '32px',
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
      minWidth: '32px',
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
    'jp-commenting-thread-header-more-icon-area': {
      display: 'flex',
      paddingRight: '4px',
      paddingLeft: '4px',
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-annotation-more-icon': {
      backgroundSize: '16px',
      margin: '0px',
      minWidth: '16px',
      minHeight: '16px',
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-thread-header-resolve-reopen-button-area': {
      display: 'flex'
    },
    'jp-commenting-thread-header-button-area': {
      display: 'flex',
      minWidth: '96px',
      maxHeight: '18px',
      paddingRight: '4px',
      paddingLeft: '8px',
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-annotation-more-option-style': {
      fontSize: 'var(--jp-ui-font-size0)',
      padding: '4px'
    },
    'jp-commenting-annotations-more-options-area': {
      marginTop: '20px',
      marginRight: '4px',
      zIndex: 1000,
      boxSizing: 'border-box' as 'border-box'
    }
  };
}

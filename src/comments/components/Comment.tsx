import * as React from 'react';

interface ICommentProps {
  /**
   * Actual comment from the user
   *
   * @type string
   */
  context?: string;
  /**
   * State if the CommentCard is expanded
   *
   * @type string
   */
  expanded: boolean;
  /**
   * Name of person commenting
   *
   * @type string
   */
  name: string;
  /**
   * Source of the profile picture
   *
   * @type string
   */
  photo: string;
  /**
   * State if thread is resolved
   *
   * @type boolean
   */
  resolved: boolean;
  /**
   * Time comment was made
   *
   * @type string
   */
  timestamp: string;
  /**
   * Handles expanding
   *
   * @type void
   */
  handleShouldExpand: (state: boolean) => void;
  /**
   * State if is editing a comment
   *
   * @param key Type: string - key of what is being edited,
   * for comment it is the index
   */
  isEditing(key: string): boolean;
  /**
   * Handles setting the state of isEditing
   *
   * @param key Type: string - sets the state to the given key (index)
   */
  setIsEditing(key: string): void;
  /**
   * Index of comment in datastore
   */
  index: number;
}

/**
 * Comment React States
 */
interface ICommentStates {
  /**
   * Boolean to track if mouse is hovering over comment
   */
  hover: boolean;
  /**
   * Text of the edit box
   */
  editBox: string;
}

/**
 * Comment React Component
 */
export class Comment extends React.Component<ICommentProps, ICommentStates> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: ICommentProps) {
    super(props);

    this.state = {
      hover: false,
      editBox: ''
    };

    this.handleChangeEditBox = this.handleChangeEditBox.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleCancelButton = this.handleCancelButton.bind(this);
    this.handleSaveButton = this.handleSaveButton.bind(this);
  }

  /**
   * React render function
   */
  render(): React.ReactNode {
    return this.props.resolved ? (
      <div style={this.styles['jp-commenting-annotation-thread-resolved']}>
        <div
          style={this.styles['jp-commenting-annotation-upper-area-resolved']}
        >
          <div style={this.styles['jp-commenting-annotation-photo-area']}>
            <img
              style={this.styles['jp-commenting-annotation-photo-resolved']}
              src={this.props.photo}
            />
          </div>
          <div style={this.styles['jp-commenting-annotation-info-area']}>
            <div style={this.styles['jp-commenting-annotation-name-area']}>
              <h1 style={this.styles['jp-commenting-annotation-name-resolved']}>
                {this.props.name}
              </h1>
            </div>
            <div style={this.styles['jp-commenting-annotation-timestamp-area']}>
              <p
                style={
                  this.styles['jp-commenting-annotation-timestamp-resolved']
                }
              >
                {this.getStyledTimeStamp()}
              </p>
            </div>
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
      <div
        style={this.styles['jp-commenting-annotation-thread']}
        onMouseOver={() => this.handleMouseOver()}
        onMouseLeave={() => this.handleMouseLeave()}
      >
        <div style={this.styles['jp-commenting-annotation-upper-area']}>
          <div style={this.styles['jp-commenting-annotation-photo-area']}>
            <img
              style={this.styles['jp-commenting-annotation-photo']}
              src={this.props.photo}
            />
          </div>
          <div style={this.styles['jp-commenting-annotation-info-area']}>
            <div style={this.styles['jp-commenting-annotation-name-area']}>
              <h1 style={this.styles['jp-commenting-annotation-name']}>
                {this.props.name}
              </h1>
            </div>
            <div style={this.styles['jp-commenting-annotation-timestamp-area']}>
              <p style={this.styles['jp-commenting-annotation-timestamp']}>
                {this.getStyledTimeStamp()}
              </p>
              {this.state.hover &&
                this.props.expanded &&
                !this.props.isEditing(this.props.index.toString()) && (
                  <div
                    style={this.styles['jp-commenting-annotation-more-area']}
                  >
                    <p style={this.styles['jp-commenting-annotation-more']}>
                      •
                    </p>
                    <a
                      style={this.styles['jp-commenting-annotation-more']}
                      className={'jp-commenting-clickable-text'}
                      onClick={() => {
                        this.setState({ editBox: '' });
                        this.props.setIsEditing(this.props.index.toString());
                      }}
                    >
                      Edit
                    </a>
                    <p style={this.styles['jp-commenting-annotation-more']}>
                      •
                    </p>
                    <a
                      style={this.styles['jp-commenting-annotation-more']}
                      className={'jp-commenting-clickable-text'}
                    >
                      Delete
                    </a>
                  </div>
                )}
            </div>
          </div>
        </div>
        <div style={this.styles['jp-commenting-annotation-area']}>
          {this.props.isEditing(this.props.index.toString()) &&
          this.props.expanded ? (
            <textarea
              className="jp-commenting-text-area"
              id="editBox"
              value={
                this.state.editBox.trim() === ''
                  ? this.state.editBox.trim()
                  : this.state.editBox
              }
              onChange={this.handleChangeEditBox}
              onKeyPress={this.handleKeyPress}
            />
          ) : (
            <p style={this.styles['jp-commenting-annotation']}>
              {this.props.context.length >= 125 && !this.props.expanded
                ? this.props.context.slice(0, 125) + '...'
                : this.props.context}
            </p>
          )}
          {this.getButtons()}
        </div>
      </div>
    );
  }

  /**
   * Handles key events
   *
   * @param e Type: React.KeyboardEvent - keyboard event
   */
  handleKeyPress(e: React.KeyboardEvent): void {
    if (this.state.editBox.trim() !== '' && e.key === 'Enter' && !e.shiftKey) {
      this.handleSaveButton();
      document.getElementById('commentBox').blur();
    }
  }

  /**
   * Handles when the edit box changes
   *
   * @param e Type: React.ChangeEvent<HTMLTextAreaElement> - input box event
   */
  handleChangeEditBox(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({ editBox: e.target.value });
  }

  /**
   * Handles clicking the save button
   */
  handleSaveButton(): void {
    this.setState({ editBox: '' });
    this.props.setIsEditing('');
  }

  /**
   * Handles states when cancel is pressed
   */
  handleCancelButton(): void {
    this.setState({ editBox: '' });
    this.props.setIsEditing('');
  }

  /**
   * Returns the correct buttons for different state combinations
   *
   * @return Type: React.ReactNode - JSX with buttons
   */
  getButtons(): React.ReactNode {
    if (
      this.props.isEditing(this.props.index.toString()) &&
      this.props.expanded
    ) {
      document.getElementById('editBox') !== null &&
        document.getElementById('editBox').focus();
      return (
        <div style={this.styles['jp-commenting-annotation-edit-buttons-area']}>
          {this.getSaveButton()}
          {this.getCancelButton()}
        </div>
      );
    }
  }

  /**
   * Creates and returns reply button
   *
   * @return Type: React.ReactNode
   */
  getSaveButton(): React.ReactNode {
    return (
      <button
        onClick={this.handleSaveButton}
        className="jp-commenting-button-blue"
        type="button"
        disabled={this.state.editBox.trim() === ''}
      >
        Save
      </button>
    );
  }

  /**
   * Creates and returns cancel button
   *
   * @return Type: React.ReactNode
   */
  getCancelButton(): React.ReactNode {
    return (
      <button
        onClick={this.handleCancelButton}
        className="jp-commenting-button-red"
        type="button"
      >
        Cancel
      </button>
    );
  }

  /**
   * Handles hover state when mouse is over comment
   */
  handleMouseOver(): void {
    this.setState({ hover: true });
  }

  /**
   * Handles hover state when mouse leaves comment area
   */
  handleMouseLeave(): void {
    this.setState({ hover: false });
  }

  /**
   * Styles the time stamp
   *
   * @return - String: time stamp string
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
   * CSS Styles
   */
  styles = {
    'jp-commenting-annotation-thread': {
      background: 'var(--jp-layout-color1)'
    },
    'jp-commenting-annotation-thread-resolved': {
      background: 'var(--jp-layout-color2)'
    },
    'jp-commenting-annotation-upper-area': {
      display: 'flex',
      flexDirection: 'row' as 'row',
      boxSizing: 'border-box' as 'border-box',
      padding: '4px',
      background: 'var(--jp-layout-color1)'
    },
    'jp-commenting-annotation-upper-area-resolved': {
      display: 'flex',
      flexDirection: 'row' as 'row',
      boxSizing: 'border-box' as 'border-box',
      padding: '4px',
      background: 'var(--jp-layout-color2)'
    },
    'jp-commenting-annotation-info-area': {
      display: 'flex',
      flexDirection: 'column' as 'column',
      flexShrink: 1,
      minWidth: '52px',
      width: '100%',
      paddingLeft: '4px',
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-annotation-photo-area': {
      display: 'flex'
    },
    'jp-commenting-annotation-photo': {
      height: '2em',
      width: '2em',
      borderRadius: 'var(--jp-border-radius)'
    },
    'jp-commenting-annotation-photo-resolved': {
      height: '28px',
      width: '28px',
      opacity: 0.5,
      borderRadius: 'var(--jp-border-radius)'
    },
    'jp-commenting-annotation-name-area': {
      display: 'flex',
      flexShrink: 1,
      minWidth: '52px',
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-annotation-name': {
      fontSize: '13px',
      color: 'var(--jp-ui-font-color1)',
      fontWeight: 'bold' as 'bold',
      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      margin: '0px'
    },
    'jp-commenting-annotation-name-resolved': {
      fontSize: '13px',
      color: 'var(--jp-ui-font-color2)',
      fontWeight: 'bold' as 'bold',
      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      margin: '0px'
    },
    'jp-commenting-annotation-timestamp-area': {
      display: 'flex',
      minWidth: '32px',
      flexShrink: 1,
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-annotation-timestamp': {
      fontSize: '.7em',
      color: 'var(--jp-ui-font-color1)',
      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    'jp-commenting-annotation-more-area': {
      display: 'flex',
      flexDirection: 'row' as 'row',
      minWidth: '64px',
      flexShrink: 1,
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-annotation-more': {
      display: 'flex',
      fontSize: '.7em',
      paddingLeft: '4px',
      color: 'var(--jp-ui-font-color1)'
    },
    'jp-commenting-annotation-timestamp-resolved': {
      fontSize: '.7em',
      color: 'var(--jp-ui-font-color2)',
      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    'jp-commenting-annotation-area': {
      display: 'flex',
      flexDirection: 'column' as 'column',
      maxHeight: '100%',
      maxWidth: '350px',
      boxSizing: 'border-box' as 'border-box',
      paddingBottom: '4px',
      paddingLeft: '4px',
      paddingRight: '4px',
      background: 'var(--jp-layout-color1)'
    },
    'jp-commenting-annotation': {
      fontSize: '12px',
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
      fontSize: '12px',
      color: 'var(--jp-ui-font-color2)',
      lineHeight: 'normal'
    },
    'jp-commenting-annotation-edit-buttons-area': {
      display: 'flex',
      padding: '4px'
    }
  };
}

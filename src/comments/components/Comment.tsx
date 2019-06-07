import * as React from 'react';

interface ICommentProps {
  /**
   * The contents of the comment by the user
   *
   * @type string
   */
  context: string;
  /**
   * Deletes a comment based on index
   *
   * @param index Type: number - index of comment
   */
  deleteComment(index: number): void;
  /**
   * State when the CommentCard is expanded
   *
   * @type string
   */
  expanded: boolean;
  /**
   * State when the comment is edited
   *
   * @type boolean
   */
  edited: boolean;
  /**
   * Handles expanding
   *
   * @type void
   */
  handleShouldExpand: (state: boolean) => void;
  /**
   * Index of comment in datastore
   */
  index: number;
  /**
   * Checks if a comment is being edited
   *
   * @param key Type: string - key of what is being edited,
   * for comment it is the index
   */
  isEditing(key: string): boolean;
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
   * Used to update a comment to the edited value
   *
   * @param comment Type: string - new comment to push
   * @param index Type: number - index of comment to push edits to
   */
  pushEdit(comment: string, index: number): void;
  /**
   * State if thread is resolved
   *
   * @type boolean
   */
  resolved: boolean;
  /**
   * Handles setting the state of isEditing
   *
   * @param key Type: string - sets the state to the given key (index)
   */
  setIsEditing(key: string): void;
  /**
   * Time comment was made
   *
   * @type string
   */
  timestamp: string;
}

/**
 * Comment React States
 */
interface ICommentStates {
  /**
   * Tracks if the comment was edited when the edit button is clicked
   */
  contextEdited: boolean;
  /**
   * Text of the edit box
   */
  editBox: string;
  /**
   * Boolean to track if mouse is hovering over comment
   */
  hover: boolean;
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
      editBox: '',
      contextEdited: false
    };

    this.handleChangeEditBox = this.handleChangeEditBox.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleCancelSaveButton = this.handleCancelSaveButton.bind(this);
    this.handleEditSaveButton = this.handleEditSaveButton.bind(this);
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
                {(this.props.edited &&
                  'Edited on: ' + this.getStyledTimeStamp()) ||
                  this.getStyledTimeStamp()}
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
                {(this.props.edited &&
                  'Edited on: ' + this.getStyledTimeStamp()) ||
                  this.getStyledTimeStamp()}
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
                      onClick={() => this.props.deleteComment(this.props.index)}
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
                  ? this.state.contextEdited
                    ? this.state.editBox
                    : this.props.context
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
          {this.getEditButtons()}
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
    // Handles saving on enter key
    if (this.state.editBox.trim() !== '' && e.key === 'Enter' && !e.shiftKey) {
      this.handleEditSaveButton();
      document.getElementById('commentBox').blur();
    }
  }

  /**
   * Handles when the edit box changes
   *
   * @param e Type: React.ChangeEvent<HTMLTextAreaElement> - input box event
   */
  handleChangeEditBox(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({ editBox: e.target.value, contextEdited: true });
  }

  /**
   * Handles clicking the save button
   */
  handleEditSaveButton(): void {
    this.props.pushEdit(this.state.editBox, this.props.index);
    this.setState({ editBox: '', contextEdited: false });
    this.props.setIsEditing('');
  }

  /**
   * Handles states when cancel is pressed
   */
  handleCancelSaveButton(): void {
    this.setState({ editBox: '', contextEdited: false });
    this.props.setIsEditing('');
  }

  /**
   * Returns the correct buttons for different state combinations
   *
   * @return Type: React.ReactNode - JSX with buttons
   */
  getEditButtons(): React.ReactNode {
    if (
      this.props.isEditing(this.props.index.toString()) &&
      this.props.expanded
    ) {
      let element = document.getElementById('editBox') as HTMLTextAreaElement;
      if (element !== null) {
        // Focus editbox and set cursor to the end
        element.focus();
        element.setSelectionRange(element.value.length, element.value.length);
      }
      return (
        <div style={this.styles['jp-commenting-annotation-edit-buttons-area']}>
          {this.getEditSaveButton()}
          {this.getEditCancelButton()}
        </div>
      );
    }
  }

  /**
   * Creates and returns reply button
   *
   * @return Type: React.ReactNode
   */
  getEditSaveButton(): React.ReactNode {
    return (
      <button
        onClick={this.handleEditSaveButton}
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
  getEditCancelButton(): React.ReactNode {
    return (
      <button
        onClick={this.handleCancelSaveButton}
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
    'jp-commenting-annotation-edited': {
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
      paddingRight: '4px',
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-annotation-more': {
      display: 'flex',
      fontSize: '.7em',
      paddingLeft: '2px',
      paddingRight: '2px',
      color: 'var(--jp-ui-font-color1)',
      boxSizing: 'border-box' as 'border-box'
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

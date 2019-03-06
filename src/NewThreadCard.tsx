import * as React from 'react';

interface INewThreadCardProps {
  /**
   * Function to put comment back to server
   *
   * @param comment Type: string -  the comment to be added
   * @param tag Type: string - category tag / label for thread
   *
   * @type void function
   */
  putThread: (comment?: string) => void;
  /**
   * Sets the state if a new thread is to be created
   *
   * @param state Type: boolean - state to set to
   *
   * @type void function
   */
  setNewThreadActive: (state: boolean) => void;
  /**
   * Creator object
   *
   * @type any
   */
  creator: any;
}

interface INewThreadCardStates {
  /**
   * Text in the input box
   *
   * @type string
   */
  inputBox: string;
}

export class NewThreadCard extends React.Component<
  INewThreadCardProps,
  INewThreadCardStates
> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: INewThreadCardProps) {
    super(props);
    this.state = { inputBox: '' };

    this.handleChangeCommentBox = this.handleChangeCommentBox.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.createNewThread = this.createNewThread.bind(this);
    this.cancelThread = this.cancelThread.bind(this);
  }

  /**
   * React render function
   */
  render(): React.ReactNode {
    return (
      <div style={this.styles['jp-commenting-new-thread-area']}>
        <div style={this.styles['jp-commenting-new-thread-name-area']}>
          <span style={this.styles['jp-commenting-new-thread-name']}>
            {this.props.creator.name}
          </span>
        </div>
        <div style={this.styles['jp-commenting-text-input-area']}>
          <textarea
            className="jp-commenting-text-area"
            id={'commentBox'}
            value={
              this.state.inputBox.trim() === ''
                ? this.state.inputBox.trim()
                : this.state.inputBox
            }
            onChange={this.handleChangeCommentBox}
            onKeyPress={this.handleKeyPress}
          />
        </div>
        <div style={this.styles['jp-commenting-new-thread-button-area']}>
          {this.getCommentButton()}
          {this.getCancelButton()}
        </div>
      </div>
    );
  }

  /**
   * Called when a component is mounted
   */
  componentDidMount(): void {
    document.getElementById('commentBox').focus();
  }

  /**
   * Creates and returns the comment button
   *
   * @return Type: React.ReactNode - JSX button
   */
  getCommentButton(): React.ReactNode {
    return (
      <button
        className="jp-commenting-button-blue"
        type="button"
        onClick={this.createNewThread}
        disabled={this.state.inputBox.trim() === ''}
      >
        Comment
      </button>
    );
  }

  /**
   * Creates and returns the cancel button
   *
   * @return Type: React.ReactNode - JSX button
   */
  getCancelButton(): React.ReactNode {
    return (
      <button
        className="jp-commenting-button-red"
        type="button"
        onClick={this.cancelThread}
      >
        Cancel
      </button>
    );
  }

  /**
   * Handles when the comment box changes
   *
   * @param e Type: React.ChangeEvent<HTMLTextAreaElement> - input box event
   */
  handleChangeCommentBox(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({ inputBox: e.target.value });
  }

  createNewThread(): void {
    this.props.setNewThreadActive(false);
    this.props.putThread(this.state.inputBox);
  }

  cancelThread(): void {
    this.setState({ inputBox: '' });
    this.props.setNewThreadActive(false);
  }

  /**
   * Handles key events
   *
   * @param e Type: React.KeyboardEvent - keyboard event
   */
  handleKeyPress(e: React.KeyboardEvent): void {
    if (this.state.inputBox.trim() !== '' && e.key === 'Enter' && !e.shiftKey) {
      this.createNewThread();
    }
  }

  /**
   * CSS styles
   */
  styles = {
    'jp-commenting-new-thread-area': {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column' as 'column',
      borderRadius: 'var(--jp-border-radius)',
      border: '1px solid var(--jp-border-color2)',
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-text-input-area': {
      display: 'flex',
      padding: '4px',
      maxWidth: '95%',
      minHeight: '80px'
    },
    'jp-commenting-new-thread-name': {
      fontSize: 'var(--jp-ui-font-size1)',
      fontWeight: 'bold' as 'bold',
      color: 'var(--jp-ui-font-color1)'
    },
    'jp-commenting-new-thread-name-area': {
      display: 'flex',
      padding: '4px'
    },
    'jp-commenting-new-thread-button-area': {
      display: 'flex',
      padding: '4px'
    }
  };
}

import * as React from 'react';

interface INewThreadCardProps {
  /**
   * File path as id for determining where to put new thread
   *
   * @type string
   */
  itemId: string;
  /**
   * Function to put comment back to server
   *
   * @param itemId Type: string - file path of open file
   * @param cardId Type: string - cardId for comment thread
   * @param comment Type: string -  the comment to be added
   * @param tag Type: string - category tag / label for thread
   *
   * @type void function
   */
  putComment: (
    itemId: string,
    cardId: string,
    name: string,
    comment?: string,
    tag?: string
  ) => void;
  /**
   * Sets the state if a new thread is to be created
   *
   * @param state Type: boolean - state to set to
   *
   * @type void function
   */
  setNewThreadActive: (state: boolean) => void;
}

interface INewThreadCardStates {
  /**
   * Text in the input box
   *
   * @type string
   */
  inputBox: string;
  /**
   * Text for thread tag
   *
   * @type string
   */
  tagBox: string;
  /**
   * Text for name box
   *
   * @type string
   */
  nameBox: string;
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
  constructor(props: any) {
    super(props);
    this.state = { inputBox: '', tagBox: '', nameBox: '' };

    this.handleChangeCommentBox = this.handleChangeCommentBox.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChangeTagBox = this.handleChangeTagBox.bind(this);
    this.handleChangeNameBox = this.handleChangeNameBox.bind(this);
  }

  /**
   * React render function
   */
  render() {
    return (
      <div className="card" style={this.styles.card}>
        <label>New Thread</label>
        <input
          type="text"
          className="form-control form-control-sm"
          style={this.styles.field}
          placeholder="Tag"
          onChange={this.handleChangeTagBox}
        />
        <input
          type="text"
          className="form-control form-control-sm"
          style={this.styles.field}
          placeholder="Name"
          onChange={this.handleChangeNameBox}
        />
        <textarea
          className={this.bsc.input}
          style={this.styles.inputBox}
          id={'commentBox'}
          value={this.state.inputBox}
          onChange={this.handleChangeCommentBox}
          onKeyPress={this.handleKeyPress}
        />
      </div>
    );
  }

  // TODO: Get correct type
  /**
   * Handles when the comment box changes
   *
   * @param e Type: any - input box event
   */
  handleChangeCommentBox(e: any): void {
    this.setState({ inputBox: e.target.value });
  }

  // TODO: Get correct type
  /**
   * Handles when the tag box changes
   *
   * @param e Type: any - input box event
   */
  handleChangeTagBox(e: any): void {
    this.setState({ tagBox: e.target.value });
  }

  // TODO: Get correct type
  /**
   * Handles when the name box changes
   *
   * @param e Type: any - input box event
   */
  handleChangeNameBox(e: any): void {
    this.setState({ nameBox: e.target.value });
  }

  /**
   * Handles key events
   *
   * @param e Type: ? - keyboard event
   */
  handleKeyPress(e: any): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.props.setNewThreadActive(false);
      this.props.putComment(
        this.props.itemId,
        'new',
        this.state.nameBox,
        this.state.inputBox,
        this.state.tagBox
      );
    }
  }

  /**
   * Bootstrap classNames
   */
  bsc = {
    input: 'form-control form-control-sm'
  };

  /**
   * CSS styles
   */
  styles = {
    card: {
      padding: '5px'
    },
    field: {
      marginBottom: '5px'
    },
    inputBox: {
      width: '100%',
      height: '80px',
      lineHeight: 'normal'
    }
  };
}

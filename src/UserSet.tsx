import * as React from 'react';

/**
 * React Props
 */
interface IUserSetProps {
  /**
   * Sets the users information from github username
   *
   * @param user Type: string - username for github
   */
  setUserInfo: (user: string) => void;
}

/**
 * React States
 */
interface IUserSetStates {
  /**
   * Text in the input box
   *
   * @type string
   */
  inputBox: string;
}

export class UserSet extends React.Component<IUserSetProps, IUserSetStates> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: any) {
    super(props);
    this.state = { inputBox: '' };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * React render function
   */
  render() {
    return (
      <div className="card" style={this.styles.card}>
        <label>Enter Github Username</label>
        <input
          type="text"
          className="form-control form-control-sm"
          style={this.styles.field}
          placeholder="Name"
          onChange={this.handleInputChange}
          onKeyPress={this.handleKeyPress}
        />
        <button
          className={
            'commentCommentButton commentFooterRightButton float-right'
          }
          type="button"
          onClick={this.handleSubmit}
        >
          Create
        </button>
      </div>
    );
  }

  // TODO: Get correct type
  /**
   * Handles when the comment box changes
   *
   * @param e Type: any - input box event
   */
  handleInputChange(e: any): void {
    this.setState({ inputBox: e.target.value });
  }

  /**
   * Handles key events
   *
   * @param e Type: ? - keyboard event
   */
  handleKeyPress(e: any): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.handleSubmit();
    }
  }

  /**
   * Handles submit
   */
  handleSubmit(): void {
    this.props.setUserInfo(this.state.inputBox);
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
    }
  };
}

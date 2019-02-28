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
  constructor(props: IUserSetProps) {
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
      <div className="--jp-commenting-user-set-area" style={this.styles.card}>
        <label style={this.styles.label}>Enter GitHub Username</label>
        <input
          type="text"
          style={this.styles.field}
          className="bp3-input bp3-small"
          placeholder="Name"
          onChange={this.handleInputChange}
          onKeyPress={this.handleKeyPress}
        />
        <div style={{ float: 'right' }}>
          <button
            className="--jp-commenting-button-blue"
            style={{ marginLeft: '0px' }}
            type="button"
            onClick={this.handleSubmit}
          >
            Enter
          </button>
        </div>
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
   * CSS styles
   */
  styles = {
    card: {
      paddinTop: '8px',
      paddingBottom: '4px',
      paddingLeft: '12px',
      paddingRight: '12px',
      fontSize: 'var(--jp-ui-font-size1)',
      fontFamily: 'helvetica',
      border: 'unset'
    },
    field: {
      marginBottom: '5px',
      paddingLeft: '12px',
      paddingRight: '12px'
    },
    label: {
      paddingTop: '5px',
      marginBottom: '5px'
    }
  };
}

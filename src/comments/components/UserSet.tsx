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
  render(): React.ReactNode {
    return (
      <div style={this.styles['jp-commenting-user-set-area']}>
        <div style={this.styles['jp-commenting-user-set-title-area']}>
          <span style={this.styles['jp-commenting-user-set-title']}>
            Enter GitHub Username
          </span>
        </div>
        <div style={this.styles['jp-commenting-user-set-input-area']}>
          <input
            type="text"
            style={this.styles['jp-commenting-user-set-input']}
            className="jp-commenting-text-area"
            placeholder="Username"
            onChange={this.handleInputChange}
            onKeyPress={this.handleKeyPress}
          />
        </div>
        <div style={this.styles['jp-commenting-user-set-button-area']}>
          <button
            className="jp-commenting-button-blue"
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

  /**
   * Handles when the comment box changes
   *
   * @param e Type: React.ChangeEvent<HTMLInputElement> - input box event
   */
  handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ inputBox: e.target.value });
  }

  /**
   * Handles key events
   *
   * @param e Type: React.KeyboardEvent - keyboard event
   */
  handleKeyPress(e: React.KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.handleSubmit();
    }
  }

  /**
   * Handles submit
   */
  handleSubmit(): void {
    this.props.setUserInfo(this.state.inputBox);
    console.log('here');
  }

  /**
   * CSS styles
   */
  styles = {
    'jp-commenting-user-set-area': {
      display: 'flex',
      flexDirection: 'column' as 'column',
      borderRadius: 'var(--jp-border-radius)',
      borderBottom: '1px solid var(--jp-border-color2)',
      boxSizing: 'border-box' as 'border-box',
      boxShadow: '0 1px 1px rgba(0, 0, 0, 0.075)'
    },
    'jp-commenting-user-set-title-area': {
      display: 'flex',
      padding: '4px'
    },
    'jp-commenting-user-set-title': {
      fontSize: 'var(--jp-ui-font-size1)',
      color: 'var(--jp-ui-font-color1)',
      fontWeight: 'bold' as 'bold'
    },
    'jp-commenting-user-set-input-area': {
      display: 'flex',
      boxSizing: 'border-box' as 'border-box',
      padding: '4px'
    },
    'jp-commenting-user-set-input': {
      boxSizing: 'border-box' as 'border-box',
      width: '100%'
    },
    'jp-commenting-user-set-button-area': {
      display: 'flex',
      padding: '4px'
    }
  };
}

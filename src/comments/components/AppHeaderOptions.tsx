import * as React from 'react';

/**
 * React Props interface
 */
interface IAppHeaderOptionsProps {
  /**
   * Function to set the state of the current sort option in "App.tsx"
   *
   * @param state - string: card sort controller
   *
   * @type void function
   */
  setSortState: (state: string) => void;
  /**
   * Function to set the resolved state. Controls if resolved comments are shown in "App.tsx"
   *
   * @type void function
   */
  showResolvedState: (state: boolean) => void;
  /**
   * State of if a card is currently expanded
   *
   * @type boolean
   */
  cardExpanded: boolean;
  /**
   * Current target name
   *
   * @type string
   */
  target: string;
  /**
   * Tracks if the current open thread had cards
   *
   * @type boolean
   */
  hasThreads: boolean;
  /**
   * Tracks when to show resolved threads
   *
   * @type boolean
   */
  showResolved: boolean;
  /**
   * String that tracks what to sort by
   *
   * @type string
   */
  sortState: string;
}

/**
 * React State Interface
 */
interface IAppHeaderOptionsState {
  /**
   * dropdown state, shows dropdown menu if true
   *
   * @type boolean
   */
  isOpen: boolean;
}

/**
 * AppHeaderOptions React Component
 */
export class AppHeaderOptions extends React.Component<
  IAppHeaderOptionsProps,
  IAppHeaderOptionsState
> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: IAppHeaderOptionsProps) {
    super(props);

    this.state = { isOpen: false };

    this.setResolvedState = this.setResolvedState.bind(this);
    this.matchCheckBoxState = this.matchCheckBoxState.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  /**
   * Checks the state of the component and controlls Show Resolved
   */
  componentDidMount(): void {
    if (document.getElementById('controls') !== null) {
      this.matchCheckBoxState();
    }
  }

  /**
   * React render function
   */
  render() {
    const menuClass = `jp-commenting-header-options-dropdown-menu${
      this.state.isOpen ? ' show' : ''
    }`;
    return (
      <div className="jp-commenting-header-options-area">
        <div style={this.styles.optionBar}>
          {this.getCheckbox()}
          {this.getDropdown()}
        </div>
        <div
          style={this.styles['jp-commenting-header-options-dropdown-menu-area']}
        >
          <div className={menuClass}>{this.getSortItems()}</div>
        </div>
      </div>
    );
  }

  /**
   * Renders the checkbox and label
   *
   * @return React.ReactNode
   */
  getCheckbox(): React.ReactNode {
    return (
      <div
        style={this.styles['jp-commenting-header-options-showResolved-area']}
      >
        <div
          style={
            this.styles['jp-commenting-header-options-showResolved-label-area']
          }
        >
          <label
            style={
              this.props.cardExpanded ||
              this.props.target === undefined ||
              !this.props.hasThreads
                ? this.styles[
                    'jp-commenting-header-options-showResolved-label-disable'
                  ]
                : this.styles[
                    'jp-commenting-header-options-showResolved-label-enable'
                  ]
            }
          >
            Show Resolved
          </label>
        </div>
        <div
          style={
            this.styles[
              'jp-commenting-header-options-showResolved-checkbox-area'
            ]
          }
        >
          <input
            type="checkbox"
            id="controls"
            onClick={() =>
              this.setResolvedState(document.getElementById(
                'controls'
              ) as HTMLInputElement)
            }
            className={'bp3-checkbox'}
            disabled={
              this.props.cardExpanded ||
              this.props.target === undefined ||
              !this.props.hasThreads
            }
          />
        </div>
      </div>
    );
  }

  /**
   * Renders the dropdown menu and label
   *
   * @return React.ReactNode
   */
  getDropdown(): React.ReactNode {
    return (
      <div
        style={this.styles['jp-commenting-header-options-dropdown-area']}
        onClick={this.toggleOpen}
      >
        <div
          style={
            this.styles['jp-commenting-header-options-dropdown-label-area']
          }
        >
          <label
            style={
              this.props.cardExpanded ||
              this.props.target === undefined ||
              !this.props.hasThreads
                ? this.styles[
                    'jp-commenting-header-options-dropdown-label-disabled'
                  ]
                : this.styles[
                    'jp-commenting-header-options-dropdown-label-enabled'
                  ]
            }
          >
            Sort By:
          </label>
        </div>
        <div
          style={
            this.styles['jp-commenting-header-options-dropdown-button-area']
          }
        >
          <span
            style={this.styles['jp-commenting-header-options-dropdown-button']}
          />
        </div>
      </div>
    );
  }

  /**
   * Gets values for the dropdown menu
   *
   * @returns React.ReactNode with dropdown menu items
   */
  getSortItems(): React.ReactNode {
    let table = [];
    for (let key in this.sortItems) {
      table.push(
        <a
          key={key}
          className={
            this.props.sortState === this.sortItems[key].state
              ? 'jp-commenting-header-options-dropdown-item jp-mod-selected'
              : 'jp-commenting-header-options-dropdown-item'
          }
          href="#"
          onClick={() => this.setSortState(this.sortItems[key].state)}
        >
          {this.sortItems[key].name}
        </a>
      );
    }
    return table;
  }

  /**
   * Sets "showResolved" state in "App.tsx"
   */
  setResolvedState(e: HTMLInputElement) {
    this.props.showResolvedState(e.checked);
  }

  /**
   * Sets "sortState" state in "App.tsx"
   * Adds a name to the Sort by: label
   *
   * @param state Type: string - Passed as an argument to the SetSortState function in "App.tsx"
   * @param name Type: string - Assigns passed value to show as a Sort by: label
   */
  setSortState(state: string) {
    this.toggleOpen();
    this.props.setSortState(state);
  }

  /**
   * Sets the "isOpen" state to control the dropdown menu
   */
  toggleOpen(): void {
    (!this.props.target === undefined || this.props.hasThreads) &&
      this.setState({
        isOpen: !this.state.isOpen
      });
  }

  /**
   * Sets the resolve state based on the state of the checkbox
   */
  matchCheckBoxState(): void {
    let checkBox: HTMLInputElement = document.getElementById(
      'controls'
    ) as HTMLInputElement;

    checkBox.checked = this.props.showResolved;
  }

  /**
   * Dropdown menu items
   */
  sortItems = [
    { name: 'Latest Reply', state: 'latest' },
    { name: 'Date Created', state: 'date' },
    { name: 'Most Replies', state: 'mostReplies' }
  ];

  /**
   * Custom styles
   */
  styles = {
    optionBar: {
      height: '24px',
      display: 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'center'
    },
    'jp-commenting-header-options-showResolved-area': {
      height: '24px',
      display: 'flex',
      flexDirection: 'row' as 'row',
      paddingRight: '8px',
      width: '50%',
      minWidth: '50px',
      flexShrink: 1
    },
    'jp-commenting-header-options-showResolved-label-area': {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column' as 'column',
      flexShrink: 1,

      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',

      height: '24px',
      minWidth: '52px',

      textAlign: 'right' as 'right',
      paddingLeft: '4px'
    },
    'jp-commenting-header-options-showResolved-label-enable': {
      fontSize: 'var(--jp-ui-font-size1)',
      color: 'var(--jp-ui-font-color1)'
    },
    'jp-commenting-header-options-showResolved-label-disable': {
      fontSize: 'var(--jp-ui-font-size1)',
      color: 'var(--md-grey-300)'
    },
    'jp-commenting-header-options-showResolved-checkbox-area': {
      alignSelf: 'center',
      minWidth: '20px'
    },
    'jp-commenting-header-options-dropdown-area': {
      height: '24px',
      display: 'flex',
      flexDirection: 'row' as 'row',
      borderLeft: '1px solid var(--jp-border-color1)',
      width: '50%',
      minWidth: '50px',
      flexShrink: 1
    },
    'jp-commenting-header-options-dropdown-label-area': {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column' as 'column',
      flexShrink: 1,

      overflow: 'hidden',
      whiteSpace: 'nowrap' as 'nowrap',

      height: '24px',
      paddingLeft: '4px',
      paddingRight: '4px',
      minWidth: '10px',
      width: '100%'
    },
    'jp-commenting-header-options-dropdown-label-enabled': {
      lineHeight: 'normal',
      fontSize: '13px',
      color: 'var(--jp-ui-font-color1)'
    },
    'jp-commenting-header-options-dropdown-label-disabled': {
      lineHeight: 'normal',
      fontSize: '13px',
      color: 'var(--md-grey-300)'
    },
    'jp-commenting-header-options-dropdown-button-area': {
      display: 'flex',
      height: '24px',
      width: '40px',
      minWidth: '40px'
    },
    'jp-commenting-header-options-dropdown-menu-area': {},
    'jp-commenting-header-options-dropdown-button': {
      minWidth: '40px',
      minHeight: '24px',
      backgroundImage: 'var(--jp-icon-caretdown)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }
  };
}

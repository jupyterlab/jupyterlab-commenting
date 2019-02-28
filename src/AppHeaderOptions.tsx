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
  header: string;
  hasThreads: boolean;
  showResolved: boolean;
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
  showResolved: boolean;
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

    this.state = { isOpen: false, showResolved: false };

    this.setResolvedState = this.setResolvedState.bind(this);
    this.matchCheckBoxState = this.matchCheckBoxState.bind(this);
  }

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
        <div className={menuClass} style={{ marginTop: '30px' }}>
          {this.getSortItems()}
        </div>
        <div style={this.styles.optionBar}>
          {this.renderCheckbox()}
          {this.renderDropdownLabel()}
        </div>
      </div>
    );
  }

  renderCheckbox() {
    return (
      <div style={this.styles.checkboxArea}>
        <label
          style={{
            paddingTop: '5px',
            paddingRight: '4px',
            paddingLeft: '4px'
          }}
          className={
            this.props.cardExpanded ||
            this.props.header === undefined ||
            !this.props.hasThreads
              ? 'jp-commenting-header-options-checkbox-label-disable'
              : 'jp-commenting-header-options-checkbox-label-enable'
          }
        >
          Show Resolved
        </label>
        <input
          type="checkbox"
          id="controls"
          onClick={() =>
            this.setResolvedState(document.getElementById(
              'controls'
            ) as HTMLInputElement)
          }
          className={'bp3-checkbox jp-commenting-header-options-checkbox'}
          disabled={
            this.props.cardExpanded ||
            this.props.header === undefined ||
            !this.props.hasThreads
          }
        />
      </div>
    );
  }

  renderDropdownLabel() {
    return (
      <div style={this.styles.dropdownBox} onClick={this.toggleOpen}>
        <label
          style={
            this.props.cardExpanded ||
            this.props.header === undefined ||
            !this.props.hasThreads
              ? this.styles.dropdownLabelDisabled
              : this.styles.dropdownLabelEnabled
          }
        >
          Sort By:
        </label>
        {this.renderDropdownButton()}
      </div>
    );
  }

  renderDropdownButton() {
    return (
      <div style={this.styles.dropdownButton}>
        <input
          type="image"
          style={this.styles.dropdownButton}
          src={
            'https://material.io/tools/icons/static/icons/baseline-arrow_drop_down-24px.svg'
          }
          data-toggle="dropdown"
          disabled={this.props.header === undefined || !this.props.hasThreads}
        />
      </div>
    );
  }

  /**
   * Sets the "isOpen" state to control the dropdown menu
   */
  toggleOpen = () =>
    this.setState({
      isOpen: !this.state.isOpen
    });
  /**
   * Sets "showResolved" state in "App.tsx"
   */
  setResolvedState(e: HTMLInputElement) {
    this.props.showResolvedState(e.checked);
  }

  matchCheckBoxState(): void {
    let checkBox: HTMLInputElement = document.getElementById(
      'controls'
    ) as HTMLInputElement;

    checkBox.checked = this.props.showResolved;
  }

  /**
   * Gets values for the dropdown menu
   *
   * @callback to setSortState function
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
   * Dropdown menu items
   */
  sortItems = [
    { name: 'Latest Reply', state: 'latest' },
    { name: 'Date Created', state: 'date' },
    { name: 'Most Replies', state: 'mostReplies' },
    { name: 'Position', state: 'position' }
  ];

  /**
   * Custom styles
   */
  styles = {
    optionBar: {
      height: '28px',
      display: 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'center'
    },
    dropdownBox: {
      height: '28px',
      display: 'flex',
      flexDirection: 'row' as 'row',
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid' as 'solid',
      borderLeftColor: 'rgb(224, 224, 224)',
      marginLeft: '8px',
      width: '50%',
      minWidth: '50px',
      flexShrink: 1
    },
    dropdownLabelEnabled: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as 'nowrap',
      height: '28px',
      lineHeight: 'normal',
      fontSize: '13px',
      paddingTop: '6px',
      paddingLeft: '4px',
      paddingRight: '10px',
      minWidth: '10px',
      width: '100%',
      flexShrink: 1
    },
    dropdownLabelDisabled: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as 'nowrap',
      height: '28px',
      lineHeight: 'normal',
      fontSize: '13px',
      paddingTop: '6px',
      paddingLeft: '4px',
      paddingRight: '10px',
      minWidth: '10px',
      width: '100%',
      color: '#E0E0E0',
      flexShrink: 1
    },
    dropdownButton: {
      display: 'flex',
      height: '28px',
      width: '40px',
      minWidth: '40px'
    },
    checkboxArea: {
      height: '28px',
      display: 'flex',
      flexDirection: 'row' as 'row',
      width: '50%',
      minWidth: '50px',
      flexShrink: 1
    }
  };
}

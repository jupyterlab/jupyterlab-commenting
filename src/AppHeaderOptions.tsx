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
    const menuClass = `dropdown-menu dropdown-menu-right${
      this.state.isOpen ? ' show' : ''
    }`;
    return (
      <div className="headerOptionsCard">
        <div
          className={menuClass}
          style={{ top: 'inherit', marginTop: '28px' }}
        >
          {this.getSortItems()}
        </div>
        <div style={this.styles.optionBar}>
          {this.renderCheckbox()}
          {this.renderDropdownLabel()}
          {this.renderDropdownButton()}
        </div>
      </div>
    );
  }

  /**
   * Stores the Sort by: option string
   */
  itemPicked = 'Latest Reply';

  renderCheckbox() {
    return (
      <div style={this.styles.checkboxArea}>
        <label
          className={
            this.props.cardExpanded ||
            this.props.header === undefined ||
            !this.props.hasThreads
              ? 'headerCheckboxLabelDisabled'
              : 'headerCheckboxLabelEnabled'
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
          className={'headerCheckbox'}
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
      <div style={this.styles.dropdownBox}>
        <label
          style={
            this.props.cardExpanded ||
            this.props.header === undefined ||
            !this.props.hasThreads
              ? this.styles.dropdownLabelDisabled
              : this.styles.dropdownLabelEnabled
          }
        >
          Sort By: {this.itemPicked}
        </label>
      </div>
    );
  }

  renderDropdownButton() {
    return (
      <div style={this.styles.dropdownButton} onClick={this.toggleOpen}>
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
          className="dropdown-item"
          href="#"
          onClick={() =>
            this.setSortState(
              this.sortItems[key].state,
              this.sortItems[key].name
            )
          }
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
  setSortState(state: string, name: string) {
    this.toggleOpen();
    this.itemPicked = name;
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
      flexDirection: 'row' as 'row'
    },
    dropdownBox: {
      height: '28px',
      display: 'flex',
      flexDirection: 'row' as 'row',
      flexGrow: 3,
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid' as 'solid',
      borderLeftColor: '#a3a1a0',
      marginLeft: '8px'
    },
    dropdownLabelEnabled: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as 'nowrap',
      height: '28px',
      lineHeight: 'normal',
      fontSize: '13px',
      paddingTop: '6px',
      paddingLeft: '15px',
      paddingRight: '10px',
      color: 'black'
    },
    dropdownLabelDisabled: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as 'nowrap',
      height: '28px',
      lineHeight: 'normal',
      fontSize: '13px',
      paddingTop: '6px',
      paddingLeft: '15px',
      paddingRight: '20px',
      color: '#E0E0E0'
    },
    dropdownButton: { display: 'flex', height: '28px', width: '40px' },
    checkboxArea: {
      marginTop: '5px',
      height: '18px',
      display: 'flex',
      flexDirection: 'row' as 'row',
      flexGrow: 1
    }
  };
}

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
  showResolvedState: () => void;
  /**
   * State of if a card is currently expanded
   *
   * @type boolean
   */
  cardExpanded: boolean;
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
  constructor(props: any) {
    super(props);

    this.state = { isOpen: false };
  }

  /**
   * React render function
   */
  render() {
    const menuClass = `dropdown-menu dropdown-menu-right${
      this.state.isOpen ? ' show' : ''
    }`;
    return (
      <div className="card border-left-0 border-right-0">
        <div style={this.styles.optionBar}>
          {this.renderCheckbox()}
          <div style={this.styles.divider} />
          {this.renderDropdown()}
          <div className={menuClass}>{this.getSortItems()}</div>
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
      <div style={this.styles.checkbox}>
        <label
          htmlFor="controls"
          style={
            this.props.cardExpanded
              ? this.styles.checkboxLabelDisabled
              : this.styles.checkboxLabelEnabled
          }
          className={'jp-DirListing-itemText'}
        >
          Show resolved
        </label>
        <input
          type="checkbox"
          id="controls"
          onClick={this.toggleResolved}
          disabled={this.props.cardExpanded}
        />
      </div>
    );
  }

  renderDropdown() {
    return (
      <div style={this.styles.dropdownBox}>
        <label
          style={
            this.props.cardExpanded
              ? this.styles.dropdownLabelDisabled
              : this.styles.dropdownLabelEnabled
          }
          className={'jp-DirListing-itemText'}
        >
          Sort By: {this.itemPicked}
        </label>
        <div style={this.styles.dropdownButton} onClick={this.toggleOpen}>
          <input
            type="image"
            style={this.styles.dropdownButton}
            src={
              'https://material.io/tools/icons/static/icons/baseline-arrow_drop_down-24px.svg'
            }
            data-toggle="dropdown"
            disabled={this.props.cardExpanded}
          />
        </div>
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
  toggleResolved = () => {
    this.props.showResolvedState();
  };

  /**
   * Gets values for the dropdown menu
   *
   * @callback to setSortState function
   *
   * @returns React.ReactNode with dropdown menu items
   */
  getSortItems(): React.ReactNode {
    let table = [];
    for (let key = 0; key < this.sortItems.length; key++) {
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
      borderRadius: 0,
      display: 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-around'
    },
    dropdownBox: {
      height: '27px',
      display: 'flex',
      flexDirection: 'row' as 'row'
    },
    dropdownLabelEnabled: {
      height: '27px',
      lineHeight: 'normal',
      fontSize: '13px',
      paddingTop: '6px',
      paddingLeft: '15px',
      paddingRight: '10px',
      color: 'black',
      textAlign: 'center' as 'center'
    },
    dropdownLabelDisabled: {
      height: '27px',
      lineHeight: 'normal',
      fontSize: '13px',
      paddingTop: '6px',
      paddingLeft: '15px',
      paddingRight: '20px',
      color: '#E0E0E0',
      textAlign: 'center' as 'center'
    },
    dropdownButton: { height: '27px', width: '40px' },
    divider: {
      borderRightWidth: '1px',
      borderRightStyle: 'solid' as 'solid',
      borderRightColor: '#a3a1a0',
      marginRight: '5px',
      marginLeft: '5px'
    },
    checkbox: {
      height: '27px',
      display: 'flex',
      flexDirection: 'row' as 'row'
    },
    checkboxLabelEnabled: {
      marginBottom: '0px',
      paddingRight: '4px',
      paddingTop: '3px',
      fontSize: '13px',
      color: 'black',
      paddingLeft: '5px',
      textAlign: 'right' as 'right'
    },
    checkboxLabelDisabled: {
      paddingRight: '4px',
      paddingTop: '3px',
      fontSize: '13px',
      color: '#E0E0E0',
      paddingLeft: '5px',
      textAlign: 'right' as 'right'
    }
  };
}

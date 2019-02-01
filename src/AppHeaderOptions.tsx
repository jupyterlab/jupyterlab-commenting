import * as React from 'react';

/**
 * React Props interface
 */
interface IAppHeaderOptionsProps {
  /**
   * Function to set the state of the current sort option in "App.tsx"
   *
   * @param state - string: card sort controller
   */
  setSortState: (state: string) => void;
  /**
   * Function to set the resolved state. Controls if resolved comments are shown in "App.tsx"
   *
   */
  showResolvedState: () => void;
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
      <div
        className="card border-left-0 border-right-0"
        style={this.styles.optionBar}
      >
        <div
          className="card-title row border-left-0 border-right-0"
          style={this.styles.optionBar}
        >
          {/* Checkbox start */}
          <div className={this.bsc.checkbox} style={this.styles.checkbox}>
            <label
              className={this.bsc.checkboxLabel}
              htmlFor="controls"
              style={this.styles.checkboxLabel}
            >
              Show resolved{' '}
            </label>
            <input
              type="checkbox"
              className="form-check-input"
              id="controls"
              onClick={this.toggleResolved}
            />
          </div>
          {/* Checkbox End */}
          {/* Dropdown Start */}
          <label
            className={this.bsc.dropdownLabel}
            style={this.styles.dropdownLabel}
          >
            Sort By: {this.itemPicked}
          </label>
          <div
            className={this.bsc.dropdown}
            style={this.styles.dropdownButton}
            onClick={this.toggleOpen}
          >
            <button
              type="button"
              className={this.bsc.dropdownButton}
              style={this.styles.dropdownButton}
              data-toggle="dropdown"
            />
            <div className={menuClass}>{this.getSortItems()}</div>
          </div>
          {/* Dropdown End */}
        </div>
      </div>
    );
  }

  /**
   * Stores the Sort by: option string
   */
  itemPicked = 'Latest Reply';

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
   * Bootstrap classes
   */
  bsc = {
    checkbox: 'col-lg-5 col-md-5 col-sm-5 form-check text-center',
    checkboxLabel: '',
    dropdown: 'col-lg-1 col-md-1 col-sm-1 px-0',
    dropdownLabel: 'col-lg-5 col-md-5 col-sm-5 text-center my-0 px-0',
    dropdownButton:
      'col-lg-12 col-md-12 col-sm-12 btn dropdown-toggle px-0 py-0'
  };

  /**
   * Custom styles
   */
  styles = {
    optionBar: { height: '28px', borderRadius: 0 },
    dropdownLabel: {
      height: '27px',
      lineHeight: 'normal',
      fontSize: '13px',
      paddingTop: '5px',
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid' as 'solid',
      borderLeftColor: '#a3a1a0'
    },
    dropdownButton: { height: '28px', width: '40px' },
    checkbox: {},
    checkboxLabel: {
      paddingRight: '24px',
      lineHeight: 'normal',
      fontSize: '13px'
    }
  };
}

import * as React from 'react';

export class AppHeaderOptions extends React.Component {
  state = {
    isOpen: false,
    isResolved: false,
    sorted: 'latest'
  };

  itemPicked = 'Latest Reply';

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });
  toggleResolved = () => this.setState({ isResolved: !this.state.isResolved });

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

  setSortState(state: string, name: string) {
    this.itemPicked = name;
    this.setState({ sorted: state });
  }

  render() {
    const menuClass = `dropdown-menu dropdown-menu-right${
      this.state.isOpen ? ' show' : ''
    }`;
    return (
      <div className="card" style={this.styles.optionBar}>
        <div className="card-title row" style={this.styles.optionBar}>
          {/* Checkbox start */}
          <div className={this.bsc.checkbox} style={this.styles.checkbox}>
            <label
              className={this.bsc.checkboxLabel}
              htmlFor="contols"
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
            className={this.bsc.dropdownLable}
            style={this.styles.dropdownLable}
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

  sortItems = [
    { name: 'Latest Reply', state: 'latest' },
    { name: 'Date Created', state: 'date' },
    { name: 'Most Replies', state: 'mostReplies' },
    { name: 'Position', state: 'position' }
  ];

  bsc = {
    checkbox: 'col-lg-5 col-md-5 col-sm-5 form-check text-center',
    checkboxLabel: '',
    dropdown: 'col-lg-1 col-md-1 col-sm-1 px-0',
    dropdownLable:
      'col-lg-5 col-md-5 col-sm-5 text-center border-left border-dark my-0 px-0',
    dropdownButton:
      'col-lg-12 col-md-12 col-sm-12 btn dropdown-toggle px-0 py-0'
  };

  styles = {
    optionBar: {
      height: '28px',
      borderRadius: 0
    },
    dropdownLable: {
      height: '28px',
      lineHeight: 'normal',
      fontSize: '13px',
      paddingTop: '5px'
    },
    dropdownButton: {
      height: '28px',
      width: '40px'
    },
    checkbox: {
      paddingBottom: '5px'
    },
    checkboxLabel: {
      paddingRight: '24px',
      lineHeight: 'normal',
      fontSize: '13px'
    }
  };
}

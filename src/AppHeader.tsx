import * as React from 'react';

const bsc = {
  checkbox: 'form-check col-lg-5 col-md-5 col-sm-5 py-1 text-center',
  checkboxLabel: 'row-lg-6',
  dropdown: 'col-lg-2 col-md-2 col-sm-2 px-0',
  dropdownLable:
    'col-lg-5 col-md-5 col-sm-5 text-center border-left border-dark py-1 my-0 px-0',
  dropdownButton: 'btn dropdown-toggle col-lg-12 col-md-12 col-sm-12'
};

const sortItems = [
  { name: 'Latest Reply', state: 'latest' },
  { name: 'Date Created', state: 'date' },
  { name: 'Most Replies', state: 'mostReplies' },
  { name: 'Position', state: 'position' }
];

const styles = {
  optionBar: {
    height: '38px'
  },
  dropdown: {
    height: '38px'
  },
  checkboxLabel: {
    paddingRight: '24px'
  },
  emptyHeader: {
    background: 'white',
    color: '#a3a1a0'
  },
  header: {
    background: 'white',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    fontWeight: 'bold' as 'bold'
  }
};

interface IAppHeaderProps {
  header?: string;
}

export class AppHeader extends React.Component<IAppHeaderProps> {
  constructor(props: any) {
    super(props);
  }

  renderAppHeader(): React.ReactNode {
    if (this.props.header === undefined) {
      return (
        <h5
          className="card-header text-center border-0"
          style={styles.emptyHeader}
        >
          Select a file to view comments
        </h5>
      );
    }

    return (
      <h3 className="card-header text-center border-0" style={styles.header}>
        {this.props.header}
      </h3>
    );
  }

  render() {
    return (
      <div className="card border-0 py-1">
        <div>{this.renderAppHeader()}</div>
        <div>
          <AppHeaderOptions />
        </div>
      </div>
    );
  }
}

// App header menu component
class AppHeaderOptions extends React.Component {
  state = {
    isOpen: false,
    isResolved: false,
    latest: false,
    date: false,
    mostReplies: false,
    position: false
  };

  itemPicked = '';

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });
  toggleResolved = () => this.setState({ isResolved: !this.state.isResolved });

  getSortItems(): React.ReactNode {
    let table = [];
    for (let key = 0; key < sortItems.length; key++) {
      table.push(
        <a
          key={key}
          className="dropdown-item"
          href="#"
          onClick={() =>
            this.setSortState(sortItems[key].state, sortItems[key].name)
          }
        >
          {sortItems[key].name}
        </a>
      );
    }
    return table;
  }

  setSortState(state?: any, name?: string) {
    this.resetState();
    if (state === 'latest') {
      this.itemPicked = name;
      this.setState({ latest: !this.state.latest });
    } else if (state === 'date') {
      this.itemPicked = name;
      this.setState({ date: !this.state.date });
    } else if (state === 'mostReplies') {
      this.itemPicked = name;
      this.setState({ mostReplies: !this.state.mostReplies });
    } else if (state === 'position') {
      this.itemPicked = name;
      this.setState({ position: !this.state.position });
    }
  }

  resetState() {
    this.setState({ latest: false });
    this.setState({ date: false });
    this.setState({ mostReplies: false });
    this.setState({ position: false });
  }

  render() {
    const menuClass = `dropdown-menu dropdown-menu-right${
      this.state.isOpen ? ' show' : ''
    }`;
    return (
      <div className="card" style={styles.optionBar}>
        <div className="card-title row" style={styles.optionBar}>
          <div className={bsc.checkbox}>
            <label
              className={bsc.checkboxLabel}
              htmlFor="contols"
              style={styles.checkboxLabel}
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
          <label className={bsc.dropdownLable} style={styles.dropdown}>
            Sort By: {this.itemPicked}
          </label>
          <div
            className={bsc.dropdown}
            style={styles.dropdown}
            onClick={this.toggleOpen}
          >
            <button
              type="button"
              className={bsc.dropdownButton}
              data-toggle="dropdown"
            />
            <div className={menuClass}>{this.getSortItems()}</div>
          </div>
        </div>
      </div>
    );
  }
}

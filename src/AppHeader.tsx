import * as React from 'react';

import { AppHeaderOptions } from './AppHeaderOptions';

interface IAppHeaderProps {
  header?: string;
}

export class AppHeader extends React.Component<IAppHeaderProps> {
  constructor(props: any) {
    super(props);
    this.renderAppHeader = this.renderAppHeader.bind(this);
  }

  render() {
    return (
      <div className="card border-0 py-1">
        <div>{this.renderAppHeader(this.props.header)}</div>
        <div>
          <AppHeaderOptions />
        </div>
      </div>
    );
  }

  renderAppHeader(header: any): React.ReactNode {
    if (this.props.header === undefined) {
      return (
        <h5
          className="card-header text-center border-0"
          style={this.styles.emptyHeader}
        >
          Select a file to view comments
        </h5>
      );
    } else {
      return (
        <h3
          className="card-header text-center border-0"
          style={this.styles.header}
        >
          {this.props.header}
        </h3>
      );
    }
  }

  styles = {
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
}

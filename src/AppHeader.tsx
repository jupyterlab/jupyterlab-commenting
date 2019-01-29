import * as React from 'react';

import { AppHeaderOptions } from './AppHeaderOptions';

interface IAppHeaderProps {
  header?: string;
  /**
   * Tracks if card is expanded
   * @type boolean
   */
  expanded?: boolean;
  /**
   * Function to set the state of the current expanded card in "App.tsx"
   * @param cardId - string: Card unique id
   */
  setExpandedCard: (cardId: string) => void;
}

export class AppHeader extends React.Component<IAppHeaderProps> {
  constructor(props: any) {
    super(props);

    this.renderAppHeader = this.renderAppHeader.bind(this);
    this.getBackButton = this.getBackButton.bind(this);
    this.setShrink = this.setShrink.bind(this);
  }

  render() {
    return (
      <div className="card border-0 py-1">
        <div className="row">
          <div className={'col-lg-1'}>
            {this.props.expanded && this.getBackButton()}
          </div>
          <div className={'col-lg-10'}>
            {this.renderAppHeader(this.props.header)}
          </div>
        </div>
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

  getBackButton(): React.ReactNode {
    return (
      <input
        type="image"
        style={this.styles.backButton}
        src={
          'https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_arrow_back_48px-512.png'
        }
        alt="Back"
        onClick={this.setShrink}
      />
    );
  }

  /**
   * Sets the state expandedCard to ' ' in App.tsx, which will shrink
   */
  setShrink(): void {
    this.props.setExpandedCard(' ');
  }

  styles = {
    emptyHeader: { background: 'white', color: '#a3a1a0' },
    header: {
      background: 'white',
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      fontSize: '24px'
    },
    backButton: {
      width: '16px',
      height: '16px',
      marginTop: '14px',
      marginLeft: '10px'
    }
  };

  fileTypes = [
    {
      mimeTypes: ['text/markdown'],
      iconClass: 'jp-MaterialIcon jp-MarkdownIcon'
    },
    {
      mimeTypes: ['text/x-python'],
      iconClass: 'jp-MaterialIcon jp-PythonIcon'
    },
    {
      mimeTypes: ['application/json'],
      iconClass: 'jp-MaterialIcon jp-JSONIcon'
    },
    {
      mimeTypes: ['text/csv'],
      iconClass: 'jp-MaterialIcon jp-SpreadsheetIcon'
    },
    {
      mimeTypes: ['text/csv'],
      iconClass: 'jp-MaterialIcon jp-SpreadsheetIcon'
    },
    {
      mimeTypes: ['text/x-rsrc'],
      iconClass: 'jp-MaterialIcon jp-RKernelIcon'
    },
    {
      mimeTypes: ['text/x-yaml', 'text/yaml'],
      iconClass: 'jp-MaterialIcon jp-YamlIcon'
    },
    {
      mimeTypes: ['image/svg+xml'],
      iconClass: 'jp-MaterialIcon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/tiff'],
      iconClass: 'jp-MaterialIcon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/jpeg'],
      iconClass: 'jp-MaterialIcon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/gif'],
      iconClass: 'jp-MaterialIcon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/png'],
      iconClass: 'jp-MaterialIcon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/bmp'],
      iconClass: 'jp-MaterialIcon jp-ImageIcon'
    }
  ];
}

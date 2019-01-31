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
          <div className={'col-lg-2'}>
            {this.props.expanded && this.getBackButton()}
          </div>
          <div className={'col-lg-9 text-center px-0'}>
            {this.renderAppHeader(this.props.header)}
          </div>
        </div>
        <div>
          <AppHeaderOptions />
        </div>
      </div>
    );
  }

  renderAppHeader(header: string): React.ReactNode {
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
        <div style={this.styles.header}>
          {this.getFileIcon(this.props.header)}
          <label
            className="card-header text-center border-0 py-0"
            style={this.styles.headerLabel}
          >
            {this.props.header}
          </label>
        </div>
      );
    }
  }

  getFileIcon(header: string): React.ReactNode {
    try {
      let extentionName = header.slice(header.indexOf('.'));
      for (let key = 0; key < this.fileTypes.length; key++) {
        for (
          let value = 0;
          value < this.fileTypes[key].extensions.length;
          value++
        ) {
          if (extentionName === this.fileTypes[key].extensions[value]) {
            return (
              <span
                className={this.fileTypes[key].iconClass}
                style={this.styles.headerIcon}
              />
            );
          }
        }
      }
      return (
        <span
          className={'jp-Icon jp-FileIcon'}
          style={this.styles.headerIcon}
        />
      );
    } catch {
      return <span />;
    }
  }

  getBackButton(): React.ReactNode {
    return (
      <input
        type="image"
        style={this.styles.backButton}
        src={'https://i.ibb.co/xg3hwy8/Vector.png'}
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
    header: { display: 'inline-block', alignItems: 'center' },
    headerLabel: {
      paddingLeft: '5px',
      background: 'white',
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      fontSize: '24px'
    },
    headerIcon: {
      minWidth: '28px',
      minHeight: '28px',
      backgroundSize: '28px',
      marginTop: '13px',
      marginBottom: '18px',
      padding: '8px'
    },
    backButton: {
      width: '16px',
      height: '16px',
      marginTop: '20px',
      marginLeft: '15px'
    }
  };

  fileTypes = [
    {
      extensions: ['.md'],
      mimeTypes: ['text/markdown'],
      iconClass: 'jp-Icon jp-MarkdownIcon'
    },
    {
      extensions: ['.py'],
      mimeTypes: ['text/x-python'],
      iconClass: 'jp-Icon jp-PythonIcon'
    },
    {
      extensions: ['.json'],
      mimeTypes: ['application/json'],
      iconClass: 'jp-Icon jp-JSONIcon'
    },
    {
      extensions: ['.csv'],
      mimeTypes: ['text/csv'],
      iconClass: 'jp-Icon jp-SpreadsheetIcon'
    },
    {
      extensions: ['.tsv'],
      mimeTypes: ['text/csv'],
      iconClass: 'jp-Icon jp-SpreadsheetIcon'
    },
    {
      mimeTypes: ['text/x-rsrc'],
      extensions: ['.r'],
      iconClass: 'jp-Icon jp-RKernelIcon'
    },
    {
      mimeTypes: ['text/x-yaml', 'text/yaml'],
      extensions: ['.yaml', '.yml'],
      iconClass: 'jp-Icon jp-YamlIcon'
    },
    {
      mimeTypes: ['image/svg+xml'],
      extensions: ['.svg'],
      iconClass: 'jp-Icon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/tiff'],
      extensions: ['.tif', '.tiff'],
      iconClass: 'jp-Icon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/jpeg'],
      extensions: ['.jpg', '.jpeg'],
      iconClass: 'jp-Icon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/gif'],
      extensions: ['.gif'],
      iconClass: 'jp-Icon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/png'],
      extensions: ['.png'],
      iconClass: 'jp-Icon jp-ImageIcon'
    },
    {
      mimeTypes: ['image/bmp'],
      extensions: ['.bmp'],
      iconClass: 'jp-Icon jp-ImageIcon'
    }
  ];
}

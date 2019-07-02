import * as React from 'react';

/**
 * React Props interface
 */
interface IAppHeaderProps {
  /**
   * Tracks if card is expanded
   *
   * @type boolean
   */
  cardExpanded: boolean;
  /**
   * Receives the AppHeaderOption component for render purposes
   *
   * @type React.ReactNode
   */
  headerOptions: React.ReactNode;
  /**
   * Function to set the state of the current expanded card in "App.tsx"
   *
   * @param cardId - string: Card unique id
   */
  setExpandedCard: (cardId: string) => void;
  /**
   * Receives a value for a header
   *
   * @type string
   */
  target: string;
  /**
   * Tracks if the new thread window is active
   *
   * @type boolean
   */
  threadOpen: boolean;
}

/**
 * AppHeader React Component
 */
export class AppHeader extends React.Component<IAppHeaderProps> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: IAppHeaderProps) {
    super(props);

    this.getAppHeader = this.getAppHeader.bind(this);
    this.getBackButton = this.getBackButton.bind(this);
    this.setShrink = this.setShrink.bind(this);
  }

  /**
   * React render function
   */
  render(): React.ReactNode {
    return (
      <div style={this.styles['jp-commenting-app-header-area']}>
        <div style={this.styles['jp-commenting-header-area']}>
          <div style={this.styles['jp-commenting-back-arrow-area']}>
            {this.props.cardExpanded && this.props.target !== undefined
              ? this.getBackButton()
              : ''}
          </div>
          {this.getAppHeader(this.props.target)}
        </div>
        {this.shouldRenderOptions()}
      </div>
    );
  }

  /**
   * Checks the state of New Thread
   *
   * @returns Type: React.ReactNode. If the New Thread is not open
   */
  shouldRenderOptions(): React.ReactNode {
    if (!this.props.threadOpen && !this.props.cardExpanded) {
      return <div>{this.props.headerOptions}</div>;
    } else {
      return <div />;
    }
  }

  /**
   * Checks the value of the header prop and returns a React component
   * with a value held by the header prop, or a header placeholder
   *
   * @param header Type: string
   * @return Type: React.ReactNode - App Header with correct string
   */
  getAppHeader(header: string): React.ReactNode {
    if (header === undefined) {
      return (
        <div style={this.styles['jp-commenting-header-target-area']}>
          <div style={this.styles['jp-commenting-header-label-area']}>
            <label style={this.styles['jp-commenting-header-label']}>
              Select a file to view comments
            </label>
          </div>
        </div>
      );
    } else {
      return (
        <div style={this.styles['jp-commenting-header-target-area']}>
          {this.getFileIcon(this.props.target)}
          <div style={this.styles['jp-commenting-header-label-area']}>
            <label style={this.styles['jp-commenting-header-label']}>
              {header}
            </label>
          </div>
        </div>
      );
    }
  }

  /**
   * Strips the header of the extension ending and compares it to the list of supported extensions
   *
   * @param header Type: string
   * @return Type: React.ReactNode - span with a correct image class
   */
  getFileIcon(header: string): React.ReactNode {
    try {
      let extensionName = header.slice(header.indexOf('.'));
      for (let key in this.fileTypes) {
        for (let value in this.fileTypes[key].extensions) {
          if (extensionName === this.fileTypes[key].extensions[value]) {
            return (
              <div style={this.styles['jp-commenting-header-target-icon-area']}>
                <span
                  className={this.fileTypes[key].iconClass}
                  style={this.styles['jp-commenting-header-target-icon']}
                />
              </div>
            );
          }
        }
      }
      return (
        <div style={this.styles['jp-commenting-header-target-icon-area']}>
          <span
            className="jp-FileIcon"
            style={this.styles['jp-commenting-header-target-icon']}
          />
        </div>
      );
    } catch {
      return <span />;
    }
  }
  /**
   * Renders a back button inside the header
   *
   * @return Type: React.ReactNode -
   *    Input button @type Image
   */
  getBackButton(): React.ReactNode {
    return (
      <div
        style={this.styles['jp-commenting-header-back-arrow']}
        onClick={this.setShrink}
      />
    );
  }

  /**
   * Sets the state expandedCard to ' ' in App.tsx, which will shrink
   * or closes "New Thread" window
   */
  setShrink(): void {
    this.props.setExpandedCard(' ');
  }

  /**
   * Stores all the available file extension types
   */
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

  /**
   * App header styles
   */
  styles = {
    'jp-commenting-app-header-area': {
      display: 'flex',
      flexDirection: 'column' as 'column',
      borderBottom: '1px solid var(--jp-border-color1)',
      boxSizing: 'border-box' as 'border-box'
    },
    'jp-commenting-header-area': {
      display: 'flex',
      flexShrink: 1,
      flexDirection: 'row' as 'row',
      padding: '4px',
      minWidth: '52px'
    },
    'jp-commenting-back-arrow-area': {
      display: 'flex',
      flexDirection: 'column' as 'column',
      justifyContent: 'center',
      width: '20px'
    },
    'jp-commenting-header-back-arrow': {
      width: '12px',
      height: '12px',
      backgroundImage: 'var(--jp-image-back-arrow)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      cursor: 'pointer'
    },
    'jp-commenting-header-target-area': {
      display: 'flex',
      flexDirection: 'row' as 'row',
      minWidth: '52px',
      paddingLeft: '8px',
      flexShrink: 1
    },
    'jp-commenting-header-target-icon-area': {
      display: 'flex'
    },
    'jp-commenting-header-target-icon': {
      minWidth: '20px',
      minHeight: '20px',
      backgroundSize: '20px'
    },
    'jp-commenting-header-label-area': {
      paddingLeft: '4px',
      textAlign: 'left' as 'left',
      whiteSpace: 'nowrap' as 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      flexShrink: 1
    },
    'jp-commenting-header-label': {
      fontSize: 'var(--jp-ui-font-size1)',
      color: 'var(--jp-ui-font-color1)'
    }
  };
}

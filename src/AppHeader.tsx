import * as React from 'react';

/**
 * React Props interface
 */
interface IAppHeaderProps {
  /**
   * Receives a value for a header
   *
   * @type string
   */
  header?: string;
  /**
   * Tracks if card is expanded
   *
   * @type boolean
   */
  cardExpanded?: boolean;
  /**
   * Tracks if the new thread window is active
   *
   * @type boolean
   */
  threadOpen?: boolean;
  /**
   * Function to set the state of the current expanded card in "App.tsx"
   *
   * @param cardId - string: Card unique id
   */
  setExpandedCard: (cardId: string) => void;
  /**
   * Recieves the AppHeaderOption componenet for render purposes
   *
   * @type React.ReactNode
   */
  headerOptions: React.ReactNode;
  /**
   * Sets the state of if creating a new thread state is active
   */
  setNewThreadActive: (state: boolean) => void;
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

    this.renderAppHeader = this.renderAppHeader.bind(this);
    this.getBackButton = this.getBackButton.bind(this);
    this.setShrink = this.setShrink.bind(this);
    this.handleNewThreadButton = this.handleNewThreadButton.bind(this);
  }

  /**
   * React render function
   */
  render() {
    return (
      <div className="headerCard">
        <div style={this.styles.headercard}>
          <div>{this.getCornerButton()}</div>
          {this.renderAppHeader(this.props.header)}
          <div style={this.styles.placeholder} />
        </div>
        {this.shouldRenderOptions()}
      </div>
    );
  }

  /**
   * Checks the value of the header prop and returns a React component
   * with a value held by the header prop, or a header placeholder
   *
   * @param header Type: string
   * @return Type: React.ReactNode - App Header with correct string
   */
  renderAppHeader(header: string): React.ReactNode {
    if (this.props.header === undefined) {
      return (
        <div>
          <h5
            className={'jp-DirListing-itemText'}
            style={this.styles.emptyHeader}
          >
            Select a file to view comments
          </h5>
        </div>
      );
    } else {
      return (
        <span style={this.styles.header}>
          {this.getFileIcon(this.props.header)}
          <span
            style={this.styles.headerLabel}
            className={'--jp-ui-font-size1'}
          >
            {this.props.header}
          </span>
        </span>
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
      for (let key = 0; key < this.fileTypes.length; key++) {
        for (
          let value = 0;
          value < this.fileTypes[key].extensions.length;
          value++
        ) {
          if (extensionName === this.fileTypes[key].extensions[value]) {
            return (
              <span
                className={this.fileTypes[key].iconClass}
                style={this.styles.headerIcon}
              />
            );
          }
        }
      }
      return <span className={'jp-FileIcon'} style={this.styles.headerIcon} />;
    } catch {
      return <span />;
    }
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
   * Returns a button from the current state of the comment box
   *
   * @return Type: React.ReactNode
   */
  getCornerButton(): React.ReactNode {
    if (
      !this.props.cardExpanded &&
      this.props.header !== undefined &&
      !this.props.threadOpen
    ) {
      return this.getNewThreadButton();
    } else if (this.props.cardExpanded && this.props.header !== undefined) {
      return this.getBackButton();
    } else {
      return;
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
      <input
        type="image"
        style={this.styles.backButton}
        src={'https://i.ibb.co/xg3hwy8/Vector.png'}
        onClick={this.setShrink}
      />
    );
  }

  /**
   * Creates the new thread button
   *
   * @return Type: React.ReactNode - new thread button JSX
   */
  getNewThreadButton(): React.ReactNode {
    return (
      <span
        className={
          'jp-AddIcon jp-Icon jp-ToolbarButtonComponent-icon jp-Icon-16'
        }
        style={this.styles.newCommentButton}
        onClick={this.handleNewThreadButton}
      />
    );
  }

  /**
   * Handles the state of if new thread box should be open
   */
  handleNewThreadButton(): void {
    this.props.setNewThreadActive(true);
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
    headercard: {
      display: 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-around'
    },
    emptyHeader: {
      background: 'white',
      color: '#4F4F4F',
      marginTop: '15px',
      marginBottom: '15px'
    },
    header: {
      display: 'flex',
      flexDirection: 'row' as 'row',
      maxWidth: '200px',
      paddingTop: '4px',
      paddingBottom: '30px'
    },
    headerLabel: {
      paddingLeft: '5px',
      textAlign: 'left' as 'left',
      whiteSpace: 'nowrap' as 'nowrap',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    headerIcon: {
      minWidth: '18px',
      minHeight: '18px',
      backgroundSize: '18px',
      padding: '8px'
    },
    backButton: {
      display: 'flex',
      width: '12px',
      height: '12px',
      marginTop: '11px'
    },
    newCommentButton: {
      display: 'flex',
      width: '20px',
      height: '20px',
      marginTop: '7px'
    },
    placeholder: { width: '20px' }
  };
}

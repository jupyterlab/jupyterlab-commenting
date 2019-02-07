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
  setNewThreadActive: (state: boolean, itemId: string) => void;
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
  constructor(props: any) {
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
      <div className="card border-0 py-1">
        <div style={this.styles.headercard}>
          <div>{this.getCornerButton()}</div>
          {this.renderAppHeader(this.props.header)}
          <div style={this.styles.placeholder} />
        </div>
        <div>{this.props.headerOptions}</div>
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
            className={'jp-DirListing-itemText'}
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
    } else if (
      (this.props.cardExpanded || this.props.threadOpen) &&
      this.props.header !== undefined
    ) {
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
      <input
        type="image"
        style={this.styles.newCommentButton}
        src={
          'https://material.io/tools/icons/static/icons/baseline-add-24px.svg'
        }
        onClick={this.handleNewThreadButton}
      />
    );
  }

  /**
   * Handles the state of if new thread box should be open
   */
  handleNewThreadButton(): void {
    if (!this.props.cardExpanded) {
      this.props.setNewThreadActive(!this.props.threadOpen, this.props.header);
    }
  }

  /**
   * Sets the state expandedCard to ' ' in App.tsx, which will shrink
   * or closes "New Thread" window
   */
  setShrink(): void {
    this.props.setExpandedCard(' ');
    this.handleNewThreadButton();
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
      marginTop: '20px',
      marginBottom: '20px'
    },
    header: {
      display: 'flex',
      flexDirection: 'row' as 'row',
      padding: '4px',
      marginTop: '10px',
      marginBottom: '10px'
    },
    headerLabel: {
      paddingLeft: '5px',
      fontSize: '24px',
      textAlign: 'left' as 'left'
    },
    headerIcon: {
      minWidth: '28px',
      minHeight: '28px',
      backgroundSize: '28px',
      padding: '8px'
    },
    backButton: {
      display: 'flex',
      width: '16px',
      height: '16px',
      marginTop: '21px'
    },
    newCommentButton: {
      display: 'flex',
      width: '20px',
      height: '20px',
      marginTop: '21px'
    },
    placeholder: { width: '20px' }
  };
}

import * as React from 'react';

/**
 * React Props interface
 */
interface ICommentHeaderProps {
  /**
   * Person name of comment
   * @type string
   */
  name: string;
  /**
   * Time stamp of comment
   * @type string
   */
  timestamp: string;
  /**
   * URL to Person photo to display
   * @type string
   */
  photo: string;
  /**
   * Text comment to display
   * @type string
   */
  context?: string;
  /**
   * Tag to display in the header
   * @type string
   */
  tag?: string;
  /**
   * Tracks the state if the card is expanded
   * @type boolean
   */
  expanded: boolean;
  /**
   * Is the card resolved
   * @type boolean
   */
  resolved: boolean;
  /**
   * Function to handle the CommentCard expanding
   * @type VoidFunction
   */
  handleExpand: VoidFunction;
  /**
   * Function to handle the CommentCard shrinking
   * @type VoidFunction
   */
  handleShrink: VoidFunction;
  /**
   * Reverses resolve state
   * @type: void function
   */
  handleResolve: VoidFunction;
}

/**
 * CommentHeader React Component
 */
export class CommentHeader extends React.Component<ICommentHeaderProps> {
  /**
   * Constructor
   * @param props React props
   */
  constructor(props: any) {
    super(props);
  }

  /**
   * React render function
   */
  render() {
    return (
      <div style={this.styles.cardHeader}>
        <div style={this.styles.upperHeader} className={this.bsc.upperHeader}>
          <div>
            <img style={this.styles.photo} src={this.props.photo} />
          </div>
          <div style={this.styles.nameArea} className={this.bsc.nameArea}>
            <h1 style={this.styles.name} className={this.bsc.name}>
              {this.props.name}
            </h1>
            <p style={this.styles.timestamp} className={this.bsc.timestamp}>
              {this.props.timestamp}
            </p>
            <div style={this.styles.tagArea} className={this.bsc.tagArea}>
              <h6 style={this.styles.tag} className={this.bsc.tag}>
                {this.props.tag}
              </h6>
              {this.props.resolved && (
                <h6 style={this.styles.resolvedTag} className={this.bsc.tag}>
                  Resolved
                </h6>
              )}
            </div>
          </div>
          <div>
            {this.props.expanded && !this.props.resolved
              ? this.getResolveButton()
              : !this.props.expanded && (
                  <input
                    type="image"
                    style={this.styles.cornerButton}
                    src={'http://cdn.onlinewebfonts.com/svg/img_72157.png'}
                    alt="Expand"
                    onClick={this.props.handleExpand}
                  />
                )}
          </div>
        </div>
        <div
          style={
            this.props.expanded
              ? this.styles.contextExpanded
              : this.styles.contextNotExpanded
          }
        >
          <p>{this.props.context}</p>
        </div>
      </div>
    );
  }

  /**
   * Creates and returns resolve button
   * @return Type: React.ReactNode
   */
  getResolveButton(): React.ReactNode {
    return (
      <button
        className="commentFooterLeftButton float-right"
        style={this.styles.resolveButton}
        type="button"
        onClick={this.props.handleResolve}
      >
        Resolve
      </button>
    );
  }

  /**
   * Bootstrap classNames
   */
  bsc = {
    upperHeader: 'row',
    nameArea: 'col',
    tag: 'badge badge-secondary row-offset-1',
    tagArea: 'col',
    name: 'row-offset-1',
    timestamp: 'row-offset-1'
  };

  /**
   * CSS styles
   */
  styles = {
    upperHeader: {},
    cardHeader: {
      marginBottom: '10px',
      background: 'white'
    },
    resolveButton: {
      marginRight: '20px',
      marginTop: '5px'
    },
    nameArea: {
      paddingLeft: '5px'
    },
    photo: {
      height: '2.7em',
      width: '2.7em',
      marginTop: '5px',
      marginLeft: '20px'
    },
    name: {
      fontSize: '12px',
      fontWeight: 'bold' as 'bold',
      marginTop: '3px',
      marginBottom: '1px'
    },
    timestamp: {
      fontSize: '.7em',
      marginBottom: '0px',
      marginTop: '-5px'
    },
    contextNotExpanded: {
      height: '30px',
      maxWidth: '350px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '.8em',
      paddingLeft: '5px',
      paddingRight: '10px',
      lineHeight: 'normal'
    },
    contextExpanded: {
      height: '100%',
      maxWidth: '350px',
      overflow: '',
      textOverflow: 'ellipsis',
      fontSize: '.8em',
      lineHeight: 'normal',
      paddingLeft: '5px',
      paddingRight: '10px'
    },
    cornerButton: {
      marginTop: '5px',
      marginRight: '25px',
      width: '1.3em',
      height: '1.3em'
    },
    tag: {
      background: '#E0E0E0',
      fontSize: '.7em',
      fontWeight: 'normal' as 'normal',
      color: 'black',
      borderRadius: '2px',
      marginBottom: '0px',
      marginTop: '-4px'
    },
    resolvedTag: {
      background: '#E0E0E0',
      fontSize: '.7em',
      fontWeight: 'normal' as 'normal',
      color: 'black',
      borderRadius: '2px',
      marginBottom: '0px',
      marginTop: '-4px',
      marginLeft: '5px'
    },
    tagArea: {
      marginTop: '-5px',
      paddingLeft: '0px',
      paddingRight: '0px'
    }
  };
}

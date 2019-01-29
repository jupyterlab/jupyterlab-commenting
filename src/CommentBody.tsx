import * as React from 'react';

/**
 * React Props interface
 */
interface ICommentBodyProps {
  /**
   * List of ReactNode Comment components to be rendered to the CommentCardBody
   * @type ReactNode[]
   */
  comments?: React.ReactNode[];
  /**
   * Tracks if card is expanded
   * @type boolean
   */
  expanded: boolean;
}

const _maxCommentsPerShrinkCard = 3;

/**
 * CommentBody React Component
 */
export class CommentBody extends React.Component<ICommentBodyProps> {
  /**
   * Constructor
   *
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
      <div style={this.styles.commentBodyStyle} className={this.bsc}>
        {this.getComments()}
      </div>
    );
  }

  getComments(): React.ReactNode {
    let items: React.ReactNode;
    if (this.props.comments != null) {
      if (
        this.props.comments.length <= _maxCommentsPerShrinkCard ||
        this.props.expanded
      ) {
        // Maps each Comment component into an individual div tag
        items = this.props.comments.map((props, i) => (
          <div key={i}>{props}</div>
        ));
      } else if (!this.props.expanded) {
        items = (
          <div>
            <div style={this.styles.circle} />
            <div style={this.styles.circle} />
            <div style={this.styles.circle} />
            <div>{this.props.comments[this.props.comments.length - 1]}</div>
          </div>
        );
      }
    } else {
      items = '';
    }
    return items;
  }

  /**
   * Bootstrap classNames
   */
  bsc: string = 'col-lg-12 col-md-12 col-sm-12';

  /**
   * CSS styles
   */
  styles = {
    commentBodyStyle: {
      padding: '0px'
    },
    circle: {
      width: '8px',
      height: '8px',
      background: '#C4C4C4',
      borderRadius: '4px',
      marginBottom: '8px',
      marginLeft: '8px'
    }
  };
}

import * as React from 'react';

/**
 * React Props interface
 */
interface ICommentBodyProps {
  /**
   * List of ReactNode Comment components to be rendered to the CommentCardBody
   *
   * @type ReactNode[]
   */
  comments?: React.ReactNode[];
  /**
   * Tracks if card is expanded
   *
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
  constructor(props: ICommentBodyProps) {
    super(props);
  }

  /**
   * React render function
   */
  render() {
    return <div style={this.styles.commentBodyStyle}>{this.getComments()}</div>;
  }

  /**
   * Returns and organized all Comment components passed in this.props.comments
   *
   * @return Type: React.ReactNode[] - array of Comment components
   */
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
            <span
              className={'jp-Icon jp-MoreHorizIcon'}
              style={this.styles.circles}
            />
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
   * CSS styles
   */
  styles = {
    commentBodyStyle: {
      padding: '0px'
    },
    circles: {
      minWidth: '28px',
      minHeight: '28px',
      backgroundSize: '28px',
      padding: '8px',
      transform: 'rotate(90deg)'
    }
  };
}

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
}

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
    let items: React.ReactNode;
    if (this.props.comments != null) {
      // Maps each Comment component into an individual div tag
      items = this.props.comments.map((props, i) => <div key={i}>{props}</div>);
    } else {
      items = '';
    }

    return (
      <div style={this.commentBodyStyle} className={this.bsc}>
        {items}
      </div>
    );
  }

  /**
   * Bootstrap classNames
   */
  bsc: string = 'col-lg-12 col-md-12 col-sm-12';

  /**
   * CSS styles
   */
  commentBodyStyle = {
    padding: '0px'
  };
}

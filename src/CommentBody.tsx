import * as React from 'react';

interface ICommentBodyProps {
  comments?: React.ReactNode[];
}

export class CommentBody extends React.Component<ICommentBodyProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    let items: React.ReactNode;
    if (this.props.comments != null) {
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

  commentBodyStyle = {
    padding: '0px'
  };

  bsc: string = 'col-lg-12 col-md-12 col-sm-12';
}

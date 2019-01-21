import * as React from 'react';

import { CommentHeader } from './CommentHeader';

import { CommentBody } from './CommentBody';

import { CommentFooter } from './CommentFooter';

import { Comment } from './Comment';

interface ICommentCardProps {
  data?: any;
}

interface ICommentCardStates {
  expanded?: boolean;
  replyActive?: boolean;
  resolved?: boolean;
  active?: boolean;
}

export class CommentCard extends React.Component<
  ICommentCardProps,
  ICommentCardStates
> {
  constructor(props: any) {
    super(props);
    this.state = {
      expanded: false,
      replyActive: false
    };

    this.handleExpand = this.handleExpand.bind(this);
    this.handleReplyActive = this.handleReplyActive.bind(this);
    this.expandAndReply = this.expandAndReply.bind(this);
    this.getAllComments = this.getAllComments.bind(this);
  }

  handleExpand() {
    this.setState({ expanded: !this.state.expanded });
    if (this.state.replyActive) {
      this.handleReplyActive();
    }
  }

  handleReplyActive = () =>
    this.setState({ replyActive: !this.state.replyActive });

  expandAndReply() {
    this.handleReplyActive();
    this.handleExpand();
  }

  getAllComments(): React.ReactNode[] {
    let comments: React.ReactNode[] = [];
    let allComments: any = this.props.data.commentStream.allComments;

    for (let key in allComments) {
      comments.push(
        <Comment
          name={allComments[key].name}
          context={allComments[key].context}
          timestamp={allComments[key].timestamp}
          photo={allComments[key].photoMain}
          expanded={this.state.expanded}
        />
      );
    }
    return comments;
  }

  render() {
    return (
      <div className={this.bsc.card} style={this.styles.card}>
        <div className={this.bsc.cardHeader} style={this.styles.cardHeading}>
          <CommentHeader
            name={this.props.data.commentStream.startComment.name}
            context={this.props.data.commentStream.startComment.context}
            timestamp={this.props.data.commentStream.startComment.timestamp}
            photo={this.props.data.commentStream.startComment.photoMain}
            tag={this.props.data.commentStream.startComment.tag}
            expanded={this.state.expanded}
            expandFunc={this.handleExpand}
          />
        </div>
        <div className={this.bsc.cardBody} style={this.styles.cardBody}>
          <CommentBody comments={this.getAllComments()} />
        </div>
        <div className={this.bsc.cardFooter} style={this.styles.cardFooter}>
          <CommentFooter
            expanded={this.state.expanded}
            replyActive={this.state.replyActive}
            handleReplyActive={this.handleReplyActive}
            handleExpand={this.handleExpand}
            expandAndReply={this.expandAndReply}
          />
        </div>
      </div>
    );
  }

  bsc = {
    card: 'card',
    cardHeader: 'card-header border-bottom-0',
    cardBody: 'card-body border-bottom-0',
    cardFooter: 'card-footer border-top-0'
  };

  styles = {
    card: {
      marginBottom: '5px'
    },
    cardHeading: {
      padding: '0px'
    },
    cardBody: {
      padding: '0px'
    },
    cardFooter: {
      padding: '0px',
      paddingBottom: '5px'
    }
  };
}

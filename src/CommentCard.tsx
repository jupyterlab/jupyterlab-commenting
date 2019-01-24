import * as React from 'react';

import { CommentHeader } from './CommentHeader';

import { CommentBody } from './CommentBody';

import { CommentFooter } from './CommentFooter';

import { Comment } from './Comment';

interface ICommentCardProps {
  data?: any;
  cardId: string;
  setExpandedCard: (cardId: string) => void;
  getExpandedCard: (cardId: string) => boolean;
}

interface ICommentCardStates {
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
      replyActive: false
    };

    this.handleExpand = this.handleExpand.bind(this);
    this.handleShrink = this.handleShrink.bind(this);
    this.handleReplyActive = this.handleReplyActive.bind(this);
    this.expandAndReply = this.expandAndReply.bind(this);
    this.getAllComments = this.getAllComments.bind(this);
    this.getCommentHeader = this.getCommentHeader.bind(this);
    this.getCommentFooter = this.getCommentFooter.bind(this);
  }

  render() {
    return (
      <div className={this.bsc.card} style={this.styles.card}>
        <div className={this.bsc.cardHeader} style={this.styles.cardHeading}>
          {this.getCommentHeader()}
        </div>
        <div className={this.bsc.cardBody} style={this.styles.cardBody}>
          <CommentBody comments={this.getAllComments()} />
        </div>
        <div className={this.bsc.cardFooter} style={this.styles.cardFooter}>
          {this.getCommentFooter()}
        </div>
      </div>
    );
  }

  handleExpand() {
    this.props.setExpandedCard(this.props.cardId);
    if (this.state.replyActive) {
      this.handleReplyActive();
    }
  }

  handleShrink() {
    this.props.setExpandedCard(' ');
    if (this.state.replyActive) {
      this.handleReplyActive();
    }
  }

  handleReplyActive() {
    this.setState({ replyActive: !this.state.replyActive });
  }

  expandAndReply() {
    this.handleReplyActive();
    this.handleExpand();
  }

  getAllComments(): React.ReactNode[] {
    console.log('F: ' + this.props.getExpandedCard(this.props.cardId));
    let comments: React.ReactNode[] = [];
    let allComments: any = this.props.data['allComments'];

    if (this.props.data !== undefined) {
      for (let key in allComments) {
        comments.push(
          <Comment
            name={allComments[key].name}
            context={allComments[key].context}
            timestamp={allComments[key].timestamp}
            photo={allComments[key].photoMain}
            expanded={this.props.getExpandedCard(this.props.cardId)}
          />
        );
      }
    }
    return comments;
  }

  getCommentHeader(): React.ReactNode {
    return (
      <CommentHeader
        name={this.props.data['startComment'].name}
        context={this.props.data['startComment'].context}
        timestamp={this.props.data['startComment'].timestamp}
        photo={this.props.data['startComment'].photoMain}
        tag={this.props.data['startComment'].tag}
        expanded={this.props.getExpandedCard(this.props.cardId)}
        handleExpand={this.handleExpand}
        handleShrink={this.handleShrink}
      />
    );
  }

  getCommentFooter(): React.ReactNode {
    return (
      <CommentFooter
        expanded={this.props.getExpandedCard(this.props.cardId)}
        replyActive={this.state.replyActive}
        handleReplyActive={this.handleReplyActive}
        expandAndReply={this.expandAndReply}
      />
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
      marginBottom: '5px',
      background: 'white'
    },
    cardHeading: {
      padding: '0px',
      background: 'white'
    },
    cardBody: {
      padding: '0px',
      background: 'white'
    },
    cardFooter: {
      padding: '0px',
      paddingBottom: '5px',
      background: 'white'
    }
  };
}

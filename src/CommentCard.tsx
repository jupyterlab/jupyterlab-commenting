import * as React from 'react';

// Components
import { CommentHeader } from './CommentHeader';
import { CommentBody } from './CommentBody';
import { CommentFooter } from './CommentFooter';
import { Comment } from './Comment';

/**
 * React Props interface
 */
interface ICommentCardProps {
  /**
   * Comment thread data
   *
   * @type any
   */
  data?: any;
  /**
   * Unique string to identify a card
   *
   * @type string
   */
  threadId: string;
  /**
   * Is the card resolved
   *
   * @type boolean
   */
  resolved: boolean;
  /**
   * Function to set the state of the current expanded card in "App.tsx"
   *
   * @param cardId - string: Card unique id
   */
  setExpandedCard: (cardId: string) => void;
  /**
   * Function to check if the given cardID is the current expanded card
   *
   * @param cardId - string: Card unique id
   *
   * @return boolean: true if card is expanded, false if not
   */
  checkExpandedCard: (cardId: string) => boolean;
  /**
   * Sets this.state.replyActiveCard to the passed in cardId
   *
   * @param cardId Type: string - CommentCard unique id
   */
  setReplyActiveCard: (cardId: string) => void;
  /**
   * Used to check if the cardId passed in has reply box active
   *
   * @param cardId Type: string - CommentCard unique id
   * @return type: boolean - True if cardId has reply box open, false if not active
   */
  checkReplyActiveCard: (cardId: string) => boolean;
  /**
   * Pushed comment back to MetadataCommentsService
   *
   * @param comment Type: string - comment message
   * @param cardId Type: String - commend card / thread the comment applies to
   */
  /**
   * Sets the value of the given key value pair in specific itemId and cardId
   *
   * @param cardId Type: string - id of card to set value on
   * @param key Type: string - key of value to set
   * @param value Type: sting - value to set to key
   *
   * @type void function
   */
  setCardValue(itemId: string, cardId: string, key: string, value: any): void;
  /**
   * Pushed comment back to MetadataCommentsService
   *
   * @param comment Type: string - comment message
   * @param cardId Type: String - commend card / thread the comment applies to
   */
  putComment: (threadId: string, value: string) => void;
  /**
   * Path of file used to itemize comment thread to file
   */
  target?: string;
}

/**
 * React States interface
 */
interface ICommentCardStates {}

/**
 * CommentCard React Component
 */
export class CommentCard extends React.Component<
  ICommentCardProps,
  ICommentCardStates
> {
  /**
   * Constructor
   *
   * @param props React Props
   */
  constructor(props: ICommentCardProps) {
    super(props);
    this.state = {};

    // Functions to bind(this)
    this.handleExpand = this.handleExpand.bind(this);
    this.handleShrink = this.handleShrink.bind(this);
    this.handleReplyOpen = this.handleReplyOpen.bind(this);
    this.handleReplyClose = this.handleReplyClose.bind(this);
    this.expandAndReply = this.expandAndReply.bind(this);
    this.getInput = this.getInput.bind(this);
    this.handleResolve = this.handleResolve.bind(this);
  }

  /**
   * React render function
   */
  render() {
    return (
      <div className={this.bsc.card} style={this.styles.card}>
        <div className={this.bsc.cardHeader} style={this.styles.cardHeading}>
          {this.getCommentHeader()}
        </div>
        <div className={this.bsc.cardBody} style={this.styles.cardBody}>
          <CommentBody
            comments={this.getAllComments()}
            expanded={this.props.checkExpandedCard(this.props.threadId)}
          />
        </div>
        <div className={this.bsc.cardFooter} style={this.styles.cardFooter}>
          {this.getCommentFooter()}
        </div>
      </div>
    );
  }

  /**
   * Handle a CommentCard expanding
   */
  handleExpand(): void {
    this.props.setExpandedCard(this.props.threadId);
    if (this.props.checkReplyActiveCard(this.props.threadId)) {
      this.handleReplyOpen();
    }
  }

  /**
   * Handles a CommentCard shrinking
   */
  handleShrink(): void {
    this.props.setExpandedCard(' ');
    if (this.props.checkReplyActiveCard(this.props.threadId)) {
      this.handleReplyClose();
    }
  }

  /**
   * Sets the state of replyActive to true
   */
  handleReplyOpen(): void {
    this.props.setReplyActiveCard(this.props.threadId);
  }

  /**
   * Sets the state of replyActive to false
   */
  handleReplyClose(): void {
    this.props.setReplyActiveCard(' ');
  }

  /**
   * Handles expanding and opening the reply box
   */
  expandAndReply(): void {
    this.handleReplyOpen();
    this.handleExpand();
  }

  /**
   * Passes comment message to putComment in App.tsx
   *
   * @param comment Type: string - comment message
   */
  getInput(comment: string): void {
    this.props.putComment(this.props.threadId, comment);
    this.handleReplyClose();
  }

  /**
   * Passes resolve state to setCardValue in App.tsx
   *
   * @param resolved Type: boolean - resolve state
   */
  handleResolve(): void {
    this.props.setCardValue(
      this.props.target,
      this.props.threadId,
      'resolved',
      !this.props.resolved
    );

    if (this.props.resolved) {
      if (this.props.checkExpandedCard(this.props.threadId)) {
        this.handleExpand();
      } else {
        this.handleShrink();
      }
    } else {
      this.handleShrink();
    }
  }

  /**
   * Creates a Comment component for each comment in the this.props.data
   *
   * @return React.ReactNode[]: List of Comment ReactNodes / Components
   */
  getAllComments(): React.ReactNode[] {
    let comments: React.ReactNode[] = [];

    if (this.props.data !== undefined) {
      for (let key: number = 1; key < this.props.data.body.length; key++) {
        comments.push(
          <Comment
            name={this.props.data.body[key].creator.name}
            context={this.props.data.body[key].value}
            timestamp={this.props.data.body[key].created}
            photo={this.props.data.body[key].creator.image}
            expanded={this.props.checkExpandedCard(this.props.threadId)}
          />
        );
      }
    }
    return comments;
  }

  /**
   * Creates and returns the CommentHeader Component.
   * This is the top comment of a thread / card
   *
   * @return React.ReactNode: CommentHeader ReactNode / Component
   */
  getCommentHeader(): React.ReactNode {
    return (
      <CommentHeader
        name={this.props.data.body[0].creator.name}
        context={this.props.data.body[0].value}
        timestamp={this.props.data.body[0].created}
        photo={this.props.data.body[0].creator.image}
        tag={this.props.data.label}
        expanded={this.props.checkExpandedCard(this.props.threadId)}
        resolved={this.props.resolved}
        handleExpand={this.handleExpand}
        handleShrink={this.handleShrink}
        handleResolve={this.handleResolve}
      />
    );
  }

  /**
   * Creates and returns the CommentFooter Component
   * This is the bottom / footer section of a CommentCard
   *
   * @return React.ReactNode: CommentFooter ReactNode / Component
   */
  getCommentFooter(): React.ReactNode {
    return (
      <CommentFooter
        expanded={this.props.checkExpandedCard(this.props.threadId)}
        replyActive={this.props.checkReplyActiveCard(this.props.threadId)}
        resolved={this.props.resolved}
        handleReplyOpen={this.handleReplyOpen}
        handleReplyClose={this.handleReplyClose}
        expandAndReply={this.expandAndReply}
        getInput={this.getInput}
        handleResolve={this.handleResolve}
      />
    );
  }

  /**
   * Bootstrap style classNames
   */
  bsc = {
    card: 'card',
    cardHeader: 'card-header border-bottom-0',
    cardBody: 'card-body border-bottom-0',
    cardFooter: 'card-footer border-top-0'
  };

  /**
   * CSS styles
   */
  styles = {
    card: {
      marginBottom: '5px',
      background: 'white'
    },
    cardHeading: {
      padding: '0px',
      background: 'white',
      marginBottom: '-8px'
    },
    cardBody: {
      padding: '0px',
      background: 'white',
      marginBottom: '-15px'
    },
    cardFooter: {
      padding: '0px',
      paddingBottom: '5px',
      background: 'white',
      marginTop: '10px'
    }
  };
}

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
   * Function to check if the given cardID is the current expanded card
   *
   * @param cardId - string: Card unique id
   *
   * @return boolean: true if card is expanded, false if not
   */
  checkExpandedCard: (cardId: string) => boolean;
  /**
   * Used to check if the threadId passed in has reply box active
   *
   * @param threadId Type: string - CommentCard unique id
   *
   * @return type: boolean - True if cardId has reply box open, false if not active
   */
  checkReplyActiveCard: (cardId: string) => boolean;
  /**
   * Comment thread data
   *
   * @type any
   */
  data: any;
  /**
   * Pushed comment back to MetadataCommentsService
   *
   * @param comment Type: string - comment message
   * @param cardId Type: String - commend card / thread the comment applies to
   */
  putComment: (threadId: string, value: string, index?: number) => void;
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
   * Sets this.state.replyActiveCard to the passed in cardId
   *
   * @param cardId Type: string - CommentCard unique id
   */
  setReplyActiveCard: (cardId: string) => void;
  /**
   * Sets the value of the given key value pair in specific itemId and cardId
   *
   * @param cardId Type: string - id of card to set value on
   * @param key Type: string - key of value to set
   * @param value Type: boolean - value to set to key
   *
   * @type void function
   */
  setCardValue(target: string, threadId: string, value: boolean): void;
  /**
   * Removes a thread by its id
   *
   * @param threadId Type: string - removes thread by its id
   */
  removeAnnotationById(threadId: string): void;
  /**
   * Unique string to identify a card
   *
   * @type string
   */
  threadId: string;
  /**
   * Path of file used to itemize comment thread to file
   */
  target: string;
  /**
   * Used to check if a key is being edited
   *
   * @param key Type: string - key of what is being edited
   */
  checkIsEditing(key: string): boolean;
  /**
   * Used to set what is being edited
   *
   * @param key Type: string - key of what is being edited
   */
  setIsEditing(key: string): void;
}

/**
 * React States interface
 */
interface ICommentCardStates {
  /**
   * Tracks if mouse is hovering over thread
   *
   * @type boolean
   */
  hover: boolean;
  /**
   * Tracks when to expand
   *
   * @type boolean
   */
  shouldExpand: boolean;
  /**
   * Tracks when a comment is being edited
   */
  isEditing: string;
}

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
    this.state = { hover: false, shouldExpand: true, isEditing: '' };

    this.handleExpand = this.handleExpand.bind(this);
    this.handleShrink = this.handleShrink.bind(this);
    this.handleReplyOpen = this.handleReplyOpen.bind(this);
    this.handleReplyClose = this.handleReplyClose.bind(this);
    this.handleExpandAndReply = this.handleExpandAndReply.bind(this);
    this.getInput = this.getInput.bind(this);
    this.handleResolve = this.handleResolve.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleShouldExpand = this.handleShouldExpand.bind(this);
    this.pushEdit = this.pushEdit.bind(this);
  }

  /**
   * React render function
   */
  render(): React.ReactNode {
    return (
      <div
        className={
          this.props.checkExpandedCard(this.props.threadId)
            ? 'jp-commenting-thread-area-no-hover'
            : 'jp-commenting-thread-area'
        }
        onClick={
          !this.props.checkExpandedCard(this.props.threadId)
            ? this.state.shouldExpand
              ? this.handleExpand
              : undefined
            : undefined
        }
        onMouseMoveCapture={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div>{this.getCommentHeader()}</div>
        <div>
          <CommentBody
            comments={this.getAllComments()}
            expanded={this.props.checkExpandedCard(this.props.threadId)}
            resolved={this.props.resolved}
          />
        </div>
        <div>{this.getCommentFooter()}</div>
      </div>
    );
  }

  /**
   * Handles state when mouse enters thread area
   */
  handleMouseEnter(): void {
    this.setState({ hover: true });
  }

  /**
   * Handles state when mouse leaves thread area
   */
  handleMouseLeave(): void {
    this.setState({ hover: false });
  }

  /**
   * Sets the state for should expand
   *
   * @param state Type: boolean - sets the state of should expand
   */
  handleShouldExpand(state: boolean) {
    this.setState({ shouldExpand: state });
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
  handleExpandAndReply(): void {
    this.handleReplyOpen();
    this.handleExpand();
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
   * Passes comment message to putComment in App.tsx
   *
   * @param comment Type: string - comment message
   */
  getInput(comment: string): void {
    this.props.putComment(this.props.threadId, comment);
    this.handleReplyClose();
  }

  /**
   * Used to update a comment to the edited value
   *
   * @param comment Type: string - new comment to push
   * @param index Type: number - index of comment to push edits to
   */
  pushEdit(comment: string, index: number): void {
    this.props.putComment(this.props.threadId, comment, index);
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
            resolved={this.props.resolved}
            handleShouldExpand={this.handleShouldExpand}
            isEditing={this.props.checkIsEditing}
            setIsEditing={this.props.setIsEditing}
            pushEdit={this.pushEdit}
            index={key}
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
        expanded={this.props.checkExpandedCard(this.props.threadId)}
        resolved={this.props.resolved}
        handleExpand={this.handleExpand}
        handleShrink={this.handleShrink}
        handleResolve={this.handleResolve}
        handleShouldExpand={this.handleShouldExpand}
        hover={this.state.hover}
        threadId={this.props.threadId}
        removeAnnotationById={this.props.removeAnnotationById}
        isEditing={this.props.checkIsEditing}
        setIsEditing={this.props.setIsEditing}
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
    if (
      this.props.checkExpandedCard(this.props.threadId) &&
      !this.props.resolved
    ) {
      return (
        <CommentFooter
          expanded={this.props.checkExpandedCard(this.props.threadId)}
          replyActive={this.props.checkReplyActiveCard(this.props.threadId)}
          resolved={this.props.resolved}
          handleReplyOpen={this.handleReplyOpen}
          handleReplyClose={this.handleReplyClose}
          expandAndReply={this.handleExpandAndReply}
          getInput={this.getInput}
          handleResolve={this.handleResolve}
        />
      );
    }
  }
}

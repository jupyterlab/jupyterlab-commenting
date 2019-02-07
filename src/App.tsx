import * as React from 'react';

import { ISignal } from '@phosphor/signaling';

import { UseSignal } from '@jupyterlab/apputils';

import { ILabShell } from '@jupyterlab/application';

import { FocusTracker, Widget } from '@phosphor/widgets';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';

// Components
import { AppBody } from './AppBody';
import { CommentCard } from './CommentCard';
import { AppHeader } from './AppHeader';
import { AppHeaderOptions } from './AppHeaderOptions';
import { NewThreadCard } from './NewThreadCard';
import { UserSet } from './UserSet';

/**
 * React States interface
 */
interface IAppStates {
  /**
   * Card unique id that is expanded / full screen
   *
   * @type string
   */
  expandedCard: string;
  /**
   * Card unique id that has the reply active
   *
   * @type string
   */
  replyActiveCard: string;
  /**
   * Current state of the sort dropdown in the header
   *
   * @type string
   */
  sortState: string;
  /**
   * Check box state in the header
   *
   * @type boolean
   */
  showResolved: boolean;
  /**
   * State for if new thread button pressed
   *
   * @type boolean
   */
  newThreadActive: boolean;
  /**
   * File to add new thread to
   *
   * @type string
   */
  newThreadFile: string;
  gitName: string;
  gitPhoto: string;
  userSet: boolean;
}

/**
 * React Props interface
 */
interface IAppProps {
  /**
   * Signal that updates when file events happen
   *
   * @type ISignal
   */
  signal?: ISignal<ILabShell, FocusTracker.IChangedArgs<Widget>>;
  /**
   * Comments Service that communicates with graphql server
   *
   * @type IMetadataCommentsService
   */
  commentsService?: IMetadataCommentsService;
}

/**
 * Main App React Component
 */
export default class App extends React.Component<IAppProps, IAppStates> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: any) {
    super(props);
    this.state = {
      expandedCard: ' ',
      replyActiveCard: ' ',
      sortState: 'latest',
      showResolved: false,
      newThreadActive: false,
      newThreadFile: '',
      gitName: '',
      gitPhoto: '',
      userSet: false
    };

    this.getAllCommentCards = this.getAllCommentCards.bind(this);
    this.setExpandedCard = this.setExpandedCard.bind(this);
    this.checkExpandedCard = this.checkExpandedCard.bind(this);
    this.setSortState = this.setSortState.bind(this);
    this.showResolvedState = this.showResolvedState.bind(this);
    this.putComment = this.putComment.bind(this);
    this.setCardValue = this.setCardValue.bind(this);
    this.setNewThreadActive = this.setNewThreadActive.bind(this);
    this.setReplyActiveCard = this.setReplyActiveCard.bind(this);
    this.checkReplyActiveCard = this.checkReplyActiveCard.bind(this);
    this.setUserInfo = this.setUserInfo.bind(this);
  }

  /**
   * React render function
   */
  render() {
    return this.state.userSet ? (
      <UseSignal signal={this.props.signal}>
        {(sender: ILabShell, args: FocusTracker.IChangedArgs<Widget>) => {
          return <div>{this.checkAppHeader(args)}</div>;
        }}
      </UseSignal>
    ) : (
      <UserSet setUserInfo={this.setUserInfo} />
    );
  }

  /**
   * Checks the the prop returned by the signal and returns App header with correct data
   *
   * @param args Type: any - FocusTracker.IChangedArgs<Widget> Argument returned by the signal listener
   * @return Type: React.ReactNode[] - App Header with correct header string
   */
  checkAppHeader(args: any): React.ReactNode {
    try {
      return (
        <div>
          <AppHeader
            header={args.newValue.context.session._name}
            expanded={this.state.expandedCard !== ' '}
            setExpandedCard={this.setExpandedCard}
            setNewThreadActive={this.setNewThreadActive}
            headerOptions={
              <AppHeaderOptions
                setSortState={this.setSortState}
                showResolvedState={this.showResolvedState}
                cardExpanded={this.state.expandedCard !== ' '}
              />
            }
          />
          <AppBody
            cards={this.getAllCommentCards(
              this.getComments(args.newValue.context.session._path),
              args.newValue.context.session._path
            )}
          />
        </div>
      );
    } catch {
      return (
        <AppHeader
          header={undefined}
          setExpandedCard={this.setExpandedCard}
          expanded={this.state.expandedCard !== ' '}
          setNewThreadActive={this.setNewThreadActive}
          headerOptions={
            <AppHeaderOptions
              setSortState={this.setSortState}
              showResolvedState={this.showResolvedState}
              cardExpanded={this.state.expandedCard !== ' '}
            />
          }
        />
      );
    }
  }

  /**
   * Creates and returns all CommentCard components with correct data
   *
   * @param allData Type: any - Comment data from this.props.data
   * @return Type: React.ReactNode[] - List of CommentCard Components / ReactNodes
   */
  getAllCommentCards(allData: any, itemId: string): React.ReactNode[] {
    let cards: React.ReactNode[] = [];
    if (!this.state.newThreadActive) {
      for (let key in allData) {
        if (
          this.shouldRenderCard(
            allData[key].startComment.resolved,
            this.state.expandedCard !== ' ',
            this.state.expandedCard === key
          )
        ) {
          cards.push(
            <CommentCard
              data={allData[key]}
              cardId={key}
              setExpandedCard={this.setExpandedCard}
              checkExpandedCard={this.checkExpandedCard}
              setReplyActiveCard={this.setReplyActiveCard}
              checkReplyActiveCard={this.checkReplyActiveCard}
              resolved={allData[key].startComment.resolved}
              putComment={this.putComment}
              setCardValue={this.setCardValue}
              itemId={itemId}
            />
          );
        }
      }
    } else {
      cards.push(
        <NewThreadCard
          putComment={this.putComment}
          itemId={this.state.newThreadFile}
          setNewThreadActive={this.setNewThreadActive}
        />
      );
    }
    return cards;
  }

  /**
   * Checks if a card should be rendered in based on the states of
   * the current view
   *
   * @param resolved Type: boolean - resolved state of the card
   * @param expandedCard Type: boolean - State if there is a card expanded
   * @param curCardExpanded Type: boolean - State if the current card is expanded
   */
  shouldRenderCard(
    resolved: boolean,
    expandedCard: boolean,
    curCardExpanded: boolean
  ): boolean {
    if (!this.state.showResolved) {
      if (!resolved) {
        if (expandedCard) {
          return curCardExpanded;
        }
        return true;
      } else {
        return false;
      }
    } else {
      if (expandedCard) {
        return curCardExpanded;
      }
      return true;
    }
  }
  /**
   * Query the comments from MetadataCommentsService based on itemId
   *
   * @param itemId Type: String - Path of file to get comments for
   * @return Type: any - Stream of comments
   */
  getComments(itemId: string): any {
    return this.props.commentsService.queryComments(itemId);
  }

  /**
   * Pushed comment back to MetadataCommentsService
   *
   * @param comment Type: string - comment message
   * @param cardId Type: String - commend card / thread the comment applies to
   */
  async putComment(
    itemId: string,
    cardId: string,
    comment?: string,
    tag?: string
  ): Promise<void> {
    await this.props.commentsService.createComment(
      itemId,
      cardId,
      this.state.gitName,
      this.state.gitPhoto,
      comment,
      tag
    );
  }

  /**
   * Used to set a specific field of a card
   *
   * @param itemId Type: string - id of a thread
   * @param cardId Type: string - id of a specific card
   * @param key Type: string - key of value to set
   * @param value Type: string - value to set
   */
  setCardValue(itemId: string, cardId: string, key: string, value: any): void {
    this.props.commentsService.setCardValue(itemId, cardId, key, value);
  }

  /**
   * Used to check if the cardId passed in is the current expanded card
   *
   * @param cardId Type: string - CommentCard unique id
   * @return Type: boolean - True if cardId is expanded, false if cardId is not expanded
   */
  checkExpandedCard(cardId: string): boolean {
    return cardId === this.state.expandedCard;
  }

  /**
   * Sets this.state.expandedCard to the passed in cardId
   *
   * @param cardId Type: string - CommentCard unique id
   */
  setExpandedCard(cardId: string) {
    this.setState({ expandedCard: cardId });
  }

  /**
   * Sets this.state.replyActiveCard to the passed in cardId
   *
   * @param cardId Type: string - CommentCard unique id
   */
  setReplyActiveCard(cardId: string) {
    this.setState({ replyActiveCard: cardId });
  }

  /**
   * Used to check if the cardId passed in has reply box active
   *
   * @param cardId Type: string - CommentCard unique id
   * @return type: boolean - True if cardId has reply box open, false if not active
   */
  checkReplyActiveCard(cardId: string): boolean {
    return cardId === this.state.replyActiveCard;
  }

  /**
   * Sets this.state fields for active new thread card
   *
   * @param state Type: boolean - State to set if new thread card is active
   * @param itemId Type: string - itemId of the file to add new thread to
   */
  setNewThreadActive(state: boolean, itemId?: string) {
    this.setState({ newThreadActive: state });
    this.setState({ newThreadFile: itemId });
  }

  /**
   * Sets this.state.sortState to the selected sort by
   *
   * @param state Type: string - Sort by type
   */
  setSortState(state: string) {
    this.setState({ sortState: state });
  }

  /**
   * Sets this.state.showResolved to the state of the checkbox
   * "Show resolved"
   */
  showResolvedState() {
    this.setState({ showResolved: !this.state.showResolved });
  }

  /**
   * Uses Github API to fetch users name and photo
   *
   * @param user Type: string - users github username
   */
  async setUserInfo(user: string) {
    const response = await fetch('http://api.github.com/users/' + user);
    const myJSON = await response.json();

    console.log(myJSON);

    // If users does not have a name set, use username
    const name = myJSON.name === null ? myJSON.login : myJSON.name;

    if (myJSON.message !== 'Not Found') {
      this.setState({
        gitName: name,
        gitPhoto: myJSON.avatar_url,
        userSet: true
      });
    } else {
      window.alert('Username not found');
    }
  }
}

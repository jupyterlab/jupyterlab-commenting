import * as React from 'react';

import '../../style/index.css';

import { ReactWidget } from '@jupyterlab/apputils';

import { UseSignal } from '@jupyterlab/apputils';

import { IActiveDataset } from '@jupyterlab/dataregistry';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';

import { IMetadataPeopleService } from 'jupyterlab-metadata-service';

import { IPerson, IAnnotationResponse } from './app';

// Components
import App from './components/App';
import { AppBody } from './components/AppBody';
import { CommentCard } from './components/CommentCard';
import { AppHeader } from './components/AppHeader';
import { AppHeaderOptions } from './components/AppHeaderOptions';
import { NewThreadCard } from './components/NewThreadCard';
import { UserSet } from './components/UserSet';

/**
 * React States interface
 */
interface ICommentingStates {
  /**
   * Hold the users information
   *
   * @type IPerson
   */
  creator: IPerson;
  /**
   * Tracks if the current target has threads or not
   *
   * @type boolean
   */
  curTargetHasThreads: boolean;
  /**
   * Card unique id that is expanded / full screen
   *
   * @type string
   */
  expandedCard: string;
  /**
   * State of threads to be rendered
   *
   * @type React.ReactNode[]
   */
  myThreads: React.ReactNode[];
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
  /**
   * Card unique id that has the reply active
   *
   * @type string
   */
  replyActiveCard: string;
  /**
   * State to hold last response
   *
   * @type IAnnotationResponse
   */
  response: IAnnotationResponse;
  /**
   * State to track when to query
   *
   * @type boolean
   */
  shouldQuery: boolean;
  /**
   * Check box state in the header
   *
   * @type boolean
   */
  showResolved: boolean;
  /**
   * Current state of the sort dropdown in the header
   *
   * @type string
   */
  sortState: string;
  /**
   * Tracks when a user is set
   *
   * @type boolean
   */
  userSet: boolean;
}

export class CommentingWidget extends ReactWidget {
  constructor(
    activeDataset: IActiveDataset,
    comments: IMetadataCommentsService,
    people: IMetadataPeopleService
  ) {
    super();

    this._activeDataset = activeDataset;
    this._commentsService = comments;
    this._peopleService = people;

    this._state = {
      creator: {} as IPerson,
      curTargetHasThreads: false,
      expandedCard: ' ',
      myThreads: [],
      newThreadActive: false,
      newThreadFile: ' ',
      replyActiveCard: ' ',
      response: {} as IAnnotationResponse,
      shouldQuery: true,
      showResolved: false,
      sortState: 'latest',
      userSet: false
    };

    this.getAllCommentCards = this.getAllCommentCards.bind(this);
    this.setExpandedCard = this.setExpandedCard.bind(this);
    this.getExpandedCard = this.getExpandedCard.bind(this);
    this.setSortState = this.setSortState.bind(this);
    this.setShowResolved = this.setShowResolved.bind(this);
    this.putComment = this.putComment.bind(this);
    this.putThread = this.putThread.bind(this);
    this.setCardValue = this.setCardValue.bind(this);
    this.setNewThreadActive = this.setNewThreadActive.bind(this);
    this.setReplyActiveCard = this.setReplyActiveCard.bind(this);
    this.getReplyActiveCard = this.getReplyActiveCard.bind(this);
    this.setUserInfo = this.setUserInfo.bind(this);
    this.query = this.query.bind(this);
    this.getNewThreadButton = this.getNewThreadButton.bind(this);
    this.update = this.update.bind(this);
  }

  /**
   * Called before the widget is shown
   */
  protected onBeforeShow(): void {
    // Sets the interval of when to periodically query for comments
    this.periodicUpdate = setInterval(this.query, 1000);
    this.query();
  }

  /**
   * Called before the widget is hidden
   */
  protected onBeforeHide(): void {
    // Stops the periodic query of comments
    clearInterval(this.periodicUpdate);
  }

  protected render(): React.ReactElement<any> | React.ReactElement<any>[] {
    this.update();
    return (
      <UseSignal signal={this._activeDataset.signal}>
        {(sender, args) => {
          try {
            return this.getApp(
              this._activeDataset.active.pathname.split('/').pop()
            );
          } catch {
            return this.getApp(undefined);
          }
        }}
      </UseSignal>
    );
  }

  getApp(target: string | undefined): React.ReactNode {
    return (
      <App>
        {this._state.userSet ? (
          <div className="jp-commenting-window">
            <AppHeader
              target={target}
              cardExpanded={this._state.expandedCard !== ' '}
              threadOpen={this._state.newThreadActive}
              setExpandedCard={this.setExpandedCard}
              headerOptions={
                <AppHeaderOptions
                  setSortState={this.setSortState}
                  showResolvedState={this.setShowResolved}
                  cardExpanded={this._state.expandedCard !== ' '}
                  target={target}
                  hasThreads={this._state.curTargetHasThreads}
                  showResolved={this._state.showResolved}
                  sortState={this._state.sortState}
                />
              }
            />
            <AppBody
              cards={
                this._state.newThreadActive
                  ? [
                      <NewThreadCard
                        putThread={this.putThread}
                        setNewThreadActive={this.setNewThreadActive}
                        creator={this._state.creator}
                      />
                    ]
                  : this._state.myThreads
              }
              expanded={this._state.expandedCard !== ' '}
              newThreadButton={
                this._state.newThreadActive || target === undefined
                  ? undefined
                  : this.getNewThreadButton()
              }
            />
          </div>
        ) : (
          <div className="jp-commenting-window">
            <UserSet setUserInfo={this.setUserInfo} />
          </div>
        )}
      </App>
    );
  }

  query(): void {
    if (this.isVisible) {
      if (
        this._state.response.data &&
        this._state.response.data.annotationsByTarget !== undefined
      ) {
        if (
          this._state.response.data.annotationsByTarget[0].target !==
          this.getTarget()
        ) {
          this._state.expandedCard = ' ';
          this._state.newThreadActive = false;
        }
      }

      this._commentsService
        .queryAllByTarget(this.getTarget())
        .then((response: any) => {
          if (response.data.annotationsByTarget.length !== 0) {
            this._state.myThreads = this.getAllCommentCards(
              response.data.annotationsByTarget
            );
            this._state.curTargetHasThreads = true;
            this._state.response = response;
          } else {
            this._state.myThreads = [];
            this._state.curTargetHasThreads = false;
            this._state.response = response;
          }
        });
    }
    this.update();
  }

  /**
   * Pushed comment back to MetadataCommentsService
   *
   * @param value Type: string - comment message
   * @param threadId Type: string - commend card / thread the comment applies to
   */
  putComment(threadId: string, value: string): void {
    this._commentsService.createComment(threadId, value, this._state.creator);
    this.query();
  }

  /**
   * Pushes new thread to GraphQL server
   *
   * @param value Type: string - comment message
   * @param label Type: string - label / tag of a thread
   */
  putThread(value: string): void {
    this._commentsService.createThread(
      this.getTarget(),
      value,
      this._state.creator
    );
    this.query();
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
    if (!this._state.showResolved) {
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
   * Returns the active file path
   *
   * @return Type: string - file path as a string. Has leading '/'
   *         ex. /clean.py
   */
  getTarget(): string {
    let target = this._activeDataset.active.pathname;
    if (target === null) {
      return undefined;
    } else {
      return target;
    }
  }

  /**
   * Creates and returns all CommentCard components with correct data
   *
   * @param allData Type: any - Comment data from this.props.data
   * @return Type: React.ReactNode[] - List of CommentCard Components / ReactNodes
   */
  getAllCommentCards(allData: any): React.ReactNode[] {
    let cards: React.ReactNode[] = [];
    for (let key in allData) {
      if (
        this.shouldRenderCard(
          allData[key].resolved,
          this._state.expandedCard !== ' ',
          this._state.expandedCard === allData[key].id
        )
      ) {
        cards.push(
          <CommentCard
            data={allData[key]}
            threadId={allData[key].id}
            setExpandedCard={this.setExpandedCard}
            checkExpandedCard={this.getExpandedCard}
            setReplyActiveCard={this.setReplyActiveCard}
            checkReplyActiveCard={this.getReplyActiveCard}
            resolved={allData[key].resolved}
            putComment={this.putComment}
            setCardValue={this.setCardValue}
            target={this.getTarget()}
          />
        );
      }
    }
    return cards.reverse();
  }

  /**
   * JSX of new thread button
   *
   * @return Type: React.ReactNode - New thread button
   */
  getNewThreadButton(): React.ReactNode {
    return (
      <div
        className="jp-commenting-new-thread-button"
        onClick={() => this.setNewThreadActive(true)}
      >
        <span className="jp-commenting-new-thread-label">
          New Comment Thread
        </span>
        <span className="jp-AddIcon jp-Icon jp-ToolbarButtonComponent-icon jp-Icon-16" />
      </div>
    );
  }

  /**
   * Used to check if the cardId passed in is the current expanded card
   *
   * @param threadId Type: string - CommentCard unique id
   * @return Type: boolean - True if cardId is expanded, false if cardId is not expanded
   */
  getExpandedCard(threadId: string): boolean {
    return threadId === this._state.expandedCard;
  }

  /**
   * Used to check if the cardId passed in has reply box active
   *
   * @param threadId Type: string - CommentCard unique id
   * @return type: boolean - True if cardId has reply box open, false if not active
   */
  getReplyActiveCard(threadId: string): boolean {
    return threadId === this._state.replyActiveCard;
  }

  /**
   * Used to set a specific field of a card
   *
   * @param target Type: string - id of a thread
   * @param threadId Type: string - id of a specific card
   * @param key Type: string - key of value to set
   * @param value Type: string - value to set
   */
  setCardValue(target: string, threadId: string, value: boolean): void {
    this._commentsService.setResolvedValue(target, threadId, value);
  }

  /**
   * Sets this.state.expandedCard to the passed in cardId
   *
   * @param threadId Type: string - CommentCard unique id
   */
  setExpandedCard(threadId: string) {
    this._state.expandedCard = threadId;
    this.query();
  }

  /**
   * Sets this.state.replyActiveCard to the passed in cardId
   *
   * @param threadId Type: string - CommentCard unique id
   */
  setReplyActiveCard(threadId: string) {
    this._state.replyActiveCard = threadId;
    this.query();
  }

  /**
   * Sets this.state fields for active new thread card
   *
   * @param state Type: boolean - State to set if new thread card is active
   * @param target Type: string - target of the file to add new thread to
   */
  setNewThreadActive(value: boolean) {
    this._state.newThreadActive = value;
    this._state.newThreadFile = this.getTarget();
    this.query();
  }

  /**
   * Sets this.state.sortState to the selected sort by
   *
   * @param state Type: string - Sort by type
   */
  setSortState(value: string) {
    this._state.sortState = value;
    this.query();
  }

  /**
   * Sets this.state.showResolved to the state of the checkbox
   * "Show resolved"
   */
  setShowResolved(value: boolean) {
    this._state.showResolved = value;
    this.query();
  }

  /**
   * Uses Github API to fetch users name and photo
   *
   * @param user Type: string - users github username
   */
  async setUserInfo(user: string) {
    console.log(this._peopleService);
    const response = await fetch('https://api.github.com/users/' + user);
    const myJSON = await response.json();

    // If users does not have a name set, use username
    const name = myJSON.name === null ? myJSON.login : myJSON.name;
    if (myJSON.message !== 'Not Found') {
      this._peopleService.queryAll().then((response: any) => {
        if (response.data.people.length !== 0) {
          for (let index in response.data.people) {
            if (
              response.data.people[index].name === name &&
              !this._state.userSet
            ) {
              this._state.creator = {
                id: response.data.people[index].id,
                name: name,
                image: myJSON.avatar_url
              };
              this._state.userSet = true;
            }
          }
          if (!this._state.userSet) {
            this._peopleService.create(name, '', myJSON.avatar_url);
            let personCount: number = Number(response.data.people.length + 2);
            this._state.creator = {
              id: 'person/' + personCount,
              name: name,
              image: myJSON.avatar_url
            };
            this._state.userSet = true;
          }
        }
      });
    } else {
      window.alert('Username not found');
    }
  }

  private _state: ICommentingStates;
  private _activeDataset: IActiveDataset;
  private _commentsService: IMetadataCommentsService;
  private _peopleService: IMetadataPeopleService;

  /**
   * The interval function that is used to pull in threads / comments every set interval
   */
  private periodicUpdate: number;
}

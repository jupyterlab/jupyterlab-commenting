import * as React from 'react';

import '../../style/index.css';

import { ReactWidget } from '@jupyterlab/apputils';

import { UseSignal } from '@jupyterlab/apputils';

import { IActiveDataset } from '@jupyterlab/dataregistry';

import { Signal, ISignal } from '@phosphor/signaling';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';

import { IMetadataPeopleService } from 'jupyterlab-metadata-service';

import { IPerson, IAnnotationResponse } from './app';

// Components
import { App } from './components/App';
import { AppBody } from './components/AppBody';
import { CommentCard } from './components/CommentCard';
import { AppHeader } from './components/AppHeader';
import { AppHeaderOptions } from './components/AppHeaderOptions';
import { NewThreadCard } from './components/NewThreadCard';
import { UserSet } from './components/UserSet';

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
      pastTarget: '',
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
    this.getNewThreadButton = this.getNewThreadButton.bind(this);
    this.query = this.query.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
  }

  /**
   * Called before the widget is shown
   */
  protected onBeforeShow(): void {
    // Sets the interval of when to periodically query for comments
    this._periodicUpdate = setInterval(this.query, 1000);
  }

  /**
   * Called after widget is shown
   */
  protected onAfterShow(): void {
    this.query();
  }

  /**
   * Called before the widget is hidden
   */
  protected onBeforeHide(): void {
    // Stops the periodic query of comments
    clearInterval(this._periodicUpdate);
  }

  protected render(): React.ReactElement<any> | React.ReactElement<any>[] {
    return (
      <UseSignal signal={this.stateUpdateSignal}>
        {(sender, args) => {
          return (
            <UseSignal signal={this._activeDataset.signal}>
              {(sender, args) => {
                if (this._pastTarget !== this.getTarget()) {
                  this.query();
                  this._pastTarget = this.getTarget();
                }
                try {
                  return this.getApp(args.pathname.split('/').pop());
                } catch {
                  return this.getApp(undefined);
                }
              }}
            </UseSignal>
          );
        }}
      </UseSignal>
    );
  }

  /**
   * Returns the Commenting UI.
   *
   * @param target Type: string | undefined - target / file path.
   * undefined used for no target. Anything else is a target.
   */
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

  /**
   * Handles querying new data. Updates after query.
   */
  query(): void {
    if (this.isVisible) {
      // Handles clearing commenting UI when new target
      if (
        this._state.response.data !== undefined &&
        this._state.response.data.annotationsByTarget !== undefined &&
        this._state.response.data.annotationsByTarget[0] !== undefined
      ) {
        if (
          this._state.response.data.annotationsByTarget[0].target !==
          this.getTarget()
        ) {
          this.setState('newThreadActive', false);
          this.setState('expandedCard', ' ');
        }
      }

      // Fetches comments from server
      this._commentsService
        .queryAllByTarget(this.getTarget())
        .then((response: any) => {
          if (response.data.annotationsByTarget[0] !== undefined) {
            this.setState(
              'myThreads',
              this.getAllCommentCards(response.data.annotationsByTarget)
            );
            this.setState('curTargetHasThreads', true);
            this.setState('response', response);
          } else {
            this.setState('myThreads', []);
            this.setState('curTargetHasThreads', false);
            this.setState('response', response);
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
    if (this._activeDataset.active === null) {
      return '';
    }

    let target = this._activeDataset.active.pathname;
    return target === null ? '' : target;
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
   * @param value Type: string - value to set
   */
  setCardValue(target: string, threadId: string, value: boolean): void {
    this._commentsService.setResolvedValue(target, threadId, value);
    this.query();
  }

  /**
   * Sets this.state.expandedCard to the passed in cardId
   *
   * @param threadId Type: string - CommentCard unique id
   */
  setExpandedCard(threadId: string) {
    this.setState('expandedCard', threadId);
    this.query();
  }

  /**
   * Sets this.state.replyActiveCard to the passed in cardId
   *
   * @param threadId Type: string - CommentCard unique id
   */
  setReplyActiveCard(threadId: string) {
    this.setState('replyActiveCard', threadId);
    this.query();
  }

  /**
   * Sets this.state fields for active new thread card
   *
   * @param state Type: boolean - State to set if new thread card is active
   * @param target Type: string - target of the file to add new thread to
   */
  setNewThreadActive(value: boolean) {
    this.setState('newThreadActive', value);
    this.setState('newThreadFile', this.getTarget());
    this._newThreadActiveSignal.emit(value);
    this.query();
  }

  /**
   * Sets this.state.sortState to the selected sort by
   *
   * @param state Type: string - Sort by type
   */
  setSortState(value: string) {
    this.setState('sortState', value);
    this.query();
  }

  /**
   * Sets this.state.showResolved to the state of the checkbox
   * "Show resolved"
   */
  setShowResolved(value: boolean) {
    this.setState('showResolved', value);
    this.query();
  }

  /**
   * Uses Github API to fetch users name and photo
   *
   * @param user Type: string - users github username
   */
  async setUserInfo(user: string) {
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
              this.setState('creator', {
                id: response.data.people[index].id,
                name: name,
                image: myJSON.avatar_url
              });
              this.setState('userSet', true);
            }
          }
          if (!this._state.userSet) {
            this._peopleService.create(name, '', myJSON.avatar_url);
            let personCount: number = Number(response.data.people.length + 2);
            this.setState('creator', {
              id: 'person/' + personCount,
              name: name,
              image: myJSON.avatar_url
            });
            this.setState('userSet', true);
          }
        }
      });
    } else {
      window.alert('Username not found');
    }
    this.query();
  }

  /**
   * Returns signal used to track when a state updates
   *
   * @return Type: ISignal<this, void> - state set / update signal
   */
  get stateUpdateSignal(): ISignal<this, void> {
    return this._stateUpdated;
  }

  /**
   * Returns boolean signal based on when a new thread is shown
   *
   * @return Type: ISignal<this, boolean> - new thread active
   */
  get newThreadActive(): ISignal<this, boolean> {
    return this._newThreadActiveSignal;
  }

  /**
   * Updates the value of state in this._state. Only works with existing states created in the constructor.
   * Emits signal this._signal.
   *
   * @param key Type: string - key of the state object to update
   * @param value Type: any - value to update
   */
  setState(key: string, value: any): void {
    if (Object.keys(this._state).indexOf(key) > -1) {
      this._state[key] = value;
      this._stateUpdated.emit(void 0);
    } else {
      throw 'Bad key value for setState in commenting.tsx';
    }
  }

  private _state: { [key: string]: any };
  private _activeDataset: IActiveDataset;
  private _commentsService: IMetadataCommentsService;
  private _peopleService: IMetadataPeopleService;
  private _stateUpdated = new Signal<this, void>(this);
  private _newThreadActiveSignal = new Signal<this, boolean>(this);
  private _periodicUpdate: number;
  private _pastTarget: string;
}

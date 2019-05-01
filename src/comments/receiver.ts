import { IActiveDataset, ActiveDataset } from '@jupyterlab/dataregistry';

import { ISignal, Signal } from '@phosphor/signaling';
import { JSONObject } from '@phosphor/coreutils';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';
import { IMetadataPeopleService } from 'jupyterlab-metadata-service';

import { CommentingStates } from './states';
import { ITextIndicator } from '../types';

/**
 * Handles all interactions with data that is received. Interacts with CommentingStates
 * and sets values accordingly.
 */
export class CommentingDataReceiver {
  // CommentingStates object
  private _states: CommentingStates;

  // Signal when active target is updated
  private _activeTarget: ISignal<ActiveDataset, URL | null>;

  // Signal when new data is received and needs to be updated
  private _newDataReceived = new Signal<this, void>(this);

  // Signal when new target is set
  private _targetSet = new Signal<this, void>(this);

  // Signal when new comments are queried
  private _commentsQueried = new Signal<this, void>(this);

  // GraphQL commenting and people services
  private _comments: IMetadataCommentsService;
  private _people: IMetadataPeopleService;

  constructor(
    states: CommentingStates,
    comments: IMetadataCommentsService,
    people: IMetadataPeopleService,
    activeDataset: IActiveDataset
  ) {
    this._states = states;
    this._activeTarget = activeDataset.signal;
    this._comments = comments;
    this._people = people;

    // Initial states
    this.setState({
      creator: {},
      curTargetHasThreads: false,
      expandedCard: ' ',
      myThreads: [],
      newThreadActive: false,
      newThreadFile: ' ',
      replyActiveCard: ' ',
      response: {},
      pastTarget: '',
      showResolved: true,
      sortState: 'latest',
      userSet: false,
      target: ' ',
      widgetMatchTarget: false
    });

    this.getAllComments = this.getAllComments.bind(this);
    this.putComment = this.putComment.bind(this);
    this.putThread = this.putThread.bind(this);
    this.setCardValue = this.setCardValue.bind(this);
    this.setUserInfo = this.setUserInfo.bind(this);
  }

  /**
   * Sets / Updates / Creates states in the CommentingStates Object
   *
   * @param values Type: JSONObject - values that need to be set / updated / created
   * in CommentingStates Object
   */
  setState(values: JSONObject): void {
    this._states.setState(values);
  }

  /**
   * Handles querying data from comments GraphQL service
   */
  getAllComments(): void {
    if (this._states.getState('target') === undefined) {
      this._states.setState({ response: {}, curTargetHasThreads: false });
      return;
    }

    this._comments
      .queryAllByTarget(this._states.getState('target') as string)
      .then((response: any) => {
        if (response.data.annotationsByTarget[0] !== undefined) {
          this._states.setState({
            curTargetHasThreads: true,
            response: response
          });
        } else {
          this._states.setState({
            curTargetHasThreads: false,
            response: response
          });
        }
      })
      .catch(err => {
        return;
      });

    this._commentsQueried.emit(void 0);
  }

  /**
   * Pushes comment back to MetadataCommentsService
   *
   * @param value Type: string - comment message
   * @param threadId Type: string - commend card / thread the comment applies to
   */
  putComment(threadId: string, value: string): void {
    this._comments.createComment(
      threadId,
      value,
      this._states.getState('creator')
    );
    this._newDataReceived.emit(void 0);
  }

  /**
   * Pushes new thread to GraphQL server
   *
   * @param value Type: string - comment message
   */
  putThread(value: string): void {
    this._comments.createThread(
      this._states.getState('target') as string,
      value,
      this._states.getState('creator'),
      (this._states.getState('latestIndicatorInfo') as object) as ITextIndicator
    );
    this._newDataReceived.emit(void 0);

    this._states.setState({ latestIndicatorInfo: undefined });
  }

  /**
   * Used to set a specific field of a card
   *
   * @param target Type: string - id of a thread
   * @param threadId Type: string - id of a specific card
   * @param value Type: string - value to set
   *
   * @emits _newDataReceived Signal
   */
  setCardValue(target: string, threadId: string, value: boolean): void {
    this._comments.setResolvedValue(target, threadId, value);
    this._newDataReceived.emit(void 0);
  }

  /**
   * Sets the target state in CommentingStates
   *
   * @param value Type: string - target to update to
   */
  setTarget(value: string) {
    if (value === this._states.getState('target')) {
      return;
    }
    this._states.setState({
      target: value,
      newThreadActive: false,
      expandedCard: ' '
    });
    this._targetSet.emit(void 0);
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
      this._people
        .queryAll()
        .then((response: any) => {
          if (response.data.people.length !== 0) {
            for (let index in response.data.people) {
              if (
                response.data.people[index].name === name &&
                !this._states.getState('userSet')
              ) {
                this._states.setState({
                  creator: {
                    id: response.data.people[index].id,
                    name: name,
                    image: myJSON.avatar_url
                  },
                  userSet: true
                });
              }
            }
            if (!this._states.getState('userSet')) {
              this._people.create(name, '', myJSON.avatar_url);
              let personCount: number = Number(response.data.people.length + 2);
              this._states.setState({
                creator: {
                  id: 'person/' + personCount,
                  name: name,
                  image: myJSON.avatar_url
                },
                userSet: true
              });
            }
          }
        })
        .catch(err => {
          return;
        });
    } else {
      window.alert('Username not found');
    }
  }

  /**
   * Signal when active is set
   */
  get activeUpdated(): ISignal<ActiveDataset, URL | null> {
    return this._activeTarget;
  }

  /**
   * Signal when new target is set
   */
  get targetSet(): ISignal<this, void> {
    return this._targetSet;
  }

  /**
   * Signal when new data is received from Metadata Services
   */
  get newDataReceived(): ISignal<this, void> {
    return this._newDataReceived;
  }

  /**
   * Signal when comments are queried
   */
  get commentsQueried(): ISignal<this, void> {
    return this._commentsQueried;
  }
}

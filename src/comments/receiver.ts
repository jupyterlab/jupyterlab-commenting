import { IActiveDataset, ActiveDataset } from '@jupyterlab/dataregistry';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

import { ISignal, Signal } from '@phosphor/signaling';

import { CommentingStates, ICommentStates } from './states';
import { IPerson } from './service';
import { CommentsService } from './service';

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

  private _commentService: CommentsService;

  constructor(
    states: CommentingStates,
    activeDataset: IActiveDataset,
    browserFactory: IFileBrowserFactory
  ) {
    this._states = states;
    this._activeTarget = activeDataset.signal;

    this._commentService = new CommentsService(browserFactory);

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
      widgetMatchTarget: false,
      isEditing: ''
    });

    this.getAllComments = this.getAllComments.bind(this);
    this.putComment = this.putComment.bind(this);
    this.putThread = this.putThread.bind(this);
    this.putCommentEdit = this.putCommentEdit.bind(this);
    this.putThreadEdit = this.putThreadEdit.bind(this);
    this.setResolvedValue = this.setResolvedValue.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.setUserInfo = this.setUserInfo.bind(this);
  }

  /**
   * Sets / Updates / Creates states in the CommentingStates Object
   *
   * @param values Type: JSONObject - values that need to be set / updated / created
   * in CommentingStates Object
   */
  setState(values: ICommentStates): void {
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
    let threads = this._commentService.getThreadsByTarget(this._states.getState(
      'target'
    ) as string);

    if (threads) {
      this._states.setState({
        curTargetHasThreads: true,
        response: threads
      });
    } else {
      this._states.setState({
        curTargetHasThreads: false,
        response: threads
      });
    }

    this._commentsQueried.emit(void 0);
  }

  /**
   * Pushes comment back to MetadataCommentsService
   *
   * @param value Type: string - comment message
   * @param threadId Type: string - commend card / thread the comment applies to
   */
  putComment(target: string, threadId: string, value: string): void {
    this._commentService.createComment(
      target,
      threadId,
      value,
      (this._states.getState('creator') as Object) as IPerson
    );

    this._newDataReceived.emit(void 0);
  }

  putCommentEdit(
    target: string,
    threadId: string,
    value: string,
    index: number
  ): void {
    this._commentService.editComment(target, threadId, value, index);

    this._newDataReceived.emit(void 0);
  }

  putThreadEdit(threadId: string, value: string): void {
    this._commentService.editThread(
      this._states.getState('target') as string,
      threadId,
      value
    );

    this._newDataReceived.emit(void 0);
  }

  /**
   * Pushes new thread to GraphQL server
   *
   * @param value Type: string - comment message
   */
  putThread(value: string): void {
    this._commentService.createThread(
      this._states.getState('target') as string,
      value,
      (this._states.getState('creator') as Object) as IPerson
    );
    this._newDataReceived.emit(void 0);

    this._states.setState({ latestIndicatorInfo: undefined });
  }

  /**
   * Used to set if a card is resolved
   *
   * @param target Type: string - id of a thread
   * @param threadId Type: string - id of a specific card
   * @param value Type: string - value to set
   *
   * @emits _newDataReceived Signal
   */
  setResolvedValue(target: string, threadId: string, value: boolean): void {
    this._commentService.setResolvedValue(target, threadId, value);
    this._newDataReceived.emit(void 0);
  }

  setCurrentTextIndicatorValue(
    target: string,
    threadId: string,
    value: object
  ): void {
    this._newDataReceived.emit(void 0);
  }

  deleteComment(threadId: string, index: number): void {
    this._commentService.deleteComment(
      this._states.getState('target') as string,
      threadId,
      index
    );
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
      let persons = this._commentService.getAllPersons();

      if (persons) {
        for (let key in persons) {
          if (persons[key].name === name && !this._states.getState('userSet')) {
            this._states.setState({
              creator: {
                id: key,
                name: name,
                image: myJSON.avatar_url
              },
              userSet: true
            });
          }
        }
      }
      if (!this._states.getState('userSet')) {
        let id = this._commentService.createPerson(name, myJSON.avatar_url);
        this._states.setState({
          creator: {
            id: id,
            name: name,
            image: myJSON.avatar_url
          },
          userSet: true
        });
      }
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

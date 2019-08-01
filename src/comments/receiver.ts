import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

import { ISignal, Signal } from '@phosphor/signaling';

import { CommentingStates, ICommentStates } from './states';
import { IPerson, CommentIndicator } from './service';
import { CommentsService } from './service';

/**
 * Handles all interactions with data that is received. Interacts with CommentingStates
 * and sets values accordingly.
 */
export class CommentingDataReceiver {
  constructor(states: CommentingStates, browserFactory: IFileBrowserFactory) {
    this._states = states;

    // Create CommentsService object
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
      isEditing: '',
      threadIdList: []
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
   * @param values Type: ICommentStates - values that need to be set / updated / created
   * in CommentingStates Object
   */
  setState(values: ICommentStates): void {
    this._states.setState(values);
  }

  /**
   * Handles getting all comments from comments service that relate to the current target
   */
  getAllComments(): void {
    let target = this._states.getState('target') as string;
    let sortBy = this._states.getState('sortState') as string;
    let idList = this._states.getState('threadIdList') as Array<string>;

    if (!target) {
      this._states.setState({ response: {}, curTargetHasThreads: false });
      return;
    }

    let threads = this._commentService.getThreadsByTarget(
      target,
      sortBy,
      idList
    );

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
  }

  /**
   * Creates a new comment on a thread
   *
   * @param value Type: string - comment message
   * @param threadId Type: string - thread the comment applies to
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

  /**
   * Edits the contents of a comment
   *
   * @param target Type: string - path of file comment relates to
   * @param threadId Type: string - id of thread comment is in
   * @param value Type: string - new value of the comment
   * @param index Type: number - index of the comment to edit
   */
  putCommentEdit(
    target: string,
    threadId: string,
    value: string,
    index: number
  ): void {
    this._commentService.editComment(target, threadId, value, index);

    this._newDataReceived.emit(void 0);
  }

  /**
   * Update the content of a thread
   *
   * @param threadId Type: string - id of thread that edit applies to
   * @param value Type: string - new value to set
   */
  putThreadEdit(threadId: string, value: string): void {
    this._commentService.editThread(
      this._states.getState('target') as string,
      threadId,
      value
    );

    this._newDataReceived.emit(void 0);
  }

  /**
   * Creates and saves new thread
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
    this._threadResolved.emit({
      value: value,
      target: target,
      threadId: threadId
    });
  }

  /**
   * Saves all the given text indicators into the correct place in comments.json file
   *
   * @param target Type: string - path of file indicators are being saved for
   * @param indicators Type: { [key: string]: CommentIndicator } - key value pair of indicators to save
   */
  setAllIndicatorValues(
    target: string,
    values: { [key: string]: CommentIndicator }
  ): void {
    this._commentService.setAllIndicatorValues(target, values);
  }

  /**
   * Returns all indicator values in a key value pair.
   * key: threadId, value CommentIndicator
   */
  getAllIndicatorValues(): { [key: string]: CommentIndicator } {
    let target = this._states.getState('target') as string;
    return this._commentService.getAllIndicatorValues(target);
  }

  /**
   * @returns Type: string - returns the id of the newest comment thread
   */
  getLatestCommentId(): string {
    return this._commentService.getLatestCommentId();
  }

  /**
   * Permanently deletes a comment from a thread
   *
   * @param threadId Type: string - id of thread with comment that needs removal
   * @param index Type: number - index of comment to delete from thread
   */
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
      if (!this._states.getState('userSet')) {
        this._states.setState({
          creator: {
            name: name,
            image: myJSON.avatar_url,
            user: user
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
  // get activeUpdated(): ISignal<ActiveDataset, URL | null> {
  //   return this._activeTarget;
  // }

  /**
   * Signal when new target is set
   */
  get targetSet(): ISignal<this, void> {
    return this._targetSet;
  }

  /**
   * Signal when thread is resolved with resolve value
   */
  get threadResolved(): ISignal<this, any> {
    return this._threadResolved;
  }

  /**
   * Signal when new data is received from CommentsService
   */
  get newDataReceived(): ISignal<this, void> {
    return this._newDataReceived;
  }

  // CommentingStates object
  private _states: CommentingStates;

  // Service for handling comments
  private _commentService: CommentsService;

  // Signal when active target is updated
  // private _activeTarget: ISignal<ActiveDataset, URL | null>;

  // Signal when new data is received and needs to be updated
  private _newDataReceived = new Signal<this, void>(this);

  // Signal when thread is resolved with resolve value
  private _threadResolved = new Signal<this, any>(this);

  // Signal when new target is set
  private _targetSet = new Signal<this, void>(this);
}

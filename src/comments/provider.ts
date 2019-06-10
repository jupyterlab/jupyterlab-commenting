import { ISignal } from '@phosphor/signaling';

import { CommentingStates, ICommentStateValue } from './states';

/**
 * Simple interface for providing data to extension from CommentingStates Object
 */
export class CommentingDataProvider {
  private _states: CommentingStates;

  constructor(states: CommentingStates) {
    this._states = states;
  }

  /**
   * Gets data from CommentingStates by key
   *
   * @param key Type: string - key value for data needed
   */
  getState(key: ICommentingStateKeys): ICommentStateValue {
    return this._states.getState(key);
  }

  /**
   * State update signal
   */
  get stateUpdateSignal(): ISignal<CommentingStates, void> {
    return this._states.stateUpdatedSignal;
  }
}

/**
 * Key values for commenting states
 */
export type ICommentingStateKeys =
  | 'creator'
  | 'curTargetHasThreads'
  | 'expandedCard'
  | 'myThreads'
  | 'newThreadActive'
  | 'newThreadFile'
  | 'replyActiveCard'
  | 'response'
  | 'pastTarget'
  | 'showResolved'
  | 'sortState'
  | 'userSet'
  | 'target'
  | 'curDocType'
  | 'latestIndicatorInfo'
  | 'widgetMatchTarget'
  | 'isEditing';

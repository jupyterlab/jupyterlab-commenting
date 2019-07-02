import { ISignal } from '@phosphor/signaling';

import { CommentingStates, CommentStateValue } from './states';

/**
 * Simple interface for providing data to extension from CommentingStates Object
 */
export class CommentingDataProvider {
  constructor(states: CommentingStates) {
    this._states = states;
  }

  /**
   * Gets data from CommentingStates by key
   *
   * @param key Type: string - key value for data needed
   */
  getState(key: CommentingStateKeys): CommentStateValue {
    return this._states.getState(key);
  }

  /**
   * State update signal
   */
  get stateUpdateSignal(): ISignal<CommentingStates, void> {
    return this._states.stateUpdatedSignal;
  }

  private _states: CommentingStates;
}

/**
 * Key values for commenting states
 */
export type CommentingStateKeys =
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

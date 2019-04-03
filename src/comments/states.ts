import { JSONObject, JSONValue } from '@phosphor/coreutils';

import { Signal, ISignal } from '@phosphor/signaling';

/**
 * CommentingStates is used as a state holder and handler for the extension
 * the classes CommentingDataReceiver and CommentingDataProvider are the only
 * interactions with this class
 */
export class CommentingStates {
  // JSONObject to hold all states
  private _state: JSONObject;

  // Signal when states update
  private _stateUpdated = new Signal<this, void>(this);

  constructor() {
    this._state = {};
  }

  /**
   * Sets the state with a given key value pair
   *
   * @param key Type: string - key value for data
   * @param value Type: JSONValue - data to store
   */
  protected set(key: string, value: JSONValue): void {
    if (this._state[key] === value) {
      return;
    }

    this._state[key] = value;
  }

  /**
   * Used to set / create / update states or single state
   *
   * @param values Type: JSONObject - all states to be updated / set / created
   */
  setState(values: JSONObject): void {
    for (let key in values) {
      this.set(key, values[key]);
    }
    this._stateUpdated.emit(void 0);
  }

  /**
   * Returns the value of the given key
   *
   * @param key Type: string - key of data to access
   */
  getState(key: string): JSONValue {
    return this._state[key];
  }

  /**
   * Returns entire state object as JSON
   */
  getJSON(): JSONObject {
    return this._state;
  }

  /**
   * Signal when a setState function is finished setting states
   */
  get stateUpdatedSignal(): ISignal<this, void> {
    return this._stateUpdated;
  }
}

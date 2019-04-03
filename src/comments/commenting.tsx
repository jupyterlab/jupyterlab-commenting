import * as React from 'react';

import '../../style/index.css';

import { ReactWidget } from '@jupyterlab/apputils';

import { UseSignal } from '@jupyterlab/apputils';

import { IPerson } from '../types';

// Components
import { App } from './components/App';
import { AppBody } from './components/AppBody';
import { CommentCard } from './components/CommentCard';
import { AppHeader } from './components/AppHeader';
import { AppHeaderOptions } from './components/AppHeaderOptions';
import { NewThreadCard } from './components/NewThreadCard';
import { UserSet } from './components/UserSet';
import { CommentingDataProvider } from './provider';
import { CommentingDataReceiver } from './receiver';

/**
 * CommentingUI React Widget
 */
export class CommentingWidget extends ReactWidget {
  // CommentingDataProvider to get data from CommentingStates
  private _provider: CommentingDataProvider;

  // CommentingDataReceiver to pass data to CommentingStates
  private _receiver: CommentingDataReceiver;

  // setInterval of when to poll new data
  private _periodicUpdate: number;

  constructor(
    provider: CommentingDataProvider,
    receiver: CommentingDataReceiver
  ) {
    super();

    this._provider = provider;
    this._receiver = receiver;

    this.getAllCommentCards = this.getAllCommentCards.bind(this);
    this.setExpandedCard = this.setExpandedCard.bind(this);
    this.getExpandedCard = this.getExpandedCard.bind(this);
    this.setSortState = this.setSortState.bind(this);
    this.setShowResolved = this.setShowResolved.bind(this);
    this.setNewThreadActive = this.setNewThreadActive.bind(this);
    this.setReplyActiveCard = this.setReplyActiveCard.bind(this);
    this.getReplyActiveCard = this.getReplyActiveCard.bind(this);
    this.getNewThreadButton = this.getNewThreadButton.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
  }

  /**
   * Called before the widget is shown
   */
  protected onBeforeShow(): void {
    // // Sets the interval of when to periodically query for comments
    this._periodicUpdate = setInterval(this._receiver.getAllComments, 1000);
  }

  /**
   * Called before the widget is hidden
   */
  protected onBeforeHide(): void {
    // Stops the periodic query of comments
    clearInterval(this._periodicUpdate);
  }

  /**
   * React Render function
   */
  protected render(): React.ReactElement<any> | React.ReactElement<any>[] {
    return (
      <UseSignal signal={this._provider.stateUpdateSignal}>
        {(sender, args) => {
          try {
            let target = this._provider.getState('target') as string;
            return this.getApp(target.split('/').pop());
          } catch {
            return this.getApp(undefined);
          }
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
        {this._provider.getState('userSet') ? (
          <div className="jp-commenting-window">
            <AppHeader
              target={target}
              cardExpanded={this._provider.getState('expandedCard') !== ' '}
              threadOpen={this._provider.getState('newThreadActive') as boolean}
              setExpandedCard={this.setExpandedCard}
              headerOptions={
                <AppHeaderOptions
                  setSortState={this.setSortState}
                  showResolvedState={this.setShowResolved}
                  cardExpanded={this._provider.getState('expandedCard') !== ' '}
                  target={target}
                  hasThreads={
                    this._provider.getState('curTargetHasThreads') as boolean
                  }
                  showResolved={
                    this._provider.getState('showResolved') as boolean
                  }
                  sortState={this._provider.getState('sortState') as string}
                />
              }
            />
            <AppBody
              cards={
                (this._provider.getState('newThreadActive') as boolean)
                  ? [
                      <NewThreadCard
                        putThread={this._receiver.putThread}
                        setNewThreadActive={this.setNewThreadActive}
                        creator={
                          (this._provider.getState('creator') as {}) as IPerson
                        }
                      />
                    ]
                  : this.getAllCommentCards()
              }
              expanded={this._provider.getState('expandedCard') !== ' '}
              newThreadButton={
                this._provider.getState('newThreadActive') ||
                target === undefined
                  ? undefined
                  : this.getNewThreadButton()
              }
            />
          </div>
        ) : (
          <div className="jp-commenting-window">
            <UserSet setUserInfo={this._receiver.setUserInfo} />
          </div>
        )}
      </App>
    );
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
    if (!this._provider.getState('showResolved') as boolean) {
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
   * Creates and returns all CommentCard components with correct data
   *
   * @param allData Type: any - Comment data from this.props.data
   * @return Type: React.ReactNode[] - List of CommentCard Components / ReactNodes
   */
  getAllCommentCards(): React.ReactNode[] {
    let response = this._provider.getState('response') as any;
    try {
      let allData: any = response.data.annotationsByTarget;

      let cards: React.ReactNode[] = [];
      for (let key in allData) {
        if (
          this.shouldRenderCard(
            allData[key].resolved,
            (this._provider.getState('expandedCard') as string) !== ' ',
            (this._provider.getState('expandedCard') as string) ===
              allData[key].id
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
              putComment={this._receiver.putComment}
              setCardValue={this._receiver.setCardValue}
              target={this._provider.getState('target') as string}
            />
          );
        }
      }
      return cards.reverse();
    } catch (e) {
      return [];
    }
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
    return threadId === this._provider.getState('expandedCard');
  }

  /**
   * Used to check if the cardId passed in has reply box active
   *
   * @param threadId Type: string - CommentCard unique id
   * @return type: boolean - True if cardId has reply box open, false if not active
   */
  getReplyActiveCard(threadId: string): boolean {
    return threadId === this._provider.getState('replyActiveCard');
  }

  /**
   * Sets this.state.expandedCard to the passed in cardId
   *
   * @param threadId Type: string - CommentCard unique id
   */
  setExpandedCard(threadId: string) {
    this._receiver.setState({ expandedCard: threadId });
  }

  /**
   * Sets this.state.replyActiveCard to the passed in cardId
   *
   * @param threadId Type: string - CommentCard unique id
   */
  setReplyActiveCard(threadId: string) {
    this._receiver.setState({ replyActiveCard: threadId });
  }

  /**
   * Sets this.state fields for active new thread card
   *
   * @param state Type: boolean - State to set if new thread card is active
   * @param target Type: string - target of the file to add new thread to
   */
  setNewThreadActive(value: boolean) {
    this._receiver.setState({
      newThreadActive: value,
      newThreadFile: this._provider.getState('target')
    });
  }

  /**
   * Sets this.state.sortState to the selected sort by
   *
   * @param state Type: string - Sort by type
   */
  setSortState(value: string) {
    this._receiver.setState({ sortState: value });
  }

  /**
   * Sets this.state.showResolved to the state of the checkbox
   * "Show resolved"
   */
  setShowResolved(value: boolean) {
    this._receiver.setState({ showResolved: value });
  }
}

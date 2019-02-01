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
}

/**
 * React Props interface
 */
interface IAppProps {
  /**
   * all Data for comments
   * @type any
   */
  data?: any;
  /**
   * Signal that updates when file events happen
   * @type ISignal
   */
  signal?: ISignal<ILabShell, FocusTracker.IChangedArgs<Widget>>;
  /**
   * Comments Service that communicates with graphql server
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
      sortState: 'latest',
      showResolved: false
    };

    this.getCommentCards = this.getCommentCards.bind(this);
    this.setExpandedCard = this.setExpandedCard.bind(this);
    this.checkExpandedCard = this.checkExpandedCard.bind(this);
    this.setSortState = this.setSortState.bind(this);
    this.showResolvedState = this.showResolvedState.bind(this);
    this.putComment = this.putComment.bind(this);
    this.setCardValue = this.setCardValue.bind(this);
  }

  /**
   * React render function
   */
  render() {
    return (
      <UseSignal signal={this.props.signal}>
        {(sender: ILabShell, args: FocusTracker.IChangedArgs<Widget>) => {
          return <div>{this.checkAppHeader(args)}</div>;
        }}
      </UseSignal>
    );
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
  putComment(itemId: string, comment: string, cardId: string): void {
    // TODO: Add auto get itemID not hard coded file path
    this.props.commentsService.createComment(itemId, comment, cardId);
  }

  /**
   * Sets the value of the given key value pair in specific itemId and cardId
   *
   * @param cardId Type: string - id of card to set value on
   * @param key Type: string - key of value to set
   * @param value Type: sting - value to set to key
   */
  setCardValue(itemId: string, cardId: string, key: string, value: any): void {
    this.props.commentsService.setCardValue(itemId, cardId, key, value);
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
            headerOptions={
              <AppHeaderOptions
                setSortState={this.setSortState}
                showResolvedState={this.showResolvedState}
              />
            }
          />
          <AppBody
            cards={this.getCommentCards(
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
          headerOptions={
            <AppHeaderOptions
              setSortState={this.setSortState}
              showResolvedState={this.showResolvedState}
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
  getCommentCards(allData: any, itemId: string): React.ReactNode[] {
    let cards: React.ReactNode[] = [];
    for (let key in allData) {
      if (this.state.expandedCard === ' ') {
        cards.push(
          <CommentCard
            data={allData[key]}
            cardId={key}
            setExpandedCard={this.setExpandedCard}
            getExpandedCard={this.checkExpandedCard}
            resolved={allData[key].startComment.resolved}
            putComment={this.putComment}
            setCardValue={this.setCardValue}
            itemId={itemId}
          />
        );
      } else if (this.state.expandedCard === key) {
        cards.push(
          <CommentCard
            data={allData[this.state.expandedCard]}
            cardId={this.state.expandedCard}
            setExpandedCard={this.setExpandedCard}
            getExpandedCard={this.checkExpandedCard}
            resolved={allData[key].startComment.resolved}
            putComment={this.putComment}
            setCardValue={this.setCardValue}
            itemId={itemId}
          />
        );
      }
    }
    return cards;
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

  setSortState(state: string) {
    this.setState({ sortState: state });
  }

  showResolvedState() {
    this.setState({ showResolved: !this.state.showResolved });
  }
}

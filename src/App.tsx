import * as React from 'react';

import { ISignal } from '@phosphor/signaling';

import { UseSignal } from '@jupyterlab/apputils';

import { ApplicationShell } from '@jupyterlab/application';

import { FocusTracker, Widget } from '@phosphor/widgets';

// Components
import { AppBody } from './AppBody';
import { CommentCard } from './CommentCard';
import { AppHeader } from './AppHeader';

/**
 * React States interface
 */
interface IAppStates {
  /**
   * Card unique id that is expanded / full screen
   * @type string
   */
  expandedCard: string;
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
  signal?: ISignal<ApplicationShell, FocusTracker.IChangedArgs<Widget>>;
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
      expandedCard: ' '
    };

    this.getCommentCards = this.getCommentCards.bind(this);
    this.setExpandedCard = this.setExpandedCard.bind(this);
    this.checkExpandedCard = this.checkExpandedCard.bind(this);
  }

  /**
   * React render function
   */
  render() {
    return (
      <UseSignal signal={this.props.signal}>
        {(
          sender: ApplicationShell,
          args: FocusTracker.IChangedArgs<Widget>
        ) => {
          return (
            <div>
              {this.checkAppHeader(args)}
              <AppBody cards={this.getCommentCards(this.props.data)} />
            </div>
          );
        }}
      </UseSignal>
    );
  }

  checkAppHeader(args: any): React.ReactNode {
    if (
      args !== undefined &&
      args !== null &&
      (args.newValue !== undefined && args.newValue !== null) &&
      args.newValue.context !== undefined &&
      args.newValue.context.session !== undefined
    ) {
      return (
        <AppHeader
          header={args.newValue.context.session._name}
          expanded={this.state.expandedCard !== ' '}
          setExpandedCard={this.setExpandedCard}
        />
      );
    } else {
      return (
        <AppHeader
          header={undefined}
          expanded={this.state.expandedCard !== ' '}
          setExpandedCard={this.setExpandedCard}
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
  getCommentCards(allData: any): React.ReactNode[] {
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
}

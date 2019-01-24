import * as React from 'react';

import { AppBody } from './AppBody';

import { CommentCard } from './CommentCard';

import { AppHeader } from './AppHeader';

interface IAppStates {
  expandedCard: string;
}

interface IAppProps {}
export default class App extends React.Component<IAppProps, IAppStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      expandedCard: ' '
    };

    this.getCommentCards = this.getCommentCards.bind(this);
    this.setExpandedCard = this.setExpandedCard.bind(this);
    this.getExpandedCard = this.getExpandedCard.bind(this);
  }

  getCommentCards(allData: any): React.ReactNode[] {
    let cards: React.ReactNode[] = [];
    for (let key in allData) {
      if (this.state.expandedCard === ' ') {
        cards.push(
          <CommentCard
            data={allData[key]}
            cardId={key}
            setExpandedCard={this.setExpandedCard}
            getExpandedCard={this.getExpandedCard}
          />
        );
      } else if (key === this.state.expandedCard) {
        cards.push(
          <CommentCard
            data={allData[this.state.expandedCard]}
            cardId={this.state.expandedCard}
            setExpandedCard={this.setExpandedCard}
            getExpandedCard={this.getExpandedCard}
          />
        );
      }
    }
    return cards;
  }

  getExpandedCard(cardId: string): boolean {
    return cardId === this.state.expandedCard;
  }

  setExpandedCard(cardId: string) {
    this.setState({ expandedCard: cardId });
  }

  render() {
    return (
      <div>
        <AppHeader />
        <AppBody cards={this.getCommentCards(testData)} />
      </div>
    );
  }
}

const testData: any = {
  s0: {
    startComment: {
      name: 'Jacob Houssian',
      context:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delectus enim, laudantium excepturi corrupti eligendi corporis',
      timestamp: 'Aug 15th 5:30pm',
      photoMain:
        'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png',
      tag: 'Meta'
    },
    allComments: {
      c0: {
        name: 'Igor Derke',
        context: 'Lorem ipsum',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c1: {
        name: 'Igor Derke',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c2: {
        name: 'Igor Derke',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c3: {
        name: 'Igor Derke',
        context: 'Lorem',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c4: {
        name: 'Igor Derke',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delecLorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      }
    }
  },
  s1: {
    startComment: {
      name: 'Jacob Houssian',
      context:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delectus enim, laudantium excepturi corrupti eligendi corporis',
      timestamp: 'Aug 15th 5:30pm',
      photoMain:
        'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png',
      tag: 'Meta'
    },
    allComments: {
      c0: {
        name: 'Igor',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c1: {
        name: 'Igor Derke',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c2: {
        name: 'Igor Derke',
        context: 'Lorem, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c3: {
        name: 'Igor Derke',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      }
    }
  },
  s2: {
    startComment: {
      name: 'Jacob Houssian',
      context:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delectus enim, laudantium excepturi corrupti eligendi corporis',
      timestamp: 'Aug 15th 5:30pm',
      photoMain:
        'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png',
      tag: 'Meta'
    },
    allComments: {
      c0: {
        name: 'Igor',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c1: {
        name: 'Igor Derke',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c2: {
        name: 'Igor Derke',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      },
      c3: {
        name: 'Igor Derke',
        context:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique accusamus ut placeat eum, veritatis est sit. Maxime ipsum, delec',
        timestamp: 'Aug 15th 5:35pm',
        photoMain:
          'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
      }
    }
  }
};

import * as React from 'react';

import { AppBody } from './AppBody';

import { CommentCard } from './CommentCard';

import { AppHeader } from './AppHeader';

export default class App extends React.Component {
  constructor(props: any) {
    super(props);
    this.getCommentCards = this.getCommentCards.bind(this);
  }

  getCommentCards(allData: any): React.ReactNode[] {
    let cards: React.ReactNode[] = [];

    for (let key in allData) {
      console.log(key);
      cards.push(<CommentCard data={allData[key]} />);
    }
    return cards;
  }

  render() {
    return (
      <div>
        <div>
          <AppHeader />
        </div>
        <AppBody cards={this.getCommentCards(testData)} />
      </div>
    );
  }
}

const testData = {
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
        name: 'Igor Derke',
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

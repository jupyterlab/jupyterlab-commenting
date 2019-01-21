import * as React from 'react';

import { AppBody } from './AppBody';

import { CommentCard } from './CommentCard';

import { AppHeader } from './AppHeader';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <div>
          <AppHeader />
        </div>
        <AppBody
          cards={[
            <CommentCard data={testData} />,
            <CommentCard data={testData} />
          ]}
        />
      </div>
    );
  }
}

const testData = {
  commentStream: {
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

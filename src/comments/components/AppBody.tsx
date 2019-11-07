/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2019 Project Jupyter Contributors.
 * Distributed under the terms of the 3-Clause BSD License.
 */

import * as React from 'react';

/**
 * React Props interface
 */
interface IAppBodyProps {
  /**
   * Array of CommentCard React Components
   *
   * @type React.ReactNode
   */
  cards: React.ReactNode[];
  /**
   * Tracks if card is expanded
   *
   * @type boolean
   */
  expanded: boolean;
  /**
   * New thread button card
   */
  newThreadButton: React.ReactNode | undefined;
}

/**
 * App Body React Component
 */
export class AppBody extends React.Component<IAppBodyProps> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: IAppBodyProps) {
    super(props);
  }

  /**
   * React render function
   */
  render(): React.ReactNode {
    const items = this.props.cards.map((card, i) => <div key={i}>{card}</div>);

    return (
      <div
        style={
          this.props.expanded
            ? this.styles['jp-commenting-body-area-expanded']
            : this.styles['jp-commenting-body-area']
        }
      >
        {!this.props.expanded && this.props.newThreadButton}
        {items}
      </div>
    );
  }

  /**
   * CSS styles
   */
  styles = {
    'jp-commenting-body-area': {
      width: '100%',
      maxHeight: '94%',
      overflowY: 'scroll' as 'scroll',
      overflowX: 'hidden' as 'hidden',
      boxSizing: 'border-box' as 'border-box',
      justifyContent: 'center',
      padding: '8px'
    },
    'jp-commenting-body-area-expanded': {
      width: '100%',
      maxHeight: '96%',
      overflowY: 'scroll' as 'scroll',
      overflowX: 'hidden' as 'hidden',
      boxSizing: 'border-box' as 'border-box',
      justifyContent: 'center',
      padding: '8px'
    }
  };
}

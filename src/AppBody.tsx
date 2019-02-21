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
  cards?: React.ReactNode[];
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
  render() {
    // const reverseCards = this.props.cards.reverse();

    const items = this.props.cards.map((card, i) => <div key={i}>{card}</div>);

    return (
      <div
        style={this.props.expanded ? this.bodyStyleExpanded : this.bodyStyle}
        className={this.bootstrapGrid}
      >
        {!this.props.expanded && this.props.newThreadButton}
        {items}
      </div>
    );
  }

  /**
   * Bootstrap classNames
   */
  bootstrapGrid: string = 'col-lg-12 col-md-12 col-sm-12';

  /**
   * CSS styles
   */
  bodyStyle = {
    width: '100%',
    maxHeight: '81vh',
    overflowY: 'scroll' as 'scroll',
    overflowX: 'hidden' as 'hidden',
    justifyContent: 'center',
    paddingRight: '5px',
    paddingLeft: '5px'
  };

  bodyStyleExpanded = {
    width: '100%',
    maxHeight: '85vh',
    overflowY: 'scroll' as 'scroll',
    overflowX: 'hidden' as 'hidden',
    justifyContent: 'center',
    paddingRight: '5px',
    paddingLeft: '5px'
  };
}

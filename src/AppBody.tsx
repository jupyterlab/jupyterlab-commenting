import * as React from 'react';

interface IAppBodyProps {
  cards?: React.ReactNode[];
}

export class AppBody extends React.Component<IAppBodyProps> {
  constructor(props: any) {
    super(props);
  }
  render() {
    const items = this.props.cards.map((props, i) => (
      <div key={i}>{props}</div>
    ));

    return (
      <div style={this.bodyStyle} className={this.bootstrapGrid}>
        {items}
      </div>
    );
  }

  bootstrapGrid: string = 'col-lg-12 col-md-12 col-sm-12';

  bodyStyle = {
    width: '100%',
    maxHeight: '83vh',
    overflowY: 'scroll' as 'scroll',
    overflowX: 'hidden' as 'hidden',
    justifyContent: 'center',
    paddingRight: '5px',
    paddingLeft: '5px'
  };
}

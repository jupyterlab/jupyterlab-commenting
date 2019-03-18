import * as React from 'react';

/**
 * Main App React Component
 */
export class App extends React.Component {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: any) {
    super(props);
  }

  /**
   * React render function
   */
  render(): React.ReactNode {
    return this.props.children;
  }
}

// @flow
import * as React from 'react';

/**
 * Creates a row and a single column of 12 column spans, and then pulls the wrapped component to the right most part of the screen.
 *
 * @param Component
 * @returns {function(P): XML}
 */
export default function pullRight<P extends Object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return (props: P) => (
    <div className="row">
      <div className="col-md-12">
        <div className="pull-right">
          <Component {...props} />
        </div>
      </div>
    </div>
  );
}

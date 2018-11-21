import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';

type CollapseState = { collapsed: Boolean };
type CollapseProps<B> = {
  head: string;
  Body: JSX.Element;
  bodyProps?: B;
  readOnly?: boolean;
  collapsed?: boolean;
};

export default class CollapseComponent<B> extends React.Component<
  CollapseProps<B>,
  CollapseState
> {
  constructor(props: CollapseProps<B>) {
    super(props);
    this.state = { collapsed: props.collapsed || false };
  }
  render() {
    const { head, Body } = this.props;
    return (
      <div
        className="container-fluid"
        style={{ borderStyle: 'solid', borderWidth: 'thin' }}
      >
        <h3>{head}</h3>
        <button
          data-toggle="tooltip"
          style={{ float: 'right' }}
          title={this.state.collapsed ? 'Click to Expand' : 'Click to Hide'}
          onClick={e => {
            e.preventDefault();
            this.setState((ps: CollapseState) => ({
              ...ps,
              collapsed: !this.state.collapsed
            }));
          }}
          className="btn btn-link"
        >
          <FontAwesome
            className="fa-2x"
            name={this.state.collapsed ? 'chevron-down' : 'chevron-up'}
            style={{ color: 'black' }}
          />
        </button>
        <div className={`collapse${this.state.collapsed ? '' : ' in'}`}>{Body}</div>
      </div>
    );
  }
}

import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';

type CollapseState = { collapsed: Boolean };
type CollapseProps<A, B> = {
  heading?: string;
  Head: JSX.Element;
  Body: JSX.Element;
  headProps?: A;
  bodyProps?: B;
  readOnly?: boolean;
  collapsed?: boolean;
  showHead?: boolean;
};

export default class CollapseComponent<A, B> extends React.Component<
  CollapseProps<A, B>,
  CollapseState
> {
  constructor(props: CollapseProps<A, B>) {
    super(props);
    this.state = { collapsed: props.collapsed || false };
  }
  render() {
    const { Head, Body } = this.props;
    return (
      <div
        className="container-fluid"
        style={{ borderStyle: 'solid', borderWidth: 'thin' }}
      >
        {this.props.heading && (
          <div className="page-header">
            <h3>{this.props.heading}</h3>
          </div>
        )}
        {this.state.collapsed && this.props.showHead && Head}
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

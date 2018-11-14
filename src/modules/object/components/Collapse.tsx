import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';

type CollapseState = { collapsed: Boolean };
type CollapseProps<H, B> = {
  Head: JSX.Element;
  Body: JSX.Element;
  headProps?: H;
  bodyProps?: B;
};

export default class CollapseComponent<H, B> extends React.Component<
  CollapseProps<H, B>,
  CollapseState
> {
  constructor(props: CollapseProps<H, B>) {
    super(props);
    this.state = { collapsed: true };
  }
  render() {
    const { Head, Body } = this.props;
    return (
      <div className="container" style={{ borderStyle: 'solid', borderWidth: 'thin' }}>
        <div>
          {Head}
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
              style={{ color: 'black', float: 'right' }}
            />
          </button>
        </div>
        <div className={`collapse${this.state.collapsed ? '' : ' in'}`}>{Body}</div>
      </div>
    );
  }
}

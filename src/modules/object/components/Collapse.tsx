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
      <div>
        <div>
          <div>{Head}</div>
        </div>
        <div className={`collapse${this.state.collapsed ? '' : ' in'} `}>
          <br />
          {Body}
        </div>
        <div className="form-group" style={{ textAlign: 'right', height: '30px' }}>
          <button
            data-toggle="tooltip"
            title={this.state.collapsed ? 'Click to Expand' : 'Click to Hide'}
          >
            <FontAwesome
              name={this.state.collapsed ? 'chevron-down' : 'chevron-up'}
              style={{ color: 'black', float: 'right' }}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                this.setState((ps: CollapseState) => ({
                  ...ps,
                  collapsed: !this.state.collapsed
                }));
              }}
            />
          </button>
        </div>
      </div>
    );
  }
}

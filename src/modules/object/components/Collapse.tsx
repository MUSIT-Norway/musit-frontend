import * as React from 'react';

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
        <div style={{ textAlign: 'right' }}>
          {this.state.collapsed ? (
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                this.setState((ps: CollapseState) => ({
                  ...ps,
                  collapsed: false
                }));
              }}
              className="btn btn-link"
            >
              {'Klikk for å editere'}
            </button>
          ) : (
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                this.setState((ps: CollapseState) => ({
                  ...ps,
                  collapsed: true
                }));
              }}
              className="btn btn-link"
            >
              {' '}
              {'Klikk for å lagre'}
            </button>
          )}
        </div>
      </div>
    );
  }
}

import * as React from 'react';
import { OutputPerson } from '../../../models/object/person';
import { GetPersonsFromPersonNameProps, PersonStoreState } from './PersonStore';
import { AppSession } from '../../../types/appSession';
import { AjaxGet } from '../../../types/ajax';
import config from '../../../config';
import { History } from 'history';

export type SearchState = {
  searchString: string;
};

export type SearchProps = {
  getPersonsFromPersonName: (
    a?: AjaxGet<any>
  ) => (s: GetPersonsFromPersonNameProps) => OutputPerson[];
  store: PersonStoreState;
  appSession: AppSession;
  history: History;
};

export default class SearchPersonComponent extends React.Component<
  SearchProps,
  SearchState
> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      searchString: ''
    };
  }

  render() {
    return (
      <div>
        <form style={{ padding: '25px' }}>
          <div className="container">
            <div className="page-header">
              <h1>Søk etter personer</h1>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-5">
                  <input
                    className="form-control"
                    id="searcField"
                    onChange={e => {
                      const value = e.target.value;
                      this.setState((ps: SearchState) => ({
                        ...ps,
                        searchString: value
                      }));
                    }}
                  />
                </div>
                <div className="col-md-1">
                  <div className="input-group-btn">
                    <button
                      className="btn btn-default"
                      type="submit"
                      onClick={e => {
                        e.preventDefault();
                        this.props.getPersonsFromPersonName()({
                          name: this.state.searchString || '',
                          collectionId: this.props.appSession.collectionId,
                          token: this.props.appSession.accessToken
                        });
                      }}
                    >
                      Søk
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <table className="table table-condensed table-responsive">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>First name</th>
                  <th>Last name</th>
                </tr>
              </thead>
              <tbody>
                {this.props.store.personList ? (
                  this.props.store.personList
                    .sort(
                      (a: OutputPerson, b: OutputPerson) => (a.name >= b.name ? 1 : -1)
                    )
                    .map((p: OutputPerson, i: number) => (
                      <tr key={`SR-${i}`}>
                        <td>{p.name}</td>
                        <td>{p.firstName}</td>
                        <td>{p.lastName}</td>
                        <td>
                          <button
                            className="btn btn-link"
                            type="button"
                            onClick={e => {
                              const url = config.magasin.urls.client.person.viewPerson(
                                this.props.appSession,
                                p.personUuid ? p.personUuid : '' //  r.response.personUuid  //
                              );
                              e.preventDefault();
                              this.props.history && this.props.history.push(url);
                            }}
                          >
                            Vis
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td>No data</td>
                  </tr>
                )}
              </tbody>
            </table>
            <hr />
            <div className="row">
              <div className="col-md-3"> Fant du ikke det du lette etter?</div>
              <div className="col-md-1">
                <button
                  className="btn btn"
                  type="button"
                  onClick={e => {
                    const addURL = config.magasin.urls.client.person.addPerson(
                      this.props.appSession
                    );
                    e.preventDefault();
                    this.props.history.push(addURL);
                  }}
                >
                  Add new person
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

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
        <form>
          <div className="container">
            <div className="form-group">
              <input
                className="form-control"
                id="searcField"
                onChange={e => {
                  const value = e.target.value;
                  console.log('E', e.target.value);

                  this.setState((ps: SearchState) => ({
                    ...ps,
                    searchString: value
                  }));
                }}
              />
              <div className="input-group-btn">
                <button
                  className="btn btn-default"
                  type="button"
                  onClick={() => {
                    this.props.getPersonsFromPersonName()({
                      name: this.state.searchString,
                      collectionId: this.props.appSession.collectionId,
                      token: this.props.appSession.accessToken
                    });
                  }}
                >
                  Søk
                </button>
              </div>
            </div>
            <table className="table">
              <thead>
                <th>Name</th>
                <th>First name</th>
                <th>Last name</th>
              </thead>
              <tbody>
                {this.props.store.personList ? (
                  this.props.store.personList.map((p: OutputPerson, i: number) => (
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
          </div>
        </form>
      </div>
    );
  }
}

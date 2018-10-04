import * as React from 'react';
import { OutputPerson } from '../../../models/object/person';
import { GetPersonsFromPersonNameProps, PersonStoreState } from './PersonStore';
import { AppSession } from '../../../types/appSession';
import { AjaxGet } from '../../../types/ajax';

export type SearchState = {
  searchString: string;
};

export type SearchProps = {
  getPersonsFromPersonName: (
    a?: AjaxGet<any>
  ) => (s: GetPersonsFromPersonNameProps) => OutputPerson[];
  store: PersonStoreState;
  appSession: AppSession;
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
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            placeholder="Search"
            id="searcField"
          />
          <div className="input-group-btn">
            <button
              className="btn btn-default"
              onClick={() => {
                console.log('Klikkkkkk');
                this.props.getPersonsFromPersonName()({
                  name: 'Kars',
                  collectionId: this.props.appSession.collectionId,
                  token: this.props.appSession.accessToken
                });
              }}
            >
              Søk
            </button>
          </div>
        </div>
        <table>
          <thead>
            <th>Name</th>
          </thead>
          <tbody>
            {this.props.store.personList ? (
              this.props.store.personList.map((p: OutputPerson) => (
                <tr>
                  <td>{p.name}</td>{' '}
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
    );
  }
}

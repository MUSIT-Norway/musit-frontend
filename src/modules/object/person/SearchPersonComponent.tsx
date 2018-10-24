import * as React from 'react';
import { OutputPerson } from '../../../models/object/person';
import { GetPersonsFromPersonNameProps, PersonStoreState } from './PersonStore';
import { AppSession } from '../../../types/appSession';
import { AjaxGet } from '../../../types/ajax';
import config from '../../../config';
import { History } from 'history';
import { PersonName } from '../../../models/object/person';
import { chunk } from 'lodash';

export type SearchState = {
  searchString: string;
  pageSize: number;
  activePage: number;
  currStart: number;
  currEnd: number;
};

const getSynonyms = (props: PersonName[]) => {
  let synName: string;
  let title: string;
  let LastName: string;
  let firstName: string;
  if (props.length > 0) {
    synName =
      props &&
      props
        .map((e: PersonName, i: number) => {
          title = e.title && e.title ? e.title : ' ';
          LastName = e.lastName && e.lastName ? '  ' + e.lastName : ' ';
          firstName = e.firstName && e.firstName ? ', ' + e.firstName : ' ';
          return title + LastName + firstName;
        })
        .reduce((acc, val) => acc + '; ' + val);
  } else {
    synName = '';
  }
  return synName;
};

const PersonTable = (props: {
  personsToShow: OutputPerson[];
  slice: OutputPerson[][];
  persons: OutputPerson[][];
  activePage: number;
  pageSize: number;
  totalSize: number;
  onChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickSearch: () => void;
  resetPages: () => void;
  onClickPage: (e: number) => void;
  onClickSize: (e: number) => void;
  onClickNext: (n?: number) => void;
  onClickPrev: (n?: number) => void;
  currentStart: number;
  currentEnd: number;
  appSession: AppSession;
  history: History;
  searchField: string;
}) => (
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
                id="searchField"
                onChange={props.onChangeSearch}
                value={props.searchField}
              />
            </div>
            <div className="col-md-1">
              <div className="input-group-btn">
                <button
                  className="btn btn-default"
                  type="submit"
                  onClick={e => {
                    e.preventDefault();
                    props.resetPages();
                    props.onClickSearch();
                  }}
                >
                  Søk
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-1">Antall/side</div>
            <div className="col-md-6">
              <label className="radio-inline">
                <input
                  type="radio"
                  name="optradio"
                  checked={props.pageSize === 10 ? true : false}
                  onChange={() => {
                    props.onClickSize(10);
                  }}
                />10
              </label>
              <label className="radio-inline">
                <input
                  type="radio"
                  name="optradio"
                  checked={props.pageSize === 50 ? true : false}
                  onChange={() => {
                    props.onClickSize(50);
                  }}
                />50
              </label>
              <label className="radio-inline">
                <input
                  type="radio"
                  name="optradio"
                  checked={props.pageSize === 100 ? true : false}
                  onChange={() => {
                    props.onClickSize(100);
                  }}
                />100
              </label>
              <label className="radio-inline">
                <input
                  type="radio"
                  name="optradio"
                  checked={props.pageSize === 200 ? true : false}
                  onChange={() => {
                    props.onClickSize(200);
                  }}
                />200
              </label>
              <label className="radio-inline">
                <input
                  type="radio"
                  name="optradio"
                  checked={props.pageSize === props.totalSize ? true : false}
                  onChange={() => {
                    props.onClickSize(props.totalSize);
                  }}
                />Alle
              </label>
            </div>
          </div>
        </div>
        <hr />
        <ul className="pagination">
          <li className="prev">
            <a
              href="#"
              onClick={e => {
                if (props.activePage - 5 >= 0) {
                  props.onClickPrev(5);
                }
              }}
            >
              Prev 5
            </a>
          </li>
          <li className="prev">
            <a
              href="#"
              onClick={e => {
                if (props.activePage - 1 >= 0) {
                  props.onClickPrev();
                }
              }}
            >
              Prev
            </a>
          </li>
          {props.persons
            .slice(
              props.currentStart >= 0 ? props.currentStart : 0,
              (props.currentEnd <= props.totalSize ? props.currentEnd : props.totalSize) +
                1
            )
            .map((p: OutputPerson[], i: number) => (
              <li
                className={i + props.currentStart === props.activePage ? 'active' : ''}
                key={`UL-key-${i}`}
              >
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    props.onClickPage(i + props.currentStart);
                  }}
                >
                  {props.currentStart + i + 1}
                </a>
              </li>
            ))}
          <li className="next">
            <a
              href="#"
              onClick={e => {
                if (props.activePage + 1 <= props.totalSize) {
                  props.onClickNext();
                }
              }}
            >
              Next
            </a>
          </li>
          <li className="next">
            <a
              href="#"
              onClick={e => {
                if (props.activePage + 5 <= props.totalSize) {
                  props.onClickNext(5);
                }
              }}
            >
              Next 5
            </a>
          </li>
        </ul>
        <table className="table table-condensed table-responsive">
          <thead>
            <tr>
              <th>Name</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Synonyms</th>
            </tr>
          </thead>
          <tbody>
            {props.personsToShow.map((p: OutputPerson, i: number) => (
              <tr key={`SR-${i}`}>
                <td>{p.name}</td>
                <td>{p.firstName}</td>
                <td>{p.lastName}</td>
                <td>{getSynonyms(p.synonyms ? p.synonyms : [])}</td>
                <td>
                  <button
                    className="btn btn-link"
                    type="button"
                    onClick={e => {
                      const url = config.magasin.urls.client.person.viewPerson(
                        props.appSession,
                        p.personUuid ? p.personUuid : '' //  r.response.personUuid  //
                      );
                      e.preventDefault();
                      props.history && props.history.push(url);
                    }}
                  >
                    Vis
                  </button>
                </td>
              </tr>
            ))}
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
                  props.appSession
                );
                e.preventDefault();
                props.history.push(addURL);
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
    this.onClickSearch = this.onClickSearch.bind(this);
    this.onSetActivePage = this.onSetActivePage.bind(this);
    this.onSetPageSize = this.onSetPageSize.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.resetPages = this.resetPages.bind(this);

    this.state = {
      searchString: '',
      pageSize: 10,
      activePage: 0,
      currStart: 0,
      currEnd: 4
    };
  }

  resetPages() {
    this.setState((ps: SearchState) => ({
      ...ps,
      currStart: 0,
      currEnd: 4,
      activePage: 0
    }));
  }

  onClickSearch() {
    this.props.getPersonsFromPersonName()({
      name: this.state.searchString || '',
      collectionId: this.props.appSession.collectionId,
      token: this.props.appSession.accessToken
    });
  }

  onClickNext(num: number = 1) {
    this.setState((ps: SearchState) => ({
      ...ps,
      currStart: ps.currStart + num,
      currEnd: ps.currEnd + num,
      activePage: ps.activePage + num
    }));
  }
  onClickPrev(num: number = 1) {
    this.setState((ps: SearchState) => ({
      ...ps,
      currStart: ps.currStart > num ? ps.currStart - num : 0,
      currEnd: ps.currStart > num ? ps.currEnd - num : 4,
      activePage: ps.activePage - num
    }));
  }
  onSetActivePage(p: number) {
    this.setState(ps => ({
      ...ps,
      activePage: p
    }));
  }
  onSetPageSize(s: number) {
    this.setState(ps => ({
      ...ps,
      currStart: 0,
      currEnd: 4,
      activePage: 0,
      pageSize: s
    }));
  }

  render() {
    const persons = this.props.store.personList
      ? chunk(
          this.props.store.personList.sort((p1, p2) => (p1.name < p2.name ? -1 : 1)),
          this.state.pageSize
        )
      : [];
    const activePage =
      this.state.activePage > persons.length - 1
        ? persons.length - 1
        : this.state.activePage;

    return (
      <PersonTable
        personsToShow={persons[activePage] || []}
        slice={persons.slice(this.state.currStart, this.state.currEnd)}
        persons={persons}
        totalSize={this.props.store.personList ? this.props.store.personList.length : 0}
        onClickPage={this.onSetActivePage}
        onClickSize={this.onSetPageSize}
        searchField={this.state.searchString}
        resetPages={this.resetPages}
        onClickNext={this.onClickNext}
        onClickPrev={this.onClickPrev}
        currentStart={this.state.currStart}
        currentEnd={this.state.currEnd}
        onChangeSearch={e => {
          console.log(e);
          const value = e.target.value;
          this.setState((ps: SearchState) => ({
            ...ps,
            searchString: value
          }));
        }}
        activePage={activePage}
        pageSize={this.state.pageSize}
        onClickSearch={this.onClickSearch}
        appSession={this.props.appSession}
        history={this.props.history}
      />
    );
  }
}

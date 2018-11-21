import * as React from 'react';
import { PersonNameSuggest } from '../../../components/suggest/PersonNameSuggest';
//import { EventMetadataProps} from './CollectingEventComponent';
import { ActorsAndRelation } from '../../../models/object/collectingEvent';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';
import { personDet } from '../../../models/object/classHist';
import config from '../../../config';
//import * as FontAwesome from 'react-fontawesome';

const personNameAsString = (n: ActorsAndRelation) => {
  return (
    <span className="suggestion-content">{n.name ? 'Full Name: ' + n.name : ''}</span>
  );
};

export type PersonProps = {
  actorsAndRelation?: ActorsAndRelation[];
  disabled: boolean;
  value?: string;
  appSession: AppSession;
  history: History;
  onChangePerson: (suggestion: personDet) => void;
  onAddPerson: () => void;
  onDeletePerson: (i: number) => void;
};

const PersonComponent = (props: PersonProps) => {
  return (
    <div>
      <div className="row form-group">
        <div className="col-md-10">
          <PersonNameSuggest
            id="PersonNameSuggestCollectingEvent"
            disabled={props.disabled}
            value={props.value}
            renderFunc={personNameAsString}
            placeHolder="Person Name"
            appSession={props.appSession}
            onChange={props.onChangePerson}
            history={props.history}
            labelText="Leg (person name)"
            hideCreateNewPerson={true}
          />
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-default form-control"
            onClick={e => {
              e.preventDefault();
              props.onAddPerson();
            }}
          >
            {' '}
            Legg til person
          </button>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-12">
          <table className="table table-condensed table-hover">
            <thead>
              <tr>
                <th>Personer i denne hendelsen</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {props.actorsAndRelation &&
                props.actorsAndRelation.map((d: ActorsAndRelation, i: number) => (
                  <div key={`det-row-${i}`}>
                    <tr>
                      <td className="col-md-5">
                        <input
                          type="text"
                          className="form-control"
                          disabled={true}
                          value={d.name}
                        />
                      </td>
                      <td className="col-md-5">
                        <input
                          type="text"
                          className="form-control"
                          disabled={true}
                          value={d.personNameUuid}
                        />
                      </td>
                      {/* <td className="col-md-1">
                        <a
                          href=""
                          onClick={e => {
                            e.preventDefault();
                            //props.setDetEditingIndex(i);
                          }}
                        >
                          <FontAwesome name="edit" />
                        </a>
                      </td> */}
                      <td className="col-md-1">
                        <a
                          href=""
                          onClick={e => {
                            e.preventDefault();
                            props.onDeletePerson(i);
                          }}
                        >
                          Delete
                        </a>
                      </td>
                    </tr>
                  </div>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <button
            className="btn btn-default form-control"
            onClick={e => {
              let url: string;
              url = config.magasin.urls.client.person.addNewPersonNameBlank(
                props.appSession
              );
              e.preventDefault();
              props.history && props.history.push(url);
            }}
          >
            {' '}
            Opprett ny person
          </button>
        </div>
      </div>

      <div className="row form-group" />
    </div>
  );
};

export default PersonComponent;

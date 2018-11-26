import * as React from 'react';
//import FieldMultiSelect from "../../../forms/components/FieldMultiSelect";
//import { PersonPage } from './Person';
import { PersonName } from './PersonComponent';
import { AppSession } from 'src/types/appSession';
import { History } from 'history';
import { PersonStoreState } from './PersonStore';

/* type PersonNameState = {
  title?: string;
  firstName?: string;
  lastName?: string;
  nameString?: string;
}; */

//type AddPersonNameProps = PersonNameProps & { match: { params: { newName: string } } };

export type AddPersonNameState = {
  personName: PersonName;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
};

type PersonNameProps = {
  personName?: PersonName;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
  appSession: AppSession;
  history: History;
  onChangeFullName: (fieldName: string) => (newValue: string) => void;
  onCreatePersonName: Function;
  addPersonName?: Function;
  store?: PersonStoreState;
};

export const PersonNameComponent = (props: PersonNameProps) => {
  return (
    <div className="container">
      <h3>Person-name</h3>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="title">Title</label>
          <input
            value={props.personName && props.personName.title}
            type="text"
            className="form-control"
            id="title"
            onChange={e => props.onChangeFullName('title')(e.target.value)}
            disabled={props.disableOnChangeOtherName}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="first-name">First name</label>
          <input
            value={props.personName && props.personName.firstName}
            type="text"
            className="form-control"
            id="first-name"
            onChange={e => props.onChangeFullName('firstName')(e.target.value)}
            disabled={props.disableOnChangeOtherName}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="last-name">Last name</label>
          <input
            value={props.personName && props.personName.lastName}
            type="text"
            className="form-control"
            id="Last-name"
            onChange={e => props.onChangeFullName('lastName')(e.target.value)}
            disabled={props.disableOnChangeOtherName}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="last-name">Navn</label>
          <input
            value={props.personName && props.personName.nameString}
            type="text"
            className="form-control"
            id="name"
            onChange={e => props.onChangeFullName('nameString')(e.target.value)}
            disabled={props.disableOnChangeFullName}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="person">Synonyme for</label>
          <select
            className="form-control"
            id="person"
            //onChange={e => props.onChangePersonForPersonname(e.target.value)}
          >
            <option value="0">--No person--</option>
            <option value="1">And, Arne</option>
            <option value="2">Duck, Dolly</option>
            <option value="3">Duck, Donald</option>
            <option value="4">Mus, Mikke</option>
            <option value="5">Kent, Clark</option>
            <option value="6">Wayne, Bruce</option>
            <option value="7">Parker, Peter</option>
            <option value="8">Lane, Louise</option>
          </select>
          <button
            type="button"
            className="btn btn-default"
            //onClick={props.onClick}
          >
            Ny person
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12" style={{ textAlign: 'right' }}>
          <button
            type="button"
            className="btn btn-link"
            onClick={e => {
              e.preventDefault();
              props.history && props.history.goBack();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={e => {
              e.preventDefault();
              props.onCreatePersonName(props.appSession);
            }}
            /* {
                  console.log('Anuradha hit save ', props.appSession)
                  return props.addPersonName &&  props.addPersonName({
                    data: props.personName,
                    token: props.appSession.accessToken,
                    collectionId: props.appSession.collectionId})
              }}} */
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

/* export class AddPersonName extends React.Component<
  AddPersonNameProps,
  AddPersonNameState
> {
  constructor(props: AddPersonNameProps) {
    console.log('NEWNAME: ', props.match.params.newName);
    console.log('STORE ', props.store.personNameState);
    super(props);
    this.state = props.store.personNameState
      ? props.store.personNameState
      : {
      
          personName: {
            firstName:
              this.props.match.params && this.props.match.params.newName
                ? this.props.match.params.newName
                : props.personName && props.personName.firstName
                  ? props.personName.firstName
                  : '',
            lastName:
              props.personName && props.personName.lastName
                ? props.personName.lastName
                : '',
            nameString:
              props.personName && props.personName.nameString
                ? props.personName.nameString
                : ''
          },
          disableOnChangeOtherName: false,
          disableOnChangeFullName:
            this.props.match.params && this.props.match.params.newName ? true : false
        };
  }

  componentWillReceiveProps(props: AddPersonNameProps) {
    console.log('Recieve props: ====>', props);
    if (props.store.localState) {
      this.setState(() => ({ ...props.store.personNameState }));
    }
  }
  render() {
    console.log('Page load ');
    return (
      <div style={{ padding: '25px' }}>
        <PersonNameComponent
          {...this.state}
          store={this.props.store}
          appSession={this.props.appSession}
          history={this.props.history}          
          //addPersonName={this.props.addPersonName && this.props.addPersonName(this.props.appSession)}
          onCreatePersonName={(appSession: AppSession) => {
            console.log('Anuradha hit save ', this.state);
            return (
              this.props.addPersonName &&
              this.props.addPersonName()({
                data: this.state,
                token: appSession.accessToken,
                collectionId: appSession.collectionId,
                callback: (res: any) => console.log('call back ====> ', res)
              })
            );
          }}
          onChangeFullName={(fieldName: string) => (value: string) => {
            this.setState((ps: AddPersonNameState) => {
              console.log('ANURADHA in onChangeFullName : ', fieldName, value);
              const lastName =
                fieldName === 'lastName'
                  ? value
                  : ps.personName && ps.personName.lastName
                    ? ps.personName.lastName
                    : '';
              const title =
                fieldName === 'title'
                  ? value
                  : ps.personName && ps.personName.title
                    ? ps.personName.title
                    : '';
              const firstName =
                fieldName === 'firstName'
                  ? value
                  : ps.personName && ps.personName.firstName
                    ? ps.personName.firstName
                    : '';
              const nameString = `${lastName || ''}${
                title || firstName ? ', ' : ''
              }${title || ''}${title ? ' ' : ''}${firstName || ''}`;

              const disableOnChangeFullName =
                lastName || title || firstName ? true : false;

              let disableOnChangeOtherName = false;
              if (fieldName === 'nameString') {
                disableOnChangeOtherName = true;

                if (value === '') {
                  disableOnChangeOtherName = false;
                }
              }

              return {
                ...ps,
                personName: {
                  ...ps.personName,
                  nameString,
                  [fieldName]: value
                },
                disableOnChangeFullName: disableOnChangeFullName,
                disableOnChangeOtherName: disableOnChangeOtherName
              };
            });
          }}
        />
      </div>
    );
  }
} */

export default PersonNameComponent;

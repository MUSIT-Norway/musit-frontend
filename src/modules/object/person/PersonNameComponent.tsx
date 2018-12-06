import * as React from 'react';
import { InputPersonName } from '../../../models/object/person';
import { AppSession } from 'src/types/appSession';
import { History } from 'history';

type PersonNameProps = {
  //personName?: InputPersonName;
  editingPersonName?: InputPersonName;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
  appSession: AppSession;
  history: History;
  onChangeFullName: (fieldName: string) => (newValue: string) => void;
  onCreatePersonName: Function;
  addPersonName?: Function;
};

export const PersonNameComponent = (props: PersonNameProps) => {
  return (
    <form className="form-horizontal">
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="title">
          Title
        </label>
        <div className="col-sm-3">
          <input
            value={props.editingPersonName && props.editingPersonName.title}
            type="text"
            className="form-control"
            id="title"
            onChange={e => {
              e.preventDefault();
              props.onChangeFullName('title')(e.target.value);
            }}
            disabled={props.disableOnChangeOtherName}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="first-name">
          First name
        </label>
        <div className="col-sm-3">
          <input
            value={props.editingPersonName && props.editingPersonName.firstName}
            type="text"
            className="form-control"
            id="first-name"
            onChange={e => {
              e.preventDefault();
              props.onChangeFullName('firstName')(e.target.value);
            }}
            disabled={props.disableOnChangeOtherName}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="last-name">
          Last name
        </label>
        <div className="col-sm-3">
          <input
            value={props.editingPersonName && props.editingPersonName.lastName}
            type="text"
            className="form-control"
            id="last-name"
            onChange={e => {
              e.preventDefault();
              props.onChangeFullName('lastName')(e.target.value);
            }}
            disabled={props.disableOnChangeOtherName}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="last-name">
          Navn
        </label>
        <div className="col-sm-3">
          <input
            value={props.editingPersonName && props.editingPersonName.name}
            type="text"
            className="form-control"
            id="name"
            onChange={e => {
              e.preventDefault();
              props.onChangeFullName('name')(e.target.value);
            }}
            disabled={props.disableOnChangeFullName}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-11" style={{ textAlign: 'right' }}>
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
          >
            Save
          </button>
        </div>
      </div>
    </form>
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

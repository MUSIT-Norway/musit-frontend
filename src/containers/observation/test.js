import React, { Component } from 'react';
import { Button, Panel, Grid } from 'react-bootstrap'
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { MusitField, MusitDropDownField } from '../../components/formfields'

const actions = {
  submitFormAction: (values) => {
    return {
      type: 'wakka',
      data: values
    }
  }
};

const validate = (formProps) => {
  const errors = {};
  console.log(formProps)
  if (!formProps.firstName) {
    errors.firstName = 'Please enter a first name';
  }

  if (!formProps.lastName) {
    errors.lastName = 'Please enter a last name';
  }

  if (!formProps.email || formProps.email.indexOf('@') === -1) {
    errors.email = 'Please enter an email';
  }

  if (!formProps.phoneNumber) {
    errors.phoneNumber = 'Please enter a phone number'
  }

  return errors;
};


const form = reduxForm({
  form: 'ReduxFormTutorial',
  validate
});

class ReduxFormTutorial extends Component {
  static propTypes = {
    pristine: React.PropTypes.bool,
    submitting: React.PropTypes.bool,
    reset: React.PropTypes.func.isRequired,
    submitFormAction: React.PropTypes.func.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    initialize: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  componentDidMount() {
    this.handleInitialize();
  }

  handleInitialize() {
    const initData = {
      firstName: '',
      lastName: '',
      sex: '',
      email: '',
      phoneNumber: ''
    };

    this.props.initialize(initData);
  }

  handleFormSubmit(formProps) {
    this.props.submitFormAction(formProps);
  }

  isInvalid(props) {
    return props.meta.touched && props.meta.error
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div>
        <main>
          <Panel>
            <Grid>
              <form onSubmit={handleSubmit(this.handleFormSubmit)}>

                <label>First Name:</label>
                <Field name="firstName" type="text" component={props => <MusitField {...props.input} validator={() => this.isInvalid(props)} />} />

                <label>Last Name:</label>
                <Field name="lastName" type="text" component={props => <MusitField {...props.input} validator={() => this.isInvalid(props)} />} />

                <label>Gender:</label>
                <Field name="sex" component={props => <MusitDropDownField {...props.input} validator={() => this.isInvalid(props)} items={['Male', 'Female']} />} />

                <label>Email:</label>
                <Field name="email" type="email" component={props => <MusitField {...props.input} validator={() => this.isInvalid(props)} />} />

                <label>Phone:</label>
                <Field name="phoneNumber" type="tel" component={props => <MusitField {...props.input} validator={() => this.isInvalid(props)} />} />

                <Button type="submit" disabled={pristine || submitting}>Submit</Button>
                <Button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</Button>
              </form>
            </Grid>
          </Panel>
        </main>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, actions)(form(ReduxFormTutorial));

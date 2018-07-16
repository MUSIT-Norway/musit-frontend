import { values } from 'lodash';
import * as React from 'react';
import {
  ControlLabel,
  Grid,
  Row,
  Col,
  Button,
  FormGroup,
  FormControl
} from 'react-bootstrap';
import {
  RenderPest,
  RenderAlcohol,
  RenderDoubleTextArea,
  RenderFromToNumberComment,
  RenderDoubleTextAreaValueProp,
  RenderPestValueProps,
  RenderFromToNumberCommentValueProp,
  RenderAlcoholValueProps
} from './render';
import {
  containsObjectWithField,
  parseISODate,
  DATE_FORMAT_DISPLAY,
  isDateBiggerThanToday,
  formatISOString
} from '../../shared/util';
import * as FontAwesome from 'react-fontawesome';
import SaveCancel from '../../components/formfields/saveCancel/SaveCancel';
import DatePicker from '../../components/DatePicker';
import { ActorSuggest } from '../../components/suggest/ActorSuggest';
import * as validation from './observationValidation';
import { I18n } from 'react-i18nify';
import { emitError } from '../../shared/errors';
import { AppSession } from '../../types/appSession';
import { TODO } from '../../types/common';
import { Actor } from '../../types/actor';
import MusitActor from '../../models/actor';

interface ObservationPageProps {
  id: string;
  observations?: Array<TODO>;
  doneDate?: string;
  doneBy: Actor | string;
  registeredDate?: string;
  registeredBy?: string;
  onSaveObservation: Function;
  mode: 'ADD' | 'VIEW' | 'EDIT';
  saveDisabled?: boolean;
  cancelDisabled?: boolean;
  appSession: AppSession;
  goBack: Function;
}
/* Old:
  static propTypes = {
    id: PropTypes.string.isRequired,
    observations: PropTypes.arrayOf(PropTypes.object),
    doneDate: PropTypes.string,
    doneBy: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    registeredDate: PropTypes.string,
    registeredBy: PropTypes.string,
    onSaveObservation: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['ADD', 'VIEW', 'EDIT']).isRequired,
    saveDisabled: PropTypes.bool,
    cancelDisabled: PropTypes.bool,
    appSession: PropTypes.object.isRequired,
    goBack: PropTypes.func.isRequired
  };
*/

interface ObservationPageState {
  observations: Array<TODO>;
  selectedType: TODO;
  doneDate: string;
  doneBy: Actor | string;
  errors?: Array<TODO>;
}

function ActorOrStringIsActor(value: Actor | string): value is Actor {
  return value['fn'] !== undefined;
}

export default class ObservationPage extends React.Component<
  ObservationPageProps,
  ObservationPageState
> {
  static defaultProps: Partial<ObservationPageProps> = {
    observations: [],
    saveDisabled: false,
    cancelDisabled: false
  };

  static createDefaultPestData() {
    return { observations: [{ lifeCycle: '', count: '' }] };
  }

  constructor(props: ObservationPageProps) {
    super(props);
    this.state = {
      selectedType: null,
      observations:
        props.observations ||
        [] /* TODO: Remove || []  when we get proper support for defaultProps in TS 3.0*/,
      doneDate: props.doneDate || formatISOString(new Date()),
      doneBy: props.doneBy
    };
    this.isTypeSelectable = this.isTypeSelectable.bind(this);
    this.onChangeField = this.onChangeField.bind(this);
    this.onChangeTypeSelect = this.onChangeTypeSelect.bind(this);
    this.onChangePestObservation = this.onChangePestObservation.bind(this);
    this.onRemovePestObservation = this.onRemovePestObservation.bind(this);
    this.onClickAddObservation = this.onClickAddObservation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps: ObservationPageProps) {
    if (this.props.mode === 'VIEW') {
      this.setState((ps: TODO /*TODO: probably ObservationPageState*/) => ({
        ...ps,
        doneBy: nextProps.doneBy,
        doneDate: nextProps.doneDate,
        observations: nextProps.observations || []
      }));
    }
    if (
      this.props.mode === 'ADD' &&
      nextProps.doneBy &&
      this.props.doneBy &&
      nextProps.doneBy !== this.props.doneBy
    ) {
      this.setState(ps => ({
        ...ps,
        doneBy: nextProps.doneBy
      }));
    }
    if (nextProps.doneBy !== this.props.doneBy) {
      this.setState(ps => ({
        ...ps,
        doneBy: nextProps.doneBy
      }));
    }
  }

  onChangeField(field: TODO, value: TODO, index: TODO) {
    const observations = [...this.state.observations];
    observations[index] = {
      ...observations[index],
      data: { ...observations[index].data, [field]: value }
    };
    this.setState(ps => ({ ...ps, observations }));
  }

  onChangePestObservation(
    pestObservationIndex: TODO,
    field: TODO,
    value: TODO,
    pestIndex: TODO
  ) {
    const observations = [...this.state.observations];
    const pestObj = observations[pestIndex];
    const pestObservations = pestObj.data.observations;
    pestObservations[pestObservationIndex][field] = value;
    this.setState(ps => ({ ...ps, observations }));
  }

  onRemovePestObservation(pestObservationIndex: TODO, pestIndex: TODO) {
    const observations = [...this.state.observations];
    const pestObj = observations[pestIndex];
    pestObj.data.observations = pestObj.data.observations.filter(
      (elm: TODO, index: TODO) => index !== pestObservationIndex
    );
    this.setState(ps => ({ ...ps, observations }));
  }

  onClickAddObservation(pestIndex: TODO) {
    const observations = [...this.state.observations];
    const pestObj = observations[pestIndex];
    const pestObservations = pestObj.data.observations;
    pestObservations.push({ lifeCycle: '', count: '' });
    this.setState(ps => ({ ...ps, observations }));
  }

  onChangeTypeSelect(e: TODO) {
    e.persist();
    this.setState(ps => ({
      ...ps,
      selectedType: e.target.options[e.target.selectedIndex].value
    }));
  }

  setDate = (newValue: TODO) => {
    if (newValue) {
      if (isDateBiggerThanToday(newValue)) {
        emitError({
          type: 'dateValidationError',
          message: I18n.t('musit.observation.page.dateValidation')
        });

        this.setState(ps => ({ ...ps, doneDate: formatISOString(new Date()) }));
      } else {
        this.setState(ps => ({ ...ps, doneDate: newValue }));
      }
    }
  };
  typeDefinitions = {
    '': { label: 'typeSelect.labelText' },
    gas: {
      label: 'gas.labelText',
      render: this.renderDoubleTextArea,
      validate: validation.validateDoubleTextArea
    },
    lightCondition: {
      label: 'lightCondition.labelText',
      render: this.renderDoubleTextArea,
      validate: validation.validateDoubleTextArea
    },
    cleaning: {
      label: 'cleaning.labelText',
      render: this.renderDoubleTextArea,
      validate: validation.validateDoubleTextArea
    },
    pest: {
      label: 'pest.labelText',
      render: this.renderPest,
      data: ObservationPage.createDefaultPestData(),
      validate: validation.validatePest
    },
    mold: {
      label: 'mold.labelText',
      render: this.renderDoubleTextArea,
      validate: validation.validateDoubleTextArea
    },
    skallsikring: {
      label: 'skallsikring.labelText',
      render: this.renderDoubleTextArea,
      validate: validation.validateDoubleTextArea
    },
    tyverisikring: {
      label: 'tyverisikring.labelText',
      render: this.renderDoubleTextArea,
      validate: validation.validateDoubleTextArea
    },
    brannsikring: {
      label: 'brannsikring.labelText',
      render: this.renderDoubleTextArea,
      validate: validation.validateDoubleTextArea
    },
    vannskaderisiko: {
      label: 'vannskaderisiko.labelText',
      render: this.renderDoubleTextArea,
      validate: validation.validateDoubleTextArea
    },
    relativeHumidity: {
      label: 'relativeHumidity.labelText',
      render: this.renderFromToNumberComment,
      validate: validation.validateFromTo
    },
    hypoxicAir: {
      label: 'hypoxicAir.labelText',
      render: this.renderFromToNumberComment,
      validate: validation.validateFromTo
    },
    temperature: {
      label: 'temperature.labelText',
      render: this.renderFromToNumberComment,
      validate: validation.validateFromTo
    },
    alcohol: {
      label: 'alcohol.labelText',
      render: this.renderAlcohol,
      validate: validation.validateAlcohol
    }
  };

  addObservationType(typeToAdd?: TODO, data = {}) {
    const type = typeToAdd || this.state.selectedType;
    if (!type || type === '') {
      return;
    }
    const typeProps = { ...data, ...this.typeDefinitions[type].data };
    const observations = [{ type, data: typeProps }, ...this.state.observations];
    this.setState(ps => ({ ...ps, observations, selectedType: null }));
  }

  isTypeSelectable(typeStr: string) {
    return !containsObjectWithField(this.state.observations, 'type', typeStr);
  }

  removeObservation(index: number) {
    const observations = this.state.observations;
    this.setState(ps => ({
      ...ps,
      observations: observations.filter((o: TODO, i: number) => i !== index)
    }));
  }

  validateForm(formProps: TODO) {
    let errors = {} as TODO;

    if (
      typeof formProps.doneBy !== 'object' ||
      (!formProps.doneBy || !MusitActor.getActorId(formProps.doneBy))
    ) {
      errors.doneBy = 'musit.observation.page.doneByRequired';
    }

    if (!formProps.doneDate) {
      errors.doneDate = 'musit.observation.page.dateRequired';
    }

    formProps.observations.forEach((observation: TODO, index: number) => {
      const typeDefinition = this.typeDefinitions[observation.type];
      if (typeDefinition.validate) {
        errors = {
          ...errors,
          ...typeDefinition.validate.bind(this)(observation.data, index, observation.type)
        };
      }
    });

    return errors;
  }

  handleSubmit(e: TODO) {
    e.preventDefault();
    const errors = this.validateForm(this.state);
    this.setState(ps => ({ ...ps, errors }));
    if (Object.keys(errors).length === 0) {
      this.props.onSaveObservation(this.props.id, this.state);
    }
  }

  renderObservation(observation: TODO, index: number) {
    const typeDefinition = this.typeDefinitions[observation.type];
    return typeDefinition.render.bind(this)(observation.type, observation.data, index);
  }

  renderAlcohol(id: TODO, valueProps: RenderAlcoholValueProps, index: number) {
    return (
      <RenderAlcohol
        disabled={this.props.mode === 'VIEW'}
        valueProps={valueProps}
        index={index}
        //mode={this.props.mode} //TODO: Is it ok to remove this?
        onChangeField={this.onChangeField}
      />
    );
  }

  renderPest(id: TODO, valueProps: RenderPestValueProps, index: number) {
    return (
      <RenderPest
        disabled={this.props.mode === 'VIEW'}
        canEdit={this.props.mode !== 'VIEW'}
        valueProps={valueProps}
        index={index}
        //mode={this.props.mode}  //TODO: Is it ok to remove this?
        onChangeField={this.onChangeField}
        onChangePestObservation={this.onChangePestObservation}
        onRemovePestObservation={this.onRemovePestObservation}
        onClickAddObservation={this.onClickAddObservation}
      />
    );
  }

  renderDoubleTextArea(
    id: TODO,
    valueProps: RenderDoubleTextAreaValueProp,
    index: number
  ) {
    return (
      <RenderDoubleTextArea
        disabled={this.props.mode === 'VIEW'}
        type={id}
        valueProps={valueProps}
        index={index}
        //mode={this.props.mode}  //TODO: Is it ok to remove this?
        onChangeField={this.onChangeField}
      />
    );
  }

  renderFromToNumberComment(
    id: TODO,
    valueProps: RenderFromToNumberCommentValueProp,
    index: number
  ) {
    return (
      <RenderFromToNumberComment
        disabled={this.props.mode === 'VIEW'}
        type={id}
        valueProps={valueProps}
        index={index}
        // mode={this.props.mode}  //TODO: Is it ok to remove this?
        onChangeField={this.onChangeField}
      />
    );
  }

  render() {
    return (
      <form
        onKeyDown={e => {
          if (e.keyCode === 13 && (e.target as TODO).type !== 'textarea') {
            e.preventDefault();
          }
        }}
        onSubmit={this.handleSubmit}
      >
        <Grid>
          <Row>
            <Row>
              <Col xs={12} sm={5}>
                <ControlLabel>{I18n.t('musit.observation.page.date')}</ControlLabel>
                {this.props.mode !== 'ADD' ? (
                  <FormControl
                    componentClass="input"
                    value={parseISODate(this.state.doneDate).format(DATE_FORMAT_DISPLAY)}
                    disabled
                  />
                ) : (
                  <DatePicker
                    dateFormat={DATE_FORMAT_DISPLAY}
                    onClear={(newValue: TODO) =>
                      this.setState(ps => ({ ...ps, doneDate: newValue }))
                    }
                    value={this.state.doneDate}
                    onChange={(newValue: TODO) => this.setDate(newValue)}
                    disabled={false} //originally, equivalent to false: {this.props.mode === 'VIEW'}
                  />
                )}
              </Col>
              <Col xs={12} sm={5}>
                <ControlLabel>{I18n.t('musit.observation.page.doneBy')}</ControlLabel>
                {this.props.mode !== 'ADD' ? (
                  <FormControl
                    componentClass="input"
                    value={
                      this.state.doneBy && ActorOrStringIsActor(this.state.doneBy)
                        ? this.state.doneBy.fn
                        : this.state.doneBy || ''
                    }
                    disabled
                  />
                ) : (
                  <ActorSuggest
                    appSession={this.props.appSession}
                    id="doneByField"
                    value={
                      this.state.doneBy && ActorOrStringIsActor(this.state.doneBy)
                        ? this.state.doneBy.fn
                        : this.state.doneBy || ''
                    }
                    placeHolder="Find actor"
                    onChange={(newValue: TODO) => {
                      this.setState(ps => ({
                        ...ps,
                        doneBy: newValue
                      }));
                    }}
                  />
                )}
              </Col>
            </Row>
            {this.props.mode === 'VIEW' ? (
              <Row>
                <Col sm={5}>
                  <ControlLabel>{I18n.t('musit.texts.dateRegistered')}</ControlLabel>
                  <FormControl
                    componentClass="input"
                    value={parseISODate(this.props.registeredDate as TODO).format(
                      DATE_FORMAT_DISPLAY
                    )}
                    disabled
                  />
                </Col>
                <Col sm={5}>
                  <ControlLabel>{I18n.t('musit.texts.registeredBy')}</ControlLabel>
                  <FormControl
                    componentClass="input"
                    value={this.props.registeredBy || ''}
                    disabled
                  />
                </Col>
              </Row>
            ) : (
              ''
            )}
            {this.props.mode !== 'ADD' ? (
              ''
            ) : (
              <Row>
                <Col xs={2}>
                  <FormGroup controlId="formControlsSelect">
                    <FormControl
                      componentClass="select"
                      placeholder="select"
                      onChange={this.onChangeTypeSelect}
                      value={this.state.selectedType ? this.state.selectedType : ''}
                    >
                      {Object.keys(this.typeDefinitions)
                        .filter(this.isTypeSelectable)
                        .map((type, index) => {
                          return (
                            <option key={index} value={type}>
                              {I18n.t(
                                `musit.observation.page.${
                                  this.typeDefinitions[type].label
                                }`
                              )}
                            </option>
                          );
                        })}
                    </FormControl>
                  </FormGroup>
                </Col>
                <Col xs={4}>
                  <Button onClick={() => this.addObservationType()}>
                    <FontAwesome name="plus-circle" />
                    &nbsp;
                    {I18n.t('musit.observation.page.newButtonLabel')}
                  </Button>
                </Col>
              </Row>
            )}
            {this.state.observations.map((observation, index) => {
              const typeDefinition = this.typeDefinitions[observation.type];
              return (
                <div key={index}>
                  <h3>
                    {I18n.t(`musit.observation.page.${typeDefinition.label}`)}
                    &nbsp;
                    {this.props.mode !== 'ADD' ? (
                      ''
                    ) : (
                      <a
                        href=""
                        onClick={e => {
                          this.removeObservation(index);
                          e.preventDefault();
                        }}
                      >
                        <FontAwesome name="times" />
                      </a>
                    )}
                  </h3>
                  {this.renderObservation(observation, index)}
                  <hr />
                </div>
              );
            })}
          </Row>
          <br />
          <Row className="row-centered" style={{ textAlign: 'center' }}>
            {this.state.errors &&
              values(this.state.errors).map((error, index) => {
                return (
                  <p style={{ color: 'red' }} key={index}>
                    {I18n.t(error)}
                  </p>
                );
              })}
            <br />
            {this.props.mode === 'VIEW' ? (
              <Col xs={10}>
                <Button
                  onClick={() => {
                    this.props.goBack();
                  }}
                >
                  {I18n.t('musit.texts.close')}
                </Button>
              </Col>
            ) : (
              <SaveCancel
                onClickSave={this.handleSubmit}
                onClickCancel={() => this.props.goBack()}
                saveDisabled={
                  this.props.saveDisabled === true ||
                  this.state.observations.length === 0 ||
                  !this.props.appSession.rolesForModules.storageFacilityWrite
                }
                cancelDisabled={this.props.cancelDisabled}
              />
            )}
          </Row>
        </Grid>
      </form>
    );
  }
}

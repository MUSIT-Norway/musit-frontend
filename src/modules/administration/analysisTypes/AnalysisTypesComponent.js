/* @flow */
import React, { PropTypes } from 'react';
import { I18n } from 'react-i18nify';
import {
  Button,
  Table,
  Form,
  Checkbox,
  FormControl,
  ControlLabel,
  FormGroup,
  PageHeader,
  Col
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

type AnalysisType = { id: number, name: string, collections: Array<string> };

type Store = {
  analysisTypes: Array<AnalysisType>
};
type Props = {
  store: Store
};
const collections = [
  '1d8dd4e6-1527-439c-ac86-fc315e0ce852',
  '2e4f2455-1b3b-4a04-80a1-ba92715ff613',
  'ba3d4d30-810b-4c07-81b3-37751f2196f0',
  '88b35138-24b5-4e62-bae4-de80fae7df82',
  '7352794d-4973-447b-b84e-2635cafe910a',
  'fcb4c598-8b05-4095-ac00-ce66247be38a',
  'ef4dc066-b6f8-4155-89f8-7aa9aeeb2dc4',
  'd0dd5ad3-c22f-4ea0-8b52-dc5b0e17aa24',
  '8bbdf9b3-56d1-479a-9509-2ea82842e8f8',
  '23ca0166-5f9e-44c2-ab0d-b4cdd704af07'
];

const getCollectionName = n => I18n.t(`musit.userProfile.collections.${n}`);

const onChangeCheckbox = v => {
  console.log(v);
};

const CheckBoxShow = (v, c) => (
  <td key={c} value={c} style={{ textAlign: 'center' }}>
    <Checkbox checked={v} onChange={() => onChangeCheckbox(c)} />
  </td>
);

const doEdit = v => {
  console.log(v);
};

const getTableRow = r => {
  return (
    <tr value={r.id} key={r.id}>
      <td>{r.name}</td>
      {collections.map(
        c => r.collections.includes(c) ? CheckBoxShow(1, c) : CheckBoxShow(0, c)
      )}
      <td>
        <Button value={r.id} onClick={() => doEdit(r.id)}>
          <FontAwesome name="pencil-square-o" />
        </Button>
      </td>
    </tr>
  );
};

const getObjectsValue = (store: Store) => {
  return store.analysisTypes ? store.analysisTypes.map(r => getTableRow(r)) : [];
};

const AnalysisTypesComponent = (props: Props) => (
  <Form style={{ padding: '20px' }}>
    <PageHeader>
      {I18n.t('musit.administration.analysisTypes.analysisTypes')}
    </PageHeader>
    <FormGroup>
      <Col md={2} style={{ textAlign: 'right' }}>
        <ControlLabel>
          {I18n.t('musit.administration.analysisTypes.newAnalysisTypeName')}
        </ControlLabel>
      </Col>
      <Col md={3}>
        <FormControl type="text" />
      </Col>
      <Button>
        {I18n.t('musit.administration.analysisTypes.addAnalysisType')}
      </Button>
    </FormGroup>
    <FormGroup>
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            {collections.map(c => (
              <th style={{ textAlign: 'center' }}>{getCollectionName(c)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getObjectsValue(props.store)}
        </tbody>
      </Table>
    </FormGroup>
  </Form>
);

AnalysisTypesComponent.propTypes = {
  store: PropTypes.object.isRequired,
  saveAnalysisType: PropTypes.func
};

export default AnalysisTypesComponent;

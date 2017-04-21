/* @flow */
import React from 'react';
import {
  Grid,
  Row,
  Col,
  Button,
  FormControl,
  DropdownButton,
  MenuItem,
  FormGroup
} from 'react-bootstrap';

type personRoleDate = { name?: string, role?: string, date?: string };
import type { Person } from '../../modules/sample/sampleForm';
type Props = {
  personData: Array<Person>,
  updatePerson: Function,
  addPerson: Function
};
type FieldDropDownProps = {
  id: string,
  index: number,
  personRoleItem: personRoleDate,
  onSelectInput: Function,
  selectItems: Array<string>,
  title: string
};
const FieldDropDown = (
  { id, index, personRoleItem, onSelectInput, selectItems, title }: FieldDropDownProps
) => (
  <FormGroup controlId={id}>
    <DropdownButton
      bsStyle="default"
      title={personRoleItem.value ? personRoleItem.value : title}
      id={id}
    >
      {selectItems.map((v, i) => (
        <MenuItem
          key={i}
          onClick={e => {
            onSelectInput(index, { ...personRoleItem, role: e.target.value });
          }}
        >
          {v}
        </MenuItem>
      ))}
    </DropdownButton>
  </FormGroup>
);

export const PersonRoleDate = ({ personData, updatePerson, addPerson }: Props) => {
  const pArr = personData || [];
  return pArr &&
    <Grid>
      <Row>
        <b>Personer</b>
      </Row>
      <Row>
        <Col md={2}>
          Navn
        </Col>
        <Col md={2}>
          Rolle
        </Col>
        <Col md={2}>
          Dato
        </Col>
      </Row>
      {pArr.map((v, i) => (
        <Row key={`id_${i}`}>
          <Col md={2}>
            <FormControl value={v.name} onChange={() => updatePerson(i, v)} />
          </Col>
          <Col md={2}>
            <FieldDropDown
              id={`role_${i}`}
              personRoleItem={v}
              selectItems={['Analysator', 'Registrator']}
              index={i}
              onSelectInput={ind => updatePerson(ind, v)}
              title="Velg rolle"
            />
          </Col>
          <Col md={2}>
            {'12.01.2001'}
          </Col>
          <Col md={1}>
            Slett
          </Col>
        </Row>
      ))}
      <Row>
        <Col md={6}>
          <Button onClick={() => addPerson()}>Legg til person</Button>
        </Col>
      </Row>
    </Grid>;
};

export default PersonRoleDate;

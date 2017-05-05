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
import FontAwesome from 'react-fontawesome';
type personRoleDate = { name?: string, role?: string, date?: string };
import type { Person } from '../../modules/sample/sampleForm';
type Props = {
  personData: Array<Person>,
  updatePerson: Function,
  addPerson: Function,
  heading: string
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
      title={personRoleItem.role ? personRoleItem.role : title}
      id={id}
    >
      {selectItems.map((v, i) => (
        <MenuItem
          key={i}
          onClick={e => {
            onSelectInput(index, { ...personRoleItem, role: e.target.text });
          }}
        >
          {v}
        </MenuItem>
      ))}
    </DropdownButton>
  </FormGroup>
);

export const PersonRoleDate = (
  { personData, updatePerson, addPerson, heading }: Props
) => {
  const pArr = personData || [];
  return pArr &&
    <Grid>
      <Row>
        <h4><b>{heading}</b></h4>
      </Row>
      <Row>
        <Col md={2}>
          <b>Navn</b>
        </Col>
        <Col md={2}>
          <b>Rolle</b>
        </Col>
        <Col md={2}>
          <b>Dato</b>
        </Col>
        <Col md={2}>
          <b>Slett</b>
        </Col>
      </Row>
      <br />
      {pArr.map((v, i) => (
        <Row key={`id_${i}`}>
          <Col md={2}>
            <FormControl
              value={v.name}
              onChange={e => updatePerson(i, { ...v, name: e.target.value })}
            />
          </Col>
          <Col md={2}>
            <FieldDropDown
              id={`role_${i}`}
              personRoleItem={v}
              selectItems={['responsible', 'creator']}
              index={i}
              onSelectInput={(ind, p) => {
                updatePerson(i, p);
              }}
              title="Velg rolle"
            />
          </Col>
          <Col md={2}>
            {v.role === 'creator' &&
              <FormControl
                value={v.date}
                onChange={e => updatePerson(i, { ...v, date: e.target.value })}
              />}
          </Col>
          <Col md={1}>
            <FontAwesome name={'times'} onClick={() => updatePerson(i)} />
          </Col>
        </Row>
      ))}
      <Row>
        <Col md={6}>
          <Button onClick={() => addPerson()}>Legg til flere personer</Button>
        </Col>
      </Row>
    </Grid>;
};
export default PersonRoleDate;

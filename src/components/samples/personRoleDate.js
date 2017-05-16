// @flow
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

export type Person = {
  name?: string,
  role?: string,
  date?: string
};

type Props = {
  personData: Array<Person>,
  updateForm: Function,
  fieldName: string
};

type FieldDropDownProps = {
  id: string,
  index: number,
  personRoleItem: Person,
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

export const PersonRoleDate = ({ personData, updateForm, fieldName }: Props) => {
  const pArr = personData || [];
  return pArr &&
    <Grid>
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
              onChange={e =>
                updateForm({
                  name: fieldName,
                  rawValue: updatePerson(i, { ...v, name: e.target.value }, personData)
                })}
            />
          </Col>
          <Col md={2}>
            <FieldDropDown
              id={`role_${i}`}
              personRoleItem={v}
              selectItems={['responsible', 'creator']}
              index={i}
              onSelectInput={(ind, p) =>
                updateForm({ name: fieldName, rawValue: updatePerson(i, p, personData) })}
              title="Velg rolle"
            />
          </Col>
          <Col md={2}>
            {v.role === 'creator' &&
              <FormControl
                value={v.date}
                onChange={e =>
                  updateForm({
                    name: fieldName,
                    rawValue: updatePerson(i, { ...v, date: e.target.value }, personData)
                  })}
              />}
          </Col>
          <Col md={1}>
            <FontAwesome
              name={'times'}
              onClick={() =>
                updateForm({
                  name: fieldName,
                  rawValue: deletePerson(i, personData)
                })}
            />
          </Col>
        </Row>
      ))}
      <Row>
        <Col md={6}>
          <Button
            onClick={() =>
              updateForm({
                name: fieldName,
                rawValue: addPerson(personData)
              })}
          >
            Legg til flere personer
          </Button>
        </Col>
      </Row>
    </Grid>;
};

function addPerson(persons: Array<Person>): Array<Person> {
  return [...persons, {}];
}

function deletePerson(i: number, persons: Array<Person>): Array<Person> {
  return [...persons.slice(0, i), ...persons.slice(i + 1)];
}

function updatePerson(i, p: Person, persons: Array<Person>) {
  return [...persons.slice(0, i), p, ...persons.slice(i + 1)];
}

export default PersonRoleDate;

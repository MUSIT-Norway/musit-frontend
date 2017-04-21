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
      title={personRoleItem.role ? personRoleItem.role : title}
      id={id}
    >
      {selectItems.map((v, i) => (
        <MenuItem
          key={i}
          onClick={(e) => {
            onSelectInput(index, { ...personRoleItem, role: e.target.text });
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
            <FormControl value={v.name} onChange={(e) => updatePerson(i, {...v, name: e.target.value})} />
          </Col>
          <Col md={2}>
            <FieldDropDown
              id={`role_${i}`}
              personRoleItem={v}
              selectItems={['Analysator', 'Registrator']}
              index={i}
              onSelectInput={(ind,p) => {
                console.log('On select input: ',p);
                updatePerson(i, p);
              }}
              title="Velg rolle"
            />
          </Col>
          <Col md={2}>
            {v.role === 'Analysator' &&
            <FormControl value={v.date} onChange={(e) => updatePerson(i, {...v, date: e.target.value})}/>
            }
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

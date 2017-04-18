import React from 'react';
import { Grid, Row, Col, FormControl } from 'react-bootstrap';

export const personRoleDate = ({personData, update}) => (
    personData && (
    <Grid>
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
      {personData.map((v,i) =>(
        <Row>
          <Col md={2}>
            <FormControl
              value={v.name}
              onChange={(e) => update(i,{...v, name: e.target.value})}
            />
          </Col>
          <Col md={2}></Col>
          <Col md={2}></Col>
        </Row>)
      )}
    </Grid>
  )
);
export default personRoleDate();
/* @flow*/
import React from 'react';
const {Table, Tr, Td} = require('reactable');
import {Row, Col, Well} from 'react-bootstrap';


const SamplesForObjectComponent = ({sampleStore: { musNo, subNo, term_species, data}}) => {

  return (<div>
    <h1>
      Prøver for objekt
    </h1>
    <br/>
    <Well>
      Objektinfo
      <Row>
        <Col md={2}>
          <b>MusNo:</b>{musNo}
        </Col>
        <Col md={2}>
        <b>SubNo: </b>
          {subNo}
        </Col>
        <Col md={3}>
        <b>Term/Species: </b>
          {term_species}
        </Col>
      </Row>
    </Well>
    <br/>

    <Table className="table"
           columns={[
             {key: 'id', label: 'Sample ID'},
             {key: 'date', label: 'Dato'},
             {key: 'sampleType', label: 'Prøvetype'},
             {key: 'sampleSubType', label: 'Prøveundertype'},
             {key: 'status', label: 'Status'},
             {key: 'hasAnalyse', label: 'Analyse'}
           ]}
           sortable={['id', 'date']}
           noDataText="Ingen prøver funnet på objektet">
      {data.map((e,i) =>
        <Tr key={i}>
          <Td column="id">{e.id}</Td>
          <Td column="date">{e.date}</Td>
          <Td column="sampleType">{e.sampleType}</Td>
          <Td column="sampleSubType">{e.sampleSubType}</Td>
          <Td column="status">{e.status}</Td>
          <Td column="hasAnalyse">{e.hasAnalyse}</Td>
        </Tr>
      )}
    </Table>
  </div>);
};

export default SamplesForObjectComponent;



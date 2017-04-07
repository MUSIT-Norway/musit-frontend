import React from 'react';
const { Table, Tr, Td } = require('reactable');
import { Row, Col, Well } from 'react-bootstrap';

const SamplesForObjectComponent = ({ sampleStore: { museumNo, subNo, term, data } }) => {
  return (
    <div>
      <h1>
        Prøver for objekt
      </h1>
      <br />
      <Well>
        <b>Objektinfo</b>
        <br /><br />
        <Row>
          <Col md={2}>
            <b>MusNo:</b>{museumNo}
          </Col>
          <Col md={2}>
            <b>SubNo: </b>
            {subNo}
          </Col>
          <Col md={3}>
            <b>Term/Species: </b>
            {term}
          </Col>
        </Row>
      </Well>
      <br />
      <Table
        className="table"
        columns={[
          { key: 'id', label: 'Sample ID' },
          { key: 'createdDate', label: 'Dato' },
          { key: 'sampleType', label: 'Prøvetype' },
          { key: 'sampleSubType', label: 'Prøveundertype' },
          { key: 'status', label: 'Status' },
          { key: 'hasAnalyse', label: 'Analyse' },
          { key: 'showInfo', label: 'Vis detaljer' }
        ]}
        sortable={['id', 'date']}
        noDataText="Ingen prøver funnet på objektet"
      >
        {data &&
          data.map((e, i) => (
            <Tr key={i}>
              <Td column="id">{e.id}</Td>
              <Td column="createdDate">{e.createdDate}</Td>
              <Td column="sampleType">{e.sampleType}</Td>
              <Td column="sampleSubType">{e.sampleSubType}</Td>
              <Td column="status">{e.status}</Td>
              <Td column="hasAnalyse">{e.hasAnalyse}</Td>
              <Td column="showInfo">
                <a href={e.details || 'en url'}>Se mer / Rediger</a>
              </Td>
            </Tr>
          ))}
      </Table>
    </div>
  );
};

export default SamplesForObjectComponent;

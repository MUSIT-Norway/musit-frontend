/* @flow*/
import React from 'react';
const {Table, Tr, Td} = require('reactable');
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

type SampleObjectInput = {
  musNo: string,
  subNo: string,
  term_species: string,
  data:[
    {
      id: number,
      date: string,
      sampleType: string,
      sampleSubType: string,
      status: number,
      hasAnalyse: boolean }]
};

const SamplesForObject = (input: SampleObjectInput) => {
  return (<div>
    <FormGroup>
      <ControlLabel>
        Musno
      </ControlLabel>
      <FormControl value={input.musNo}/>
    </FormGroup>
    <FormGroup>
      <ControlLabel>
        Subno
      </ControlLabel>
      <FormControl value={input.subNo}/>
    </FormGroup>

    <FormGroup>
      <ControlLabel>
        Term/species
      </ControlLabel>
      <FormControl value={input.term_species}/>
    </FormGroup>

    <Table className="sampleTable"
           columns={[
             {key: 'id', label: 'Sample ID'},
             {key: 'date', label: 'Dato'},
             {key: 'sampleType', label: 'Prøvetype' },
             {key: 'sampleSubType', label: 'Prøveundertype' },
             {key: 'status', label: 'Status' },
             {key: 'hasAnalyse', label: 'Analyse'},
           ]}
           sortable={['id', 'date']}
           defaultSort={{ column: 'id', direction: 'desc' }}
           noDataText="Ingen prøver funnet på objektet">
      {input.data.map((event, i) =>
        <Tr key={i}>
          <Td column="id">{input.data[i].id}</Td>
          <Td column="date">{input.data[i].date}</Td>
          <Td column="sampleType">{input.data[i].sampleType}</Td>
          <Td column="sampleSubType">{input.data[i].sampleSubType}</Td>
          <Td column="status">{input.data[i].status}</Td>
          <Td column="hasAnalyse">{input.data[i].hasAnalyse}</Td>
        </Tr>
      )}
    </Table>
  </div>);
};

export default SamplesForObject;



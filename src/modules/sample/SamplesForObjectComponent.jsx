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

const SamplesForObjectComponent = (sampleStore: SampleObjectInput) => {
  const inp = sampleStore || {
      musNo: 'TRH-V-1233',
      subNo: null,
      term_species: 'Carex saxatilis',
      data: [
        {
        id: '123',
        date: '1992-12-22',
        sampleType: 'Vev',
        sampleSubType: 'DNA',
        status: 'Forrurenset',
        hasAnalyse: true},
        {
          id: '1423',
          date: '1992-12-01',
          sampleType: 'Vev',
          sampleSubType: 'Muscle',
          status: 'Rent',
          hasAnalyse: false},
        {
          id: '1233',
          date: '1992-11-12',
          sampleType: 'Vev',
          sampleSubType: 'Bone',
          status: 'Forrurenset',
          hasAnalyse: false},
        {
          id: '1231',
          date: '1992-12-12',
          sampleType: 'Vev',
          sampleSubType: 'Skin',
          status: 'Forrurenset',
          hasAnalyse: true}
          ]
    };
  return (<div>
    <FormGroup>
      <ControlLabel>
        Musno
      </ControlLabel>
      <FormControl value={inp.musNo}/>
    </FormGroup>
    <FormGroup>
      <ControlLabel>
        Subno
      </ControlLabel>
      <FormControl value={inp.subNo}/>
    </FormGroup>
    <FormGroup>
      <ControlLabel>
        Term/species
      </ControlLabel>
      <FormControl value={inp.term_species}/>
    </FormGroup>

    <Table className="sampleTable"
           columns={[
             {key: 'id', label: 'Sample ID'},
             {key: 'date', label: 'Dato'},
             {key: 'sampleType', label: 'Prøvetype' },
             {key: 'sampleSubType', label: 'Prøveundertype' },
             {key: 'status', label: 'Status' },
             {key: 'hasAnalyse', label: 'Analyse'}
           ]}
           sortable={['id', 'date']}
           defaultSort={{ column: 'id', direction: 'desc' }}
           noDataText="Ingen prøver funnet på objektet">
      {inp.data.map((event, i) =>
        <Tr key={i}>
          <Td column="id">{inp.data[i].id}</Td>
          <Td column="date">{inp.data[i].date}</Td>
          <Td column="sampleType">{inp.data[i].sampleType}</Td>
          <Td column="sampleSubType">{inp.data[i].sampleSubType}</Td>
          <Td column="status">{inp.data[i].status}</Td>
          <Td column="hasAnalyse">{inp.data[i].hasAnalyse}</Td>
        </Tr>
      )}
    </Table>
  </div>);
};

export default SamplesForObjectComponent;



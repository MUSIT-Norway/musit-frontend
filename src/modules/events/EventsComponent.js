// @flow
import React  from 'react';
import { Table } from 'react-bootstrap';

type Props = {
  events: any[]
}

export const EventsComponent = (props: Props) => (
  <Table striped condensed>
    <thead>
      <tr>
        <th>#</th>
        <th>Type</th>
        <th>Date</th>
        <th>By</th>
      </tr>
    </thead>
    <tbody>
    {props.events.map((event, i) =>
      <tr key={i}>
        <td>{event.id}</td>
        <td>{event.type}</td>
        <td>{event.registeredDate}</td>
        <td>{event.registeredBy}</td>
      </tr>
    )}
    </tbody>
  </Table>
);

export default EventsComponent;
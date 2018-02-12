//@flow
import React from 'react';
import type { ObjectInfo } from '../../../types/conservation';

type Props = {
  affectedThingsWithDetailsMainEvent?: ?Array<ObjectInfo>,
  visible: boolean,
  affectedThingSubEventOnChange: Function,
  viewMode?: ?boolean
};

export default function SingleObjectSelection(p: Props) {
  if (p.visible) {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Velg</th>
            <th>Museumsnr</th>
          </tr>
        </thead>
        <tbody>
          {p.affectedThingsWithDetailsMainEvent &&
            p.affectedThingsWithDetailsMainEvent.map((o: ObjectInfo, i: number) => (
              <tr key={`singelObjectID-${i}`}>
                <td>
                  <input
                    type="radio"
                    name="optradio"
                    onClick={() => {
                      if (o.uuid) {
                        p.affectedThingSubEventOnChange(o.uuid);
                      }
                    }}
                  />
                </td>
                <td>{o.museumNo}</td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  }
  return <div />;
}

import { assert, React, ReactTestUtils } from '../../../../../test/setup';
import MusitModalHistory from '..';

describe('MusitModalHistory', () => {
  let inputComponent;

  const setup = () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
        <MusitModalHistory
            show={Boolean(true)}
            onHide={(key) => key}
            onClose={(key) => key}
            headerText="Hi"
            translate={(key) => key}
            moves={[
              { doneBy: 'Kjell Kjellstad',
                doneDate: '23.12.2001',
                name: 'Arne And',
                from: { path: 'NHM/3etg/Rom 3/Skap 4/Skuff 4/Eske 3' },
                to: { path: 'NHM/3etg/Rom 3/Skap 2/Skuff 1/Eske 8' }
              },
              { doneBy: 'Bjørn Bjørnsen',
                doneDate: '21.12.2005',
                name: 'Arne And',
                from: { path: 'NHM/1 etg/Rom 4/Skap 14/Skuff 1/Eske 10' },
                to: { path: 'NHM/3 etg/Rom 1/Skap 6/Skuff 4/Eske 18/Boks 3/Mappe 3' }
              },
              { doneBy: 'Jan Pettersen',
                doneDate: '12.01.2015',
                name: 'Arne And',
                from: { path: 'KHM/1 etg/Rom 4/Skap 4/Skuff 1/Eske 10' },
                to: { path: 'NHM/3 etg/Rom 1/Skap 6/Skuff 4/Eske 18/Boks 3/Mappe 3' }
              },
              { doneBy: 'Kjell Kjellstad',
                doneDate: '23.12.2001',
                name: 'Arne And',
                from: { path: 'NHM/3etg/Rom 3/Skap 4/Skuff 4/Eske 3' },
                to: { path: 'NHM/3etg/Rom 3/Skap 2/Skuff 1/Eske 8' }
              },
              { doneBy: 'Bjørn Bjørnsen',
                doneDate: '21.12.2005',
                name: 'Arne And',
                from: { path: 'NHM/1 etg/Rom 4/Skap 14/Skuff 1/Eske 10' },
                to: { path: 'NHM/3 etg/Rom 1/Skap 6/Skuff 4/Eske 18/Boks 3/Mappe 3' }
              },
              { doneBy: 'Jan Pettersen',
                doneDate: '12.01.2015',
                name: 'Arne And',
                from: { path: 'KHM/1 etg/Rom 4/Skap 4/Skuff 1/Eske 10' },
                to: { path: 'NHM/3 etg/Rom 1/Skap 6/Skuff 4/Eske 18/Boks 3/Mappe 3' }
              },
              { doneBy: 'Bjørn Bjørnsen',
                doneDate: '21.12.2005',
                name: 'Arne And',
                from: { path: 'NHM/1 etg/Rom 4/Skap 14/Skuff 1/Eske 10' },
                to: { path: 'NHM/3 etg/Rom 1/Skap 6/Skuff 4/Eske 18/Boks 3/Mappe 3' }
              },
              { doneBy: 'Kjell Kjellstad',
                doneDate: '23.12.2001',
                name: 'Arne And',
                from: { path: 'NHM/3etg/Rom 3/Skap 4/Skuff 4/Eske 3' },
                to: { path: 'NHM/3etg/Rom 3/Skap 2/Skuff 1/Eske 8' }
              },
              { doneBy: 'Bjørn Bjørnsen',
                doneDate: '21.12.2005',
                name: 'Arne And',
                from: { path: 'NHM/1 etg/Rom 4/Skap 14/Skuff 1/Eske 10' },
                to: { path: 'NHM/3 etg/Rom 1/Skap 6/Skuff 4/Eske 18/Boks 3/Mappe 3' }
              }
            ]
            }
        />
    );
    inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'div');
  };

  it('Check the div', () => {
    setup();
    assert(inputComponent[0].innerHTML === '<!-- react-empty: 2 -->')
  })
});

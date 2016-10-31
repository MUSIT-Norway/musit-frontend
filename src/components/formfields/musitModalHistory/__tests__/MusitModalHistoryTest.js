/**
 * Created by steinaol on 24.10.16.
 */

import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json';
import React from 'react'
import MusitModalHistory from '../index';

describe('MusitModalHistory', () => {
    const testData =
        [
            {
                doneBy: 'Kjell Kjellstad',
                doneDate: '23.12.2001',
                name: 'Arne And',
                from: { path: 'NHM/3etg/Rom 3/Skap 4/Skuff 4/Eske 3' },
                to: { path: 'NHM/3etg/Rom 3/Skap 2/Skuff 1/Eske 8' }
            },
            {
                doneBy: 'Bjørn Bjørnsen',
                doneDate: '21.12.2005',
                name: 'Arne And',
                from: { path: 'NHM/1 etg/Rom 4/Skap 14/Skuff 1/Eske 10' },
                to: { path: 'NHM/3 etg/Rom 1/Skap 6/Skuff 4/Eske 18/Boks 3/Mappe 3' }
            },
            {
                doneBy: 'Jan Pettersen',
                doneDate: '12.01.2015',
                name: 'Arne And',
                from: { path: 'KHM/1 etg/Rom 4/Skap 4/Skuff 1/Eske 10' },
                to: { path: 'NHM/3 etg/Rom 1/Skap 6/Skuff 4/Eske 18/Boks 3/Mappe 3' }
            },
            {
                doneBy: 'Kjell Kjellstad',
                doneDate: '23.12.2001',
                name: 'Arne And',
                from: { path: 'NHM/3etg/Rom 3/Skap 4/Skuff 4/Eske 3' },
                to: { path: 'NHM/3etg/Rom 3/Skap 2/Skuff 1/Eske 8' }
            },
            {
                doneBy: 'Bjørn Bjørnsen',
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

    const object={
        id: 1,
        museumNo: 'TRH/V/233',
        subNo: '0',
        term: 'Carex saxatilis'
    }
    it('should display object 1', () => {
        const wrapper = shallow(
            <MusitModalHistory
                moves={testData}
                show
                headerText="Flyttehistorikk"
                onClose={() => true}
                onHide={() => true}
                object={object}
                translate={() => true }
            />
        )
        expect(shallowToJson(wrapper)).toMatchSnapshot()
    })
})

﻿import * as React from 'react';
import CollapseComponent from '../components/Collapse';
//import PageBodyComponent from '../places/PageBodyComponent';
import { 
    AdmPlace,
    PlaceProps

}
from './CollectionEventsComponent';

    export const coordinateTypes = ['MGRS', 'Lat / Long', 'UTM'];
    export const datumValues = ['WGS84', 'ED50', 'EUREF-89'];
    export const geometryTypes = ['Point', 'Reactangle', 'Polygone', 'Line'];
    export const coordinateSources = ['Original label', 'GPS', 'Map', 'Other (see note)'];
    export const altDepthUnits = ['Meters', 'Feet'];
    
    const PlaceComponent = (
        props: PlaceProps
    ) => {
    const headerRead = () => (
    <div>
    <h3>Place</h3>
    </div>
    );
    
    const pageBodyComp = (
    <div>
    {/* <PageBodyComponent {...props} /> */}
    </div>
    );
    
    return (
    <div className="container-fluid">
    <form style={{ padding: '20px' }}>
    <div className="row form-group">
    <div className="col-md-8">
    <div className="row">
    <CollapseComponent Head={headerRead()} Body={pageBodyComp} />
    </div>
    </div>
    </div>
    </form>
    </div>
    );
    }
    
    export default PlaceComponent
    
    
    
    
    
    
//@flow
import React from 'react';

type AdmPlace = {
  admPlaceId?: number,
  name?: string,
  type?: string,
  overordnet?: string,
  kommune?: string,
  fylke?: string,
  land?: string
};

type Coordinate = {
  coordinateSource?: string,
  coordinateType?: string,
  coordinateGeomertry?: string,
  coordinatePrecision?: number,
  caAltitude?: boolean,
  gpsAccuracy?: number,
  datum?: string,
  utmZone?: number,
  mgrsBand?: string,
  utmNorthSouth?: string,
  coordinateString?: string,
  caCoordinate?: boolean,
  coordinateAddedLater?: boolean,
  coordinateNote?: string,
  altitudeLow?: number,
  altitudeHigh?: number,
  altitudeAggregated?: string,
  altitudeUnit?: string,
  depthLow?: number,
  depthAggregated?: string,
  depthHigh?: number,
  depthUnit?: string
};

export type PlaceState = {
  admPlace: AdmPlace,
  coordinate: Coordinate,
  locality?: string,
  ecology?: string,
  station?: string,
  sample?: string,
  ship?: string,
  method?: string,
  methodDescription?: string,
  coordinateCollapsed?: boolean,
  altitudeCollapsed?: boolean
};

export type PlaceProps = PlaceState & {
  onChangeTextField: (fieldName: string) => (value: string) => void,
  onChangeNumberField: (fieldName: string) => (value: number) => void
};

export type CoordinateProps = Coordinate & {
  onChangeCoordinateNumber: (fieldName: string) => (value: number) => void,
  onChangeCoordinateText: (fieldName: string) => (value: string) => void
};

const admPlaces: Array<AdmPlace> = [
  {
    admPlaceId: 1,
    name: 'Oslo',
    type: 'Kommune',
    overordnet: 'Oslo fylke',
    kommune: 'Oslo',
    fylke: 'Oslo fylke',
    land: 'Norge'
  },
  {
    admPlaceId: 2,
    name: 'Bergen',
    type: 'Kommune',
    overordnet: 'Hordaland',
    kommune: 'Bergen',
    fylke: 'Hordaland',
    land: 'Norge'
  },
  {
    admPlaceId: 3,
    name: 'Trondheim',
    type: 'Kommune',
    overordnet: 'Trøndelag',
    kommune: 'Trondheim',
    fylke: 'Trøndelag',
    land: 'Norge'
  },
  {
    admPlaceId: 4,
    name: 'Kristiansand',
    type: 'Kommune',
    overordnet: 'Aust-Agder',
    kommune: 'Kristiansand',
    fylke: 'Aust-Agder',
    land: 'Norge'
  },
  {
    admPlaceId: 5,
    name: 'Drammen',
    type: 'Kommune',
    overordnet: 'Buskerud',
    kommune: 'Drammen',
    fylke: 'Buskerud',
    land: 'Norge'
  }
];
const coordinateTypes = ['MGRS', 'Lat/Long', 'UTM'];
const datumValues = ['WGS84', 'ED50', 'EUREF-89'];

const geometryTypes = ['Point', 'Reactangle', 'Polygone', 'Line'];
const coordinateSources = ['Original label', 'GPS', 'Map', 'Other'];
const altDepthUnits = ['Meters', 'Feet'];

const UTMCoordinateComponent = (props: CoordinateProps) => {
  return (
    <div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="coordinateType">Coordinate type </label>
          <select
            className="form-control"
            value={props.coordinateType}
            id="coordinateType"
            onChange={e => {
              props.onChangeCoordinateText('coordinateType')(e.target.value);
            }}
          >
            {coordinateTypes.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label htmlFor="datum">Datum </label>
          <select
            className="form-control"
            value={props.datum}
            id="datum"
            onChange={e => {
              props.onChangeCoordinateText('datum')(e.target.value);
            }}
          >
            {datumValues.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="coordinateGeomertry">Coordinate geometry </label>
          <select
            className="form-control"
            id="coordinateGeomertry"
            onChange={e => {
              props.onChangeCoordinateText('coordinateGeomertry')(e.target.value);
            }}
          >
            value={props.coordinateGeomertry}
            {geometryTypes.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label htmlFor="zone">Zone </label>
          <input type="text" className="form-control" id="zone" value={props.utmZone} />
        </div>
        <div className="col-md-2">
          <label htmlFor="utmNorthSouth">North/South </label>
          <input
            type="text"
            className="form-control"
            id="utmNorthSouth"
            value={props.utmNorthSouth}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-7">
          <label htmlFor="UTMCoordinateString">UTM-Coordinate </label>
          <input
            type="text"
            className="form-control"
            id="UTMCoordinateString"
            value={props.coordinateString}
          />
        </div>
      </div>
    </div>
  );
};

const LatLongComponent = (props: CoordinateProps) => {
  return (
    <div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="coordinateType">Coordinate type </label>
          <select
            className="form-control"
            id="coordinateType"
            value={props.coordinateType}
            onChange={e => {
              props.onChangeCoordinateText('coordinateType')(e.target.value);
            }}
          >
            {coordinateTypes.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label htmlFor="datum">Datum </label>
          <select
            className="form-control"
            value={props.datum}
            id="datum"
            onChange={e => {
              props.onChangeCoordinateText('datum')(e.target.value);
            }}
          >
            {datumValues.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="coordinateGeomertry">Coordinate geometry </label>
          <select
            className="form-control"
            id="coordinateGeomertry"
            onChange={e => {
              props.onChangeCoordinateText('coordinateGeomertry')(e.target.value);
            }}
          >
            value={props.coordinateGeomertry}
            {geometryTypes.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-7">
          <label htmlFor="latLongCoordinateString">Lat/Long-Coordinate </label>
          <input
            type="text"
            className="form-control"
            id="latLongCoordinateString"
            value={props.coordinateString}
          />
        </div>
      </div>
    </div>
  );
};

const MGRSComponent = (props: CoordinateProps) => {
  return (
    <div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="coordinateType">Coordinate type </label>
          <select
            className="form-control"
            id="coordinateType"
            value={props.coordinateType}
            onChange={e => {
              props.onChangeCoordinateText('coordinateType')(e.target.value);
            }}
          >
            {coordinateTypes.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label htmlFor="datum">Datum </label>
          <select
            className="form-control"
            value={props.datum}
            id="datum"
            onChange={e => {
              props.onChangeCoordinateText('datum')(e.target.value);
            }}
          >
            {datumValues.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="coordinateGeomertry">Coordinate geometry </label>
          <select
            className="form-control"
            id="coordinateGeomertry"
            value={props.coordinateGeomertry}
            onChange={e => {
              props.onChangeCoordinateText('coordinateGeomertry')(e.target.value);
            }}
          >
            {geometryTypes.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label htmlFor="zone">Zone </label>
          <input type="text" className="form-control" id="zone" value={props.utmZone} />
        </div>
        <div className="col-md-2">
          <label htmlFor="mgrsBand">Band </label>
          <input
            type="text"
            className="form-control"
            id="mgrsBand"
            value={props.mgrsBand}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-7">
          <label htmlFor="MGRSCoordinateString">MGRS-Coordinate </label>
          <input
            type="text"
            className="form-control"
            id="MGRSCoordinateString"
            value={props.coordinateString}
          />
        </div>
      </div>
    </div>
  );
};

const AltitudeDepthData = (props: CoordinateProps) => (
  <div>
    <div className="row">
      <div className="col-md-3 form-group">
        <label htmlFor="altitude">Altitude</label>
        <input
          className="form-control"
          type="text"
          value={props.altitudeAggregated}
          id="altitude"
        />
      </div>
      <div className="col-md-2 form-group">
        <label htmlFor="altitudeUnit">Unit </label>
        <select
          className="form-control"
          id="altitudeUnit"
          onChange={e => {
            props.onChangeCoordinateText('altitudeUnit')(e.target.value);
          }}
        >
          value={props.altitudeUnit}
          {altDepthUnits.map((type: string, i: number) => (
            <option key={`optionRow_${i}`}>{type}</option>
          ))}
        </select>
      </div>
      <div className="col-md-3 form-group">
        <label htmlFor="depth">Depth</label>
        <input
          className="form-control"
          type="text"
          value={props.depthAggregated}
          id="depthLow"
        />
      </div>

      <div className="col-md-2 form-group">
        <label htmlFor="depthUnit">Unit </label>
        <select
          className="form-control"
          id="depthUnit"
          value={props.depthUnit}
          onChange={e => {
            props.onChangeCoordinateText('depthUnit')(e.target.value);
          }}
        >
          {altDepthUnits.map((type: string, i: number) => (
            <option key={`optionRow_${i}`}>{type}</option>
          ))}
        </select>
      </div>
      <div className="col-md-1 form-group">
        <div className="checkbox" id="caDepth">
          <label>
            <input type="checkbox" value={props.caAltitude} /> Ca depth
          </label>
        </div>
      </div>

      <div className="col-md-4">
        <label htmlFor="note">Note</label>
        <textarea className="form-control" value={props.coordinateNote} id="note" />
      </div>
    </div>
  </div>
);

const CoordinateMetaData = (props: CoordinateProps) => {
  return (
    <div className="form-group">
      <div className="row">
        <div className="col-md-3">
          <label htmlFor="coordinateSource">Coordinate source </label>
          <select
            className="form-control"
            id="coordinateSource"
            onChange={e => {
              props.onChangeCoordinateText('coordinateSource')(e.target.value);
            }}
          >
            value={props.coordinateSource}
            {coordinateSources.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2 form-group">
          <div className="checkbox" id="coordinateAddedLater">
            <label>
              <input type="checkbox" value={props.coordinateAddedLater} /> Added later{' '}
            </label>
          </div>
          <div className="checkbox" id="coordinateAddedLater">
            <label>
              <input type="checkbox" value={props.caCoordinate} /> Ca coordinate
            </label>
          </div>
        </div>
        <div className="col-md-2">
          <label htmlFor="precision">Precision</label>
          <input
            className="form-control"
            type="text"
            value={props.coordinatePrecision}
            id="precision"
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="accuracy">GPS-accuracy</label>
          <input
            className="form-control"
            type="text"
            value={props.gpsAccuracy}
            id="accuracy"
          />
        </div>
      </div>
    </div>
  );
};

const CoordinateHeader = (props: CoordinateProps) => {
  switch (props.coordinateType) {
    case 'UTM': {
      return <UTMCoordinateComponent {...props} />;
    }
    case 'MGRS': {
      return <MGRSComponent {...props} />;
    }
    case 'Lat/Long': {
      return <LatLongComponent {...props} />;
    }
    default: {
      return <div />;
    }
  }
};

const AltitudeHeader = (props: CoordinateProps) => {};

const CoordinateComponent = (props: CoordinateProps) => {
  return (
    <div>
      <CoordinateMetaData {...props} />
      <AltitudeDepthData {...props} />
    </div>
  );
};

const AdmPlaceComponent = (props: AdmPlace) => (
  <div className="well">
    <div className="row form-group">
      <div className="col-md-12">
        <label htmlFor="admPlaceName">Adm place </label>
        <select className="form-control" id="admPlaceName">
          {admPlaces.map((a: AdmPlace) => (
            <option key={`optionRow_${a.admPlaceId || 0}`}>{`${a.name ||
              ''} Type: ${a.type || ''} (${a.kommune ? a.kommune + ':' : ''} ${a.fylke
              ? a.fylke + ':'
              : ''} : ${a.land ? a.land : ''})`}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="row form-group">
      <div className="col-md-6">
        <label htmlFor="locality">Lokalitet </label>
        <textarea className="form-control" id="locality" value={props.kommune} />
      </div>
      <div className="col-md-6">
        <label htmlFor="ecology">Økologi </label>
        <textarea className="form-control" id="ecology" value={props.kommune} />
      </div>
    </div>
    <div className="row form-group">
      <div className="col-md-4">
        <label htmlFor="admPlaceKommune">Kommune </label>
        <input
          type="text"
          readOnly
          className="form-control"
          id="admPlaceKommune"
          value={props.kommune}
        />
      </div>
      <div className="col-md-4">
        <label htmlFor="admPlaceFylke">Fylke </label>
        <input
          type="text"
          readOnly
          className="form-control"
          id="admPlaceFylke"
          value={props.fylke}
        />
      </div>
      <div className="col-md-4">
        <label htmlFor="admPlaceLand">Land </label>
        <input
          type="text"
          readOnly
          className="form-control"
          id="admPlaceLand"
          value={props.land}
        />
      </div>
    </div>
  </div>
);

export default class PlaceComponent extends React.Component<PlaceProps, PlaceState> {
  constructor(props: PlaceProps) {
    super(props);
    this.state = {
      coordinate: {},
      admPlace: {},
      coordinateCollapsed: true
    };
  }

  render() {
    return (
      <form style={{ padding: '20px' }}>
        <div className="row form-group">
          <div className="col-md-4">
            <AdmPlaceComponent {...this.state.admPlace} />
          </div>
          <div className="col-md-8">
            <div className="panel-group">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <CoordinateHeader
                    {...this.state.coordinate}
                    coordinateType={this.state.coordinate.coordinateType || 'MGRS'}
                    onChangeCoordinateNumber={(fieldName: string) => (value: number) => {
                      this.setState((ps: PlaceState) => {
                        return {
                          ...ps,
                          coordinate: { ...ps.coordinate, [fieldName]: value }
                        };
                      });
                    }}
                    onChangeCoordinateText={(fieldName: string) => (value: string) => {
                      this.setState((ps: PlaceState) => {
                        return {
                          ...ps,
                          coordinate: { ...ps.coordinate, [fieldName]: value }
                        };
                      });
                    }}
                  />
                  <button
                    className="btn btn-default"
                    onClick={e => {
                      e.preventDefault();
                      this.setState(ps => ({
                        ...ps,
                        coordinateCollapsed: ps.coordinateCollapsed ? false : true
                      }));
                    }}
                  >
                    {this.state.coordinateCollapsed ? 'Show details' : 'Hide details'}
                  </button>
                </div>
                <div
                  id="collapse1"
                  className={`panel-collapse${this.state.coordinateCollapsed
                    ? ' collapse'
                    : ''}`}
                >
                  <div className="panel-body">
                    <div>
                      <CoordinateComponent
                        {...this.state.coordinate}
                        coordinateType={this.state.coordinate.coordinateType || 'MGRS'}
                        onChangeCoordinateNumber={(fieldName: string) => (
                          value: number
                        ) => {
                          this.setState((ps: PlaceState) => {
                            return {
                              ...ps,
                              coordinate: {
                                ...ps.coordinate,
                                [fieldName]: value
                              }
                            };
                          });
                        }}
                        onChangeCoordinateText={(fieldName: string) => (
                          value: string
                        ) => {
                          this.setState((ps: PlaceState) => {
                            return {
                              ...ps,
                              coordinate: {
                                ...ps.coordinate,
                                [fieldName]: value
                              }
                            };
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

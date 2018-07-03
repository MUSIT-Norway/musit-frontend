//@flow
import * as React from 'react';
import { isNull, isUndefined, compact } from 'lodash';
import { Row, Col } from 'react-bootstrap';
import { I18n } from 'react-i18nify';

import {
  ObjectData,
  ArkCoordinate,
  ArkMaterial,
  EtnoMaterial,
  ArkLocation,
  EtnoLocation,
  NatLocation
} from '../../../types/object';
import './ViewObjectData.css';
import { NamedPathElement } from '../../../types/object';
import { Maybe, MUSTFIX, TODO } from '../../../types/common';

/*Many of the props below originally had the Flow "maybe" type, but they are used in situations which require value | undefined (not null),
so I've removed null as an acceptable value for many of these
Like subNo, natGender, natState, natLegData, arkForm, arkFindingNo, materials

*/

type ViewNatHistComponentProps = {
  museumNo: string;
  subNo?: string;
  term: string;
  natGender?: string;
  natStage?: string;
  natLegDate?: string;
  currentLocation?: { pathNames: Maybe<Array<NamedPathElement>> };
  locations?: Array<NatLocation> | null;
};

type ViewNatNumisComponentProps = {
  museumNo: string;
  subNo?: string;
  term: string;
  currentLocation?: { pathNames: Maybe<Array<NamedPathElement>> };
};

type ViewArcheologyComponentProps = {
  museumNo: string;
  subNo?: string;
  term: string;
  arkForm?: string;
  arkFindingNo?: string;
  locations?: Array<ArkLocation> | null;
  materials?: Array<ArkMaterial>;
  currentLocation?: { pathNames: Maybe<Array<NamedPathElement>> };
  coordinates?: ArkCoordinate[] | null;
};

type ViewEntographyComponentProps = {
  museumNo: string;
  subNo?: string;
  term: string;
  currentLocation?: { pathNames: Maybe<Array<NamedPathElement>> };
  locations?: Array<EtnoLocation> | null;
  materials?: Array<EtnoMaterial>;
};

type ViewObjectDataProps = {
  objectData: ObjectData;
};

const isNatHistCollection = (collection: Maybe<number>): boolean =>
  [4, 5, 6, 7, 8, 9].some(x => x === collection);
const isArcheologyCollection = (collection: Maybe<number>): boolean => 1 === collection;
const isEtnographyHistCollection = (collection: Maybe<number>): boolean =>
  2 === collection;
const isNumismaticCollection = (collection: Maybe<number>): boolean => 3 === collection;

const getCommaSeparatedStringFromObj = (obj: any) =>
  compact(Object.values(obj)).join(', ');

const writeArkMaterials = (materials: Array<ArkMaterial>) =>
  materials
    .map((m: ArkMaterial) => `${m.material}${m.spesMaterial ? `/${m.spesMaterial}` : ''}`)
    .join(', ');

const currentMagasinLocation = (pathNames: Maybe<Array<NamedPathElement>>) =>
  pathNames
    ? pathNames.reduce(
        (akk: string, o: any, ind: number) =>
          ind === 0 ? `(${o.name})` : `${akk}/${o.name}`,
        ''
      )
    : '';

const writeEtnoMaterials = (materials: Array<EtnoMaterial>) =>
  materials
    .filter((m: EtnoMaterial) => m.material !== '')
    .map(
      (m: EtnoMaterial) => `${m.material}${
        m.materialType && m.materialType !== '' ? m.materialType : ''
      }
    ${m.materialElement && m.materialElement !== '' ? ` ${m.materialElement}` : ''}`
    )
    .join(', ');

const writeArkLocations = (locations: Array<ArkLocation>) => {
  return locations.map((l: ArkLocation, i: number) => (
    <Row key={`${i}-ID`}>
      <Col>{getCommaSeparatedStringFromObj(l)}</Col>
    </Row>
  ));
};

const writeEtnoLocations = (locations: Array<EtnoLocation>) => {
  return locations.map((l: EtnoLocation, i: number) => (
    <Row key={`${i}-ID`}>
      <Col>{getCommaSeparatedStringFromObj(l)}</Col>
    </Row>
  ));
};

const LabeledDataCol = (props: {
  md: number;
  label: string;
  value: string | undefined;
}) => (
  <Col md={props.md}>
    <span className="ViewObjectData_text-overflow">
      <b>{I18n.t(props.label)}:</b> <span title={props.value}>{props.value}</span>
    </span>
  </Col>
);

const arrayWithValues = (arr: Array<any>) =>
  arr.filter(e => !(isUndefined(e) || isNull(e)));

const viewNatHistObject = ({
  museumNo,
  subNo,
  term,
  natGender,
  natStage,
  natLegDate,
  locations,
  currentLocation
}: ViewNatHistComponentProps) => {
  const country = locations && locations[0] && locations[0].natCountry;
  const stateProvince = locations && locations[0] && locations[0].natStateProv;
  const municipality = locations && locations[0] && locations[0].natMunicipality;
  const coordinate = locations && locations[0] && locations[0].natCoordinate;
  const locality = locations && locations[0] && locations[0].natLocality;
  const place = arrayWithValues([country, stateProvince, municipality, locality]).join(
    ': '
  );
  return (
    <div className="Nathist" style={{ marginTop: '30px', marginBottom: '40px' }}>
      <Row>
        <LabeledDataCol md={3} label="musit.objects.objectsView.musNo" value={museumNo} />
        <LabeledDataCol md={3} label="musit.objects.objectsView.subNo" value={subNo} />
        <LabeledDataCol md={6} label="musit.objects.objectsView.termTaxon" value={term} />
      </Row>
      <Row>
        <LabeledDataCol
          md={6}
          label="musit.objects.objectsView.gender"
          value={natGender}
        />
        <LabeledDataCol md={6} label="musit.objects.objectsView.stage" value={natStage} />
      </Row>
      <Row>
        <LabeledDataCol
          md={6}
          label="musit.objects.objectsView.collectionDate"
          value={natLegDate}
        />
        <LabeledDataCol md={6} label="musit.objects.objectsView.place" value={place} />
      </Row>
      <Row>
        <LabeledDataCol
          md={12}
          label="musit.objects.objectsView.coordinate"
          value={coordinate as MUSTFIX}
        />
      </Row>
      <Row>
        <LabeledDataCol
          md={12}
          label="musit.objects.objectsView.location"
          value={
            currentLocation && currentLocation.pathNames
              ? currentMagasinLocation(currentLocation.pathNames)
              : ''
          }
        />
      </Row>
    </div>
  );
};

const viewNumisObject = ({ museumNo, subNo, term }: ViewNatNumisComponentProps) => (
  <div className="numis" style={{ marginTop: '30px', marginBottom: '40px' }}>
    <Row>
      <LabeledDataCol
        md={3}
        label="musit.objects.objectsView.museumNo"
        value={museumNo}
      />
      <LabeledDataCol md={3} label="musit.objects.objectsView.subNo" value={subNo} />
      <LabeledDataCol md={6} label="musit.objects.objectsView.item" value={term} />
    </Row>
  </div>
);

const viewArcheologyObject = ({
  museumNo,
  subNo,
  term,
  arkForm,
  arkFindingNo,
  locations,
  materials,
  coordinates,
  currentLocation
}: ViewArcheologyComponentProps) => (
  <div className="Ark" style={{ marginTop: '30px', marginBottom: '40px' }}>
    <Row>
      <LabeledDataCol
        md={3}
        label="musit.objects.objectsView.museumNo"
        value={museumNo}
      />
      <LabeledDataCol md={3} label="musit.objects.objectsView.subNo" value={subNo} />
      <LabeledDataCol md={6} label="musit.objects.objectsView.termItem" value={term} />
    </Row>
    <Row>
      <LabeledDataCol md={3} label="musit.objects.objectsView.arkForm" value={arkForm} />
      <LabeledDataCol
        md={3}
        label="musit.objects.objectsView.collectingNumber"
        value={arkFindingNo}
      />
    </Row>
    <Row>
      <LabeledDataCol
        md={12}
        label="musit.objects.objectsView.material"
        value={materials && writeArkMaterials(materials)}
      />
    </Row>
    <Row>
      <Col md={1}>
        <b>{I18n.t('musit.objects.objectsView.findingPlace')}:</b>
      </Col>
      <Col md={5}>{locations && writeArkLocations(locations)}</Col>
      <Col md={1}>
        <b>{I18n.t('musit.objects.objectsView.coordinate')}: </b>
      </Col>
      <Col md={5}>
        {coordinates &&
          coordinates.map((c: ArkCoordinate, i: number) => (
            <Row key={`${i}-ID`}>{`${c.north ? c.north : ''} ${
              c.east ? c.east : ''
            }`}</Row>
          ))}
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <b>{I18n.t('musit.objects.objectsView.location')}: </b>
        {currentLocation && currentLocation.pathNames
          ? currentMagasinLocation(currentLocation.pathNames)
          : ''}
      </Col>
    </Row>
  </div>
);

const viewEtnographyObject = ({
  museumNo,
  subNo,
  term,
  locations,
  materials,
  currentLocation
}: ViewEntographyComponentProps) => (
  <div className="Ento" style={{ marginTop: '30px', marginBottom: '40px' }}>
    <Row>
      <LabeledDataCol md={3} label="musit.objects.objectsView.musNo" value={museumNo} />
      <LabeledDataCol md={3} label="musit.objects.objectsView.subNo" value={subNo} />
      <LabeledDataCol md={6} label="musit.objects.objectsView.termItem" value={term} />
    </Row>
    <Row>
      <LabeledDataCol
        md={12}
        label="musit.objects.objectsView.material"
        value={materials && writeEtnoMaterials(materials)}
      />
    </Row>
    <Row>
      <Col md={1}>
        <b>{I18n.t('musit.objects.objectsView.findingPlace')}:</b>
      </Col>
      <Col md={11}>{locations && writeEtnoLocations(locations)}</Col>
    </Row>
    <Row>
      <LabeledDataCol
        md={12}
        label="musit.objects.objectsView.location"
        value={
          currentLocation && currentLocation.pathNames
            ? currentMagasinLocation(currentLocation.pathNames)
            : ''
        }
      />
    </Row>
  </div>
);

export const ViewObjectData = (props: ViewObjectDataProps) => {
  const objectData = props.objectData;
  if (!objectData) {
    return <div className="loading" />;
  }
  if (isArcheologyCollection(objectData.collection)) {
    return viewArcheologyObject(objectData as TODO);
  } else if (isEtnographyHistCollection(objectData.collection)) {
    return viewEtnographyObject(objectData as TODO);
  } else if (isNatHistCollection(objectData.collection)) {
    return viewNatHistObject(objectData as TODO);
  } else if (isNumismaticCollection(objectData.collection)) {
    return viewNumisObject(objectData as TODO);
  } else {
    const pathNames: Maybe<Array<NamedPathElement>> =
      props.objectData.currentLocation && props.objectData.currentLocation.pathNames;
    return (
      <div className="unknown">
        Unknown objecttype {objectData.museumNo}
        <br />
        <Row>
          <LabeledDataCol
            md={12}
            label="musit.objects.objectsView.location"
            value={currentMagasinLocation(pathNames)}
          />
        </Row>
      </div>
    );
  }
};
export default ViewObjectData;

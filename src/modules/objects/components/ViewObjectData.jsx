//@flow
import React from 'react';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import { Row, Col } from 'react-bootstrap';
import { I18n } from 'react-i18nify';
import compact from 'lodash/compact';
import type {
  ObjectData,
  ArkCoordinate,
  ArkMaterial,
  EtnoMaterial,
  ArkLocation,
  EtnoLocation,
  NatLocation
} from '../../../types/object';
import './ViewObjectData.css';

type PathNamesProps = Array<{
  name: string,
  nodeId: number,
  nodeUuid: string
}>;

type ViewNatHistComponentProps = {
  museumNo: string,
  subNo: string,
  term: string,
  natGender: ?string,
  natStage: ?string,
  natLegDate: ?string,
  currentLocation: { pathNames: PathNamesProps },
  locations: ?Array<NatLocation>
};

type ViewNatNumisComponentProps = {
  museumNo: string,
  subNo: string,
  term: string,
  currentLocation: { pathNames: PathNamesProps }
};

type ViewArcheologyComponentProps = {
  museumNo: string,
  subNo: string,
  term: string,
  arkForm: ?string,
  arkFindingNo: ?string,
  locations: ?Array<ArkLocation>,
  materials: ?Array<ArkMaterial>,
  currentLocation: { pathNames: PathNamesProps },
  coordinates: ?Array<ArkCoordinate>
};

type ViewEntographyComponentProps = {
  museumNo: string,
  subNo: string,
  term: string,
  currentLocation: { pathNames: PathNamesProps },
  locations: ?Array<EtnoLocation>,
  materials: ?Array<EtnoMaterial>
};

type ViewObjectDataProps = {
  objectData: ObjectData
};

const isNatHistCollection = (collection: number): boolean =>
  [4, 5, 6, 7, 8, 9].some(x => x === collection);
const isArcheologyCollection = (collection: number): boolean => 1 === collection;
const isEtnographyHistCollection = (collection: number): boolean => 2 === collection;
const isNumismaticCollection = (collection: number): boolean => 3 === collection;

const getCommaSeparatedStringFromObj = (obj: any) =>
  compact(Object.values(obj)).join(', ');

const writeArkMaterials = (materials: Array<ArkMaterial>) =>
  materials
    .map((m: ArkMaterial) => `${m.material}${m.spesMaterial ? `/${m.spesMaterial}` : ''}`)
    .join(', ');

const CurrentMagasinLocation = (pathNames: PathNamesProps) =>
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
      (
        m: EtnoMaterial
      ) => `${m.material}${m.materialType && m.materialType !== '' ? m.materialType : ''}
    ${m.materialElement && m.materialElement !== '' ? ` ${m.materialElement}` : ''}`
    )
    .join(', ');

const writeArkLocations = (locations: Array<ArkLocation>) => {
  return locations.map((l: ArkLocation, i: number) => (
    <Row key={`${i}-ID`}>
      <Col>
        {getCommaSeparatedStringFromObj(l)}
      </Col>
    </Row>
  ));
};

const writeEtnoLocations = (locations: Array<EtnoLocation>) => {
  return locations.map((l: EtnoLocation, i: number) => (
    <Row key={`${i}-ID`}>
      <Col>
        {getCommaSeparatedStringFromObj(l)}
      </Col>
    </Row>
  ));
};

const LabeledDataCol = (props: { md: number, label: string, value: ?string }) => (
  <Col md={props.md}>
    <span className="ViewObjectData_text-overflow">
      <b>{I18n.t(props.label)}:</b>{' '}<span title={props.value}>{props.value}</span>
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
  currentLocation: { pathNames }
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
          value={coordinate}
        />
      </Row>
      <Row>
        <LabeledDataCol
          md={12}
          label="musit.objects.objectsView.location"
          value={CurrentMagasinLocation(pathNames)}
        />
      </Row>
    </div>
  );
};

const viewNumisObject = ({ museumNo, subNo, term }: ViewNatNumisComponentProps) => (
  <div className="numis" style={{ marginTop: '30px', marginBottom: '40px' }}>
    <Row>
      <LabeledDataCol
        md={2}
        label="musit.objects.objectsView.museumNo"
        value={museumNo}
      />
      <LabeledDataCol md={2} label="musit.objects.objectsView.subNo" value={subNo} />
      <LabeledDataCol md={3} label="musit.objects.objectsView.item" value={term} />
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
  currentLocation: { pathNames }
}: ViewArcheologyComponentProps) => (
  <div className="Ark" style={{ marginTop: '30px', marginBottom: '40px' }}>
    <Row>
      <LabeledDataCol
        md={2}
        label="musit.objects.objectsView.museumNo"
        value={museumNo}
      />
      <LabeledDataCol md={2} label="musit.objects.objectsView.subNo" value={subNo} />
    </Row>
    <Row>
      <LabeledDataCol md={4} label="musit.objects.objectsView.termItem" value={term} />
      <LabeledDataCol md={4} label="musit.objects.objectsView.arkForm" value={arkForm} />
      <LabeledDataCol
        md={4}
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
      <Col md={3}>
        {locations && writeArkLocations(locations)}
      </Col>
      <Col md={1}><b>{I18n.t('musit.objects.objectsView.coordinate')}:{' '}</b></Col>
      <Col md={3}>
        {coordinates &&
          coordinates.map((c: ArkCoordinate, i: number) => (
            <Row
              key={`${i}-ID`}
            >{`${c.north ? c.north : ''} ${c.east ? c.east : ''}`}</Row>
          ))}
      </Col>
    </Row>
    <Row>
      <Col md={8}>
        <b>{I18n.t('musit.objects.objectsView.location')}:{' '}</b>
        {CurrentMagasinLocation(pathNames)}
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
  currentLocation: { pathNames }
}: ViewEntographyComponentProps) => (
  <div className="Ento" style={{ marginTop: '30px', marginBottom: '40px' }}>
    <Row>
      <LabeledDataCol md={2} label="musit.objects.objectsView.musNo" value={museumNo} />
      <LabeledDataCol md={2} label="musit.objects.objectsView.subNo" value={subNo} />
      <LabeledDataCol md={3} label="musit.objects.objectsView.termItem" value={term} />
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
      <Col md={3}>
        {locations && writeEtnoLocations(locations)}
      </Col>
    </Row>
    <Row>
      <LabeledDataCol
        md={8}
        label="musit.objects.objectsView.location"
        value={CurrentMagasinLocation(pathNames)}
      />
    </Row>
  </div>
);

export const ViewObjectData = (props: ViewObjectDataProps) => {
  const objectData = props.objectData;
  if (isArcheologyCollection(objectData.collection)) {
    return viewArcheologyObject(objectData);
  } else if (isEtnographyHistCollection(objectData.collection)) {
    return viewEtnographyObject(objectData);
  } else if (isNatHistCollection(objectData.collection)) {
    return viewNatHistObject(objectData);
  } else if (isNumismaticCollection(objectData.collection)) {
    return viewNumisObject(objectData);
  } else {
    const pathNames =
      props.objectData &&
      props.objectData.currentLocation &&
      props.objectData.currentLocation.pathNames;
    return (
      <div className="unknown">
        Unknown objecttype {objectData.museumNo}<br />
        <Row>
          <LabeledDataCol
            md={12}
            label="musit.objects.objectsView.location"
            value={CurrentMagasinLocation(pathNames)}
          />
        </Row>
      </div>
    );
  }
};
export default ViewObjectData;

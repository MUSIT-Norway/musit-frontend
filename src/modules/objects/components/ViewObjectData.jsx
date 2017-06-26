//@flow
import React from 'react';
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
  return (
    <div className="Nathist" style={{ marginTop: '30px', marginBottom: '40px' }}>
      <Row>
        <Col md={3}>
          <b>{I18n.t('musit.objects.objectsView.musNo')}:</b>{' '}{museumNo}
        </Col>
        <Col md={3}><b>{I18n.t('musit.objects.objectsView.subNo')}:</b>{' '}{subNo}</Col>
        <Col md={6}>
          <b>{I18n.t('musit.objects.objectsView.termTaxon')}:</b>{' '}{term}
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <b>{I18n.t('musit.objects.objectsView.gender')}:</b>{' '}{natGender}
        </Col>
        <Col md={6}>
          <b>{I18n.t('musit.objects.objectsView.stage')}:</b>{' '}{natStage}
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <b>{I18n.t('musit.objects.objectsView.collectionDate')}:</b>{' '}{natLegDate}
        </Col>
        <Col md={6}>
          <b>{I18n.t('musit.objects.objectsView.place')}:</b>
          {country && `${country}: `}
          {stateProvince && `${stateProvince}: `}
          {municipality && `${municipality}: `}
          {locality}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <b>{I18n.t('musit.objects.objectsView.coordinate')}:</b>{' '}{coordinate}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <b>{I18n.t('musit.objects.objectsView.location')}:{' '}</b>
          {CurrentMagasinLocation(pathNames)}
        </Col>
      </Row>
    </div>
  );
};

const viewNumisObject = ({ museumNo, subNo, term }: ViewNatNumisComponentProps) => (
  <div className="numis" style={{ marginTop: '30px', marginBottom: '40px' }}>
    <Row>
      <Col md={2}>
        <b>{I18n.t('musit.objects.objectsView.museumNo')}:</b>{' '}{museumNo}
      </Col>
      <Col md={2}><b>{I18n.t('musit.objects.objectsView.subNo')}:</b>{' '}{subNo}</Col>
      <Col md={3}><b>{I18n.t('musit.objects.objectsView.item')}:</b>{' '}{term}</Col>
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
      <Col md={2}>
        <b>{I18n.t('musit.objects.objectsView.museumNo')}:</b>{' '}{museumNo}
      </Col>
      <Col md={2}><b>{I18n.t('musit.objects.objectsView.subNo')}:</b>{' '}{subNo}</Col>
    </Row>
    <Row>
      <Col md={4}><b>{I18n.t('musit.objects.objectsView.termItem')}: </b>{' '}{term}</Col>
      <Col md={4}>
        <b>{I18n.t('musit.objects.objectsView.arkForm')}:</b>{' '}{arkForm}
      </Col>
      <Col md={4}>
        <b>{I18n.t('musit.objects.objectsView.collectingNumber')}: </b>{' '}{arkFindingNo}
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <b>{I18n.t('musit.objects.objectsView.material')}:</b>
        {materials && writeArkMaterials(materials)}
      </Col>
    </Row>
    <Row>
      <Col md={1}>
        <b>{I18n.t('musit.objects.objectsView.findingPlace')}:</b>
      </Col>
      <Col md={3}>
        {locations && writeArkLocations(locations)}
      </Col>
      <Col md={1}><b>{I18n.t('musit.objects.objectsView.coordinate')}:{' '}</b></Col><Col
        md={3}
      >
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
      <Col md={2}>
        <b>{I18n.t('musit.objects.objectsView.musNo')}:</b>{' '}{museumNo}
      </Col>
      <Col md={2}><b>{I18n.t('musit.objects.objectsView.subNo')}:</b>{' '}{subNo}</Col>
      <Col md={3}><b>{I18n.t('musit.objects.objectsView.termItem')}:</b>{' '}{term}</Col>
    </Row>
    <Row>
      <Col md={12}>
        <b>{I18n.t('musit.objects.objectsView.material')}:</b>
        {materials && writeEtnoMaterials(materials)}
      </Col>
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
      <Col md={8}>
        <b>{I18n.t('musit.objects.objectsView.location')}:{' '}</b>
        {CurrentMagasinLocation(pathNames)}
      </Col>
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
          <b>{I18n.t('musit.objects.objectsView.location')}:{' '}</b>
          {CurrentMagasinLocation(pathNames)}
        </Row>
      </div>
    );
  }
};
export default ViewObjectData;

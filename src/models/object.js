class MusitObject {
  constructor(props) {
    this.id = props.id;
    this.museumNo = props.museumNo;
    this.term = props.term;
    this.subNo = props.subNo;
    this.mainObjectId = props.mainObjectId;
    this.path = props.path;
    this.pathNames = props.pathNames;
    this.breadcrumb = props.breadcrumb;
    this.currentLocationId = props.currentLocationId;
  }

  isMainObject() {
    return this.id === this.mainObjectId;
  }

  static getObjectDescription(object) {
    let objStr = object.museumNo ? `${object.museumNo}` : '';
    objStr = object.subNo ? `${objStr} - ${object.subNo}` : objStr;
    objStr = object.term ? `${objStr} - ${object.term}` : objStr;
    return objStr;
  }

}

export default MusitObject;
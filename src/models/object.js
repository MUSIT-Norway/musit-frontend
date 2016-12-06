class MusitObject {
  constructor(props) {
    this.id = props.id;
    this.museumNo = props.museumNo;
    this.term = props.term;
    this.subNo = props.subNo;
    this.mainObjectId = props.mainObjectId;
    this.pathNames = props.pathNames;
    this.breadcrumb = props.breadcrumb;
    this.currentLocationId = props.currentLocationId;
  }

  isMainObject() {
    return !this.mainObjectId || this.id === this.mainObjectId;
  }
}

export default MusitObject;
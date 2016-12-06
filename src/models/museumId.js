class MuseumId {
  constructor(museumId: number) {
    this.id = museumId;
  }

  getQuery() {
    return `museumId=${this.id}`;
  }

  getPath() {
    return `museum/${this.id}`;
  }
}

export default MuseumId;
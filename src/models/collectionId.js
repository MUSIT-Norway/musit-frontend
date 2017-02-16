class CollectionId {
  constructor(collectionId: string) {
    this.uuid = collectionId;
  }

  getPath() {
    return `collections/${this.uuid}`;
  }

  getQuery() {
    return `collectionIds=${this.uuid}`;
  }
}

export default CollectionId;
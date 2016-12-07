class CollectionId {
  constructor(collectionId: string) {
    this.uuid = collectionId;
  }

  getQuery() {
    return `collectionIds=${this.uuid}`;
  }
}

export default CollectionId;
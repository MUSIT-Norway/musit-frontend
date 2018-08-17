export const dataBaseValues = [
  { value: 'ORCID', label: 'ORCID', url: 'https://orcid.org/0000-0003-1568-6386' },
  {
    value: 'HUH',
    label: 'HUH',
    url: 'http://kiki.huh.harvard.edu/databases/botanist_search.php?mode=details&id=90595'
  },
  {
    value: 'Scopus',
    label: 'Scopus',
    url: 'https://www.scopus.com/authid/detail.uri?authorId=56380478500'
  }
];

export const collections = [
  {
    collectionId: 1,
    collectionUUID: '2e4f2455-1b3b-4a04-80a1-ba92715ff613',
    collectionName: 'Arkeologi'
  },
  {
    collectionId: 2,
    collectionUUID: '88b35138-24b5-4e62-bae4-de80fae7df82',
    collectionName: 'Etnografi'
  },
  {
    collectionId: 3,
    collectionUUID: '8bbdf9b3-56d1-479a-9509-2ea82842e8f8',
    collectionName: 'Numismatikk'
  },
  {
    collectionId: 4,
    collectionUUID: 'fcb4c598-8b05-4095-ac00-ce66247be38a',
    collectionName: 'Lav'
  },
  {
    collectionId: 5,
    collectionUUID: 'd0dd5ad3-c22f-4ea0-8b52-dc5b0e17aa24',
    collectionName: 'Mose'
  },
  {
    collectionId: 6,
    collectionUUID: '23ca0166-5f9e-44c2-ab0d-b4cdd704af07',
    collectionName: 'Sopp'
  },
  {
    collectionId: 7,
    collectionUUID: '1d8dd4e6-1527-439c-ac86-fc315e0ce852',
    collectionName: 'Alger'
  },
  {
    collectionId: 8,
    collectionUUID: '7352794d-4973-447b-b84e-2635cafe910a',
    collectionName: 'Karplanter'
  },
  {
    collectionId: 9,
    collectionUUID: 'ba3d4d30-810b-4c07-81b3-37751f2196f0',
    collectionName: 'Entomologi'
  },
  {
    collectionId: 10,
    collectionUUID: 'ef4dc066-b6f8-4155-89f8-7aa9aeeb2dc4',
    collectionName: 'Marine evertebrater'
  }
];

export const museum = [
  { museumId: 1, museumName: 'Arkeologisk Museum', abbreviation: 'AM' },
  { museumId: 2, museumName: 'Bergen Universitetsmuseum', abbreviation: 'UM' },
  { museumId: 3, museumName: 'Kulturhistorisk Museum', abbreviation: 'KHM' },
  { museumId: 4, museumName: 'Naturhistorisk Museum', abbreviation: 'NHM' },
  { museumId: 5, museumName: 'NTNU Vitenskapsmuseet', abbreviation: 'VM' },
  { museumId: 6, museumName: 'Tromsø Museum', abbreviation: 'TMU' },
  { museumId: 7, museumName: 'Kristiansand Naturmuseum', abbreviation: 'KMN' }
];

export const museumCollection: { museumId: number; collectionId: number }[] = [
  { museumId: 1, collectionId: 1 },
  { museumId: 1, collectionId: 3 },
  { museumId: 2, collectionId: 1 },
  { museumId: 2, collectionId: 2 },
  { museumId: 2, collectionId: 3 },
  { museumId: 2, collectionId: 4 },
  { museumId: 2, collectionId: 5 },
  { museumId: 2, collectionId: 6 },
  { museumId: 2, collectionId: 7 },
  { museumId: 2, collectionId: 8 },
  { museumId: 2, collectionId: 9 },
  { museumId: 2, collectionId: 10 },
  { museumId: 3, collectionId: 1 },
  { museumId: 3, collectionId: 2 },
  { museumId: 3, collectionId: 3 },
  { museumId: 4, collectionId: 4 },
  { museumId: 4, collectionId: 5 },
  { museumId: 4, collectionId: 6 },
  { museumId: 4, collectionId: 7 },
  { museumId: 4, collectionId: 8 },
  { museumId: 4, collectionId: 9 },
  { museumId: 4, collectionId: 10 },
  { museumId: 5, collectionId: 1 },
  { museumId: 5, collectionId: 4 },
  { museumId: 5, collectionId: 5 },
  { museumId: 5, collectionId: 6 },
  { museumId: 5, collectionId: 7 },
  { museumId: 5, collectionId: 8 },
  { museumId: 5, collectionId: 9 },
  { museumId: 5, collectionId: 10 },
  { museumId: 6, collectionId: 1 },
  { museumId: 6, collectionId: 2 },
  { museumId: 6, collectionId: 3 },
  { museumId: 6, collectionId: 4 },
  { museumId: 6, collectionId: 5 },
  { museumId: 6, collectionId: 6 },
  { museumId: 6, collectionId: 7 },
  { museumId: 6, collectionId: 8 },
  { museumId: 6, collectionId: 8 },
  { museumId: 6, collectionId: 10 },
  { museumId: 7, collectionId: 5 },
  { museumId: 7, collectionId: 8 }
];

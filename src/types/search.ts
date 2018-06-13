// @flow

//Deprecated. As we now use TypeScript, we can instead use @types/elasticsearch instead of some
// homegrown semi-complete typings.
//TODO: Fjern denne fila.

export type Hit = {
  _index: string;
  _type: 'collection' | 'sample' | 'analysis' | 'analysisCollection';
  _id: string;
  _score: number;
  _source?: any;
};

export type InnerHits = {
  inner_hits: {
    [key: string]: {
      hits: {
        total: number;
        max_score: number;
        hits: Array<SearchHit>;
      };
    };
  };
};

/**
 * This is the raw response from elasticsearch.
 * It's missing some parts but it gives as for now what we need. If we need to extend it
 * in the future then you just have to read the elasticsearch documentation related to
 * what's expected in the response.
 */
export type SearchResult = {
  timed_out: boolean;
  took: number;
  hits: {
    total: number;
    max_score: number;
    hits: Array<SearchHit>;
  };
};

export type SearchHit = Hit & InnerHits;

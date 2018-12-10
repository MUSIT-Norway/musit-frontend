declare namespace Terraformer {
  namespace WKT {
    function parse(wkt: string): any;
    function convert(geoJSON: GeoJSON.GeometryObject): string;
  }
}

declare module 'terraformer-wkt-parser' {
  export = Terraformer.WKT;
}

export default Terraformer.WKT;

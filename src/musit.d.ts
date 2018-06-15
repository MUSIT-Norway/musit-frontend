declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.png';
declare module '*.json';

declare module 'jsondiffpatch/src/formatters/console' {
  //import { log } from "jsondiffpatch/src/formatters/console";
  declare function log(str: string): void;
}

declare module 'object.entries' {
  export = entries;
  declare function entries(p: any): any;
  //declare module.exports: any;
  //export default entries; //= entries;
}

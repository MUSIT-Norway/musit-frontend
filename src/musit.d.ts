declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.png';
declare module '*.json';

declare module 'jsondiffpatch/src/formatters/console' {
  //import { log } from "jsondiffpatch/src/formatters/console";
  declare function log(str: string): void;
}

//Copied from the ES7 type, we use polyfills for Object.values (and Object.entries, so could perhaps include this one as well)
interface ObjectConstructor {
  values<T>(o: { [s: string]: T }): T[];
  values(o: any): any[];
}




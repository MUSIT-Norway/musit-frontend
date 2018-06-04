import { TODO } from "./common";
interface PicklistNode {
  marked: boolean;
  value: TODO;
  path: Array<TODO>;
}

interface PicklistObject {
  marked: boolean;
  value: TODO;
  path: Array<TODO>;
}

export interface PicklistData {
  nodes: Array<PicklistNode>;
  objects: Array<PicklistObject>;
}

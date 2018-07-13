import { ChangeEvent } from 'react';

export type Uuid = string;

export type Maybe<T> = T | null | undefined;

export type mixed = any; //rename to 'Mixed' (capital 'M') when we have converted every file

export type Star = any; //* in Flow. Existential type: https://flow.org/en/docs/types/utilities/

//For some stuff which ideally should be removed
export type TODO_REMOVE = any;

//For situations which I think we definitely shouldn't have Maybe. To mark where we need to fix stuff.
//(Remove this type when finished)
export type RemoveMaybe<T> = Maybe<T>;

export type ArrayAny = Array<any>; //Translation of [] in Flow.

//Temporary quick fixes during initial translation to TS.
export type STEIN_OR_RITUVESH_MUST_LOOK_INTO_THIS = any;

//Really must look into! :)
export type BUG = any;

//Type to use temporarily, until we've found the proper type
export type TODO = any;

//A marker that this must be looked into
export type MUSTFIX = any;

//NodeStore is used many types in the code, I don't know what it refers to, must fix!
export type TODO_NodeStore = any;

//Just a marker for the classes which were marked as "exact" in Flow.   {|....|}
//It should mean that the type is "closed", that there shouldn't by any more properties than explicitly defined in the type
//(More or less this, is the default behaviour of TypeScript anyway, so this can probably be removed without loss)
export type Exact<T> = T;

/*
For some reason, at the moment the standard TypeScript API doesn't define a result property
on EventTarget. This is a hack until MS fixes this.*/

type EventTargetWithResult = { result: any };

export function eventTargetResult(event: Event) {
  return ((event.target as any) as EventTargetWithResult).result;
}

type EventTargetWithValue = { value: any };

export function eventTargetValue(
  event: Event | ChangeEvent<HTMLElement> | React.MouseEvent<any>
) {
  return ((event.target as any) as EventTargetWithValue).value;
}

type EventTargetWithFiles = { files: any };

export function eventTargetFiles(event: ChangeEvent<HTMLElement>): Array<File> {
  return ((event.target as any) as EventTargetWithFiles).files;
}

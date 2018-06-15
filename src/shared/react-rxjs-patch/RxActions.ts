import { Subject } from "rxjs";

export function createAction<T>(name: string): Subject<T> {
  const action = new Subject<T>();
  action.subscribe((action: T) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(name, action);
    }
  });
  return action;
}

export function createActions<T>(
  ...actionNames: Array<string>
): { [key: string]: Subject<T> } {
  return actionNames.reduce(
    (akk, name) => ({ ...akk, [name]: createAction(name) }),
    {}
  );
}

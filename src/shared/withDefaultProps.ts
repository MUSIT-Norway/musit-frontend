import { ComponentType } from 'react';
import { TODO } from '../types/common';

//Taken from: https://medium.com/@martin_hotell/react-typescript-and-defaultprops-dilemma-ca7f81c661c7
//This is not used at the moment, will also be redundant (and can be removed) when  TypeScript 3.0 arrives with a mechanism to support defaultProps.
export const withDefaultProps = <P extends object, DP extends Partial<P> = Partial<P>>(
  defaultProps: DP,
  Cmp: ComponentType<P>
) => {
  type PropsExcludingDefaults = Pick<P, Exclude<keyof P, keyof DP>>;
  type RecomposedProps = Partial<DP> & PropsExcludingDefaults;
  (Cmp as TODO).defaultProps = defaultProps;
  return (Cmp as ComponentType<any>) as ComponentType<RecomposedProps>;
};

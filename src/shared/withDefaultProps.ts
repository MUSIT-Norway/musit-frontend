import { ComponentType } from 'react';
import { TODO } from '../types/common';

//Taken from: https://medium.com/@martin_hotell/react-typescript-and-defaultprops-dilemma-ca7f81c661c7

export const withDefaultProps = <P extends object, DP extends Partial<P> = Partial<P>>(
  defaultProps: DP,
  Cmp: ComponentType<P>
) => {
  type PropsExcludingDefaults = Pick<P, Exclude<keyof P, keyof DP>>;
  type RecomposedProps = Partial<DP> & PropsExcludingDefaults;
  (Cmp as TODO).defaultProps = defaultProps;
  return (Cmp as ComponentType<any>) as ComponentType<RecomposedProps>;
};

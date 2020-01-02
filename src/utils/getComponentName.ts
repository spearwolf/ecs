import { $componentName } from '../constants';

export const getComponentName = (component: any): string | Symbol => {
  switch (typeof component) {
    case 'string':
    case 'symbol':
      return component;
    case 'function':
    case 'object':
      if (component !== null) {
        return component[$componentName];
      }
  }
  return undefined;
};

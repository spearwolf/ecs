import {$componentName, $componentFactory} from './constants';
import {IComponentFactory} from './IComponentFactory';

export type ComponentNameType = string | Symbol;

export interface ComponentClassType {
  [$componentName]: ComponentNameType;
  [$componentFactory]: IComponentFactory;
}

export type ComponentDescriptorType = Object | ComponentNameType;

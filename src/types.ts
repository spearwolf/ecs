import {$componentName, $componentFactory} from './constants';
import {IComponentFactory} from './IComponentFactory';

export type ComponentNameType = string | Symbol;

export interface ComponentClassType {
  [$componentName]: ComponentNameType;
  [$componentFactory]: IComponentFactory;
}

export type ComponentDescriptorType = ComponentClassType | ComponentNameType;

export type ComponentInitializer = ComponentDescriptorType | [ComponentDescriptorType, any];

export type EntityDescriptor = [string, Object] | string;

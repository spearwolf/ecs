import { getComponentName } from './utils/getComponentName';
import { warn } from './utils/warn';
import { $componentName, $componentFactory } from './constants';
import { ComponentNameType, ComponentDescriptorType, ComponentClassType } from './types';
import { IComponentFactory } from './IComponentFactory';
import { IComponentInstance } from './IComponentInstance';
import { Entity } from './Entity';

export class ComponentRegistry {

  readonly factories = new Map<ComponentNameType, IComponentFactory>();

  getComponentFactory(componentDescriptor: ComponentDescriptorType) {
    const componentName = getComponentName(componentDescriptor);
    const factory = this.factories.get(componentName);
    if (!factory) {
      warn(`[ComponentRegistry] unknown component-factory: '${componentName}'`);
      return undefined;
    }
    return factory;
  }

  registerComponentFactory(componentName: ComponentNameType, componentFactory: IComponentFactory) {
    this.factories.set(componentName, componentFactory);
  }

  registerComponents(...components: ComponentClassType[]) {
    components.forEach(c => {
      this.factories.set(c[$componentName], c[$componentFactory]);
    })
  }

  /**
   * Create a new component and attach it to the entity.
   */
  attachComponent(entity: Entity, componentDescriptor: ComponentDescriptorType, data?: any) {
    const componentName = getComponentName(componentDescriptor);
    const factory = this.getComponentFactory(componentName);
    const component = factory.attachComponent(entity, data);
    entity.setComponent(componentName, component);
  }

  deleteComponent(componentDescriptor: ComponentDescriptorType, component: IComponentInstance) {
    const factory = this.factories.get(getComponentName(componentDescriptor));
    if (factory && factory.deleteComponent) {
      factory.deleteComponent(component);
    }
  }

}

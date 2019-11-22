import { getComponentName } from './utils/getComponentName';
import { warn } from './utils/warn';
import { $componentName, $componentFactory } from './constants';

export default class ComponentRegistry {

  factories = new Map();

  /**
   * @param {string|object} componentClassOrName - component class or factory name
   */
  getComponentFactory(componentClassOrName) {
    const componentName = getComponentName(componentClassOrName);
    const factory = this.factories.get(componentName);
    if (!factory) {
      return warn(`[ComponentRegistry] unknown component-factory: '${componentName}'`);
    }
    return factory;
  }

  /**
   * @param {string} componentName
   * @param {object} componentFactroy - the component factory interface
   */
  registerComponentFactory(componentName, componentFactory) {
    this.factories.set(componentName, componentFactory);
  }

  /**
   * @param {...object} components
   */
  registerComponents(...components) {
    components.forEach(c => {
      this.factories.set(c[$componentName], c[$componentFactory]);
    })
  }

  /**
   * Create a new component and attach it to the entity.
   */
  // TODO rename to attachComponent
  createComponent(entity, componentClassOrName, data) {
    const componentName = getComponentName(componentClassOrName);
    const factory = this.getComponentFactory(componentName);
    const component = factory.create(entity, data);
    entity.setComponent(componentName, component);
  }

  // TODO rename to deleteComponent
  destroyComponent(componentClassOrName, component) {
    const factory = this.factories.get(getComponentName(componentClassOrName));
    if (factory && factory.destroy) {
      factory.destroy(component);
    }
  }

}

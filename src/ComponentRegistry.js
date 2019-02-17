import getComponentName from './utils/getComponentName';
import warn from './utils/warn';

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
    components.forEach(({ componentName, componentFactory }) => {
      this.factories.set(componentName, componentFactory);
    })
  }

  /**
   * Create a new component and attach it to the entity.
   */
  createComponent(entity, componentClassOrName, data) {
    const componentName = getComponentName(componentClassOrName);
    const factory = this.getComponentFactory(componentName);
    const component = factory.create(entity, data);
    entity.setComponent(componentName, component);
  }

  destroyComponent(componentClassOrName, component) {
    const factory = this.factories.get(getComponentName(componentClassOrName));
    if (factory && factory.destroy) {
      factory.destroy(component);
    }
  }

}

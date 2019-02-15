import getComponentName from './utils/getComponentName';

export default class ComponentRegistry {

  constructor() {
    this.factories = new Map();
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
  registerComponent(...components) {
    components.forEach(({ componentName, componentFactory }) => {
      this.factories.set(componentName, componentFactory);
    })
  }

  /**
   * @param {string} name - component factory name
   */
  getComponentFactory(name) {
    const componentName = getComponentName(name);
    const factory = this.factories.get(componentName);
    if (!factory) {
      throw new Error(`ComponentRegistry: unknown factory '${componentName}'`);
    }
    return factory;
  }

  /**
   * Create a new component and attach it to the entity.
   */
  createComponent(entity, name, data) {
    const componentName = getComponentName(name);
    const factory = this.getComponentFactory(componentName);
    const component = factory.create(entity, data);
    entity.setComponent(componentName, component);
  }

  updateComponent(entity, name, data) {
    const componentName = getComponentName(name);
    const factory = this.getComponentFactory(componentName);
    const component = entity[componentName];
    factory.update(component, data);
  }

  createOrUpdateComponent(entity, name, data) {
    const componentName = getComponentName(name);
    this[entity.hasComponent(componentName) ? 'updateComponent' : 'createComponent'](entity, componentName, data);
  }

  destroyComponent(name, component) {
    const factory = this.factories.get(getComponentName(name));
    if (factory && factory.destroy) {
      factory.destroy(component);
    }
  }
}

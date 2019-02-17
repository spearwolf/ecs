import getComponentName from '../utils/getComponentName.js';

/**
 * A very simple component factory.
 */
export class ComponentFactory {

  static updateComponent(ecs, entity, componentClassOrName, data) {
    const componentName = getComponentName(componentClassOrName);
    const component = entity[componentName];
    if (component.update) {
      component.update(data);
    }
  }

  static createOrUpdateComponent(ecs, entity, componentClassOrName, data) {
    const componentName = getComponentName(componentClassOrName);
    if (entity.hasComponent(componentName)) {
      ComponentFactory.updateComponent(ecs, entity, componentName, data);
    } else {
      ecs.createComponent(entity, componentName, data);
    }
  }

  constructor(componentClass) {
    this.componentClass = componentClass;
  }

  create(entity, data) {
    return new this.componentClass(entity, data);
  }

  destroy(component) {
    if (component.destroy) {
      component.destroy();
    }
  }

}

export default ComponentFactory;

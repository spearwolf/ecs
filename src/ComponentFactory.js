
/**
 * A very simple component factory.
 */
export default class ComponentFactory {

  constructor(componentClass) {
    this.componentClass = componentClass;
  }

  create(entity, data) {
    return new this.componentClass(entity, data);
  }

  update(component, data) {
    if (component.update) {
      component.update(data);
    }
  }

  destroy(component) {
    if (component.destroy) {
      component.destroy();
    }
  }

}

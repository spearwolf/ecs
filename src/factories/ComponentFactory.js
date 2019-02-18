
/**
 * A very simple component factory.
 */
export class ComponentFactory {

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

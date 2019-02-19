export class ComponentFactory {

  static $getEntity = 'getEntity';

  static $initialize = 'initialize';
  static $destroy = 'destroy';

  constructor(componentClass) {
    this.componentClass = componentClass;
  }

  create(entity, data) {
    const component = new this.componentClass();
    component[ComponentFactory.$getEntity] = (entityId) => entityId !== undefined ? entity.ecs.getEntity(entityId) : entity;
    if (data !== undefined && component[ComponentFactory.$initialize]) {
      component[ComponentFactory.$initialize](data);
    }
    return component;
  }

  destroy(component) {
    if (component[ComponentFactory.$destroy]) {
      component[ComponentFactory.$destroy]();
    }
    component[ComponentFactory.$getEntity] = undefined;
  }

}

export default ComponentFactory;

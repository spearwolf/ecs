export interface IComponentConstructor {
  new(): IComponentConstructor
}

export class ComponentFactory {

  // TODO use prop annotation: @GetEntity, @GetECS
  static $getEntity = 'getEntity';
  // TODO use prop/method annotation: @Initialize
  static $initialize = 'initialize';
  // TODO use prop/method annotation: @Destroy
  static $destroy = 'destroy';

  componentClass: IComponentConstructor;

  constructor(componentClass: IComponentConstructor) {
    this.componentClass = componentClass;
  }

  // TODO rename to attachComponent?
  create(entity: Object, data: any) {
    const component = new this.componentClass();
    component[ComponentFactory.$getEntity] = (entityId) => entityId !== undefined ? entity.ecs.getEntity(entityId) : entity;
    if (data !== undefined && component[ComponentFactory.$initialize]) {
      component[ComponentFactory.$initialize](data);
    }
    return component;
  }

  // TODO rename to deleteComponent?
  destroy(component: Object) {
    if (component[ComponentFactory.$destroy]) {
      component[ComponentFactory.$destroy]();
    }
    component[ComponentFactory.$getEntity] = undefined;
  }

}

export default ComponentFactory;

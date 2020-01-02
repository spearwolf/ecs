import { IComponentConstructor } from './IComponentConstructor';
import { Entity } from '../Entity';
import {IComponentInstance} from '../IComponentInstance';

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

  attachComponent(entity: Entity, data?: any): IComponentInstance {
    const component: any = new this.componentClass();
    component[ComponentFactory.$getEntity] = (entityId: string) => entityId !== undefined ? entity.ecs.getEntity(entityId) : entity;
    if (data !== undefined && component[ComponentFactory.$initialize]) {
      component[ComponentFactory.$initialize](data);
    }
    return component;
  }

  deleteComponent(component: IComponentInstance) {
    // @ts-ignore
    if (component[ComponentFactory.$destroy]) {
      // @ts-ignore
      component[ComponentFactory.$destroy]();
    }
    // @ts-ignore
    component[ComponentFactory.$getEntity] = undefined;
  }

}

export default ComponentFactory;

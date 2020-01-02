import eventize, { Eventize } from '@spearwolf/eventize';

import { uuid } from './utils/uuid';
import { getComponentName } from './utils/getComponentName';
import { warn } from './utils/warn';
import { $entityIsDestroyed, $components } from './constants';
import { toJSON } from './utils/toJSON';
import { IEntity } from './IEntity';
import { ECS } from './ECS';
import { ComponentNameType } from './types';
import { IComponentInstance } from './IComponentInstance';

export interface Entity extends Eventize {};

export class Entity implements IEntity {

  // TODO use annotations: @OnConnect(ToEntity?), @OnDisconnet, @OnDestroy....

  /**
   * Connect component to entity event
   */
  static $connectComponent = 'connectComponent';

  /**
   * Delete component from entity event
   */
  static $deleteComponent = 'deleteComponent';

  readonly id: string;
  readonly ecs: ECS;
  
  readonly [$components]: Set<ComponentNameType>;

  [$entityIsDestroyed] = false;

  // TODO @GetComponent annotations - eg. @GetComponent(Children[, initialConfig]) foo: IChildren

  constructor(ecs: ECS, id = uuid()) {
    this.ecs = ecs;
    this.id = id;
    this[$components] = new Set();
    eventize(this);
  }

  isDestroyed() {
    return this[$entityIsDestroyed];
  }

  destroy() {
    if (!this.isDestroyed()) {
      this[$entityIsDestroyed] = true;
      this[$components].forEach(this.deleteComponent.bind(this));
      this.ecs.destroyEntity(this.id);
    }
  }

  hasComponent(name: ComponentNameType) {
    const hasComponent = (name: ComponentNameType) => this[$components].has(getComponentName(name));
    return Array.isArray(name) ? name.every(hasComponent) : hasComponent(name);
  }

  setComponent(name: ComponentNameType, component: IComponentInstance) {
    const components = this[$components];
    if (!components.has(name)) {
      components.add(name);
      // @ts-ignore
      this[name] = component;
      if (component.connectToEntity) {
        component.connectToEntity(this);
      }
      this.emit(Entity.$connectComponent, { name, component, entity: this });
      // @ts-ignore
    } else if (this[name] !== component) {
      warn(`[Entity.setComponent] can't override existing component property: '${name}'`);
    }
  }

  deleteComponent(name: ComponentNameType) {
    const components = this[$components];
    if (components.has(name)) {
      // @ts-ignore
      const component: IComponentInstance = this[name];

      this.emit(Entity.$deleteComponent, { name, component, entity: this });

      if (component.disconnectFromEntity) {
        component.disconnectFromEntity(this);
      }

      this.ecs.deleteComponent(name, component);
      components.delete(name);

      // @ts-ignore
      delete this[component];
    }
  }

  toJSON() {
    const components = Array.from(this[$components]);
    if (components.length) {
      const json = {};
      components.forEach((name) => {
        // @ts-ignore
        const component: IComponentInstance = this[name];
        // @ts-ignore
        json[name] = component.toJSON ? component.toJSON() : toJSON(component);
      });
      return [this.id, json];
    }
    return this.id;
  }

}

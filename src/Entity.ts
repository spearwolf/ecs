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
  static $connectToEntity = 'connectToEntity';
  static $connectComponent = 'connectComponent';
  static $disconnectFromEntity = 'disconnectFromEntity';
  static $destroyComponent = 'destroyComponent';
  static $toJSON = 'toJSON';

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
      this[$components].forEach(this.destroyComponent.bind(this));
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
      // TODO extend IComponentInstance
      if (component[Entity.$connectToEntity]) {
        component[Entity.$connectToEntity](this);
      }
      this.emit(Entity.$connectComponent, { name, component, entity: this });
      // @ts-ignore
    } else if (this[name] !== component) {
      warn(`[Entity.setComponent] can't override existing component property: '${name}'`);
    }
  }

  destroyComponent(name) {
    const components = this[$components];
    if (components.has(name)) {
      const component = this[name];

      this.emit(Entity.$destroyComponent, { name, component, entity: this });

      if (component[Entity.$disconnectFromEntity]) {
        component[Entity.$disconnectFromEntity](this);
      }

      this.ecs.deleteComponent(name, component);
      components.delete(name);
      delete this[component];
    }
  }

  toJSON() {
    const components = Array.from(this[$components]);
    if (components.length) {
      const json = {};
      components.forEach((name) => {
        const component = this[name];
        json[name] = component[Entity.$toJSON] ? component[Entity.$toJSON]() : toJSON(component);
      });
      return [this.id, json];
    }
    return this.id;
  }

}

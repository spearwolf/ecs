import eventize from '@spearwolf/eventize';

import uuid from './utils/uuid';
import getComponentName from './utils/getComponentName';
import warn from './utils/warn';
import { toJSON } from './utils/toJSON';
import { $entityIsDestroyed, $components } from './constants';

const hasComponent = entity => name => entity[$components].has(getComponentName(name));

export default class Entity {

  // TODO use annotations: @OnConnect(ToEntity?), @OnDisconnet, @OnDestroy....
  static $connectToEntity = 'connectToEntity';
  static $connectComponent = 'connectComponent';
  static $disconnectFromEntity = 'disconnectFromEntity';
  static $destroyComponent = 'destroyComponent';
  static $toJSON = 'toJSON';

  // TODO @GetComponent annotations - eg. @GetComponent(Children[, initialConfig]) foo: IChildren

  constructor(ecs, id = uuid()) {
    this.id = id;
    Object.defineProperties(this, {
      ecs: { value: ecs },
      [$components]: { value: new Set() },
    });
    eventize(this);
  }

  destroy() {
    if (!this[$entityIsDestroyed]) {
      this[$entityIsDestroyed] = true;
      this[$components].forEach(this.destroyComponent.bind(this));
      this.ecs.destroyEntity(this.id);
    }
  }

  hasComponent(name) {
    return Array.isArray(name) ? name.every(hasComponent(this)) : hasComponent(this)(name);
  }

  /**
   * Create a new component and attach it to the entity.
   * @see ECS#createComponent()
   */
  // TODO rename to attachComponent
  createComponent(componentClassOrName, data) {
    this.ecs.createComponent(componentClassOrName, data);
  }

  setComponent(name, component) {
    const components = this[$components];
    if (!components.has(name)) {
      components.add(name);
      this[name] = component;
      if (component[Entity.$connectToEntity]) {
        component[Entity.$connectToEntity](this);
      }
      this.emit(Entity.$connectComponent, { name, component, entity: this });
    } else if (this[name] !== component) {
      warn(`[Entity.setComponent] can't override existing component property: '${name}'`);
    }
  }

  // TODO rename to deleteComponent
  destroyComponent(name) {
    const components = this[$components];
    if (components.has(name)) {
      const component = this[name];

      this.emit(Entity.$destroyComponent, { name, component, entity: this });

      if (component[Entity.$disconnectFromEntity]) {
        component[Entity.$disconnectFromEntity](this);
      }

      this.ecs.destroyComponent(name, component);
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

import eventize from '@spearwolf/eventize';

import uuid from './utils/uuid';
import getComponentName from './utils/getComponentName';
import warn from './utils/warn';

const hasComponent = entity => name => entity.components.has(getComponentName(name));

const toJSON = (obj) => {
  if (obj == null) {
    return obj;
  }
  const out = {};
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    const val = obj[key];
    switch (typeof val) {
      case 'number':
      case 'bigint':
      case 'string':
      case 'boolean':
      case 'object':
        out[key] = val;
    }
  });
  return out;
};

export default class Entity {

  static $connectToEntity = 'connectToEntity';
  static $connectComponent = 'connectComponent';
  static $disconnectFromEntity = 'disconnectFromEntity';
  static $destroyComponent = 'destroyComponent';
  static $toJSON = 'toJSON';

  constructor(ecs, id = uuid()) {
    this.id = id;
    Object.defineProperties(this, {
      ecs: { value: ecs },
      components: { value: new Set() },
    });
    eventize(this);
  }

  destroy() {
    if (!this.destroyed) {
      this.destroyed = true;
      this.components.forEach(this.destroyComponent.bind(this));
      this.ecs.destroyEntity(this.id);
    }
  }

  hasComponent(name) {
    return Array.isArray(name) ? name.every(hasComponent(this)) : hasComponent(this)(name);
  }

  setComponent(name, component) {
    if (!this.components.has(name)) {
      this.components.add(name);
      this[name] = component;
      if (component[Entity.$connectToEntity]) {
        component[Entity.$connectToEntity](this);
      }
      this.emit(Entity.$connectComponent, { name, component, entity: this });
    } else if (this[name] !== component) {
      warn(`[Entity.setComponent] can't override existing component property: '${name}'`);
    }
  }

  destroyComponent(name) {
    if (this.components.has(name)) {
      const component = this[name];

      this.emit(Entity.$destroyComponent, { name, component, entity: this });

      if (component[Entity.$disconnectFromEntity]) {
        component[Entity.$disconnectFromEntity](this);
      }

      this.ecs.destroyComponent(name, component);
      this.components.delete(name);
      delete this[component];
    }
  }

  toJSON() {
    const components = Array.from(this.components);
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

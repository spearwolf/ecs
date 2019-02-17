import Entity from './Entity';
import ComponentRegistry from './ComponentRegistry';

import warn from './utils/warn';

export default class ECS extends ComponentRegistry {

  constructor(components) {
    super();
    this.entities = new Map();

    if (Array.isArray(components) && components.length) {
      this.registerComponents(...components);
    }
  }

  /**
   * @param {Array} [components] - *Optional* components to attach to the entity
   * @param {string} [id] - The *optional* entity id
   * @returns {Entity}
   */
  createEntity(components, id) {
    const entity = new Entity(this, id);

    if (this.entities.has(entity.id)) {
      return warn(`[ECS.createEntity] entity with id:${entity.id} already exists! entity id's must be unique!`);
    }

    this.entities.set(entity.id, entity);

    if (Array.isArray(components)) {
      components.forEach((componentClass) => {
        if (Array.isArray(componentClass)) {
          this.createComponent(entity, ...componentClass); // c => [componentClass, data]
        } else {
          this.createComponent(entity, componentClass);
        }
      });
    }

    return entity;
  }

  getEntity(id) {
    return this.entities.get(id);
  }

  destroyEntity(id) {
    const e = this.entities.get(id);
    if (e) {
      this.entities.delete(id);
      if (!e.destroyed) {
        e.destroy();
      }
    }
  }

  destroyAllEntities() {
    this.entities.forEach(e => e.destroy());
  }
}

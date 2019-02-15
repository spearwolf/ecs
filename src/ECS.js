import Entity from './Entity';
import ComponentRegistry from './ComponentRegistry';

export default class ECS extends ComponentRegistry {

  constructor(components) {
    super();
    this.entities = new Map();

    if (Array.isArray(components) && components.length) {
      this.registerComponent(...components);
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
      throw new Error(`ECS: duplicate entity.id='${entity.id}' are not allowed`);
    }

    this.entities.set(entity.id, entity);

    if (Array.isArray(components)) {
      components.forEach((componentClass) => {
        if (Array.isArray(componentClass)) { // c => [componentClass, data]
          this.createComponent(entity, ...componentClass);
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

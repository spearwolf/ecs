import Entity from './Entity';
import ComponentRegistry from './ComponentRegistry';
import warn from './utils/warn';
import { $entityIsDestroyed } from './constants';

/**
 * @typedef {Array<string, Object>} EntityDescriptor
 * @property {string} name
 */

export default class ECS extends ComponentRegistry {

  constructor(components) {
    super();

    this.entities = new Map();

    if (Array.isArray(components) && components.length) {
      this.registerComponents(...components);
    }
  }

  /**
   * @param {Array} [components] components to attach to the entity
   * @param {string} [id] entity id
   * @returns {Entity}
   */
  createEntity(components, id) {
    const entity = new Entity(this, id);

    if (this.entities.has(entity.id)) {
      warn(`[ECS.createEntity] entity with id:${entity.id} already exists! entity id's must be unique!`);
      return;
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

  /**
   * @param {Array<EntityDescriptor>} entities
   * @returns {Array<Entity>}
   */
  buildFromJSON(entities) {
    return entities.map((entity) => {
      if (Array.isArray(entity)) {
        const [id, data] = entity;
        const components = Object.keys(data).map(name => [name, data[name]]);
        return this.createEntity(components, id);
      }
      return this.createEntity(null, entity);
    });
  }

  getEntity(id) {
    return this.entities.get(id);
  }

  destroyEntity(id) {
    const e = this.entities.get(id);
    if (e) {
      this.entities.delete(id);
      if (!e[$entityIsDestroyed]) {
        e.destroy();
      }
    }
  }

  destroyAllEntities() {
    this.entities.forEach(e => e.destroy());
  }
}

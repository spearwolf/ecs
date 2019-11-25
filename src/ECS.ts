import { Entity } from './Entity';
import { ComponentRegistry } from './ComponentRegistry';
import { warn } from './utils/warn';
import { ComponentClassType, ComponentInitializer, EntityDescriptor } from './types';

export class ECS extends ComponentRegistry {

  readonly entities = new Map<string, Entity>();

  constructor(components?: ComponentClassType[]) {
    super();

    if (Array.isArray(components) && components.length) {
      this.registerComponents(...components);
    }
  }

  /**
   * @param components to attach to the entity
   * @param [id] entity id
   * @returns {Entity}
   */
  createEntity(components: ComponentInitializer[], id?: string): Entity {
    const entity = new Entity(this, id);

    if (this.entities.has(entity.id)) {
      warn(`[ECS.createEntity] entity with id:${entity.id} already exists! entity id's must be unique!`);
      return;
    }

    this.entities.set(entity.id, entity);

    if (Array.isArray(components)) {
      components.forEach((componentClass) => {
        if (Array.isArray(componentClass)) {
          this.attachComponent(entity, ...componentClass); // c => [componentClass, data]
        } else {
          this.attachComponent(entity, componentClass);
        }
      });
    }

    return entity;
  }

  /**
   * @param {Array<EntityDescriptor>} entities
   * @returns {Array<Entity>}
   */
  buildFromJSON(entities: EntityDescriptor[]): Entity[] {
    return entities.map((entity) => {
      if (Array.isArray(entity)) {
        const [id, data] = entity;
        // @ts-ignore
        const components = Object.keys(data).map(name => [name, data[name]]) as ComponentInitializer[];
        return this.createEntity(components, id);
      }
      return this.createEntity(null, entity);
    });
  }

  getEntity(id: string) {
    return this.entities.get(id);
  }

  destroyEntity(id: string) {
    const e = this.entities.get(id);
    if (e) {
      this.entities.delete(id);
      e.destroy();
    }
  }

  destroyAllEntities() {
    this.entities.forEach(e => e.destroy());
  }
}

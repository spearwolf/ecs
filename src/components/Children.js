import { Component } from '../Component';

@Component({
  name: 'children',
})
class Children {

  children = [];
  parent = undefined;

  // TODO
  // @Initialize
  initialize({ parent, children }) {
    this.setParent(parent);

    if (Array.isArray(children)) {
      this.getEntity().ecs.buildFromJSON(children);
      this.children = children.map(child => Array.isArray(child) ? child[0] : child);
    }
  }

  forEach(callback, hasComponents) {
    this.children.forEach((childId, idx) => {
      const child = this.getEntity(childId);
      if (child) {
        const entity = this.getEntity();
        if (hasComponents) {
          if (child.hasComponent(hasComponents)) {
            callback(child, idx, entity); // eslint-disable-line callback-return
          }
        } else {
          callback(child, idx, entity); // eslint-disable-line callback-return
        }
      }
    });
  }

  deepEmit(event, context) {
    const entity = this.getEntity();

    entity.emit(event, context);

    entity.children.forEach((childEntity) => {
      if (childEntity.hasComponent(Children)) {
        childEntity.children.deepEmit(event, context);
      } else {
        childEntity.emit(event, context);
      }
    });
  }

  // TODO emit events: entity->children:setParent
  setParent(parentId) {
    const prevParentId = this.parent;
    this.parent = parentId;

    const { id } = this.getEntity();

    if (prevParentId) {
      const prevParent = this.getEntity(prevParentId);
      if (prevParent && prevParent.hasComponent(Children)) {
        prevParent.children.removeChild(id);
      }
    }

    const parent = this.getEntity(parentId);

    if (parent && parent.hasComponent(Children)) {
      if (!parent.children.hasChild(id)) {
        parent.children.children.push(id);
      }
    }
  }

  hasChild(childId) {
    return this.children.indexOf(childId) >= 0;
  }

  // TODO emit events: entity->children:addChild
  addChild(childId) {
    if (!this.hasChild(childId)) {
      const child = this.getEntity(childId);
      if (child && child.hasComponent(Children)) {
        child.children.setParent(this.getEntity().id);
      } else {
        this.children.push(childId);
      }
    }
  }

  // TODO emit events: entity->children:removeChild
  removeChild(childId) {
    const idx = this.children.indexOf(childId);
    if (idx >= 0) {
      this.children.splice(idx, 1);
    }

    const child = this.getEntity(childId);
    if (child.hasComponent(Children)) {
      child.children.setParent(undefined);
    }
  }

  toJSON() {
    return {
      parent: this.parent || null,
      children: this.children.map(childId => this.getEntity(childId).toJSON()),
    };
  }

}

export default Children;

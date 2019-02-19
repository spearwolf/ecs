import { Component } from '../Component';

@Component({
  name: 'children',
})
class Children {

  constructor(entity, options) {
    this.entity = entity;
    this.children = [];
    this.setParent(options && options.parent);
  }

  forEach(callback, hasComponents) {
    this.children.forEach((childId) => {
      const child = this.entity.ecs.getEntity(childId);
      if (child) {
        if (hasComponents) {
          if (child.hasComponent(hasComponents)) {
            callback(child); // eslint-disable-line callback-return
          }
        } else {
          callback(child); // eslint-disable-line callback-return
        }
      }
    });
  }

  setParent(parentId) {
    const prevParentId = this.parent;
    this.parent = parentId;

    if (prevParentId) {
      const prevParent = this.entity.ecs.getEntity(prevParentId);
      if (prevParent && prevParent.hasComponent(Children)) {
        prevParent.children.removeChild(this.entity.id);
      }
    }

    const parent = this.entity.ecs.getEntity(parentId);

    if (parent && parent.hasComponent(Children)) {
      if (!parent.children.hasChild(this.entity.id)) {
        parent.children.children.push(this.entity.id);
      }
    }
  }

  hasChild(childId) {
    return this.children.indexOf(childId) >= 0;
  }

  removeChild(childId) {
    const idx = this.children.indexOf(childId);
    if (idx >= 0) {
      this.children.splice(idx, 1);
    }

    const child = this.entity.ecs.getEntity(childId);
    if (child.hasComponent(Children)) {
      child.children.setParent(undefined);
    }
  }

}

export default Children;

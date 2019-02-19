import { Component } from '../Component';

@Component({
  name: 'children',
})
class Children {

  children = [];
  parent = undefined;

  initialize({ parent }) {
    this.setParent(parent);
  }

  forEach(callback, hasComponents) {
    this.children.forEach((childId) => {
      const child = this.getEntity(childId);
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

}

export default Children;

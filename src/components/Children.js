import { Component } from '../Component';

class Children {

  constructor(entity, options) {
    this.entity = entity;
    this.parent = options && options.parent;
    this.children = [];
  }

  forEach(callback, hasComponents) {
    if (hasComponents) {
      this.children.forEach((child) => {
        if (child.hasComponent(hasComponents)) {
          // eslint-disable-next-line callback-return
          callback(child);
        }
      });
    } else {
      this.children.forEach(callback);
    }
  }

  setParent(parent) {
    const prevParent = this.parent;
    this.parent = parent;
    if (prevParent && prevParent.hasComponent(Children)) {
      prevParent.children.removeChild(this.entity);
    }
    if (parent && parent.hasComponent(Children)) {
      if (!parent.children.hasChild(this.entity)) {
        parent.children.children.push(this.entity);
      }
    }
  }

  hasChild(child) {
    return this.children.indexOf(child) >= 0;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx >= 0) {
      this.children.splice(idx, 1);
    }
    if (child.hasComponent(Children)) {
      child.children.setParent(null);
    }
  }

}

export default Component({ name: 'children' })(Children);

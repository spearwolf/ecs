import { Component } from '../Component';

const callIf = (hasComponents, callback) => (child) => {
  if (child.hasComponent(hasComponents)) {
    // eslint-disable-next-line callback-return
    callback(child);
  }
};

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
    if (hasComponents) {
      this.children.forEach(callIf(hasComponents, callback));
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

export default Children;

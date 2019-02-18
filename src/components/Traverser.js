import { Component } from '../Component';

import Children from './Children';

@Component({
  name: 'traverser',
})
class Traverser {

  constructor(entity, options) {
    this.entity = entity;
    this.$event = (options && options.event) || 'traverse';
  }

  traverse(context) {
    const { entity } = this;

    entity.emit(this.$event, context);

    if (entity.hasComponent(Children)) {

      entity.children.forEach(
        ({ traverser }) => traverser.traverse(context),
        Traverser,
      );

    }
  }

}

export default Traverser;

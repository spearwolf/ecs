import { Component } from '../Component';

import Children from './Children';

@Component({
  name: 'traverser',
})
class Traverser {

  traverse(event, context) {
    const entity = this.getEntity();

    entity.emit(event, context);

    if (entity.hasComponent(Children)) {

      entity.children.forEach(
        ({ traverser }) => traverser.traverse(event, context),
        Traverser,
      );

    }
  }

}

export default Traverser;

import { Component } from '../Component';
import { EntityComponent } from '../EntityComponent';

import Children from './Children';

class Renderable extends EntityComponent {

  static $renderFrame = 'renderFrame';
  static $postRenderFrame = 'postRenderFrame';

  renderFrame(renderer) {

    const { entity } = this;

    entity.emit(Renderable.$renderFrame, renderer);

    if (entity.hasComponent(Children)) {

      entity.children.forEach(
        ({ renderable }) => renderable.renderFrame(renderer),
        Renderable,
      );

    }

    entity.emit(Renderable.$postRenderFrame, renderer);

  }

}

export default Component({ name: 'renderable' })(Renderable);

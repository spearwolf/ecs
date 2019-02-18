import { Component } from '../Component';

import Children from './Children';

@Component({
  name: 'renderable',
})
class Renderable {

  static $renderFrame = 'renderFrame';
  static $postRenderFrame = 'postRenderFrame';

  constructor(entity) {
    this.entity = entity;
  }

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

export default Renderable;

import { Component } from '../Component';

import Children from './Children';

export const RENDER_FRAME = 'renderFrame';
export const POST_RENDER_FRAME = 'postRenderFrame';

const COMPONENT_NAME = 'renderable';

class Renderable {

  constructor(entity) {
    this.entity = entity;
  }

  renderFrame(renderer) {
    const { entity } = this;
    entity.emit(RENDER_FRAME, renderer);
    if (entity.hasComponent(Children)) {
      entity.children.forEach(
        ({ renderable }) => renderable.renderFrame(renderer),
        Renderable,
      );
    }
    entity.emit(POST_RENDER_FRAME, renderer);
  }

}

export default Component({ name: COMPONENT_NAME })(Renderable);

/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { assert } from 'chai';
import sinon from 'sinon';

import ECS from '../../ECS';

import {
  Children,
  Renderable,
} from '..';

describe('Renderable', () => {

  const ecs = new ECS([
    Children,
    Renderable,
  ]);

  it('createEntity()', () => {
    const entity = ecs.createEntity([Renderable]);
    assert.exists(entity);
  });

  it('renderFrame()', () => {
    const entity = ecs.createEntity([Renderable]);
    const renderFrameSpy = sinon.spy();
    const postRenderFrameSpy = sinon.spy();

    entity.on(Renderable.$renderFrame, renderFrameSpy);
    entity.on(Renderable.$postRenderFrame, postRenderFrameSpy);

    const re = {};
    entity.renderable.renderFrame(re);

    assert.isTrue(renderFrameSpy.called, `event:${Renderable.$renderFrame} should be called`);
    assert.isTrue(renderFrameSpy.calledWith(re));
    assert.isTrue(postRenderFrameSpy.called, `event:${Renderable.$postRenderFrame} should be called`);
    assert.isTrue(postRenderFrameSpy.calledWith(re));
  });

  it('renderFrame() with children', () => {
    const root = ecs.createEntity([Renderable, Children]);
    const a = ecs.createEntity([Renderable, Children]);
    const b = ecs.createEntity([Children]);

    const aSpy = sinon.spy();
    const bSpy = sinon.spy();

    a.on(Renderable.$renderFrame, aSpy);
    b.on(Renderable.$postRenderFrame, bSpy);

    a.children.setParent(root);
    b.children.setParent(root);

    const re = {};
    root.renderable.renderFrame(re);

    assert.isTrue(aSpy.called, `event:${Renderable.$renderFrame} should be called on children with the renderable component`);
    assert.isTrue(aSpy.calledWith(re));
    assert.isFalse(bSpy.called, `event:${Renderable.$renderFrame} should not be called on a child without the renderable component`);
  });
});

/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { assert } from 'chai';
import sinon from 'sinon';

import ECS from '../../ECS';

import { Children, Traverser } from '..';

describe('Traverser', () => {

  it('createEntity()', () => {
    const ecs = new ECS([Traverser]);
    const entity = ecs.createEntity([Traverser]);
    assert.exists(entity.traverser);
  });

  it('traverse()', () => {
    const ecs = new ECS([Traverser]);
    const entity = ecs.createEntity([Traverser]);

    const traverseSpy = sinon.spy();
    entity.on('foo', traverseSpy);

    const ctx = {};
    entity.traverser.traverse('foo', ctx);

    assert.isTrue(traverseSpy.called, 'event:foo should be called');
    assert.isTrue(traverseSpy.calledWith(ctx));
  });

  it('traverse() with children', () => {
    const ecs = new ECS([Traverser, Children]);

    const event = 'fooBar';

    const parent = ecs.createEntity([Traverser, Children]);
    const childA = ecs.createEntity([Traverser, [Children, { parent: parent.id }]]);
    const childB = ecs.createEntity([[Children, { parent: parent.id }]]);

    const parentSpy = sinon.spy();
    const aSpy = sinon.spy();
    const bSpy = sinon.spy();

    parent.on(event, parentSpy);
    childA.on(event, aSpy);
    childB.on(event, bSpy);

    const ctx = {};
    parent.traverser.traverse(event, ctx);

    assert.isTrue(parentSpy.called, `event:${event} should be called on parent`);

    assert.isTrue(aSpy.called, `event:${event} should be called on child with traverser`);
    assert.isTrue(aSpy.calledWith(ctx));

    assert.isFalse(bSpy.called, `event:${event} should not be called on a child without traverser`);
  });
});

/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { assert } from 'chai';
import sinon from 'sinon';

import ECS from '../../ECS';
import Children from '../Children';

describe('Children', () => {
  const ecs = new ECS();

  let entity;
  let entity2;

  it('ECS#registerComponent()', () => {
    ecs.registerComponents(Children);
    assert.strictEqual(ecs.getComponentFactory(Children), Children.componentFactory);
  });

  it('ECS#createEntity()', () => {
    entity = ecs.createEntity();
    assert.exists(entity);
  });

  it('ECS#createComponent()', () => {
    ecs.createComponent(entity, Children);
    assert.instanceOf(entity.children, Children, 'entity.children should be an instance of Children');
  });

  it('setParent()', () => {
    entity2 = ecs.createEntity([Children]);
    entity.children.setParent(entity2.id);
    assert.strictEqual(entity.children.parent, entity2.id);
  });

  it('hasChild()', () => {
    assert.isTrue(entity2.children.hasChild(entity.id));
  });

  it('entity.hasComponent()', () => {
    assert.isTrue(entity.hasComponent(Children));
    assert.isTrue(entity2.hasComponent([Children]));
    assert.isTrue(entity.hasComponent('children'));
    assert.isTrue(entity2.hasComponent(['children']));
  });

  it('removeChild()', () => {
    entity2.children.removeChild(entity.id);
    assert.isFalse(entity2.children.hasChild(entity.id));
  });

  it('traverse()', () => {
    const ecs = new ECS([Children]);
    const entity = ecs.createEntity([Children]);

    const traverseSpy = sinon.spy();
    entity.on('foo', traverseSpy);

    const ctx = {};
    entity.children.traverse('foo', ctx);

    assert.isTrue(traverseSpy.called, 'event:foo should be called');
    assert.isTrue(traverseSpy.calledWith(ctx));
  });

  it('traverse() with children', () => {
    const ecs = new ECS([Children]);

    const event = 'fooBar';

    const parent = ecs.createEntity([Children]);
    const childA = ecs.createEntity([[Children, { parent: parent.id }]]);
    const childB = ecs.createEntity();

    const parentSpy = sinon.spy();
    const aSpy = sinon.spy();
    const bSpy = sinon.spy();

    parent.on(event, parentSpy);
    childA.on(event, aSpy);
    childB.on(event, bSpy);

    parent.children.addChild(childB.id);

    const ctx = {};
    parent.children.traverse(event, ctx);

    assert.isTrue(parentSpy.called, `event:${event} should be called on parent`);

    assert.isTrue(aSpy.called, `event:${event} should be called on child with traverser`);
    assert.isTrue(aSpy.calledWith(ctx));

    assert.isTrue(bSpy.called, `event:${event} should be called on childB`);
  });
});

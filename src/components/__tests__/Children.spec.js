/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { assert } from 'chai';
import sinon from 'sinon';

import { ECS } from '../../ECS';
import { $componentFactory } from '../../constants';
import Children from '../Children';

describe('Children', () => {
  const ecs = new ECS();

  let entity;
  let entity2;

  it('ecs.registerComponent()', () => {
    ecs.registerComponents(Children);
    assert.strictEqual(ecs.getComponentFactory(Children), Children[$componentFactory]);
  });

  it('ecs.createEntity()', () => {
    entity = ecs.createEntity();
    assert.exists(entity);
  });

  it('ecs.attachComponent()', () => {
    ecs.attachComponent(entity, Children);
    assert.instanceOf(entity.children, Children, 'entity.children should be an instance of Children');
  });

  it('children.setParent()', () => {
    entity2 = ecs.createEntity([Children]);
    entity.children.setParent(entity2.id);
    assert.strictEqual(entity.children.parent, entity2.id);
  });

  it('children.hasChild()', () => {
    assert.isTrue(entity2.children.hasChild(entity.id));
  });

  it('entity.hasComponent()', () => {
    assert.isTrue(entity.hasComponent(Children));
    assert.isTrue(entity2.hasComponent([Children]));
    assert.isTrue(entity.hasComponent('children'));
    assert.isTrue(entity2.hasComponent(['children']));
  });

  it('children.removeChild()', () => {
    entity2.children.removeChild(entity.id);
    assert.isFalse(entity2.children.hasChild(entity.id));
  });

  it('children.deepEmit()', () => {
    const ecs = new ECS([Children]);
    const entity = ecs.createEntity([Children]);

    const deepEmitSpy = sinon.spy();
    entity.on('foo', deepEmitSpy);

    const ctx = {};
    entity.children.deepEmit('foo', ctx);

    assert.isTrue(deepEmitSpy.called, 'event:foo should be called');
    assert.isTrue(deepEmitSpy.calledWith(ctx));
  });

  it('children.deepEmit() with children', () => {
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
    parent.children.deepEmit(event, ctx);

    assert.isTrue(parentSpy.called, `event:${event} should be called on parent`);

    assert.isTrue(aSpy.called, `event:${event} should be called on child with deepEmitr`);
    assert.isTrue(aSpy.calledWith(ctx));

    assert.isTrue(bSpy.called, `event:${event} should be called on childB`);
  });

  it('children.forEach()', () => {
    const ecs = new ECS([Children]);

    const parent = ecs.createEntity([Children]);
    const childA = ecs.createEntity([[Children, { parent: parent.id }]]);
    const childB = ecs.createEntity([Children]);
    const childC = ecs.createEntity();

    parent.children.addChild(childB.id);
    parent.children.addChild(childC.id);

    const ids = [];
    parent.children.forEach((entity, idx, parentEntity) => {
      ids.push(idx);
      ids.push(entity.id);
      ids.push(parentEntity.id);
    }, Children)

    assert.deepEqual(ids, [
      0, childA.id, parent.id,
      1, childB.id, parent.id,
    ]);
  });
});

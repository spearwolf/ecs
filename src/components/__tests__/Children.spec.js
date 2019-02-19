/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { assert } from 'chai';

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
});

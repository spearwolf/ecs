/* eslint-env browser */
/* eslint-env jest */
/* eslint no-console: 0 */

import { assert } from 'chai';
import sinon from 'sinon';

import { Component, ECS, Entity } from '..';

describe('Entity<>Component Lifecycle', () => {

  it('$connectToEntity', () => {

    const spy = sinon.spy();

    const Dummy = (
      @Component({ name: 'dummy' })
      class {
        get [Entity.$connectToEntity]() { return spy; }
      }
    );

    const ecs = new ECS([Dummy]);
    const entity = ecs.createEntity([Dummy]);

    assert.isTrue(spy.called);
    assert.isTrue(spy.calledWith(entity));

  });

  it('$disconnectFromEntity', () => {

    const spy = sinon.spy();

    const Dummy = (
      @Component({ name: 'dummy' })
      class {
        get [Entity.$disconnectFromEntity]() { return spy; }
      }
    );

    const ecs = new ECS([Dummy]);
    const entity = ecs.createEntity([Dummy]);

    assert.isFalse(spy.called);

    entity.destroy();

    assert.isTrue(spy.called);
    assert.isTrue(spy.calledWith(entity));

  });

  it('$connectComponent', () => {

    const spy = sinon.spy();

    const Dummy = (
      @Component({ name: 'dummy' })
      class {
        [Entity.$connectToEntity](entity) {
          entity.once(Entity.$connectComponent, spy);
        }
      }
    );

    const ecs = new ECS([Dummy]);
    const entity = ecs.createEntity([Dummy]);

    assert.isTrue(spy.called);
    assert.isTrue(spy.calledWith({ entity, name: 'dummy', component: entity.dummy }));

  });

  it('$destroyComponent', () => {

    const spy = sinon.spy();

    const Dummy = (
      @Component({ name: 'dummy' })
      class {
        [Entity.$connectToEntity](entity) {
          entity.once(Entity.$destroyComponent, spy);
        }
      }
    );

    const ecs = new ECS([Dummy]);
    const entity = ecs.createEntity([Dummy]);

    assert.isFalse(spy.called);

    entity.destroy();

    assert.isTrue(spy.called);
    assert.isTrue(spy.calledWith({ entity, name: 'dummy', component: entity.dummy }));

  });

});

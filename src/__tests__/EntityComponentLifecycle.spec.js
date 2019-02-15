/* eslint-env browser */
/* eslint-env jest */
/* eslint no-console: 0 */

import { assert } from 'chai';
import sinon from 'sinon';

import { Component, ECS, Entity } from '..';

describe('Entity<>Component Lifecycle', () => {

  it('$connectEntity', () => {

    const spy = sinon.spy();

    const Dummy = Component({ name: 'dummy' })(
      class {
        get [Entity.$connectEntity]() { return spy; }
      }
    );

    const ecs = new ECS([Dummy]);
    const entity = ecs.createEntity([Dummy]);

    assert.isTrue(spy.called);
    assert.isTrue(spy.calledWith(entity));

  });

  it('$disconnectEntity', () => {

    const spy = sinon.spy();

    const Dummy = Component({ name: 'dummy' })(
      class {
        get [Entity.$disconnectEntity]() { return spy; }
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

    const Dummy = Component({ name: 'dummy' })(
      class {
        [Entity.$connectEntity](entity) {
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

    const Dummy = Component({ name: 'dummy' })(
      class {
        [Entity.$connectEntity](entity) {
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

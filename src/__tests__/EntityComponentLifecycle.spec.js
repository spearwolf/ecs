/* eslint-env browser */
/* eslint-env jest */
/* eslint no-console: 0 */

import { assert } from 'chai';
import sinon from 'sinon';

import { Component, ECS, Entity } from '..';

describe('Entity<>Component Lifecycle', () => {

  it('component.connectToEntity(entity)', () => {

    const spy = sinon.spy();

    const Dummy = (
      @Component({ name: 'dummy' })
      class {
        get connectToEntity() { return spy; }
      }
    );

    const ecs = new ECS([Dummy]);
    const entity = ecs.createEntity([Dummy]);

    assert.isTrue(spy.called);
    assert.isTrue(spy.calledWith(entity));

  });

  it('component.disconnectFromEntity(entity)', () => {

    const spy = sinon.spy();

    const Dummy = (
      @Component({ name: 'dummy' })
      class {
        get disconnectFromEntity() { return spy; }
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
        connectToEntity(entity) {
          entity.once(Entity.$connectComponent, spy);
        }
      }
    );

    const ecs = new ECS([Dummy]);
    const entity = ecs.createEntity([Dummy]);

    assert.isTrue(spy.called);
    assert.isTrue(spy.calledWith({ entity, name: 'dummy', component: entity.dummy }));

  });

  it('Entity.$deleteComponent event', () => {

    const spy = sinon.spy();

    const Dummy = (
      @Component({ name: 'dummy' })
      class {
        connectToEntity(entity) {
          entity.once(Entity.$deleteComponent, spy);
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

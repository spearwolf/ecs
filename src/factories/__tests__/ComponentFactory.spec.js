/* eslint-env browser */
/* eslint-env jest */
/* eslint no-console: 0 */

import { ECS } from '../../ECS';
import { Component } from '../../Component';

describe('ComponentFactory', () => {

  @Component({ name: 'foo' }) class Foo {}

  it('getEntity()', () => {

    const ecs = new ECS([Foo]);
    const entity = ecs.createEntity([Foo]);

    expect(entity.foo.getEntity()).toEqual(entity);

  });

  it('getEntity(id)', () => {

    const ecs = new ECS([Foo]);
    const entity0 = ecs.createEntity([Foo]);
    const entity1 = ecs.createEntity();

    expect(entity0.foo.getEntity(entity1.id)).toEqual(entity1);

  });
});

/* eslint-env browser */
/* eslint-env jest */
/* eslint no-console: 0 */

import { ECS } from '../ECS';
import { Component } from '../Component';
import { Children } from '../components';

describe('Entity.toJSON', () => {

  @Component({ name: 'foo' }) class Foo {}

  @Component({ name: 'bar' }) class Bar {
    str = 'abc';
    numberOfBeast = 666;
    bool = true;
    func = function() {};
    obj = {
      x: 1,
      y: 2,
    };
    arr = [1, 2, 3];
  }

  @Component({ name: 'plah' }) class Plah {
    data = 23;
  }

  it('getEntity(foo)', () => {

    const ecs = new ECS([Bar]);
    const entity = ecs.createEntity([Bar]);

    expect(entity.toJSON()).toEqual([
      entity.id, {
        bar: {
          str: 'abc',
          numberOfBeast: 666,
          bool: true,
          obj: { x: 1, y: 2 },
          arr: [1, 2, 3],
        }
      }]);

  });

  it('getEntity(bar)', () => {

    const ecs = new ECS([Bar, Foo]);
    const entity = ecs.createEntity([Bar, Foo]);

    expect(entity.toJSON()).toEqual([
      entity.id, {
        foo: {},
        bar: {
          str: 'abc',
          numberOfBeast: 666,
          bool: true,
          obj: { x: 1, y: 2 },
          arr: [1, 2, 3],
        }
      }]);

  });

  it('getEntity(children)', () => {

    const ecs = new ECS([Plah, Foo, Children]);
    const entity = ecs.createEntity([Plah, Foo, Children]);
    const entity1 = ecs.createEntity([Plah, Children]);
    const entity2 = ecs.createEntity();

    entity1.children.setParent(entity.id);
    entity.children.addChild(entity2.id);

    expect(entity.toJSON()).toEqual([
      entity.id, {
        foo: {},
        plah: {
          data: 23,
        },
        children: {
          parent: null,
          children: [
            [entity1.id, {
              plah: {
                data: 23,
              },
              children: {
                parent: entity.id,
                children: [],
              },
            }],
            entity2.id,
          ],
        }
      }]);

  });

});

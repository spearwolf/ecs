/* eslint-env browser */
/* eslint-env jest */
/* eslint no-console: 0 */

import ECS from '../ECS';
import { Component } from '../Component';
import { Children } from '../components';

import { uuid } from '../utils/uuid';

describe('ECS.createFromJSON', () => {

  @Component({ name: 'plah' })
  class Plah {
    numberOfBeast = 666;

    initialize({ numberOfBeast }) {
      this.numberOfBeast = numberOfBeast;
    }
  }

  it('buildFromJSON(plah)', () => {

    const ecs = new ECS([Plah]);
    const id = uuid();

    const [entity] = ecs.buildFromJSON([
      [
        id,
        {
          plah: {
            numberOfBeast: 777,
          },
        },
      ],
    ]);

    expect(entity.id).toEqual(id);

    expect(entity.hasComponent(Plah)).toBeTruthy();
    expect(entity.plah.numberOfBeast).toEqual(777);

  });

  it('buildFromJSON(children)', () => {

    const ecs = new ECS([Plah, Children]);
    const id0 = uuid();
    const id1 = uuid();

    const [entity] = ecs.buildFromJSON([ [
      id0, {
        children: {
          children: [
            [id1, {
              plah: {
                numberOfBeast: 888,
              }
            }],
          ],
        }
      },
    ]]);

    expect(entity.id).toEqual(id0);

    expect(entity.hasComponent(Children)).toBeTruthy();

    expect(entity.children.children).toEqual([id1]);

    expect(ecs.getEntity(id1).plah.numberOfBeast).toEqual(888);

  });

});

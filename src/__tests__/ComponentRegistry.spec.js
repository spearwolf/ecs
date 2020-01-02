/* eslint-env browser */
/* eslint-env jest */
/* eslint no-console: 0 */

import { ComponentRegistry } from '../ComponentRegistry';

describe('ComponentRegistry', () => {
  describe('getComponentFactory()', () => {
    it('should return undefined if factory is not registered', () => {
      const cr = new ComponentRegistry();
      expect(cr.getComponentFactory('fooBar')).toBeUndefined();
    });

    it('should return factory', () => {
      const dummyFactory = {};
      const cr = new ComponentRegistry();
      cr.registerComponentFactory('dummy', dummyFactory);
      expect(cr.getComponentFactory('dummy')).toEqual(dummyFactory);
    });
  });

  describe('attachComponent()', () => {
    const factory = {};
    const entity = {};
    const component = {};
    const data = {};

    beforeEach(() => {
      factory.attachComponent = jest.fn(() => component);
      entity.setComponent = jest.fn();
    });

    it('should call factory.attachComponent()', () => {
      const registry = new ComponentRegistry();
      registry.registerComponentFactory('foo', factory);
      registry.attachComponent(entity, 'foo', data);

      expect(factory.attachComponent.mock.calls).toHaveLength(1);
      expect(factory.attachComponent.mock.calls[0]).toEqual([entity, data]);
    });

    it('should call entity.setComponent()', () => {
      const registry = new ComponentRegistry();
      registry.registerComponentFactory('foo', factory);
      registry.attachComponent(entity, 'foo', data);

      expect(entity.setComponent.mock.calls).toHaveLength(1);
      expect(entity.setComponent.mock.calls[0]).toEqual(['foo', component]);
    });
  });
});

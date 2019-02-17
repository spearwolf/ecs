/* eslint-env browser */
/* eslint-env jest */
/* eslint no-console: 0 */

import ComponentRegistry from '../ComponentRegistry.js';

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

  describe('createComponent()', () => {
    const factory = {};
    const entity = {};
    const component = {};
    const data = {};

    beforeEach(() => {
      factory.create = jest.fn(() => component);
      entity.setComponent = jest.fn();
    });

    it('should call factory.create()', () => {
      const registry = new ComponentRegistry();
      registry.registerComponentFactory('foo', factory);
      registry.createComponent(entity, 'foo', data);

      expect(factory.create.mock.calls).toHaveLength(1);
      expect(factory.create.mock.calls[0]).toEqual([entity, data]);
    });

    it('should call entity.setComponent()', () => {
      const registry = new ComponentRegistry();
      registry.registerComponentFactory('foo', factory);
      registry.createComponent(entity, 'foo', data);

      expect(entity.setComponent.mock.calls).toHaveLength(1);
      expect(entity.setComponent.mock.calls[0]).toEqual(['foo', component]);
    });
  });
});

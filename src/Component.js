import ComponentFactory from './factories/ComponentFactory';
import { $componentName, $componentFactory } from './constants';

/**
 * A component decorator.
 *
 * @param {object} options
 * @param {string} options.name - component name
 * @param {function} [options.factory] - component factory. default is [ComponentFactory]
 */
const Component = ({ name, factory }) => ({ kind, elements }) => {
  if (kind === 'class') {

    const getComponentFactory = factory
      ? () => factory
      : function () {
        return new ComponentFactory(this);
      };

    elements.push({
      kind: 'field',
      placement: 'static',
      key: $componentName,
      descriptor: {
        configurable: true,
      },
      initializer: () => name,
    }, {
      kind: 'field',
      placement: 'static',
      key: $componentFactory,
      descriptor: {
        configurable: true,
      },
      initializer: getComponentFactory,
    });

    return {
      kind,
      elements,
    };

  }
};

export { Component };

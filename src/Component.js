import ComponentFactory from './ComponentFactory';

/**
 * A component decorator.
 * 
 * @param {object} options
 * @param {string} options.name - component name
 * @param {function} [options.factory] - component factory. default is [ComponentFactory]
 */
const Component = ({ name, factory }) => (componentClass) => {
  componentClass.componentName = name;
  componentClass.componentFactory = new (factory || ComponentFactory)(componentClass);
  return componentClass;
};

export { Component };

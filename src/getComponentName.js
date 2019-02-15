
export default (component) => {
  switch (typeof component) {
    case 'string':
    case 'symbol':
      return component;
    case 'function':
    case 'object':
      if (component !== null) {
        return component.componentName;
      }
  }
  return undefined;
};

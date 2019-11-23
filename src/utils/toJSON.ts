
export const toJSON = (obj: Object) => {
  if (obj == null) {
    return obj;
  }
  const out = {};
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    // @ts-ignore
    const val = obj[key];
    switch (typeof val) {
      case 'number':
      case 'bigint':
      case 'string':
      case 'boolean':
      case 'object':
        // @ts-ignore
        out[key] = val;
    }
  });
  return out;
};


export const toJSON = (obj) => {
  if (obj == null) {
    return obj;
  }
  const out = {};
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    const val = obj[key];
    switch (typeof val) {
      case 'number':
      case 'bigint':
      case 'string':
      case 'boolean':
      case 'object':
        out[key] = val;
    }
  });
  return out;
};

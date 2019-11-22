
const randHex = (n: number) => Math.floor(Math.random() * n).toString(16);

const hexTime = () => new Date().getTime().toString(16);

const hexId = (() => {
  let id = 0;
  return () => {
    if (id >= Number.MAX_SAFE_INTEGER - 3) {
      id = 0;
    }
    id += Math.ceil(Math.random() * 3);
    return id.toString(16);
  };
})();

export const uuid = () => `${randHex(1<<20)}-${hexTime()}-${hexId()}`;

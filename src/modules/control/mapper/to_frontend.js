
const wrap = (be) => {
  return { ...be };
};

const toFrontEnd = (be) => {
  return wrap(be);
};

export default toFrontEnd;

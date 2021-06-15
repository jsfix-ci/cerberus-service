const findAndFormat = (obj, propName, fn) => {
  for (const key in obj) {
    if (key === propName) {
      obj[key] = fn(obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key]) {
      findAndFormat(obj[key], propName, fn);
    }
  }
};

export default findAndFormat;

const keyExists = (obj, key) => {
  if (!obj || (typeof obj !== 'object' && !Array.isArray(obj))) {
    return false;
  }
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return true;
    // The following line would return the object of what has changed rather than boolean
    // return { [key]: obj[key] };
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i += 1) {
      const result = keyExists(obj[i], key);
      if (result) {
        return result;
      }
    }
  } else {
    // eslint-disable-next-line guard-for-in
    for (const k in obj) {
      const result = keyExists(obj[k], key);
      if (result) {
        return result;
      }
    }
  }
  return false;
};

const hasChangedValues = (obj, keys) => {
  const result = [];
  keys.forEach((k) => result.push(keyExists(obj, k)));
  return result.some((v) => v);
};

// const yearlyReport = {
//   q1: {
//     jan: {
//       name: 'q1 Jan',
//     },
//     feb: {

//     },
//     mar: {

//     },
//   },
//   q2: {
//     jan: {
//       name: 'q2 Jan',
//     },
//     feb: {

//     },
//     mar: {

//     },
//   },
// };

// console.log(keyExists(yearlyReport, 'jan'));

export default hasChangedValues;

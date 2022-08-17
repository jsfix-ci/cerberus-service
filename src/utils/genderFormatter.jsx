const formatGender = (gender) => {
  if (gender === 'M') {
    return 'Male';
  }
  if (gender === 'F') {
    return 'Female';
  }
  return 'Unknown';
};

export default formatGender;

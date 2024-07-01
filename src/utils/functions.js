export const formatCurrency = (n, separate = ',') => {
  if (!n) {
    return '0.00';
  }
  let s = n.toString();
  let afterPoint = '';
  if (s.includes('.')) {
    const parts = s.split('.');
    s = parts[0];
    afterPoint = parts[1];
    if (afterPoint.length == 1) {
      afterPoint += '0';
    }
  }
  const regex = /\B(?=(\d{3})+(?!\d))/g;
  let ret = s.replace(regex, separate);
  if (afterPoint == '') {
    return ret + '.00';
  }

  return ret + '.' + afterPoint;
};

export const randomIntFrom = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const pad = (num, size) => {
  var s = '000000000' + num;
  return s.substr(s.length - size);
};

export const arrayRemove = (arr, value) => {
  return arr.filter(ele => ele != value);
};

export const formatNumber = (price, currency = 'PKR') => {
  try {
    var formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    });

    return formatter
      .format(parseFloat(price).toFixed(2))
      .toString()
      .replace(currency, '');
  } catch (error) {
    console.warn(error);
    return price;
  }
};

function createRef(array, keyField, valueField) {
  return array.reduce((ref, item) => {
    ref[item[keyField]] = item[valueField];
    return ref;
  }, {});
}

module.exports = { createRef };
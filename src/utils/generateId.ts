const generateId = (prefixId: string, index: string) => {
  while(index.length < 4) {
    index = '0' + index;
  }

  return prefixId.concat(index);
};

export default generateId;
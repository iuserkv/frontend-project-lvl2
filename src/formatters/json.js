// Возвращает дерево различий (diffTree) в
// формате json.
const getJSONFormatedDiff = (diffTree) => {
  const result = JSON.stringify(diffTree, null, 2);

  return result;
};

export default getJSONFormatedDiff;


const commaSeparatedValues = (csv) => {
  const tokens = csv.split(',').map(m => trimValue(m)).filter(f => f);
  return tokens;
}

const trimValue = (value) => value.trim();

module.exports = {
  commaSeparatedValues,
  trimValue
}

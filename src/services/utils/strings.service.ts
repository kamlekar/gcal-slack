export const commaSeparatedValues = (csv) => {
  const tokens = csv
    .split(',')
    .map((m) => trimValue(m))
    .filter((f) => f);
  return tokens;
};

export const trimValue = (value) => value.trim();

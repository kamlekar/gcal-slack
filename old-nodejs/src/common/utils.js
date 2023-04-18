const { unlink } = require('fs/promises');

const commaSeparatedValues = (csv) => {
  const tokens = csv.split(',').map(m => trimValue(m)).filter(f => f);
  return tokens;
}

const trimValue = (value) => value.trim();

const deleteFile = async function (path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
};

module.exports = {
  commaSeparatedValues,
  trimValue,
  deleteFile
}

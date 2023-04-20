import { unlink } from 'fs/promises';

export const deleteFile = async (path) => {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
};

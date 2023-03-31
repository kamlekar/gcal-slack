const { google } = require('googleapis');
const fs = require('fs');

const uploadFile = async (req, res, oauth2Client) => {
  // check if file was uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const inputFile = req.files.docFile;
  const service = google.drive({ version: 'v3', auth: oauth2Client });
  const requestBody = {
    name: 'photo.jpg',
    fields: 'id',
  };
  const media = {
    mimeType: inputFile.mimeType,
    body: fs.createReadStream(inputFile.tempFilePath),
  };
  try {
    const file = await service.files.create({
      requestBody,
      media: media,
    });
    console.log('File Id:', file.data.id);
    return file;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}

module.exports = {
  uploadFile
};


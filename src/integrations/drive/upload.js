const { google } = require('googleapis');
const fs = require('fs');

const uploadFile = async (req, res, oauth2Client) => {
  const service = google.drive({ version: 'v3', auth: oauth2Client });
  const requestBody = {
    name: 'photo.jpg',
    fields: 'id',
  };
  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream('files/photo.jpg'),
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


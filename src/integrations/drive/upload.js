const { google } = require('googleapis');
const fs = require('fs');
const moment = require('moment');

const uploadFile = async (req, res, oauth2Client) => {
  // check if file was uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const inputFile = req.files.docFile;
  const fileExtension = inputFile.name.match(/\.[^\.]+$/)[0];
  const { fileType, patientName, visitDate } = req.body;
  const visitedDate = moment(visitDate, 'YYYY-MM-DD');
  const visitedDay = visitedDate.format('D');
  const visitedMonth = visitedDate.format('YYYY-MM-MMM');
  const service = google.drive({ version: 'v3', auth: oauth2Client });
  try {
    const folderId = await getFolderId(`Health/${patientName}/monthwise/${visitedMonth}`, service);
    const requestBody = {
      name: `${visitedDay}-${fileType}${fileExtension}`,
      fields: ['id', 'name'],
      parents: [folderId]
    };
    const media = {
      mimeType: inputFile.mimeType,
      body: fs.createReadStream(inputFile.tempFilePath),
    };
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

const getFolderId = async (path, service) => {
  const nestedFolders = path.split("/");

  const lastFolderInfo = await nestedFolders.reduce(async (parentFolderInfo, folderName) => {
    const folderInfo = await parentFolderInfo;
    return await getFolderInfo(folderInfo, folderName, service);
  }, null)
  return lastFolderInfo.id;
}

const getFolderInfo = async (parentFolderInfo, folderName, service) => {

  try {
    const parentFolderId = parentFolderInfo?.id;

    // Search for the parent folder and the subfolder
    const folderResponse = parentFolderInfo ? await service.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and trashed=false and '${parentFolderId}' in parents and name='${folderName}'`,
      fields: 'files(id, name)',
      spaces: 'drive'
    }) : await service.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed = false and 'root' in parents`,
      fields: 'files(id, name)',
      spaces: 'drive'
    });

    // If the subfolder is found, use its ID as the parent folder ID
    // Otherwise, create the subfolder and use its ID as the parent folder ID
    let folderInfo;
    if (folderResponse.data.files.length > 0) {
      folderInfo = folderResponse.data.files[0];
    } else {
      const folderMetadata = parentFolderId ? {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId]
      } : {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };

      const folderResponse = await service.files.create({
        requestBody: folderMetadata,
        fields: ['id', 'name'],
      });

      folderInfo = folderResponse.data;
    }

    return folderInfo;
  } catch (ex) {
    console.log(ex);
  }

}

module.exports = {
  uploadFile
};


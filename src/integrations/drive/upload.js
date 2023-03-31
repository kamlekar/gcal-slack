const { google } = require('googleapis');
const fs = require('fs');
const moment = require('moment');
const { commaSeparatedValues } = require('../../common/utils');

const uploadFile = async (req, res, oauth2Client) => {
  // check if file was uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const inputFile = req.files.docFile;

  const service = google.drive({ version: 'v3', auth: oauth2Client });

  try {
    const file = await storeFileOnDrive(inputFile, req.body, service);
    const ailmentShortcuts = await storeAilmentsShortcutsOnDrive(file, req.body, service);
    const hospitalShortcut = await storeHospitalShortcutOnDrive(file, req.body, service);

    console.log('File Id:', file.id);
    return { file, ailmentShortcuts, hospitalShortcut };
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}

const storeFileOnDrive = async (inputFile, body, service) => {
  const { fileType, patientName, visitDate } = body;
  const fileExtension = inputFile.name.match(/\.[^\.]+$/)[0];
  const { day: visitedDay, month: visitedMonth } = quickDates(visitDate);
  const drivePath = `Health/${patientName}/monthwise/${visitedMonth}`;
  const folderId = await getFolderId(drivePath, service);
  const requestBody = {
    name: `${visitedDay}-${fileType}${fileExtension}`,
    fields: ['id', 'name', 'mimeType'],
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
  return file.data;
}

const storeAilmentsShortcutsOnDrive = async (file, body, service) => {
  const { patientName, visitDate, ailments } = body;
  const { month: visitedMonth } = quickDates(visitDate);
  const ailmentsTokens = commaSeparatedValues(ailments);
  try {
    const shortcuts = [];
    const lastShortcut = await ailmentsTokens.reduce(async (previousAilment, ailment) => {
      const previousShortcut = await previousAilment;
      shortcuts.push(previousShortcut);
      const drivePath = `Health/${patientName}/ailments/${ailment}/${visitedMonth}`;
      return createShortcut(file, drivePath, service);
    }, Promise.resolve());
    shortcuts.push(lastShortcut);
    return shortcuts;
  }
  catch (ex) {
    console.log(ex);
  }
};

const storeHospitalShortcutOnDrive = async (file, body, service) => {
  const { patientName, visitDate, hospital } = body;
  const { month: visitedMonth } = quickDates(visitDate);
  try {
    const drivePath = `Health/${patientName}/hospital/${hospital}/${visitedMonth}`;
    const hospitalShortcut = await createShortcut(file, drivePath, service);
    return hospitalShortcut;
  }
  catch (ex) {
    console.log(ex);
  }
};

const createShortcut = async (file, drivePath, service) => {
  const folderId = await getFolderId(drivePath, service);

  const shortcutResponse = await service.files.create({
    requestBody: {
      name: file.name,
      mimeType: 'application/vnd.google-apps.shortcut',
      shortcutDetails: {
        targetId: file.id,
        targetMimeType: file.mimeType,
      },
      parents: [folderId],
    },
    fields: ['id', 'name'],
    supportsAllDrives: true,
  });

  return shortcutResponse.data;
}

const getFolderId = async (path, service) => {
  const nestedFolders = path.split("/");

  const lastFolderInfo = await nestedFolders.reduce(async (parentFolderInfo, folderName) => {
    const folderInfo = await parentFolderInfo;
    const nestedFolderInfo = getFolderInfo(folderInfo, folderName, service);
    return nestedFolderInfo;
  }, Promise.resolve())
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

const quickDates = (date) => {
  const momentDate = moment(date, 'YYYY-MM-DD');
  const day = momentDate.format('D');
  const month = momentDate.format('YYYY-MM-MMM');
  return { momentDate, day, month };
}

module.exports = {
  uploadFile
};


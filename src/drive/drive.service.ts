import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Readable } from 'stream';

@Injectable()
export class DriveService {
  private drive;

  constructor() {
    this.drive = google.drive('v3');
  }

  async uploadFile(
    file: Express.Multer.File,
    patientName: string,
    hospital: string,
    ailments: string,
  ) {
    const folderId = await this.getOrCreateFolder(patientName);
    const fileStream = Readable.from(file.buffer);

    const fileMetadata = {
      name: `${patientName} - ${hospital} - ${ailments} - ${file.originalname}`,
      parents: [folderId],
    };

    const media = {
      mimeType: file.mimetype,
      body: fileStream,
    };

    try {
      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media,
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async createShortcut(file: { id: string; name: string; mimeType: string }) {
    const folderId = await this.getOrCreateFolder('Shortcuts');

    const shortcutMetadata = {
      name: `Shortcut to ${file.name}`,
      mimeType: 'application/vnd.google-apps.shortcut',
      parents: [folderId],
      shortcutDetails: {
        targetId: file.id,
      },
    };

    try {
      const response = await this.drive.files.create({
        requestBody: shortcutMetadata,
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to create shortcut: ${error.message}`);
    }
  }

  async getOrCreateFolder(folderName: string): Promise<string> {
    try {
      const response = await this.drive.files.list({
        q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder'`,
        fields: 'files(id, name)',
      });

      if (response.data.files && response.data.files.length > 0) {
        return response.data.files[0].id;
      }

      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };

      const createResponse = await this.drive.files.create({
        requestBody: folderMetadata,
      });

      return createResponse.data.id;
    } catch (error) {
      throw new Error(`Failed to get or create folder: ${error.message}`);
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { DriveService } from './drive.service';
import { google } from 'googleapis';
import { Readable } from 'stream';

jest.mock('googleapis');

describe('DriveService', () => {
  let service: DriveService;
  let mockDriveClient: any;

  beforeEach(async () => {
    // Mock the Google Drive client
    mockDriveClient = {
      files: {
        create: jest.fn(),
        get: jest.fn(),
        list: jest.fn(),
        update: jest.fn(),
      },
    };

    (google.drive as jest.Mock).mockReturnValue(mockDriveClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [DriveService],
    }).compile();

    service = module.get<DriveService>(DriveService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const mockFile = {
        buffer: Buffer.from('test file content'),
        originalname: 'test.txt',
        mimetype: 'text/plain',
      };

      const mockResponse = {
        data: {
          id: 'test-file-id',
          name: 'test.txt',
          mimeType: 'text/plain',
        },
      };

      mockDriveClient.files.create.mockResolvedValueOnce(mockResponse);

      const result = await service.uploadFile(
        mockFile,
        'Test Patient',
        'Test Hospital',
        'Test Ailment',
      );

      expect(result).toEqual({
        id: 'test-file-id',
        name: 'test.txt',
        mimeType: 'text/plain',
      });

      expect(mockDriveClient.files.create).toHaveBeenCalledWith({
        requestBody: expect.objectContaining({
          name: expect.stringContaining('test.txt'),
          parents: expect.any(Array),
        }),
        media: expect.any(Object),
      });
    });

    it('should throw an error if file upload fails', async () => {
      const mockFile = {
        buffer: Buffer.from('test file content'),
        originalname: 'test.txt',
        mimetype: 'text/plain',
      };

      mockDriveClient.files.create.mockRejectedValueOnce(
        new Error('Upload failed'),
      );

      await expect(
        service.uploadFile(
          mockFile,
          'Test Patient',
          'Test Hospital',
          'Test Ailment',
        ),
      ).rejects.toThrow('Upload failed');
    });
  });

  describe('createShortcut', () => {
    it('should create a shortcut successfully', async () => {
      const mockResponse = {
        data: {
          id: 'shortcut-id',
          name: 'Shortcut to test.txt',
          mimeType: 'application/vnd.google-apps.shortcut',
        },
      };

      mockDriveClient.files.create.mockResolvedValueOnce(mockResponse);

      const result = await service.createShortcut({
        id: 'original-file-id',
        name: 'test.txt',
        mimeType: 'text/plain',
      });

      expect(result).toEqual({
        id: 'shortcut-id',
        name: 'Shortcut to test.txt',
        mimeType: 'application/vnd.google-apps.shortcut',
      });

      expect(mockDriveClient.files.create).toHaveBeenCalledWith({
        requestBody: expect.objectContaining({
          name: 'Shortcut to test.txt',
          mimeType: 'application/vnd.google-apps.shortcut',
          parents: expect.any(Array),
        }),
      });
    });
  });

  describe('getOrCreateFolder', () => {
    it('should return existing folder if found', async () => {
      const mockResponse = {
        data: {
          files: [
            {
              id: 'existing-folder-id',
              name: 'Test Patient',
              mimeType: 'application/vnd.google-apps.folder',
            },
          ],
        },
      };

      mockDriveClient.files.list.mockResolvedValueOnce(mockResponse);

      const result = await service.getOrCreateFolder('Test Patient');

      expect(result).toBe('existing-folder-id');
      expect(mockDriveClient.files.create).not.toHaveBeenCalled();
    });

    it('should create new folder if not found', async () => {
      const mockListResponse = {
        data: {
          files: [],
        },
      };

      const mockCreateResponse = {
        data: {
          id: 'new-folder-id',
          name: 'Test Patient',
          mimeType: 'application/vnd.google-apps.folder',
        },
      };

      mockDriveClient.files.list.mockResolvedValueOnce(mockListResponse);
      mockDriveClient.files.create.mockResolvedValueOnce(mockCreateResponse);

      const result = await service.getOrCreateFolder('Test Patient');

      expect(result).toBe('new-folder-id');
      expect(mockDriveClient.files.create).toHaveBeenCalledWith({
        requestBody: expect.objectContaining({
          name: 'Test Patient',
          mimeType: 'application/vnd.google-apps.folder',
          parents: expect.any(Array),
        }),
      });
    });
  });
});

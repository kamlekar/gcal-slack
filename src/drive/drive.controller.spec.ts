import { Test, TestingModule } from '@nestjs/testing';
import { DriveController } from './drive.controller';
import { DriveService } from './drive.service';

describe('DriveController', () => {
  let controller: DriveController;
  let service: DriveService;

  const mockDriveService = {
    uploadFile: jest.fn(),
    createShortcut: jest.fn(),
    getOrCreateFolder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriveController],
      providers: [
        {
          provide: DriveService,
          useValue: mockDriveService,
        },
      ],
    }).compile();

    controller = module.get<DriveController>(DriveController);
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

      const mockUploadResult = {
        id: 'test-file-id',
        name: 'test.txt',
        mimeType: 'text/plain',
      };

      mockDriveService.uploadFile.mockResolvedValueOnce(mockUploadResult);

      const result = await controller.uploadFile(
        mockFile,
        'Test Patient',
        'Test Hospital',
        'Test Ailment',
      );

      expect(result).toEqual(mockUploadResult);
      expect(mockDriveService.uploadFile).toHaveBeenCalledWith(
        mockFile,
        'Test Patient',
        'Test Hospital',
        'Test Ailment',
      );
    });

    it('should handle upload errors', async () => {
      const mockFile = {
        buffer: Buffer.from('test file content'),
        originalname: 'test.txt',
        mimetype: 'text/plain',
      };

      mockDriveService.uploadFile.mockRejectedValueOnce(
        new Error('Upload failed'),
      );

      await expect(
        controller.uploadFile(
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
      const mockFile = {
        id: 'test-file-id',
        name: 'test.txt',
        mimeType: 'text/plain',
      };

      const mockShortcutResult = {
        id: 'shortcut-id',
        name: 'Shortcut to test.txt',
        mimeType: 'application/vnd.google-apps.shortcut',
      };

      mockDriveService.createShortcut.mockResolvedValueOnce(mockShortcutResult);

      const result = await controller.createShortcut(mockFile);

      expect(result).toEqual(mockShortcutResult);
      expect(mockDriveService.createShortcut).toHaveBeenCalledWith(mockFile);
    });

    it('should handle shortcut creation errors', async () => {
      const mockFile = {
        id: 'test-file-id',
        name: 'test.txt',
        mimeType: 'text/plain',
      };

      mockDriveService.createShortcut.mockRejectedValueOnce(
        new Error('Shortcut creation failed'),
      );

      await expect(controller.createShortcut(mockFile)).rejects.toThrow(
        'Shortcut creation failed',
      );
    });
  });

  describe('getOrCreateFolder', () => {
    it('should get or create a folder successfully', async () => {
      const folderName = 'Test Patient';
      const mockFolderId = 'folder-id';

      mockDriveService.getOrCreateFolder.mockResolvedValueOnce(mockFolderId);

      const result = await controller.getOrCreateFolder(folderName);

      expect(result).toBe(mockFolderId);
      expect(mockDriveService.getOrCreateFolder).toHaveBeenCalledWith(
        folderName,
      );
    });

    it('should handle folder creation errors', async () => {
      const folderName = 'Test Patient';

      mockDriveService.getOrCreateFolder.mockRejectedValueOnce(
        new Error('Folder creation failed'),
      );

      await expect(controller.getOrCreateFolder(folderName)).rejects.toThrow(
        'Folder creation failed',
      );
    });
  });
});

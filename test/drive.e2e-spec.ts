import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DriveModule } from '../src/drive/drive.module';
import { DriveService } from '../src/drive/drive.service';

describe('DriveController (e2e)', () => {
  let app: INestApplication;
  let driveService: DriveService;

  const mockDriveService = {
    uploadFile: jest.fn(),
    createShortcut: jest.fn(),
    getOrCreateFolder: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DriveModule],
    })
      .overrideProvider(DriveService)
      .useValue(mockDriveService)
      .compile();

    app = moduleFixture.createNestApplication();
    driveService = moduleFixture.get<DriveService>(DriveService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('/drive/upload (POST)', () => {
    it('should upload a file successfully', () => {
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

      return request(app.getHttpServer())
        .post('/drive/upload')
        .field('patientName', 'Test Patient')
        .field('hospital', 'Test Hospital')
        .field('ailments', 'Test Ailment')
        .attach('file', mockFile.buffer, {
          filename: mockFile.originalname,
          contentType: mockFile.mimetype,
        })
        .expect(201)
        .expect(mockUploadResult);
    });

    it('should handle upload errors', () => {
      const mockFile = {
        buffer: Buffer.from('test file content'),
        originalname: 'test.txt',
        mimetype: 'text/plain',
      };

      mockDriveService.uploadFile.mockRejectedValueOnce(
        new Error('Upload failed'),
      );

      return request(app.getHttpServer())
        .post('/drive/upload')
        .field('patientName', 'Test Patient')
        .field('hospital', 'Test Hospital')
        .field('ailments', 'Test Ailment')
        .attach('file', mockFile.buffer, {
          filename: mockFile.originalname,
          contentType: mockFile.mimetype,
        })
        .expect(500)
        .expect({ message: 'Upload failed' });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/drive/upload')
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('patientName');
          expect(res.body.message).toContain('hospital');
          expect(res.body.message).toContain('ailments');
        });
    });
  });

  describe('/drive/shortcut (POST)', () => {
    it('should create a shortcut successfully', () => {
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

      return request(app.getHttpServer())
        .post('/drive/shortcut')
        .send(mockFile)
        .expect(201)
        .expect(mockShortcutResult);
    });

    it('should handle shortcut creation errors', () => {
      const mockFile = {
        id: 'test-file-id',
        name: 'test.txt',
        mimeType: 'text/plain',
      };

      mockDriveService.createShortcut.mockRejectedValueOnce(
        new Error('Shortcut creation failed'),
      );

      return request(app.getHttpServer())
        .post('/drive/shortcut')
        .send(mockFile)
        .expect(500)
        .expect({ message: 'Shortcut creation failed' });
    });

    it('should validate required file properties', () => {
      return request(app.getHttpServer())
        .post('/drive/shortcut')
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('id');
          expect(res.body.message).toContain('name');
          expect(res.body.message).toContain('mimeType');
        });
    });
  });
});

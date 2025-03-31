/* eslint-disable @typescript-eslint/no-var-requires */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { GoogleAuthService } from '../src/modules/authentication/services/googleAuth.service';
import * as nunjucks from 'nunjucks';
import * as path from 'path';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let googleAuthService: GoogleAuthService;

  const mockGoogleAuthService = {
    authCheck: jest.fn().mockRejectedValue(new Error('Not authenticated')),
    generateAuthUrl: jest.fn().mockReturnValue('http://mock-auth-url'),
    getAuthClient: jest.fn().mockResolvedValue({}),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GoogleAuthService)
      .useValue(mockGoogleAuthService)
      .compile();

    app = moduleFixture.createNestApplication();

    // Set up Nunjucks
    const express = app.getHttpAdapter().getInstance();
    const viewsPath = path.join(__dirname, '..', 'views');
    nunjucks.configure(viewsPath, {
      autoescape: true,
      express,
    });
    express.set('view engine', 'njk');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain('http://mock-auth-url');
      });
  });
});

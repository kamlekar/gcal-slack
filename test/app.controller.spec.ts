import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { Request, Response } from 'express-serve-static-core';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  const mockAppService = {
    getHello: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboard', () => {
    it('should return dashboard data', async () => {
      const mockData = { title: 'Dashboard', message: 'Welcome' };
      mockAppService.getHello.mockResolvedValue(mockData);

      const mockReq = {
        headers: {},
        method: 'GET',
        url: '/',
        params: {},
        query: {},
        body: {},
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
        acceptsEncodings: jest.fn(),
        acceptsLanguages: jest.fn(),
        param: jest.fn(),
        is: jest.fn(),
        protocol: 'http',
        secure: false,
        ip: '127.0.0.1',
        ips: [],
        subdomains: [],
        path: '/',
        hostname: 'localhost',
        host: 'localhost:3000',
        fresh: false,
        stale: true,
        xhr: false,
        cookies: {},
        signedCookies: {},
        secret: undefined,
        app: {},
      } as unknown as Request;

      const mockRes = {
        render: jest.fn(),
      } as unknown as Response;

      const result = await controller.getDashboard(mockReq, mockRes);
      expect(result).toBeDefined();
      expect(mockAppService.getHello).toHaveBeenCalled();
    });
  });
});
